import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "CozyContent.settings")
django.setup()
from django.template.loader import render_to_string
print("Electricians rendered")
from leads.models import Business
biz = Business.objects.first()
from leads.services.preview_service import _build_context
from leads.preview_content import default_palette
from types import SimpleNamespace
colors = SimpleNamespace(primary="#000", accent="#111", source="test")
ctx = _build_context(biz, colors, "test", asset_base="/static/")
html = render_to_string("previews/electricians.html", ctx)
if "hero.webp" in html or "male-electrician" in html:
    print("Found hero image in output")
else:
    print("NO HERO IMAGE IN OUTPUT")
