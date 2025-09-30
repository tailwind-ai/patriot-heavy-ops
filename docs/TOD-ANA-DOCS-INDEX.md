# Tod & Ana Integration Documentation Index

> **Complete guide to setting up secure communication between Tod (Background Agent) and Ana (GitHub Actions)**

## 📚 Documentation Overview

Choose the guide that best fits your needs:

---

### 🚀 [Quick Start Guide](./TOD-ANA-QUICK-START.md)
**Best for**: First-time setup, getting started ASAP

**What's inside**:
- 5-minute setup walkthrough
- Minimal explanations, maximum action
- Essential commands only
- Quick troubleshooting

**Start here if**: You want to get Tod & Ana working immediately.

---

### 📋 [Copy-Paste Setup Commands](./TOD-ANA-COPY-PASTE-SETUP.md)
**Best for**: Copy-paste terminal commands, no thinking required

**What's inside**:
- Complete command-line setup script
- Every command you need to run
- Daily usage commands
- Production deployment commands
- Troubleshooting commands
- Monitoring commands

**Start here if**: You prefer following exact commands rather than explanations.

---

### 📖 [Complete Setup Guide](./TOD-ANA-SETUP-GUIDE.md)
**Best for**: Understanding the full system, production deployments

**What's inside**:
- Detailed explanations of each component
- Security best practices
- Local development setup (ngrok)
- Production deployment options (Vercel, Railway, etc.)
- Comprehensive testing guide
- Monitoring and debugging
- Troubleshooting table

**Start here if**: You want to understand how everything works or are setting up production.

---

### 🔐 [Authentication Flow Guide](./TOD-ANA-AUTH-FLOW.md)
**Best for**: Understanding security, debugging auth issues

**What's inside**:
- Visual diagrams of authentication flow
- Detailed explanation of all 3 keys
- HMAC-SHA256 signature process
- Security properties and protections
- Code references for signature validation
- Auth testing commands
- Secret rotation process

**Start here if**: You want to understand the security model or are debugging authentication errors.

---

## 🎯 Choose Your Path

### I'm a first-time user...
```
1. Read: Quick Start Guide (5 min)
2. Follow: Copy-Paste Setup Commands (10 min)
3. Test: Run integration test
4. Done! ✅
```

### I'm deploying to production...
```
1. Read: Complete Setup Guide (20 min)
2. Read: Authentication Flow Guide (15 min)
3. Follow: Copy-Paste Setup Commands → Production section
4. Test: Verify in production
5. Done! ✅
```

### I have authentication errors...
```
1. Read: Authentication Flow Guide → Common Issues section
2. Follow: Copy-Paste Setup Commands → Troubleshooting section
3. Check: Tod logs and Ana logs
4. Verify: Secrets match between GitHub and Tod
5. Done! ✅
```

### I want to understand the architecture...
```
1. Read: Complete Setup Guide (full)
2. Read: Authentication Flow Guide (full)
3. Review: Code files in /scripts and .github/workflows
4. Done! ✅
```

---

## 🔑 Key Concepts at a Glance

### What is Tod?
- **Tod** = Background Agent webhook server
- Receives failure analysis data from Ana
- Transforms data into Cursor TODOs
- Runs on port 3001 by default

### What is Ana?
- **Ana** = GitHub Actions workflow
- Monitors CI failures, Vercel deploys, Bugbot reviews
- Analyzes failures and extracts actionable items
- Sends webhooks to Tod with failure data

### How do they authenticate?
- **ANA_WEBHOOK_SECRET**: Shared secret for HMAC-SHA256 signatures
- **TOD_WEBHOOK_ENDPOINT**: URL where Tod is accessible
- **Signatures**: Every request is signed and verified

---

## 📊 Quick Reference

### Essential Files

| File | Purpose |
|------|---------|
| `scripts/tod-webhook-server.ts` | Tod webhook server implementation |
| `scripts/test-tod-integration.ts` | Integration test script |
| `.github/workflows/ana.yml` | Ana GitHub Actions workflow |
| `scripts/ana-cli.ts` | Ana command-line interface |
| `.env.local` | Local environment configuration |

### Essential Commands

```bash
# Generate webhook secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Start Tod
npm run tod:webhook

# Expose Tod via ngrok
ngrok http 3001

# Set GitHub secret
echo "your-secret" | gh secret set ANA_WEBHOOK_SECRET

# Test integration
npx tsx scripts/test-tod-integration.ts

# Check Tod health
curl http://localhost:3001/health
```

### Essential Environment Variables

```bash
ANA_WEBHOOK_SECRET="<your-secret>"
TOD_WEBHOOK_ENDPOINT="<your-url>/webhook/ana-failures"
NODE_ENV="development"  # or "production"
```

---

## 🛠️ Common Tasks

### Setup Tod & Ana for the First Time
→ Go to: [Quick Start Guide](./TOD-ANA-QUICK-START.md)

