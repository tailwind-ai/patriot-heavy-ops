/**
 * Tests for optimized CI workflow architecture (Issue #307)
 *
 * This test suite validates the 3-job optimized architecture:
 * 1. fast-validation: TypeScript + ESLint + Unit tests (<1 minute)
 * 2. integration-tests: Component + API + Integration tests (<2 minutes)
 * 3. coverage: Conditional coverage generation (main/release only)
 *
 * Acceptance Criteria:
 * - Reduce from 6+ jobs to 3 optimized jobs
 * - Fast validation completes in <1 minute
 * - Integration tests complete in <2 minutes
 * - Total CI time reduced by 20-30%
 * - Maintain all existing test coverage
 * - Preserve test isolation and reliability
 */

import { readFileSync, existsSync } from "fs"
import { join } from "path"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const yaml = require("js-yaml")

describe("Optimized CI Workflow Architecture", () => {
  const optimizedWorkflowPath = join(process.cwd(), ".github/workflows/tests-optimized.yml")
  let optimizedConfig: any

  beforeAll(() => {
    // This test will initially fail until we create the optimized workflow
    if (existsSync(optimizedWorkflowPath)) {
      const workflowContent = readFileSync(optimizedWorkflowPath, "utf8")
      optimizedConfig = yaml.load(workflowContent)
    }
  })

  describe("3-Job Architecture", () => {
    it("should have exactly 3 main jobs: fast-validation, integration-tests, coverage", () => {
      expect(optimizedConfig).toBeDefined()
      expect(optimizedConfig.jobs).toBeDefined()

      // Should have the 3 core jobs
      expect(optimizedConfig.jobs).toHaveProperty("fast-validation")
      expect(optimizedConfig.jobs).toHaveProperty("integration-tests")
      expect(optimizedConfig.jobs).toHaveProperty("coverage")

      // Count main jobs (excluding status check job)
      const mainJobs = Object.keys(optimizedConfig.jobs).filter(
        job => !job.includes("status") && !job.includes("check")
      )
      expect(mainJobs).toHaveLength(3)
    })

    it("should eliminate job over-parallelization (no unit test sharding)", () => {
      // Should not have matrix strategy for unit tests
      const fastValidation = optimizedConfig.jobs["fast-validation"]
      expect(fastValidation.strategy).toBeUndefined()

      // Should not have separate component-tests and api-tests jobs
      expect(optimizedConfig.jobs["component-tests"]).toBeUndefined()
      expect(optimizedConfig.jobs["api-tests"]).toBeUndefined()
      expect(optimizedConfig.jobs["unit-tests"]).toBeUndefined()
    })
  })

  describe("Fast Validation Job", () => {
    it("should run TypeScript check, ESLint, and unit tests", () => {
      const fastValidation = optimizedConfig.jobs["fast-validation"]
      expect(fastValidation.name).toBe("Fast Validation")

      const steps = fastValidation.steps
      const stepNames = steps.map((step: any) => step.name)

      expect(stepNames).toContain("TypeScript check")
      expect(stepNames).toContain("ESLint check")
      expect(stepNames).toContain("Unit tests")
    })

    it("should run unit tests with proper exclusions for fast execution", () => {
      const fastValidation = optimizedConfig.jobs["fast-validation"]
      const unitTestStep = fastValidation.steps.find(
        (step: any) => step.name === "Unit tests"
      )

      expect(unitTestStep).toBeDefined()
      expect(unitTestStep.run).toContain("--testPathIgnorePatterns")
      expect(unitTestStep.run).toContain("(components|hooks|api|integration)")
      expect(unitTestStep.run).toContain("--maxWorkers=4")
      expect(unitTestStep.run).not.toContain("--coverage")
    })

    it("should target <1 minute execution time", () => {
      const fastValidation = optimizedConfig.jobs["fast-validation"]
      
      // Verify optimizations for speed
      const unitTestStep = fastValidation.steps.find(
        (step: any) => step.name === "Unit tests"
      )
      
      // Should use maxWorkers for parallel execution
      expect(unitTestStep.run).toContain("--maxWorkers=4")
      
      // Should exclude slower test types
      expect(unitTestStep.run).toContain("--testPathIgnorePatterns")
      
      // Should not run coverage (adds overhead)
      expect(unitTestStep.run).not.toContain("--coverage")
    })
  })

  describe("Integration Tests Job", () => {
    it("should run component, API, and integration tests", () => {
      const integrationTests = optimizedConfig.jobs["integration-tests"]
      expect(integrationTests.name).toBe("Integration Tests")
      expect(integrationTests.needs).toContain("fast-validation")

      const steps = integrationTests.steps
      const stepNames = steps.map((step: any) => step.name)

      expect(stepNames).toContain("Component tests")
      expect(stepNames).toContain("API tests")
      expect(stepNames).toContain("Integration tests")
    })

    it("should run component tests with proper patterns", () => {
      const integrationTests = optimizedConfig.jobs["integration-tests"]
      const componentStep = integrationTests.steps.find(
        (step: any) => step.name === "Component tests"
      )

      expect(componentStep).toBeDefined()
      expect(componentStep.run).toContain("--testPathPatterns")
      expect(componentStep.run).toContain("(components|hooks)")
      expect(componentStep.run).toContain("--maxWorkers=4")
    })

    it("should run API tests with proper patterns", () => {
      const integrationTests = optimizedConfig.jobs["integration-tests"]
      const apiStep = integrationTests.steps.find(
        (step: any) => step.name === "API tests"
      )

      expect(apiStep).toBeDefined()
      expect(apiStep.run).toContain("--testPathPatterns")
      expect(apiStep.run).toContain("api")
      expect(apiStep.run).toContain("--maxWorkers=4")
    })

    it("should target <2 minutes execution time", () => {
      const integrationTests = optimizedConfig.jobs["integration-tests"]
      
      // Should depend on fast-validation to run sequentially
      expect(integrationTests.needs).toContain("fast-validation")
      
      // All test steps should use maxWorkers for parallel execution
      const testSteps = integrationTests.steps.filter(
        (step: any) => step.name?.includes("tests")
      )
      
      testSteps.forEach((step: any) => {
        expect(step.run).toContain("--maxWorkers=4")
      })
    })
  })

  describe("Coverage Job", () => {
    it("should be conditional and depend on both validation jobs", () => {
      const coverage = optimizedConfig.jobs.coverage
      expect(coverage.name).toBe("Coverage Analysis")
      
      expect(coverage.needs).toContain("fast-validation")
      expect(coverage.needs).toContain("integration-tests")
      
      // Should be conditional
      expect(coverage.if).toContain("github.ref == 'refs/heads/main'")
      expect(coverage.if).toContain("github.event_name == 'release'")
    })

    it("should generate full coverage report", () => {
      const coverage = optimizedConfig.jobs.coverage
      const coverageStep = coverage.steps.find(
        (step: any) => step.name === "Generate coverage"
      )

      expect(coverageStep).toBeDefined()
      expect(coverageStep.run).toContain("npm run test:coverage")
      expect(coverageStep.run).toContain("--ci")
      expect(coverageStep.run).toContain("--passWithNoTests")
    })
  })

  describe("Job Dependencies and Flow", () => {
    it("should have proper linear job progression", () => {
      // fast-validation should have no dependencies (runs first)
      const fastValidation = optimizedConfig.jobs["fast-validation"]
      expect(fastValidation.needs).toBeUndefined()

      // integration-tests should depend on fast-validation
      const integrationTests = optimizedConfig.jobs["integration-tests"]
      expect(integrationTests.needs).toEqual(["fast-validation"])

      // coverage should depend on both
      const coverage = optimizedConfig.jobs.coverage
      expect(coverage.needs).toEqual(["fast-validation", "integration-tests"])
    })

    it("should eliminate complex parallel dependencies", () => {
      // No job should have more than 2 dependencies
      Object.values(optimizedConfig.jobs).forEach((job: any) => {
        if (job.needs) {
          expect(Array.isArray(job.needs) ? job.needs.length : 1).toBeLessThanOrEqual(2)
        }
      })
    })
  })

  describe("Performance Optimization", () => {
    it("should reduce setup overhead with fewer jobs", () => {
      // Should have exactly 3 main jobs (vs 6+ in current architecture)
      const mainJobs = Object.keys(optimizedConfig.jobs).filter(
        job => !job.includes("status") && !job.includes("check")
      )
      expect(mainJobs).toHaveLength(3)
    })

    it("should use consistent Node.js setup across all jobs", () => {
      Object.values(optimizedConfig.jobs).forEach((job: any) => {
        const nodeSetup = job.steps?.find(
          (step: any) => step.uses?.includes("setup-node")
        )
        
        if (nodeSetup) {
          expect(nodeSetup.with["node-version"]).toBe("20")
          expect(nodeSetup.with.cache).toBe("npm")
        }
      })
    })

    it("should use npm ci for consistent dependency installation", () => {
      Object.values(optimizedConfig.jobs).forEach((job: any) => {
        const installStep = job.steps?.find(
          (step: any) => step.name === "Install dependencies"
        )
        
        if (installStep) {
          expect(installStep.run).toBe("npm ci")
        }
      })
    })
  })
})
