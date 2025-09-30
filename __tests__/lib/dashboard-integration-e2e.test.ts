/**
 * Dashboard End-to-End Integration Tests
 *
 * Comprehensive integration testing for dashboard functionality:
 * - Complete workflow testing (API → Service → Database)
 * - Role-based access control validation
 * - Performance benchmarking
 * - Security testing
 * - Mobile compatibility validation
 *
 * Following integration testing patterns from Issue #217
 */

import { GET as getUserDashboard } from "@/app/api/dashboard/user/route"
import { GET as getOperatorDashboard } from "@/app/api/dashboard/operator/route"
import { GET as getManagerDashboard } from "@/app/api/dashboard/manager/route"
import { GET as getAdminDashboard } from "@/app/api/dashboard/admin/route"
import { DashboardService } from "@/lib/services/dashboard-service"
import { db } from "@/lib/db"
import {
  createMockAuthResult,
  createMockDashboardData,
} from "@/__tests__/helpers/mock-data"
import { createMockRequest } from "@/__tests__/helpers/api-test-helpers"

// Mock dependencies
jest.mock("@/lib/middleware/mobile-auth")
jest.mock("@/lib/services")
jest.mock("@/lib/db", () => ({
  db: {
    serviceRequest: {
      count: jest.fn(),
      findMany: jest.fn(),
      aggregate: jest.fn(),
    },
    userAssignment: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
    },
  },
}))

const mockAuthenticateRequest = jest.requireMock(
  "@/lib/middleware/mobile-auth"
).authenticateRequest
const mockHasRole = jest.requireMock("@/lib/middleware/mobile-auth").hasRole
const mockServiceFactory = jest.requireMock("@/lib/services").ServiceFactory

type MockDashboardService = {
  getDashboardData: jest.MockedFunction<
    (
      options: Record<string, unknown>,
      cacheOptions?: Record<string, unknown>
    ) => Promise<unknown>
  >
}

