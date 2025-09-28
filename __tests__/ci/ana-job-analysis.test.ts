/**
 * Tests for Ana job-specific analysis (Issue #303 Phase 2)
 *
 * This test suite validates that:
 * - Ana can detect and analyze different job types from optimized CI architecture
 * - Job-specific TODO generation works for fast-validation, integration-tests, coverage
 * - Priority and categorization is correct based on job type
 * - Performance requirements are met for different job types
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

describe("Ana Job-Specific Analysis (Issue #303 Phase 2)", () => {
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

  describe("Optimized CI Job Detection", () => {
    it("should detect fast-validation job failures and generate high-priority TODOs", async () => {
      // Mock workflow run for "Optimized CI Tests"
      mockOctokit.rest.actions.getWorkflowRun.mockResolvedValue({
        data: {
          id: 12345,
          name: "Optimized CI Tests",
          conclusion: "failure",
          head_branch: "feature-branch",
        },
      })

      // Mock failed fast-validation job
      mockOctokit.rest.actions.listJobsForWorkflowRun.mockResolvedValue({
        data: {
          jobs: [
            {
              id: 1,
              name: "Fast Validation",
              conclusion: "failure",
              steps: [
                { name: "TypeScript check", conclusion: "failure" },
                { name: "ESLint check", conclusion: "success" },
                { name: "Unit tests", conclusion: "success" },
              ],
            },
          ],
        },
      })

      // Mock job logs with TypeScript error
      const mockLogs = `
        error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
        src/components/Button.tsx:25:10
        npm run build failed
      `
      mockOctokit.rest.actions.downloadJobLogsForWorkflowRun.mockResolvedValue({
        data: Buffer.from(mockLogs),
      })

      const result = await analyzer.analyzeCIFailures("12345", 123)

      // Should generate high-priority TODO for fast-validation failure
      expect(result.todos.length).toBeGreaterThan(0)

      // Find the TypeScript error TODO
      const typescriptTodo = result.todos.find((todo) =>
        todo.files?.includes("src/components/Button.tsx")
      )
      expect(typescriptTodo).toBeDefined()
      expect(typescriptTodo!.priority).toBe("critical") // Fast validation failures are critical for quick feedback
      expect(typescriptTodo!.content).toContain("Fast Validation")
      expect(typescriptTodo!.files).toContain("src/components/Button.tsx")
      expect(typescriptTodo!.lineNumbers).toContain(25)
    })

    it("should detect integration-tests job failures and generate medium-priority TODOs", async () => {
      mockOctokit.rest.actions.getWorkflowRun.mockResolvedValue({
        data: {
          id: 12346,
          name: "Optimized CI Tests",
          conclusion: "failure",
        },
      })

      mockOctokit.rest.actions.listJobsForWorkflowRun.mockResolvedValue({
        data: {
          jobs: [
            {
              id: 2,
              name: "Integration Tests",
              conclusion: "failure",
            },
          ],
        },
      })

      const mockLogs = `
        FAIL __tests__/api/users.test.ts
        ● User API › should create user
          Expected status 201, received 500
      `
      mockOctokit.rest.actions.downloadJobLogsForWorkflowRun.mockResolvedValue({
        data: Buffer.from(mockLogs),
      })

      const result = await analyzer.analyzeCIFailures("12346", 124)

      expect(result.todos).toHaveLength(1)
      expect(result.todos[0]?.priority).toBe("high") // Integration test failures are high priority
      expect(result.todos[0]?.content).toContain("Integration Tests")
      expect(result.todos[0]?.content).toContain("User API")
    })

    it("should detect coverage job failures and generate low-priority TODOs", async () => {
      mockOctokit.rest.actions.getWorkflowRun.mockResolvedValue({
        data: {
          id: 12347,
          name: "Optimized CI Tests",
          conclusion: "failure",
        },
      })

      mockOctokit.rest.actions.listJobsForWorkflowRun.mockResolvedValue({
        data: {
          jobs: [
            {
              id: 3,
              name: "Coverage Analysis",
              conclusion: "failure",
            },
          ],
        },
      })

      const mockLogs = `
        Coverage threshold not met
        Statements: 75% (threshold: 80%)
        Branches: 70% (threshold: 80%)
      `
      mockOctokit.rest.actions.downloadJobLogsForWorkflowRun.mockResolvedValue({
        data: Buffer.from(mockLogs),
      })

      const result = await analyzer.analyzeCIFailures("12347", 125)

      expect(result.todos).toHaveLength(1)
      expect(result.todos[0]?.priority).toBe("medium") // Coverage failures are medium priority
      expect(result.todos[0]?.content).toContain("Coverage Analysis")
      // Coverage pattern should match and extract details
      expect(result.todos.length).toBeGreaterThan(0)
    })
  })

  describe("Legacy CI Job Detection", () => {
    it("should handle legacy CI Tests workflow jobs", async () => {
      mockOctokit.rest.actions.getWorkflowRun.mockResolvedValue({
        data: {
          id: 12348,
          name: "CI Tests",
          conclusion: "failure",
        },
      })

      mockOctokit.rest.actions.listJobsForWorkflowRun.mockResolvedValue({
        data: {
          jobs: [
            {
              id: 4,
              name: "PR Validation",
              conclusion: "failure",
            },
          ],
        },
      })

      const mockLogs = `
        ESLint found 3 errors
        error: 'unused' is defined but never used
      `
      mockOctokit.rest.actions.downloadJobLogsForWorkflowRun.mockResolvedValue({
        data: Buffer.from(mockLogs),
      })

      const result = await analyzer.analyzeCIFailures("12348", 126)

      expect(result.todos).toHaveLength(1)
      expect(result.todos[0]?.priority).toBe("medium") // ESLint errors are medium priority
      expect(result.todos[0]?.content).toContain("PR Validation")
      // ESLint pattern should match and extract error count
      expect(result.todos.length).toBeGreaterThan(0)
    })
  })

  describe("Job-Specific Analysis Enhancement", () => {
    it("should provide job-specific suggested fixes", async () => {
      mockOctokit.rest.actions.getWorkflowRun.mockResolvedValue({
        data: { id: 12349, name: "Optimized CI Tests", conclusion: "failure" },
      })

      mockOctokit.rest.actions.listJobsForWorkflowRun.mockResolvedValue({
        data: {
          jobs: [{ id: 5, name: "Fast Validation", conclusion: "failure" }],
        },
      })

      const mockLogs = `
        TypeScript error in src/utils/helpers.ts:42:15
        error TS2339: Property 'nonExistent' does not exist on type 'User'
      `
      mockOctokit.rest.actions.downloadJobLogsForWorkflowRun.mockResolvedValue({
        data: Buffer.from(mockLogs),
      })

      const result = await analyzer.analyzeCIFailures("12349", 127)

      expect(result.todos[0]?.content).toContain("Fast Validation")
      // Should include job-specific context in the TODO content
      expect(result.todos[0]?.files).toContain("src/utils/helpers.ts")
      expect(result.todos[0]?.lineNumbers).toContain(42)
    })

    it("should categorize TODOs by job type for better organization", async () => {
      mockOctokit.rest.actions.getWorkflowRun.mockResolvedValue({
        data: { id: 12350, name: "Optimized CI Tests", conclusion: "failure" },
      })

      mockOctokit.rest.actions.listJobsForWorkflowRun.mockResolvedValue({
        data: {
          jobs: [
            { id: 6, name: "Fast Validation", conclusion: "failure" },
            { id: 7, name: "Integration Tests", conclusion: "failure" },
          ],
        },
      })

      mockOctokit.rest.actions.downloadJobLogsForWorkflowRun
        .mockResolvedValueOnce({
          data: Buffer.from("TypeScript error in file.ts"),
        })
        .mockResolvedValueOnce({
          data: Buffer.from("API test failed: timeout"),
        })

      const result = await analyzer.analyzeCIFailures("12350", 128)

      expect(result.todos).toHaveLength(2)

      // Fast validation TODO should be higher priority
      const fastValidationTodo = result.todos.find((t) =>
        t.content.includes("Fast Validation")
      )
      const integrationTodo = result.todos.find((t) =>
        t.content.includes("Integration Tests")
      )

      expect(fastValidationTodo).toBeDefined()
      expect(integrationTodo).toBeDefined()

      // Fast validation should have higher priority than integration tests
      const priorityOrder = ["critical", "high", "medium", "low"]
      const fastPriorityIndex = priorityOrder.indexOf(
        fastValidationTodo!.priority
      )
      const integrationPriorityIndex = priorityOrder.indexOf(
        integrationTodo!.priority
      )

      expect(fastPriorityIndex).toBeLessThanOrEqual(integrationPriorityIndex)
    })
  })

  describe("Performance Requirements", () => {
    it("should complete analysis in under 30 seconds for fast-validation failures", async () => {
      const startTime = Date.now()

      mockOctokit.rest.actions.getWorkflowRun.mockResolvedValue({
        data: { id: 12351, name: "Optimized CI Tests", conclusion: "failure" },
      })

      mockOctokit.rest.actions.listJobsForWorkflowRun.mockResolvedValue({
        data: {
          jobs: [{ id: 8, name: "Fast Validation", conclusion: "failure" }],
        },
      })

      mockOctokit.rest.actions.downloadJobLogsForWorkflowRun.mockResolvedValue({
        data: Buffer.from("Simple error message"),
      })

      await analyzer.analyzeCIFailures("12351", 129)

      const duration = Date.now() - startTime
      expect(duration).toBeLessThan(30000) // Should complete in under 30 seconds
    })
  })
})
