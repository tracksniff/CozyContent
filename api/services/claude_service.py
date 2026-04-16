import anthropic
import os
import logging
import json
import time

logger = logging.getLogger(__name__)


def generate_website_code(application_data, retries=3, delay=5):
    """
    Generate React + Vite codebase based on application data using the Claude API.
    Includes retry logic for rate limits.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        logger.error("ANTHROPIC_API_KEY not found")
        return None

    # claude-sonnet-4-6: best balance of intelligence and speed for large code generation tasks.
    # Swap to "claude-opus-4-6" for maximum reasoning on the most complex projects.
    client = anthropic.Anthropic(api_key=api_key)
    MODEL = "claude-sonnet-4-6"

    system_prompt = """\
You are a senior full-stack software engineer and UI/UX architect with 10+ years of
experience building production-grade React applications. You specialise in modern,
accessible, and visually stunning web interfaces that convert visitors into customers.

Your code is always:
- Complete and production-ready — no stubs, no placeholders, no TODOs.
- Strongly typed (TypeScript interfaces; no `any`).
- Cleanly structured with single-responsibility components (~120 lines max per file).
- Accessible: semantic HTML5, ARIA labels, keyboard navigation, contrast >= 4.5:1.
- Responsive: mobile-first, breakpoints at sm (640 px), md (768 px), lg (1024 px).

You ALWAYS respond with a single raw JSON object. Keys are relative file paths;
values are the complete file contents as strings. No markdown fences, no explanation,
no preamble, no postamble — ONLY the JSON object.\
"""

    user_prompt = f"""
════════════════════════════════════════════════════════
TASK
════════════════════════════════════════════════════════
Generate a complete, production-ready React + Vite + TypeScript + Tailwind CSS website
for the company described below.

════════════════════════════════════════════════════════
COMPANY DETAILS
════════════════════════════════════════════════════════
Company Name : {application_data["company_name"]}
Industry     : {application_data["industry"]}
Website URL  : {application_data["website_url"]}
Location     : {application_data["city_location"]}
Services     : {application_data["services_list"]}
Testimonials : {application_data["testimonials"]}
Brand Colors : {application_data["branding_colors"]}

════════════════════════════════════════════════════════
DESIGN PRINCIPLES  (follow strictly)
════════════════════════════════════════════════════════
1. Visual Hierarchy   — clear H1 -> H2 -> body type scale; whitespace-driven layout.
2. Color System       — derive a full palette from the brand colors: primary,
                        primary-dark, accent, neutral-light, neutral-dark, surface, text.
                        Define them as CSS custom properties in index.css.
3. Typography         — import a Google Font pair (e.g. display + body). Apply
                        fluid type sizing with clamp() where appropriate.
4. Spacing            — use an 8 px base grid; leverage Tailwind spacing tokens.
5. Motion             — subtle entrance animations (Framer Motion or CSS transitions);
                        no gratuitous movement. Respect prefers-reduced-motion.
6. Accessibility      — semantic HTML5, ARIA labels, keyboard-navigable nav, color
                        contrast >= 4.5:1 for body text, focus-visible rings.
7. Responsiveness     — mobile-first; breakpoints: sm (640 px), md (768 px), lg (1024 px).
8. Images             — use https://picsum.photos/seed/<unique-seed>/W/H for every
                        image placeholder. Choose seeds related to the industry.
9. Icons              — use lucide-react for all icons; no raw emoji in UI.
10. Performance       — lazy-load images (loading="lazy"); code-split heavy sections.

════════════════════════════════════════════════════════
ARCHITECTURE & DESIGN PATTERNS  (follow strictly)
════════════════════════════════════════════════════════
- Feature-based folder structure:
    src/
      components/     <- shared UI atoms (Button, Card, SectionTitle, ...)
      sections/       <- page sections (Hero, Services, Testimonials, Contact, ...)
      hooks/          <- custom hooks (useIntersectionObserver for scroll-reveal, ...)
      types/          <- TypeScript interfaces / types
      utils/          <- helpers
      assets/         <- (empty; images served via URL)
      App.tsx
      main.tsx
      index.css
- Single-responsibility components: one component per file, max ~120 lines.
- Props typed with TypeScript interfaces; no `any`.
- Named exports for all components; default export only for page-level components.
- Custom hook `useScrollReveal` that adds a fade-up animation when a section
  enters the viewport using IntersectionObserver.
