import requests
import os
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

def send_welcome_email(user_email, temp_password):
    """
    Send welcome email with temporary password using Brevo API
    """
    logger.info(f"Attempting to send welcome email to {user_email}")
    brevo_api_key = os.getenv("BREVO_API_KEY")
    brevo_sender_email = os.getenv("BREVO_SENDER_EMAIL", "noreply@cosycontent.com")
    brevo_sender_name = os.getenv("BREVO_SENDER_NAME", "Cosy Content")

    if not brevo_api_key:
        logger.error("BREVO_API_KEY not found in environment variables")
        return False

    subject = "Welcome to Cosy Content - Your Account is Ready!"
    
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h2 style="color: #3b82f6;">Welcome to Cosy Content!</h2>
            <p>Thank you for your purchase. We have created an account for you so you can manage your website projects.</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 4px;">
                <p><strong>Login Email:</strong> {user_email}</p>
                <p><strong>Temporary Password:</strong> {temp_password}</p>
            </div>
            <p style="margin-top: 20px;">Please log in and change your password as soon as possible.</p>
            <p><a href="{settings.FRONTEND_URL}/login" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Log In Now</a></p>
            <p style="margin-top: 20px; font-size: 12px; color: #6c757d;">If you have any questions, reply to this email.</p>
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
        "to": [{"email": user_email}],
        "subject": subject,
        "htmlContent": html_content,
    }

    try:
        response = requests.post("https://api.brevo.com/v3/smtp/email", json=payload, headers=headers)
        if response.status_code == 201:
            logger.info(f"Successfully sent welcome email to {user_email}")
            return True
        else:
            logger.error(f"Brevo API error for {user_email}: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        logger.error(f"Error sending welcome email to {user_email}: {str(e)}")
        return False
