# Tod & Ana Integration Setup Guide

This guide walks you through setting up secure communication between **Tod** (your Cursor Background Agent) and **Ana** (your GitHub Actions workflow).

## Overview

- **Tod**: Cursor Background Agent webhook server that receives failure analysis data
- **Ana**: GitHub Actions workflow that analyzes CI failures, Vercel deployments, and Cursor Bugbot reviews
- **Communication**: Ana sends webhook POST requests to Tod with HMAC-SHA256 signed payloads

## 🔑 Required Keys & Secrets

You need to set up these authentication secrets to make Tod and Ana communicate securely:

### 1. **ANA_WEBHOOK_SECRET**
A shared secret key used to sign and verify webhook requests between Ana and Tod.

### 2. **TOD_WEBHOOK_ENDPOINT** 
The URL where Tod webhook server is accessible (for Ana to send data to).

### 3. **ORG_PAT** (GitHub Personal Access Token)
Already required by your GitHub Actions for API access.

---

## 📋 Step-by-Step Setup

### **Step 1: Generate a Webhook Secret**

Generate a secure random secret key for webhook authentication:

```bash
# Option 1: Using Node.js (cross-platform)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL (Linux/Mac)
openssl rand -hex 32

# Option 3: Using Python (cross-platform)
python3 -c "import secrets; print(secrets.token_hex(32))"
```

**Example output:**
```
a3f7b2c9d8e1f6a4b7c2d9e3f8a1b6c4d7e2f9a3b8c1d6e4f7a2b9c3d8e1f6a4
```

⚠️ **IMPORTANT**: Save this secret! You'll need it for both GitHub and your Tod server.

---

### **Step 2: Add Secret to GitHub Repository**

Add the webhook secret to your GitHub repository secrets so Ana can use it:

1. **Navigate to your GitHub repository**
   - Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO`

2. **Open Settings → Secrets and Variables**
   - Click on **Settings** tab
   - Click **Secrets and variables** in the left sidebar
   - Click **Actions**

3. **Create New Repository Secret**
   - Click **New repository secret** button
   - **Name**: `ANA_WEBHOOK_SECRET`
   - **Value**: Paste the secret you generated in Step 1
   - Click **Add secret**

4. **Create Tod Webhook Endpoint Secret**
   - Click **New repository secret** again
   - **Name**: `TOD_WEBHOOK_ENDPOINT`
   - **Value**: Your Tod webhook URL (see Step 3 below)
   - Click **Add secret**

**Screenshot reference location:**
```
Repository → Settings → Secrets and variables → Actions → New repository secret
```

---

### **Step 3: Configure Tod Webhook Server**

You have two deployment options for Tod:

#### **Option A: Local Development (Ngrok)**

For development/testing, expose your local Tod server using ngrok:

1. **Start Tod Webhook Server**
   ```bash
   # Set the webhook secret
   export ANA_WEBHOOK_SECRET="a3f7b2c9d8e1f6a4b7c2d9e3f8a1b6c4d7e2f9a3b8c1d6e4f7a2b9c3d8e1f6a4"
   
   # Start Tod server on port 3001
   npm run tod:webhook
   # OR
   npx tsx scripts/tod-webhook-server.ts
   ```

2. **Expose via Ngrok**
   ```bash
   # Install ngrok if not already installed
   # Download from: https://ngrok.com/download
   
   # Expose port 3001
   ngrok http 3001
   ```

3. **Copy the Ngrok URL**
   ```
   Forwarding: https://abc123.ngrok.io -> http://localhost:3001
   ```

4. **Update GitHub Secret**
   - Set `TOD_WEBHOOK_ENDPOINT` to: `https://abc123.ngrok.io/webhook/ana-failures`

#### **Option B: Production Deployment**

Deploy Tod webhook server to a cloud provider:

**Vercel Deployment:**
```bash
# 1. Add webhook route to your Next.js app (already exists)
# File: app/api/webhooks/ana-failures/route.ts

# 2. Add environment variable to Vercel
vercel env add ANA_WEBHOOK_SECRET

# 3. Deploy
vercel --prod

# 4. Your endpoint will be:
# https://your-app.vercel.app/api/webhooks/ana-failures
```

**Railway/Render/Heroku:**
```bash
# 1. Set environment variable
export ANA_WEBHOOK_SECRET="your-secret"

# 2. Start server
npm run tod:webhook

# 3. Configure your platform to expose port 3001

# 4. Your endpoint will be:
# https://your-app.railway.app/webhook/ana-failures
```

