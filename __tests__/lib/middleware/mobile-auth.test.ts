import { getServerSession } from "next-auth/next"
import {
  authenticateRequest,
  requireAuth,
  hasRole,
  requireRole,
} from "@/lib/middleware/mobile-auth"
import { resetDbMocks } from "@/__mocks__/lib/db"
import { createMockRequest } from "@/__tests__/helpers/api-test-helpers"
import { extractBearerToken, verifyToken } from "@/lib/auth-utils"
import { db } from "@/lib/db"

// Mock dependencies
jest.mock("next-auth/next")
jest.mock("@/lib/db")
jest.mock("@/lib/auth-utils")
jest.mock("@/lib/auth")

const mockExtractBearerToken = extractBearerToken as jest.MockedFunction<
  typeof extractBearerToken
>
const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>
const mockDb = db as jest.Mocked<typeof db>

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>

describe("Mobile Authentication Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetDbMocks()
    // Reset mock implementations to default state
    mockExtractBearerToken.mockReturnValue(null)
    mockVerifyToken.mockReturnValue(null)
    mockGetServerSession.mockResolvedValue(null)
    // Don't set a default for database mock - let each test set its own
  })

  describe("authenticateRequest", () => {
    it("should authenticate with valid JWT Bearer token", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        role: "USER",
      }

      // Mock JWT authentication
      const token = "valid.jwt.token"
      mockExtractBearerToken.mockReturnValue(token)
      mockVerifyToken.mockReturnValue({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      })

      // Set up database mock after reset
      mockDb.user.findUnique.mockImplementation((args: any) => {
        if (args.where.id === mockUser.id) {
          return Promise.resolve(mockUser)
        }
        return Promise.resolve(null)
      })

      const req = createMockRequest(
        "GET",
        "http://localhost/api/test",
        undefined,
        {
          authorization: `Bearer ${token}`,
        }
      )

      const result = await authenticateRequest(req)

      expect(result.isAuthenticated).toBe(true)
      expect(result.user).toEqual(mockUser)
      expect(result.authMethod).toBe("jwt")
    })

    it("should fallback to session authentication when no Bearer token", async () => {
      const mockSession = {
        user: {
          id: "user-456",
          email: "session@example.com",
          role: "ADMIN",
        },
      }

      // Mock no Bearer token
      mockExtractBearerToken.mockReturnValue(null)
      mockGetServerSession.mockResolvedValue(mockSession)

      const req = createMockRequest("GET", "http://localhost/api/test")

      const result = await authenticateRequest(req)

      expect(result.isAuthenticated).toBe(true)
      expect(result.user).toEqual({
        id: mockSession.user.id,
        email: mockSession.user.email,
        role: mockSession.user.role,
      })
      expect(result.authMethod).toBe("session")
    })

    it("should return unauthenticated when no valid auth found", async () => {
      // Mock no Bearer token and no session
      mockExtractBearerToken.mockReturnValue(null)
      mockGetServerSession.mockResolvedValue(null)

      const req = createMockRequest("GET", "http://localhost/api/test")

      const result = await authenticateRequest(req)

      expect(result.isAuthenticated).toBe(false)
      expect(result.user).toBeUndefined()
      expect(result.error).toBe("No valid authentication found")
    })

    it("should handle invalid JWT token gracefully", async () => {
      // Mock invalid JWT token
      mockExtractBearerToken.mockReturnValue("invalid.token")
      mockVerifyToken.mockReturnValue(null)
      mockGetServerSession.mockResolvedValue(null)

      const req = createMockRequest("GET", "http://localhost/api/test", {
        headers: {
          authorization: "Bearer invalid.token",
        },
      })

      const result = await authenticateRequest(req)

      expect(result.isAuthenticated).toBe(false)
      expect(result.error).toBe("No valid authentication found")
    })

    it("should handle database errors during JWT auth", async () => {
      // Mock valid JWT token but database error
      mockExtractBearerToken.mockReturnValue("valid.token")
      mockVerifyToken.mockReturnValue({
        userId: "user-123",
        email: "test@example.com",
      })
      // Mock database error - this should cause JWT auth to fail and fallback to session
      mockDb.user.findUnique.mockRejectedValue(new Error("Database error"))
      mockGetServerSession.mockResolvedValue(null)

      const req = createMockRequest("GET", "http://localhost/api/test", {
        headers: {
          authorization: "Bearer valid.token",
        },
      })

      const result = await authenticateRequest(req)

      expect(result.isAuthenticated).toBe(false)
      expect(result.error).toBe("No valid authentication found")
    })

    it("should handle user not found in database", async () => {
      // Mock valid JWT token but user not found
      mockExtractBearerToken.mockReturnValue("valid.token")
      mockVerifyToken.mockReturnValue({
        userId: "nonexistent-user",
        email: "test@example.com",
      })
      // Ensure database returns null for this specific user
      mockDb.user.findUnique.mockImplementation((args: any) => {
        if (args.where.id === "nonexistent-user") {
          return Promise.resolve(null)
        }
        return Promise.resolve(null) // Default to null
      })
      mockGetServerSession.mockResolvedValue(null)

      const req = createMockRequest("GET", "http://localhost/api/test", {
        headers: {
          authorization: "Bearer valid.token",
        },
      })

      const result = await authenticateRequest(req)

      expect(result.isAuthenticated).toBe(false)
      expect(result.error).toBe("No valid authentication found")
    })
  })

  describe("requireAuth", () => {
    it("should return user when authenticated", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        role: "USER",
      }

      // Set up JWT authentication
      mockExtractBearerToken.mockReturnValue("valid.token")
      mockVerifyToken.mockReturnValue({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      })
      mockDb.user.findUnique.mockResolvedValue(mockUser)

      const req = createMockRequest("GET", "http://localhost/api/test", {
        headers: {
          authorization: "Bearer valid.token",
        },
      })

      const user = await requireAuth(req)

      expect(user).toEqual(mockUser)
    })

    it("should throw 401 response when not authenticated", async () => {
      const req = createMockRequest("GET", "http://localhost/api/test")
      // Ensure no authentication methods work
      mockExtractBearerToken.mockReturnValue(null)
      mockVerifyToken.mockReturnValue(null)
      mockGetServerSession.mockResolvedValue(null)
      mockDb.user.findUnique.mockResolvedValue(null)

      try {
        const result = await requireAuth(req)
        fail(
          "requireAuth should have thrown but returned: " +
            JSON.stringify(result)
        )
      } catch (error) {
        expect(error).toBeInstanceOf(Response)
        expect((error as Response).status).toBe(401)
      }
    })
  })

  describe("hasRole", () => {
    it("should return true for exact role match", () => {
      const user = {
        id: "user-123",
        email: "test@example.com",
        role: "MANAGER",
      }

      expect(hasRole(user, "MANAGER")).toBe(true)
    })

    it("should return true for admin role regardless of required role", () => {
      const user = {
        id: "user-123",
        email: "admin@example.com",
        role: "ADMIN",
      }

      expect(hasRole(user, "USER")).toBe(true)
      expect(hasRole(user, "MANAGER")).toBe(true)
    })

    it("should return false for role mismatch", () => {
      const user = {
        id: "user-123",
        email: "test@example.com",
        role: "USER",
      }

      expect(hasRole(user, "MANAGER")).toBe(false)
    })

    it("should return false when user has no role", () => {
      const user = {
        id: "user-123",
        email: "test@example.com",
      }

      expect(hasRole(user, "USER")).toBe(false)
    })

    it("should return false when user is undefined", () => {
      expect(hasRole(undefined, "USER")).toBe(false)
    })
  })

  describe("requireRole", () => {
    it("should return user when role matches", async () => {
      const mockUser = {
        id: "user-123",
        email: "manager@example.com",
        role: "MANAGER",
      }

      // Set up JWT authentication
      mockExtractBearerToken.mockReturnValue("valid.token")
      mockVerifyToken.mockReturnValue({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      })
      mockDb.user.findUnique.mockResolvedValue(mockUser)

      const req = createMockRequest("GET", "http://localhost/api/test", {
        headers: {
          authorization: "Bearer valid.token",
        },
      })

      const user = await requireRole(req, "MANAGER")

      expect(user).toEqual(mockUser)
    })

    it("should throw 403 response when role insufficient", async () => {
      const mockUser = {
        id: "user-123",
        email: "user@example.com",
        role: "USER",
      }

      // Set up JWT authentication with insufficient role
      mockExtractBearerToken.mockReturnValue("valid.token")
      mockVerifyToken.mockReturnValue({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      })
      mockDb.user.findUnique.mockResolvedValue(mockUser)

      const req = createMockRequest("GET", "http://localhost/api/test", {
        headers: {
          authorization: "Bearer valid.token",
        },
      })

      try {
        const result = await requireRole(req, "MANAGER")
        fail(
          "requireRole should have thrown but returned: " +
            JSON.stringify(result)
        )
      } catch (error) {
        expect(error).toBeInstanceOf(Response)
        expect((error as Response).status).toBe(403)
      }
    })

    it("should allow admin role for any required role", async () => {
      const mockUser = {
        id: "user-123",
        email: "admin@example.com",
        role: "ADMIN",
      }

      // Set up JWT authentication with admin role
      mockExtractBearerToken.mockReturnValue("valid.token")
      mockVerifyToken.mockReturnValue({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      })
      mockDb.user.findUnique.mockResolvedValue(mockUser)

      const req = createMockRequest("GET", "http://localhost/api/test", {
        headers: {
          authorization: "Bearer valid.token",
        },
      })

      const user = await requireRole(req, "MANAGER")

      expect(user).toEqual(mockUser)
    })
  })

  describe("Backward compatibility", () => {
    it("should maintain compatibility with existing session-based routes", async () => {
      const mockSession = {
        user: {
          id: "user-789",
          email: "legacy@example.com",
          role: "USER",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      // Request without Bearer token (legacy behavior)
      const req = createMockRequest("GET", "http://localhost/api/legacy")

      const result = await authenticateRequest(req)

      expect(result.isAuthenticated).toBe(true)
      expect(result.authMethod).toBe("session")
      expect(result.user).toEqual({
        id: mockSession.user.id,
        email: mockSession.user.email,
        role: mockSession.user.role,
      })
    })

    it("should prioritize JWT auth over session auth when both present", async () => {
      const mockJwtUser = {
        id: "jwt-user",
        email: "jwt@example.com",
        role: "USER",
      }

      const mockSession = {
        user: {
          id: "session-user",
          email: "session@example.com",
          role: "USER",
        },
      }

      // Set up both JWT and session auth, JWT should take priority
      mockExtractBearerToken.mockReturnValue("valid.token")
      mockVerifyToken.mockReturnValue({
        userId: mockJwtUser.id,
        email: mockJwtUser.email,
        role: mockJwtUser.role,
      })
      mockDb.user.findUnique.mockResolvedValue(mockJwtUser)
      mockGetServerSession.mockResolvedValue(mockSession)

      const req = createMockRequest("GET", "http://localhost/api/test", {
        headers: {
          authorization: "Bearer valid.token",
        },
      })

      const result = await authenticateRequest(req)

      expect(result.isAuthenticated).toBe(true)
      expect(result.authMethod).toBe("jwt")
      expect(result.user?.id).toBe(mockJwtUser.id) // Should use JWT user, not session user
    })
  })
})
