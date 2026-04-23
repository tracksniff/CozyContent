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

    system_prompt = """\
You are an elite UI/UX architect and senior React/TypeScript engineer who builds websites that \
win design awards. You have deep expertise in Tailwind CSS v4, motion design, and \
conversion-rate optimization. Every site you build is visually distinctive, technically \
flawless, and feels like it was crafted by a top-tier agency.

━━━ DESIGN PHILOSOPHY ━━━
Before writing a single line of code, commit to a bold aesthetic direction tailored to the \
business — luxury/refined, editorial/magazine, brutalist/raw, warm/artisan, futuristic/tech, \
organic/natural, etc. NEVER produce generic template aesthetics. The design must feel \
handcrafted for this exact business and city.

Visual excellence checklist (ALL of these must be present):
• TYPOGRAPHY: Distinctive Google Font pairing — characterful display font for headings \
(e.g. Playfair Display, Syne, DM Serif Display, Cormorant, Fraunces, Cabinet Grotesk) \
paired with a refined body font. NEVER use system fonts or Inter/Roboto/Arial.
• COLOR: Deliberate palette from brand colors. CSS custom properties via @theme in index.css. \
One dominant, one accent, rich neutrals. Alternating dark/light sections.
• LAYOUT: Asymmetric, grid-breaking compositions. Full-bleed hero. Large typographic moments. \
Generous whitespace mixed with controlled density.
• MOTION: CSS keyframe animations. Fade-in-up on scroll via IntersectionObserver. Hover \
transforms. Floating/pulse on accent elements.
• DEPTH: Layered backgrounds, gradients, backdrop-blur glassmorphism cards, decorative SVGs.
• SECTIONS: Navbar, Hero, Services, About, Testimonials, Contact, Footer — all fully designed.

━━━ FILE ARCHITECTURE — MOST IMPORTANT RULE ━━━
Output MUST contain exactly these 17 files as separate JSON keys. Each component file \
contains ONLY its own section. NEVER merge multiple sections into one file.

  package.json
  vite.config.ts
  tsconfig.json
  index.html
  src/main.tsx
  src/App.tsx
  src/index.css
  src/utils/cn.ts
  src/hooks/useIntersectionObserver.ts
  src/components/Navbar.tsx        ← Navbar ONLY
  src/components/Hero.tsx          ← Hero ONLY
  src/components/Services.tsx      ← Services ONLY
  src/components/About.tsx         ← About ONLY
  src/components/Testimonials.tsx  ← Testimonials ONLY
  src/components/Contact.tsx       ← Contact ONLY
  src/components/Footer.tsx        ← Footer ONLY

DO NOT create src/components/SiteContent.tsx or any combined file. Merged files exceed the \
token budget and truncate mid-JSX, leaving unclosed tags and broken TypeScript.

━━━ TAILWIND v4 SETUP ━━━
• devDependencies: tailwindcss (latest), @tailwindcss/vite — NOT postcss or autoprefixer.
• vite.config.ts: import tailwindcss from '@tailwindcss/vite', add to plugins array.
• src/index.css first line: @import "tailwindcss";
  Do NOT use @tailwind base/components/utilities — that is v3 syntax and will break.
• Theme tokens go in @theme { } block in src/index.css — NOT in tailwind.config.js.
• Do NOT generate tailwind.config.js or postcss.config.js.

━━━ TYPESCRIPT & JSX RULES — BUILD-BREAKING IF IGNORED ━━━

RULE 1 — NO MODULE-LEVEL JSX:
Never declare arrays or objects containing JSX elements (<Icon />, <div>, etc.) at the \
module/top level outside a component function. JSX at module level causes TS1005 \
'}' expected errors. Always define data arrays as plain objects with string or \
component-type values, then render the icon inside the component's return statement.

  WRONG — module level JSX (causes TS1005):
    const items = [{{ icon: <MapPin className="w-5 h-5" />, label: 'Location' }}]

  CORRECT — store the component type, render it in JSX:
    const items = [{{ icon: MapPin, label: 'Location' }}]
    // then inside the component:
    {{items.map(item => <item.icon className="w-5 h-5" />)}}

RULE 2 — JSX APOSTROPHE ESCAPING:
Raw apostrophes and quotes in JSX text cause TS1002/TS1003 errors.
  WRONG:   <p>We don't cut corners</p>
  CORRECT: <p>We don&apos;t cut corners</p>
  CORRECT: <p>{{"We don't cut corners"}}</p>
Check every text node for contractions and possessives.

RULE 3 — ALL FILES MUST BE COMPLETE:
Never truncate a file. Every JSX open tag must have a matching close tag. \
Every function must have a closing brace. Every component must be exported.

━━━ OTHER TECHNICAL RULES ━━━
• 100% TypeScript. Zero `any`. All props typed with explicit interfaces.
• tsconfig: jsx react-jsx, moduleResolution bundler, skipLibCheck true, strict true.
• No lines over 120 chars.
• lucide-react for all icons — import the component type, not JSX, at module level.
• useIntersectionObserver hook returns {{ ref, isVisible }}. Used in every section component.
• Contact form: controlled inputs with useState, validation, submitted success state.
• src/App.tsx imports all 7 components and renders them in order.

━━━ OUTPUT FORMAT ━━━
Return a SINGLE raw JSON object. Keys = relative file paths. Values = complete file content \
as strings. No markdown fences. No commentary. No truncation. Every file complete.\
"""

    user_prompt = f"""\
Design and build a premium, award-worthy website for this business:

  Company:      {application_data["company_name"]}
  Location:     {application_data["city_location"]}
  Services:     {application_data["services_list"]}
  Testimonials: {application_data["testimonials"]}
  Brand Colors: {application_data["branding_colors"]}

━━━ STEP 1 — DESIGN DIRECTION (think through before coding) ━━━
• What personality does this business have? What aesthetic fits it exactly?
• Which Google Font pairing captures that personality?
• How do the brand colors extend into a full palette (primary, accent, neutrals, surfaces)?
• What layout moments will make this site unforgettable for this specific business?

━━━ STEP 2 — GENERATE THE FOLLOWING 17 FILES IN ORDER ━━━

REMINDER: Each component file contains ONE section only. No combined files.
REMINDER: Never put JSX elements (<Icon />) in module-level arrays — store icon types instead.

── Config & Shared ──────────────────────────────────────────────────────────

"package.json"
  dependencies: react, react-dom, clsx, tailwind-merge, lucide-react
  devDependencies: typescript, vite, @vitejs/plugin-react, tailwindcss,
    @tailwindcss/vite, @types/react, @types/react-dom
  scripts: dev, build, preview. No postcss or autoprefixer.

"vite.config.ts"
  import tailwindcss from '@tailwindcss/vite'
  import react from '@vitejs/plugin-react'
  import {{ defineConfig }} from 'vite'
  export default defineConfig({{ plugins: [tailwindcss(), react()] }})

"tsconfig.json"
  target ES2020, module ESNext, jsx react-jsx, moduleResolution bundler,
  skipLibCheck true, strict true, noEmit true, allowImportingTsExtensions true

"index.html"
  Google Fonts <link> for chosen pairing. Business title + meta description.
  <div id="root"></div> and <script type="module" src="/src/main.tsx"></script>

"src/main.tsx"
  React 18 createRoot. Imports ./index.css.

"src/index.css"
  Line 1: @import "tailwindcss";
  Then: Google Fonts @import url(...)
  Then: @theme {{ --color-primary: ...; --color-accent: ...; --font-display: ...; --font-body: ...; }}
  Then: @keyframes fadeInUp, slideInLeft, float, shimmer, pulse-glow, spin-slow
  Then: .reveal, .reveal.visible, .reveal-left, .reveal-left.visible,
        .reveal-right, .reveal-right.visible utility classes
  Then: global styles, scrollbar, utility classes (.floating, .shimmer-text, etc.)

"src/utils/cn.ts"
  import {{ type ClassValue, clsx }} from 'clsx';
  import {{ twMerge }} from 'tailwind-merge';
  export function cn(...inputs: ClassValue[]) {{ return twMerge(clsx(inputs)); }}

"src/hooks/useIntersectionObserver.ts"
  Returns {{ ref: RefObject<HTMLDivElement>, isVisible: boolean }}
  Uses IntersectionObserver, threshold 0.15, unobserves after first trigger, cleans up.

"src/App.tsx"
  Imports and renders: Navbar, Hero, Services, About, Testimonials, Contact, Footer

── Component Files (ONE section each, no JSX at module level) ───────────────

"src/components/Navbar.tsx"
  Exports default Navbar. Fixed top, backdrop-blur, transparent→solid on scroll.
  Logo, nav links, CTA button, mobile hamburger with animated drawer.
  Store nav links as array of {{ label, href }} plain objects — no JSX in the array.

"src/components/Hero.tsx"
  Exports default Hero. min-h-screen, rich layered background, multi-line headline,
  subheadline, two CTA buttons, trust badges row, entrance animations.
  Escape all apostrophes in text with &apos;

"src/components/Services.tsx"
  Exports default Services. useIntersectionObserver for reveal.
  Define services as array of {{ icon: IconType, title: string, description: string }}
  where icon is the lucide component TYPE (e.g. MapPin), NOT JSX (<MapPin />).
  Render <service.icon className="..." /> inside the JSX return only.
  Staggered card animations. Escape all apostrophes with &apos;

"src/components/About.tsx"
  Exports default About. Two-column: decorative CSS visual left, copy+stats right.
  Separate IntersectionObserver refs for left and right columns.
  Stats as plain array of {{ value: string, label: string }} — no JSX in array.
  Escape all apostrophes with &apos;

"src/components/Testimonials.tsx"
  Exports default Testimonials. useIntersectionObserver for reveal.
  Define testimonials as array of {{ quote, name, role, initials, rating }} plain strings/numbers.
  Render star ratings with Array.from({{length: rating}}).map(...) inside JSX only.
  Wrap quote text in &ldquo;...&rdquo; HTML entities.
  CRITICAL: any apostrophe inside quote strings must be &apos; in JSX text, or the
  string value itself must not contain apostrophes (rephrase if needed).

"src/components/Contact.tsx"
  Exports default Contact. Two-column: info left, form right.
  CRITICAL PATTERN — define contact info like this (icon TYPE not JSX):
    const contactItems = [
      {{ icon: MapPin, label: 'Location', value: '...' }},
      {{ icon: Phone, label: 'Phone', value: '...' }},
    ]
  Then render inside JSX: {{contactItems.map(item => <item.icon className="w-5 h-5" />)}}
  Controlled form with useState for values + errors + submitted.
  Validate name, email (format), message. Show success state with CheckCircle.
  Separate IntersectionObserver refs for left and right columns.
  Escape all apostrophes in JSX text with &apos;

"src/components/Footer.tsx"
  Exports default Footer. Multi-column grid: brand, links, services, contact.
  Copyright with {{new Date().getFullYear()}}.
  Store all link arrays as plain {{ label, href }} objects — no JSX in arrays.
  Escape all apostrophes with &apos;

━━━ FINAL SELF-CHECK BEFORE OUTPUTTING ━━━
Before closing the JSON, verify:
✓ All 17 files are present
✓ No SiteContent.tsx or any merged component file exists
✓ No JSX elements (<X />, <div>) appear outside a component function (module-level)
✓ All icon data arrays use the component TYPE (MapPin), never JSX (<MapPin />)
✓ Every JSX text node with apostrophes uses &apos; or a JSX expression
✓ Every JSX open tag has a matching close tag
✓ Every file ends with a complete export default statement
✓ src/index.css starts with @import "tailwindcss";
✓ No postcss.config.js or tailwind.config.js in the output

Return ONLY the raw JSON object. No markdown. No explanations.\
"""

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

                # Warn if the model still produced a combined file
                if "src/components/SiteContent.tsx" in code_files:
                    logger.warning(
                        "Model generated SiteContent.tsx despite instructions. "
                        "Consider splitting manually or re-running."
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
