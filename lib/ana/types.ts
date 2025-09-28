/**
 * Ana Data Types and Interfaces
 * Structured data format for failure analysis and Tod communication
 */

import { z } from "zod"

/**
 * Priority levels for analyzed failures
 */
export type Priority = "low" | "medium" | "high" | "critical"

/**
 * Types of failures Ana can analyze
 */
export type FailureType = "ci_failure" | "vercel_failure" | "bugbot_issue"

/**
 * Core interface for analyzed failure data
 */
export type AnalyzedFailure = {
  /** Unique identifier for the failure */
  id: string

  /** Type of failure (CI or Vercel) */
  type: FailureType

  /** Human-readable description of the failure */
  content: string

  /** Priority level based on severity and impact */
  priority: Priority

  /** Files affected by this failure (optional) */
  files?: string[] | undefined

  /** Line numbers where the failure occurred (optional) */
  lineNumbers?: number[] | undefined

  /** Root cause analysis of the failure (optional) */
  rootCause?: string | undefined

  /** Impact assessment of the failure (optional) */
  impact?: string | undefined

  /** Suggested fix for the failure (optional) */
  suggestedFix?: string | undefined

  /** Components affected by this failure (optional) */
  affectedComponents?: string[] | undefined

  /** Related PR number (optional) */
  relatedPR?: string | undefined

  /** Timestamp when the failure was created */
  createdAt: string

  /** Timestamp from logs if available (optional) */
  timestamp?: string | undefined
}

/**
 * Results container for Ana analysis
 */
export type AnaResults = {
  /** Array of analyzed failures */
  failures: AnalyzedFailure[]

  /** Summary of the analysis */
  summary: string

  /** When the analysis was performed */
  analysisDate: string

  /** Total number of failures found */
  totalFailures: number

  /** Count of critical priority failures */
  criticalFailures: number

  /** Count of high priority failures */
  highPriorityFailures: number

  /** Count of medium priority failures */
  mediumPriorityFailures: number

  /** Count of low priority failures */
  lowPriorityFailures: number
}

/**
 * Zod schema for AnalyzedFailure validation
 */
export const AnalyzedFailureSchema = z.object({
  id: z.string().min(1, "ID is required"),
  type: z.enum(["ci_failure", "vercel_failure", "bugbot_issue"], {
    errorMap: () => ({
      message: "Type must be ci_failure, vercel_failure, or bugbot_issue",
    }),
  }),
  content: z.string().min(1, "Content is required"),
  priority: z.enum(["low", "medium", "high", "critical"], {
    errorMap: () => ({
      message: "Priority must be low, medium, high, or critical",
    }),
  }),
  files: z.array(z.string()).optional(),
  lineNumbers: z.array(z.number().int().positive()).optional(),
  rootCause: z.string().optional(),
  impact: z.string().optional(),
  suggestedFix: z.string().optional(),
  affectedComponents: z.array(z.string()).optional(),
  relatedPR: z.string().optional(),
  createdAt: z.string().datetime("Invalid datetime format"),
  timestamp: z.string().optional(),
})

/**
 * Zod schema for AnaResults validation
 */
export const AnaResultsSchema = z.object({
  failures: z.array(AnalyzedFailureSchema),
  summary: z.string().min(1, "Summary is required"),
  analysisDate: z.string().datetime("Invalid datetime format"),
  totalFailures: z.number().int().min(0),
  criticalFailures: z.number().int().min(0),
  highPriorityFailures: z.number().int().min(0),
  mediumPriorityFailures: z.number().int().min(0),
  lowPriorityFailures: z.number().int().min(0),
})

/**
 * Zod schema for AnaWebhookPayload validation (Issue #282)
 */
export const AnaWebhookPayloadSchema = z.object({
  summary: z.string().min(1, "Summary is required"),
  analysisDate: z.string().datetime("Invalid datetime format"),
  workflowRunId: z.string().optional(),
  prNumber: z.number().int().positive().optional(),
  failures: z.array(AnalyzedFailureSchema),
})

/**
 * Validate AnalyzedFailure object
 */
