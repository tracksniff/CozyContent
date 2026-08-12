from django.contrib import admin, messages
from django.shortcuts import redirect
from django.urls import path
from django.utils.html import format_html

from .models import Business, OutreachQueue, WebsitePreview
from .tasks import scrape_all_businesses, audit_website_batch

class OutdatedScoreFilter(admin.SimpleListFilter):
    title = 'Outdated Score (13+)'
    parameter_name = 'outdated_score_13_plus'

    def lookups(self, request, model_admin):
        return (
            ('yes', '13 and above'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return queryset.filter(outdated_score__gte=13)
        return queryset


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "location",
        "has_website",
        "audit_status",
        "pagespeed_mobile_performance",
        "outdated_score",
        "outdated_priority",
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
        "outdated_priority",
        "is_outdated",
        "source",
        OutdatedScoreFilter,
    )
    search_fields = ("name", "phone", "email", "website", "address")
    readonly_fields = ("created_at", "updated_at", "google_id", "last_audited_at")
    ordering = ("-updated_at",)
    actions = [
        "trigger_scrape", "trigger_audit", "audit_selected",
        "generate_previews", "backfill_previews", "delete_no_website",
    ]

    @admin.action(description="Generate website previews for selected")
    def generate_previews(self, request, queryset):
        from .tasks import generate_preview_for_business
        count = 0
        for biz in queryset:
            generate_preview_for_business.delay(biz.pk)
            count += 1
        self.message_user(request, f"Triggered preview generation for {count} businesses.", messages.SUCCESS)

    @admin.action(description="Backfill previews for ALL outdated businesses missing one")
    def backfill_previews(self, request, queryset):
        from .tasks import generate_missing_previews
        generate_missing_previews.delay()
        self.message_user(request, "Triggered preview backfill for outdated businesses without a preview.", messages.SUCCESS)

    @admin.action(description="Delete businesses without websites")
    def delete_no_website(self, request, queryset):
        deleted_count, _ = Business.objects.filter(has_website=False).delete()
        self.message_user(request, f"Successfully deleted {deleted_count} businesses without websites.", messages.SUCCESS)

    @admin.action(description="Audit selected businesses (PageSpeed + Scoring)")
    def audit_selected(self, request, queryset):
        from .tasks import audit_single_business
        count = 0
        for biz in queryset:
            if biz.website:
                audit_single_business.delay(biz.pk)
                count += 1
        self.message_user(request, f"Triggered audit for {count} businesses.", messages.SUCCESS)

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path("start-initial-scrape/", self.admin_site.admin_view(self.start_initial_scrape), name="start-initial-scrape"),
            path("test-single-scrape/", self.admin_site.admin_view(self.test_single_scrape), name="test-single-scrape"),
            path("trigger-audit-batch/", self.admin_site.admin_view(self.trigger_audit_batch), name="trigger-audit-batch"),
            path("<path:object_id>/audit-single/", self.admin_site.admin_view(self.audit_single_view), name="audit-single"),
        ]
        return custom_urls + urls

    def start_initial_scrape(self, request):
        scrape_all_businesses.delay()
        self.message_user(request, "Initial business scraping task has been triggered.", messages.SUCCESS)
        return redirect("admin:leads_business_changelist")

    def trigger_audit_batch(self, request):
        audit_website_batch.delay()
        self.message_user(request, "Website audit batch task has been triggered.", messages.SUCCESS)
        return redirect("admin:leads_business_changelist")

    def audit_single_view(self, request, object_id):
        from .tasks import audit_single_business
        audit_single_business.delay(object_id)
        self.message_user(request, "Single business audit task triggered.", messages.SUCCESS)
        return redirect("admin:leads_business_change", object_id)

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

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path("process-queue/", self.admin_site.admin_view(self.process_queue_view), name="process-queue"),
        ]
        return custom_urls + urls

    def process_queue_view(self, request):
        from .tasks import process_outreach_queue
        process_outreach_queue.delay()
        self.message_user(request, "Outreach queue processing task has been triggered.", messages.SUCCESS)
        return redirect("admin:leads_outreachqueue_changelist")


@admin.register(WebsitePreview)
class WebsitePreviewAdmin(admin.ModelAdmin):
    list_display = (
        "business_name",
        "template_key",
        "town",
        "preview_link",
        "color_swatch",
        "color_source",
        "is_claimed",
        "view_count",
        "expires_at",
    )
    list_filter = ("template_key", "is_claimed", "color_source")
    search_fields = ("business_name", "slug", "town", "business__name")
    readonly_fields = (
        "created_at", "updated_at", "view_count", "preview_link",
        "color_swatch", "rendered_html",
    )
    autocomplete_fields = ("business",)
    ordering = ("-created_at",)

    @admin.display(description="URL")
    def preview_link(self, obj):
        return format_html('<a href="{}" target="_blank">{}</a>', obj.public_url, obj.slug)

    @admin.display(description="Colours")
    def color_swatch(self, obj):
        return format_html(
            '<span style="display:inline-block;width:16px;height:16px;border-radius:3px;'
            'background:{};border:1px solid #ccc;vertical-align:middle"></span> '
            '<span style="display:inline-block;width:16px;height:16px;border-radius:3px;'
            'background:{};border:1px solid #ccc;vertical-align:middle"></span>',
            obj.color_primary, obj.color_accent,
        )
