from github import Github
import os
import logging
import subprocess
import shutil

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

def create_and_push_repo(company_name, project_dir):
    """
    Create a new repository under the GitHub organization and push the generated project directory.
    """
    token = os.getenv("GITHUB_TOKEN")
    org_name = os.getenv("GITHUB_ORG_NAME")

    if not all([token, org_name]):
        logger.error("GITHUB_TOKEN or GITHUB_ORG_NAME not found")
        return None

    if not os.path.isdir(project_dir):
        logger.error(f"Project directory not found: {project_dir}")
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
                logger.error(f"GitHub API error creating repo: {str(e)}")
                raise e

        # Push files using Git CLI with provided credentials
        try:
            # Initialize git in project_dir
            subprocess.run(["git", "init"], cwd=project_dir, check=True, capture_output=True)
            subprocess.run(["git", "config", "user.email", "therealkabzz@gmail.com"], cwd=project_dir, check=True)
            subprocess.run(["git", "config", "user.name", "tracksniff"], cwd=project_dir, check=True)
            
            subprocess.run(["git", "add", "."], cwd=project_dir, check=True, capture_output=True)
            subprocess.run(["git", "commit", "-m", "Initial commit from Cosy Content"], cwd=project_dir, check=True, capture_output=True)
            subprocess.run(["git", "branch", "-M", "main"], cwd=project_dir, check=True, capture_output=True)
            
            # Use the token from ENV for authentication
            remote_url = f"https://x-access-token:{token}@github.com/{org_name}/{repo_name}.git"
            
            subprocess.run(["git", "remote", "add", "origin", remote_url], cwd=project_dir, check=True, capture_output=True)
            
            # Push to main branch
            subprocess.run(["git", "push", "-u", "origin", "main", "--force"], cwd=project_dir, check=True, capture_output=True)
            
            logger.info(f"Project pushed to GitHub: {repo.html_url}")
            return repo.html_url

        except subprocess.CalledProcessError as git_err:
            stderr = git_err.stderr.decode() if git_err.stderr else "No stderr"
            logger.error(f"Git push failed: {stderr}")
            return None
        
    except Exception as e:
        logger.error(f"Error creating/pushing to GitHub: {str(e)}")
        return None