---

### **Step 4: Configure Environment Variables**

#### **Local Development (.env.local)**

Create or update your `.env.local` file:

```bash
# Webhook Configuration
ANA_WEBHOOK_SECRET="a3f7b2c9d8e1f6a4b7c2d9e3f8a1b6c4d7e2f9a3b8c1d6e4f7a2b9c3d8e1f6a4"
TOD_WEBHOOK_ENDPOINT="https://abc123.ngrok.io/webhook/ana-failures"

# Development mode (for simpler signature validation)
NODE_ENV="development"

# Port for Tod webhook server
TOD_WEBHOOK_PORT="3001"
```

#### **Production (Vercel/Cloud Provider)**

Add these environment variables to your deployment platform:

| Variable | Value | Description |
|----------|-------|-------------|
| `ANA_WEBHOOK_SECRET` | `<your-secret>` | Shared webhook authentication secret |
| `TOD_WEBHOOK_ENDPOINT` | `<your-url>` | Full webhook URL including path |
| `NODE_ENV` | `production` | Enables HMAC-SHA256 validation |

---

### **Step 5: Verify GitHub Actions Workflow**

Your Ana workflow (`.github/workflows/ana.yml`) should already have the secrets configured:

```yaml
- name: Setup environment
  run: |
    echo "TOD_WEBHOOK_ENDPOINT=${{ secrets.TOD_WEBHOOK_ENDPOINT || 'http://localhost:3001/webhook/ana-failures' }}" >> .env.local
    echo "ANA_WEBHOOK_SECRET=${{ secrets.ANA_WEBHOOK_SECRET || 'dev-secret-key' }}" >> .env.local
  env:
    TOD_WEBHOOK_ENDPOINT: ${{ secrets.TOD_WEBHOOK_ENDPOINT }}
    ANA_WEBHOOK_SECRET: ${{ secrets.ANA_WEBHOOK_SECRET }}
```

This configuration:
✅ Uses GitHub secrets when available
✅ Falls back to development defaults for testing
✅ Passes secrets to your Ana CLI scripts

---

## 🧪 Testing the Integration

### **Test 1: Health Check**

Verify Tod is running:

```bash
curl http://localhost:3001/health

# Expected response:
# {
#   "status": "healthy",
#   "service": "tod-webhook-server",
#   "timestamp": "2025-09-30T12:00:00.000Z"
# }
```

### **Test 2: Manual Webhook Test**

Test the webhook integration locally:

```bash
# Run the test script
npx tsx scripts/test-tod-integration.ts

# Expected output:
# 🧪 Testing Tod Webhook Integration
#    Target: http://localhost:3001
#    Failures: 3
# 
# 1️⃣ Testing health check...
#    ✅ Health check passed: healthy
# 
# 2️⃣ Testing Ana webhook endpoint...
#    ✅ Webhook processed successfully
#    📋 TODOs created: 3
# 
# 3️⃣ Testing individual TODO creation...
#    ✅ Test TODO created: Fix TypeScript compilation error in components/us...
# 
# 🎉 All tests passed! Tod webhook integration is working.
```

### **Test 3: Trigger Ana from GitHub**

Trigger Ana workflow by:

1. **Push a branch with failing tests** → Ana analyzes CI failures
2. **Wait for Cursor Bugbot review** → Ana analyzes Bugbot comments
3. **Check GitHub Actions logs** → See Ana webhook calls

---

## 🔒 Security Best Practices

### **1. Secret Rotation**
Rotate your webhook secret periodically:

```bash
# Generate new secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update GitHub secret (Step 2)
# Update Tod environment variable
# Restart Tod server
```

### **2. Signature Validation**

Tod validates Ana requests using HMAC-SHA256:

```typescript
// Production mode (NODE_ENV=production)
// - Uses HMAC-SHA256 signature validation
// - Verifies timestamp freshness (5 minutes)
// - Uses timing-safe comparison

// Development mode (NODE_ENV=development)  
// - Uses simpler validation for testing
// - Still checks timestamp and signature format
```

### **3. HTTPS Only in Production**

⚠️ **Never use HTTP in production!**

```bash
# ❌ Bad (exposes secrets)
TOD_WEBHOOK_ENDPOINT="http://your-server.com/webhook/ana-failures"

# ✅ Good (encrypted)
TOD_WEBHOOK_ENDPOINT="https://your-server.com/webhook/ana-failures"
```

### **4. Network Restrictions**

