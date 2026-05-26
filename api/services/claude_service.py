import anthropic

import os

import logging

import json

import shutil

import tempfile

import colorsys

import random

import re


logger = logging.getLogger(__name__)


# Local scaffold = minimal Vite + React + Tailwind + shadcn/ui project.
# Claude generates Index.tsx + any components freely on top of this.
SCAFFOLD_DIR = os.path.join(os.path.dirname(__file__), "scaffold")


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
        "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1200&q=80",
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
# Layout Strategies — narrative flow variations
# ─────────────────────────────────────────────────────────

LAYOUT_STRATEGIES = [
    "Trust-First Narrative: open with social proof (reviews, awards, badges) immediately after the hero to establish authority before pitching services.",
    "Services-Focused Narrative: lead with a strong, scannable services section right after the hero, then drive into 'how it works' to convert quickly.",
    "Social-Proof-Heavy Narrative: surface team faces, founder story, and testimonials early to humanise the brand before listing services.",
    "Outcome-Focused Narrative: structure the page around customer outcomes / case studies first, services second.",
    "Modern Minimal Narrative: very few sections, huge whitespace, oversized type, one or two hero images. Feel: art gallery / luxury brand.",
    "Data-Driven Narrative: stats, numbers, KPIs, accreditations dominate the early sections. Feel: institutional, credible.",
    "Asymmetric Editorial: mix full-bleed sections with narrow contained ones; overlap text on images; magazine-style.",
    "Direct Action Narrative: contact / booking form placed unusually high (near the hero) — single-page conversion focus.",
    "Visual-First Narrative: oversized imagery dominates, text plays supporting role. Hero takes 100vh.",
    "Story-Driven Narrative: long-scroll storytelling with chapter-style section dividers and a clear emotional arc.",
]


# ─────────────────────────────────────────────────────────
# Design personalities — visual style guide per industry
# ─────────────────────────────────────────────────────────

