"""Per-trade content + branding config for website previews.

Each ``Business.category`` maps to one preview template and a block of
trade-specific copy (hero, services, USPs, FAQ). The template files live in
``leads/templates/previews/<template>.html`` and inherit ``previews/base.html``.

Variables substituted per prospect (see Stage 2 spec):
    {{business_name}} {{phone_number}} {{town}} {{trade}} {{service_area}}

These are surfaced to the Django template as ``business_name`` etc. — the
``{{ }}`` form is just Django template syntax, so the spec's variables map 1:1.
"""

# category -> trade noun shown to the prospect ("a {{trade}} you can trust")
TRADE_NOUNS = {
    "plumbing": "plumber",
    "electricians": "electrician",
    "roofing": "roofer",
    "locksmiths": "locksmith",
    "cleaners": "cleaner",
    "removal_companies": "removals specialist",
}

# Fallback brand palette per trade, used when colour extraction from the
# prospect's real site yields nothing usable. (primary, accent)
DEFAULT_PALETTES = {
    "plumbing": ("#0B6BCB", "#F59E0B"),
    "electricians": ("#1D4ED8", "#FACC15"),
    "roofing": ("#9A3412", "#0F766E"),
    "locksmiths": ("#374151", "#D97706"),
    "cleaners": ("#0D9488", "#22C55E"),
    "removal_companies": ("#1E3A8A", "#F97316"),
}

