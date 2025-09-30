/**
 * Admin User Role Update API Route Tests
 * 
 * Tests POST /api/admin/users/[id]/role endpoint following TDD principles
 * Following .cursorrules.md Platform Mode standards (Issue #226)
 */

import { POST } from "@/app/api/admin/users/[userId]/role/route"
import { createMockRequest } from "@/__tests__/helpers/api-test-helpers"

// Mock dependencies
jest.mock("@/lib/middleware/mobile-auth")
jest.mock("@/lib/services")

const mockAuthenticateRequest = jest.requireMock("@/lib/middleware/mobile-auth").authenticateRequest
const mockHasRole = jest.requireMock("@/lib/middleware/mobile-auth").hasRole
const mockServiceFactory = jest.requireMock("@/lib/services").ServiceFactory

// Mock admin service type
type MockAdminService = {
  changeUserRole: jest.MockedFunction<(userId: string, role: string) => Promise<unknown>>
  logAdminAction: jest.MockedFunction<(...args: unknown[]) => void>
}

describe("POST /api/admin/users/[userId]/role", () => {
  let mockAdminService: MockAdminService

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup mock admin service
    mockAdminService = {
      changeUserRole: jest.fn(),
      logAdminAction: jest.fn(),
    }
    mockServiceFactory.getAdminService.mockResolvedValue(mockAdminService)

    // Setup hasRole mock
    mockHasRole.mockImplementation((user: { role?: string } | undefined, role: string) => {
      if (!user?.role) return false
      return user.role === role
    })
  })

  const createRoleUpdateRequest = (userId: string, body: Record<string, unknown>) => {
    const url = `http://localhost/api/admin/users/${userId}/role`
    return createMockRequest("POST", url, body)
  }

  describe("Authentication & Authorization", () => {
    it("should return 401 for unauthenticated request", async () => {
      // Arrange
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: false,
        error: "No valid authentication found"
      })

      // Act
      const response = await POST(
        createRoleUpdateRequest("user-123", { role: "MANAGER" }),
        { params: Promise.resolve({ userId: "user-123" }) }
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(data.error).toBe("Authentication required")
    })

    it("should return 403 for non-admin user", async () => {
      // Arrange
      const mockUser = { id: "user-1", email: "user@test.com", role: "MANAGER" }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "session"
      })

      // Act
      const response = await POST(
        createRoleUpdateRequest("user-123", { role: "OPERATOR" }),
        { params: Promise.resolve({ userId: "user-123" }) }
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(403)
      expect(data.error).toBe("Admin access required")
    })
  })

  describe("Request Validation", () => {
    beforeEach(() => {
      const mockUser = { id: "admin-1", email: "admin@test.com", role: "ADMIN" }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "session"
      })
      mockHasRole.mockReturnValue(true)
    })

    it("should return 422 for missing role in body", async () => {
      // Act
      const response = await POST(
        createRoleUpdateRequest("user-123", {}),
        { params: Promise.resolve({ userId: "user-123" }) }
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(422)
      expect(data.error).toBe("Invalid request body")
      expect(data.details).toBeDefined()
    })

    it("should return 422 for invalid role value", async () => {
      // Act
      const response = await POST(
        createRoleUpdateRequest("user-123", { role: "SUPERADMIN" }),
        { params: Promise.resolve({ userId: "user-123" }) }
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(422)
      expect(data.error).toBe("Invalid request body")
      expect(data.details).toBeDefined()
    })

    it("should return 422 for non-string role", async () => {
      // Act
      const response = await POST(
        createRoleUpdateRequest("user-123", { role: 123 }),
        { params: Promise.resolve({ userId: "user-123" }) }
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(422)
      expect(data.error).toBe("Invalid request body")
    })

    it("should accept all valid role values", async () => {
      // Arrange
      mockAdminService.changeUserRole.mockResolvedValue({
        success: true,
        data: { id: "user-123", role: "USER" }
      })

      const validRoles = ["USER", "OPERATOR", "MANAGER", "ADMIN"]

      for (const role of validRoles) {
        // Act
        const response = await POST(
          createRoleUpdateRequest("user-123", { role }),
          { params: Promise.resolve({ userId: "user-123" }) }
        )

        // Assert
        expect(response.status).toBe(200)
        expect(mockAdminService.changeUserRole).toHaveBeenCalledWith("user-123", role)
        
        jest.clearAllMocks()
        mockAdminService.changeUserRole.mockResolvedValue({
          success: true,
          data: { id: "user-123", role }
        })
      }
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

    it("should successfully change user role", async () => {
      // Arrange
      const updatedUser = {
        id: "user-123",
        email: "user@test.com",
        role: "OPERATOR",
        name: "Test User",
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockAdminService.changeUserRole.mockResolvedValue({
        success: true,
        data: updatedUser
      })

      // Act
      const response = await POST(
        createRoleUpdateRequest("user-123", { role: "OPERATOR" }),
        { params: Promise.resolve({ userId: "user-123" }) }
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.data).toMatchObject({
        id: "user-123",
        email: "user@test.com",
        role: "OPERATOR",
        name: "Test User"
      })
      expect(data.meta).toMatchObject({
        userId: "user-123",
        newRole: "OPERATOR"
      })
    })

    it("should log admin action for role change", async () => {
      // Arrange
      const mockUser = { id: "admin-1", email: "admin@test.com", role: "ADMIN" }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "jwt"
      })

      mockAdminService.changeUserRole.mockResolvedValue({
        success: true,
        data: { id: "user-123", role: "MANAGER" }
      })

      // Act
      await POST(
        createRoleUpdateRequest("user-123", { role: "MANAGER" }),
        { params: Promise.resolve({ userId: "user-123" }) }
      )

      // Assert
      expect(mockAdminService.logAdminAction).toHaveBeenCalledWith(
        "admin-1",
        "USER_ROLE_CHANGED",
        "user-123",
        expect.objectContaining({
          operation: "change_user_role",
          newRole: "MANAGER"
        })
      )
    })

    it("should work with JWT authentication", async () => {
      // Arrange
      const mockUser = { id: "admin-2", email: "admin@test.com", role: "ADMIN" }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "jwt"
      })

      mockAdminService.changeUserRole.mockResolvedValue({
        success: true,
        data: { id: "user-123", role: "USER" }
      })

      // Act
      const response = await POST(
        createRoleUpdateRequest("user-123", { role: "USER" }),
        { params: Promise.resolve({ userId: "user-123" }) }
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.meta.authMethod).toBe("jwt")
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

    it("should handle user not found error", async () => {
      // Arrange
      mockAdminService.changeUserRole.mockResolvedValue({
        success: false,
        error: { 
          code: "USER_NOT_FOUND",
          message: "User not found" 
        }
      })

      // Act
      const response = await POST(
        createRoleUpdateRequest("nonexistent", { role: "OPERATOR" }),
        { params: Promise.resolve({ userId: "nonexistent" }) }
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe("Failed to change user role")
      expect(data.details).toBe("User not found")
    })

    it("should handle service errors gracefully", async () => {
      // Arrange
      mockAdminService.changeUserRole.mockResolvedValue({
        success: false,
        error: { message: "Database error" }
      })

      // Act
      const response = await POST(
        createRoleUpdateRequest("user-123", { role: "ADMIN" }),
        { params: Promise.resolve({ userId: "user-123" }) }
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe("Failed to change user role")
    })

    it("should handle unexpected errors", async () => {
      // Arrange
      mockAdminService.changeUserRole.mockRejectedValue(new Error("Unexpected error"))

      // Act
      const response = await POST(
        createRoleUpdateRequest("user-123", { role: "USER" }),
        { params: Promise.resolve({ userId: "user-123" }) }
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe("Internal server error")
    })

    it("should handle malformed JSON body", async () => {
      // Arrange - simulate malformed JSON by mocking json() to throw
      const req = createRoleUpdateRequest("user-123", { role: "USER" })
      req.json = jest.fn().mockRejectedValue(new Error("Invalid JSON"))

      // Act
      const response = await POST(req, { params: Promise.resolve({ userId: "user-123" }) })
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe("Internal server error")
    })
  })

  describe("Security Headers", () => {
    beforeEach(() => {
      const mockUser = { id: "admin-1", email: "admin@test.com", role: "ADMIN" }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "session"
      })
      mockHasRole.mockReturnValue(true)
      mockAdminService.changeUserRole.mockResolvedValue({
        success: true,
        data: { id: "user-123", role: "USER" }
      })
    })

    it("should include no-cache headers", async () => {
      // Act
      const response = await POST(
        createRoleUpdateRequest("user-123", { role: "USER" }),
        { params: Promise.resolve({ userId: "user-123" }) }
      )

      // Assert
      expect(response.headers.get("Cache-Control")).toBe("no-cache, no-store, must-revalidate")
    })

    it("should include security headers", async () => {
      // Act
      const response = await POST(
        createRoleUpdateRequest("user-123", { role: "USER" }),
        { params: Promise.resolve({ userId: "user-123" }) }
      )

      // Assert
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff")
    })
  })
})
