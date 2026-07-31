"""Extract a prospect's brand colours from their existing website.

The goal is *familiarity*, not pixel-perfect matching — we pull the most
prominent brand-ish colour (and an accent) so the personalised preview feels
like an upgrade of their own site rather than a generic template.

Strategy (cheap, no rendering, no image processing):
    1. ``<meta name="theme-color">`` — the single best signal when present.
    2. CSS custom properties named like ``--primary`` / ``--brand`` / ``--accent``.
    3. Frequency count of every hex / rgb colour in inline styles + <style> tags.
Neutrals (near-black, near-white, greys) are filtered out so we surface an
actual brand colour. Falls back to the per-trade default palette.
"""

import logging
import re
from collections import Counter
from dataclasses import dataclass

import requests

logger = logging.getLogger(__name__)

USER_AGENT = (
    "Mozilla/5.0 (compatible; CosyContentPreviewBot/1.0; "
    "+https://cosycontent.com)"
)
REQUEST_TIMEOUT = 10
MAX_BYTES = 800_000  # don't parse multi-MB pages

_HEX_RE = re.compile(r"#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b")
_RGB_RE = re.compile(r"rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})", re.I)
_THEME_COLOR_RE = re.compile(
    r'<meta[^>]+name=["\']theme-color["\'][^>]+content=["\']([^"\']+)["\']', re.I
)
_CSS_VAR_RE = re.compile(
    r"--(?:brand|primary|accent|secondary|main|theme)[\w-]*\s*:\s*(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\))",
    re.I,
)


@dataclass
class BrandColors:
    primary: str
    accent: str
    source: str  # where we found it, for debugging/admin


def _norm_hex(value: str) -> str | None:
    """Normalise a hex/rgb colour string to ``#rrggbb`` lowercase."""
    value = value.strip().lower()
    m = _HEX_RE.fullmatch(value) or _HEX_RE.match(value)
    if m:
        h = m.group(1)
        if len(h) == 3:
            h = "".join(c * 2 for c in h)
        return f"#{h}"
    m = _RGB_RE.match(value)
    if m:
        r, g, b = (min(255, int(x)) for x in m.groups())
        return f"#{r:02x}{g:02x}{b:02x}"
    return None


def _rgb(hex_color: str) -> tuple[int, int, int]:
    h = hex_color.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def _is_neutral(hex_color: str) -> bool:
    """True for near-black, near-white and low-saturation greys."""
    r, g, b = _rgb(hex_color)
    mx, mn = max(r, g, b), min(r, g, b)
    if mx >= 240 and mn >= 240:      # near white
        return True
    if mx <= 30:                      # near black
        return True
    saturation = (mx - mn) / mx if mx else 0
    return saturation < 0.15          # grey


def _luminance(hex_color: str) -> float:
    r, g, b = _rgb(hex_color)
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255


def _accent_from(primary: str, candidates: list[str]) -> str:
    """Pick an accent that contrasts with the primary, else derive one."""
    pr, pg, pb = _rgb(primary)
    best, best_dist = None, 0
    for c in candidates:
        if c == primary:
            continue
        cr, cg, cb = _rgb(c)
        dist = (cr - pr) ** 2 + (cg - pg) ** 2 + (cb - pb) ** 2
        if dist > best_dist:
            best, best_dist = c, dist
    # Require a meaningfully different hue, otherwise synthesise a warm accent.
    if best and best_dist > 8000:
        return best
    return "#f59e0b" if _luminance(primary) < 0.6 else "#0f766e"


def fetch_site_html(url: str) -> str | None:
    """Fetch a prospect's homepage HTML (capped). Never raises — returns None.

    Shared by :func:`extract_brand_colors` and the site-facts service so the
    prospect's site is fetched exactly once per preview build.
    """
    if not url:
        return None
    try:
        resp = requests.get(
            url,
            timeout=REQUEST_TIMEOUT,
            allow_redirects=True,
            headers={"User-Agent": USER_AGENT},
            stream=True,
        )
        resp.raise_for_status()
        return resp.raw.read(MAX_BYTES, decode_content=True).decode(
            resp.encoding or "utf-8", errors="ignore"
        )
    except Exception as exc:  # noqa: BLE001 — extraction is strictly best-effort
        logger.info("Site fetch failed for %s: %s", url, exc)
        return None


