/**
 * Real Background Agent that integrates with GitHub API
 * This version fetches actual PR comments and converts them to todos
 */

import { GitHubIntegration, GitHubIssue } from "./github-integration"
import { MockTodoItem } from "./mock-background-agent"

export class RealBackgroundAgent {
  private githubIntegration: GitHubIntegration
  private todos: MockTodoItem[] = []
  private issueCounter = 0

  constructor(githubToken: string, owner: string, repo: string) {
    this.githubIntegration = new GitHubIntegration(githubToken, owner, repo)
  }

  /**
   * Fetch real issues from GitHub PR
   */
  async detectIssues(prNumber: number): Promise<GitHubIssue[]> {
    try {
      console.log(`🔍 Fetching issues from PR #${prNumber}...`)
      
      // Get both comment issues and CI failure issues
      const [commentIssues, ciIssues] = await Promise.all([
        this.githubIntegration.getPRIssues(prNumber),
        this.githubIntegration.getCIFailureIssues(prNumber)
      ])
      
      const allIssues = [...commentIssues, ...ciIssues]
      console.log(`✅ Found ${commentIssues.length} comment issues and ${ciIssues.length} CI failure issues`)
      
      return allIssues
    } catch (error) {
      console.error('Error fetching GitHub issues:', error)
      return []
    }
  }

  /**
   * Convert GitHub issues to todo items
   */
  async convertIssuesToTodos(issues: GitHubIssue[]): Promise<MockTodoItem[]> {
    const todos: MockTodoItem[] = []

    for (const issue of issues) {
      const todo: MockTodoItem = {
        id: `github-${++this.issueCounter}`,
        content: issue.content,
        status: "pending",
        priority: this.mapSeverityToPriority(issue.severity),
        dependencies: this.calculateDependencies(issue, issues),
        issueType: issue.type,
        files: issue.files || [],
        lineNumbers: issue.lineNumbers || [],
        suggestedFix: issue.suggestedFix || "",
      }
      todos.push(todo)
    }

    // Sort by priority and dependencies
    return todos.sort((a, b) => {
      // Critical issues first
      if (a.priority === "critical" && b.priority !== "critical") return -1
      if (b.priority === "critical" && a.priority !== "critical") return 1

      // High priority issues next
      if (a.priority === "high" && b.priority === "medium") return -1
      if (b.priority === "high" && a.priority === "medium") return 1

      // Issues with no dependencies first
      if (a.dependencies.length === 0 && b.dependencies.length > 0) return -1
      if (b.dependencies.length === 0 && a.dependencies.length > 0) return 1

      return 0
    })
  }

  /**
   * Map issue severity to todo priority
   */
  private mapSeverityToPriority(
    severity: string
  ): "low" | "medium" | "high" | "critical" {
    switch (severity) {
      case "critical":
        return "critical"
      case "high":
        return "high"
      case "medium":
        return "medium"
      case "low":
        return "low"
      default:
        return "medium"
    }
  }

  /**
   * Calculate dependencies between issues
   */
  private calculateDependencies(
    issue: GitHubIssue,
    allIssues: GitHubIssue[]
  ): string[] {
    const dependencies: string[] = []

    // TypeScript compilation issues should be fixed before test issues
    if (
      issue.type === "test_failure" &&
      issue.files?.some((f) => f.includes("mobile-auth"))
    ) {
      const tsIssues = allIssues.filter(
        (i) =>
          i.type === "lint_error" && i.files?.some((f) => f.includes("types"))
      )
      tsIssues.forEach((tsIssue) => {
        const tsTodo = this.todos.find((t) => t.content === tsIssue.content)
        if (tsTodo) dependencies.push(tsTodo.id)
      })
    }

    // Prisma type issues should be fixed before auth issues
    if (
      issue.type === "test_failure" &&
      issue.files?.some((f) => f.includes("auth"))
    ) {
      const prismaIssues = allIssues.filter((i) =>
        i.files?.some((f) => f.includes("types/api.ts"))
      )
      prismaIssues.forEach((prismaIssue) => {
        const prismaTodo = this.todos.find(
          (t) => t.content === prismaIssue.content
        )
        if (prismaTodo) dependencies.push(prismaTodo.id)
      })
    }

    return dependencies
  }

  /**
   * Add a todo item
   */
  addTodo(todo: MockTodoItem): void {
    this.todos.push(todo)
  }

  /**
   * Get all todos
   */
  getTodos(): MockTodoItem[] {
    return this.todos
  }

  /**
   * Get todos with dependency analysis
   */
  getTodosWithDependencies(): {
    todos: MockTodoItem[]
    readyTodos: MockTodoItem[]
    blockedTodos: MockTodoItem[]
  } {
    const readyTodos = this.todos.filter((todo) => {
      if (todo.status !== "pending") return false

      // Check if all dependencies are completed
      return todo.dependencies.every((depId) => {
        const depTodo = this.todos.find((t) => t.id === depId)
        return depTodo?.status === "completed"
      })
    })

    const blockedTodos = this.todos.filter((todo) => {
      if (todo.status !== "pending") return false
      return todo.dependencies.some((depId) => {
        const depTodo = this.todos.find((t) => t.id === depId)
        return depTodo?.status !== "completed"
      })
    })

    return {
      todos: this.todos,
      readyTodos,
      blockedTodos,
    }
  }

  /**
   * Update todo status
   */
  updateTodoStatus(id: string, status: MockTodoItem["status"]): boolean {
    const todo = this.todos.find((t) => t.id === id)
    if (todo) {
      todo.status = status
      return true
    }
    return false
  }

  /**
   * Process issues from a specific PR
   */
  async processPRIssues(prNumber: number): Promise<MockTodoItem[]> {
    console.log(`🤖 Processing issues from PR #${prNumber}...`)
    
    const issues = await this.detectIssues(prNumber)
    const todos = await this.convertIssuesToTodos(issues)
    
    // Add new todos
    todos.forEach((todo) => this.addTodo(todo))
    
    console.log(`✅ Added ${todos.length} todos from GitHub PR #${prNumber}`)
    return todos
  }

  /**
   * Process issues including Definition of Done checks
   */
  async processPRIssuesWithDoD(prNumber: number): Promise<MockTodoItem[]> {
    console.log(`🤖 Processing issues from PR #${prNumber} with Definition of Done checks...`)
    
    // Get regular issues (comments, CI failures)
    const regularIssues = await this.detectIssues(prNumber)
    
    // Get Definition of Done todos if PR is ready
    const dodIssues = await this.githubIntegration.getDefinitionOfDoneTodos(prNumber)
    
    // Combine all issues
    const allIssues = [...regularIssues, ...dodIssues]
    const todos = await this.convertIssuesToTodos(allIssues)
    
    // Clear existing todos and add new ones
    this.todos = []
    todos.forEach((todo) => this.addTodo(todo))
    
    console.log(`✅ Added ${todos.length} todos from GitHub PR #${prNumber} (${dodIssues.length} DoD todos)`)
    return todos
  }
}

// Export singleton instance
export const realBackgroundAgent = new RealBackgroundAgent(
  process.env.GITHUB_ACCESS_TOKEN || '',
  'samuelhenry',
  'patriot-heavy-ops'
)
