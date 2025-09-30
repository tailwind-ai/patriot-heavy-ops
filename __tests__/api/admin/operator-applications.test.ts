/**
 * Admin Operator Applications API Route Tests
 *
 * Tests GET /api/admin/operator-applications endpoint following TDD principles
 * Following .cursorrules.md Platform Mode standards (Issue #226)
 */

import { GET } from "@/app/api/admin/operator-applications/route"
import { createMockRequest } from "@/__tests__/helpers/api-test-helpers"

// Mock dependencies
jest.mock("@/lib/middleware/mobile-auth")
jest.mock("@/lib/services")

const mockAuthenticateRequest = jest.requireMock(
  "@/lib/middleware/mobile-auth"
).authenticateRequest
const mockHasRole = jest.requireMock("@/lib/middleware/mobile-auth").hasRole
const mockServiceFactory = jest.requireMock("@/lib/services").ServiceFactory

// Mock admin service type
type MockAdminService = {
  getPendingOperatorApplications: jest.MockedFunction<
    (pagination?: unknown) => Promise<unknown>
  >
  logAdminAction: jest.MockedFunction<(...args: unknown[]) => void>
}

describe("GET /api/admin/operator-applications", () => {
  let mockAdminService: MockAdminService

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup mock admin service
    mockAdminService = {
      getPendingOperatorApplications: jest.fn(),
      logAdminAction: jest.fn(),
    }
    mockServiceFactory.getAdminService.mockResolvedValue(mockAdminService)

    // Setup hasRole mock
    mockHasRole.mockImplementation(
      (user: { role?: string } | undefined, role: string) => {
        if (!user?.role) return false
        return user.role === role
      }
    )
  })

  const createOperatorAppsRequest = (params: Record<string, string> = {}) => {
    const url = new URL("http://localhost/api/admin/operator-applications")
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
        error: "No valid authentication found",
      })

      // Act
      const response = await GET(createOperatorAppsRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(data.error).toBe("Authentication required")
    })

    it("should return 403 for non-admin user", async () => {
      // Arrange
      const mockUser = {
        id: "mgr-1",
        email: "manager@test.com",
        role: "MANAGER",
      }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "session",
      })

      // Act
      const response = await GET(createOperatorAppsRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(403)
      expect(data.error).toBe("Admin access required")
    })
  })

  describe("Query Parameter Validation", () => {
    beforeEach(() => {
      const mockUser = { id: "admin-1", email: "admin@test.com", role: "ADMIN" }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "session",
      })
      mockHasRole.mockReturnValue(true)
    })

    it("should return 422 for invalid limit parameter", async () => {
      // Act
      const response = await GET(
        createOperatorAppsRequest({ limit: "invalid" })
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(422)
      expect(data.error).toBe("Invalid query parameters")
    })

    it("should return 422 for limit exceeding maximum", async () => {
      // Act
      const response = await GET(createOperatorAppsRequest({ limit: "150" }))
      const data = await response.json()

      // Assert
      expect(response.status).toBe(422)
      expect(data.error).toBe("Invalid query parameters")
    })

    it("should accept valid pagination parameters", async () => {
      // Arrange
      mockAdminService.getPendingOperatorApplications.mockResolvedValue({
        success: true,
        data: [],
      })

      // Act
      const response = await GET(
        createOperatorAppsRequest({
          limit: "20",
          page: "2",
        })
      )

      // Assert
      expect(response.status).toBe(200)
      expect(
        mockAdminService.getPendingOperatorApplications
      ).toHaveBeenCalledWith({
        limit: 20,
        page: 2,
      })
    })
  })

  describe("Successful Operations", () => {
    beforeEach(() => {
      const mockUser = { id: "admin-1", email: "admin@test.com", role: "ADMIN" }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "session",
      })
      mockHasRole.mockReturnValue(true)
    })

    it("should return pending operator applications", async () => {
      // Arrange
      const mockApplications = [
        {
          id: "user-1",
          email: "applicant1@test.com",
          name: "Applicant One",
          role: "USER",
          militaryBranch: "Navy",
          yearsOfService: 8,
          certifications: ["Heavy Equipment", "Excavator"],
          preferredLocations: ["Florida", "Georgia"],
          createdAt: new Date(),
        },
        {
          id: "user-2",
          email: "applicant2@test.com",
          name: "Applicant Two",
          role: "USER",
          militaryBranch: "Army",
          yearsOfService: 12,
          certifications: ["CDL", "Crane Operator"],
          preferredLocations: ["Texas"],
          createdAt: new Date(),
        },
      ]

      mockAdminService.getPendingOperatorApplications.mockResolvedValue({
        success: true,
        data: mockApplications,
      })

      // Act
      const response = await GET(createOperatorAppsRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(2)
      expect(data.data[0]).toMatchObject({
        id: "user-1",
        email: "applicant1@test.com",
        role: "USER",
        militaryBranch: "Navy",
        yearsOfService: 8,
      })
      expect(data.data[0].certifications).toEqual([
        "Heavy Equipment",
        "Excavator",
      ])
    })

    it("should use default pagination", async () => {
      // Arrange
      mockAdminService.getPendingOperatorApplications.mockResolvedValue({
        success: true,
        data: [],
      })

      // Act
      const response = await GET(createOperatorAppsRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.meta).toMatchObject({
        limit: 50,
        page: 1,
      })
      expect(
        mockAdminService.getPendingOperatorApplications
      ).toHaveBeenCalledWith({
        limit: 50,
        page: 1,
      })
    })

    it("should log admin action", async () => {
      // Arrange
      mockAdminService.getPendingOperatorApplications.mockResolvedValue({
        success: true,
        data: [],
      })

      // Act
      await GET(createOperatorAppsRequest())

      // Assert
      expect(mockAdminService.logAdminAction).toHaveBeenCalledWith(
        "admin-1",
        "OPERATOR_APPLICATIONS_LISTED",
        undefined,
        expect.objectContaining({
          operation: "list_pending_operator_applications",
        })
      )
    })

    it("should handle empty results", async () => {
      // Arrange
      mockAdminService.getPendingOperatorApplications.mockResolvedValue({
        success: true,
        data: [],
      })

      // Act
      const response = await GET(createOperatorAppsRequest())
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
        authMethod: "session",
      })
      mockHasRole.mockReturnValue(true)
    })

    it("should handle service errors gracefully", async () => {
      // Arrange
      mockAdminService.getPendingOperatorApplications.mockResolvedValue({
        success: false,
        error: { message: "Database connection failed" },
      })

      // Act
      const response = await GET(createOperatorAppsRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe("Failed to fetch pending operator applications")
    })

    it("should handle unexpected errors", async () => {
      // Arrange
      mockAdminService.getPendingOperatorApplications.mockRejectedValue(
        new Error("Unexpected error")
      )

      // Act
      const response = await GET(createOperatorAppsRequest())
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
        authMethod: "session",
      })
      mockHasRole.mockReturnValue(true)
      mockAdminService.getPendingOperatorApplications.mockResolvedValue({
        success: true,
        data: [],
      })
    })

    it("should include no-cache headers", async () => {
      // Act
      const response = await GET(createOperatorAppsRequest())

      // Assert
      expect(response.headers.get("Cache-Control")).toBe(
        "no-cache, no-store, must-revalidate"
      )
    })

    it("should include security headers", async () => {
      // Act
      const response = await GET(createOperatorAppsRequest())

      // Assert
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff")
    })
  })
})
