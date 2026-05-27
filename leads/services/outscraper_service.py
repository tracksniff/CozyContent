"""Thin wrapper around the official Outscraper Python SDK.

Docs: https://github.com/outscraper/outscraper-python
Endpoint used: google_maps_search — returns Google Maps business listings.
"""

import logging
import os
from typing import Iterable

from outscraper import ApiClient

logger = logging.getLogger(__name__)


def _client() -> ApiClient:
    api_key = os.getenv("OUTSCRAPER_API_KEY")
    if not api_key:
        raise RuntimeError("OUTSCRAPER_API_KEY is not set in the environment.")
    return ApiClient(api_key=api_key)


def _normalize(row: dict, *, category: str, location: str) -> dict:
    """Map an Outscraper Google-Maps result into our Business field shape."""
    website = row.get("site") or None
    email = None
    emails = row.get("email_1") or row.get("emails")
    if isinstance(emails, list) and emails:
        email = emails[0]
    elif isinstance(emails, str):
        email = emails

    return {
        "name": (row.get("name") or "").strip(),
        "category": category,
        "location": location,
        "phone": row.get("phone") or None,
        "email": email,
        "website": website,
        "has_website": bool(website),
        "address": row.get("full_address") or row.get("address") or None,
        "rating": row.get("rating"),
        "reviews": row.get("reviews"),
        "google_id": row.get("place_id") or row.get("google_id") or None,
        "source": "outscraper",
    }


def search(query: str, location: str, *, category: str, limit: int = 100) -> Iterable[dict]:
    """Run a single Outscraper Google Maps search.

    `query` is the business type (e.g. "plumbers"), `location` is the town/city.
    Results are yielded as normalized dicts ready for Business.update_or_create.
    """
    client = _client()
    search_term = f"{query} in {location}, UK"
    logger.info("Outscraper search: %r (limit=%s)", search_term, limit)

    # The SDK returns a list of result-batches (one per query passed in).
    response = client.google_maps_search(
        search_term,
        limit=limit,
        language="en",
        region="GB",
    )

    if not response:
        return

    batch = response[0] if isinstance(response, list) else response
    if not isinstance(batch, list):
        logger.warning("Unexpected Outscraper response shape for %r", search_term)
        return

    for row in batch:
        if not row or not row.get("name"):
            continue
        yield _normalize(row, category=category, location=location)
