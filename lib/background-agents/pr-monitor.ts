import { Octokit } from "@octokit/rest"
import { env } from "@/env.mjs"
import { AutomatedFixer } from "./automated-fixer"
import { GitOperations } from "./git-operations"

type PRWebhookData = {
  prNumber: number
  repository: string
  baseBranch: string
  action: string
  prData?: {
    number: number
    title: string
    body: string
    state: string
    head: { sha: string }
    base: { sha: string }
  }
  commentData?: {
    id: number
    body: string
    user: { login: string }
    created_at: string
  }
}

export type IssueDetection = {
  type:
    | "copilot_comment"
    | "ci_failure"
    | "vercel_failure"
    | "lint_error"
    | "test_failure"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  suggestedFix?: string
  files?: string[]
  lineNumbers?: number[]
}

export async function processPRWebhook(data: PRWebhookData) {
  console.log(`Processing PR webhook: ${data.action} for PR #${data.prNumber}`)

  const octokit = new Octokit({
    auth: env.GITHUB_ACCESS_TOKEN,
  })

  try {
    // Get PR details
    const [owner, repo] = data.repository.split("/")
    if (!owner || !repo) {
      throw new Error("Invalid repository format")
    }
    await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: data.prNumber,
    })

    // Detect issues
    const issues = await detectIssues(
      octokit,
      owner,
      repo,
      data.prNumber,
      data.commentData
    )

    if (issues.length > 0) {
      console.log(`Found ${issues.length} issues in PR #${data.prNumber}`)

      // Process each issue
      for (const issue of issues) {
        await processIssue(octokit, owner, repo, data.prNumber, issue)
      }
    }
  } catch (error) {
    console.error("Error processing PR webhook:", error)
    throw error
  }
}

async function detectIssues(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number,
  commentData?: {
    id: number
    body: string
    user: { login: string }
    created_at: string
  }
): Promise<IssueDetection[]> {
  const issues: IssueDetection[] = []

  try {
    // Check for Copilot comments and new PR comments
    if (commentData) {
      const copilotIssue = await detectCopilotComment(commentData)
      if (copilotIssue) {
        issues.push(copilotIssue)
      }
    }

    // Check for new comments on the PR
    const newComments = await detectNewComments(octokit, owner, repo, prNumber)
    issues.push(...newComments)

    // Check CI status
    const ciIssues = await detectCIFailures(octokit, owner, repo, prNumber)
    issues.push(...ciIssues)

    // Check Vercel deployment status
    const vercelIssues = await detectVercelFailures(owner, repo, prNumber)
    issues.push(...vercelIssues)

    // Check for linting errors in PR comments
    const lintIssues = await detectLintErrors(octokit, owner, repo, prNumber)
    issues.push(...lintIssues)
  } catch (error) {
    console.error("Error detecting issues:", error)
  }

  return issues
}

async function detectCopilotComment(
  commentData: {
    id: number
    body: string
    user: { login: string }
    created_at: string
  }
): Promise<IssueDetection | null> {
  const body = commentData.body || ""
  const author = commentData.user?.login || ""

  // Check if comment is from Copilot or contains code suggestions
  if (
    author.includes("copilot") ||
    (body.includes("```") &&
      (body.includes("suggestion") || body.includes("fix")))
  ) {
    return {
      type: "copilot_comment",
      severity: "medium",
      description: "Copilot code suggestion detected",
      suggestedFix: extractCodeFromComment(body),
    }
  }

  return null
}

async function detectNewComments(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number
): Promise<IssueDetection[]> {
  const issues: IssueDetection[] = []

  try {
    // Get recent comments on the PR
    const comments = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: prNumber,
      since: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // Last 5 minutes
    })

    for (const comment of comments.data) {
      // Check for Copilot suggestions
      if (
        comment.user?.login?.includes("copilot") ||
        (comment.body?.includes("```") && comment.body.includes("suggestion"))
      ) {
        issues.push({
          type: "copilot_comment",
          severity: "medium",
          description: "New Copilot suggestion detected",
          suggestedFix: extractCodeFromComment(comment.body || ""),
        })
      }
    }
  } catch (error) {
    console.error("Error detecting new comments:", error)
  }

  return issues
}

async function detectCIFailures(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number
): Promise<IssueDetection[]> {
  const issues: IssueDetection[] = []

  try {
    // Get check runs for the PR
    const checks = await octokit.rest.checks.listForRef({
      owner,
      repo,
      ref: `pull/${prNumber}/head`,
    })

    for (const check of checks.data.check_runs) {
      if (
        check.conclusion === "failure" ||
        (check.status === "completed" && check.conclusion !== "success")
      ) {
        issues.push({
          type: "ci_failure",
          severity: "high",
          description: `CI check failed: ${check.name}`,
          suggestedFix: await generateCIFix(check),
        })
      }
    }
  } catch (error) {
    console.error("Error checking CI status:", error)
  }

  return issues
}

