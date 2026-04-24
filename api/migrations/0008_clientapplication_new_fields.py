from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_clientapplication_is_reviewed_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='clientapplication',
            name='phone_number',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='clientapplication',
            name='tagline',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='clientapplication',
            name='years_experience',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='clientapplication',
            name='trust_badges',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='clientapplication',
            name='service_areas',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='clientapplication',
            name='company_logo',
            field=models.ImageField(blank=True, null=True, upload_to='company_logos/'),
        ),
    ]
