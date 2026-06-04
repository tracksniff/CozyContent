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
        """Trigger a single category/location scrape and log the RAW output."""
        from .tasks import CATEGORY_QUERIES, LOCATIONS
        from .services.outscraper_service import _client
        import json
        import logging

        logger = logging.getLogger("leads.tasks")
        
        category = "plumbing"
        query = CATEGORY_QUERIES[category]
        location = LOCATIONS[0] # Usually Luton
        
        client = _client()
        search_term = f"{query} in {location}, UK"
        
        logger.info("TEST SCRAPE START: %s", search_term)
        response = client.google_maps_search(
            search_term,
            limit=1,
            language="en",
            region="GB",
        )
        
        # Log the raw response so we can see the exact field names
        logger.info("RAW OUTSCRAPER RESPONSE: %s", json.dumps(response, indent=2))
        
        self.message_user(request, f"Test scrape for '{search_term}' triggered. Check logs for RAW RESPONSE.", messages.INFO)
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
