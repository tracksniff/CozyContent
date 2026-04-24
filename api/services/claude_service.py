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


def write_edited_files(project_dir: str, edited_files: dict):
    for rel_path, content in edited_files.items():
        abs_path = os.path.join(project_dir, rel_path)

        os.makedirs(os.path.dirname(abs_path), exist_ok=True)

        with open(abs_path, "w", encoding="utf-8") as f:
            f.write(content)

    logger.info(f"Wrote {len(edited_files)} edited files.")


# ─────────────────────────────────────────────────────────

# Claude content editing

# ─────────────────────────────────────────────────────────


CONTENT_GUIDE = """

NAVBAR:         company name (2-line logo), phone number

HEROSECTION:    badge text, h1 headline, star rating/review count, description paragraph,

                phone number in CTA, trust badges, floating stat card values & labels

WHYUSSECTION:   section heading, subheading, all 4 feature titles + descriptions

SERVICESSECTION: section heading, subheading, all 6 service titles + descriptions, phone in links

HOWITWORKS:     section heading, all 3 step titles + descriptions

MEETTHETEAM:    section heading, body paragraph, all 4 bullet points, phone in CTA

REVIEWSSECTION: all 3 review names, locations, and review text; star rating / review count

AREASSECTION:   section heading, all area/location names

FOOTERSECTION:  company name, description paragraph, phone number, locations text, copyright name

MOBILECTA:      phone number

INDEX.HTML:     <title>, meta description, og:title, og:description, author

"""


def edit_files_with_claude(template_files: dict, application_data: dict) -> dict | None:
    api_key = os.getenv("ANTHROPIC_API_KEY")

    if not api_key:
        logger.error("ANTHROPIC_API_KEY not found")

        return None

    client = anthropic.Anthropic(api_key=api_key)

    files_for_claude, locked_imports = strip_imports_for_claude(template_files)

    template_snapshot = ""

    for rel_path, content in files_for_claude.items():
        # Skip index.css — we handle it in Python, not via Claude

        if rel_path == "src/index.css":
            continue

        template_snapshot += f"\n\n### FILE: {rel_path}\n```\n{content}\n```"

    system_prompt = f"""You are an expert React/TypeScript developer rebranding a website template for a new business.



━━━ YOUR ONLY JOB ━━━

Replace ALL business-specific content in the template files with content for the new business.

Every Soho/plumber reference must be replaced. Do not leave any old content behind.



━━━ CONTENT TO REPLACE IN EACH FILE ━━━

{CONTENT_GUIDE}



━━━ STRICT RULES ━━━

1. The /* !! LOCKED_IMPORTS */ line — leave it exactly as-is. Never replace it with import statements.

2. Do NOT change className values, JSX structure, animation props, or component names.

3. Do NOT add or remove JSX elements — only change text and href values.

4. Apostrophes in JSX text → &apos;  Quotes in JSX text → &quot;

5. Replace every occurrence of the old phone number with the new one.

6. Do NOT include src/index.css in your response — it is handled separately.

7. Every file value must be the COMPLETE file content — never a diff or snippet.



━━━ OUTPUT FORMAT ━━━

Return a SINGLE raw JSON object. Keys = file paths. Values = complete file content.

No markdown, no backticks, no explanation — only the JSON object."""

    user_prompt = f"""Rebrand this website for:



Company Name: {application_data["company_name"]}

Industry: {application_data.get("industry", "trade services")}

Phone Number: {application_data.get("phone_number", "N/A")}

Location: {application_data["city_location"]}

Services: {application_data["services_list"]}

Testimonials: {application_data["testimonials"]}

Years of Experience: {application_data.get("years_experience", "10+")}

Trust Badges: {application_data.get("trust_badges", "Fully insured, certified engineers")}

Service Areas: {application_data.get("service_areas", application_data["city_location"])}

Tagline / USP: {application_data.get("tagline", "Fast, reliable, professional service")}



Template files:

{template_snapshot}



Return ALL files as a raw JSON object. Do NOT include src/index.css."""

    try:
        logger.info("Sending template to Claude for content rebranding...")

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

        # Restore locked imports

        restored = restore_imports(filtered, locked_imports)

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

    rebrand all content with Claude, and return the project directory path.



    application_data keys:

        company_name        — business name

        industry            — e.g. "electrical", "legal", "beauty salon"

        phone_number        — contact number

        city_location       — e.g. "Manchester, UK"

        services_list       — comma-separated or list

        testimonials        — list of {name, location, text}

        branding_colors     — dict: {primary, secondary, accent} as hex

        years_experience    — (optional) e.g. "15+"

        trust_badges        — (optional) e.g. "NICEIC Approved, Fully Insured"

        service_areas       — (optional) list of local areas

        tagline             — (optional) short USP

    """

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

    # 3. Apply design tokens + fonts to CSS entirely in Python — no LLM needed

    branding_colors = application_data.get("branding_colors", {})

    industry = application_data.get("industry", "")

    tokens = build_design_tokens(branding_colors)

    display_font, body_font, fonts_url = choose_fonts(industry)

    css = template_files["src/index.css"]

    css = inject_design_tokens(css, tokens)

    css = inject_fonts(css, fonts_url, display_font, body_font)

    css = update_tailwind_config_fonts(css, display_font, body_font)

    template_files["src/index.css"] = css

    logger.info(f"Design tokens applied. Fonts: {display_font} / {body_font}")

    # 4. Rebrand content with Claude (CSS excluded — already done above)

    edited_files = edit_files_with_claude(template_files, application_data)

    if not edited_files:
        logger.error("Claude rebranding failed.")

        return None

    # 5. Merge: put our CSS back in (Claude was told to skip it)

    edited_files["src/index.css"] = template_files["src/index.css"]

    # 6. Write everything back

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

    system_prompt = f"""You are an expert React/TypeScript developer rebranding a website template for a new business.



