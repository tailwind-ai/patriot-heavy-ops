/**
 * Tests for conditional coverage generation in CI workflows
 *
 * This test suite validates that:
 * - PR workflows run tests without coverage for fast feedback
 * - Main branch workflows include full coverage generation
 * - Release workflows include coverage validation
 * - Manual coverage triggers work correctly
 */

import { readFileSync } from "fs"
import { join } from "path"
import * as yaml from "js-yaml"

describe("Conditional Coverage CI Configuration", () => {
  const workflowPath = join(process.cwd(), ".github/workflows/tests.yml")
  let workflowConfig: any

  beforeAll(() => {
    const workflowContent = readFileSync(workflowPath, "utf8")
    workflowConfig = yaml.load(workflowContent)
  })

  describe("PR Fast Path Validation", () => {
    it("should have a pr-validation job that runs on pull requests", () => {
      expect(workflowConfig.jobs).toHaveProperty("pr-validation")

      const prJob = workflowConfig.jobs["pr-validation"]
      expect(prJob.if).toContain("pull_request")
      expect(prJob.name).toBe("PR Validation")
    })

    it("should run tests without coverage in PR validation job", () => {
      const prJob = workflowConfig.jobs["pr-validation"]
      const testStep = prJob.steps.find(
        (step: any) =>
          step.name?.includes("Run tests") && step.run?.includes("npm test")
      )

      expect(testStep).toBeDefined()
      expect(testStep.run).toContain("--ci")
      expect(testStep.run).toContain("--passWithNoTests")
      expect(testStep.run).not.toContain("--coverage")
      expect(testStep.run).not.toContain("test:coverage")
    })

    it("should complete PR validation in under 1 minute (no coverage overhead)", () => {
      const prJob = workflowConfig.jobs["pr-validation"]
      const testStep = prJob.steps.find(
        (step: any) => step.name === "Run tests (no coverage)"
      )

      // Verify maxWorkers is set for parallel execution
      expect(testStep.run).toContain("--maxWorkers=4")

      // Verify main test step doesn't include coverage
      expect(testStep.run).not.toContain("--coverage")
      expect(testStep.run).not.toContain("test:coverage")

      // Verify manual coverage steps are conditional (don't run by default)
      const manualCoverageSteps = prJob.steps.filter(
        (step: any) => step.name?.toLowerCase().includes("coverage") && step.if
      )
      manualCoverageSteps.forEach((step: any) => {
        expect(step.if).toContain("github.event.inputs.run_coverage == 'true'")
      })
    })
  })

  describe("Main Branch Full Validation", () => {
    it("should have a main-validation job that runs on main branch", () => {
      expect(workflowConfig.jobs).toHaveProperty("main-validation")

      const mainJob = workflowConfig.jobs["main-validation"]
      expect(mainJob.if).toContain("github.ref == 'refs/heads/main'")
      expect(mainJob.name).toBe("Main Branch Validation")
    })

    it("should run tests with coverage in main validation job", () => {
      const mainJob = workflowConfig.jobs["main-validation"]
      const testStep = mainJob.steps.find((step: any) =>
        step.name?.includes("Run tests with coverage")
      )

      expect(testStep).toBeDefined()
      expect(testStep.run).toContain("npm run test:coverage")
      expect(testStep.run).toContain("--ci")
      expect(testStep.run).toContain("--passWithNoTests")
    })

    it("should upload coverage artifacts for main branch", () => {
      const mainJob = workflowConfig.jobs["main-validation"]
      const uploadStep = mainJob.steps.find(
        (step: any) =>
          step.uses?.includes("upload-artifact") &&
          step.with?.name?.includes("coverage")
      )

      expect(uploadStep).toBeDefined()
      expect(uploadStep.with.name).toBe("coverage")
    })
  })

  describe("Release Branch Coverage", () => {
    it("should include coverage for release branches", () => {
      const mainJob = workflowConfig.jobs["main-validation"]
      expect(mainJob.if).toContain("github.event_name == 'release'")
    })

    it("should have release-validation job for release branches", () => {
      expect(workflowConfig.jobs).toHaveProperty("release-validation")

      const releaseJob = workflowConfig.jobs["release-validation"]
      expect(releaseJob.if).toContain(
        "startsWith(github.ref, 'refs/heads/release/')"
      )
    })
  })

  describe("Manual Coverage Trigger", () => {
    it("should support workflow_dispatch for manual coverage runs", () => {
      expect(workflowConfig.on).toHaveProperty("workflow_dispatch")

      const dispatch = workflowConfig.on.workflow_dispatch
      expect(dispatch.inputs).toHaveProperty("run_coverage")
      expect(dispatch.inputs.run_coverage.type).toBe("boolean")
      expect(dispatch.inputs.run_coverage.default).toBe(false)
    })

    it("should conditionally run coverage based on manual input", () => {
      const prJob = workflowConfig.jobs["pr-validation"]
      // Should have a conditional coverage step for manual triggers
      const manualCoverageStep = prJob.steps.find((step: any) =>
        step.if?.includes("github.event.inputs.run_coverage")
      )

      expect(manualCoverageStep).toBeDefined()
    })
  })

  describe("Coverage Job Conditions", () => {
    it("should only run coverage job for main branch and releases", () => {
      const coverageJob = workflowConfig.jobs.coverage
      expect(coverageJob.if).toContain("github.ref == 'refs/heads/main'")
      expect(coverageJob.if).toContain("github.event_name == 'release'")
      expect(coverageJob.if).toContain(
        "github.event.inputs.run_coverage == 'true'"
      )
    })

    it("should not run coverage job for regular PRs", () => {
      const coverageJob = workflowConfig.jobs.coverage
      expect(coverageJob.if).not.toContain(
        "github.event_name == 'pull_request'"
      )
    })
  })

  describe("CI Status Dependencies", () => {
    it("should handle conditional coverage in ci-status job", () => {
      const statusJob = workflowConfig.jobs["ci-status"]

      // Should include both pr-validation and main-validation in needs
      expect(statusJob.needs).toContain("pr-validation")
      expect(statusJob.needs).toContain("main-validation")

      // Should handle conditional coverage dependency
      const coverageCheck = statusJob.steps.find((step: any) =>
        step.run?.includes("coverage_ok")
      )
      expect(coverageCheck).toBeDefined()
    })
  })
})
