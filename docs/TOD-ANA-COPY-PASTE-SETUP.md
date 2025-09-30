# Tod & Ana Copy-Paste Setup Commands

> **Copy-paste these commands in order. No thinking required!**

## 🎯 Prerequisites

- Node.js installed
- GitHub CLI installed (`gh`) - [Install here](https://cli.github.com/)
- Ngrok installed - [Install here](https://ngrok.com/download)
- Authenticated with GitHub CLI: `gh auth login`

---

## 📋 Setup Script

### Step 1: Generate Secret

```bash
# Generate secure random secret (copy the output!)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**📝 Save this output - you'll need it in the next steps!**

Example output: `a3f7b2c9d8e1f6a4b7c2d9e3f8a1b6c4d7e2f9a3b8c1d6e4f7a2b9c3d8e1f6a4`

---

### Step 2: Set Environment Variables

**Replace `YOUR_SECRET_HERE` with the secret from Step 1:**

```bash
# Create/update .env.local
cat >> .env.local << 'EOF'

# Tod & Ana Integration
ANA_WEBHOOK_SECRET="YOUR_SECRET_HERE"
TOD_WEBHOOK_ENDPOINT="http://localhost:3001/webhook/ana-failures"
NODE_ENV="development"
TOD_WEBHOOK_PORT="3001"
EOF
```

**Or manually edit `.env.local` and add:**

```bash
ANA_WEBHOOK_SECRET="a3f7b2c9d8e1f6a4b7c2d9e3f8a1b6c4d7e2f9a3b8c1d6e4f7a2b9c3d8e1f6a4"
TOD_WEBHOOK_ENDPOINT="http://localhost:3001/webhook/ana-failures"
NODE_ENV="development"
TOD_WEBHOOK_PORT="3001"
```

---

### Step 3: Add Secrets to GitHub

**Option A: Using GitHub CLI (Fastest)**

```bash
# Set ANA_WEBHOOK_SECRET
echo "a3f7b2c9d8e1f6a4b7c2d9e3f8a1b6c4d7e2f9a3b8c1d6e4f7a2b9c3d8e1f6a4" | gh secret set ANA_WEBHOOK_SECRET

# Verify it was set
gh secret list
```

**Option B: Using GitHub Web UI**

1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions
2. Click "New repository secret"
3. Name: `ANA_WEBHOOK_SECRET`
4. Value: `a3f7b2c9d8e1f6a4b7c2d9e3f8a1b6c4d7e2f9a3b8c1d6e4f7a2b9c3d8e1f6a4`
5. Click "Add secret"

---

### Step 4: Start Tod Webhook Server

**Open Terminal 1:**

```bash
# Load environment and start Tod
source .env.local
npm run tod:webhook
```

**Or if you don't have npm script:**

```bash
source .env.local
npx tsx scripts/tod-webhook-server.ts
```

**Expected output:**
```
🤖 Starting Tod Webhook Server (Cursor Background Agent)
   Port: 3001
   Mode: Development
🚀 Tod Webhook Server running on port 3001
📥 Ana webhook endpoint: http://localhost:3001/webhook/ana-failures
🧪 Test endpoint: http://localhost:3001/test/create-todo
❤️  Health check: http://localhost:3001/health
```

---

### Step 5: Expose Tod with Ngrok

**Open Terminal 2:**

```bash
# Expose port 3001 to the internet
ngrok http 3001
```

**Expected output:**
```
Session Status                online
Account                       your-account
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:3001

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**📝 Copy the Forwarding URL (e.g., `https://abc123.ngrok.io`)**

---

### Step 6: Update GitHub Secret with Ngrok URL

**Replace `YOUR_NGROK_URL` with the URL from Step 5:**

```bash
# Set TOD_WEBHOOK_ENDPOINT with ngrok URL
echo "https://YOUR_NGROK_URL/webhook/ana-failures" | gh secret set TOD_WEBHOOK_ENDPOINT
```

**Example:**
```bash
echo "https://abc123.ngrok.io/webhook/ana-failures" | gh secret set TOD_WEBHOOK_ENDPOINT
```

**Verify:**
```bash
gh secret list
# Should show:
# ANA_WEBHOOK_SECRET    Updated 2025-09-30
# TOD_WEBHOOK_ENDPOINT  Updated 2025-09-30
```

---

### Step 7: Test the Integration

**Open Terminal 3:**

```bash
# Run integration test
npx tsx scripts/test-tod-integration.ts
```

**Expected output:**
```
🧪 Testing Tod Webhook Integration
   Target: http://localhost:3001
   Failures: 3

1️⃣ Testing health check...
   ✅ Health check passed: healthy

2️⃣ Testing Ana webhook endpoint...
   ✅ Webhook processed successfully
   📋 TODOs created: 3

3️⃣ Testing individual TODO creation...
   ✅ Test TODO created: Fix TypeScript compilation error in components/us...

🎉 All tests passed! Tod webhook integration is working.
```

---

## ✅ Verification Checklist

Run these commands to verify everything is set up:

```bash
# 1. Check .env.local has secrets
cat .env.local | grep ANA_WEBHOOK_SECRET

# 2. Check GitHub secrets are set
gh secret list

# 3. Test Tod health check
curl http://localhost:3001/health

# 4. Test ngrok is forwarding
curl https://YOUR_NGROK_URL/health

# 5. Run full integration test
npx tsx scripts/test-tod-integration.ts
```

**All checks should pass! ✅**

---

## 🔄 Daily Usage Commands

### Starting Your Dev Environment

```bash
# Terminal 1: Start Tod
cd /path/to/your/project
source .env.local
npm run tod:webhook

# Terminal 2: Start Ngrok  
ngrok http 3001

# Terminal 3: Your regular development
npm run dev
```

### Updating Ngrok URL (When It Changes)

```bash
# Ngrok URLs expire on free tier, update GitHub when needed:

# 1. Copy new ngrok URL
# 2. Update GitHub secret
echo "https://NEW_NGROK_URL/webhook/ana-failures" | gh secret set TOD_WEBHOOK_ENDPOINT
```

### Checking Logs

```bash
# View Tod logs (in Terminal 1 where Tod is running)
# Just watch the output

# View Ana logs
gh run list --workflow=ana.yml
gh run view RUN_ID --log

# View ngrok requests
# Open: http://127.0.0.1:4040 in your browser
```

---

## 🐛 Troubleshooting Commands

### Issue: "Invalid signature"

```bash
# Check secrets match
echo "GitHub secret:"
gh secret list | grep ANA_WEBHOOK_SECRET

echo "Local secret:"
cat .env.local | grep ANA_WEBHOOK_SECRET

# If different, update GitHub:
cat .env.local | grep ANA_WEBHOOK_SECRET | cut -d'"' -f2 | gh secret set ANA_WEBHOOK_SECRET
```

### Issue: "Connection refused"

```bash
# Check Tod is running
curl http://localhost:3001/health

# If fails, start Tod:
source .env.local
npm run tod:webhook
```

### Issue: "404 Not Found"

```bash
# Check endpoint URL is correct
gh secret list

# Should end with: /webhook/ana-failures
# Update if needed:
echo "https://YOUR_NGROK_URL/webhook/ana-failures" | gh secret set TOD_WEBHOOK_ENDPOINT
```

### Issue: Test fails

```bash
# 1. Kill existing processes
pkill -f tod-webhook
pkill -f ngrok

# 2. Restart Tod
source .env.local
npm run tod:webhook

# 3. Restart ngrok (in another terminal)
ngrok http 3001

# 4. Update GitHub secret with new ngrok URL
echo "https://NEW_NGROK_URL/webhook/ana-failures" | gh secret set TOD_WEBHOOK_ENDPOINT

# 5. Test again
npx tsx scripts/test-tod-integration.ts
```

---

## 🚀 Production Setup

### Deploy to Vercel

```bash
# 1. Deploy your app
vercel --prod

# 2. Add environment variable
vercel env add ANA_WEBHOOK_SECRET production

# Paste your secret when prompted

# 3. Update GitHub secret with production URL
echo "https://your-app.vercel.app/api/webhooks/ana-failures" | gh secret set TOD_WEBHOOK_ENDPOINT

# 4. Redeploy to apply env var
vercel --prod
```

### Deploy to Railway

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Create new project
railway init

# 4. Add environment variable
railway variables set ANA_WEBHOOK_SECRET="your-secret-here"

# 5. Deploy
railway up

# 6. Get your Railway URL
railway domain

# 7. Update GitHub secret
echo "https://your-app.railway.app/webhook/ana-failures" | gh secret set TOD_WEBHOOK_ENDPOINT
```

---

## 📊 Monitoring Commands

### Check Recent Ana Runs

```bash
# List recent Ana workflow runs
gh run list --workflow=ana.yml --limit 5

# View specific run details
gh run view RUN_ID

# Download logs
gh run view RUN_ID --log > ana-logs.txt
```

### Check Tod Status

```bash
# Health check
curl http://localhost:3001/health | jq

# Or with ngrok:
curl https://YOUR_NGROK_URL/health | jq
```

### View All Secrets

```bash
# List all GitHub secrets
gh secret list

# Should show:
# ANA_WEBHOOK_SECRET
# TOD_WEBHOOK_ENDPOINT
# ORG_PAT (if you have it)
```

---

## 🔒 Security Commands

### Rotate Secret

```bash
# 1. Generate new secret
NEW_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# 2. Update .env.local
sed -i '' "s/ANA_WEBHOOK_SECRET=\".*\"/ANA_WEBHOOK_SECRET=\"$NEW_SECRET\"/" .env.local

# 3. Update GitHub
echo "$NEW_SECRET" | gh secret set ANA_WEBHOOK_SECRET

# 4. Restart Tod
pkill -f tod-webhook
source .env.local
npm run tod:webhook

# 5. Test
npx tsx scripts/test-tod-integration.ts
```

### Verify Secrets

```bash
# Generate test signature to verify secret
TEST_PAYLOAD='{"test":"data"}'
SECRET="your-secret-here"

# Generate signature
echo -n "$TEST_PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET"

# This should match on both local and GitHub Actions
```

---

## 🎓 Learning Commands

### Inspect Webhook Requests (Using Ngrok)

```bash
# Open ngrok inspector
open http://127.0.0.1:4040

# Or view requests in terminal
curl http://127.0.0.1:4040/api/requests | jq
```

### Test Ana Locally (Simulate GitHub Actions)

```bash
# Set up test environment
export GITHUB_TOKEN="your-github-token"
export ANA_WEBHOOK_SECRET="your-secret"
export TOD_WEBHOOK_ENDPOINT="http://localhost:3001/webhook/ana-failures"

# Run Ana CLI manually
npx tsx scripts/ana-cli.ts analyze-ci-failures WORKFLOW_RUN_ID PR_NUMBER
```

### Generate Test Payload

```bash
# Create test payload file
cat > test-payload.json << 'EOF'
{
  "summary": "Test webhook",
  "analysisDate": "2025-09-30T12:00:00.000Z",
  "failures": [
    {
      "id": "test-1",
      "type": "ci_failure",
      "content": "Test failure",
      "priority": "medium",
      "createdAt": "2025-09-30T12:00:00.000Z"
    }
  ]
}
EOF

# Send test webhook
curl -X POST http://localhost:3001/webhook/ana-failures \
  -H "Content-Type: application/json" \
  -H "X-Ana-Signature: test-signature" \
  -H "X-Ana-Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  -d @test-payload.json
```

---

## 📚 Quick Reference

### Required Environment Variables

```bash
# .env.local
ANA_WEBHOOK_SECRET="<32-byte-hex-string>"
TOD_WEBHOOK_ENDPOINT="http://localhost:3001/webhook/ana-failures"
NODE_ENV="development"
TOD_WEBHOOK_PORT="3001"
```

### Required GitHub Secrets

```bash
gh secret set ANA_WEBHOOK_SECRET
gh secret set TOD_WEBHOOK_ENDPOINT
gh secret set ORG_PAT  # If not already set
```

### Important URLs

- Tod Webhook: `http://localhost:3001/webhook/ana-failures`
- Health Check: `http://localhost:3001/health`
- Test Endpoint: `http://localhost:3001/test/create-todo`
- Ngrok Inspector: `http://127.0.0.1:4040`

### File Locations

- Tod Server: `scripts/tod-webhook-server.ts`
- Test Script: `scripts/test-tod-integration.ts`
- Ana Workflow: `.github/workflows/ana.yml`
- Environment: `.env.local`

---

**Last Updated**: September 30, 2025  
**For detailed explanation**, see: [TOD-ANA-SETUP-GUIDE.md](./TOD-ANA-SETUP-GUIDE.md)