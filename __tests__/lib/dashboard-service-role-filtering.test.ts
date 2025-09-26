/**
 * Dashboard Service Role Filtering Tests
 *
 * Comprehensive tests for role-based data filtering and access control.
 * Validates that each role only sees appropriate data.
 */

import { DashboardService } from "@/lib/services/dashboard-service"
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

describe("Dashboard Service Role Filtering Tests", () => {
  let dashboardService: DashboardService
  let mockLogger: ConsoleLogger

  beforeEach(() => {
    jest.clearAllMocks()
    mockLogger = new ConsoleLogger()
    dashboardService = new DashboardService(mockLogger)
  })

  describe("USER Role Data Filtering", () => {
    it("should only return user's own service requests", async () => {
      const userId = "user-123"
      
      // Mock database responses
      ;(db.serviceRequest.count as jest.Mock)
        .mockResolvedValueOnce(3) // totalRequests
        .mockResolvedValueOnce(2) // activeRequests
        .mockResolvedValueOnce(1) // completedRequests
        .mockResolvedValueOnce(1) // pendingApproval

      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([
        {
          id: "req-1",
          title: "User's Request 1",
          status: "SUBMITTED",
          equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
          jobSite: "User Site 1",
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
        userId,
        userRole: "USER",
      })

      expect(result.success).toBe(true)

      // Verify all database calls filter by userId
      expect(db.serviceRequest.count).toHaveBeenCalledWith({
        where: { userId },
      })

      expect(db.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId },
        })
      )

      // Verify no admin/manager specific data is included
      expect(result.data).not.toHaveProperty("users")
      expect(result.data).not.toHaveProperty("assignments")
      expect(result.data.stats).not.toHaveProperty("revenue")
    })

    it("should not include other users' data in USER role", async () => {
      const userId = "user-123"
      
      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(0)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])

      await dashboardService.getDashboardData({
        userId,
        userRole: "USER",
      })

      // Verify queries are scoped to specific user
      const countCalls = (db.serviceRequest.count as jest.Mock).mock.calls
      countCalls.forEach(call => {
        expect(call[0].where).toHaveProperty("userId", userId)
      })

      const findManyCalls = (db.serviceRequest.findMany as jest.Mock).mock.calls
      findManyCalls.forEach(call => {
        expect(call[0].where).toHaveProperty("userId", userId)
      })
    })
  })

  describe("OPERATOR Role Data Filtering", () => {
    it("should include both own requests and assigned requests", async () => {
      const operatorId = "operator-123"
      
      // Mock operator-specific responses
      ;(db.userAssignment.count as jest.Mock)
        .mockResolvedValueOnce(5) // totalAssignments
        .mockResolvedValueOnce(3) // activeAssignments
        .mockResolvedValueOnce(2) // completedAssignments

      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(2) // ownRequests

      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([
        {
          id: "req-1",
          title: "Assigned Request",
          status: "OPERATOR_ASSIGNED",
          equipmentCategory: "BACKHOES_EXCAVATORS",
          jobSite: "Assignment Site",
          startDate: new Date(),
          endDate: null,
          requestedDurationType: "FULL_DAY",
          requestedDurationValue: 1,
          estimatedCost: 800,
          createdAt: new Date(),
          updatedAt: new Date(),
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
          operatorId,
          assignedAt: new Date(),
          status: "ACTIVE",
          serviceRequest: {
            title: "Assigned Request",
            jobSite: "Assignment Site",
            startDate: new Date(),
            endDate: null,
            status: "OPERATOR_ASSIGNED",
          },
        },
      ])

      const result = await dashboardService.getDashboardData({
        userId: operatorId,
        userRole: "OPERATOR",
      })

      expect(result.success).toBe(true)

      // Verify OR query for own + assigned requests
      expect(db.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { userId: operatorId }, // Own requests
              {
                userAssignments: {
                  some: { operatorId },
                },
              }, // Assigned requests
            ],
          },
        })
      )

      // Verify assignments are included but admin data is not
      expect(result.data).toHaveProperty("assignments")
      expect(result.data).not.toHaveProperty("users")
      expect(result.data.stats).not.toHaveProperty("revenue")
    })

    it("should filter assignments by operator ID", async () => {
      const operatorId = "operator-123"
      
      ;(db.userAssignment.count as jest.Mock).mockResolvedValue(0)
      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(0)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])
      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])

      await dashboardService.getDashboardData({
        userId: operatorId,
        userRole: "OPERATOR",
      })

      // Verify assignment queries filter by operatorId
      expect(db.userAssignment.count).toHaveBeenCalledWith({
        where: { operatorId },
      })

      expect(db.userAssignment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { operatorId },
        })
      )
    })
  })

  describe("MANAGER Role Data Filtering", () => {
    it("should access all service requests without user filtering", async () => {
      const managerId = "manager-123"
      
      // Mock manager-level responses
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
          title: "Any User Request",
          status: "UNDER_REVIEW",
          equipmentCategory: "BULLDOZERS",
          jobSite: "Any Site",
          startDate: new Date(),
          endDate: null,
          requestedDurationType: "FULL_DAY",
          requestedDurationValue: 1,
          estimatedCost: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            name: "Any User",
            email: "user@example.com",
            company: "User Company",
          },
          userAssignments: [],
        },
      ])

      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])

      const result = await dashboardService.getDashboardData({
        userId: managerId,
        userRole: "MANAGER",
      })

      expect(result.success).toBe(true)

      // Verify no userId filtering for managers
      const countCalls = (db.serviceRequest.count as jest.Mock).mock.calls
      countCalls.forEach(call => {
        expect(call[0].where).not.toHaveProperty("userId")
      })

      const findManyCalls = (db.serviceRequest.findMany as jest.Mock).mock.calls
      findManyCalls.forEach(call => {
        if (call[0].where) {
          expect(call[0].where).not.toHaveProperty("userId")
        }
      })

      // Verify manager-specific data is included
      expect(result.data).toHaveProperty("assignments")
      expect(result.data.stats).toHaveProperty("revenue")
      expect(result.data).not.toHaveProperty("users") // Admin-only
    })

    it("should respect date range filtering for managers", async () => {
      const managerId = "manager-123"
      const dateRange = {
        start: new Date("2024-01-01"),
        end: new Date("2024-01-31"),
      }

      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(10)
      ;(db.serviceRequest.aggregate as jest.Mock).mockResolvedValue({
        _sum: { estimatedCost: 5000 },
      })
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])
      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])

      await dashboardService.getDashboardData({
        userId: managerId,
        userRole: "MANAGER",
        dateRange,
      })

      // Verify date range is applied to all queries
      const expectedDateFilter = {
        createdAt: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
      }

      expect(db.serviceRequest.count).toHaveBeenCalledWith({
        where: expectedDateFilter,
      })

      expect(db.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expectedDateFilter,
        })
      )
    })
  })

  describe("ADMIN Role Data Filtering", () => {
    it("should access all data including user management", async () => {
      const adminId = "admin-123"
      
      // Mock admin-level responses
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
          name: "System User",
          email: "user@example.com",
          role: "USER",
          company: "User Company",
          createdAt: new Date(),
        },
      ])

      const result = await dashboardService.getDashboardData({
        userId: adminId,
        userRole: "ADMIN",
      })

      expect(result.success).toBe(true)

      // Verify admin has access to all data sections
      expect(result.data).toHaveProperty("stats")
      expect(result.data).toHaveProperty("recentRequests")
      expect(result.data).toHaveProperty("assignments")
      expect(result.data).toHaveProperty("users")

      // Verify admin-specific metrics
      expect(result.data.stats).toHaveProperty("revenue")
      expect(result.data.stats).toHaveProperty("averageJobDuration")

      // Verify user data is included
      expect(result.data.users).toHaveLength(1)
      expect(result.data.users[0]).toMatchObject({
        id: "user-1",
        role: "USER",
      })
    })

    it("should not filter by userId for admin queries", async () => {
      const adminId = "admin-123"
      
      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(0)
      ;(db.serviceRequest.aggregate as jest.Mock).mockResolvedValue({
        _sum: { estimatedCost: 0 },
        _avg: { requestedTotalHours: 0 },
      })
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])
      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])
      ;(db.user.findMany as jest.Mock).mockResolvedValue([])

      await dashboardService.getDashboardData({
        userId: adminId,
        userRole: "ADMIN",
      })

      // Verify no userId filtering in any queries
      const allCalls = [
        ...(db.serviceRequest.count as jest.Mock).mock.calls,
        ...(db.serviceRequest.findMany as jest.Mock).mock.calls,
        ...(db.userAssignment.findMany as jest.Mock).mock.calls,
        ...(db.user.findMany as jest.Mock).mock.calls,
      ]

      allCalls.forEach(call => {
        if (call[0] && call[0].where) {
          expect(call[0].where).not.toHaveProperty("userId")
        }
      })
    })
  })

  describe("Cross-Role Data Isolation", () => {
    it("should prevent USER from accessing other users' data", async () => {
      const userId = "user-123"
      
      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(1)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([
        {
          id: "req-1",
          title: "User's Own Request",
          userId: "user-123", // Same user
          status: "SUBMITTED",
          equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
          jobSite: "User Site",
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
        userId,
        userRole: "USER",
      })

      expect(result.success).toBe(true)

      // Verify strict userId filtering
      expect(db.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "user-123" },
        })
      )

      // Should not include any admin/manager fields
      expect(result.data.recentRequests[0]).not.toHaveProperty("user")
      expect(result.data.recentRequests[0]).not.toHaveProperty("assignedOperators")
    })

    it("should prevent OPERATOR from accessing unassigned requests", async () => {
      const operatorId = "operator-123"
      
      ;(db.userAssignment.count as jest.Mock).mockResolvedValue(0)
      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(0)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])
      ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])

      await dashboardService.getDashboardData({
        userId: operatorId,
        userRole: "OPERATOR",
      })

      // Verify OR condition restricts to own + assigned only
      expect(db.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { userId: operatorId },
              {
                userAssignments: {
                  some: { operatorId },
                },
              },
            ],
          },
        })
      )
    })

    it("should ensure role-specific data boundaries", async () => {
      const testCases = [
        {
          role: "USER" as const,
          shouldHave: ["stats", "recentRequests"],
          shouldNotHave: ["assignments", "users"],
        },
        {
          role: "OPERATOR" as const,
          shouldHave: ["stats", "recentRequests", "assignments"],
          shouldNotHave: ["users"],
        },
        {
          role: "MANAGER" as const,
          shouldHave: ["stats", "recentRequests", "assignments"],
          shouldNotHave: ["users"],
        },
        {
          role: "ADMIN" as const,
          shouldHave: ["stats", "recentRequests", "assignments", "users"],
          shouldNotHave: [],
        },
      ]

      for (const testCase of testCases) {
        // Mock appropriate responses for each role
        ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(1)
        ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])
        ;(db.userAssignment.count as jest.Mock).mockResolvedValue(1)
        ;(db.userAssignment.findMany as jest.Mock).mockResolvedValue([])
        ;(db.serviceRequest.aggregate as jest.Mock).mockResolvedValue({
          _sum: { estimatedCost: 1000 },
          _avg: { requestedTotalHours: 8 },
        })
        ;(db.user.findMany as jest.Mock).mockResolvedValue([])

        const result = await dashboardService.getDashboardData({
          userId: `${testCase.role.toLowerCase()}-123`,
          userRole: testCase.role,
        })

        expect(result.success).toBe(true)

        // Check required properties
        testCase.shouldHave.forEach(prop => {
          expect(result.data).toHaveProperty(prop)
        })

        // Check forbidden properties
        testCase.shouldNotHave.forEach(prop => {
          expect(result.data).not.toHaveProperty(prop)
        })

        jest.clearAllMocks()
      }
    })
  })

  describe("Security Validation", () => {
    it("should reject invalid role types", async () => {
      const result = await dashboardService.getDashboardData({
        userId: "user-123",
        userRole: "INVALID_ROLE" as any,
      })

      expect(result.success).toBe(false)
      expect(result.error?.message).toBe("Failed to fetch dashboard data")
    })

    it("should validate user ID is not empty", async () => {
      const result = await dashboardService.getDashboardData({
        userId: "",
        userRole: "USER",
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })

    it("should handle SQL injection attempts safely", async () => {
      const maliciousUserId = "'; DROP TABLE users; --"
      
      ;(db.serviceRequest.count as jest.Mock).mockResolvedValue(0)
      ;(db.serviceRequest.findMany as jest.Mock).mockResolvedValue([])

      const result = await dashboardService.getDashboardData({
        userId: maliciousUserId,
        userRole: "USER",
      })

      // Should handle safely (Prisma protects against SQL injection)
      expect(result.success).toBe(true)
      
      // Verify the malicious string is passed as-is to Prisma (which handles it safely)
      expect(db.serviceRequest.count).toHaveBeenCalledWith({
        where: { userId: maliciousUserId },
      })
    })
  })
})
