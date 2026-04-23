import anthropic
import os
import logging
import json
import time
from .build_service import validate_generated_code, get_build_error_fix_prompt

logger = logging.getLogger(__name__)


def repair_json_truncation(json_str):
    """
    Hail mary to close a truncated JSON string.
    Finds open quotes, braces, and brackets and closes them in reverse order.
    """
    json_str = json_str.strip()

    # If it ends with a comma, remove it
    if json_str.endswith(","):
        json_str = json_str[:-1]

    stack = []
    is_escaped = False
    in_string = False

    for char in json_str:
        if is_escaped:
            is_escaped = False
            continue
        if char == "\\":
            is_escaped = True
            continue
        if char == '"':
            in_string = not in_string
            continue
        if not in_string:
            if char == "{" or char == "[":
                stack.append(char)
            elif char == "}":
                if stack and stack[-1] == "{":
                    stack.pop()
            elif char == "]":
                if stack and stack[-1] == "[":
                    stack.pop()

    # If we are stuck in a string, close it
    if in_string:
        json_str += '"'

    # Close open braces/brackets
    while stack:
        opener = stack.pop()
        if opener == "{":
            json_str += "}"
        else:
            json_str += "]"

    return json_str


def generate_website_code(application_data, retries=3, delay=5):
    """
    High-quality website generation using Claude with Build-Fix loop.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        logger.error("ANTHROPIC_API_KEY not found")
        return None

    client = anthropic.Anthropic(api_key=api_key)
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

    messages = [{"role": "user", "content": user_prompt}]
    last_code_files = None

    for attempt in range(retries):
        try:
            logger.info(
                f"Starting Claude generation (Attempt {attempt + 1})..."
            )

            response = client.messages.create(
                model=MODEL,
                max_tokens=12000,
                system=system_prompt,
                messages=messages,
            )

            text = response.content[0].text.strip()
            
            # Strip markdown fences
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()

            try:
                code_files = json.loads(text)
            except json.JSONDecodeError as e:
                logger.warning("JSON parse error, attempting repair...")
                fixed_text = repair_json_truncation(text)
                try:
                    code_files = json.loads(fixed_text)
                except Exception as repair_error:
                    logger.error(f"JSON repair failed: {repair_error}")
                    if attempt < retries - 1:
                        messages.append({"role": "assistant", "content": text})
                        messages.append({"role": "user", "content": "Your JSON was malformed or truncated. Please provide the full valid JSON object again."})
                        continue
                    return None

            # VALIDATION STEP
            logger.info("Validating generated code with build check...")
            success, error_message = validate_generated_code(code_files)
            
            if success:
                logger.info("Code validation passed!")
                return code_files
            else:
                logger.warning(f"Build validation failed on attempt {attempt + 1}")
                if attempt < retries - 1:
                    # Feed errors back to Claude
                    messages.append({"role": "assistant", "content": text})
                    fix_prompt = get_build_error_fix_prompt(code_files, error_message)
                    messages.append({"role": "user", "content": fix_prompt})
                    logger.info("Requesting fix from Claude...")
                    time.sleep(delay)
                    continue
                else:
                    logger.error("Max retries reached. Validation failed.")
                    return code_files # Return anyway as a fallback? Or None? 
                    # Returning the last version even if it fails build might be better than nothing, 
                    # but usually, we want success.

        except Exception as e:
            logger.error(f"Generation error: {e}")
            if attempt < retries - 1:
                time.sleep(delay)
            else:
                return None

    return None
