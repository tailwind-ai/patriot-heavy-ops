/**
 * Tests for Ana webhook enhancement with job-level metadata (Issue #303 Phase 4)
 *
 * This test suite validates that:
 * - Webhook payloads include job-level metadata
 * - Analysis mode information is transmitted
 * - Workflow context is included in payloads
 * - Performance metrics are tracked
 * - Backward compatibility is maintained
 */

import {
  AnaWebhookClient,
  createAnaWebhookPayload,
} from "../../lib/ana/webhook-client"
import { createAnaResults, createAnalyzedFailure } from "../../lib/ana/types"

// Mock fetch for webhook testing
global.fetch = jest.fn()

describe("Ana Webhook Enhancement (Issue #303 Phase 4)", () => {
  let webhookClient: AnaWebhookClient
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    webhookClient = new AnaWebhookClient(
      "http://localhost:3001/webhook/ana-failures",
      {
        timeout: 30000,
        retries: 2,
      }
    )
    mockFetch.mockClear()
  })

  describe("Enhanced Webhook Payload Structure", () => {
    it("should include job-level metadata in webhook payload", () => {
      const failures = [
        createAnalyzedFailure({
          type: "ci_failure",
          content: "Fast Validation: TypeScript error in src/utils.ts",
          priority: "critical",
          files: ["src/utils.ts"],
          lineNumbers: [42],
          rootCause: "TypeScript compilation error",
          impact: "Job 'Fast Validation' failed in workflow run 12345",
          suggestedFix: "Fix TypeScript error in the specified file and line",
          relatedPR: "#123",
        }),
      ]

      const anaResults = createAnaResults(
        failures,
        "PR validation failed with 1 failed job (light analysis)"
      )

      const payload = createAnaWebhookPayload(anaResults, "12345", 123, {
        analysisMode: "light",
        workflowContext: {
          type: "pr",
          branch: "feature-branch",
          event: "pull_request",
          isPR: true,
          isMainBranch: false,
        },
        jobMetadata: [
          {
            jobName: "Fast Validation",
            jobId: "1",
            conclusion: "failure",
            priority: "critical",
            analysisTime: 1500,
          },
        ],
        performanceMetrics: {
          totalAnalysisTime: 1500,
          jobCount: 1,
          averageJobAnalysisTime: 1500,
          patternMatchingTime: 100,
          webhookPreparationTime: 50,
        },
      })

      // Should include analysis mode
      expect(payload.analysisMode).toBe("light")

      // Should include workflow context
      expect(payload.workflowContext).toEqual({
        type: "pr",
        branch: "feature-branch",
        event: "pull_request",
        isPR: true,
        isMainBranch: false,
      })

      // Should include job metadata
      expect(payload.jobMetadata).toHaveLength(1)
      expect(payload.jobMetadata?.[0]).toEqual({
        jobName: "Fast Validation",
        jobId: "1",
        conclusion: "failure",
        priority: "critical",
        analysisTime: 1500,
      })

      // Should include performance metrics
      expect(payload.performanceMetrics).toBeDefined()
      expect(payload.performanceMetrics?.totalAnalysisTime).toBeGreaterThan(0)
      expect(payload.performanceMetrics?.jobCount).toBe(1)
    })

    it("should include comprehensive metadata for main branch analysis", () => {
      const failures = [
        createAnalyzedFailure({
          type: "ci_failure",
          content:
            "Integration Tests: Test case failed: Authentication flow › should handle invalid credentials",
          priority: "high",
          rootCause: "Jest test failure",
          impact: "Job 'Integration Tests' failed in workflow run 12346",
          suggestedFix: "Review and fix the failing test case",
          relatedPR: "#124",
        }),
        createAnalyzedFailure({
          type: "ci_failure",
          content:
            "Coverage Analysis: Coverage threshold not met: Statements at 75% (required: 80%)",
          priority: "medium",
          rootCause: "Coverage threshold failure",
          impact: "Job 'Coverage Analysis' failed in workflow run 12346",
          suggestedFix: "Increase test coverage or adjust coverage thresholds",
          relatedPR: "#124",
        }),
      ]

      const anaResults = createAnaResults(
        failures,
        "Main branch comprehensive analysis: 2 failed jobs"
      )

      const payload = createAnaWebhookPayload(anaResults, "12346", 124, {
        analysisMode: "full",
        workflowContext: {
          type: "main",
          branch: "main",
          event: "push",
          isPR: false,
          isMainBranch: true,
        },
        jobMetadata: [
          {
            jobName: "Integration Tests",
            jobId: "2",
            conclusion: "failure",
            priority: "high",
            analysisTime: 2500,
          },
          {
            jobName: "Coverage Analysis",
            jobId: "3",
            conclusion: "failure",
            priority: "medium",
            analysisTime: 1800,
          },
        ],
        performanceMetrics: {
          totalAnalysisTime: 4300,
          jobCount: 2,
          averageJobAnalysisTime: 2150,
          patternMatchingTime: 200,
          webhookPreparationTime: 100,
        },
      })

      // Should include full analysis mode
      expect(payload.analysisMode).toBe("full")

      // Should include main branch context
      expect(payload.workflowContext?.type).toBe("main")
      expect(payload.workflowContext?.isMainBranch).toBe(true)

      // Should include multiple job metadata
      expect(payload.jobMetadata).toHaveLength(2)
      expect(payload.jobMetadata?.map((j) => j.jobName)).toContain(
        "Integration Tests"
      )
      expect(payload.jobMetadata?.map((j) => j.jobName)).toContain(
        "Coverage Analysis"
      )

      // Should include comprehensive performance metrics
      expect(payload.performanceMetrics?.totalAnalysisTime).toBeGreaterThan(
        4000
      ) // Sum of job times
      expect(payload.performanceMetrics?.jobCount).toBe(2)
      expect(
        payload.performanceMetrics?.averageJobAnalysisTime
      ).toBeGreaterThan(2000)
    })
  })

  describe("Performance Metrics Tracking", () => {
    it("should track analysis performance metrics", () => {
      const failures = [
        createAnalyzedFailure({
          type: "ci_failure",
          content: "Fast Validation: Build process failed",
          priority: "critical",
          rootCause: "Build process failure",
          impact: "Job 'Fast Validation' failed",
          suggestedFix:
            "Check build configuration and resolve compilation errors",
          relatedPR: "#125",
        }),
      ]

      const anaResults = createAnaResults(failures, "PR validation failed")

      const payload = createAnaWebhookPayload(anaResults, "12347", 125, {
        analysisMode: "light",
        workflowContext: {
          type: "pr",
          branch: "feature-branch",
          event: "pull_request",
          isPR: true,
          isMainBranch: false,
        },
        jobMetadata: [
          {
            jobName: "Fast Validation",
            jobId: "4",
            conclusion: "failure",
            priority: "critical",
            analysisTime: 800,
          },
        ],
        performanceMetrics: {
          totalAnalysisTime: 850,
          jobCount: 1,
          averageJobAnalysisTime: 850,
          patternMatchingTime: 50,
          webhookPreparationTime: 25,
        },
      })

      // Should include detailed performance metrics
      expect(payload.performanceMetrics).toEqual({
        totalAnalysisTime: 850,
        jobCount: 1,
        averageJobAnalysisTime: 850,
        patternMatchingTime: 50,
        webhookPreparationTime: 25,
      })

      // Should meet performance requirements for light analysis
      expect(payload.performanceMetrics?.totalAnalysisTime).toBeLessThan(30000) // <30 seconds for PR
    })

    it("should track performance for full analysis mode", () => {
      const failures = [
        createAnalyzedFailure({
          type: "ci_failure",
          content: "Main Branch Validation: Multiple test failures",
          priority: "high",
          rootCause: "Jest test failure",
          impact: "Job failed",
          suggestedFix: "Review test failures",
          relatedPR: "#126",
        }),
      ]

      const anaResults = createAnaResults(failures, "Main branch analysis")

      const payload = createAnaWebhookPayload(anaResults, "12348", 126, {
        analysisMode: "full",
        workflowContext: {
          type: "main",
          branch: "main",
          event: "push",
          isPR: false,
          isMainBranch: true,
        },
        jobMetadata: [
          {
            jobName: "Main Branch Validation",
            jobId: "5",
            conclusion: "failure",
            priority: "high",
            analysisTime: 3500,
          },
        ],
        performanceMetrics: {
          totalAnalysisTime: 3600,
          jobCount: 1,
          averageJobAnalysisTime: 3600,
          patternMatchingTime: 100,
          webhookPreparationTime: 50,
        },
      })

      // Should allow longer analysis time for main branch
      expect(payload.performanceMetrics?.totalAnalysisTime).toBeGreaterThan(
        1000
      )
      expect(payload.performanceMetrics?.totalAnalysisTime).toBeLessThan(60000) // Still reasonable
    })
  })

  describe("Webhook Client Enhancement", () => {
    it("should send enhanced payload to Tod webhook", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify({
            success: true,
            message: "Analysis received",
            todosCreated: 2,
          }),
        json: async () => ({
          success: true,
          message: "Analysis received",
          todosCreated: 2,
        }),
      } as Response)

      const payload = {
        workflowRunId: "12349",
        prNumber: 127,
        failures: [],
        summary: "Test webhook",
        analysisDate: new Date().toISOString(),
        analysisMode: "light" as const,
        workflowContext: {
          type: "pr" as const,
          branch: "feature-branch",
          event: "pull_request",
          isPR: true,
          isMainBranch: false,
        },
        jobMetadata: [
          {
            jobName: "Fast Validation",
            jobId: "6",
            conclusion: "failure" as const,
            priority: "critical" as const,
            analysisTime: 1200,
          },
        ],
        performanceMetrics: {
          totalAnalysisTime: 1250,
          jobCount: 1,
          averageJobAnalysisTime: 1250,
          patternMatchingTime: 50,
          webhookPreparationTime: 25,
        },
      }

      const result = await webhookClient.sendToTod(payload)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data?.todosCreated).toBe(2)
      }
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/webhook/ana-failures",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(payload),
        })
      )
    })

    it("should handle webhook errors gracefully", async () => {
      mockFetch.mockRejectedValueOnce(
        new Error("HTTP 500: Internal Server Error")
      )

      const payload = {
        workflowRunId: "12350",
        prNumber: 128,
        failures: [],
        summary: "Test error handling",
        analysisDate: new Date().toISOString(),
        analysisMode: "light" as const,
        workflowContext: {
          type: "pr" as const,
          branch: "feature-branch",
          event: "pull_request",
          isPR: true,
          isMainBranch: false,
        },
        jobMetadata: [],
        performanceMetrics: {
          totalAnalysisTime: 1000,
          jobCount: 0,
          averageJobAnalysisTime: 0,
          patternMatchingTime: 0,
          webhookPreparationTime: 25,
        },
      }

      const result = await webhookClient.sendToTod(payload)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeDefined()
      }
    })
  })

  describe("Backward Compatibility", () => {
    it("should maintain compatibility with existing webhook format", () => {
      const failures = [
        createAnalyzedFailure({
          type: "ci_failure",
          content: "Legacy test failure",
          priority: "medium",
          rootCause: "Test failure",
          impact: "Job failed",
          suggestedFix: "Fix test",
          relatedPR: "#129",
        }),
      ]

      const anaResults = createAnaResults(failures, "Legacy analysis")

      // Test without enhanced metadata (backward compatibility)
      const payload = createAnaWebhookPayload(anaResults, "12351", 129)

      // Should include basic required fields
      expect(payload.workflowRunId).toBe("12351")
      expect(payload.prNumber).toBe(129)
      expect(payload.failures).toHaveLength(1)
      expect(payload.summary).toBe("Legacy analysis")
      expect(payload.analysisDate).toBeDefined()

      // Should have default values for new fields
      expect(payload.analysisMode).toBe("full") // Default mode
      expect(payload.workflowContext).toBeDefined()
      expect(payload.jobMetadata).toEqual([])
      expect(payload.performanceMetrics).toBeDefined()
    })

    it("should work with existing Tod webhook endpoint", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify({
            success: true,
            message: "Legacy format accepted",
          }),
        json: async () => ({
          success: true,
          message: "Legacy format accepted",
        }),
      } as Response)

      const failures = [
        createAnalyzedFailure({
          type: "ci_failure",
          content: "Legacy failure",
          priority: "high",
          rootCause: "Legacy issue",
          impact: "Legacy impact",
          suggestedFix: "Legacy fix",
          relatedPR: "#130",
        }),
      ]

      const anaResults = createAnaResults(failures, "Legacy test")
      const payload = createAnaWebhookPayload(anaResults, "12352", 130)

      const result = await webhookClient.sendToTod(payload)

      expect(result.success).toBe(true)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })

  describe("Integration with Analysis Modes", () => {
    it("should include light analysis metadata", () => {
      const failures = [
        createAnalyzedFailure({
          type: "ci_failure",
          content: "Critical failure only",
          priority: "critical",
          rootCause: "Critical issue",
          impact: "High impact",
          suggestedFix: "Immediate fix needed",
          relatedPR: "#131",
        }),
      ]

      const anaResults = createAnaResults(failures, "Light analysis result")

      const payload = createAnaWebhookPayload(anaResults, "12353", 131, {
        analysisMode: "light",
        workflowContext: {
          type: "pr",
          branch: "feature-branch",
          event: "pull_request",
          isPR: true,
          isMainBranch: false,
        },
        jobMetadata: [
          {
            jobName: "Fast Validation",
            jobId: "7",
            conclusion: "failure",
            priority: "critical",
            analysisTime: 500,
          },
        ],
      })

      expect(payload.analysisMode).toBe("light")
      expect(payload.workflowContext?.isPR).toBe(true)
      expect(payload.jobMetadata?.[0]?.priority).toBe("critical")
    })

    it("should include full analysis metadata", () => {
      const failures = [
        createAnalyzedFailure({
          type: "ci_failure",
          content: "Comprehensive failure analysis",
          priority: "medium",
          rootCause: "Complex issue",
          impact: "Moderate impact",
          suggestedFix: "Detailed fix required",
          relatedPR: "#132",
        }),
      ]

      const anaResults = createAnaResults(failures, "Full analysis result")

      const payload = createAnaWebhookPayload(anaResults, "12354", 132, {
        analysisMode: "full",
        workflowContext: {
          type: "main",
          branch: "main",
          event: "push",
          isPR: false,
          isMainBranch: true,
        },
        jobMetadata: [
          {
            jobName: "Main Branch Validation",
            jobId: "8",
            conclusion: "failure",
            priority: "medium",
            analysisTime: 2000,
          },
        ],
      })

      expect(payload.analysisMode).toBe("full")
      expect(payload.workflowContext?.isMainBranch).toBe(true)
      expect(payload.jobMetadata?.[0]?.analysisTime).toBeGreaterThan(1000)
    })
  })
})
