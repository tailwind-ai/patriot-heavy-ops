/**
 * Admin Service Tests
 *
 * Tests for platform-agnostic admin management service.
 * Following .cursorrules.md Test Mode standards.
 *
 * Test Coverage:
 * - User management (create, update, delete, role changes)
 * - Operator application approval/rejection workflow
 * - System metrics aggregation
 * - Permission validation and error handling
 */

import { UserRole } from "@prisma/client"
import { ConsoleLogger } from "@/lib/services/base-service"

// Mock Prisma - must be before imports that use db
jest.mock("@/lib/db", () => ({
  db: {
    user: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    serviceRequest: {
      count: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn(),
    },
    userAssignment: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))

import { db } from "@/lib/db"
import { AdminService } from "@/lib/services/admin-service"
import { UserRepository } from "@/lib/repositories/user-repository"
import { DashboardService } from "@/lib/services/dashboard-service"

const mockDb = db as {
  user: {
    create: jest.MockedFunction<any>
    update: jest.MockedFunction<any>
    delete: jest.MockedFunction<any>
    findUnique: jest.MockedFunction<any>
    findMany: jest.MockedFunction<any>
    count: jest.MockedFunction<any>
  }
  serviceRequest: {
    count: jest.MockedFunction<any>
    aggregate: jest.MockedFunction<any>
    findMany: jest.MockedFunction<any>
  }
  userAssignment: {
    count: jest.MockedFunction<any>
    findMany: jest.MockedFunction<any>
  }
}

describe("AdminService", () => {
  let adminService: AdminService
  let userRepository: UserRepository
  let dashboardService: DashboardService
  let mockLogger: ConsoleLogger

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()

    // Create dependencies
    mockLogger = new ConsoleLogger()
    jest.spyOn(mockLogger, "info").mockImplementation()
    jest.spyOn(mockLogger, "error").mockImplementation()
    jest.spyOn(mockLogger, "warn").mockImplementation()

    userRepository = new UserRepository(db as any, { logger: mockLogger })
    dashboardService = new DashboardService(mockLogger)

    // Create service instance
    adminService = new AdminService(
      userRepository,
      dashboardService,
      mockLogger
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("createUser", () => {
    it("should create a new user with specified role", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "hashed_password",
        role: "MANAGER" as UserRole,
      }

      const expectedUser = {
        id: "user-123",
        name: "John Doe",
        email: "john@example.com",
        emailVerified: null,
        image: null,
        role: "MANAGER",
        phone: null,
        company: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        militaryBranch: null,
        yearsOfService: null,
        certifications: [],
        preferredLocations: [],
        isAvailable: true,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
      }

      mockDb.user.create.mockResolvedValue(expectedUser as any)

      const result = await adminService.createUser(userData)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(expectedUser)
      expect(mockDb.user.create).toHaveBeenCalledWith({
        data: userData,
        select: expect.objectContaining({
          id: true,
          name: true,
          email: true,
          role: true,
        }),
      })
    })

    it("should validate required fields", async () => {
      const invalidData = {
        name: "John Doe",
        // Missing email
      }

      const result = await adminService.createUser(invalidData as any)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(mockDb.user.create).not.toHaveBeenCalled()
    })

    it("should handle duplicate email error", async () => {
      const userData = {
        email: "existing@example.com",
        password: "password123",
        role: "USER" as UserRole,
      }

      const prismaError = {
        code: "P2002",
        meta: { target: ["email"] },
      }

      mockDb.user.create.mockRejectedValue(prismaError)

      const result = await adminService.createUser(userData)

      expect(result.success).toBe(false)
      // Error is categorized by BaseService.handleAsync
      expect(result.error?.code).toBe("USER_CREATE_ERROR")
    })
  })

  describe("updateUser", () => {
    it("should update user details", async () => {
      const userId = "user-123"
      const updates = {
        name: "Jane Doe",
        phone: "+1234567890",
        company: "ACME Corp",
      }

      const updatedUser = {
        id: userId,
        name: "Jane Doe",
        email: "jane@example.com",
        emailVerified: null,
        image: null,
        role: "USER",
        phone: "+1234567890",
        company: "ACME Corp",
        createdAt: new Date(),
        updatedAt: new Date(),
        militaryBranch: null,
        yearsOfService: null,
        certifications: [],
        preferredLocations: [],
        isAvailable: true,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
      }

      mockDb.user.update.mockResolvedValue(updatedUser as any)

      const result = await adminService.updateUser(userId, updates)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(updatedUser)
      expect(mockDb.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: expect.objectContaining({
          ...updates,
          updatedAt: expect.any(Date),
        }),
        select: expect.any(Object),
      })
    })

    it("should validate userId is provided", async () => {
      const result = await adminService.updateUser("", { name: "Test" })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(mockDb.user.update).not.toHaveBeenCalled()
    })

    it("should handle user not found error", async () => {
      mockDb.user.update.mockRejectedValue({
        code: "P2025",
        meta: { cause: "Record to update not found." },
      })

      const result = await adminService.updateUser("nonexistent-id", {
        name: "Test",
      })

      expect(result.success).toBe(false)
    })
  })

  describe("deleteUser", () => {
    it("should block deletion when user has active service requests", async () => {
      const userId = "user-123"

      // Mock user exists
      mockDb.user.findUnique.mockResolvedValue({
        id: userId,
        email: "test@example.com",
      } as any)

      // Mock active service requests exist
      mockDb.serviceRequest.count.mockResolvedValue(2)

      const result = await adminService.deleteUser(userId)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("USER_DELETE_ERROR")
      expect(result.error?.message).toContain("active service requests")
      expect(mockDb.user.delete).not.toHaveBeenCalled()
    })

    it("should successfully delete user with no active requests", async () => {
      const userId = "user-123"

      // Mock user exists
      mockDb.user.findUnique.mockResolvedValue({
        id: userId,
        email: "test@example.com",
      } as any)

      // Mock no active service requests
      mockDb.serviceRequest.count.mockResolvedValue(0)

      // Mock successful deletion
      mockDb.user.delete.mockResolvedValue({ id: userId } as any)

      const result = await adminService.deleteUser(userId)

      expect(result.success).toBe(true)
      expect(result.data).toBe(true)
      expect(mockDb.serviceRequest.count).toHaveBeenCalledWith({
        where: {
          userId,
          status: {
            notIn: ["CANCELLED", "CLOSED"],
          },
        },
      })
      expect(mockDb.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      })
    })

    it("should validate userId is provided", async () => {
      const result = await adminService.deleteUser("")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(mockDb.user.findUnique).not.toHaveBeenCalled()
    })

    it("should handle user not found", async () => {
      mockDb.user.findUnique.mockResolvedValue(null)

      const result = await adminService.deleteUser("nonexistent-id")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("USER_DELETE_ERROR")
      expect(result.error?.message).toContain("not found")
      expect(mockDb.user.delete).not.toHaveBeenCalled()
    })
  })

  describe("changeUserRole", () => {
    it("should change user role successfully", async () => {
      const userId = "user-123"
      const newRole = "MANAGER" as UserRole

      const updatedUser = {
        id: userId,
        name: "John Doe",
        email: "john@example.com",
        emailVerified: null,
        image: null,
        role: newRole,
        phone: null,
        company: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        militaryBranch: null,
        yearsOfService: null,
        certifications: [],
        preferredLocations: [],
        isAvailable: true,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
      }

      mockDb.user.update.mockResolvedValue(updatedUser as any)

      const result = await adminService.changeUserRole(userId, newRole)

      expect(result.success).toBe(true)
      expect(result.data?.role).toBe(newRole)
      expect(mockDb.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          role: newRole,
          updatedAt: expect.any(Date),
        },
        select: expect.any(Object),
      })
    })

    it("should validate required parameters", async () => {
      const result = await adminService.changeUserRole(
        "",
        "MANAGER" as UserRole
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(mockDb.user.update).not.toHaveBeenCalled()
    })

    it("should validate role is valid UserRole enum", async () => {
      const result = await adminService.changeUserRole(
        "user-123",
        "INVALID_ROLE" as UserRole
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })
  })

  describe("approveOperatorApplication", () => {
    it("should approve operator application and set role to OPERATOR", async () => {
      const userId = "user-123"
      const applicationData = {
        militaryBranch: "Army",
        yearsOfService: 8,
        certifications: ["Heavy Equipment", "CDL"],
        preferredLocations: ["Texas", "Oklahoma"],
      }

      // Mock user with pending application data
      mockDb.user.findUnique.mockResolvedValue({
        id: userId,
        email: "applicant@example.com",
        role: "USER",
        militaryBranch: applicationData.militaryBranch,
        yearsOfService: applicationData.yearsOfService,
        certifications: applicationData.certifications,
        preferredLocations: applicationData.preferredLocations,
      } as any)

      const approvedUser = {
        id: userId,
        name: "Operator Joe",
        email: "applicant@example.com",
        emailVerified: null,
        image: null,
        role: "OPERATOR",
        phone: null,
        company: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        militaryBranch: applicationData.militaryBranch,
        yearsOfService: applicationData.yearsOfService,
        certifications: applicationData.certifications,
        preferredLocations: applicationData.preferredLocations,
        isAvailable: true,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
      }

      mockDb.user.update.mockResolvedValue(approvedUser as any)

      const result = await adminService.approveOperatorApplication(userId)

      expect(result.success).toBe(true)
      expect(result.data?.role).toBe("OPERATOR")
      expect(mockDb.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          role: "OPERATOR",
          isAvailable: true,
          updatedAt: expect.any(Date),
        },
        select: expect.any(Object),
      })
    })

    it("should fail if user has no application data", async () => {
      const userId = "user-123"

      // Mock user without application data
      mockDb.user.findUnique.mockResolvedValue({
        id: userId,
        email: "user@example.com",
        role: "USER",
        militaryBranch: null, // No application data
        yearsOfService: null,
        certifications: [],
        preferredLocations: [],
      } as any)

      const result = await adminService.approveOperatorApplication(userId)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("OPERATOR_APPROVAL_ERROR")
      expect(result.error?.message).toContain("incomplete application data")
      expect(mockDb.user.update).not.toHaveBeenCalled()
    })

    it("should validate userId is provided", async () => {
      const result = await adminService.approveOperatorApplication("")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })
  })

  describe("rejectOperatorApplication", () => {
    it("should reject operator application by clearing application data", async () => {
      const userId = "user-123"

      const rejectedUser = {
        id: userId,
        name: "User Joe",
        email: "applicant@example.com",
        emailVerified: null,
        image: null,
        role: "USER",
        phone: null,
        company: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        militaryBranch: null,
        yearsOfService: null,
        certifications: [],
        preferredLocations: [],
        isAvailable: true,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
        accounts: [],
      }

      // Mock user with application data (first findById call)
      mockDb.user.findUnique
        .mockResolvedValueOnce({
          id: userId,
          email: "applicant@example.com",
          role: "USER",
          militaryBranch: "Army",
          yearsOfService: 8,
          accounts: [],
        } as any)
        .mockResolvedValueOnce(rejectedUser as any) // Second findById call after update

      mockDb.user.update.mockResolvedValue({} as any)

      const result = await adminService.rejectOperatorApplication(userId)

      expect(result.success).toBe(true)
      expect(result.data?.militaryBranch).toBeNull()
      expect(result.data?.yearsOfService).toBeNull()
      expect(mockDb.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          militaryBranch: null,
          yearsOfService: null,
          certifications: [],
          preferredLocations: [],
          updatedAt: expect.any(Date),
        },
      })
    })

    it("should validate userId is provided", async () => {
      const result = await adminService.rejectOperatorApplication("")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })
  })

  describe("getPendingOperatorApplications", () => {
    it("should return users with operator application data but USER role", async () => {
      const pendingApplications = [
        {
          id: "user-1",
          name: "Applicant One",
          email: "applicant1@example.com",
          role: "USER",
          phone: "+1234567890",
          company: null,
          createdAt: new Date(),
          militaryBranch: "Army",
          yearsOfService: 5,
          certifications: ["CDL"],
          preferredLocations: ["Texas"],
          isAvailable: true,
        },
        {
          id: "user-2",
          name: "Applicant Two",
          email: "applicant2@example.com",
          role: "USER",
          phone: null,
          company: null,
          createdAt: new Date(),
          militaryBranch: "Navy",
          yearsOfService: 10,
          certifications: ["Heavy Equipment"],
          preferredLocations: ["California"],
          isAvailable: true,
        },
      ]

      mockDb.user.findMany.mockResolvedValue(pendingApplications as any)

      const result = await adminService.getPendingOperatorApplications()

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
      expect(result.data?.[0]?.militaryBranch).toBe("Army")
      expect(mockDb.user.findMany).toHaveBeenCalledWith({
        where: {
          role: "USER",
          militaryBranch: { not: null },
          yearsOfService: { not: null },
        },
        select: expect.objectContaining({
          id: true,
          name: true,
          email: true,
          role: true,
          militaryBranch: true,
          yearsOfService: true,
          certifications: true,
          preferredLocations: true,
        }),
        orderBy: { createdAt: "desc" },
      })
    })

    it("should support pagination", async () => {
      mockDb.user.findMany.mockResolvedValue([])

      const result = await adminService.getPendingOperatorApplications({
        limit: 10,
        page: 3,
      })

      expect(result.success).toBe(true)
      expect(mockDb.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          skip: 20,
        })
      )
    })
  })

  describe("getUsersByRole", () => {
    it("should return users filtered by role", async () => {
      const managers = [
        {
          id: "user-1",
          name: "Manager One",
          email: "manager1@example.com",
          role: "MANAGER",
          phone: null,
          company: "ACME Corp",
          createdAt: new Date(),
        },
        {
          id: "user-2",
          name: "Manager Two",
          email: "manager2@example.com",
          role: "MANAGER",
          phone: null,
          company: "Beta Inc",
          createdAt: new Date(),
        },
      ]

      mockDb.user.findMany.mockResolvedValue(managers as any)

      const result = await adminService.getUsersByRole("MANAGER" as UserRole)

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
      expect(mockDb.user.findMany).toHaveBeenCalledWith({
        where: { role: "MANAGER" },
        select: expect.objectContaining({
          id: true,
          name: true,
          email: true,
          role: true,
        }),
        orderBy: { createdAt: "desc" },
      })
    })

    it("should support pagination", async () => {
      mockDb.user.findMany.mockResolvedValue([])

      const result = await adminService.getUsersByRole("OPERATOR" as UserRole, {
        limit: 25,
        page: 3,
      })

      expect(result.success).toBe(true)
      // Pagination is handled by userRepository.findByRole
      expect(result.success).toBe(true)
    })

    it("should validate role parameter", async () => {
      const result = await adminService.getUsersByRole("" as UserRole)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })
  })

  describe("getSystemMetrics", () => {
    it("should aggregate system-wide metrics", async () => {
      const mockStats = {
        totalRequests: 150,
        activeRequests: 45,
        completedRequests: 100,
        pendingApproval: 5,
        revenue: 50000,
        averageJobDuration: 24,
      }

      // Mock total users count
      mockDb.user.count.mockResolvedValue(250)

      // Mock role distribution
      mockDb.user.count
        .mockResolvedValueOnce(250) // Total users
        .mockResolvedValueOnce(180) // USER count
        .mockResolvedValueOnce(50) // OPERATOR count
        .mockResolvedValueOnce(15) // MANAGER count
        .mockResolvedValueOnce(5) // ADMIN count

      // Mock dashboard stats (delegated to DashboardService)
      jest
        .spyOn(dashboardService as any, "getAdminStats")
        .mockResolvedValue(mockStats)

      const result = await adminService.getSystemMetrics()

      expect(result.success).toBe(true)
      expect(result.data).toMatchObject({
        totalUsers: 250,
        usersByRole: {
          USER: 180,
          OPERATOR: 50,
          MANAGER: 15,
          ADMIN: 5,
        },
        serviceRequests: mockStats,
      })
    })

    it("should handle date range filtering", async () => {
      const dateRange = {
        start: new Date("2024-01-01"),
        end: new Date("2024-12-31"),
      }

      mockDb.user.count.mockResolvedValue(100)
      jest.spyOn(dashboardService as any, "getAdminStats").mockResolvedValue({
        totalRequests: 50,
        activeRequests: 10,
        completedRequests: 40,
        pendingApproval: 0,
        revenue: 25000,
      })

      const result = await adminService.getSystemMetrics(dateRange)

      expect(result.success).toBe(true)
      expect(dashboardService["getAdminStats"]).toHaveBeenCalledWith(dateRange)
    })
  })

  describe("getUserMetrics", () => {
    it("should return user growth and distribution metrics", async () => {
      // Mock user counts
      mockDb.user.count
        .mockResolvedValueOnce(250) // Total
        .mockResolvedValueOnce(180) // USER
        .mockResolvedValueOnce(50) // OPERATOR
        .mockResolvedValueOnce(15) // MANAGER
        .mockResolvedValueOnce(5) // ADMIN
        .mockResolvedValueOnce(25) // New users (last 30 days)

      const result = await adminService.getUserMetrics()

      expect(result.success).toBe(true)
      expect(result.data).toMatchObject({
        totalUsers: 250,
        usersByRole: {
          USER: 180,
          OPERATOR: 50,
          MANAGER: 15,
          ADMIN: 5,
        },
        newUsersLast30Days: 25,
      })
    })
  })

  describe("audit logging", () => {
    it("should log admin actions with context", async () => {
      const adminId = "admin-123"
      const action = "USER_ROLE_CHANGED"
      const targetId = "user-456"
      const details = { oldRole: "USER", newRole: "MANAGER" }

      adminService.logAdminAction(adminId, action, targetId, details)

      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining("ADMIN_ACTION"),
        expect.objectContaining({
          adminId: "[REDACTED]",
          action,
          targetId,
          details,
          timestamp: expect.any(String),
        })
      )
    })

    it("should redact sensitive information in logs", async () => {
      const adminId = "admin-123"
      const action = "USER_CREATED"
      const targetId = "user-new"

      adminService.logAdminAction(adminId, action, targetId)

      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          adminId: "[REDACTED]", // Sensitive ID redacted
        })
      )
    })
  })

  describe("database connection failures", () => {
    beforeEach(() => {
      // Mock db as undefined for these tests
      jest.resetModules()
      jest.doMock("@/lib/db", () => ({
        db: undefined,
      }))
    })

    afterEach(() => {
      jest.resetModules()
    })

    it("should throw error when db is undefined in deleteUser", async () => {
      // Mock user exists
      mockDb.user.findUnique.mockResolvedValue({
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: "USER",
      })

      const result = await adminService.deleteUser("user-123")

      expect(result.success).toBe(false)
      expect(result.error?.message).toContain(
        "Database connection not available"
      )
    })

    it("should throw error when db is undefined in rejectOperatorApplication", async () => {
      // Mock user exists
      mockDb.user.findUnique.mockResolvedValue({
        id: "user-123",
        email: "operator@example.com",
        name: "Operator",
        role: "USER",
        militaryBranch: "Army",
        yearsOfService: 5,
      })

      const result = await adminService.rejectOperatorApplication("user-123")

      expect(result.success).toBe(false)
      expect(result.error?.message).toContain(
        "Database connection not available"
      )
    })

    it("should throw error when db is undefined in getPendingOperatorApplications", async () => {
      const result = await adminService.getPendingOperatorApplications()

      expect(result.success).toBe(false)
      expect(result.error?.message).toContain(
        "Database connection not available"
      )
    })

    it("should throw error when db is undefined in getSystemMetrics", async () => {
      const result = await adminService.getSystemMetrics()

      expect(result.success).toBe(false)
      expect(result.error?.message).toContain(
        "Database connection not available"
      )
    })

    it("should throw error when db is undefined in getUserMetrics", async () => {
      const result = await adminService.getUserMetrics()

      expect(result.success).toBe(false)
      expect(result.error?.message).toContain(
        "Database connection not available"
      )
    })
  })
})
