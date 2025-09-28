/**
 * Unit tests for Ana Analyzer - CI Failure Analysis
 * Tests the core failure analysis logic following Platform Mode standards
 */

import { AnaAnalyzer } from "@/lib/ana/ana-analyzer"

// Mock external dependencies
jest.mock("@octokit/rest")
jest.mock("child_process")
jest.mock("fs")

describe("AnaAnalyzer", () => {
  let analyzer: AnaAnalyzer

  beforeEach(() => {
    analyzer = new AnaAnalyzer()
    jest.clearAllMocks()
  })

  describe("CI Failure Log Analysis", () => {
    describe("analyzeJobLogs", () => {
      it("should parse TypeScript compilation errors correctly", () => {
        const logContent = `
          error in src/components/Button.tsx:45:12
          Type 'string' is not assignable to type 'number'
          error in lib/utils.ts:23:8
          Property 'foo' does not exist on type 'Bar'
        `

        const result = analyzer.analyzeJobLogs("TypeScript Check", logContent)

        expect(result.issues).toHaveLength(2)
        expect(result.issues[0]).toMatchObject({
          description: expect.stringContaining("TypeScript Check"),
          priority: "high",
          files: ["src/components/Button.tsx"],
          lineNumbers: [45],
          rootCause: "TypeScript compilation error",
          suggestedFix: expect.stringContaining("Fix type mismatch"),
        })
        expect(result.issues[1]).toMatchObject({
          description: expect.stringContaining("TypeScript Check"),
          priority: "high",
          files: ["lib/utils.ts"],
          lineNumbers: [23],
          rootCause: "TypeScript compilation error",
          suggestedFix: expect.stringContaining("Fix type mismatch"),
        })
      })

      it("should parse Jest test failures correctly", () => {
        const logContent = `
          FAIL __tests__/components/Button.test.tsx
          ● Button component › should render correctly
            expect(received).toBe(expected)
            Expected: "Submit"
            Received: "Click me"
        `

        const result = analyzer.analyzeJobLogs("Unit Tests", logContent)

        expect(result.issues).toHaveLength(1)
        expect(result.issues[0]).toMatchObject({
          description: expect.stringContaining("Unit Tests"),
          priority: "high",
          files: ["__tests__/components/Button.test.tsx"],
          rootCause: "Jest test failure",
          suggestedFix: expect.stringContaining("Fix failing test"),
        })
      })

      it("should parse ESLint errors correctly", () => {
        const logContent = `
          /src/components/Header.tsx
            15:1  error  'React' is not defined  no-undef
            23:5  error  Missing semicolon       semi
        `

        const result = analyzer.analyzeJobLogs("Lint", logContent)

        expect(result.issues).toHaveLength(1)
        expect(result.issues[0]).toMatchObject({
          description: expect.stringContaining("Lint"),
          priority: "medium",
          files: ["/src/components/Header.tsx"],
          lineNumbers: [15],
          rootCause: "ESLint error",
          suggestedFix: expect.stringContaining("Fix linting issues"),
        })
      })

      it("should parse build failures correctly", () => {
        const logContent = `
          Build failed: Module not found: Can't resolve './missing-file'
          in ./src/pages/index.tsx
        `

        const result = analyzer.analyzeJobLogs("Build", logContent)

        expect(result.issues).toHaveLength(1)
        expect(result.issues[0]).toMatchObject({
          description: expect.stringContaining("Build"),
          priority: "critical",
          rootCause: expect.stringContaining("Build failure"),
          suggestedFix: expect.stringContaining("Check import paths"),
        })
      })

      it("should handle logs with no specific patterns", () => {
        const logContent = "Some generic error occurred"

        const result = analyzer.analyzeJobLogs("Generic Job", logContent)

        expect(result.issues).toHaveLength(1)
        expect(result.issues[0]).toMatchObject({
          description: expect.stringContaining("Generic Job failed"),
          priority: "medium",
          rootCause: "Unknown failure",
          suggestedFix: expect.stringContaining("Review job logs"),
        })
      })

      it("should handle empty log content", () => {
        const result = analyzer.analyzeJobLogs("Empty Job", "")

        expect(result.issues).toHaveLength(1)
        expect(result.issues[0]).toMatchObject({
          description: expect.stringContaining("Empty Job failed"),
          priority: "medium",
          rootCause: "Unknown failure",
          suggestedFix: expect.stringContaining("Review job logs"),
        })
      })

      it("should extract multiple files from single error", () => {
        const logContent = `
          error in src/components/Button.tsx:45:12
          error in src/components/Input.tsx:23:8
          error in lib/utils.ts:67:15
        `

        const result = analyzer.analyzeJobLogs("TypeScript Check", logContent)

        expect(result.issues).toHaveLength(3)
        expect(result.issues.map((issue) => issue.files)).toEqual([
          ["src/components/Button.tsx"],
          ["src/components/Input.tsx"],
          ["lib/utils.ts"],
        ])
      })

      it("should prioritize critical build failures over other errors", () => {
        const logContent = `
          lint error: Missing semicolon
          build failed: Cannot resolve module
          test failed: Assertion error
        `

        const result = analyzer.analyzeJobLogs("Mixed Failures", logContent)

        const priorities = result.issues.map((issue) => issue.priority)
        expect(priorities).toContain("critical") // build failure
        expect(priorities).toContain("high") // test failure
        expect(priorities).toContain("medium") // lint error
      })
    })

    describe("calculatePriority", () => {
      it("should assign critical priority to build failures", () => {
        const priority = analyzer.calculatePriority("build failed", "Build")
        expect(priority).toBe("critical")
      })

      it("should assign high priority to test failures", () => {
        const priority = analyzer.calculatePriority("test failed", "Unit Tests")
        expect(priority).toBe("high")
      })

      it("should assign high priority to TypeScript errors", () => {
        const priority = analyzer.calculatePriority(
          "error in file.ts",
          "TypeScript Check"
        )
        expect(priority).toBe("high")
      })

      it("should assign medium priority to lint errors", () => {
        const priority = analyzer.calculatePriority("lint error", "Lint")
        expect(priority).toBe("medium")
      })

      it("should assign medium priority to unknown errors", () => {
        const priority = analyzer.calculatePriority(
          "unknown error",
          "Unknown Job"
        )
        expect(priority).toBe("medium")
      })
    })

    describe("generateSuggestedFix", () => {
      it("should generate specific fix for TypeScript errors", () => {
        const fix = analyzer.generateSuggestedFix(
          "error in src/components/Button.tsx:45:12",
          "TypeScript Check",
          ["src/components/Button.tsx"],
          [45]
        )
        expect(fix).toBe(
          "Fix type mismatch in src/components/Button.tsx at line 45"
        )
      })

      it("should generate specific fix for test failures", () => {
        const fix = analyzer.generateSuggestedFix(
          "test failed: Button should render",
          "Unit Tests",
          ["__tests__/Button.test.tsx"]
        )
        expect(fix).toBe("Fix failing test in __tests__/Button.test.tsx")
      })

      it("should generate specific fix for lint errors", () => {
        const fix = analyzer.generateSuggestedFix(
          "lint error: Missing semicolon",
          "Lint",
          ["src/utils.ts"],
          [23]
        )
        expect(fix).toBe("Fix linting issues in src/utils.ts")
      })

      it("should generate generic fix for build failures", () => {
        const fix = analyzer.generateSuggestedFix(
          "build failed: Module not found",
          "Build"
        )
        expect(fix).toBe(
          "Check import paths and ensure all required files exist"
        )
      })

      it("should generate generic fix for unknown errors", () => {
        const fix = analyzer.generateSuggestedFix(
          "unknown error",
          "Unknown Job"
        )
        expect(fix).toBe("Review job logs for specific error details")
      })
    })

    describe("extractRootCause", () => {
      it("should identify TypeScript compilation errors", () => {
        const rootCause = analyzer.extractRootCause("error in file.ts:45:12")
        expect(rootCause).toBe("TypeScript compilation error")
      })

      it("should identify Jest test failures", () => {
        const rootCause = analyzer.extractRootCause(
          "test failed: should render"
        )
        expect(rootCause).toBe("Jest test failure")
      })

      it("should identify ESLint errors", () => {
        const rootCause = analyzer.extractRootCause(
          "lint error: Missing semicolon"
        )
        expect(rootCause).toBe("ESLint error")
      })

      it("should identify build failures", () => {
        const rootCause = analyzer.extractRootCause(
          "build failed: Module not found"
        )
        expect(rootCause).toBe("Build failure - missing module")
      })

      it("should handle unknown errors", () => {
        const rootCause = analyzer.extractRootCause("some random error")
        expect(rootCause).toBe("Unknown failure")
      })
    })
  })

  describe("Data Structure Validation", () => {
    it("should create valid AnalyzedFailure objects", () => {
      const logContent = "error in src/test.ts:10:5"
      const result = analyzer.analyzeJobLogs("TypeScript Check", logContent)

      expect(result.issues[0]).toMatchObject({
        description: expect.any(String),
        priority: expect.stringMatching(/^(low|medium|high|critical)$/),
        files: expect.arrayContaining([expect.any(String)]),
        lineNumbers: expect.arrayContaining([expect.any(Number)]),
        rootCause: expect.any(String),
        suggestedFix: expect.any(String),
      })
    })

    it("should handle optional fields correctly", () => {
      const logContent = "generic error message"
      const result = analyzer.analyzeJobLogs("Generic Job", logContent)

      expect(result.issues[0]).toMatchObject({
        description: expect.any(String),
        priority: expect.stringMatching(/^(low|medium|high|critical)$/),
        rootCause: expect.any(String),
        suggestedFix: expect.any(String),
      })
      // files and lineNumbers should be undefined for generic errors
      expect(result.issues[0].files).toBeUndefined()
      expect(result.issues[0].lineNumbers).toBeUndefined()
    })
  })

  describe("Edge Cases", () => {
    it("should handle malformed regex patterns gracefully", () => {
      const logContent =
        "error in [invalid file name]:not-a-number:also-not-a-number"
      const result = analyzer.analyzeJobLogs("Malformed", logContent)

      expect(result.issues).toHaveLength(1)
      expect(result.issues[0].priority).toBe("medium")
    })

    it("should handle very large log files efficiently", () => {
      const largeLogContent = "error line\n".repeat(10000)
      const startTime = Date.now()

      const result = analyzer.analyzeJobLogs("Large Log", largeLogContent)

      const endTime = Date.now()
      expect(endTime - startTime).toBeLessThan(1000) // Should complete within 1 second
      expect(result.issues.length).toBeGreaterThan(0)
    })

    it("should handle special characters in file paths", () => {
      const logContent = "error in src/components/special-chars@#$.tsx:10:5"
      const result = analyzer.analyzeJobLogs("Special Chars", logContent)

      expect(result.issues[0].files).toEqual([
        "src/components/special-chars@#$.tsx",
      ])
    })

    it("should handle Unicode characters in log content", () => {
      const logContent = "error in src/测试.ts:10:5 - Unicode error message 🚨"
      const result = analyzer.analyzeJobLogs("Unicode Test", logContent)

      expect(result.issues[0].files).toEqual(["src/测试.ts"])
      expect(result.issues[0].description).toContain("Unicode error message 🚨")
    })
  })
})
