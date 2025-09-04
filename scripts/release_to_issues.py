import yaml
import os
from github import Github

# Load GitHub token and repo info from environment
token = os.environ["GITHUB_TOKEN"]
repo_name = os.environ["GITHUB_REPOSITORY"]

# Load release.yml
with open("release.yml", "r") as f:
    data = yaml.safe_load(f)

# Connect to GitHub
g = Github(token)
repo = g.get_repo(repo_name)

# Create one issue per feature
for feature in data["release"]["features"]:
    title = feature["name"]
    body = feature["description"]
    # Optionally, add more detail to the body
    body += f"\n\nComplexity: {feature.get('complexity', 'N/A')}\nSuggested assignee: {feature.get('assignee', 'N/A')}"
    # Create the issue (not assigned yet)
    issue = repo.create_issue(
        title=title,
        body=body,
        labels=["auto-generated", "needs review"]
    )
    print(f"Issue created: {issue.html_url}")

print("All features processed.")
