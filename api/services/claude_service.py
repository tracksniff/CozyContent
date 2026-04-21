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

STRICT ARCHITECTURE RULES:
1. LANGUAGE: Use ONLY TypeScript (.ts, .tsx). Code must be 100% valid TypeScript.
2. DEPENDENCIES: You MUST include "clsx" and "tailwind-merge" in your `package.json` as they are used in `cn.ts`.
3. CONFIGURATION: 
   - `tsconfig.json` MUST use `"jsx": "react-jsx"`, `"moduleResolution": "bundler"`, and `"skipLibCheck": true`.
   - `package.json` MUST include `@types/react` and `@types/react-dom` in `devDependencies`.
4. CODE QUALITY:
   - Avoid extremely long lines (over 200 characters). 
   - Use template literals (backticks) for any string containing a single or double quote.
   - Ensure every component is properly closed. No truncated files.
5. STRUCTURE: 
   - Combine ALL UI sections into `src/components/SiteContent.tsx`.
   - Ensure `src/utils/cn.ts` is exactly:
     ```typescript
     import { type ClassValue, clsx } from 'clsx';
     import { twMerge } from 'tailwind-merge';
     export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
     ```

OUTPUT FORMAT: Return a SINGLE raw JSON object. Keys = relative file paths. Values = content strings. No markdown fences.
"""

    user_prompt = f"""Generate a premium, fully-typed TypeScript React website (Vite + Tailwind) for this business:

Company:      {application_data["company_name"]}
Location:     {application_data["city_location"]}
Services:     {application_data["services_list"]}
Testimonials: {application_data["testimonials"]}
Brand Colors: {application_data["branding_colors"]}

REQUIRED FILES (The build will fail if any are missing or have syntax errors):
1. package.json: Must include "clsx", "tailwind-merge", "lucide-react", "react", "react-dom", "tailwindcss", "postcss", "autoprefixer", "vite", "typescript".
2. tsconfig.json: Ensure "jsx": "react-jsx".
3. tailwind.config.js: Ensure content: ["./index.html", "./src/**/*.{{js,ts,jsx,tsx}}"].
4. postcss.config.js: Standard export with tailwindcss and autoprefixer.
5. src/utils/cn.ts: Must export the `cn` helper using `clsx` and `tailwind-merge`.
6. src/components/SiteContent.tsx: A single file containing Navbar, Hero, Services, About, Testimonials, Contact, and Footer. Use clean, segmented code.

Remember: respond with ONLY the raw JSON object. Ensure 100% syntax correctness for a production build."""

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