━━━ YOUR ONLY JOB ━━━

Replace ALL business-specific content in the template files with content for the new business.

You must touch EVERY piece of content listed in the guide below. Do not leave any plumbing/Soho references behind.



━━━ CONTENT TO REPLACE IN EACH FILE ━━━

{CONTENT_GUIDE}



━━━ STRICT RULES ━━━

1. The /* !! LOCKED_IMPORTS */ line at the top of TSX files — leave it exactly as written. Do not replace it with import statements.

2. Do NOT change any className values, JSX structure, animation props, or component names.

3. Do NOT add or remove JSX elements — only change text content, href values, and CSS variable values.

4. Apostrophes in JSX text → use &apos; not a raw '

5. Replace the phone number everywhere it appears with the new business phone number.

6. In index.css: only change the HSL values for --primary and --accent to match brand colors. Leave all other CSS variables untouched.

7. Every file value in your JSON must be the COMPLETE file content — never a diff or snippet.



━━━ OUTPUT FORMAT ━━━

Return a SINGLE raw JSON object:

- Keys = the exact same relative file paths given to you

- Values = complete updated file content

No markdown fences, no backticks, no explanation — only the JSON object."""

    user_prompt = f"""Rebrand this website for the following business:



Company Name: {application_data["company_name"]}

Phone Number: {application_data.get("phone_number", "N/A")}

Location: {application_data["city_location"]}

Services: {application_data["services_list"]}

Testimonials: {application_data["testimonials"]}

Brand Colors (hex): {application_data["branding_colors"]}

Years of Experience: {application_data.get("years_experience", "10+")}

Key Trust Badges: {application_data.get("trust_badges", "Fully insured, certified engineers")}

Service Areas: {application_data.get("service_areas", application_data["city_location"])}

Tagline / USP: {application_data.get("tagline", "Fast, reliable, professional service")}



Template files to rebrand:

{template_snapshot}



