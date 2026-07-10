import re
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import logging

logger = logging.getLogger(__name__)

def calculate_outdated_score(url: str, html: str, mobile_pagespeed: int | None) -> tuple[int, str]:
    """
    Calculate the outdated score for a website based on specific criteria.
    Returns: (total_score, priority)
    Priority can be: "high", "medium", "none"
    """
    score = 0
    soup = BeautifulSoup(html, "html.parser")
    text_content = soup.get_text(separator=' ', strip=True)
    text_lower = text_content.lower()

    # 1. Mobile PageSpeed below 50: 3 points
    if mobile_pagespeed is not None and mobile_pagespeed < 50:
        score += 3

    # 2. No SSL: 3 points
    if url.startswith("http://"):
        score += 3

    # 3. Fails mobile-friendly test (Viewport meta tag absent): 3 points
    viewport_meta = soup.find("meta", attrs={"name": "viewport"})
    if not viewport_meta:
        score += 3

    # 4. Copyright year 2022 or earlier: 2 points
    # Search for things like © 2022, Copyright 2021, etc.
    # Exclude 2023, 2024, 2025, 2026. If we find older and not newer, it's outdated.
    copyright_match = re.search(r'(?:©|copyright)\s*(?:[a-zA-Z\s,]+)?(20[0-2][0-2]|199\d)', text_lower)
    recent_copyright_match = re.search(r'(?:©|copyright)\s*(?:[a-zA-Z\s,]+)?(202[3-9]|20[3-9]\d)', text_lower)
    if copyright_match and not recent_copyright_match:
        score += 2

    # 5. No schema markup: 2 points
    schema_markup = soup.find("script", type="application/ld+json")
    if not schema_markup:
        score += 2

    # 6. No meta description: 1 point
    meta_desc = soup.find("meta", attrs={"name": "description"})
    if not meta_desc or not meta_desc.get("content"):
        score += 1

    # 7. No H1: 1 point
    h1_tag = soup.find("h1")
    if not h1_tag:
        score += 1

    # 8. Fewer than 300 words: 2 points
    words = text_content.split()
    if len(words) < 300:
        score += 2

    # 9. No CTA or phone number: 3 points
    # Look for 'tel:' links
    tel_links = soup.find_all("a", href=re.compile(r'^tel:'))
    if not tel_links:
        score += 3

    # 10. No reviews on site: 1 point
    has_review = "review" in text_lower or "testimonial" in text_lower
    # Could also check for review schema
    if not has_review:
        score += 1

    # 11. Free hosting platform: 3 points
    parsed_url = urlparse(url)
    domain = parsed_url.netloc.lower()
    free_hosts = ["wixsite.com", "weebly.com", "wordpress.com", "yolasite.com"]
    if any(host in domain for host in free_hosts):
        score += 3

    # 12. No analytics detected: 1 point
    # Search html string for analytics scripts
    html_lower = html.lower()
    if "google-analytics.com" not in html_lower and "googletagmanager.com" not in html_lower and "gtag(" not in html_lower:
        score += 1

    # 13. Outdated platform detected: 2 points
    # Hand-coded without CMS often has no standard structure, but we can look for outdated CMS signals
    outdated_platform_signals = ["wp-content", "wix", "weebly", "yola"]
    # If it's a known outdated platform or uses ancient jquery
    jquery_ancient = re.search(r'jquery[.-]1\.\d', html_lower)
    flash_detected = "application/x-shockwave-flash" in html_lower or ".swf" in html_lower
    has_tables = soup.find("table") and not soup.find("div", class_=True) # rough check for table layout

    if any(sig in html_lower for sig in outdated_platform_signals) or jquery_ancient or flash_detected or has_tables:
        score += 2

    # Score thresholding
    if score >= 8:
        priority = "high"
    elif score >= 5:
        priority = "medium"
    else:
        priority = "none"

    return score, priority
