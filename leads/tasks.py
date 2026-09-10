import logging
from datetime import timedelta

from celery import shared_task
from django.conf import settings
from django.db import IntegrityError, transaction
from django.db.models import Q
from django.utils import timezone


import json


from .models import Business, OutreachQueue, WebsitePreview
from .services.html_check_service import quick_check
from .services.preview_service import build_preview
from .services.outscraper_service import search
from .services.pagespeed_service import score as pagespeed_score
from .services.scoring_service import calculate_outdated_score
from .services.instantly_service import add_lead_to_campaign

logger = logging.getLogger(__name__)

# Outscraper search term per Business.category value.
CATEGORY_QUERIES = {
    "plumbing": "plumbers",
    "electricians": "electricians",
    "roofing": "roofing contractors",
    "locksmiths": "locksmiths",
    "cleaners": "cleaning services",
    "removal_companies": "removal companies",
}

LOCATIONS = [
    "Luton", "Bedford", "Watford", "St Albans", "Dunstable",
    "Milton Keynes", "London", "Hemel Hempstead", "Aylesbury",
    "Northampton", "Stevenage", "Hitchin", "Welwyn Garden City",
    "Leighton Buzzard", "Biggleswade", "Flitwick", "Ampthill",
]


def _upsert(payload: dict) -> str:
    """Insert or update one business. Returns 'created', 'updated' or 'skipped'."""
    google_id = payload.get("google_id")

    try:
        with transaction.atomic():
            if google_id:
                obj, created = Business.objects.update_or_create(
                    google_id=google_id,
                    defaults=payload,
                )
            else:
                obj, created = Business.objects.update_or_create(
                    name=payload["name"],
                    phone=payload.get("phone"),
                    location=payload["location"],
                    defaults=payload,
                )
    except IntegrityError as exc:
        logger.warning("Skipped %r — integrity error: %s", payload.get("name"), exc)
        return "skipped"

    return "created" if created else "updated"


@shared_task(name="leads.scrape_all_businesses")
def scrape_all_businesses() -> dict:
    """Scrape every (category, location) combo via Outscraper and upsert results.

    Scheduled monthly by Celery Beat. Safe to run manually as well.
    """
    limit = getattr(settings, "OUTSCRAPER_LIMIT_PER_QUERY", 100)
    totals = {"created": 0, "updated": 0, "skipped": 0, "queries": 0, "errors": 0}

    for category, query in CATEGORY_QUERIES.items():
        for location in LOCATIONS:
            totals["queries"] += 1
            try:
                rows = list(search(query, location, category=category, limit=limit))
            except Exception:
                logger.exception("Outscraper query failed: %s / %s", category, location)
                totals["errors"] += 1
                continue

            per_query = {"created": 0, "updated": 0, "skipped": 0}
            for row in rows:
                result = _upsert(row)
                per_query[result] += 1
                totals[result] += 1

            logger.info(
                "Scraped %s / %s — %d results (created=%d, updated=%d, skipped=%d)",
                category, location, len(rows),
                per_query["created"], per_query["updated"], per_query["skipped"],
            )

    logger.info("scrape_all_businesses finished: %s", totals)
    return totals


@shared_task(name="leads.test_single_scrape_task")
def test_single_scrape_task() -> str:
    """Debug task: Scrape 1 result and log the RAW JSON response."""

    category = "plumbing"
    query = CATEGORY_QUERIES[category]
    location = LOCATIONS[0]
    
    search_term = f"{query} in {location}, UK"
    logger.info("DEBUG: Starting test scrape for %r", search_term)
    
    try:
        # Use our search function which includes normalization and custom email scraping
        results = list(search(query, location, category=category, limit=1))
        
        if not results:
            logger.warning("DEBUG: No results returned from search.")
            return "No results"

        # Log the first normalized result (this is what goes into the DB)
        normalized_data = results[0]
        logger.info("DEBUG: NORMALIZED DATA (READY FOR DB):\n%s", json.dumps(normalized_data, indent=2))
        
        if normalized_data.get("email"):
            logger.info("DEBUG: SUCCESS! Found email: %s", normalized_data["email"])
        else:
            logger.warning("DEBUG: No email found for %s", normalized_data["name"])

        return "Success - check logs"
    except Exception as e:
        logger.error("DEBUG: Test scrape failed: %s", e)
        return f"Failed: {e}"


# ---------------------------------------------------------------------------
# Daily website audit pipeline
# ---------------------------------------------------------------------------


def _select_audit_candidates(batch_size: int, refresh_days: int):
    """Never-audited first, then audits older than refresh_days."""
    stale_cutoff = timezone.now() - timedelta(days=refresh_days)
    return (
        Business.objects
        .filter(has_website=True, website__isnull=False)
        .exclude(website="")
        .filter(Q(last_audited_at__isnull=True) | Q(last_audited_at__lt=stale_cutoff))
        .order_by("last_audited_at")  # NULLs first on PostgreSQL ASC
        [:batch_size]
    )


