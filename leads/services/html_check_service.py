"""Free, fast first-pass website check before spending PageSpeed quota."""

import logging
import re
from dataclasses import dataclass

import requests

logger = logging.getLogger(__name__)

USER_AGENT = (
    "Mozilla/5.0 (compatible; CosyContentAuditBot/1.0; "
    "+https://cosycontent.com)"
)
REQUEST_TIMEOUT = 10  # seconds — connect + read combined
MIN_BODY_BYTES = 500

# Tell-tale signs the domain is parked / for sale rather than a real business site.
PARKED_PATTERNS = [
    re.compile(r"\bdomain (is )?for sale\b", re.I),
    re.compile(r"\bbuy this domain\b", re.I),
    re.compile(r"\bparked (free|by)\b", re.I),
    re.compile(r"\bgodaddy\.com/(domains|forsale)\b", re.I),
    re.compile(r"\bsedoparking\.com\b", re.I),
]


@dataclass
class HtmlCheckResult:
    ok: bool
    status_code: int | None
    reason: str  # human-readable why it failed (empty when ok=True)
    html: str | None = None


def quick_check(url: str) -> HtmlCheckResult:
    """Return whether the URL looks like a live, real website."""
    if not url:
        return HtmlCheckResult(ok=False, status_code=None, reason="empty url")

    try:
        resp = requests.get(
            url,
            timeout=REQUEST_TIMEOUT,
            allow_redirects=True,
            headers={"User-Agent": USER_AGENT},
        )
    except requests.exceptions.SSLError as exc:
        return HtmlCheckResult(ok=False, status_code=None, reason=f"ssl error: {exc}")
    except requests.exceptions.ConnectionError as exc:
        return HtmlCheckResult(ok=False, status_code=None, reason=f"connection error: {exc}")
    except requests.exceptions.Timeout:
        return HtmlCheckResult(ok=False, status_code=None, reason="timeout")
    except requests.RequestException as exc:
        return HtmlCheckResult(ok=False, status_code=None, reason=f"request error: {exc}")

    code = resp.status_code
    if code >= 400:
        return HtmlCheckResult(ok=False, status_code=code, reason=f"http {code}")

    body = resp.text or ""
    if len(body.encode("utf-8")) < MIN_BODY_BYTES:
        return HtmlCheckResult(ok=False, status_code=code, reason="body too small")

    for pattern in PARKED_PATTERNS:
        if pattern.search(body):
            return HtmlCheckResult(
                ok=False, status_code=code, reason=f"parked-domain signal: {pattern.pattern}"
            )

    return HtmlCheckResult(ok=True, status_code=code, reason="", html=body)
