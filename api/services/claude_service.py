import anthropic

import os

import logging

import json

import subprocess

import shutil

import tempfile

import colorsys


logger = logging.getLogger(__name__)


TEMPLATE_REPO = "https://github.com/Cosy-Content-LTD/soho-plumbers-modern-makeover.git"


# Every file that contains visible content or design tokens.

EDITABLE_FILES = [
    "index.html",
    "src/index.css",
    "src/pages/Index.tsx",
    "src/components/Navbar.tsx",
    "src/components/HeroSection.tsx",
    "src/components/WhyUsSection.tsx",
    "src/components/ServicesSection.tsx",
    "src/components/HowItWorks.tsx",
    "src/components/MeetTheTeam.tsx",
    "src/components/ReviewsSection.tsx",
    "src/components/AreasSection.tsx",
    "src/components/FooterSection.tsx",
    "src/components/MobileCTA.tsx",
]


# ─────────────────────────────────────────────────────────
# Industry image sets — Unsplash photos per industry category
# ─────────────────────────────────────────────────────────

INDUSTRY_IMAGE_SETS = {
    "electrical": [
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
        "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1200&q=80",
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80",
        "https://images.unsplash.com/photo-1609592806596-b75e12cfd6d0?w=800&q=80",
    ],
    "plumbing": [
        "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1600&q=80",
        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
    ],
    "restaurant": [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&q=80",
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80",
        "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200&q=80",
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
    ],
    "beauty": [
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80",
        "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=1200&q=80",
        "https://images.unsplash.com/photo-1487412947147-5cebf100d293?w=1200&q=80",
        "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=1200&q=80",
        "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80",
        "https://images.unsplash.com/photo-1470259078422-826894b933aa?w=800&q=80",
    ],
    "medical": [
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80",
        "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1200&q=80",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80",
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&q=80",
        "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=800&q=80",
    ],
    "legal": [
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=80",
        "https://images.unsplash.com/photo-1453738773917-9c3eff1db985?w=1200&q=80",
        "https://images.unsplash.com/photo-1521791055-06aecab6c3a0?w=1200&q=80",
        "https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=1200&q=80",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
    ],
    "tech": [
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
        "https://images.unsplash.com/photo-1488229297570-58520851e868?w=1200&q=80",
        "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&q=80",
    ],
    "construction": [
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80",
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80",
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
        "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=1200&q=80",
        "https://images.unsplash.com/photo-1487611459768-bd414656ea10?w=800&q=80",
    ],
    "cleaning": [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80",
        "https://images.unsplash.com/photo-1527515637347-bd4c43a67ca3?w=1200&q=80",
        "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1200&q=80",
        "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80",
    ],
    "default": [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
    ],
}


# ─────────────────────────────────────────────────────────
# Design personalities — visual style guide per industry
# ─────────────────────────────────────────────────────────

