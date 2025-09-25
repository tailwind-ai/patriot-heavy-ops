export const BACKGROUND_AGENT_CONFIG = {
  // GitHub configuration
  github: {
    // Branches to monitor
    monitoredBranches: ["dev", "main"],

    // Events to monitor
    monitoredEvents: [
      "pull_request.opened",
      "pull_request.synchronize",
      "pull_request.review_requested",
      "issue_comment.created",
    ],

    // Comment patterns to detect
    commentPatterns: {
      copilot: ["copilot", "suggestion", "```"],
      lint: ["lint", "eslint", "error", "warning"],
      test: ["test", "spec", "jest", "vitest"],
      ci: ["ci", "build", "deploy", "vercel"],
    },
  },

  // Issue detection settings
  detection: {
    // Severity thresholds
    severityThresholds: {
      low: ["lint_error"],
      medium: ["copilot_comment", "test_failure"],
      high: ["ci_failure", "vercel_failure"],
      critical: ["security", "breaking"],
    },
  },

  // Response settings
  responses: {
    // Comment templates
    templates: {
      fixApplied: `🤖 **Automated Fix Applied**

**Issue Type:** {issueType}
**Files Changed:** {fileCount}
**Commit:** {commitSha}
**Status:** ✅ Resolved

The background agent has automatically applied fixes for the detected issues. Please review the changes.`,

      fixDetected: `🤖 **Issue Detected**

**Issue Type:** {issueType}
**Description:** {description}
**Suggested Fix:** {suggestion}
**Status:** ⚠️ Manual intervention required

The background agent has detected an issue but cannot automatically fix it. Please review the suggestions.`,

      fixFailed: `🤖 **Fix Attempt Failed**

**Issue Type:** {issueType}
**Error:** {error}
**Status:** ❌ Fix failed

The background agent attempted to fix the issue but encountered an error. Manual intervention required.`,
    },

    // Response behavior
    behavior: {
      alwaysRespond: true,
      includeCommitDetails: true,
      includeFileList: true,
      mentionAuthor: false,
    },
  },

  // Security settings
  security: {
    // File path restrictions
    restrictedPaths: [
      ".env*",
      "*.key",
      "*.pem",
      "*.p12",
      "secrets/",
      "private/",
    ],

    // Content restrictions
    contentRestrictions: {
      maxFileSize: 100 * 1024 * 1024, // 100MB
      forbiddenPatterns: [
        /password\s*=\s*["'][^"']+["']/i,
        /api[_-]?key\s*=\s*["'][^"']+["']/i,
        /secret\s*=\s*["'][^"']+["']/i,
      ],
    },
  },

  // Performance settings
  performance: {
    // Rate limiting
    rateLimits: {
      maxRequestsPerMinute: 60,
      maxConcurrentFixes: 3,
      requestTimeout: 30000, // 30 seconds
    },

    // Caching
    cache: {
      enabled: true,
      ttl: 300000, // 5 minutes
      maxSize: 100,
    },
  },
}

export type BackgroundAgentConfig = typeof BACKGROUND_AGENT_CONFIG