Return ALL {len(files_for_claude)} files in the JSON. Every Soho/plumbing reference must be replaced."""

    try:
        logger.info("Sending template to Claude for rebranding...")

        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=16000,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )

        text = response.content[0].text.strip()

        stop_reason = response.stop_reason

        logger.info(f"Claude responded. Stop reason: {stop_reason}")

        if stop_reason == "max_tokens":
            logger.warning("Response was truncated — output may be incomplete.")

        # Strip markdown fences if present

        if text.startswith("```json"):
            text = text[7:]

        elif text.startswith("```"):
            text = text[3:]

        if text.endswith("```"):
            text = text[:-3]

        text = text.strip()

        edited = json.loads(text)

        # Only keep keys from the original template

        valid_keys = set(template_files.keys())

        filtered = {k: v for k, v in edited.items() if k in valid_keys}

        # Fall back to originals for any files Claude omitted

        for k in valid_keys - set(filtered.keys()):
            logger.warning(f"Claude omitted {k} — keeping original.")

            filtered[k] = template_files[k]

        # Always restore locked imports regardless of what Claude wrote

        restored = restore_imports(filtered, locked_imports)

        return restored

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error: {e}")

        return None

    except Exception as e:
        logger.error(f"Claude API error: {e}")

        return None


def generate_website_code(
    application_data: dict, output_dir: str | None = None
) -> str | None:
    """

    Main entry point. Clones the template, edits ALL content with Claude,

    and returns the path to the ready-to-deploy project directory.



    Args:

        application_data: dict with keys:

            company_name        — business name

            phone_number        — contact phone number

            city_location       — city/town (e.g. "Manchester, UK")

            services_list       — comma-separated services or list

            testimonials        — list of {name, text} dicts

            branding_colors     — dict with "primary", "secondary", "accent" hex values

            years_experience    — (optional) e.g. "15+"

            trust_badges        — (optional) e.g. "NICEIC Approved, Fully Insured"

            service_areas       — (optional) list of local areas served

            tagline             — (optional) short USP / strapline



        output_dir: where to place the final project folder.

                    Defaults to a temp directory.



    Returns:

        Path to the project directory, or None on failure.

    """

    if output_dir is None:
        output_dir = tempfile.mkdtemp(prefix="website_")

    project_dir = os.path.join(output_dir, "project")

    # Step 1: Clone the template

    logger.info(f"Cloning template into {project_dir}...")

    if not clone_template(project_dir):
        return None

    # Remove .git so output is a clean deployable project

    git_dir = os.path.join(project_dir, ".git")

    if os.path.exists(git_dir):
        shutil.rmtree(git_dir)

    # Step 2: Read editable content files

    template_files = read_template_files(project_dir)

    if not template_files:
        logger.error("No template files could be read.")

        return None

    logger.info(f"Read {len(template_files)} template files.")

    # Step 3: Rebrand with Claude (imports locked inside this call)

    edited_files = edit_files_with_claude(template_files, application_data)

    if not edited_files:
        logger.error("Claude rebranding failed.")

        return None

    # Step 4: Write edited files back into the project

    write_edited_files(project_dir, edited_files)

    logger.info(f"Website ready at: {project_dir}")

    return project_dir


# ── Example usage ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    data = {
        "company_name": "Bright Spark Electricians",
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


def write_edited_files(project_dir: str, edited_files: dict):
    for rel_path, content in edited_files.items():
        abs_path = os.path.join(project_dir, rel_path)

        os.makedirs(os.path.dirname(abs_path), exist_ok=True)

        with open(abs_path, "w", encoding="utf-8") as f:
            f.write(content)

    logger.info(f"Wrote {len(edited_files)} edited files.")


# ─────────────────────────────────────────────────────────

# Claude content editing

# ─────────────────────────────────────────────────────────


CONTENT_GUIDE = """

NAVBAR:         company name (2-line logo), phone number

HEROSECTION:    badge text, h1 headline, star rating/review count, description paragraph,

                phone number in CTA, trust badges, floating stat card values & labels

WHYUSSECTION:   section heading, subheading, all 4 feature titles + descriptions

SERVICESSECTION: section heading, subheading, all 6 service titles + descriptions, phone in links

HOWITWORKS:     section heading, all 3 step titles + descriptions

MEETTHETEAM:    section heading, body paragraph, all 4 bullet points, phone in CTA

REVIEWSSECTION: all 3 review names, locations, and review text; star rating / review count

AREASSECTION:   section heading, all area/location names

FOOTERSECTION:  company name, description paragraph, phone number, locations text, copyright name

MOBILECTA:      phone number

INDEX.HTML:     <title>, meta description, og:title, og:description, author

"""


def edit_files_with_claude(template_files: dict, application_data: dict) -> dict | None:
    api_key = os.getenv("ANTHROPIC_API_KEY")

    if not api_key:
        logger.error("ANTHROPIC_API_KEY not found")

        return None

    client = anthropic.Anthropic(api_key=api_key)

    files_for_claude, locked_imports = strip_imports_for_claude(template_files)

    template_snapshot = ""

    for rel_path, content in files_for_claude.items():
        # Skip index.css — we handle it in Python, not via Claude

        if rel_path == "src/index.css":
            continue

        template_snapshot += f"\n\n### FILE: {rel_path}\n```\n{content}\n```"

    system_prompt = f"""You are an expert React/TypeScript developer rebranding a website template for a new business.



━━━ YOUR ONLY JOB ━━━