DESIGN_PERSONALITIES = {
    "electrical": {
        "name": "Bold Industrial",
        "instructions": (
            "Theme: Industrial Power & High Contrast.\n"
            "- Visuals: bold, raw, high-energy. Thick borders (border-4), hard edges (rounded-none or rounded-md), high-contrast pairings.\n"
            "- Hero: split-screen or dark-focused layouts. Heavy typography (font-black tracking-tighter).\n"
            "- Typography clamps: h1 clamp(2.75rem, 6vw, 5.25rem) font-black tracking-tighter; h2 clamp(2rem, 4vw, 3.5rem); body 1rem leading-relaxed.\n"
            "- Navbar: bold `bg-header text-header-foreground` solid bar OR `bg-background text-foreground` with a thick `border-b-4 border-primary` underline. Optionally a left vertical sidebar nav.\n"
            "- Rhythm: strong block-color sections, neo-brutalist hard shadows instead of soft.\n"
            "- Section order: Header → Hero → Stats → Services → Process → Accreditations → Testimonials → CTA Banner → Footer.\n"
            "- Recommended Icon names: bolt, plug, bulb, battery, zap, shield, hardhat, cog, wrench, check.\n"
            "- Accents: accent color for glowing highlights and status indicators; use .glow-accent on the hero CTA.\n"
            "- Cards: replace soft .surface-card lift with hard offset borders — `border-2 border-foreground shadow-[6px_6px_0_hsl(var(--primary))]`.\n"
        ),
    },
    "plumbing": {
        "name": "Professional Trustworthy",
        "instructions": (
            "Theme: Dependable cleanliness & technical precision.\n"
            "- Visuals: clean, structured, reassuring. Medium rounded corners (rounded-xl), subtle depth shadows.\n"
            "- Hero: content-first with visible trust .sticker badges and a strong friendly CTA. Asymmetric grid welcome. Wrap hero photo with .organic-mask. Float a .bob WhatsApp bubble bottom-left of the photo.\n"
            "- Typography clamps: h1 clamp(2.5rem, 6vw, 5rem) tracking-tight; h2 clamp(1.85rem, 4vw, 3.25rem); body 1rem leading-[1.65].\n"
            "- Navbar: `bg-background/90 backdrop-blur text-foreground` with a soft shadow on scroll. Wordmark uses text-heading, links use text-foreground/80, the phone CTA uses bg-primary text-primary-foreground.\n"
            "- Rhythm: alternating .bg-background / .bg-section-alt sections, clear step-by-step .step process row, .promise grids, .review testimonials.\n"
            "- Section order: Header → Hero → Promises → Services → Process → Accreditations → Testimonials → CTA Banner → Footer.\n"
            "- Recommended Icon names: boiler, drop, radiator, bath, pipes, faucet, shield, spark, smile, check, phone, whatsapp, clock.\n"
            "- Accents: primary color for icons and structural highlights; use .eyebrow primary chip above every section heading.\n"
        ),
    },
    "beauty": {
        "name": "Elegant Minimal",
        "instructions": (
            "Theme: Luxurious serenity & soft whitespace.\n"
            "- Visuals: airy, sophisticated, high-end. Generous padding (py-32+), rounded-full buttons, delicate thin dividers.\n"
            "- Hero: centered with a beautiful background image and soft layered typography. Wrap hero photo with .organic-mask-2 for an irregular crop. Floating hero card optional.\n"
            "- Typography clamps: h1 clamp(2.75rem, 6vw, 5.5rem) font-light tracking-tight (use .serif-em for one phrase); h2 clamp(2rem, 4vw, 3.5rem) font-light; body 1rem leading-[1.75] font-light.\n"
            "- Navbar: minimalist `bg-background/70 backdrop-blur text-foreground` that floats. Spaced-out tracking-widest menu items. Wordmark uses text-heading.\n"
            "- Rhythm: flowing and spacious. Use subtle background tints (bg-primary/5) over solid dark blocks. Use Blob shape='b' as a soft wash behind hero.\n"
            "- Section order: Header → Hero → About/Founder Story → Services → Testimonials → Stats → CTA Banner → Footer.\n"
            "- Recommended Icon names: scissors, brush, flower, lotus, heart, spark, smile, leaf, star, calendar.\n"
            "- Typography detail: tracking-widest on eyebrows and small text, light font weights everywhere, premium boutique feel.\n"
        ),
    },
    "restaurant": {
        "name": "Warm and Inviting",
        "instructions": (
            "Theme: Artisanal texture & rich warmth.\n"
            "- Visuals: appetising, textured, welcoming. Warm gradients, rounded-3xl corners, organic shapes. Use .organic-mask-3 on hero food photography.\n"
            "- Hero: full-bleed imagery, high-impact centered headings, clear reservation / order CTA. Overlapping text welcome.\n"
            "- Typography clamps: h1 clamp(3rem, 7vw, 6rem) tracking-tight (use .serif-em for one phrase); h2 clamp(2.25rem, 4.5vw, 3.75rem); body 1.05rem leading-relaxed.\n"
            "- Navbar: `bg-header text-header-foreground` warm solid bar with elegant logo placement, or `bg-background/85 backdrop-blur text-foreground` for a softer look. Mega-menu for categories is fine — keep all nav text on the matching foreground token.\n"
            "- Rhythm: menu-like structure, layered elements, overlapping images, artisanal feel. Use Blob shape='c' in section corners with secondary tint.\n"
            "- Section order: Header → Hero → Menu Highlights (Services slot) → Story/About → Stats → Testimonials → Booking CTA → Footer.\n"
            "- Recommended Icon names: fork, knife, chef, cup, wine, leaf, heart, calendar, pin, clock, star.\n"
            "- Accents: secondary color for deep rich backgrounds, accent color for highlights.\n"
        ),
    },
    "legal": {
        "name": "Authoritative and Premium",
        "instructions": (
            "Theme: Sophisticated authority & classic excellence.\n"
            "- Visuals: stately, serious, high-end. Serif headlines, thin dividers, dark dominant palette. Avoid Blob shapes — restraint is the brand.\n"
            "- Hero: large bold headlines on a dark secondary background. Accent color used sparingly for prestige highlights. Classical 'pillar' layout fits.\n"
            "- Typography clamps: h1 clamp(2.5rem, 5vw, 4.5rem) font-display font-bold tracking-tight; h2 clamp(2rem, 3.75vw, 3rem); body 1.05rem leading-[1.7]. Use .serif-em only for a tagline phrase.\n"
            "- Navbar: conservative two-tier — a slim `bg-header text-header-foreground` top contact bar, then a `bg-background text-foreground` main nav with thin border-b-border below. Keep foreground classes on every element of each bar.\n"
            "- Rhythm: linear, credentials-forward, wide layouts, large text blocks.\n"
            "- Section order: Header → Hero → Practice Areas (Services) → Process → Team/About → Accreditations → Testimonials → Consultation CTA → Footer.\n"
            "- Recommended Icon names: gavel, scale, book, briefcase, shield, certificate, award, building, check.\n"
            "- Details: sharp corners (rounded-md max), gold/accent borders (border-l-2), zero rounded-3xl/rounded-full.\n"
        ),
    },
    "tech": {
        "name": "Modern Tech Startup",
        "instructions": (
            "Theme: Digital innovation & glassmorphism.\n"
            "- Visuals: sleek, vibrant, futuristic. Glassmorphism (bg-white/10 backdrop-blur), neon glows (.glow-primary / .glow-accent), dark accent gradients.\n"
            "- Hero: gradient headlines (text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent), large modern type, interactive-feeling buttons. 3D-card effect welcome. Use Blob shape='a' + 'd' at large size, low opacity behind hero.\n"
            "- Typography clamps: h1 clamp(3rem, 7vw, 6.5rem) font-bold tracking-tighter; h2 clamp(2.25rem, 4.5vw, 3.75rem); body 1rem leading-relaxed.\n"
            "- Navbar: glassmorphic floating bar — `bg-background/60 backdrop-blur-xl text-foreground` with a subtle border-border/30. Wordmark uses text-heading. Subtle animated hovers.\n"
            "- Rhythm: non-standard grids, asymmetric layouts, varied section heights. Grid patterns / tech motifs.\n"
            "- Section order: Header → Hero → Stats → Services/Features → Process → Testimonials → Pricing or CTA Banner → Footer.\n"
            "- Recommended Icon names: laptop, cpu, cloud, code, lock, bolt, spark, zap, cog, shield, grid.\n"
            "- Details: rounded-2xl throughout, smooth hover transitions, hover:scale-[1.02] on cards.\n"
        ),
    },
    "medical": {
        "name": "Clean and Caring",
        "instructions": (
            "Theme: Bright clinical & friendly professionalism.\n"
            "- Visuals: pristine, safe, welcoming. Lots of white space, soft primary blue/green tones, rounded-full pill shapes.\n"
            "- Hero: professional + friendly with team photography wrapped in .organic-mask and very clear 'Book Now' CTAs above the fold. Float 2 .sticker badges on the hero photo with credentials/awards. Split-layout with trust-card overlay works well.\n"
            "- Typography clamps: h1 clamp(2.5rem, 5.5vw, 4.75rem) font-bold tracking-tight; h2 clamp(2rem, 4vw, 3.25rem); body 1.05rem leading-[1.7].\n"
            "- Navbar: high-accessibility `bg-background text-foreground` with a shadow-sm on scroll. Emergency-contact button uses bg-primary text-primary-foreground rounded-full and is visually prominent.\n"
            "- Rhythm: simple panels for services, expertise badges, easy navigation. Use .promise tiles with rounded-3xl override.\n"
            "- Section order: Header → Hero → Services → Team → Promises/Why-Us → Reviews → FAQ → Book Now CTA → Footer.\n"
            "- Recommended Icon names: stethoscope, cross, tooth, pulse, heart, shield, smile, calendar, clock, phone, user, users.\n"
            "- Details: soft shadows (.surface-card default), light-tinted borders, avoid harsh contrast.\n"
        ),
    },
    "construction": {
        "name": "Strong and Reliable",
        "instructions": (
            "Theme: Heavy-duty structural & bold scale.\n"
            "- Visuals: strong, large-scale, impactful. Massive typography (text-7xl+), bold block colors, industrial iconography.\n"
            "- Hero: full-width construction imagery, heavy headlines, high-visibility CTAs. Brutalist grid fits. Avoid .organic-mask — keep image edges hard rectangles.\n"
            "- Typography clamps: h1 clamp(3rem, 8vw, 7rem) font-black tracking-tighter uppercase; h2 clamp(2.5rem, 5vw, 4.5rem) font-black uppercase; body 1.05rem font-medium.\n"
            "- Navbar: strong and functional — `bg-primary text-primary-foreground` thick bar with bold uppercase nav items. Every link inside the nav uses text-primary-foreground (or /80 opacity variant).\n"
            "- Rhythm: alternating primary/secondary blocks, large-format imagery as dividers. Use .numeral-anchor (01, 02, 03…) as oversized faded numerals before each major section.\n"
            "- Section order: Header → Hero → Stats → Services/Capabilities → Process → Portfolio/Past Projects → Testimonials → Quote CTA → Footer.\n"
            "- Recommended Icon names: hammer, wrench, hardhat, saw, ruler, truck, building, cog, shield, check.\n"
            "- Details: hard corners (rounded-none / rounded-md max), prominent bold borders (border-2 / border-4), zero rounded-full.\n"
        ),
    },
    "cleaning": {
        "name": "Fresh and Spotless",
        "instructions": (
            "Theme: Sparkling freshness & organised space.\n"
            "- Visuals: bright, high-contrast, organised. Plenty of whitespace, fresh primary/accent highlights.\n"
            "- Hero: bright airy with a clean before/after or high-quality service image. Simple headlines, wave-style dividers welcome. Use Blob shape='b' for a soft accent wash.\n"
            "- Typography clamps: h1 clamp(2.5rem, 6vw, 5rem) font-bold tracking-tight; h2 clamp(2rem, 4vw, 3.5rem); body 1rem leading-relaxed.\n"
            "- Navbar: fresh and light — `bg-background text-foreground` with a thin border-b-border. 'Request Quote' button uses bg-primary text-primary-foreground rounded-full.\n"
            "- Rhythm: orderly grids, .check-list features, light sections with clean horizontal dividers. Alternate .bg-background / .bg-section-alt.\n"
            "- Section order: Header → Hero → Promises → Services → Process → Stats → Testimonials → Quote CTA → Footer.\n"
            "- Recommended Icon names: broom, spray, sparkle, bucket, leaf, drop, check, smile, shield, clock.\n"
            "- Details: rounded-xl corners, thin precise borders, plenty of .check-list usage.\n"
        ),
    },
    "default": {
        "name": "Modern Professional",
        "instructions": (
            "Theme: Clean modernism & versatile layout.\n"
            "- Visuals: balanced, professional, visually engaging. Mix rounded corners and clean lines.\n"
            "- Hero: dynamic layout (split or centered) with strong brand integration, varied heights. Wrap hero photo with .organic-mask.\n"
            "- Typography clamps: h1 clamp(2.5rem, 6vw, 5rem) font-bold tracking-tight; h2 clamp(2rem, 4vw, 3.25rem); body 1rem leading-relaxed.\n"
            "- Navbar: versatile clean — `bg-background/90 backdrop-blur text-foreground` with a subtle border-b on scroll. CTA button uses bg-primary text-primary-foreground.\n"
            "- Rhythm: engaging flow, varied section types, clear hierarchy.\n"
            "- Section order: Header → Hero → Promises → Services → Process → Testimonials → Stats → CTA → Footer.\n"
            "- Recommended Icon names: shield, spark, smile, star, check, phone, mail, pin, clock, building.\n"
            "- Details: modern shadows (.surface-card defaults), smooth transitions, rounded-xl/-2xl.\n"
        ),
    },
}


