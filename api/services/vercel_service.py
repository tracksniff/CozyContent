import requests
import os
import logging

logger = logging.getLogger(__name__)

def deploy_to_vercel(repo_name, github_org, company_name):
    """
    Automate Vercel project creation and deployment via Vercel API.
    Requires: VERCEL_TOKEN, VERCEL_TEAM_ID (optional)
    """
    token = os.getenv("VERCEL_TOKEN")
    team_id = os.getenv("VERCEL_TEAM_ID") # Use if deploying under a team
    
    if not token:
        logger.error("VERCEL_TOKEN not found in environment")
        return None

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # 1. Create a new project linked to GitHub
    project_url = "https://api.vercel.com/v9/projects"
    if team_id:
        project_url += f"?teamId={team_id}"

    payload = {
        "name": repo_name,
        "framework": "vite",
        "gitRepository": {
            "type": "github",
            "repo": f"{github_org}/{repo_name}"
        },
        "installCommand": "npm install",
        "buildCommand": "npm run build",
        "outputDirectory": "dist"
    }

    try:
        response = requests.post(project_url, headers=headers, json=payload)
        if response.status_code in [200, 201]:
            project_data = response.json()
            project_id = project_data.get("id")
            logger.info(f"Vercel project created: {repo_name}")
            
            # 2. Trigger a deployment
            deploy_url = "https://api.vercel.com/v13/deployments"
            if team_id:
                deploy_url += f"?teamId={team_id}"
                
            deploy_payload = {
                "name": repo_name,
                "project": project_id,
                "gitSource": {
                    "type": "github",
                    "repoId": str(project_data.get("link", {}).get("repoId", "")),
                    "ref": "main"
                }
            }
            
            deploy_response = requests.post(deploy_url, headers=headers, json=deploy_payload)
            if deploy_response.status_code in [200, 201]:
                deploy_data = deploy_response.json()
                logger.info(f"Vercel deployment triggered for {repo_name}")
                return f"https://{repo_name}.vercel.app"
            else:
                logger.error(f"Failed to trigger Vercel deployment: {deploy_response.text}")
                # Even if deployment fails to trigger, the project is created and linked
                return f"https://{repo_name}.vercel.app"
                
        elif response.status_code == 409:
            # Project already exists
            logger.info(f"Vercel project {repo_name} already exists.")
            return f"https://{repo_name}.vercel.app"
        else:
            logger.error(f"Vercel API error: {response.status_code} - {response.text}")
            return None

    except Exception as e:
        logger.error(f"Error deploying to Vercel: {str(e)}")
        return None
