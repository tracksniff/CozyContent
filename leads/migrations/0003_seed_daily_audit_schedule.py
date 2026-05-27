"""Seed the daily website-audit task into django-celery-beat.

Runs at 04:00 UTC every day. Editable from Django admin.
"""

from django.db import migrations


def create_schedule(apps, schema_editor):
    CrontabSchedule = apps.get_model("django_celery_beat", "CrontabSchedule")
    PeriodicTask = apps.get_model("django_celery_beat", "PeriodicTask")

    schedule, _ = CrontabSchedule.objects.get_or_create(
        minute="0",
        hour="4",
        day_of_month="*",
        month_of_year="*",
        day_of_week="*",
        timezone="UTC",
    )

    PeriodicTask.objects.update_or_create(
        name="Daily website audit batch",
        defaults={
            "crontab": schedule,
            "task": "leads.audit_website_batch",
            "enabled": True,
        },
    )


def remove_schedule(apps, schema_editor):
    PeriodicTask = apps.get_model("django_celery_beat", "PeriodicTask")
    PeriodicTask.objects.filter(name="Daily website audit batch").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("leads", "0002_seed_monthly_schedule"),
        ("django_celery_beat", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_schedule, remove_schedule),
    ]
