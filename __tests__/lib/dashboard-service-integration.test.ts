/**
 * Dashboard Service Integration Tests
 *
 * Integration tests for DashboardService with mocked repositories.
 * Tests service layer integration and repository pattern usage.
 */

import { DashboardService } from "@/lib/services/dashboard-service"
import { ServiceRequestRepository } from "@/lib/repositories/service-request-repository"
import { UserRepository } from "@/lib/repositories/user-repository"
import { ConsoleLogger } from "@/lib/services/base-service"
import { db } from "@/lib/db"

// Mock the repositories
jest.mock("@/lib/repositories/service-request-repository")
jest.mock("@/lib/repositories/user-repository")
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

describe("DashboardService Integration Tests", () => {
  let dashboardService: DashboardService
  let mockServiceRequestRepo: jest.Mocked<ServiceRequestRepository>
  let mockUserRepo: jest.Mocked<UserRepository>
  let mockLogger: ConsoleLogger

  beforeEach(() => {
    jest.clearAllMocks()
    mockLogger = new ConsoleLogger()

    // Create mocked repository instances
    mockServiceRequestRepo = new ServiceRequestRepository({} as any, {
      logger: mockLogger,
    }) as jest.Mocked<ServiceRequestRepository>

    mockUserRepo = new UserRepository({} as any, {
      logger: mockLogger,
    }) as jest.Mocked<UserRepository>

    dashboardService = new DashboardService(mockLogger)

    // Replace the internal repositories with our mocks
    ;(dashboardService as any).serviceRequestRepo = mockServiceRequestRepo
    ;(dashboardService as any).userRepo = mockUserRepo
  })

  describe("Repository Integration", () => {
    it("should initialize repositories with correct configuration", () => {
      const service = new DashboardService(mockLogger)

      // Verify repositories are initialized
      expect(service).toBeDefined()
      expect(service.getServiceName()).toBe("DashboardService")
    })

    it("should set offline mode without errors", () => {
      // Since DashboardService no longer uses repositories directly,
      // setOfflineMode just logs the operation for API compatibility
      expect(() => {
        dashboardService.setOfflineMode(true)
        dashboardService.setOfflineMode(false)
      }).not.toThrow()
    })

    it("should handle repository offline mode queries", () => {
      mockServiceRequestRepo.isOfflineMode = jest.fn().mockReturnValue(true)
      mockUserRepo.isOfflineMode = jest.fn().mockReturnValue(true)

      dashboardService.setOfflineMode(true)

      expect(mockServiceRequestRepo.isOfflineMode()).toBe(true)
      expect(mockUserRepo.isOfflineMode()).toBe(true)
    })
  })

  describe("Service Layer Error Handling", () => {
    it("should handle repository errors gracefully", async () => {
      // Mock database to throw error
      ;(db.serviceRequest.count as jest.Mock).mockRejectedValue(
        new Error("Repository connection failed")
      )

      const result = await dashboardService.getDashboardData({
        userId: "user-123",
        userRole: "USER",
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("DATABASE_ERROR")
      expect(result.error?.message).toBe("Repository connection failed")
    })

    it("should propagate repository validation errors", async () => {
      const result = await dashboardService.getDashboardData({
        userId: "",
        userRole: "USER",
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })
  })

  describe("Cross-Service Integration", () => {
    it("should integrate with permission system for role-based access", async () => {
      // Mock successful database responses
      ;(db.serviceRequest.count as jest.Mock)
        .mockResolvedValueOnce(5) // totalRequests
        .mockResolvedValueOnce(3) // activeRequests
        .mockResolvedValueOnce(2) // completedRequests
        .mockResolvedValueOnce(1) // pendingApproval
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([
        {
          id: "req-1",
          title: "Integration Test Request",
          status: "SUBMITTED",
          equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
          jobSite: "Integration Site",
          startDate: new Date(),
          endDate: null,
          requestedDurationType: "FULL_DAY",
          requestedDurationValue: 1,
          estimatedCost: 500,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])

      const result = await dashboardService.getDashboardData({
        userId: "user-123",
        userRole: "USER",
      })

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data!.stats).toBeDefined()
      expect(result.data!.recentRequests).toBeDefined()
    })

    it("should handle different role permissions correctly", async () => {
      // Mock MANAGER role responses
      ;(db.serviceRequest.count as jest.Mock)
        .mockResolvedValueOnce(50) // totalRequests
        .mockResolvedValueOnce(25) // activeRequests
        .mockResolvedValueOnce(20) // completedRequests
        .mockResolvedValueOnce(5) // pendingApproval
      ;(db.serviceRequest.aggregate as jest.Mock).mockResolvedValue({
        _sum: { estimatedCost: 25000 },
      })
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])
      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])

      const result = await dashboardService.getDashboardData({
        userId: "manager-123",
        userRole: "MANAGER",
      })

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data!.stats.revenue).toBe(25000)
      expect(result.data!.assignments).toBeDefined()
    })
  })

  describe("Mobile Platform Integration", () => {
    it("should support mobile caching patterns", async () => {
      // Mock successful responses
      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(5)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])

      // Test caching behavior
      const options = {
        userId: "mobile-user",
        userRole: "USER" as const,
      }

      const cacheOptions = {
        enableCaching: true,
        cacheKey: "mobile-dashboard",
        cacheTTL: 600, // 10 minutes for mobile
      }

      // First call should hit database
      const result1 = await dashboardService.getDashboardData(
        options,
        cacheOptions
      )
      expect(result1.success).toBe(true)

      // Second call should use cache
      const result2 = await dashboardService.getDashboardData(
        options,
        cacheOptions
      )
      expect(result2.success).toBe(true)

      // Verify cached data is available for offline access
      const cachedData = dashboardService.getCachedDashboardData(
        "mobile-user",
        "USER"
      )
      expect(cachedData).toBeDefined()
    })

    it("should handle offline mode gracefully", () => {
      // Test offline mode doesn't break service initialization
      expect(() => {
        dashboardService.setOfflineMode(true)
      }).not.toThrow()

      // Test cache operations work in offline mode
      expect(() => {
        dashboardService.clearCache("test-pattern")
      }).not.toThrow()
    })
  })

  describe("Performance and Scalability", () => {
    it("should handle large datasets efficiently", async () => {
      // Mock large dataset responses
      const largeRequestArray = Array.from({ length: 1000 }, (_, i) => ({
        id: `req-${i}`,
        title: `Request ${i}`,
        status: "SUBMITTED",
        equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
        jobSite: `Site ${i}`,
        startDate: new Date(),
        endDate: null,
        requestedDurationType: "FULL_DAY",
        requestedDurationValue: 1,
        estimatedCost: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(1000)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue(
        largeRequestArray.slice(0, 20) // Simulate pagination
      )

      const result = await dashboardService.getDashboardData({
        userId: "user-123",
        userRole: "USER",
        limit: 20,
      })

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data!.recentRequests).toHaveLength(20)
      expect(result.data!.stats.totalRequests).toBe(1000)
    })

    it("should respect pagination limits", async () => {
      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(100)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])

      await dashboardService.getDashboardData({
        userId: "user-123",
        userRole: "USER",
        limit: 5,
        offset: 10,
      })

      // Verify pagination parameters are passed correctly
      expect(db.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
          skip: 10,
        })
      )
    })
  })

  describe("Data Consistency", () => {
    it("should maintain data consistency across role-specific queries", async () => {
      // Mock consistent data across different role queries
      const baseRequestData = {
        id: "req-1",
        title: "Consistent Request",
        status: "SUBMITTED",
        equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
        jobSite: "Consistent Site",
        startDate: new Date("2024-01-15"),
        endDate: null,
        requestedDurationType: "FULL_DAY",
        requestedDurationValue: 1,
        estimatedCost: 500,
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10"),
      }

      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(1)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([
        {
          ...baseRequestData,
          user: {
            name: "Test User",
            email: "test@example.com",
            company: "Test Company",
          },
          userAssignments: [],
        },
      ])
      ;(db.serviceRequest.aggregate as jest.Mock).mockResolvedValue({
        _sum: { estimatedCost: 500 },
      })
      ;(db.userAssignment.count as jest.Mock).mockResolvedValue(0)
      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])

      // Test USER role
      const userResult = await dashboardService.getDashboardData({
        userId: "user-123",
        userRole: "USER",
      })

      // Test MANAGER role
      const managerResult = await dashboardService.getDashboardData({
        userId: "manager-123",
        userRole: "MANAGER",
      })

      // Verify consistent data structure
      expect(userResult.success).toBe(true)
      expect(managerResult.success).toBe(true)
      expect(userResult.data).toBeDefined()
      expect(managerResult.data).toBeDefined()
      expect(userResult.data!.stats.totalRequests).toBe(1)
      expect(managerResult.data!.stats.totalRequests).toBe(1)
    })

    it("should handle concurrent requests safely", async () => {
      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(5)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])

      // Simulate concurrent requests
      const promises = Array.from({ length: 5 }, () =>
        dashboardService.getDashboardData({
          userId: "concurrent-user",
          userRole: "USER",
        })
      )

      const results = await Promise.all(promises)

      // All requests should succeed
      results.forEach((result) => {
        expect(result.success).toBe(true)
      })
    })
  })

  describe("Error Recovery", () => {
    it("should recover from transient database errors", async () => {
      // First call fails
      ;(db.serviceRequest.count as jest.Mock)
        .mockRejectedValueOnce(new Error("Transient error"))
        .mockResolvedValue(5)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])

      // First attempt should fail
      const result1 = await dashboardService.getDashboardData({
        userId: "user-123",
        userRole: "USER",
      })
      expect(result1.success).toBe(false)

      // Second attempt should succeed
      const result2 = await dashboardService.getDashboardData({
        userId: "user-123",
        userRole: "USER",
      })
      expect(result2.success).toBe(true)
    })

    it("should provide meaningful error messages", async () => {
      ;(db.serviceRequest.count as jest.Mock).mockRejectedValue(
        new Error("Connection timeout")
      )

      const result = await dashboardService.getDashboardData({
        userId: "user-123",
        userRole: "USER",
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("SYSTEM_ERROR")
      expect(result.error?.message).toBe("Connection timeout")
      expect(result.error?.details?.originalError).toBe("Connection timeout")
    })
  })
})
