import yaml
import os
import requests
from github import Github
from github import Auth
import base64
import json

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
repo_obj = g.get_repo(repo_name)

def analyze_repository_context():
    """
    Analyze the repository to understand current architecture and tech stack
    """
    context = {
        'tech_stack': [],
        'frameworks': [],
        'databases': [],
        'authentication': [],
        'api_patterns': [],
        'file_structure': {},
        'existing_schemas': [],
        'deployment_config': []
    }
    
    try:
        print("🔍 Analyzing repository context...")
        
        # Analyze key configuration files
        config_files_to_check = [
            'package.json',
            'prisma/schema.prisma',
            'next.config.js',
            'next.config.mjs',
            'tsconfig.json',
            'tailwind.config.js',
            'docker-compose.yml',
            'Dockerfile',
            '.env.example',
            'README.md'
        ]
        
        for file_path in config_files_to_check:
            try:
                file_content = repo_obj.get_contents(file_path)
                content = base64.b64decode(file_content.content).decode('utf-8')
                analyze_file_for_context(file_path, content, context)
                print(f"  ✅ Analyzed {file_path}")
            except Exception as e:
                print(f"  ⚠️ Could not read {file_path}: {str(e)[:50]}...")
        
        # Analyze directory structure
        try:
            contents = repo_obj.get_contents("")
            for item in contents:
                if item.type == "dir":
                    context['file_structure'][item.name] = analyze_directory(item.name)
                    print(f"  📁 Found directory: {item.name}")
        except Exception as e:
            print(f"  ⚠️ Could not analyze directory structure: {e}")
        
        print(f"✅ Repository analysis complete")
        return context
        
    except Exception as e:
        print(f"❌ Error analyzing repository: {e}")
        return context

def analyze_file_for_context(file_path, content, context):
    """
    Extract tech stack and architecture info from specific files
    """
    file_path_lower = file_path.lower()
    content_lower = content.lower()
    
    # Package.json analysis
    if file_path == 'package.json':
        try:
            package_data = json.loads(content)
            dependencies = {**package_data.get('dependencies', {}), **package_data.get('devDependencies', {})}
            
            # Detect frameworks
            if 'next' in dependencies:
                context['frameworks'].append('Next.js')
            if 'react' in dependencies:
                context['frameworks'].append('React')
            if '@prisma/client' in dependencies:
                context['databases'].append('Prisma ORM')
            if 'typescript' in dependencies:
                context['tech_stack'].append('TypeScript')
            if 'tailwindcss' in dependencies:
                context['tech_stack'].append('Tailwind CSS')
            
            # Authentication libraries
            if 'next-auth' in dependencies or '@auth/core' in dependencies:
                context['authentication'].append('NextAuth.js')
            if 'clerk' in dependencies:
                context['authentication'].append('Clerk')
            if 'supabase' in dependencies:
                context['authentication'].append('Supabase Auth')
                
        except json.JSONDecodeError:
            pass
    
    # Prisma schema analysis
    elif 'prisma' in file_path and 'schema' in file_path:
        # Extract model names
        models = []
        for line in content.split('\n'):
            if line.strip().startswith('model '):
                model_name = line.split()[1]
                models.append(model_name)
        context['existing_schemas'] = models
        
        # Detect database provider
        if 'postgresql' in content_lower:
            context['databases'].append('PostgreSQL')
        elif 'mysql' in content_lower:
            context['databases'].append('MySQL')
        elif 'sqlite' in content_lower:
            context['databases'].append('SQLite')
    
    # Next.js config analysis
    elif 'next.config' in file_path:
        if 'experimental' in content_lower:
            context['frameworks'].append('Next.js (with experimental features)')
    
    # Environment variables analysis
    elif '.env' in file_path:
        if 'database_url' in content_lower:
            context['databases'].append('Database configured')
        if 'nextauth' in content_lower:
            context['authentication'].append('NextAuth.js configured')

def analyze_directory(dir_name):
    """
    Analyze directory structure to understand project organization
    """
    try:
        contents = repo_obj.get_contents(dir_name)
        structure = {
            'files': [],
            'subdirs': []
        }
        
        for item in contents:
            if item.type == "file":
                structure['files'].append(item.name)
            else:
                structure['subdirs'].append(item.name)
        
        return structure
    except:
        return {'files': [], 'subdirs': []}