DESIGN_PERSONALITIES = {
    "electrical": {
        "name": "Bold Industrial",
        "instructions": (
            "Make this site look bold, industrial, and high-energy:\n"
            "- Hero: Full-width dark background (using the Secondary brand color) with a background image and a semi-transparent dark overlay. "
            "Place CTA buttons in the bright Accent brand color.\n"
            "- Headings: Very large and bold (text-5xl lg:text-7xl font-black uppercase tracking-tight).\n"
            "- Services section: Dark cards using Secondary color with colored top border (border-t-4 border-primary).\n"
            "- WhyUs section: Alternate between dark and light panels instead of all-light.\n"
            "- Use high-contrast, industrial feel throughout — fewer soft shadows, more hard edges.\n"
            "- Stats/numbers should be very large and prominent.\n"
        ),
    },
    "plumbing": {
        "name": "Professional Trustworthy",
        "instructions": (
            "Make this site look professional, dependable, and clean:\n"
            "- Hero: Split-panel layout — left half solid Primary brand color background with text, right side large image. "
            "Use rounded-2xl on the image.\n"
            "- Trust badges very prominent below the headline.\n"
            "- Services: White cards with a colored left border (border-l-4 border-primary) and subtle shadow.\n"
            "- WhyUs: Clean light-gray alternating rows with icon + text layout.\n"
            "- Footer: Dark Secondary color background with white text.\n"
        ),
    },
    "beauty": {
        "name": "Elegant Minimal",
        "instructions": (
            "Make this site look luxurious, elegant, and softly minimal:\n"
            "- Hero: Light/white background with a very soft blurred background image and gentle overlay. "
            "Centered layout with generous whitespace. CTA button with rounded-full and elegant font using Accent color.\n"
            "- Typography: Larger letter-spacing (tracking-wide) on headings, thinner font weights for body text.\n"
            "- Services: Horizontal cards with image on left, soft shadow (shadow-sm), rounded-2xl corners.\n"
            "- WhyUs: All-white with soft Accent accent colors, no harsh contrast.\n"
            "- Use lots of padding (py-24 or py-32) for each section — never cramped.\n"
            "- Background: Use very light tints of Primary or Secondary color for alternate sections.\n"
        ),
    },
    "restaurant": {
        "name": "Warm and Inviting",
        "instructions": (
            "Make this site feel warm, appetising, and welcoming:\n"
            "- Hero: Full-bleed food/interior photograph with a warm gradient overlay using the Secondary brand color. Centered large white text.\n"
            "- Services section: Display services like a menu — each item with an appetising description and a warm card background (light tint of Primary).\n"
            "- Use Accent colors for all buttons and highlights.\n"
            "- WhyUs: Warm cream/stone background with warm-toned icons.\n"
            "- Review cards: Warm background with quotation mark styling.\n"
            "- Footer: Deep dark background using Secondary brand color.\n"
        ),
    },
    "legal": {
        "name": "Authoritative and Premium",
        "instructions": (
            "Make this site feel authoritative, premium, and sophisticated:\n"
            "- Hero: Dark background (using Secondary brand color) — no background image, "
            "just strong typography with a subtle gradient. Use Accent color for CTA and highlights.\n"
            "- Headings: Classic serif feel — use font-bold tracking-tight, never compressed.\n"
            "- Services: Elegant dark cards using a slightly lighter Secondary shade with Primary top border.\n"
            "- WhyUs: Very minimal — dark background with white text and thin Accent color dividers.\n"
            "- Testimonials: Full-width dark quote blocks with large quotation marks and client name in Accent color.\n"
            "- Footer: Very dark Secondary color with subtle Accent line separator.\n"
        ),
    },
    "tech": {
        "name": "Modern Tech Startup",
        "instructions": (
            "Make this site feel cutting-edge, modern, and digital:\n"
            "- Hero: Dark background with a gradient overlay (from Primary to Secondary). "
            "Add gradient text for the main headline using bg-gradient-to-r from-white to-primary bg-clip-text text-transparent.\n"
            "- Services: Dark glassmorphism-style cards (bg-white/5 backdrop-blur border border-white/10) on a dark background.\n"
            "- WhyUs: Dark section with subtle grid pattern and Primary/Accent glowing elements.\n"
            "- Use rounded-2xl and smooth transitions throughout.\n"
            "- Stats: Large glowing numbers in Primary color on dark background.\n"
            "- Footer: Very dark background using Secondary color.\n"
        ),
    },
    "medical": {
        "name": "Clean and Caring",
        "instructions": (
            "Make this site feel clean, trustworthy, and professional:\n"
            "- Hero: Bright, welcoming — white or very light Secondary tint background with a professional team photograph. "
            "CTA in soft Primary color rounded buttons (rounded-full).\n"
            "- Services: Clean white cards with a soft Primary or Accent left border, rounded corners, minimal shadows.\n"
            "- WhyUs: Very light section (light tint of Primary) with clean icon layout.\n"
            "- Trust/credentials badges are extremely prominent — place them near the top of the hero.\n"
            "- Use generous whitespace — never crowded.\n"
            "- Footer: Soft dark Secondary color with clean layout.\n"
        ),
    },
    "construction": {
        "name": "Strong and Reliable",
        "instructions": (
            "Make this site feel strong, reliable, and heavy-duty:\n"
            "- Hero: Full-bleed construction site image with a bold dark Secondary overlay. "
            "Very large bold uppercase headline. Bright Accent color CTA button.\n"
            "- Stats section: Giant numbers (text-6xl font-black) with dark Secondary background — make this a hero-like centerpiece.\n"
            "- Services: Bold cards with construction imagery, dark borders using Primary color.\n"
            "- WhyUs: Dark and strong — alternate between dark Secondary and Primary sections.\n"
            "- Typography throughout is heavy: font-bold or font-black, minimal light weights.\n"
        ),
    },
    "cleaning": {
        "name": "Fresh and Spotless",
        "instructions": (
            "Make this site feel fresh, bright, and immaculately clean:\n"
            "- Hero: Bright white or very light background with a clean, organized image. "
            "Fresh Primary or Accent colors for highlights. CTA with clear contrast.\n"
            "- Services: White cards with a fresh Primary/Accent top border, very clean layout.\n"
            "- WhyUs: Light Secondary tint background with checklist-style features.\n"
            "- Use clean dividers and lots of whitespace.\n"
            "- Overall feel: pristine, organized, trustworthy.\n"
        ),
    },
    "default": {
        "name": "Modern Professional",
        "instructions": (
            "Make this site feel modern, professional, and visually distinct:\n"
            "- Hero: Full-width with a brand-colored (Primary/Secondary) gradient overlay on an image. Strong CTA.\n"
            "- Services: Bold cards with Primary top borders and icon.\n"
            "- WhyUs: Alternating light/dark sections for variety.\n"
            "- Overall: Clean, modern, with good use of brand colors throughout.\n"
        ),
    },
}


def get_design_personality(industry: str) -> dict:
    """Return the design personality dict for the given industry."""
    industry_lower = industry.lower()

    if any(w in industry_lower for w in ["electric"]):
        return DESIGN_PERSONALITIES["electrical"]
    elif any(w in industry_lower for w in ["plumb"]):
        return DESIGN_PERSONALITIES["plumbing"]
    elif any(w in industry_lower for w in ["restaurant", "food", "cafe", "bakery", "catering"]):
        return DESIGN_PERSONALITIES["restaurant"]
    elif any(w in industry_lower for w in ["beauty", "spa", "salon", "wellness", "yoga", "luxury"]):
        return DESIGN_PERSONALITIES["beauty"]
    elif any(w in industry_lower for w in ["health", "medical", "dental", "clinic", "care", "physio"]):
        return DESIGN_PERSONALITIES["medical"]
    elif any(w in industry_lower for w in ["law", "legal", "solicitor", "barrister"]):
        return DESIGN_PERSONALITIES["legal"]
    elif any(w in industry_lower for w in ["tech", "software", "digital", "it ", "cyber", "data", "saas"]):
        return DESIGN_PERSONALITIES["tech"]
    elif any(w in industry_lower for w in ["construct", "build", "engineer", "hvac", "trade", "roofing"]):
        return DESIGN_PERSONALITIES["construction"]
    elif any(w in industry_lower for w in ["clean", "maid", "janitorial"]):
        return DESIGN_PERSONALITIES["cleaning"]
    else:
        return DESIGN_PERSONALITIES["default"]


