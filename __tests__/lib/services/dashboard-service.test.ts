/**
 * Dashboard Service Tests
 *
 * Unit tests for DashboardService focusing on null safety for database operations.
 * Tests cover null db scenarios for all database access patterns.
 */

import {
  DashboardService,
  DashboardDataOptions,
} from "../../../lib/services/dashboard-service"
import { ServiceLogger } from "../../../lib/services/base-service"
import { UserRole } from "../../../lib/permissions"

// Mock the database
jest.mock("../../../lib/db", () => ({
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

import { db } from "../../../lib/db"

const mockDb = db as {
  serviceRequest: {
    count: jest.MockedFunction<any>
    findMany: jest.MockedFunction<any>
    aggregate: jest.MockedFunction<any>
  }
  userAssignment: {
    count: jest.MockedFunction<any>
    findMany: jest.MockedFunction<any>
  }
  user: {
    findMany: jest.MockedFunction<any>
  }
}

// Mock logger for testing
class MockLogger implements ServiceLogger {
  public logs: Array<{
    level: string
    message: string
    meta?: Record<string, unknown>
  }> = []

  info(message: string, meta?: Record<string, unknown>): void {
    this.logs.push({ level: "info", message, ...(meta && { meta }) })
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logs.push({ level: "warn", message, ...(meta && { meta }) })
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.logs.push({ level: "error", message, ...(meta && { meta }) })
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logs.push({ level: "debug", message, ...(meta && { meta }) })
  }

  clear(): void {
    this.logs = []
  }
}

describe("DashboardService", () => {
  let service: DashboardService
  let mockLogger: MockLogger

  beforeEach(() => {
    mockLogger = new MockLogger()
    service = new DashboardService(mockLogger)
    jest.clearAllMocks()
  })

  describe("constructor", () => {
    it("should initialize with DashboardService name", () => {
      expect(service.getServiceName()).toBe("DashboardService")
    })
  })

  describe("Database Null Safety (Issue #330)", () => {
    const mockOptions: DashboardDataOptions = {
      userId: "user-123",
      userRole: "USER" as UserRole,
      limit: 10,
    }

    it("should handle null db.serviceRequest gracefully in USER dashboard", async () => {
      // Set db.serviceRequest to undefined temporarily
      const originalServiceRequest = mockDb.serviceRequest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockDb as any).serviceRequest = undefined

      const result = await service.getDashboardData(mockOptions)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("DASHBOARD_DATA_ERROR")

      // Restore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockDb as any).serviceRequest = originalServiceRequest
    })

    it("should handle null db.userAssignment gracefully in OPERATOR dashboard", async () => {
      const operatorOptions: DashboardDataOptions = {
        userId: "operator-123",
        userRole: "OPERATOR" as UserRole,
      }

      // Mock successful serviceRequest calls
      mockDb.serviceRequest.count.mockResolvedValue(5)
      mockDb.serviceRequest.findMany.mockResolvedValue([])

      // Set db.userAssignment to undefined
      const originalUserAssignment = mockDb.userAssignment
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockDb as any).userAssignment = undefined

      const result = await service.getDashboardData(operatorOptions)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("DASHBOARD_DATA_ERROR")

      // Restore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockDb as any).userAssignment = originalUserAssignment
    })

    it("should handle null db.serviceRequest.aggregate gracefully in MANAGER dashboard", async () => {
      const managerOptions: DashboardDataOptions = {
        userId: "manager-123",
        userRole: "MANAGER" as UserRole,
      }

      // Mock count operations
      mockDb.serviceRequest.count.mockResolvedValue(10)
      mockDb.serviceRequest.findMany.mockResolvedValue([])
      mockDb.userAssignment.findMany.mockResolvedValue([])

      // Set aggregate to undefined
      const originalAggregate = mockDb.serviceRequest.aggregate
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockDb.serviceRequest as any).aggregate = undefined

      const result = await service.getDashboardData(managerOptions)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("DASHBOARD_DATA_ERROR")

      // Restore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockDb.serviceRequest as any).aggregate = originalAggregate
    })

    it("should handle null db.user gracefully in ADMIN dashboard", async () => {
      const adminOptions: DashboardDataOptions = {
        userId: "admin-123",
        userRole: "ADMIN" as UserRole,
      }

      // Mock other operations
      mockDb.serviceRequest.count.mockResolvedValue(15)
      mockDb.serviceRequest.findMany.mockResolvedValue([])
      mockDb.serviceRequest.aggregate.mockResolvedValue({
        _sum: { estimatedCost: null },
        _avg: { requestedTotalHours: null },
      })
      mockDb.userAssignment.findMany.mockResolvedValue([])

      // Set db.user to undefined
      const originalUser = mockDb.user
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockDb as any).user = undefined

      const result = await service.getDashboardData(adminOptions)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("DASHBOARD_DATA_ERROR")

      // Restore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockDb as any).user = originalUser
    })

    it("should handle completely null db gracefully", async () => {
      // Save original db references
      const originalServiceRequest = mockDb.serviceRequest
      const originalUserAssignment = mockDb.userAssignment
      const originalUser = mockDb.user

      // Set all to undefined
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockDb as any).serviceRequest = undefined
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockDb as any).userAssignment = undefined
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockDb as any).user = undefined

      const result = await service.getDashboardData(mockOptions)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("DASHBOARD_DATA_ERROR")

      // Restore all
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockDb as any).serviceRequest = originalServiceRequest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockDb as any).userAssignment = originalUserAssignment
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockDb as any).user = originalUser
    })

    it("should validate required options", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await service.getDashboardData({} as any)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })
  })

  describe("Cache Management", () => {
    it("should handle cache operations with null data", () => {
      service.setCache("test-key", null, 300)
      const cached = service.getFromCache("test-key")

      expect(cached).toBe(null)
    })

    it("should clear cache by pattern", () => {
      service.setCache("dashboard_user_123", { data: "test" }, 300)
      service.setCache("other_data", { data: "other" }, 300)

      service.clearCache("dashboard")

      expect(service.getFromCache("dashboard_user_123")).toBe(null)
      expect(service.getFromCache("other_data")).toEqual({ data: "other" })
    })
  })
})
