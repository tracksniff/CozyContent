"""Render sample previews for all six trades to static HTML files.

Lets you eyeball the preview designs without running the audit pipeline or
touching the database. Colours are not fetched from a live site — pass --color
to try a specific brand colour, otherwise the per-trade default palette is used.

    python manage.py preview_samples --out /tmp/previews
    python manage.py preview_samples --color "#7c3aed"
"""

from pathlib import Path
from types import SimpleNamespace

from django.conf import settings
from django.core.management.base import BaseCommand
from django.template.loader import render_to_string

from leads import preview_content
from leads.services.preview_service import _build_context


class Command(BaseCommand):
    help = "Render sample previews for every trade template to HTML files."

    def add_arguments(self, parser):
        parser.add_argument("--out", default="/tmp/previews", help="Output directory")
        parser.add_argument("--color", default=None, help="Override brand primary hex")
        parser.add_argument("--town", default="Luton")
        parser.add_argument("--phone", default="01582 123 456")
        parser.add_argument(
            "--asset-base",
            default=None,
            help="Image URL prefix. Defaults to a file:// URL for the local "
                 "static dir so samples show their photos when opened directly.",
        )

    def handle(self, *args, **opts):
        out = Path(opts["out"])
        out.mkdir(parents=True, exist_ok=True)
        asset_base = opts["asset_base"] or (settings.BASE_DIR / "static").as_uri() + "/"
        index_links = []

        for category in preview_content.TRADE_CONTENT:
            primary, accent = preview_content.default_palette(category)
            if opts["color"]:
                primary = opts["color"]
            colors = SimpleNamespace(primary=primary, accent=accent, source="sample")
            biz = SimpleNamespace(
                name=f"{opts['town']} {preview_content.trade_noun(category).title()}s",
                phone=opts["phone"],
                location=opts["town"],
                category=category,
                rating=4.9,
                reviews=137,
                website="",
            )
            ctx = _build_context(biz, colors, f"sample-{category}", asset_base=asset_base)
            template = preview_content.content_for(category)["template"]
            html = render_to_string(f"previews/{template}.html", ctx)
            path = out / f"{category}.html"
            path.write_text(html, encoding="utf-8")
            index_links.append(f'<li><a href="{category}.html">{category}</a></li>')
            self.stdout.write(self.style.SUCCESS(f"  ✓ {path} ({len(html):,} bytes)"))

        (out / "index.html").write_text(
            "<h1>Preview samples</h1><ul>" + "".join(index_links) + "</ul>",
            encoding="utf-8",
        )
        self.stdout.write(self.style.SUCCESS(f"\nOpen {out / 'index.html'} in your browser."))
