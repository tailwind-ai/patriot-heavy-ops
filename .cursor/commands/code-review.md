# Code Review

Perform comprehensive pre-PR code review against issue requirements and cursorrules.

## Usage

```
/code-review <issue_number>
```

**Examples:**
- `/code-review 1`
- `/code-review 226`

## What This Command Does

Performs comprehensive pre-PR code review that validates:
1. **Requirements Compliance** - All acceptance criteria met
2. **Cursorrules Standards** - Code follows @.cursorrules.md
3. **Quota & Rate Limits** - Respects API limits (if applicable)
4. **Testing Readiness** - Proposes functional test checklist

## Workflow

### Phase 1: Data Collection

Use GitHub CLI to gather context:

```bash
# Get issue details
gh issue view {{ISSUE_NUMBER}} --json title,body,labels,assignees

# Get current branch and recent commits
git branch --show-current
git log --oneline -10

# Check for uncommitted changes
git status --short
```

**Summarize in compact table:**
- Issue Number & Title
- Acceptance Criteria (extract from issue body)
- Current Branch
- Files Changed (from git status/log)
- Lines Changed (approximate)

### Phase 2: Requirements Validation

**Check against issue acceptance criteria:**

For each acceptance criterion from {{ISSUE_NUMBER}}:
- [ ] Criterion 1: [Description] → ✅/❌/⚠️ [Evidence/Location]
- [ ] Criterion 2: [Description] → ✅/❌/⚠️ [Evidence/Location]
- [ ] Criterion N: [Description] → ✅/❌/⚠️ [Evidence/Location]

**Scope Compliance:**
- [ ] Changes are strictly scoped to {{ISSUE_NUMBER}} requirements
- [ ] No unrelated refactoring or feature additions
- [ ] No scope creep beyond acceptance criteria

### Phase 3: Cursorrules Standards Review

**Code Quality (from @.cursorrules.md):**

**Architecture & Design:**
- [ ] Functions follow separation of concerns
- [ ] DRY principle applied (no duplicate logic)
- [ ] Small, focused functions (<50 lines each)
- [ ] Composition over inheritance

**JavaScript/Apps Script Best Practices:**
- [ ] ES6 syntax used (const/let, arrow functions, template literals, destructuring)
- [ ] Try-catch blocks with descriptive console.log messages
- [ ] No throw statements in production code
- [ ] Null safety using optional chaining (?.) and nullish coalescing (??)
- [ ] Array safety checks (arr && arr.length > 0)
- [ ] No hardcoded runtime values (all config from Sheet Config tab)

**Type Safety & Validation:**
- [ ] JSDoc comments on all functions (@param with types, @returns)
- [ ] Union types documented (e.g., @param {string|null})
- [ ] Array types documented (e.g., @param {Array<string>})
- [ ] Runtime input validation at function entry points
- [ ] Type checks before operations (typeof checks)
- [ ] API response validation (null/undefined checks)
- [ ] Defensive guard clauses (early returns for invalid inputs)

**Naming & Style:**
- [ ] camelCase for functions/variables
- [ ] UPPER_SNAKE_CASE for constants
- [ ] Boolean prefixes (isDryRun, hasAccess)
- [ ] Verb prefixes for functions (getUserData, calculateScore)
- [ ] 2-space indentation
- [ ] Max 120 characters per line
- [ ] Single quotes for strings
- [ ] Semicolons required

**Documentation:**
- [ ] JSDoc comments explain purpose, params, returns
- [ ] Complex logic has inline comments (especially scoring/classification rules)
- [ ] README.md updated if needed
- [ ] Config tab documentation updated if new settings added
- [ ] runtime.template.json updated if config structure changed

### Phase 4: Google Quotas & Rate Limits Analysis

**Reference limits from @.cursorrules.md and config/runtime.template.json:**

**Gmail API Limits:**
- Quota: 250 units/user/second, 1 billion units/day
- [ ] API calls are batched where possible
- [ ] No excessive thread.getMessages() calls in loops
- [ ] Estimate quota usage for 100-thread batch: [CALCULATE]

