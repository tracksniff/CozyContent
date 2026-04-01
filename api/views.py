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
