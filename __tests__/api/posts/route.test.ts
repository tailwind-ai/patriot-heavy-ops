import { GET, POST } from "@/app/api/posts/route"
import {
  createMockRequest,
  getResponseJson,
  assertResponse,
  TEST_USERS,
} from "@/__tests__/helpers/api-test-helpers"
import { getServerSession } from "next-auth/next"
import { db } from "@/lib/db"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { RequiresProPlanError } from "@/lib/exceptions"

// Mock dependencies
jest.mock("next-auth/next")
jest.mock("@/lib/db", () => ({
  db: {
    post: {
      findMany: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
  },
}))
jest.mock("@/lib/subscription")

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>
// Use any for Prisma mocks to avoid complex type issues
const mockDb = db as any
const mockGetUserSubscriptionPlan =
  getUserSubscriptionPlan as jest.MockedFunction<
    typeof getUserSubscriptionPlan
  >

describe("/api/posts", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/posts", () => {
    describe("Null Safety - Session Handling", () => {
      it("should handle null session gracefully", async () => {
        mockGetServerSession.mockResolvedValue(null)

        const req = createMockRequest("GET", "http://localhost/api/posts")
        const response = await GET()

        assertResponse(response, 403)
        const text = await response.text()
        expect(text).toBe("Unauthorized")
      })

      it("should handle session with null user gracefully", async () => {
        mockGetServerSession.mockResolvedValue({
          user: null as any,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        const req = createMockRequest("GET", "http://localhost/api/posts")
        const response = await GET()

        // Should fail gracefully without crashing
        expect(response.status).toBeGreaterThanOrEqual(400)
      })

      it("should handle session with undefined user.id gracefully", async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: undefined as any, name: "Test", email: "test@test.com" },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        const req = createMockRequest("GET", "http://localhost/api/posts")
        const response = await GET()

        // Should handle missing user.id without crashing
        expect(response.status).toBeGreaterThanOrEqual(400)
      })
    })

    describe("Null Safety - Database Response Handling", () => {
      it("should handle empty posts array", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockDb.post.findMany.mockResolvedValue([])

        const req = createMockRequest("GET", "http://localhost/api/posts")
        const response = await GET()

        assertResponse(response, 200)
        const data = await getResponseJson(response)
        expect(Array.isArray(data)).toBe(true)
        expect(data).toHaveLength(0)
      })

      it("should handle database errors gracefully", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockDb.post.findMany.mockRejectedValue(new Error("Database error"))

        const req = createMockRequest("GET", "http://localhost/api/posts")
        const response = await GET()

        assertResponse(response, 500)
      })
    })

    describe("Success Cases", () => {
      it("should return posts for authenticated user", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        const mockPosts = [
          {
            id: "post-1",
            title: "Test Post",
            published: true,
            createdAt: new Date(),
          },
        ]
        mockDb.post.findMany.mockResolvedValue(mockPosts)

        const req = createMockRequest("GET", "http://localhost/api/posts")
        const response = await GET()

        assertResponse(response, 200)
        const data = await getResponseJson(response)
        expect(data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: "post-1",
              title: "Test Post",
              published: true,
            }),
          ])
        )
        expect(mockDb.post.findMany).toHaveBeenCalledWith({
          select: {
            id: true,
            title: true,
            published: true,
            createdAt: true,
          },
          where: {
            authorId: user.id,
          },
        })
      })
    })
  })

  describe("POST /api/posts", () => {
    describe("Null Safety - Session Handling", () => {
      it("should handle null session gracefully", async () => {
        mockGetServerSession.mockResolvedValue(null)

        const req = createMockRequest(
          "POST",
          "http://localhost/api/posts",
          { title: "Test Post" }
        )
        const response = await POST(req)

        assertResponse(response, 403)
        const text = await response.text()
        expect(text).toBe("Unauthorized")
      })

      it("should handle session with null user gracefully", async () => {
        mockGetServerSession.mockResolvedValue({
          user: null as any,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        const req = createMockRequest(
          "POST",
          "http://localhost/api/posts",
          { title: "Test Post" }
        )
        const response = await POST(req)

        // Should fail gracefully without crashing
        expect(response.status).toBeGreaterThanOrEqual(400)
      })

      it("should handle session with undefined user.id gracefully", async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: undefined as any, name: "Test", email: "test@test.com" },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        const req = createMockRequest(
          "POST",
          "http://localhost/api/posts",
          { title: "Test Post" }
        )
        const response = await POST(req)

        // Should handle missing user.id without crashing
        expect(response.status).toBeGreaterThanOrEqual(400)
      })
    })

    describe("Null Safety - Subscription Plan Handling", () => {
      it("should handle null subscription plan gracefully", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockGetUserSubscriptionPlan.mockResolvedValue(null as any)
        mockDb.post.count.mockResolvedValue(2)

        const req = createMockRequest(
          "POST",
          "http://localhost/api/posts",
          { title: "Test Post" }
        )
        const response = await POST(req)

        // Should treat null subscription as free plan
        expect(response.status).toBeLessThan(500)
      })

      it("should handle undefined isPro property gracefully", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockGetUserSubscriptionPlan.mockResolvedValue({
          isPro: undefined as any,
        } as any)
        mockDb.post.count.mockResolvedValue(2)

        const req = createMockRequest(
          "POST",
          "http://localhost/api/posts",
          { title: "Test Post" }
        )
        const response = await POST(req)

        // Should treat undefined isPro as falsy (free plan)
        expect(response.status).toBeLessThan(500)
      })
    })

    describe("Error Boundaries - Validation Errors", () => {
      it("should handle invalid JSON gracefully", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockGetUserSubscriptionPlan.mockResolvedValue({ isPro: true } as any)

        const req = new Request("http://localhost/api/posts", {
          method: "POST",
          body: "invalid json",
          headers: { "Content-Type": "application/json" },
        })

        const response = await POST(req)

        // Should handle JSON parsing error
        expect(response.status).toBeGreaterThanOrEqual(400)
      })

      it("should return 422 for validation errors with structured response", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockGetUserSubscriptionPlan.mockResolvedValue({ isPro: true } as any)

        const req = createMockRequest(
          "POST",
          "http://localhost/api/posts",
          { content: "No title" } // Invalid: missing required title field
        )
        const response = await POST(req)

        assertResponse(response, 422)
        const errors = await getResponseJson(response)
        expect(Array.isArray(errors)).toBe(true)
      })
    })

    describe("Error Boundaries - Business Logic Errors", () => {
      it("should return 402 for RequiresProPlanError", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockGetUserSubscriptionPlan.mockResolvedValue({ isPro: false } as any)
        mockDb.post.count.mockResolvedValue(3)

        const req = createMockRequest(
          "POST",
          "http://localhost/api/posts",
          { title: "Test Post" }
        )
        const response = await POST(req)

        assertResponse(response, 402)
        const text = await response.text()
        expect(text).toBe("Requires Pro Plan")
      })

      it("should handle database errors during count gracefully", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockGetUserSubscriptionPlan.mockResolvedValue({ isPro: false } as any)
        mockDb.post.count.mockRejectedValue(new Error("Database error"))

        const req = createMockRequest(
          "POST",
          "http://localhost/api/posts",
          { title: "Test Post" }
        )
        const response = await POST(req)

        assertResponse(response, 500)
      })

      it("should handle database errors during create gracefully", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockGetUserSubscriptionPlan.mockResolvedValue({ isPro: true } as any)
        mockDb.post.create.mockRejectedValue(new Error("Database error"))

        const req = createMockRequest(
          "POST",
          "http://localhost/api/posts",
          { title: "Test Post" }
        )
        const response = await POST(req)

        assertResponse(response, 500)
      })
    })

    describe("Success Cases", () => {
      it("should create post for pro user", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockGetUserSubscriptionPlan.mockResolvedValue({ isPro: true } as any)
        mockDb.post.create.mockResolvedValue({
          id: "new-post-id",
        } as any)

        const req = createMockRequest(
          "POST",
          "http://localhost/api/posts",
          { title: "Test Post", content: "Test content" }
        )
        const response = await POST(req)

        assertResponse(response, 200)
        const data = await getResponseJson(response)
        expect(data).toEqual({ id: "new-post-id" })
      })

      it("should create post for free user under limit", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockGetUserSubscriptionPlan.mockResolvedValue({ isPro: false } as any)
        mockDb.post.count.mockResolvedValue(2)
        mockDb.post.create.mockResolvedValue({
          id: "new-post-id",
        } as any)

        const req = createMockRequest(
          "POST",
          "http://localhost/api/posts",
          { title: "Test Post" }
        )
        const response = await POST(req)

        assertResponse(response, 200)
      })
    })
  })
})
