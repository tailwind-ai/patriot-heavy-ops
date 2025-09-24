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
      suggestedFix: suggestedFix || '',
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
}
