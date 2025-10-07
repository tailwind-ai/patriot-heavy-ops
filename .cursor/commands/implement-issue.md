# Implement Issue

Implement a GitHub issue using TDD workflow on dev branch.

## Usage

```
/implement-issue <issue_number>
```

**Examples:**
- `/implement-issue 226`
- `/implement-issue 42`

## What This Command Does

1. Fetches issue details from GitHub
2. Analyzes scope and creates TODO list
3. Implements using strict TDD (test first, minimal code)
4. Pushes changes and creates PR

## Process

### 1. Fetch Issue Details

Use GitHub CLI to get context:
```bash
gh issue view {{ISSUE_NUMBER}} --json title,body,labels,assignees,milestone
```

Extract:
- Issue title and description
- Acceptance criteria
- Labels and priority
- Related epic or parent issue

### 2. Analyze Scope

**Assess if issue needs breaking down:**
- Is scope too large for single PR?
- Are there multiple independent features?
- Can it be implemented in <4 hours?

**If sub-issues needed:**
- Propose optimal implementation sequence
- Identify dependencies between sub-issues
- Get approval before proceeding

**If scope is appropriate:**
- Proceed to TODO list creation

### 3. Create TODO List

Generate comprehensive, sequential TODO list:
- Break down into small, testable steps
- Order by dependencies (tests before implementation)
- Include specific files/functions to modify
- Estimate effort for each step

**Get approval before implementation.**

### 4. Implement Using TDD

**MANDATORY TDD SEQUENCE:**

For each feature/function:
1. Write failing test first
2. Run test to confirm it fails
3. Write ONLY enough code to make that test pass
4. Run test to confirm it passes
5. Refactor if needed (while keeping tests green)
6. Repeat for next feature

**Strict Scope:**
- Only work on {{ISSUE_NUMBER}} requirements
- Note unrelated issues but don't fix them
- No scope creep beyond acceptance criteria

**Cursorrules Compliance:**
- Reference @.cursorrules.md throughout
- Follow all code quality standards
- Maintain architecture patterns
- Document with JSDoc comments

### 5. Verify Completion

Before creating PR:
- [ ] All acceptance criteria met
- [ ] All tests passing (CI green)
- [ ] No linter errors
- [ ] Code follows @.cursorrules.md standards
- [ ] Changes committed to dev branch

### 6. Create Pull Request

```bash
git push origin dev
gh pr create \
  --title "feat: [Brief description] (#{{ISSUE_NUMBER}})" \
  --body "Closes #{{ISSUE_NUMBER}}" \
  --base main \
  --head dev
```

Display PR URL and next steps.

## Error Handling

- If {{ISSUE_NUMBER}} is missing, ask once before proceeding
- If issue doesn't exist, show error and exit
- If scope too large, recommend breaking into sub-issues
- If tests fail, stop and fix before continuing
- If PR creation fails, show error but keep local changes

## Notes

- Always work on dev branch (never main)
- Always write tests before implementation
- Always get TODO approval before coding
- Can run `/code-review {{ISSUE_NUMBER}}` before creating PR
- After PR created, use `/pr-triage <PR_NUMBER>` if CI fails

