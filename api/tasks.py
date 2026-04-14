import logging
from .models import ClientApplication, User, Website
from .services.gemini_service import generate_website_code
from .services.github_service import create_and_push_repo

logger = logging.getLogger(__name__)

def process_application_task(application_id, user_id):
    """
    Background task to generate code via Gemini and push to GitHub.
    """
    try:
        application = ClientApplication.objects.get(id=application_id)
        user = User.objects.get(id=user_id)
        
        # Set status to processing
        application.status = 'processing'
        application.save()

        # 1. Prepare data for Gemini
        app_data = {
            'company_name': application.company_name,
            'industry': application.industry,
            'website_url': application.website_url,
            'city_location': application.city_location,
            'services_list': application.services_list,
            'testimonials': application.testimonials,
            'branding_colors': application.branding_colors,
        }

        # 2. Generate code via Gemini
        logger.info(f"Generating website code for {application.company_name}...")
        code_files = generate_website_code(app_data)
        
        if not code_files:
            logger.error(f"Failed to generate code for {application.company_name}")
            application.status = 'failed'
            application.save()
            return False

        # 3. Create repo and push to GitHub
        logger.info(f"Creating GitHub repo and pushing code for {application.company_name}...")
        repo_url = create_and_push_repo(application.company_name, code_files)

        if repo_url:
            # 4. Create Website record for the user
            Website.objects.create(
                name=application.company_name,
                url=repo_url,
                owner=user,
                hosting_type='PLATFORM'
            )
            # Set status to completed
            application.status = 'completed'
            application.save()
            logger.info(f"Successfully processed application {application.id} for user {user.email}")
            return True
        else:
            logger.error(f"Failed to push code to GitHub for {application.company_name}")
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
