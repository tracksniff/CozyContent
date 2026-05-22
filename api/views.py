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
    AuditReportSerializer,
    SiteRequestSerializer,
)
from .models import (
    User,
    Website,
    ClientApplication,
    PasswordResetOTP,
    Feedback,
    Attachment,
    AuditReport,
    SiteRequest,
)
import stripe
import random
import string
import threading
import requests
import logging
import os
import socket
from django.conf import settings
from django.http import HttpResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .utils import send_welcome_email, send_otp_email, create_brevo_contact, send_request_approval_email, send_request_completion_email

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
                <h2 style="color: #00696D;">New Contact Form Submission</h2>
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


from rest_framework_simplejwt.views import TokenObtainPairView




class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

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
        user = self.request.user
        
        # Check if monthly quota needs reset (every 30 days)
        # Use getattr/hasattr to avoid crashes if migrations haven't been run yet
        is_premium = getattr(user, 'is_premium', False)
        subscription_status = getattr(user, 'subscription_status', 'inactive')
        
        if is_premium and subscription_status == 'active':
            now = timezone.now()
            last_reset = getattr(user, 'last_quota_reset', None)
            
            if not last_reset or (now - last_reset).days >= 30:
                try:
                    user.monthly_requests_remaining = 5
                    user.last_quota_reset = now
                    user.save()
                except Exception as e:
                    logger.error(f"Failed to reset quota for user {user.email}: {str(e)}")
                
        return user


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
        first_name = request.data.get("first_name", "")
        last_name = request.data.get("last_name", "")

        try:
            if request.user.is_authenticated:
                customer_email = request.user.email
                user_id = request.user.id
            else:
                customer_email = user_email
                user_id = None

            metadata = {
                "plan_type": plan_type, 
                "application_id": application_id,
                "first_name": first_name,
                "last_name": last_name
            }

            if plan_type == "one_time":
                price_id = settings.STRIPE_ONE_TIME_PRICE_ID
                mode = "payment"
            elif plan_type == "annual":
                price_id = settings.STRIPE_ANNUAL_PRICE_ID
                mode = "subscription"
            elif plan_type == "monthly":
                price_id = settings.STRIPE_MONTHLY_PRICE_ID
                mode = "subscription"
            elif plan_type == "pack_1":
                price_id = settings.STRIPE_PACK_1_PRICE_ID
                mode = "payment"
            elif plan_type == "pack_5":
                price_id = settings.STRIPE_PACK_5_PRICE_ID
                mode = "payment"
            elif plan_type == "pack_10":
                price_id = settings.STRIPE_PACK_10_PRICE_ID
                mode = "payment"
            elif plan_type == "pack_20":
                price_id = settings.STRIPE_PACK_20_PRICE_ID
                mode = "payment"
            elif plan_type == "priority_monthly":
                price_id = settings.STRIPE_PRIORITY_MONTHLY_PRICE_ID
                mode = "subscription"
            else:
                return Response({"error": "Invalid plan type"}, status=status.HTTP_400_BAD_REQUEST)

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
            first_name = getattr(metadata, "first_name", "")
            last_name = getattr(metadata, "last_name", "")

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
                    user = User.objects.create_user(
                        email=email,
                        password=temp_password,
                        first_name=first_name,
                        last_name=last_name
                    )
                    create_brevo_contact(email, first_name, last_name)
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
                
                if plan_type:
                    user.plan_type = plan_type

                # Handle plan-specific logic
                if plan_type in ["monthly", "annual"]:
                    user.monthly_requests_remaining += 5
                elif plan_type == "pack_1":
                    user.purchased_requests_remaining += 1
                elif plan_type == "pack_5":
                    user.purchased_requests_remaining += 5
                elif plan_type == "pack_10":
                    user.purchased_requests_remaining += 10
                elif plan_type == "pack_20":
                    user.purchased_requests_remaining += 20
                elif plan_type == "priority_monthly":
                    user.priority_updates_active = True
                
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

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def redeploy_vercel(self, request, pk=None):
        website = self.get_object()
        from .services.vercel_service import deploy_to_vercel
        from .services.github_service import ensure_repo_public
        
        try:
            github_org = os.getenv("GITHUB_ORG_NAME")
            # Using the website name as the repo name basis
            repo_name = website.name.lower().replace(" ", "-").replace(".", "")
            
            # 1. Ensure repo is public for Vercel access
            ensure_repo_public(repo_name)
            
            # 2. Deploy to Vercel
            preview_url = deploy_to_vercel(repo_name, github_org, website.name)
            
            if preview_url:
                website.url = preview_url
                website.save()
                return Response({"success": True, "url": preview_url})
            else:
                return Response({"error": "Vercel redeployment failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def update_custom_domain(self, request, pk=None):
        website = self.get_object()
        custom_domain = request.data.get('custom_domain')
        if not custom_domain:
            return Response({"error": "Custom domain is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        website.custom_domain = custom_domain
        website.save()

        # Notify admin of domain update
        from .utils import send_admin_new_site_notification
        # We reuse this to send a notification, or we could create a specialized one
        # For now, let's just use a simple log or similar if we don't want to spam, 
        # but the user said "save domain information needed by admin".
        
        # Let's send a specific email to admin about the domain update
        brevo_api_key = os.getenv("BREVO_API_KEY")
        if brevo_api_key:
            payload = {
                "sender": {"name": "System", "email": "system@cosycontent.com"},
                "to": [{"email": "crispusgikonyo458@gmail.com"}],
                "subject": f"Domain Updated for {website.name}",
                "htmlContent": f"User {website.owner.email} has updated the custom domain for <strong>{website.name}</strong> to: <strong>{custom_domain}</strong>. <br/> Visit site: {website.url}",
            }
            requests.post("https://api.brevo.com/v3/smtp/email", json=payload, headers={"api-key": brevo_api_key, "content-type": "application/json"})

        return Response({"success": True, "custom_domain": custom_domain})

    @action(detail=True, methods=['get'])
    def check_dns(self, request, pk=None):
        website = self.get_object()
        if not website.custom_domain:
            return Response({"error": "No custom domain set"}, status=status.HTTP_400_BAD_REQUEST)
        
        server_ip = os.getenv("SERVER_IP", "128.140.103.20")
        try:
            domain_ip = socket.gethostbyname(website.custom_domain)
            if domain_ip == server_ip:
                if not website.dns_ready:
                    website.dns_ready = True
                    website.save()
                return Response({"is_ready": True, "domain_ip": domain_ip, "server_ip": server_ip})
            else:
                if website.dns_ready:
                    website.dns_ready = False
                    website.save()
                return Response({"is_ready": False, "domain_ip": domain_ip, "server_ip": server_ip})
        except socket.gaierror:
            if website.dns_ready:
                website.dns_ready = False
                website.save()
            return Response({"is_ready": False, "error": "Could not resolve domain"})

class SiteRequestViewSet(viewsets.ModelViewSet):
    serializer_class = SiteRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return SiteRequest.objects.all()
        return SiteRequest.objects.filter(user=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        user = request.user
        
        # Check if user has enough requests
        if user.monthly_requests_remaining <= 0 and user.purchased_requests_remaining <= 0:
            return Response(
                {"error": "You have no remaining requests. Please purchase an update pack."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Deduct from monthly first, then purchased
        if user.monthly_requests_remaining > 0:
            user.monthly_requests_remaining -= 1
        else:
            user.purchased_requests_remaining -= 1
        
        user.save()

        # Set priority if user has priority updates active
        is_priority = user.priority_updates_active
        
        site_request = serializer.save(user=user, is_priority=is_priority)
        
        # Notify admin (reuse logic from RequestEditView or similar)
        self.notify_admin(site_request)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def notify_admin(self, site_request):
        brevo_api_key = os.getenv("BREVO_API_KEY")
        if not brevo_api_key:
            return

        priority_tag = "[PRIORITY] " if site_request.is_priority else ""
        subject = f"{priority_tag}New Update Request for {site_request.website.name}"
        html_content = f"""
        <html>
        <body>
            <h2>New Update Request</h2>
            <p><strong>User:</strong> {site_request.user.email}</p>
            <p><strong>Website:</strong> {site_request.website.name} ({site_request.website.url})</p>
            <p><strong>Priority:</strong> {"Yes" if site_request.is_priority else "No"}</p>
            <p><strong>Details:</strong></p>
            <div style="padding: 15px; background: #f4f4f4; border-radius: 5px;">{site_request.details}</div>
        </body>
        </html>
        """

        payload = {
            "sender": {"name": "Cosy Content System", "email": "system@cosycontent.com"},
            "to": [{"email": "contact@cosycontent.com"}],
            "subject": subject,
            "htmlContent": html_content,
        }
        requests.post(
            "https://api.brevo.com/v3/smtp/email", 
            json=payload, 
            headers={"api-key": brevo_api_key, "content-type": "application/json"}
        )

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        site_request = self.get_object()
        site_request.status = 'in_progress'
        site_request.save()
        send_request_approval_email(site_request)
        return Response({"success": True, "message": "Request moved to In Progress."})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def complete(self, request, pk=None):
        site_request = self.get_object()
        site_request.status = 'completed'
        site_request.save()
        send_request_completion_email(site_request)
        return Response({"success": True, "message": "Request marked as completed and notification sent."})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        site_request = self.get_object()
        site_request.status = 'denied'
        site_request.rejection_reason = request.data.get('reason', '')
        site_request.save()
        return Response({"success": True, "message": "Request rejected."})


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

class AuditViewSet(viewsets.ModelViewSet):
    queryset = AuditReport.objects.all()
    serializer_class = AuditReportSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        audit = serializer.save()

        # Create/Retrieve Stripe Customer
        if audit.email:
            try:
                # Check if customer already exists in Stripe
                customers = stripe.Customer.list(email=audit.email, limit=1).data
                if customers:
                    customer = customers[0]
                else:
                    customer = stripe.Customer.create(
                        email=audit.email,
                        name=audit.name or audit.business_name,
                        metadata={
                            "source": "audit_tool",
                            "audit_id": audit.id,
                            "business_name": audit.business_name,
                            "website": audit.website_url
                        }
                    )
                
                audit.stripe_customer_id = customer.id
                audit.save()

                # Sync with Brevo
                create_brevo_contact(
                    audit.email, 
                    first_name=audit.name.split(' ')[0] if audit.name else None,
                    last_name=' '.join(audit.name.split(' ')[1:]) if audit.name and ' ' in audit.name else None,
                    attributes={
                        "BUSINESS_NAME": audit.business_name,
                        "WEBSITE": audit.website_url,
                        "INDUSTRY": audit.industry,
                        "LOCATION": audit.location,
                        "SOURCE": "Audit Lead"
                    }
                )

                # Sync with User model if user exists
                try:
                    user = User.objects.get(email=audit.email)
                    if not user.stripe_customer_id:
                        user.stripe_customer_id = customer.id
                        user.save()
                except User.DoesNotExist:
                    pass
            except Exception as e:
                logger.error(f"Stripe customer sync failed for audit {audit.id}: {str(e)}")
        
        # Run audit synchronously for now to provide "instant" results
        from .services.audit_service import perform_audit
        report_data = perform_audit(audit.id)
        
        if report_data:
            return Response({
                "id": audit.id,
                "report_data": report_data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {"error": "Failed to generate audit report"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