def get_industry_images(industry: str, user_images: list = None) -> list:
    """Return relevant image URLs — user uploads first, then curated stock images."""
    if user_images:
        return user_images

    industry_lower = industry.lower()

    if any(w in industry_lower for w in ["electric"]):
        return INDUSTRY_IMAGE_SETS["electrical"]
    elif any(w in industry_lower for w in ["plumb"]):
        return INDUSTRY_IMAGE_SETS["plumbing"]
    elif any(w in industry_lower for w in ["restaurant", "food", "cafe", "bakery", "catering"]):
        return INDUSTRY_IMAGE_SETS["restaurant"]
    elif any(w in industry_lower for w in ["beauty", "spa", "salon", "wellness", "yoga", "luxury"]):
        return INDUSTRY_IMAGE_SETS["beauty"]
    elif any(w in industry_lower for w in ["health", "medical", "dental", "clinic", "care", "physio"]):
        return INDUSTRY_IMAGE_SETS["medical"]
    elif any(w in industry_lower for w in ["law", "legal", "solicitor"]):
        return INDUSTRY_IMAGE_SETS["legal"]
    elif any(w in industry_lower for w in ["tech", "software", "digital", "it ", "cyber", "data"]):
        return INDUSTRY_IMAGE_SETS["tech"]
    elif any(w in industry_lower for w in ["construct", "build", "engineer", "hvac", "trade", "roofing"]):
        return INDUSTRY_IMAGE_SETS["construction"]
    elif any(w in industry_lower for w in ["clean", "maid"]):
        return INDUSTRY_IMAGE_SETS["cleaning"]
    else:
        return INDUSTRY_IMAGE_SETS["default"]


# ─────────────────────────────────────────────────────────
# Color helpers — convert hex → HSL string for CSS vars
# ─────────────────────────────────────────────────────────


def hex_to_hsl(hex_color: str) -> str:
    """Convert #RRGGBB to 'H S% L%' string for CSS custom properties."""

    hex_color = hex_color.lstrip("#")

    r, g, b = (int(hex_color[i : i + 2], 16) / 255 for i in (0, 2, 4))

    h, l, s = colorsys.rgb_to_hls(r, g, b)

    return f"{round(h * 360)} {round(s * 100)}% {round(l * 100)}%"


def is_dark(hex_color: str) -> bool:
    """Return True if the color is dark (luminance < 50%)."""

    hex_color = hex_color.lstrip("#")

    r, g, b = (int(hex_color[i : i + 2], 16) / 255 for i in (0, 2, 4))

    _, l, _ = colorsys.rgb_to_hls(r, g, b)

    return l < 0.5


def build_design_tokens(branding_colors: dict) -> dict:
    """
    Derive a full set of CSS HSL tokens from the brand hex colors.
    Returns a dict of CSS variable name → HSL string.
    """

    primary_hex = branding_colors.get("primary", "#2563EB")

    secondary_hex = branding_colors.get("secondary", "#1E3A5F")

    accent_hex = branding_colors.get("accent", "#10B981")

    primary_hsl = hex_to_hsl(primary_hex)

    secondary_hsl = hex_to_hsl(secondary_hex)

    accent_hsl = hex_to_hsl(accent_hex)

    # Foreground on primary — white if primary is dark, near-black if light

    primary_fg = "0 0% 100%" if is_dark(primary_hex) else "220 20% 10%"

    accent_fg = "0 0% 100%" if is_dark(accent_hex) else "220 20% 10%"

    # Background: very light tint of secondary

    sec_h = secondary_hsl.split()[0]

    bg_hsl = f"{sec_h} 20% 99%"

    card_hsl = f"{sec_h} 10% 100%"

    section_alt_hsl = f"{sec_h} 15% 97%"

    border_hsl = f"{sec_h} 15% 92%"

    muted_hsl = f"{sec_h} 10% 94%"

    muted_fg_hsl = f"{sec_h} 10% 45%"

    foreground_hsl = f"{sec_h} 20% 12%"

    return {
        "--background": bg_hsl,
        "--foreground": foreground_hsl,
        "--card": card_hsl,
        "--card-foreground": foreground_hsl,
        "--popover": card_hsl,
        "--popover-foreground": foreground_hsl,
        "--primary": primary_hsl,
        "--primary-foreground": primary_fg,
        "--secondary": section_alt_hsl,
        "--secondary-foreground": primary_hsl,
        "--muted": muted_hsl,
        "--muted-foreground": muted_fg_hsl,
        "--accent": accent_hsl,
        "--accent-foreground": accent_fg,
        "--border": border_hsl,
        "--input": border_hsl,
        "--ring": primary_hsl,
        "--section-alt": section_alt_hsl,
        "--cta-glow": accent_hsl,
        "--hero-overlay": primary_hsl,
        "--warm-bg": bg_hsl,
    }