def get_design_personality(industry: str) -> dict:
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


def get_industry_images(industry: str, user_images: list | None = None) -> list:
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
    hex_color = hex_color.lstrip("#")
    r, g, b = (int(hex_color[i : i + 2], 16) / 255 for i in (0, 2, 4))
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    return f"{round(h * 360)} {round(s * 100)}% {round(l * 100)}%"


def _srgb_to_linear(c: float) -> float:
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4


def relative_luminance(hex_color: str) -> float:
    """WCAG 2.x relative luminance (0..1)."""
    hex_color = hex_color.lstrip("#")
    r, g, b = (int(hex_color[i : i + 2], 16) / 255 for i in (0, 2, 4))
    r, g, b = _srgb_to_linear(r), _srgb_to_linear(g), _srgb_to_linear(b)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast_ratio(hex_a: str, hex_b: str) -> float:
    la, lb = relative_luminance(hex_a), relative_luminance(hex_b)
    light, dark = (la, lb) if la > lb else (lb, la)
    return (light + 0.05) / (dark + 0.05)


def is_dark(hex_color: str) -> bool:
    """True when white text contrasts better than black against this color."""
    return contrast_ratio(hex_color, "#FFFFFF") >= contrast_ratio(hex_color, "#000000")


def best_foreground_hsl(hex_color: str) -> str:
    """Pick white or near-black foreground for max contrast against hex_color."""
    return "0 0% 100%" if is_dark(hex_color) else "0 0% 10%"


def build_design_tokens(branding_colors: dict) -> dict:
    primary_hex = branding_colors.get("primary", "#2563EB")
    secondary_hex = branding_colors.get("secondary", "#1E3A5F")
    accent_hex = branding_colors.get("accent", "#10B981")
    background_hex = branding_colors.get("background", "#FFFFFF")
    text_hex = branding_colors.get("text", "#333333")
    text_heading_hex = branding_colors.get("textHeading", "#111111")

    primary_hsl = hex_to_hsl(primary_hex)
    secondary_hsl = hex_to_hsl(secondary_hex)
    accent_hsl = hex_to_hsl(accent_hex)
    background_hsl = hex_to_hsl(background_hex)
    text_hsl = hex_to_hsl(text_hex)
    text_heading_hsl = hex_to_hsl(text_heading_hex)

    primary_fg = best_foreground_hsl(primary_hex)
    secondary_fg = best_foreground_hsl(secondary_hex)
    accent_fg = best_foreground_hsl(accent_hex)

    # Navbar gets its own pair: secondary as the surface, plus an explicit
    # foreground guaranteed to clear WCAG AA against it. If the user's body-text
    # color happens to be readable on secondary too, we keep using it so the
    # navbar still feels brand-consistent; otherwise we fall back to the
    # computed white/black foreground.
    if contrast_ratio(text_hex, secondary_hex) >= 4.5:
        header_fg_hsl = text_hsl
    else:
        header_fg_hsl = secondary_fg

    def get_tint(hsl_str, lum=97):
        parts = hsl_str.split()
        return f"{parts[0]} {parts[1]} {lum}%"

    secondary_tint = get_tint(secondary_hsl)
    background_alt = (
        get_tint(background_hsl, 95)
        if not is_dark(background_hex)
        else get_tint(background_hsl, 15)
    )

    return {
        "--background": background_hsl,
        "--foreground": text_hsl,
        "--card": background_hsl,
        "--card-foreground": text_hsl,
        "--popover": background_hsl,
        "--popover-foreground": text_hsl,
        "--primary": primary_hsl,
        "--primary-foreground": primary_fg,
        "--secondary": secondary_hsl,
        "--secondary-foreground": secondary_fg,
        "--muted": background_alt,
        "--muted-foreground": text_hsl,
        "--accent": accent_hsl,
        "--accent-foreground": accent_fg,
        "--border": primary_hsl,
        "--input": primary_hsl,
        "--ring": primary_hsl,
        "--section-alt": secondary_tint,
        "--cta-glow": accent_hsl,
        "--hero-overlay": secondary_hsl,
        "--warm-bg": background_hsl,
        "--heading": text_heading_hsl,
        "--header": secondary_hsl,
        "--header-foreground": header_fg_hsl,
    }


def inject_design_tokens(css_content: str, tokens: dict) -> str:
    for var_name, hsl_value in tokens.items():
        pattern = rf"({re.escape(var_name)}:\s*)[^;]+"
        replacement = rf"\g<1>{hsl_value}"
        css_content = re.sub(pattern, replacement, css_content)
    return css_content


def choose_fonts(industry: str) -> tuple:
    industry_lower = industry.lower()
    if any(w in industry_lower for w in ["law", "legal", "finance", "accounting", "consult"]):
        return (
            "Playfair Display",
            "Source Sans 3",
            "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Source+Sans+3:wght@300;400;500;600;700&display=swap",
        )
    elif any(w in industry_lower for w in ["tech", "software", "digital", "it ", "cyber", "data"]):
        return (
            "Space Grotesk",
            "Inter",
            "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
        )
    elif any(w in industry_lower for w in ["beauty", "spa", "salon", "wellness", "yoga", "luxury"]):
        return (
            "Cormorant Garamond",
            "Jost",
            "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Jost:wght@300;400;500;600&display=swap",
        )
    elif any(w in industry_lower for w in ["restaurant", "food", "cafe", "bakery", "catering"]):
        return (
            "Fraunces",
            "DM Sans",
            "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap",
        )
    elif any(w in industry_lower for w in ["electric", "construct", "build", "engineer", "plumb", "hvac", "trade"]):
        return (
            "Barlow Condensed",
            "Barlow",
            "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@300;400;500;600;700&display=swap",
        )
    elif any(w in industry_lower for w in ["health", "medical", "dental", "clinic", "care", "physio"]):
        return (
            "Nunito",
            "Nunito",
            "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap",
        )
    else:
        return (
            "Plus Jakarta Sans",
            "Plus Jakarta Sans",
            "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap",
        )