export function validateAnalyzedFailure(data: unknown) {
  return AnalyzedFailureSchema.safeParse(data)
}

/**
 * Validate AnaResults object
 */
export function validateAnaResults(data: unknown) {
  return AnaResultsSchema.safeParse(data)
}

/**
 * Validate AnaWebhookPayload object (Issue #282)
 */
export function validateAnaWebhookPayload(data: unknown) {
  return AnaWebhookPayloadSchema.safeParse(data)
}

/**
 * Create a new AnalyzedFailure with auto-generated ID and timestamp
 */
export function createAnalyzedFailure(
  data: Omit<AnalyzedFailure, "id" | "createdAt"> & {
    id?: string
    createdAt?: string
  }
): AnalyzedFailure {
  const now = new Date().toISOString()
  const id =
    data.id ||
    `${data.type.replace("_", "-")}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

  return {
    ...data,
    id,
    createdAt: data.createdAt || now,
  }
}

/**
 * Create AnaResults from analysis data
 */
export function createAnaResults(
  failures: AnalyzedFailure[],
  summary: string
): AnaResults {
  const priorityCounts = failures.reduce(
    (counts, failure) => {
      switch (failure.priority) {
        case "critical":
          counts.criticalFailures++
          break
        case "high":
          counts.highPriorityFailures++
          break
        case "medium":
          counts.mediumPriorityFailures++
          break
        case "low":
          counts.lowPriorityFailures++
          break
      }
      return counts
    },
    {
      criticalFailures: 0,
      highPriorityFailures: 0,
      mediumPriorityFailures: 0,
      lowPriorityFailures: 0,
    }
  )

  return {
    failures,
    summary,
    analysisDate: new Date().toISOString(),
    totalFailures: failures.length,
    ...priorityCounts,
  }
}

/**
 * Raw analysis issue from log parsing (before conversion to AnalyzedFailure)
 */
export type RawAnalysisIssue = {
  description: string
  priority: Priority
  files?: string[] | undefined
  lineNumbers?: number[] | undefined
  rootCause?: string | undefined
  impact?: string | undefined
  suggestedFix?: string | undefined
  affectedComponents?: string[] | undefined
  timestamp?: string | undefined
}

/**
 * Analysis result from log parsing
 */
export type AnalysisResult = {
  issues: RawAnalysisIssue[]
  jobName: string
  logContent: string
  analysisTimestamp: string
}

/**
 * Ana → Tod Webhook Payload (Issue #282 specification)
 */
export type AnaWebhookPayload = {
  /** Summary of the analysis */
  summary: string
  /** ISO timestamp when analysis was performed */
  analysisDate: string
  /** GitHub workflow run ID (optional) */
  workflowRunId?: string
  /** Associated PR number (optional) */
  prNumber?: number
  /** Array of analyzed failures */
  failures: AnalyzedFailure[]
}

/**
 * Legacy webhook payload for Tod communication (deprecated)
 * @deprecated Use AnaWebhookPayload instead
 */
export type TodWebhookPayload = {
  source: "ana"
  type: "analysis_results" | "single_failure"
  data: AnaResults | AnalyzedFailure
  metadata: {
    relatedPR: string
    timestamp: string
    version: string
  }
}

/**
 * Webhook response from Tod
 */
export type TodWebhookResponse = {
  success: boolean
  todosCreated?: number
  todoId?: string
  message?: string
  error?: string
}

/**
 * Webhook client configuration
 */
export type WebhookClientConfig = {
  timeout?: number
  retries?: number
  headers?: Record<string, string>
}

/**
 * Result type for webhook operations
 */
export type WebhookResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Error patterns for different failure types
 */
export const ERROR_PATTERNS = {
  TYPESCRIPT: {
    regex:
      /(?:error\s+in\s+([^\s]+\.(ts|tsx)):(\d+):(\d+)|([^\s]+\.(ts|tsx)):(\d+):(\d+)\s+-\s+error\s+TS\d+)/gi,
    priority: "high" as const,
    rootCause: "TypeScript compilation error",
  },
  JEST_TEST: {
    regex:
      /FAIL\s+([^\s]+\.test\.(tsx|ts|jsx|js))|test\s+failed[:\s]*([^\n]*)/gi,
    priority: "high" as const,
    rootCause: "Jest test failure",
  },
  ESLINT: {
    regex:
      /([^\s]+\.(ts|tsx|js|jsx))\s*\n\s*(\d+):(\d+)\s+(error|warning)|lint\s+error[:\s]*([^\n]*)/gi,
    priority: "medium" as const,
    rootCause: "ESLint error",
  },
  BUILD_FAILURE: {
    regex: /build\s+failed[:\s]*([^\n]*)|module not found|cannot resolve/gi,
    priority: "critical" as const,
    rootCause: "Build failure",
  },
  COVERAGE: {
    regex: /coverage threshold.*not met|statements.*threshold/gi,
    priority: "medium" as const,
    rootCause: "Coverage threshold failure",
  },
} as const

/**
 * Vercel-specific error patterns
 */
export const VERCEL_ERROR_PATTERNS = {
  BUILD_TIMEOUT: {
    regex: /build timed out after \d+ minutes/gi,
    priority: "critical" as const,
    rootCause: "Vercel build timeout",
  },
  MEMORY_LIMIT: {
    regex: /(?:javascript heap out of memory|process ran out of memory)/gi,
    priority: "critical" as const,
    rootCause: "Memory limit exceeded",
  },
  ENV_VAR_MISSING: {
    regex: /environment variable (.+) is required but not set/gi,
    priority: "high" as const,
    rootCause: "Missing environment variable",
  },
  DEPENDENCY_ERROR: {
    regex: /npm err! code eresolve/gi,
    priority: "high" as const,
    rootCause: "Dependency resolution conflict",
  },
  FUNCTION_SIZE_LIMIT: {
    regex:
      /serverless function .+ exceeds the (?:maximum )?size limit|serverless function .+ exceeds the limit/gi,
    priority: "high" as const,
    rootCause: "Serverless function size limit exceeded",
  },
  STATIC_GENERATION: {
    regex: /error occurred prerendering page "([^"]+)"/gi,
    priority: "high" as const,
    rootCause: "Static page generation failure",
  },
  EDGE_RUNTIME: {
    regex: /edge runtime does not support/gi,
    priority: "high" as const,
    rootCause: "Edge Runtime compatibility issue",
  },
  NEXT_JS_BUILD: {
    regex: /cannot resolve module '([^']+)' from '([^']+)'/gi,
    priority: "critical" as const,
    rootCause: "Next.js build failure - missing module",
  },
  DATABASE_CONNECTION: {
    regex: /(?:can't reach database server|prisma schema validation failed)/gi,
    priority: "high" as const,
    rootCause: "Database connection failure",
  },
} as const

/**
 * Type guard to check if a value is a valid Priority
 */
export function isPriority(value: unknown): value is Priority {
  return (
    typeof value === "string" &&
    ["low", "medium", "high", "critical"].includes(value)
  )
}

/**
 * Type guard to check if a value is a valid FailureType
 */
export function isFailureType(value: unknown): value is FailureType {
  return (
    typeof value === "string" &&
    ["ci_failure", "vercel_failure", "bugbot_issue"].includes(value)
  )
}

/**
 * Helper to extract timestamp from log content
 */
export function extractTimestamp(logContent: string): string | undefined {
  const timestampPatterns = [
    /\[(\d{2}:\d{2}:\d{2}\.\d{3})\]/, // Vercel format: [12:34:56.789]
    /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/, // ISO format
    /(\d{2}:\d{2}:\d{2})/, // Simple time format
  ]

  for (const pattern of timestampPatterns) {
    const match = logContent.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return undefined
}

/**
 * Helper to generate unique failure ID
 */
export function generateFailureId(type: FailureType, suffix?: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 11)
  const typePart = type.replace("_", "-")
  const suffixPart = suffix ? `-${suffix}` : ""

  return `${typePart}-${timestamp}-${random}${suffixPart}`
}