def inject_design_tokens(css_content: str, tokens: dict) -> str:
    """
    Replace every matching CSS custom property value in :root { }
    with the new brand-derived value.
    """

    import re

    for var_name, hsl_value in tokens.items():
        # Match:  --primary: <anything>;

        pattern = rf"({re.escape(var_name)}:\s*)[^;]+"

        replacement = rf"\g<1>{hsl_value}"

        css_content = re.sub(pattern, replacement, css_content)

    return css_content


def choose_fonts(industry: str) -> tuple:
    """
    Pick Google Fonts that suit the industry.
    Returns (display_font, body_font, google_fonts_url).
    """

    industry_lower = industry.lower()

    if any(
        w in industry_lower
        for w in ["law", "legal", "finance", "accounting", "consult"]
    ):
        return (
            "Playfair Display",
            "Source Sans 3",
            "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Source+Sans+3:wght@300;400;500;600;700&display=swap",
        )

    elif any(
        w in industry_lower
        for w in ["tech", "software", "digital", "it ", "cyber", "data"]
    ):
        return (
            "Space Grotesk",
            "Inter",
            "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
        )

    elif any(
        w in industry_lower
        for w in ["beauty", "spa", "salon", "wellness", "yoga", "luxury"]
    ):
        return (
            "Cormorant Garamond",
            "Jost",
            "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Jost:wght@300;400;500;600&display=swap",
        )

    elif any(
        w in industry_lower
        for w in ["restaurant", "food", "cafe", "bakery", "catering"]
    ):
        return (
            "Fraunces",
            "DM Sans",
            "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap",
        )

    elif any(
        w in industry_lower
        for w in [
            "electric",
            "construct",
            "build",
            "engineer",
            "plumb",
            "hvac",
            "trade",
        ]
    ):
        return (
            "Barlow Condensed",
            "Barlow",
            "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@300;400;500;600;700&display=swap",
        )

    elif any(
        w in industry_lower
        for w in ["health", "medical", "dental", "clinic", "care", "physio"]
    ):
        return (
            "Nunito",
            "Nunito",
            "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap",
        )

    else:
        # Default modern professional

        return (
            "Plus Jakarta Sans",
            "Plus Jakarta Sans",
            "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap",
        )


def inject_fonts(
    css_content: str, google_fonts_url: str, display_font: str, body_font: str
) -> str:
    """Replace the Google Fonts import and font-family declarations in the CSS."""

    import re

    # Replace the @import url(...fonts...) line

    css_content = re.sub(
        r"@import url\(['\"]https://fonts\.googleapis\.com[^)]+\)['\"];",
        f"@import url('{google_fonts_url}');",
        css_content,
    )

    # Replace font-sans in body rule

    css_content = re.sub(
        r"(body\s*\{[^}]*font-)\w[\w-]*",
        lambda m: m.group(0).replace(m.group(0).split("font-")[1], "sans"),
        css_content,
    )

    # Inject --font-display and --font-sans as CSS variables in :root

    font_vars = f'    --font-display: "{display_font}", serif;\n    --font-sans: "{body_font}", sans-serif;\n'

    css_content = re.sub(
        r"(:root\s*\{)",
        r"\1\n" + font_vars,
        css_content,
        count=1,
    )

    return css_content


def update_tailwind_config_fonts(
    css_content: str, display_font: str, body_font: str
) -> str:
    """
    If there's a @theme block or tailwind config referencing fonts, update it.
    For this template (Tailwind v3 via @layer), we add a @layer base override.
    """

    font_override = f"""

@layer base {{

  :root {{

    --font-sans: "{body_font}", ui-sans-serif, system-ui, sans-serif;

    --font-display: "{display_font}", ui-serif, serif;

  }}

}}

"""

    # Only add if not already present

    if "--font-display" not in css_content:
        css_content = css_content + font_override

    return css_content


# ─────────────────────────────────────────────────────────
# Git / file helpers
# ─────────────────────────────────────────────────────────


def clone_template(dest_dir: str) -> bool:
    try:
        result = subprocess.run(
            ["git", "clone", "--depth=1", TEMPLATE_REPO, dest_dir],
            capture_output=True,
            text=True,
            timeout=60,
        )

        if result.returncode != 0:
            logger.error(f"Git clone failed: {result.stderr}")

            return False

        logger.info("Template cloned successfully.")

        return True

    except Exception as e:
        logger.error(f"Clone error: {e}")

        return False


def read_template_files(project_dir: str) -> dict:
    files = {}

    for rel_path in EDITABLE_FILES:
        abs_path = os.path.join(project_dir, rel_path)

        if os.path.exists(abs_path):
            with open(abs_path, "r", encoding="utf-8") as f:
                files[rel_path] = f.read()

        else:
            logger.warning(f"Template file not found, skipping: {rel_path}")

    return files


def extract_imports(content: str) -> tuple:
    """Split a TSX file into (import_block, body)."""

    lines = content.split("\n")

    last_import_line = -1

    for i, line in enumerate(lines):
        if line.strip().startswith("import "):
            last_import_line = i

    if last_import_line == -1:
        return "", content

    return "\n".join(lines[: last_import_line + 1]), "\n".join(
        lines[last_import_line + 1 :]
    )


def strip_imports_for_claude(template_files: dict) -> tuple:
    """Remove import blocks before sending to Claude so it can't break paths."""

    files_for_claude = {}

    locked_imports = {}

    for rel_path, content in template_files.items():
        if rel_path.endswith(".tsx") or rel_path.endswith(".ts"):
            import_block, body = extract_imports(content)

            locked_imports[rel_path] = import_block

            files_for_claude[rel_path] = (
                "/* !! LOCKED_IMPORTS — DO NOT EDIT !! */\n" + body
            )

        else:
            files_for_claude[rel_path] = content

    return files_for_claude, locked_imports


