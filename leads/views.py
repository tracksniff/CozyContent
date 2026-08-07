"""Public-facing views for hosted website previews.

Served from ``preview.cosycontent.com/<slug>``. Each preview's HTML is baked at
generation time, so a request is a single indexed lookup + return — fast by
design. An ``X-Robots-Tag: noindex`` header is added on top of the in-page
meta tag so the page is never indexed by search engines (spec).
"""

from django.db.models import F
from django.http import HttpResponse, HttpResponseGone, HttpResponseNotFound
from django.views.decorators.http import require_GET

from .models import WebsitePreview

_EXPIRED_HTML = """<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="robots" content="noindex,nofollow">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Preview expired</title>
<style>body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;display:grid;
place-items:center;min-height:100vh;margin:0;background:#f8fafc;color:#0f172a;text-align:center;padding:24px}
a{color:#0b6bcb}</style></head><body><div><h1>This preview has expired</h1>
<p>This demo website is no longer available.</p>
<p><a href="https://cosycontent.com">Visit Cosy Content →</a></p></div></body></html>"""


@require_GET
def preview_detail(request, slug):
    try:
        preview = WebsitePreview.objects.get(slug=slug)
    except WebsitePreview.DoesNotExist:
        resp = HttpResponseNotFound(_EXPIRED_HTML)
        resp["X-Robots-Tag"] = "noindex, nofollow"
        return resp

    if preview.is_expired:
        resp = HttpResponseGone(_EXPIRED_HTML)
        resp["X-Robots-Tag"] = "noindex, nofollow"
        return resp

    # Count the view without racing (atomic F() update, skips auto_now).
    WebsitePreview.objects.filter(pk=preview.pk).update(view_count=F("view_count") + 1)

    resp = HttpResponse(preview.rendered_html)
    resp["X-Robots-Tag"] = "noindex, nofollow, noarchive"
    resp["Cache-Control"] = "public, max-age=300"
    return resp


@require_GET
def preview_samples_index(request):
    from django.conf import settings
    if not settings.DEBUG:
        return HttpResponseNotFound()
        
    from .preview_content import TRADE_CONTENT
    links = [f'<li><a href="{cat}/">{cat}</a></li>' for cat in TRADE_CONTENT]
    html = f"<h1>Preview samples</h1><ul>{''.join(links)}</ul>"
    return HttpResponse(html)


@require_GET
def preview_sample(request, category):
    from django.conf import settings
    if not settings.DEBUG:
        return HttpResponseNotFound()
        
    from types import SimpleNamespace
    from django.template.loader import render_to_string
    from . import preview_content
    from .services.preview_service import _build_context
    
    if category not in preview_content.TRADE_CONTENT:
        return HttpResponseNotFound("Category not found")
        
    primary, accent = preview_content.default_palette(category)
    colors = SimpleNamespace(primary=primary, accent=accent, source="sample")
    biz = SimpleNamespace(
        name=f"Luton {preview_content.trade_noun(category).title()}s",
        phone="01582 123 456",
        location="Luton",
        category=category,
        rating=4.9,
        reviews=137,
        website="",
    )
    
    # Let _build_context use the local static path so un-deployed images load
    ctx = _build_context(biz, colors, f"sample-{category}", asset_base="/static/")
    template = preview_content.content_for(category)["template"]
    html = render_to_string(f"previews/{template}.html", ctx)
    
    return HttpResponse(html)
