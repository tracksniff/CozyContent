from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, 
    UserDetailView, 
    UserViewSet,
    WebsiteViewSet, 
    ClientApplicationViewSet,
    CreateCheckoutSessionView, 
    StripeWebhookView,
    contact_us,
    RequestEditView,
    RequestPasswordResetOTPView,
    VerifyPasswordResetOTPView,
    ChangePasswordView,
    AuditViewSet,
    SiteRequestViewSet,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r"websites", WebsiteViewSet, basename="website")
router.register(r"users", UserViewSet, basename="user")
router.register(r"applications", ClientApplicationViewSet, basename="application")
router.register(r"audits", AuditViewSet, basename="audit")
router.register(r"site-requests", SiteRequestViewSet, basename="site-request")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth_register"),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("user/", UserDetailView.as_view(), name="user_detail"),
    path("contact-us/", contact_us, name="contact_us"),
    path("forgot-password/request/", RequestPasswordResetOTPView.as_view(), name="forgot_password_request"),
    path("forgot-password/verify/", VerifyPasswordResetOTPView.as_view(), name="forgot_password_verify"),
    path("change-password/", ChangePasswordView.as_view(), name="change_password"),
    path("create-checkout-session/", CreateCheckoutSessionView.as_view(), name="create_checkout_session"),
    path("stripe-webhook/", StripeWebhookView.as_view(), name="stripe_webhook"),
    path("stripe-webhook", StripeWebhookView.as_view(), name="stripe_webhook_no_slash"),
    path("", include(router.urls)),
]
