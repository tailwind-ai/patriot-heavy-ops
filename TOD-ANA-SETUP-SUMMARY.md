# Tod & Ana Setup - Complete Documentation Summary

## 🎉 Documentation Created Successfully!

I've created a comprehensive set of guides to help you set up secure communication between **Tod** (your Cursor Background Agent) and **Ana** (your GitHub Actions workflow).

## 📚 What Was Created

### 1. **[Documentation Index](./docs/TOD-ANA-DOCS-INDEX.md)** - Your Starting Point
Central hub with:
- Overview of all guides
- "Choose your path" decision trees
- Quick reference section
- Troubleshooting decision tree
- Setup checklist

### 2. **[Quick Start Guide](./docs/TOD-ANA-QUICK-START.md)** - 5 Minutes to Success
Perfect for first-time setup:
- 5-step setup process
- Minimal explanations
- Quick troubleshooting
- Most essential commands only

### 3. **[Copy-Paste Setup Commands](./docs/TOD-ANA-COPY-PASTE-SETUP.md)** - No Thinking Required
Complete command reference:
- Step-by-step terminal commands
- Every command you'll need
- Daily workflow commands
- Production deployment scripts
- Troubleshooting commands
- Monitoring commands

### 4. **[Complete Setup Guide](./docs/TOD-ANA-SETUP-GUIDE.md)** - The Full Story
Comprehensive documentation:
- Detailed explanations of all components
- Local development setup (ngrok)
- Production deployment options (Vercel, Railway, etc.)
- Security best practices
- Testing strategies
- Monitoring and debugging
- Comprehensive troubleshooting

### 5. **[Authentication Flow Guide](./docs/TOD-ANA-AUTH-FLOW.md)** - Understanding Security
Deep dive into authentication:
- Visual diagrams of auth flow
- Detailed explanation of all 3 keys
- HMAC-SHA256 signature process
- Security properties and protections
- Testing authentication
- Secret rotation process
- Common auth issues and fixes

### 6. **[Cheat Sheet](./docs/TOD-ANA-CHEAT-SHEET.md)** - One-Page Reference
Quick reference card:
- Essential commands
- Configuration examples
- Common tasks
- Troubleshooting table
- File locations

### 7. **[Docs README](./docs/README.md)** - Documentation Hub
Updated docs index with:
- Links to all Tod & Ana guides
- Quick links by task
- Documentation standards

---

## 🔑 The Three Keys You Need

Understanding the authentication system is crucial. Here's what you need:

### 1. **ANA_WEBHOOK_SECRET**
- **What**: A 32+ byte random hex string (shared secret)
- **Purpose**: Signs and verifies webhook requests using HMAC-SHA256
- **Where**: GitHub repository secrets + Tod server `.env.local`
- **Critical**: MUST be identical in both places

### 2. **TOD_WEBHOOK_ENDPOINT**
- **What**: Full URL to Tod's webhook endpoint
- **Purpose**: Tells Ana where to send webhook POST requests
- **Where**: GitHub repository secrets only
- **Examples**: 
  - Dev: `https://abc123.ngrok.io/webhook/ana-failures`
  - Prod: `https://your-app.vercel.app/api/webhooks/ana-failures`

### 3. **ORG_PAT** (Already Required)
- **What**: GitHub Personal Access Token
- **Purpose**: Allows Ana to read GitHub data (logs, PRs, comments)
- **Where**: GitHub repository secrets
- **Permissions**: `repo`, `workflow`, `pull_request`

---

## 🚀 Quick Setup Path

Follow these steps to get Tod & Ana working in 10 minutes:

### Step 1: Generate Secret (30 seconds)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output (looks like: `a3f7b2c9d8e1f6a4b7c2d9e3...`)

### Step 2: Add to GitHub (2 minutes)
```bash
# Using GitHub CLI (fastest)
echo "YOUR_SECRET" | gh secret set ANA_WEBHOOK_SECRET

# Or manually: Repo → Settings → Secrets and variables → Actions
```

### Step 3: Configure Local Environment (1 minute)
```bash
# Create/update .env.local
cat >> .env.local << 'EOF'
ANA_WEBHOOK_SECRET="YOUR_SECRET_HERE"
TOD_WEBHOOK_ENDPOINT="http://localhost:3001/webhook/ana-failures"
NODE_ENV="development"
EOF
```

### Step 4: Start Tod & Ngrok (2 minutes)
```bash
# Terminal 1: Start Tod
npm run tod:webhook

# Terminal 2: Expose with ngrok
ngrok http 3001
```

Copy the ngrok URL and update GitHub:
```bash
echo "https://abc123.ngrok.io/webhook/ana-failures" | gh secret set TOD_WEBHOOK_ENDPOINT
```

