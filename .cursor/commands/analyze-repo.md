# Analyze Repository

Analyze the repository to detect project characteristics and optionally update configuration files.

## What This Command Does

1. Scans project files for deployment method, schema, and CI/CD configuration
2. Shows detected changes compared to current config
3. Prompts: "Would you like to update config with these changes?"
4. If approved, updates `config/tech-stack.md`, `config/schema/`, etc.

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

### 2. Compare with Current Config

Read existing config files:
- `config/tech-stack.md`
- `config/schema/schema.prisma` (if exists)
- `config/repo-url.json` (if standalone mode)

Compare detected values with current config and identify differences.

### 3. Show Diff

Display changes in a clear format:
```
Detected Changes:

Deployment:
  Current: manual
  Detected: github-actions (confidence: 0.95)
  Evidence: .github/workflows/deploy.yml

Schema:
  Current: none
  Detected: prisma (confidence: 0.95)
  Evidence: prisma/schema.prisma
  Models: 12 (User, Post, Comment, ...)

CI/CD:
  Current: none
  Detected: github-actions (confidence: 0.95)
  Workflows: 3 (tests.yml, lint.yml, deploy.yml)
  Test Framework: Jest, Playwright
  Linters: ESLint, Prettier
```

### 4. Prompt for Approval

Ask: **"Would you like to update config with these changes? (yes/no)"**

### 5. Update Config Files (if approved)

Update the following files:

**`config/tech-stack.md`:**
```markdown
# Technology Stack

## Deployment
- **Method**: {{deployment.method}}
- **Platform**: {{deployment.details.platform}}
- **Type**: {{deployment.details.type}}

## Database
- **ORM**: {{schema.details.orm}}
- **Type**: {{schema.type}}
- **Models**: {{schema.details.models}}

## CI/CD
- **Platform**: {{cicd.details.platform}}
- **Workflows**: {{cicd.details.workflows}}
- **Test Frameworks**: {{cicd.details.testFrameworks.join(', ')}}
- **Linters**: {{cicd.details.linters.join(', ')}}
```

**`config/schema/schema.prisma`** (if Prisma detected):
Copy from `prisma/schema.prisma` to `config/schema/schema.prisma`

**`config/schema/CHANGELOG.md`** (if schema changed):
Add entry documenting the schema change

### 6. Save Analysis Report

Create timestamped file in `repo-analysis/` folder:

**Filename:** `YYYY-MM-DD-HHMMSS.md` (e.g., `2025-10-07-143000.md`)

**Content:**
```markdown
# Repository Analysis - YYYY-MM-DD HH:MM:SS

## Detected Configuration

### Deployment
- **Method:** {{deployment.method}}
- **Platform:** {{deployment.details.platform}}
- **Confidence:** {{deployment.confidence}}

### Database
- **ORM:** {{schema.details.orm}}
- **Type:** {{schema.type}}
- **Models:** {{schema.details.models}}

### CI/CD
- **Platform:** {{cicd.details.platform}}
- **Workflows:** {{cicd.details.workflows.join(', ')}}
- **Test Frameworks:** {{cicd.details.testFrameworks.join(', ')}}
- **Linters:** {{cicd.details.linters.join(', ')}}

## Changes Applied

- Updated config/tech-stack.md
- [List other changes]

## Notes

- [Any relevant observations]
```

### 7. Confirm Completion

Display: **"✅ Config updated successfully. Review changes with `git diff config/`"**

## Error Handling

- If detection utilities fail, show error and continue with partial results
- If config files don't exist, create them with detected values
- If user declines update, show: "Config not updated. Run `/analyze-repo` again to retry."

## Notes

- This command is non-destructive until user approves
- Always show full diff before making changes
- Detection utilities use confidence scores - show these to user
- Can be run multiple times safely
