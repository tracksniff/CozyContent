from django.contrib import admin

from .models import Business, OutreachQueue


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "location",
        "has_website",
        "audit_status",
        "pagespeed_mobile_performance",
        "is_outdated",
        "rating",
        "reviews",
        "last_audited_at",
    )
    list_filter = (
        "category",
        "location",
        "has_website",
        "audit_status",
        "is_outdated",
        "source",
    )
    search_fields = ("name", "phone", "email", "website", "address")
    readonly_fields = ("created_at", "updated_at", "google_id", "last_audited_at")
    ordering = ("-updated_at",)


@admin.register(OutreachQueue)
class OutreachQueueAdmin(admin.ModelAdmin):
    list_display = (
        "business",
        "status",
        "reason",
        "attempts",
        "scheduled_at",
        "sent_at",
        "created_at",
    )
    list_filter = ("status",)
    search_fields = ("business__name", "business__email", "reason")
    readonly_fields = ("created_at", "updated_at")
    autocomplete_fields = ("business",)
