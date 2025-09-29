/**
 * Dashboard Service Mobile Compatibility Tests
 *
 * Tests mobile-specific features including offline support, caching,
 * and React Native compatibility patterns.
 */

import { DashboardService } from "@/lib/services/dashboard-service"
import { ConsoleLogger } from "@/lib/services/base-service"

// Mock the database for mobile testing
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

// Get reference to mocked db
import { db } from "@/lib/db"
const mockDb = jest.mocked(db)

describe("Dashboard Service Mobile Compatibility", () => {
  let dashboardService: DashboardService
  let mockLogger: ConsoleLogger

  beforeEach(() => {
    jest.clearAllMocks()
    mockLogger = new ConsoleLogger()
    dashboardService = new DashboardService(mockLogger)
  })

  describe("Offline Mode Support", () => {
    it("should enable offline mode without errors", () => {
      expect(() => {
        dashboardService.setOfflineMode(true)
      }).not.toThrow()
    })

    it("should disable offline mode without errors", () => {
      dashboardService.setOfflineMode(true)

      expect(() => {
        dashboardService.setOfflineMode(false)
      }).not.toThrow()
    })

    it("should handle offline mode configuration", () => {
      // Since DashboardService no longer uses repositories directly,
      // offline mode is handled at the database connection level
      expect(() => {
        dashboardService.setOfflineMode(true)
        dashboardService.setOfflineMode(false)
      }).not.toThrow()

      // Verify the method exists and is callable
      expect(typeof dashboardService.setOfflineMode).toBe("function")
    })
  })

  describe("Mobile Caching Patterns", () => {
    it("should support mobile-optimized cache TTL", async () => {
      // Mock successful database responses
      mockDb.serviceRequest.count.mockResolvedValue(5)
      mockDb.serviceRequest.findMany.mockResolvedValue([])

      const mobileOptions = {
        userId: "mobile-user",
        userRole: "USER" as const,
      }

      const mobileCacheOptions = {
        enableCaching: true,
        cacheKey: "mobile-dashboard",
        cacheTTL: 600, // 10 minutes - mobile optimized
      }

      // First call should hit database
      const result1 = await dashboardService.getDashboardData(
        mobileOptions,
        mobileCacheOptions
      )
      expect(result1.success).toBe(true)
      expect(mockDb.serviceRequest.count).toHaveBeenCalledTimes(4)

      // Second call should use cache
      const result2 = await dashboardService.getDashboardData(
        mobileOptions,
        mobileCacheOptions
      )
      expect(result2.success).toBe(true)
      // Database should not be called again
      expect(mockDb.serviceRequest.count).toHaveBeenCalledTimes(4)
    })

    it("should handle cache expiration for mobile scenarios", async () => {
      const testData = { stats: { totalRequests: 5 }, recentRequests: [] }

      // Set cache with very short TTL to simulate mobile network scenarios
      dashboardService.setCache("mobile-short-ttl", testData, 0.001) // 1ms

      // Immediate access should work
      const immediateResult = dashboardService.getFromCache("mobile-short-ttl")
      expect(immediateResult).toEqual(testData)

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 10))

      // Should return null after expiration
      const expiredResult = dashboardService.getFromCache("mobile-short-ttl")
      expect(expiredResult).toBeNull()
    })

    it("should support cache preloading for mobile apps", () => {
      const preloadData = {
        stats: {
          totalRequests: 10,
          activeRequests: 5,
          completedRequests: 3,
          pendingApproval: 2,
        },
        recentRequests: [
          {
            id: "req-1",
            title: "Preloaded Request",
            status: "SUBMITTED",
            equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
            jobSite: "Mobile Site",
            startDate: new Date(),
            endDate: null,
            requestedDurationType: "FULL_DAY",
            requestedDurationValue: 1,
            estimatedCost: 500,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      }

      // Preload cache for mobile app startup
      dashboardService.setCache("mobile-preload", preloadData, 1800) // 30 minutes

      // Verify preloaded data is available
      const cachedData = dashboardService.getCachedDashboardData(
        "mobile",
        "USER"
      )
      expect(cachedData).toBeNull() // Different cache key

      const preloadedData = dashboardService.getFromCache("mobile-preload")
      expect(preloadedData).toEqual(preloadData)
    })
  })

  describe("React Native Compatibility", () => {
    it("should work without Next.js dependencies", () => {
      // Verify service can be instantiated without Next.js context
      expect(() => {
        const mobileService = new DashboardService()
        expect(mobileService.getServiceName()).toBe("DashboardService")
      }).not.toThrow()
    })

    it("should handle React Native AsyncStorage patterns", () => {
      // Simulate AsyncStorage-like operations
      const asyncStorageData = {
        userId: "rn-user-123",
        userRole: "USER",
        cachedDashboard: {
          stats: { totalRequests: 3 },
          recentRequests: [],
        },
      }

      // Test cache operations that would work with AsyncStorage
      dashboardService.setCache(
        "rn-dashboard",
        asyncStorageData.cachedDashboard,
        3600
      )

      const retrieved = dashboardService.getFromCache("rn-dashboard")
      expect(retrieved).toEqual(asyncStorageData.cachedDashboard)
    })

    it("should support React Native network state handling", async () => {
      // Simulate network unavailable scenario
      mockDb.serviceRequest.count.mockRejectedValue(
        new Error("Network request failed")
      )

      // Should gracefully handle network errors
      const result = await dashboardService.getDashboardData({
        userId: "rn-user",
        userRole: "USER",
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("DASHBOARD_DATA_ERROR")

      // In a real React Native app, this would trigger fallback to cached data
      const fallbackData = dashboardService.getCachedDashboardData(
        "rn-user",
        "USER"
      )
      expect(fallbackData).toBeNull() // No cached data in this test
    })
  })

  describe("Mobile Performance Optimization", () => {
    it("should handle large datasets efficiently for mobile", async () => {
      // Mock large dataset but with mobile-appropriate pagination
      mockDb.serviceRequest.count.mockResolvedValue(1000)
      mockDb.serviceRequest.findMany.mockResolvedValue(
        Array.from({ length: 10 }, (_, i) => ({
          id: `mobile-req-${i}`,
          title: `Mobile Request ${i}`,
          status: "SUBMITTED",
          equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
          jobSite: `Mobile Site ${i}`,
          startDate: new Date(),
          endDate: null,
          requestedDurationType: "FULL_DAY",
          requestedDurationValue: 1,
          estimatedCost: 500,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      )

      const result = await dashboardService.getDashboardData({
        userId: "mobile-user",
        userRole: "USER",
        limit: 10, // Mobile-appropriate limit
      })

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data!.recentRequests).toHaveLength(10)
      expect(result.data!.stats.totalRequests).toBe(1000)

      // Verify mobile-appropriate pagination was used
      expect(mockDb.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
        })
      )
    })

    it("should support incremental loading for mobile scrolling", async () => {
      mockDb.serviceRequest.count.mockResolvedValue(50)
      mockDb.serviceRequest.findMany.mockResolvedValue([])

      // Simulate mobile pagination/infinite scroll
      await dashboardService.getDashboardData({
        userId: "mobile-user",
        userRole: "USER",
        limit: 10,
        offset: 20, // Third page
      })

      expect(mockDb.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          skip: 20,
        })
      )
    })

    it("should minimize data transfer for mobile networks", async () => {
      // Mock minimal data response for mobile
      mockDb.serviceRequest.count.mockResolvedValue(5)
      mockDb.serviceRequest.findMany.mockResolvedValue([
        {
          id: "mobile-req-1",
          title: "Mobile Request",
          status: "SUBMITTED",
          equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
          jobSite: "Mobile Site",
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
        userId: "mobile-user",
        userRole: "USER",
        limit: 5, // Small limit for mobile
      })

      expect(result.success).toBe(true)

      // Verify only essential fields are selected (would be configured in real implementation)
      expect(mockDb.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: expect.objectContaining({
            id: true,
            title: true,
            status: true,
            // Essential fields only for mobile
          }),
        })
      )
    })
  })

  describe("Mobile Error Handling", () => {
    it("should handle intermittent connectivity gracefully", async () => {
      // Simulate intermittent connection failure
      mockDb.serviceRequest.count
        .mockRejectedValueOnce(new Error("Connection timeout"))
        .mockResolvedValue(5)

      // First attempt fails
      const result1 = await dashboardService.getDashboardData({
        userId: "mobile-user",
        userRole: "USER",
      })
      expect(result1.success).toBe(false)

      // Second attempt succeeds (connection restored)
      mockDb.serviceRequest.findMany.mockResolvedValue([])
      const result2 = await dashboardService.getDashboardData({
        userId: "mobile-user",
        userRole: "USER",
      })
      expect(result2.success).toBe(true)
    })

    it("should provide mobile-friendly error messages", async () => {
      mockDb.serviceRequest.count.mockRejectedValue(
        new Error("Network unavailable")
      )

      const result = await dashboardService.getDashboardData({
        userId: "mobile-user",
        userRole: "USER",
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("DASHBOARD_DATA_ERROR")
      expect(result.error?.message).toBe("Failed to fetch dashboard data")
      // In a real mobile app, this would be mapped to user-friendly messages
    })
  })

  describe("Cache Management for Mobile", () => {
    it("should support cache invalidation patterns", () => {
      // Set up test cache entries
      dashboardService.setCache("mobile-user-1", { data: "user1" }, 300)
      dashboardService.setCache("mobile-user-2", { data: "user2" }, 300)
      dashboardService.setCache("mobile-operator-1", { data: "operator1" }, 300)

      // Clear specific user cache
      dashboardService.clearCache("mobile-user-1")

      expect(dashboardService.getFromCache("mobile-user-1")).toBeNull()
      expect(dashboardService.getFromCache("mobile-user-2")).not.toBeNull()
      expect(dashboardService.getFromCache("mobile-operator-1")).not.toBeNull()
    })

    it("should handle cache memory management for mobile", () => {
      // Simulate mobile memory constraints
      const largeCacheEntries = Array.from({ length: 100 }, (_, i) => ({
        key: `mobile-cache-${i}`,
        data: { largeData: new Array(1000).fill(`data-${i}`) },
      }))

      // Add many cache entries
      largeCacheEntries.forEach((entry) => {
        dashboardService.setCache(entry.key, entry.data, 300)
      })

      // Clear all cache to free memory
      dashboardService.clearCache()

      // Verify all cache is cleared
      largeCacheEntries.forEach((entry) => {
        expect(dashboardService.getFromCache(entry.key)).toBeNull()
      })
    })

    it("should support cache warming for mobile app startup", () => {
      const warmupData = {
        stats: {
          totalRequests: 8,
          activeRequests: 4,
          completedRequests: 3,
          pendingApproval: 1,
        },
        recentRequests: [],
      }

      // Warm up cache during app initialization
      dashboardService.setCache("mobile-warmup-USER", warmupData, 1800) // 30 min
      dashboardService.setCache("mobile-warmup-OPERATOR", warmupData, 1800)

      // Verify warmup data is available
      expect(dashboardService.getFromCache("mobile-warmup-USER")).toEqual(
        warmupData
      )
      expect(dashboardService.getFromCache("mobile-warmup-OPERATOR")).toEqual(
        warmupData
      )
    })
  })

  describe("Cross-Platform Data Consistency", () => {
    it("should maintain consistent data format across platforms", async () => {
      const consistentData = {
        id: "cross-platform-req",
        title: "Cross Platform Request",
        status: "SUBMITTED",
        equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
        jobSite: "Cross Platform Site",
        startDate: new Date("2024-01-15T10:00:00Z"),
        endDate: null,
        requestedDurationType: "FULL_DAY",
        requestedDurationValue: 1,
        estimatedCost: 500,
        createdAt: new Date("2024-01-10T08:00:00Z"),
        updatedAt: new Date("2024-01-10T08:00:00Z"),
      }

      mockDb.serviceRequest.count.mockResolvedValue(1)
      mockDb.serviceRequest.findMany.mockResolvedValue([consistentData])

      const result = await dashboardService.getDashboardData({
        userId: "cross-platform-user",
        userRole: "USER",
      })

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data!.recentRequests[0]).toMatchObject({
        id: "cross-platform-req",
        title: "Cross Platform Request",
        status: "SUBMITTED",
        // Dates should be properly serializable for mobile
        startDate: expect.any(Date),
        createdAt: expect.any(Date),
      })
    })

    it("should handle timezone differences for mobile users", async () => {
      const utcDate = new Date("2024-01-15T10:00:00Z")

      mockDb.serviceRequest.count.mockResolvedValue(1)
      mockDb.serviceRequest.findMany.mockResolvedValue([
        {
          id: "timezone-req",
          title: "Timezone Request",
          status: "SUBMITTED",
          equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
          jobSite: "Timezone Site",
          startDate: utcDate,
          endDate: null,
          requestedDurationType: "FULL_DAY",
          requestedDurationValue: 1,
          estimatedCost: 500,
          createdAt: utcDate,
          updatedAt: utcDate,
        },
      ])

      const result = await dashboardService.getDashboardData({
        userId: "timezone-user",
        userRole: "USER",
      })

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data!.recentRequests).toHaveLength(1)

      // Dates should be returned as Date objects for proper timezone handling
      const firstRequest = result.data!.recentRequests[0]
      expect(firstRequest).toBeDefined()
      expect(firstRequest!.startDate).toBeInstanceOf(Date)
      expect(firstRequest!.startDate.toISOString()).toBe(
        "2024-01-15T10:00:00.000Z"
      )
    })
  })
})
