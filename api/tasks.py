import logging
from .models import ClientApplication, User, Website
from .services.claude_service import generate_website_code
from .services.github_service import create_and_push_repo
from .utils import send_review_request_email, send_progress_update_email

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
        app_data = {
            'company_name': application.company_name,
            'industry': application.industry,
            'website_url': application.website_url,
            'city_location': application.city_location,
            'services_list': application.services_list,
            'testimonials': application.testimonials,
            'branding_colors': application.branding_colors,
        }

        # Update progress to 20%
        application.progress = 20
        application.save()

        # 2. Generate code via Claude
        logger.info(f"Generating website code for {application.company_name}...")
        code_files = generate_website_code(app_data)
        
        if not code_files:
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
            repo_url = create_and_push_repo(application.company_name, code_files)
        except Exception as push_error:
            logger.error(f"GitHub push failed: {str(push_error)}")
        if repo_url:
            # Update progress to 80%
            application.progress = 80
            application.save()

            # 4. Create Website record for the user (only for monthly, or wait until complete)
            Website.objects.create(
                name=application.company_name,
                url=repo_url,
                owner=user,
                hosting_type="PLATFORM",
            )
            
            # Send notification to user that site is ready for review (80%)
            send_progress_update_email(user.email, application.company_name, 80)
            
            # For one-time buyers, send the transfer request email
            if application.plan_type == 'one_time':
                from .utils import send_github_transfer_email
                send_github_transfer_email(user.email, application.company_name)

            logger.info(f"Site built to 80% for {application.company_name}. Awaiting admin deployment/review.")
            return True

            # SAVE BACKUP IF GITHUB FAILS
            import json
            import os
            from django.conf import settings
            
            backup_dir = os.path.join(settings.MEDIA_ROOT, 'website_backups')
            os.makedirs(backup_dir, exist_ok=True)
            
            backup_filename = f"app_{application.id}_{application.company_name.lower().replace(' ', '_')}.json"
            backup_path = os.path.join(backup_dir, backup_filename)
            
            with open(backup_path, 'w') as f:
                json.dump(code_files, f)
            
            logger.error(f"Failed to push code to GitHub for {application.company_name}. Code saved to {backup_path}")
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
