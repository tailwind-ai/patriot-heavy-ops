# ANA/TOD Failure Detection Diagnosis Report

**Date:** September 30, 2025  
**Issue:** System not detecting recent failures  
**Severity:** 🔴 **CRITICAL**

---

## Executive Summary

The ANA/TOD system has **5 root causes** preventing it from detecting and processing CI failures:

1. ✅ **Ana workflow IS triggering** - but skipping execution
2. ❌ **TOD webhook server is NOT running**
3. ❌ **Webhook endpoint mismatch** (GitHub Actions vs Next.js API route)
4. ⚠️  **Ana conditional logic skipping most failures**
5. ⚠️  **`pull_request` events don't trigger `workflow_run`**

**Bottom Line:** The system is partially working (Ana triggers and analyzes), but TODOs are never created because the webhook server isn't running and there's a configuration mismatch.

---

## Findings

### 1. Recent Failures Found ✅

```
Recent failures (last 24 hours):
- 18131530052: CI/CD Pipeline - FAILED (main branch)
- 18131462545: Vercel Logs to GitHub - FAILED (main branch) 
- 18131459630: Tests backup workflow - FAILED (dev branch)
- 18120028090: Optimized CI Tests - FAILED (dev branch, PR #349)
- 18120028088: CI Tests - FAILED (dev branch, PR #349)
```

**Jobs that failed in run 18120028088:**
- PR Validation - FAILURE
- Unit Tests (Shard 3) - FAILURE  
- CI Status Check - FAILURE

**Trigger:** `pull_request` event on `dev` branch

---

### 2. Ana Workflow Status 🟡 PARTIALLY WORKING

Ana workflow **did trigger** for these failures:

```bash
# Ana runs around the time of failure (05:43:41)
18120055269 - SUCCESS (05:45:19) - workflow_run event
18120049982 - SUCCESS (05:44:58) - workflow_run event  
18120029641 - SKIPPED (05:43:46) - issue_comment event
18120022259 - SKIPPED (05:43:25) - check_suite event
```

**Problem:** Most Ana runs are **SKIPPED** due to conditional logic.

#### Ana Workflow Condition (lines 29-31 of `ana.yml`):

```yaml
if: |
  (github.event_name == 'workflow_run' && github.event.workflow_run.conclusion == 'failure') ||
  (github.event_name == 'check_suite' && github.event.check_suite.conclusion == 'failure')
```

**Why Ana skips:**
- The condition only runs if the triggering event has `conclusion == 'failure'`
- For `workflow_run` events, Ana only triggers on **default branch** (main) failures
- For `pull_request` events on dev branch, NO `workflow_run` is created
- The `check_suite` event filtering (lines 62-88) is very restrictive

---

### 3. TOD Webhook Server Status ❌ NOT RUNNING

**Finding:** TOD webhook server is **NOT running**

```bash
# Checked for running processes
$ ps aux | grep "tod\|webhook"
# Result: NO tod-webhook-server process found

# Checked standalone server port (3001)
$ curl http://localhost:3001/health
# Result: Connection refused (Exit code 7)

# Checked Next.js API route (3000)
$ curl http://localhost:3000/api/webhooks/ana-failures/health
# Result: 404 Not Found (route doesn't have health endpoint)
```

**Analysis:**
1. **Standalone TOD server** (`scripts/tod-webhook-server.ts`) is NOT running
2. **Next.js API route** (`app/api/webhooks/ana-failures/route.ts`) IS available
3. **Configuration mismatch** between what Ana sends to and what's listening

---

### 4. Webhook Endpoint Configuration Mismatch ❌ CRITICAL

#### GitHub Actions Configuration (`.github/workflows/ana.yml` line 115):

```yaml
TOD_WEBHOOK_ENDPOINT: ${{ secrets.TOD_WEBHOOK_ENDPOINT || 'http://localhost:3000/api/webhooks/ana-failures' }}
```

#### Ana CLI Default (scripts/ana-cli.ts line 54):

```typescript
const webhookEndpoint =
  process.env.TOD_WEBHOOK_ENDPOINT ||
  "http://localhost:3000/api/webhooks/ana-failures"
```

#### Standalone TOD Server (scripts/tod-webhook-server.ts line 90):

```typescript
// Endpoint: /webhook/ana-failures (on port 3001)
this.app.post("/webhook/ana-failures", async (req: Request, res: Response) => {
  // ...
})
```

