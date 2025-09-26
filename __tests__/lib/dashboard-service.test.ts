/**
 * Dashboard Service Tests
 *
 * Comprehensive unit tests for the DashboardService class.
 * Tests role-specific data access, caching, and mobile compatibility.
 */

import { DashboardService, DashboardDataOptions } from "@/lib/services/dashboard-service"
import { ConsoleLogger } from "@/lib/services/base-service"
import { db } from "@/lib/db"

// Mock the database
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

// Mock repositories
jest.mock("@/lib/repositories/service-request-repository")
jest.mock("@/lib/repositories/user-repository")

describe("DashboardService", () => {
  let dashboardService: DashboardService
  let mockLogger: ConsoleLogger

  beforeEach(() => {
    jest.clearAllMocks()
    mockLogger = new ConsoleLogger()
    dashboardService = new DashboardService(mockLogger)
  })

  describe("Constructor", () => {
    it("should initialize with default logger if none provided", () => {
      const service = new DashboardService()
      expect(service.getServiceName()).toBe("DashboardService")
    })

    it("should initialize with provided logger", () => {
      const service = new DashboardService(mockLogger)
      expect(service.getServiceName()).toBe("DashboardService")
    })
  })

  describe("getDashboardData", () => {
    const baseOptions: DashboardDataOptions = {
      userId: "user-123",
      userRole: "USER",
      limit: 10,
    }

    it("should validate required parameters", async () => {
      const result = await dashboardService.getDashboardData({
        userId: "",
        userRole: "USER",
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })

    it("should handle invalid user role", async () => {
      const result = await dashboardService.getDashboardData({
        userId: "user-123",
        userRole: "INVALID" as any,
      })

      expect(result.success).toBe(false)
      expect(result.error?.message).toContain("Failed to fetch dashboard data")
    })

    it("should return cached data when caching is enabled", async () => {
      // Mock successful database calls for initial request
      ;(db.serviceRequest.count as jest.Mock)
        .mockResolvedValueOnce(5) // totalRequests
        .mockResolvedValueOnce(3) // activeRequests
        .mockResolvedValueOnce(2) // completedRequests
        .mockResolvedValueOnce(1) // pendingApproval

      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([
        {
          id: "req-1",
          title: "Test Request",
          status: "SUBMITTED",
          equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
          jobSite: "Test Site",
          startDate: new Date(),
          endDate: null,
          requestedDurationType: "FULL_DAY",
          requestedDurationValue: 1,
          estimatedCost: 500,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])

      // First call - should hit database
      const result1 = await dashboardService.getDashboardData(baseOptions, {
        enableCaching: true,
        cacheKey: "test-cache",
        cacheTTL: 300,
      })

      expect(result1.success).toBe(true)
      expect(db.serviceRequest.count).toHaveBeenCalledTimes(4)

      // Second call - should use cache
      const result2 = await dashboardService.getDashboardData(baseOptions, {
        enableCaching: true,
        cacheKey: "test-cache",
        cacheTTL: 300,
      })

      expect(result2.success).toBe(true)
      // Database should not be called again
      expect(db.serviceRequest.count).toHaveBeenCalledTimes(4)
    })
  })

  describe("USER Role Dashboard Data", () => {
    beforeEach(() => {
      // Mock USER role database responses
      ;(db.serviceRequest.count as jest.Mock)
        .mockResolvedValueOnce(10) // totalRequests
        .mockResolvedValueOnce(5) // activeRequests
        .mockResolvedValueOnce(3) // completedRequests
        .mockResolvedValueOnce(2) // pendingApproval

      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([
        {
          id: "req-1",
          title: "User Request 1",
          status: "SUBMITTED",
          equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
          jobSite: "User Site 1",
          startDate: new Date("2024-01-15"),
          endDate: null,
          requestedDurationType: "FULL_DAY",
          requestedDurationValue: 2,
          estimatedCost: 800,
          createdAt: new Date("2024-01-10"),
          updatedAt: new Date("2024-01-10"),
        },
      ])
    })

    it("should return USER dashboard data with correct structure", async () => {
      const options: DashboardDataOptions = {
        userId: "user-123",
        userRole: "USER",
        limit: 5,
      }

      const result = await dashboardService.getDashboardData(options)

      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty("stats")
      expect(result.data).toHaveProperty("recentRequests")
      expect(result.data).not.toHaveProperty("assignments")
      expect(result.data).not.toHaveProperty("users")

      // Verify stats structure
      expect(result.data.stats).toEqual({
        totalRequests: 10,
        activeRequests: 5,
        completedRequests: 3,
        pendingApproval: 2,
      })

      // Verify requests structure
      expect(result.data.recentRequests).toHaveLength(1)
      expect(result.data.recentRequests[0]).toMatchObject({
        id: "req-1",
        title: "User Request 1",
        status: "SUBMITTED",
      })
    })

    it("should filter requests by userId for USER role", async () => {
      const options: DashboardDataOptions = {
        userId: "user-123",
        userRole: "USER",
      }

      await dashboardService.getDashboardData(options)

      // Verify database calls use correct userId filter
      expect(db.serviceRequest.count).toHaveBeenCalledWith({
        where: { userId: "user-123" },
      })

      expect(db.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "user-123" },
        })
      )
    })
  })

  describe("OPERATOR Role Dashboard Data", () => {
    beforeEach(() => {
      // Mock OPERATOR role database responses
      ;(db.userAssignment.count as jest.Mock)
        .mockResolvedValueOnce(8) // totalAssignments
        .mockResolvedValueOnce(4) // activeAssignments
        .mockResolvedValueOnce(3) // completedAssignments

      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(2) // ownRequests

      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([
        {
          id: "req-1",
          title: "Assigned Request",
          status: "OPERATOR_ASSIGNED",
          equipmentCategory: "BACKHOES_EXCAVATORS",
          jobSite: "Assignment Site",
          startDate: new Date("2024-01-20"),
          endDate: new Date("2024-01-22"),
          requestedDurationType: "MULTI_DAY",
          requestedDurationValue: 3,
          estimatedCost: 1200,
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-18"),
          user: {
            name: "Client Name",
            email: "client@example.com",
            company: "Client Company",
          },
        },
      ])

      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([
        {
          id: "assignment-1",
          serviceRequestId: "req-1",
          operatorId: "operator-123",
          assignedAt: new Date("2024-01-18"),
          status: "ACTIVE",
          serviceRequest: {
            title: "Assigned Request",
            jobSite: "Assignment Site",
            startDate: new Date("2024-01-20"),
            endDate: new Date("2024-01-22"),
            status: "OPERATOR_ASSIGNED",
          },
        },
      ])
    })

    it("should return OPERATOR dashboard data with assignments", async () => {
      const options: DashboardDataOptions = {
        userId: "operator-123",
        userRole: "OPERATOR",
        limit: 5,
      }

      const result = await dashboardService.getDashboardData(options)

      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty("stats")
      expect(result.data).toHaveProperty("recentRequests")
      expect(result.data).toHaveProperty("assignments")
      expect(result.data).not.toHaveProperty("users")

      // Verify stats include assignments + own requests
      expect(result.data.stats.totalRequests).toBe(10) // 8 assignments + 2 own requests

      // Verify assignments are included
      expect(result.data.assignments).toHaveLength(1)
      expect(result.data.assignments[0]).toMatchObject({
        id: "assignment-1",
        operatorId: "operator-123",
        status: "ACTIVE",
      })
    })

    it("should include both assigned and own requests for OPERATOR", async () => {
      const options: DashboardDataOptions = {
        userId: "operator-123",
        userRole: "OPERATOR",
      }

      await dashboardService.getDashboardData(options)

      // Verify requests query includes OR condition for own + assigned requests
      expect(db.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { userId: "operator-123" },
              {
                userAssignments: {
                  some: { operatorId: "operator-123" },
                },
              },
            ],
          },
        })
      )
    })
  })

  describe("MANAGER Role Dashboard Data", () => {
    beforeEach(() => {
      // Mock MANAGER role database responses
      ;(db.serviceRequest.count as jest.Mock)
        .mockResolvedValueOnce(50) // totalRequests
        .mockResolvedValueOnce(25) // activeRequests
        .mockResolvedValueOnce(20) // completedRequests
        .mockResolvedValueOnce(5) // pendingApproval

      ;(db.serviceRequest.aggregate as jest.Mock).mockResolvedValue({
        _sum: { estimatedCost: 25000 },
      })

      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([
        {
          id: "req-1",
          title: "Manager View Request",
          status: "UNDER_REVIEW",
          equipmentCategory: "BULLDOZERS",
          jobSite: "Manager Site",
          startDate: new Date("2024-02-01"),
          endDate: new Date("2024-02-05"),
          requestedDurationType: "MULTI_DAY",
          requestedDurationValue: 5,
          estimatedCost: 2500,
          createdAt: new Date("2024-01-25"),
          updatedAt: new Date("2024-01-26"),
          user: {
            name: "Request Owner",
            email: "owner@example.com",
            company: "Owner Company",
          },
          userAssignments: [
            {
              operator: {
                id: "op-1",
                name: "Operator One",
                email: "op1@example.com",
              },
            },
          ],
        },
      ])

      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([
        {
          id: "assignment-1",
          serviceRequestId: "req-1",
          operatorId: "op-1",
          assignedAt: new Date("2024-01-26"),
          status: "ACTIVE",
          serviceRequest: {
            title: "Manager View Request",
            jobSite: "Manager Site",
            startDate: new Date("2024-02-01"),
            endDate: new Date("2024-02-05"),
            status: "UNDER_REVIEW",
          },
        },
      ])
    })

    it("should return MANAGER dashboard data with revenue stats", async () => {
      const options: DashboardDataOptions = {
        userId: "manager-123",
        userRole: "MANAGER",
        limit: 10,
      }

      const result = await dashboardService.getDashboardData(options)

      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty("stats")
      expect(result.data).toHaveProperty("recentRequests")
      expect(result.data).toHaveProperty("assignments")
      expect(result.data).not.toHaveProperty("users")

      // Verify stats include revenue
      expect(result.data.stats).toMatchObject({
        totalRequests: 50,
        activeRequests: 25,
        completedRequests: 20,
        pendingApproval: 5,
        revenue: 25000,
      })

      // Verify requests include user and operator info
      expect(result.data.recentRequests[0]).toHaveProperty("user")
      expect(result.data.recentRequests[0]).toHaveProperty("assignedOperators")
    })

    it("should handle date range filtering for MANAGER", async () => {
      const dateRange = {
        start: new Date("2024-01-01"),
        end: new Date("2024-01-31"),
      }

      const options: DashboardDataOptions = {
        userId: "manager-123",
        userRole: "MANAGER",
        dateRange,
      }

      await dashboardService.getDashboardData(options)

      // Verify date range is applied to queries
      expect(db.serviceRequest.count).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        },
      })
    })
  })

  describe("ADMIN Role Dashboard Data", () => {
    beforeEach(() => {
      // Mock ADMIN role database responses (inherits MANAGER + additional data)
      ;(db.serviceRequest.count as jest.Mock)
        .mockResolvedValueOnce(100) // totalRequests
        .mockResolvedValueOnce(45) // activeRequests
        .mockResolvedValueOnce(50) // completedRequests
        .mockResolvedValueOnce(5) // pendingApproval

      ;(db.serviceRequest.aggregate as jest.Mock)
        .mockResolvedValueOnce({ _sum: { estimatedCost: 75000 } }) // revenue
        .mockResolvedValueOnce({ _avg: { requestedTotalHours: 24 } }) // avgDuration

      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])
      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])

      ;(db.user.findMany as jest.Mock).mockResolvedValue([
        {
          id: "user-1",
          name: "Recent User",
          email: "recent@example.com",
          role: "USER",
          company: "Recent Company",
          createdAt: new Date("2024-01-30"),
        },
      ])
    })

    it("should return ADMIN dashboard data with all sections", async () => {
      const options: DashboardDataOptions = {
        userId: "admin-123",
        userRole: "ADMIN",
        limit: 15,
      }

      const result = await dashboardService.getDashboardData(options)

      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty("stats")
      expect(result.data).toHaveProperty("recentRequests")
      expect(result.data).toHaveProperty("assignments")
      expect(result.data).toHaveProperty("users")

      // Verify stats include admin-specific metrics
      expect(result.data.stats).toMatchObject({
        totalRequests: 100,
        activeRequests: 45,
        completedRequests: 50,
        pendingApproval: 5,
        revenue: 75000,
        averageJobDuration: 24,
      })

      // Verify users section is included
      expect(result.data.users).toHaveLength(1)
      expect(result.data.users[0]).toMatchObject({
        id: "user-1",
        name: "Recent User",
        role: "USER",
      })
    })
  })

  describe("Cache Management", () => {
    it("should clear cache by pattern", () => {
      // Set some test cache entries
      dashboardService.setCache("dashboard_user1_USER", { test: "data1" }, 300)
      dashboardService.setCache("dashboard_user2_OPERATOR", { test: "data2" }, 300)
      dashboardService.setCache("other_cache_key", { test: "data3" }, 300)

      // Clear cache with pattern
      dashboardService.clearCache("dashboard_user1")

      // Verify specific cache was cleared
      expect(dashboardService.getCachedDashboardData("user1", "USER")).toBeNull()
      expect(dashboardService.getCachedDashboardData("user2", "OPERATOR")).not.toBeNull()
    })

    it("should clear all cache when no pattern provided", () => {
      // Set test cache entries
      dashboardService.setCache("test1", { data: "1" }, 300)
      dashboardService.setCache("test2", { data: "2" }, 300)

      // Clear all cache
      dashboardService.clearCache()

      // Verify all cache is cleared
      expect(dashboardService.getFromCache("test1")).toBeNull()
      expect(dashboardService.getFromCache("test2")).toBeNull()
    })

    it("should return null for expired cache", () => {
      // Set cache with very short TTL
      dashboardService.setCache("short_ttl", { data: "test" }, 0.001) // 1ms

      // Wait for expiration
      setTimeout(() => {
        expect(dashboardService.getFromCache("short_ttl")).toBeNull()
      }, 10)
    })
  })

  describe("Mobile Compatibility", () => {
    it("should support offline mode", () => {
      expect(() => {
        dashboardService.setOfflineMode(true)
      }).not.toThrow()
    })

    it("should provide cached data for offline access", () => {
      const testData = { stats: { totalRequests: 5 }, recentRequests: [] }
      dashboardService.setCache("dashboard_mobile_USER", testData, 300)

      const cachedData = dashboardService.getCachedDashboardData("mobile", "USER")
      expect(cachedData).toEqual(testData)
    })
  })

  describe("Error Handling", () => {
    it("should handle database errors gracefully", async () => {
      ;(db.serviceRequest.count as jest.Mock).mockRejectedValue(
        new Error("Database connection failed")
      )

      const options: DashboardDataOptions = {
        userId: "user-123",
        userRole: "USER",
      }

      const result = await dashboardService.getDashboardData(options)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("DASHBOARD_DATA_ERROR")
      expect(result.error?.message).toBe("Failed to fetch dashboard data")
    })

    it("should validate required options", async () => {
      const result = await dashboardService.getDashboardData({
        userId: "",
        userRole: "USER",
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })
  })
})
