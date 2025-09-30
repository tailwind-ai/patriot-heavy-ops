# Getting Started with Tod & Ana

## 🎉 Welcome!

You've successfully set up **Tod** (your Cursor Background Agent) and **Ana** (your GitHub Actions workflow) integration! This document will help you get started.

## 📚 Documentation Created

I've created comprehensive documentation to help you set up the keys and get Tod & Ana communicating:

### 🚀 Quick Reference

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [**Documentation Index**](./docs/TOD-ANA-DOCS-INDEX.md) | Navigation hub | Start here! Find the right guide |
| [**Quick Start**](./docs/TOD-ANA-QUICK-START.md) | 5-minute setup | First-time setup |
| [**Copy-Paste Commands**](./docs/TOD-ANA-COPY-PASTE-SETUP.md) | All terminal commands | Following exact steps |
| [**Complete Guide**](./docs/TOD-ANA-SETUP-GUIDE.md) | Full documentation | Understanding & production |
| [**Auth Flow**](./docs/TOD-ANA-AUTH-FLOW.md) | Security deep dive | Authentication issues |
| [**Cheat Sheet**](./docs/TOD-ANA-CHEAT-SHEET.md) | One-page reference | Quick lookups |
| [**Visual Guide**](./docs/TOD-ANA-VISUAL-GUIDE.md) | Diagrams & visuals | Understanding flow |

### 📖 Also Created

- [**Setup Summary**](./TOD-ANA-SETUP-SUMMARY.md) - Complete overview of all documentation
- [**Docs README**](./docs/README.md) - Documentation index with all project docs

---

## 🔑 Understanding the Keys

You need **3 keys** to make Tod and Ana communicate securely:

### 1. **ANA_WEBHOOK_SECRET**
- **What**: A 32-byte random hex string (e.g., `a3f7b2c9d8e1f6a4b7c2...`)
- **Purpose**: Signs and verifies webhook requests using HMAC-SHA256
- **Where to store**: 
  - ✅ GitHub repository secrets (for Ana)
  - ✅ Tod server `.env.local` (for Tod)
- **Critical**: Must be **IDENTICAL** in both places!

### 2. **TOD_WEBHOOK_ENDPOINT**
- **What**: Full URL where Tod is accessible
- **Purpose**: Tells Ana where to send webhook POST requests
- **Where to store**: 
  - ✅ GitHub repository secrets (for Ana)
- **Examples**:
  - Development: `https://abc123.ngrok.io/webhook/ana-failures`
  - Production: `https://your-app.vercel.app/api/webhooks/ana-failures`

### 3. **ORG_PAT** (GitHub Personal Access Token)
- **What**: GitHub PAT with repo/workflow/PR read permissions
- **Purpose**: Allows Ana to read GitHub data (logs, PRs, comments)
- **Where to store**: 
  - ✅ GitHub repository secrets
- **Status**: You likely already have this set up!

---

## ⚡ Quick Setup (10 Minutes)

Follow these steps to get Tod & Ana working:

### Step 1: Generate Webhook Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
📋 **Copy the output** - you'll need it in the next steps!

### Step 2: Add to GitHub Secrets
Using GitHub CLI:
```bash
echo "YOUR_SECRET_HERE" | gh secret set ANA_WEBHOOK_SECRET
```

Or manually:
1. Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`
2. Click "New repository secret"
3. Name: `ANA_WEBHOOK_SECRET`
4. Value: Paste your secret
5. Click "Add secret"

### Step 3: Configure Local Environment
Create/update `.env.local`:
```bash
ANA_WEBHOOK_SECRET="YOUR_SECRET_HERE"
TOD_WEBHOOK_ENDPOINT="http://localhost:3001/webhook/ana-failures"
NODE_ENV="development"
```

### Step 4: Start Tod Server
```bash
npm run tod:webhook
```

### Step 5: Expose with Ngrok
```bash
ngrok http 3001
```
📋 **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

### Step 6: Update GitHub Secret
```bash
echo "https://YOUR_NGROK_URL/webhook/ana-failures" | gh secret set TOD_WEBHOOK_ENDPOINT
```

### Step 7: Test It
```bash
npx tsx scripts/test-tod-integration.ts
```

✅ **Expected**: "All tests passed!" = Success! 🎉

---

## 📖 Where to Go Next

### I Just Want to Get Started
→ Follow the [**Quick Start Guide**](./docs/TOD-ANA-QUICK-START.md)

### I Want Step-by-Step Commands
→ Follow the [**Copy-Paste Setup Commands**](./docs/TOD-ANA-COPY-PASTE-SETUP.md)

### I Want to Understand Everything
→ Read the [**Complete Setup Guide**](./docs/TOD-ANA-SETUP-GUIDE.md)

### I Have Authentication Errors
→ Check the [**Authentication Flow Guide**](./docs/TOD-ANA-AUTH-FLOW.md)

### I Need a Quick Reference
→ Use the [**Cheat Sheet**](./docs/TOD-ANA-CHEAT-SHEET.md)

### I'm Not Sure Where to Start
→ Visit the [**Documentation Index**](./docs/TOD-ANA-DOCS-INDEX.md)

---

## 🎯 What Tod & Ana Do

### Ana (GitHub Actions Workflow)
**Monitors**:
- CI test failures
- Vercel deployment failures  
- Cursor Bugbot code reviews

**Analyzes**:
- Extracts error messages
- Identifies affected files
- Determines root causes
- Suggests fixes
- Prioritizes issues

**Sends**:
- Webhook POST requests to Tod
- Signed with HMAC-SHA256
- Contains structured failure data

### Tod (Cursor Background Agent)
**Receives**:
- Webhook POST requests from Ana
- Validates HMAC-SHA256 signatures
- Checks timestamp freshness

**Transforms**:
- Ana failure data → Cursor TODO format
- Preserves file paths, line numbers, priorities
- Adds metadata (root cause, fixes, components)

**Creates**:
- Native Cursor TODOs in your IDE
- Shows up in Cursor's TODO list
- Actionable items for developers

### Result
**You see**:
- TODOs appear automatically in Cursor
- Each TODO has context (files, lines, fixes)
- Prioritized by severity (critical → low)
- No manual triage needed!

---

## 🔐 How Authentication Works

```
Ana creates payload → Signs with secret → Sends webhook
                                               ↓
                                         Tod receives
                                               ↓
                                    Verifies signature
                                               ↓
                                      Checks timestamp
                                               ↓
                                        Valid? ✅
                                               ↓
                                    Creates Cursor TODOs