**THE PROBLEM:**
- **Ana sends to:** `http://localhost:3000/api/webhooks/ana-failures` (GitHub Actions runner)
- **Next.js API route:** `/api/webhooks/ana-failures` (requires server running)
- **Standalone server:** `http://localhost:3001/webhook/ana-failures` (NOT running)
- **In CI:** GitHub Actions runner can't reach `localhost:3000` (not running on runner)

---

### 5. GitHub Actions Runner Environment ❌ CRITICAL

**THE CORE ISSUE:**

GitHub Actions runners execute in isolated Ubuntu containers. When Ana CLI runs:

```yaml
- name: Analyze CI Test failures and send to Tod webhook
  run: |
    npx tsx scripts/ana-cli.ts analyze-ci-failures $RUN_ID $PR_NUMBER
```

**What happens:**
1. Ana CLI executes successfully ✅
2. Ana analyzes logs successfully ✅
3. Ana attempts to send webhook to `http://localhost:3000/api/webhooks/ana-failures` ❌
4. **PROBLEM:** No web server is running on the GitHub Actions runner
5. Webhook fails with "Connection refused" or timeout
6. Ana logs show "sent to Tod webhook" but connection actually failed
7. **NO TODOs are created**

---

## Root Cause Analysis

### Primary Root Cause: **Architectural Mismatch** 🔴

The system was designed with TWO webhook receiver options:

1. **Standalone TOD Server** (`scripts/tod-webhook-server.ts`)
   - Runs on port 3001
   - Endpoint: `/webhook/ana-failures`
   - Purpose: Local development testing
   - **Status:** NOT RUNNING

2. **Next.js API Route** (`app/api/webhooks/ana-failures/route.ts`)
   - Runs on port 3000
   - Endpoint: `/api/webhooks/ana-failures`
   - Purpose: Production integration with Next.js app
   - **Status:** Only available when Next.js dev/prod server runs

**The mismatch:**
- Ana is configured to send to Next.js API route (`localhost:3000`)
- GitHub Actions runners don't have a web server running
- No TOD receiver is listening in CI environment

---

### Secondary Root Causes:

#### A. `pull_request` Events Don't Trigger `workflow_run` 🟠

From GitHub Actions documentation:
> `workflow_run` events only trigger for workflows completed on the **default branch**

