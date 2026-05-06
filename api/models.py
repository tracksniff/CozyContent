from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import datetime

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    # Stripe Fields
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)
    subscription_status = models.CharField(max_length=50, default='inactive')
    is_premium = models.BooleanField(default=False)

    # Request Tracking Fields
    plan_type = models.CharField(max_length=20, blank=True, null=True) # 'monthly', 'annual', 'one_time'
    monthly_requests_remaining = models.IntegerField(default=0)
    purchased_requests_remaining = models.IntegerField(default=0)
    priority_updates_active = models.BooleanField(default=False)
    last_quota_reset = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

class SiteRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('denied', 'Denied'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='site_requests')
    website = models.ForeignKey('Website', on_delete=models.CASCADE, related_name='site_requests')
    details = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    is_priority = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Request by {self.user.email} for {self.website.name} ({self.status})"

class ClientApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Payment'),
        ('processing', 'Building...'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    company_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    website_url = models.URLField(blank=True, null=True)
    industry = models.CharField(max_length=100)
    tagline = models.CharField(max_length=255, blank=True, null=True)
    services_list = models.TextField()
    city_location = models.CharField(max_length=255)
    years_experience = models.CharField(max_length=50, blank=True, null=True)
    trust_badges = models.CharField(max_length=500, blank=True, null=True)
    service_areas = models.TextField(blank=True, null=True)
    testimonials = models.TextField(blank=True, null=True)
    branding_colors = models.CharField(max_length=255)
    company_logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    trust_badge_links = models.TextField(blank=True, null=True)   # JSON array of URLs
    testimonial_links = models.TextField(blank=True, null=True)   # JSON array of URLs
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    plan_type = models.CharField(max_length=20, blank=True, null=True) # 'one_time' or 'monthly'
    github_username_for_transfer = models.CharField(max_length=255, blank=True, null=True)
    progress = models.IntegerField(default=0)  # 0 to 100
    is_reviewed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='applications')

    def __str__(self):
        return self.company_name

class Feedback(models.Model):
    application = models.ForeignKey(ClientApplication, on_delete=models.CASCADE, related_name='feedbacks')
    section_name = models.CharField(max_length=255)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"Feedback for {self.application.company_name} - {self.section_name}"

class Attachment(models.Model):
    CATEGORY_CHOICES = [
        ('general',       'General'),
        ('certification', 'Certification / Trust Badge'),
        ('testimonial',   'Testimonial Evidence'),
    ]
    application = models.ForeignKey(ClientApplication, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='application_attachments/')
    filename = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment for {self.application.company_name}: {self.filename}"

class ApplicationImage(models.Model):
    application = models.ForeignKey(ClientApplication, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='application_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.application.company_name}"

class Website(models.Model):
    HOSTING_CHOICES = [
        ('PLATFORM', 'Hosted by Cozy Content'),
        ('SELF', 'Self-hosted by User'),
    ]

    name = models.CharField(max_length=255)
    url = models.URLField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='websites')
    hosting_type = models.CharField(max_length=20, choices=HOSTING_CHOICES, default='PLATFORM')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.owner.email})"

class PasswordResetOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        # OTP expires in 15 minutes
        return timezone.now() > self.created_at + datetime.timedelta(minutes=15)

    def __str__(self):
        return f"OTP for {self.user.email}"

class AuditReport(models.Model):
    # User Inputs
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    business_name = models.CharField(max_length=255, blank=True, null=True)
    website_url = models.URLField(blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)

    # Scraped / Metadata
    meta_title = models.TextField(blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    load_speed_score = models.IntegerField(blank=True, null=True) # 0-100

    # AI Generated Results (JSON)
    # Expected structure: 
    # { 
    #   "overall_score": 58, 
    #   "scores": {"design": 20, "mobile_ux": 15, ...},
    #   "findings": ["Outdated design", ...],
    #   "quick_wins": ["Add CTA", ...]
    # }
    report_data = models.JSONField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Audit for {self.business_name} ({self.website_url})"
