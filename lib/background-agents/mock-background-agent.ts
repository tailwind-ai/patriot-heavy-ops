/**
 * Mock Background Agent for testing and development
 * This version simulates the Background Agent functionality without requiring
 * real GitHub API tokens or webhook setup.
 */

import { IssueDetection } from "./pr-monitor"

export type MockTodoItem = {
  id: string
  content: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "critical"
  dependencies: string[]
  issueType:
    | "copilot_comment"
    | "ci_failure"
    | "vercel_failure"
    | "lint_error"
    | "test_failure"
    | "definition_of_done"
  files?: string[]
  lineNumbers?: number[]
  suggestedFix?: string
}

export class MockBackgroundAgent {
  private todos: MockTodoItem[] = []
  private issueCounter = 0

  /**
   * Simulate detecting issues from CI failures, test failures, etc.
   */
  async detectIssues(): Promise<IssueDetection[]> {
    // Simulate detecting current CI failures
    const issues: IssueDetection[] = []

    // Detect mobile auth test failures
    issues.push({
      type: "test_failure",
      severity: "high",
      description:
        "Mobile Authentication Middleware tests failing - JWT authentication not working",
      suggestedFix: "Fix JWT token verification in mobile auth middleware",
      files: [
        "__tests__/lib/middleware/mobile-auth.test.ts",
        "lib/middleware/mobile-auth.ts",
      ],
      lineNumbers: [61, 63, 65],
    })

    // Detect mobile auth API failures
    issues.push({
      type: "test_failure",
      severity: "high",
      description:
        "Mobile Auth API endpoints failing - login and refresh endpoints returning 401",
      suggestedFix: "Fix mobile auth API endpoint authentication logic",
      files: [
        "__tests__/api/auth/mobile/login.test.ts",
        "__tests__/api/auth/mobile/refresh.test.ts",
      ],
      lineNumbers: [66, 320, 236],
    })

    // Detect TypeScript compilation issues
    issues.push({
      type: "lint_error",
      severity: "medium",
      description: "TypeScript compilation errors in viewport configuration",
      suggestedFix: "Fix viewport type error in app/layout.ts",
      files: [".next/types/app/layout.ts"],
      lineNumbers: [8],
    })

    // Detect Prisma payload type issues
    issues.push({
      type: "lint_error",
      severity: "medium",
      description: "Prisma payload type errors in types/api.ts",
      suggestedFix: "Fix Prisma payload type imports and usage",
      files: ["types/api.ts"],
      lineNumbers: [322, 339, 355, 388],
    })

    return issues
  }

  /**
   * Convert detected issues to todo items with dependency prioritization
   */
  async convertIssuesToTodos(
    issues: IssueDetection[]
  ): Promise<MockTodoItem[]> {
    const todos: MockTodoItem[] = []

    for (const issue of issues) {
      const todo: MockTodoItem = {
        id: `issue-${++this.issueCounter}`,
        content: issue.description,
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
    return this.prioritizeTodos(todos)
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
    issue: IssueDetection,
    allIssues: IssueDetection[]
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
        const tsTodo = this.todos.find((t) => t.content === tsIssue.description)
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
          (t) => t.content === prismaIssue.description
        )
        if (prismaTodo) dependencies.push(prismaTodo.id)
      })
    }

    return dependencies
  }

  /**
   * Prioritize todos based on dependencies and criticality
   */
  private prioritizeTodos(todos: MockTodoItem[]): MockTodoItem[] {
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

      // Fewer dependencies first
      if (a.dependencies.length !== b.dependencies.length) {
        return a.dependencies.length - b.dependencies.length
      }

      // Alphabetical by content as tiebreaker
      return a.content.localeCompare(b.content)
    })
  }

  /**
   * Get current todos with dependency information
   */
  getTodos(): MockTodoItem[] {
    return this.todos
  }

  /**
   * Add a todo item
   */
  addTodo(todo: MockTodoItem): void {
    this.todos.push(todo)
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
   * Get todos that are ready to work on (no blocking dependencies)
   */
  getReadyTodos(): MockTodoItem[] {
    return this.todos.filter((todo) => {
      if (todo.status !== "pending") return false

      // Check if all dependencies are completed
      return todo.dependencies.every((depId) => {
        const depTodo = this.todos.find((t) => t.id === depId)
        return depTodo?.status === "completed"
      })
    })
  }

  /**
   * Simulate processing issues and converting to todos
   */
  async processIssues(): Promise<MockTodoItem[]> {
    const issues = await this.detectIssues()
    const todos = await this.convertIssuesToTodos(issues)

    // Add new todos
    todos.forEach((todo) => this.addTodo(todo))

    return todos
  }
}

// Export singleton instance
export const mockBackgroundAgent = new MockBackgroundAgent()
