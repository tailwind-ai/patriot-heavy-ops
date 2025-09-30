# Tod & Ana Cheat Sheet

> **One-page reference for Tod & Ana integration**

## 🔑 The 3 Keys You Need

| Key | Where to Store | Purpose |
|-----|----------------|---------|
| `ANA_WEBHOOK_SECRET` | GitHub Secrets + Tod `.env.local` | Signs/verifies webhooks (MUST MATCH!) |
| `TOD_WEBHOOK_ENDPOINT` | GitHub Secrets | URL where Tod is accessible |
| `ORG_PAT` | GitHub Secrets | GitHub API access for Ana |

---

## ⚡ Quick Setup (5 Commands)

```bash
# 1. Generate secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Add to .env.local (replace YOUR_SECRET)
echo 'ANA_WEBHOOK_SECRET="YOUR_SECRET"' >> .env.local

# 3. Add to GitHub (replace YOUR_SECRET)
echo "YOUR_SECRET" | gh secret set ANA_WEBHOOK_SECRET

# 4. Start Tod
npm run tod:webhook

# 5. Test it
npx tsx scripts/test-tod-integration.ts
```

---

## 📋 Essential Commands

### Setup
```bash
# Generate secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Set GitHub secret
echo "your-secret" | gh secret set ANA_WEBHOOK_SECRET
echo "https://your-url/webhook/ana-failures" | gh secret set TOD_WEBHOOK_ENDPOINT

# List secrets
gh secret list
```

### Running Tod
```bash
# Start Tod server
npm run tod:webhook

# Or directly
npx tsx scripts/tod-webhook-server.ts

# With custom port
export TOD_WEBHOOK_PORT=3002
npm run tod:webhook
```

### Testing
```bash
# Run integration test
npx tsx scripts/test-tod-integration.ts

# Health check
curl http://localhost:3001/health

# Test with ngrok URL
curl https://your-ngrok-url.ngrok.io/health
```

### Ngrok
```bash
# Expose Tod
ngrok http 3001

# Copy URL and update GitHub
echo "https://abc123.ngrok.io/webhook/ana-failures" | gh secret set TOD_WEBHOOK_ENDPOINT
```

### Monitoring
```bash
# View Ana runs
gh run list --workflow=ana.yml

# View specific run
gh run view RUN_ID --log

# Ngrok inspector
open http://127.0.0.1:4040
```

---

## 🔧 Configuration Files

### `.env.local`
```bash
ANA_WEBHOOK_SECRET="a3f7b2c9d8e1f6a4b7c2d9e3f8a1b6c4d7e2f9a3b8c1d6e4f7a2b9c3d8e1f6a4"
TOD_WEBHOOK_ENDPOINT="http://localhost:3001/webhook/ana-failures"
NODE_ENV="development"
TOD_WEBHOOK_PORT="3001"
```

### GitHub Repository Secrets
```
ANA_WEBHOOK_SECRET    → Your generated secret
TOD_WEBHOOK_ENDPOINT  → https://abc123.ngrok.io/webhook/ana-failures
ORG_PAT              → github_pat_11XXXXX... (if not already set)
```

---

## 🔐 Authentication Flow

```
1. Ana creates payload: {"summary": "...", "failures": [...]}

2. Ana signs payload:
   signature = HMAC-SHA256(payload, ANA_WEBHOOK_SECRET)

3. Ana sends webhook:
   POST /webhook/ana-failures
   X-Ana-Signature: sha256=<signature>
   X-Ana-Timestamp: 2025-09-30T12:00:00Z

4. Tod verifies:
   - Recomputes signature with same secret
   - Compares signatures (timing-safe)
   - Checks timestamp < 5 minutes old
   - If valid: Creates Cursor TODOs
```

---

## 🎯 Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check (returns `{"status":"healthy"}`) |
| `/webhook/ana-failures` | POST | Main webhook endpoint (receives Ana data) |
| `/test/create-todo` | POST | Test endpoint (manual TODO creation) |

**Base URL Examples:**
- Local: `http://localhost:3001`
- Ngrok: `https://abc123.ngrok.io`
- Vercel: `https://your-app.vercel.app/api/webhooks`

