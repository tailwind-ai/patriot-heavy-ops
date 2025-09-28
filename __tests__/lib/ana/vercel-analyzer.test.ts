/**
 * Unit tests for Ana Vercel Deployment Failure Analysis
 * Tests Vercel-specific failure analysis logic following Platform Mode standards
 */

import { AnaAnalyzer } from "@/lib/ana/ana-analyzer"
import {
  getVercelLogContent,
  getExpectedVercelResults,
  VERCEL_ERROR_PATTERNS,
} from "./fixtures/vercel-failure-logs"

describe("AnaAnalyzer - Vercel Deployment Analysis", () => {
  let analyzer: AnaAnalyzer

  beforeEach(() => {
    analyzer = new AnaAnalyzer()
    jest.clearAllMocks()
  })

  describe("analyzeVercelDeploymentLogs", () => {
    it("should parse build timeout errors correctly", () => {
      const logContent = getVercelLogContent("BUILD_TIMEOUT")
      const result = analyzer.analyzeVercelDeploymentLogs(
        "Vercel Deploy",
        logContent
      )
      const expected = getExpectedVercelResults("BUILD_TIMEOUT")

      expect(result.issues).toHaveLength(expected.issueCount)
      expect(result.issues[0]).toMatchObject({
        description: expect.stringContaining("build timed out"),
        priority: expected.priorities[0],
        rootCause: expected.rootCauses[0],
        suggestedFix: (expected as any).suggestedFixes?.[0],
      })
    })

    it("should parse memory limit exceeded errors correctly", () => {
      const logContent = getVercelLogContent("MEMORY_LIMIT_EXCEEDED")
      const result = analyzer.analyzeVercelDeploymentLogs(
        "Vercel Deploy",
        logContent
      )
      const expected = getExpectedVercelResults("MEMORY_LIMIT_EXCEEDED")

      expect(result.issues).toHaveLength(expected.issueCount)
      expect(result.issues[0]).toMatchObject({
        description: expect.stringContaining("memory"),
        priority: expected.priorities[0],
        rootCause: expected.rootCauses[0],
        suggestedFix: (expected as any).suggestedFixes?.[0],
      })
    })

    it("should parse missing environment variable errors correctly", () => {
      const logContent = getVercelLogContent("ENVIRONMENT_VARIABLE_MISSING")
      const result = analyzer.analyzeVercelDeploymentLogs(
        "Vercel Deploy",
        logContent
      )
      const expected = getExpectedVercelResults("ENVIRONMENT_VARIABLE_MISSING")

      expect(result.issues).toHaveLength(expected.issueCount)
      expect(result.issues[0]).toMatchObject({
        description: expect.stringContaining("DATABASE_URL"),
        priority: expected.priorities[0],
        rootCause: expected.rootCauses[0],
        suggestedFix: (expected as any).suggestedFixes?.[0],
      })
    })

    it("should parse dependency installation failures correctly", () => {
      const logContent = getVercelLogContent("DEPENDENCY_INSTALLATION_FAILED")
      const result = analyzer.analyzeVercelDeploymentLogs(
        "Vercel Deploy",
        logContent
      )
      const expected = getExpectedVercelResults(
        "DEPENDENCY_INSTALLATION_FAILED"
      )

      expect(result.issues).toHaveLength(expected.issueCount)
      expect(result.issues[0]).toMatchObject({
        description: expect.stringContaining("dependency"),
        priority: expected.priorities[0],
        rootCause: expected.rootCauses[0],
        suggestedFix: (expected as any).suggestedFixes?.[0],
      })
    })

    it("should parse Next.js build errors correctly", () => {
      const logContent = getVercelLogContent("NEXT_JS_BUILD_ERROR")
      const result = analyzer.analyzeVercelDeploymentLogs(
        "Vercel Deploy",
        logContent
      )
      const expected = getExpectedVercelResults("NEXT_JS_BUILD_ERROR")

      expect(result.issues).toHaveLength(expected.issueCount)
      expect(result.issues[0]).toMatchObject({
        description: expect.stringContaining("MissingComponent"),
        priority: expected.priorities[0],
        rootCause: expected.rootCauses[0],
        suggestedFix: (expected as any).suggestedFixes?.[0],
      })
    })

    it("should parse function size limit errors correctly", () => {
      const logContent = getVercelLogContent("FUNCTION_SIZE_LIMIT")
      const result = analyzer.analyzeVercelDeploymentLogs(
        "Vercel Deploy",
        logContent
      )
      const expected = getExpectedVercelResults("FUNCTION_SIZE_LIMIT")

      expect(result.issues).toHaveLength(expected.issueCount)
      expect(result.issues[0]).toMatchObject({
        description: expect.stringContaining("52.1 MB"),
        priority: expected.priorities[0],
        rootCause: expected.rootCauses[0],
        suggestedFix: (expected as any).suggestedFixes?.[0],
      })
    })

    it("should parse static generation errors correctly", () => {
      const logContent = getVercelLogContent("STATIC_GENERATION_ERROR")
      const result = analyzer.analyzeVercelDeploymentLogs(
        "Vercel Deploy",
        logContent
      )
      const expected = getExpectedVercelResults("STATIC_GENERATION_ERROR")

      expect(result.issues).toHaveLength(expected.issueCount)
      expect(result.issues[0]).toMatchObject({
        description: expect.stringContaining("/products/[id]"),
        priority: expected.priorities[0],
        rootCause: expected.rootCauses[0],
        suggestedFix: (expected as any).suggestedFixes?.[0],
      })
    })

    it("should parse Prisma migration errors correctly", () => {
      const logContent = getVercelLogContent("PRISMA_MIGRATION_ERROR")
      const result = analyzer.analyzeVercelDeploymentLogs(
        "Vercel Deploy",
        logContent
      )
      const expected = getExpectedVercelResults("PRISMA_MIGRATION_ERROR")

      expect(result.issues).toHaveLength(expected.issueCount)
      expect(result.issues[0]).toMatchObject({
        description: expect.stringContaining("database"),
        priority: expected.priorities[0],
        rootCause: expected.rootCauses[0],
        suggestedFix: (expected as any).suggestedFixes?.[0],
      })
    })

    it("should parse TypeScript build errors correctly", () => {
      const logContent = getVercelLogContent("TYPESCRIPT_BUILD_ERROR")
      const result = analyzer.analyzeVercelDeploymentLogs(
        "Vercel Deploy",
        logContent
      )
      const expected = getExpectedVercelResults("TYPESCRIPT_BUILD_ERROR")

      expect(result.issues).toHaveLength(expected.issueCount)
      expect(result.issues[0]).toMatchObject({
        description: expect.stringContaining("pages/api/users.ts"),
        priority: expected.priorities[0],
        files: (expected as any).files?.[0] ? [(expected as any).files[0]] : undefined,
        lineNumbers: (expected as any).lineNumbers?.[0] ? [(expected as any).lineNumbers[0]] : undefined,
        rootCause: expected.rootCauses[0],
      })
    })

    it("should parse Edge Runtime errors correctly", () => {
      const logContent = getVercelLogContent("EDGE_RUNTIME_ERROR")
      const result = analyzer.analyzeVercelDeploymentLogs(
        "Vercel Deploy",
        logContent
      )
      const expected = getExpectedVercelResults("EDGE_RUNTIME_ERROR")

      expect(result.issues).toHaveLength(expected.issueCount)
      expect(result.issues[0]).toMatchObject({
        description: expect.stringContaining("Edge Runtime"),
        priority: expected.priorities[0],
        files: (expected as any).files?.[0] ? [(expected as any).files[0]] : undefined,
        rootCause: expected.rootCauses[0],
        suggestedFix: (expected as any).suggestedFixes?.[0],
      })
    })

    it("should handle mixed Vercel errors correctly", () => {
      const logContent = getVercelLogContent("MIXED_VERCEL_ERRORS")
      const result = analyzer.analyzeVercelDeploymentLogs(
        "Vercel Deploy",
        logContent
      )
      const expected = getExpectedVercelResults("MIXED_VERCEL_ERRORS")

      expect(result.issues).toHaveLength(expected.issueCount)
      expect(result.issues.map((issue) => issue.priority)).toEqual(
        expected.priorities
      )
      expect(result.issues.map((issue) => issue.rootCause)).toEqual(
        expected.rootCauses
      )
    })
  })

  describe("Vercel Error Pattern Recognition", () => {
    it("should recognize build timeout patterns", () => {
      const logContent = "Error: Build timed out after 10 minutes"
      expect(VERCEL_ERROR_PATTERNS.BUILD_TIMEOUT.test(logContent)).toBe(true)
    })

    it("should recognize memory limit patterns", () => {
      const logContent = "JavaScript heap out of memory"
      expect(VERCEL_ERROR_PATTERNS.MEMORY_LIMIT.test(logContent)).toBe(true)
    })

    it("should recognize environment variable patterns", () => {
      const logContent =
        "Environment variable DATABASE_URL is required but not set"
      expect(VERCEL_ERROR_PATTERNS.ENV_VAR_MISSING.test(logContent)).toBe(true)
    })

    it("should recognize dependency error patterns", () => {
      const logContent = "npm ERR! ERESOLVE unable to resolve dependency tree"
      expect(VERCEL_ERROR_PATTERNS.DEPENDENCY_ERROR.test(logContent)).toBe(true)
    })

    it("should recognize function size limit patterns", () => {
      const logContent =
        'Serverless Function "api/large.js" exceeds the maximum size limit'
      expect(VERCEL_ERROR_PATTERNS.FUNCTION_SIZE_LIMIT.test(logContent)).toBe(
        true
      )
    })

    it("should recognize static generation patterns", () => {
      const logContent = 'Error occurred prerendering page "/products/[id]"'
      expect(VERCEL_ERROR_PATTERNS.STATIC_GENERATION.test(logContent)).toBe(
        true
      )
    })

    it("should recognize TypeScript error patterns", () => {
      const logContent = "pages/api/users.ts:45:12 - error TS2322:"
      expect(VERCEL_ERROR_PATTERNS.TYPESCRIPT_ERROR.test(logContent)).toBe(true)
    })

    it("should recognize Edge Runtime patterns", () => {
      const logContent = "The Edge Runtime does not support Node.js"
      expect(VERCEL_ERROR_PATTERNS.EDGE_RUNTIME.test(logContent)).toBe(true)
    })
  })

  describe("Vercel Priority Calculation", () => {
    it("should assign critical priority to build timeouts", () => {
      const priority = analyzer.calculateVercelPriority("build timed out")
      expect(priority).toBe("critical")
    })

    it("should assign critical priority to memory limit exceeded", () => {
      const priority = analyzer.calculateVercelPriority("heap out of memory")
      expect(priority).toBe("critical")
    })

    it("should assign high priority to environment variable issues", () => {
      const priority = analyzer.calculateVercelPriority(
        "environment variable required"
      )
      expect(priority).toBe("high")
    })

    it("should assign high priority to dependency issues", () => {
      const priority = analyzer.calculateVercelPriority("npm ERR!")
      expect(priority).toBe("high")
    })

    it("should assign high priority to function size limits", () => {
      const priority = analyzer.calculateVercelPriority(
        "exceeds the maximum size limit"
      )
      expect(priority).toBe("high")
    })

    it("should assign medium priority to unknown Vercel errors", () => {
      const priority = analyzer.calculateVercelPriority("unknown vercel error")
      expect(priority).toBe("medium")
    })
  })

  describe("Vercel Suggested Fix Generation", () => {
    it("should generate specific fix for build timeouts", () => {
      const fix = analyzer.generateVercelSuggestedFix(
        "build timed out after 10 minutes"
      )
      expect(fix).toBe(
        "Optimize build process to complete within time limit, consider build caching"
      )
    })

    it("should generate specific fix for memory issues", () => {
      const fix = analyzer.generateVercelSuggestedFix(
        "JavaScript heap out of memory"
      )
      expect(fix).toBe(
        "Reduce memory usage during build, optimize large dependencies"
      )
    })

    it("should generate specific fix for environment variables", () => {
      const fix = analyzer.generateVercelSuggestedFix(
        "Environment variable DATABASE_URL is required"
      )
      expect(fix).toBe(
        "Add DATABASE_URL environment variable in Vercel dashboard"
      )
    })

    it("should generate specific fix for dependency issues", () => {
      const fix = analyzer.generateVercelSuggestedFix(
        "npm ERR! ERESOLVE unable to resolve"
      )
      expect(fix).toBe("Fix peer dependency conflicts, update package versions")
    })

    it("should generate specific fix for function size limits", () => {
      const fix = analyzer.generateVercelSuggestedFix(
        "exceeds the maximum size limit of 50 MB"
      )
      expect(fix).toBe("Reduce function bundle size or use Edge Runtime")
    })

    it("should generate specific fix for static generation errors", () => {
      const fix = analyzer.generateVercelSuggestedFix(
        'Error occurred prerendering page "/products/[id]"'
      )
      expect(fix).toBe("Fix getStaticProps error in /products/[id] page")
    })

    it("should generate specific fix for Edge Runtime errors", () => {
      const fix = analyzer.generateVercelSuggestedFix(
        "Edge Runtime does not support Node.js"
      )
      expect(fix).toBe(
        "Replace Node.js modules with Edge Runtime compatible alternatives"
      )
    })

    it("should generate generic fix for unknown errors", () => {
      const fix = analyzer.generateVercelSuggestedFix(
        "unknown deployment error"
      )
      expect(fix).toBe(
        "Review Vercel deployment logs for specific error details"
      )
    })
  })

  describe("Vercel Root Cause Extraction", () => {
    it("should identify build timeout root cause", () => {
      const rootCause = analyzer.extractVercelRootCause(
        "build timed out after 10 minutes"
      )
      expect(rootCause).toBe("Vercel build timeout")
    })

    it("should identify memory limit root cause", () => {
      const rootCause = analyzer.extractVercelRootCause(
        "JavaScript heap out of memory"
      )
      expect(rootCause).toBe("Memory limit exceeded")
    })

    it("should identify environment variable root cause", () => {
      const rootCause = analyzer.extractVercelRootCause(
        "Environment variable DATABASE_URL is required"
      )
      expect(rootCause).toBe("Missing environment variable")
    })

    it("should identify dependency resolution root cause", () => {
      const rootCause = analyzer.extractVercelRootCause(
        "npm ERR! ERESOLVE unable to resolve"
      )
      expect(rootCause).toBe("Dependency resolution conflict")
    })

    it("should identify function size limit root cause", () => {
      const rootCause = analyzer.extractVercelRootCause(
        "exceeds the maximum size limit"
      )
      expect(rootCause).toBe("Serverless function size limit exceeded")
    })

    it("should identify static generation root cause", () => {
      const rootCause = analyzer.extractVercelRootCause(
        "Error occurred prerendering page"
      )
      expect(rootCause).toBe("Static page generation failure")
    })

    it("should identify Edge Runtime root cause", () => {
      const rootCause = analyzer.extractVercelRootCause(
        "Edge Runtime does not support"
      )
      expect(rootCause).toBe("Edge Runtime compatibility issue")
    })

    it("should handle unknown Vercel errors", () => {
      const rootCause = analyzer.extractVercelRootCause(
        "unknown deployment error"
      )
      expect(rootCause).toBe("Unknown Vercel deployment failure")
    })
  })

  describe("Edge Cases and Error Handling", () => {
    it("should handle empty Vercel logs", () => {
      const result = analyzer.analyzeVercelDeploymentLogs("Vercel Deploy", "")
      expect(result.issues).toHaveLength(1)
      expect(result.issues[0]?.priority).toBe("medium")
      expect(result.issues[0]?.rootCause).toBe(
        "Unknown Vercel deployment failure"
      )
    })

    it("should handle malformed Vercel logs", () => {
      const logContent = "Random text with no Vercel patterns"
      const result = analyzer.analyzeVercelDeploymentLogs(
        "Vercel Deploy",
        logContent
      )
      expect(result.issues).toHaveLength(1)
      expect(result.issues[0]?.description).toContain(
        "failed - check logs for details"
      )
    })

    it("should handle very large Vercel logs efficiently", () => {
      const largeLogContent = "[12:34:56.789] Error: Build failed\n".repeat(
        5000
      )
      const startTime = Date.now()

      const result = analyzer.analyzeVercelDeploymentLogs(
        "Vercel Deploy",
        largeLogContent
      )

      const endTime = Date.now()
      expect(endTime - startTime).toBeLessThan(2000) // Should complete within 2 seconds
      expect(result.issues.length).toBeGreaterThan(0)
    })

    it("should handle Unicode characters in Vercel logs", () => {
      const logContent = "[12:34:56.789] Error: Build failed for 测试项目 🚨"
      const result = analyzer.analyzeVercelDeploymentLogs(
        "Vercel Deploy",
        logContent
      )
      expect(result.issues[0]?.description).toContain("测试项目 🚨")
    })

    it("should extract timestamps from Vercel logs", () => {
      const logContent = "[12:34:56.789] Error: Build failed"
      const result = analyzer.analyzeVercelDeploymentLogs(
        "Vercel Deploy",
        logContent
      )
      expect(result.issues[0]).toHaveProperty("timestamp")
      expect(result.issues[0]?.timestamp).toBe("12:34:56.789")
    })
  })
})
