import os
import secrets
from datetime import datetime
from django.shortcuts import redirect
from django.urls import reverse
from django.http import JsonResponse
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from .auth import oauth
from .models import User, SocialToken
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

def google_login(request):
    redirect_uri = request.build_absolute_uri(reverse('google_authorize'))
    return oauth.google.authorize_redirect(request, redirect_uri, nonce=secrets.token_hex(16))

def google_authorize(request):
    try:
        token = oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        if not user_info:
            user_info = oauth.google.userinfo(token=token)
        
        email = user_info.get('email')
        if not email:
            return redirect(f"{settings.FRONTEND_URL}/login?error=Email not provided by Google")

        try:
            user = User.objects.get(email=email)
            # User exists, login
            refresh = RefreshToken.for_user(user)
            
            # Update social token
            social_token, created = SocialToken.objects.get_or_create(
                user=user,
                provider='google',
                defaults={
                    'access_token': token['access_token'],
                    'expires_at': timezone.make_aware(datetime.fromtimestamp(token['expires_at'])) if token.get('expires_at') else None,
                }
            )
            if not created:
                social_token.access_token = token['access_token']
                if token.get('expires_at'):
                    social_token.expires_at = timezone.make_aware(datetime.fromtimestamp(token['expires_at']))
                social_token.save()

            return redirect(f"{settings.FRONTEND_URL}/auth/callback?access={str(refresh.access_token)}&refresh={str(refresh)}")

        except User.DoesNotExist:
            # User does not exist, redirect to signup with pre-filled data
            first_name = user_info.get('given_name', '')
            last_name = user_info.get('family_name', '')
            
            signup_url = f"{settings.FRONTEND_URL}/signup?email={email}&first_name={first_name}&last_name={last_name}"
            return redirect(signup_url)

    except Exception as e:
        logger.error(f"Google authorization error: {str(e)}")
        return redirect(f"{settings.FRONTEND_URL}/login?error=Google authentication failed")
