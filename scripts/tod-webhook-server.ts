#!/usr/bin/env tsx

/**
 * Tod Webhook Server - Cursor Background Agent
 * Receives Ana failure analysis data and creates native Cursor TODOs
 */

import express from "express"
// import { createHash, timingSafeEqual } from 'crypto' // TODO: Implement signature validation

// Ana → Tod Data Contract (from Issue #282)
export interface AnaWebhookPayload {
  summary: string
  analysisDate: string
  workflowRunId?: string
  prNumber?: number
  failures: AnalyzedFailure[]
}

export interface AnalyzedFailure {
  id: string
  type: "ci_failure" | "vercel_failure" | "bugbot_issue"
  content: string
  priority: "low" | "medium" | "high" | "critical"
  files?: string[]
  lineNumbers?: number[]
  rootCause?: string
  impact?: string
  suggestedFix?: string
  affectedComponents?: string[]
  relatedPR?: string
  createdAt: string
}

// Cursor TODO Data Contract (confirmed from test)
export interface CursorTodoItem {
  id: string
  content: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  metadata?: {
    priority?: "low" | "medium" | "high" | "critical"
    files?: string[]
    lineNumbers?: number[]
    rootCause?: string
    impact?: string
    suggestedFix?: string
    affectedComponents?: string[]
    issueType?: string
    relatedPR?: string
    createdAt?: string
    addedToCursorAt?: string
  }
}

class TodWebhookServer {
  private app: express.Application
  private port: number

  constructor(port: number = 3001) {
    this.app = express()
    this.port = port
    this.setupMiddleware()
    this.setupRoutes()
  }