def _enqueue_outreach(business: Business, reason: str) -> bool:
    """Queue a business for email outreach, idempotent on active entries."""
    if not business.email:
        return False
    try:
        with transaction.atomic():
            OutreachQueue.objects.create(
                business=business,
                status=OutreachQueue.STATUS_QUEUED,
                reason=reason,
                scheduled_at=timezone.now(),
            )
    except IntegrityError:
        # Already has an active (queued/sending) entry for this business.
        return False
    return True


@shared_task(name="leads.audit_website_batch")
def audit_website_batch() -> dict:
    """Score one daily batch of business websites via PageSpeed Insights.

    Pipeline per business:
        1. Quick HTML check (free, fast).
        2. If bad → mark html_failed, continue.
        3. PageSpeed mobile + desktop → save scores.
        4. If mobile performance < threshold → enqueue for outreach.
    """
    batch_size = getattr(settings, "AUDIT_BATCH_SIZE", 50)
    threshold = getattr(settings, "AUDIT_OUTDATED_THRESHOLD", 50)
    refresh_days = getattr(settings, "AUDIT_REFRESH_DAYS", 30)

    candidates = list(_select_audit_candidates(batch_size, refresh_days))
    stats = {
        "examined": len(candidates),
        "html_failed": 0,
        "scored": 0,
        "errors": 0,
        "queued": 0,
    }

    for business in candidates:
        try:
            _audit_one(business, threshold, stats)
        except Exception:
            logger.exception("Audit crashed for business %s", business.pk)
            business.audit_status = Business.AUDIT_ERROR
            business.last_audited_at = timezone.now()
            business.save(update_fields=["audit_status", "last_audited_at", "updated_at"])
            stats["errors"] += 1

    logger.info("audit_website_batch finished: %s", stats)
    return stats


@shared_task(name="leads.audit_single_business")
def audit_single_business(business_id: int) -> dict:
    """Audit a single business by ID (HTML check + PageSpeed)."""
    threshold = getattr(settings, "AUDIT_OUTDATED_THRESHOLD", 50)
    stats = {"html_failed": 0, "scored": 0, "errors": 0, "queued": 0}

    try:
        business = Business.objects.get(pk=business_id)
        if not business.website:
            return {"error": "Business has no website"}
        
        _audit_one(business, threshold, stats)
    except Business.DoesNotExist:
        return {"error": f"Business {business_id} not found"}
    except Exception as e:
        logger.exception("Manual audit failed for business %s", business_id)
        return {"error": str(e)}

    return stats


def _audit_one(business: Business, threshold: int, stats: dict) -> None:
    now = timezone.now()
    url = business.website

    # 1 + 2. Quick HTML check + filter
    html = quick_check(url)
    business.html_check_passed = html.ok
    business.html_status_code = html.status_code
    if not html.ok:
        business.audit_status = Business.AUDIT_HTML_FAILED
        business.audit_notes = html.reason
        business.is_outdated = False
        business.last_audited_at = now
        business.save()
        stats["html_failed"] += 1
        logger.info("HTML check failed for %s: %s", url, html.reason)
        return

    # 3. PageSpeed mobile + desktop
    mobile = pagespeed_score(url, strategy="mobile")
    desktop = pagespeed_score(url, strategy="desktop")

    business.pagespeed_mobile_performance = mobile.performance
    business.pagespeed_mobile_accessibility = mobile.accessibility
    business.pagespeed_mobile_seo = mobile.seo
    business.pagespeed_mobile_best_practices = mobile.best_practices

    business.pagespeed_desktop_performance = desktop.performance
    business.pagespeed_desktop_accessibility = desktop.accessibility
    business.pagespeed_desktop_seo = desktop.seo
    business.pagespeed_desktop_best_practices = desktop.best_practices

    if not mobile.ok and not desktop.ok:
        business.audit_status = Business.AUDIT_ERROR
        business.audit_notes = f"mobile: {mobile.error} | desktop: {desktop.error}"
        business.last_audited_at = now
        business.save()
        stats["errors"] += 1
        return

    # 4. Comprehensive Scoring
    score, priority = calculate_outdated_score(
        url=url, 
        html=html.html or "", 
        mobile_pagespeed=mobile.performance
    )

    business.outdated_score = score
    business.outdated_priority = priority
    business.is_outdated = priority in ("high", "medium")
    business.audit_status = Business.AUDIT_SCORED
    business.audit_notes = ""
    business.last_audited_at = now
    business.save()
    stats["scored"] += 1

    # 5. Outdated → generate a personalised preview, then queue outreach.
    if business.is_outdated:
        # Build the preview first so the outreach email can link to it.
        generate_preview_for_business.delay(business.pk)
        reason = f"score {score} ({priority} priority)"
        if _enqueue_outreach(business, reason):
            stats["queued"] += 1
            logger.info("Queued outreach for %s — %s", business.name, reason)


