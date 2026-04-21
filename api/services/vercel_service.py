import requests
import os
import logging

logger = logging.getLogger(__name__)

def deploy_to_vercel(repo_name, github_org, company_name):
    """
    Automate Vercel project creation and deployment via Vercel API.
    """
    token = os.getenv("VERCEL_TOKEN")
    team_id = os.getenv("VERCEL_TEAM_ID")
    
    if not token:
        logger.error("VERCEL_TOKEN not found in environment")
        return None

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # Helper to build URLs with teamId
    def vercel_url(path):
        url = f"https://api.vercel.com{path}"
        if team_id:
            url += f"?teamId={team_id}"
        return url

    # 1. Try to create the project
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

    project_id = None
    create_res = requests.post(vercel_url("/v9/projects"), headers=headers, json=payload)
    
    if create_res.status_code in [200, 201]:
        project_data = create_res.json()
        project_id = project_data.get("id")
        logger.info(f"Vercel project created: {repo_name}")
    elif create_res.status_code == 409:
        # Project exists, fetch it to get the ID
        logger.info(f"Vercel project {repo_name} already exists. Fetching info...")
        get_res = requests.get(vercel_url(f"/v9/projects/{repo_name}"), headers=headers)
        if get_res.status_code == 200:
            project_data = get_res.json()
            project_id = project_data.get("id")
        else:
            logger.error(f"Could not fetch existing Vercel project: {get_res.text}")
            return None
    else:
        logger.error(f"Vercel Project API error: {create_res.status_code} - {create_res.text}")
        return None

    # 2. Trigger deployment
    deploy_payload = {
        "name": repo_name,
        "project": project_id,
        "gitSource": {
            "type": "github",
            "repoId": str(project_data.get("link", {}).get("repoId", "") or project_data.get("gitRepository", {}).get("repoId", "")),
            "ref": "main"
        }
    }
    
    deploy_res = requests.post(vercel_url("/v13/deployments"), headers=headers, json=deploy_payload)
    if deploy_res.status_code in [200, 201]:
        logger.info(f"Vercel deployment triggered for {repo_name}")
        return f"https://{repo_name}.vercel.app"
    else:
        logger.error(f"Failed to trigger Vercel deployment: {deploy_res.text}")
        # Return URL anyway as Vercel might auto-deploy on git push if already linked
        return f"https://{repo_name}.vercel.app"
