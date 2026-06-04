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
    # Outscraper uses "website" in recent API versions
    website = row.get("website") or row.get("site") or None
    email = None
    # Enrichment often returns a list in "emails" or separate "email_1", "email_2" fields
    emails_list = row.get("emails")
    if isinstance(emails_list, list) and emails_list:
        email = emails_list[0]
    else:
        # Fallback to direct field keys
        email = row.get("email_1") or row.get("email") or row.get("email_2")

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
        enrichment=['contacts_n_leads'],
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
