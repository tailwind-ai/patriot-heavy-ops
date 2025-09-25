/**
 * Enhanced Todo Manager with Background Agent integration
 * Supports dependency-based prioritization and automated issue detection
 */

/* eslint-disable no-console */

import {
  MockBackgroundAgent,
  MockTodoItem,
  mockBackgroundAgent,
} from "./mock-background-agent"
import { RealBackgroundAgent } from "./real-background-agent"
import { TodoPersistence } from "./todo-persistence"

export interface CursorHints {
  /** Primary file to open when working on this todo */
  fileToOpen?: string
  /** Line number to jump to in the primary file */
  lineToJump?: number
  /** Additional files that provide context */
  contextFiles?: string[]
  /** Suggested action type for Cursor to understand the task */
  suggestedAction?:
    | "fix_test"
    | "fix_lint"
    | "fix_build"
    | "fix_deployment"
    | "implement_feature"
    | "refactor_code"
  /** Search terms to help locate the issue quickly */
  contextSearch?: string
  /** Related symbols, functions, or classes */
  relatedSymbols?: string[]
  /** Estimated focus area (e.g., "function validateUserPermissions") */
  focusArea?: string
}

export interface FailureDetails {
  /** Name of the failing test (for test failures) */
  testName?: string
  /** Primary error message */
  errorMessage?: string
  /** Stack trace if available */
  stackTrace?: string
  /** Relevant log snippet */
  logSnippet?: string
  /** Build/deployment specific error code */
  errorCode?: string
}

export interface EnhancedTodoItem extends MockTodoItem {
  createdAt: Date
  updatedAt: Date
  estimatedTime?: string
  tags?: string[]
  assignee?: string
  relatedPR?: string
  relatedCommit?: string

