/**
 * Tests for Ana → Tod Webhook Integration (Issue #282)
 * Tests the webhook endpoint that receives failure analysis from Ana
 */

import { POST } from "@/app/api/webhooks/ana-failures/route"

// Mock next/headers following proven pattern from Stripe webhook test
jest.mock("next/headers", () => ({
  headers: jest.fn(),
}))

// Import the mocked module
import { headers } from "next/headers"

// Mock globalThis.todo_write for testing
const mockTodoWrite = jest.fn()
;(globalThis as any).todo_write = mockTodoWrite

const mockHeaders = headers as jest.MockedFunction<typeof headers>

describe("/api/webhooks/ana-failures", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Set development mode for signature validation using Object.defineProperty
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "development",
      configurable: true,
    })
    process.env.ANA_WEBHOOK_SECRET = "test-secret"
  })

  afterEach(() => {
    delete process.env.ANA_WEBHOOK_SECRET
  })

  describe("POST /api/webhooks/ana-failures", () => {
    const validPayload = {
      summary: "CI Test workflow failed with 2 TypeScript errors",
      analysisDate: "2025-09-27T18:30:00Z",
      workflowRunId: "12345",
      prNumber: 279,
      failures: [
        {
          id: "ci-12345-job-67890-1234567890",
          type: "ci_failure" as const,
          content: "Fix TypeScript compilation error in user-service.ts:45",
          priority: "high" as const,
          files: ["lib/services/user-service.ts"],
          lineNumbers: [45, 67],
          rootCause: "Missing interface definition for UserData type",
          impact: "Blocks user authentication flow and prevents build",
          suggestedFix: "Add UserData interface to types/user.ts",
          affectedComponents: ["Authentication", "User Management"],
          relatedPR: "#279",
          createdAt: "2025-09-27T18:30:00Z",
        },
      ],
    }

    const createValidRequest = (payload: any = validPayload) => {
      const body = JSON.stringify(payload)
      const secret = "test-secret"
      const timestamp = new Date().toISOString()
      const signature = `sha256=dev-${Buffer.from(body + secret)
        .toString("base64")
        .substring(0, 16)}`

      // Mock headers following proven pattern
      mockHeaders.mockReturnValue({
        get: jest.fn().mockImplementation((name: string) => {
          if (name === "x-ana-signature") return signature
          if (name === "x-ana-timestamp") return timestamp
          return null
        }),
      } as any)

      return new Request("http://localhost:3000/api/webhooks/ana-failures", {
        method: "POST",
        body,
        headers: {
          "content-type": "application/json",
          "x-ana-signature": signature,
          "x-ana-timestamp": timestamp,
        },
      })
    }

    describe("Successful webhook processing", () => {
      it("should process valid Ana webhook payload successfully", async () => {
        const request = createValidRequest()
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.message).toBe("Created 1 TODOs from Ana analysis")
        expect(data.todosCreated).toBe(1)

        // Verify todo_write was called with correct data
        expect(mockTodoWrite).toHaveBeenCalledWith({
          merge: false,
          todos: [
            {
              id: "ci-12345-job-67890-1234567890",
              content: "Fix TypeScript compilation error in user-service.ts:45",
              status: "pending",
              metadata: {
                priority: "high",
                files: ["lib/services/user-service.ts"],
                lineNumbers: [45, 67],
                rootCause: "Missing interface definition for UserData type",
                impact: "Blocks user authentication flow and prevents build",
                suggestedFix: "Add UserData interface to types/user.ts",
                affectedComponents: ["Authentication", "User Management"],
                issueType: "ci_failure",
                relatedPR: "#279",
                createdAt: "2025-09-27T18:30:00Z",
                addedToCursorAt: expect.any(String),
              },
            },
          ],
        })
      })

      it("should handle multiple failures in single payload", async () => {
        const multiFailurePayload = {
          ...validPayload,
          summary: "CI Test workflow failed with 3 errors",
          failures: [
            ...validPayload.failures,
            {
              id: "ci-12345-job-67890-1234567891",
              type: "ci_failure" as const,
              content: "Fix ESLint error in components/Button.tsx:12",
              priority: "medium" as const,
              files: ["components/Button.tsx"],
              lineNumbers: [12],
              rootCause: "Missing prop validation",
              suggestedFix: "Add PropTypes or TypeScript interface",
              createdAt: "2025-09-27T18:30:01Z",
            },
            {
              id: "vercel-12345-deploy-1234567892",
              type: "vercel_failure" as const,
              content: "Vercel deployment failed due to build timeout",
              priority: "critical" as const,
              rootCause: "Build process exceeded time limit",
              impact: "Deployment blocked",
              suggestedFix: "Optimize build process and enable caching",
              createdAt: "2025-09-27T18:30:02Z",
            },
          ],
        }

        const request = createValidRequest(multiFailurePayload)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.todosCreated).toBe(3)
        expect(mockTodoWrite).toHaveBeenCalledWith({
          merge: false,
          todos: expect.arrayContaining([
            expect.objectContaining({
              id: "ci-12345-job-67890-1234567890",
              content: "Fix TypeScript compilation error in user-service.ts:45",
            }),
            expect.objectContaining({
              id: "ci-12345-job-67890-1234567891",
              content: "Fix ESLint error in components/Button.tsx:12",
            }),
            expect.objectContaining({
              id: "vercel-12345-deploy-1234567892",
              content: "Vercel deployment failed due to build timeout",
            }),
          ]),
        })
      })

      it("should handle payload with optional fields missing", async () => {
        const minimalPayload = {
          summary: "Simple CI failure",
          analysisDate: "2025-09-27T18:30:00Z",
          failures: [
            {
              id: "ci-minimal-123",
              type: "ci_failure" as const,
              content: "Build failed",
              priority: "high" as const,
              createdAt: "2025-09-27T18:30:00Z",
            },
          ],
        }

        const request = createValidRequest(minimalPayload)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.todosCreated).toBe(1)

        expect(mockTodoWrite).toHaveBeenCalledWith({
          merge: false,
          todos: [
            {
              id: "ci-minimal-123",
              content: "Build failed",
              status: "pending",
              metadata: {
                priority: "high",
                files: [],
                lineNumbers: [],
                issueType: "ci_failure",
                createdAt: "2025-09-27T18:30:00Z",
                addedToCursorAt: expect.any(String),
              },
            },
          ],
        })
      })
    })

    describe("Signature validation", () => {
      it("should reject requests with missing signature", async () => {
        // Mock headers to return null for signature, valid timestamp
        const timestamp = new Date().toISOString()
        mockHeaders.mockReturnValue({
          get: jest.fn().mockImplementation((name: string) => {
            if (name === "x-ana-signature") return null
            if (name === "x-ana-timestamp") return timestamp
            return null
          }),
        } as any)

        const request = new Request(
          "http://localhost:3000/api/webhooks/ana-failures",
          {
            method: "POST",
            body: JSON.stringify(validPayload),
            headers: { "content-type": "application/json" },
          }
        )

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.error).toBe("Invalid signature")
        expect(mockTodoWrite).not.toHaveBeenCalled()
      })

      it("should reject requests with missing timestamp", async () => {
        // Mock headers to return valid signature, null timestamp
        mockHeaders.mockReturnValue({
          get: jest.fn().mockImplementation((name: string) => {
            if (name === "x-ana-signature") return "sha256=invalid"
            if (name === "x-ana-timestamp") return null
            return null
          }),
        } as any)

        const request = new Request(
          "http://localhost:3000/api/webhooks/ana-failures",
          {
            method: "POST",
            body: JSON.stringify(validPayload),
            headers: { "content-type": "application/json" },
          }
        )

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.error).toBe("Invalid signature")
        expect(mockTodoWrite).not.toHaveBeenCalled()
      })

      it("should reject requests with invalid signature", async () => {
        // Mock headers to return invalid signature, valid timestamp
        const timestamp = new Date().toISOString()
        mockHeaders.mockReturnValue({
          get: jest.fn().mockImplementation((name: string) => {
            if (name === "x-ana-signature") return "sha256=invalid-signature"
            if (name === "x-ana-timestamp") return timestamp
            return null
          }),
        } as any)

        const request = new Request(
          "http://localhost:3000/api/webhooks/ana-failures",
          {
            method: "POST",
            body: JSON.stringify(validPayload),
            headers: { "content-type": "application/json" },
          }
        )

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.error).toBe("Invalid signature")
        expect(mockTodoWrite).not.toHaveBeenCalled()
      })

      it("should reject requests with old timestamp", async () => {
        const oldTimestamp = new Date(Date.now() - 10 * 60 * 1000).toISOString() // 10 minutes ago
        const body = JSON.stringify(validPayload)
        const secret = "test-secret"
        const signature = `sha256=dev-${Buffer.from(body + secret)
          .toString("base64")
          .substring(0, 16)}`

        // Mock headers to return valid signature, old timestamp
        mockHeaders.mockReturnValue({
          get: jest.fn().mockImplementation((name: string) => {
            if (name === "x-ana-signature") return signature
            if (name === "x-ana-timestamp") return oldTimestamp
            return null
          }),
        } as any)

        const request = new Request(
          "http://localhost:3000/api/webhooks/ana-failures",
          {
            method: "POST",
            body,
            headers: { "content-type": "application/json" },
          }
        )

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.error).toBe("Invalid signature")
        expect(mockTodoWrite).not.toHaveBeenCalled()
      })
    })

    describe("Payload validation", () => {
      it("should reject payload with missing summary", async () => {
        const invalidPayload = { ...validPayload }
        delete (invalidPayload as any).summary

        const request = createValidRequest(invalidPayload)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe("Invalid payload")
        expect(data.details).toContain("Missing summary")
        expect(mockTodoWrite).not.toHaveBeenCalled()
      })

      it("should reject payload with missing analysisDate", async () => {
        const invalidPayload = { ...validPayload }
        delete (invalidPayload as any).analysisDate

        const request = createValidRequest(invalidPayload)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe("Invalid payload")
        expect(data.details).toContain("Missing analysisDate")
        expect(mockTodoWrite).not.toHaveBeenCalled()
      })

      it("should reject payload with missing failures array", async () => {
        const invalidPayload = { ...validPayload }
        delete (invalidPayload as any).failures

        const request = createValidRequest(invalidPayload)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe("Invalid payload")
        expect(data.details).toContain("Missing or invalid failures array")
        expect(mockTodoWrite).not.toHaveBeenCalled()
      })

      it("should reject payload with invalid failure objects", async () => {
        const invalidPayload = {
          ...validPayload,
          failures: [
            {
              // Missing required fields
              content: "Some error",
            },
          ],
        }

        const request = createValidRequest(invalidPayload)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe("Invalid payload")
        expect(data.details).toEqual(
          expect.arrayContaining([
            "Failure 0: Missing id",
            "Failure 0: Missing type",
            "Failure 0: Missing priority",
          ])
        )
        expect(mockTodoWrite).not.toHaveBeenCalled()
      })

      it("should reject payload with empty failures array", async () => {
        const invalidPayload = {
          ...validPayload,
          failures: [],
        }

        const request = createValidRequest(invalidPayload)
        const response = await POST(request)
        const data = await response.json()

        // Should still be valid - empty failures array is allowed
        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.todosCreated).toBe(0)
        expect(mockTodoWrite).toHaveBeenCalledWith({
          merge: false,
          todos: [],
        })
      })
    })

    describe("Error handling", () => {
      it("should handle malformed JSON gracefully", async () => {
        const body = "invalid json {"
        const secret = "test-secret"
        const timestamp = new Date().toISOString()
        const signature = `sha256=dev-${Buffer.from(body + secret)
          .toString("base64")
          .substring(0, 16)}`

        // Mock headers to return valid signature and timestamp for malformed JSON
        mockHeaders.mockReturnValue({
          get: jest.fn().mockImplementation((name: string) => {
            if (name === "x-ana-signature") return signature
            if (name === "x-ana-timestamp") return timestamp
            return null
          }),
        } as any)

        const request = new Request(
          "http://localhost:3000/api/webhooks/ana-failures",
          {
            method: "POST",
            body,
            headers: { "content-type": "application/json" },
          }
        )

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.error).toBe("Internal server error")
        expect(data.message).toContain("Unexpected")
        expect(mockTodoWrite).not.toHaveBeenCalled()
      })

      it("should handle todo_write errors gracefully", async () => {
        mockTodoWrite.mockRejectedValueOnce(new Error("Cursor API error"))

        const request = createValidRequest()
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.error).toBe("Internal server error")
        expect(data.message).toBe("Cursor API error")
      })
    })

    describe("Different failure types", () => {
      it("should handle CI failure type", async () => {
        const ciPayload = {
          ...validPayload,
          failures: [
            {
              ...validPayload.failures[0],
              type: "ci_failure" as const,
            },
          ],
        }

        const request = createValidRequest(ciPayload)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(mockTodoWrite).toHaveBeenCalledWith({
          merge: false,
          todos: [
            expect.objectContaining({
              metadata: expect.objectContaining({
                issueType: "ci_failure",
              }),
            }),
          ],
        })
      })

      it("should handle Vercel failure type", async () => {
        const vercelPayload = {
          ...validPayload,
          failures: [
            {
              ...validPayload.failures[0],
              id: "vercel-deploy-123",
              type: "vercel_failure" as const,
              content: "Vercel deployment failed",
            },
          ],
        }

        const request = createValidRequest(vercelPayload)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(mockTodoWrite).toHaveBeenCalledWith({
          merge: false,
          todos: [
            expect.objectContaining({
              metadata: expect.objectContaining({
                issueType: "vercel_failure",
              }),
            }),
          ],
        })
      })

      it("should handle bugbot issue type", async () => {
        const bugbotPayload = {
          ...validPayload,
          failures: [
            {
              ...validPayload.failures[0],
              id: "bugbot-issue-123",
              type: "bugbot_issue" as const,
              content: "Code quality issue detected",
            },
          ],
        }

        const request = createValidRequest(bugbotPayload)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(mockTodoWrite).toHaveBeenCalledWith({
          merge: false,
          todos: [
            expect.objectContaining({
              metadata: expect.objectContaining({
                issueType: "bugbot_issue",
              }),
            }),
          ],
        })
      })
    })

    describe("Priority handling", () => {
      const priorities = ["low", "medium", "high", "critical"] as const

      priorities.forEach((priority) => {
        it(`should handle ${priority} priority correctly`, async () => {
          const priorityPayload = {
            ...validPayload,
            failures: [
              {
                ...validPayload.failures[0],
                priority,
              },
            ],
          }

          const request = createValidRequest(priorityPayload)
          const response = await POST(request)
          const data = await response.json()

          expect(response.status).toBe(200)
          expect(data.success).toBe(true)
          expect(mockTodoWrite).toHaveBeenCalledWith({
            merge: false,
            todos: [
              expect.objectContaining({
                metadata: expect.objectContaining({
                  priority,
                }),
              }),
            ],
          })
        })
      })
    })
  })
})
