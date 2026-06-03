"""Seed the monthly Outscraper scrape into django-celery-beat.

Runs at 03:00 UTC on the 1st of every month. Editable from Django admin
after first run.
"""

from django.db import migrations


def create_schedule(apps, schema_editor):
    CrontabSchedule = apps.get_model("django_celery_beat", "CrontabSchedule")
    PeriodicTask = apps.get_model("django_celery_beat", "PeriodicTask")

    schedule, _ = CrontabSchedule.objects.get_or_create(
        minute="0",
        hour="3",
        day_of_month="1",
        month_of_year="*",
        day_of_week="*",
        timezone="UTC",
    )

    PeriodicTask.objects.update_or_create(
        name="Monthly Outscraper business scrape",
        defaults={
            "crontab": schedule,
            "task": "leads.scrape_all_businesses",
            "enabled": True,
        },
    )


def remove_schedule(apps, schema_editor):
    PeriodicTask = apps.get_model("django_celery_beat", "PeriodicTask")
    PeriodicTask.objects.filter(name="Monthly Outscraper business scrape").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("leads", "0001_initial"),
        ("django_celery_beat", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_schedule, remove_schedule),
    ]
