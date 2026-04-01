from django.contrib import admin
from .models import User, Website

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')

@admin.register(Website)
class WebsiteAdmin(admin.ModelAdmin):
    list_display = ('name', 'url', 'owner', 'hosting_type', 'created_at')
    search_fields = ('name', 'url', 'owner__email')
    list_filter = ('hosting_type', 'created_at')