### Step 5: Test It (30 seconds)
```bash
npx tsx scripts/test-tod-integration.ts
```

✅ See "All tests passed!" = Success! 🎉

---

## 📖 How to Use This Documentation

### For First-Time Setup
```
1. Start: Quick Start Guide (5 min read)
2. Follow: Copy-Paste Setup Commands (10 min execution)
3. Test: Run integration test
4. Done! ✅
```

### For Production Deployment
```
1. Read: Complete Setup Guide (20 min)
2. Review: Authentication Flow Guide (15 min)
3. Deploy: Follow production deployment section
4. Test: Verify in production
5. Done! ✅
```

### For Troubleshooting
```
1. Check: Cheat Sheet troubleshooting table
2. Read: Authentication Flow Guide → Common Issues
3. Run: Copy-Paste Setup Commands → Troubleshooting section
4. Review: Tod logs and Ana logs
5. Done! ✅
```

---

## 🔐 How Authentication Works

### High-Level Flow
```
1. Ana analyzes failures (CI, Vercel, Bugbot)
   ↓
2. Ana creates payload with failure data
   ↓
3. Ana signs payload with HMAC-SHA256 using ANA_WEBHOOK_SECRET
   ↓
4. Ana sends POST request to TOD_WEBHOOK_ENDPOINT with signature
   ↓
5. Tod receives request and verifies signature
   ↓
6. Tod checks timestamp (must be < 5 minutes old)
   ↓
7. If valid: Tod transforms data to Cursor TODOs
   ↓
8. TODOs appear in Cursor UI for developer
```

### Security Properties
✅ **Protects against**: Forged requests, replay attacks, tampering, timing attacks  
✅ **Requires**: HTTPS in production, strong secret, secret confidentiality  
✅ **Validates**: HMAC-SHA256 signature + timestamp freshness

---

## 🎯 Your Existing Setup

I analyzed your codebase and found:

### ✅ Already Implemented
- **Tod webhook server**: `scripts/tod-webhook-server.ts`
- **Tod test script**: `scripts/test-tod-integration.ts`
- **Ana workflow**: `.github/workflows/ana.yml`
- **Ana CLI**: `scripts/ana-cli.ts`
- **Next.js webhook route**: `app/api/webhooks/ana-failures/route.ts`
- **Environment config**: `env.mjs` with secret validation
- **Webhook client**: `lib/ana/webhook-client.ts`

### ⚠️ Needs Configuration
- **GitHub secrets**: `ANA_WEBHOOK_SECRET` and `TOD_WEBHOOK_ENDPOINT`
- **Local environment**: `.env.local` with secrets
- **Tod server**: Needs to be running (port 3001)
- **Ngrok/Deployment**: Tod needs to be accessible to GitHub

---

## 📊 What Happens When It Works

### Trigger: CI Test Fails
```
1. GitHub Actions runs CI tests
2. Tests fail with errors
3. Ana workflow triggers automatically
4. Ana analyzes failure logs
5. Ana extracts actionable items
6. Ana sends webhook to Tod
7. Tod creates Cursor TODOs
8. You see TODOs in Cursor UI with:
   - Error description
   - Affected files
   - Line numbers
   - Root cause analysis
   - Suggested fix
   - Priority level
```

### Trigger: Cursor Bugbot Review
```
1. Cursor Bugbot posts PR review
2. Ana workflow triggers on review event
3. Ana parses Bugbot comments
4. Ana extracts code quality issues
5. Ana sends webhook to Tod
6. Tod creates Cursor TODOs
7. You see TODOs with Bugbot suggestions
```

---

## 🛠️ Daily Usage

### Starting Your Dev Environment
```bash
# Terminal 1: Start Tod
cd /your/project
source .env.local
npm run tod:webhook

# Terminal 2: Start Ngrok (if URL changed)
ngrok http 3001
# Copy URL, update GitHub secret if needed

# Terminal 3: Regular development
npm run dev
```

### When Ngrok URL Changes (Free Tier)
```bash
# Ngrok free tier URLs expire on restart
# Update GitHub secret with new URL:
echo "https://NEW_URL/webhook/ana-failures" | gh secret set TOD_WEBHOOK_ENDPOINT
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **"Invalid signature"** | Verify secrets match in GitHub and `.env.local` |
| **"Connection refused"** | Start Tod: `npm run tod:webhook` |
| **"404 Not Found"** | Check endpoint URL includes `/webhook/ana-failures` |
| **"Timestamp too old"** | Request took > 5 min, check network |
| **Tests fail** | Ensure Tod is running before tests |
| **No TODOs appear** | Check Tod logs and Ana workflow logs |

### Debug Commands
```bash
# Check Tod is running
curl http://localhost:3001/health