  private setupMiddleware(): void {
    // Parse JSON payloads
    this.app.use(express.json({ limit: "10mb" }))

    // Add request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} ${req.method} ${req.path}`)
      next()
    })
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.json({
        status: "healthy",
        service: "tod-webhook-server",
        timestamp: new Date().toISOString(),
      })
    })

    // Ana webhook endpoint (from Issue #282 contract)
    this.app.post("/webhook/ana-failures", async (req, res) => {
      try {
        await this.handleAnaWebhook(req, res)
      } catch (error) {
        console.error("❌ Webhook processing error:", error)
        res.status(500).json({
          error: "Internal server error",
          message: error instanceof Error ? error.message : "Unknown error",
        })
      }
    })

    // Test endpoint for development
    this.app.post("/test/create-todo", async (req, res) => {
      try {
        const mockFailure: AnalyzedFailure = req.body
        const todos = this.transformAnaToTodos([mockFailure])
        await this.createCursorTodos(todos)

        res.json({
          success: true,
          message: `Created ${todos.length} TODOs`,
          todos: todos.map((t) => ({ id: t.id, content: t.content })),
        })
      } catch (error) {
        console.error("❌ Test TODO creation error:", error)
        res.status(500).json({ error: "Failed to create test TODO" })
      }
    })
  }

  private async handleAnaWebhook(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    // Validate signature (security from Issue #282)
    const signature = req.headers["x-ana-signature"] as string
    const timestamp = req.headers["x-ana-timestamp"] as string

    if (
      !this.validateSignature(signature, timestamp, JSON.stringify(req.body))
    ) {
      res.status(401).json({ error: "Invalid signature" })
      return
    }

    // Parse and validate payload
    const payload: AnaWebhookPayload = req.body
    const validationResult = this.validatePayload(payload)

    if (!validationResult.valid) {
      console.error("❌ Invalid payload from Ana:", validationResult.errors)
      res.status(400).json({
        error: "Invalid payload",
        details: validationResult.errors,
      })
      return
    }

    // Log successful reception
    console.log(`📥 Received ${payload.failures.length} failures from Ana`)
    console.log(`   Summary: ${payload.summary}`)
    console.log(`   PR: ${payload.prNumber ? `#${payload.prNumber}` : "N/A"}`)

    // Transform Ana data to Cursor TODOs
    const todos = this.transformAnaToTodos(payload.failures)

    // Create TODOs in Cursor's native system
    await this.createCursorTodos(todos)

    res.status(200).json({
      success: true,
      message: `Created ${todos.length} TODOs from Ana analysis`,
      todosCreated: todos.length,
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private validateSignature(
    _signature: string,
    _timestamp: string,
    _body: string
  ): boolean {
    // TODO: Implement proper signature validation
    // For now, accept all requests (development mode)
    console.log("⚠️  Signature validation disabled (development mode)")
    return true
  }

  private validatePayload(payload: unknown): {
    valid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    // Type guard for payload
    const p = payload as Record<string, unknown>

    if (!p.summary) errors.push("Missing summary")
    if (!p.analysisDate) errors.push("Missing analysisDate")
    if (!Array.isArray(p.failures))
      errors.push("Missing or invalid failures array")

    // Validate each failure
    if (p.failures) {
      ;(p.failures as unknown[]).forEach((failure: unknown, index: number) => {
        const f = failure as Record<string, unknown>
        if (!f.id) errors.push(`Failure ${index}: Missing id`)
        if (!f.content) errors.push(`Failure ${index}: Missing content`)
        if (!f.type) errors.push(`Failure ${index}: Missing type`)
        if (!f.priority) errors.push(`Failure ${index}: Missing priority`)
      })
    }

    return { valid: errors.length === 0, errors }
  }

  private transformAnaToTodos(failures: AnalyzedFailure[]): CursorTodoItem[] {
    return failures.map((failure) => ({
      id: failure.id,
      content: failure.content,
      status: "pending" as const,
      metadata: {
        priority: failure.priority,
        files: failure.files || [],
        lineNumbers: failure.lineNumbers || [],
        rootCause: failure.rootCause,
        impact: failure.impact,
        suggestedFix: failure.suggestedFix,
        affectedComponents: failure.affectedComponents,
        issueType: failure.type,
        relatedPR: failure.relatedPR,
        createdAt: failure.createdAt,
        addedToCursorAt: new Date().toISOString(),
      },
    }))
  }

  private async createCursorTodos(todos: CursorTodoItem[]): Promise<void> {
    try {
      console.log(`📋 Creating ${todos.length} TODOs in Cursor...`)

      // Log TODO details for debugging
      for (const todo of todos) {
        console.log(`  📝 TODO: ${todo.content.substring(0, 60)}...`)
        console.log(`     Priority: ${todo.metadata?.priority || "medium"}`)
        console.log(`     Files: ${todo.metadata?.files?.join(", ") || "N/A"}`)
        console.log(`     Root Cause: ${todo.metadata?.rootCause || "N/A"}`)
      }

      // Use Cursor's native todo_write API (confirmed from Technical PM test)
      await this.todo_write({
        merge: false,
        todos: todos,
      })

      console.log(`✅ Successfully created ${todos.length} TODOs in Cursor`)
    } catch (error) {
      console.error("❌ Failed to create Cursor TODOs:", error)
      throw error
    }
  }

  // Cursor Background Agent API - todo_write method
  private async todo_write(params: {
    merge: boolean
    todos: CursorTodoItem[]
  }): Promise<void> {
    // This method will be available when running as a Cursor Background Agent
    // For now, we'll simulate the behavior for development/testing

    if (
      typeof (globalThis as Record<string, unknown>).todo_write === "function"
    ) {
      // Running as Cursor Background Agent - use native API
      await (
        (globalThis as Record<string, unknown>).todo_write as (params: {
          merge: boolean
          todos: CursorTodoItem[]
        }) => Promise<void>
      )(params)
    } else {
      // Development mode - simulate TODO creation
      console.log(`🔧 Development Mode: Simulating todo_write call`)
      console.log(`   Merge: ${params.merge}`)
      console.log(`   TODOs: ${params.todos.length}`)

      for (const todo of params.todos) {
        console.log(`   📋 [${todo.status.toUpperCase()}] ${todo.content}`)
        if (todo.metadata?.files) {
          console.log(`      📁 Files: ${todo.metadata.files.join(", ")}`)
        }
        if (todo.metadata?.priority) {
          console.log(`      ⚡ Priority: ${todo.metadata.priority}`)
        }
      }

      console.log(`✅ Simulated ${params.todos.length} TODOs created`)
    }
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Tod Webhook Server running on port ${this.port}`)
      console.log(
        `📥 Ana webhook endpoint: http://localhost:${this.port}/webhook/ana-failures`
      )
      console.log(
        `🧪 Test endpoint: http://localhost:${this.port}/test/create-todo`
      )
      console.log(`❤️  Health check: http://localhost:${this.port}/health`)
    })
  }
}

// CLI interface
async function main() {
  const port = parseInt(process.env.TOD_WEBHOOK_PORT || "3001")

  console.log("🤖 Starting Tod Webhook Server (Cursor Background Agent)")
  console.log(`   Port: ${port}`)
  console.log(`   Mode: Development`)

  const server = new TodWebhookServer(port)
  server.start()
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Tod Webhook Server shutting down...")
  process.exit(0)
})

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Fatal error:", error)
    process.exit(1)
  })
}

export { TodWebhookServer, type AnaWebhookPayload, type CursorTodoItem }
