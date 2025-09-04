import yaml
import os
import requests
from github import Github
from github import Auth

# Load GitHub token and repo info from environment
token = os.environ["GITHUB_TOKEN"]
repo_name = os.environ["GITHUB_REPOSITORY"]

# Your project details
PROJECT_NUMBER = 1  # From your URL: /users/samuelhenry/projects/1
PROJECT_OWNER = "samuelhenry"

# Load current-release.yml - handle multiple documents
with open("current-release.yml", "r") as f:
    # Check if there are multiple documents, if not just load normally
    content = f.read()
    f.seek(0)
    if '---' in content:
        documents = list(yaml.safe_load_all(f))
        data = documents[0]
    else:
        data = yaml.safe_load(f)

# Connect to GitHub with proper authentication
auth = Auth.Token(token)
g = Github(auth=auth)
repo = g.get_repo(repo_name)

# GraphQL query to get project ID
def get_project_id():
    query = """
    query($owner: String!, $number: Int!) {
        user(login: $owner) {
            projectV2(number: $number) {
                id
            }
        }
    }
    """
    variables = {"owner": PROJECT_OWNER, "number": PROJECT_NUMBER}
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        "https://api.github.com/graphql",
        json={"query": query, "variables": variables},
        headers=headers
    )
    
    result = response.json()
    print(f"GraphQL Response: {result}")  # Debug output
    
    if "errors" in result:
        print(f"GraphQL Errors: {result['errors']}")
        return None
    
    if result.get("data") and result["data"].get("user") and result["data"]["user"].get("projectV2"):
        return result["data"]["user"]["projectV2"]["id"]
    else:
        print("Project not found. Let's try without adding to project.")
        return None

# Add issue to project
def add_issue_to_project(issue_id, project_id):
    if not project_id:
        print("No project ID, skipping project addition")
        return None
        
    mutation = """
    mutation($projectId: ID!, $contentId: ID!) {
        addProjectV2ItemByContentId(input: {projectId: $projectId, contentId: $contentId}) {
            item {
                id
            }
        }
    }
    """
    variables = {"projectId": project_id, "contentId": issue_id}
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        "https://api.github.com/graphql",
        json={"query": mutation, "variables": variables},
        headers=headers
    )
    return response.json()

# Get project ID (but don't fail if it doesn't work)
project_id = get_project_id()
if project_id:
    print(f"Project ID: {project_id}")
else:
    print("Continuing without project integration...")

# Create issues from workback_schedule deliverables
if "workback_schedule" in data:
    for schedule_item in data["workback_schedule"]:
        dates = schedule_item["dates"]
        
        for deliverable in schedule_item["deliverables"]:
            title = f"{dates}: {deliverable}"
            body = f"**Release:** {data['release']['name']}\n\n"
            body += f"**Description:** {deliverable}\n\n"
            body += f"**Due Date:** {dates}\n\n"
            body += f"**Release Description:** {data['release']['description']}"
            
            # Create the issue
            issue = repo.create_issue(
                title=title,
                body=body,
                labels=["auto-generated", "needs-review", "release-1"]
            )
            
            # Add issue to project (if project_id exists)
            if project_id:
                add_issue_to_project(issue.node_id, project_id)
            
            print(f"Issue created: {issue.html_url}")

    print("All deliverables processed!")
else:
    print("No workback_schedule found in YAML data")
    print(f"Available keys: {list(data.keys())}")
