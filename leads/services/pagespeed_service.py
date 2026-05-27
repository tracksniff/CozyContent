"""Google PageSpeed Insights API wrapper.

Docs: https://developers.google.com/speed/docs/insights/v5/get-started
Free tier: 25,000 queries/day. We use ~100/day (50 sites x 2 strategies).
"""

import logging
import os
from dataclasses import dataclass

import requests

logger = logging.getLogger(__name__)

ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
REQUEST_TIMEOUT = 90  # Lighthouse runs are slow — 60-90s is normal


@dataclass
class PageSpeedScores:
    performance: int | None
    accessibility: int | None
    seo: int | None
    best_practices: int | None
    error: str = ""

    @property
    def ok(self) -> bool:
        return not self.error and self.performance is not None


def _score_to_int(value) -> int | None:
    """Lighthouse scores are 0.0–1.0 floats; we store as 0–100 ints."""
    if value is None:
        return None
    try:
        return int(round(float(value) * 100))
    except (TypeError, ValueError):
        return None


def score(url: str, *, strategy: str = "mobile") -> PageSpeedScores:
    """Run a PageSpeed audit. `strategy` is 'mobile' or 'desktop'."""
    api_key = os.getenv("PAGESPEED_API_KEY")
    params = {
        "url": url,
        "strategy": strategy,
        "category": ["performance", "accessibility", "seo", "best-practices"],
    }
    if api_key:
        params["key"] = api_key

    try:
        resp = requests.get(ENDPOINT, params=params, timeout=REQUEST_TIMEOUT)
    except requests.RequestException as exc:
        logger.warning("PageSpeed request failed for %s (%s): %s", url, strategy, exc)
        return PageSpeedScores(None, None, None, None, error=str(exc))

    if resp.status_code != 200:
        msg = f"http {resp.status_code}: {resp.text[:200]}"
        logger.warning("PageSpeed non-200 for %s (%s): %s", url, strategy, msg)
        return PageSpeedScores(None, None, None, None, error=msg)

    try:
        categories = resp.json()["lighthouseResult"]["categories"]
    except (ValueError, KeyError) as exc:
        return PageSpeedScores(None, None, None, None, error=f"malformed response: {exc}")

    return PageSpeedScores(
        performance=_score_to_int(categories.get("performance", {}).get("score")),
        accessibility=_score_to_int(categories.get("accessibility", {}).get("score")),
        seo=_score_to_int(categories.get("seo", {}).get("score")),
        best_practices=_score_to_int(categories.get("best-practices", {}).get("score")),
    )