def restore_imports(edited_files: dict, locked_imports: dict) -> dict:
    """Unconditionally splice original imports back into every TSX file."""

    restored = {}

    for rel_path, content in edited_files.items():
        if rel_path in locked_imports and locked_imports[rel_path]:
            lines = content.split("\n")

            body_start = 0

            for i, line in enumerate(lines):
                s = line.strip()

                if s.startswith("import ") or s.startswith("/* !!") or s == "":
                    body_start = i + 1

                else:
                    break

            body = "\n".join(lines[body_start:])

            restored[rel_path] = locked_imports[rel_path] + "\n" + body

        else:
            restored[rel_path] = content

    return restored


# Full set of lucide-react icons Claude might introduce during redesign
_LUCIDE_ICONS = {
    "Activity", "AlertCircle", "AlertTriangle", "AlarmClock", "Anchor", "Archive",
    "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "AtSign", "Award",
    "BadgeCheck", "BarChart", "BarChart2", "Battery", "Bell", "BellRing",
    "Bike", "Bluetooth", "Bolt", "Book", "BookOpen", "Bookmark", "Box",
    "Briefcase", "Brush", "Building", "Building2",
    "Calendar", "Camera", "Car", "CheckCircle", "CheckCheck", "CheckSquare",
    "ChefHat", "ChevronDown", "ChevronLeft", "ChevronRight", "ChevronUp",
    "Circle", "Clipboard", "ClipboardCheck", "ClipboardList", "Clock",
    "Cloud", "CloudRain", "CloudSnow", "CloudSun", "Cog", "Coins",
    "Compass", "Construction", "CookingPot", "Copy", "CreditCard", "Crown",
    "Delete", "Diamond", "DollarSign", "Download", "Droplets", "Dumbbell",
    "Edit", "Edit2", "Edit3", "ExternalLink", "Eye", "EyeOff",
    "File", "FileText", "Fingerprint", "Flag", "Flame", "Folder",
    "Gauge", "Gift", "Globe", "GraduationCap", "Grid",
    "Hammer", "Hand", "HandCoins", "Handshake", "HardHat", "Hash",
    "Headphones", "Heart", "HeartHandshake", "HelpCircle", "Home",
    "Hourglass", "Image", "Inbox", "Info",
    "Key", "Laptop", "Leaf", "Library", "Link", "List", "Lock",
    "Loader", "Loader2", "Mail", "Map", "MapPin", "Medal", "Menu",
    "MessageCircle", "MessageSquare", "Mic", "Microscope", "Minus",
    "Monitor", "Moon", "MoreHorizontal", "MoreVertical", "Mountain",
    "Move", "Navigation", "Package", "PaintRoller", "Paintbrush",
    "Palette", "Pen", "PenTool", "Pencil", "Percent", "Phone",
    "PieChart", "PiggyBank", "Pill", "Pizza", "Play",
    "Plus", "RefreshCw", "Ribbon", "Rocket", "RotateCw",
    "Route", "Ruler", "Running", "Salad", "Satellite", "Scale",
    "School", "Scissors", "Search", "Send", "Settings", "Share",
    "Shield", "ShieldCheck", "ShoppingBag", "ShoppingCart",
    "Shovel", "Signal", "Smartphone", "Smile", "Speaker",
    "Sparkles", "Square", "Star", "StarHalf", "Stars",
    "Stethoscope", "Sun", "Syringe", "Tablet", "Tag",
    "Target", "Telescope", "Thermometer", "ThumbsUp", "Timer",
    "Tool", "Trash", "Trash2", "TrendingDown", "TrendingUp",
    "Triangle", "Trophy", "Truck", "Umbrella", "Unlock", "Upload",
    "UserCheck", "UserPlus", "Users", "User", "Utensils", "UtensilsCrossed",
    "Video", "Volume2", "Wallet", "Wand", "Wand2", "Watch", "Waves",
    "Wifi", "Wind", "Wrench", "X", "XCircle", "Zap", "ZoomIn", "ZoomOut",
}


def fix_missing_lucide_imports(restored_files: dict) -> dict:
    """
    Scan every TSX file for Lucide icon JSX usage and patch the
    lucide-react import line so no icon is referenced but undefined.
    """
    import re

    jsx_tag_re = re.compile(r"<([A-Z][a-zA-Z0-9]+)[\s/>]")
    lucide_import_re = re.compile(
        r"(import\s*\{)([^}]+)(\}\s*from\s*['\"]lucide-react['\"];?)"
    )

    fixed = {}
    for rel_path, content in restored_files.items():
        if not rel_path.endswith(".tsx"):
            fixed[rel_path] = content
            continue

        # Find all capitalised JSX tags that match a known Lucide icon
        used = {m.group(1) for m in jsx_tag_re.finditer(content) if m.group(1) in _LUCIDE_ICONS}

        if not used:
            fixed[rel_path] = content
            continue

        match = lucide_import_re.search(content)
        if match:
            existing = {s.strip() for s in match.group(2).split(",") if s.strip()}
            merged = existing | used
            new_line = f"{match.group(1)} {', '.join(sorted(merged))} {match.group(3)}"
            content = lucide_import_re.sub(new_line, content, count=1)
            added = merged - existing
            if added:
                logger.info(f"{rel_path}: injected Lucide icons {added}")
        else:
            # No lucide-react import yet — insert one after the last import line
            lines = content.split("\n")
            last_import = 0
            for i, line in enumerate(lines):
                if line.strip().startswith("import "):
                    last_import = i
            new_import = f"import {{ {', '.join(sorted(used))} }} from 'lucide-react';"
            lines.insert(last_import + 1, new_import)
            content = "\n".join(lines)
            logger.info(f"{rel_path}: added lucide-react import for {used}")

        fixed[rel_path] = content

    return fixed


