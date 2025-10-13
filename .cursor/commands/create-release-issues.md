# Create Release Issues

Generate GitHub issues from the current release specification.

## Usage

```
/create-release-issues
```

This command takes no arguments.

## What This Command Does

Reads `milestones/current-release.md` and creates GitHub issues for all epics and their child issues using the GitHub Issue Templates.

## Steps

### 1. Read Current Release

Read `milestones/current-release.md` completely and extract:
- Release version and name
- All epics with their descriptions
- All issues within each epic
- Labels, priorities, and assignments
- Dependencies and relationships

### 2. Identify Issues to Create

For each epic:
- Extract all child issues listed
- Check if issue already exists in GitHub (by title match)
- Skip issues marked with `(status:Backlog)` or `(status:"Next Release")`
- Only create issues marked for current release

### 3. Create Epic Issue (if needed)

If the epic doesn't exist as a GitHub issue:

```bash
gh issue create \
  --title "[Epic] {{EPIC_TITLE}}" \
  --body-file <(cat templates/epic.template.md | sed 's/{{EPIC_TITLE}}/Actual Title/g') \
  --label "epic" \
  --label "{{PHASE}}"
```

### 4. Create Child Issues

For each issue in the epic:

**Enhancement Issues:**
```bash
gh issue create \
  --title "[1 of 3] {{ENHANCEMENT_TITLE}}" \
  --body-file <(cat templates/issue-enhancement.template.md | sed ...) \
  --label "enhancement" \
  --label "{{ISSUE_SIZE}}" \
  --label "{{RISK_LEVEL}}" \
  --label "{{HUMAN_OR_AI}}"
```

**Bug Issues:**
```bash
gh issue create \
  --title "Bug: {{BUG_TITLE}}" \
  --body-file <(cat templates/issue-bug.template.md | sed ...) \
  --label "bug" \
  --label "{{ISSUE_SIZE}}" \
  --label "{{RISK_LEVEL}}" \
  --label "{{HUMAN_OR_AI}}"
```

**Process Issues:**
```bash
gh issue create \
  --title "{{PROCESS_TITLE}}" \
  --body-file <(cat templates/issue-process.template.md | sed ...) \
  --label "process" \
  --label "{{ISSUE_SIZE}}" \
  --label "{{RISK_LEVEL}}" \
  --label "{{HUMAN_OR_AI}}"
```

### 5. Link Issues to Epic

After creating issues:
- Update epic issue body with child issue numbers
- Add epic reference to each child issue

### 6. Batch Processing

- Process issues in epic order
- Create up to 10 issues at a time
- After each batch, show summary table:
  - Issue number
  - Title
  - Epic
  - Labels
  - Status
- Get confirmation before continuing

### 7. Display Summary

Show:
```
✅ GitHub issues created from current-release.md

Created Issues:
- Epic #42: Phase 2 Draft Generation
  - #43: [1 of 4] Implement persona-matched drafts
  - #44: [2 of 4] Add relationship-aware communication
  - #45: [3 of 4] Create automated response system
  - #46: [4 of 4] Build strategic progression tracking

Total: 1 epic, 4 issues

Next steps:
1. Review issues on GitHub
2. Assign issues to team members
3. Start implementation with /implement-issue
```

## Template Variable Substitution

When creating issues, replace template variables:

**Epic Template:**
- `{{EPIC_TITLE}}` → From current-release.md
- `{{EPIC_DESCRIPTION}}` → From epic section
- `{{PHASE}}` → From release phase
- `{{CHILD_ISSUE_1}}` → Created issue numbers

**Enhancement Template:**
- `{{ISSUE_NUMBER}}` → Position in epic (1, 2, 3...)
- `{{TOTAL_ISSUES}}` → Total issues in epic
- `{{ENHANCEMENT_TITLE}}` → From current-release.md
- `{{USER_ROLE}}`, `{{USER_WANT}}`, `{{USER_BENEFIT}}` → From issue description
- `{{ISSUE_SIZE}}`, `{{RISK_LEVEL}}`, `{{HUMAN_OR_AI}}` → From issue metadata

## Error Handling

- If `milestones/current-release.md` doesn't exist, show error
- If no issues found to create, explain what was found
- If issue already exists, skip and note in summary
- If GitHub API fails, show error and continue with next issue

## Notes

- Always use `gh` CLI for GitHub operations
- Issues are created in order (epic first, then children)
- Template files must exist in `templates/` directory
- Supports all 4 issue types (epic, enhancement, bug, process)
- Preserves relationships between epics and child issues
