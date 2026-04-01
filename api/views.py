from rest_framework import generics, status, permissions, viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer, WebsiteSerializer
from .models import User, Website
import stripe
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

stripe.api_key = settings.STRIPE_SECRET_KEY

import requests
import logging
import os
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

logger = logging.getLogger(__name__)

@api_view(["POST"])
@permission_classes([AllowAny])
def contact_us(request):
    """
    Send contact us email using Brevo API
    """
    try:
        # Get data from request
        data = request.data
        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        message = data.get("message", "").strip()

        # Validate required fields
        if not all([name, email, message]):
            return Response(
                {"error": "Name, email, and message are required fields"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Basic email validation
        if "@" not in email or "." not in email.split("@")[-1]:
            return Response(
                {"error": "Please provide a valid email address"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get Brevo API configuration from environment
        brevo_api_key = os.getenv("BREVO_API_KEY")
        brevo_sender_email = os.getenv("BREVO_SENDER_EMAIL", "noreply@cosycontent.com")
        brevo_sender_name = os.getenv("BREVO_SENDER_NAME", "Cosy Content")
        brevo_recipient_email = os.getenv(
            "BREVO_RECIPIENT_EMAIL", "contact@cosycontent.com"
        )
        brevo_recipient_name = os.getenv("BREVO_RECIPIENT_NAME", "Cosy Content Support")

        if not brevo_api_key:
            logger.error("BREVO_API_KEY not found in environment variables")
            return Response(
                {"error": "Email service configuration error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Prepare email content
        subject = f"New Contact Form Submission from {name}"

        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
                <h2 style="color: #3b82f6;">New Contact Form Submission</h2>
                <p><strong>From:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 4px;">
                    <p><strong>Message:</strong></p>
                    <p>{message}</p>
                </div>
                <p style="margin-top: 20px; font-size: 12px; color: #6c757d;">Sent from Cosy Content Landing Page.</p>
            </div>
        </body>
        </html>
        """

        # Prepare Brevo API request
        brevo_url = "https://api.brevo.com/v3/smtp/email"

        headers = {
            "accept": "application/json",
            "api-key": brevo_api_key,
            "content-type": "application/json",
        }

        payload = {
            "sender": {"name": brevo_sender_name, "email": brevo_sender_email},
            "to": [{"email": brevo_recipient_email, "name": brevo_recipient_name}],
            "replyTo": {"email": email, "name": name},
            "subject": subject,
            "htmlContent": html_content,
            "textContent": f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}",
        }

        # Send email via Brevo API
        response = requests.post(brevo_url, json=payload, headers=headers)

        if response.status_code == 201:
            return Response({"success": True, "message": "Message sent successfully!"}, status=status.HTTP_200_OK)
        else:
            logger.error(f"Brevo API error: {response.status_code} - {response.text}")
            return Response({"error": "Failed to send email."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        logger.error(f"Unexpected error in contact_us view: {str(e)}")
        return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RequestEditView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        website_id = request.data.get("website_id")
        edit_details = request.data.get("details")

        if not all([website_id, edit_details]):
            return Response({"error": "Website ID and details are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            website = Website.objects.get(id=website_id, owner=user)
        except Website.DoesNotExist:
            return Response({"error": "Website not found or not owned by you"}, status=status.HTTP_404_NOT_FOUND)

        # Send email via Brevo
        brevo_api_key = os.getenv("BREVO_API_KEY")
        if not brevo_api_key:
            return Response({"error": "Email service not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        subject = f"Edit Request for {website.name} from {user.email}"
        html_content = f"""
        <html>
        <body>
            <h2>New Edit Request</h2>
            <p><strong>User:</strong> {user.email} ({user.first_name} {user.last_name})</p>
            <p><strong>Website:</strong> {website.name} ({website.url})</p>
            <p><strong>Details:</strong></p>
            <div style="padding: 15px; background: #f4f4f4; border-radius: 5px;">{edit_details}</div>
        </body>
        </html>
        """

        headers = {
            "accept": "application/json",
            "api-key": brevo_api_key,
            "content-type": "application/json",
        }

        payload = {
            "sender": {"name": "Cosy Content System", "email": "system@cosycontent.com"},
            "to": [{"email": "contact@cosycontent.com", "name": "Cosy Content Support"}],
            "subject": subject,
            "htmlContent": html_content,
        }

        response = requests.post("https://api.brevo.com/v3/smtp/email", json=payload, headers=headers)

        if response.status_code == 201:
            return Response({"success": True, "message": "Edit request sent successfully!"})
        else:
            return Response({"error": "Failed to send request"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_201_CREATED)

class UserDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = User.objects.all()

class CreateCheckoutSessionView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        plan_type = request.data.get('plan_type')
        try:
            if plan_type == 'one_time':
                price_data = {
                    'currency': 'gbp',
                    'product_data': {'name': 'Cosy Content Website (One-time)'},
                    'unit_amount': 24900,
                }
                mode = 'payment'
            else:
                price_data = {
                    'currency': 'gbp',
                    'product_data': {'name': 'Cosy Content Monthly Subscription'},
                    'unit_amount': 5900,
                    'recurring': {'interval': 'month'},
                }
                mode = 'subscription'

            checkout_session = stripe.checkout.Session.create(
                customer_email=request.user.email,
                payment_method_types=['card'],
                line_items=[{'price_data': price_data, 'quantity': 1}],
                mode=mode,
                success_url=settings.FRONTEND_URL + '/dashboard?success=true',
                cancel_url=settings.FRONTEND_URL + '/dashboard?canceled=true',
                metadata={'user_id': request.user.id, 'plan_type': plan_type}
            )
            return Response({'url': checkout_session.url})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        event = None
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError as e:
            return HttpResponse(status=400)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            user_id = session['metadata'].get('user_id')
            if user_id:
                user = User.objects.get(id=user_id)
                user.is_premium = True
                user.stripe_customer_id = session.get('customer')
                user.subscription_status = 'active'
                user.save()

        return HttpResponse(status=200)

class WebsiteViewSet(viewsets.ModelViewSet):
    serializer_class = WebsiteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Website.objects.all()
        return Website.objects.filter(owner=self.request.user)
