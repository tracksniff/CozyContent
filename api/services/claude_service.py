import anthropic

import os

import logging

import json

import subprocess

import shutil

import tempfile


logger = logging.getLogger(__name__)


TEMPLATE_REPO = "git@github.com:Cosy-Content-LTD/soho-plumbers-modern-makeover.git"


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

    to match the new business. Returns a dict of edited file contents.

    """

    api_key = os.getenv("ANTHROPIC_API_KEY")

    if not api_key:
        logger.error("ANTHROPIC_API_KEY not found")

        return None

    client = anthropic.Anthropic(api_key=api_key)

    # Build the template snapshot to send to Claude

    template_snapshot = ""

    for rel_path, content in template_files.items():
        template_snapshot += f"\n\n### FILE: {rel_path}\n```\n{content}\n```"

    system_prompt = """You are an expert React/TypeScript developer.

You will receive a set of working website source files (a template) and a new business brief.

Your job is to edit ONLY the content, copy, colors, and branding to match the new business.



━━━ STRICT RULES ━━━

1. DO NOT change any import paths, file structure, or component names.

2. DO NOT add or remove any imports.

3. DO NOT change vite.config.ts, tsconfig.json, package.json, or src/main.tsx — these are not provided and must not be touched.

4. ONLY edit: text copy, company name, service names, colors, testimonials, contact details, and metadata in index.html.

5. Keep ALL existing JSX structure, className patterns, and animation logic intact.

6. Replace placeholder/template colors in index.css or Tailwind @theme with the new brand colors provided.

7. Apostrophes in JSX must use &apos; — never raw '.

8. Return a SINGLE raw JSON object where:

   - Keys = the exact same relative file paths provided to you

   - Values = the complete updated file content

   No markdown, no backticks, no explanation — only the JSON object.

"""

    user_prompt = f"""New business details:

Company Name: {application_data["company_name"]}

Location: {application_data["city_location"]}

Services: {application_data["services_list"]}

Testimonials: {application_data["testimonials"]}

Brand Colors: {application_data["branding_colors"]}



Here are the template files to edit:

{template_snapshot}



Return the edited files as a raw JSON object with the same keys as above.

Every value must be the COMPLETE file content — not a diff, not a snippet."""

    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=16000,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )

        text = response.content[0].text.strip()

        stop_reason = response.stop_reason

        logger.info(f"Claude responded. Stop reason: {stop_reason}")

        # Strip markdown fences if present

        if text.startswith("```json"):
            text = text[7:]

        elif text.startswith("```"):
            text = text[3:]

        if text.endswith("```"):
            text = text[:-3]

        text = text.strip()

        edited = json.loads(text)

        # Safety check: only keep keys that were in the original template

        valid_keys = set(template_files.keys())

        filtered = {k: v for k, v in edited.items() if k in valid_keys}

        if len(filtered) < len(template_files):
            missing = valid_keys - set(filtered.keys())

            logger.warning(f"Claude omitted these files (keeping originals): {missing}")

            # Fall back to original for any missing files

            for k in missing:
                filtered[k] = template_files[k]

        return filtered

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error in Claude response: {e}")

        return None

    except Exception as e:
        logger.error(f"Claude API error: {e}")

        return None


def generate_website_code(
    application_data: dict, output_dir: str | None = None
) -> str | None:
    """

    Main entry point. Clones the template, edits it with Claude,

    and returns the path to the ready-to-deploy project directory.



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

    # Remove the .git folder so the output is a clean project

    git_dir = os.path.join(project_dir, ".git")

    if os.path.exists(git_dir):
        shutil.rmtree(git_dir)

    # Step 2: Read editable template files

    template_files = read_template_files(project_dir)

    if not template_files:
        logger.error("No template files could be read.")

        return None

    logger.info(f"Read {len(template_files)} template files.")

    # Step 3: Edit with Claude

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
