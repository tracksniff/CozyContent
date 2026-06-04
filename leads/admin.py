from django.contrib import admin, messages
from django.shortcuts import redirect
from django.urls import path

from .models import Business, OutreachQueue
from .tasks import scrape_all_businesses, audit_website_batch


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
    actions = ["trigger_scrape", "trigger_audit"]

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path("start-initial-scrape/", self.admin_site.admin_view(self.start_initial_scrape), name="start-initial-scrape"),
            path("test-single-scrape/", self.admin_site.admin_view(self.test_single_scrape), name="test-single-scrape"),
        ]
        return custom_urls + urls

    def start_initial_scrape(self, request):
        scrape_all_businesses.delay()
        self.message_user(request, "Initial business scraping task has been triggered.", messages.SUCCESS)
        return redirect("admin:leads_business_changelist")

    def test_single_scrape(self, request):
        """Trigger a single category/location scrape task and log the RAW output in Celery."""
        from .tasks import test_single_scrape_task
        test_single_scrape_task.delay()
        self.message_user(request, "Test scrape task triggered. Check CELERY WORKER logs for RAW RESPONSE.", messages.INFO)
        return redirect("admin:leads_business_changelist")

    @admin.action(description="Trigger full business scrape (Outscraper)")
    def trigger_scrape(self, request, queryset):
        scrape_all_businesses.delay()
        self.message_user(request, "Business scraping task has been triggered.", messages.SUCCESS)

    @admin.action(description="Trigger website audit batch (PageSpeed)")
    def trigger_audit(self, request, queryset):
        audit_website_batch.delay()
        self.message_user(request, "Website audit task has been triggered.", messages.SUCCESS)


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