def inject_fonts(css_content: str, google_fonts_url: str, display_font: str, body_font: str) -> str:
    css_content = re.sub(
        r"@import url\(['\"]https://fonts\.googleapis\.com[^)]+\)['\"];",
        f"@import url('{google_fonts_url}');",
        css_content,
    )

    font_vars = f'    --font-display: "{display_font}", serif;\n    --font-sans: "{body_font}", sans-serif;\n'
    css_content = re.sub(
        r"(:root\s*\{)",
        r"\1\n" + font_vars,
        css_content,
        count=1,
    )
    return css_content


def update_tailwind_config_fonts(tailwind_config: str, display_font: str, body_font: str) -> str:
    """Patch tailwind.config.ts fontFamily.sans / display to match brand fonts."""
    tailwind_config = re.sub(
        r'sans:\s*\[[^\]]*\]',
        f'sans: ["{body_font}", "system-ui", "sans-serif"]',
        tailwind_config,
        count=1,
    )
    tailwind_config = re.sub(
        r'display:\s*\[[^\]]*\]',
        f'display: ["{display_font}", "Georgia", "serif"]',
        tailwind_config,
        count=1,
    )
    return tailwind_config


def inject_extra_utilities(css_content: str) -> str:
    extra_css = """
@layer utilities {
  .text-heading {
    color: hsl(var(--heading));
  }
  .bg-section-alt {
    background-color: hsl(var(--section-alt));
  }
  .bg-warm-bg {
    background-color: hsl(var(--warm-bg));
  }
}
"""
    if ".text-heading" not in css_content:
        css_content += extra_css
    return css_content


# ─────────────────────────────────────────────────────────
# Scaffold copy
# ─────────────────────────────────────────────────────────


def copy_scaffold(dest_dir: str) -> bool:
    """Copy the bundled minimal Vite + React + Tailwind + shadcn scaffold into dest_dir."""
    if not os.path.isdir(SCAFFOLD_DIR):
        logger.error(f"Scaffold directory missing: {SCAFFOLD_DIR}")
        return False
    try:
        shutil.copytree(SCAFFOLD_DIR, dest_dir)
        logger.info(f"Scaffold copied to {dest_dir}")
        return True
    except Exception as e:
        logger.error(f"Scaffold copy failed: {e}")
        return False


def update_index_html(project_dir: str, application_data: dict) -> None:
    """Rewrite <title>, meta description, og tags, author in index.html."""
    index_path = os.path.join(project_dir, "index.html")
    if not os.path.exists(index_path):
        return

    with open(index_path, "r", encoding="utf-8") as f:
        html = f.read()

    company = application_data.get("company_name", "")
    industry = application_data.get("industry", "")
    location = application_data.get("city_location", "")
    tagline = application_data.get("tagline") or f"{industry.title()} services in {location}".strip()
    phone = application_data.get("phone_number", "")

    title = f"{company} — {tagline}" if tagline else company
    description = (
        f"{company}: {tagline}. "
        f"Serving {location}. "
        f"Call {phone}." if phone else f"{company}: {tagline}. Serving {location}."
    )

    html = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", html, count=1, flags=re.DOTALL)
    html = re.sub(
        r'<meta name="description" content=".*?"\s*/?>',
        f'<meta name="description" content="{description}" />',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta name="author" content=".*?"\s*/?>',
        f'<meta name="author" content="{company}" />',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta property="og:title" content=".*?"\s*/?>',
        f'<meta property="og:title" content="{title}" />',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta property="og:description" content=".*?"\s*/?>',
        f'<meta property="og:description" content="{description}" />',
        html,
        count=1,
    )
    # Strip any Lovable/AI favicon links — only allow local /favicon.ico
    html = re.sub(
        r'<link[^>]*rel="icon"[^>]*href="https?://[^"]+"[^>]*/?>',
        '<link rel="icon" type="image/x-icon" href="/favicon.ico" />',
        html,
    )

    with open(index_path, "w", encoding="utf-8") as f:
        f.write(html)


# ─────────────────────────────────────────────────────────
# Claude — generate site from scratch
# ─────────────────────────────────────────────────────────


# Path-safety: Claude returns relative paths; we only accept these subtrees.
ALLOWED_PATH_PREFIXES = (
    "src/pages/",
    "src/components/",
    "src/sections/",
    "src/lib/",
    "src/hooks/",
    "src/data/",
)
ALLOWED_EXTENSIONS = (".tsx", ".ts", ".css")
# Files Claude is NOT allowed to overwrite — these are scaffold-locked.
PROTECTED_PATHS = {
    "src/main.tsx",
    "src/App.tsx",
    "src/index.css",
    "src/vite-env.d.ts",
    "src/lib/utils.ts",
    "src/pages/NotFound.tsx",
    "src/components/Icon.tsx",
    "src/components/Blob.tsx",
    "package.json",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "vite.config.ts",
    "tailwind.config.ts",
    "postcss.config.js",
    "components.json",
    "eslint.config.js",
    "index.html",
}


def _safe_relpath(rel_path: str) -> str | None:
    """Return a normalised, scaffold-safe relative path, or None if disallowed."""
    rel_path = rel_path.replace("\\", "/").lstrip("/")
    norm = os.path.normpath(rel_path).replace("\\", "/")
    if norm.startswith("..") or os.path.isabs(norm):
        return None
    if norm in PROTECTED_PATHS:
        return None
    if not norm.startswith(ALLOWED_PATH_PREFIXES):
        return None
    # Block writes into the shadcn ui directory (preserved as-is from scaffold)
    if norm.startswith("src/components/ui/"):
        return None
    if not norm.endswith(ALLOWED_EXTENSIONS):
        return None
    return norm


SHADCN_UI_AVAILABLE = [
    "accordion", "alert", "alert-dialog", "aspect-ratio", "avatar", "badge",
    "breadcrumb", "button", "calendar", "card", "carousel", "checkbox",
    "collapsible", "command", "dialog", "drawer", "dropdown-menu", "form",
    "hover-card", "input", "label", "popover", "progress", "radio-group",
    "scroll-area", "select", "separator", "sheet", "skeleton", "slider",
    "switch", "table", "tabs", "textarea", "tooltip",
]


CREATIVE_TWISTS = [
    "Use large overlapping text that breaks section boundaries.",
    "Incorporate subtle geometric background patterns via CSS gradients.",
    "Use asymmetric grid layouts for every image/text pairing.",
    "Apply a glassmorphism effect to at least two key sections.",
    "Use bold vertical typography for section labels.",
    "Lean into brutalist thick borders and hard shadows.",
    "Use extreme airy whitespace (py-40+) between major sections.",
    "Use organic blob shapes for image masks or backgrounds.",
    "Use a sticky side-rail navigation instead of a top bar.",
    "Use marquee / ticker strips of text or logos between sections.",
    "Use oversized numerals (01, 02, 03) as section anchors.",
    "Use rotated text or rotated photo frames for personality.",
    "Use a horizontal scroll snap section for a visual gallery or testimonials.",
    "Use a split hero with one half image, one half color block.",
    "Use a full-bleed video-style background image with parallax-feeling overlays.",
]


