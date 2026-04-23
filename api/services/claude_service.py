import anthropic
import os
import logging
import json
import time

logger = logging.getLogger(__name__)


def repair_json_truncation(json_str):
    """
    Hail mary to close a truncated JSON string.
    Finds open quotes, braces, and brackets and closes them in reverse order.
    """
    json_str = json_str.strip()

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

    if in_string:
        json_str += '"'

    while stack:
        opener = stack.pop()
        if opener == "{":
            json_str += "}"
        else:
            json_str += "]"

    return json_str


def generate_website_code(application_data, retries=2, delay=5):
    """
    Generates a website using individual component files with strict syntax rules.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        logger.error("ANTHROPIC_API_KEY not found")
        return None

    client = anthropic.Anthropic(api_key=api_key)
    MODEL = "claude-sonnet-4-6"

    system_prompt = """You are an elite Lead React Developer. 
Your goal is to build a high-end, award-worthy website using TypeScript and Tailwind CSS.

━━━ STAGE 1: ARCHITECTURE ━━━
Generate exactly 14 files. Each component must be in its own file.

CONFIG: package.json, vite.config.ts, tsconfig.json, index.html, src/main.tsx, src/index.css, src/utils/cn.ts, src/App.tsx
COMPONENTS: src/components/Navbar.tsx, src/components/Hero.tsx, src/components/Services.tsx, src/components/About.tsx, src/components/Testimonials.tsx, src/components/Contact.tsx, src/components/Footer.tsx

━━━ STAGE 2: CRITICAL SYNTAX RULES (NO EXCEPTIONS) ━━━
1. APOSTROPHES: Never use raw apostrophes (') or quotes (") in JSX text. Use &apos; or &quot;. 
   Example: <p>We don&apos;t settle</p>
2. MODULE-LEVEL JSX: Never put JSX tags (<Icon />) inside data arrays outside a component. 
   WRONG: const items = [{ icon: <MapPin /> }];
   RIGHT: const items = [{ icon: MapPin }]; // Store type, render as <item.icon /> in JSX.
3. TAILWIND v4: Use @import "tailwindcss"; in index.css. Use @theme { } for custom colors. Use @tailwindcss/vite in vite.config.ts.
4. COMPLETENESS: Every file must be a complete, valid TypeScript file. No truncation.

━━━ STAGE 3: DESIGN ━━━
Use premium typography (Google Fonts), fluid animations (framer-motion), and Lucide-react icons. 
Focus on high-contrast, modern layouts with glassmorphism and deep gradients.

OUTPUT: Return a SINGLE raw JSON object. Keys = relative file paths. Values = complete content strings.
"""

    user_prompt = f"""Generate a premium website for:
Company: {application_data["company_name"]}
Location: {application_data["city_location"]}
Services: {application_data["services_list"]}
Testimonials: {application_data["testimonials"]}
Colors: {application_data["branding_colors"]}

FILES TO GENERATE:
1. package.json (react, framer-motion, lucide-react, tailwind-merge, clsx)
2. vite.config.ts (@tailwindcss/vite)
3. tsconfig.json (react-jsx)
4. index.html (Google Fonts)
5. src/main.tsx
6. src/index.css (Tailwind v4)
7. src/utils/cn.ts
8. src/App.tsx (Renders all components)
9. src/components/Navbar.tsx
10. src/components/Hero.tsx
11. src/components/Services.tsx
12. src/components/About.tsx
13. src/components/Testimonials.tsx
14. src/components/Contact.tsx (Include a functional form with state)
15. src/components/Footer.tsx

Ensure 100% build-ready code. Escape all apostrophes. No truncated JSON."""

    for attempt in range(retries):
        try:
            logger.info(f"Starting Multi-File Generation (Attempt {attempt + 1})...")

            response = client.messages.create(
                model=MODEL,
                max_tokens=16000,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            )

            text = response.content[0].text.strip()
            stop_reason = response.stop_reason

            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()

            try:
                code_files = json.loads(text)
                logger.info(f"Generated {len(code_files)} files. Stop reason: {stop_reason}")
                return code_files
            except json.JSONDecodeError as e:
                logger.error(f"JSON parse error: {e}")
                if stop_reason == "max_tokens" or "Unterminated string" in str(e):
                    fixed_text = repair_json_truncation(text)
                    try:
                        code_files = json.loads(fixed_text)
                        return code_files
                    except:
                        pass

        except Exception as e:
            logger.error(f"Generation error: {e}")
        
        if attempt < retries - 1:
            time.sleep(delay)

    return None
