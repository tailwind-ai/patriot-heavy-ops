# Analyze Repository

Analyze the repository to detect project characteristics and create timestamped analysis report.

## What This Command Does

1. Scans project files for deployment method, schema, and CI/CD configuration
2. Detects versions of all technologies
3. Creates timestamped analysis report in `repo-analysis/`
4. Updates `config/tech-stack.md` with latest detected configuration

## Usage

Run this command when:
- Initial setup of roadmapper
- After major infrastructure changes
- Before starting a new release
- When config files are out of sync

## Process

### 1. Run Detection Utilities

Execute the detection scripts:
```javascript
const { detectDeployment } = require('../scripts/utils/detect-deployment');
const { detectSchema } = require('../scripts/utils/detect-schema');
const { detectCICD } = require('../scripts/utils/detect-cicd');

const deployment = detectDeployment(process.cwd());
const schema = await detectSchema(process.cwd());
const cicd = detectCICD(process.cwd());
```

### 2. Detect Versions

For each detected technology, extract version information:

**From package.json:**
- Node.js version (from `engines.node`)
- npm/yarn version
- All dependencies with versions
- All devDependencies with versions

**From lock files:**
- Exact installed versions from package-lock.json or yarn.lock

**From config files:**
- Database version (from docker-compose.yml, Dockerfile, or connection strings)
- Runtime versions (Node, Python, etc.)

**From CI/CD:**
- Action versions from .github/workflows/*.yml
- Docker image versions

### 3. Display Detected Configuration

Show detected configuration in a clear format:
```
Detected Configuration:

Deployment:
  Method: github-actions (confidence: 0.95)
  Platform: GitHub Actions
  Evidence: .github/workflows/deploy.yml

Database:
  ORM: Prisma v5.8.0
  Database: PostgreSQL v16
  Models: 12 (User, Post, Comment, ...)
  Evidence: prisma/schema.prisma

CI/CD:
  Platform: GitHub Actions
  Workflows: 3 (tests.yml, lint.yml, deploy.yml)
  Test Frameworks: Jest v29.7.0, Playwright v1.40.0
  Linters: ESLint v8.56.0, Prettier v3.1.1

Runtime:
  Node.js: v20.10.0
  Package Manager: npm v10.2.3

Key Dependencies:
  - next: v14.0.4
  - react: v18.2.0
  - typescript: v5.3.3
```

### 4. Update Config Files

Automatically update the following files:

**`config/tech-stack.md`:**
```markdown
# Technology Stack

> **Last Updated:** YYYY-MM-DD HH:MM:SS  
> **Analysis Report:** [repo-analysis/YYYY-MM-DD-HHMMSS.md](../repo-analysis/YYYY-MM-DD-HHMMSS.md)

## Runtime

- **Node.js:** v{{node.version}}
- **Package Manager:** {{packageManager}} v{{packageManager.version}}

## Framework & Libraries

{{#each dependencies}}
- **{{name}}:** v{{version}}
{{/each}}

## Database

- **ORM:** {{schema.orm}} v{{schema.version}}
- **Database:** {{schema.database}} v{{schema.dbVersion}}
- **Models:** {{schema.modelCount}}

## Deployment

- **Method:** {{deployment.method}}
- **Platform:** {{deployment.platform}}
- **Configuration:** {{deployment.configFile}}

## CI/CD

- **Platform:** {{cicd.platform}}
- **Workflows:** {{cicd.workflows.length}} workflows
  {{#each cicd.workflows}}
  - {{name}} ({{file}})
  {{/each}}

## Testing

{{#each testFrameworks}}
- **{{name}}:** v{{version}}
{{/each}}

## Code Quality

{{#each linters}}
- **{{name}}:** v{{version}}
{{/each}}

## Development Tools

{{#each devDependencies}}
- **{{name}}:** v{{version}}
{{/each}}
```

**`config/schema/schema.prisma`** (if Prisma detected):
Copy from `prisma/schema.prisma` to `config/schema/schema.prisma`

**`config/schema/CHANGELOG.md`** (if schema changed):
Add entry documenting the schema change

### 5. Save Analysis Report

Create timestamped file in `repo-analysis/` folder:

**Filename:** `YYYY-MM-DD-HHMMSS.md` (e.g., `2025-10-07-143000.md`)

**Content:**
```markdown
# Repository Analysis - YYYY-MM-DD HH:MM:SS

## Summary

- **Repository:** [Repo URL from config/repo-url.md]
- **Analysis Duration:** X.Xs
- **Technologies Detected:** X
- **Confidence:** High/Medium/Low

## Runtime Environment

### Node.js
- **Version:** v{{node.version}}
- **Source:** package.json engines.node or .nvmrc
- **Package Manager:** {{packageManager}} v{{version}}

## Dependencies ({{dependencies.length}})

### Production Dependencies
{{#each dependencies}}
- **{{name}}:** v{{version}}
  - Purpose: {{purpose}}
  - Last Updated: {{lastUpdated}}
{{/each}}

### Development Dependencies ({{devDependencies.length}})
{{#each devDependencies}}
- **{{name}}:** v{{version}}
{{/each}}

## Database & Schema

- **ORM:** {{schema.orm}} v{{schema.version}}
- **Database:** {{schema.database}} v{{schema.dbVersion}}
- **Connection:** {{schema.connectionString}}
- **Models:** {{schema.modelCount}} ({{schema.models.join(', ')}})
- **Schema File:** {{schema.file}}

## Deployment

- **Method:** {{deployment.method}}
- **Platform:** {{deployment.platform}}
- **Configuration:** {{deployment.configFile}}
- **Environment:** {{deployment.environment}}
- **Confidence:** {{deployment.confidence}}

## CI/CD

- **Platform:** {{cicd.platform}}
- **Workflows:** {{cicd.workflows.length}}
  {{#each cicd.workflows}}
  - **{{name}}** ({{file}})
    - Triggers: {{triggers.join(', ')}}
    - Steps: {{steps.length}}
    - Actions Used: {{actions.join(', ')}}
  {{/each}}

## Testing

{{#each testFrameworks}}
- **{{name}}:** v{{version}}
  - Config: {{configFile}}
  - Coverage: {{coverage}}%
{{/each}}

## Code Quality

{{#each linters}}
- **{{name}}:** v{{version}}
  - Config: {{configFile}}
  - Rules: {{rulesCount}}
{{/each}}

## Files Analyzed

- package.json
- package-lock.json / yarn.lock
- prisma/schema.prisma
- .github/workflows/*.yml
- docker-compose.yml
- Dockerfile
- [Other relevant files]

## Changes Applied

- ✅ Updated config/tech-stack.md
- ✅ Created this analysis report
- [Other changes]

## Recommendations

- [Any version upgrades needed]
- [Security vulnerabilities found]
- [Performance improvements]

## Notes

- [Any relevant observations]
- [Warnings or errors during detection]
```

### 6. Confirm Completion

Display: 
```
✅ Analysis complete!

📊 Report: repo-analysis/YYYY-MM-DD-HHMMSS.md
📝 Tech Stack: config/tech-stack.md

Detected X technologies with Y versions
```

## Error Handling

- If detection utilities fail, show error and continue with partial results
- If config files don't exist, create them with detected values
- If version detection fails for a package, mark as "version unknown"
- If repository URL not configured, prompt to update config/repo-url.md

## Notes

- This command automatically updates files (no approval needed)
- Creates timestamped analysis report for historical tracking
- Detects versions from package.json, lock files, and config files
- Can be run multiple times safely - each run creates new timestamped report
- Use `git diff` to review changes before committing
