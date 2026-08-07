import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "CozyContent.settings")
django.setup()
from leads.models import Business
from leads.services.preview_service import build_preview
for b in Business.objects.all():
    print(f"Rebuilding {b.name}...")
    build_preview(b)
print("Done")
