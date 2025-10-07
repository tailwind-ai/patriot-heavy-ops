# Roadmapper

**GitHub Repository**: https://github.com/Henry-Family/roadmapper

AI-optimized product, roadmap and release management workflow.  Best used with Cursor.

**Quick Links:**
- 🚀 [Configure your repo](config/repo-url.md) → Run `/analyze-repo` command
- 📋 [Commands Reference](.cursor/commands/) - Available Cursor commands
- 📝 [Templates](templates/) - Roadmap document templates
- 🔧 [Detection Utilities](scripts/utils/) - Repository analysis tools
- 📚 [Example Structure](#repository-structure) - File organization

## Setup Commands

Add roadmapper to a new repository:

```bash
# Clone your new empty repo
git clone <your-repo-url>
cd <your-repo>

# Add roadmapper and pull its contents
git remote add roadmapper https://github.com/Henry-Family/roadmapper.git
git fetch roadmapper
git pull roadmapper main --allow-unrelated-histories

# Push to your repo
git push origin main
```

---

## Overview

Roadmapper is a product roadmapping system that 10X delivery velocity by translating vision, requirements, and feedback into phases, epics, issues and working software. 

### Key Features

- **Vision → Phases** - Translates product vision and specs into properly scoped product phases
- **Phases → Releases** - Organizes phases into current, future, and point releases with clear scope boundaries
- **Releases → GitHub Issues** - Generates Github epics and issues with appropriate detail 
- **Optimized Sequencing** - Automatically recommends optimal release sequences based on dependencies
- **AI + Human Orchestration** - Intelligently assigns issues to human developers or AI agents based on issue complexity and risk
- **Automatic Analysis** - Detects project characteristics (codebase, production, CI/CD, schema) and updates config automatically
- **Flexible Deployment** - Use as integrated repo or standalone roadmap management for multiple codebases
- **Template-Driven** - Generates consistent roadmap documents with intelligent defaults

---

## Target Personas

### Product Manager
As a product manager using roadmapper, I need:

- **Vision → Executable Work**: I want to translate high-level product vision into properly scoped phases that engineering can implement
- **Dependency Mapping**: I need to understand which features depend on others so we sequence releases optimally
- **Feedback Integration**: I want production observations and user feedback automatically categorized (point release vs future phase)
- **Point Release Management**: I need to quickly ship bug fixes and minor improvements without disrupting the main roadmap progression
- **Progress Visibility**: I need clear visibility into what's shipped, what's in progress, and what's planned
- **Intelligent Sequencing**: I want recommendations on optimal release order based on dependencies, complexity, and risk

### Release Manager
As a release manager using roadmapper, I need:

- **Phase → Release Translation**: I need a structured way to move phases from future → current → past with clear scope boundaries
- **Automated Issue Generation**: I want to generate GitHub issues from release specs with one command, properly scoped for AI or human implementation
- **Release Archiving**: I need completed releases automatically archived when starting a new phase so we maintain history without clutter
- **Point Release Management**: I want to track bugs and improvements separately from major features so we can ship quick fixes without disrupting the main roadmap
- **Roadmap Sync**: I need the roadmap to stay in sync with what's actually implemented so future planning is based on reality

### Development Team
As a developer implementing the Github epics and issues generated roadmapper, I expect:

- **Clear Specifications**: I want detailed specs linked from GitHub issues so I know exactly what to build
- **Organized Work**: I need issues that reference roadmap context so I understand how my work fits into the bigger picture
- **AI + Human Clarity**: I want to know which issues are appropriate for AI agents vs human developers
- **Version Tracking**: I want clear version numbers and release notes so I know what's deployed and what's coming
- **Feedback Loop**: I need a way to report bugs and improvements that get properly categorized (point release vs future feature)

---

## Workflow Architecture

### Release Planning Layers

**1. Vision Layer** (`context/vision.md`)
- Product vision, target customers, high-level phases
- References detailed specs for each phase
- Success metrics and phase dependencies
- **Purpose**: Strategic direction

**2. Specification Layer** (`context/specs/*.md`)
- Detailed specifications for features
- Technical requirements, config parameters, validation rules
- **Purpose**: Authoritative technical requirements

**3. Future Releases** (`milestones/future-releases.md`)
- Phases 2-4 with planned use cases
- Prerequisites and dependencies
- **Command**: `/sync-roadmap` - Syncs with vision and removes completed features

**4. Current Release** (`milestones/current-release.md`)
- Single phase scope with specific epics and issues
- Implementation notes, code locations, architecture changes
- **Command**: `/advance-release` - Archives current, pulls next phase
- **Command**: `/create-release-issues` - Creates GitHub issues

**5. Implementation** (GitHub Issues → PRs → Code)
- Work on issues, create PRs, deploy
- **Command**: `/complete-release` - Version and tag

**6. Point Releases** (`milestones/point-release.md`)
- Bugs and improvements for current release
- **Command**: `/create-point-issues` - Creates issues for quick fixes

---

## Usage Modes

### Integrated Mode (Roadmapper IS Your Project)

Use roadmapper as your project repository with code alongside roadmap.

```bash
# Your project structure
my-project/
├── .cursor/commands/      # Roadmapper commands
├── context/               # Vision and specs
├── milestones/            # Release tracking
├── src/                   # Your code
└── package.json
```

**Commands:**
```bash
# Analyze current repo
/analyze-repo

# Start new release
/advance-release

# Create issues
/create-release-issues
```

### Standalone Mode (Separate Roadmap Repo)

Use roadmapper as a separate repository managing one or more codebases.

```bash
# Separate repos
org/
├── roadmapper/            # Roadmap management
└── my-codebase/           # Actual code
```

**Setup:**
```bash
# Configure target repo
echo '{"targetRepo": "https://github.com/org/my-codebase"}' > config/repo-url.json

# Analyze target repo
/analyze-repo https://github.com/org/my-codebase
```

---

## Available Commands

### Analysis & Setup

#### `/analyze-repo`
Analyzes repository and optionally updates config files.

**What it does:**
1. Scans project files (deployment, CI/CD, schema, versioning)
2. Shows detected changes vs current config
3. Prompts: "Would you like to update config with these changes?"
4. Updates `config/tech-stack.md`, `config/schema/`, etc.

**When to use:** Initial setup, after major changes, before releases

---

### Release Management

#### `/sync-roadmap`
Syncs `future-releases.md` with `vision.md` and removes completed features.

**What it does:**
1. Reads `context/vision.md` and `context/specs/*.md`
2. Analyzes what's implemented vs planned
3. Updates `milestones/future-releases.md`
4. Removes completed features, adds new phases

**When to use:** After completing a release, when vision changes

---

#### `/advance-release`
Archives current release and pulls next phase from future-releases.md.

**What it does:**
1. Archives `milestones/current-release.md` to `milestones/past-releases.md`
2. Pulls next phase from `milestones/future-releases.md`
3. Populates `milestones/current-release.md` with new phase
4. Auto-increments version number

**When to use:** After completing and deploying a major release

---

#### `/create-release-issues`
Creates GitHub issues from `current-release.md` epics.

**What it does:**
1. Reads `milestones/current-release.md`
2. Extracts epics and issues
3. Creates GitHub issues with proper labels
4. Links issues to roadmap context

**When to use:** At start of new release phase

---

#### `/complete-release`
Versions and tags the release.

**What it does:**
1. Updates version in relevant files (package.json, etc.)
2. Creates git tag
3. Updates `config/releases/CHANGELOG.md`
4. Creates release notes

**When to use:** After completing and testing a release

---

#### `/create-point-issues`
Creates GitHub issues from `point-release.md`.

**What it does:**
1. Reads `milestones/point-release.md`
2. Extracts bugs and improvements
3. Creates GitHub issues labeled as point release
4. Links to current release context

**When to use:** After observing production issues, for quick fixes

---

## Repository Structure

```
roadmapper/
├── README.md                          # This file
├── .cursorrules.md                    # Workflow rules
├── package.json                       # Dependencies
│
├── .cursor/
│   └── commands/                      # Cursor AI commands
│       ├── analyze-repo.md
│       ├── sync-roadmap.md
│       ├── advance-release.md
│       ├── create-release-issues.md
│       ├── complete-release.md
│       └── create-point-issues.md
│
├── context/
│   ├── vision.md                      # Product vision
│   ├── current-release-feedback.md    # Production observations
│   └── specs/
│       ├── archived/                  # Old specs
│       └── prd-1.md                   # Product requirements
│
├── config/
│   ├── repo-url.json                  # Target repo (standalone mode)
│   ├── tech-stack.md                  # Technology documentation
│   ├── releases/
│   │   └── CHANGELOG.md               # Release history
│   └── schema/
│       ├── CHANGELOG.md               # Schema changes
│       ├── schema.prisma              # Current schema
│       └── v0.0.1-schema.prisma      # Schema snapshots
│
├── milestones/
│   ├── current-release.md             # Active release
│   ├── next-release.md                # Next planned
│   ├── future-releases.md             # Future phases
│   ├── past-releases.md               # Archived releases
│   └── point-release.md               # Bugs/improvements
│
├── scripts/
│   └── utils/
│       ├── detect-deployment.js       # Detect deployment method
│       ├── detect-schema.js           # Detect data schema
│       └── detect-cicd.js             # Detect CI/CD
│
├── seed-data/                         # Test data and fixtures
│
└── templates/
    ├── vision.template.md
    ├── current-release.template.md
    ├── future-releases.template.md
    ├── point-release.template.md
    ├── past-releases.template.md
    └── RELEASEME.template.md
```

---

## Configuration

### Tech Stack Documentation

**File**: `config/tech-stack.md`

Documents current technology stack, deployment method, CI/CD setup, and environments. Updated by `/analyze-repo` command.

### Release History

**File**: `config/releases/CHANGELOG.md`

Tracks all releases with version numbers, dates, and changes. Updated by `/complete-release` command.

### Schema Tracking

**Files**: `config/schema/`

- `schema.prisma` - Current schema
- `CHANGELOG.md` - Schema change history
- `vX.Y.Z-schema.prisma` - Versioned snapshots

Updated by `/analyze-repo` when schema changes detected.

---

## Workflow Examples

### Starting a New Release

```bash
# 1. Review and update vision
vim context/vision.md

# 2. Sync roadmap with reality
/sync-roadmap

# 3. Archive current release and pull next phase
/advance-release

# 4. Review and refine current-release.md
vim milestones/current-release.md

# 5. Generate GitHub issues
/create-release-issues

# 6. Work on issues...
# (create PRs, merge, deploy)

# 7. Complete the release
/complete-release 2.0.0
```

### Handling Point Releases

```bash
# 1. Observe production behavior
# (capture feedback in context/current-release-feedback.md)

# 2. Document bugs/improvements
vim milestones/point-release.md

# 3. Create issues for fixes
/create-point-issues

# 4. Work on issues...
# (create PRs, merge, deploy)

# 5. Complete point release
/complete-release 2.0.1
```

### Analyzing Repository State

```bash
# Run analysis
/analyze-repo

# Review detected changes
# (AI shows diffs between detected state and config)

# Approve updates
# (AI updates config files)

# Verify changes
git diff config/
```

---

## Detection Capabilities

### Deployment Detection
- GitHub Actions (with workflow parsing)
- Vercel
- Docker / Docker Compose
- Google Apps Script (clasp)
- Manual deployment

### Schema Detection
- Prisma
- SQL files
- TypeORM entities
- Mongoose schemas
- Custom schema formats

### CI/CD Detection
- GitHub Actions workflows (detailed parsing)
- CircleCI
- Travis CI
- GitLab CI
- Test frameworks (Jest, Playwright, pytest)
- Linting (ESLint, Prettier)

---

## Templates

Templates use Handlebars syntax for variable substitution.

### Available Templates

- `vision.template.md` - Product vision structure
- `current-release.template.md` - Release spec structure
- `future-releases.template.md` - Future planning structure
- `point-release.template.md` - Point release structure
- `past-releases.template.md` - Archived releases structure
- `RELEASEME.template.md` - Generated guide for projects

### Template Variables

Common variables available in templates:
- `{{PROJECT_NAME}}` - Project name
- `{{CURRENT_VERSION}}` - Current version
- `{{DEPLOYMENT_METHOD}}` - Deployment method
- `{{HAS_CI}}` - Boolean for CI/CD presence
- `{{TECH_STACK}}` - Technology stack description

---

## Requirements

- Node.js 18+
- Git
- GitHub CLI (`gh`) - for issue/PR management
- Cursor IDE - for custom commands

---

## Installation

### As Submodule (Recommended)

```bash
# Add to your project
cd your-project
git submodule add https://github.com/Henry-Family/roadmapper .roadmapper

# Commands are available at .roadmapper/.cursor/commands/
```

### As Fork (For Customization)

```bash
# Fork the repo
gh repo fork Henry-Family/roadmapper --clone

# Customize for your needs
cd roadmapper
vim templates/vision.template.md

# Use in your projects
```

---

## Contributing

This is a private repository for Henry-Family organization use. For improvements or bug reports, create an issue in this repository.

---

## License

Private repository - All rights reserved.

---

## Support

For questions or improvements, create an issue in this repository or contact the maintainers.
