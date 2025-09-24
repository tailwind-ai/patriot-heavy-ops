/**
 * Enhanced Todo Manager with Background Agent integration
 * Supports dependency-based prioritization and automated issue detection
 */

import {
  MockBackgroundAgent,
  MockTodoItem,
  mockBackgroundAgent,
} from "./mock-background-agent"
import { RealBackgroundAgent } from "./real-background-agent"
import { TodoPersistence } from "./todo-persistence"

export interface EnhancedTodoItem extends MockTodoItem {
  createdAt: Date
  updatedAt: Date
  estimatedTime?: string
  tags?: string[]
  assignee?: string
  relatedPR?: string
  relatedCommit?: string
}

export class EnhancedTodoManager {
  private backgroundAgent: MockBackgroundAgent
  private todos: EnhancedTodoItem[] = []

  constructor(backgroundAgent: MockBackgroundAgent) {
    this.backgroundAgent = backgroundAgent
    // Load existing todos from persistence
    this.todos = TodoPersistence.loadTodos()
  }

  /**
   * Initialize todos from Background Agent issues
   */
  async initializeFromBackgroundAgent(): Promise<EnhancedTodoItem[]> {
    const agentTodos = await this.backgroundAgent.processIssues()

    const enhancedTodos: EnhancedTodoItem[] = agentTodos.map((todo) => ({
      ...todo,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedTime: this.estimateTime(todo),
      tags: this.generateTags(todo),
      assignee: this.suggestAssignee(todo),
    }))

    this.todos = enhancedTodos

    // Save to persistence
    TodoPersistence.saveTodos(this.todos)

    return enhancedTodos
  }

  /**
   * Initialize todos from real GitHub PR issues
   */
  async initializeFromGitHubPR(prNumber: number): Promise<EnhancedTodoItem[]> {
    // Use real background agent to fetch GitHub issues
    const realAgent = new RealBackgroundAgent(
      process.env.GITHUB_ACCESS_TOKEN || "",
      "samuelhenry",
      "patriot-heavy-ops"
    )

    const agentTodos = await realAgent.processPRIssues(prNumber)

    const enhancedTodos: EnhancedTodoItem[] = agentTodos.map((todo) => ({
      ...todo,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedTime: this.estimateTime(todo),
      tags: this.generateTags(todo),
      assignee: this.suggestAssignee(todo),
      relatedPR: `#${prNumber}`,
    }))

    // Add to existing todos instead of replacing
    this.todos = [...this.todos, ...enhancedTodos]

    // Save to persistence
    TodoPersistence.saveTodos(this.todos)

    return enhancedTodos
  }

  /**
   * Get todos with dependency analysis
   */
  getTodosWithDependencies(): {
    todos: EnhancedTodoItem[]
    dependencyGraph: Map<string, string[]>
    readyTodos: EnhancedTodoItem[]
    blockedTodos: EnhancedTodoItem[]
  } {
    const dependencyGraph = new Map<string, string[]>()
    const readyTodos: EnhancedTodoItem[] = []
    const blockedTodos: EnhancedTodoItem[] = []

    // Build dependency graph
    this.todos.forEach((todo) => {
      dependencyGraph.set(todo.id, todo.dependencies)
    })

    // Categorize todos
    this.todos.forEach((todo) => {
      if (todo.status === "pending") {
        const isReady = todo.dependencies.every((depId) => {
          const depTodo = this.todos.find((t) => t.id === depId)
          return depTodo?.status === "completed"
        })

        if (isReady) {
          readyTodos.push(todo)
        } else {
          blockedTodos.push(todo)
        }
      }
    })

    return {
      todos: this.todos,
      dependencyGraph,
      readyTodos,
      blockedTodos,
    }
  }

  /**
   * Get next todo to work on based on priority and dependencies
   */
  getNextTodo(): EnhancedTodoItem | null {
    const { readyTodos } = this.getTodosWithDependencies()

    if (readyTodos.length === 0) return null

    // Sort by priority and return the highest priority ready todo
    const sorted = readyTodos.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
    return sorted[0] || null
  }

  /**
   * Update todo status and handle dependency resolution
   */
  updateTodoStatus(id: string, status: EnhancedTodoItem["status"]): boolean {
    const todo = this.todos.find((t) => t.id === id)
    if (!todo) return false

    const oldStatus = todo.status
    todo.status = status
    todo.updatedAt = new Date()

    // If completing a todo, check if it unblocks other todos
    if (oldStatus !== "completed" && status === "completed") {
      this.checkUnblockedTodos(id)
    }

    // Save to persistence
    TodoPersistence.saveTodos(this.todos)

    return true
  }

  /**
   * Check if completing a todo unblocks other todos
   */
  private checkUnblockedTodos(completedTodoId: string): void {
    this.todos.forEach((todo) => {
      if (
        todo.status === "pending" &&
        todo.dependencies.includes(completedTodoId)
      ) {
        // Check if all dependencies are now completed
        const allDepsCompleted = todo.dependencies.every((depId) => {
          const depTodo = this.todos.find((t) => t.id === depId)
          return depTodo?.status === "completed"
        })

        if (allDepsCompleted) {
          // Todo is now unblocked and ready to work on
        }
      }
    })
  }

