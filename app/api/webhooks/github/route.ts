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
        // console.error("Error processing PR webhook:", error)
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
    if (
      comment.user?.login?.includes("copilot") ||
      comment.body?.includes("```") ||
      comment.body?.includes("suggestion")
    ) {
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
        // console.error("Error processing comment webhook:", error)
        return NextResponse.json(
          { error: "Failed to process webhook" },
          { status: 500 }
        )
      }
    }
  }

  return NextResponse.json({ message: "Event not processed" })
}
