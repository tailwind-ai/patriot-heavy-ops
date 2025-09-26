/**
 * Dashboard API Routes Integration Tests
 *
 * Tests all four dashboard API endpoints with comprehensive coverage:
 * - Authentication flows (session + JWT)
 * - Role-based access control
 * - Query parameter validation
 * - Error handling
 * - Mobile compatibility
 */

import { NextRequest } from "next/server"
import { GET as getUserDashboard } from "@/app/api/dashboard/user/route"
import { GET as getOperatorDashboard } from "@/app/api/dashboard/operator/route"
import { GET as getManagerDashboard } from "@/app/api/dashboard/manager/route"
import { GET as getAdminDashboard } from "@/app/api/dashboard/admin/route"
import {
  createMockAuthResult,
  createMockDashboardData,
} from "@/__tests__/helpers/mock-data"
import { createMockRequest } from "@/__tests__/helpers/api-test-helpers"

// Mock dependencies
jest.mock("@/lib/middleware/mobile-auth")
jest.mock("@/lib/services")

const mockAuthenticateRequest = jest.requireMock(
  "@/lib/middleware/mobile-auth"
).authenticateRequest
const mockHasRole = jest.requireMock("@/lib/middleware/mobile-auth").hasRole
const mockServiceFactory = jest.requireMock("@/lib/services").ServiceFactory

