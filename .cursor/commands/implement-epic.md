# implement-epic

<!-- Usage: /implement-epic 231 [--repo https://github.com/org/repo] -->

You are implementing Github Epic {{EPIC_NUMBER}} in batch mode.

**Standalone Mode Support:** If --repo flag provided, use that repo for GitHub CLI commands and look for config in config/repos/org-repo/. If no --repo flag, use current repo (integrated mode).

**PREREQUISITE:** User must run `/analyze-epic {{EPIC_NUMBER}}` first. This command assumes analysis is complete and approved.

MANDATORY CURSORRULES COMPLIANCE: Reference @.cursorrules.md throughout this work.

STRICT SCOPE: Only work on Epic {{EPIC_NUMBER}} and its child issues. Note unrelated issues but don't fix them.

WORKFLOW:

0. PRE-FLIGHT CHECKS
   - Review @.cursorrules.md (coding standards, workflow preferences, branch strategy)
   - Review @implement-epic.md (this file - workflow steps)
   - Review @config/tech-stack.md (project context, deployment, testing)
   - Detect project context from tech-stack.md:
     * Project type (Node.js/Python/Library/CLI/Web App)
     * Deployment method (GitHub Actions/Vercel/Docker/Manual/None)
     * Test framework (Jest/Playwright/pytest/Go test/None)
     * Base branch (dev for roadmapper, main/master for typical projects)
     * Schema management (Prisma/SQL/TypeORM/None)
   - Check GitHub CLI auth: `gh auth status`
     * If fails: STOP and prompt "Run 'gh auth login' then re-run /implement-epic {{EPIC_NUMBER}}"
   - Check project-specific tools (based on detected project type):
     * Node.js: Check npm/node versions
     * Python: Check Python environment
     * Docker: Check docker/docker-compose if containerized
   - If all checks pass: proceed to create epic branch

1. CREATE EPIC BRANCH
   - Branch from base branch (detected from tech-stack.md or .cursorrules.md):
     * Roadmapper projects: `epic-{{EPIC_NUMBER}}` from `dev`
     * Typical open source: `epic-{{EPIC_NUMBER}}` from `main` or `master`
   - Rebase from base branch before starting each issue

2. IMPLEMENT ISSUES SEQUENTIALLY
   For each issue:
   - **TRACK METRICS:** Record start time/tokens → implement → record end time/tokens
     * Duration: end time - start time
     * Tokens: end count - start count
     * Files modified: count
     * Lines changed: +X / -Y
     * Tests added: count (if applicable)
     * Breaking changes: Yes/No
     * Add to epic metrics log
   - Review @.cursorrules.md and @implement-epic.md (refresh context)
   - Review @config/tech-stack.md (project context)
   - Create comprehensive TODO list (no approval needed - batched)
   - TEST-FIRST APPROACH (adapted to project type):
     * If test framework detected: Create/update automated tests
     * If no tests: Document manual test steps
     * Implement code with conservative approach
     * Review code changes locally
   - Implement all code changes for the issue
   - Checkpoint commit with test plan in message:
     ```
     feat(epic-{{EPIC_NUMBER}}): [Issue #N] description
     
     [Implementation details]
     
     Test Plan:
     - [ ] Test step 1
     - [ ] Test step 2
     - [ ] Expected result
     
     Implementation Metrics:
     - Duration: [X hours Y minutes]
     - Tokens: [N tokens used]
     - Files Modified: [count]
     - Lines Changed: [+X / -Y]
     - Tests Added: [count] (if applicable)
     - Breaking Changes: [Yes/No]
     ```
   - NO manual testing execution (deferred to end)
   - Continue to next issue

3. GENERATE COMPREHENSIVE TEST PLAN
   After all issues implemented:
   - Consolidate test steps from all commit messages
   - Add integration test scenarios (cross-issue interactions)
   - Add critical validation checkpoints
   - Organize by test sequence (setup → feature tests → integration → cleanup)
   - Mark critical vs optional tests
   - Include expected results for each test
   - Include rollback plan if issues found
   - **Adapt to project type:**
     * **Web Apps:** Browser testing, responsive design, API endpoints
     * **Libraries/Packages:** Public API compatibility, breaking changes, example usage
     * **CLI Tools:** Command execution, help text, error handling
     * **Platform Mode (Roadmapper):** Detection utilities, command execution, template generation
   - **Include Epic Implementation Metrics** (consolidate from commit messages):
     * Total Duration: [X hours Y minutes]
     * Total Tokens: [N tokens used]
     * Total Files Modified: [count]
     * Total Lines Changed: [+X / -Y]
     * Tests Added: [count]
     * Breaking Changes: [Yes/No + summary]
     * Test Coverage: [X% → Y%] (if measurable)
   - Present complete test plan for approval

4. DEPLOYMENT & TESTING
   - **DEPLOYMENT (Detection-Based from config/tech-stack.md):**
     * **GitHub Actions:** Push to trigger workflows, monitor Actions tab
     * **Vercel:** Deploy via git push or `vercel deploy`
     * **Docker:** `docker-compose up --build` or project-specific script
     * **Manual:** Follow project-specific deployment instructions
     * **None/Library:** Skip deployment, proceed to testing
     * **Schema Changes (if detected):**
       - Run Prisma migrations: `npx prisma migrate dev`
       - Verify schema changes applied
       - Test rollback if needed
   
   - **TESTING (Detection-Based):**
     * **Automated Tests (if test framework detected):**
       - Run test suite: `npm test` / `pytest` / `go test` / project-specific
       - Review test output for failures
       - Check coverage reports if available
       - Verify new tests pass
       - Ensure no regressions
     
     * **Manual Testing (always required for acceptance criteria):**
       - Present test plan for approval
       - Execute manual testing at user's direction (work through acceptance criteria one at a time)
       - Verify integration points between issues
       - Test edge cases and error handling
       - Document results
     
     * **Project-Type Specific Testing:**
       - **Web Apps:** Browser testing (Chrome/Firefox/Safari), responsive design, performance
       - **Libraries/Packages:** Import tests, example usage, API compatibility
       - **CLI Tools:** Command execution in different environments, help text
       - **Platform Mode (Roadmapper):** Detection utilities in test projects, command execution
   
   - Fix issues if found, repeat testing

5. FINALIZE
   - Get approval before creating PR
   - Push epic branch
   - Create PR from epic-{{EPIC_NUMBER}} → base branch (dev for roadmapper, main/master for typical projects)
   - Include comprehensive test results in PR
   - Include breaking changes documentation (if applicable)
   - Tag PR appropriately (breaking-change, enhancement, etc.)

**GUARDRAILS:**

1. **Scope Control**
   - Max 7 issues per epic
   - If >7 issues: propose epic split with dependencies
   - Flag if issues are loosely coupled (suggest parallel implementation)

2. **Checkpoint Commits**
   - One commit per issue (easy to bisect if problems)
   - Clear commit messages: "feat(epic-{{EPIC_NUMBER}}): [Issue #N] description"
   - Rebase from base branch before each issue if epic is multi-day
   - Mark breaking changes in commit message if applicable

3. **Critical Validation Points**
   - Identify 2-3 critical checkpoints upfront
   - Schema changes: validate migrations work before continuing
   - Breaking changes: verify upgrade path before continuing
   - Optional: --validate flag for mid-epic testing
   - Always test at epic completion (automated + manual)

4. **Escape Hatches**
   - If issue blocked: document, skip, continue
   - If major issue discovered: pause, get approval
   - If scope creep detected: flag immediately

5. **Authentication Failures**
   - If auth fails mid-epic: commit WIP, document state
   - Prompt user to re-authenticate (gh for GitHub, project-specific tools)
   - User re-runs /implement-epic {{EPIC_NUMBER}} to resume

**BEST USE CASES:**
✅ Tightly coupled issues (shared files/functions)
✅ Sequential dependencies (Issue B needs Issue A)
✅ Feature development (coherent user story)
✅ Refactoring epics (architectural changes)

**AVOID FOR:**
❌ Epics with >10 issues (split into smaller epics)
❌ Issues with no dependencies (use implement-issue in parallel)
❌ Hotfixes (use implement-issue)
❌ Exploratory work (unknown scope)

**EFFICIENCY GAINS:**
- 30% time reduction vs per-issue workflow
- Reduced context switching (1× vs N×)
- Single deployment cycle
- Batch testing (better integration coverage)
- Single PR review cycle

Behavior:

- If invoked with trailing text (e.g., "/implement-epic 231"), interpret that text as {{EPIC_NUMBER}} and proceed.
- If {{EPIC_NUMBER}} is missing, ask me once for it before proceeding.
- If user hasn't run `/analyze-epic {{EPIC_NUMBER}}` first, remind them to do so
- Generate comprehensive test plan before requesting manual testing