  // NEW: Cursor IDE Integration
  /** Primary file for Cursor to open (standardized field) */
  file?: string
  /** Primary line number for Cursor to jump to (standardized field) */
  line?: number
  /** Cursor-specific hints for intelligent assistance */
  cursorHints?: CursorHints
  /** Detailed failure analysis for better context */
  failureDetails?: FailureDetails
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
    // Clear existing todos for fresh PR-specific detection
    this.todos = []

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
      // NEW: Cursor Integration Fields
      file: this.extractPrimaryFile(todo),
      line: this.extractPrimaryLine(todo),
      cursorHints: this.generateCursorHints(todo),
      failureDetails: this.extractFailureDetails(todo),
    }))

    // Replace todos with fresh PR-specific ones
    this.todos = enhancedTodos

    // Save to persistence
    TodoPersistence.saveTodos(this.todos)

    return enhancedTodos
  }

  /**
   * Initialize todos from real GitHub PR issues including Definition of Done
   */
  async initializeFromGitHubPRWithDoD(
    prNumber: number
  ): Promise<EnhancedTodoItem[]> {
    // Clear existing todos for fresh PR-specific detection
    this.todos = []

    // Use real background agent to fetch GitHub issues including DoD
    const realAgent = new RealBackgroundAgent(
      process.env.GITHUB_ACCESS_TOKEN || "",
      "samuelhenry",
      "patriot-heavy-ops"
    )

    const agentTodos = await realAgent.processPRIssuesWithDoD(prNumber)

    const enhancedTodos: EnhancedTodoItem[] = agentTodos.map((todo) => ({
      ...todo,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedTime: this.estimateTime(todo),
      tags: this.generateTags(todo),
      assignee: this.suggestAssignee(todo),
      relatedPR: `#${prNumber}`,
      // NEW: Cursor Integration Fields
      file: this.extractPrimaryFile(todo),
      line: this.extractPrimaryLine(todo),
      cursorHints: this.generateCursorHints(todo),
      failureDetails: this.extractFailureDetails(todo),
    }))

    // Replace todos with fresh PR-specific ones
    this.todos = enhancedTodos

    // Save to persistence
    TodoPersistence.saveTodos(this.todos)

    return enhancedTodos
  }

  /**
   * Analyze workflow logs for failures and create todos
   */
  async analyzeWorkflowLogs(
    workflowRunId: string,
    prNumber: number
  ): Promise<EnhancedTodoItem[]> {
    console.log(`🔍 Analyzing workflow logs for run ID: ${workflowRunId}`)

    try {
      // Fetch workflow logs using GitHub CLI
      const { execSync } = await import("child_process")

      // Get workflow run details
      const runDetails = execSync(
        `gh api repos/samuelhenry/patriot-heavy-ops/actions/runs/${workflowRunId}`,
        { encoding: "utf8" }
      )

      const runData = JSON.parse(runDetails)
      console.log(`📊 Workflow: ${runData.name}, Status: ${runData.conclusion}`)

      // Get workflow jobs
      const jobsOutput = execSync(
        `gh api repos/samuelhenry/patriot-heavy-ops/actions/runs/${workflowRunId}/jobs`,
        { encoding: "utf8" }
      )

      const jobsData = JSON.parse(jobsOutput)
      const failedJobs = jobsData.jobs.filter(
        (job: { conclusion: string }) => job.conclusion === "failure"
      )

      console.log(`🚨 Found ${failedJobs.length} failed jobs`)

      const newTodos: EnhancedTodoItem[] = []

      // Analyze each failed job
      for (const job of failedJobs) {
        console.log(`🔍 Analyzing failed job: ${job.name}`)

        try {
          // Get job logs
          const logsOutput = execSync(
            `gh api repos/samuelhenry/patriot-heavy-ops/actions/jobs/${job.id}/logs`,
            { encoding: "utf8" }
          )

          // Parse logs for different failure types
          const failureAnalysis = this.parseJobLogs(logsOutput)

          // Create todos from failure analysis
          for (const failure of failureAnalysis) {
            const todo = this.createTodoFromFailure(
              failure,
              prNumber,
              workflowRunId
            )
            newTodos.push(todo)
          }
        } catch (logError) {
          console.warn(`⚠️ Could not fetch logs for job ${job.name}:`, logError)

          // Create a generic todo for the failed job
          const genericTodo = this.createGenericFailureTodo(
            job,
            prNumber,
            workflowRunId
          )
          newTodos.push(genericTodo)
        }
      }

      // Add new todos to existing ones (don't clear existing)
      this.todos.push(...newTodos)

      // Save to persistence
      TodoPersistence.saveTodos(this.todos)

      console.log(
        `✅ Created ${newTodos.length} todos from workflow failure analysis`
      )
      return newTodos
    } catch (error) {
      console.error("❌ Error analyzing workflow logs:", error)
      throw error
    }
  }

  /**
   * Clear all todos (useful for switching to new PR)
   */
  clearAllTodos(): void {
    this.todos = []
    TodoPersistence.saveTodos(this.todos)
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
   * Get todo by ID
   */
  getTodoById(id: string): EnhancedTodoItem | null {
    return this.todos.find((todo) => todo.id === id) || null
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
   * Extract the primary file to open for this todo
   */
  private extractPrimaryFile(todo: MockTodoItem): string | undefined {
    if (!todo.files || todo.files.length === 0) return undefined

    // Prioritize source files over test files
    const sourceFiles = todo.files.filter(
      (f) => !f.includes("test") && !f.includes("__tests__")
    )
    if (sourceFiles.length > 0) {
      return sourceFiles[0]
    }

    // Fall back to first file
    return todo.files[0]
  }

  /**
   * Extract the primary line number to jump to
   */
  private extractPrimaryLine(todo: MockTodoItem): number | undefined {
    if (!todo.lineNumbers || todo.lineNumbers.length === 0) return undefined
    return todo.lineNumbers[0]
  }

  /**
   * Generate Cursor-specific hints for intelligent assistance
   */
  private generateCursorHints(todo: MockTodoItem): CursorHints {
    const hints: CursorHints = {}

    // Set primary file to open (prefer source over test)
    if (todo.files && todo.files.length > 0) {
      const sourceFiles = todo.files.filter(
        (f) => !f.includes("test") && !f.includes("__tests__")
      )
      const testFiles = todo.files.filter(
        (f) => f.includes("test") || f.includes("__tests__")
      )

      if (sourceFiles.length > 0) {
        hints.fileToOpen = sourceFiles[0]
        hints.contextFiles = [...testFiles, ...sourceFiles.slice(1)]
      } else {
        hints.fileToOpen = todo.files[0]
        hints.contextFiles = todo.files.slice(1)
      }
    }

    // Set line to jump to
    if (todo.lineNumbers && todo.lineNumbers.length > 0) {
      hints.lineToJump = todo.lineNumbers[0]
    }

    // Generate suggested action based on issue type
    hints.suggestedAction = this.mapIssueTypeToAction(todo.issueType)

    // Generate context search terms
    hints.contextSearch = this.generateContextSearch(todo)

    // Extract related symbols from content
    hints.relatedSymbols = this.extractRelatedSymbols(todo.content)

    // Generate focus area
    hints.focusArea = this.generateFocusArea(todo)

    return hints
  }

  /**
   * Extract detailed failure information
   */
  private extractFailureDetails(todo: MockTodoItem): FailureDetails {
    const details: FailureDetails = {}

    // Extract test name for test failures
    if (todo.issueType === "test_failure") {
      const testNameMatch = todo.content.match(
        /test[:\s]+["']?([^"'\n]+)["']?/i
      )
      if (testNameMatch) {
        details.testName = testNameMatch[1]
      }
    }

    // Extract error message from content
    const errorMatch = todo.content.match(/error[:\s]+(.+?)(?:\n|$)/i)
    if (errorMatch) {
      details.errorMessage = errorMatch[1].trim()
    }

    // Use suggested fix as log snippet if available
    if (todo.suggestedFix) {
      details.logSnippet = todo.suggestedFix
    }

    return details
  }

  /**
   * Map issue type to suggested action
   */
  private mapIssueTypeToAction(
    issueType: MockTodoItem["issueType"]
  ): CursorHints["suggestedAction"] {
    const actionMap: Record<
      MockTodoItem["issueType"],
      CursorHints["suggestedAction"]
    > = {
      test_failure: "fix_test",
      lint_error: "fix_lint",
      ci_failure: "fix_build",
      vercel_failure: "fix_deployment",
      copilot_comment: "refactor_code",
      definition_of_done: "fix_build",
    }

    return actionMap[issueType] || "fix_build"
  }

  /**
   * Generate context search terms
   */
  private generateContextSearch(todo: MockTodoItem): string {
    // Extract key terms from content
    const content = todo.content.toLowerCase()

    // Look for function/method names
    const functionMatch = content.match(/function\s+(\w+)|(\w+)\s*\(/g)
    if (functionMatch) {
      return functionMatch[0].replace(/function\s+|[\(\)]/g, "").trim()
    }

    // Look for class names
    const classMatch = content.match(/class\s+(\w+)/i)
    if (classMatch) {
      return classMatch[1]
    }

    // Look for test descriptions
    const testMatch = content.match(/["']([^"']+)["']/g)
    if (testMatch) {
      return testMatch[0].replace(/["']/g, "")
    }

    // Fall back to first meaningful word
    const words = content.split(/\s+/).filter((w) => w.length > 3)
    return words[0] || ""
  }

  /**
   * Extract related symbols from content
   */
  private extractRelatedSymbols(content: string): string[] {
    const symbols: string[] = []

    // Extract function names
    const functionMatches = content.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/g)
    if (functionMatches) {
      symbols.push(...functionMatches.map((m) => m.replace(/\s*\($/, "")))
    }

    // Extract class names (capitalized words)
    const classMatches = content.match(/\b[A-Z][a-zA-Z0-9_$]*\b/g)
    if (classMatches) {
      symbols.push(...classMatches)
    }

    // Remove duplicates and common words
    const filtered = [...new Set(symbols)].filter(
      (s) =>
        s.length > 2 &&
        !["Error", "Test", "Should", "Expected", "Function"].includes(s)
    )

    return filtered.slice(0, 5) // Limit to 5 symbols
  }

  /**
   * Generate focus area description
   */
  private generateFocusArea(todo: MockTodoItem): string {
    const content = todo.content

    // For test failures, focus on the test
    if (todo.issueType === "test_failure") {
      const testMatch = content.match(/test[:\s]+["']?([^"'\n]+)["']?/i)
      if (testMatch) {
        return `test: ${testMatch[1]}`
      }
    }

    // For function-related issues
    const functionMatch = content.match(/function\s+(\w+)|(\w+)\s*\(/i)
    if (functionMatch) {
      const funcName = functionMatch[1] || functionMatch[2]
      return `function ${funcName}`
    }

    // For class-related issues
    const classMatch = content.match(/class\s+(\w+)/i)
    if (classMatch) {
      return `class ${classMatch[1]}`
    }

    // Default to issue type
    return todo.issueType.replace("_", " ")
  }

  /**
   * Parse job logs to extract failure information
   */
  private parseJobLogs(logs: string): Array<{
    type: "test_failure" | "build_failure" | "lint_error" | "deployment_failure"
    errorMessage: string
    files: string[]
    lineNumbers: number[]
    logSnippet: string
    suggestedFix: string
  }> {
    const failures: Array<{
      type:
        | "test_failure"
        | "build_failure"
        | "lint_error"
        | "deployment_failure"
      errorMessage: string
      files: string[]
      lineNumbers: number[]
      logSnippet: string
      suggestedFix: string
    }> = []

    // Test failure patterns
    if (logs.includes("FAIL") || logs.includes("Test Suites:")) {
      const testFailures = this.parseTestFailures(logs)
      failures.push(...testFailures)
    }

    // Build failure patterns
    if (logs.includes("error TS") || logs.includes("Type error:")) {
      const buildFailures = this.parseBuildFailures(logs)
      failures.push(...buildFailures)
    }

    // Lint error patterns
    if (logs.includes("ESLint found problems") || logs.includes("✖")) {
      const lintFailures = this.parseLintFailures(logs)
      failures.push(...lintFailures)
    }

    // Deployment failure patterns
    if (logs.includes("Build failed") || logs.includes("Deployment failed")) {
      const deployFailures = this.parseDeploymentFailures(logs)
      failures.push(...deployFailures)
    }

    return failures
  }

  /**
   * Parse test failures from logs
   */
  private parseTestFailures(logs: string): Array<{
    type: "test_failure"
    errorMessage: string
    files: string[]
    lineNumbers: number[]
    logSnippet: string
    suggestedFix: string
  }> {
    const failures: Array<{
      type: "test_failure"
      errorMessage: string
      files: string[]
      lineNumbers: number[]
      logSnippet: string
      suggestedFix: string
    }> = []

    // Match Jest test failures
    const testFailureRegex =
      /FAIL\s+(.+\.test\.[jt]sx?)\s*\n([\s\S]*?)(?=\n\s*PASS|\n\s*FAIL|\n\s*Test Suites:|$)/g
    let match

    while ((match = testFailureRegex.exec(logs)) !== null) {
      const testFile = match[1].trim()
      const failureContent = match[2]

      // Extract specific error message
      const errorMatch = failureContent.match(
        /●\s+(.+?)\n\s+(.+?)(?=\n\s*●|\n\s*at\s|$)/s
      )
      if (errorMatch) {
        const testName = errorMatch[1].trim()
        const errorMessage = errorMatch[2].trim()

        // Extract line numbers
        const lineMatch = failureContent.match(/:(\d+):\d+/g)
        const lineNumbers = lineMatch
          ? lineMatch.map((l) => parseInt(l.split(":")[1]))
          : []

        failures.push({
          type: "test_failure",
          errorMessage: `${testName}: ${errorMessage}`,
          files: [testFile],
          lineNumbers,
          logSnippet: failureContent.slice(0, 200) + "...",
          suggestedFix: this.generateTestFixSuggestion(errorMessage, testName),
        })
      }
    }

    return failures
  }

  /**
   * Parse build failures from logs
   */
  private parseBuildFailures(logs: string): Array<{
    type: "build_failure"
    errorMessage: string
    files: string[]
    lineNumbers: number[]
    logSnippet: string
    suggestedFix: string
  }> {
    const failures: Array<{
      type: "build_failure"
      errorMessage: string
      files: string[]
      lineNumbers: number[]
      logSnippet: string
      suggestedFix: string
    }> = []

    // Match TypeScript errors
    const tsErrorRegex = /(.+\.tsx?)\((\d+),\d+\):\s*error\s+TS\d+:\s*(.+)/g
    let match

    while ((match = tsErrorRegex.exec(logs)) !== null) {
      const file = match[1]
      const lineNumber = parseInt(match[2])
      const errorMessage = match[3].trim()

      failures.push({
        type: "build_failure",
        errorMessage: `TypeScript error: ${errorMessage}`,
        files: [file],
        lineNumbers: [lineNumber],
        logSnippet: match[0],
        suggestedFix: this.generateBuildFixSuggestion(errorMessage),
      })
    }

    return failures
  }

  /**
   * Parse lint failures from logs
   */
  private parseLintFailures(logs: string): Array<{
    type: "lint_error"
    errorMessage: string
    files: string[]
    lineNumbers: number[]
    logSnippet: string
    suggestedFix: string
  }> {
    const failures: Array<{
      type: "lint_error"
      errorMessage: string
      files: string[]
      lineNumbers: number[]
      logSnippet: string
      suggestedFix: string
    }> = []

    // Match ESLint errors
    const eslintRegex = /(.+\.tsx?)\s*\n\s*(\d+):\d+\s+error\s+(.+?)\s+(.+)/g
    let match

    while ((match = eslintRegex.exec(logs)) !== null) {
      const file = match[1]
      const lineNumber = parseInt(match[2])
      const errorMessage = match[3].trim()
      const rule = match[4].trim()

      failures.push({
        type: "lint_error",
        errorMessage: `ESLint error (${rule}): ${errorMessage}`,
        files: [file],
        lineNumbers: [lineNumber],
        logSnippet: match[0],
        suggestedFix: this.generateLintFixSuggestion(errorMessage, rule),
      })
    }

    return failures
  }

  /**
   * Parse deployment failures from logs
   */
  private parseDeploymentFailures(logs: string): Array<{
    type: "deployment_failure"
    errorMessage: string
    files: string[]
    lineNumbers: number[]
    logSnippet: string
    suggestedFix: string
  }> {
    const failures: Array<{
      type: "deployment_failure"
      errorMessage: string
      files: string[]
      lineNumbers: number[]
      logSnippet: string
      suggestedFix: string
    }> = []

    // Match deployment errors
    const deployErrorRegex =
      /(Build failed|Deployment failed)[\s\S]*?Error:\s*(.+?)(?=\n|$)/g
    let match

    while ((match = deployErrorRegex.exec(logs)) !== null) {
      const errorType = match[1]
      const errorMessage = match[2].trim()

      failures.push({
        type: "deployment_failure",
        errorMessage: `${errorType}: ${errorMessage}`,
        files: [],
        lineNumbers: [],
        logSnippet: match[0].slice(0, 200) + "...",
        suggestedFix: this.generateDeploymentFixSuggestion(errorMessage),
      })
    }

    return failures
  }

  /**
   * Create todo from failure analysis
   */
  private createTodoFromFailure(
    failure: {
      type:
        | "test_failure"
        | "build_failure"
        | "lint_error"
        | "deployment_failure"
      errorMessage: string
      files: string[]
      lineNumbers: number[]
      logSnippet: string
      suggestedFix: string
    },
    prNumber: number,
    workflowRunId: string
  ): EnhancedTodoItem {
    const todo: EnhancedTodoItem = {
      id: `workflow-${workflowRunId}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      content: failure.errorMessage,
      status: "pending",
      priority: this.determinePriority(failure.type),
      dependencies: [],
      issueType: failure.type,
      files: failure.files,
      lineNumbers: failure.lineNumbers,
      suggestedFix: failure.suggestedFix,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedTime: this.estimateTime({
        id: "",
        content: failure.errorMessage,
        status: "pending",
        priority: this.determinePriority(failure.type),
        dependencies: [],
        issueType: failure.type,
        files: failure.files,
        lineNumbers: failure.lineNumbers,
        suggestedFix: failure.suggestedFix,
      }),
      tags: this.generateTags({
        id: "",
        content: failure.errorMessage,
        status: "pending",
        priority: this.determinePriority(failure.type),
        dependencies: [],
        issueType: failure.type,
        files: failure.files,
        lineNumbers: failure.lineNumbers,
        suggestedFix: failure.suggestedFix,
      }),
      assignee: this.suggestAssignee({
        id: "",
        content: failure.errorMessage,
        status: "pending",
        priority: this.determinePriority(failure.type),
        dependencies: [],
        issueType: failure.type,
        files: failure.files,
        lineNumbers: failure.lineNumbers,
        suggestedFix: failure.suggestedFix,
      }),
      relatedPR: `#${prNumber}`,
      // Cursor Integration Fields
      file: this.extractPrimaryFile({
        id: "",
        content: failure.errorMessage,
        status: "pending",
        priority: this.determinePriority(failure.type),
        dependencies: [],
        issueType: failure.type,
        files: failure.files,
        lineNumbers: failure.lineNumbers,
        suggestedFix: failure.suggestedFix,
      }),
      line: this.extractPrimaryLine({
        id: "",
        content: failure.errorMessage,
        status: "pending",
        priority: this.determinePriority(failure.type),
        dependencies: [],
        issueType: failure.type,
        files: failure.files,
        lineNumbers: failure.lineNumbers,
        suggestedFix: failure.suggestedFix,
      }),
      cursorHints: this.generateCursorHints({
        id: "",
        content: failure.errorMessage,
        status: "pending",
        priority: this.determinePriority(failure.type),
        dependencies: [],
        issueType: failure.type,
        files: failure.files,
        lineNumbers: failure.lineNumbers,
        suggestedFix: failure.suggestedFix,
      }),
      failureDetails: {
        errorMessage: failure.errorMessage,
        logSnippet: failure.logSnippet,
      },
    }

    return todo
  }

  /**
   * Create generic failure todo when logs can't be parsed
   */
  private createGenericFailureTodo(
    job: { name: string; id: string },
    prNumber: number,
    workflowRunId: string
  ): EnhancedTodoItem {
    const todo: EnhancedTodoItem = {
      id: `workflow-generic-${workflowRunId}-${job.id}`,
      content: `Workflow job "${job.name}" failed - manual investigation required`,
      status: "pending",
      priority: "high",
      dependencies: [],
      issueType: "ci_failure",
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedTime: "30-60 min",
      tags: ["ci-failure", "high", "manual-investigation"],
      assignee: "general-developer",
      relatedPR: `#${prNumber}`,
      failureDetails: {
        errorMessage: `Job ${job.name} failed in workflow run ${workflowRunId}`,
        logSnippet: `Check GitHub Actions logs for run ${workflowRunId}`,
      },
    }

    return todo
  }

  /**
   * Determine priority based on failure type
   */
  private determinePriority(failureType: string): EnhancedTodoItem["priority"] {
    switch (failureType) {
      case "test_failure":
        return "high"
      case "build_failure":
        return "critical"
      case "lint_error":
        return "medium"
      case "deployment_failure":
        return "critical"
      default:
        return "medium"
    }
  }

  /**
   * Generate fix suggestions for different failure types
   */
  private generateTestFixSuggestion(
    errorMessage: string,
    testName: string
  ): string {
    if (
      errorMessage.includes("Expected") &&
      errorMessage.includes("received")
    ) {
      return "Check test assertions and expected values"
    }
    if (errorMessage.includes("timeout")) {
      return "Increase test timeout or optimize async operations"
    }
    if (errorMessage.includes("mock")) {
      return "Review mock setup and implementation"
    }
    return `Review test "${testName}" and fix the failing assertion`
  }

  private generateBuildFixSuggestion(errorMessage: string): string {
    if (errorMessage.includes("Cannot find module")) {
      return "Check import paths and ensure module exists"
    }
    if (
      errorMessage.includes("Type") &&
      errorMessage.includes("not assignable")
    ) {
      return "Fix type mismatch by updating types or casting"
    }
    if (
      errorMessage.includes("Property") &&
      errorMessage.includes("does not exist")
    ) {
      return "Add missing property or update interface definition"
    }
    return "Fix TypeScript compilation error"
  }

  private generateLintFixSuggestion(
    errorMessage: string,
    rule: string
  ): string {
    if (rule.includes("no-unused-vars")) {
      return "Remove unused variable or add underscore prefix"
    }
    if (rule.includes("no-console")) {
      return "Remove console statement or add eslint-disable comment"
    }
    if (rule.includes("prefer-const")) {
      return "Change let to const for variables that are not reassigned"
    }
    return `Fix ESLint rule violation: ${rule}`
  }

  private generateDeploymentFixSuggestion(errorMessage: string): string {
    if (errorMessage.includes("build")) {
      return "Fix build errors before deployment"
    }
    if (errorMessage.includes("memory") || errorMessage.includes("timeout")) {
      return "Optimize build process or increase resource limits"
    }
    return "Check deployment configuration and logs"
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
      definition_of_done: "2-5 min",
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
    const baseTodo = {
      id: "",
      content,
      status: "pending" as const,
      priority,
      dependencies: [],
      issueType,
    }

    const todo: EnhancedTodoItem = {
      id: `manual-${Date.now()}`,
      content,
      status: "pending",
      priority,
      dependencies: [],
      issueType,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedTime: this.estimateTime(baseTodo),
      tags: this.generateTags(baseTodo),
      assignee: this.suggestAssignee(baseTodo),
      // NEW: Cursor Integration Fields
      file: this.extractPrimaryFile(baseTodo),
      line: this.extractPrimaryLine(baseTodo),
      cursorHints: this.generateCursorHints(baseTodo),
      failureDetails: this.extractFailureDetails(baseTodo),
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

/**
 * Singleton manager using WeakMap for better isolation
 * This avoids shared state between test runs and SSR environments
 */
class EnhancedTodoManagerSingleton {
  private static instance: EnhancedTodoManager | undefined
  private static instanceMap = new WeakMap<object, EnhancedTodoManager>()

  /**
   * Get singleton instance with optional context for testing isolation
   */
  static getInstance(context?: object): EnhancedTodoManager {
    // If context is provided (e.g., for testing), use context-specific instance
    if (context) {
      let instance = this.instanceMap.get(context)
      if (!instance) {
        instance = new EnhancedTodoManager(mockBackgroundAgent)
        this.instanceMap.set(context, instance)
      }
      return instance
    }

    // Default singleton for production
    if (!this.instance) {
      this.instance = new EnhancedTodoManager(mockBackgroundAgent)
    }
    return this.instance
  }

  /**
   * Reset singleton (useful for testing)
   */
  static reset(context?: object): void {
    if (context) {
      this.instanceMap.delete(context)
    } else {
      this.instance = undefined
    }
  }
}

/**
 * Get the singleton instance of EnhancedTodoManager.
 * Supports optional context for testing isolation.
 */
export function getEnhancedTodoManager(context?: object): EnhancedTodoManager {
  return EnhancedTodoManagerSingleton.getInstance(context)
}

/**
 * Reset the singleton instance (useful for testing)
 */
export function resetEnhancedTodoManager(context?: object): void {
  EnhancedTodoManagerSingleton.reset(context)
}

// Export the singleton instance for compatibility
export const enhancedTodoManager = getEnhancedTodoManager()