async function detectVercelFailures(
  owner: string,
  repo: string,
  prNumber: number
): Promise<IssueDetection[]> {
  const issues: IssueDetection[] = []

  try {
    if (!env.VERCEL_API_TOKEN) {
      return issues
    }

    // Check Vercel deployment status
    const response = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${repo}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${env.VERCEL_API_TOKEN}`,
        },
      }
    )

    if (response.ok) {
      const deployments = await response.json()
      const prDeployment = deployments.deployments?.find(
        (d: { meta?: { githubCommitRef?: string } }) => d.meta?.githubCommitRef === `pull/${prNumber}/head`
      )

      if (prDeployment && prDeployment.state === "ERROR") {
        issues.push({
          type: "vercel_failure",
          severity: "high",
          description: `Vercel deployment failed: ${prDeployment.readyState}`,
          suggestedFix: await generateVercelFix(prDeployment),
        })
      }
    }
  } catch (error) {
    console.error("Error checking Vercel status:", error)
  }

  return issues
}

async function detectLintErrors(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number
): Promise<IssueDetection[]> {
  const issues: IssueDetection[] = []

  try {
    // Get PR review comments
    const comments = await octokit.rest.pulls.listReviewComments({
      owner,
      repo,
      pull_number: prNumber,
    })

    for (const comment of comments.data) {
      if (
        comment.body.includes("lint") ||
        comment.body.includes("eslint") ||
        comment.body.includes("error")
      ) {
        issues.push({
          type: "lint_error",
          severity: "medium",
          description: `Lint error detected: ${comment.body}`,
          suggestedFix: comment.body,
          files: [comment.path],
          lineNumbers: [comment.line || 0],
        })
      }
    }
  } catch (error) {
    console.error("Error checking lint errors:", error)
  }

  return issues
}

async function processIssue(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number,
  issue: IssueDetection
) {
  console.log(`Processing issue: ${issue.type} - ${issue.description}`)

  try {
    const fixer = new AutomatedFixer(octokit, owner, repo, prNumber)
    const gitOps = new GitOperations(octokit, owner, repo, prNumber)

    // Apply automated fix
    const fixResult = await fixer.applyFix(issue)

    if (fixResult.success && fixResult.changes.length > 0) {
      // Validate changes before committing
      const isValid = await gitOps.validateChanges(fixResult.changes)

      if (isValid) {
        // Commit and push changes
        const commitResult = await gitOps.commitAndPushChanges(
          fixResult.changes,
          issue.type
        )

        if (commitResult.success && commitResult.commitSha) {
          // Update PR with fix details
          await gitOps.updatePRWithFix(commitResult.commitSha, issue.type)

          // Respond to PR with confirmation
          await respondToPR(
            octokit,
            owner,
            repo,
            prNumber,
            issue,
            commitResult.commitSha
          )
        } else {
          console.error(`Failed to commit changes: ${commitResult.error}`)
        }
      } else {
        console.error("Changes validation failed")
      }
    } else {
      console.log(`No automated fix available for ${issue.type}`)
      // Still respond to PR to acknowledge the issue
      await respondToPR(octokit, owner, repo, prNumber, issue)
    }
  } catch (error) {
    console.error(`Error processing issue ${issue.type}:`, error)
  }
}

async function respondToPR(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number,
  issue: IssueDetection,
  commitSha?: string
) {
  const status = commitSha ? "✅ Resolved" : "⚠️ Detected (manual fix required)"
  const fixInfo = commitSha
    ? `**Fix Applied:** ${issue.suggestedFix}\n**Commit:** ${commitSha}`
    : `**Suggested Fix:** ${
        issue.suggestedFix || "Manual intervention required"
      }`

  const responseMessage = `🤖 **Background Agent Response**

**Issue Detected:** ${issue.description}
${fixInfo}
**Status:** ${status}

${
  commitSha
    ? "The issue has been automatically identified and fixed. Please review the changes."
    : "The issue has been identified but requires manual intervention. Please review the suggestions."
}`

  try {
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: responseMessage,
    })

    console.log(`Responded to PR #${prNumber} for issue ${issue.type}`)
  } catch (error) {
    console.error("Error responding to PR:", error)
  }
}

// Helper functions
function extractCodeFromComment(commentBody: string): string {
  const codeBlocks = commentBody.match(/```[\s\S]*?```/g)
  return codeBlocks ? codeBlocks.join("\n") : ""
}

async function generateCIFix(check: { name: string; conclusion?: string | null }): Promise<string> {
  // Analyze check output to generate fix suggestions
  const conclusion = check.conclusion || "unknown"
  return `Fix for CI failure in ${check.name} (${conclusion}). Check the logs for specific error details.`
}

async function generateVercelFix(deployment: { state: string; url?: string }): Promise<string> {
  // Analyze Vercel deployment failure to generate fix suggestions
  return `Fix for Vercel deployment failure. Check build logs for specific error details.`
}
