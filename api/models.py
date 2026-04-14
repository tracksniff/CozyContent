from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

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

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

class ClientApplication(models.Model):
    company_name = models.CharField(max_length=255)
    website_url = models.URLField()
    industry = models.CharField(max_length=100)
    services_list = models.TextField()
    city_location = models.CharField(max_length=255)
    testimonials = models.TextField(blank=True, null=True)
    branding_colors = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='applications')

    def __str__(self):
        return self.company_name

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
