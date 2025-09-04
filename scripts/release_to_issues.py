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

# Load current-release.yml
with open("current-release.yml", "r") as f:
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

# GraphQL query to get project ID - try both user and organization
def get_project_id():
    # First try as user project
    query = """
    query($owner: String!, $number: Int!) {
        user(login: $owner) {
            projectV2(number: $number) {
                id
                title
            }
        }
    }
    """
    variables = {"owner": PROJECT_OWNER, "number": PROJECT_NUMBER}
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        "https://api.github.com/graphql",
        json={"query": query, "variables": variables},
        headers=headers
    )
    
    print(f"Response status: {response.status_code}")
    result = response.json()
    print(f"GraphQL Response: {result}")
    
    if "errors" in result:
        print(f"GraphQL Errors: {result['errors']}")
        return None
    
    if (result.get("data") and 
        result["data"].get("user") and 
        result["data"]["user"].get("projectV2")):
        project_info = result["data"]["user"]["projectV2"]
        print(f"Found project: {project_info['title']} (ID: {project_info['id']})")
        return project_info["id"]
    
    print("Project not found as user project")
    return None

# Alternative: Get all projects for debugging
def list_user_projects():
    query = """
    query($owner: String!) {
        user(login: $owner) {
            projectsV2(first: 10) {
                nodes {
                    id
                    number
                    title
                    url
                }
            }
        }
    }
    """
    variables = {"owner": PROJECT_OWNER}
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        "https://api.github.com/graphql",
        json={"query": query, "variables": variables},
        headers=headers
    )
    
    result = response.json()
    print(f"All user projects: {result}")
    
    if (result.get("data") and 
        result["data"].get("user") and 
        result["data"]["user"].get("projectsV2")):
        projects = result["data"]["user"]["projectsV2"]["nodes"]
        print("Available projects:")
        for project in projects:
            print(f"  - {project['title']} (Number: {project['number']}, ID: {project['id']})")
        return projects
    return []

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
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        "https://api.github.com/graphql",
        json={"query": mutation, "variables": variables},
        headers=headers
    )
    
    result = response.json()
    print(f"Add to project response: {result}")
    
    if "errors" in result:
        print(f"Error adding to project: {result['errors']}")
        return None
    
    return result

# Debug: List all projects first
print("=== Debugging: Listing all user projects ===")
all_projects = list_user_projects()

# Get project ID
print(f"\n=== Looking for project number {PROJECT_NUMBER} ===")
project_id = get_project_id()

if not project_id:
    print("Could not find project. Exiting...")
    exit(1)

print(f"✅ Found project ID: {project_id}")

# Create issues from workback_schedule deliverables
if "workback_schedule" in data:
    print(f"\n=== Creating issues from workback_schedule ===")
    
    for schedule_item in data["workback_schedule"]:
        dates = schedule_item["dates"]
        
        for deliverable in schedule_item["deliverables"]:
            title = f"{dates}: {deliverable}"
            body = f"**Release:** {data['release']['name']}\n\n"
            body += f"**Description:** {deliverable}\n\n"
            body += f"**Due Date:** {dates}\n\n"
            body += f"**Release Description:** {data['release']['description']}"
            
            # Create the issue
            print(f"Creating issue: {title}")
            issue = repo.create_issue(
                title=title,
                body=body,
                labels=["auto-generated", "needs-review", "release-1"]
            )
            
            print(f"✅ Issue created: {issue.html_url}")
            print(f"Issue node_id: {issue.node_id}")
            
            # Add issue to project
            print(f"Adding issue {issue.number} to project...")
            result = add_issue_to_project(issue.node_id, project_id)
            
            if result and not result.get("errors"):
                print(f"✅ Issue {issue.number} added to project!")
            else:
                print(f"❌ Failed to add issue {issue.number} to project")

    print("\n🎉 All deliverables processed!")
else:
    print("No workback_schedule found in YAML data")
    print(f"Available keys: {list(data.keys())}")