```

**Security Features**:
- ✅ HMAC-SHA256 signatures prevent forgery
- ✅ Timestamp validation prevents replay attacks
- ✅ Timing-safe comparison prevents timing attacks
- ✅ HTTPS encryption (in production) protects data

---

## 🐛 Common Issues

| Problem | Quick Fix |
|---------|-----------|
| **"Invalid signature"** | Check secrets match: `cat .env.local \| grep ANA` and `gh secret list` |
| **"Connection refused"** | Start Tod: `npm run tod:webhook` |
| **"404 Not Found"** | Verify URL ends with `/webhook/ana-failures` |
| **Tests fail** | Ensure Tod is running before running tests |
| **No TODOs appear** | Check Tod logs and Ana workflow logs |

**Detailed troubleshooting**: See [Authentication Flow Guide](./docs/TOD-ANA-AUTH-FLOW.md#-common-authentication-issues)

---

## 📁 Key Files in Your Codebase

| File | What It Does |
|------|--------------|
| `scripts/tod-webhook-server.ts` | Tod webhook server implementation |
| `scripts/test-tod-integration.ts` | Integration test script |
| `.github/workflows/ana.yml` | Ana workflow configuration |
| `scripts/ana-cli.ts` | Ana command-line interface |
| `.env.local` | Local environment variables |
| `app/api/webhooks/ana-failures/route.ts` | Next.js webhook endpoint (alternative) |

---

## ✅ Verification Checklist

After setup, verify everything works:

```bash
# 1. Check secrets are set
gh secret list
# Should show: ANA_WEBHOOK_SECRET, TOD_WEBHOOK_ENDPOINT

# 2. Check Tod is running
curl http://localhost:3001/health
# Should return: {"status":"healthy"}

# 3. Run integration test
npx tsx scripts/test-tod-integration.ts
# Should show: "All tests passed!"

# 4. Check Tod logs
# Terminal where Tod is running should show webhook activity

# 5. Trigger Ana workflow
# Push failing tests or wait for Bugbot review
# Check GitHub Actions logs

# 6. Verify TODOs in Cursor
# Open Cursor and check TODO list
```

---

## 🎓 Learning Path

### Beginner
1. ✅ Read Quick Start Guide
2. ✅ Follow setup steps
3. ✅ Run integration test
4. ✅ Trigger Ana workflow

### Intermediate  
1. ✅ Read Complete Setup Guide
2. ✅ Understand Auth Flow Guide
3. ✅ Deploy Tod to staging
4. ✅ Monitor webhook requests

### Advanced
1. ✅ Deploy Tod to production
2. ✅ Implement secret rotation
3. ✅ Set up monitoring/alerting
4. ✅ Customize Ana analysis logic

---

## 🆘 Need Help?

1. **Check the documentation**: Use the [Documentation Index](./docs/TOD-ANA-DOCS-INDEX.md)
2. **Search for errors**: Use Cmd+F to search docs for error messages
3. **Check logs**: Tod server logs and GitHub Actions logs have details
4. **Verify secrets**: Most issues are due to mismatched secrets
5. **Test locally**: Use the integration test to verify setup

---

## 🚀 Next Steps

After successful setup:

1. **Trigger Ana**: Push code with failing tests or wait for Bugbot
2. **Monitor Tod**: Watch Tod logs for webhook activity
3. **Check Cursor**: See TODOs appear in Cursor UI
4. **Review logs**: Check Ana workflow logs in GitHub Actions
5. **Deploy to production**: Follow production deployment guide
6. **Set up monitoring**: Track webhook success/failure rates

---

## 📚 Full Documentation Links

- [Documentation Index](./docs/TOD-ANA-DOCS-INDEX.md) - Start here
- [Quick Start Guide](./docs/TOD-ANA-QUICK-START.md) - 5 minutes
- [Copy-Paste Commands](./docs/TOD-ANA-COPY-PASTE-SETUP.md) - Terminal commands
- [Complete Setup Guide](./docs/TOD-ANA-SETUP-GUIDE.md) - Full details
- [Authentication Flow](./docs/TOD-ANA-AUTH-FLOW.md) - Security
- [Cheat Sheet](./docs/TOD-ANA-CHEAT-SHEET.md) - Quick reference
- [Visual Guide](./docs/TOD-ANA-VISUAL-GUIDE.md) - Diagrams
- [Setup Summary](./TOD-ANA-SETUP-SUMMARY.md) - Complete overview

---

**Ready to start?** 🚀  
Begin with the [**Quick Start Guide**](./docs/TOD-ANA-QUICK-START.md)!

---

**Created**: September 30, 2025  
**Version**: 1.0.0  
**Status**: Ready to use ✅