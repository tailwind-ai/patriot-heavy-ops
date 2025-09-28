#!/usr/bin/env tsx

/**
 * Ana CLI - GitHub Workflow Integration
 * Analyzes CI failures and Cursor Bugbot reviews, sends to Tod via webhook (Issue #282)
 */

import { Octokit } from "@octokit/rest"
import { writeFileSync } from "fs"
import { 
  createAnalyzedFailure, 
  createAnaResults, 
  type AnalyzedFailure,
  type AnaResults,
  type FailureType 
} from "../lib/ana/types"
import { 
  AnaWebhookClient, 
  createAnaWebhookPayload 
} from "../lib/ana/webhook-client"

// Legacy interface for backward compatibility with workflow output
interface LegacyAnaResults {
  todos: Array<{
    id: string
    content: string
    priority: "low" | "medium" | "high" | "critical"
    files?: string[]
    lineNumbers?: number[]
    issueType: "ci_failure" | "cursor_bugbot" | "bugbot_issue"
    relatedPR: string
    createdAt: string
  }>
  summary: string
  analysisDate: string
}

class AnaAnalyzer {
  private octokit: Octokit
  private owner: string
  private repo: string
  private webhookClient: AnaWebhookClient

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_ACCESS_TOKEN,
    })
    this.owner = "samuelhenry"
    this.repo = "patriot-heavy-ops"
    
    // Initialize webhook client for Issue #282 integration
    const webhookEndpoint = process.env.TOD_WEBHOOK_ENDPOINT || "http://localhost:3000/api/webhooks/ana-failures"
    this.webhookClient = new AnaWebhookClient(webhookEndpoint, {
      timeout: 30000,
      retries: 2,
    })
    
    console.log(`🔗 Ana webhook client initialized: ${webhookEndpoint}`)
  }

  /**
   * Analyze CI Test failures and send to Tod via webhook (Issue #282)
   */
  async analyzeCIFailures(
    workflowRunId: string,
    prNumber: number
  ): Promise<LegacyAnaResults> {
    console.log(`🔍 Ana analyzing CI Test failures for PR #${prNumber}...`)

    try {
      // Get workflow run details
      const workflowRun = await this.octokit.rest.actions.getWorkflowRun({
        owner: this.owner,
        repo: this.repo,
        run_id: parseInt(workflowRunId),
      })

      // Get workflow run jobs
      const jobs = await this.octokit.rest.actions.listJobsForWorkflowRun({
        owner: this.owner,
        repo: this.repo,
        run_id: parseInt(workflowRunId),
      })

      const failures: AnalyzedFailure[] = []
      const failedJobsCount = jobs.data.jobs.filter(job => job.conclusion === "failure").length
      const summary = `CI Test workflow failed with ${failedJobsCount} failed jobs`

      // Analyze each failed job
      for (const job of jobs.data.jobs) {
        if (job.conclusion === "failure") {
          console.log(`  📋 Analyzing failed job: ${job.name}`)

          try {
            // Get job logs
            const logs = await this.octokit.rest.actions.downloadJobLogsForWorkflowRun({
              owner: this.owner,
              repo: this.repo,
              job_id: job.id,
            })

            const logContent = Buffer.from(logs.data as ArrayBuffer).toString("utf-8")
            const analysis = this.analyzeJobLogs(job.name, logContent)

            // Create AnalyzedFailure objects for each identified issue
            for (const issue of analysis.issues) {
              const failure = createAnalyzedFailure({
                type: "ci_failure" as FailureType,
                content: issue.description,
                priority: issue.priority,
                files: issue.files,
                lineNumbers: issue.lineNumbers,
                rootCause: issue.rootCause,
                impact: `Job '${job.name}' failed in workflow run ${workflowRunId}`,
                suggestedFix: issue.suggestedFix,
                relatedPR: `#${prNumber}`,
              })
              failures.push(failure)
            }
          } catch (logError) {
            console.warn(`  ⚠️  Could not fetch logs for job ${job.name}:`, logError)
            
            // Create a generic failure for jobs we can't analyze
            const failure = createAnalyzedFailure({
              type: "ci_failure" as FailureType,
              content: `${job.name} failed - logs unavailable`,
              priority: "medium",
              impact: `Job '${job.name}' failed but logs could not be retrieved`,
              suggestedFix: "Check the GitHub Actions workflow logs manually",
              relatedPR: `#${prNumber}`,
            })
            failures.push(failure)
          }
        }
      }

      // Create AnaResults using the new format
      const anaResults = createAnaResults(failures, summary)

      // Send to Tod via webhook (Issue #282)
      await this.sendToTodWebhook(anaResults, workflowRunId, prNumber)

      // Create legacy format for workflow compatibility
      const legacyResults: LegacyAnaResults = {
        todos: failures.map(failure => ({
          id: failure.id,
          content: failure.content,
          priority: failure.priority,
          files: failure.files || [],
          lineNumbers: failure.lineNumbers || [],
          issueType: "ci_failure" as const,
          relatedPR: `#${prNumber}`,
          createdAt: failure.createdAt,
        })),
        summary: anaResults.summary,
        analysisDate: anaResults.analysisDate,
      }

      // Save results for workflow artifact
      writeFileSync("ana-results.json", JSON.stringify(legacyResults, null, 2))
      console.log(`✅ Ana analyzed ${failures.length} failures and sent to Tod webhook`)

      return legacyResults
    } catch (error) {
      console.error("❌ Error analyzing CI failures:", error)
      throw error
    }
  }

  /**
   * Analyze Cursor Bugbot review and send to Tod via webhook (Issue #282)
   */
  async analyzeCursorBugbot(
    prNumber: number,
    commentId: number
  ): Promise<LegacyAnaResults> {
    console.log(`🔍 Ana analyzing Cursor Bugbot review for PR #${prNumber}...`)

    try {
      // Get the comment
      const comment = await this.octokit.rest.issues.getComment({
        owner: this.owner,
        repo: this.repo,
        comment_id: commentId,
      })

      const commentBody = comment.data.body || ""
      console.log(`  📝 Comment preview: ${commentBody.substring(0, 100)}...`)

      // Analyze the comment for issues
      const analysis = this.analyzeCursorBugbotComment(commentBody)
      const failures: AnalyzedFailure[] = []

      // Create AnalyzedFailure objects for each identified issue
      for (const issue of analysis.issues) {
        const failure = createAnalyzedFailure({
          type: "bugbot_issue" as FailureType,
          content: issue.description,
          priority: issue.priority,
          files: issue.files,
          lineNumbers: issue.lineNumbers,
          rootCause: "Code quality issue identified by Cursor Bugbot",
          impact: "Code quality and maintainability concerns",
          suggestedFix: issue.suggestedFix || "Review and address the Cursor Bugbot feedback",
          relatedPR: `#${prNumber}`,
        })
        failures.push(failure)
      }

      const summary = `Cursor Bugbot review analysis found ${failures.length} issues`
      
      // Create AnaResults using the new format
      const anaResults = createAnaResults(failures, summary)

      // Send to Tod via webhook (Issue #282)
      await this.sendToTodWebhook(anaResults, `comment-${commentId}`, prNumber)

      // Create legacy format for workflow compatibility
      const legacyResults: LegacyAnaResults = {
        todos: failures.map(failure => ({
          id: failure.id,
          content: failure.content,
          priority: failure.priority,
          files: failure.files || [],
          lineNumbers: failure.lineNumbers || [],
          issueType: "bugbot_issue" as const,
          relatedPR: `#${prNumber}`,
          createdAt: failure.createdAt,
        })),
        summary: anaResults.summary,
        analysisDate: anaResults.analysisDate,
      }

      // Save results for workflow artifact
      writeFileSync("ana-results.json", JSON.stringify(legacyResults, null, 2))
      console.log(`✅ Ana analyzed ${failures.length} Bugbot issues and sent to Tod webhook`)

      return legacyResults
    } catch (error) {
      console.error("❌ Error analyzing Cursor Bugbot review:", error)
      throw error
    }
  }

  /**
   * Send analysis results to Tod via webhook (Issue #282)
   */
  private async sendToTodWebhook(
    anaResults: AnaResults,
    workflowRunId: string,
    prNumber: number
  ): Promise<void> {
    try {
      console.log(`🚀 Sending ${anaResults.failures.length} failures to Tod webhook...`)
      
      // Create webhook payload using Issue #282 format
      const payload = createAnaWebhookPayload(anaResults, workflowRunId, prNumber)
      
      // Send to Tod webhook
      const result = await this.webhookClient.sendToTod(payload)
      
      if (result.success) {
        console.log(`✅ Successfully sent to Tod webhook: ${result.data?.message || 'Success'}`)
        if (result.data?.todosCreated) {
          console.log(`   📋 Created ${result.data.todosCreated} TODOs in Cursor`)
        }
      } else {
        console.error(`❌ Failed to send to Tod webhook: ${result.error}`)
        throw new Error(`Webhook failed: ${result.error}`)
      }
    } catch (error) {
      console.error("❌ Error sending to Tod webhook:", error)
      throw error
    }
  }

  /**
   * Analyze job logs to extract failure information
   */
  private analyzeJobLogs(
    jobName: string,
    logContent: string
  ): {
    issues: Array<{
      description: string
      priority: "low" | "medium" | "high" | "critical"
      files?: string[] | undefined
      lineNumbers?: number[] | undefined
      rootCause?: string
      suggestedFix?: string
    }>
  } {
    const issues: Array<{
      description: string
      priority: "low" | "medium" | "high" | "critical"
      files?: string[] | undefined
      lineNumbers?: number[] | undefined
      rootCause?: string
      suggestedFix?: string
    }> = []

    // Enhanced failure patterns with root cause and suggested fixes
    const patterns = [
      {
        regex: /error\s+in\s+([^\s]+\.(ts|tsx|js|jsx)):(\d+):(\d+)/gi,
        priority: "high" as const,
        extractFiles: true,
        extractLines: true,
        rootCause: "TypeScript compilation error",
        suggestedFix: "Fix TypeScript errors in the specified file and line",
      },
      {
        regex: /test\s+failed[:\s]+([^\n]+)/gi,
        priority: "high" as const,
        extractFiles: false,
        extractLines: false,
        rootCause: "Jest test failure",
        suggestedFix: "Review and fix the failing test case",
      },
      {
        regex: /build\s+failed[:\s]+([^\n]+)/gi,
        priority: "critical" as const,
        extractFiles: false,
        extractLines: false,
        rootCause: "Build process failure",
        suggestedFix: "Check build configuration and resolve compilation errors",
      },
      {
        regex: /lint\s+error[:\s]+([^\n]+)/gi,
        priority: "medium" as const,
        extractFiles: false,
        extractLines: false,
        rootCause: "ESLint error",
        suggestedFix: "Fix linting errors or update ESLint configuration",
      },
    ]

    for (const pattern of patterns) {
      let match
      while ((match = pattern.regex.exec(logContent)) !== null) {
        const description = match[1] || `Failure in ${jobName}`
        const files = pattern.extractFiles && match[1] ? [match[1]] : undefined
        const lineNumbers =
          pattern.extractLines && match[3] ? [parseInt(match[3])] : undefined

        issues.push({
          description: `${jobName}: ${description}`,
          priority: pattern.priority,
          files: files ?? undefined,
          lineNumbers: lineNumbers ?? undefined,
          rootCause: pattern.rootCause,
          suggestedFix: pattern.suggestedFix,
        })
      }
    }

    // If no specific patterns found, create a general failure todo
    if (issues.length === 0) {
      issues.push({
        description: `${jobName} failed - check logs for details`,
        priority: "medium",
        rootCause: "Unknown failure in CI job",
        suggestedFix: "Review the full job logs to identify the root cause",
      })
    }

    return { issues }
  }

  /**
   * Analyze Cursor Bugbot comment for issues
   */
  private analyzeCursorBugbotComment(commentBody: string): {
    issues: Array<{
      description: string
      priority: "low" | "medium" | "high" | "critical"
      files?: string[] | undefined
      lineNumbers?: number[] | undefined
      suggestedFix?: string
    }>
  } {
    const issues: Array<{
      description: string
      priority: "low" | "medium" | "high" | "critical"
      files?: string[] | undefined
      lineNumbers?: number[] | undefined
      suggestedFix?: string
    }> = []

    // Extract file references
    const filePattern = /`([^`]+\.(ts|tsx|js|jsx))`/g
    const files: string[] = []
    let match
    while ((match = filePattern.exec(commentBody)) !== null) {
      if (match[1]) {
        files.push(match[1])
      }
    }

    // Extract line numbers
    const linePattern = /line\s+(\d+)/gi
    const lineNumbers: number[] = []
    while ((match = linePattern.exec(commentBody)) !== null) {
      if (match[1]) {
        lineNumbers.push(parseInt(match[1]))
      }
    }

    // Determine priority based on comment content
    let priority: "low" | "medium" | "high" | "critical" = "medium"
    if (
      commentBody.toLowerCase().includes("critical") ||
      commentBody.toLowerCase().includes("security")
    ) {
      priority = "critical"
    } else if (
      commentBody.toLowerCase().includes("error") ||
      commentBody.toLowerCase().includes("bug")
    ) {
      priority = "high"
    } else if (
      commentBody.toLowerCase().includes("suggestion") ||
      commentBody.toLowerCase().includes("improvement")
    ) {
      priority = "low"
    }

    // Extract suggested fix from comment
    let suggestedFix = "Review and address the Cursor Bugbot feedback"
    if (commentBody.toLowerCase().includes("suggestion")) {
      const suggestionMatch = commentBody.match(/suggestion[:\s]*([^\n.]+)/i)
      if (suggestionMatch && suggestionMatch[1]) {
        suggestedFix = suggestionMatch[1].trim()
      }
    }

    // Create a single todo for the entire Cursor Bugbot review
    issues.push({
      description: `Cursor Bugbot Review: ${commentBody.substring(0, 200)}${
        commentBody.length > 200 ? "..." : ""
      }`,
      priority,
      files: files.length > 0 ? files : undefined,
      lineNumbers: lineNumbers.length > 0 ? lineNumbers : undefined,
      suggestedFix,
    })

    return { issues }
  }

}

async function main() {
  const command = process.argv[2]

  try {
    const analyzer = new AnaAnalyzer()

    switch (command) {
      case "analyze-ci-failures":
        const workflowRunId = process.argv[3]
        const prNumber = parseInt(process.argv[4]!)

        if (!workflowRunId || !prNumber) {
          console.log(
            "❌ Usage: npx tsx scripts/ana-cli.ts analyze-ci-failures <WORKFLOW_RUN_ID> <PR_NUMBER>"
          )
          process.exit(1)
        }

        await analyzer.analyzeCIFailures(workflowRunId, prNumber)
        break

      case "analyze-cursor-bugbot":
        const prNum = parseInt(process.argv[3]!)
        const commentId = parseInt(process.argv[4]!)

        if (!prNum || !commentId) {
          console.log(
            "❌ Usage: npx tsx scripts/ana-cli.ts analyze-cursor-bugbot <PR_NUMBER> <COMMENT_ID>"
          )
          process.exit(1)
        }

        await analyzer.analyzeCursorBugbot(prNum, commentId)
        break

      default:
        console.log("❌ Unknown command. Available commands:")
        console.log("  analyze-ci-failures <WORKFLOW_RUN_ID> <PR_NUMBER>")
        console.log("  analyze-cursor-bugbot <PR_NUMBER> <COMMENT_ID>")
        process.exit(1)
    }
  } catch (error) {
    console.error("❌ Error:", error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Fatal error:", error)
    process.exit(1)
  })
}
