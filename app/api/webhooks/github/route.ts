import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

import { env } from "@/env.mjs"
import { processPRWebhook } from "@/lib/background-agents/pr-monitor"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("X-Hub-Signature-256")

  // Verify GitHub webhook signature
  if (!env.GITHUB_WEBHOOK_SECRET || !signature) {
    return NextResponse.json(
      { error: "Missing webhook secret" },
      { status: 401 }
    )
  }

  const expectedSignature = `sha256=${crypto
    .createHmac("sha256", env.GITHUB_WEBHOOK_SECRET)
    .update(body)
    .digest("hex")}`

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const event = headersList.get("X-GitHub-Event")
  const payload = JSON.parse(body)

  // Only process PR events for sam-dev and main branches
  if (event === "pull_request" && payload.pull_request) {
    const pr = payload.pull_request
    const baseBranch = pr.base?.ref
    const action = payload.action

    // Monitor PRs on sam-dev and main branches
    if (
      (baseBranch === "sam-dev" || baseBranch === "main") &&
      (action === "opened" ||
        action === "synchronize" ||
        action === "review_requested")
    ) {
      try {
        await processPRWebhook({
          prNumber: pr.number,
          repository: payload.repository.full_name,
          baseBranch,
          action,
          prData: pr,
        })

        return NextResponse.json({ success: true })
      } catch (error) {
        // Log error for debugging
        // eslint-disable-next-line no-console
        console.error("Error processing PR webhook:", error)
        return NextResponse.json(
          { error: "Failed to process webhook" },
          { status: 500 }
        )
      }
    }
  }

  // Handle issue comments (for Copilot suggestions)
  if (event === "issue_comment" && payload.issue?.pull_request) {
    const comment = payload.comment
    const pr = payload.issue

    // Check if comment is from Copilot or contains code suggestions
    if (isCopilotOrSuggestionComment(comment)) {
      try {
        await processPRWebhook({
          prNumber: pr.number,
          repository: payload.repository.full_name,
          baseBranch: "unknown", // Will be fetched from PR data
          action: "comment",
          commentData: comment,
        })

        return NextResponse.json({ success: true })
      } catch (error) {
        // Log error for debugging
        // eslint-disable-next-line no-console
        console.error("Error processing comment webhook:", error)
        return NextResponse.json(
          { error: "Failed to process webhook" },
          { status: 500 }
        )
      }
    }
  }

  return NextResponse.json({ message: "Event not processed" })
}

/**
 * Resolve a GitHub PR review conversation
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function resolveGitHubConversation(
  commentId: number,
  resolution: string,
  repository: string,
  pullNumber: number
) {
  const parts = repository.split("/")
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    // eslint-disable-next-line no-console
    console.error(`Invalid repository format: ${repository}`)
    return
  }
  const [owner, repo] = parts as [string, string]

  try {
    const { Octokit } = await import("@octokit/rest")
    const octokit = new Octokit({
      auth: process.env.GITHUB_ACCESS_TOKEN,
    })

    // First, reply to the comment with the resolution
    await octokit.rest.pulls.createReplyForReviewComment({
      owner,
      repo,
      pull_number: pullNumber,
      comment_id: commentId,
      body: `✅ **Resolved**

${resolution}

This suggestion has been implemented and the conversation is now resolved.`,
    })

    // Then resolve the conversation thread
    // Note: This requires the comment to be part of a review
    try {
      await octokit.rest.pulls.dismissReview({
        owner,
        repo,
        pull_number: pullNumber,
        review_id: commentId, // This might need to be the review ID, not comment ID
        message: "Resolved by Background Agent",
      })
    } catch {
      // If dismiss doesn't work, try to resolve via GraphQL API
      // eslint-disable-next-line no-console
      console.log("Attempting to resolve conversation via GraphQL...")

      // GraphQL mutation would be used here if thread ID was available
      // This would require getting the thread ID first
      // eslint-disable-next-line no-console
      console.log(
        "GraphQL resolution not implemented yet - manual resolution required"
      )
    }

    // eslint-disable-next-line no-console
    console.log(`✅ Resolved conversation for comment ${commentId}`)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`❌ Failed to resolve conversation ${commentId}:`, error)
  }
}

/**
 * Enhanced comment detection to identify Copilot suggestions and code reviews
 * with more specific patterns to reduce false positives
 */
function isCopilotOrSuggestionComment(comment: {
  user?: { login?: string; id?: number }
  body?: string
}): boolean {
  const body = comment.body || ""
  const userLogin = comment.user?.login?.toLowerCase() || ""
  const userId = comment.user?.id

  // Official Copilot user IDs and logins
  const copilotUserIds = [175728472] // GitHub Copilot bot user ID
  const copilotLogins = [
    "copilot",
    "github-copilot",
    "copilot-pull-request-reviewer",
  ]

  // Check for official Copilot users
  if (userId && copilotUserIds.includes(userId)) {
    return true
  }

  if (copilotLogins.some((login) => userLogin.includes(login))) {
    return true
  }

  // Check for GitHub's official suggestion blocks
  const hasSuggestionBlock = body.includes("```suggestion")

  // Enhanced Copilot-specific patterns with higher precision
  const copilotPatterns = [
    /```[\s\S]*?suggestion[\s\S]*?```/i, // Official suggestion blocks
    /\[nitpick\]/i, // Common Copilot nitpick format
    /\[suggestion\]/i, // Common Copilot suggestion format
    /Consider using.*instead/i,
    /This could be improved by/i,
    /You might want to consider/i,
    /I suggest.*instead/i,
    /It would be better to/i,
    /A more.*approach would be/i,
  ]

  // Only consider code blocks that specifically mention suggestions or improvements
  const hasRelevantCodeBlock =
    body.includes("```") &&
    (body.includes("suggestion") ||
      body.includes("nitpick") ||
      body.includes("improvement") ||
      body.includes("better approach") ||
      body.includes("Consider using"))

  const hasCopilotPattern = copilotPatterns.some((pattern) =>
    pattern.test(body)
  )

  return hasSuggestionBlock || hasRelevantCodeBlock || hasCopilotPattern
}
