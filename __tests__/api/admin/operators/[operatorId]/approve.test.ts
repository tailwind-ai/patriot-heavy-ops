/**
 * Admin Operator Approval API Route Tests
 * 
 * Tests POST /api/admin/operators/[operatorId]/approve endpoint following TDD principles
 * Following .cursorrules.md Platform Mode standards (Issue #226)
 */

import { POST } from "@/app/api/admin/operators/[operatorId]/approve/route"
import { createMockRequest } from "@/__tests__/helpers/api-test-helpers"

// Mock dependencies
jest.mock("@/lib/middleware/mobile-auth")
jest.mock("@/lib/services")

const mockAuthenticateRequest = jest.requireMock("@/lib/middleware/mobile-auth").authenticateRequest
const mockHasRole = jest.requireMock("@/lib/middleware/mobile-auth").hasRole
const mockServiceFactory = jest.requireMock("@/lib/services").ServiceFactory

// Mock admin service type
type MockAdminService = {
  approveOperatorApplication: jest.MockedFunction<(operatorId: string) => Promise<unknown>>
  logAdminAction: jest.MockedFunction<(...args: unknown[]) => void>
}

describe("POST /api/admin/operators/[operatorId]/approve", () => {
  let mockAdminService: MockAdminService

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup mock admin service
    mockAdminService = {
      approveOperatorApplication: jest.fn(),
      logAdminAction: jest.fn(),
    }
    mockServiceFactory.getAdminService.mockResolvedValue(mockAdminService)

    // Setup hasRole mock
    mockHasRole.mockImplementation((user: { role?: string } | undefined, role: string) => {
      if (!user?.role) return false
      return user.role === role
    })
  })

  const createApproveRequest = (operatorId: string) => {
    const url = `http://localhost/api/admin/operators/${operatorId}/approve`
    return createMockRequest("POST", url, {})
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
        createApproveRequest("user-123"),
        { params: Promise.resolve({ operatorId: "user-123" }) }
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
        createApproveRequest("user-123"),
        { params: Promise.resolve({ operatorId: "user-123" }) }
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(403)
      expect(data.error).toBe("Admin access required")
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

    it("should successfully approve operator application", async () => {
      // Arrange
      const approvedOperator = {
        id: "user-123",
        email: "operator@test.com",
        role: "OPERATOR",
        name: "New Operator",
        militaryBranch: "Navy",
        yearsOfService: 10,
        certifications: ["Heavy Equipment"],
        preferredLocations: ["Florida"],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockAdminService.approveOperatorApplication.mockResolvedValue({
        success: true,
        data: approvedOperator
      })

      // Act
      const response = await POST(
        createApproveRequest("user-123"),
        { params: Promise.resolve({ operatorId: "user-123" }) }
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.data).toMatchObject({
        id: "user-123",
        email: "operator@test.com",
        role: "OPERATOR",
        isAvailable: true
      })
      expect(data.meta).toMatchObject({
        operatorId: "user-123"
      })
    })

    it("should log admin action for approval", async () => {
      // Arrange
      mockAdminService.approveOperatorApplication.mockResolvedValue({
        success: true,
        data: { id: "user-123", role: "OPERATOR" }
      })

      // Act
      await POST(
        createApproveRequest("user-123"),
        { params: Promise.resolve({ operatorId: "user-123" }) }
      )

      // Assert
      expect(mockAdminService.logAdminAction).toHaveBeenCalledWith(
        "admin-1",
        "OPERATOR_APPLICATION_APPROVED",
        "user-123",
        expect.objectContaining({
          operation: "approve_operator_application"
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

      mockAdminService.approveOperatorApplication.mockResolvedValue({
        success: true,
        data: { id: "user-123", role: "OPERATOR" }
      })

      // Act
      const response = await POST(
        createApproveRequest("user-123"),
        { params: Promise.resolve({ operatorId: "user-123" }) }
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.meta.authMethod).toBe("jwt")
    })
  })

  describe("Business Rule Validation", () => {
    beforeEach(() => {
      const mockUser = { id: "admin-1", email: "admin@test.com", role: "ADMIN" }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "session"
      })
      mockHasRole.mockReturnValue(true)
    })

    it("should return 400 for incomplete application", async () => {
      // Arrange
      mockAdminService.approveOperatorApplication.mockResolvedValue({
        success: false,
        error: { 
          code: "INVALID_APPLICATION",
          message: "Cannot approve application with incomplete application data" 
        }
      })

      // Act
      const response = await POST(
        createApproveRequest("user-123"),
        { params: Promise.resolve({ operatorId: "user-123" }) }
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe("Invalid application")
      expect(data.details).toContain("incomplete")
    })

    it("should return 404 for user not found", async () => {
      // Arrange
      mockAdminService.approveOperatorApplication.mockResolvedValue({
        success: false,
        error: { 
          code: "USER_NOT_FOUND",
          message: "User not found" 
        }
      })

      // Act
      const response = await POST(
        createApproveRequest("nonexistent"),
        { params: Promise.resolve({ operatorId: "nonexistent" }) }
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(404)
      expect(data.error).toBe("User not found")
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
      mockAdminService.approveOperatorApplication.mockResolvedValue({
        success: false,
        error: { 
          code: "DATABASE_ERROR",
          message: "Database error" 
        }
      })

      // Act
      const response = await POST(
        createApproveRequest("user-123"),
        { params: Promise.resolve({ operatorId: "user-123" }) }
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe("Failed to approve operator application")
    })

    it("should handle unexpected errors", async () => {
      // Arrange
      mockAdminService.approveOperatorApplication.mockRejectedValue(
        new Error("Unexpected error")
      )

      // Act
      const response = await POST(
        createApproveRequest("user-123"),
        { params: Promise.resolve({ operatorId: "user-123" }) }
      )
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
      mockAdminService.approveOperatorApplication.mockResolvedValue({
        success: true,
        data: { id: "user-123", role: "OPERATOR" }
      })
    })

    it("should include no-cache headers", async () => {
      // Act
      const response = await POST(
        createApproveRequest("user-123"),
        { params: Promise.resolve({ operatorId: "user-123" }) }
      )

      // Assert
      expect(response.headers.get("Cache-Control")).toBe("no-cache, no-store, must-revalidate")
    })

    it("should include security headers", async () => {
      // Act
      const response = await POST(
        createApproveRequest("user-123"),
        { params: Promise.resolve({ operatorId: "user-123" }) }
      )

      // Assert
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff")
    })
  })
})
