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
    next_url = request.GET.get('next')
    action = request.GET.get('action') # 'login' or 'signup'
    
    if next_url:
        request.session['auth_next_url'] = next_url
    if action:
        request.session['auth_action'] = action
    
    redirect_uri = request.build_absolute_uri(reverse('google_authorize'))
    return oauth.google.authorize_redirect(request, redirect_uri, nonce=secrets.token_hex(16))

def google_authorize(request):
    try:
        next_url = request.session.pop('auth_next_url', None)
        action = request.session.pop('auth_action', 'login')
        
        token = oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        if not user_info:
            user_info = oauth.google.userinfo(token=token)
        
        email = user_info.get('email')
        first_name = user_info.get('given_name', '')
        last_name = user_info.get('family_name', '')

        if not email:
            error_redirect = next_url if next_url else f"{settings.FRONTEND_URL}/login"
            return redirect(f"{error_redirect}?error=Email not provided by Google")

        try:
            user = User.objects.get(email=email)
            
            # If user exists but they clicked "Sign up", don't log them in, 
            # just fill the form (per user request).
            if action == 'signup':
                signup_url = f"{settings.FRONTEND_URL}/signup?email={email}&first_name={first_name}&last_name={last_name}"
                return redirect(signup_url)

            # User exists and action is 'login', perform login
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

            callback_url = f"{settings.FRONTEND_URL}/auth/callback?access={str(refresh.access_token)}&refresh={str(refresh)}"
            if next_url:
                callback_url += f"&next={next_url}"
            return redirect(callback_url)

        except User.DoesNotExist:
            # User does not exist, redirect to signup with pre-filled data
            signup_url = f"{settings.FRONTEND_URL}/signup?email={email}&first_name={first_name}&last_name={last_name}"
            return redirect(signup_url)

    except Exception as e:
        logger.error(f"Google authorization error: {str(e)}")
        return redirect(f"{settings.FRONTEND_URL}/login?error=Google authentication failed")
