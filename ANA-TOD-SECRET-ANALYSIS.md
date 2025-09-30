# ANA/TOD Organization Secrets Analysis

**Date:** September 30, 2025  
**Critical Finding:** Organization secrets ARE configured ✅

---

## Organization-Level Secrets Status

```bash
✅ ANA_WEBHOOK_SECRET    - Created: 2025-09-30T02:22:23Z (Visibility: ALL)
✅ TOD_WEBHOOK_ENDPOINT  - Created: 2025-09-30T03:08:47Z (Visibility: ALL)
✅ ORG_PAT              - Created: 2025-09-27T02:04:25Z (Visibility: ALL)
```

**All three required secrets are properly configured at the org level!**

---

## What This Means

### ✅ **GOOD NEWS:**

1. **Secrets are properly set up** - Not a configuration issue
2. **Recent creation dates** - ANA_WEBHOOK_SECRET and TOD_WEBHOOK_ENDPOINT were just set up (Sept 30)
3. **Organization-wide** - Available to all repos in Henry-Family org
4. **Proper visibility** - "ALL" means all repos can access them

### ⚠️ **BUT THIS CHANGES THE DIAGNOSIS:**

The secrets being configured means:

1. **TOD_WEBHOOK_ENDPOINT is set** 
   - Workflow will use `${{ secrets.TOD_WEBHOOK_ENDPOINT }}` (NOT the default `localhost:3001`)
   - This is likely pointing to an EXTERNAL endpoint (not localhost)
   - Could be:
     - A publicly accessible webhook service
     - A Cursor-hosted endpoint
     - A cloud function/serverless endpoint
     - A tunnel URL (ngrok, etc.)

2. **The endpoint is probably NOT localhost**
   - If it were localhost, webhooks would definitely fail in CI
   - Since secrets were just created, this might be a proper production endpoint
   - Need to know what TOD_WEBHOOK_ENDPOINT actually points to

3. **Webhook signatures should work**
   - ANA_WEBHOOK_SECRET is set
   - Both Ana (sender) and Tod (receiver) should have matching secrets
   - HMAC validation should pass

---

## New Questions

### 🔍 **What is TOD_WEBHOOK_ENDPOINT actually set to?**

Possibilities:
1. **Cursor Background Agent API** - Native Cursor webhook endpoint
2. **Cloud Function** - AWS Lambda, Google Cloud Function, Vercel Function
3. **Tunnel Service** - ngrok or similar for local dev
4. **Self-hosted Server** - Public IP or domain pointing to Tod server
5. **Still localhost** - Would explain why it's not working

### 🔍 **Where is the Tod receiver actually running?**

Options:
1. **Cursor's infrastructure** - As a managed service
2. **Your cloud** - Deployed webhook receiver
3. **Local machine** - Tunneled to public URL
4. **Not running** - Which would explain the failures

---

## Updated Diagnosis

### Scenario A: External Endpoint Configured Correctly

**If** TOD_WEBHOOK_ENDPOINT points to a working external service:

**Why it's not working:**
1. ✅ Secrets configured
2. ✅ Ana sends to correct endpoint
3. ❌ **But the endpoint service might not be running/deployed**
4. ❌ **Or the endpoint is returning errors**
5. ❌ **Or signature validation is failing**

**Evidence needed:**
- What URL is TOD_WEBHOOK_ENDPOINT?
- Is that service actually running?
- Check service logs for incoming webhook attempts

### Scenario B: External Endpoint Not Working

**If** TOD_WEBHOOK_ENDPOINT points to a service that's down:

**Why it's not working:**
1. ✅ Secrets configured
2. ✅ Ana sends webhook
3. ❌ **Service is unreachable (404, 500, timeout)**
4. ❌ **No error reporting in Ana logs**
5. ❌ **TODOs never created**

**Fix:**
- Start/deploy the webhook receiver service
- Update endpoint if URL changed
- Add health monitoring

### Scenario C: Localhost Still Configured (Misconfiguration)

**If** TOD_WEBHOOK_ENDPOINT is still set to localhost:

**Why it's not working:**
1. ⚠️ Secrets exist but wrong value
2. ❌ GitHub Actions can't reach localhost
3. ❌ Webhook fails immediately

**Fix:**
- Update TOD_WEBHOOK_ENDPOINT to public URL
- OR deploy webhook receiver with public endpoint

---

## What We Need to Know

### CRITICAL: What is the actual value of TOD_WEBHOOK_ENDPOINT?

**Cannot see it directly** (secrets are masked in logs):
```
analyze-ci-failures  echo "TOD_WEBHOOK_ENDPOINT=***" >> .env.local
analyze-ci-failures  TOD_WEBHOOK_ENDPOINT: ***
```

**How to find out:**

#### Option 1: Check with org admin
```bash
# Org admin can view secret value
gh secret list --org Henry-Family
# Then manually check the value in GitHub UI
```

