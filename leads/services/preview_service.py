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
from .color_service import extract_brand_colors, fetch_site_html, palette
from .site_facts_service import SiteFacts, extract_site_facts

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


def _asset_base() -> str:
    """URL prefix the baked HTML loads its images from (always ends in '/').

    The HTML is rendered once and served from another host, so image URLs can
    never be relative to the page path — see PREVIEW_ASSET_BASE_URL.
    """
    base = getattr(settings, "PREVIEW_ASSET_BASE_URL", "") or settings.STATIC_URL or "/static/"
    return base if base.endswith("/") else base + "/"


def _photos(template: str, services: list[dict], asset_base: str) -> dict:
    """Resolve the template's photo set to URLs.

    Returns ``{"hero": url|"", "gallery": [url, ...]}`` and also hangs each work
    shot off its matching service as ``s.photo``, so a template can show
    photography in its service cards, in a gallery band, or both. The shots are
    generic trade stock, so nothing captions them with a specific service —
    they're only ever pinned to a service where any shot of the trade fits.
    Everything degrades to empty for a trade we have no photography for, and
    every template guards on it.
    """
    hero, work = preview_content.TRADE_PHOTOS.get(template, ("", ()))
    prefix = f"{asset_base}previews/{template}/"
    gallery = [f"{prefix}{shot}" for shot in work]
    for url, svc in zip(gallery, services):
        svc["photo"] = url
    return {"hero": f"{prefix}{hero}" if hero else "", "gallery": gallery}


def _coverage_pills(town: str) -> list[str]:
    """A truthful, non-fabricated coverage list for the areas band.

    We deliberately avoid inventing specific neighbouring place names (which
    could be wrong); instead we anchor everything on the real town.
    """
    town = (town or "").strip()
    if not town:
        return ["Your local area", "Surrounding areas", "Nearby towns"]
    return [
        town,
        f"{town} centre",
        f"Greater {town}",
        f"{town} & surrounding areas",
    ]


def _build_context(
    business: Business,
    colors,
    slug: str,
    facts: SiteFacts | None = None,
    asset_base: str | None = None,
) -> dict:
    town = (business.location or "").strip()
    trade = preview_content.trade_noun(business.category)
    area = preview_content.service_area(town)
    content = preview_content.content_for(business.category)
    facts = facts or SiteFacts()

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
        # real contact details (from Google / scraped site)
        "address": (getattr(business, "address", "") or "").strip(),
        "email": (getattr(business, "email", "") or facts.email or "").strip(),
        # personalised facts scraped from the prospect's real site
        # (each degrades gracefully to generic copy in the template)
        "established_year": facts.established_year,
        "years_in_business": facts.years_in_business,
        "accreditations": facts.accreditations,
        "areas": _coverage_pills(town),
        # trade photography (hero shot + captioned work gallery)
        "photos": _photos(content["template"], services, asset_base or _asset_base()),
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

    # Fetch the prospect's real site once, then mine it for both the brand
    # palette and the personalised facts we weave into the preview.
    site_html = fetch_site_html(business.website)
    colors = extract_brand_colors(business.website, fallback, html=site_html)
    facts = extract_site_facts(site_html)

    # Resolve the slug first so the baked CTA can point back at this preview.
    existing = business.previews.order_by("-created_at").first()
    slug = existing.slug if existing else _unique_slug(business)

    context = _build_context(business, colors, slug, facts=facts)
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
