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

━━━ FILE ARCHITECTURE — THIS IS THE MOST IMPORTANT RULE ━━━
The output MUST contain exactly these files as separate JSON keys. Each component file \
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

DO NOT create src/components/SiteContent.tsx or any other combined file. \
Any file that contains more than one page section WILL cause build failures due to \
token-limit truncation leaving unclosed JSX tags.

━━━ TAILWIND v4 SETUP ━━━
• devDependencies: tailwindcss (latest), @tailwindcss/vite — NOT postcss or autoprefixer.
• vite.config.ts: import tailwindcss from '@tailwindcss/vite', add to plugins array.
• src/index.css first line: @import "tailwindcss";
  Do NOT use @tailwind base/components/utilities — that is v3 syntax and will break.
• Theme tokens go in @theme { } block in src/index.css — NOT in tailwind.config.js.
• Do NOT generate tailwind.config.js or postcss.config.js.

━━━ JSX STRING SAFETY — BUILD-BREAKING IF IGNORED ━━━
Raw apostrophes and quotes in JSX text cause TS1002/TS1003 errors. They MUST be escaped.
  WRONG:   <p>We don't cut corners</p>
  CORRECT: <p>We don&apos;t cut corners</p>   ← use HTML entity (preferred)
  CORRECT: <p>{"We don't cut corners"}</p>    ← or JSX expression
Check every text node for contractions (don't, we're, it's) and possessives (company's). \
This is the single most common cause of build failures in generated JSX.

━━━ OTHER TECHNICAL RULES ━━━
• 100% TypeScript. Zero `any`. All props typed with explicit interfaces.
• tsconfig: jsx react-jsx, moduleResolution bundler, skipLibCheck true, strict true.
• No lines over 120 chars. Every JSX open tag has a matching close tag.
• lucide-react for all icons — import only what each file uses.
• useIntersectionObserver hook returns { ref, isVisible }. Used in every section component.
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

━━━ STEP 2 — GENERATE THE FOLLOWING FILES IN ORDER ━━━

REMINDER: Each component file contains ONE section only. No combined files.

── Config & Entry ──────────────────────────────────────────────────────────

"package.json"
  dependencies: react, react-dom, clsx, tailwind-merge, lucide-react
  devDependencies: typescript, vite, @vitejs/plugin-react, tailwindcss,
    @tailwindcss/vite, @types/react, @types/react-dom
  scripts: dev, build, preview
  Do NOT include postcss or autoprefixer.

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
  Then: .reveal {{ opacity: 0; transform: translateY(24px); transition: all 0.6s ease; }}
        .reveal.visible {{ opacity: 1; transform: translateY(0); }}
        .reveal-left {{ opacity: 0; transform: translateX(-30px); transition: all 0.7s ease; }}
        .reveal-left.visible {{ opacity: 1; transform: translateX(0); }}
        .reveal-right {{ opacity: 0; transform: translateX(30px); transition: all 0.7s ease; }}
        .reveal-right.visible {{ opacity: 1; transform: translateX(0); }}
  Then: global styles (scroll-behavior smooth, selection color, scrollbar, body font)
  Then: any utility classes (.floating, .shimmer-text, .glass-card, .noise-overlay, etc.)

"src/utils/cn.ts"
  import {{ type ClassValue, clsx }} from 'clsx';
  import {{ twMerge }} from 'tailwind-merge';
  export function cn(...inputs: ClassValue[]) {{ return twMerge(clsx(inputs)); }}

"src/hooks/useIntersectionObserver.ts"
  Returns {{ ref: RefObject<HTMLDivElement>, isVisible: boolean }}
  Uses IntersectionObserver with threshold 0.15. Unobserves after first trigger.
  Cleans up on unmount.

"src/App.tsx"
  import Navbar from './components/Navbar'
  import Hero from './components/Hero'
  import Services from './components/Services'
  import About from './components/About'
  import Testimonials from './components/Testimonials'
  import Contact from './components/Contact'
  import Footer from './components/Footer'
  export default function App() {{ return <><Navbar/><Hero/>...<Footer/></> }}

── Component Files (ONE section per file, no exceptions) ────────────────────

"src/components/Navbar.tsx"
  Exports default Navbar component. Contains ONLY navbar code.
  - Fixed top, z-50, backdrop-blur, transparent → solid bg on scroll (useEffect + useState)
  - Logo with icon + brand name. Nav links array mapped to anchor tags.
  - CTA button. Mobile hamburger with useState, animated open/close drawer.
  - All link text: no raw apostrophes — use &apos; if needed.

"src/components/Hero.tsx"
  Exports default Hero component. Contains ONLY hero code.
  - min-h-screen, flex items-center. Rich layered background (gradients + decorative SVG/shapes).
  - Multi-line headline with company name for impact. Subheadline. Two CTA buttons.
  - Trust badges row (e.g. certification, years experience, availability).
  - Entrance animations via inline style animation or CSS class applied on mount.
  - All JSX text: escape apostrophes with &apos;

"src/components/Services.tsx"
  Exports default Services component. Contains ONLY services code.
  - useIntersectionObserver for section reveal.
  - Section header with eyebrow label + headline.
  - Grid of service cards (use all services from the business data).
  - Each card: lucide icon, title, description, hover lift + border transition.
  - Staggered transitionDelay per card index.
  - All JSX text: escape apostrophes with &apos;

"src/components/About.tsx"
  Exports default About component. Contains ONLY about code.
  - Two-column layout. Left: decorative CSS visual (overlapping shapes, brand colors, big icon).
    Include a floating stat badge absolutely positioned on the visual.
  - Right: eyebrow + headline + 2 paragraphs + stats grid (2x2) + CTA button.
  - Use separate useRef + IntersectionObserver for left and right columns for split animation.
  - All JSX text: escape apostrophes with &apos;

"src/components/Testimonials.tsx"
  Exports default Testimonials component. Contains ONLY testimonials code.
  - useIntersectionObserver for section reveal.
  - Section header centered.
  - Grid of testimonial cards (use the provided testimonials verbatim).
  - Each card: Quote icon, star rating, quote text wrapped in &ldquo;...&rdquo;,
    avatar initials circle, name, role/company.
  - CRITICAL: any apostrophe inside quote text must be &apos; — never a raw '.
  - Staggered transitionDelay per card.

"src/components/Contact.tsx"
  Exports default Contact component. Contains ONLY contact code.
  - Two-column layout. Left: eyebrow + headline + paragraph + contact info list with icons.
  - Right: glassmorphism card containing controlled form.
  - Form fields: name, email, phone (optional), message (textarea).
  - useState for form values + errors + submitted state.
  - Validate name (required), email (required + format), message (required).
  - On success show a thank-you state with CheckCircle icon.
  - Use separate useRef + IntersectionObserver for left/right columns.
  - All JSX text: escape apostrophes with &apos;

"src/components/Footer.tsx"
  Exports default Footer component. Contains ONLY footer code.
  - Multi-column grid: brand column (logo + tagline + socials), quick links,
    services list, contact details.
  - Bottom bar: copyright line with current year via {{new Date().getFullYear()}}.
  - All JSX text: escape apostrophes with &apos;

━━━ FINAL CHECKLIST BEFORE OUTPUTTING ━━━
✓ 17 files total — every file listed above is present in the JSON
✓ No src/components/SiteContent.tsx or any other merged file exists
✓ Every JSX text node with ' or " uses &apos;/&quot; or a JSX expression
✓ Every JSX open tag has a matching close tag
✓ No file is truncated — every component is complete
✓ src/index.css starts with @import "tailwindcss"; not @tailwind directives
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