#### Option 2: Add diagnostic logging
```yaml
# Temporarily add to workflow (DON'T commit full value)
- name: Debug endpoint
  run: |
    echo "Endpoint protocol: ${TOD_WEBHOOK_ENDPOINT%%://*}"
    echo "Endpoint domain: ${TOD_WEBHOOK_ENDPOINT#*://}" | cut -d'/' -f1
```

#### Option 3: Test from local machine
```bash
# If you have the secret value locally
curl -X POST "$TOD_WEBHOOK_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"summary":"test","analysisDate":"2025-09-30T00:00:00Z","failures":[]}'
```

---

## Recommended Next Steps

### Step 1: Identify the Endpoint (DO THIS FIRST)

Ask yourself or check:
- What did you set TOD_WEBHOOK_ENDPOINT to?
- Is it pointing to:
  - `http://localhost:*` → Won't work in CI
  - `https://api.cursor.com/*` → Cursor-managed service
  - `https://your-app.vercel.app/api/webhooks/*` → Your deployed API
  - `https://abc123.ngrok.io/*` → Tunnel (temporary)
  - `https://your-domain.com/*` → Your infrastructure

### Step 2: Verify the Service is Running

Once you know the endpoint:

**If it's localhost:**
- Change to public endpoint
- OR use PR comments as fallback

**If it's external service:**
- Check if service is deployed and running
- Test health endpoint: `curl $ENDPOINT/health`
- Check service logs for incoming requests
- Verify security (CORS, authentication)

**If it's Cursor-managed:**
- Verify Cursor Background Agent is enabled
- Check Cursor docs for proper endpoint format
- May need additional authentication

### Step 3: Test End-to-End

```bash
# 1. Find the endpoint value (securely)
# 2. Test it manually
curl -X POST "YOUR_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "X-Ana-Signature: sha256=test" \
  -H "X-Ana-Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  -d @test-payload.json

# 3. Check if you get response
# 4. Check if TODOs appear in Cursor
```

---

## Likely Scenarios (Ranked by Probability)

### 1. **Endpoint Points to Undeployed Service** (60% probability)

- Secret was created with planned endpoint URL
- Service was never deployed to that URL
- Ana sends webhooks to 404/timeout
- No TODOs created

**Fix:** Deploy the webhook receiver service

### 2. **Endpoint Points to Localhost** (25% probability)

- Secret was set with localhost for testing
- Forgot to update to production URL
- Works locally, fails in CI

**Fix:** Update secret to public URL

### 3. **Service Running But Failing** (10% probability)

- Endpoint is correct and reachable
- But service has bugs or crashes
- Or signature validation fails
- Or Cursor API not available

**Fix:** Debug the service logs, fix bugs

### 4. **Everything Works, TODOs Just Not Visible** (5% probability)

- System is actually working
- TODOs are being created
- But not showing up in Cursor due to UI issue

**Fix:** Check Cursor TODO list, refresh

---

## Action Items (In Order)

### IMMEDIATE:

1. **Find out what TOD_WEBHOOK_ENDPOINT is set to**
   - Check GitHub org secrets UI
   - OR ask who set it up
   - OR add diagnostic logging (safely)

2. **Test that endpoint**
   ```bash
   curl -I $ENDPOINT  # Check if it's reachable
   ```

3. **Based on result, choose fix:**
   - If localhost → Update to public URL or use fallback
   - If external → Deploy/start the service
   - If Cursor API → Verify configuration

### SOON:

4. **Add health checks** before webhook send
5. **Add proper error logging** when webhook fails
6. **Add fallback mechanism** (PR comments)
7. **Add monitoring/alerts** for webhook failures

---

## Questions for You

**Please answer these to complete the diagnosis:**

1. **What is TOD_WEBHOOK_ENDPOINT set to?**
   - Is it localhost?
   - Is it a cloud URL?
   - Is it Cursor's API?
   - Is it something else?

2. **Where is the Tod webhook receiver supposed to run?**
   - Cursor-managed service?
   - Your deployed infrastructure?
   - Local machine with tunnel?
   - Not deployed yet?

3. **When were these secrets created?**
   - Sept 30, 2025 (just 2 days ago!)
   - Was this part of a recent setup?
   - Was the receiver service also deployed then?

---

## Updated Root Cause (Pending Endpoint Info)

**Previous diagnosis:** "TOD server not running locally, wrong endpoint"

**New diagnosis:** "Secrets properly configured, but unclear where endpoint points and if that service is running"

**Most likely issue:** 
- Endpoint configured to planned URL
- Service not yet deployed to that URL
- Webhooks sent but return 404/timeout
- No TODOs created

**Fix depends on:** What TOD_WEBHOOK_ENDPOINT actually points to

---

**Report Status:** INCOMPLETE - Need TOD_WEBHOOK_ENDPOINT value to proceed

