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
repo_obj = g.get_repo(repo_name)  # Keep repo_obj as the PyGithub object

def classify_deliverable_type(deliverable):
    """
    Classify a deliverable as either 'Feature' or 'Task' based on its content.
    """
    deliverable_lower = deliverable.lower()
    
    # Keywords that typically indicate a Feature
    feature_keywords = [
        'add', 'implement', 'create', 'build', 'design', 'develop',
        'feature', 'functionality', 'user', 'interface', 'api',
        'endpoint', 'component', 'page', 'screen', 'integration'
    ]
    
    # Keywords that typically indicate a Task
    task_keywords = [
        'setup', 'configure', 'install', 'deploy', 'test', 'fix',
        'update', 'migrate', 'refactor', 'optimize', 'document',
        'schema', 'database', 'infrastructure', 'ci/cd', 'pipeline'
    ]
    
    # Count matches for each type
    feature_score = sum(1 for keyword in feature_keywords if keyword in deliverable_lower)
    task_score = sum(1 for keyword in task_keywords if keyword in deliverable_lower)
    
    # Classify based on highest score, defaulting to Task if tied
    if feature_score > task_score:
        return "Feature"
    else:
        return "Task"

# GraphQL query to get project ID and Type field ID
def get_project_info():
    query = """
    query($owner: String!, $number: Int!) {
        user(login: $owner) {
            projectV2(number: $number) {
                id
                title
                fields(first: 20) {
                    nodes {
                        ... on ProjectV2SingleSelectField {
                            id
                            name
                            options {
                                id
                                name
                            }
                        }
                    }
                }
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
        return None, None, {}

    if (result.get("data") and
        result["data"].get("user") and
        result["data"]["user"].get("projectV2")):
        project_info = result["data"]["user"]["projectV2"]
        project_id = project_info["id"]
        print(f"Found project: {project_info['title']} (ID: {project_id})")
        
        # Find the Type field
        type_field_id = None
        type_options = {}
        
        for field in project_info["fields"]["nodes"]:
            if field.get("name") == "Type":
                type_field_id = field["id"]
                # Map option names to IDs
                for option in field["options"]:
                    type_options[option["name"]] = option["id"]
                print(f"Found Type field (ID: {type_field_id}) with options: {type_options}")
                break
        
        return project_id, type_field_id, type_options

    print("Project not found as user project")
    return None, None, {}

# List all projects for debugging
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

# Get the issue's GraphQL node ID using a GraphQL query
def get_issue_node_id(owner, repo_name_only, number):
    query = """
    query($owner: String!, $repo: String!, $number: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $number) {
          id
        }
      }
    }
    """
    variables = {"owner": owner, "repo": repo_name_only, "number": number}
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
    if (result.get("data") and
        result["data"].get("repository") and
        result["data"]["repository"].get("issue")):
        return result["data"]["repository"]["issue"]["id"]
    print(f"Could not get issue node ID for {owner}/{repo_name_only}#{number}: {result}")
    return None

# Add issue to project using GraphQL mutation
def add_issue_to_project(issue_node_id, project_id):
    if not project_id:
        print("No project ID, skipping project addition")
        return None
    mutation = """
    mutation($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
        item {
          id
        }
      }
    }
    """
    variables = {"projectId": project_id, "contentId": issue_node_id}
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

# Update project item Type field
def update_project_item_type(project_id, item_id, type_field_id, type_option_id):
    if not all([project_id, item_id, type_field_id, type_option_id]):
        print("Missing required IDs for updating Type field")
        return None
        
    mutation = """
    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: ProjectV2FieldValue!) {
      updateProjectV2ItemFieldValue(
        input: {
          projectId: $projectId
          itemId: $itemId
          fieldId: $fieldId
          value: $value
        }
      ) {
        projectV2Item {
          id
        }
      }
    }
    """
    variables = {
        "projectId": project_id,
        "itemId": item_id,
        "fieldId": type_field_id,
        "value": {
            "singleSelectOptionId": type_option_id
        }
    }
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
    print(f"Update Type field response: {result}")
    if "errors" in result:
        print(f"Error updating Type field: {result['errors']}")
        return None
    return result

# Debug: List all projects first
print("=== Debugging: Listing all user projects ===")
all_projects = list_user_projects()

# Get project ID and Type field info
print(f"\n=== Looking for project number {PROJECT_NUMBER} and Type field ===")
project_id, type_field_id, type_options = get_project_info()

if not project_id:
    print("Could not find project. Exiting...")
    exit(1)

print(f"✅ Found project ID: {project_id}")
if type_field_id:
    print(f"✅ Found Type field ID: {type_field_id}")
    print(f"✅ Type options: {type_options}")
else:
    print("⚠️ Could not find Type field - will skip Type field updates")

# Create issues from workback_schedule deliverables
if "workback_schedule" in data:
    print(f"\n=== Creating issues from workback_schedule ===")
    owner, repo_name_only = repo_name.split("/")
    for schedule_item in data["workback_schedule"]:
        dates = schedule_item["dates"]

        for deliverable in schedule_item["deliverables"]:
            # Classify the deliverable type
            deliverable_type = classify_deliverable_type(deliverable)
            
            title = f"{dates}: {deliverable}"
            body = f"**Release:** {data['release']['name']}\n\n"
            body += f"**Description:** {deliverable}\n\n"
            body += f"**Due Date:** {dates}\n\n"
            body += f"**Release Description:** {data['release']['description']}"

            # Create the issue with type classification
            print(f"Creating issue: {title} [Type: {deliverable_type}]")
            issue = repo_obj.create_issue(
                title=title,
                body=body,
                labels=["auto-generated", "needs-review", "release-1", f"type:{deliverable_type.lower()}"]
            )

            print(f"✅ Issue created: {issue.html_url}")
            print(f"Issue number: {issue.number} | Type: {deliverable_type}")

            # Get issue node ID for ProjectV2
            issue_node_id = get_issue_node_id(owner, repo_name_only, issue.number)
            print(f"Issue node_id for ProjectV2: {issue_node_id}")

            # Add issue to project
            print(f"Adding issue {issue.number} to project...")
            add_result = add_issue_to_project(issue_node_id, project_id)

            if add_result and not add_result.get("errors"):
                print(f"✅ Issue {issue.number} added to project!")
                
                # Update the Type field if we have the necessary info
                if type_field_id and deliverable_type in type_options:
                    item_id = add_result["data"]["addProjectV2ItemById"]["item"]["id"]
                    type_option_id = type_options[deliverable_type]
                    
                    print(f"Setting Type field to '{deliverable_type}'...")
                    type_result = update_project_item_type(project_id, item_id, type_field_id, type_option_id)
                    
                    if type_result and not type_result.get("errors"):
                        print(f"✅ Type field updated to '{deliverable_type}'!")
                    else:
                        print(f"❌ Failed to update Type field")
                else:
                    print(f"⚠️ Skipping Type field update (missing field or option)")
            else:
                print(f"❌ Failed to add issue {issue.number} to project")

    print("\n🎉 All deliverables processed!")
else:
    print("No workback_schedule found in YAML data")
    print(f"Available keys: {list(data.keys())}")
