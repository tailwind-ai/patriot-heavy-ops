# pr-triage

<!-- Usage:
  /pr-triage <PR_NUMBER> [ISSUE_NUMBER]
  Examples:
    /pr-triage 320
    /pr-triage 320 227
-->

Context:

- This command follows the "implement issue" workflow and inspects CI status for PR {{PR_NUMBER}}.
- Arguments:
  - Required: {{PR_NUMBER}}
  - Optional: {{ISSUE_NUMBER}} (if omitted, auto-detect from PR metadata; if not found, ask me once.)

Argument handling:

- If a second argument is provided, treat it as {{ISSUE_NUMBER}}.
- Otherwise, auto-detect {{ISSUE_NUMBER}} by:
  1. `gh pr view {{PR_NUMBER}} --json title,body,headRefName,url`
  2. Extract the first plausible issue number via regex patterns (in order):
     - /#(?<n>\d+)\b/
     - /\bissue[- _]?(?<n>\d+)\b/i
     - /\bgh[- _]?(?<n>\d+)\b/i
     - /\b(?:fixes|closes|resolves)\s+#(?<n>\d+)/i
  3. If no match, ask me: "What's the ISSUE_NUMBER for PR {{PR_NUMBER}}?" and then proceed.

Directives (read back a short plan first):

- As a reminder, CI Tests were passing at the beginning of this work and you were supposed to write new tests first and then implement minimal code to satisfy {{ISSUE_NUMBER}} requirements. Analyze how well you did.
- CI Tests are failing and Cursor Bugbot left comments on PR {{PR_NUMBER}}. Analyze the failures. Identify root causes and surgical changes required.
- STRICT SCOPE: Fix only issues related to getting CI Tests working. Do not fix unrelated issues, refactor existing code, or implement changes outside {{ISSUE_NUMBER}}'s scope.
- Create a comprehensive, sequential to-do list of root causes with recommended surgical changes.
- Get my approval before making any changes.

Data collection (use GitHub CLI; summarize in a compact table):

1. PR metadata
   - `gh pr view {{PR_NUMBER}} --json number,title,author,headRefName,headRefOid,url`
2. CI runs for the PR head
   - Latest SHA: from `headRefOid`
   - `gh run list --branch <headRefName> --json databaseId,headSha,conclusion,name,workflowName,htmlUrl --limit 15`
   - Filter to runs matching the latest head SHA; identify failing ones.
3. Failure details
   - For each failing run: `gh run view <databaseId> --log`
   - Capture first failing step, concise error snippet (~20 lines), and test suite name if present.
4. Bugbot review comments
   - `gh pr view {{PR_NUMBER}} --comments`
   - Summarize only bot comments referencing failures as one-liners.

Analysis requirements (keep it surgical; aim for red → green):

- Compare behavior vs. TDD intent for {{ISSUE_NUMBER}} (tests first, minimal code).
- For each failing workflow/test, identify a **root cause** (e.g., wrong import, flaky test, mock drift, env var).
- For each root cause, propose the **smallest** change to pass CI (no refactors/unrelated cleanup).
- Flag flaky/non-deterministic failures with a minimal stabilization approach.

Output format:

1. **Brief Plan** (3–6 bullets)
2. **Findings Table** (Run → Status → First failing step → Error snippet → Link)
3. **Root Causes & Surgical Fixes** (numbered list; Cause → Minimal Change → Files/lines to touch)
4. **Strict-Scope To-Do List** (ordered checkboxes)
5. **Request Approval** (explicit yes/no gate)

Behavior:

- If invoked with `/pr-triage 320 227`, use {{ISSUE_NUMBER}}=227 directly.
- If invoked with `/pr-triage 320` and auto-detect succeeds, proceed silently.
- If auto-detect fails, ask me for {{ISSUE_NUMBER}} once, then proceed.
- Do **not** make changes; stop after presenting the plan and to-do list and wait for approval.