- Contact form with controlled inputs, basic validation, and a success toast.
  (No backend needed — log to console on submit.)

════════════════════════════════════════════════════════
REQUIRED SECTIONS  (in this order)
════════════════════════════════════════════════════════
1. Header / Navbar
   - Logo (text-based, styled) + navigation links
   - Sticky with backdrop-blur on scroll
   - Mobile hamburger menu (no external library)

2. Hero
   - Full-viewport headline, sub-headline, two CTAs (primary + ghost)
   - Background: gradient or full-bleed image with overlay
   - Subtle animated badge or pill label

3. Services / Features
   - Grid of service cards (icon + title + description)
   - Hover: card lifts with a shadow transition

4. Social Proof / Stats
   - Three key metrics with animated counters (IntersectionObserver trigger)

5. Testimonials
   - Responsive card carousel/grid; real data from the testimonials provided
   - Star ratings

6. Call-to-Action Banner
   - Bold centered CTA with gradient background

7. Contact
   - Form: Name, Email, Phone (optional), Message
   - Inline validation, character counter on Message
   - Submit button with loading spinner

8. Footer
   - Logo, brief tagline, nav links, social icons (Twitter, LinkedIn, Facebook),
     copyright line with dynamic year

════════════════════════════════════════════════════════
REQUIRED FILES
════════════════════════════════════════════════════════
Produce ALL of the following (and any additional files your architecture requires):

  package.json          <- scripts: dev, build, preview, lint
  vite.config.ts
  tsconfig.json
  tsconfig.node.json
  index.html
  tailwind.config.ts    <- extend theme with brand color tokens
  postcss.config.js
  .eslintrc.cjs
  src/main.tsx
  src/App.tsx
  src/index.css         <- CSS custom properties + Tailwind base
  src/types/index.ts
  src/utils/cn.ts       <- clsx + tailwind-merge helper
  src/hooks/useScrollReveal.ts
  src/hooks/useCounter.ts   <- animated counter hook
  src/components/Button.tsx
  src/components/Card.tsx
  src/components/SectionTitle.tsx
  src/components/NavBar.tsx
  src/sections/Hero.tsx
  src/sections/Services.tsx
  src/sections/Stats.tsx
  src/sections/Testimonials.tsx
  src/sections/CtaBanner.tsx
  src/sections/Contact.tsx
  src/sections/Footer.tsx

════════════════════════════════════════════════════════
OUTPUT FORMAT  (critical — follow exactly)
════════════════════════════════════════════════════════
Return ONLY a single raw JSON object. Keys are relative file paths; values are the
complete file contents as strings. No markdown fences, no explanation, no preamble,
no postamble — ONLY the JSON object.

Example shape (do not include this example in your output):
{{
  "package.json": "...",
  "src/App.tsx": "...",
  "src/sections/Hero.tsx": "..."
}}
"""

    for attempt in range(retries):
        try:
            response = client.messages.create(
                model=MODEL,
                max_tokens=16000,  # Large budget for full multi-file codebases
                temperature=0.4,  # Low temperature for deterministic, correct code
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            )

            text = response.content[0].text.strip()

            # Strip markdown code fences if the model wrapped the JSON
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()

            return json.loads(text)

        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error on attempt {attempt + 1}: {e}")
            if attempt < retries - 1:
                logger.warning("Retrying due to malformed JSON response...")
                time.sleep(delay)
                continue
            return None

        except anthropic.RateLimitError as e:
            if attempt < retries - 1:
                wait_time = delay * (2**attempt)  # Exponential backoff: 5s, 10s, 20s
                logger.warning(
                    f"Claude rate limit hit. Retrying in {wait_time}s... "
                    f"(Attempt {attempt + 1}/{retries})"
                )
                time.sleep(wait_time)
                continue
            logger.error(f"Rate limit exceeded after {retries} attempts: {e}")
            return None

        except anthropic.APIError as e:
            logger.error(f"Claude API error on attempt {attempt + 1}: {e}")
            if attempt < retries - 1:
                time.sleep(delay)
                continue
            return None

        except Exception as e:
            logger.error(f"Unexpected error generating website code: {e}")
            return None

    return None