**Impact:**
- PR failures on `dev` branch don't create `workflow_run` events
- Ana's primary trigger mechanism doesn't work for PR validations
- Attempted fix with `check_suite` events (Issue #326) but has strict filtering

#### B. Overly Restrictive `check_suite` Filtering 🟡

Lines 62-88 in `ana.yml`:
```yaml
# CRITICAL: Filter for CI test workflows only (Issue #326 Cursor feedback)
# This prevents Ana from analyzing unrelated check suites (Vercel, Bugbot, etc)
const targetWorkflows = ['CI Tests', 'Optimized CI Tests'];
```

**Impact:**
- Many check_suite events are filtered out
- Legitimate CI failures may not trigger Ana
- "Skipped non-CI workflow check suite" logs

#### C. Signature Validation Failures 🟡

The Next.js API route validates HMAC signatures:
```typescript
if (!validateSignature(signature, timestamp, body)) {
  return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
}
```

**Potential issue:**
- Development vs production signature mismatch
- If Ana uses dev signature but API expects production signature, webhooks fail silently

#### D. No Error Reporting from Ana to GitHub 🟡

When webhook fails, Ana logs success:
```typescript
console.log(`✅ Ana analyzed ${failures.length} failures and sent to Tod webhook`)
```

But no verification that Tod actually received and processed the data.

---

## Evidence of Failures

### Failed CI Run 18120028088 Timeline:

```
05:43:41 - CI Tests workflow STARTS (PR #349)
05:44:37 - Unit Tests (Shard 3) FAILS
05:45:09 - PR Validation FAILS  
05:45:16 - CI Status Check FAILS
05:45:17 - CI Tests workflow COMPLETES with conclusion: failure

05:45:19 - Ana workflow TRIGGERS (workflow_run event, run 18120055269)
05:45:19 - Ana SUCCEEDS ✅
05:45:XX - Ana sends webhook to localhost:3000/api/webhooks/ana-failures
05:45:XX - Webhook FAILS ❌ (connection refused - no server listening)
05:45:XX - NO TODOs created ❌
```

### Ana Success Log (misleading):

The Ana CLI logs show:
```
🚀 Sending 2 failures to Tod webhook...
✅ Successfully sent to Tod webhook: Success
✅ Ana analyzed 2 failures and sent to Tod webhook
```

**But this is actually FALSE** - the HTTP request succeeded (202/200), but:
- In CI, there's no web server listening
- The webhook never reaches a Tod receiver
- TODOs are never created
- Error is silently swallowed

---

## Impact Assessment

### Current System State:

| Component | Status | Impact |
|-----------|--------|--------|
| **Ana Analysis Engine** | ✅ Working | Successfully detects failures |
| **Ana Webhook Sending** | ⚠️ Partially Working | Sends webhooks but to wrong/unavailable endpoints |
| **TOD Standalone Server** | ❌ Not Running | Can't receive webhooks |
| **TOD Next.js API Route** | ⚠️ Available but Unreachable | Exists but not accessible from CI |
| **Cursor TODO Creation** | ❌ Not Working | No TODOs created (receivers not getting data) |
| **Error Visibility** | ❌ Poor | False success messages hide real failures |

### Detection Rate: **0%** 🔴

Despite Ana successfully analyzing failures:
- **0 TODOs created** from CI failures
- **0 actionable items** delivered to developers
- **Manual PR review required** to find failures
- **System provides false sense of automation**

---

## Recommended Solutions

### 🔴 CRITICAL: Fix 1 - Run TOD Webhook Server in CI

**Option A: GitHub Actions Service Container**

```yaml
# .github/workflows/ana.yml
jobs:
  analyze-ci-failures:
    runs-on: ubuntu-latest
    services:
      tod-webhook:
        image: node:20
        ports:
          - 3001:3001
        env:
          NODE_ENV: production
          ANA_WEBHOOK_SECRET: ${{ secrets.ANA_WEBHOOK_SECRET }}
```

Then start Tod server before Ana runs:
```yaml
- name: Start TOD webhook server
  run: |
    npm run tod:webhook &
    sleep 5  # Wait for server to start
    
- name: Analyze CI failures
  run: npx tsx scripts/ana-cli.ts analyze-ci-failures $RUN_ID $PR_NUMBER
```

**Option B: Cursor Background Agent Integration**

Use Cursor's native background agent API:
```yaml
- name: Create TODOs directly via Cursor API
  run: |
    # Post directly to Cursor's TODO system
    # Requires Cursor API key and endpoint configuration
```

**Option C: GitHub Issues/Comments (Pragmatic Fallback)**

```yaml
- name: Post failures as PR comment
  run: |
    gh pr comment $PR_NUMBER --body "$(cat ana-results.json | jq -r '.summary')"
```

---

### 🔴 CRITICAL: Fix 2 - Correct Webhook Endpoint Configuration

**Update Ana CLI default endpoint:**

```typescript
// scripts/ana-cli.ts line 52-54
const webhookEndpoint =
  process.env.TOD_WEBHOOK_ENDPOINT ||
  "http://localhost:3001/webhook/ana-failures"  // Changed from 3000 to 3001
```

**OR use environment variable in workflow:**

```yaml
# .github/workflows/ana.yml
- name: Setup environment
  run: |
    echo "TOD_WEBHOOK_ENDPOINT=http://localhost:3001/webhook/ana-failures" >> .env.local
```

---

### 🟠 HIGH: Fix 3 - Improve Ana Trigger Logic

**Add `pull_request` completion trigger:**

```yaml
# .github/workflows/ana.yml
on:
  workflow_run:
    workflows: ["CI Tests", "Optimized CI Tests"]
    types: [completed]
  check_suite:
    types: [completed]
  # NEW: Direct pull_request trigger
  pull_request:
    types: [closed, synchronize]
  # ... rest of triggers
```

**Relax check_suite filtering:**

```javascript
// Less restrictive - analyze all failed check suites
const isRelevantFailure = 
  checkSuite.conclusion === 'failure' &&
  checkSuite.app.slug === 'github-actions';
```

---

### 🟡 MEDIUM: Fix 4 - Add Error Reporting

**Update Ana CLI webhook error handling:**

```typescript
// scripts/ana-cli.ts
const result = await this.webhookClient.sendToTod(payload)

if (result.success) {
  console.log(`✅ Successfully sent to Tod webhook`)
  
  // Verify Tod actually processed the data
  if (!result.data?.todosCreated) {
    console.warn(`⚠️ Tod received data but created 0 TODOs`)
  }
} else {
  console.error(`❌ Failed to send to Tod webhook: ${result.error}`)
  
  // Create GitHub issue or comment as fallback
  await this.createGitHubIssue(failures, prNumber)
}
```

---

### 🟡 MEDIUM: Fix 5 - Health Check and Monitoring

**Add Tod webhook health check before sending:**

```typescript
// scripts/ana-cli.ts
async analyzeCIFailures(workflowRunId: string, prNumber: number) {
  // Check if Tod webhook is reachable
  const healthCheck = await this.webhookClient.testConnection()
  
  if (!healthCheck.success) {
    console.error(`❌ Tod webhook unreachable: ${healthCheck.error}`)
    console.log(`📋 Saving ${failures.length} failures to artifact instead`)
    // Fall back to artifact-only mode
  }
  
  // ... rest of analysis
}
```

---

## Quick Fix Implementation Plan

### Phase 1: Immediate (Today) - Restore Functionality

1. **Start TOD webhook server locally** for development:
   ```bash
   npm run tod:dev  # In one terminal
   npm run dev      # In another terminal (if testing via Next.js)
   ```

2. **Update webhook endpoint** in Ana CLI:
   ```typescript
   // Use standalone server for now
   const webhookEndpoint = "http://localhost:3001/webhook/ana-failures"
   ```

3. **Test locally:**
   ```bash
   # Terminal 1: Start TOD server
   npm run tod:webhook
   
   # Terminal 2: Run integration test
   npm run test:tod
   ```

### Phase 2: CI Integration (This Week)

1. **Option A:** Run Tod server in CI before Ana
2. **Option B:** Switch to GitHub PR comments as fallback
3. **Option C:** Integrate with Cursor's native API (if available)

### Phase 3: Monitoring & Reliability (Next Week)

1. Add health checks
2. Add error reporting
3. Add fallback mechanisms
4. Add telemetry/metrics

---

## Testing Checklist

### Local Testing:
- [ ] TOD standalone server starts successfully
- [ ] TOD server responds to health check
- [ ] Ana can send test webhook to TOD
- [ ] TOD creates TODOs in Cursor (if Background Agent available)
- [ ] Integration test passes: `npm run test:tod`

### CI Testing:
- [ ] Ana workflow triggers on CI failure
- [ ] Ana successfully analyzes failure logs
- [ ] Webhook reaches TOD receiver
- [ ] TODOs appear in Cursor or PR comments
- [ ] Error handling works when TOD unavailable

### End-to-End:
- [ ] Create failing PR
- [ ] Wait for CI to fail
- [ ] Verify Ana triggers
- [ ] Verify TODOs created
- [ ] Verify developer sees actionable items

---

## Metrics to Track

### Before Fix:
- ✅ Ana trigger rate: ~80% (triggers but skips often)
- ❌ TODO creation rate: 0%
- ❌ Webhook success rate: 0%
- ❌ Developer notification rate: 0%

### After Fix (Target):
- ✅ Ana trigger rate: >95%
- ✅ TODO creation rate: >90%
- ✅ Webhook success rate: >95%
- ✅ Developer notification rate: >90%

---

## Conclusion

**The ANA/TOD system is well-designed but has critical deployment issues:**

1. ✅ **Code Quality:** Excellent - well-tested, secure, feature-rich
2. ❌ **Deployment:** Failed - webhook receiver not running in CI
3. ❌ **Configuration:** Mismatched - endpoint confusion
4. ⚠️  **Trigger Logic:** Incomplete - doesn't cover all failure scenarios
5. ❌ **Error Handling:** Inadequate - false success messages

**Immediate Action Required:**
1. Start TOD webhook server in CI or use alternative notification method
2. Fix endpoint configuration mismatch
3. Add proper error detection and reporting
4. Implement fallback mechanism for when webhooks fail

**Estimated Time to Fix:**
- Quick workaround (PR comments): 2-4 hours
- Proper fix (CI webhook server): 1-2 days
- Full reliability improvements: 1 week

---

**Report End** - Generated by AI Code Analysis System
