# Patriot Heavy Ops Documentation

Welcome to the Patriot Heavy Ops documentation. This directory contains guides, references, and troubleshooting information for the project.

## 📚 Documentation Index

### 🤖 Tod & Ana Integration (Background Agent + GitHub Actions)

Complete guide for setting up secure communication between Tod (Cursor Background Agent) and Ana (GitHub Actions workflow):

- **[📋 Documentation Index](./TOD-ANA-DOCS-INDEX.md)** - Start here! Navigate to the right guide for your needs
- **[🚀 Quick Start Guide](./TOD-ANA-QUICK-START.md)** - 5-minute setup walkthrough
- **[💻 Copy-Paste Setup](./TOD-ANA-COPY-PASTE-SETUP.md)** - Complete terminal commands
- **[📖 Complete Setup Guide](./TOD-ANA-SETUP-GUIDE.md)** - Detailed explanations and production deployment
- **[🔐 Authentication Flow](./TOD-ANA-AUTH-FLOW.md)** - Security model and troubleshooting auth issues
- **[📄 Cheat Sheet](./TOD-ANA-CHEAT-SHEET.md)** - One-page quick reference

**What is Tod & Ana?**
- **Tod**: Background Agent webhook server that receives failure analysis and creates Cursor TODOs
- **Ana**: GitHub Actions workflow that analyzes CI failures, Vercel deploys, and Cursor Bugbot reviews

### 🔧 Configuration & Setup

- **[Environment Variables Guide](./environment-variables.md)** - Configuration for all environments
- **[Repository Pattern Guide](./repository-pattern-guide.md)** - Data access layer patterns

### 🔐 Authentication & Authorization

- **[Auth Troubleshooting](./auth-troubleshooting.md)** - Debugging authentication issues

### 🧪 Testing & Debugging

- **[Testing & Debugging Guide](./testing-debugging.md)** - Test setup and debugging strategies

## 🎯 Quick Links by Task

### I want to set up Tod & Ana for the first time
→ Go to: [Tod & Ana Quick Start Guide](./TOD-ANA-QUICK-START.md)

### I need copy-paste commands for setup
→ Go to: [Copy-Paste Setup Commands](./TOD-ANA-COPY-PASTE-SETUP.md)

### I'm deploying to production
→ Go to: [Complete Setup Guide - Production Section](./TOD-ANA-SETUP-GUIDE.md#step-3-configure-tod-webhook-server)

### I have authentication errors
→ Go to: [Authentication Flow Guide - Troubleshooting](./TOD-ANA-AUTH-FLOW.md#-common-authentication-issues)

### I want to understand the security model
→ Go to: [Authentication Flow Guide - Security Properties](./TOD-ANA-AUTH-FLOW.md#-security-properties)

### I need to configure environment variables
→ Go to: [Environment Variables Guide](./environment-variables.md)

### I'm having auth issues
→ Go to: [Auth Troubleshooting](./auth-troubleshooting.md)

### I want to understand the repository pattern
→ Go to: [Repository Pattern Guide](./repository-pattern-guide.md)

### I need help with testing
→ Go to: [Testing & Debugging Guide](./testing-debugging.md)

## 📖 Documentation Standards

### Creating New Documentation

When adding new documentation:

1. **Use clear, descriptive titles**
2. **Include a table of contents for long guides**
3. **Add code examples with syntax highlighting**
4. **Include troubleshooting sections**
5. **Link to related documentation**
6. **Update this README with links to your new docs**

### Markdown Style Guide

- Use `### ` for main sections
- Use `#### ` for subsections
- Use code blocks with language specifiers: ` ```bash `
- Use tables for structured data
- Use emojis sparingly for section headers
- Include "Last Updated" date at bottom of guides

## 🆘 Need Help?

If you can't find what you're looking for:

1. Check the [Tod & Ana Documentation Index](./TOD-ANA-DOCS-INDEX.md) for integration guides
2. Search this README for keywords
3. Check the main [project README](../README.md)
4. Review inline code comments in relevant files
5. Check GitHub Issues for similar questions

## 🤝 Contributing to Documentation

Improvements to documentation are always welcome! To contribute:

1. **Identify gaps**: What questions aren't answered?
2. **Write clear content**: Focus on practical examples
3. **Test your instructions**: Verify commands work as written
4. **Update this index**: Add links to your new documentation
5. **Submit a PR**: Include before/after context

---

**Last Updated**: September 30, 2025  
**Version**: 1.0.0