def write_edited_files(project_dir: str, edited_files: dict):
    for rel_path, content in edited_files.items():
        abs_path = os.path.join(project_dir, rel_path)

        os.makedirs(os.path.dirname(abs_path), exist_ok=True)

        with open(abs_path, "w", encoding="utf-8") as f:
            f.write(content)

    logger.info(f"Wrote {len(edited_files)} edited files.")


# ─────────────────────────────────────────────────────────
# Claude content + design editing
# ─────────────────────────────────────────────────────────

# Universal frontend excellence rules injected into every generation
FRONTEND_EXCELLENCE_GUIDE = """
━━━ UNIVERSAL MODERN FRONTEND STANDARDS (apply to EVERY component) ━━━

LAYOUT & SPACING
• Sections must breathe — use py-20 to py-32, never py-8 or less
• Content width: max-w-7xl mx-auto with px-6 sm:px-8 side padding
• All grids: start grid-cols-1, expand md:grid-cols-2, lg:grid-cols-3 (mobile-first)

TYPOGRAPHY HIERARCHY
• One display size per section: text-4xl–text-7xl font-black for hero/section headings
• Subheadings: text-xl–text-2xl font-bold
• Body: text-base–text-lg font-medium leading-relaxed
• Labels/captions: text-sm font-medium text-muted-foreground

CARDS & SURFACES
• Cards: rounded-2xl or rounded-3xl, shadow-sm hover:shadow-xl transition-all duration-300
• Subtle borders: border border-border/50
• Card hover: hover:-translate-y-1 hover:shadow-xl transition-all duration-300

BUTTONS & CTAs
• Primary CTA: large, rounded-full or rounded-xl, py-4 px-8, shadow-lg hover:shadow-xl
• Secondary: ghost or outline variant, same size
• ALWAYS include hover:scale-105 or hover:brightness-110 on buttons
• Hero must have at least 2 CTA buttons above the fold

IMAGES
• Always use object-cover with explicit aspect ratios (aspect-video, aspect-square, etc.)
• Hero background: use background-image with bg-center bg-cover bg-no-repeat
• Add a gradient overlay on background images for text readability

VISUAL RHYTHM
• Sections must alternate visually: light → slightly-off-white → dark → light
• Never have 3 consecutive sections with the same background colour
• The hero MUST use a background image or strong gradient — never plain white/light

MICRO-INTERACTIONS
• All interactive elements: transition-all duration-200
• Icon containers: hover:scale-110 or hover:rotate-12 with transition
• Links: hover:underline or hover:text-primary with transition

STATS & SOCIAL PROOF
• Stats numbers: text-4xl–text-6xl font-black — make them BIG and bold
• Stars: show ★★★★★ in yellow/amber, never just text
• Testimonial cards: large opening quotation mark, author name + location

FOOTER
• Always dark background (bg-gray-900 or bg-slate-900)
• 3–4 column grid on desktop, stacked on mobile
• Company name + description in first column
• Links in subsequent columns
• Copyright bar at bottom with thin border separator
"""


CONTENT_GUIDE = """
NAVBAR:         company name (2-line logo), phone number

HEROSECTION:    badge text, h1 headline, star rating/review count, description paragraph,
                phone number in CTA, trust badges, floating stat card values & labels,
                background image (use first image from the provided image list)

WHYUSSECTION:   section heading, subheading, all 4 feature titles + descriptions

SERVICESSECTION: section heading, subheading, all 6 service titles + descriptions, phone in links

HOWITWORKS:     section heading, all 3 step titles + descriptions

MEETTHETEAM:    section heading, body paragraph, all 4 bullet points, phone in CTA,
                team/company image (use second image from the provided image list)

REVIEWSSECTION: all 3 review names, locations, and review text; star rating / review count

AREASSECTION:   section heading, all area/location names

FOOTERSECTION:  company name, description paragraph, phone number, locations text, copyright name

MOBILECTA:      phone number

INDEX.HTML:     <title>, meta description, og:title, og:description, author. 
                IMPORTANT: Remove any <link> tag pointing to external favicons (especially lovable.dev). 
                If a favicon is needed, use '/favicon.png' or none.
"""