describe("Dashboard End-to-End Integration Tests", () => {
  let mockDashboardService: MockDashboardService

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup mock dashboard service
    mockDashboardService = {
      getDashboardData: jest.fn(),
    }
    mockServiceFactory.getDashboardService.mockReturnValue(mockDashboardService)

    // Setup default auth mock
    mockHasRole.mockImplementation(
      (user: { role?: string } | null, role: string) => {
        if (!user?.role) return false
        return user.role === role || user.role === "ADMIN"
      }
    )

    // Setup default database mocks
    ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(0)
    ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])
    ;(db.serviceRequest.aggregate as jest.Mock).mockResolvedValue({
      _sum: { estimatedCost: null },
      _avg: { requestedTotalHours: null },
    })
    ;(db.userAssignment.count as jest.Mock).mockResolvedValue(0)
    ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])
    ;(db.user.findMany as jest.Mock).mockResolvedValue([])
  })

  describe("End-to-End Dashboard Workflow Integration", () => {
    it("should complete full USER dashboard workflow from API to database", async () => {
      // Arrange: Setup complete workflow
      const mockUser = { id: "e2e-user-1", email: "user@e2e.com", role: "USER" }
      const mockRequests = [
        {
          id: "req-1",
          title: "E2E Test Request",
          status: "SUBMITTED",
          equipmentCategory: "EXCAVATORS",
          jobSite: "E2E Test Site",
          startDate: new Date("2024-01-15"),
          endDate: null,
          requestedDurationType: "FULL_DAY",
          requestedDurationValue: 1,
          requestedTotalHours: 8,
          estimatedCost: 750,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "session")
      )
      ;(db.serviceRequest.count as jest.Mock)
        .mockResolvedValueOnce(5) // totalRequests
        .mockResolvedValueOnce(3) // activeRequests
        .mockResolvedValueOnce(2) // completedRequests
        .mockResolvedValueOnce(1) // pendingApproval
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue(mockRequests)

      // Create real dashboard service to test service layer integration
      const realDashboardService = new DashboardService()
      mockServiceFactory.getDashboardService.mockReturnValue(
        realDashboardService
      )

      // Act: Execute full workflow
      const url = new URL("http://localhost/api/dashboard/user")
      const request = createMockRequest("GET", url.toString())
      const response = await getUserDashboard(request)
      const data = await response.json()

      // Assert: Validate complete workflow
      expect(response.status).toBe(200)
      expect(data.data).toBeDefined()
      expect(data.data.stats).toEqual({
        totalRequests: 5,
        activeRequests: 3,
        completedRequests: 2,
        pendingApproval: 1,
      })
      expect(data.data.recentRequests).toHaveLength(1)
      expect(data.data.recentRequests[0]).toMatchObject({
        id: "req-1",
        title: "E2E Test Request",
        status: "SUBMITTED",
      })
      expect(data.meta.authMethod).toBe("session")
      // Note: USER endpoint doesn't include userRole in meta (unlike other endpoints)
      expect(data.meta.cached).toBe(true)
    })

    it("should complete full OPERATOR dashboard workflow with assignments", async () => {
      // Arrange
      const mockOperator = {
        id: "e2e-op-1",
        email: "operator@e2e.com",
        role: "OPERATOR",
      }
      const mockAssignments = [
        {
          id: "assign-1",
          serviceRequestId: "req-1",
          operatorId: "e2e-op-1",
          assignedAt: new Date(),
          status: "ACTIVE",
          serviceRequest: {
            title: "Operator Assignment Test",
            jobSite: "Assignment Site",
            startDate: new Date(),
            endDate: null,
            status: "OPERATOR_ASSIGNED",
          },
        },
      ]

      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockOperator, "jwt")
      )
      ;(db.userAssignment.count as jest.Mock)
        .mockResolvedValueOnce(10) // totalAssignments
        .mockResolvedValueOnce(5) // activeAssignments
        .mockResolvedValueOnce(4) // completedAssignments
      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(2) // ownRequests
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])
      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue(
        mockAssignments
      )

      const realDashboardService = new DashboardService()
      mockServiceFactory.getDashboardService.mockReturnValue(
        realDashboardService
      )

      // Act
      const url = new URL("http://localhost/api/dashboard/operator")
      const request = createMockRequest("GET", url.toString())
      const response = await getOperatorDashboard(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.data.stats.totalRequests).toBe(12) // 10 assignments + 2 own requests
      expect(data.data.stats.activeRequests).toBe(5)
      expect(data.data.assignments).toHaveLength(1)
      expect(data.meta.authMethod).toBe("jwt")
    })

    it("should complete full MANAGER dashboard workflow with date filtering", async () => {
      // Arrange
      const mockManager = {
        id: "e2e-mgr-1",
        email: "manager@e2e.com",
        role: "MANAGER",
      }
      const startDate = "2024-01-01"
      const endDate = "2024-01-31"

      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockManager, "session")
      )
      ;(db.serviceRequest.count as jest.Mock)
        .mockResolvedValueOnce(100) // totalRequests
        .mockResolvedValueOnce(60) // activeRequests
        .mockResolvedValueOnce(35) // completedRequests
        .mockResolvedValueOnce(10) // pendingApproval
      ;(db.serviceRequest.aggregate as jest.Mock).mockResolvedValue({
        _sum: { estimatedCost: 50000 },
      })
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])
      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])

      const realDashboardService = new DashboardService()
      mockServiceFactory.getDashboardService.mockReturnValue(
        realDashboardService
      )

      // Act
      const url = new URL("http://localhost/api/dashboard/manager")
      url.searchParams.set("startDate", startDate)
      url.searchParams.set("endDate", endDate)
      const request = createMockRequest("GET", url.toString())
      const response = await getManagerDashboard(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.data.stats.revenue).toBe(50000)
      expect(data.meta.dateRange).toBeDefined()
      expect(data.meta.dateRange.startDate).toBe(
        new Date(startDate).toISOString()
      )
      expect(data.meta.dateRange.endDate).toBe(new Date(endDate).toISOString())

      // Verify database was called with date filtering
      expect(db.serviceRequest.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }),
        })
      )
    })

    it("should complete full ADMIN dashboard workflow with all data", async () => {
      // Arrange
      const mockAdmin = {
        id: "e2e-admin-1",
        email: "admin@e2e.com",
        role: "ADMIN",
      }
      const mockUsers = [
        {
          id: "user-1",
          name: "Recent User",
          email: "recent@test.com",
          role: "USER",
          company: "Test Co",
          createdAt: new Date(),
        },
      ]

      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockAdmin, "jwt")
      )
      ;(db.serviceRequest.count as jest.Mock)
        .mockResolvedValueOnce(250) // totalRequests
        .mockResolvedValueOnce(150) // activeRequests
        .mockResolvedValueOnce(90) // completedRequests
        .mockResolvedValueOnce(15) // pendingApproval
      ;(db.serviceRequest.aggregate as jest.Mock)
        .mockResolvedValueOnce({ _sum: { estimatedCost: 125000 } })
        .mockResolvedValueOnce({ _avg: { requestedTotalHours: 24 } })
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])
      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])
      ;(db.user.findMany as jest.Mock).mockResolvedValue(mockUsers)

      const realDashboardService = new DashboardService()
      mockServiceFactory.getDashboardService.mockReturnValue(
        realDashboardService
      )

      // Act
      const url = new URL("http://localhost/api/dashboard/admin")
      const request = createMockRequest("GET", url.toString())
      const response = await getAdminDashboard(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.data.stats.revenue).toBe(125000)
      expect(data.data.stats.averageJobDuration).toBe(24)
      expect(data.data.users).toHaveLength(1)
      expect(data.data.users[0]).toMatchObject({
        id: "user-1",
        name: "Recent User",
        email: "recent@test.com",
      })
      // Verify security headers
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff")
      expect(response.headers.get("X-Frame-Options")).toBe("DENY")
    })
  })

  describe("Role-Based Access Control Integration", () => {
    it("should enforce USER role cannot access OPERATOR endpoint", async () => {
      const mockUser = { id: "user-1", email: "user@test.com", role: "USER" }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "session")
      )

      const url = new URL("http://localhost/api/dashboard/operator")
      const request = createMockRequest("GET", url.toString())
      const response = await getOperatorDashboard(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe("Operator access required")
    })

    it("should enforce OPERATOR role cannot access MANAGER endpoint", async () => {
      const mockOperator = {
        id: "op-1",
        email: "operator@test.com",
        role: "OPERATOR",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockOperator, "jwt")
      )

      const url = new URL("http://localhost/api/dashboard/manager")
      const request = createMockRequest("GET", url.toString())
      const response = await getManagerDashboard(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe("Manager access required")
    })

    it("should enforce MANAGER role cannot access ADMIN endpoint", async () => {
      const mockManager = {
        id: "mgr-1",
        email: "manager@test.com",
        role: "MANAGER",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockManager, "session")
      )

      const url = new URL("http://localhost/api/dashboard/admin")
      const request = createMockRequest("GET", url.toString())
      const response = await getAdminDashboard(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe("Admin access required")
    })

    it("should allow ADMIN role to access all dashboard endpoints", async () => {
      const mockAdmin = {
        id: "admin-1",
        email: "admin@test.com",
        role: "ADMIN",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockAdmin, "jwt")
      )

      // Mock successful service responses
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: createMockDashboardData("ADMIN"),
      })

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

      // Test admin access to all endpoints
      for (const endpoint of endpoints) {
        const request = createMockRequest("GET", endpoint.url)
        const response = await endpoint.handler(request)
        expect(response.status).toBe(200)
      }
    })
  })

  describe("Performance Benchmarking Integration", () => {
    it("should complete dashboard API calls within performance budget", async () => {
      const mockUser = {
        id: "perf-user-1",
        email: "perf@test.com",
        role: "USER",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "session")
      )

      // Mock fast database responses
      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(100)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])

      const realDashboardService = new DashboardService()
      mockServiceFactory.getDashboardService.mockReturnValue(
        realDashboardService
      )

      const url = new URL("http://localhost/api/dashboard/user")
      const request = createMockRequest("GET", url.toString())

      // Measure response time
      const startTime = performance.now()
      const response = await getUserDashboard(request)
      const endTime = performance.now()
      const responseTime = endTime - startTime

      expect(response.status).toBe(200)
      // Dashboard should respond within 500ms (reasonable for mocked DB)
      expect(responseTime).toBeLessThan(500)
    })

    it("should handle large datasets efficiently with pagination", async () => {
      const mockManager = {
        id: "perf-mgr-1",
        email: "manager@perf.com",
        role: "MANAGER",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockManager, "session")
      )

      // Mock large dataset
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        id: `req-${i}`,
        title: `Request ${i}`,
        status: "SUBMITTED",
        equipmentCategory: "EXCAVATORS",
        jobSite: `Site ${i}`,
        startDate: new Date(),
        endDate: null,
        requestedDurationType: "FULL_DAY",
        requestedDurationValue: 1,
        requestedTotalHours: 8,
        estimatedCost: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { name: "User", email: "user@test.com", company: "Test Co" },
        userAssignments: [],
      }))

      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(10000)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue(
        largeDataset.slice(0, 20) // Only return requested page
      )
      ;(db.serviceRequest.aggregate as jest.Mock).mockResolvedValue({
        _sum: { estimatedCost: 500000 },
      })
      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])

      const realDashboardService = new DashboardService()
      mockServiceFactory.getDashboardService.mockReturnValue(
        realDashboardService
      )

      const url = new URL("http://localhost/api/dashboard/manager")
      url.searchParams.set("limit", "20")
      url.searchParams.set("offset", "0")
      const request = createMockRequest("GET", url.toString())

      const startTime = performance.now()
      const response = await getManagerDashboard(request)
      const endTime = performance.now()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.recentRequests).toHaveLength(20)
      expect(endTime - startTime).toBeLessThan(1000) // Should handle pagination efficiently
    })

    it("should measure cache performance improvement", async () => {
      const mockUser = {
        id: "cache-user-1",
        email: "cache@test.com",
        role: "USER",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "session")
      )
      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(50)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])

      const realDashboardService = new DashboardService()
      mockServiceFactory.getDashboardService.mockReturnValue(
        realDashboardService
      )

      const url = new URL("http://localhost/api/dashboard/user")
      url.searchParams.set("enableCaching", "true")
      const request1 = createMockRequest("GET", url.toString())
      const request2 = createMockRequest("GET", url.toString())

      // First call (cache miss)
      const start1 = performance.now()
      const response1 = await getUserDashboard(request1)
      const end1 = performance.now()
      const uncachedTime = end1 - start1

      expect(response1.status).toBe(200)
      expect(db.serviceRequest.count).toHaveBeenCalledTimes(4) // Initial DB calls

      // Second call (cache hit)
      const start2 = performance.now()
      const response2 = await getUserDashboard(request2)
      const end2 = performance.now()
      const cachedTime = end2 - start2

      expect(response2.status).toBe(200)
      // Cache hit should not make additional DB calls
      expect(db.serviceRequest.count).toHaveBeenCalledTimes(4) // No new calls

      // Cached response should be faster (or at least comparable)
      // Note: In test environment with mocks, timing can vary significantly
      expect(cachedTime).toBeLessThanOrEqual(uncachedTime * 3) // Allow variance for test environment
    })
  })

  describe("Security Integration Testing", () => {
    it("should reject unauthenticated requests to all endpoints", async () => {
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: false,
        error: "No valid authentication found",
      })

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

        expect(response.status).toBe(401)
        expect(data.error).toBe("Authentication required")
      }
    })

    it("should validate query parameters and reject malicious input", async () => {
      const mockUser = { id: "user-1", email: "user@test.com", role: "USER" }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "session")
      )

      // Test SQL injection attempt in limit parameter
      const url = new URL("http://localhost/api/dashboard/user")
      url.searchParams.set("limit", "'; DROP TABLE users; --")
      const request = createMockRequest("GET", url.toString())

      const response = await getUserDashboard(request)
      const data = await response.json()

      expect(response.status).toBe(422)
      expect(data.error).toBe("Invalid query parameters")
    })

    it("should validate date range parameters to prevent injection", async () => {
      const mockManager = {
        id: "mgr-1",
        email: "manager@test.com",
        role: "MANAGER",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockManager, "session")
      )

      // Test XSS attempt in date parameter
      const url = new URL("http://localhost/api/dashboard/manager")
      url.searchParams.set("startDate", "<script>alert('xss')</script>")
      const request = createMockRequest("GET", url.toString())

      const response = await getManagerDashboard(request)
      const data = await response.json()

      expect(response.status).toBe(422)
      expect(data.error).toBe("Invalid query parameters")
    })

    it("should set appropriate security headers on all responses", async () => {
      const mockAdmin = {
        id: "admin-1",
        email: "admin@test.com",
        role: "ADMIN",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockAdmin, "jwt")
      )

      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: createMockDashboardData("ADMIN"),
      })

      const url = new URL("http://localhost/api/dashboard/admin")
      const request = createMockRequest("GET", url.toString())
      const response = await getAdminDashboard(request)

      // Verify security headers are present
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff")
      expect(response.headers.get("X-Frame-Options")).toBe("DENY")
      expect(response.headers.get("X-XSS-Protection")).toBe("1; mode=block")
      expect(response.headers.get("Content-Type")).toBe("application/json")
    })
  })

  describe("Mobile JWT Authentication Integration", () => {
    it("should support JWT authentication across all dashboard endpoints", async () => {
      const mockMobileUser = {
        id: "mobile-user-1",
        email: "mobile@test.com",
        role: "ADMIN",
      }

      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockMobileUser, "jwt")
      )

      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: createMockDashboardData("ADMIN"),
      })

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
        const request = createMockRequest("GET", endpoint.url, {
          Authorization: "Bearer mock-jwt-token",
        })
        const response = await endpoint.handler(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.meta.authMethod).toBe("jwt")
      }
    })

    it("should handle mobile caching preferences via query parameters", async () => {
      const mockMobileUser = {
        id: "mobile-user-2",
        email: "mobile2@test.com",
        role: "USER",
      }

      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockMobileUser, "jwt")
      )

      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: createMockDashboardData("USER"),
      })

      // Test with caching disabled for mobile offline scenarios
      const url = new URL("http://localhost/api/dashboard/user")
      url.searchParams.set("enableCaching", "false")
      const request = createMockRequest("GET", url.toString(), {
        Authorization: "Bearer mock-jwt-token",
      })

      const response = await getUserDashboard(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.meta.cached).toBe(false)
      expect(response.headers.get("Cache-Control")).toBe(
        "no-cache, no-store, must-revalidate"
      )
    })

    it("should support mobile pagination patterns for infinite scroll", async () => {
      const mockMobileOperator = {
        id: "mobile-op-1",
        email: "mobile-op@test.com",
        role: "OPERATOR",
      }

      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockMobileOperator, "jwt")
      )
      ;(db.userAssignment.count as jest.Mock).mockResolvedValue(100)
      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(0)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])
      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])

      const realDashboardService = new DashboardService()
      mockServiceFactory.getDashboardService.mockReturnValue(
        realDashboardService
      )

      // Simulate mobile infinite scroll
      const url = new URL("http://localhost/api/dashboard/operator")
      url.searchParams.set("limit", "10") // Mobile-appropriate page size
      url.searchParams.set("offset", "20") // Third page
      const request = createMockRequest("GET", url.toString(), {
        Authorization: "Bearer mock-jwt-token",
      })

      const response = await getOperatorDashboard(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.meta.limit).toBe(10)
      expect(data.meta.offset).toBe(20)
    })
  })

  describe("Cross-Role Data Filtering Validation", () => {
    it("should ensure USER only sees their own service requests", async () => {
      const mockUser = {
        id: "filter-user-1",
        email: "user@filter.com",
        role: "USER",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "session")
      )

      const userRequests = [
        { id: "req-user-1", userId: "filter-user-1", title: "User's Request" },
      ]

      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(1)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue(userRequests)

      const realDashboardService = new DashboardService()
      mockServiceFactory.getDashboardService.mockReturnValue(
        realDashboardService
      )

      const url = new URL("http://localhost/api/dashboard/user")
      const request = createMockRequest("GET", url.toString())
      await getUserDashboard(request)

      // Verify database was called with userId filter
      expect(db.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "filter-user-1" },
        })
      )
    })

    it("should ensure OPERATOR sees own requests and assigned requests", async () => {
      const mockOperator = {
        id: "filter-op-1",
        email: "operator@filter.com",
        role: "OPERATOR",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockOperator, "jwt")
      )
      ;(db.userAssignment.count as jest.Mock).mockResolvedValue(5)
      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(2)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])
      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])

      const realDashboardService = new DashboardService()
      mockServiceFactory.getDashboardService.mockReturnValue(
        realDashboardService
      )

      const url = new URL("http://localhost/api/dashboard/operator")
      const request = createMockRequest("GET", url.toString())
      await getOperatorDashboard(request)

      // Verify database was called with OR filter (own requests + assignments)
      expect(db.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { userId: "filter-op-1" },
              { userAssignments: { some: { operatorId: "filter-op-1" } } },
            ],
          },
        })
      )
    })

    it("should ensure MANAGER sees all service requests without filtering", async () => {
      const mockManager = {
        id: "filter-mgr-1",
        email: "manager@filter.com",
        role: "MANAGER",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockManager, "session")
      )
      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(200)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])
      ;(db.serviceRequest.aggregate as jest.Mock).mockResolvedValue({
        _sum: { estimatedCost: 100000 },
      })
      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])

      const realDashboardService = new DashboardService()
      mockServiceFactory.getDashboardService.mockReturnValue(
        realDashboardService
      )

      const url = new URL("http://localhost/api/dashboard/manager")
      const request = createMockRequest("GET", url.toString())
      await getManagerDashboard(request)

      // Verify database was called WITHOUT userId filter
      expect(db.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {}, // No user-specific filtering
        })
      )
    })

    it("should ensure ADMIN sees all data including user list", async () => {
      const mockAdmin = {
        id: "filter-admin-1",
        email: "admin@filter.com",
        role: "ADMIN",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockAdmin, "jwt")
      )

      const mockUsers = [
        { id: "u1", name: "User 1", email: "u1@test.com", role: "USER" },
        { id: "u2", name: "User 2", email: "u2@test.com", role: "OPERATOR" },
      ]

      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(500)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])
      ;(db.serviceRequest.aggregate as jest.Mock)
        .mockResolvedValueOnce({ _sum: { estimatedCost: 250000 } })
        .mockResolvedValueOnce({ _avg: { requestedTotalHours: 32 } })
      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])
      ;(db.user.findMany as jest.Mock).mockResolvedValue(mockUsers)

      const realDashboardService = new DashboardService()
      mockServiceFactory.getDashboardService.mockReturnValue(
        realDashboardService
      )

      const url = new URL("http://localhost/api/dashboard/admin")
      const request = createMockRequest("GET", url.toString())
      const response = await getAdminDashboard(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.users).toHaveLength(2)
      // Verify user list was fetched
      expect(db.user.findMany).toHaveBeenCalled()
    })
  })

  describe("Service Layer to Repository Integration", () => {
    it("should handle database connection errors gracefully", async () => {
      const mockUser = {
        id: "db-error-user",
        email: "user@db.com",
        role: "USER",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockUser, "session")
      )

      // Simulate database connection failure
      ;(db.serviceRequest.count as jest.Mock).mockRejectedValue(
        new Error("Database connection timeout")
      )

      const realDashboardService = new DashboardService()
      mockServiceFactory.getDashboardService.mockReturnValue(
        realDashboardService
      )

      const url = new URL("http://localhost/api/dashboard/user")
      const request = createMockRequest("GET", url.toString())
      const response = await getUserDashboard(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("Failed to fetch dashboard data")
      expect(data.details).toBeDefined()
    })

    it("should handle partial database failures gracefully", async () => {
      const mockOperator = {
        id: "partial-fail-op",
        email: "op@partial.com",
        role: "OPERATOR",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockOperator, "jwt")
      )

      // Simulate partial failure scenario
      ;(db.userAssignment.count as jest.Mock)
        .mockResolvedValueOnce(10)
        .mockRejectedValueOnce(new Error("Assignment count failed"))

      const realDashboardService = new DashboardService()
      mockServiceFactory.getDashboardService.mockReturnValue(
        realDashboardService
      )

      const url = new URL("http://localhost/api/dashboard/operator")
      const request = createMockRequest("GET", url.toString())
      const response = await getOperatorDashboard(request)
      const data = await response.json()

      // Should return error on critical failures
      expect(response.status).toBe(500)
      expect(data.error).toBe("Failed to fetch dashboard data")
    })

    it("should maintain data consistency across concurrent requests", async () => {
      const mockManager = {
        id: "concurrent-mgr",
        email: "mgr@concurrent.com",
        role: "MANAGER",
      }
      mockAuthenticateRequest.mockResolvedValue(
        createMockAuthResult(mockManager, "session")
      )
      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(100)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])
      ;(db.serviceRequest.aggregate as jest.Mock).mockResolvedValue({
        _sum: { estimatedCost: 50000 },
      })
      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])

      const realDashboardService = new DashboardService()
      mockServiceFactory.getDashboardService.mockReturnValue(
        realDashboardService
      )

      // Simulate concurrent requests
      const url = new URL("http://localhost/api/dashboard/manager")
      const requests = Array.from({ length: 5 }, () =>
        getManagerDashboard(createMockRequest("GET", url.toString()))
      )

      const responses = await Promise.all(requests)
      const dataResults = await Promise.all(responses.map((r) => r.json()))

      // All requests should succeed with consistent data
      responses.forEach((response) => {
        expect(response.status).toBe(200)
      })

      dataResults.forEach((data) => {
        expect(data.data.stats.totalRequests).toBe(100)
        expect(data.data.stats.revenue).toBe(50000)
      })
    })
  })
})
