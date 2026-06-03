from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Business",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                (
                    "category",
                    models.CharField(
                        choices=[
                            ("plumbing", "Plumbing"),
                            ("electricians", "Electricians"),
                            ("roofing", "Roofing"),
                            ("locksmiths", "Locksmiths"),
                            ("cleaners", "Cleaners"),
                            ("removal_companies", "Removal Companies"),
                        ],
                        max_length=100,
                    ),
                ),
                ("location", models.CharField(max_length=100)),
                ("phone", models.CharField(blank=True, max_length=50, null=True)),
                ("email", models.EmailField(blank=True, max_length=254, null=True)),
                ("website", models.URLField(blank=True, max_length=500, null=True)),
                ("has_website", models.BooleanField(default=False)),
                ("address", models.CharField(blank=True, max_length=500, null=True)),
                ("rating", models.FloatField(blank=True, null=True)),
                ("reviews", models.IntegerField(blank=True, null=True)),
                (
                    "google_id",
                    models.CharField(
                        blank=True, max_length=255, null=True, unique=True
                    ),
                ),
                ("source", models.CharField(default="outscraper", max_length=50)),
                ("last_audited_at", models.DateTimeField(blank=True, null=True)),
                (
                    "audit_status",
                    models.CharField(
                        choices=[
                            ("pending", "Pending"),
                            ("html_failed", "HTML check failed"),
                            ("scored", "Scored"),
                            ("error", "Error"),
                        ],
                        default="pending",
                        max_length=20,
                    ),
                ),
                ("html_check_passed", models.BooleanField(blank=True, null=True)),
                ("html_status_code", models.IntegerField(blank=True, null=True)),
                (
                    "pagespeed_mobile_performance",
                    models.IntegerField(blank=True, null=True),
                ),
                (
                    "pagespeed_mobile_accessibility",
                    models.IntegerField(blank=True, null=True),
                ),
                ("pagespeed_mobile_seo", models.IntegerField(blank=True, null=True)),
                (
                    "pagespeed_mobile_best_practices",
                    models.IntegerField(blank=True, null=True),
                ),
                (
                    "pagespeed_desktop_performance",
                    models.IntegerField(blank=True, null=True),
                ),
                (
                    "pagespeed_desktop_accessibility",
                    models.IntegerField(blank=True, null=True),
                ),
                ("pagespeed_desktop_seo", models.IntegerField(blank=True, null=True)),
                (
                    "pagespeed_desktop_best_practices",
                    models.IntegerField(blank=True, null=True),
                ),
                ("is_outdated", models.BooleanField(default=False)),
                ("audit_notes", models.TextField(blank=True, default="")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name="OutreachQueue",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("queued", "Queued"),
                            ("sending", "Sending"),
                            ("sent", "Sent"),
                            ("skipped", "Skipped"),
                            ("failed", "Failed"),
                        ],
                        default="queued",
                        max_length=20,
                    ),
                ),
                ("reason", models.CharField(blank=True, default="", max_length=255)),
                ("scheduled_at", models.DateTimeField(blank=True, null=True)),
                ("sent_at", models.DateTimeField(blank=True, null=True)),
                ("attempts", models.IntegerField(default=0)),
                ("last_error", models.TextField(blank=True, default="")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "business",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="outreach_entries",
                        to="leads.business",
                    ),
                ),
            ],
            options={
                "ordering": ("-created_at",),
            },
        ),
        migrations.AddIndex(
            model_name="business",
            index=models.Index(
                fields=["category", "location"], name="leads_busin_categor_f27473_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="business",
            index=models.Index(
                fields=["has_website"], name="leads_busin_has_web_5e5da3_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="business",
            index=models.Index(
                fields=["last_audited_at"], name="leads_busin_last_au_579b20_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="business",
            index=models.Index(
                fields=["is_outdated"], name="leads_busin_is_outd_07936a_idx"
            ),
        ),
        migrations.AddConstraint(
            model_name="business",
            constraint=models.UniqueConstraint(
                fields=("name", "phone", "location"),
                name="unique_business_name_phone_location",
            ),
        ),
        migrations.AddIndex(
            model_name="outreachqueue",
            index=models.Index(fields=["status"], name="leads_outre_status_467272_idx"),
        ),
        migrations.AddIndex(
            model_name="outreachqueue",
            index=models.Index(
                fields=["scheduled_at"], name="leads_outre_schedul_0c498f_idx"
            ),
        ),
        migrations.AddConstraint(
            model_name="outreachqueue",
            constraint=models.UniqueConstraint(
                condition=models.Q(("status__in", ("queued", "sending"))),
                fields=("business",),
                name="unique_active_outreach_per_business",
            ),
        ),
    ]
