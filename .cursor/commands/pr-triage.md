# PR Triage

Analyze failing CI tests and propose surgical fixes for a pull request.

## Usage

```
/pr-triage <pr_number> [issue_number]
```

**Examples:**
- `/pr-triage 320`
- `/pr-triage 320 227`

## What This Command Does

1. Analyzes CI test failures for a PR
2. Identifies root causes of failures
3. Proposes minimal surgical fixes
4. Creates TODO list for fixes

## Arguments

- **Required:** `{{PR_NUMBER}}` - Pull request number
- **Optional:** `{{ISSUE_NUMBER}}` - Related issue number (auto-detected if omitted)

## Process

### 1. Argument Handling

- If a second argument is provided, treat it as {{ISSUE_NUMBER}}.
- Otherwise, auto-detect {{ISSUE_NUMBER}} by:
  1. `gh pr view {{PR_NUMBER}} --json title,body,headRefName,url`
  2. Extract the first plausible issue number via regex patterns (in order):
     - /#(?<n>\d+)\b/
     - /\bissue[- _]?(?<n>\d+)\b/i
     - /\bgh[- _]?(?<n>\d+)\b/i
     - /\b(?:fixes|closes|resolves)\s+#(?<n>\d+)/i
  3. If no match, ask me: "What's the ISSUE_NUMBER for PR {{PR_NUMBER}}?" and then proceed.

### 2. Data Collection

Use GitHub CLI to gather context (summarize in compact table):

**PR Metadata:**
```bash
gh pr view {{PR_NUMBER}} --json number,title,author,headRefName,headRefOid,url
```

**CI Runs:**
```bash
gh run list --branch <headRefName> --json databaseId,headSha,conclusion,name,workflowName,htmlUrl --limit 15
```
- Filter to runs matching latest head SHA
- Identify failing runs

**Failure Details:**
```bash
gh run view <databaseId> --log
```
- Capture first failing step
- Extract concise error snippet (~20 lines)
- Note test suite name if present

**Bugbot Comments:**
```bash
gh pr view {{PR_NUMBER}} --comments
```
- Summarize bot comments referencing failures

### 3. Analyze Failures

**TDD Compliance Check:**
- Were tests written first before implementation?
- Was minimal code written to pass tests?
- Analyze how well TDD was followed

**For each failing workflow/test:**
- Identify **root cause** (e.g., wrong import, flaky test, mock drift, env var)
- Propose **smallest change** to pass CI (no refactors/unrelated cleanup)
- Flag flaky/non-deterministic failures with minimal stabilization approach

**Strict Scope:**
- Fix only issues related to getting CI tests working
- Do not fix unrelated issues
- Do not refactor existing code
- Do not implement changes outside {{ISSUE_NUMBER}} scope

### 4. Create TODO List

Generate comprehensive, sequential TODO list:
- List root causes with recommended surgical changes
- Order by dependencies
- Include specific files/lines to modify
- Mark each as checkbox item

### 5. Present Findings

Display in this format:

**Brief Plan** (3-6 bullets)

**Findings Table:**
| Run | Status | First Failing Step | Error Snippet | Link |
|-----|--------|-------------------|---------------|------|
| ... | ...    | ...               | ...           | ...  |

**Root Causes & Surgical Fixes:**
1. **Cause:** [Description]
   - **Minimal Change:** [What to change]
   - **Files/Lines:** [Where to change]

**Strict-Scope TODO List:**
- [ ] Fix 1
- [ ] Fix 2
- [ ] Fix 3

### 6. Request Approval

Ask: **"Proceed with these surgical fixes? (yes/no)"**

If approved, implement fixes. If declined, explain reasoning.

## Error Handling

- If PR doesn't exist, show error and exit
- If no CI runs found, explain and exit
- If auto-detect fails for {{ISSUE_NUMBER}}, ask once
- If all tests passing, show success message

## Notes

- This is analysis-only until user approves
- Always aim for minimal, surgical changes (red → green)
- Do not make changes without approval
- After fixes, CI should automatically re-run

