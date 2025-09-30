# Tod & Ana Quick Start Guide

> **TL;DR**: Get Tod (Background Agent) and Ana (GitHub Actions) talking in 5 minutes

## 🚀 Super Quick Setup

### 1️⃣ Generate Secret (30 seconds)

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (looks like: `a3f7b2c9d8e1f6a4...`)

### 2️⃣ Add to GitHub (2 minutes)

Go to: **Your Repo → Settings → Secrets and variables → Actions**

Add these secrets:

| Name | Value |
|------|-------|
| `ANA_WEBHOOK_SECRET` | The secret you just generated |
| `TOD_WEBHOOK_ENDPOINT` | `https://your-ngrok-url.ngrok.io/webhook/ana-failures` |

### 3️⃣ Configure Local Environment (1 minute)

Create/update `.env.local`:

```bash
ANA_WEBHOOK_SECRET="a3f7b2c9d8e1f6a4b7c2d9e3f8a1b6c4d7e2f9a3b8c1d6e4f7a2b9c3d8e1f6a4"
TOD_WEBHOOK_ENDPOINT="http://localhost:3001/webhook/ana-failures"
NODE_ENV="development"
```

### 4️⃣ Start Tod & Ngrok (1 minute)

**Terminal 1 - Start Tod:**
```bash
export ANA_WEBHOOK_SECRET="your-secret-here"
npm run tod:webhook
```

**Terminal 2 - Expose with Ngrok:**
```bash
ngrok http 3001
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and update GitHub secret `TOD_WEBHOOK_ENDPOINT` to: `https://abc123.ngrok.io/webhook/ana-failures`

### 5️⃣ Test It (30 seconds)

```bash
npx tsx scripts/test-tod-integration.ts
```

✅ See "All tests passed!" = You're done! 🎉

---

## 🎯 What You Just Set Up

```
GitHub Actions (Ana)     →     Tod Webhook Server     →     Cursor TODOs
     ↓                              ↓                           ↓
Analyzes failures          Receives webhook              Creates TODOs
Signs with secret          Validates signature           in Cursor UI
Sends POST request         Transforms data               for developer
```

---

## 📋 Quick Commands

```bash
# Generate new secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Start Tod
npm run tod:webhook

# Test integration
npx tsx scripts/test-tod-integration.ts

# Check health
curl http://localhost:3001/health

# Start ngrok
ngrok http 3001

# View GitHub secrets
gh secret list

# Set GitHub secret via CLI
echo "your-secret" | gh secret set ANA_WEBHOOK_SECRET
```

---

## 🐛 Quick Troubleshooting

| Problem | Fix |
|---------|-----|
| "Invalid signature" | Check secrets match in GitHub & `.env.local` |
| "Connection refused" | Start Tod server: `npm run tod:webhook` |
| "404 Not Found" | Check endpoint URL includes `/webhook/ana-failures` |
| Tests fail | Make sure Tod is running first |

---

## 📚 Full Documentation

See [TOD-ANA-SETUP-GUIDE.md](./TOD-ANA-SETUP-GUIDE.md) for:
- Security best practices
- Production deployment
- Monitoring & debugging
- Architecture details

---

**Need help?** Check Tod server logs and GitHub Actions logs for details.