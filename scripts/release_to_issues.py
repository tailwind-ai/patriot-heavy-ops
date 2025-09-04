import yaml
import os
import requests
from github import Github

# Load GitHub token and repo info from environment
token = os.environ["GITHUB_TOKEN"]
repo_name = os.environ["GITHUB_REPOSITORY"]

# Your project details
PROJECT_NUMBER = 1  # From your URL: /users/samuelhenry/projects/1
PROJECT_OWNER = "samuelhenry"

# Load current-release.yml (FIXED: was release.yml)
with open("current-release.yml", "r") as f:
    data = yaml.safe_load(f)

# Connect to GitHub
g = Github(token)
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
    return response.json()["data"]["user"]["projectV2"]["id"]

# Add issue to project
def add_issue_to_project(issue_id, project_id):
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

# Get project ID
project_id = get_project_id()
print(f"Project ID: {project_id}")

# Create issues and add to project
for feature in data["release"]["features"]:
    title = feature["name"]
    body = feature["description"]
    body += f"\n\n**Complexity:** {feature.get('complexity', 'N/A')}\n**Suggested assignee:** {feature.get('assignee', 'N/A')}"
    
    # Create the issue
    issue = repo.create_issue(
        title=title,
        body=body,
        labels=["auto-generated", "needs-review"]
    )
    
    # Add issue to project
    add_issue_to_project(issue.node_id, project_id)
    
    print(f"Issue created and added to project: {issue.html_url}")

print("All features processed and added to project.")