# Rich per-trade copy. ``icon`` keys map to inline SVGs defined in base.html.
TRADE_CONTENT = {
    "plumbing": {
        "template": "plumbing",
        "tagline": "Local plumbing & heating you can rely on",
        "hero_headline": "Trusted plumbers in {town}",
        "hero_sub": "Fast, tidy and fully insured. From dripping taps to full "
                    "boiler installs, {business_name} keeps {service_area} running.",
        "emergency_line": "24/7 emergency call-outs across {service_area}",
        "services": [
            ("droplet", "Leaks & repairs", "Burst pipes, dripping taps and hidden leaks fixed fast — no mess left behind."),
            ("flame", "Boilers & heating", "Boiler installs, servicing and repairs from Gas Safe registered engineers."),
            ("shower", "Bathrooms", "Full bathroom fit-outs, showers and wet rooms designed around your home."),
            ("wrench", "Blocked drains", "Powerful jetting and CCTV surveys to clear blockages for good."),
        ],
        "usps": [
            "Gas Safe registered engineers",
            "Upfront, no-surprise pricing",
            "Same-day call-outs available",
        ],
        "faqs": [
            ("Do you charge a call-out fee?", "We give a clear price before any work starts — no hidden call-out charges."),
            ("Are you Gas Safe registered?", "Yes. Every heating engineer on our team is fully Gas Safe registered and insured."),
            ("How fast can you come out?", "For emergencies in {town} we aim to be with you the same day."),
        ],
    },
    "electricians": {
        "template": "electricians",
        "tagline": "Safe, certified electrical work",
        "hero_headline": "Approved electricians in {town}",
        "hero_sub": "NICEIC-standard wiring, fault-finding and installs. "
                    "{business_name} powers homes and businesses across {service_area}.",
        "emergency_line": "Emergency electricians on call across {service_area}",
        "services": [
            ("bolt", "Rewires & repairs", "Full and partial rewires, fault-finding and fuse board upgrades."),
            ("plug", "Sockets & lighting", "Extra sockets, downlights and smart lighting fitted safely."),
            ("car", "EV chargers", "OZEV-approved home and workplace EV charge point installation."),
            ("shield", "Safety checks", "EICR inspections and certificates for landlords and homeowners."),
        ],
        "usps": [
            "Fully qualified & insured electricians",
            "Certificates issued on completion",
            "Free, no-obligation quotes",
        ],
        "faqs": [
            ("Do you provide certificates?", "Yes — every job is fully tested and certified before we leave."),
            ("Can you help landlords?", "We carry out EICRs and remedial work to keep your {town} property compliant."),
            ("Do you cover emergencies?", "We offer emergency call-outs across {service_area} for power faults."),
        ],
    },
    "roofing": {
        "template": "roofing",
        "tagline": "Roofs built to last in any weather",
        "hero_headline": "Reliable roofers in {town}",
        "hero_sub": "Repairs, new roofs and emergency cover. {business_name} keeps "
                    "{service_area} watertight, with workmanship guaranteed.",
        "emergency_line": "Storm-damage call-outs across {service_area}",
        "services": [
            ("home", "Roof repairs", "Leaks, slipped tiles and storm damage repaired quickly and safely."),
            ("layers", "New roofs", "Full re-roofs in tile, slate and flat-roof systems built to last."),
            ("droplet", "Guttering", "Gutter cleaning, repairs and seamless replacements."),
            ("sun", "Flat roofs", "Durable EPDM and GRP flat roofing with long guarantees."),
        ],
        "usps": [
            "Free roof inspections",
            "Scaffolding & full insurance",
            "Workmanship guarantee",
        ],
        "faqs": [
            ("Do you offer free inspections?", "Yes — we'll assess your roof in {town} and give you an honest quote."),
            ("Are you insured?", "Fully insured with all work carried out to current building standards."),
            ("Can you handle emergencies?", "We provide emergency cover across {service_area} after storms."),
        ],
    },
    "locksmiths": {
        "template": "locksmiths",
        "tagline": "Fast, non-destructive lock entry",
        "hero_headline": "24/7 locksmiths in {town}",
        "hero_sub": "Locked out? {business_name} gets you back in fast — "
                    "no damage, no fuss — right across {service_area}.",
        "emergency_line": "Rapid emergency lockouts across {service_area}",
        "services": [
            ("key", "Lockouts", "Locked out of your home or car? We're usually with you within the hour."),
            ("lock", "Lock changes", "Snapped, faulty or insecure locks replaced with insurance-rated hardware."),
            ("shield", "Security upgrades", "Anti-snap cylinders and British Standard locks fitted."),
            ("door", "Door repairs", "uPVC and composite door mechanisms repaired and realigned."),
        ],
        "usps": [
            "Typically on-site within the hour",
            "Non-destructive entry where possible",
            "DBS-checked, insured locksmiths",
        ],
        "faqs": [
            ("How quickly can you reach me?", "Across {town} we usually arrive within the hour, day or night."),
            ("Will you damage my door?", "We use non-destructive entry wherever possible to avoid extra costs."),
            ("Are you available at night?", "Yes — we cover {service_area} 24 hours a day, 7 days a week."),
        ],
    },
    "cleaners": {
        "template": "cleaners",
        "tagline": "Spotless homes & workplaces",
        "hero_headline": "Trusted cleaners in {town}",
        "hero_sub": "Reliable, vetted cleaning teams. {business_name} keeps homes "
                    "and offices across {service_area} fresh and spotless.",
        "emergency_line": "Flexible bookings across {service_area}",
        "services": [
            ("sparkle", "Domestic cleaning", "Regular and one-off home cleans tailored to your routine."),
            ("building", "Office cleaning", "Dependable commercial cleaning that keeps workplaces presentable."),
            ("box", "End of tenancy", "Deep cleans that help tenants and landlords get deposits back."),
            ("sun", "Carpets & upholstery", "Professional carpet and upholstery cleaning that lifts stains."),
        ],
        "usps": [
            "Vetted, insured cleaners",
            "Your own regular cleaner",
            "Satisfaction guaranteed",
        ],
        "faqs": [
            ("Do you bring your own supplies?", "Yes — our teams arrive fully equipped unless you prefer otherwise."),
            ("Are your cleaners vetted?", "Every cleaner is reference-checked, insured and trained."),
            ("Which areas do you cover?", "We clean homes and offices throughout {service_area}."),
        ],
    },
    "removal_companies": {
        "template": "removal_companies",
        "tagline": "Stress-free moves, handled with care",
        "hero_headline": "Trusted removals in {town}",
        "hero_sub": "Packing, loading and transport done right. {business_name} makes "
                    "moving across {service_area} simple and stress-free.",
        "emergency_line": "Short-notice moves across {service_area}",
        "services": [
            ("truck", "Home removals", "Careful, fully-insured house moves of any size, near or far."),
            ("box", "Packing service", "Professional packing and materials to protect your belongings."),
            ("building", "Office moves", "Planned commercial relocations with minimal downtime."),
            ("layers", "Storage", "Secure short and long-term storage while you settle in."),
        ],
        "usps": [
            "Fully insured, uniformed crews",
            "Free no-obligation surveys",
            "Transparent fixed quotes",
        ],
        "faqs": [
            ("Do you offer packing?", "Yes — we can pack everything for you or just the fragile items."),
            ("Is my move insured?", "All moves are fully insured for complete peace of mind."),
            ("How do I get a quote?", "We offer free surveys across {service_area} and fixed written quotes."),
        ],
    },
}


def trade_noun(category: str) -> str:
    return TRADE_NOUNS.get(category, "tradesperson")


def service_area(town: str) -> str:
    """Derive {{service_area}} from {{town}} per the spec."""
    town = (town or "").strip()
    return f"{town} and surrounding areas" if town else "your local area"


def content_for(category: str) -> dict:
    """Return the trade content block, defaulting to plumbing if unknown."""
    return TRADE_CONTENT.get(category, TRADE_CONTENT["plumbing"])


def default_palette(category: str) -> tuple[str, str]:
    return DEFAULT_PALETTES.get(category, ("#0B6BCB", "#F59E0B"))