Replace ALL business-specific content in the template files with content for the new business.

Every Soho/plumber reference must be replaced. Do not leave any old content behind.



━━━ CONTENT TO REPLACE IN EACH FILE ━━━

{CONTENT_GUIDE}



━━━ STRICT RULES ━━━

1. The /* !! LOCKED_IMPORTS */ line — leave it exactly as-is. Never replace it with import statements.

2. Do NOT change className values, JSX structure, animation props, or component names.

3. Do NOT add or remove JSX elements — only change text and href values.

4. Apostrophes in JSX text → &apos;  Quotes in JSX text → &quot;

5. Replace every occurrence of the old phone number with the new one.

6. Do NOT include src/index.css in your response — it is handled separately.

7. Every file value must be the COMPLETE file content — never a diff or snippet.



━━━ OUTPUT FORMAT ━━━

Return a SINGLE raw JSON object. Keys = file paths. Values = complete file content.

No markdown, no backticks, no explanation — only the JSON object."""

    user_prompt = f"""Rebrand this website for:



Company Name: {application_data["company_name"]}

Industry: {application_data.get("industry", "trade services")}

Phone Number: {application_data.get("phone_number", "N/A")}

Location: {application_data["city_location"]}

Services: {application_data["services_list"]}

Testimonials: {application_data["testimonials"]}

Years of Experience: {application_data.get("years_experience", "10+")}

Trust Badges: {application_data.get("trust_badges", "Fully insured, certified engineers")}

Service Areas: {application_data.get("service_areas", application_data["city_location"])}

Tagline / USP: {application_data.get("tagline", "Fast, reliable, professional service")}



Template files:

{template_snapshot}



Return ALL files as a raw JSON object. Do NOT include src/index.css."""

    try:
        logger.info("Sending template to Claude for content rebranding...")

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

        # Restore locked imports

        restored = restore_imports(filtered, locked_imports)

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

    rebrand all content with Claude, and return the project directory path.



    application_data keys:

        company_name        — business name

        industry            — e.g. "electrical", "legal", "beauty salon"

        phone_number        — contact number

        city_location       — e.g. "Manchester, UK"

        services_list       — comma-separated or list

        testimonials        — list of {name, location, text}

        branding_colors     — dict: {primary, secondary, accent} as hex

        years_experience    — (optional) e.g. "15+"

        trust_badges        — (optional) e.g. "NICEIC Approved, Fully Insured"

        service_areas       — (optional) list of local areas

        tagline             — (optional) short USP

    """

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

    # 3. Apply design tokens + fonts to CSS entirely in Python — no LLM needed

    branding_colors = application_data.get("branding_colors", {})

    industry = application_data.get("industry", "")

    tokens = build_design_tokens(branding_colors)

    display_font, body_font, fonts_url = choose_fonts(industry)

    css = template_files["src/index.css"]

    css = inject_design_tokens(css, tokens)

    css = inject_fonts(css, fonts_url, display_font, body_font)

    css = update_tailwind_config_fonts(css, display_font, body_font)

    template_files["src/index.css"] = css

    logger.info(f"Design tokens applied. Fonts: {display_font} / {body_font}")

    # 4. Rebrand content with Claude (CSS excluded — already done above)

    edited_files = edit_files_with_claude(template_files, application_data)

    if not edited_files:
        logger.error("Claude rebranding failed.")

        return None

    # 5. Merge: put our CSS back in (Claude was told to skip it)

    edited_files["src/index.css"] = template_files["src/index.css"]

    # 6. Write everything back

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

    system_prompt = f"""You are an expert React/TypeScript developer rebranding a website template for a new business.



━━━ YOUR ONLY JOB ━━━

Replace ALL business-specific content in the template files with content for the new business.

You must touch EVERY piece of content listed in the guide below. Do not leave any plumbing/Soho references behind.



━━━ CONTENT TO REPLACE IN EACH FILE ━━━

{CONTENT_GUIDE}



━━━ STRICT RULES ━━━

1. The /* !! LOCKED_IMPORTS */ line at the top of TSX files — leave it exactly as written. Do not replace it with import statements.

2. Do NOT change any className values, JSX structure, animation props, or component names.

3. Do NOT add or remove JSX elements — only change text content, href values, and CSS variable values.

4. Apostrophes in JSX text → use &apos; not a raw '

5. Replace the phone number everywhere it appears with the new business phone number.

6. In index.css: only change the HSL values for --primary and --accent to match brand colors. Leave all other CSS variables untouched.

7. Every file value in your JSON must be the COMPLETE file content — never a diff or snippet.



━━━ OUTPUT FORMAT ━━━

Return a SINGLE raw JSON object:

- Keys = the exact same relative file paths given to you

- Values = complete updated file content

No markdown fences, no backticks, no explanation — only the JSON object."""

    user_prompt = f"""Rebrand this website for the following business:



Company Name: {application_data["company_name"]}

Phone Number: {application_data.get("phone_number", "N/A")}

Location: {application_data["city_location"]}

Services: {application_data["services_list"]}

Testimonials: {application_data["testimonials"]}

Brand Colors (hex): {application_data["branding_colors"]}

Years of Experience: {application_data.get("years_experience", "10+")}

Key Trust Badges: {application_data.get("trust_badges", "Fully insured, certified engineers")}

Service Areas: {application_data.get("service_areas", application_data["city_location"])}

Tagline / USP: {application_data.get("tagline", "Fast, reliable, professional service")}



Template files to rebrand:

{template_snapshot}



Return ALL {len(files_for_claude)} files in the JSON. Every Soho/plumbing reference must be replaced."""

    try:
        logger.info("Sending template to Claude for rebranding...")

        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=16000,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )

        text = response.content[0].text.strip()

        stop_reason = response.stop_reason

        logger.info(f"Claude responded. Stop reason: {stop_reason}")

        if stop_reason == "max_tokens":
            logger.warning("Response was truncated — output may be incomplete.")

        # Strip markdown fences if present

        if text.startswith("```json"):
            text = text[7:]

        elif text.startswith("```"):
            text = text[3:]

        if text.endswith("```"):
            text = text[:-3]

        text = text.strip()

        edited = json.loads(text)

        # Only keep keys from the original template

        valid_keys = set(template_files.keys())

        filtered = {k: v for k, v in edited.items() if k in valid_keys}

        # Fall back to originals for any files Claude omitted

        for k in valid_keys - set(filtered.keys()):
            logger.warning(f"Claude omitted {k} — keeping original.")

            filtered[k] = template_files[k]

        # Always restore locked imports regardless of what Claude wrote

        restored = restore_imports(filtered, locked_imports)

        return restored

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error: {e}")

        return None

    except Exception as e:
        logger.error(f"Claude API error: {e}")

        return None


