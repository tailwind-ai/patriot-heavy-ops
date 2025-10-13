# analyze-epic

<!-- Usage: /analyze-epic 231 [--repo https://github.com/org/repo] -->

You are analyzing Github Epic {{EPIC_NUMBER}} to create an implementation plan. Use the Github CLI to get context.

**Standalone Mode Support:** If --repo flag provided, use that repo for GitHub CLI commands and look for config in config/repos/org-repo/. If no --repo flag, use current repo (integrated mode).

MANDATORY CURSORRULES COMPLIANCE: Reference @.cursorrules.md throughout this work.

STRICT SCOPE: Only analyze Epic {{EPIC_NUMBER}} and its child issues. Note unrelated issues but don't include them.

WORKFLOW:

0. CONTEXT REVIEW
   - Review @.cursorrules.md (coding standards, workflow preferences, branch strategy)
   - Review @analyze-epic.md (this file - analysis steps)
   - Review @config/tech-stack.md (project type, deployment, CI/CD, testing)
   - Detect project context from tech-stack.md:
     * Deployment method (GitHub Actions, Vercel, Docker, Manual, None)
     * Test framework (Jest, Playwright, pytest, Go test, None)
     * Base branch (dev for roadmapper, main/master for typical projects)
     * Schema management (Prisma, SQL, TypeORM, None)

1. EPIC ANALYSIS
   - Use Github CLI to view Epic {{EPIC_NUMBER}} and all child issues
   - Read issue descriptions, acceptance criteria, comments
   - Identify dependencies between issues
   - Assess scope (flag if >7 issues - too large, suggest split)

2. RISK ASSESSMENT
   Evaluate each issue:
   
   🟢 **LOW RISK:**
   - File operations (rename, move, delete)
   - Documentation updates
   - README updates
   - Simple config changes
   - Isolated, single-file changes
   - No API calls or external dependencies
   - Template modifications
   - Linting rule adjustments
   
   🟡 **MEDIUM RISK:**
   - Logic refactoring (moderate complexity)
   - New features (well-scoped)
   - Multi-file changes (related files)
   - Some API integration
   - Moderate testing required
   - Detection utility updates
   - Command behavior changes
   - CI/CD workflow modifications
   
   🔴 **HIGH RISK:**
   - Architectural changes
   - Complex logic extraction/refactoring
   - Breaking changes (especially for libraries/packages)
   - Multiple API integrations
   - Broad system impact
   - Requires extensive testing
   - Database migration changes
   - Security-related modifications
   - Core workflow changes (for roadmapper platform)
   
   Calculate overall epic risk:
   - 🟢 LOW: All issues low risk
   - 🟡 MEDIUM: Mix of low/medium, or 1 high-risk issue
   - 🔴 HIGH: Multiple high-risk issues or epic scope too broad

3. IMPLEMENTATION SEQUENCING
   - Order issues by dependencies (foundational first)
   - Identify critical validation checkpoints
   - Estimate effort per issue and total
   - Note if schema migrations required (affects testing approach)
   - Flag breaking changes early in sequence (requires version coordination)

4. GROUPING ANALYSIS
   After sequencing, evaluate if issues should be combined:
   
   **Quick Decision:** Combine if same files + <2hr + same risk level. Keep separate if independent value + different risks + >3hr.
   
   **Consider Grouping If:**
   - Sequential issues touch the same files
   - Issues are tightly coupled (one can't work without the other)
   - Combined effort < 2 hours (small, related changes)
   - Same testing requirements
   - Natural atomic unit (e.g., "rename file + update references")
   
   **Keep Separate If:**
   - Issues are independently valuable
   - Different risk levels (don't mix HIGH with LOW)
   - Different testing requirements
   - Combined effort > 3 hours (too large)
   - Can be reviewed/rolled back independently
   
   For each grouping recommendation:
   - Explain rationale
   - Suggest updated issue structure
   - Note impact on Epic scope

5. PRESENT IMPLEMENTATION PLAN
   Format:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📊 EPIC ANALYSIS: [Epic Title]
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   Epic #{{EPIC_NUMBER}}: [Description]
   
   Project Context: [Detected from config/tech-stack.md]
   - Project Type: [Node.js/Python/Library/CLI Tool/Web App]
   - Deployment: [GitHub Actions/Vercel/Docker/Manual/None]
   - Tests: [Jest/Playwright/pytest/None]
   - Base Branch: [dev/main/master]
   
   Overall Risk: 🟢/🟡/🔴 [LOW/MEDIUM/HIGH]
   Estimated Effort: [X-Y hours]
   Breaking Changes: [Yes/No + details if yes]
   
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   IMPLEMENTATION SEQUENCE (Dependency Order)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   1. Issue #XXX: [Title]
      Risk: 🟢/🟡/🔴 [LOW/MEDIUM/HIGH]
      Rationale: [Why this issue? Why this order?]
      Effort: [X hours]
      Breaking: [Yes/No]
   
   [Continue for all issues...]
   
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CRITICAL VALIDATION CHECKPOINTS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   • Checkpoint 1: [After which issue(s), what to validate]
   • Schema Validation: [If Prisma/schema changes detected]
   • Breaking Change Review: [If breaking changes flagged]
   
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DEPENDENCIES & RISKS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   Dependencies: [Cross-issue dependencies]
   High-Risk Issues: [Issue #XXX - Why + mitigation]
   Potential Blockers: [Concerns or unknowns]
   Breaking Changes Impact: [If applicable - version strategy, migration path]
   
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   GROUPING RECOMMENDATIONS (if applicable)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   Recommend Grouping: [Issues #XXX + #YYY - Rationale]
   Keep Separate: [Issues #AAA + #BBB - Rationale]
   
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

6. ASK FOR APPROVAL
   - "Ready to implement this Epic?"
   - If user approves: Instruct them to run `/implement-epic {{EPIC_NUMBER}}`
   - If user declines: Ask for feedback, adjust plan if needed

**SCOPE WARNINGS:**

- If >7 issues: Recommend splitting into multiple epics
- If issues are loosely coupled: Suggest using `/implement-issue` in parallel
- If scope unclear: Flag and request clarification before planning

**NO CODE CHANGES:**

This command is analysis-only. No branches, commits, or code changes.

Behavior:

- If invoked with trailing text (e.g., "/analyze-epic 231"), interpret that text as {{EPIC_NUMBER}} and proceed.
- If {{EPIC_NUMBER}} is missing, ask me once for it before proceeding.
- Always present full analysis before asking for approval
- Guide user to run `/implement-epic {{EPIC_NUMBER}}` when ready