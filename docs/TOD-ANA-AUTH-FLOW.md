# Tod & Ana Authentication Flow

## 🔐 How the Keys Work Together

### Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GitHub Repository                            │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              GitHub Secrets (Repository Settings)             │   │
│  │                                                                │   │
│  │  ANA_WEBHOOK_SECRET:  "a3f7b2c9d8e1f6a4b7c2..."  (Secret #1) │   │
│  │  TOD_WEBHOOK_ENDPOINT: "https://abc.ngrok.io/..." (Secret #2) │   │
│  │  ORG_PAT:             "github_pat_11..."         (Secret #3) │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │         Ana Workflow (.github/workflows/ana.yml)              │   │
│  │                                                                │   │
│  │  1. CI fails or Bugbot posts review                           │   │
│  │  2. Ana analyzes logs/comments                                │   │
│  │  3. Creates failure data payload                              │   │
│  │  4. Signs payload with HMAC-SHA256 + SECRET                   │   │
│  │  5. Sends webhook POST to ENDPOINT                            │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ HTTPS POST Request
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Tod Webhook Server (Port 3001)                    │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │           Environment Variables (.env.local)                  │   │
│  │                                                                │   │
│  │  ANA_WEBHOOK_SECRET: "a3f7b2c9d8e1f6a4b7c2..." (MUST MATCH!) │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │         Tod Webhook Handler (scripts/tod-webhook-server.ts)   │   │
│  │                                                                │   │
│  │  1. Receives POST request from Ana                            │   │
│  │  2. Extracts X-Ana-Signature header                           │   │
│  │  3. Recomputes HMAC-SHA256 using SECRET                       │   │
│  │  4. Compares signatures (timing-safe)                         │   │
│  │  5. Validates timestamp (< 5 minutes)                         │   │
│  │  6. If valid: Transforms to Cursor TODOs                      │   │
│  │  7. Calls Cursor's todo_write API                             │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ Internal API Call
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Cursor Background Agent API                  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                     todo_write() Function                     │   │
│  │                                                                │   │
│  │  Creates native Cursor TODOs in the UI                        │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔑 The Three Keys Explained

### 1. **ANA_WEBHOOK_SECRET** (The Shared Secret)

**Purpose**: Cryptographic signature to verify requests are from Ana

**What it is**:
- A random 32+ byte hex string
- Example: `a3f7b2c9d8e1f6a4b7c2d9e3f8a1b6c4d7e2f9a3b8c1d6e4f7a2b9c3d8e1f6a4`

**Where it's stored**:
- ✅ GitHub repository secrets (for Ana)
- ✅ Tod server environment variables (for Tod)
- ⚠️ **MUST BE IDENTICAL in both places**

**How it's used**:
```javascript
// Ana signs the payload:
const signature = crypto
  .createHmac('sha256', ANA_WEBHOOK_SECRET)
  .update(JSON.stringify(payload))
  .digest('hex')

// Sends as header: X-Ana-Signature: sha256=<signature>

// Tod verifies:
const expectedSignature = crypto
  .createHmac('sha256', ANA_WEBHOOK_SECRET)
  .update(requestBody)
  .digest('hex')

// Compare: signature === expectedSignature
```

---

### 2. **TOD_WEBHOOK_ENDPOINT** (The Destination URL)

**Purpose**: Tells Ana where to send webhook requests

**What it is**:
- Full URL to Tod's webhook endpoint
- Development: `https://abc123.ngrok.io/webhook/ana-failures`
- Production: `https://your-app.vercel.app/api/webhooks/ana-failures`

**Where it's stored**:
- ✅ GitHub repository secrets (for Ana)

**How it's used**:
```javascript
// Ana sends POST request to this URL
fetch(TOD_WEBHOOK_ENDPOINT, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Ana-Signature': signature,
    'X-Ana-Timestamp': new Date().toISOString()
  },
  body: JSON.stringify(payload)
})
```

---

### 3. **ORG_PAT** (GitHub Personal Access Token)

**Purpose**: Allows Ana to read GitHub data (logs, comments, PRs)

**What it is**:
- GitHub Personal Access Token
- Format: `github_pat_11XXXXXXXXX...`

**Where it's stored**:
- ✅ GitHub repository secrets

**How it's used**:
```yaml
# Ana workflow uses it to call GitHub API
- name: Analyze CI failures
  uses: actions/github-script@v7
  with:
    github-token: ${{ secrets.ORG_PAT }}
```

**Required permissions**:
- `repo` (read repository data)
- `workflow` (read workflow runs)
- `pull_request` (read PR data)

---

## 🔒 Signature Validation Flow

### Step-by-Step Authentication

```
1. Ana creates payload:
   ┌─────────────────────────────────┐
   │ {                                │
   │   "summary": "CI failed",        │
   │   "failures": [...]              │
   │ }                                │
   └─────────────────────────────────┘

2. Ana signs payload with secret:
   payload_json = JSON.stringify(payload)
   signature = HMAC-SHA256(payload_json, ANA_WEBHOOK_SECRET)
   
   Result: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d..."

3. Ana sends HTTP request:
   POST https://abc123.ngrok.io/webhook/ana-failures
   Headers:
     X-Ana-Signature: sha256=7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d...
     X-Ana-Timestamp: 2025-09-30T12:00:00.000Z
     Content-Type: application/json
   Body:
     { "summary": "CI failed", "failures": [...] }

4. Tod receives request:
   - Extracts signature from header
   - Extracts timestamp from header
   - Reads request body as string

5. Tod recomputes signature:
   expected = HMAC-SHA256(request_body, ANA_WEBHOOK_SECRET)

6. Tod compares signatures (timing-safe):
   if (signature === expected) {
     ✅ Request is authentic
   } else {
     ❌ Request is forged/tampered
   }

7. Tod checks timestamp freshness:
   if (now - timestamp < 5 minutes) {
     ✅ Request is recent
   } else {
     ❌ Request is replayed/delayed
   }

8. If both pass:
   ✅ Process webhook → Create Cursor TODOs
```

---

## 🔐 Security Properties

### ✅ What This Protects Against

| Attack | Protection |
|--------|------------|
| **Forged Requests** | Attacker can't create valid signature without secret |
| **Replay Attacks** | Timestamp validation rejects old requests |
| **Timing Attacks** | Timing-safe comparison prevents signature guessing |
| **Man-in-the-Middle** | HTTPS encryption protects secret in transit |
| **Tampering** | Modified payload invalidates signature |

### ⚠️ What You Must Do

| Requirement | Why |
|-------------|-----|
| **Keep secret confidential** | Anyone with secret can forge requests |
| **Use HTTPS in production** | HTTP exposes secret to network sniffers |
| **Rotate secret periodically** | Limits damage if secret is compromised |
| **Use strong secret** | Short/weak secrets can be brute-forced |
| **Verify secrets match** | Mismatched secrets cause auth failures |

---

## 🧪 Testing Authentication

### Test 1: Valid Request (Should Succeed)

```bash
# Generate valid signature
SECRET="your-secret-here"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
PAYLOAD='{"summary":"test","analysisDate":"'$TIMESTAMP'","failures":[]}'

# Sign payload
SIGNATURE="sha256=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | cut -d' ' -f2)"

# Send request
curl -X POST http://localhost:3001/webhook/ana-failures \
  -H "Content-Type: application/json" \
  -H "X-Ana-Signature: $SIGNATURE" \
  -H "X-Ana-Timestamp: $TIMESTAMP" \
  -d "$PAYLOAD"

# Expected: 200 OK
```

### Test 2: Invalid Secret (Should Fail)

```bash
# Use wrong secret
WRONG_SECRET="wrong-secret"
SIGNATURE="sha256=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WRONG_SECRET" | cut -d' ' -f2)"

curl -X POST http://localhost:3001/webhook/ana-failures \
  -H "Content-Type: application/json" \
  -H "X-Ana-Signature: $SIGNATURE" \
  -H "X-Ana-Timestamp: $TIMESTAMP" \
  -d "$PAYLOAD"

# Expected: 401 Unauthorized (Invalid signature)
```

### Test 3: Old Timestamp (Should Fail)

```bash
# Use timestamp from 10 minutes ago
OLD_TIMESTAMP="2025-09-30T11:50:00Z"
SIGNATURE="sha256=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | cut -d' ' -f2)"

curl -X POST http://localhost:3001/webhook/ana-failures \
  -H "Content-Type: application/json" \
  -H "X-Ana-Signature: $SIGNATURE" \
  -H "X-Ana-Timestamp: $OLD_TIMESTAMP" \
  -d "$PAYLOAD"

# Expected: 401 Unauthorized (Timestamp too old)
```

---

## 📊 Monitoring Authentication

### Check Tod Logs for Auth Events

```bash
# Start Tod with verbose logging
npm run tod:webhook

# Look for these log messages:
```

**✅ Successful Authentication:**
```
2025-09-30T12:00:00.000Z POST /webhook/ana-failures
🔒 Using production HMAC-SHA256 signature validation
✅ Signature and timestamp validation passed
📥 Received 3 failures from Ana
   Summary: CI Test workflow failed
   PR: #284
📋 Creating 3 TODOs in Cursor...
✅ Successfully created 3 TODOs in Cursor
```

**❌ Failed Authentication (Wrong Secret):**
```
2025-09-30T12:00:00.000Z POST /webhook/ana-failures
🔒 Using production HMAC-SHA256 signature validation
❌ Signature verification failed
```

**❌ Failed Authentication (Old Timestamp):**
```
2025-09-30T12:00:00.000Z POST /webhook/ana-failures
🔒 Using production HMAC-SHA256 signature validation
❌ Timestamp too old or invalid
```

---

## 🔄 Secret Rotation Process

When you need to rotate the webhook secret:

```bash
# 1. Generate new secret
NEW_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# 2. Update GitHub secret
gh secret set ANA_WEBHOOK_SECRET --body "$NEW_SECRET"

# 3. Update Tod environment
echo "ANA_WEBHOOK_SECRET=\"$NEW_SECRET\"" >> .env.local

# 4. Restart Tod server
# Stop current server (Ctrl+C)
npm run tod:webhook

# 5. Verify with test
npx tsx scripts/test-tod-integration.ts
```

**⚠️ Important**: Update both places simultaneously to avoid downtime!

---

## 🆘 Common Authentication Issues

| Error | Symptom | Cause | Fix |
|-------|---------|-------|-----|
| `Invalid signature` | 401 Unauthorized | Secrets don't match | Verify `ANA_WEBHOOK_SECRET` is identical in GitHub & Tod |
| `Missing signature or timestamp headers` | 401 Unauthorized | Headers not sent | Check Ana is sending `X-Ana-Signature` and `X-Ana-Timestamp` |
| `Timestamp too old` | 401 Unauthorized | Request > 5 min old | Check network connectivity, increase timeout if needed |
| `Invalid signature format` | 401 Unauthorized | Missing `sha256=` prefix | Update Ana to send signature as `sha256=<hash>` |
| `ANA_WEBHOOK_SECRET not configured` | 401 Unauthorized | Environment var missing | Add secret to `.env.local` or deployment config |

---

## 📚 Code References

**Ana Side (Sending):**
- Workflow: `.github/workflows/ana.yml` (lines 110-120, 226-236)
- CLI: `scripts/ana-cli.ts` (webhook sending logic)
- Client: `lib/ana/webhook-client.ts` (signature generation)

**Tod Side (Receiving):**
- Server: `scripts/tod-webhook-server.ts` (lines 124-266)
- Next.js API: `app/api/webhooks/ana-failures/route.ts`
- Tests: `scripts/test-tod-integration.ts`

---

**Last Updated**: September 30, 2025