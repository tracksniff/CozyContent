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
