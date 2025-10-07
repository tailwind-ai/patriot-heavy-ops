# Create Point Issues

Generate GitHub issues from the point release specification.

## Usage

```
/create-point-issues
```

This command takes no arguments.

## What This Command Does

Reads `milestones/point-release.md` and creates GitHub issues for bug fixes and improvements using the GitHub Issue Templates.

## Steps

### 1. Read Point Release

Read `milestones/point-release.md` completely and extract:
- Patch version (e.g., v1.1.1)
- Parent release version (e.g., v1.1.0)
- All issue definitions
- Issue types (bug, enhancement, process)
- Priorities and assignments

### 2. Check for Unpopulated Template

Check for template variables:
- `{{PATCH_VERSION}}`, `{{BASE_VERSION}}`, `{{RELEASE_NAME}}`
- `[Epic Name]`, `[Issue Title]`, `#TBD`

If found, display: "point-release.md contains template variables. Please populate it with actual issues before generating GitHub issues."

### 3. Extract Versions

Parse versions from document:
```bash
PATCH_VERSION=$(grep "^# Point Release:" milestones/point-release.md | sed 's/.*v\([0-9.]*\).*/\1/')
PARENT_VERSION=$(grep "^\*\*Parent Release\*\*:" milestones/point-release.md | sed 's/.*v\([0-9.]*\).*/\1/')
```

### 4. Create Issues by Type

For each issue in point-release.md:

**Bug Issues:**
```bash
gh issue create \
  --title "[v$PATCH_VERSION] Bug: {{BUG_TITLE}}" \
  --body "$(cat <<EOF
{{BUG_DESCRIPTION}}

**Parent Release**: v$PARENT_VERSION
**Point Release**: v$PATCH_VERSION

## Current Behavior
{{CURRENT_BEHAVIOR}}

## Expected Behavior
{{EXPECTED_BEHAVIOR}}

## Steps to Reproduce
{{STEPS}}

Related: [Point Release](milestones/point-release.md)
EOF
)" \
  --label "bug" \
  --label "point-release" \
  --label "{{ISSUE_SIZE}}" \
  --label "{{RISK_LEVEL}}" \
  --label "{{HUMAN_OR_AI}}"
```

**Enhancement Issues:**
```bash
gh issue create \
  --title "[v$PATCH_VERSION] {{ENHANCEMENT_TITLE}}" \
  --body "$(cat <<EOF
{{ENHANCEMENT_DESCRIPTION}}

**Parent Release**: v$PARENT_VERSION
**Point Release**: v$PATCH_VERSION

## Overview
{{OVERVIEW}}

## Acceptance Criteria
{{ACCEPTANCE_CRITERIA}}

Related: [Point Release](milestones/point-release.md)
EOF
)" \
  --label "enhancement" \
  --label "point-release" \
  --label "{{ISSUE_SIZE}}" \
  --label "{{RISK_LEVEL}}" \
  --label "{{HUMAN_OR_AI}}"
```

**Process Issues:**
```bash
gh issue create \
  --title "[v$PATCH_VERSION] {{PROCESS_TITLE}}" \
  --body "$(cat <<EOF
{{PROCESS_DESCRIPTION}}

**Parent Release**: v$PARENT_VERSION
**Point Release**: v$PATCH_VERSION

## Problem
{{PROBLEM}}

## Proposed Solution
{{SOLUTION}}

Related: [Point Release](milestones/point-release.md)
EOF
)" \
  --label "process" \
  --label "point-release" \
  --label "{{ISSUE_SIZE}}" \
  --label "{{RISK_LEVEL}}" \
  --label "{{HUMAN_OR_AI}}"
```

### 5. Label Selection

Always include:
- `point-release` - Identifies this as a point release issue
- Type label: `bug`, `enhancement`, or `process`
- Size label: `small`, `medium`, or `large`
- Risk label: `low-risk`, `medium-risk`, or `high-risk`
- Resource label: `ai`, `human`, or `hybrid`

### 6. Batch Processing

- Process issues in order
- Create up to 10 issues at a time
- After each batch, show summary table:
  - Issue number
  - Title (with version prefix)
  - Type (Bug/Enhancement/Process)
  - Labels
  - Status
- Get confirmation before continuing

### 7. Display Summary

Show:
```
✅ GitHub issues created from point-release.md

Point Release: v1.1.1
Parent Release: v1.1.0

Created Issues:
- #47: [v1.1.1] Bug: Fix vendor detection logic (bug, small, low-risk, ai)
- #48: [v1.1.1] Add configurable inclusion rules (enhancement, medium, medium-risk, human)
- #49: [v1.1.1] Optimize classification performance (process, large, high-risk, human)

Total: 3 issues (1 bug, 1 enhancement, 1 process)

Next steps:
1. Review issues on GitHub
2. Assign issues to team members
3. Start implementation
4. After completion, run /complete-release {{PATCH_VERSION}}
```

## Template Variable Substitution

When creating issues, replace template variables from point-release.md:

**Bug Template:**
- `{{BUG_TITLE}}` → From point-release.md
- `{{BUG_DESCRIPTION}}` → From issue section
- `{{CURRENT_BEHAVIOR}}`, `{{EXPECTED_BEHAVIOR}}` → From issue details
- `{{STEPS}}` → Reproduction steps

**Enhancement Template:**
- `{{ENHANCEMENT_TITLE}}` → From point-release.md
- `{{OVERVIEW}}` → From issue section
- `{{ACCEPTANCE_CRITERIA}}` → From issue details

**Process Template:**
- `{{PROCESS_TITLE}}` → From point-release.md
- `{{PROBLEM}}` → Current state description
- `{{SOLUTION}}` → Proposed improvement

## Error Handling

- If `milestones/point-release.md` doesn't exist or is empty, explain that no point release is defined
- If template variables detected, prompt user to populate the file
- If no issues found to create, explain what was found
- If issue already exists, skip and note in summary
- If GitHub API fails, show error and continue with next issue

## Notes

- Always prefix issue titles with patch version: `[v1.1.1]`
- Always apply `point-release` label to all issues
- Link issues to parent release in issue body
- Point releases are for surgical updates only (no new major features)
- Issues should be small, focused improvements or bug fixes
- Always use `gh` CLI for GitHub operations
