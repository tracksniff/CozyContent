import re
import logging
import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

def extract_emails_from_url(url: str) -> list[str]:
    """
    Fetch a URL and extract unique email addresses using regex.
    """
    if not url:
        return []

    # Basic cleanup of the URL
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url

    try:
        # 1. Fetch the page
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
        }
        response = requests.get(url, timeout=15, headers=headers, allow_redirects=True)
        response.raise_for_status()
        
        # 2. Extract emails from the text
        # This regex covers most common email formats
        email_regex = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
        emails = re.findall(email_regex, response.text)
        
        # 3. Clean and unique
        unique_emails = list(set([e.lower() for e in emails if not e.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'))]))
        
        if unique_emails:
            logger.info("Found %d emails on %s: %s", len(unique_emails), url, unique_emails)
        
        return unique_emails

    except Exception as e:
        logger.warning("Failed to extract emails from %s: %s", url, e)
        return []
