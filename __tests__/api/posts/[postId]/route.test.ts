import { DELETE, PATCH } from "@/app/api/posts/[postId]/route"
import {
  createMockRequest,
  createMockPostContext,
  getResponseJson,
  assertResponse,
  TEST_USERS,
} from "@/__tests__/helpers/api-test-helpers"
import { getServerSession } from "next-auth/next"
import { db } from "@/lib/db"

// Mock dependencies
jest.mock("next-auth/next")
jest.mock("@/lib/db", () => ({
  db: {
    post: {
      count: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  },
}))

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>
// Use any for Prisma mocks to avoid complex type issues
const mockDb = db as any

describe("/api/posts/[postId]", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("DELETE /api/posts/[postId]", () => {
    const postId = "test-post-id"

    describe("Null Safety - Session Handling", () => {
      it("should handle null session gracefully", async () => {
        mockGetServerSession.mockResolvedValue(null)

        const req = createMockRequest(
          "DELETE",
          `http://localhost/api/posts/${postId}`
        )
        const context = createMockPostContext(postId)
        const response = await DELETE(req, context)

        assertResponse(response, 403)
      })

      it("should handle session with null user gracefully", async () => {
        mockGetServerSession.mockResolvedValue({
          user: null as any,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        const req = createMockRequest(
          "DELETE",
          `http://localhost/api/posts/${postId}`
        )
        const context = createMockPostContext(postId)
        const response = await DELETE(req, context)

        // Should handle null user without crashing
        expect(response.status).toBeGreaterThanOrEqual(400)
      })

      it("should handle session with undefined user.id gracefully", async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: undefined as any, name: "Test", email: "test@test.com" },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        const req = createMockRequest(
          "DELETE",
          `http://localhost/api/posts/${postId}`
        )
        const context = createMockPostContext(postId)
        const response = await DELETE(req, context)

        // Should handle undefined user.id without crashing
        expect(response.status).toBeGreaterThanOrEqual(400)
      })
    })

    describe("Null Safety - Database Response Handling", () => {
      it("should handle post not found (count = 0)", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockDb.post.count.mockResolvedValue(0)

        const req = createMockRequest(
          "DELETE",
          `http://localhost/api/posts/${postId}`
        )
        const context = createMockPostContext(postId)
        const response = await DELETE(req, context)

        assertResponse(response, 403)
      })

      it("should handle database errors during count gracefully", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockDb.post.count.mockRejectedValue(new Error("Database error"))

        const req = createMockRequest(
          "DELETE",
          `http://localhost/api/posts/${postId}`
        )
        const context = createMockPostContext(postId)
        const response = await DELETE(req, context)

        assertResponse(response, 500)
      })

      it("should handle database errors during delete gracefully", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockDb.post.count.mockResolvedValue(1)
        mockDb.post.delete.mockRejectedValue(new Error("Database error"))

        const req = createMockRequest(
          "DELETE",
          `http://localhost/api/posts/${postId}`
        )
        const context = createMockPostContext(postId)
        const response = await DELETE(req, context)

        assertResponse(response, 500)
      })
    })

    describe("Success Cases", () => {
      it("should delete post when user has access", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockDb.post.count.mockResolvedValue(1)
        mockDb.post.delete.mockResolvedValue({} as any)

        const req = createMockRequest(
          "DELETE",
          `http://localhost/api/posts/${postId}`
        )
        const context = createMockPostContext(postId)
        const response = await DELETE(req, context)

        assertResponse(response, 204)
        expect(mockDb.post.delete).toHaveBeenCalledWith({
          where: { id: postId },
        })
      })
    })
  })

  describe("PATCH /api/posts/[postId]", () => {
    const postId = "test-post-id"

    describe("Null Safety - Session Handling", () => {
      it("should handle null session gracefully", async () => {
        mockGetServerSession.mockResolvedValue(null)

        const req = createMockRequest(
          "PATCH",
          `http://localhost/api/posts/${postId}`,
          { title: "Updated Title" }
        )
        const context = createMockPostContext(postId)
        const response = await PATCH(req, context)

        assertResponse(response, 403)
      })

      it("should handle session with null user gracefully", async () => {
        mockGetServerSession.mockResolvedValue({
          user: null as any,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        const req = createMockRequest(
          "PATCH",
          `http://localhost/api/posts/${postId}`,
          { title: "Updated Title" }
        )
        const context = createMockPostContext(postId)
        const response = await PATCH(req, context)

        // Should handle null user without crashing
        expect(response.status).toBeGreaterThanOrEqual(400)
      })

      it("should handle session with undefined user.id gracefully", async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: undefined as any, name: "Test", email: "test@test.com" },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        const req = createMockRequest(
          "PATCH",
          `http://localhost/api/posts/${postId}`,
          { title: "Updated Title" }
        )
        const context = createMockPostContext(postId)
        const response = await PATCH(req, context)

        // Should handle undefined user.id without crashing
        expect(response.status).toBeGreaterThanOrEqual(400)
      })
    })

    describe("Null Safety - Request Body Handling", () => {
      it("should handle invalid JSON gracefully", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockDb.post.count.mockResolvedValue(1)

        const req = new Request(`http://localhost/api/posts/${postId}`, {
          method: "PATCH",
          body: "invalid json",
          headers: { "Content-Type": "application/json" },
        })
        const context = createMockPostContext(postId)
        const response = await PATCH(req, context)

        // Should handle JSON parsing error
        expect(response.status).toBeGreaterThanOrEqual(400)
      })

      it("should handle empty update object gracefully", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockDb.post.count.mockResolvedValue(1)
        mockDb.post.update.mockResolvedValue({} as any)

        const req = createMockRequest(
          "PATCH",
          `http://localhost/api/posts/${postId}`,
          {}
        )
        const context = createMockPostContext(postId)
        const response = await PATCH(req, context)

        assertResponse(response, 200)
      })

      it("should handle null/undefined fields in update", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockDb.post.count.mockResolvedValue(1)
        mockDb.post.update.mockResolvedValue({} as any)

        const req = createMockRequest(
          "PATCH",
          `http://localhost/api/posts/${postId}`,
          { title: undefined, content: null }
        )
        const context = createMockPostContext(postId)
        const response = await PATCH(req, context)

        assertResponse(response, 200)
      })
    })

    describe("Error Boundaries - Validation Errors", () => {
      it("should return 422 for validation errors", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockDb.post.count.mockResolvedValue(1)

        const req = createMockRequest(
          "PATCH",
          `http://localhost/api/posts/${postId}`,
          { title: "" } // Invalid: empty title
        )
        const context = createMockPostContext(postId)
        const response = await PATCH(req, context)

        assertResponse(response, 422)
        const errors = await getResponseJson(response)
        expect(Array.isArray(errors)).toBe(true)
      })
    })

    describe("Error Boundaries - Database Errors", () => {
      it("should handle post not found (count = 0)", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockDb.post.count.mockResolvedValue(0)

        const req = createMockRequest(
          "PATCH",
          `http://localhost/api/posts/${postId}`,
          { title: "Updated Title" }
        )
        const context = createMockPostContext(postId)
        const response = await PATCH(req, context)

        assertResponse(response, 403)
      })

      it("should handle database errors during update gracefully", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockDb.post.count.mockResolvedValue(1)
        mockDb.post.update.mockRejectedValue(new Error("Database error"))

        const req = createMockRequest(
          "PATCH",
          `http://localhost/api/posts/${postId}`,
          { title: "Updated Title" }
        )
        const context = createMockPostContext(postId)
        const response = await PATCH(req, context)

        assertResponse(response, 500)
      })
    })

    describe("Success Cases", () => {
      it("should update post title when user has access", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockDb.post.count.mockResolvedValue(1)
        mockDb.post.update.mockResolvedValue({} as any)

        const req = createMockRequest(
          "PATCH",
          `http://localhost/api/posts/${postId}`,
          { title: "Updated Title" }
        )
        const context = createMockPostContext(postId)
        const response = await PATCH(req, context)

        assertResponse(response, 200)
        expect(mockDb.post.update).toHaveBeenCalledWith({
          where: { id: postId },
          data: { title: "Updated Title" },
        })
      })

      it("should update post content when user has access", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockDb.post.count.mockResolvedValue(1)
        mockDb.post.update.mockResolvedValue({} as any)

        const req = createMockRequest(
          "PATCH",
          `http://localhost/api/posts/${postId}`,
          { content: "Updated content" }
        )
        const context = createMockPostContext(postId)
        const response = await PATCH(req, context)

        assertResponse(response, 200)
        expect(mockDb.post.update).toHaveBeenCalledWith({
          where: { id: postId },
          data: { content: "Updated content" },
        })
      })

      it("should update both title and content", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetServerSession.mockResolvedValue({
          user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })

        mockDb.post.count.mockResolvedValue(1)
        mockDb.post.update.mockResolvedValue({} as any)

        const req = createMockRequest(
          "PATCH",
          `http://localhost/api/posts/${postId}`,
          { title: "Updated Title", content: "Updated content" }
        )
        const context = createMockPostContext(postId)
        const response = await PATCH(req, context)

        assertResponse(response, 200)
        expect(mockDb.post.update).toHaveBeenCalledWith({
          where: { id: postId },
          data: { title: "Updated Title", content: "Updated content" },
        })
      })
    })
  })
})
