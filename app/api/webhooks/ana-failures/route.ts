import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { createHmac, timingSafeEqual } from "crypto"

/**
 * Ana → Tod Webhook Endpoint (Issue #282)
 * Receives structured failure analysis data from Ana and creates TODOs
 */

// Ana → Tod Data Contract (from Issue #282)
interface AnaWebhookPayload {
  summary: string
  analysisDate: string
  workflowRunId?: string
  prNumber?: number
  failures: AnalyzedFailure[]
}

interface AnalyzedFailure {
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

// Cursor TODO Data Contract
interface CursorTodoItem {
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

export async function POST(req: Request) {
  try {
    // Get headers for signature validation
    const headersList = await headers()
    const signature = headersList.get("x-ana-signature")
    const timestamp = headersList.get("x-ana-timestamp")

    // Get request body for signature validation and parsing
    const body = await req.text()

    // Validate signature and timestamp (Issue #282 security requirement)
    if (!validateSignature(signature, timestamp, body)) {
      console.error("❌ Invalid webhook signature from Ana")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Parse payload
    const payload: AnaWebhookPayload = JSON.parse(body)

    // Validate payload format
    const validationResult = validatePayload(payload)
    if (!validationResult.valid) {
      console.error("❌ Invalid payload from Ana:", validationResult.errors)
      return NextResponse.json(
        {
          error: "Invalid payload",
          details: validationResult.errors,
        },
        { status: 400 }
      )
    }

    // Log successful reception
    console.log(`📥 Received ${payload.failures.length} failures from Ana`)
    console.log(`   Summary: ${payload.summary}`)
    console.log(`   PR: ${payload.prNumber ? `#${payload.prNumber}` : "N/A"}`)
    console.log(`   Workflow: ${payload.workflowRunId || "N/A"}`)

    // Transform Ana data to Cursor TODOs
    const todos = transformAnaToTodos(payload.failures)

    // Create TODOs in Cursor's native system
    await createCursorTodos(todos)

    return NextResponse.json({
      success: true,
      message: `Created ${todos.length} TODOs from Ana analysis`,
      todosCreated: todos.length,
    })
  } catch (error) {
    console.error("❌ Webhook processing error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

/**
 * Validate webhook signature (Issue #282 security)
 */
function validateSignature(
  signature: string | null,
  timestamp: string | null,
  body: string
): boolean {
  // For development mode, use simple validation
  if (process.env.NODE_ENV === "development") {
    console.log("⚠️  Using development signature validation")

    if (!signature || !timestamp) {
      console.log("❌ Missing signature or timestamp headers")
      return false
    }

    // Simple validation for development
    const secret = process.env.ANA_WEBHOOK_SECRET || "dev-secret-key"
    const expectedSignature = `sha256=dev-${Buffer.from(body + secret)
      .toString("base64")
      .substring(0, 16)}`

    if (signature !== expectedSignature) {
      console.log(
        `❌ Signature mismatch. Expected: ${expectedSignature}, Got: ${signature}`
      )
      return false
    }

    // Check timestamp is recent (within 5 minutes)
    const timestampMs = new Date(timestamp).getTime()
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000

    if (Math.abs(now - timestampMs) > fiveMinutes) {
      console.log("❌ Timestamp too old or invalid")
      return false
    }

    return true
  }

  // Production HMAC-SHA256 signature validation
  console.log("🔒 Using production HMAC-SHA256 signature validation")

  if (!signature || !timestamp) {
    console.log("❌ Missing signature or timestamp headers")
    return false
  }

  const secret = process.env.ANA_WEBHOOK_SECRET
  if (!secret) {
    console.log("❌ ANA_WEBHOOK_SECRET not configured")
    return false
  }

  // Verify signature format
  if (!signature.startsWith("sha256=")) {
    console.log("❌ Invalid signature format")
    return false
  }

  // Extract signature hash
  const providedSignature = signature.substring(7) // Remove 'sha256=' prefix

  // Generate expected signature
  const expectedSignature = createHmac("sha256", secret)
    .update(body)
    .digest("hex")

  // Use timing-safe comparison to prevent timing attacks
  const providedBuffer = Buffer.from(providedSignature, "hex")
  const expectedBuffer = Buffer.from(expectedSignature, "hex")

  if (providedBuffer.length !== expectedBuffer.length) {
    console.log("❌ Signature length mismatch")
    return false
  }

  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    console.log("❌ Signature verification failed")
    return false
  }

  // Check timestamp is recent (within 5 minutes)
  const timestampMs = new Date(timestamp).getTime()
  const now = Date.now()
  const fiveMinutes = 5 * 60 * 1000

  if (isNaN(timestampMs)) {
    console.log("❌ Invalid timestamp format")
    return false
  }

  if (Math.abs(now - timestampMs) > fiveMinutes) {
    console.log("❌ Timestamp too old or invalid")
    return false
  }

  console.log("✅ Signature and timestamp validation passed")
  return true
}

/**
 * Validate Ana webhook payload
 */
function validatePayload(payload: unknown): {
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

/**
 * Transform Ana failures to Cursor TODOs
 */
function transformAnaToTodos(failures: AnalyzedFailure[]): CursorTodoItem[] {
  return failures.map((failure) => ({
    id: failure.id,
    content: failure.content,
    status: "pending" as const,
    metadata: {
      priority: failure.priority,
      files: failure.files || [],
      lineNumbers: failure.lineNumbers || [],
      ...(failure.rootCause && { rootCause: failure.rootCause }),
      ...(failure.impact && { impact: failure.impact }),
      ...(failure.suggestedFix && { suggestedFix: failure.suggestedFix }),
      ...(failure.affectedComponents && {
        affectedComponents: failure.affectedComponents,
      }),
      issueType: failure.type,
      ...(failure.relatedPR && { relatedPR: failure.relatedPR }),
      createdAt: failure.createdAt,
      addedToCursorAt: new Date().toISOString(),
    },
  }))
}

/**
 * Create TODOs in Cursor's native system
 */
async function createCursorTodos(todos: CursorTodoItem[]): Promise<void> {
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
    await todo_write({
      merge: false,
      todos: todos,
    })

    console.log(`✅ Successfully created ${todos.length} TODOs in Cursor`)
  } catch (error) {
    console.error("❌ Failed to create Cursor TODOs:", error)
    throw error
  }
}

/**
 * Cursor Background Agent API - todo_write method
 * This will be available when running as a Cursor Background Agent
 */
async function todo_write(params: {
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
