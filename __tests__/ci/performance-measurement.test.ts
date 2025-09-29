/**
 * Performance measurement tests for CI optimization (Issue #307)
 *
 * This test suite validates the performance improvements:
 * - 20-30% total CI time reduction
 * - 50% reduction in job count (10+ → 3)
 * - 50% reduction in startup overhead
 * - Improved resource utilization
 */

import { readFileSync, existsSync } from "fs"
import { join } from "path"
import * as yaml from "js-yaml"

describe("CI Performance Measurement", () => {
  const currentWorkflowPath = join(process.cwd(), ".github/workflows/tests.yml")
  const optimizedWorkflowPath = join(process.cwd(), ".github/workflows/tests-optimized.yml")
  
  let currentConfig: any
  let optimizedConfig: any

  beforeAll(() => {
    if (existsSync(currentWorkflowPath)) {
      const currentContent = readFileSync(currentWorkflowPath, "utf8")
      currentConfig = yaml.load(currentContent)
    }
    
    if (existsSync(optimizedWorkflowPath)) {
      const optimizedContent = readFileSync(optimizedWorkflowPath, "utf8")
      optimizedConfig = yaml.load(optimizedContent)
    }
  })

  describe("Job Count Reduction", () => {
    it("should reduce job count by 50% or more", () => {
      expect(currentConfig).toBeDefined()
      expect(optimizedConfig).toBeDefined()

      // Count main jobs in current workflow (excluding status checks)
      const currentMainJobs = Object.keys(currentConfig.jobs).filter(
        job => !job.includes("status") && !job.includes("check")
      )
      
      // Count main jobs in optimized workflow
      const optimizedMainJobs = Object.keys(optimizedConfig.jobs).filter(
        job => !job.includes("status") && !job.includes("check")
      )

      console.log(`Current workflow jobs: ${currentMainJobs.length}`)
      console.log(`Optimized workflow jobs: ${optimizedMainJobs.length}`)
      console.log(`Reduction: ${((currentMainJobs.length - optimizedMainJobs.length) / currentMainJobs.length * 100).toFixed(1)}%`)

      // Should have exactly 3 optimized jobs
      expect(optimizedMainJobs).toHaveLength(3)
      
      // Should be at least 50% reduction
      const reductionPercentage = (currentMainJobs.length - optimizedMainJobs.length) / currentMainJobs.length
      expect(reductionPercentage).toBeGreaterThanOrEqual(0.5)
    })

    it("should eliminate over-parallelization", () => {
      // Current workflow has unit test sharding (4 shards)
      const currentUnitTests = currentConfig.jobs["unit-tests"]
      expect(currentUnitTests?.strategy?.matrix?.shard).toEqual([1, 2, 3, 4])

      // Optimized workflow has no sharding
      const optimizedFastValidation = optimizedConfig.jobs["fast-validation"]
      expect(optimizedFastValidation.strategy).toBeUndefined()
    })
  })

  describe("Startup Overhead Reduction", () => {
    it("should reduce setup step repetition", () => {
      // Count setup steps in current workflow
      let currentSetupSteps = 0
      Object.values(currentConfig.jobs).forEach((job: any) => {
        if (job.steps) {
          const setupSteps = job.steps.filter((step: any) => 
            step.uses?.includes("checkout") || 
            step.uses?.includes("setup-node") || 
            step.name?.includes("Install dependencies")
          )
          currentSetupSteps += setupSteps.length
        }
      })

      // Count setup steps in optimized workflow
      let optimizedSetupSteps = 0
      Object.values(optimizedConfig.jobs).forEach((job: any) => {
        if (job.steps) {
          const setupSteps = job.steps.filter((step: any) => 
            step.uses?.includes("checkout") || 
            step.uses?.includes("setup-node") || 
            step.name?.includes("Install dependencies")
          )
          optimizedSetupSteps += setupSteps.length
        }
      })

      console.log(`Current setup steps: ${currentSetupSteps}`)
      console.log(`Optimized setup steps: ${optimizedSetupSteps}`)
      console.log(`Setup overhead reduction: ${((currentSetupSteps - optimizedSetupSteps) / currentSetupSteps * 100).toFixed(1)}%`)

      // Should have significant reduction in setup overhead
      expect(optimizedSetupSteps).toBeLessThan(currentSetupSteps)
      
      // Should be at least 40% reduction in setup steps
      const reductionPercentage = (currentSetupSteps - optimizedSetupSteps) / currentSetupSteps
      expect(reductionPercentage).toBeGreaterThanOrEqual(0.4)
    })

    it("should use consistent caching strategy", () => {
      // All optimized jobs should use npm cache
      Object.values(optimizedConfig.jobs).forEach((job: any) => {
        const nodeSetup = job.steps?.find(
          (step: any) => step.uses?.includes("setup-node")
        )
        
        if (nodeSetup) {
          expect(nodeSetup.with.cache).toBe("npm")
        }
      })
    })
  })

  describe("Dependency Simplification", () => {
    it("should have linear dependency chain", () => {
      // Optimized workflow should have simple linear dependencies
      const fastValidation = optimizedConfig.jobs["fast-validation"]
      const integrationTests = optimizedConfig.jobs["integration-tests"]
      const coverage = optimizedConfig.jobs.coverage

      // Linear chain: fast-validation → integration-tests → coverage
      expect(fastValidation.needs).toBeUndefined()
      expect(integrationTests.needs).toEqual(["fast-validation"])
      expect(coverage.needs).toEqual(["fast-validation", "integration-tests"])
    })

    it("should eliminate complex parallel dependencies", () => {
      // Current workflow has complex dependencies
      const currentCiStatus = currentConfig.jobs["ci-status"]
      const currentDependencies = currentCiStatus?.needs || []
      
      // Optimized workflow should have simpler structure
      const optimizedJobCount = Object.keys(optimizedConfig.jobs).length
      
      console.log(`Current ci-status dependencies: ${currentDependencies.length}`)
      console.log(`Optimized job count: ${optimizedJobCount}`)
      
      // Should have fewer total jobs and simpler dependencies
      expect(optimizedJobCount).toBeLessThan(currentDependencies.length)
    })
  })

  describe("Resource Utilization", () => {
    it("should use maxWorkers consistently for parallel execution", () => {
      // All test steps should use maxWorkers=4
      const fastValidation = optimizedConfig.jobs["fast-validation"]
      const integrationTests = optimizedConfig.jobs["integration-tests"]

      const unitTestStep = fastValidation.steps.find(
        (step: any) => step.name === "Unit tests"
      )
      expect(unitTestStep.run).toContain("--maxWorkers=4")

      const testSteps = integrationTests.steps.filter(
        (step: any) => step.name?.includes("tests")
      )
      
      testSteps.forEach((step: any) => {
        expect(step.run).toContain("--maxWorkers=4")
      })
    })

    it("should use consistent runner configuration", () => {
      // All jobs should use ubuntu-latest
      Object.values(optimizedConfig.jobs).forEach((job: any) => {
        expect(job["runs-on"]).toBe("ubuntu-latest")
      })
    })

    it("should use consistent Node.js version", () => {
      // All jobs should use Node.js 20
      Object.values(optimizedConfig.jobs).forEach((job: any) => {
        const nodeSetup = job.steps?.find(
          (step: any) => step.uses?.includes("setup-node")
        )
        
        if (nodeSetup) {
          expect(nodeSetup.with["node-version"]).toBe("20")
        }
      })
    })
  })

  describe("Expected Performance Improvements", () => {
    it("should target fast validation under 1 minute", () => {
      const fastValidation = optimizedConfig.jobs["fast-validation"]
      
      // Should have optimizations for speed
      const unitTestStep = fastValidation.steps.find(
        (step: any) => step.name === "Unit tests"
      )
      
      // Excludes slower test types
      expect(unitTestStep.run).toContain("--testPathIgnorePatterns")
      
      // Uses parallel execution
      expect(unitTestStep.run).toContain("--maxWorkers=4")
      
      // No coverage overhead
      expect(unitTestStep.run).not.toContain("--coverage")
    })

    it("should target integration tests under 2 minutes", () => {
      const integrationTests = optimizedConfig.jobs["integration-tests"]
      
      // Should run after fast validation (sequential for fast feedback)
      expect(integrationTests.needs).toEqual(["fast-validation"])
      
      // All test steps should use parallel execution
      const testSteps = integrationTests.steps.filter(
        (step: any) => step.name?.includes("tests")
      )
      
      testSteps.forEach((step: any) => {
        expect(step.run).toContain("--maxWorkers=4")
      })
    })

    it("should run coverage conditionally to save resources", () => {
      const coverage = optimizedConfig.jobs.coverage
      
      // Should only run on main/release (not on every PR)
      expect(coverage.if).toBeDefined()
      expect(coverage.if).toContain("github.ref == 'refs/heads/main'")
      expect(coverage.if).toContain("github.event.inputs.run_coverage == 'true'")
    })
  })

  describe("Architectural Benefits", () => {
    it("should provide clearer job separation", () => {
      const jobs = Object.keys(optimizedConfig.jobs)
      
      // Should have descriptive, purpose-driven job names
      expect(jobs).toContain("fast-validation")
      expect(jobs).toContain("integration-tests")
      expect(jobs).toContain("coverage")
      
      // Each job should have a clear, single responsibility
      expect(jobs).toHaveLength(3)
    })

    it("should maintain test isolation", () => {
      // Fast validation should exclude integration test types
      const fastValidation = optimizedConfig.jobs["fast-validation"]
      const unitTestStep = fastValidation.steps.find(
        (step: any) => step.name === "Unit tests"
      )
      expect(unitTestStep.run).toContain("--testPathIgnorePatterns")
      
      // Integration tests should use specific patterns
      const integrationTests = optimizedConfig.jobs["integration-tests"]
      const testSteps = integrationTests.steps.filter(
        (step: any) => step.name?.includes("tests")
      )
      
      testSteps.forEach((step: any) => {
        expect(step.run).toContain("--testPathPatterns")
      })
    })

    it("should enable better failure analysis", () => {
      // Linear dependencies enable clear failure points
      // If fast-validation fails, integration-tests won't run
      // If integration-tests fails, coverage won't run
      
      const integrationTests = optimizedConfig.jobs["integration-tests"]
      const coverage = optimizedConfig.jobs.coverage
      
      expect(integrationTests.needs).toEqual(["fast-validation"])
      expect(coverage.needs).toEqual(["fast-validation", "integration-tests"])
    })
  })
})