FRONTEND_EXCELLENCE_GUIDE = """
━━━ UNIVERSAL MODERN FRONTEND STANDARDS ━━━

LAYOUT
- Sections breathe — py-20 md:py-28 lg:py-32 minimum, never py-8 or less.
- Content width: max-w-7xl mx-auto with px-6 sm:px-8.
- Mobile-first grids: grid-cols-1 → md:grid-cols-2 → lg:grid-cols-3 (or -4 for .promise tiles).
- Experiment with asymmetric layouts, overlapping elements, full-bleed sections.
- Wrap any section that hosts a <Blob> with `relative overflow-hidden`; give the inner content `relative z-10`.

TYPOGRAPHY
- One display size per section, text-4xl–text-8xl font-black for hero/section headings.
- Use the typography clamps specified in the DESIGN PERSONALITY block — they override the generic text-* sizes when set.
- Subheads: text-xl–text-3xl font-bold tracking-tight.
- Body: text-base–text-xl font-medium leading-relaxed.
- Eyebrows: prefer `<span className="eyebrow"><span className="dot" /> LABEL</span>` over hand-rolled small-caps.
- Use `<span className="serif-em">…</span>` to italicise one phrase inside a display heading — adds personality without changing the whole font.

SURFACES
- Prefer the ready-made classes: `.surface-card`, `.promise`, `.step`, `.review` — they handle border + shadow + hover lift already.
- Custom cards: rounded-3xl or rounded-[2rem], shadow-sm hover:shadow-2xl transition-all duration-500, border border-border/40.
- Card hover: hover:-translate-y-2 (already in .surface-card / .promise — don't double-apply).

BUTTONS
- Primary CTA: large, rounded-full or rounded-2xl, py-5 px-10, shadow-xl, `bg-primary text-primary-foreground`.
- Always include hover:scale-105 active:scale-95.
- Hero has at least 2 CTAs above the fold (primary phone + secondary WhatsApp/email).
- Wrap WhatsApp/chat floating button in `.bob` for a subtle bobbing animation.

IMAGES
- object-cover with varied aspect ratios (aspect-[4/5], aspect-square, aspect-video).
- Wrap the primary hero image with one of `.organic-mask` / `.organic-mask-2` / `.organic-mask-3` for an irregular border-radius (except construction/legal, which keep hard rectangles).
- Background images get a deep gradient overlay for text readability — `bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent`.
- Lazy-load: <img loading="lazy" />.

STICKER / TRUST-BADGE PATTERN (use on hero photo)
- Position two .sticker elements absolutely over the hero image — one top-right, one bottom-left.
- Each contains a .sticker__ic (filled icon square) + a 2-line label (strong + span).
- Optional `.glow-primary` or `.glow-accent` around the icon square for emphasis.
- Example:
  <div className="sticker absolute -top-4 -right-6"><span className="sticker__ic"><Icon name="shield" size={18} /></span><div><strong>Gas Safe</strong><span className="block text-xs">Register 1234</span></div></div>

ANIMATIONS
- framer-motion: use ONLY for (a) hero text/image reveal (initial → animate, stagger 80-120ms), (b) section scroll-in (whileInView, viewport once), (c) hover micro-interactions on cards. Don't animate every section.
- Plain CSS classes for: .bob (floating CTA), .marquee (logos ticker), hover transforms (hover:scale-, hover:-translate-y-).
- All interactives: transition-all duration-300 ease-out.
- Icon containers: hover:scale-110 transition-transform.
- Link underlines via after:absolute pseudo-element or border-b on hover.

STATS
- Use `.stat-block` with `.stat-block__num` + `.stat-block__label`.
- Numbers are colored, NEVER beige — the class already paints them in primary.
- Stars in yellow/amber: `<Icon name="star" color="#ffb800" />`.

DATA LAYER
- Always import from `@/data/site` — never inline arrays in JSX.
- Section components receive data via imports, not props (unless a child component needs a single item).
- Map services/promises/testimonials/process/etc. inside the section component itself.

FOOTER (required section)
- Use the matching foreground for whichever bg you pick: `bg-secondary text-secondary-foreground` is the safest default; `bg-foreground text-background` for darker brands.
- Layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-4. Columns: brand+tagline+socials, services links, service-areas, contact.
- Bottom strip: thin border-t border-current/20, copyright + credentials in muted opacity.
- Socials use Icon names: facebook, instagram, twitter, linkedin, youtube, tiktok — only render the ones in site.socials[].

UNIQUENESS
- Every site must have a unique visual rhythm. Avoid generic light-dark-light banding.
- Reorder, restructure, recolour sections to fit the industry and brand.
- Use the design personality's typography clamps and section order — do NOT default to a one-size-fits-all hero+three-card grid.
"""


