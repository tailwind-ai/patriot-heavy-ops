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
    | "review_comment"
    | "ci_failure"
    | "vercel_failure"
    | "lint_error"
    | "test_failure"
    | "definition_of_done"
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
      // eslint-disable-next-line no-console
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
      // Skip non-review comments
      if (!this.isReviewComment(comment)) continue

      const issue = this.parseReviewComment(comment)
      if (issue) {
        issues.push(issue)
      }
    }

    return issues
  }

  /**
   * Check if a comment is a review comment
   */
  private isReviewComment(comment: GitHubComment): boolean {
    const body = comment.body || ""

    // Check for code suggestion blocks (most reliable indicator)
    if (body.includes("```suggestion") || body.includes("```diff")) {
      return true
    }

    // Check for specific actionable review patterns
    const actionablePatterns = [
      /```[\s\S]*?suggestion[\s\S]*?```/i,
      /```[\s\S]*?fix[\s\S]*?```/i,
      /should\s+(be|use|have|include|change)/i,
      /consider\s+(using|changing|adding|removing)/i,
      /recommend\s+(using|changing|adding)/i,
      /suggest\s+(using|changing|adding|removing)/i,
      /instead\s+of/i,
      /better\s+to/i,
      /prefer\s+(to|using)/i,
    ]

    return actionablePatterns.some((pattern) => pattern.test(body))
  }

  /**
   * Parse a review comment to extract issue information
   */
  private parseReviewComment(comment: GitHubComment): GitHubIssue | null {
    const body = comment.body.toLowerCase()

    // Determine issue type based on comment content
    let type: GitHubIssue["type"] = "review_comment"
    let severity: GitHubIssue["severity"] = "medium"
    let suggestedFix: string | undefined

    // Check for specific patterns in review comments
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
        run.pull_requests?.some((pr) => pr.number === prNumber)
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
      // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
      console.error("Error fetching failed jobs:", error)
      return []
    }
  }

  /**
   * Get job logs and analyze failure cause using GitHub CLI
   */
  async analyzeJobFailure(jobId: number): Promise<{
    errorType: string
    errorMessage: string
    suggestedFix: string
    affectedFiles: string[]
  }> {
    try {
      // Use GitHub CLI to get job logs (works with PAT permissions)
      const { execSync } = await import("child_process")

      const logContent = execSync(
        `gh api repos/${this.owner}/${this.repo}/actions/jobs/${jobId}/logs --paginate`,
        {
          encoding: "utf8",
          env: {
            ...process.env,
            GITHUB_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
          },
        }
      )

      return this.parseFailureLogs(logContent)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error analyzing job failure:", error)

      // Fallback: try to get basic job info without logs
      try {
        const { execSync } = await import("child_process")
        const jobInfo = execSync(
          `gh api repos/${this.owner}/${this.repo}/actions/jobs/${jobId} --jq '.name + ": " + .conclusion'`,
          {
            encoding: "utf8",
            env: {
              ...process.env,
              GITHUB_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
            },
          }
        )

        return {
          errorType: "ci_failure",
          errorMessage: `Job failed: ${jobInfo.trim()}`,
          suggestedFix: `Check GitHub Actions logs at: https://github.com/${this.owner}/${this.repo}/actions/jobs/${jobId}`,
          affectedFiles: [],
        }
      } catch {
        return {
          errorType: "unknown",
          errorMessage: "Unable to analyze failure logs - check permissions",
          suggestedFix: "Verify GitHub token has Actions:read permissions",
          affectedFiles: [],
        }
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
        if (match?.[1] && match?.[2]) {
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
      if (fileMatch?.[1]) {
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
      // eslint-disable-next-line no-console
      console.error("Error fetching CI failure issues:", error)
    }

    return issues
  }

  /**
   * Check PR status and determine if Definition of Done verification is needed
   */
  async getPRStatus(prNumber: number): Promise<{
    allChecksPass: boolean
    readyForDoD: boolean
    checksStatus: Array<{
      name: string
      status: string
      conclusion: string
    }>
  }> {
    try {
      const { data: pr } = await this.octokit.rest.pulls.get({
        owner: this.owner,
        repo: this.repo,
        pull_number: prNumber,
      })

      // Get combined status for the PR
      const { data: combinedStatus } =
        await this.octokit.rest.repos.getCombinedStatusForRef({
          owner: this.owner,
          repo: this.repo,
          ref: pr.head.sha,
        })

      // Get check runs for the PR
      const { data: checkRuns } = await this.octokit.rest.checks.listForRef({
        owner: this.owner,
        repo: this.repo,
        ref: pr.head.sha,
      })

      const checksStatus = [
        ...combinedStatus.statuses.map((status) => ({
          name: status.context,
          status: status.state,
          conclusion: status.state,
        })),
        ...checkRuns.check_runs.map((check) => ({
          name: check.name,
          status: check.status || "unknown",
          conclusion: check.conclusion || "unknown",
        })),
      ]

      const allChecksPass =
        combinedStatus.state === "success" &&
        checkRuns.check_runs.every(
          (check) =>
            check.conclusion === "success" || check.conclusion === "neutral"
        )

      const readyForDoD = allChecksPass && pr.mergeable_state === "clean"

      return {
        allChecksPass,
        readyForDoD,
        checksStatus,
      }
    } catch (error) {
      console.error("Error checking PR status:", error)
      return {
        allChecksPass: false,
        readyForDoD: false,
        checksStatus: [],
      }
    }
  }

  /**
   * Generate Definition of Done todos when PR is ready
   */
  async getDefinitionOfDoneTodos(prNumber: number): Promise<GitHubIssue[]> {
    const issues: GitHubIssue[] = []

    try {
      const prStatus = await this.getPRStatus(prNumber)

      // Only create DoD todos if all checks are passing
      if (!prStatus.allChecksPass) {
        return issues
      }

      // Create Definition of Done verification todos
      const dodTodos = [
        {
          id: `dod-tests-${prNumber}`,
          content: "Verify ALL tests pass (npm test returns 0 exit code)",
          type: "definition_of_done" as const,
          severity: "critical" as const,
          suggestedFix:
            "Run 'npm test' and ensure all tests pass with exit code 0",
        },
        {
          id: `dod-linting-${prNumber}`,
          content: "Verify ALL linting passes (ESLint clean)",
          type: "definition_of_done" as const,
          severity: "critical" as const,
          suggestedFix:
            "Run 'npx eslint . --ext .ts,.tsx --max-warnings 0' and fix all issues",
        },
        {
          id: `dod-typescript-${prNumber}`,
          content: "Verify ALL TypeScript compilation passes",
          type: "definition_of_done" as const,
          severity: "critical" as const,
          suggestedFix: "Run 'npx tsc --noEmit' and fix all compilation errors",
        },
        {
          id: `dod-commits-${prNumber}`,
          content: "Verify ALL changes committed with conventional commits",
          type: "definition_of_done" as const,
          severity: "critical" as const,
          suggestedFix:
            "Check git log and ensure all commits follow conventional commit format",
        },
        {
          id: `dod-pushed-${prNumber}`,
          content: "Verify ALL changes pushed to remote branch",
          type: "definition_of_done" as const,
          severity: "critical" as const,
          suggestedFix:
            "Run 'git status' and 'git push' to ensure all changes are pushed",
        },
        {
          id: `dod-ci-checks-${prNumber}`,
          content: `Monitor ALL CI checks are green on PR #${prNumber}`,
          type: "definition_of_done" as const,
          severity: "critical" as const,
          suggestedFix: `Use 'gh pr checks ${prNumber}' to monitor CI status until all checks pass`,
        },
        {
          id: `dod-complete-${prNumber}`,
          content:
            "Confirm Definition of Done achieved - 100% of checks passing",
          type: "definition_of_done" as const,
          severity: "critical" as const,
          suggestedFix:
            "Only mark complete when ALL above verification steps pass",
        },
      ]

      issues.push(...dodTodos)

      console.log(
        `✅ Generated ${dodTodos.length} Definition of Done todos for PR #${prNumber}`
      )
    } catch (error) {
      console.error("Error generating Definition of Done todos:", error)
    }

    return issues
  }
}
