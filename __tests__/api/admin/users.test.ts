/**
 * Admin Users API Route Tests
 * 
 * Tests GET /api/admin/users endpoint following TDD principles
 * Following .cursorrules.md Platform Mode standards (Issue #226)
 */

import { GET } from "@/app/api/admin/users/route"
import { createMockRequest } from "@/__tests__/helpers/api-test-helpers"

// Mock dependencies
jest.mock("@/lib/middleware/mobile-auth")
jest.mock("@/lib/services")

const mockAuthenticateRequest = jest.requireMock("@/lib/middleware/mobile-auth").authenticateRequest
const mockHasRole = jest.requireMock("@/lib/middleware/mobile-auth").hasRole
const mockServiceFactory = jest.requireMock("@/lib/services").ServiceFactory

// Mock admin service type
type MockAdminService = {
  getUsersByRole: jest.MockedFunction<(role: string, pagination?: unknown) => Promise<unknown>>
  logAdminAction: jest.MockedFunction<(...args: unknown[]) => void>
}

describe("GET /api/admin/users", () => {
  let mockAdminService: MockAdminService

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup mock admin service
    mockAdminService = {
      getUsersByRole: jest.fn(),
      logAdminAction: jest.fn(),
    }
    mockServiceFactory.getAdminService.mockResolvedValue(mockAdminService)

    // Setup hasRole mock
    mockHasRole.mockImplementation((user: { role?: string } | undefined, role: string) => {
      if (!user?.role) return false
      return user.role === role
    })
  })

  const createAdminUsersRequest = (params: Record<string, string> = {}) => {
    const url = new URL("http://localhost/api/admin/users")
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
    return createMockRequest("GET", url.toString())
  }

  describe("Authentication & Authorization", () => {
    it("should return 401 for unauthenticated request", async () => {
      // Arrange
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: false,
        error: "No valid authentication found"
      })

      // Act
      const response = await GET(createAdminUsersRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(data.error).toBe("Authentication required")
    })

    it("should return 403 for non-admin user", async () => {
      // Arrange
      const mockUser = { id: "user-1", email: "user@test.com", role: "USER" }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "session"
      })

      // Act
      const response = await GET(createAdminUsersRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(403)
      expect(data.error).toBe("Admin access required")
    })

    it("should return 403 for manager role", async () => {
      // Arrange
      const mockUser = { id: "mgr-1", email: "manager@test.com", role: "MANAGER" }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "session"
      })

      // Act
      const response = await GET(createAdminUsersRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(403)
      expect(data.error).toBe("Admin access required")
    })

    it("should allow access for admin user with JWT token", async () => {
      // Arrange
      const mockUser = { id: "admin-1", email: "admin@test.com", role: "ADMIN" }
      const mockUsers = [
        { id: "user-1", email: "user1@test.com", role: "USER", name: "User One", createdAt: new Date() }
      ]
      
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "jwt"
      })
      mockHasRole.mockReturnValue(true)
      mockAdminService.getUsersByRole.mockResolvedValue({
        success: true,
        data: mockUsers
      })

      // Act
      const response = await GET(createAdminUsersRequest({ role: "USER" }))
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.meta.authMethod).toBe("jwt")
    })
  })

  describe("Query Parameter Validation", () => {
    beforeEach(() => {
      const mockUser = { id: "admin-1", email: "admin@test.com", role: "ADMIN" }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "session"
      })
      mockHasRole.mockReturnValue(true)
    })

    it("should return 422 for invalid role parameter", async () => {
      // Act
      const response = await GET(createAdminUsersRequest({ role: "INVALID_ROLE" }))
      const data = await response.json()

      // Assert
      expect(response.status).toBe(422)
      expect(data.error).toBe("Invalid query parameters")
      expect(data.details).toBeDefined()
    })

    it("should return 422 for invalid limit parameter", async () => {
      // Act
      const response = await GET(createAdminUsersRequest({ role: "USER", limit: "invalid" }))
      const data = await response.json()

      // Assert
      expect(response.status).toBe(422)
      expect(data.error).toBe("Invalid query parameters")
    })

    it("should return 422 for limit exceeding maximum", async () => {
      // Act
      const response = await GET(createAdminUsersRequest({ role: "USER", limit: "200" }))
      const data = await response.json()

      // Assert
      expect(response.status).toBe(422)
      expect(data.error).toBe("Invalid query parameters")
    })

    it("should return 422 for negative page number", async () => {
      // Act
      const response = await GET(createAdminUsersRequest({ role: "USER", page: "-1" }))
      const data = await response.json()

      // Assert
      expect(response.status).toBe(422)
      expect(data.error).toBe("Invalid query parameters")
    })

    it("should accept valid pagination parameters", async () => {
      // Arrange
      mockAdminService.getUsersByRole.mockResolvedValue({
        success: true,
        data: []
      })

      // Act
      const response = await GET(createAdminUsersRequest({ 
        role: "USER", 
        limit: "25",
        page: "2"
      }))

      // Assert
      expect(response.status).toBe(200)
      expect(mockAdminService.getUsersByRole).toHaveBeenCalledWith(
        "USER",
        { limit: 25, page: 2 }
      )
    })
  })

  describe("Successful Operations", () => {
    beforeEach(() => {
      const mockUser = { id: "admin-1", email: "admin@test.com", role: "ADMIN" }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "session"
      })
      mockHasRole.mockReturnValue(true)
    })

    it("should return users by role with default pagination", async () => {
      // Arrange
      const mockUsers = [
        { 
          id: "user-1", 
          email: "user1@test.com", 
          role: "USER", 
          name: "User One",
          phone: "555-0001",
          company: "Company A",
          createdAt: new Date()
        },
        { 
          id: "user-2", 
          email: "user2@test.com", 
          role: "USER", 
          name: "User Two",
          phone: "555-0002",
          company: "Company B",
          createdAt: new Date()
        }
      ]
      
      mockAdminService.getUsersByRole.mockResolvedValue({
        success: true,
        data: mockUsers
      })

      // Act
      const response = await GET(createAdminUsersRequest({ role: "USER" }))
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(2)
      expect(data.data[0]).toMatchObject({
        id: "user-1",
        email: "user1@test.com",
        role: "USER",
        name: "User One",
        phone: "555-0001",
        company: "Company A"
      })
      expect(data.meta).toMatchObject({
        role: "USER",
        limit: 50,
        page: 1
      })
      expect(mockAdminService.getUsersByRole).toHaveBeenCalledWith(
        "USER",
        { limit: 50, page: 1 }
      )
    })

    it("should return operators with operator-specific fields", async () => {
      // Arrange
      const mockOperators = [
        { 
          id: "op-1", 
          email: "op1@test.com", 
          role: "OPERATOR", 
          name: "Operator One",
          militaryBranch: "Army",
          yearsOfService: 10,
          certifications: ["Heavy Equipment", "CDL"],
          preferredLocations: ["Texas", "Oklahoma"],
          isAvailable: true,
          createdAt: new Date()
        }
      ]
      
      mockAdminService.getUsersByRole.mockResolvedValue({
        success: true,
        data: mockOperators
      })

      // Act
      const response = await GET(createAdminUsersRequest({ role: "OPERATOR" }))
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(1)
      expect(data.data[0]).toMatchObject({
        id: "op-1",
        email: "op1@test.com",
        role: "OPERATOR",
        name: "Operator One",
        militaryBranch: "Army",
        yearsOfService: 10,
        isAvailable: true
      })
      expect(data.data[0]).toHaveProperty("militaryBranch")
      expect(data.data[0]).toHaveProperty("certifications")
      expect(data.data[0].certifications).toEqual(["Heavy Equipment", "CDL"])
    })

    it("should include audit log for admin operations", async () => {
      // Arrange
      const mockUser = { id: "admin-1", email: "admin@test.com", role: "ADMIN" }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "session"
      })
      
      mockAdminService.getUsersByRole.mockResolvedValue({
        success: true,
        data: []
      })

      // Act
      await GET(createAdminUsersRequest({ role: "MANAGER" }))

      // Assert
      expect(mockAdminService.logAdminAction).toHaveBeenCalledWith(
        "admin-1",
        "USERS_LISTED",
        undefined,
        expect.objectContaining({
          operation: "list_users_by_role",
          role: "MANAGER"
        })
      )
    })

    it("should handle empty results gracefully", async () => {
      // Arrange
      mockAdminService.getUsersByRole.mockResolvedValue({
        success: true,
        data: []
      })

      // Act
      const response = await GET(createAdminUsersRequest({ role: "ADMIN" }))
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.data).toEqual([])
      expect(Array.isArray(data.data)).toBe(true)
    })
  })

  describe("Error Handling", () => {
    beforeEach(() => {
      const mockUser = { id: "admin-1", email: "admin@test.com", role: "ADMIN" }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "session"
      })
      mockHasRole.mockReturnValue(true)
    })

    it("should handle service errors gracefully", async () => {
      // Arrange
      mockAdminService.getUsersByRole.mockResolvedValue({
        success: false,
        error: { message: "Database connection failed" }
      })

      // Act
      const response = await GET(createAdminUsersRequest({ role: "USER" }))
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe("Failed to fetch users")
      expect(data.details).toBe("Database connection failed")
    })

    it("should handle unexpected errors", async () => {
      // Arrange
      mockAdminService.getUsersByRole.mockRejectedValue(new Error("Unexpected error"))

      // Act
      const response = await GET(createAdminUsersRequest({ role: "USER" }))
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe("Internal server error")
    })

    it("should handle Response errors from middleware", async () => {
      // Arrange
      const mockResponse = new Response(JSON.stringify({ error: "Custom auth error" }), { 
        status: 401 
      })
      mockAuthenticateRequest.mockRejectedValue(mockResponse)

      // Act
      const response = await GET(createAdminUsersRequest({ role: "USER" }))

      // Assert
      expect(response.status).toBe(401)
    })
  })

  describe("Cache and Security Headers", () => {
    beforeEach(() => {
      const mockUser = { id: "admin-1", email: "admin@test.com", role: "ADMIN" }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "session"
      })
      mockHasRole.mockReturnValue(true)
      mockAdminService.getUsersByRole.mockResolvedValue({
        success: true,
        data: []
      })
    })

    it("should include no-cache headers for admin data", async () => {
      // Act
      const response = await GET(createAdminUsersRequest({ role: "USER" }))

      // Assert
      expect(response.headers.get("Cache-Control")).toBe("no-cache, no-store, must-revalidate")
    })

    it("should include security headers", async () => {
      // Act
      const response = await GET(createAdminUsersRequest({ role: "USER" }))

      // Assert
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff")
    })
  })
})
