"""Generate a personalised website preview for a prospect.

Pipeline (run off the request path, in a Celery task):
    1. Resolve the trade template + copy from the Business category.
    2. Derive the spec variables (business_name, phone_number, town, trade,
       service_area).
    3. Extract brand colours from the prospect's real website.
    4. Render the trade template to a static HTML string (baked once).
    5. Create/update the WebsitePreview row with a unique slug + 30-day expiry.

The rendered HTML is stored on the row so serving is a single indexed lookup.
"""

import logging

from django.conf import settings
from django.template.loader import render_to_string
from django.utils.text import slugify

from ..models import Business, WebsitePreview
from .. import preview_content
from .color_service import extract_brand_colors, palette

logger = logging.getLogger(__name__)


def _unique_slug(business: Business) -> str:
    """Build a stable, human slug: ``abc-plumbing-luton`` (deduped if taken)."""
    base = slugify(f"{business.name}-{business.location}") or f"preview-{business.pk}"
    base = base[:200]
    slug = base
    n = 2
    qs = WebsitePreview.objects.exclude(business=business)
    while qs.filter(slug=slug).exists():
        slug = f"{base}-{n}"
        n += 1
    return slug


def _cta_url(slug: str) -> str:
    """'Get This Website' target — the purchase page, tagged with the preview."""
    base = getattr(settings, "PREVIEW_PURCHASE_URL", None) or (
        settings.FRONTEND_URL.rstrip("/") + "/get-started"
    )
    sep = "&" if "?" in base else "?"
    return f"{base}{sep}ref={slug}"


def _build_context(business: Business, colors, slug: str) -> dict:
    town = (business.location or "").strip()
    trade = preview_content.trade_noun(business.category)
    area = preview_content.service_area(town)
    content = preview_content.content_for(business.category)

    def fill(text: str) -> str:
        return text.format(
            business_name=business.name,
            town=town or "your area",
            trade=trade,
            service_area=area,
        )

    services = [
        {"icon": icon, "title": fill(title), "desc": fill(desc)}
        for icon, title, desc in content["services"]
    ]
    faqs = [{"q": fill(q), "a": fill(a)} for q, a in content["faqs"]]
    usps = [fill(u) for u in content["usps"]]

    pal = palette(colors.primary, colors.accent)
    ctx = {
        # spec variables
        "business_name": business.name,
        "phone_number": business.phone or "",
        "town": town or "your area",
        "trade": trade,
        "service_area": area,
        # trade copy
        "tagline": fill(content["tagline"]),
        "hero_headline": fill(content["hero_headline"]),
        "hero_sub": fill(content["hero_sub"]),
        "emergency_line": fill(content["emergency_line"]),
        "services": services,
        "usps": usps,
        "faqs": faqs,
        # social proof
        "rating": business.rating or 4.9,
        "review_count": business.reviews or 0,
        # branding (full tint scale)
        "color_primary": colors.primary,
        "color_accent": colors.accent,
        # meta
        "cta_url": _cta_url(slug),
        "year": 2026,
    }
    ctx.update(pal)
    return ctx


def build_preview(business: Business) -> WebsitePreview:
    """Create or refresh the WebsitePreview for a business. Idempotent."""
    content = preview_content.content_for(business.category)
    fallback = preview_content.default_palette(business.category)
    colors = extract_brand_colors(business.website, fallback)

    # Resolve the slug first so the baked CTA can point back at this preview.
    existing = business.previews.order_by("-created_at").first()
    slug = existing.slug if existing else _unique_slug(business)

    context = _build_context(business, colors, slug)
    template_name = f"previews/{content['template']}.html"
    rendered = render_to_string(template_name, context)

    town = (business.location or "").strip()
    defaults = {
        "slug": slug,
        "template_key": content["template"],
        "business_name": business.name,
        "phone_number": business.phone or "",
        "town": town,
        "trade": context["trade"],
        "service_area": context["service_area"],
        "color_primary": colors.primary,
        "color_accent": colors.accent,
        "color_source": colors.source,
        "rendered_html": rendered,
    }

    if existing is None:
        preview = WebsitePreview.objects.create(business=business, **defaults)
        logger.info("Created preview %s for %s", preview.slug, business.name)
    else:
        for k, v in defaults.items():
            setattr(existing, k, v)
        existing.renew(30)  # refreshing resets the 30-day clock
        existing.save()
        preview = existing
        logger.info("Refreshed preview %s for %s", preview.slug, business.name)

    return preview
