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
    High-quality website generation using Claude.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        logger.error("ANTHROPIC_API_KEY not found")
        return None

    client = anthropic.Anthropic(api_key=api_key)
    MODEL = "claude-sonnet-4-6"

    system_prompt = """You are an elite UI/UX architect and senior React/TypeScript engineer who builds\
 websites that win design awards. You have deep expertise in Tailwind CSS v4, motion design, and\
 conversion-rate optimization. Every site you build is visually distinctive, technically flawless,\
 and feels like it was crafted by a top-tier agency.

━━━ DESIGN PHILOSOPHY ━━━
Before writing a single line of code, you commit to a bold, specific aesthetic direction tailored\
 to the business — luxury/refined, editorial/magazine, brutalist/raw, warm/artisan, futuristic/tech,\
 organic/natural, etc. You NEVER produce generic "template" aesthetics. The design must feel\
 handcrafted for this exact business and city.

Visual excellence checklist (every site must have ALL of these):
• TYPOGRAPHY: Choose a distinctive Google Font pairing — a characterful display font for headings\
 (e.g. Playfair Display, Syne, DM Serif Display, Cormorant, Fraunces, Cabinet Grotesk) paired\
 with a refined body font. Import via @import in the CSS. NEVER use system fonts or Inter/Roboto/Arial.
• COLOR: A deliberate palette derived from the brand colors. Use CSS custom properties (defined in\
 `src/index.css` via `@theme`). One dominant color, one accent, rich neutrals. Dark and light\
 sections for contrast rhythm.
• LAYOUT: Asymmetric, grid-breaking compositions. Overlapping elements. Full-bleed hero. Large\
 typographic moments. Generous whitespace in some sections, controlled density in others.
• MOTION: Smooth CSS transitions and keyframe animations. Fade-in-up on scroll (use\
 IntersectionObserver in a useEffect). Hover states with transforms. Parallax-style hero. Subtle\
 floating/pulse animations on accent elements.
• DEPTH: Layered backgrounds — gradients, subtle noise texture via SVG filter or CSS, backdrop-blur\
 glassmorphism cards, long box-shadows, decorative geometric SVG shapes.
• SECTIONS: Navbar (sticky, blur on scroll), Hero (full-viewport, bold headline, CTA), Services\
 (icon cards with hover lift), About (split layout with visual), Testimonials (styled quote cards),\
 Contact (form + info), Footer (rich, multi-column).

━━━ STRICT TECHNICAL RULES ━━━
1. LANGUAGE: 100% TypeScript (.ts / .tsx). Zero `any` types. All props have explicit interfaces.
2. TAILWIND v4 SETUP — CRITICAL, DO NOT USE THE OLD APPROACH:
   • Install `tailwindcss@next` and `@tailwindcss/vite` — NOT postcss or autoprefixer.
   • In `vite.config.ts`, import and add `tailwindcss` from `@tailwindcss/vite` to the plugins array.
   • In `src/index.css`, use `@import "tailwindcss";` as the ONLY Tailwind directive.
     Do NOT use `@tailwind base/components/utilities` — those are v3 syntax and will break.
   • Define all theme customizations (colors, fonts, animations) in `src/index.css` using
     `@theme {{ --color-primary: ...; --font-display: ...; }}` blocks — NOT in a config file.
   • There is NO `tailwind.config.js` or `postcss.config.js`. Do not generate these files.
3. DEPENDENCIES: package.json MUST include:
   - dependencies: react, react-dom, clsx, tailwind-merge, lucide-react
   - devDependencies: typescript, vite, @vitejs/plugin-react, tailwindcss (latest/next),\
     @tailwindcss/vite, @types/react, @types/react-dom
   - Do NOT include: postcss, autoprefixer, tailwind.config.js related packages
4. TSCONFIG: `"jsx": "react-jsx"`, `"moduleResolution": "bundler"`, `"skipLibCheck": true`,\
 `"strict": true`.
5. CN UTILITY: `src/utils/cn.ts` must be exactly:
   import {{ type ClassValue, clsx }} from 'clsx';
   import {{ twMerge }} from 'tailwind-merge';
   export function cn(...inputs: ClassValue[]) {{ return twMerge(clsx(inputs)); }}
6. STRUCTURE: ALL visual sections live in `src/components/SiteContent.tsx`. Each section is its\
 own named sub-component within that file. `src/App.tsx` simply renders `<SiteContent />`.
7. CODE QUALITY: No lines over 120 chars. Use template literals for strings containing quotes.\
 Every JSX element properly closed. No truncated files. Functional components only.
8. ICONS: Use lucide-react for all icons. Import only what you use.
9. SCROLL ANIMATIONS: Implement a reusable `useIntersectionObserver` hook in\
 `src/hooks/useIntersectionObserver.ts` that returns isVisible and a ref. Use it across sections\
 for staggered fade-in-up reveals driven by CSS classes toggled in `src/index.css`.
10. FORMS: Contact form must have controlled inputs with useState and basic validation feedback.

━━━ OUTPUT FORMAT ━━━
Return a SINGLE raw JSON object. Keys are relative file paths (e.g. "src/App.tsx"). Values are\
 the complete file content as strings. No markdown fences. No commentary. No truncation."""

    user_prompt = f"""Design and build a premium, award-worthy website for this business:

┌─────────────────────────────────────────┐
│  Company:      {application_data["company_name"]}
│  Location:     {application_data["city_location"]}
│  Services:     {application_data["services_list"]}
│  Testimonials: {application_data["testimonials"]}
│  Brand Colors: {application_data["branding_colors"]}
└─────────────────────────────────────────┘

STEP 1 — DESIGN DIRECTION (reason through this before coding):
• What is the personality of this business? What aesthetic fits perfectly?
• What Google Font pairing captures that personality?
• How should the brand colors be extended into a full palette?
• What layout moments will make this site unforgettable?

STEP 2 — GENERATE ALL FILES:

Required files (build fails if any are missing or have errors):

NOTE: This project uses Tailwind CSS v4. Do NOT generate tailwind.config.js or postcss.config.js.
Tailwind v4 is configured entirely through src/index.css and the Vite plugin.

"package.json"
  - name: kebab-case company name
  - scripts: dev, build, preview
  - dependencies: react, react-dom, clsx, tailwind-merge, lucide-react
  - devDependencies: typescript, vite, @vitejs/plugin-react, tailwindcss@next,
    @tailwindcss/vite, @types/react, @types/react-dom
  - Do NOT include postcss or autoprefixer — they are not needed in v4
  - versions: react 18, vite 5, tailwindcss latest/next

"vite.config.ts"
  - Import tailwindcss from '@tailwindcss/vite'
  - plugins: [tailwindcss(), react()]
  - Example:
      import tailwindcss from '@tailwindcss/vite'
      import react from '@vitejs/plugin-react'
      import {{ defineConfig }} from 'vite'
      export default defineConfig({{ plugins: [tailwindcss(), react()] }})

"tsconfig.json"
  - compilerOptions: target ES2020, lib [ES2020, DOM, DOM.Iterable],
    module ESNext, skipLibCheck true, moduleResolution bundler,
    allowImportingTsExtensions true, resolveJsonModule true,
    isolatedModules true, noEmit true, jsx react-jsx, strict true,
    baseUrl ".", paths {{"@/*": ["./src/*"]}}
  - include: ["src"]

"index.html"
  - Google Fonts <link> tag for the chosen font pairing
  - Proper title and meta description for the business
  - Root div, script src="/src/main.tsx" with type="module"

"src/main.tsx"
  - Standard React 18 createRoot render, imports './index.css'

"src/App.tsx"
  - Imports and renders <SiteContent />

"src/index.css"
  - FIRST LINE must be: @import "tailwindcss";
    (This replaces all three @tailwind directives from v3. Do not use those.)
  - Google Fonts @import (e.g. @import url('https://fonts.googleapis.com/css2?...'))
  - @theme block to register custom design tokens:
      @theme {{
        --color-primary: ...;
        --color-accent: ...;
        --color-surface: ...;
        --font-display: 'YourDisplayFont', serif;
        --font-body: 'YourBodyFont', sans-serif;
      }}
  - @keyframes for fadeInUp, slideInLeft, float, shimmer, pulse-glow
  - CSS classes for scroll reveal: .reveal (initial hidden state) and
    .reveal.visible (final visible state with transition)
  - Global styles: html scroll-behavior smooth, ::selection color,
    custom scrollbar, body font-family var(--font-body)

"src/utils/cn.ts"
  - Exact cn helper (see rules above)

"src/hooks/useIntersectionObserver.ts"
  - Custom hook that takes a ref and options, returns isVisible boolean
  - Uses IntersectionObserver API with cleanup on unmount

"src/components/SiteContent.tsx"
  - ALL sections in one file: Navbar, Hero, Services, About,
    Testimonials, Contact, Footer
  - Each is a named const component, exported as default from bottom
  - Navbar: sticky, backdrop-blur, transparent→solid on scroll,
    smooth-scroll nav links, mobile hamburger menu with useState
  - Hero: full-viewport height, dramatic headline with the company name
    broken across lines for impact, subheadline, two CTAs, decorative
    background element (geometric SVG shape or gradient orb)
  - Services: grid of cards, each with lucide icon, title, description,
    hover lift + border-color transition, staggered animation delay
  - About: two-column split — decorative visual left (CSS art or styled
    div with brand colors + overlapping shapes), copy right with stats
  - Testimonials: quote cards with avatar initials, star rating,
    name + location, subtle background pattern
  - Contact: split layout — left has contact info with icons, right has
    controlled form (name, email, phone, message) with styled inputs
    and submit button with hover animation
  - Footer: multi-column (brand, links, services, contact info),
    bottom bar with copyright

CRITICAL REMINDERS:
• Every section uses useIntersectionObserver for reveal animations
• All hardcoded content must reflect the actual business data provided
• Testimonials content must use the provided testimonials verbatim
• The design must feel UNIQUE to this specific business — not generic
• Return ONLY the raw JSON object. No markdown. No explanations."""

    for attempt in range(retries):
        try:
            logger.info(
                f"Starting High-Quality Claude generation (Attempt {attempt + 1})..."
            )

            response = client.messages.create(
                model=MODEL,
                max_tokens=16000,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            )

            text = response.content[0].text.strip()
            stop_reason = response.stop_reason

            # Strip markdown fences if model ignored instructions
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()

            try:
                code_files = json.loads(text)
                logger.info(
                    f"Successfully generated {len(code_files)} files. "
                    f"Stop reason: {stop_reason}"
                )
                return code_files
            except json.JSONDecodeError as e:
                logger.error(f"JSON parse error on attempt {attempt + 1}: {e}")

                if stop_reason == "max_tokens" or "Unterminated string" in str(e):
                    logger.warning(
                        "Attempting to repair truncated or malformed JSON..."
                    )
                    fixed_text = repair_json_truncation(text)
                    try:
                        code_files = json.loads(fixed_text)
                        logger.info("Successfully repaired JSON truncation.")
                        return code_files
                    except Exception as repair_error:
                        logger.error(f"JSON repair failed: {repair_error}")

                logger.error(f"Stop reason: {stop_reason}")
                logger.error(f"Text length: {len(text)}")
                logger.error(f"Text preview (end): ...{text[-200:]}")

        except anthropic.APIStatusError as e:
            logger.error(f"Anthropic API error {e.status_code}: {e.message}")
        except Exception as e:
            logger.error(f"Generation error: {e}")

        if attempt < retries - 1:
            backoff = delay * (2**attempt)
            logger.info(f"Retrying in {backoff}s...")
            time.sleep(backoff)

    logger.error(
        f"Failed to generate code for {application_data.get('company_name', 'unknown')}"
    )
    return None
