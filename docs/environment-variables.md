# Environment Variables Configuration Guide

This guide explains how to configure environment variables for Patriot Heavy Ops in different environments.

## 📋 Overview

Patriot Heavy Ops uses environment variables for configuration across development, staging, and production environments. The project uses [T3 Stack's env-nextjs](https://env.t3.gg/) for type-safe environment variable validation.

## 🔧 Configuration Files

### **Primary Configuration**
- **`env.mjs`** - Type-safe environment variable definitions and validation
- **`docker-compose.yml`** - Development environment variables
- **`.env.development.local`** - Local development overrides (not in git)

### **Platform-Specific**
- **Vercel Dashboard** - Production environment variables
- **GitHub Secrets** - CI/CD workflow variables

## 🚀 Production Deployment (Vercel)

### **How to Configure Environment Variables in Vercel:**

1. **Access Vercel Dashboard:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your `patriot-heavy-ops` project

2. **Navigate to Environment Variables:**
   - Click on **Settings** tab
   - Click on **Environment Variables** in the sidebar

3. **Add Required Variables:**
   Click **Add New** for each variable below:

### **🔑 Required Production Variables**

#### **Core Application**
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database_name

# Authentication
NEXTAUTH_SECRET=your-super-secure-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Stripe (if using payments)
STRIPE_API_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
```

#### **🚀 Issue #282: Ana → Tod Webhook Integration**
```bash
# Tod Webhook Endpoint (where Ana sends failure analysis)
TOD_WEBHOOK_ENDPOINT=https://your-domain.vercel.app/api/webhooks/ana-failures

# Webhook Security Secret (generate a secure random string)
ANA_WEBHOOK_SECRET=your-secure-webhook-secret-key-here
```

#### **GitHub Integration (for Ana workflows)**
```bash
# GitHub Access Token (for Ana to access workflow logs)
GITHUB_ACCESS_TOKEN=ghp_your_github_personal_access_token

# Organization PAT (stored in GitHub Secrets, referenced in workflows)
ORG_PAT=ghp_your_organization_access_token
```

### **🔐 How to Generate Secure Values**

#### **NEXTAUTH_SECRET**
```bash
# Generate a secure random string
openssl rand -base64 32
```

#### **ANA_WEBHOOK_SECRET**
```bash
# Generate a secure webhook secret
openssl rand -hex 32
```

#### **GitHub Personal Access Token**
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with these scopes:
   - `repo` (for accessing private repositories)
   - `actions:read` (for reading workflow logs)
   - `issues:write` (for creating issues/comments)

## 🛠 Development Environment

### **Local Development Setup**

1. **Create `.env.development.local`:**
```bash
# Copy from docker-compose.yml or customize
DATABASE_URL="postgresql://postgres:password@localhost:5433/patriot_heavy_ops"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Issue #282: Ana → Tod Webhook Integration (Development)
TOD_WEBHOOK_ENDPOINT="http://localhost:3001/webhook/ana-failures"
ANA_WEBHOOK_SECRET="dev-secret-key"

# GitHub (use personal token for development)
GITHUB_ACCESS_TOKEN="ghp_your_development_token"
```

2. **Start Development Environment:**
```bash
# Start Docker containers
docker-compose up -d

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

## 🔄 GitHub Actions Configuration

### **Required GitHub Secrets**

In your GitHub repository, go to **Settings → Secrets and variables → Actions** and add:

#### **Existing Secrets**
```bash
VERCEL_API_TOKEN=your_vercel_api_token
ORG_PAT=ghp_your_organization_access_token
```

#### **🚀 New Secrets for Issue #282**
```bash
# Tod Webhook Endpoint (production URL)
TOD_WEBHOOK_ENDPOINT=https://your-domain.vercel.app/api/webhooks/ana-failures

# Webhook Security Secret (same as in Vercel)
ANA_WEBHOOK_SECRET=your-secure-webhook-secret-key-here
```

### **How GitHub Workflows Use These Variables**

The Ana workflow (`.github/workflows/ana.yml`) automatically:
1. **Analyzes CI failures** when tests fail
2. **Sends webhook to Tod** using `TOD_WEBHOOK_ENDPOINT`
3. **Signs requests** using `ANA_WEBHOOK_SECRET`
4. **Creates Cursor TODOs** via the webhook integration

## 📊 Environment Variable Reference

### **Complete List of Variables**

| Variable | Required | Environment | Description |
|----------|----------|-------------|-------------|
| `DATABASE_URL` | ✅ | All | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | All | NextAuth.js encryption secret |
| `NEXTAUTH_URL` | 🔶 | Prod | Full URL of your application |
| `NEXT_PUBLIC_APP_URL` | ✅ | All | Public URL for client-side |
| `TOD_WEBHOOK_ENDPOINT` | 🆕 | All | Ana → Tod webhook URL |
| `ANA_WEBHOOK_SECRET` | 🆕 | All | Webhook signature secret |
| `GITHUB_ACCESS_TOKEN` | 🔶 | CI/Ana | GitHub API access |
| `STRIPE_API_KEY` | 🔶 | Prod | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | 🔶 | Prod | Stripe webhook validation |

**Legend:**
- ✅ Required for basic functionality
- 🆕 New for Issue #282
- 🔶 Optional/feature-specific

## 🚨 Security Best Practices

### **Secret Management**
1. **Never commit secrets** to git
2. **Use different secrets** for development/production
3. **Rotate secrets regularly** (especially webhook secrets)
4. **Use strong random values** (32+ characters)

### **Webhook Security**
1. **Always validate signatures** in production
2. **Use HTTPS endpoints** for webhooks
3. **Implement timestamp validation** to prevent replay attacks
4. **Log webhook attempts** for monitoring

### **GitHub Token Permissions**
1. **Use minimal required scopes** for GitHub tokens
2. **Create organization tokens** for shared workflows
3. **Regularly audit token usage** and rotate as needed

## 🔍 Troubleshooting

### **Common Issues**

#### **"Environment variable not found" errors**
- Check variable name spelling in `env.mjs`
- Verify variable is set in Vercel dashboard
- Ensure variable is available in correct environment

#### **Webhook signature validation fails**
- Verify `ANA_WEBHOOK_SECRET` matches between GitHub and Vercel
- Check that secret is properly base64/hex encoded
- Ensure timestamp is within acceptable range (5 minutes)

#### **GitHub workflow can't access webhook endpoint**
- Verify `TOD_WEBHOOK_ENDPOINT` is publicly accessible
- Check that endpoint returns proper HTTP status codes
- Ensure webhook endpoint is deployed and running

### **Validation Commands**

```bash
# Check environment variable loading
npm run build

# Test webhook endpoint locally
curl -X POST http://localhost:3000/api/webhooks/ana-failures \
  -H "Content-Type: application/json" \
  -H "x-ana-signature: test" \
  -H "x-ana-timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  -d '{"test": true}'

# Verify GitHub token permissions
gh auth status
```

## 📚 Additional Resources

- [T3 Stack Environment Variables](https://env.t3.gg/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

## 🎯 Quick Setup Checklist

### **For Production Deployment:**
- [ ] Set `DATABASE_URL` in Vercel
- [ ] Set `NEXTAUTH_SECRET` in Vercel  
- [ ] Set `NEXTAUTH_URL` in Vercel
- [ ] Set `NEXT_PUBLIC_APP_URL` in Vercel
- [ ] Set `TOD_WEBHOOK_ENDPOINT` in Vercel (🆕 Issue #282)
- [ ] Set `ANA_WEBHOOK_SECRET` in Vercel (🆕 Issue #282)
- [ ] Set `TOD_WEBHOOK_ENDPOINT` in GitHub Secrets (🆕 Issue #282)
- [ ] Set `ANA_WEBHOOK_SECRET` in GitHub Secrets (🆕 Issue #282)
- [ ] Test webhook endpoint after deployment
- [ ] Verify Ana workflow can reach Tod webhook

### **For Development:**
- [ ] Create `.env.development.local`
- [ ] Start Docker containers
- [ ] Generate Prisma client
- [ ] Test local webhook integration