For production deployment, consider:
- Restricting webhook endpoint to GitHub IPs
- Using VPC/private networking
- Implementing rate limiting

---

## 📊 Monitoring & Debugging

### **View Tod Logs**

```bash
# Tod logs show webhook activity
npm run tod:webhook

# Look for:
# 📥 Received 3 failures from Ana
#    Summary: CI Test workflow failed with 3 issues
#    PR: #284
# 📋 Creating 3 TODOs in Cursor...
#   📝 TODO: Fix TypeScript compilation error...
#      Priority: high
#      Files: components/user-auth-form.tsx
# ✅ Successfully created 3 TODOs in Cursor
```

### **View Ana Logs**

Check GitHub Actions logs:

```
Repository → Actions → Ana workflow → View logs

Look for:
🔍 Ana analyzing CI Test failures...
Event: workflow_run
Run ID: 12345678
PR: 284
Webhook Endpoint: https://abc123.ngrok.io/webhook/ana-failures
✅ Successfully sent 3 failures to Tod webhook
```

### **Common Issues**

| Issue | Cause | Solution |
|-------|-------|----------|
| `Invalid signature` | Secret mismatch | Verify secrets match in GitHub and Tod |
| `Timestamp too old` | Request delay > 5 min | Check network connectivity |
| `Connection refused` | Tod not running | Start Tod server |
| `404 Not Found` | Wrong endpoint URL | Verify `TOD_WEBHOOK_ENDPOINT` path |
| `Missing secret` | Environment not loaded | Check `.env.local` or deployment vars |

---

## 🎯 Quick Reference

### **Environment Variables Summary**

| Variable | Location | Required | Default |
|----------|----------|----------|---------|
| `ANA_WEBHOOK_SECRET` | GitHub Secrets | ✅ | `dev-secret-key` |
| `ANA_WEBHOOK_SECRET` | Tod Server | ✅ | `dev-secret-key` |
| `TOD_WEBHOOK_ENDPOINT` | GitHub Secrets | ✅ | `http://localhost:3001/webhook/ana-failures` |
| `NODE_ENV` | Tod Server | Recommended | `development` |
| `TOD_WEBHOOK_PORT` | Tod Server | Optional | `3001` |

### **Key Endpoints**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/webhook/ana-failures` | POST | Receive Ana data (production) |
| `/test/create-todo` | POST | Test TODO creation |

### **Useful Commands**

```bash
# Generate webhook secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Start Tod server
export ANA_WEBHOOK_SECRET="your-secret"
npm run tod:webhook

# Test integration
npx tsx scripts/test-tod-integration.ts

# Expose local server
ngrok http 3001

# View GitHub secrets
gh secret list

# Set GitHub secret
gh secret set ANA_WEBHOOK_SECRET < secret.txt
```

---

## 📚 Related Files

- **Tod Server**: `scripts/tod-webhook-server.ts`
- **Tod Tests**: `scripts/test-tod-integration.ts`
- **Ana Workflow**: `.github/workflows/ana.yml`
- **Ana CLI**: `scripts/ana-cli.ts`
- **Next.js Webhook**: `app/api/webhooks/ana-failures/route.ts`
- **Environment Config**: `env.mjs`
- **Documentation**: `docs/environment-variables.md`

---

## ✅ Setup Checklist

- [ ] Generate webhook secret (32+ bytes hex)
- [ ] Add `ANA_WEBHOOK_SECRET` to GitHub repository secrets
- [ ] Add `TOD_WEBHOOK_ENDPOINT` to GitHub repository secrets
- [ ] Create `.env.local` with webhook configuration
- [ ] Start Tod webhook server
- [ ] (Optional) Expose via ngrok for development
- [ ] Run test script: `npx tsx scripts/test-tod-integration.ts`
- [ ] Verify health check: `curl http://localhost:3001/health`
- [ ] Trigger Ana workflow and check logs
- [ ] Verify TODOs appear in Cursor

---

## 🆘 Need Help?

If you encounter issues:

1. Check Tod server logs
2. Check GitHub Actions logs (Ana workflow)
3. Verify secrets match between GitHub and Tod
4. Test webhook endpoint accessibility
5. Ensure Tod server is running and reachable

**Common gotchas:**
- Ngrok URLs expire (free tier) - regenerate and update GitHub secret
- Secrets must be identical between GitHub and Tod
- Tod server must be running before Ana sends webhooks
- Firewall/network may block incoming webhook requests

---

**Last Updated**: September 30, 2025
**Version**: 1.0.0