### Deploy to Production
→ Go to: [Complete Setup Guide](./TOD-ANA-SETUP-GUIDE.md) → Production Deployment

### Fix "Invalid Signature" Error
→ Go to: [Authentication Flow Guide](./TOD-ANA-AUTH-FLOW.md) → Common Issues

### Rotate Webhook Secret
→ Go to: [Copy-Paste Setup Commands](./TOD-ANA-COPY-PASTE-SETUP.md) → Security Commands

### Test Authentication
→ Go to: [Authentication Flow Guide](./TOD-ANA-AUTH-FLOW.md) → Testing Authentication

### Monitor Webhook Activity
→ Go to: [Copy-Paste Setup Commands](./TOD-ANA-COPY-PASTE-SETUP.md) → Monitoring Commands

### Understand Security Model
→ Go to: [Authentication Flow Guide](./TOD-ANA-AUTH-FLOW.md) → Security Properties

---

## 🐛 Troubleshooting Decision Tree

```
Problem: Tod & Ana not communicating
│
├─ Error: "Invalid signature"
│  └─ → Authentication Flow Guide → Common Issues
│
├─ Error: "Connection refused"
│  └─ → Copy-Paste Setup Commands → Troubleshooting
│
├─ Error: "404 Not Found"
│  └─ → Quick Start Guide → Step 4 (Check endpoint URL)
│
├─ No error, but TODOs not appearing
│  └─ → Complete Setup Guide → Monitoring & Debugging
│
└─ Ana workflow not triggering
   └─ → Complete Setup Guide → Step 5 (Verify workflow)
```

---

## 📖 Additional Resources

### Related Documentation
- [Environment Variables Guide](./environment-variables.md)
- [Ana CLI Documentation](../scripts/ana-cli.ts) (inline comments)
- [Tod Server Documentation](../scripts/tod-webhook-server.ts) (inline comments)

### GitHub Resources
- [GitHub Actions Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [Webhook Security Best Practices](https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks)

### Tool Documentation
- [Ngrok Documentation](https://ngrok.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)

---

## 🎓 Learning Path

### Beginner Level
1. ✅ Read: Quick Start Guide
2. ✅ Follow: Copy-Paste Setup Commands (Local Development)
3. ✅ Test: Run integration test successfully
4. ✅ Trigger: Ana workflow from GitHub and see TODOs in Cursor

### Intermediate Level
1. ✅ Read: Complete Setup Guide (full)
2. ✅ Understand: Authentication Flow Guide (diagrams)
3. ✅ Deploy: Tod to staging environment
4. ✅ Monitor: Webhook requests via ngrok inspector

### Advanced Level
1. ✅ Read: Authentication Flow Guide (security section)
2. ✅ Deploy: Tod to production (Vercel/Railway)
3. ✅ Implement: Secret rotation process
4. ✅ Monitor: Production webhook activity
5. ✅ Debug: Authentication issues in production

---

## ✅ Setup Checklist

Use this checklist to track your setup progress:

- [ ] Generated webhook secret (32+ bytes)
- [ ] Added `ANA_WEBHOOK_SECRET` to GitHub repository secrets
- [ ] Added `ANA_WEBHOOK_SECRET` to local `.env.local`
- [ ] Started Tod webhook server on port 3001
- [ ] Exposed Tod via ngrok (development) or deployed (production)
- [ ] Added `TOD_WEBHOOK_ENDPOINT` to GitHub repository secrets
- [ ] Ran integration test: `npx tsx scripts/test-tod-integration.ts`
- [ ] Verified health check: `curl http://localhost:3001/health`
- [ ] Triggered Ana workflow from GitHub
- [ ] Saw TODOs created in Cursor
- [ ] Reviewed Tod server logs
- [ ] Reviewed Ana workflow logs in GitHub Actions

**All checked?** 🎉 You're done!

---

## 🆘 Need Help?

1. **Check the guides**: Use the decision tree above to find the right guide
2. **Search for errors**: Use Cmd+F / Ctrl+F to search docs for error messages
3. **Check logs**: Tod server logs and GitHub Actions logs have detailed info
4. **Verify secrets**: Most issues are due to mismatched secrets
5. **Test locally**: Use `test-tod-integration.ts` to verify setup

---

## 📝 Documentation Maintenance

**Last Updated**: September 30, 2025  
**Version**: 1.0.0  
**Maintained by**: Your Team

### Contributing
If you find issues or have improvements:
1. Update the relevant guide(s)
2. Update this index if needed
3. Test your changes
4. Submit a pull request

---

**Quick Links**:
- [Quick Start](./TOD-ANA-QUICK-START.md)
- [Copy-Paste Commands](./TOD-ANA-COPY-PASTE-SETUP.md)
- [Complete Guide](./TOD-ANA-SETUP-GUIDE.md)
- [Authentication Flow](./TOD-ANA-AUTH-FLOW.md)