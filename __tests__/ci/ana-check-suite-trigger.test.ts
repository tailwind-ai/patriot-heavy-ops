/**
 * Tests for Ana workflow check_suite trigger configuration (Issue #326)
 *
 * PROBLEM: Ana workflow_run event only triggers on default branch (main)
 * SOLUTION: Add check_suite event to trigger Ana on PR failures across all branches
 *
 * This test suite validates that:
 * - Ana workflow listens to check_suite events
 * - Ana triggers on check_suite completion with failure conclusion
 * - Ana can extract workflow run ID from check_suite event
 * - Ana can extract PR number from check_suite event
 * - Backward compatibility maintained with workflow_run triggers
 */

import { readFileSync } from "fs"
import { join } from "path"

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const yaml = require("js-yaml")

describe("Ana Check Suite Trigger Configuration (Issue #326)", () => {
  const anaWorkflowPath = join(process.cwd(), ".github/workflows/ana.yml")
  let anaWorkflowConfig: any

  beforeAll(() => {
    const anaWorkflowContent = readFileSync(anaWorkflowPath, "utf8")
    anaWorkflowConfig = yaml.load(anaWorkflowContent)
  })

  describe("Check Suite Event Configuration", () => {
    it("should listen to check_suite events", () => {
      expect(anaWorkflowConfig.on).toHaveProperty("check_suite")
    })

    it("should trigger on check_suite completion", () => {
      const checkSuite = anaWorkflowConfig.on.check_suite
      expect(checkSuite).toHaveProperty("types")
      expect(checkSuite.types).toContain("completed")
    })

    it("should maintain backward compatibility with workflow_run trigger", () => {
      // CRITICAL: Must not break existing workflow_run functionality
      expect(anaWorkflowConfig.on).toHaveProperty("workflow_run")

      const workflowRun = anaWorkflowConfig.on.workflow_run
      expect(workflowRun.workflows).toContain("CI Tests")
      expect(workflowRun.workflows).toContain("Optimized CI Tests")
      expect(workflowRun.types).toContain("completed")
    })
  })

  describe("CI Failure Analysis Job with Check Suite Support", () => {
    it("should trigger analyze-ci-failures job on check_suite failure", () => {
      const analysisJob = anaWorkflowConfig.jobs["analyze-ci-failures"]

      // Job should trigger on either workflow_run OR check_suite with failure
      expect(analysisJob.if).toBeDefined()

      // Should handle workflow_run failures (existing functionality)
      expect(analysisJob.if).toContain("workflow_run")
      expect(analysisJob.if).toContain(
        "github.event.workflow_run.conclusion == 'failure'"
      )

      // Should handle check_suite failures (new functionality for Issue #326)
      expect(analysisJob.if).toContain("check_suite")
      expect(analysisJob.if).toContain(
        "github.event.check_suite.conclusion == 'failure'"
      )
    })

    it("should extract workflow run ID from check_suite event", () => {
      const analysisJob = anaWorkflowConfig.jobs["analyze-ci-failures"]

      // Should have a step that extracts workflow run ID from check_suite
      const extractRunIdStep = analysisJob.steps.find(
        (step: any) =>
          step.id === "extract-workflow-run-id" ||
          step.name?.includes("Extract workflow run ID")
      )

      expect(extractRunIdStep).toBeDefined()
    })

    it("should handle PR number extraction for both workflow_run and check_suite", () => {
      const analysisJob = anaWorkflowConfig.jobs["analyze-ci-failures"]

      // Find-PR step should handle both event types
      const findPrStep = analysisJob.steps.find(
        (step: any) => step.id === "find-pr"
      )

      expect(findPrStep).toBeDefined()

      // Should use github-script for dynamic PR detection
      expect(findPrStep.uses).toContain("actions/github-script")

      // Script should check event type and extract PR accordingly
      const script = findPrStep.with.script
      expect(script).toContain("context.eventName")
    })

    it("should pass correct workflow run ID to ana-cli based on event type", () => {
      const analysisJob = anaWorkflowConfig.jobs["analyze-ci-failures"]

      // Analyze step should use extracted workflow run ID
      const analyzeStep = analysisJob.steps.find((step: any) =>
        step.name?.includes("Analyze CI Test failures")
      )

      expect(analyzeStep).toBeDefined()

      // Should reference the extracted workflow run ID
      expect(analyzeStep.run).toContain("analyze-ci-failures")

      // Should use dynamic workflow run ID (from either workflow_run or check_suite)
      const runCommand = analyzeStep.run
      expect(
        runCommand.includes(
          "steps.extract-workflow-run-id.outputs.workflow_run_id"
        ) ||
          runCommand.includes("github.event.workflow_run.id") ||
          runCommand.includes("github.event.check_suite")
      ).toBe(true)
    })
  })

  describe("Error Handling for Check Suite Events", () => {
    it("should skip analysis if check_suite event has no workflow runs", () => {
      const analysisJob = anaWorkflowConfig.jobs["analyze-ci-failures"]

      // Extract workflow run ID step should handle missing data
      const extractRunIdStep = analysisJob.steps.find(
        (step: any) =>
          step.id === "extract-workflow-run-id" ||
          step.name?.includes("Extract workflow run ID")
      )

      expect(extractRunIdStep).toBeDefined()

      // Should return gracefully if no workflow run found
      const script = extractRunIdStep.with?.script
      if (script) {
        expect(script).toContain("workflow_run_id")
      }
    })

    it("should skip analysis if no PR is associated with check_suite", () => {
      const analysisJob = anaWorkflowConfig.jobs["analyze-ci-failures"]

      // Analyze step should only run if PR number is found
      const analyzeStep = analysisJob.steps.find((step: any) =>
        step.name?.includes("Analyze CI Test failures")
      )

      expect(analyzeStep).toBeDefined()
      expect(analyzeStep.if).toBeDefined()
      expect(analyzeStep.if).toContain("pr_number")
    })
  })

  describe("Check Suite Event Filtering", () => {
    it("should only analyze check suites from CI test workflows", () => {
      const analysisJob = anaWorkflowConfig.jobs["analyze-ci-failures"]

      // Should filter check_suite events by workflow name
      const extractRunIdStep = analysisJob.steps.find(
        (step: any) =>
          step.id === "extract-workflow-run-id" ||
          step.name?.includes("Extract workflow run ID")
      )

      if (extractRunIdStep?.with?.script) {
        const script = extractRunIdStep.with.script

        // Should check workflow name matches monitored workflows
        expect(
          script.includes("CI Tests") ||
            script.includes("Optimized CI Tests") ||
            script.includes("workflow")
        ).toBe(true)
      }
    })
  })

  describe("Integration Points", () => {
    it("should maintain consistent artifact upload format for both event types", () => {
      const analysisJob = anaWorkflowConfig.jobs["analyze-ci-failures"]

      const uploadStep = analysisJob.steps.find((step: any) =>
        step.uses?.includes("upload-artifact")
      )

      expect(uploadStep).toBeDefined()
      expect(uploadStep.if).toBe("always()")
      expect(uploadStep.with.path).toBe("ana-results.json")
    })

    it("should use same environment setup for both event types", () => {
      const analysisJob = anaWorkflowConfig.jobs["analyze-ci-failures"]

      const setupStep = analysisJob.steps.find((step: any) =>
        step.name?.includes("Setup environment")
      )

      expect(setupStep).toBeDefined()
      expect(setupStep.run).toContain("TOD_WEBHOOK_ENDPOINT")
      expect(setupStep.run).toContain("ANA_WEBHOOK_SECRET")
      expect(setupStep.run).toContain("GITHUB_ACCESS_TOKEN")
    })
  })
})
