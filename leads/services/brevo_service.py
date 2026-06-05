import os
import requests
import logging
from django.conf import settings
from api.utils import get_email_header, get_email_footer

logger = logging.getLogger(__name__)

def send_outreach_email(business):
    """
    Send an outreach email to a business about their website performance.
    """
    email = business.email
    if not email:
        logger.error(f"No email for business {business.name}")
        return False

    brevo_api_key = os.getenv("BREVO_API_KEY")
    brevo_sender_email = os.getenv("BREVO_SENDER_EMAIL", "contact@cosycontent.com")
    brevo_sender_name = os.getenv("BREVO_SENDER_NAME", "Cosy Content")

    if not brevo_api_key:
        logger.error("BREVO_API_KEY not found in environment variables")
        return False

    # Personalize subject based on category
    category_name = dict(business.CATEGORY_CHOICES).get(business.category, "business").lower()
    subject = f"Your {category_name} website's performance in {business.location}"

    # Use PageSpeed scores in the email
    mobile_perf = business.pagespeed_mobile_performance

    # Link to the personalised preview built for this prospect, if ready.
    preview = business.previews.order_by("-created_at").first()
    preview_block = ""
    if preview and not preview.is_expired:
        preview_block = f"""
            <div style="margin: 30px 0; text-align: center;">
                <p style="margin-bottom: 15px;">We've already built you a free preview of what a modern {category_name} website could look like:</p>
                <a href="{preview.public_url}" style="display: inline-block; padding: 14px 30px; background-color: #00696D; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">View Your Free Preview</a>
            </div>
        """

    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px; background-color: white; border-radius: 12px; border: 1px solid #e5e7eb;">
            {get_email_header()}
            <h2 style="color: #00696D;">Quick website check for {business.name}</h2>
            <p>Hi,</p>
            <p>I was just looking at some {category_name} businesses in <strong>{business.location}</strong> and came across your website: <a href="{business.website}">{business.website}</a>.</p>
            
            <p>I ran a quick performance check and noticed your mobile speed score is currently <strong>{mobile_perf}/100</strong>.</p>
            
            <p>A slow mobile site often means you're missing out on local customers who are looking for {category_name} on their phones.</p>

            <div style="margin: 30px 0; padding: 25px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #00696D;">
                <p style="margin: 0;"><strong>Mobile Performance:</strong> {mobile_perf}/100</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">(Google recommends a score of 90+ for the best customer experience)</p>
            </div>

            <p>We help tradespeople in the UK build modern, ultra-fast websites that rank better on Google and convert more visitors into quote requests.</p>
            {preview_block}

            <p>If you're interested in seeing how we could help improve your online presence, just reply to this email or check out our site below.</p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="https://cosycontent.com" style="display: inline-block; padding: 14px 30px; background-color: #00696D; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">See What We Do</a>
            </div>

            <p>Best regards,</p>
            <p><strong>The Cosy Content Team</strong></p>
            {get_email_footer()}
        </div>
    </body>
    </html>
    """

    headers = {
        "accept": "application/json",
        "api-key": brevo_api_key,
        "content-type": "application/json",
    }

    payload = {
        "sender": {"name": brevo_sender_name, "email": brevo_sender_email},
        "to": [{"email": email, "name": business.name}],
        "subject": subject,
        "htmlContent": html_content,
    }

    try:
        response = requests.post("https://api.brevo.com/v3/smtp/email", json=payload, headers=headers)
        if response.status_code == 201:
            logger.info(f"Outreach email sent to {email} for {business.name}")
            return True
        else:
            logger.error(f"Brevo error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        logger.error(f"Error sending outreach email: {str(e)}")
        return False
