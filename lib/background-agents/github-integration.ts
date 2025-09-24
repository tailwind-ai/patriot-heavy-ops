import { Octokit } from "@octokit/rest"

export interface GitHubComment {
  id: number
  body: string
  user: {
    login: string
    type: string
  }
  created_at: string
  path?: string
  position?: number
  original_position?: number
}

export interface GitHubIssue {
  id: string
  content: string
  type:
    | "copilot_comment"
    | "ci_failure"
    | "vercel_failure"
    | "lint_error"
    | "test_failure"
  severity: "low" | "medium" | "high" | "critical"
  files?: string[]
  lineNumbers?: number[]
  suggestedFix?: string
}

export interface GitHubWorkflowRun {
  id: number
  name: string
  status: string
  conclusion: string
  created_at: string
  updated_at: string
  html_url: string
  head_sha: string
  pull_requests: Array<{
    number: number
    title: string
  }>
}

export interface GitHubJob {
  id: number
  name: string
  status: string
  conclusion: string
  started_at: string
  completed_at: string
  steps: Array<{
    name: string
    status: string
    conclusion: string
    number: number
  }>
}

export class GitHubIntegration {
  private octokit: Octokit
  private owner: string
  private repo: string

  constructor(accessToken: string, owner: string, repo: string) {
    this.octokit = new Octokit({ auth: accessToken })
    this.owner = owner
    this.repo = repo
  }

  /**
   * Fetch all comments from a PR
   */
  async getPRComments(prNumber: number): Promise<GitHubComment[]> {
    try {
      const { data: comments } =
        await this.octokit.rest.pulls.listReviewComments({
          owner: this.owner,
          repo: this.repo,
          pull_number: prNumber,
        })

      return comments.map((comment) => ({
        id: comment.id,
        body: comment.body,
        user: {
          login: comment.user?.login || "unknown",
          type: comment.user?.type || "User",
        },
        created_at: comment.created_at,
        path: comment.path,
        position: comment.position || 0,
        original_position: comment.original_position || 0,
      }))
    } catch (error) {
      console.error("Error fetching PR comments:", error)
      return []
    }
  }

  /**
   * Convert GitHub comments to issues
   */
  convertCommentsToIssues(comments: GitHubComment[]): GitHubIssue[] {
    const issues: GitHubIssue[] = []

    for (const comment of comments) {
      // Skip non-Copilot comments
      if (comment.user.login !== "Copilot") continue

      const issue = this.parseCopilotComment(comment)
      if (issue) {
        issues.push(issue)
      }
    }

    return issues
  }

  /**
   * Parse a Copilot comment to extract issue information
   */
  private parseCopilotComment(comment: GitHubComment): GitHubIssue | null {
    const body = comment.body.toLowerCase()

    // Determine issue type based on comment content
    let type: GitHubIssue["type"] = "copilot_comment"
    let severity: GitHubIssue["severity"] = "medium"
    let suggestedFix: string | undefined

    // Check for specific patterns in Copilot comments
    if (body.includes("import") && body.includes("type")) {
      type = "lint_error"
      severity = "medium"
      suggestedFix = this.extractSuggestion(comment.body)
    } else if (
      body.includes("template literal") ||
      body.includes("backticks")
    ) {
      type = "lint_error"
      severity = "low"
      suggestedFix = this.extractSuggestion(comment.body)
    } else if (body.includes("test") && body.includes("fail")) {
      type = "test_failure"
      severity = "high"
    } else if (body.includes("ci") || body.includes("build")) {
      type = "ci_failure"
      severity = "high"
    } else if (body.includes("vercel") || body.includes("deploy")) {
      type = "vercel_failure"
      severity = "high"
    }

    return {
      id: `github-${comment.id}`,
      content: this.extractDescription(comment.body),
      type,
      severity,
      files: comment.path ? [comment.path] : [],
      lineNumbers: comment.position ? [comment.position] : [],
      suggestedFix: suggestedFix || "",
    }
  }

  /**
   * Extract description from comment body
   */
  private extractDescription(body: string): string {
    // Remove code blocks and extract the main description
    const lines = body.split("\n")
    const description = lines.find(
      (line) =>
        line.trim() &&
        !line.startsWith("```") &&
        !line.startsWith("The ") &&
        !line.startsWith("Change to")
    )

    return description?.trim() || body.substring(0, 100) + "..."
  }

  /**
   * Extract suggested fix from comment body
   */
  private extractSuggestion(body: string): string | undefined {
    const suggestionMatch = body.match(/```suggestion\n([\s\S]*?)\n```/)
    if (suggestionMatch?.[1]) {
      return suggestionMatch[1].trim()
    }

    const codeBlockMatch = body.match(/```[\s\S]*?\n([\s\S]*?)\n```/)
    if (codeBlockMatch?.[1]) {
      return codeBlockMatch[1].trim()
    }

    return undefined
  }

  /**
   * Get all issues from a PR
   */
  async getPRIssues(prNumber: number): Promise<GitHubIssue[]> {
    const comments = await this.getPRComments(prNumber)
    return this.convertCommentsToIssues(comments)
  }

  /**
   * Fetch GitHub Actions workflow runs for a PR
   */
  async getPRWorkflowRuns(prNumber: number): Promise<GitHubWorkflowRun[]> {
    try {
      const { data: runs } =
        await this.octokit.rest.actions.listWorkflowRunsForRepo({
          owner: this.owner,
          repo: this.repo,
          per_page: 20,
        })

      // Filter runs related to the PR
      const prRuns = runs.workflow_runs.filter((run) =>
        run.pull_requests && run.pull_requests.some((pr) => pr.number === prNumber)
      )

      return prRuns.map((run) => ({
        id: run.id,
        name: run.name || "Unknown Workflow",
        status: run.status || "unknown",
        conclusion: run.conclusion || "unknown",
        created_at: run.created_at,
        updated_at: run.updated_at,
        html_url: run.html_url,
        head_sha: run.head_sha,
        pull_requests: (run.pull_requests || []).map((pr) => ({
          number: pr.number,
          title: `PR #${pr.number}`, // GitHub API doesn't include title in workflow runs
        })),
      }))
    } catch (error) {
      console.error("Error fetching workflow runs:", error)
      return []
    }
  }