def edit_files_with_claude(
    template_files: dict,
    application_data: dict,
    design_personality: dict,
    image_urls: list,
) -> dict | None:
    api_key = os.getenv("ANTHROPIC_API_KEY")

    if not api_key:
        logger.error("ANTHROPIC_API_KEY not found")

        return None

    client = anthropic.Anthropic(api_key=api_key)

    files_for_claude, locked_imports = strip_imports_for_claude(template_files)

    template_snapshot = ""

    for rel_path, content in files_for_claude.items():
        # Skip index.css — handled in Python

        if rel_path == "src/index.css":
            continue

        template_snapshot += f"\n\n### FILE: {rel_path}\n```\n{content}\n```"

    # Format image list for the prompt
    image_list_str = "\n".join(
        f"  Image {i+1}: {url}" for i, url in enumerate(image_urls)
    )

    branding_colors = application_data.get("branding_colors", {})
    primary_hex = branding_colors.get("primary", "#2563EB")
    secondary_hex = branding_colors.get("secondary", "#1E3A5F")
    accent_hex = branding_colors.get("accent", "#10B981")

    industry = application_data.get("industry", "trade services")

    system_prompt = f"""You are an expert React/TypeScript developer and UI/UX designer. Your task is to COMPLETELY REDESIGN this plumber website template into a visually unique, professional website for a different business — it must look NOTHING like the original template.

━━━ YOUR MISSION ━━━
Transform every component to match the DESIGN PERSONALITY below. The output must look like a completely different website, not a recolored version of the same template.
Each site you generate must be unique in its layout, section ordering, and creative execution. Avoid generic designs; make each one feel bespoke.

━━━ BRAND COLORS ━━━
Use these brand colors for your design (though they are also mapped to CSS variables):
- Primary: {primary_hex}
- Secondary: {secondary_hex}
- Accent: {accent_hex}

In Tailwind, you SHOULD prefer the abstract classes like `bg-primary`, `text-secondary`, `border-accent`, etc., as they are dynamically linked to these colors. 
DO NOT use hardcoded color names like `bg-yellow-500` or `text-blue-600` unless they are for small semantic details (like white text on dark backgrounds).

━━━ DESIGN PERSONALITY: {design_personality["name"]} ━━━
{design_personality["instructions"]}

━━━ WHAT YOU MUST CHANGE ━━━
1. ALL text — replace every Soho/plumber reference with content for the new {industry} business.
2. Tailwind className values — change backgrounds (bg-*), colors (text-*, border-*), spacing (p-*, m-*), sizing (text-5xl etc.), layout (grid-cols-*, flex-*) to match the design personality above.
3. ALL image references — replace any src attributes or backgroundImage style values with URLs from the provided image list.
4. Section backgrounds — make sections look different from the original. Use dark sections, gradients, or colored backgrounds where the personality calls for it.
5. Typography scale — adjust text sizes, weights, and letter-spacing to match the personality.
6. Layout structure within components — you MUST reorder elements, change grid columns, add/remove divs to restructure the visual layout significantly.

━━━ PROVIDED IMAGES (use these to replace ALL existing images) ━━━
{image_list_str}

For background images use: style={{{{ backgroundImage: `url('IMAGE_URL')` }}}}
For <img> tags use: src="IMAGE_URL"
Distribute images across components — hero gets Image 1, team/about gets Image 2, services can use Images 3+.

{FRONTEND_EXCELLENCE_GUIDE}

━━━ CONTENT TO UPDATE IN EACH FILE ━━━
{CONTENT_GUIDE}

━━━ STRICT RULES ━━━
1. The /* !! LOCKED_IMPORTS — DO NOT EDIT !! */ line — leave it exactly as-is. Do NOT replace it with import statements.
2. Keep ALL component function names, prop type interfaces, and export statements IDENTICAL to the original.
3. Keep ALL onClick handlers, framer-motion animation variants/props, and useRef/useState calls IDENTICAL.
4. Apostrophes in JSX text → &apos;  Quotes in JSX text → &quot;
5. Replace every old phone number with the new business phone number.
6. Do NOT include src/index.css in your response — it is handled separately.
7. Every file value must be the COMPLETE file content — never a diff or snippet.
8. Return valid TSX — no syntax errors, no unclosed tags.
9. Icons: you may ONLY use icon names that already appear in the original file's JSX. Do NOT introduce new icon component names — if an icon isn't in the original file, don't use it.
10. FAVICON: Explicitly check index.html and remove any link tags pointing to Lovable or external AI favicon URLs.

━━━ OUTPUT FORMAT ━━━
Return a SINGLE raw JSON object. Keys = file paths. Values = complete file content.
No markdown fences, no backticks, no explanation — only the JSON object."""

    user_prompt = f"""Redesign this website for:

Company Name: {application_data["company_name"]}
Industry: {application_data.get("industry", "trade services")}
Phone Number: {application_data.get("phone_number", "N/A")}
Location: {application_data["city_location"]}
Services: {application_data["services_list"]}
Testimonials: {application_data["testimonials"]}
Years of Experience: {application_data.get("years_experience", "10+")}
Trust Badges: {application_data.get("trust_badges", "Fully insured, certified professionals")}
Service Areas: {application_data.get("service_areas", application_data["city_location"])}
Tagline / USP: {application_data.get("tagline", "Fast, reliable, professional service")}

Brand Colors to respect:
Primary: {primary_hex}
Secondary: {secondary_hex}
Accent: {accent_hex}

Design Personality to apply: {design_personality["name"]}
Available images to use (replace ALL existing images with these):
{image_list_str}

Template files to redesign:
{template_snapshot}

Return ALL files as a single raw JSON object. Do NOT include src/index.css."""

    try:
        logger.info(
            f"Sending template to Claude for full redesign ({design_personality['name']})..."
        )

        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=16000,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )

        text = response.content[0].text.strip()

        stop_reason = response.stop_reason

        logger.info(f"Claude responded. Stop reason: {stop_reason}")

        if text.startswith("```json"):
            text = text[7:]

        elif text.startswith("```"):
            text = text[3:]

        if text.endswith("```"):
            text = text[:-3]

        text = text.strip()

        edited = json.loads(text)

        # Only keep valid keys, fall back to originals for anything missing

        valid_keys = set(template_files.keys()) - {"src/index.css"}

        filtered = {k: v for k, v in edited.items() if k in valid_keys}

        for k in valid_keys - set(filtered.keys()):
            logger.warning(f"Claude omitted {k} — keeping original.")

            filtered[k] = template_files[k]

        # Restore locked imports, then patch any new Lucide icons Claude introduced

        restored = restore_imports(filtered, locked_imports)

        restored = fix_missing_lucide_imports(restored)

        return restored

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error: {e}")

        return None

    except Exception as e:
        logger.error(f"Claude API error: {e}")

        return None


