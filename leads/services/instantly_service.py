import os
import requests
import logging

logger = logging.getLogger(__name__)

def add_lead_to_campaign(business):
    """
    Add a business lead to an Instantly campaign.
    """
    email = business.email
    if not email:
        logger.error(f"No email for business {business.name}")
        return False

    instantly_api_key = os.getenv("INSTANTLY_API_KEY")
    campaign_id = os.getenv("INSTANTLY_CAMPAIGN_ID")

    if not instantly_api_key or not campaign_id:
        logger.error("INSTANTLY_API_KEY or INSTANTLY_CAMPAIGN_ID not found in environment variables")
        return False

    category_name = dict(business.CATEGORY_CHOICES).get(business.category, "business").lower()
    mobile_perf = business.pagespeed_mobile_performance
    
    preview = business.previews.order_by("-created_at").first()
    preview_url = preview.public_url if preview and not preview.is_expired else ""

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {instantly_api_key}",
    }

    payload = {
        "campaign_id": campaign_id,
        "skip_if_in_workspace": True,
        "skip_if_in_campaign": True,
        "leads": [
            {
                "email": email,
                "company_name": business.name,
                "website": business.website or "",
                "custom_variables": {
                    "category": category_name,
                    "mobile_performance": mobile_perf,
                    "preview_url": preview_url,
                    "location": business.location or ""
                }
            }
        ]
    }

    try:
        response = requests.post("https://api.instantly.ai/api/v2/leads/add", json=payload, headers=headers)
        if response.status_code in [200, 201]:
            logger.info(f"Lead added to Instantly campaign for {email} ({business.name})")
            return True
        else:
            logger.error(f"Instantly error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        logger.error(f"Error adding lead to Instantly: {str(e)}")
        return False
