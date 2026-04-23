import anthropic
import os
import logging
import json
import subprocess
import shutil
import tempfile
import re

logger = logging.getLogger(__name__)

TEMPLATE_REPO = "https://github.com/Cosy-Content-LTD/soho-plumbers-modern-makeover.git"

# Files Claude is allowed to edit — config/asset files are left untouched
# so the build always works. Claude only changes content/copy/colors.
EDITABLE_FILES = [
    "src/App.tsx",
    "src/components/Navbar.tsx",
    "src/components/Hero.tsx",
    "src/components/Services.tsx",
    "src/components/About.tsx",
    "src/components/Testimonials.tsx",
    "src/components/Contact.tsx",
    "src/components/Footer.tsx",
    "src/index.css",
    "index.html",
]


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


def extract_imports(content: str) -> tuple[str, str]:
    """
    Split a TSX/TS file into its import block and the rest of the file.
    Returns (import_block, body) where import_block ends at the last import line.
    """
    lines = content.split("\n")
    last_import_line = -1
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("import ") or stripped.startswith('import"') or stripped.startswith("import'"):
            last_import_line = i

    if last_import_line == -1:
        return "", content

    import_block = "\n".join(lines[: last_import_line + 1])
    body = "\n".join(lines[last_import_line + 1 :])
    return import_block, body


def strip_imports_for_claude(template_files: dict) -> tuple[dict, dict]:
    """
    For each TSX file, extract the import block and replace it with a
    LOCKED_IMPORTS placeholder. Returns:
      - files_for_claude: files with imports stripped (what Claude sees)
      - locked_imports: the original import blocks keyed by file path
    """
    files_for_claude = {}
    locked_imports = {}

    for rel_path, content in template_files.items():
        if rel_path.endswith(".tsx") or rel_path.endswith(".ts"):
            import_block, body = extract_imports(content)
            locked_imports[rel_path] = import_block
            # Replace import block with a clear placeholder Claude must not touch
            placeholder = "/* !! LOCKED_IMPORTS — DO NOT EDIT THIS SECTION !! */\n/* These will be restored automatically. Only edit the JSX/content below. */\n"
            files_for_claude[rel_path] = placeholder + body
        else:
            # CSS and HTML have no imports to lock
            files_for_claude[rel_path] = content

    return files_for_claude, locked_imports


def restore_imports(edited_files: dict, locked_imports: dict) -> dict:
    """
    Replace the LOCKED_IMPORTS placeholder (or whatever Claude put at the top)
    with the original import block extracted from the template.
    """
    restored = {}
    for rel_path, content in edited_files.items():
        if rel_path in locked_imports and locked_imports[rel_path]:
            # Remove everything up to and including any import lines Claude may have written
            # Then prepend the locked original imports
            lines = content.split("\n")
            # Drop lines until we're past any import statements or placeholder comments
            body_start = 0
            for i, line in enumerate(lines):
                stripped = line.strip()
                if (
                    stripped.startswith("import ")
                    or stripped.startswith("/* !!")
                    or stripped.startswith("/* These will")
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
    Send the template files to Claude and ask it to edit content
    to match the new business. Import blocks are locked before sending
    and restored after to prevent Claude breaking import paths.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        logger.error("ANTHROPIC_API_KEY not found")
        return None

    client = anthropic.Anthropic(api_key=api_key)

    # Lock imports BEFORE sending to Claude
    files_for_claude, locked_imports = strip_imports_for_claude(template_files)

    # Build the template snapshot
    template_snapshot = ""
    for rel_path, content in files_for_claude.items():
        template_snapshot += f"\n\n### FILE: {rel_path}\n```\n{content}\n```"

    system_prompt = """You are an expert React/TypeScript developer tasked with rebranding a website template for a new business.

━━━ YOUR ONLY JOB ━━━
Edit the CONTENT of the files to match the new business brief.
You are NOT allowed to change anything structural.

━━━ WHAT TO CHANGE ━━━
- Company name, tagline, and all marketing copy
- Service names and descriptions
- Team/about section text
- Testimonial names and quotes
- Contact details (phone, email, address)
- Brand colors in index.css (@theme block or CSS variables)
- Page title and meta description in index.html

━━━ WHAT NEVER TO TOUCH ━━━
- The /* !! LOCKED_IMPORTS */ placeholder — leave it exactly as-is, do not replace it with import statements
- className values (Tailwind classes)
- JSX structure and nesting
- Animation props and framer-motion attributes
- Component names and function signatures
- Any line that starts with "import"

━━━ SYNTAX RULES ━━━
- Apostrophes in JSX text must be &apos; — never a raw '
- Quotes in JSX text must be &quot; — never a raw "

━━━ OUTPUT FORMAT ━━━
Return a SINGLE raw JSON object:
- Keys = the exact same relative file paths given to you
- Values = the complete updated file content (including the LOCKED_IMPORTS placeholder at the top of TSX files)
No markdown fences, no backticks, no explanation — only the JSON object."""

    user_prompt = f"""Rebrand this website for the following business:

Company Name: {application_data["company_name"]}
Location: {application_data["city_location"]}
Services: {application_data["services_list"]}
Testimonials: {application_data["testimonials"]}
Brand Colors: {application_data["branding_colors"]}

Template files to edit:
{template_snapshot}

Return the rebranded files as a raw JSON object with the same keys.
Every value must be the COMPLETE file content."""

    try:
        logger.info("Sending template to Claude for editing...")
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

        # Only keep keys that were in the original template
        valid_keys = set(template_files.keys())
        filtered = {k: v for k, v in edited.items() if k in valid_keys}

        # Fall back to originals for any files Claude omitted
        for k in valid_keys - set(filtered.keys()):
            logger.warning(f"Claude omitted {k} — using original.")
            filtered[k] = template_files[k]

        # Restore the locked import blocks regardless of what Claude did
        restored = restore_imports(filtered, locked_imports)

        return restored

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error in Claude response: {e}")
        return None
    except Exception as e:
        logger.error(f"Claude API error: {e}")
        return None


def generate_website_code(application_data: dict, output_dir: str | None = None) -> str | None:
    """
    Main entry point. Clones the template, edits content with Claude
    (with imports locked), and returns the path to the ready-to-deploy
    project directory.

    Args:
        application_data: dict with keys:
            company_name, city_location, services_list,
            testimonials, branding_colors

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

    # Remove .git so the output is a clean project
    git_dir = os.path.join(project_dir, ".git")
    if os.path.exists(git_dir):
        shutil.rmtree(git_dir)

    # Step 2: Read editable template files
    template_files = read_template_files(project_dir)
    if not template_files:
        logger.error("No template files could be read.")
        return None
    logger.info(f"Read {len(template_files)} template files.")

    # Step 3: Edit with Claude (imports are locked inside this function)
    edited_files = edit_files_with_claude(template_files, application_data)
    if not edited_files:
        logger.error("Claude editing failed.")
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
        "city_location": "Manchester, UK",
        "services_list": "Rewiring, Fuse Board Upgrades, EV Charger Installation, Lighting Design",
        "testimonials": [
            {"name": "Sarah T.", "text": "Fantastic service, very professional."},
            {"name": "James R.", "text": "Fixed our issue same day. Highly recommend."},
        ],
        "branding_colors": {
            "primary": "#F59E0B",
            "secondary": "#1E3A5F",
            "accent": "#FFFFFF",
        },
    }

    path = generate_website_code(data)
    if path:
        print(f"Project generated at: {path}")
    else:
        print("Generation failed.")