# ─────────────────────────────────────────────────────────
# Main entry point
# ─────────────────────────────────────────────────────────


def generate_website_code(
    application_data: dict, output_dir: str | None = None
) -> str | None:
    """
    Clone the template, apply brand design tokens + fonts to CSS,
    then have Claude fully redesign all components with the right
    industry personality and images.

    application_data keys:
        company_name        — business name
        industry            — e.g. "electrical", "legal", "beauty salon"
        phone_number        — contact number
        city_location       — e.g. "Manchester, UK"
        services_list       — comma-separated or list
        testimonials        — list of {name, location, text}
        branding_colors     — dict: {primary, secondary, accent} as hex
        uploaded_images     — (optional) list of image URLs from user uploads
        years_experience    — (optional) e.g. "15+"
        trust_badges        — (optional) e.g. "NICEIC Approved, Fully Insured"
        service_areas       — (optional) list of local areas
        tagline             — (optional) short USP
    """

    if isinstance(application_data, str):
        try:
            application_data = json.loads(application_data)
        except:
            logger.error("application_data is a string but not valid JSON")

            return None

    if output_dir is None:
        output_dir = tempfile.mkdtemp(prefix="website_")

    project_dir = os.path.join(output_dir, "project")

    # 1. Clone

    logger.info(f"Cloning template into {project_dir}...")

    if not clone_template(project_dir):
        return None

    git_dir = os.path.join(project_dir, ".git")

    if os.path.exists(git_dir):
        shutil.rmtree(git_dir)

    # 2. Read files

    template_files = read_template_files(project_dir)

    if not template_files:
        logger.error("No template files could be read.")

        return None

    logger.info(f"Read {len(template_files)} template files.")

    # 3. Resolve industry context

    industry = application_data.get("industry", "")

    user_images = application_data.get("uploaded_images", [])

    design_personality = get_design_personality(industry)

    image_urls = get_industry_images(industry, user_images if user_images else None)

    logger.info(
        f"Design personality: {design_personality['name']} | "
        f"Images: {len(image_urls)} ({'user uploads' if user_images else 'stock'})"
    )

    # 4. Apply design tokens + fonts to CSS in Python (fast, deterministic)

    branding_colors = application_data.get("branding_colors", {})

    tokens = build_design_tokens(branding_colors)

    display_font, body_font, fonts_url = choose_fonts(industry)

    css = template_files["src/index.css"]

    css = inject_design_tokens(css, tokens)

    css = inject_fonts(css, fonts_url, display_font, body_font)

    css = update_tailwind_config_fonts(css, display_font, body_font)

    template_files["src/index.css"] = css

    logger.info(f"Design tokens applied. Fonts: {display_font} / {body_font}")

    # 5. Full visual redesign + content rebranding via Claude

    edited_files = edit_files_with_claude(
        template_files, application_data, design_personality, image_urls
    )

    if not edited_files:
        logger.error("Claude redesign failed.")

        return None

    # 6. Put our CSS back (Claude was told to skip it)

    edited_files["src/index.css"] = template_files["src/index.css"]

    # 7. Write everything back

    write_edited_files(project_dir, edited_files)

    logger.info(f"Website ready at: {project_dir}")

    return project_dir


# ── Example usage ───────────────────────────────────────

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    data = {
        "company_name": "Bright Spark Electricians",
        "industry": "electrical",
        "phone_number": "0161 123 4567",
        "city_location": "Manchester, UK",
        "services_list": "Rewiring, Fuse Board Upgrades, EV Charger Installation, Lighting Design, Emergency Repairs, PAT Testing",
        "testimonials": [
            {
                "name": "Sarah T.",
                "location": "Didsbury",
                "text": "Fantastic service, very professional and tidy.",
            },
            {
                "name": "James R.",
                "location": "Chorlton",
                "text": "Fixed our fuse board same day. Highly recommend.",
            },
            {
                "name": "Emma B.",
                "location": "Salford",
                "text": "Excellent response time. Very fairly priced.",
            },
        ],
        "branding_colors": {
            "primary": "#F59E0B",
            "secondary": "#1E3A5F",
            "accent": "#10B981",
        },
        "years_experience": "20+",
        "trust_badges": "NICEIC Approved, Part P Certified, Fully Insured",
        "service_areas": [
            "Didsbury",
            "Chorlton",
            "Salford",
            "Trafford",
            "Stockport",
            "Oldham",
            "Bolton",
            "Bury",
        ],
        "tagline": "Manchester's most trusted emergency electricians",
    }

    path = generate_website_code(data)

    if path:
        print(f"Project generated at: {path}")

    else:
        print("Generation failed.")
