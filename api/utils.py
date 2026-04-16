import requests
import os
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

def send_otp_email(user_email, otp):
    """
    Send OTP for password reset using Brevo API
    """
    logger.info(f"Attempting to send OTP email to {user_email}")
    brevo_api_key = os.getenv("BREVO_API_KEY")
    brevo_sender_email = os.getenv("BREVO_SENDER_EMAIL", "noreply@cosycontent.com")
    brevo_sender_name = os.getenv("BREVO_SENDER_NAME", "Cosy Content")

    if not brevo_api_key:
        logger.error("BREVO_API_KEY not found in environment variables")
        return False

    subject = "Your Password Reset OTP - Cosy Content"
    
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h2 style="color: #3b82f6;">Password Reset Request</h2>
            <p>You requested to reset your password. Use the following OTP to proceed:</p>
            <div style="margin-top: 20px; padding: 20px; background-color: #f8f9fa; border-radius: 4px; text-align: center;">
                <h1 style="font-size: 32px; letter-spacing: 5px; color: #3b82f6; margin: 0;">{otp}</h1>
            </div>
            <p style="margin-top: 20px;">This OTP will expire in 15 minutes. If you did not request this, please ignore this email.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #6c757d;">© 2026 Cosy Content. All rights reserved.</p>
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
            logger.info(f"Successfully sent OTP email to {user_email}")
            return True
        else:
            logger.error(f"Brevo API error for {user_email}: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        logger.error(f"Error sending OTP email to {user_email}: {str(e)}")
        return False

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

def send_review_request_email(user_email, company_name):
    """
    Send email asking for a review once the site is 100% complete.
    """
    logger.info(f"Attempting to send review request email to {user_email}")
    brevo_api_key = os.getenv("BREVO_API_KEY")
    brevo_sender_email = os.getenv("BREVO_SENDER_EMAIL", "contact@cosycontent.com")
    brevo_sender_name = os.getenv("BREVO_SENDER_NAME", "Cosy Content")

    if not brevo_api_key:
        logger.error("BREVO_API_KEY not found in environment variables")
        return False

    review_link = "https://g.page/r/CcL50VdU9y65EAE/review"
    subject = f"Your website for {company_name} is 100% complete!"
    
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h2 style="color: #3b82f6;">Your Website is Ready! 🎉</h2>
            <p>Congratulations! Your website for <strong>{company_name}</strong> is now 100% complete and live.</p>
            <p>We've loved working on this project with you. Would you mind taking a moment to leave us a review on Google? It really helps us grow!</p>
            <div style="margin-top: 25px; text-align: center;">
                <p><a href="{review_link}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Leave a Review on Google</a></p>
            </div>
            <p style="margin-top: 25px;">You can view your site progress and manage your account in your dashboard.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #6c757d;">© 2026 Cosy Content Ltd. All rights reserved.</p>
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
        return response.status_code == 201
    except Exception as e:
        logger.error(f"Error sending review email: {str(e)}")
        return False

def send_progress_update_email(user_email, company_name, progress):
    """
    Send email with progress update and link to timeline.
    """
    logger.info(f"Attempting to send progress update email to {user_email}")
    brevo_api_key = os.getenv("BREVO_API_KEY")
    brevo_sender_email = os.getenv("BREVO_SENDER_EMAIL", "contact@cosycontent.com")
    brevo_sender_name = os.getenv("BREVO_SENDER_NAME", "Cosy Content")

    if not brevo_api_key:
        return False

    frontend_url = os.getenv("FRONTEND_URL", "https://cosycontent.com")
    subject = f"Progress Update: {company_name} is {progress}% Complete"
    
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h2 style="color: #3b82f6;">Project Update</h2>
            <p>Great news! Your website project for <strong>{company_name}</strong> is moving along. We are currently at <strong>{progress}%</strong> completion.</p>
            <div style="margin: 20px 0; background-color: #f0f0f0; border-radius: 10px; height: 20px; width: 100%;">
                <div style="background-color: #3b82f6; width: {progress}%; height: 100%; border-radius: 10px;"></div>
            </div>
            <p>You can view the full timeline and details in your dashboard:</p>
            <p><a href="{frontend_url}/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">View Timeline</a></p>
            <p style="margin-top: 20px; font-size: 12px; color: #6c757d;">© 2026 Cosy Content Ltd.</p>
        </div>
    </body>
    </html>
    """

    payload = {
        "sender": {"name": brevo_sender_name, "email": brevo_sender_email},
        "to": [{"email": user_email}],
        "subject": subject,
        "htmlContent": html_content,
    }

    headers = {
        "accept": "application/json",
        "api-key": brevo_api_key,
        "content-type": "application/json",
    }

    try:
        response = requests.post("https://api.brevo.com/v3/smtp/email", json=payload, headers=headers)
        return response.status_code == 201
    except:
        return False

def send_github_transfer_email(user_email, company_name):
    """
    Send email to one-time buyer asking for GitHub username for repo transfer.
    """
    logger.info(f"Attempting to send GitHub transfer email to {user_email}")
    brevo_api_key = os.getenv("BREVO_API_KEY")
    brevo_sender_email = os.getenv("BREVO_SENDER_EMAIL", "contact@cosycontent.com")
    brevo_sender_name = os.getenv("BREVO_SENDER_NAME", "Cosy Content")

    if not brevo_api_key:
        return False

    frontend_url = os.getenv("FRONTEND_URL", "https://cosycontent.com")
    subject = f"Action Required: Transferring your {company_name} repository"
    
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h2 style="color: #3b82f6;">Ready to Transfer Your Code!</h2>
            <p>Your website for <strong>{company_name}</strong> has been generated and pushed to our secure staging repository.</p>
            <p>Since you chose the One-Time Purchase plan, we are ready to transfer full ownership of the source code to you.</p>
            <p>Please click the link below to enter your GitHub username or email so we can initiate the transfer:</p>
            <p><a href="{frontend_url}/dashboard?action=transfer" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Submit GitHub Username</a></p>
            <p style="margin-top: 20px;">Once you submit your username, our team will initiate the transfer on GitHub. You will receive an invitation from GitHub to accept the repository.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #6c757d;">© 2026 Cosy Content Ltd.</p>
        </div>
    </body>
    </html>
    """

    payload = {
        "sender": {"name": brevo_sender_name, "email": brevo_sender_email},
        "to": [{"email": user_email}],
        "subject": subject,
        "htmlContent": html_content,
    }

    headers = {
        "accept": "application/json",
        "api-key": brevo_api_key,
        "content-type": "application/json",
    }

    try:
        response = requests.post("https://api.brevo.com/v3/smtp/email", json=payload, headers=headers)
        return response.status_code == 201
    except:
        return False
