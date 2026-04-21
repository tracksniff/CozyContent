import requests
import os
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

# Branding Assets
LOGO_URL = "https://cosycontent.com/favicon.png"
COPYRIGHT_TEXT = "Copyright © 2026 Cosy Content Limited. All Rights Reserved."

def get_email_header():
    return f'<div style="text-align: center; margin-bottom: 30px;"><img src="{LOGO_URL}" alt="Cosy Content" width="60" style="margin: 0 auto;"></div>'

def get_email_footer():
    return f'<p style="margin-top: 30px; font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; pt-20">{COPYRIGHT_TEXT}</p>'

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
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px; background-color: white; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            {get_email_header()}
            <h2 style="color: #3b82f6; text-align: center;">Password Reset Request</h2>
            <p>You requested to reset your password. Use the following OTP to proceed:</p>
            <div style="margin-top: 25px; margin-bottom: 25px; padding: 30px; background-color: #f8f9fa; border-radius: 8px; text-align: center; border: 2px dashed #e5e7eb;">
                <h1 style="font-size: 42px; letter-spacing: 10px; color: #3b82f6; margin: 0; font-weight: 900;">{otp}</h1>
            </div>
            <p style="margin-top: 20px; font-size: 14px;">This OTP will expire in 15 minutes. If you did not request this, please ignore this email.</p>
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
        "to": [{"email": user_email}],
        "subject": subject,
        "htmlContent": html_content,
    }

    try:
        response = requests.post("https://api.brevo.com/v3/smtp/email", json=payload, headers=headers)
        return response.status_code == 201
    except Exception as e:
        logger.error(f"Error sending OTP email: {str(e)}")
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
        return False

    subject = "Welcome to Cosy Content - Your Account is Ready!"
    
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px; background-color: white; border-radius: 12px; border: 1px solid #e5e7eb;">
            {get_email_header()}
            <h2 style="color: #3b82f6;">Welcome to Cosy Content!</h2>
            <p>Thank you for your purchase. We have created an account for you so you can manage your website projects.</p>
            <div style="margin-top: 25px; margin-bottom: 25px; padding: 25px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <p style="margin: 0 0 10px 0;"><strong>Login Email:</strong> {user_email}</p>
                <p style="margin: 0;"><strong>Temporary Password:</strong> <span style="font-family: monospace; background: #eee; padding: 2px 5px; border-radius: 3px;">{temp_password}</span></p>
            </div>
            <p style="margin-top: 20px;">Please log in and change your password as soon as possible to secure your account.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{settings.FRONTEND_URL}/login" style="display: inline-block; padding: 14px 30px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">Log In to Your Dashboard</a>
            </div>
            <p style="margin-top: 20px; font-size: 14px;">If you have any questions, simply reply to this email.</p>
            {get_email_footer()}
        </div>
    </body>
    </html>
    """

    headers = {"accept": "application/json", "api-key": brevo_api_key, "content-type": "application/json"}
    payload = {
        "sender": {"name": brevo_sender_name, "email": brevo_sender_email},
        "to": [{"email": user_email}],
        "subject": subject,
        "htmlContent": html_content,
    }

    try:
        response = requests.post("https://api.brevo.com/v3/smtp/email", json=payload, headers=headers)
        return response.status_code == 201
    except:
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
        return False

    review_link = "https://g.page/r/CcL50VdU9y65EAE/review"
    subject = f"Your website for {company_name} is 100% complete!"
    
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px; background-color: white; border-radius: 12px; border: 1px solid #e5e7eb;">
            {get_email_header()}
            <h2 style="color: #3b82f6;">Your Website is Ready! 🎉</h2>
            <p>Congratulations! Your website for <strong>{company_name}</strong> is now 100% complete and live.</p>
            <p>We've loved working on this project with you. Would you mind taking a moment to leave us a review on Google? It really helps us grow!</p>
            <div style="margin-top: 30px; text-align: center;">
                <a href="{review_link}" style="display: inline-block; padding: 14px 30px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">Leave a Review on Google</a>
            </div>
            {get_email_footer()}
        </div>
    </body>
    </html>
    """

    headers = {"accept": "application/json", "api-key": brevo_api_key, "content-type": "application/json"}
    payload = {
        "sender": {"name": brevo_sender_name, "email": brevo_sender_email},
        "to": [{"email": user_email}],
        "subject": subject,
        "htmlContent": html_content,
    }

    try:
        response = requests.post("https://api.brevo.com/v3/smtp/email", json=payload, headers=headers)
        return response.status_code == 201
    except:
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
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px; background-color: white; border-radius: 12px; border: 1px solid #e5e7eb;">
            {get_email_header()}
            <h2 style="color: #3b82f6;">Project Update</h2>
            <p>Great news! Your website project for <strong>{company_name}</strong> is moving along. We are currently at <strong>{progress}%</strong> completion.</p>
            <div style="margin: 30px 0; background-color: #f3f4f6; border-radius: 20px; height: 12px; width: 100%; overflow: hidden;">
                <div style="background-color: #3b82f6; width: {progress}%; height: 100%; border-radius: 20px;"></div>
            </div>
            <div style="text-align: center; margin-top: 30px;">
                <a href="{frontend_url}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">View Your Timeline</a>
            </div>
            {get_email_footer()}
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
    headers = {"accept": "application/json", "api-key": brevo_api_key, "content-type": "application/json"}

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

    frontend_url = settings.FRONTEND_URL
    subject = f"Action Required: Transferring your {company_name} repository"
    
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px; background-color: white; border-radius: 12px; border: 1px solid #e5e7eb;">
            {get_email_header()}
            <h2 style="color: #3b82f6;">Ready to Transfer Your Code!</h2>
            <p>Your website for <strong>{company_name}</strong> has been generated and pushed to our secure staging repository.</p>
            <p>Since you chose the One-Time Purchase plan, we are ready to transfer full ownership of the source code to you.</p>
            <p>Please click the link below to enter your GitHub username or email so we can initiate the transfer:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{frontend_url}/dashboard?action=transfer" style="display: inline-block; padding: 14px 30px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Submit GitHub Username</a>
            </div>
            <p style="margin-top: 20px; font-size: 14px;">Once you submit your username, our team will initiate the transfer on GitHub. You will receive an invitation from GitHub to accept the repository.</p>
            {get_email_footer()}
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
    headers = {"accept": "application/json", "api-key": brevo_api_key, "content-type": "application/json"}

    try:
        response = requests.post("https://api.brevo.com/v3/smtp/email", json=payload, headers=headers)
        return response.status_code == 201
    except:
        return False
