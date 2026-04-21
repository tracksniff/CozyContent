from github import Github
import os
import logging
import base64

logger = logging.getLogger(__name__)

def ensure_repo_public(repo_name):
    """
    Ensure a GitHub repository is set to public.
    """
    token = os.getenv("GITHUB_TOKEN")
    org_name = os.getenv("GITHUB_ORG_NAME")

    if not all([token, org_name]):
        return False

    try:
        g = Github(token)
        repo = g.get_organization(org_name).get_repo(repo_name)
        if repo.private:
            repo.edit(private=False)
            logger.info(f"GitHub repo {repo_name} ensured as public.")
        return True
    except Exception as e:
        logger.error(f"Error ensuring repo visibility: {str(e)}")
        return False

def create_and_push_repo(company_name, code_files):
    """
    Create a new repository under the GitHub organization and push generated code.
    """
    token = os.getenv("GITHUB_TOKEN")
    org_name = os.getenv("GITHUB_ORG_NAME")

    if not all([token, org_name]):
        logger.error("GITHUB_TOKEN or GITHUB_ORG_NAME not found")
        return None

    try:
        g = Github(token)
        org = g.get_organization(org_name)
        
        # Clean company name for repo name
        repo_name = company_name.lower().replace(" ", "-").replace(".", "")
        
        # Create the repository (Public)
        try:
            repo = org.create_repo(repo_name, private=False)
            logger.info(f"Public GitHub repo created: {repo_name}")
        except Exception as e:
            # Handle repo already existing
            if "name already exists on this account" in str(e):
                repo = org.get_repo(repo_name)
                # Ensure it's public even if it was previously private
                if repo.private:
                    repo.edit(private=False)
                    logger.info(f"Existing GitHub repo {repo_name} set to public.")
            else:
                raise e

        # Push files
        for file_path, content in code_files.items():
            # Check if file exists to update or create
            try:
                contents = repo.get_contents(file_path)
                repo.update_file(contents.path, f"Updating {file_path}", content, contents.sha)
            except:
                repo.create_file(file_path, f"Initial commit for {file_path}", content)
        
        return repo.html_url

    except Exception as e:
        logger.error(f"Error creating/pushing to GitHub: {str(e)}")
        return None