def assess_task_with_context(deliverable, release_context, repo_context):
    """
    Analyze if Copilot can handle this task with full repository context
    """
    analysis = {
        'assignment': 'needs-clarification',
        'confidence': 0,
        'missing_details': [],
        'reasoning': '',
        'available_context': [],
        'tech_compatibility': True
    }
    
    deliverable_lower = deliverable.lower()
    
    # Check what context is available for this task
    if 'database' in deliverable_lower or 'schema' in deliverable_lower:
        if repo_context['existing_schemas']:
            analysis['available_context'].append(f"Existing models: {', '.join(repo_context['existing_schemas'])}")
        if 'Prisma ORM' in repo_context['databases']:
            analysis['available_context'].append("Prisma ORM already configured")
        else:
            analysis['missing_details'].append("database_orm_setup")
    
    if 'auth' in deliverable_lower:
        if repo_context['authentication']:
            analysis['available_context'].append(f"Auth system: {', '.join(repo_context['authentication'])}")
        else:
            analysis['missing_details'].append("authentication_method_selection")
    
    if 'api' in deliverable_lower:
        if 'Next.js' in repo_context['frameworks']:
            analysis['available_context'].append("Next.js API routes available")
        else:
            analysis['missing_details'].append("api_framework_setup")
    
    # Determine specific missing requirements
    required_details = analyze_required_details_with_context(deliverable, repo_context)
    analysis['missing_details'].extend(required_details)
    
    # Make assignment decision
    if len(analysis['missing_details']) == 0:
        if is_copilot_implementable_with_context(deliverable, repo_context):
            analysis['assignment'] = 'copilot'
            analysis['confidence'] = 85
            analysis['reasoning'] = "Task has sufficient context and is automatable"
        else:
            analysis['assignment'] = 'human'
            analysis['confidence'] = 90
            analysis['reasoning'] = "Task requires human design decisions"
    else:
        analysis['assignment'] = 'needs-clarification'
        analysis['confidence'] = 30
        analysis['reasoning'] = f"Missing {len(analysis['missing_details'])} critical details"
    
    return analysis

def analyze_required_details_with_context(deliverable, repo_context):
    """
    Determine what details are needed based on repository context
    """
    deliverable_lower = deliverable.lower()
    missing_details = []
    
    # Database tasks
    if 'database' in deliverable_lower or 'schema' in deliverable_lower:
        if not repo_context['existing_schemas']:
            missing_details.append("initial_data_model_design")
        if not repo_context['databases']:
            missing_details.append("database_provider_selection")
        if 'migration' in deliverable_lower and not any('Prisma' in db for db in repo_context['databases']):
            missing_details.append("migration_strategy")
    
    # Authentication tasks
    if 'auth' in deliverable_lower:
        if not repo_context['authentication']:
            missing_details.extend([
                "authentication_provider_choice",
                "user_role_definitions",
                "session_management_strategy"
            ])
    
    # API tasks
    if 'api' in deliverable_lower:
        if 'endpoint' in deliverable_lower:
            missing_details.extend([
                "api_endpoint_specifications",
                "request_response_schemas",
                "error_handling_patterns"
            ])
    
    return missing_details

def is_copilot_implementable_with_context(deliverable, repo_context):
    """
    Determine if Copilot can implement this given the available context
    """
    deliverable_lower = deliverable.lower()
    
    # High-level design tasks always need human input
    design_keywords = ['design', 'architect', 'plan', 'strategy', 'analyze']
    if any(keyword in deliverable_lower for keyword in design_keywords):
        return False
    
    # Implementation tasks with sufficient context can be automated
    implementation_keywords = ['implement', 'create', 'add', 'build', 'setup']
    has_implementation = any(keyword in deliverable_lower for keyword in implementation_keywords)
    
    # Check if we have the necessary tech stack
    if 'database' in deliverable_lower:
        return has_implementation and bool(repo_context['databases'])
    
    if 'auth' in deliverable_lower:
        return has_implementation and bool(repo_context['authentication'])
    
    if 'api' in deliverable_lower:
        return has_implementation and 'Next.js' in repo_context['frameworks']
    
    return has_implementation

# [Keep all the existing functions: classify_deliverable_type, get_project_info, etc.]
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

# [Include all your existing functions here: get_project_info, list_user_projects, etc.]
# ... (keeping them the same for now)

# MAIN EXECUTION with Repository Context
print("=== Analyzing Repository Context ===")
repo_context = analyze_repository_context()

print(f"\n📊 Repository Analysis Summary:")
print(f"  Tech Stack: {repo_context['tech_stack']}")
print(f"  Frameworks: {repo_context['frameworks']}")
print(f"  Databases: {repo_context['databases']}")
print(f"  Authentication: {repo_context['authentication']}")
print(f"  Existing Models: {repo_context['existing_schemas']}")

# [Rest of your existing main execution code...]