def _build_system_prompt(
    application_data: dict,
    design_personality: dict,
    image_urls: list,
    layout_strategy: str,
    creative_twist: str,
    display_font: str,
    body_font: str,
) -> str:
    branding = application_data.get("branding_colors", {}) or {}
    primary_hex = branding.get("primary", "#2563EB")
    secondary_hex = branding.get("secondary", "#1E3A5F")
    accent_hex = branding.get("accent", "#10B981")
    background_hex = branding.get("background", "#FFFFFF")
    text_hex = branding.get("text", "#333333")
    heading_hex = branding.get("textHeading", "#111111")

    image_list_str = "\n".join(f"  Image {i + 1}: {url}" for i, url in enumerate(image_urls))
    shadcn_list = ", ".join(SHADCN_UI_AVAILABLE)

    return f"""You are an award-winning React/TypeScript developer and brand designer. You design and build BESPOKE marketing websites — every site you build looks completely different from the last. There is no template. There is no shared skeleton. You decide the section count, section order, section names, layout, and visual rhythm based on the brand and industry.

━━━ YOUR JOB ━━━
Design and code a complete, beautiful, single-page marketing site for the business described in the user message. The site must look bespoke and premium — not like a "site template with new content".

━━━ HARD CONSTRAINTS ON OUTPUT ━━━
You will return a SINGLE raw JSON object. Keys are file paths, values are complete file contents.

Required key:
- "src/pages/Index.tsx" — the homepage. Must export default a React component.

Optional keys (create freely as needed):
- "src/components/<YourComponentName>.tsx" — any section/feature components you want.
- "src/sections/<YourSectionName>.tsx" — alternative location for section components.
- "src/lib/<helper>.ts" — small TypeScript helpers (no runtime deps beyond what is already in package.json).
- "src/hooks/<useThing>.ts" / ".tsx" — custom hooks.

You may NOT create or overwrite: package.json, vite.config.ts, tailwind.config.ts, tsconfig*, index.html, src/main.tsx, src/App.tsx, src/index.css, src/lib/utils.ts, src/pages/NotFound.tsx, src/components/Icon.tsx, src/components/Blob.tsx, anything inside src/components/ui/.

━━━ TECH AVAILABLE ━━━
- React 18 with TypeScript and JSX.
- Tailwind CSS 3 (with brand CSS variables wired below).
- lucide-react icons — available, but PREFER the bundled custom Icon below.
- framer-motion — use sparingly for hero reveals, scroll-in fades, and hover micro-interactions. Plain CSS transitions handle the rest.
- react-router-dom — already wired in App.tsx, the homepage is at "/".
- shadcn/ui primitives are available at "@/components/ui/<name>": {shadcn_list}.
  Import example: import {{ Button }} from "@/components/ui/button";
- "@" path alias points to "src".

━━━ BUNDLED SITE COMPONENTS (use these — they're already in src/components/) ━━━
- `@/components/Icon` — a hand-crafted SVG icon system with a curated set of names that match real-world trades & professions. Prefer this over lucide-react when an industry-specific icon exists, because it gives the site a bespoke, on-brand feel.
  Import: `import Icon from "@/components/Icon";`
  Usage: `<Icon name="boiler" size={28} />` · default color is currentColor.
  Available names (use the closest match — don't invent names that aren't in this list):
    Contact:   phone, whatsapp, mail, pin, clock, calendar, globe
    UI:        arrow, arrowR, arrowL, arrowDown, arrowUp, check, plus, minus, menu, close
    Trust:     star, shield, award, certificate, badge, spark, smile, heart, leaf, thumbsUp
    People:    user, users, quote
    Social:    facebook, instagram, twitter, youtube, tiktok, linkedin
    Plumbing:  boiler, drop, radiator, bath, pipes, faucet, salt
    Electrical: bolt, plug, bulb, battery, zap
    Trades:    hammer, wrench, hardhat, saw, ruler, truck
    Beauty:    scissors, brush, flower, lotus
    Restaurant: fork, knife, chef, cup, wine
    Legal:     gavel, scale, book, briefcase
    Medical:   stethoscope, cross, tooth, pulse
    Tech:      laptop, cpu, cloud, code, lock
    Cleaning:  broom, spray, sparkle, bucket
    Utility:   grid, cog, building, home

- `@/components/Blob` — decorative organic SVG shape. Place behind hero content / section corners for soft brand colour washes. Uses absolute positioning — wrap the parent in `relative overflow-hidden`.
  Import: `import Blob from "@/components/Blob";`
  Props: `shape` ("a" | "b" | "c" | "d"), `color` (CSS color, e.g. `"hsl(var(--primary) / 0.18)"`), `size` (px), `className`.
  Example: `<Blob shape="b" color="hsl(var(--accent) / 0.18)" size={520} className="blob-decor -top-20 -right-20" />`

━━━ READY-MADE UTILITY CLASSES (in src/index.css — use them, don't re-invent) ━━━
Component classes (already wired to brand colours):
- `.eyebrow` — small uppercase pill label above section headings. Add `<span class="dot" />` for the bullet. Use `.eyebrow-accent` modifier for accent colour.
- `.section-head` — centred max-width 720px heading block (eyebrow + h2 + p).
- `.serif-em` — italic serif span; use to emphasise one phrase inside a display heading.
- `.surface-card` — generic white card with subtle border + hover lift.
- `.promise` — value-prop tile with `.promise__ic` (filled icon square).
- `.step` — numbered process step with `.step__num` and optional `.step__connector` line.
- `.review` — testimonial card with `.review__stars`, `.review__text`, `.review__by` (name + meta).
- `.stat-block` — `.stat-block__num` + `.stat-block__label` (big number, small label).
- `.sticker` — floating trust badge over a hero photo. `.sticker__ic` (filled square) supports `.sticker__ic--accent`.
- `.tag` — small pill chip; `.tag--accent` for accent colour.
- `.check-list` — `<ul>` with auto-rendered checkmark bullets.

Utility classes:
- `.text-heading` (heading colour), `.bg-section-alt`, `.bg-warm-bg`.
- `.organic-mask`, `.organic-mask-2`, `.organic-mask-3` — irregular border-radius image crops.
- `.blob-decor` — absolute-positioned + pointer-events-none helper for `<Blob>`.
- `.marquee` — horizontal infinite scroll strip (set parent overflow-hidden, render content twice).
- `.bob` — gentle floating animation for CTAs / chat bubbles.
- `.glow-primary`, `.glow-accent` — soft coloured ring + shadow.
- `.numeral-anchor` — oversized faded display numeral (01, 02, 03…) as visual anchor.

CSS variables also exposed: `--r-sm/--r/--r-lg/--r-xl/--r-pill`, `--shadow-sm/--shadow/--shadow-lg/--shadow-glow`, `--t/--t-fast/--t-slow`, `--container`, `--header-h`. You may consume them in inline styles or new component styles.

━━━ BRAND COLORS (wired to Tailwind via CSS variables) ━━━
Use the Tailwind tokens — DO NOT hardcode hex values. The CSS variables are populated server-side.
- bg-background, text-foreground   (page surface + body text)
- text-heading                      (heading color)
- bg-primary, text-primary, border-primary, text-primary-foreground
- bg-secondary, text-secondary, text-secondary-foreground
- bg-accent, text-accent, text-accent-foreground
- bg-header, text-header-foreground (navbar surface + navbar text — guaranteed AA contrast)
- bg-section-alt, bg-warm-bg, bg-muted
- border-border, ring-ring

Reference hex (for understanding contrast — DO NOT use directly in className):
  Primary {primary_hex} · Secondary {secondary_hex} · Accent {accent_hex}
  Background {background_hex} · Body text {text_hex} · Heading text {heading_hex}

━━━ CONTRAST RULES (NON-NEGOTIABLE) ━━━
Every bg-X token has a matching text-X-foreground token. When you set a colored background, you MUST pair it with the matching foreground class so text stays readable. Never set a colored background and leave the text to inherit the page foreground — that is how dark-on-dark bugs happen.

REQUIRED pairings (memorise these):
- bg-primary    → text-primary-foreground    on every element inside it
- bg-secondary  → text-secondary-foreground
- bg-accent     → text-accent-foreground
- bg-header     → text-header-foreground
- bg-background → text-foreground (or text-heading for headings)

For the NAVBAR / header specifically, pick ONE of these three patterns and stick to it for all nav text, links, and the logo wordmark inside the nav:
  (a) bg-background/80 backdrop-blur with text-foreground links and a text-heading wordmark — a light, floating nav.
  (b) bg-header text-header-foreground — a branded solid nav. Every link, button label, and the wordmark inside the nav must use text-header-foreground (or a /80 opacity variant of it). Borders inside the nav use border-header-foreground/20.
  (c) bg-primary text-primary-foreground — a bold primary-colored nav, same foreground rule.
NEVER mix: don't put text-foreground inside bg-header, don't put text-secondary-foreground inside bg-primary, etc. If you need a muted nav link, use the matching foreground class at reduced opacity (e.g. text-header-foreground/70), not a different color token.

Fonts already loaded: display = "{display_font}", body = "{body_font}". Use `font-display` for headlines and the default sans for body.

━━━ DESIGN PERSONALITY: {design_personality["name"]} ━━━
{design_personality["instructions"]}

━━━ LAYOUT STRATEGY: {layout_strategy} ━━━
You MUST shape the page's narrative flow around this strategy.

━━━ CREATIVE TWIST: {creative_twist} ━━━
You MUST work this twist into at least one prominent part of the page.

━━━ IMAGES TO USE ━━━
You MUST use these image URLs everywhere you need imagery. Do NOT invent image URLs. Do NOT use placeholders. Distribute them across the page.
{image_list_str}

For <img>: src="{{IMAGE_URL}}" alt="meaningful alt text" loading="lazy"
For background: style={{{{ backgroundImage: `url('{{IMAGE_URL}}')` }}}}

{FRONTEND_EXCELLENCE_GUIDE}

━━━ DATA LAYER (REQUIRED) ━━━
You MUST create `src/data/site.ts` exporting typed constants the homepage and sub-components consume. Do NOT inline arrays of services / testimonials / promises inside JSX — define them as data and `.map()` over them in components. Suggested shape (adapt field names to the brand):

```ts
export const site = {{
  name: "...", tagline: "...", phone: "...", phoneHref: "tel:...",
  email: "...", address: "...", whatsapp: "https://wa.me/...",
  serviceArea: "...", yearsExperience: 10, credentials: ["...", "..."],
  socials: [{{ name: "instagram", href: "..." }}],
}};
export const promises = [{{ icon: "shield", title: "...", text: "..." }}, ...];
export const services = [{{ slug: "...", title: "...", short: "...", icon: "...", bullets: ["..."] }}, ...];
export const process = [{{ step: "01", title: "...", text: "..." }}, ...];
export const accreditations = [{{ name: "...", note: "...", icon: "..." }}, ...];
export const testimonials = [{{ name: "...", area: "...", rating: 5, text: "..." }}, ...];
export const stats = [{{ value: "10+", label: "years" }}, ...];
```

Then `import {{ site, services, promises, ... }} from "@/data/site";` in Index.tsx and any section component.

━━━ SECTION COMPOSITION (REQUIRED) ━━━
The homepage MUST have at least 7 distinct sections. Pick from the menu below — your layout strategy dictates the ORDER, your design personality dictates the STYLE, but the menu items are the building blocks. Build each as a standalone component in `src/components/sections/` (or `src/sections/`) and compose them inside Index.tsx.

MENU (use AT LEAST 7 of these):
1. Header / Navbar — sticky, brand wordmark + 4-5 nav links + phone CTA. (REQUIRED)
2. Hero — headline, lede, 2 CTAs, trust strip (years / count / satisfaction), hero image with organic mask + 1-2 floating .sticker badges, optional .bob WhatsApp/chat bubble. (REQUIRED)
3. Promises / Why-Us — grid-cols-2 lg:grid-cols-4 of .promise tiles with Icon + title + 1-line text.
4. Services — grid-cols-1 md:grid-cols-2 lg:grid-cols-3 of service cards mapped from `services[]`. Each card has Icon + title + short text + "Learn more →" affordance. Vary card backgrounds with subtle `bg-primary/5` / `bg-accent/5` tints.
5. Process / How It Works — 3-5 `.step` cards with `.step__num` numerals (01, 02, 03…). Connect with `.step__connector` or arrow icons.
6. Accreditations / Trust Strip — horizontal row of `.sticker`-style chips or logos, possibly inside `.marquee`.
7. Stats — 3-4 `.stat-block` items in a row (years, jobs done, customer rating).
8. Testimonials — grid of `.review` cards mapped from `testimonials[]`. Yellow/amber stars via Icon name="star".
9. About / Team — split layout: paragraph copy + team photo via `.organic-mask` and 2-3 credential `.sticker` badges floating around it.
10. FAQ — accordion (use shadcn Accordion) of 4-6 Q&A.
11. Service Areas — chip cloud of `.tag` items listing covered locations.
12. CTA Banner — full-width section in `bg-primary text-primary-foreground` or `bg-secondary text-secondary-foreground` with a final phone CTA + WhatsApp/email secondary.
13. Footer — REQUIRED. Multi-column (brand + tagline + socials, services links, areas, contact). Bottom strip with copyright + credentials.

Section header rule: every non-hero section MUST start with a `.section-head` containing an `.eyebrow` chip, an `<h2>` (use `.serif-em` to italicise one phrase), and a 1-2 sentence lede.

Section padding rule: `py-20 md:py-28 lg:py-32` minimum. Alternate `bg-background` and `bg-section-alt` (or a subtle `bg-primary/5`) for visual rhythm.

━━━ RULES ━━━
1. Index.tsx is the homepage; it imports section components and composes them top-to-bottom.
2. Every imported component file must be in your JSON output (or be a shadcn/ui primitive, or be one of the bundled `@/components/Icon` / `@/components/Blob` / `@/data/site`).
3. Imports must be valid: `import X from "@/components/X"` or `import {{ Button }} from "@/components/ui/button"`. Never invent shadcn components that aren't in the list above.
4. Apostrophes in JSX text → &apos; · Quotes in JSX text → &quot;
5. No diff, snippet, or partial files — every value is the COMPLETE file contents.
6. No markdown fences, no backticks, no explanation — only the raw JSON object.
7. Make the site look bespoke for THIS specific business — never feel like a generic trade template. Tailor copy, icon choices, and section names to the industry.
8. Do not use a `dark` class on the html/body — the scaffold is light-mode only by default.
9. Section count: 7-10 sections. Do NOT skimp.
10. Always include the bundled custom Icon for service tiles, promise tiles, footer, and CTAs. Reserve lucide-react for icons that are missing from the bundled set.
"""


