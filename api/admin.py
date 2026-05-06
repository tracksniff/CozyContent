from django.contrib import admin
from .models import (
    User, Website, ClientApplication, 
    ApplicationImage, Feedback, Attachment, PasswordResetOTP
)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_premium', 'plan_type', 'subscription_status')
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('is_staff', 'is_premium', 'plan_type', 'subscription_status')

@admin.register(ClientApplication)
class ClientApplicationAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'user', 'status', 'plan_type', 'progress', 'created_at')
    list_filter = ('status', 'plan_type', 'created_at')
    search_fields = ('company_name', 'user__email')
    readonly_fields = ('created_at',)

@admin.register(Website)
class WebsiteAdmin(admin.ModelAdmin):
    list_display = ('name', 'url', 'owner', 'hosting_type', 'created_at')
    list_filter = ('hosting_type', 'created_at')
    search_fields = ('name', 'url', 'owner__email')

@admin.register(ApplicationImage)
class ApplicationImageAdmin(admin.ModelAdmin):
    list_display = ('application', 'uploaded_at')

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('application', 'section_name', 'is_resolved', 'created_at')
    list_filter = ('is_resolved', 'created_at')

@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = ('application', 'filename', 'uploaded_at')
    search_fields = ('filename', 'application__company_name')

@admin.register(PasswordResetOTP)
class PasswordResetOTPAdmin(admin.ModelAdmin):
    list_display = ('user', 'otp', 'is_used', 'created_at')
    list_filter = ('is_used', 'created_at')
