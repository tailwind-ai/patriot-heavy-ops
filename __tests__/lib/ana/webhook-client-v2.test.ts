/**
 * Tests for Ana Webhook Client Issue #282 Implementation
 * Tests the new sendToTod method and AnaWebhookPayload format
 */

import {
  AnaWebhookClient,
  createAnaWebhookPayload,
} from "@/lib/ana/webhook-client"
import {
  type AnaWebhookPayload,
  type AnaResults,
  createAnaResults,
  createAnalyzedFailure,
} from "@/lib/ana/types"

// Mock fetch for testing
const mockFetch = jest.fn()
global.fetch = mockFetch

describe("Ana Webhook Client Issue #282", () => {
  let client: AnaWebhookClient
  const testEndpoint = "http://localhost:3001/webhook/ana-failures"

  beforeEach(() => {
    jest.clearAllMocks()
    client = new AnaWebhookClient(testEndpoint, { timeout: 5000, retries: 1 })
    process.env.NODE_ENV = "development"
    process.env.ANA_WEBHOOK_SECRET = "test-secret"
  })

  afterEach(() => {
    delete process.env.ANA_WEBHOOK_SECRET
  })

  describe("sendToTod method (Issue #282)", () => {
    const validPayload: AnaWebhookPayload = {
      summary: "CI Test workflow failed with 2 TypeScript errors",
      analysisDate: "2025-09-27T18:30:00Z",
      workflowRunId: "12345",
      prNumber: 279,
      failures: [
        createAnalyzedFailure({
          type: "ci_failure",
          content: "Fix TypeScript compilation error in user-service.ts:45",
          priority: "high",
          files: ["lib/services/user-service.ts"],
          lineNumbers: [45, 67],
          rootCause: "Missing interface definition for UserData type",
          impact: "Blocks user authentication flow and prevents build",
          suggestedFix: "Add UserData interface to types/user.ts",
          affectedComponents: ["Authentication", "User Management"],
          relatedPR: "#279",
        }),
      ],
    }

    it("should send valid AnaWebhookPayload successfully", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(
          JSON.stringify({
            success: true,
            message: "Created 1 TODOs from Ana analysis",
            todosCreated: 1,
          })
        ),
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await client.sendToTod(validPayload)

      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        success: true,
        message: "Created 1 TODOs from Ana analysis",
        todosCreated: 1,
      })

      // Verify fetch was called with correct parameters
      expect(mockFetch).toHaveBeenCalledWith(
        testEndpoint,
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            "User-Agent": "Ana-Webhook-Client/1.0",
            "X-Ana-Version": "1.0.0",
            "X-Ana-Signature": expect.stringMatching(/^sha256=dev-/),
            "X-Ana-Timestamp": expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
          }),
          body: JSON.stringify(validPayload),
        })
      )
    })

    it("should validate payload before sending", async () => {
      const invalidPayload = {
        // Missing required fields
        summary: "",
        analysisDate: "invalid-date",
        failures: [],
      } as AnaWebhookPayload

      const result = await client.sendToTod(invalidPayload)

      expect(result.success).toBe(false)
      expect(result.error).toContain("Invalid AnaWebhookPayload data")
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it("should handle server errors with retry logic", async () => {
      const mockErrorResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: jest.fn().mockResolvedValue("Server error"),
      }
      mockFetch.mockResolvedValue(mockErrorResponse)

      const result = await client.sendToTod(validPayload)

      expect(result.success).toBe(false)
      expect(result.error).toContain("HTTP 500: Internal Server Error")
      // Should retry once (retries: 1)
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it("should not retry on client errors (4xx)", async () => {
      const mockClientErrorResponse = {
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: jest.fn().mockResolvedValue(
          JSON.stringify({ error: "Invalid payload format" })
        ),
      }
      mockFetch.mockResolvedValueOnce(mockClientErrorResponse)

      const result = await client.sendToTod(validPayload)

      expect(result.success).toBe(false)
      expect(result.error).toContain("HTTP 400: Bad Request")
      expect(result.error).toContain("Invalid payload format")
      // Should not retry on client errors
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it("should handle network errors with retry logic", async () => {
      const networkError = new Error("Network error")
      mockFetch.mockRejectedValue(networkError)

      const result = await client.sendToTod(validPayload)

      expect(result.success).toBe(false)
      expect(result.error).toBe("Network error")
      // Should retry once
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it("should handle timeout errors", async () => {
      const timeoutError = new Error("The operation was aborted")
      timeoutError.name = "AbortError"
      mockFetch.mockRejectedValue(timeoutError) // Reject all retries

      const result = await client.sendToTod(validPayload)

      expect(result.success).toBe(false)
      expect(result.error).toContain("Request timeout after")
    })

    it("should include signature and timestamp headers", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await client.sendToTod(validPayload)

      const fetchCall = mockFetch.mock.calls[0]
      const headers = fetchCall[1].headers

      expect(headers["X-Ana-Signature"]).toMatch(/^sha256=dev-/)
      expect(headers["X-Ana-Timestamp"]).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })

    it("should handle empty response body", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(""),
      }
      mockFetch.mockResolvedValue(mockResponse) // Resolve all retries with empty response

      const result = await client.sendToTod(validPayload)

      expect(result.success).toBe(false)
      expect(result.error).toContain("Empty response")
    })

    it("should handle malformed JSON response", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue("invalid json {"),
      }
      mockFetch.mockResolvedValue(mockResponse) // Resolve all retries with malformed JSON

      const result = await client.sendToTod(validPayload)

      expect(result.success).toBe(false)
      expect(result.error).toContain("Invalid JSON")
    })
  })

  describe("createAnaWebhookPayload helper", () => {
    it("should create valid payload from AnaResults", () => {
      const failures = [
        createAnalyzedFailure({
          type: "ci_failure",
          content: "TypeScript error",
          priority: "high",
        }),
        createAnalyzedFailure({
          type: "vercel_failure",
          content: "Build timeout",
          priority: "critical",
        }),
      ]

      const results = createAnaResults(failures, "Multiple failures detected")
      const payload = createAnaWebhookPayload(results, "workflow-123", 456)

      expect(payload).toEqual({
        summary: "Multiple failures detected",
        analysisDate: results.analysisDate,
        workflowRunId: "workflow-123",
        prNumber: 456,
        failures: failures,
      })
    })

    it("should create payload without optional fields", () => {
      const failures = [
        createAnalyzedFailure({
          type: "ci_failure",
          content: "Simple error",
          priority: "medium",
        }),
      ]

      const results = createAnaResults(failures, "Simple failure")
      const payload = createAnaWebhookPayload(results)

      expect(payload).toEqual({
        summary: "Simple failure",
        analysisDate: results.analysisDate,
        failures: failures,
      })
      expect(payload.workflowRunId).toBeUndefined()
      expect(payload.prNumber).toBeUndefined()
    })

    it("should handle empty failures array", () => {
      const results = createAnaResults([], "No failures found")
      const payload = createAnaWebhookPayload(results)

      expect(payload).toEqual({
        summary: "No failures found",
        analysisDate: results.analysisDate,
        failures: [],
      })
    })
  })

  describe("Signature generation", () => {
    const testPayload: AnaWebhookPayload = {
      summary: "Test signature generation",
      analysisDate: "2025-09-27T18:30:00Z",
      failures: [
        createAnalyzedFailure({
          type: "ci_failure",
          content: "Test failure",
          priority: "medium",
        }),
      ],
    }

    it("should generate consistent signatures for same payload", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
      }
      mockFetch.mockResolvedValue(mockResponse)

      // Send same payload twice
      await client.sendToTod(testPayload)
      await client.sendToTod(testPayload)

      const call1Headers = mockFetch.mock.calls[0][1].headers
      const call2Headers = mockFetch.mock.calls[1][1].headers

      // Signatures should be the same for same payload (in development mode)
      expect(call1Headers["X-Ana-Signature"]).toBe(
        call2Headers["X-Ana-Signature"]
      )
    })

    it("should generate signatures for all payloads", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const payload2 = { 
        ...testPayload, 
        summary: "Different summary",
        failures: [
          createAnalyzedFailure({
            type: "vercel_failure",
            content: "Different failure content",
            priority: "critical",
          }),
        ],
      }

      await client.sendToTod(testPayload)
      await client.sendToTod(payload2)

      const call1Headers = mockFetch.mock.calls[0][1].headers
      const call2Headers = mockFetch.mock.calls[1][1].headers

      // Both payloads should have signatures
      expect(call1Headers["X-Ana-Signature"]).toMatch(/^sha256=dev-/)
      expect(call2Headers["X-Ana-Signature"]).toMatch(/^sha256=dev-/)
    })
  })

  describe("Integration with different failure types", () => {
    it("should handle CI failures", async () => {
      const ciPayload: AnaWebhookPayload = {
        summary: "CI failures detected",
        analysisDate: new Date().toISOString(),
        failures: [
          createAnalyzedFailure({
            type: "ci_failure",
            content: "TypeScript compilation error",
            priority: "high",
            files: ["src/utils.ts"],
            lineNumbers: [42],
          }),
        ],
      }

      const mockResponse = {
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await client.sendToTod(ciPayload)

      expect(result.success).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith(
        testEndpoint,
        expect.objectContaining({
          body: JSON.stringify(ciPayload),
        })
      )
    })

    it("should handle Vercel failures", async () => {
      const vercelPayload: AnaWebhookPayload = {
        summary: "Vercel deployment failed",
        analysisDate: new Date().toISOString(),
        failures: [
          createAnalyzedFailure({
            type: "vercel_failure",
            content: "Build timeout exceeded",
            priority: "critical",
            rootCause: "Large bundle size",
            suggestedFix: "Enable build caching",
          }),
        ],
      }

      const mockResponse = {
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await client.sendToTod(vercelPayload)

      expect(result.success).toBe(true)
    })

    it("should handle bugbot issues", async () => {
      const bugbotPayload: AnaWebhookPayload = {
        summary: "Code quality issues detected",
        analysisDate: new Date().toISOString(),
        failures: [
          createAnalyzedFailure({
            type: "bugbot_issue",
            content: "Potential security vulnerability",
            priority: "high",
            affectedComponents: ["Authentication"],
            suggestedFix: "Update dependency to latest version",
          }),
        ],
      }

      const mockResponse = {
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await client.sendToTod(bugbotPayload)

      expect(result.success).toBe(true)
    })
  })

  describe("Backward compatibility", () => {
    it("should maintain legacy sendAnalysisResults method", async () => {
      const failures = [
        createAnalyzedFailure({
          type: "ci_failure",
          content: "Legacy test",
          priority: "medium",
        }),
      ]
      const results = createAnaResults(failures, "Legacy test")

      const mockResponse = {
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await client.sendAnalysisResults(results, "#123")

      expect(result.success).toBe(true)
      expect(mockFetch).toHaveBeenCalled()
    })

    it("should maintain legacy sendSingleFailure method", async () => {
      const failure = createAnalyzedFailure({
        type: "ci_failure",
        content: "Single failure test",
        priority: "low",
      })

      const mockResponse = {
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await client.sendSingleFailure(failure, "#123")

      expect(result.success).toBe(true)
      expect(mockFetch).toHaveBeenCalled()
    })
  })
})