def _build_user_prompt(application_data: dict, image_urls: list, design_personality: dict) -> str:
    image_list_str = "\n".join(f"  Image {i + 1}: {url}" for i, url in enumerate(image_urls))
    testimonials = application_data.get("testimonials", [])
    testimonials_str = (
        json.dumps(testimonials, indent=2) if isinstance(testimonials, list) else str(testimonials)
    )

    services_raw = application_data.get("services_list", "")
    if isinstance(services_raw, list):
        services_str = json.dumps(services_raw, indent=2)
    else:
        services_str = str(services_raw)

    trust_raw = application_data.get("trust_badges", "")
    if isinstance(trust_raw, list):
        trust_str = json.dumps(trust_raw, indent=2)
    else:
        trust_str = str(trust_raw)

    return f"""Build the homepage for this business.

Company Name: {application_data.get("company_name", "")}
Industry: {application_data.get("industry", "")}
Tagline / USP: {application_data.get("tagline", "")}
Phone Number: {application_data.get("phone_number", "")}
Primary Location: {application_data.get("city_location", "")}
Service Areas: {application_data.get("service_areas", application_data.get("city_location", ""))}
Years of Experience: {application_data.get("years_experience", "10+")}
Trust Badges / Credentials:
{trust_str}
Services Offered:
{services_str}
Testimonials:
{testimonials_str}

Design Personality: {design_personality["name"]}

Available image URLs (use ONLY these for imagery):
{image_list_str}

━━━ TURN THIS INTO `src/data/site.ts` ━━━
First, transcribe the data above into a typed `src/data/site.ts` module with these named exports:
- `site` — object with name, tagline, phone, phoneHref, email, address, whatsapp, serviceArea, yearsExperience, credentials[], socials[].
- `promises` — 4 items (`{{ icon, title, text }}`), inferred from the trust badges + USP if not explicit.
- `services` — one item per service in "Services Offered" (`{{ slug, title, short, long, bullets[], icon }}`). Choose `icon` from the bundled Icon name list that best matches each service.
- `process` — 3-5 numbered steps describing how a customer engages with this business.
- `accreditations` — derived from "Trust Badges / Credentials".
- `testimonials` — pass through the testimonials above; ensure each has `name`, `area` (or location), `rating` (default 5), `text`.
- `stats` — 3-4 numeric stats (years, jobs done, response time, satisfaction).
- `faqs` (optional) — 4-6 industry-appropriate Q&A entries.

Every other section component MUST import from `@/data/site` and `.map()` over the arrays — no inline hard-coded service lists.

Return ALL files as a single raw JSON object — keys are file paths, values are complete file contents. `src/data/site.ts` and `src/pages/Index.tsx` are both required. No markdown fences."""


