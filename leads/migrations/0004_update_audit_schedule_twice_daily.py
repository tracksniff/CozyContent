"""Update the website-audit task schedule to run twice a day.

Runs at 04:00 and 16:00 UTC every day.
"""

from django.db import migrations


def update_schedule(apps, schema_editor):
    CrontabSchedule = apps.get_model("django_celery_beat", "CrontabSchedule")
    PeriodicTask = apps.get_model("django_celery_beat", "PeriodicTask")

    # Update the crontab to run at 4am and 4pm
    schedule, _ = CrontabSchedule.objects.get_or_create(
        minute="0",
        hour="4,16",
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


def rollback_schedule(apps, schema_editor):
    CrontabSchedule = apps.get_model("django_celery_beat", "CrontabSchedule")
    PeriodicTask = apps.get_model("django_celery_beat", "PeriodicTask")

    # Revert to 4am only
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
        },
    )


class Migration(migrations.Migration):

    dependencies = [
        ("leads", "0003_seed_daily_audit_schedule"),
    ]

    operations = [
        migrations.RunPython(update_schedule, rollback_schedule),
    ]
