import anthropic

import os

import logging

import json

import time


logger = logging.getLogger(__name__)


def generate_website_code(application_data, retries=2, delay=5):
    """

    High-quality website generation using Claude.

    Combines premium design principles with an efficient file structure to ensure

    completion within token limits while maintaining stunning UI/UX.

    """

    api_key = os.getenv("ANTHROPIC_API_KEY")

    if not api_key:
        logger.error("ANTHROPIC_API_KEY not found")

        return None

    client = anthropic.Anthropic(api_key=api_key)

    # claude-haiku-4-5-20251001 = cheapest + fast for structured JSON output

    # claude-sonnet-4-6          = best quality/cost balance (recommended)

    # claude-opus-4-6            = highest quality, most expensive

    MODEL = "claude-sonnet-4-6"

    system_prompt = """You are a world-class UI/UX Architect and Lead React Developer.
Your goal is to build a high-end, conversion-optimized website that looks like it cost £10k+.

DESIGN PRINCIPLES:
1. Visual Hierarchy: Strong typography scale using clamp() for fluid sizing, generous whitespace.
2. Color System: Derive a sophisticated palette (Primary, Accent, Surface, Neutral) from the brand colors.
   - Use CSS custom properties in tailwind.config.js for the full palette.
   - Dark sections should alternate with light to create visual rhythm.
3. Motion & Polish: Use subtle CSS transitions (translate, opacity, scale) via Tailwind's `transition` utilities.
   Add hover states on all interactive elements. Use `animate-fade-in` patterns via @keyframes in index.css.
4. Imagery: Use https://picsum.photos/seed/<unique-seed>/W/H for all images. Pick seeds relevant to the industry.
5. Icons: Use lucide-react exclusively. Never use emoji as icons.
6. Layout: Use CSS Grid for page structure, Flexbox for component internals.
7. Sections required: Navbar (sticky, blur backdrop), Hero (full-height, bold headline + CTA),
   Services (card grid), About (split layout with image), Testimonials (carousel or grid),
   Contact (form + map placeholder), Footer (multi-column).

ARCHITECTURE RULES:
1. Return a SINGLE raw JSON object. Keys = relative file paths. Values = full file content strings.
2. Do NOT wrap output in markdown code fences. Start your response with `{` and end with `}`.
3. Combine ALL UI sections into `src/components/SiteContent.tsx` to maximise token efficiency.
4. Use Tailwind CSS for all styling. Code must be fully typed TypeScript, production-ready.
5. The Hero headline must use the company name. CTAs must reference real services.
6. Contact form must have: Name, Email, Phone, Message fields + a styled submit button.

CONCISENESS RULES:
- Be extremely concise with code. Avoid unnecessary comments or whitespace.
- Use functional components and short-hand syntax where possible.
- Ensure the total output is under 12,000 tokens.

COST-SAVING RULES:
- Avoid repetitive boilerplate; reuse patterns.
- Keep comments minimal (one-liners only where truly needed).
- Do not generate placeholder/example data — use the real data provided."""

    user_prompt = f"""Generate a premium React + Vite + TypeScript website for this business:

Company:      {application_data["company_name"]}
Location:     {application_data["city_location"]}
Services:     {application_data["services_list"]}
Testimonials: {application_data["testimonials"]}
Brand Colors: {application_data["branding_colors"]}

REQUIRED FILES (all must be present):
- package.json              (include: react, react-dom, lucide-react, tailwindcss, vite, typescript)
- vite.config.ts
- tsconfig.json
- tailwind.config.js        (extend theme with brand color palette derived from Brand Colors above)
- index.html                (include Google Fonts import for a premium font pairing)
- src/main.tsx
- src/App.tsx
- src/index.css             (Tailwind directives + @keyframes for entrance animations)
- src/components/SiteContent.tsx   (ALL sections: Navbar, Hero, Services, About, Testimonials, Contact, Footer)
- src/utils/cn.ts           (tailwind-merge + clsx helper)

Remember: respond with ONLY the raw JSON object. No markdown, no explanation."""

    for attempt in range(retries):
        try:
            logger.info(
                f"Starting High-Quality Claude generation (Attempt {attempt + 1})..."
            )

            response = client.messages.create(
                model=MODEL,
                max_tokens=12000,  # Increased to prevent truncation
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            )

            text = response.content[0].text.strip()
            stop_reason = response.stop_reason

            # Strip any accidental markdown fences the model may still produce
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()

            try:
                code_files = json.loads(text)
                logger.info(f"Successfully generated {len(code_files)} files. Stop reason: {stop_reason}")
                return code_files
            except json.JSONDecodeError as e:
                logger.error(f"JSON parse error on attempt {attempt + 1}: {e}")
                logger.error(f"Stop reason: {stop_reason}")
                logger.error(f"Text length: {len(text)}")
                logger.error(f"Text preview (start): {text[:200]}...")
                logger.error(f"Text preview (end): ...{text[-200:]}")
                
                # Try to "fix" a truncated JSON if it looks like it was just cut off
                if stop_reason == "max_tokens" or "Unterminated string" in str(e):
                    logger.warning("Attempting to fix truncated JSON...")
                    # This is a hail mary, better to just fail and let it retry or increase tokens

        except anthropic.APIStatusError as e:
            logger.error(f"Anthropic API error {e.status_code}: {e.message}")

        except Exception as e:
            logger.error(f"Generation error: {e}")

        if attempt < retries - 1:
            backoff = delay * (2**attempt)  # Exponential backoff: 5s, 10s

            logger.info(f"Retrying in {backoff}s...")

            time.sleep(backoff)

    logger.error(
        f"Failed to generate code for {application_data.get('company_name', 'unknown')}"
    )

    return None