def generate_website_code(
    application_data: dict, output_dir: str | None = None
) -> str | None:
    """

    Main entry point. Clones the template, edits ALL content with Claude,

    and returns the path to the ready-to-deploy project directory.



    Args:

        application_data: dict with keys:

            company_name        — business name

            phone_number        — contact phone number

            city_location       — city/town (e.g. "Manchester, UK")

            services_list       — comma-separated services or list

            testimonials        — list of {name, text} dicts

            branding_colors     — dict with "primary", "secondary", "accent" hex values

            years_experience    — (optional) e.g. "15+"

            trust_badges        — (optional) e.g. "NICEIC Approved, Fully Insured"

            service_areas       — (optional) list of local areas served

            tagline             — (optional) short USP / strapline



        output_dir: where to place the final project folder.

                    Defaults to a temp directory.



    Returns:

        Path to the project directory, or None on failure.

    """

    if output_dir is None:
        output_dir = tempfile.mkdtemp(prefix="website_")

    project_dir = os.path.join(output_dir, "project")

    # Step 1: Clone the template

    logger.info(f"Cloning template into {project_dir}...")

    if not clone_template(project_dir):
        return None

    # Remove .git so output is a clean deployable project

    git_dir = os.path.join(project_dir, ".git")

    if os.path.exists(git_dir):
        shutil.rmtree(git_dir)

    # Step 2: Read editable content files

    template_files = read_template_files(project_dir)

    if not template_files:
        logger.error("No template files could be read.")

        return None

    logger.info(f"Read {len(template_files)} template files.")

    # Step 3: Rebrand with Claude (imports locked inside this call)

    edited_files = edit_files_with_claude(template_files, application_data)

    if not edited_files:
        logger.error("Claude rebranding failed.")

        return None

    # Step 4: Write edited files back into the project

    write_edited_files(project_dir, edited_files)

    logger.info(f"Website ready at: {project_dir}")

    return project_dir


# ── Example usage ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    data = {
        "company_name": "Bright Spark Electricians",
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
