/**
 * Admin Metrics API Route Tests
 *
 * Tests GET /api/admin/metrics endpoint following TDD principles
 * Following .cursorrules.md Platform Mode standards (Issue #226)
 */

import { GET } from "@/app/api/admin/metrics/route"
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
  getSystemMetrics: jest.MockedFunction<
    (dateRange?: unknown) => Promise<unknown>
  >
  logAdminAction: jest.MockedFunction<(...args: unknown[]) => void>
}

describe("GET /api/admin/metrics", () => {
  let mockAdminService: MockAdminService

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup mock admin service
    mockAdminService = {
      getSystemMetrics: jest.fn(),
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

  const createMetricsRequest = (params: Record<string, string> = {}) => {
    const url = new URL("http://localhost/api/admin/metrics")
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
      const response = await GET(createMetricsRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(data.error).toBe("Authentication required")
    })

    it("should return 403 for non-admin user", async () => {
      // Arrange
      const mockUser = {
        id: "user-1",
        email: "user@test.com",
        role: "OPERATOR",
      }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "session",
      })

      // Act
      const response = await GET(createMetricsRequest())
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

    it("should return 422 for invalid startDate", async () => {
      // Act
      const response = await GET(
        createMetricsRequest({ startDate: "invalid-date" })
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(422)
      expect(data.error).toBe("Invalid query parameters")
    })

    it("should return 422 for invalid endDate", async () => {
      // Act
      const response = await GET(
        createMetricsRequest({ endDate: "not-a-date" })
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(422)
      expect(data.error).toBe("Invalid query parameters")
    })

    it("should return 422 when startDate is after endDate", async () => {
      // Act
      const response = await GET(
        createMetricsRequest({
          startDate: "2024-12-31",
          endDate: "2024-01-01",
        })
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(422)
      expect(data.error).toContain("Invalid date range")
    })

    it("should accept valid date range", async () => {
      // Arrange
      mockAdminService.getSystemMetrics.mockResolvedValue({
        success: true,
        data: { totalUsers: 0, usersByRole: {}, serviceRequests: {} },
      })

      // Act
      const response = await GET(
        createMetricsRequest({
          startDate: "2024-01-01",
          endDate: "2024-12-31",
        })
      )

      // Assert
      expect(response.status).toBe(200)
      expect(mockAdminService.getSystemMetrics).toHaveBeenCalledWith({
        start: new Date("2024-01-01"),
        end: new Date("2024-12-31"),
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

    it("should return system metrics without date range", async () => {
      // Arrange
      const mockMetrics = {
        totalUsers: 150,
        usersByRole: {
          USER: 100,
          OPERATOR: 30,
          MANAGER: 15,
          ADMIN: 5,
        },
        serviceRequests: {
          total: 250,
          active: 45,
          completed: 180,
          cancelled: 25,
          averageCompletionTime: 72.5,
          totalRevenue: 125000,
        },
      }

      mockAdminService.getSystemMetrics.mockResolvedValue({
        success: true,
        data: mockMetrics,
      })

      // Act
      const response = await GET(createMetricsRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockMetrics)
      expect(data.meta).toHaveProperty("timestamp")
      expect(mockAdminService.getSystemMetrics).toHaveBeenCalledWith(undefined)
    })

    it("should return metrics with date range filtering", async () => {
      // Arrange
      const mockMetrics = {
        totalUsers: 150,
        usersByRole: {
          USER: 100,
          OPERATOR: 30,
          MANAGER: 15,
          ADMIN: 5,
        },
        serviceRequests: {
          total: 50,
          active: 10,
          completed: 35,
          cancelled: 5,
        },
      }

      mockAdminService.getSystemMetrics.mockResolvedValue({
        success: true,
        data: mockMetrics,
      })

      // Act
      const response = await GET(
        createMetricsRequest({
          startDate: "2024-06-01",
          endDate: "2024-06-30",
        })
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockMetrics)
      expect(data.meta.dateRange).toBeDefined()
      expect(data.meta.dateRange.start).toBeDefined()
      expect(data.meta.dateRange.end).toBeDefined()
    })

    it("should log admin action for metrics access", async () => {
      // Arrange
      mockAdminService.getSystemMetrics.mockResolvedValue({
        success: true,
        data: { totalUsers: 0, usersByRole: {}, serviceRequests: {} },
      })

      // Act
      await GET(createMetricsRequest())

      // Assert
      expect(mockAdminService.logAdminAction).toHaveBeenCalledWith(
        "admin-1",
        "SYSTEM_METRICS_ACCESSED",
        undefined,
        expect.objectContaining({
          operation: "get_system_metrics",
        })
      )
    })

    it("should work with JWT authentication", async () => {
      // Arrange
      const mockUser = { id: "admin-2", email: "admin@test.com", role: "ADMIN" }
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
        authMethod: "jwt",
      })

      mockAdminService.getSystemMetrics.mockResolvedValue({
        success: true,
        data: { totalUsers: 100, usersByRole: {}, serviceRequests: {} },
      })

      // Act
      const response = await GET(createMetricsRequest())
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
        authMethod: "session",
      })
      mockHasRole.mockReturnValue(true)
    })

    it("should handle service errors gracefully", async () => {
      // Arrange
      mockAdminService.getSystemMetrics.mockResolvedValue({
        success: false,
        error: { message: "Database connection failed" },
      })

      // Act
      const response = await GET(createMetricsRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe("Failed to fetch system metrics")
      expect(data.details).toBe("Database connection failed")
    })

    it("should handle unexpected errors", async () => {
      // Arrange
      mockAdminService.getSystemMetrics.mockRejectedValue(
        new Error("Unexpected error")
      )

      // Act
      const response = await GET(createMetricsRequest())
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
      mockAdminService.getSystemMetrics.mockResolvedValue({
        success: true,
        data: { totalUsers: 0, usersByRole: {}, serviceRequests: {} },
      })
    })

    it("should include no-cache headers", async () => {
      // Act
      const response = await GET(createMetricsRequest())

      // Assert
      expect(response.headers.get("Cache-Control")).toBe(
        "no-cache, no-store, must-revalidate"
      )
    })

    it("should include security headers", async () => {
      // Act
      const response = await GET(createMetricsRequest())

      // Assert
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff")
    })
  })
})
