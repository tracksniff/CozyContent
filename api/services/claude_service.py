import anthropic
import os
import logging
import json
import time

logger = logging.getLogger(__name__)


def generate_website_code(application_data, retries=2, delay=5):
    """
    High-quality website generation.
    Combines premium design principles with an efficient file structure to ensure
    completion within token limits while maintaining stunning UI/UX.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        logger.error("ANTHROPIC_API_KEY not found")
        return None

    client = anthropic.Anthropic(api_key=api_key)
    MODEL = "claude-3-5-sonnet-20241022"

    system_prompt = """You are a world-class UI/UX Architect and Lead React Developer.
Your goal is to build a high-end, conversion-optimized website that looks like it cost £10k+.

DESIGN PRINCIPLES:
1. Visual Hierarchy: Strong typography scale (clamp()), whitespace-driven.
2. Color System: Derive a sophisticated palette (Primary, Accent, Surface, Neutral) from brand colors.
3. Sophisticated Motion: Use Framer Motion or CSS transitions for subtle, premium entrance effects.
4. Imagery: Use https://picsum.photos/seed/<unique-seed>/W/H for industry-relevant placeholders.
5. Icons: Use lucide-react exclusively.

ARCHITECTURE RULES:
1. Return a single raw JSON object. Keys = relative paths, Values = full content.
2. Combine all UI components (Navbar, Hero, Services, Testimonials, Contact, Footer) into `src/components/SiteContent.tsx` to maximize token efficiency.
3. Use Tailwind CSS for all styling. Code must be production-ready and fully typed."""

    user_prompt = f"""
Generate a premium React + Vite + TypeScript site for:
Company: {application_data["company_name"]}
Industry: {application_data["industry"]}
Location: {application_data["city_location"]}
Services: {application_data["services_list"]}
Testimonials: {application_data["testimonials"]}
Brand Colors: {application_data["branding_colors"]}

REQUIRED FILES:
- package.json
- vite.config.ts
- tsconfig.json
- tailwind.config.js (Configure the brand color palette here)
- index.html
- src/main.tsx
- src/App.tsx
- src/index.css (Include Tailwind directives and font imports)
- src/components/SiteContent.tsx (The entire high-end UI goes here)
- src/utils/cn.ts (tailwind-merge + clsx)
"""

    for attempt in range(retries):
        try:
            logger.info(
                f"Starting High-Quality Claude generation (Attempt {attempt + 1})..."
            )
            response = client.messages.create(
                model=MODEL,
                max_tokens=8192,
                temperature=0.3,  # Slightly higher for more creative UI layouts
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
                extra_headers={"anthropic-beta": "max-tokens-3-5-sonnet-2024-07-15"},
            )

            text = response.content[0].text.strip()

            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()

            code_files = json.loads(text)
            logger.info(f"Successfully generated {len(code_files)} files.")
            return code_files

        except json.JSONDecodeError as e:
            logger.error(f"JSON error: {e}")
        except Exception as e:
            logger.error(f"Generation error: {e}")

        if attempt < retries - 1:
            time.sleep(delay)

    return None
