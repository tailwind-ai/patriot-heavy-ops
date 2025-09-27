# Background Agent Setup Guide

This guide explains how to set up and configure the PR Auto-Fix Agent for automated issue detection and resolution.

## Overview

The Background Agent system automatically:

- Monitors PRs for code review feedback, CI failures, and Vercel deployment issues
- Detects and extracts code suggestions or error logs
- Applies automated fixes to code
- Runs local tests to validate fixes
- Commits and pushes changes with descriptive messages
- Posts confirmation comments to PRs

## Prerequisites

- GitHub repository with webhook access
- GitHub Personal Access Token with repo permissions
- Vercel API token (optional, for deployment monitoring)
- Cursor API key (optional, for enhanced AI integration)

## Setup Steps

### 1. Environment Configuration

Add the following environment variables to your `.env.local`:

```bash
# Required
GITHUB_ACCESS_TOKEN=your_github_token_here
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_APP_URL=https://your-app-domain.com

# Optional
CURSOR_API_KEY=your_cursor_api_key_here
VERCEL_API_TOKEN=your_vercel_api_token_here
```

### 2. GitHub Webhook Configuration

Run the setup script to configure GitHub webhooks:

```bash
# Install dependencies
npm install @octokit/rest

# Run setup script
npx tsx scripts/setup-background-agent.ts
```

This will:

- Create a GitHub webhook pointing to your app
- Generate a secure webhook secret
- Update your environment configuration
- Test the connection

### 3. Manual Webhook Setup (Alternative)

If you prefer to set up the webhook manually:

1. Go to your GitHub repository settings
2. Navigate to "Webhooks" section
3. Click "Add webhook"
4. Set the payload URL to: `https://your-app-domain.com/api/webhooks/github`
5. Set content type to: `application/json`
6. Select events: `Pull requests`, `Issue comments`, `Check runs`, `Check suites`
7. Generate and save a webhook secret
8. Add the secret to your environment variables

### 4. Deploy Your Application

Deploy your application to make the webhook accessible:

```bash
# For Vercel
vercel deploy

# For other platforms
npm run build
npm run start
```

## Configuration

### Agent Behavior

The agent is configured in `lib/background-agents/config.ts`:

```typescript
export const BACKGROUND_AGENT_CONFIG = {
  github: {
    monitoredBranches: ["dev", "main"],
    monitoredEvents: [
      "pull_request.opened",
      "pull_request.synchronize",
      "pull_request.review_requested",
      "issue_comment.created",
    ],
  },
  detection: {
    autoFix: {
      enabled: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB
      maxChangesPerPR: 50,
    },
  },
}
```

### Customization

You can customize the agent behavior by modifying:

- **Monitored branches**: Add/remove branches to monitor
- **Event triggers**: Configure which GitHub events trigger the agent
- **Fix strategies**: Customize how different issue types are handled
- **Response templates**: Modify comment templates and messages

## Usage

### Automatic Operation

Once configured, the agent operates automatically:

1. **PR Creation**: When a PR is created on `dev` or `main`
2. **Comment Detection**: When code review tools or reviewers post suggestions
3. **CI Failure**: When GitHub Actions or Vercel deployments fail
4. **Issue Analysis**: Agent analyzes the issue and determines appropriate fixes
5. **Fix Application**: Agent applies fixes and runs local tests
6. **Commit & Push**: Changes are committed with descriptive messages
7. **PR Update**: Agent posts confirmation comments to the PR

### Manual Testing

Test the agent by:

1. Creating a test PR with intentional issues
2. Adding code review suggestions as comments
3. Triggering CI failures
4. Observing the agent's response

### Monitoring

Monitor agent activity through:

- GitHub webhook delivery logs
- Application logs
- PR comments and commit messages
- GitHub Actions status

## Troubleshooting

### Common Issues

**Webhook not receiving events:**

- Verify webhook URL is accessible
- Check webhook secret configuration
- Ensure repository has webhook permissions

**Agent not responding:**

- Check environment variables
- Verify GitHub token permissions
- Review application logs

**Fixes not being applied:**

- Check file permissions
- Verify branch access
- Review validation rules

### Debug Mode

Enable debug logging by setting:

```bash
DEBUG=background-agent:*
```

### Logs

Monitor logs for agent activity:

```bash
# Application logs
npm run dev 2>&1 | grep "Background Agent"

# GitHub webhook logs
# Check your repository's webhook delivery logs
```

## Security Considerations

- **Webhook Security**: Always use HTTPS and validate webhook signatures
- **Token Security**: Store tokens securely and rotate regularly
- **File Access**: Agent only modifies files in allowed directories
- **Content Validation**: All changes are validated before committing
- **Rate Limiting**: Built-in rate limiting prevents abuse

## Advanced Configuration

### Custom Fix Strategies

Implement custom fix strategies by extending the `AutomatedFixer` class:

```typescript
class CustomFixer extends AutomatedFixer {
  async applyCustomFix(issue: IssueDetection): Promise<FixResult> {
    // Custom fix logic
  }
}
```

### Integration with Other Tools

The agent can be extended to integrate with:

- **Code quality tools**: ESLint, Prettier, SonarQube
- **Testing frameworks**: Jest, Vitest, Playwright
- **Deployment platforms**: Vercel, Netlify, AWS
- **AI services**: OpenAI, Anthropic, Cursor

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review application logs
3. Verify configuration settings
4. Test with a simple PR first

The agent is designed to be safe and conservative - it will only apply fixes it's confident about and always provides transparency about what it's doing.
