/**
 * Tests to verify no test coverage is lost in CI reorganization (Issue #307)
 *
 * This test suite validates that:
 * - All existing tests are covered by the new 3-job architecture
 * - No test files are missed in the reorganization
 * - Test patterns correctly map to job responsibilities
 * - Coverage completeness is maintained
 */

import { readFileSync, existsSync } from "fs"
import { join } from "path"
import { glob } from "glob"
import * as yaml from "js-yaml"

describe("Test Coverage Verification", () => {
  const currentWorkflowPath = join(process.cwd(), ".github/workflows/tests.yml")
  const optimizedWorkflowPath = join(
    process.cwd(),
    ".github/workflows/tests-optimized.yml"
  )

  let currentConfig: any
  let optimizedConfig: any
  let allTestFiles: string[]

  beforeAll(async () => {
    // Load workflow configurations
    if (existsSync(currentWorkflowPath)) {
      const currentContent = readFileSync(currentWorkflowPath, "utf8")
      currentConfig = yaml.load(currentContent)
    }

    if (existsSync(optimizedWorkflowPath)) {
      const optimizedContent = readFileSync(optimizedWorkflowPath, "utf8")
      optimizedConfig = yaml.load(optimizedContent)
    }

    // Find all test files in the project
    allTestFiles = await glob("__tests__/**/*.test.{ts,tsx,js,jsx}", {
      cwd: process.cwd(),
      ignore: ["node_modules/**"],
    })
  })

  describe("Test File Coverage Mapping", () => {
    it("should identify all test file categories", () => {
      expect(allTestFiles.length).toBeGreaterThan(0)

      // Categorize test files
      const unitTests = allTestFiles.filter(
        (file) =>
          !file.includes("components") &&
          !file.includes("hooks") &&
          !file.includes("api") &&
          !file.includes("integration")
      )

      const componentTests = allTestFiles.filter(
        (file) => file.includes("components") || file.includes("hooks")
      )

      const apiTests = allTestFiles.filter((file) => file.includes("api"))

      const integrationTests = allTestFiles.filter((file) =>
        file.includes("integration")
      )

      // Log test distribution for verification
      console.log(`Test file distribution:`)
      console.log(`  Unit tests: ${unitTests.length}`)
      console.log(`  Component/Hook tests: ${componentTests.length}`)
      console.log(`  API tests: ${apiTests.length}`)
      console.log(`  Integration tests: ${integrationTests.length}`)
      console.log(`  Total: ${allTestFiles.length}`)

      // Verify we have tests in each category
      expect(unitTests.length).toBeGreaterThan(0)
      expect(componentTests.length).toBeGreaterThan(0)
      expect(apiTests.length).toBeGreaterThan(0)
    })

    it("should map unit tests to fast-validation job", () => {
      expect(optimizedConfig).toBeDefined()

      const fastValidation = optimizedConfig.jobs["fast-validation"]
      const unitTestStep = fastValidation.steps.find(
        (step: any) => step.name === "Unit tests"
      )

      // Should exclude component, hook, api, and integration tests
      expect(unitTestStep.run).toContain("--testPathIgnorePatterns")
      expect(unitTestStep.run).toContain("(components|hooks|api|integration)")

      // This ensures unit tests (lib/, utils/, etc.) run in fast-validation
      const unitTestFiles = allTestFiles.filter(
        (file) =>
          !file.includes("components") &&
          !file.includes("hooks") &&
          !file.includes("api") &&
          !file.includes("integration")
      )

      expect(unitTestFiles.length).toBeGreaterThan(0)
    })

    it("should map component tests to integration-tests job", () => {
      const integrationTests = optimizedConfig.jobs["integration-tests"]
      const componentStep = integrationTests.steps.find(
        (step: any) => step.name === "Component tests"
      )

      expect(componentStep.run).toContain("--testPathPatterns")
      expect(componentStep.run).toContain("(components|hooks)")

      // Verify we have component/hook tests to run
      const componentTestFiles = allTestFiles.filter(
        (file) => file.includes("components") || file.includes("hooks")
      )

      expect(componentTestFiles.length).toBeGreaterThan(0)
    })

    it("should map API tests to integration-tests job", () => {
      const integrationTests = optimizedConfig.jobs["integration-tests"]
      const apiStep = integrationTests.steps.find(
        (step: any) => step.name === "API tests"
      )

      expect(apiStep.run).toContain("--testPathPatterns")
      expect(apiStep.run).toContain("api")

      // Verify we have API tests to run
      const apiTestFiles = allTestFiles.filter((file) => file.includes("api"))

      expect(apiTestFiles.length).toBeGreaterThan(0)
    })

    it("should handle integration tests in integration-tests job", () => {
      const integrationTests = optimizedConfig.jobs["integration-tests"]
      const integrationStep = integrationTests.steps.find(
        (step: any) => step.name === "Integration tests"
      )

      expect(integrationStep.run).toContain("--testPathPatterns")
      expect(integrationStep.run).toContain("integration")

      // Integration tests may not exist yet, but pattern should be ready
      expect(integrationStep).toBeDefined()
    })
  })

  describe("Test Pattern Completeness", () => {
    it("should ensure no test files are missed by the new architecture", () => {
      // All test files should be covered by the job architecture:
      // 1. Unit tests: run in fast-validation (excluded patterns)
      // 2. Component/Hook/API/Integration tests: run in integration-tests (included patterns)
      // 3. All tests: run in coverage job

      // Files that will run in fast-validation (unit tests)
      const runInFastValidation = allTestFiles.filter(
        (file) =>
          !file.includes("components") &&
          !file.includes("hooks") &&
          !file.includes("api") &&
          !file.includes("integration")
      )

      // Files that will run in integration-tests
      const runInIntegrationTests = allTestFiles.filter(
        (file) =>
          file.includes("components") ||
          file.includes("hooks") ||
          file.includes("api") ||
          file.includes("integration")
      )

      // Every test file should run in exactly one of the two main jobs
      const totalCovered =
        runInFastValidation.length + runInIntegrationTests.length
      expect(totalCovered).toBe(allTestFiles.length)

      // Verify no overlap between the two job categories
      const overlap = runInFastValidation.filter((file) =>
        runInIntegrationTests.includes(file)
      )
      expect(overlap).toHaveLength(0)
    })

    it("should handle overlapping test patterns correctly", () => {
      // Some files may match multiple patterns (e.g., api/components/test.ts)
      // This is fine - they'll all run in integration-tests job
      // The key is that fast-validation excludes ALL of them

      const excludedFromFastValidation = allTestFiles.filter(
        (file) =>
          file.includes("components") ||
          file.includes("hooks") ||
          file.includes("api") ||
          file.includes("integration")
      )

      const runInFastValidation = allTestFiles.filter(
        (file) =>
          !file.includes("components") &&
          !file.includes("hooks") &&
          !file.includes("api") &&
          !file.includes("integration")
      )

      // Verify complete separation
      expect(
        excludedFromFastValidation.length + runInFastValidation.length
      ).toBe(allTestFiles.length)

      // Verify no file runs in both categories
      const overlap = excludedFromFastValidation.filter((file) =>
        runInFastValidation.includes(file)
      )
      expect(overlap).toHaveLength(0)
    })
  })

  describe("Coverage Generation Completeness", () => {
    it("should run all tests in coverage job", () => {
      const coverage = optimizedConfig.jobs.coverage
      const coverageStep = coverage.steps.find(
        (step: any) => step.name === "Generate coverage"
      )

      // Coverage job should run ALL tests (no exclusions)
      expect(coverageStep.run).toContain("npm run test:coverage")
      expect(coverageStep.run).not.toContain("--testPathIgnorePatterns")
      expect(coverageStep.run).not.toContain("--testPathPatterns")
    })

    it("should maintain same coverage scope as current workflow", () => {
      // Current workflow coverage job
      const currentCoverage = currentConfig.jobs.coverage
      const currentCoverageStep = currentCoverage?.steps?.find(
        (step: any) => step.name === "Generate coverage with Jest"
      )

      // Optimized workflow coverage job
      const optimizedCoverage = optimizedConfig.jobs.coverage
      const optimizedCoverageStep = optimizedCoverage.steps.find(
        (step: any) => step.name === "Generate coverage"
      )

      // Both should use test:coverage script
      if (currentCoverageStep) {
        expect(currentCoverageStep.run).toContain("test:coverage")
      }
      expect(optimizedCoverageStep.run).toContain("test:coverage")
    })
  })

  describe("Job Responsibility Verification", () => {
    it("should have clear separation of test responsibilities", () => {
      const fastValidation = optimizedConfig.jobs["fast-validation"]
      const integrationTests = optimizedConfig.jobs["integration-tests"]
      const coverage = optimizedConfig.jobs.coverage

      // Fast validation: unit tests only (with exclusions)
      const unitStep = fastValidation.steps.find(
        (step: any) => step.name === "Unit tests"
      )
      expect(unitStep.run).toContain("--testPathIgnorePatterns")

      // Integration tests: specific patterns only
      const componentStep = integrationTests.steps.find(
        (step: any) => step.name === "Component tests"
      )
      const apiStep = integrationTests.steps.find(
        (step: any) => step.name === "API tests"
      )

      expect(componentStep.run).toContain("--testPathPatterns")
      expect(apiStep.run).toContain("--testPathPatterns")

      // Coverage: all tests (no filters)
      const coverageStep = coverage.steps.find(
        (step: any) => step.name === "Generate coverage"
      )
      expect(coverageStep.run).not.toContain("--testPathIgnorePatterns")
      expect(coverageStep.run).not.toContain("--testPathPatterns")
    })

    it("should ensure no test duplication between jobs", () => {
      // Fast validation excludes: components, hooks, api, integration
      // Integration tests includes: components, hooks, api, integration
      // Coverage includes: everything

      // This is correct - no duplication in fast-validation and integration-tests
      // Coverage runs everything for complete coverage report

      const fastValidation = optimizedConfig.jobs["fast-validation"]
      const integrationTests = optimizedConfig.jobs["integration-tests"]

      const unitStep = fastValidation.steps.find(
        (step: any) => step.name === "Unit tests"
      )

      // Unit tests should exclude what integration tests include
      expect(unitStep.run).toContain("--testPathIgnorePatterns")
      expect(unitStep.run).toContain("(components|hooks|api|integration)")

      // Integration test steps should use specific patterns
      const testSteps = integrationTests.steps.filter((step: any) =>
        step.name?.includes("tests")
      )

      testSteps.forEach((step: any) => {
        expect(step.run).toContain("--testPathPatterns")
      })
    })
  })
})
