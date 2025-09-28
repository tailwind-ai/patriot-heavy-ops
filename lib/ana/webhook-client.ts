/**
 * Ana Webhook Client - Communication with Tod
 * Handles webhook calls to Tod with retry logic and error handling
 */

import { createHmac } from "crypto"
import {
  type AnaResults,
  type AnalyzedFailure,
  type AnaWebhookPayload,
  type TodWebhookPayload,
  type TodWebhookResponse,
  type WebhookClientConfig,
  type WebhookResult,
  validateAnaResults,
  validateAnalyzedFailure,
  validateAnaWebhookPayload,
} from "./types"

/**
 * Default configuration for webhook client
 */
const DEFAULT_CONFIG: Required<WebhookClientConfig> = {
  timeout: 30000, // 30 seconds
  retries: 2, // 2 retries after initial attempt
  headers: {},
}

/**
 * Webhook client for communicating with Tod
 */
export class AnaWebhookClient {
  private readonly endpoint: string
  private readonly config: Required<WebhookClientConfig>
  private readonly version = "1.0.0"

  constructor(endpoint: string, config: WebhookClientConfig = {}) {
    this.endpoint = endpoint
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Send analysis results to Tod webhook using Issue #282 format
   */
  async sendToTod(
    payload: AnaWebhookPayload
  ): Promise<WebhookResult<TodWebhookResponse>> {
    // Validate input data according to Issue #282 specification
    const validation = validateAnaWebhookPayload(payload)
    if (!validation.success) {
      return {
        success: false,
        error: `Invalid AnaWebhookPayload data: ${validation.error.issues
          .map((i) => i.message)
          .join(", ")}`,
      }
    }

    return this.sendWebhookRequestV2(payload)
  }

  /**
   * Send analysis results to Tod webhook (legacy format)
   * @deprecated Use sendToTod instead for Issue #282 compliance
   */
  async sendAnalysisResults(
    results: AnaResults,
    relatedPR: string
  ): Promise<WebhookResult<TodWebhookResponse>> {
    // Validate input data
    const validation = validateAnaResults(results)
    if (!validation.success) {
      return {
        success: false,
        error: `Invalid AnaResults data: ${validation.error.issues
          .map((i) => i.message)
          .join(", ")}`,
      }
    }

    const payload: TodWebhookPayload = {
      source: "ana",
      type: "analysis_results",
      data: results,
      metadata: {
        relatedPR,
        timestamp: new Date().toISOString(),
        version: this.version,
      },
    }

    return this.sendWebhookRequest(payload)
  }

  /**
   * Send single failure to Tod webhook
   */
  async sendSingleFailure(
    failure: AnalyzedFailure,
    relatedPR: string
  ): Promise<WebhookResult<TodWebhookResponse>> {
    // Validate input data
    const validation = validateAnalyzedFailure(failure)
    if (!validation.success) {
      return {
        success: false,
        error: `Invalid AnalyzedFailure data: ${validation.error.issues
          .map((i) => i.message)
          .join(", ")}`,
      }
    }

    const payload: TodWebhookPayload = {
      source: "ana",
      type: "single_failure",
      data: failure,
      metadata: {
        relatedPR,
        timestamp: new Date().toISOString(),
        version: this.version,
      },
    }

    return this.sendWebhookRequest(payload)
  }

  /**
   * Send webhook request with retry logic (Issue #282 format)
   */
  private async sendWebhookRequestV2(
    payload: AnaWebhookPayload
  ): Promise<WebhookResult<TodWebhookResponse>> {
    let lastError: Error | null = null
    const maxAttempts = this.config.retries + 1

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.makeHttpRequestV2(payload)
        return { success: true, data: response }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        // Don't retry on validation errors (4xx status codes)
        if (this.isClientError(lastError)) {
          break
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxAttempts) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000) // Max 10 seconds
          await this.sleep(delay)
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || "Unknown webhook error",
    }
  }

  /**
   * Send webhook request with retry logic (legacy format)
   * @deprecated Use sendWebhookRequestV2 instead
   */
  private async sendWebhookRequest(
    payload: TodWebhookPayload
  ): Promise<WebhookResult<TodWebhookResponse>> {
    let lastError: Error | null = null
    const maxAttempts = this.config.retries + 1

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.makeHttpRequest(payload)
        return { success: true, data: response }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        // Don't retry on validation errors (4xx status codes)
        if (this.isClientError(lastError)) {
          break
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxAttempts) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000) // Max 10 seconds
          await this.sleep(delay)
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || "Unknown webhook error",
    }
  }

  /**
   * Make HTTP request to Tod webhook (Issue #282 format)
   */
  private async makeHttpRequestV2(
    payload: AnaWebhookPayload
  ): Promise<TodWebhookResponse> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const timestamp = new Date().toISOString()
      const body = JSON.stringify(payload)
      const signature = this.generateSignature(body)

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Ana-Webhook-Client/1.0",
          "X-Ana-Version": this.version,
          "X-Ana-Signature": signature,
          "X-Ana-Timestamp": timestamp,
          ...this.config.headers,
        },
        body,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Handle HTTP error status codes
      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`

        try {
          const errorData = JSON.parse(errorText)
          if (errorData.error) {
            errorMessage += ` - ${errorData.error}`
          }
        } catch {
          // If error response is not JSON, include raw text
          if (errorText) {
            errorMessage += ` - ${errorText}`
          }
        }

        throw new Error(errorMessage)
      }

      // Parse response
      const responseText = await response.text()
      if (!responseText) {
        throw new Error("Empty response from Tod webhook")
      }

      try {
        const responseData = JSON.parse(responseText) as TodWebhookResponse
        return responseData
      } catch (parseError) {
        throw new Error(`Invalid JSON response from Tod webhook: ${parseError}`)
      }
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        // Handle specific error types
        if (error.name === "AbortError") {
          throw new Error(`Request timeout after ${this.config.timeout}ms`)
        }
        throw error
      }

      throw new Error(`Network error: ${String(error)}`)
    }
  }

  /**
   * Make HTTP request to Tod webhook (legacy format)
   * @deprecated Use makeHttpRequestV2 instead
   */
  private async makeHttpRequest(
    payload: TodWebhookPayload
  ): Promise<TodWebhookResponse> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Ana-Webhook-Client/1.0",
          "X-Ana-Version": this.version,
          ...this.config.headers,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Handle HTTP error status codes
      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`

        try {
          const errorData = JSON.parse(errorText)
          if (errorData.error) {
            errorMessage += ` - ${errorData.error}`
          }
        } catch {
          // If error response is not JSON, include raw text
          if (errorText) {
            errorMessage += ` - ${errorText}`
          }
        }

        throw new Error(errorMessage)
      }

      // Parse response
      const responseText = await response.text()
      if (!responseText) {
        throw new Error("Empty response from Tod webhook")
      }

      try {
        const responseData = JSON.parse(responseText) as TodWebhookResponse
        return responseData
      } catch (parseError) {
        throw new Error(`Invalid JSON response from Tod webhook: ${parseError}`)
      }
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        // Handle specific error types
        if (error.name === "AbortError") {
          throw new Error(`Request timeout after ${this.config.timeout}ms`)
        }
        throw error
      }

      throw new Error(`Network error: ${String(error)}`)
    }
  }

  /**
   * Generate signature for webhook security (Issue #282)
   */
  private generateSignature(body: string): string {
    const secret = process.env.ANA_WEBHOOK_SECRET || "dev-secret-key"
    
    // Simple signature for development mode
    if (process.env.NODE_ENV === "development") {
      return `sha256=dev-${Buffer.from(body + secret).toString('base64').substring(0, 16)}`
    }
    
    // Production HMAC-SHA256 signature
    const hmac = createHmac('sha256', secret)
    hmac.update(body)
    return `sha256=${hmac.digest('hex')}`
  }

  /**
   * Check if error is a client error (4xx) that shouldn't be retried
   */
  private isClientError(error: Error): boolean {
    const message = error.message.toLowerCase()
    return (
      message.includes("http 4") ||
      message.includes("validation") ||
      message.includes("bad request") ||
      message.includes("unauthorized") ||
      message.includes("forbidden") ||
      message.includes("not found")
    )
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Test webhook connectivity
   */
  async testConnection(): Promise<WebhookResult<{ status: string }>> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout for test

      const response = await fetch(this.endpoint, {
        method: "HEAD",
        headers: {
          "User-Agent": "Ana-Webhook-Client/1.0",
          "X-Ana-Version": this.version,
          ...this.config.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      return {
        success: true,
        data: { status: response.ok ? "connected" : "error" },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  /**
   * Get client configuration
   */
  getConfig(): WebhookClientConfig {
    return { ...this.config }
  }

  /**
   * Get webhook endpoint
   */
  getEndpoint(): string {
    return this.endpoint
  }
}

/**
 * Factory function to create webhook client with environment-based configuration
 */
export function createWebhookClient(
  endpoint?: string,
  config?: WebhookClientConfig
): AnaWebhookClient {
  const webhookEndpoint =
    endpoint ||
    process.env.TOD_WEBHOOK_ENDPOINT ||
    "http://localhost:3001/webhook/ana"

  const defaultConfig: WebhookClientConfig = {
    timeout: parseInt(process.env.WEBHOOK_TIMEOUT || "30000"),
    retries: parseInt(process.env.WEBHOOK_RETRIES || "2"),
    headers: {},
  }

  // Add authentication header if token is available
  const authToken = process.env.TOD_WEBHOOK_TOKEN
  if (authToken) {
    defaultConfig.headers = {
      ...defaultConfig.headers,
      Authorization: `Bearer ${authToken}`,
    }
  }

  const finalConfig = { ...defaultConfig, ...config }
  return new AnaWebhookClient(webhookEndpoint, finalConfig)
}

/**
 * Utility function to batch send multiple failures
 */
export async function batchSendFailures(
  client: AnaWebhookClient,
  failures: AnalyzedFailure[],
  relatedPR: string,
  batchSize = 10
): Promise<WebhookResult<{ totalSent: number; errors: string[] }>> {
  const errors: string[] = []
  let totalSent = 0

  // Process failures in batches
  for (let i = 0; i < failures.length; i += batchSize) {
    const batch = failures.slice(i, i + batchSize)

    // Send batch concurrently
    const promises = batch.map((failure) =>
      client.sendSingleFailure(failure, relatedPR)
    )

    const results = await Promise.allSettled(promises)

    for (const result of results) {
      if (result.status === "fulfilled" && result.value.success) {
        totalSent++
      } else {
        let error: string
        if (result.status === "rejected") {
          error = String(result.reason)
        } else {
          const webhookResult = result.value
          error = webhookResult.success ? "Unknown error" : webhookResult.error
        }
        errors.push(error)
      }
    }
  }

  if (errors.length === 0) {
    return {
      success: true,
      data: { totalSent, errors },
    }
  } else {
    return {
      success: false,
      error: `Failed to send ${errors.length} failures: ${errors.join(", ")}`,
    }
  }
}

/**
 * Create AnaWebhookPayload from AnaResults (Issue #282 format)
 */
export function createAnaWebhookPayload(
  results: AnaResults,
  workflowRunId?: string,
  prNumber?: number
): AnaWebhookPayload {
  const payload: AnaWebhookPayload = {
    summary: results.summary,
    analysisDate: results.analysisDate,
    failures: results.failures,
  }

  if (workflowRunId) {
    payload.workflowRunId = workflowRunId
  }

  if (prNumber) {
    payload.prNumber = prNumber
  }

  return payload
}

/**
 * Utility function to create webhook payload for testing (legacy format)
 * @deprecated Use createAnaWebhookPayload instead
 */
export function createTestWebhookPayload(
  type: "analysis_results" | "single_failure",
  data: AnaResults | AnalyzedFailure,
  relatedPR = "#test"
): TodWebhookPayload {
  return {
    source: "ana",
    type,
    data,
    metadata: {
      relatedPR,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    },
  }
}
