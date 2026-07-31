"""Extract *intimate* business facts from a prospect's real website.

Companion to :mod:`color_service`. Where the colour service pulls the brand
palette, this pulls concrete, high-signal facts we can weave into the preview so
it reads like it was hand-built for *this* business — not a generic template:

    * established / "since" year  (and the derived years-in-business)
    * trade accreditations & memberships (Gas Safe, NICEIC, Which?, ...)
    * a contact email surfaced on the site

Everything is best-effort and cheap — plain regex over the HTML we already
fetched for colour extraction, so there is **no extra network request** and no
LLM cost. Every field degrades gracefully to ``None``/``[]`` and the template
falls back to the generic per-trade copy when a fact is missing.

Guard rails, because a wrong "fact" is worse than a missing one:
    * founding years are only trusted next to founding language ("since",
      "established", "founded") — never a bare copyright year.
    * accreditations are matched from a fixed allow-list of real UK trade bodies.
"""

import logging
import re
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)

# Current year is baked alongside the preview copy (see preview_service).
_THIS_YEAR = 2026
_MIN_FOUNDED = 1900


@dataclass
class SiteFacts:
    established_year: int | None = None
    years_in_business: int | None = None
    accreditations: list[str] = field(default_factory=list)
    email: str | None = None
    source: str = ""  # short note for admin/debugging

    @property
    def found_anything(self) -> bool:
        return bool(self.established_year or self.accreditations or self.email)


# --- founding year -----------------------------------------------------------
# Only match a year when founding language sits right next to it, so we never
# mistake a "© 2024" copyright line for the year the firm started trading.
_FOUNDED_YEAR_RE = re.compile(
    r"(?:established|estd?\.?|founded|since|trading\s+since|serving[\w\s]{0,30}?since)"
    r"[^0-9]{0,12}((?:18|19|20)\d{2})",
    re.I,
)
# "over 25 years", "25+ years experience", "for 30 years"
_YEARS_EXP_RE = re.compile(
    r"(?:over|for|nearly|almost|more\s+than)?\s*(\d{1,3})\+?\s*years?"
    r"(?:[\s’'ofexprincebusadtly-]{0,24})"
    r"(?:experience|exp\b|trading|in\s+business|of\s+service|serving|established)",
    re.I,
)

_EMAIL_RE = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9.-]+")

# Allow-list of real UK trade accreditations → the label we show. Ordered by the
# priority we'd like them to appear in (strongest trust signals first). Patterns
# are matched case-insensitively against the page text.
_ACCREDITATIONS: list[tuple[str, str]] = [
    (r"gas\s*safe", "Gas Safe Registered"),
    (r"\bniceic\b", "NICEIC Approved"),
    (r"\bnapit\b", "NAPIT Registered"),
    (r"\belecsa\b", "ELECSA Registered"),
    (r"worcester\s*(?:bosch|accredited)", "Worcester Accredited"),
    (r"\boftec\b", "OFTEC Registered"),
    (r"\bcorgi\b", "CORGI Registered"),
    (r"\bmcs\b", "MCS Certified"),
    (r"which\??\s*(?:trusted\s*trader)?", "Which? Trusted Trader"),
    (r"checkatrade", "Checkatrade Verified"),
    (r"trustmark", "TrustMark Registered"),
    (r"trustatrader", "TrustATrader"),
    (r"rated\s*people", "Rated People"),
    (r"city\s*(?:&|and)\s*guilds", "City & Guilds Qualified"),
    (r"\bc(?:i)?phe\b", "CIPHE Member"),
    (r"master\s*locksmith|\bmla\b", "MLA Approved"),
    (r"safe\s*contractor", "SafeContractor Approved"),
    (r"\bchas\b", "CHAS Accredited"),
    (r"constructionline", "Constructionline"),
    (r"iso\s*9001", "ISO 9001 Certified"),
    (r"\bfensa\b", "FENSA Registered"),
    (r"\brecc\b", "RECC Member"),
    (r"\brospa\b", "RoSPA"),
    (r"\bdbs\b\s*check|dbs[- ]checked", "DBS Checked"),
    (r"public\s*liability|fully\s*insured", "Fully Insured"),
]
_MAX_ACCREDITATIONS = 6

# Strip tags so regexes see prose, not markup. Cheap and good enough — we don't
# need a parser for keyword hunting.
_TAG_RE = re.compile(r"<(script|style)[^>]*>.*?</\1>", re.I | re.S)
_ANGLE_RE = re.compile(r"<[^>]+>")
_WS_RE = re.compile(r"\s+")


def _visible_text(html: str) -> str:
    text = _TAG_RE.sub(" ", html)
    text = _ANGLE_RE.sub(" ", text)
    return _WS_RE.sub(" ", text)


def _founding_year(text: str) -> int | None:
    """Earliest credible founding year mentioned with founding language."""
    years = [
        int(y) for y in _FOUNDED_YEAR_RE.findall(text)
        if _MIN_FOUNDED <= int(y) <= _THIS_YEAR
    ]
    return min(years) if years else None


def _years_experience(text: str) -> int | None:
    vals = [
        int(n) for n in _YEARS_EXP_RE.findall(text)
        if 1 <= int(n) <= 150
    ]
    return max(vals) if vals else None


def _accreditations(text: str) -> list[str]:
    low = text.lower()
    found: list[str] = []
    for pattern, label in _ACCREDITATIONS:
        if label in found:
            continue
        if re.search(pattern, low):
            found.append(label)
        if len(found) >= _MAX_ACCREDITATIONS:
            break
    return found


def _email(html: str) -> str | None:
    for raw in _EMAIL_RE.findall(html):
        e = raw.lower()
        if e.endswith((".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp")):
            continue
        if e.startswith(("example@", "email@", "your@", "name@")):
            continue
        if "sentry" in e or "wixpress" in e or "@2x" in e:
            continue
        return e
    return None


def extract_site_facts(html: str | None) -> SiteFacts:
    """Best-effort fact extraction from pre-fetched HTML. Never raises."""
    if not html:
        return SiteFacts(source="no-html")

    try:
        text = _visible_text(html)
        year = _founding_year(text)
        years_exp = _years_experience(text)

        # Reconcile the two signals: a stated "since YYYY" wins for the year; a
        # stated "N years" gives us the count directly. Fill in whichever we can.
        if year and not years_exp:
            years_exp = _THIS_YEAR - year
        elif years_exp and not year:
            year = _THIS_YEAR - years_exp

        facts = SiteFacts(
            established_year=year,
            years_in_business=years_exp,
            accreditations=_accreditations(text),
            email=_email(html),
            source="scraped",
        )
        logger.info(
            "Site facts: est=%s years=%s accreds=%s email=%s",
            facts.established_year, facts.years_in_business,
            facts.accreditations, bool(facts.email),
        )
        return facts
    except Exception as exc:  # noqa: BLE001 — strictly best-effort
        logger.info("Site-facts extraction failed: %s", exc)
        return SiteFacts(source="error")
