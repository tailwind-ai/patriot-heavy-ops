/**
 * Tests for Ana workflow monitoring configuration (Issue #303)
 *
 * This test suite validates that:
 * - Ana workflow monitors both "CI Tests" and "Optimized CI Tests" workflows
 * - Ana triggers correctly for both workflow types
 * - Backward compatibility is maintained with existing workflow monitoring
 */

import { readFileSync } from "fs"
import { join } from "path"

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const yaml = require("js-yaml")

describe("Ana Workflow Monitoring Configuration (Issue #303)", () => {
  const anaWorkflowPath = join(process.cwd(), ".github/workflows/ana.yml")
  let anaWorkflowConfig: any

  beforeAll(() => {
    const anaWorkflowContent = readFileSync(anaWorkflowPath, "utf8")
    anaWorkflowConfig = yaml.load(anaWorkflowContent)
  })

  describe("Workflow Monitoring Configuration", () => {
    it("should monitor both CI Tests and Optimized CI Tests workflows", () => {
      expect(anaWorkflowConfig.on).toHaveProperty("workflow_run")
      
      const workflowRun = anaWorkflowConfig.on.workflow_run
      expect(workflowRun).toHaveProperty("workflows")
      
      // CRITICAL: Ana must monitor both workflow names (Issue #303 requirement)
      const monitoredWorkflows = workflowRun.workflows
      expect(monitoredWorkflows).toContain("CI Tests")
      expect(monitoredWorkflows).toContain("Optimized CI Tests")
      
      // Should be an array with exactly these two workflows
      expect(Array.isArray(monitoredWorkflows)).toBe(true)
      expect(monitoredWorkflows).toHaveLength(2)
    })

    it("should trigger on workflow completion", () => {
      const workflowRun = anaWorkflowConfig.on.workflow_run
      expect(workflowRun.types).toContain("completed")
    })

    it("should maintain backward compatibility with existing triggers", () => {
      // Should still monitor issue comments for Cursor Bugbot
      expect(anaWorkflowConfig.on).toHaveProperty("issue_comment")
      expect(anaWorkflowConfig.on.issue_comment.types).toContain("created")
      
      // Should still monitor pull request reviews
      expect(anaWorkflowConfig.on).toHaveProperty("pull_request_review")
      expect(anaWorkflowConfig.on.pull_request_review.types).toContain("submitted")
    })
  })

  describe("CI Failure Analysis Job", () => {
    it("should have analyze-ci-failures job that triggers on workflow failure", () => {
      expect(anaWorkflowConfig.jobs).toHaveProperty("analyze-ci-failures")
      
      const analysisJob = anaWorkflowConfig.jobs["analyze-ci-failures"]
      expect(analysisJob.if).toContain("github.event_name == 'workflow_run'")
      expect(analysisJob.if).toContain("github.event.workflow_run.conclusion == 'failure'")
    })

    it("should run on ubuntu-latest", () => {
      const analysisJob = anaWorkflowConfig.jobs["analyze-ci-failures"]
      expect(analysisJob["runs-on"]).toBe("ubuntu-latest")
    })

    it("should have proper permissions for GitHub API access", () => {
      expect(anaWorkflowConfig.permissions).toHaveProperty("actions", "read")
      expect(anaWorkflowConfig.permissions).toHaveProperty("contents", "read")
      expect(anaWorkflowConfig.permissions).toHaveProperty("issues", "write")
      expect(anaWorkflowConfig.permissions).toHaveProperty("pull-requests", "write")
    })
  })

  describe("Workflow Name Detection", () => {
    it("should be able to detect which workflow triggered the analysis", () => {
      const analysisJob = anaWorkflowConfig.jobs["analyze-ci-failures"]
      
      // Should have a step that logs event information for debugging (Issue #326)
      const analysisStep = analysisJob.steps.find((step: any) =>
        step.name?.includes("Analyze CI") && step.run?.includes("github.event_name")
      )
      
      expect(analysisStep).toBeDefined()
      expect(analysisStep.run).toContain("${{ github.event_name }}")
    })

    it("should pass workflow information to ana-cli.ts", () => {
      const analysisJob = anaWorkflowConfig.jobs["analyze-ci-failures"]
      
      // Should call ana-cli.ts with workflow run ID and PR number (Issue #326)
      const cliStep = analysisJob.steps.find((step: any) =>
        step.run?.includes("npx tsx scripts/ana-cli.ts analyze-ci-failures")
      )
      
      expect(cliStep).toBeDefined()
      // Should use extracted workflow run ID (supports both workflow_run and check_suite events)
      expect(cliStep.run).toContain("${{ steps.extract-workflow-run-id.outputs.workflow_run_id }}")
      expect(cliStep.run).toContain("${{ steps.find-pr.outputs.pr_number }}")
    })
  })

  describe("Integration with Tod Webhook", () => {
    it("should have webhook configuration for Tod integration", () => {
      const analysisJob = anaWorkflowConfig.jobs["analyze-ci-failures"]
      
      // Should set up webhook endpoint environment variable
      const setupStep = analysisJob.steps.find((step: any) =>
        step.name?.includes("Setup environment")
      )
      
      expect(setupStep).toBeDefined()
      expect(setupStep.run).toContain("TOD_WEBHOOK_ENDPOINT")
      expect(setupStep.run).toContain("ANA_WEBHOOK_SECRET")
    })

    it("should upload analysis results as artifacts", () => {
      const analysisJob = anaWorkflowConfig.jobs["analyze-ci-failures"]
      
      const uploadStep = analysisJob.steps.find((step: any) =>
        step.uses?.includes("upload-artifact") && 
        step.with?.name?.includes("ana-ci-analysis")
      )
      
      expect(uploadStep).toBeDefined()
      expect(uploadStep.with.path).toBe("ana-results.json")
      expect(uploadStep.with["retention-days"]).toBe(7)
    })
  })
})
