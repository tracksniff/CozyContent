from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_clientapplication_is_reviewed_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='attachment',
            name='category',
            field=models.CharField(
                choices=[
                    ('general', 'General'),
                    ('certification', 'Certification / Trust Badge'),
                    ('testimonial', 'Testimonial Evidence'),
                ],
                default='general',
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name='clientapplication',
            name='trust_badge_links',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='clientapplication',
            name='testimonial_links',
            field=models.TextField(blank=True, null=True),
        ),
    ]