def extract_brand_colors(
    url: str, fallback: tuple[str, str], html: str | None = None
) -> BrandColors:
    """Best-effort brand colour extraction. Never raises — returns fallback.

    Pass ``html`` to reuse an already-fetched page (avoids a second request);
    otherwise the page is fetched from ``url``.
    """
    fb_primary, fb_accent = fallback
    if html is None:
        if not url:
            return BrandColors(fb_primary, fb_accent, "fallback:no-url")
        html = fetch_site_html(url)
    if not html:
        return BrandColors(fb_primary, fb_accent, "fallback:fetch-error")

    # 1. theme-color meta — strongest brand signal.
    m = _THEME_COLOR_RE.search(html)
    if m:
        primary = _norm_hex(m.group(1))
        if primary and not _is_neutral(primary):
            candidates = [c for c in _all_colors(html) if not _is_neutral(c)]
            return BrandColors(primary, _accent_from(primary, candidates), "theme-color")

    # 2. CSS custom properties (--primary / --brand / --accent ...).
    var_colors = [
        h for h in (_norm_hex(v) for v in _CSS_VAR_RE.findall(html)) if h
    ]
    var_brand = [c for c in var_colors if not _is_neutral(c)]
    if var_brand:
        primary = var_brand[0]
        return BrandColors(primary, _accent_from(primary, var_brand), "css-variable")

    # 3. Frequency of all colours, neutrals removed.
    counts = Counter(c for c in _all_colors(html) if not _is_neutral(c))
    if counts:
        primary = counts.most_common(1)[0][0]
        return BrandColors(
            primary, _accent_from(primary, [c for c, _ in counts.most_common(12)]),
            "frequency",
        )

    return BrandColors(fb_primary, fb_accent, "fallback:no-color-found")


def _all_colors(html: str) -> list[str]:
    out = []
    for m in _HEX_RE.finditer(html):
        h = _norm_hex(m.group(0))
        if h:
            out.append(h)
    for m in _RGB_RE.finditer(html):
        h = _norm_hex(m.group(0))
        if h:
            out.append(h)
    return out


# --- shade helpers used by the preview renderer -----------------------------

def shade(hex_color: str, percent: float) -> str:
    """Lighten (percent>0) or darken (percent<0) a hex colour."""
    r, g, b = _rgb(hex_color)
    if percent >= 0:
        r = int(r + (255 - r) * percent)
        g = int(g + (255 - g) * percent)
        b = int(b + (255 - b) * percent)
    else:
        f = 1 + percent
        r, g, b = int(r * f), int(g * f), int(b * f)
    return f"#{max(0,min(255,r)):02x}{max(0,min(255,g)):02x}{max(0,min(255,b)):02x}"


def readable_text_on(hex_color: str) -> str:
    """Return white or near-black depending on background luminance."""
    return "#ffffff" if _luminance(hex_color) < 0.6 else "#0f172a"


def palette(primary: str, accent: str) -> dict:
    """Build a full Inter-grade tint scale from the brand + accent colours.

    Mirrors the reference design system (brand-50 … brand-900) so previews look
    professionally art-directed regardless of which colour we pulled from the
    prospect's site. If the brand colour is very light, we darken it for text
    contrast so headings/buttons stay legible.
    """
    # Guard against near-white brand colours that would wash out the UI.
    if _luminance(primary) > 0.82:
        primary = shade(primary, -0.45)

    return {
        "brand_50": shade(primary, 0.93),
        "brand_100": shade(primary, 0.85),
        "brand_200": shade(primary, 0.68),
        "brand_500": primary,
        "brand_600": shade(primary, -0.14),
        "brand_700": shade(primary, -0.32),
        "brand_900": shade(primary, -0.58),
        "accent_400": shade(accent, 0.18),
        "accent_500": accent,
        "accent_600": shade(accent, -0.16),
        "on_brand": readable_text_on(primary),
        "on_accent": readable_text_on(accent),
    }