describe("Dashboard API Routes", () => {
  let mockDashboardService: any

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup mock dashboard service
    mockDashboardService = {
      getDashboardData: jest.fn(),
    }
    mockServiceFactory.getDashboardService.mockReturnValue(mockDashboardService)

    // Setup default auth mock
    mockHasRole.mockImplementation((user: any, role: string) => {
      if (!user?.role) return false
      return user.role === role || user.role === "ADMIN"
    })
  })

  describe("GET /api/dashboard/user", () => {
    const createUserRequest = (params: Record<string, string> = {}) => {
      const url = new URL("http://localhost/api/dashboard/user")
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
      return createMockRequest("GET", url.toString())
    }

    it("should return user dashboard data for authenticated user", async () => {
      // Arrange
      const mockUser = { id: "user-1", email: "user@test.com", role: "USER" }
      const mockDashboardData = createMockDashboardData("USER")

      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "session")
      )
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Act
      const response = await getUserDashboard(createUserRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockDashboardData)
      expect(data.meta.authMethod).toBe("session")
      expect(mockDashboardService.getDashboardData).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "user-1",
          userRole: "USER",
          limit: 10,
          offset: 0,
        }),
        expect.objectContaining({
          enableCaching: true,
          cacheTTL: 300,
        })
      )
    })

    it("should return 401 for unauthenticated request", async () => {
      // Arrange
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: false,
        error: "No valid authentication found",
      })

      // Act
      const response = await getUserDashboard(createUserRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(data.error).toBe("Authentication required")
    })

    it("should validate query parameters", async () => {
      // Arrange
      const mockUser = { id: "user-1", email: "user@test.com", role: "USER" }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "jwt")
      )

      // Act
      const response = await getUserDashboard(
        createUserRequest({ limit: "invalid" })
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(422)
      expect(data.error).toBe("Invalid query parameters")
      expect(data.details).toBeDefined()
    })

    it("should handle service errors gracefully", async () => {
      // Arrange
      const mockUser = { id: "user-1", email: "user@test.com", role: "USER" }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "session")
      )
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: false,
        error: { message: "Database connection failed" },
      })

      // Act
      const response = await getUserDashboard(createUserRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe("Failed to fetch dashboard data")
    })
  })

  describe("GET /api/dashboard/operator", () => {
    const createOperatorRequest = (params: Record<string, string> = {}) => {
      const url = new URL("http://localhost/api/dashboard/operator")
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
      return createMockRequest("GET", url.toString())
    }

    it("should return operator dashboard data for operator user", async () => {
      // Arrange
      const mockUser = {
        id: "op-1",
        email: "operator@test.com",
        role: "OPERATOR",
      }
      const mockDashboardData = createMockDashboardData("OPERATOR")

      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "jwt")
      )
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Act
      const response = await getOperatorDashboard(createOperatorRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockDashboardData)
      expect(data.meta.userRole).toBe("OPERATOR")
      expect(mockDashboardService.getDashboardData).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "op-1",
          userRole: "OPERATOR",
        }),
        expect.objectContaining({
          cacheTTL: 180,
        })
      )
    })

    it("should return 403 for non-operator user", async () => {
      // Arrange
      const mockUser = { id: "user-1", email: "user@test.com", role: "USER" }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "session")
      )

      // Act
      const response = await getOperatorDashboard(createOperatorRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(403)
      expect(data.error).toBe("Operator access required")
    })

    it("should allow admin access to operator endpoint", async () => {
      // Arrange
      const mockUser = { id: "admin-1", email: "admin@test.com", role: "ADMIN" }
      const mockDashboardData = createMockDashboardData("OPERATOR")

      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "session")
      )
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Act
      const response = await getOperatorDashboard(createOperatorRequest())

      // Assert
      expect(response.status).toBe(200)
    })
  })

  describe("GET /api/dashboard/manager", () => {
    const createManagerRequest = (params: Record<string, string> = {}) => {
      const url = new URL("http://localhost/api/dashboard/manager")
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
      return new NextRequest(url.toString())
    }

    it("should return manager dashboard data with date range", async () => {
      // Arrange
      const mockUser = {
        id: "mgr-1",
        email: "manager@test.com",
        role: "MANAGER",
      }
      const mockDashboardData = createMockDashboardData("MANAGER")

      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "session")
      )
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const startDate = "2024-01-01"
      const endDate = "2024-01-31"

      // Act
      const response = await getManagerDashboard(
        createManagerRequest({ startDate, endDate })
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.meta.dateRange).toEqual({
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      })
      expect(mockDashboardService.getDashboardData).toHaveBeenCalledWith(
        expect.objectContaining({
          userRole: "MANAGER",
          dateRange: {
            start: new Date(startDate),
            end: new Date(endDate),
          },
        }),
        expect.any(Object)
      )
    })

    it("should validate date range parameters", async () => {
      // Arrange
      const mockUser = {
        id: "mgr-1",
        email: "manager@test.com",
        role: "MANAGER",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "session")
      )

      // Act - invalid date range (start after end)
      const response = await getManagerDashboard(
        createManagerRequest({
          startDate: "2024-01-31",
          endDate: "2024-01-01",
        })
      )
      const data = await response.json()

      // Assert
      expect(response.status).toBe(422)
      expect(data.error).toContain("Invalid date range")
    })

    it("should return 403 for non-manager user", async () => {
      // Arrange
      const mockUser = {
        id: "op-1",
        email: "operator@test.com",
        role: "OPERATOR",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "jwt")
      )

      // Act
      const response = await getManagerDashboard(createManagerRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(403)
      expect(data.error).toBe("Manager access required")
    })
  })

  describe("GET /api/dashboard/admin", () => {
    const createAdminRequest = (params: Record<string, string> = {}) => {
      const url = new URL("http://localhost/api/dashboard/admin")
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
      return new NextRequest(url.toString())
    }

    it("should return admin dashboard data with security headers", async () => {
      // Arrange
      const mockUser = { id: "admin-1", email: "admin@test.com", role: "ADMIN" }
      const mockDashboardData = createMockDashboardData("ADMIN")

      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "jwt")
      )
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Act
      const response = await getAdminDashboard(createAdminRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockDashboardData)
      expect(data.meta.timestamp).toBeDefined()
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff")
      expect(response.headers.get("X-Frame-Options")).toBe("DENY")
      expect(response.headers.get("X-XSS-Protection")).toBe("1; mode=block")
    })

    it("should return 403 for non-admin user", async () => {
      // Arrange
      const mockUser = {
        id: "mgr-1",
        email: "manager@test.com",
        role: "MANAGER",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "session")
      )

      // Act
      const response = await getAdminDashboard(createAdminRequest())
      const data = await response.json()

      // Assert
      expect(response.status).toBe(403)
      expect(data.error).toBe("Admin access required")
    })

    it("should use shortest cache TTL for admin data", async () => {
      // Arrange
      const mockUser = { id: "admin-1", email: "admin@test.com", role: "ADMIN" }
      const mockDashboardData = createMockDashboardData("ADMIN")

      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "session")
      )
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Act
      const response = await getAdminDashboard(createAdminRequest())

      // Assert
      expect(response.status).toBe(200)
      expect(response.headers.get("Cache-Control")).toBe("private, max-age=60")
      expect(mockDashboardService.getDashboardData).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          cacheTTL: 60,
        })
      )
    })
  })

  describe("Mobile JWT Compatibility", () => {
    it("should work with JWT tokens across all endpoints", async () => {
      // Arrange
      const mockUser = {
        id: "mobile-1",
        email: "mobile@test.com",
        role: "ADMIN",
      }
      const mockDashboardData = createMockDashboardData("ADMIN")

      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "jwt")
      )
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Act & Assert - Test all endpoints with JWT
      const endpoints = [
        {
          handler: getUserDashboard,
          url: "http://localhost/api/dashboard/user",
        },
        {
          handler: getOperatorDashboard,
          url: "http://localhost/api/dashboard/operator",
        },
        {
          handler: getManagerDashboard,
          url: "http://localhost/api/dashboard/manager",
        },
        {
          handler: getAdminDashboard,
          url: "http://localhost/api/dashboard/admin",
        },
      ]

      for (const endpoint of endpoints) {
        const request = createMockRequest("GET", endpoint.url)
        const response = await endpoint.handler(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.meta.authMethod).toBe("jwt")
      }
    })

    it("should handle caching parameters for mobile apps", async () => {
      // Arrange
      const mockUser = {
        id: "mobile-1",
        email: "mobile@test.com",
        role: "USER",
      }
      const mockDashboardData = createMockDashboardData("USER")

      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "jwt")
      )
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Act - Disable caching for mobile offline scenarios
      const url = new URL("http://localhost/api/dashboard/user")
      url.searchParams.set("enableCaching", "false")
      const request = createMockRequest("GET", url.toString())

      const response = await getUserDashboard(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.meta.cached).toBe(false)
      expect(response.headers.get("Cache-Control")).toBe(
        "no-cache, no-store, must-revalidate"
      )
    })
  })

  describe("Error Handling", () => {
    it("should handle middleware Response errors", async () => {
      // Arrange
      const mockResponse = new Response("Custom auth error", { status: 401 })
      mockAuthenticateRequest.mockRejectedValue(mockResponse)

      // Act
      const request = new NextRequest("http://localhost/api/dashboard/user")
      const response = await getUserDashboard(request)

      // Assert
      expect(response.status).toBe(401)
      expect(await response.text()).toBe("Custom auth error")
    })

    it("should handle unexpected errors", async () => {
      // Arrange
      mockAuthenticateRequest.mockRejectedValue(new Error("Unexpected error"))

      // Act
      const request = new NextRequest("http://localhost/api/dashboard/user")
      const response = await getUserDashboard(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe("Internal server error")
    })
  })
})
