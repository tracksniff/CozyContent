import anthropic
import os
import logging
import json
import subprocess
import shutil
import tempfile

logger = logging.getLogger(__name__)

TEMPLATE_REPO = "https://github.com/Cosy-Content-LTD/soho-plumbers-modern-makeover.git"

# Exact file paths as they exist in the repo — verified from the real source tree.
# App.tsx and pages/NotFound.tsx have no business content so are excluded.
# ui/* components and hooks are structural — never edited.
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

# Specific content fields to replace in each file so Claude knows exactly what to target.
# This is provided to Claude as a guide — the tighter the brief, the better the output.
CONTENT_GUIDE = """
NAVBAR:        company name (2-line logo), phone number, nav links if relevant
HEROSECTION:   badge text, h1 headline, star rating/review count, description paragraph,
               phone number in CTA button, trust badges (e.g. "Gas Safe" → trade equivalent),
               floating stat card (response time, first fix rate, availability)
WHYUSSECTION:  section heading, subheading, all 4 feature titles + descriptions
SERVICESSECTION: section heading, subheading, all 6 service titles + descriptions, phone number in links
HOWITWORKS:    section heading, all 3 step titles + descriptions
MEETTHETEAM:   section heading, body paragraph, all 4 bullet points, phone number in CTA
REVIEWSSECTION: all 3 review names, locations, and review text; star rating / review count
AREASSECTION:  section heading, all area names (replace London postcodes with local areas)
FOOTERSECTION: company name in logo, description paragraph, phone number, locations paragraph,
               copyright company name
MOBILECTA:     phone number
INDEX.HTML:    <title>, meta description, og:title, og:description, author
INDEX.CSS:     --primary HSL value (brand primary color)
               --accent HSL value (brand accent color)
"""


def clone_template(dest_dir: str) -> bool:
    """Clone the template repo into dest_dir. Returns True on success."""
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
    """Read all editable template files into a dict keyed by relative path."""
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
    """Split a TSX/TS file into (import_block, body)."""
    lines = content.split("\n")
    last_import_line = -1
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("import "):
            last_import_line = i
    if last_import_line == -1:
        return "", content
    import_block = "\n".join(lines[: last_import_line + 1])
    body = "\n".join(lines[last_import_line + 1 :])
    return import_block, body


def strip_imports_for_claude(template_files: dict) -> tuple:
    """
    Remove import blocks from TSX files before sending to Claude.
    Returns (files_for_claude, locked_imports).
    Claude never sees the imports so it cannot accidentally change them.
    """
    files_for_claude = {}
    locked_imports = {}

    for rel_path, content in template_files.items():
        if rel_path.endswith(".tsx") or rel_path.endswith(".ts"):
            import_block, body = extract_imports(content)
            locked_imports[rel_path] = import_block
            placeholder = "/* !! LOCKED_IMPORTS — DO NOT EDIT OR REPRODUCE THIS SECTION !! */\n"
            files_for_claude[rel_path] = placeholder + body
        else:
            # CSS and HTML — no imports to lock
            files_for_claude[rel_path] = content

    return files_for_claude, locked_imports


def restore_imports(edited_files: dict, locked_imports: dict) -> dict:
    """
    Unconditionally replace the top of every TSX file with the original
    locked import block, regardless of what Claude wrote there.
    """
    restored = {}
    for rel_path, content in edited_files.items():
        if rel_path in locked_imports and locked_imports[rel_path]:
            lines = content.split("\n")
            # Skip any lines Claude wrote above the first non-import, non-placeholder, non-blank line
            body_start = 0
            for i, line in enumerate(lines):
                stripped = line.strip()
                if (
                    stripped.startswith("import ")
                    or stripped.startswith("/* !!")
                    or stripped.startswith("/* These")
                    or stripped == ""
                ):
                    body_start = i + 1
                else:
                    break
            body = "\n".join(lines[body_start:])
            restored[rel_path] = locked_imports[rel_path] + "\n" + body
        else:
            restored[rel_path] = content
    return restored


def write_edited_files(project_dir: str, edited_files: dict):
    """Write Claude's edited files back into the project directory."""
    for rel_path, content in edited_files.items():
        abs_path = os.path.join(project_dir, rel_path)
        os.makedirs(os.path.dirname(abs_path), exist_ok=True)
        with open(abs_path, "w", encoding="utf-8") as f:
            f.write(content)
    logger.info(f"Wrote {len(edited_files)} edited files.")


def edit_files_with_claude(template_files: dict, application_data: dict) -> dict | None:
    """
    Send template files (with imports stripped) to Claude and ask it to
    rebrand all content for the new business.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        logger.error("ANTHROPIC_API_KEY not found")
        return None

    client = anthropic.Anthropic(api_key=api_key)

    # Strip imports before Claude sees anything
    files_for_claude, locked_imports = strip_imports_for_claude(template_files)

    # Build the template snapshot
    template_snapshot = ""
    for rel_path, content in files_for_claude.items():
        template_snapshot += f"\n\n### FILE: {rel_path}\n```\n{content}\n```"

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


def generate_website_code(application_data: dict, output_dir: str | None = None) -> str | None:
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
        "tagline": "Manchester's most trusted emergency electricians",
    }

    path = generate_website_code(data)
    if path:
        print(f"Project generated at: {path}")
    else:
        print("Generation failed.")
