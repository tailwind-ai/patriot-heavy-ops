# implement-issue

<!-- Usage: /implement-issue 226 -->

You are implementing Github issue {{ISSUE_NUMBER}} on dev branch in Platform Mode. Use the Github CLI to get context on this.

MANDATORY CURSORRULES COMPLIANCE: Reference @.cursorrules.md throughout this work.

STRICT SCOPE: Only work on Github issue {{ISSUE_NUMBER}} requirements. Note unrelated issues but don't fix them.

WORKFLOW:

1. Use Github CLI to view {{ISSUE_NUMBER}} to analyze requirements
2. Create comprehensive TODO list for issue {{ISSUE_NUMBER}} only
3. Get TODO list approval before implementation
4. MANDATORY TDD SEQUENCE: Write failing test → Confirm test fails → Write ONLY enough code to make that test pass → Repeat
5. Work through TODOs until CI green
6. Push and create PR from dev

**INITIAL ANALYSIS REQUIRED:**

1. Assess issue scope - flag if it needs breaking into sub-issues
2. If sub-issues needed: propose optimal implementation sequence with dependencies
3. If scope is appropriate: create comprehensive TODO list

Behavior:

- If invoked with trailing text (e.g., "/implement-issue 226"), interpret that text as {{ISSUE_NUMBER}} and proceed.
- If {{ISSUE_NUMBER}} is missing, ask me once for it before proceeding.

