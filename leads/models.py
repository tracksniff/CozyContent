from django.db import models


class Business(models.Model):
    CATEGORY_CHOICES = [
        ("plumbing", "Plumbing"),
        ("electricians", "Electricians"),
        ("roofing", "Roofing"),
        ("locksmiths", "Locksmiths"),
        ("cleaners", "Cleaners"),
        ("removal_companies", "Removal Companies"),
    ]

    AUDIT_PENDING = "pending"
    AUDIT_HTML_FAILED = "html_failed"
    AUDIT_SCORED = "scored"
    AUDIT_ERROR = "error"
    AUDIT_STATUS_CHOICES = [
        (AUDIT_PENDING, "Pending"),
        (AUDIT_HTML_FAILED, "HTML check failed"),
        (AUDIT_SCORED, "Scored"),
        (AUDIT_ERROR, "Error"),
    ]

    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    location = models.CharField(max_length=100)

    phone = models.CharField(max_length=50, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)

    website = models.URLField(max_length=500, null=True, blank=True)
    has_website = models.BooleanField(default=False)

    address = models.CharField(max_length=500, null=True, blank=True)

    rating = models.FloatField(null=True, blank=True)
    reviews = models.IntegerField(null=True, blank=True)

    # Google Place ID returned by Outscraper — primary dedup key when present.
    google_id = models.CharField(max_length=255, null=True, blank=True, unique=True)

    source = models.CharField(max_length=50, default="outscraper")

    # --- Website audit fields ---
    last_audited_at = models.DateTimeField(null=True, blank=True)
    audit_status = models.CharField(
        max_length=20, choices=AUDIT_STATUS_CHOICES, default=AUDIT_PENDING
    )
    html_check_passed = models.BooleanField(null=True, blank=True)
    html_status_code = models.IntegerField(null=True, blank=True)

    pagespeed_mobile_performance = models.IntegerField(null=True, blank=True)
    pagespeed_mobile_accessibility = models.IntegerField(null=True, blank=True)
    pagespeed_mobile_seo = models.IntegerField(null=True, blank=True)
    pagespeed_mobile_best_practices = models.IntegerField(null=True, blank=True)

    pagespeed_desktop_performance = models.IntegerField(null=True, blank=True)
    pagespeed_desktop_accessibility = models.IntegerField(null=True, blank=True)
    pagespeed_desktop_seo = models.IntegerField(null=True, blank=True)
    pagespeed_desktop_best_practices = models.IntegerField(null=True, blank=True)

    is_outdated = models.BooleanField(default=False)
    audit_notes = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Fallback dedup when google_id is missing.
        constraints = [
            models.UniqueConstraint(
                fields=["name", "phone", "location"],
                name="unique_business_name_phone_location",
            ),
        ]
        indexes = [
            models.Index(fields=["category", "location"]),
            models.Index(fields=["has_website"]),
            models.Index(fields=["last_audited_at"]),
            models.Index(fields=["is_outdated"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.category} / {self.location})"


class OutreachQueue(models.Model):
    STATUS_QUEUED = "queued"
    STATUS_SENDING = "sending"
    STATUS_SENT = "sent"
    STATUS_SKIPPED = "skipped"
    STATUS_FAILED = "failed"
    STATUS_CHOICES = [
        (STATUS_QUEUED, "Queued"),
        (STATUS_SENDING, "Sending"),
        (STATUS_SENT, "Sent"),
        (STATUS_SKIPPED, "Skipped"),
        (STATUS_FAILED, "Failed"),
    ]

    ACTIVE_STATUSES = (STATUS_QUEUED, STATUS_SENDING)

    business = models.ForeignKey(
        Business, on_delete=models.CASCADE, related_name="outreach_entries"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_QUEUED)
    reason = models.CharField(max_length=255, blank=True, default="")
    scheduled_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    attempts = models.IntegerField(default=0)
    last_error = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Only one active (queued/sending) entry per business at a time.
        constraints = [
            models.UniqueConstraint(
                fields=["business"],
                condition=models.Q(status__in=("queued", "sending")),
                name="unique_active_outreach_per_business",
            ),
        ]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["scheduled_at"]),
        ]
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.business.name} → {self.status}"