  /**
   * Get todos by priority level
   */
  getTodosByPriority(
    priority: EnhancedTodoItem["priority"]
  ): EnhancedTodoItem[] {
    return this.todos.filter((todo) => todo.priority === priority)
  }

  /**
   * Get todos by issue type
   */
  getTodosByIssueType(
    issueType: EnhancedTodoItem["issueType"]
  ): EnhancedTodoItem[] {
    return this.todos.filter((todo) => todo.issueType === issueType)
  }

  /**
   * Get progress summary
   */
  getProgressSummary(): {
    total: number
    completed: number
    inProgress: number
    pending: number
    cancelled: number
    completionRate: number
  } {
    const total = this.todos.length
    const completed = this.todos.filter((t) => t.status === "completed").length
    const inProgress = this.todos.filter(
      (t) => t.status === "in_progress"
    ).length
    const pending = this.todos.filter((t) => t.status === "pending").length
    const cancelled = this.todos.filter((t) => t.status === "cancelled").length
    const completionRate = total > 0 ? (completed / total) * 100 : 0

    return {
      total,
      completed,
      inProgress,
      pending,
      cancelled,
      completionRate,
    }
  }

  /**
   * Estimate time for a todo based on issue type and complexity
   */
  private estimateTime(todo: MockTodoItem): string {
    const baseTime = {
      copilot_comment: "5-15 min",
      ci_failure: "10-30 min",
      vercel_failure: "15-45 min",
      lint_error: "5-20 min",
      test_failure: "15-60 min",
    }

    const complexity = todo.files?.length || 1
    const base = baseTime[todo.issueType] || "10-30 min"

    if (complexity > 3) {
      return base.replace(/\d+/, (match) => String(parseInt(match) * 2))
    }

    return base
  }

  /**
   * Generate relevant tags for a todo
   */
  private generateTags(todo: MockTodoItem): string[] {
    const tags: string[] = []

    // Issue type tags
    tags.push(todo.issueType.replace("_", "-"))

    // Priority tags
    tags.push(todo.priority)

    // File-based tags
    if (todo.files) {
      todo.files.forEach((file) => {
        if (file.includes("test")) tags.push("testing")
        if (file.includes("auth")) tags.push("authentication")
        if (file.includes("middleware")) tags.push("middleware")
        if (file.includes("api")) tags.push("api")
        if (file.includes("types")) tags.push("typescript")
        if (file.includes("prisma")) tags.push("database")
      })
    }

    return [...new Set(tags)] // Remove duplicates
  }

  /**
   * Suggest assignee based on issue type and files
   */
  private suggestAssignee(todo: MockTodoItem): string {
    if (todo.files?.some((f) => f.includes("test"))) return "test-specialist"
    if (todo.files?.some((f) => f.includes("auth"))) return "auth-specialist"
    if (todo.files?.some((f) => f.includes("api"))) return "api-specialist"
    if (todo.files?.some((f) => f.includes("types")))
      return "typescript-specialist"

    return "general-developer"
  }

  /**
   * Add a new todo manually
   */
  addTodo(
    content: string,
    priority: EnhancedTodoItem["priority"] = "medium",
    issueType: EnhancedTodoItem["issueType"] = "test_failure"
  ): EnhancedTodoItem {
    const todo: EnhancedTodoItem = {
      id: `manual-${Date.now()}`,
      content,
      status: "pending",
      priority,
      dependencies: [],
      issueType,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedTime: this.estimateTime({
        id: "",
        content,
        status: "pending",
        priority,
        dependencies: [],
        issueType,
      }),
      tags: this.generateTags({
        id: "",
        content,
        status: "pending",
        priority,
        dependencies: [],
        issueType,
      }),
      assignee: this.suggestAssignee({
        id: "",
        content,
        status: "pending",
        priority,
        dependencies: [],
        issueType,
      }),
    }

    this.todos.push(todo)

    // Save to persistence
    TodoPersistence.saveTodos(this.todos)

    return todo
  }

  /**
   * Get todos that are ready to work on
   */
  getReadyTodos(): EnhancedTodoItem[] {
    const { readyTodos } = this.getTodosWithDependencies()
    return readyTodos
  }

  /**
   * Get todos that are blocked by dependencies
   */
  getBlockedTodos(): EnhancedTodoItem[] {
    const { blockedTodos } = this.getTodosWithDependencies()
    return blockedTodos
  }
}

// Module-scoped singleton instance
let _enhancedTodoManager: EnhancedTodoManager | undefined

/**
 * Get the singleton instance of EnhancedTodoManager.
 * This avoids using global state and is safe for production and testing.
 */
export function getEnhancedTodoManager(): EnhancedTodoManager {
  if (!_enhancedTodoManager) {
    _enhancedTodoManager = new EnhancedTodoManager(mockBackgroundAgent)
  }
  return _enhancedTodoManager
}

// Optionally, export the singleton instance for compatibility
export const enhancedTodoManager = getEnhancedTodoManager()
