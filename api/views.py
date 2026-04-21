from rest_framework import generics, status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    WebsiteSerializer,
    ClientApplicationSerializer,
    FeedbackSerializer,
    AttachmentSerializer,
)
from .models import (
    User,
    Website,
    ClientApplication,
    PasswordResetOTP,
    Feedback,
    Attachment,
)
import stripe
import random
import string
import threading
import requests
import logging
import os
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .utils import send_welcome_email, send_otp_email

stripe.api_key = settings.STRIPE_SECRET_KEY
logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([AllowAny])
def contact_us(request):
    """
    Send contact us email using Brevo API,
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
            return Response(
                {"success": True, "message": "Message sent successfully!"},
                status=status.HTTP_200_OK,
            )
        else:
            logger.error(f"Brevo API error: {response.status_code} - {response.text}")
            return Response(
                {"error": "Failed to send email."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    except Exception as e:
        logger.error(f"Unexpected error in contact_us view: {str(e)}")
        return Response(
            {"error": "An unexpected error occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


class RequestEditView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        website_id = request.data.get("website_id")
        edit_details = request.data.get("details")

        if not all([website_id, edit_details]):
            return Response(
                {"error": "Website ID and details are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            website = Website.objects.get(id=website_id, owner=user)
        except Website.DoesNotExist:
            return Response(
                {"error": "Website not found or not owned by you"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Send email via Brevo
        brevo_api_key = os.getenv("BREVO_API_KEY")
        if not brevo_api_key:
            return Response(
                {"error": "Email service not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

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
            "sender": {
                "name": "Cosy Content System",
                "email": "system@cosycontent.com",
            },
            "to": [
                {"email": "contact@cosycontent.com", "name": "Cosy Content Support"}
            ],
            "subject": subject,
            "htmlContent": html_content,
        }

        response = requests.post(
            "https://api.brevo.com/v3/smtp/email", json=payload, headers=headers
        )

        if response.status_code == 201:
            return Response(
                {"success": True, "message": "Edit request sent successfully!"}
            )
        else:
            return Response(
                {"error": "Failed to send request"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class UserDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = User.objects.all()


class ClientApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ClientApplicationSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ClientApplication.objects.all()
        return ClientApplication.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Link user if authenticated
        application = serializer.save(
            user=request.user if request.user.is_authenticated else None
        )
        return Response(
            {"id": application.id, "message": "Application saved successfully"},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"])
    def add_feedback(self, request, pk=None):
        application = self.get_object()
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(application=application)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def add_attachment(self, request, pk=None):
        application = self.get_object()
        file = request.FILES.get("file")
        if not file:
            return Response(
                {"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        attachment = Attachment.objects.create(
            application=application, file=file, filename=file.name
        )
        serializer = AttachmentSerializer(attachment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def submit_github_username(self, request, pk=None):
        application = self.get_object()
        github_username = request.data.get('github_username')
        if not github_username:
            return Response({"error": "GitHub username is required"}, status=status.HTTP_400_BAD_REQUEST)

        application.github_username_for_transfer = github_username
        application.save()

        # Notify admin of transfer request
        subject = f"GitHub Transfer Request: {application.company_name}"
        html_content = f"User {application.user.email} has requested a GitHub transfer for {application.company_name}. GitHub Username: {github_username}"

        # Use simple mail to admin
        brevo_api_key = os.getenv("BREVO_API_KEY")
        if brevo_api_key:
            payload = {
                "sender": {"name": "System", "email": "system@cosycontent.com"},
                "to": [{"email": "contact@cosycontent.com"}],
                "subject": subject,
                "htmlContent": html_content,
            }
            requests.post("https://api.brevo.com/v3/smtp/email", json=payload, headers={"api-key": brevo_api_key, "content-type": "application/json"})

        return Response({"success": True, "message": "GitHub username submitted successfully!"})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def redeploy_vercel(self, request, pk=None):
        application = self.get_object()
        from .services.vercel_service import deploy_to_vercel
        
        try:
            github_org = os.getenv("GITHUB_ORG_NAME")
            repo_name = application.company_name.lower().replace(" ", "-").replace(".", "")
            preview_url = deploy_to_vercel(repo_name, github_org, application.company_name)
            
            if preview_url:
                # Update Website record if exists, or create new
                website, created = Website.objects.get_or_create(
                    name=application.company_name,
                    owner=application.user,
                    defaults={'url': preview_url, 'hosting_type': 'PLATFORM'}
                )
                if not created:
                    website.url = preview_url
                    website.save()
                    
                return Response({"success": True, "url": preview_url})
            else:
                return Response({"error": "Vercel redeployment failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def regenerate_code(self, request, pk=None):
        application = self.get_object()
        
        # Reset status and progress
        application.status = 'processing'
        application.progress = 10
        application.save()
        
        # Start the background task again
        from .tasks import process_application_task
        threading.Thread(target=process_application_task, args=(application.id, application.user.id)).start()
        
        return Response({"success": True, "message": "Regeneration task started."})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def repush_to_github(self, request, pk=None):
        application = self.get_object()

        # Look for backup file
        import json
        import os
        from django.conf import settings
        from .services.github_service import create_and_push_repo
        from .utils import send_review_request_email

        backup_dir = os.path.join(settings.MEDIA_ROOT, "website_backups")
        backup_filename = f"app_{application.id}_{application.company_name.lower().replace(' ', '_')}.json"
        backup_path = os.path.join(backup_dir, backup_filename)

        if not os.path.exists(backup_path):
            return Response(
                {"error": "Backup file not found on server"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            with open(backup_path, "r") as f:
                code_files = json.load(f)

            logger.info(
                f"Retrying GitHub push for {application.company_name} from backup..."
            )
            repo_url = create_and_push_repo(application.company_name, code_files)

            if repo_url:
                # Success! Create Website and update status
                Website.objects.create(
                    name=application.company_name,
                    url=repo_url,
                    owner=application.user,
                    hosting_type="PLATFORM",
                )
                application.status = "completed"
                application.progress = 100
                application.save()

                # Send email
                if application.user:
                    send_review_request_email(
                        application.user.email, application.company_name
                    )

                return Response({"success": True, "url": repo_url})
            else:
                return Response(
                    {
                        "error": "GitHub push failed again. Check organization permissions."
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CreateCheckoutSessionView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        plan_type = request.data.get("plan_type")
        application_id = request.data.get("application_id")
        user_email = request.data.get("email")

        try:
            if request.user.is_authenticated:
                customer_email = request.user.email
                user_id = request.user.id
            else:
                customer_email = user_email
                user_id = None

            if plan_type == "one_time":
                price_id = settings.STRIPE_ONE_TIME_PRICE_ID
                mode = "payment"
            else:
                price_id = settings.STRIPE_MONTHLY_PRICE_ID
                mode = "subscription"

            metadata = {"plan_type": plan_type, "application_id": application_id}
            if user_id:
                metadata["user_id"] = user_id
                success_url = settings.FRONTEND_URL + "/dashboard?success=true"
            else:
                # Guest user
                success_url = (
                    settings.FRONTEND_URL + "/login?success=true&new_user=true"
                )

            checkout_session = stripe.checkout.Session.create(
                customer_email=customer_email,
                payment_method_types=["card"],
                line_items=[{"price": price_id, "quantity": 1}],
                mode=mode,
                success_url=success_url,
                cancel_url=settings.FRONTEND_URL + "/dashboard?canceled=true",
                metadata=metadata,
            )
            return Response({"url": checkout_session.url})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
        event = None
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError as e:
            return HttpResponse(status=400)

        if event.type == "checkout.session.completed":
            session = event.data.object

            # Use attribute access for Stripe v15+
            metadata = getattr(session, "metadata", {})
            user_id = getattr(metadata, "user_id", None)
            application_id = getattr(metadata, "application_id", None)
            plan_type = getattr(metadata, "plan_type", None)

            customer_details = getattr(session, "customer_details", None)
            email = (
                getattr(customer_details, "email", None) if customer_details else None
            )

            if not user_id and email:
                # User doesn't exist, create account
                try:
                    user = User.objects.get(email=email)
                    logger.info(f"User {email} already exists, skipping creation.")
                except User.DoesNotExist:
                    logger.info(f"Creating new user account for {email}")
                    temp_password = "".join(
                        random.choices(string.ascii_letters + string.digits, k=12)
                    )
                    user = User.objects.create_user(email=email, password=temp_password)
                    sent = send_welcome_email(email, temp_password)
                    if sent:
                        logger.info(f"Welcome email sent to {email}")
                    else:
                        logger.error(f"Failed to send welcome email to {email}")
                user_id = user.id

            if user_id:
                user = User.objects.get(id=user_id)
                user.is_premium = True
                user.stripe_customer_id = getattr(session, "customer", None)
                user.subscription_status = "active"
                user.save()

                if application_id:
                    # Link application to user
                    try:
                        app = ClientApplication.objects.get(id=application_id)
                        app.user = user
                        if plan_type:
                            app.plan_type = plan_type
                        app.save()

                        # Start background processing (Claude + GitHub)
                        from .tasks import process_application_task

                        threading.Thread(
                            target=process_application_task, args=(app.id, user.id)
                        ).start()
                    except ClientApplication.DoesNotExist:
                        pass

        return HttpResponse(status=200)


class WebsiteViewSet(viewsets.ModelViewSet):
    serializer_class = WebsiteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Website.objects.all()
        return Website.objects.filter(owner=self.request.user)


class RequestPasswordResetOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # We return 200 even if user doesn't exist for security (prevent email enumeration)
            return Response(
                {
                    "message": "If an account with this email exists, an OTP has been sent."
                },
                status=status.HTTP_200_OK,
            )

        # Generate 6-digit OTP
        otp_code = "".join(random.choices(string.digits, k=6))

        # Save OTP to database
        PasswordResetOTP.objects.create(user=user, otp=otp_code)

        # Send OTP via email
        sent = send_otp_email(email, otp_code)

        if sent:
            return Response(
                {
                    "message": "If an account with this email exists, an OTP has been sent."
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "Failed to send email. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class VerifyPasswordResetOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp_code = request.data.get("otp")
        new_password = request.data.get("new_password")

        if not all([email, otp_code, new_password]):
            return Response(
                {"error": "Email, OTP, and new password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
            # Get the latest unused OTP for this user
            otp_obj = (
                PasswordResetOTP.objects.filter(user=user, otp=otp_code, is_used=False)
                .order_by("-created_at")
                .first()
            )

            if not otp_obj:
                return Response(
                    {"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST
                )

            if otp_obj.is_expired():
                return Response(
                    {"error": "OTP has expired"}, status=status.HTTP_400_BAD_REQUEST
                )

            # Update password and mark OTP as used
            user.set_password(new_password)
            user.save()
            otp_obj.is_used = True
            otp_obj.save()

            return Response(
                {"success": True, "message": "Password reset successfully!"},
                status=status.HTTP_200_OK,
            )

        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not all([old_password, new_password]):
            return Response(
                {"error": "Old and new passwords are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user
        if not user.check_password(old_password):
            return Response(
                {"error": "Incorrect old password"}, status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()
        return Response(
            {"success": True, "message": "Password changed successfully!"},
            status=status.HTTP_200_OK,
        )
