#!/usr/bin/env tsx

/**
 * Ana CLI - Simplified Background Agent
 * Analyzes CI failures and Cursor Bugbot reviews, adds items to Cursor TODO list
 */

import { Octokit } from "@octokit/rest"
import { execSync } from "child_process"
import { writeFileSync } from "fs"

interface AnaTodo {
  id: string
  content: string
  priority: "low" | "medium" | "high" | "critical"
  files?: string[] | undefined
  lineNumbers?: number[] | undefined
  issueType: "ci_failure" | "cursor_bugbot"
  relatedPR: string
  createdAt: string
}

interface AnaResults {
  todos: AnaTodo[]
  summary: string
  analysisDate: string
}

class AnaAnalyzer {
  private octokit: Octokit
  private owner: string
  private repo: string

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_ACCESS_TOKEN,
    })
    this.owner = "samuelhenry"
    this.repo = "patriot-heavy-ops"
  }

  /**
   * Analyze CI Test failures and create Cursor TODOs
   */
  async analyzeCIFailures(
    workflowRunId: string,
    prNumber: number
  ): Promise<AnaResults> {
    console.log(`🔍 Ana analyzing CI Test failures for PR #${prNumber}...`)

    try {
      // Get workflow run details (for future use)
      await this.octokit.rest.actions.getWorkflowRun({
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

      const todos: AnaTodo[] = []
      const summary = `CI Test workflow failed with ${jobs.data.jobs.length} jobs`

      // Analyze each failed job
      for (const job of jobs.data.jobs) {
        if (job.conclusion === "failure") {
          console.log(`  📋 Analyzing failed job: ${job.name}`)

          // Get job logs
          const logs =
            await this.octokit.rest.actions.downloadJobLogsForWorkflowRun({
              owner: this.owner,
              repo: this.repo,
              job_id: job.id,
            })

          const logContent = Buffer.from(logs.data as ArrayBuffer).toString(
            "utf-8"
          )
          const analysis = this.analyzeJobLogs(job.name, logContent)

          // Create todos for each identified issue
          for (const issue of analysis.issues) {
            const todo: AnaTodo = {
              id: `ci-${workflowRunId}-${job.id}-${Date.now()}`,
              content: issue.description,
              priority: issue.priority,
              files: issue.files ?? undefined,
              lineNumbers: issue.lineNumbers ?? undefined,
              issueType: "ci_failure",
              relatedPR: `#${prNumber}`,
              createdAt: new Date().toISOString(),
            }
            todos.push(todo)

            // Add to Cursor TODO list
            await this.addToCursorTodo(todo)
          }
        }
      }

      const results: AnaResults = {
        todos,
        summary,
        analysisDate: new Date().toISOString(),
      }

      // Save results
      writeFileSync("ana-results.json", JSON.stringify(results, null, 2))
      console.log(
        `✅ Ana created ${todos.length} TODOs from CI failure analysis`
      )

      return results
    } catch (error) {
      console.error("❌ Error analyzing CI failures:", error)
      throw error
    }
  }

  /**
   * Analyze Cursor Bugbot review and create Cursor TODOs
   */
  async analyzeCursorBugbot(
    prNumber: number,
    commentId: number
  ): Promise<AnaResults> {
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
      const todos: AnaTodo[] = []

      // Create todos for each identified issue
      for (const issue of analysis.issues) {
        const todo: AnaTodo = {
          id: `cursor-${commentId}-${Date.now()}`,
          content: issue.description,
          priority: issue.priority,
          files: issue.files ?? undefined,
          lineNumbers: issue.lineNumbers ?? undefined,
          issueType: "cursor_bugbot",
          relatedPR: `#${prNumber}`,
          createdAt: new Date().toISOString(),
        }
        todos.push(todo)

        // Add to Cursor TODO list
        await this.addToCursorTodo(todo)
      }

      const results: AnaResults = {
        todos,
        summary: `Cursor Bugbot review analysis found ${todos.length} issues`,
        analysisDate: new Date().toISOString(),
      }

      // Save results
      writeFileSync("ana-results.json", JSON.stringify(results, null, 2))
      console.log(
        `✅ Ana created ${todos.length} TODOs from Cursor Bugbot analysis`
      )

      return results
    } catch (error) {
      console.error("❌ Error analyzing Cursor Bugbot review:", error)
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
    }>
  } {
    const issues: Array<{
      description: string
      priority: "low" | "medium" | "high" | "critical"
      files?: string[] | undefined
      lineNumbers?: number[] | undefined
    }> = []

    // Common failure patterns
    const patterns = [
      {
        regex: /error\s+in\s+([^\s]+\.(ts|tsx|js|jsx)):(\d+):(\d+)/gi,
        priority: "high" as const,
        extractFiles: true,
        extractLines: true,
      },
      {
        regex: /test\s+failed[:\s]+([^\n]+)/gi,
        priority: "high" as const,
        extractFiles: false,
        extractLines: false,
      },
      {
        regex: /build\s+failed[:\s]+([^\n]+)/gi,
        priority: "critical" as const,
        extractFiles: false,
        extractLines: false,
      },
      {
        regex: /lint\s+error[:\s]+([^\n]+)/gi,
        priority: "medium" as const,
        extractFiles: false,
        extractLines: false,
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
        })
      }
    }

    // If no specific patterns found, create a general failure todo
    if (issues.length === 0) {
      issues.push({
        description: `${jobName} failed - check logs for details`,
        priority: "medium",
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
    }>
  } {
    const issues: Array<{
      description: string
      priority: "low" | "medium" | "high" | "critical"
      files?: string[] | undefined
      lineNumbers?: number[] | undefined
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

    // Create a single todo for the entire Cursor Bugbot review
    issues.push({
      description: `Cursor Bugbot Review: ${commentBody.substring(0, 200)}${
        commentBody.length > 200 ? "..." : ""
      }`,
      priority,
      files: files.length > 0 ? files : undefined,
      lineNumbers: lineNumbers.length > 0 ? lineNumbers : undefined,
    })

    return { issues }
  }

  /**
   * Add todo to Cursor TODO list using Cursor CLI
   */
  private async addToCursorTodo(todo: AnaTodo): Promise<void> {
    try {
      // Use Cursor CLI to add the todo
      const cursorCommand = `cursor todo add "${todo.content}" --priority ${todo.priority}`

      if (todo.files && todo.files.length > 0) {
        const filesArg = todo.files.join(",")
        const fullCommand = `${cursorCommand} --files "${filesArg}"`
        execSync(fullCommand, { stdio: "pipe" })
      } else {
        execSync(cursorCommand, { stdio: "pipe" })
      }

      console.log(
        `  ✅ Added to Cursor TODO: ${todo.content.substring(0, 50)}...`
      )
    } catch (error) {
      console.warn(`  ⚠️  Failed to add to Cursor TODO: ${error}`)
      // Continue processing even if Cursor CLI fails
    }
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
