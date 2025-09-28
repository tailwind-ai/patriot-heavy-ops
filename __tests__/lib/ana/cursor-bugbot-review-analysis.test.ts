/**
 * Tests for Issue #280: Ana - Cursor Bugbot Integration for Code Review Analysis
 *
 * CRITICAL FIX: Tests for pull_request_review event handling instead of issue_comment
 *
 * Following .cursorrules.md standards:
 * - Platform Mode: Conservative error handling, proven patterns
 * - Test Mode: Comprehensive edge case coverage, crystal clear intent
 * - Strict TypeScript: No any types, proper interfaces
 */

import { AnaAnalyzer } from "@/lib/ana/ana-analyzer"
import { jest } from "@jest/globals"
import fs from "fs"
import path from "path"

// Load test fixtures
const fixturesPath = path.join(
  __dirname,
  "../../fixtures/cursor-bugbot-reviews.json"
)
const fixtures = JSON.parse(fs.readFileSync(fixturesPath, "utf8"))

describe("Ana Cursor Bugbot Review Analysis (Issue #280)", () => {
  let analyzer: AnaAnalyzer

  beforeEach(() => {
    jest.clearAllMocks()
    analyzer = new AnaAnalyzer()
  })

  describe("analyzeCursorBugbotReview - New Method (Issue #280 Fix)", () => {
    describe("Pull Request Review Event Handling", () => {
      it("should handle pull_request_review event with single review comment", () => {
        const fixture = fixtures.singleSecurityIssue

        const result = analyzer.analyzeCursorBugbotReview(
          {
            review: fixture.review,
            comments: fixture.comments,
          },
          123
        )

        expect(result.failures).toHaveLength(1)
        expect(result.failures[0]).toMatchObject({
          content: "Authentication Bypass",
          priority: "critical",
          files: ["lib/auth/middleware.ts"],
          lineNumbers: [45],
          rootCause: expect.stringContaining(
            "authentication bypass vulnerability"
          ),
          type: "bugbot_issue",
          relatedPR: "#123",
        })
      })

      it("should handle pull_request_review event with multiple review comments", () => {
        const fixture = fixtures.multipleIssues

        const result = analyzer.analyzeCursorBugbotReview(
          {
            review: fixture.review,
            comments: fixture.comments,
          },
          123
        )

        expect(result.failures).toHaveLength(3)

        // Critical security issue should be first (higher priority)
        expect(result.failures[0]).toMatchObject({
          content: "Authentication Bypass",
          priority: "critical",
          files: ["lib/auth/middleware.ts"],
          lineNumbers: [45],
        })

        // High priority issue should be second
        expect(result.failures[1]).toMatchObject({
          content: "Input Validation Missing",
          priority: "high",
          files: ["lib/utils/validation.ts"],
          lineNumbers: [67],
        })

        // Low priority suggestion should be last
        expect(result.failures[2]).toMatchObject({
          content: "Performance Improvement",
          priority: "low",
          files: ["components/UserForm.tsx"],
          lineNumbers: [23],
        })
      })

      it("should validate Cursor bot identity correctly", () => {
        const fixture = fixtures.invalidUser

        expect(() => {
          analyzer.analyzeCursorBugbotReview(
            {
              review: fixture.review,
              comments: fixture.comments,
            },
            123
          )
        }).toThrow("Review is not from Cursor bot (user: not-cursor)")
      })

      it("should validate review state correctly", () => {
        const fixture = fixtures.invalidState

        expect(() => {
          analyzer.analyzeCursorBugbotReview(
            {
              review: fixture.review,
              comments: fixture.comments,
            },
            123
          )
        }).toThrow("Review is not a comment review (state: APPROVED)")
      })
    })

    describe("Structured Comment Parsing", () => {
      it("should parse bug titles from structured format", () => {
        const reviewData = {
          review: {
            id: 12345,
            user: { login: "cursor" },
            state: "COMMENTED",
            body: "## Cursor Bugbot Analysis",
          },
          comments: [
            {
              id: 67890,
              path: "lib/utils/validation.ts",
              line: 67,
              body: "### Bug: Input Validation Missing\n<!-- **Medium Severity** -->\n<!-- DESCRIPTION START -->\nUser input is not properly validated before processing.\n<!-- DESCRIPTION END -->",
            },
          ],
        }

        const result = analyzer.analyzeCursorBugbotReview(reviewData, 123)

        expect(result.failures[0]).toMatchObject({
          content: "Input Validation Missing",
          priority: "medium",
          rootCause: "User input is not properly validated before processing.",
        })
      })

      it("should extract severity levels from structured comments", () => {
        const testCases = [
          { severity: "Critical Severity", expectedPriority: "critical" },
          { severity: "High Severity", expectedPriority: "high" },
          { severity: "Medium Severity", expectedPriority: "medium" },
          { severity: "Low Severity", expectedPriority: "low" },
        ]

        for (const testCase of testCases) {
          const reviewData = {
            review: {
              id: 12345,
              user: { login: "cursor" },
              state: "COMMENTED",
              body: "## Cursor Bugbot Analysis",
            },
            comments: [
              {
                id: 67890,
                path: "test.ts",
                line: 1,
                body: `### Bug: Test Issue\n<!-- **${testCase.severity}** -->\nTest description.`,
              },
            ],
          }

          const result = analyzer.analyzeCursorBugbotReview(reviewData, 123)
          expect(result.failures[0]?.priority).toBe(testCase.expectedPriority)
        }
      })

      it("should handle malformed comment structure gracefully", () => {
        const reviewData = {
          review: {
            id: 12345,
            user: { login: "cursor" },
            state: "COMMENTED",
            body: "## Cursor Bugbot Analysis",
          },
          comments: [
            {
              id: 67890,
              path: "test.ts",
              line: 1,
              body: "Malformed comment without proper structure",
            },
          ],
        }

        const result = analyzer.analyzeCursorBugbotReview(reviewData, 123)

        expect(result.failures).toHaveLength(1)
        expect(result.failures[0]).toMatchObject({
          content: "Malformed comment without proper structure",
          priority: "medium", // Default priority
          files: ["test.ts"],
          lineNumbers: [1],
        })
      })
    })

    describe("Error Handling and Edge Cases", () => {
      it("should handle empty review comments", () => {
        const fixture = fixtures.emptyReview

        const result = analyzer.analyzeCursorBugbotReview(
          {
            review: fixture.review,
            comments: fixture.comments,
          },
          123
        )

        expect(result.failures).toHaveLength(0)
        expect(result.summary).toContain("No issues found")
      })
    })
  })

  describe("Data Format Consistency (Issue #280 Requirement)", () => {
    it("should maintain exact AnalyzedFailure interface consistency", () => {
      const reviewData = {
        review: {
          id: 12345,
          user: { login: "cursor" },
          state: "COMMENTED",
          body: "## Cursor Bugbot Analysis",
        },
        comments: [
          {
            id: 67890,
            path: "lib/auth/middleware.ts",
            line: 45,
            body: "### Bug: Security Issue\n<!-- **Critical Severity** -->\n<!-- DESCRIPTION START -->\nAuthentication bypass vulnerability\n<!-- DESCRIPTION END -->",
          },
        ],
      }

      const result = analyzer.analyzeCursorBugbotReview(reviewData, 123)

      // Verify exact AnalyzedFailure interface compliance
      const failure = result.failures[0]
      expect(failure).toBeDefined()
      expect(failure!).toMatchObject({
        id: expect.stringMatching(/^bugbot-review-12345-comment-67890-\d+$/),
        type: "bugbot_issue",
        content: "Security Issue",
        priority: "critical",
        files: ["lib/auth/middleware.ts"],
        lineNumbers: [45],
        rootCause: "Authentication bypass vulnerability",
        impact: expect.stringContaining("Code quality"),
        suggestedFix: expect.any(String),
        relatedPR: "#123",
        createdAt: expect.stringMatching(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        ),
      })

      // Verify no additional fields beyond AnalyzedFailure interface
      const allowedFields = [
        "id",
        "type",
        "content",
        "priority",
        "files",
        "lineNumbers",
        "rootCause",
        "impact",
        "suggestedFix",
        "affectedComponents",
        "relatedPR",
        "createdAt",
      ]

      Object.keys(failure!).forEach((key) => {
        expect(allowedFields).toContain(key)
      })
    })

    it("should use same AnaResults format as other analyzers", () => {
      const fixture = fixtures.singleSecurityIssue

      const result = analyzer.analyzeCursorBugbotReview(
        {
          review: fixture.review,
          comments: fixture.comments,
        },
        123
      )

      // Verify AnaResults structure matches other analyzers
      expect(result).toMatchObject({
        failures: expect.arrayContaining([
          expect.objectContaining({
            type: "bugbot_issue",
            content: expect.any(String),
            priority: expect.stringMatching(/^(low|medium|high|critical)$/),
          }),
        ]),
        summary: expect.any(String),
        analysisDate: expect.stringMatching(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        ),
        totalFailures: expect.any(Number),
        criticalFailures: expect.any(Number),
        highPriorityFailures: expect.any(Number),
        mediumPriorityFailures: expect.any(Number),
        lowPriorityFailures: expect.any(Number),
      })
    })
  })

  describe("Performance and Scalability", () => {
    it("should handle large numbers of review comments efficiently", () => {
      // Create fixture with many comments
      const largeReviewData = {
        review: {
          id: 99999,
          user: { login: "cursor" },
          state: "COMMENTED",
          body: "## Cursor Bugbot Analysis\n\nFound many issues.",
        },
        comments: Array.from({ length: 50 }, (_, i) => ({
          id: 100000 + i,
          path: `file-${i}.ts`,
          line: i + 1,
          body: `### Bug: Issue ${i}\n<!-- **Medium Severity** -->\nTest issue ${i}.`,
        })),
      }

      const startTime = Date.now()
      const result = analyzer.analyzeCursorBugbotReview(largeReviewData, 999)
      const endTime = Date.now()

      // Verify all issues processed
      expect(result.failures).toHaveLength(50)

      // Verify reasonable performance (should complete within 1 second)
      expect(endTime - startTime).toBeLessThan(1000)
    })

    it("should handle Unicode and special characters correctly", () => {
      const fixture = fixtures.unicodeAndSpecialChars

      const result = analyzer.analyzeCursorBugbotReview(
        {
          review: fixture.review,
          comments: fixture.comments,
        },
        888
      )

      expect(result.failures).toHaveLength(1)

      const issue = result.failures[0]
      expect(issue?.rootCause).toContain("🚀 ñáéíóú 中文 العربية")
    })
  })

  describe("analyzeCursorBugbotReviewComment - Helper Method", () => {
    it("should parse structured comment format correctly", () => {
      const commentBody =
        "### Bug: Memory Leak\n<!-- **High Severity** -->\n<!-- DESCRIPTION START -->\nEffect cleanup not properly implemented.\n<!-- DESCRIPTION END -->\n\n**Suggested Fix**: Add cleanup function to useEffect"

      const result = analyzer.analyzeCursorBugbotReviewComment(
        commentBody,
        "hooks/useData.ts",
        34
      )

      expect(result.issue).toMatchObject({
        title: "Memory Leak",
        priority: "high",
        description: "Effect cleanup not properly implemented.",
        suggestedFix: "Add cleanup function to useEffect",
      })
    })

    it("should handle comments without structured format", () => {
      const commentBody =
        "This code looks suspicious and might cause performance issues"

      const result = analyzer.analyzeCursorBugbotReviewComment(
        commentBody,
        "components/App.tsx",
        12
      )

      expect(result.issue).toMatchObject({
        title: "This code looks suspicious and might cause performance issues",
        priority: "medium", // Default priority
        description:
          "This code looks suspicious and might cause performance issues",
      })
    })

    it("should extract priority from keywords when no severity marker", () => {
      const testCases = [
        {
          body: "Critical security vulnerability detected",
          expectedPriority: "critical",
        },
        { body: "This is a bug that needs fixing", expectedPriority: "high" },
        {
          body: "Consider this improvement suggestion",
          expectedPriority: "low",
        },
        { body: "General code review comment", expectedPriority: "medium" },
      ]

      for (const testCase of testCases) {
        const result = analyzer.analyzeCursorBugbotReviewComment(testCase.body)
        expect(result.issue?.priority).toBe(testCase.expectedPriority)
      }
    })
  })
})