---

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| **Invalid signature** | Verify `ANA_WEBHOOK_SECRET` matches in GitHub and `.env.local` |
| **Connection refused** | Start Tod: `npm run tod:webhook` |
| **404 Not Found** | Check URL ends with `/webhook/ana-failures` |
| **Timestamp too old** | Check network connectivity, requests expire in 5 min |
| **Missing secret** | Add to `.env.local` and restart Tod |
| **Tests fail** | Ensure Tod is running before running tests |

### Debug Commands
```bash
# Check Tod is running
curl http://localhost:3001/health

# Check secrets match
cat .env.local | grep ANA_WEBHOOK_SECRET
gh secret list | grep ANA_WEBHOOK_SECRET

# View Tod logs (in terminal where Tod is running)

# View Ana logs
gh run list --workflow=ana.yml
gh run view LATEST_RUN_ID --log
```

---

## 📊 Daily Workflow

### Development Mode (Ngrok)
```bash
# Terminal 1: Start Tod
cd /your/project
source .env.local
npm run tod:webhook

# Terminal 2: Start Ngrok
ngrok http 3001
# → Copy URL, update GitHub secret if changed

# Terminal 3: Your dev work
npm run dev
```

### Production Mode
```bash
# Deploy Tod to Vercel/Railway/etc
# Set environment variable: ANA_WEBHOOK_SECRET
# Update GitHub secret with production URL
# Done - no ngrok needed!
```

---

## 🔄 Common Tasks

### Rotate Secret
```bash
# Generate new
NEW_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Update GitHub
echo "$NEW_SECRET" | gh secret set ANA_WEBHOOK_SECRET

# Update .env.local
sed -i '' "s/ANA_WEBHOOK_SECRET=\".*\"/ANA_WEBHOOK_SECRET=\"$NEW_SECRET\"/" .env.local

# Restart Tod
pkill -f tod-webhook && npm run tod:webhook
```

### Update Ngrok URL
```bash
# Ngrok URLs change on restart
# Copy new URL from ngrok terminal
# Update GitHub:
echo "https://NEW_URL/webhook/ana-failures" | gh secret set TOD_WEBHOOK_ENDPOINT
```

### Test Authentication
```bash
# Generate test signature
PAYLOAD='{"test":"data"}'
SECRET="your-secret"
echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET"
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `scripts/tod-webhook-server.ts` | Tod server implementation |
| `scripts/test-tod-integration.ts` | Integration test |
| `.github/workflows/ana.yml` | Ana workflow config |
| `scripts/ana-cli.ts` | Ana CLI commands |
| `.env.local` | Local environment vars |
| `app/api/webhooks/ana-failures/route.ts` | Next.js webhook route |

---

## ✅ Setup Checklist

- [ ] Secret generated (32+ bytes)
- [ ] `ANA_WEBHOOK_SECRET` in GitHub secrets
- [ ] `ANA_WEBHOOK_SECRET` in `.env.local`
- [ ] `TOD_WEBHOOK_ENDPOINT` in GitHub secrets
- [ ] Tod server running
- [ ] Health check passes
- [ ] Integration test passes
- [ ] Ana workflow tested

---

## 📚 Full Documentation

- **Quick Start**: `docs/TOD-ANA-QUICK-START.md`
- **Complete Guide**: `docs/TOD-ANA-SETUP-GUIDE.md`
- **Auth Flow**: `docs/TOD-ANA-AUTH-FLOW.md`
- **Commands**: `docs/TOD-ANA-COPY-PASTE-SETUP.md`
- **Index**: `docs/TOD-ANA-DOCS-INDEX.md`

---

## 🎯 Production Deployment

### Vercel
```bash
vercel env add ANA_WEBHOOK_SECRET production
vercel --prod
echo "https://your-app.vercel.app/api/webhooks/ana-failures" | gh secret set TOD_WEBHOOK_ENDPOINT
```

### Railway
```bash
railway variables set ANA_WEBHOOK_SECRET="your-secret"
railway up
railway domain  # Copy URL
echo "https://your-app.railway.app/webhook/ana-failures" | gh secret set TOD_WEBHOOK_ENDPOINT
```

---

**Last Updated**: September 30, 2025 | **Version**: 1.0.0