  /**
   * Get failed jobs from a workflow run
   */
  async getFailedJobs(runId: number): Promise<GitHubJob[]> {
    try {
      const { data: jobs } =
        await this.octokit.rest.actions.listJobsForWorkflowRun({
          owner: this.owner,
          repo: this.repo,
          run_id: runId,
        })

      return jobs.jobs
        .filter((job) => job.conclusion === "failure")
        .map((job) => ({
          id: job.id,
          name: job.name,
          status: job.status,
          conclusion: job.conclusion || "unknown",
          started_at: job.started_at || "",
          completed_at: job.completed_at || "",
          steps: (job.steps || []).map((step) => ({
            name: step.name,
            status: step.status,
            conclusion: step.conclusion || "unknown",
            number: step.number,
          })),
        }))
    } catch (error) {
      console.error("Error fetching failed jobs:", error)
      return []
    }
  }

  /**
   * Get job logs and analyze failure cause
   */
  async analyzeJobFailure(jobId: number): Promise<{
    errorType: string
    errorMessage: string
    suggestedFix: string
    affectedFiles: string[]
  }> {
    try {
      const { data: logs } =
        await this.octokit.rest.actions.downloadJobLogsForWorkflowRun({
          owner: this.owner,
          repo: this.repo,
          job_id: jobId,
        })

      const logContent = Buffer.from(logs as string, "base64").toString("utf-8")

      return this.parseFailureLogs(logContent)
    } catch (error) {
      console.error("Error analyzing job failure:", error)
      return {
        errorType: "unknown",
        errorMessage: "Unable to analyze failure logs",
        suggestedFix: "Check GitHub Actions logs manually",
        affectedFiles: [],
      }
    }
  }

  /**
   * Parse failure logs to extract error information
   */
  private parseFailureLogs(logContent: string): {
    errorType: string
    errorMessage: string
    suggestedFix: string
    affectedFiles: string[]
  } {
    const lines = logContent.split("\n")
    const affectedFiles: string[] = []
    let errorType = "unknown"
    let errorMessage = ""
    let suggestedFix = ""

    // Look for common error patterns
    for (const line of lines) {
      // TypeScript compilation errors
      if (line.includes("error TS") || line.includes("TypeScript error")) {
        errorType = "typescript"
        const match = line.match(/error TS(\d+):\s*(.+)/)
        if (match) {
          errorMessage = `TypeScript error TS${match[1]}: ${match[2]}`
          suggestedFix = this.getTypeScriptFix(match[1])
        }
      }

      // Test failures
      if (line.includes("FAIL") && line.includes("test")) {
        errorType = "test"
        errorMessage = line.trim()
        suggestedFix = "Review test implementation and fix failing assertions"
      }

      // ESLint errors
      if (line.includes("eslint") && line.includes("error")) {
        errorType = "lint"
        errorMessage = line.trim()
        suggestedFix = "Fix ESLint errors by following the suggested fixes"
      }

      // Build failures
      if (line.includes("build failed") || line.includes("Build failed")) {
        errorType = "build"
        errorMessage = line.trim()
        suggestedFix = "Check build configuration and dependencies"
      }

      // File paths in errors
      const fileMatch = line.match(
        /([a-zA-Z0-9_/.-]+\.(ts|tsx|js|jsx|json|md))/
      )
      if (fileMatch) {
        affectedFiles.push(fileMatch[1])
      }
    }

    return {
      errorType,
      errorMessage: errorMessage || "CI failure detected",
      suggestedFix:
        suggestedFix || "Review CI logs and fix the underlying issue",
      affectedFiles: [...new Set(affectedFiles)], // Remove duplicates
    }
  }

  /**
   * Get TypeScript error fix suggestions
   */
  private getTypeScriptFix(errorCode: string): string {
    const fixes: Record<string, string> = {
      "2305": "Module not found - check import paths and dependencies",
      "2307": "Cannot find module - install missing dependencies",
      "2322": "Type mismatch - check variable types and assignments",
      "2345": "Argument type mismatch - check function parameters",
      "1361": "Cannot use as value - change import type to import",
      "2375": "Type compatibility issue - check optional properties",
    }

    return (
      fixes[errorCode] || "Review TypeScript configuration and type definitions"
    )
  }

  /**
   * Get CI failure issues from a PR
   */
  async getCIFailureIssues(prNumber: number): Promise<GitHubIssue[]> {
    const issues: GitHubIssue[] = []

    try {
      const workflowRuns = await this.getPRWorkflowRuns(prNumber)

      for (const run of workflowRuns) {
        if (run.conclusion === "failure") {
          const failedJobs = await this.getFailedJobs(run.id)

          for (const job of failedJobs) {
            const analysis = await this.analyzeJobFailure(job.id)

            issues.push({
              id: `ci-${run.id}-${job.id}`,
              content: `CI Failure: ${job.name} - ${analysis.errorMessage}`,
              type: "ci_failure",
              severity: "high",
              files: analysis.affectedFiles,
              suggestedFix: analysis.suggestedFix,
            })
          }
        }
      }
    } catch (error) {
      console.error("Error fetching CI failure issues:", error)
    }

    return issues
  }
}
