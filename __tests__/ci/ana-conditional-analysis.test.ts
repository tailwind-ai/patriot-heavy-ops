/**
 * Tests for Ana conditional analysis logic (Issue #303 Phase 3)
 *
 * This test suite validates that:
 * - Light analysis for PR validation failures (<30 seconds)
 * - Full analysis for main branch failures
 * - Conditional logic based on workflow context
 * - Performance requirements are met
 */

import { AnaAnalyzer } from "../../scripts/ana-cli"

// Mock Octokit for testing
jest.mock("@octokit/rest", () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    rest: {
      actions: {
        getWorkflowRun: jest.fn(),
        listJobsForWorkflowRun: jest.fn(),
        downloadJobLogsForWorkflowRun: jest.fn(),
      },
    },
  })),
}))

// Mock webhook client
jest.mock("../../lib/ana/webhook-client", () => ({
  AnaWebhookClient: jest.fn().mockImplementation(() => ({
    sendToTod: jest.fn().mockResolvedValue({ success: true }),
  })),
  createAnaWebhookPayload: jest.fn(),
}))

// Mock file system
jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}))

describe("Ana Conditional Analysis Logic (Issue #303 Phase 3)", () => {
  let analyzer: AnaAnalyzer
  let mockOctokit: any

  beforeEach(() => {
    // Reset environment
    process.env.GITHUB_ACCESS_TOKEN = "test-token"
    process.env.TOD_WEBHOOK_ENDPOINT =
      "http://localhost:3001/webhook/ana-failures"

    analyzer = new AnaAnalyzer()
    mockOctokit = (analyzer as any).octokit
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("PR Validation Light Analysis", () => {
    it("should perform light analysis for PR validation failures", async () => {
      // Mock PR validation workflow run
      mockOctokit.rest.actions.getWorkflowRun.mockResolvedValue({
        data: {
          id: 12345,
          name: "CI Tests",
          conclusion: "failure",
          head_branch: "feature-branch",
          event: "pull_request",
        },
      })

      mockOctokit.rest.actions.listJobsForWorkflowRun.mockResolvedValue({
        data: {
          jobs: [
            {
              id: 1,
              name: "PR Validation",
              conclusion: "failure",
            },
          ],
        },
      })

      const mockLogs = `
        ESLint found 2 errors
        TypeScript error in src/utils.ts:10:5
      `
      mockOctokit.rest.actions.downloadJobLogsForWorkflowRun.mockResolvedValue({
        data: Buffer.from(mockLogs),
      })

      const startTime = Date.now()
      const result = await analyzer.analyzeCIFailures("12345", 123)
      const duration = Date.now() - startTime

      // Should complete quickly for PR validation
      expect(duration).toBeLessThan(30000) // <30 seconds requirement
      expect(result.todos).toHaveLength(1) // Light analysis focuses on high/critical only
      expect(result.summary).toContain("PR validation")
    })

    it("should prioritize critical issues in light analysis", async () => {
      mockOctokit.rest.actions.getWorkflowRun.mockResolvedValue({
        data: {
          id: 12346,
          name: "Optimized CI Tests",
          conclusion: "failure",
          head_branch: "feature-branch",
          event: "pull_request",
        },
      })

      mockOctokit.rest.actions.listJobsForWorkflowRun.mockResolvedValue({
        data: {
          jobs: [
            {
              id: 2,
              name: "Fast Validation",
              conclusion: "failure",
            },
          ],
        },
      })

      const mockLogs = `
        npm run build failed
        ESLint found 1 error
        TypeScript error in src/component.tsx:25:10
      `
      mockOctokit.rest.actions.downloadJobLogsForWorkflowRun.mockResolvedValue({
        data: Buffer.from(mockLogs),
      })

      const result = await analyzer.analyzeCIFailures("12346", 124)

      // Should prioritize build failure (critical) over ESLint (medium)
      const buildFailure = result.todos.find((todo) =>
        todo.content.includes("Build process failed")
      )
      expect(buildFailure).toBeDefined()
      expect(buildFailure!.priority).toBe("critical")
    })
  })

  describe("Main Branch Full Analysis", () => {
    it("should perform comprehensive analysis for main branch failures", async () => {
      // Mock main branch workflow run
      mockOctokit.rest.actions.getWorkflowRun.mockResolvedValue({
        data: {
          id: 12347,
          name: "CI Tests",
          conclusion: "failure",
          head_branch: "main",
          event: "push",
        },
      })

      mockOctokit.rest.actions.listJobsForWorkflowRun.mockResolvedValue({
        data: {
          jobs: [
            {
              id: 3,
              name: "Main Branch Validation",
              conclusion: "failure",
            },
            {
              id: 4,
              name: "Coverage Analysis",
              conclusion: "failure",
            },
          ],
        },
      })

      const mockLogs = `
        Multiple test failures detected
        Coverage threshold not met
        Statements: 70% (threshold: 80%)
        Integration test timeout
      `
      mockOctokit.rest.actions.downloadJobLogsForWorkflowRun
        .mockResolvedValueOnce({ data: Buffer.from(mockLogs) })
        .mockResolvedValueOnce({ data: Buffer.from(mockLogs) })

      const result = await analyzer.analyzeCIFailures("12347", 125)

      // Should perform comprehensive analysis for main branch
      expect(result.todos.length).toBeGreaterThan(0)
      expect(result.summary).toMatch(/main branch/i)

      // Should include coverage analysis
      const coverageTodo = result.todos.find((todo) =>
        todo.content.includes("Coverage threshold")
      )
      expect(coverageTodo).toBeDefined()
    })

    it("should include detailed context for main branch analysis", async () => {
      mockOctokit.rest.actions.getWorkflowRun.mockResolvedValue({
        data: {
          id: 12348,
          name: "Optimized CI Tests",
          conclusion: "failure",
          head_branch: "main",
          event: "push",
        },
      })

      mockOctokit.rest.actions.listJobsForWorkflowRun.mockResolvedValue({
        data: {
          jobs: [
            {
              id: 5,
              name: "Integration Tests",
              conclusion: "failure",
            },
          ],
        },
      })

      const mockLogs = `
        FAIL __tests__/api/auth.test.ts
        ● Authentication flow › should handle invalid credentials
          Expected status 401, received 500
      `
      mockOctokit.rest.actions.downloadJobLogsForWorkflowRun.mockResolvedValue({
        data: Buffer.from(mockLogs),
      })

      const result = await analyzer.analyzeCIFailures("12348", 126)

      // Should include detailed test context (from bullet point pattern)
      expect(result.todos[0]?.content).toContain("Authentication flow")
      expect(result.todos[0]?.content).toContain(
        "should handle invalid credentials"
      )
    })
  })

  describe("Workflow Context Detection", () => {
    it("should detect PR context from workflow metadata", async () => {
      mockOctokit.rest.actions.getWorkflowRun.mockResolvedValue({
        data: {
          id: 12349,
          name: "CI Tests",
          conclusion: "failure",
          head_branch: "feature-xyz",
          event: "pull_request",
        },
      })

      mockOctokit.rest.actions.listJobsForWorkflowRun.mockResolvedValue({
        data: {
          jobs: [{ id: 6, name: "PR Validation", conclusion: "failure" }],
        },
      })

      mockOctokit.rest.actions.downloadJobLogsForWorkflowRun.mockResolvedValue({
        data: Buffer.from("ESLint found 1 error"),
      })

      const result = await analyzer.analyzeCIFailures("12349", 127)

      // Should recognize PR context
      expect(result.summary).toMatch(/PR|pull request/i)
    })

    it("should detect main branch context from workflow metadata", async () => {
      mockOctokit.rest.actions.getWorkflowRun.mockResolvedValue({
        data: {
          id: 12350,
          name: "CI Tests",
          conclusion: "failure",
          head_branch: "main",
          event: "push",
        },
      })

      mockOctokit.rest.actions.listJobsForWorkflowRun.mockResolvedValue({
        data: {
          jobs: [
            { id: 7, name: "Main Branch Validation", conclusion: "failure" },
          ],
        },
      })

      mockOctokit.rest.actions.downloadJobLogsForWorkflowRun.mockResolvedValue({
        data: Buffer.from("Test suite failed"),
      })

      const result = await analyzer.analyzeCIFailures("12350", 128)

      // Should recognize main branch context
      expect(result.summary).toMatch(/main|production/i)
    })
  })

  describe("Performance Requirements", () => {
    it("should meet <30 second requirement for PR validation", async () => {
      mockOctokit.rest.actions.getWorkflowRun.mockResolvedValue({
        data: {
          id: 12351,
          name: "Optimized CI Tests",
          conclusion: "failure",
          head_branch: "feature-branch",
          event: "pull_request",
        },
      })

      mockOctokit.rest.actions.listJobsForWorkflowRun.mockResolvedValue({
        data: {
          jobs: [{ id: 8, name: "Fast Validation", conclusion: "failure" }],
        },
      })

      mockOctokit.rest.actions.downloadJobLogsForWorkflowRun.mockResolvedValue({
        data: Buffer.from("Multiple errors detected"),
      })

      const startTime = Date.now()
      await analyzer.analyzeCIFailures("12351", 129)
      const duration = Date.now() - startTime

      expect(duration).toBeLessThan(30000) // Must be under 30 seconds
    })

    it("should allow longer analysis time for main branch", async () => {
      mockOctokit.rest.actions.getWorkflowRun.mockResolvedValue({
        data: {
          id: 12352,
          name: "CI Tests",
          conclusion: "failure",
          head_branch: "main",
          event: "push",
        },
      })

      mockOctokit.rest.actions.listJobsForWorkflowRun.mockResolvedValue({
        data: {
          jobs: [
            { id: 9, name: "Main Branch Validation", conclusion: "failure" },
            { id: 10, name: "Coverage Analysis", conclusion: "failure" },
          ],
        },
      })

      mockOctokit.rest.actions.downloadJobLogsForWorkflowRun
        .mockResolvedValueOnce({
          data: Buffer.from("Complex failure analysis"),
        })
        .mockResolvedValueOnce({ data: Buffer.from("Coverage details") })

      const startTime = Date.now()
      const result = await analyzer.analyzeCIFailures("12352", 130)
      const duration = Date.now() - startTime

      // Main branch can take longer but should still be reasonable
      expect(duration).toBeLessThan(60000) // Under 1 minute is reasonable
      expect(result.todos.length).toBeGreaterThan(0)
    })
  })

  describe("Analysis Mode Selection", () => {
    it("should use light mode for PR validation jobs", async () => {
      mockOctokit.rest.actions.getWorkflowRun.mockResolvedValue({
        data: {
          id: 12353,
          name: "CI Tests",
          conclusion: "failure",
          head_branch: "feature-branch",
          event: "pull_request",
        },
      })

      mockOctokit.rest.actions.listJobsForWorkflowRun.mockResolvedValue({
        data: {
          jobs: [{ id: 11, name: "PR Validation", conclusion: "failure" }],
        },
      })

      mockOctokit.rest.actions.downloadJobLogsForWorkflowRun.mockResolvedValue({
        data: Buffer.from("Quick analysis test"),
      })

      const result = await analyzer.analyzeCIFailures("12353", 131)

      // Light mode should focus on critical issues only
      expect(result.summary).toContain("validation")
    })

    it("should use full mode for main branch jobs", async () => {
      mockOctokit.rest.actions.getWorkflowRun.mockResolvedValue({
        data: {
          id: 12354,
          name: "CI Tests",
          conclusion: "failure",
          head_branch: "main",
          event: "push",
        },
      })

      mockOctokit.rest.actions.listJobsForWorkflowRun.mockResolvedValue({
        data: {
          jobs: [
            { id: 12, name: "Main Branch Validation", conclusion: "failure" },
          ],
        },
      })

      mockOctokit.rest.actions.downloadJobLogsForWorkflowRun.mockResolvedValue({
        data: Buffer.from("Comprehensive analysis test"),
      })

      const result = await analyzer.analyzeCIFailures("12354", 132)

      // Full mode should provide comprehensive analysis
      expect(result.summary).toContain("comprehensive")
    })
  })
})