def generate_site_files_with_claude(
    application_data: dict,
    design_personality: dict,
    image_urls: list,
    display_font: str,
    body_font: str,
) -> dict | None:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        logger.error("ANTHROPIC_API_KEY not found")
        return None

    client = anthropic.Anthropic(api_key=api_key)

    layout_strategy = random.choice(LAYOUT_STRATEGIES)
    creative_twist = random.choice(CREATIVE_TWISTS)

    system_prompt = _build_system_prompt(
        application_data,
        design_personality,
        image_urls,
        layout_strategy,
        creative_twist,
        display_font,
        body_font,
    )
    user_prompt = _build_user_prompt(application_data, image_urls, design_personality)

    try:
        logger.info(
            f"Calling Claude for from-scratch site generation "
            f"(personality={design_personality['name']}, layout={layout_strategy[:40]}…)"
        )
        # Streaming required: with max_tokens this high the SDK refuses the
        # non-streaming endpoint (>10 min budget). We still collect the full
        # text and use it the same way.
        with client.messages.stream(
            model="claude-sonnet-4-6",
            max_tokens=32000,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        ) as stream:
            text_parts = []
            for delta in stream.text_stream:
                text_parts.append(delta)
            final = stream.get_final_message()
        text = "".join(text_parts).strip()
        logger.info(f"Claude responded. Stop reason: {final.stop_reason}")

        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()

        raw_files = json.loads(text)

        if not isinstance(raw_files, dict):
            logger.error("Claude returned non-object JSON")
            return None

        # Validate paths and content
        cleaned: dict[str, str] = {}
        for rel_path, content in raw_files.items():
            if not isinstance(rel_path, str) or not isinstance(content, str):
                logger.warning(f"Skipping invalid entry: {rel_path!r}")
                continue
            safe = _safe_relpath(rel_path)
            if not safe:
                logger.warning(f"Skipping disallowed path from Claude: {rel_path}")
                continue
            cleaned[safe] = content

        if "src/pages/Index.tsx" not in cleaned:
            logger.error("Claude omitted src/pages/Index.tsx — aborting")
            return None

        return cleaned

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error: {e}")
        return None
    except Exception as e:
        logger.error(f"Claude API error: {e}")
        return None


def write_generated_files(project_dir: str, files: dict) -> None:
    written = 0
    for rel_path, content in files.items():
        # Defense-in-depth: re-validate paths at the write boundary, in case
        # an upstream caller fed an un-validated dict.
        safe = _safe_relpath(rel_path)
        if not safe:
            logger.warning(f"Refusing to write disallowed path: {rel_path}")
            continue
        abs_path = os.path.join(project_dir, safe)
        os.makedirs(os.path.dirname(abs_path), exist_ok=True)
        with open(abs_path, "w", encoding="utf-8") as f:
            f.write(content)
        written += 1
    logger.info(f"Wrote {written}/{len(files)} Claude-generated files into {project_dir}")


# ─────────────────────────────────────────────────────────
# Main entry point
# ─────────────────────────────────────────────────────────


def generate_website_code(application_data: dict, output_dir: str | None = None) -> str | None:
    """
    Copy the local scaffold, brand the CSS and Tailwind config in Python,
    then have Claude design and write Index.tsx + any components freely.

    application_data keys:
        company_name        — business name
        industry            — e.g. "electrical", "legal", "beauty salon"
        phone_number        — contact number
        city_location       — e.g. "Manchester, UK"
        services_list       — comma-separated or list
        testimonials        — list of {name, location, text}
        branding_colors     — dict: {primary, secondary, accent, background, text, textHeading} as hex
        uploaded_images     — (optional) list of image URLs from user uploads
        years_experience    — (optional)
        trust_badges        — (optional)
        service_areas       — (optional) list of local areas
        tagline             — (optional)
    """
    if isinstance(application_data, str):
        try:
            application_data = json.loads(application_data)
        except Exception:
            logger.error("application_data is a string but not valid JSON")
            return None

    if output_dir is None:
        output_dir = tempfile.mkdtemp(prefix="website_")

    project_dir = os.path.join(output_dir, "project")

    # 1. Copy local scaffold
    if not copy_scaffold(project_dir):
        return None

    # 2. Resolve industry context
    industry = application_data.get("industry", "")
    user_images = application_data.get("uploaded_images", []) or []
    design_personality = get_design_personality(industry)
    image_urls = get_industry_images(industry, user_images if user_images else None)
    logger.info(
        f"Design personality: {design_personality['name']} | "
        f"Images: {len(image_urls)} ({'user uploads' if user_images else 'stock'})"
    )

    # 3. Brand CSS variables + fonts in Python (deterministic)
    branding_colors = application_data.get("branding_colors", {}) or {}
    tokens = build_design_tokens(branding_colors)
    display_font, body_font, fonts_url = choose_fonts(industry)

    css_path = os.path.join(project_dir, "src", "index.css")
    if os.path.exists(css_path):
        with open(css_path, "r", encoding="utf-8") as f:
            css = f.read()
        css = inject_design_tokens(css, tokens)
        css = inject_fonts(css, fonts_url, display_font, body_font)
        css = inject_extra_utilities(css)
        with open(css_path, "w", encoding="utf-8") as f:
            f.write(css)

    tailwind_path = os.path.join(project_dir, "tailwind.config.ts")
    if os.path.exists(tailwind_path):
        with open(tailwind_path, "r", encoding="utf-8") as f:
            tw_config = f.read()
        tw_config = update_tailwind_config_fonts(tw_config, display_font, body_font)
        with open(tailwind_path, "w", encoding="utf-8") as f:
            f.write(tw_config)

    # 4. SEO + meta in index.html (also in Python — Claude shouldn't touch <script type="module">)
    update_index_html(project_dir, application_data)

    logger.info(f"Branding applied. Fonts: {display_font} / {body_font}")

    # 5. Claude designs and writes the site from scratch
    files = generate_site_files_with_claude(
        application_data, design_personality, image_urls, display_font, body_font
    )
    if not files:
        logger.error("Claude site generation failed.")
        return None

    write_generated_files(project_dir, files)

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
            {"name": "Sarah T.", "location": "Didsbury", "text": "Fantastic service, very professional and tidy."},
            {"name": "James R.", "location": "Chorlton", "text": "Fixed our fuse board same day. Highly recommend."},
            {"name": "Emma B.", "location": "Salford", "text": "Excellent response time. Very fairly priced."},
        ],
        "branding_colors": {
            "primary": "#F59E0B",
            "secondary": "#1E3A5F",
            "accent": "#10B981",
        },
        "years_experience": "20+",
        "trust_badges": "NICEIC Approved, Part P Certified, Fully Insured",
        "service_areas": ["Didsbury", "Chorlton", "Salford", "Trafford", "Stockport", "Oldham", "Bolton", "Bury"],
        "tagline": "Manchester&apos;s most trusted emergency electricians",
    }

    path = generate_website_code(data)
    print(f"Project generated at: {path}" if path else "Generation failed.")