**Sheets API Limits:**
- Quota: 300 read requests/minute, 300 write requests/minute
- [ ] Uses batchUpdate instead of individual setValue calls
- [ ] Minimizes getRange() calls (batch reads)
- [ ] Estimate API calls for 100-thread batch: [CALCULATE]

**Apps Script Execution Limits:**
- Limit: 6 minutes per trigger execution
- [ ] Operations broken into 100-item batches
- [ ] No unbounded loops or recursive calls
- [ ] Estimate execution time for 100-thread batch: [CALCULATE]
- [ ] Execution time stays well under 6-minute limit (<5 min recommended)

**Gemini API Limits:**
- Rate limits vary by tier (see Google AI Studio)
- [ ] Gemini calls are fallback only (not primary path)
- [ ] Proper error handling for rate limit errors
- [ ] Estimate Gemini calls for 100-thread batch: [CALCULATE]

**Quota Risk Assessment:**
- Overall Risk: LOW / MEDIUM / HIGH
- Bottleneck(s): [Identify if any]
- Mitigation: [Suggest if needed]

### Phase 5: Testing & Quality Validation

**Test Functions:**
- [ ] test*() function created for manual validation (e.g., testNewFeature())
- [ ] Test function includes DRY_RUN mode support
- [ ] Test function logs results clearly to console

**Error Handling:**
- [ ] All API calls wrapped in try-catch
- [ ] Errors logged with context (function name, input data)
- [ ] Non-fatal errors don't crash entire batch

### Phase 6: Functional Testing Checklist

**Based on the code changes, propose a minimal functional test:**

**Quick Functional Test (5-10 threads with DRY_RUN=true):**
1. [ ] Run test*() function in Apps Script Editor
2. [ ] Verify execution completes without errors
3. [ ] Check logs show expected behavior
4. [ ] Confirm execution time is reasonable (<2 min)
5. [ ] Validate acceptance criteria met

**If issues found:** Fix and re-run code-review  
**If tests pass:** Ready for PR creation and full testing in PR workflow

## Output Format

Provide review in this structure:

### 1. Executive Summary
- Issue: #{{ISSUE_NUMBER}} - [Title]
- Files Changed: [List with line counts]
- Overall Assessment: ✅ READY / ⚠️ NEEDS WORK / ❌ BLOCKED
- Key Findings: [3-5 bullet points]

### 2. Requirements Compliance
[Table with acceptance criteria and status]

### 3. Cursorrules Standards Review
[Checklist results with ✅/❌/⚠️ for each item]

### 4. Google Quotas & Rate Limits Analysis
[Quota calculations and risk assessment]

### 5. Issues Found
**BLOCKER** (must fix before PR):
1. [Issue description with file:line reference]

**MAJOR** (should fix before PR):
1. [Issue description with file:line reference]

**MINOR** (can fix in follow-up):
1. [Issue description with file:line reference]

### 6. Functional Testing Checklist
[Quick functional test steps - 5 items max]

### 7. Recommendations
- **Before PR**: [List required actions]
- **Testing Strategy**: [Specific testing approach]
- **Next Steps**: [Clear action items]

### 8. Decision Point

**Options:**
1. ✅ **APPROVE** - Code passes automated checks → Run quick functional test, then create PR
2. ⚠️ **FIX ISSUES** - Address blockers/majors first → Re-run code-review after fixes
3. ❌ **REJECT** - Fundamental issues → Discuss with PM before proceeding

**Recommendation:** [Your recommendation with rationale]

**If approved, proceed with functional test, then create PR for full testing workflow.**

## Behavior

- If invoked with trailing text (e.g., "/code-review 1"), interpret that text as {{ISSUE_NUMBER}} and proceed.
- If {{ISSUE_NUMBER}} is missing, ask me once for it before proceeding.
- Do **not** make any code changes during review - this is analysis only.
- After review, if approved, guide user through quick functional test (5 steps max).
- After functional test passes, offer to create PR or proceed with next issue.