@shared_task(name="leads.process_outreach_queue")
def process_outreach_queue() -> dict:
    """Send queued outreach emails via Instantly API — gated and rate-limited.

    Two safety controls:
      * OUTREACH_ENABLED master switch (default False). While off, this task is
        a no-op no matter how it's triggered (schedule or admin) — so nothing is
        ever sent until you deliberately turn it on.
      * OUTREACH_DAILY_LIMIT (default 50). Caps total sends per UTC day, counting
        anything already sent today, so re-runs can't exceed the daily quota.
    """
    if not getattr(settings, "OUTREACH_ENABLED", False):
        logger.info("Outreach is OFF (OUTREACH_ENABLED=False) — not sending.")
        return {"sent": 0, "failed": 0, "skipped": 0, "disabled": True}

    daily_limit = getattr(settings, "OUTREACH_DAILY_LIMIT", 50)
    day_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    sent_today = OutreachQueue.objects.filter(
        status=OutreachQueue.STATUS_SENT, sent_at__gte=day_start
    ).count()
    remaining = max(0, daily_limit - sent_today)
    if remaining == 0:
        logger.info("Daily outreach limit reached (%d) — nothing more today.", daily_limit)
        return {"sent": 0, "failed": 0, "skipped": 0, "daily_limit_reached": True}

    batch_size = min(remaining, getattr(settings, "OUTREACH_BATCH_SIZE", daily_limit))
    queue = OutreachQueue.objects.filter(
        status=OutreachQueue.STATUS_QUEUED,
        scheduled_at__lte=timezone.now()
    ).select_related("business")[:batch_size]

    stats = {"sent": 0, "failed": 0, "skipped": 0, "daily_limit": daily_limit, "sent_today": sent_today}

    for entry in queue:
        business = entry.business
        if not business.email:
            entry.status = OutreachQueue.STATUS_SKIPPED
            entry.reason = "No email address"
            entry.save()
            stats["skipped"] += 1
            continue

        entry.status = OutreachQueue.STATUS_SENDING
        entry.save()

        success = add_lead_to_campaign(business)
        if success:
            entry.status = OutreachQueue.STATUS_SENT
            entry.sent_at = timezone.now()
            entry.save()
            stats["sent"] += 1
        else:
            entry.status = OutreachQueue.STATUS_FAILED
            entry.attempts += 1
            entry.last_error = "Instantly API error"
            entry.save()
            stats["failed"] += 1

    return stats


# ---------------------------------------------------------------------------
# Website preview generation (Stage 2)
# ---------------------------------------------------------------------------


@shared_task(name="leads.generate_preview_for_business")
def generate_preview_for_business(business_id: int) -> dict:
    """Build (or refresh) the personalised preview site for one business.

    Triggered automatically when a website is marked ``is_outdated``; also
    runnable on demand from the admin.
    """
    try:
        business = Business.objects.get(pk=business_id)
    except Business.DoesNotExist:
        return {"error": f"Business {business_id} not found"}

    try:
        preview = build_preview(business)
    except Exception as exc:  # noqa: BLE001
        logger.exception("Preview generation failed for business %s", business_id)
        return {"error": str(exc)}

    return {
        "preview_id": preview.pk,
        "slug": preview.slug,
        "color_primary": preview.color_primary,
        "color_source": preview.color_source,
        "expires_at": preview.expires_at.isoformat(),
    }


@shared_task(name="leads.generate_missing_previews")
def generate_missing_previews(limit: int | None = None) -> dict:
    """Backfill previews for outdated businesses that don't have one yet.

    New audits already trigger a preview when a site is marked outdated; this
    catches businesses that became outdated before previews existed (or whose
    preview expired and was cleaned up), so a site is ready before outreach.
    """
    limit = limit or getattr(settings, "PREVIEW_BACKFILL_BATCH", 100)
    candidates = list(
        Business.objects.filter(is_outdated=True, previews__isnull=True)[:limit]
    )
    for business in candidates:
        generate_preview_for_business.delay(business.pk)

    logger.info("generate_missing_previews queued %d previews", len(candidates))
    return {"queued": len(candidates)}


@shared_task(name="leads.expire_old_previews")
def expire_old_previews() -> dict:
    """Delete unclaimed previews past their 30-day expiry to manage storage."""
    now = timezone.now()
    stale = WebsitePreview.objects.filter(is_claimed=False, expires_at__lt=now)
    count = stale.count()
    stale.delete()
    logger.info("expire_old_previews removed %d expired previews", count)
    return {"deleted": count}