# Check secrets
cat .env.local | grep ANA_WEBHOOK_SECRET
gh secret list

# View logs
gh run list --workflow=ana.yml
gh run view LATEST_RUN_ID --log

# Test integration
npx tsx scripts/test-tod-integration.ts
```

---

## 📁 File Reference

| File | Purpose |
|------|---------|
| `scripts/tod-webhook-server.ts` | Tod server implementation |
| `scripts/test-tod-integration.ts` | Integration test script |
| `.github/workflows/ana.yml` | Ana workflow configuration |
| `scripts/ana-cli.ts` | Ana command-line interface |
| `.env.local` | Local environment variables |
| `app/api/webhooks/ana-failures/route.ts` | Next.js webhook endpoint |
| `lib/ana/webhook-client.ts` | Ana webhook client with signature generation |

---

## ✅ Setup Checklist

Use this checklist to track your progress:

- [ ] Read Quick Start Guide
- [ ] Generated webhook secret (32+ bytes)
- [ ] Added `ANA_WEBHOOK_SECRET` to GitHub repository secrets
- [ ] Added `ANA_WEBHOOK_SECRET` to local `.env.local`
- [ ] Added `TOD_WEBHOOK_ENDPOINT` to GitHub repository secrets
- [ ] Started Tod webhook server on port 3001
- [ ] Exposed Tod via ngrok (development) or deployed (production)
- [ ] Ran health check: `curl http://localhost:3001/health`
- [ ] Ran integration test: `npx tsx scripts/test-tod-integration.ts`
- [ ] Triggered Ana workflow from GitHub
- [ ] Verified TODOs created in Cursor
- [ ] Reviewed Tod server logs for webhook activity
- [ ] Reviewed Ana workflow logs in GitHub Actions

---

## 🎓 Next Steps

### After Initial Setup
1. ✅ Run integration test to verify everything works
2. ✅ Trigger Ana by pushing a branch with failing tests
3. ✅ Check Tod logs to see webhook activity
4. ✅ Verify TODOs appear in Cursor
5. ✅ Review Ana workflow logs in GitHub Actions

### For Production
1. ✅ Deploy Tod to Vercel/Railway/etc.
2. ✅ Update `TOD_WEBHOOK_ENDPOINT` with production URL
3. ✅ Set `NODE_ENV=production` for HMAC-SHA256 validation
4. ✅ Test webhook in production environment
5. ✅ Set up monitoring and alerting

### For Understanding
1. ✅ Read Complete Setup Guide for full context
2. ✅ Read Authentication Flow Guide for security details
3. ✅ Review code in `scripts/tod-webhook-server.ts`
4. ✅ Review Ana workflow in `.github/workflows/ana.yml`
5. ✅ Understand HMAC-SHA256 signature validation

---

## 📚 Documentation Quick Links

**Start Here**: [Documentation Index](./docs/TOD-ANA-DOCS-INDEX.md)

**Setup Guides**:
- [Quick Start Guide](./docs/TOD-ANA-QUICK-START.md) - 5 minutes
- [Copy-Paste Setup](./docs/TOD-ANA-COPY-PASTE-SETUP.md) - All commands
- [Complete Setup Guide](./docs/TOD-ANA-SETUP-GUIDE.md) - Full details

**Reference**:
- [Authentication Flow](./docs/TOD-ANA-AUTH-FLOW.md) - Security deep dive
- [Cheat Sheet](./docs/TOD-ANA-CHEAT-SHEET.md) - One-page reference

**Other Docs**:
- [Environment Variables](./docs/environment-variables.md) - General config
- [Docs Index](./docs/README.md) - All documentation

---

## 🎉 You're Ready to Go!

You now have:
✅ Complete understanding of Tod & Ana integration  
✅ Step-by-step setup instructions  
✅ Security and authentication knowledge  
✅ Troubleshooting guidance  
✅ Production deployment options  
✅ Daily usage workflows  

**Next action**: Follow the [Quick Start Guide](./docs/TOD-ANA-QUICK-START.md) to get Tod & Ana working!

---

## 🆘 Need Help?

1. **Setup questions**: Check [Quick Start Guide](./docs/TOD-ANA-QUICK-START.md)
2. **Command reference**: Check [Copy-Paste Setup](./docs/TOD-ANA-COPY-PASTE-SETUP.md)
3. **Authentication errors**: Check [Auth Flow Guide](./docs/TOD-ANA-AUTH-FLOW.md)
4. **Production deployment**: Check [Complete Guide](./docs/TOD-ANA-SETUP-GUIDE.md)
5. **Quick lookup**: Check [Cheat Sheet](./docs/TOD-ANA-CHEAT-SHEET.md)

---

**Created**: September 30, 2025  
**Version**: 1.0.0  
**Status**: Ready for use ✅