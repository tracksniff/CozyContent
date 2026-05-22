import logging
import json
import os
from django.conf import settings
from .models import ClientApplication, User, Website
from .services.claude_service import generate_website_code
from .services.github_service import create_and_push_repo
from .services.vercel_service import deploy_to_vercel
from .utils import (
    send_review_request_email, 
    send_progress_update_email, 
    send_github_transfer_email, 
    send_admin_new_site_notification,
    send_dns_setup_reminder_email
)

logger = logging.getLogger(__name__)

def process_application_task(application_id, user_id):
    """
    Background task to generate code via Claude and push to GitHub.
    """
    try:
        application = ClientApplication.objects.get(id=application_id)
        user = User.objects.get(id=user_id)
        
        # Set status to processing and progress to 10%
        application.status = 'processing'
        application.progress = 10
        application.save()
        send_progress_update_email(user.email, application.company_name, 10)

        # 1. Prepare data for Claude
        image_assets = []

        # Company logo first so it's used as the primary brand image
        if application.company_logo:
            image_assets.append(f"{settings.BACKEND_URL}{application.company_logo.url}")

        for img in application.images.all():
            image_assets.append(f"{settings.BACKEND_URL}{img.image.url}")

        # General attachments → images only; categorised ones handled separately
        for attachment in application.attachments.filter(category='general'):
            if any(attachment.filename.lower().endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.svg', '.webp']):
                image_assets.append(f"{settings.BACKEND_URL}{attachment.file.url}")

        # Normalise branding_colors — always a dict
        branding_colors = application.branding_colors
        if isinstance(branding_colors, str):
            try:
                branding_colors = json.loads(branding_colors)
            except Exception:
                branding_colors = {}

        testimonials = application.testimonials
        if isinstance(testimonials, str):
            try:
                testimonials = json.loads(testimonials)
            except Exception:
                testimonials = []

        # Resolve trust badge links (stored as JSON string)
        trust_badge_links = []
        if application.trust_badge_links:
            try:
                trust_badge_links = json.loads(application.trust_badge_links)
            except Exception:
                pass

        # Resolve testimonial links (stored as JSON string)
        testimonial_links = []
        if application.testimonial_links:
            try:
                testimonial_links = json.loads(application.testimonial_links)
            except Exception:
                pass

        # Build enriched trust_badges context for Claude
        trust_badges_text = application.trust_badges or 'Fully insured, certified professionals'
        if trust_badge_links:
            trust_badges_text += ' | Accreditation pages: ' + ', '.join(trust_badge_links)

        app_data = {
            'company_name': application.company_name,
            'phone_number': application.phone_number or '',
            'industry': application.industry,
            'tagline': application.tagline or '',
            'website_url': application.website_url or '',
            'city_location': application.city_location,
            'services_list': application.services_list,
            'years_experience': application.years_experience or '10+',
            'trust_badges': trust_badges_text,
            'service_areas': application.service_areas or application.city_location,
            'testimonials': testimonials,
            'testimonial_links': testimonial_links,
            'branding_colors': branding_colors,
            'uploaded_images': image_assets,
        }

        # Update progress to 20%
        application.progress = 20
        application.save()

        # 2. Generate code via Claude
        logger.info(f"Generating website code for {application.company_name}...")
        project_dir = generate_website_code(app_data)
        
        if not project_dir:
            logger.error(f"Failed to generate code for {application.company_name}")
            application.status = 'failed'
            application.save()
            return False

        # Update progress to 60%
        application.progress = 60
        application.save()
        send_progress_update_email(user.email, application.company_name, 60)

        # 3. Create repo and push to GitHub
        logger.info(f"Creating GitHub repo and pushing code for {application.company_name}...")
        repo_url = None
        try:
            repo_url = create_and_push_repo(application.company_name, project_dir)
        except Exception as push_error:
            logger.error(f"GitHub push failed: {str(push_error)}")

        if repo_url:
            # Update progress to 80%
            application.progress = 80
            application.save()

            # Trigger Vercel Deployment (Optional Preview)
            preview_url = None
            try:
                github_org = os.getenv("GITHUB_ORG_NAME")
                repo_name = application.company_name.lower().replace(" ", "-").replace(".", "")
                preview_url = deploy_to_vercel(repo_name, github_org, application.company_name)
            except Exception as v_error:
                logger.error(f"Vercel deployment failed: {str(v_error)}")

            # 4. Create Website record for the user
            Website.objects.create(
                name=application.company_name,
                url=preview_url or repo_url,
                owner=user,
                hosting_type="PLATFORM",
                plan_type=application.plan_type,
            )
            
            # Notify Admin Crisp about the new site and test repo
            send_admin_new_site_notification(repo_url, application.company_name, application.website_url)

            # For one-time buyers, send the transfer request email
            if application.plan_type == 'one_time':
                send_github_transfer_email(user.email, application.company_name)
            else:
                # For monthly sites, tell them to configure DNS
                send_dns_setup_reminder_email(user.email, application.company_name)
                # Send notification to user that site is ready for review (80%)
                send_progress_update_email(user.email, application.company_name, 80)

            logger.info(f"Site built to 80% for {application.company_name}. Awaiting admin deployment/review.")
            return True
        else:
            # SAVE BACKUP IF GITHUB FAILS
            backup_dir = os.path.join(settings.MEDIA_ROOT, 'website_backups')
            os.makedirs(backup_dir, exist_ok=True)
            
            backup_filename = f"app_{application.id}_{application.company_name.lower().replace(' ', '_')}.json"
            backup_path = os.path.join(backup_dir, backup_filename)
            
            with open(backup_path, 'w') as f:
                json.dump({"project_dir": project_dir}, f)
            
            logger.error(f"Failed to push code to GitHub for {application.company_name}. Path saved to {backup_path}")
            application.status = 'failed'
            application.save()
            return False

    except Exception as e:
        logger.error(f"Unexpected error in process_application_task: {str(e)}")
        try:
            application = ClientApplication.objects.get(id=application_id)
            application.status = 'failed'
            application.save()
        except:
            pass
        return False
