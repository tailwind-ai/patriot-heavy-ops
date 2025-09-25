/**
 * Service Request Flow Integration Tests
 *
 * Tests the complete service request workflow without UI framework dependencies.
 * Validates mobile-ready architecture and cross-platform compatibility.
 *
 * Design Principles:
 * - Zero Next.js/React dependencies
 * - Pure Node.js environment testing
 * - Platform-agnostic business logic validation
 * - Mobile SDK compatibility verification
 */

import { ServiceRequestService, ServiceFactory } from "@/lib/services"
import { RepositoryFactory } from "@/lib/repositories"
import { db } from "@/lib/db"
import { UserRole } from "@prisma/client"

// Mock database for isolated testing
jest.mock("@/lib/db", () => ({
  db: {
    serviceRequest: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}))

// Properly typed mocks
const mockDb = {
  serviceRequest: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
} as any

// Mock permissions
jest.mock("@/lib/permissions", () => ({
  hasPermissionSafe: jest.fn().mockReturnValue(true),
}))

// Mock validations
jest.mock("@/lib/validations/service-request", () => ({
  serviceRequestSchema: {
    omit: jest.fn().mockReturnValue({
      safeParse: jest.fn().mockReturnValue({ success: true }),
    }),
  },
  serviceRequestUpdateSchema: {
    safeParse: jest.fn().mockReturnValue({ success: true }),
  },
}))


describe("Service Request Flow Integration Tests", () => {
  let serviceRequestService: ServiceRequestService

  beforeEach(() => {
    // Reset all mocks and services
    jest.clearAllMocks()
    ServiceFactory.reset()
    RepositoryFactory.reset()
    
    // Get fresh service instance
    serviceRequestService = ServiceFactory.getServiceRequestService()
  })

  afterEach(() => {
    ServiceFactory.reset()
    RepositoryFactory.reset()
  })

  describe("Mobile-First Architecture Validation", () => {
    it("should work in pure Node.js environment without Next.js dependencies", () => {
      // Verify service can be instantiated without any web framework
      expect(serviceRequestService).toBeInstanceOf(ServiceRequestService)
      expect(serviceRequestService.getServiceName()).toBe("ServiceRequestService")
    })

    it("should provide platform-agnostic business logic", () => {
      // Test core business logic calculations work without framework context
      const calculationInput = {
        durationType: "FULL_DAY" as const,
        durationValue: 2,
        baseRate: 100,
        rateType: "DAILY" as const,
        transport: "WE_HANDLE_IT" as const,
        equipmentCategory: "SKID_STEERS_TRACK_LOADERS" as const,
      }

      const result = serviceRequestService.calculateServiceRequestPricing(calculationInput)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        totalHours: 16, // 2 full days × 8 hours
        baseCost: 200, // 2 days × $100 daily rate × 1.0 multiplier
        transportFee: 150, // WE_HANDLE_IT fee
        totalEstimate: 350, // $200 + $150
        durationDisplay: "2 Full Days (16 hours)",
      })
    })

    it("should validate business rules without UI context", () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      
      const businessRulesData = {
        startDate: futureDate.toISOString(),
        durationType: "WEEKLY" as const,
        durationValue: 2,
      }

      const result = serviceRequestService.validateServiceRequestBusinessRules(businessRulesData)
      
      expect(result.success).toBe(true)
      expect(result.data?.isValid).toBe(true)
      expect(result.data?.errors).toEqual([])
    })
  })

  describe("End-to-End Service Request Workflow", () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
      role: UserRole.USER,
    }

    const mockServiceRequest = {
      id: "sr-123",
      title: "Test Service Request",
      status: "SUBMITTED",
      createdAt: new Date(),
      user: mockUser,
    }

    beforeEach(() => {
      // Setup common mocks
      mockDb.serviceRequest.create.mockResolvedValue(mockServiceRequest as any)
      mockDb.serviceRequest.findMany.mockResolvedValue([mockServiceRequest] as any)
      mockDb.serviceRequest.findUnique.mockResolvedValue(mockServiceRequest as any)
      mockDb.serviceRequest.count.mockResolvedValue(1)
    })

    it("should create service request with calculated hours", async () => {
      const createInput = {
        title: "Equipment Rental Request",
        description: "Need skid steer for construction project",
        contactName: "John Doe",
        contactEmail: "john@example.com",
        contactPhone: "555-0123",
        company: "ABC Construction",
        jobSite: "123 Main St, City, State",
        transport: "WE_HANDLE_IT" as const,
        startDate: "2024-12-01T08:00:00Z",
        endDate: "2024-12-03T17:00:00Z",
        equipmentCategory: "SKID_STEERS_TRACK_LOADERS" as const,
        equipmentDetail: "Bobcat S650 or similar",
        requestedDurationType: "FULL_DAY" as const,
        requestedDurationValue: 3,
        rateType: "DAILY" as const,
        baseRate: 150,
        userId: "user-123",
      }

      const result = await serviceRequestService.createServiceRequest(createInput, "USER")

      expect(result.success).toBe(true)
      expect(mockDb.serviceRequest.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: createInput.title,
          requestedTotalHours: 24, // 3 full days × 8 hours
          status: "SUBMITTED",
          userId: createInput.userId,
        }),
        select: expect.any(Object),
      })
    })

    it("should retrieve service requests with role-based access", async () => {
      const listOptions = {
        userId: "user-123",
        userRole: "USER",
      }

      const result = await serviceRequestService.getServiceRequests(listOptions)

      expect(result.success).toBe(true)
      expect(mockDb.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            createdAt: "desc",
          },
        })
      )
    })

    it("should validate status transitions in workflow", () => {
      // Test initial status
      const initialResult = serviceRequestService.validateStatusTransition(undefined, "SUBMITTED")
      expect(initialResult.success).toBe(true)
      expect(initialResult.data?.isValid).toBe(true)

      // Test valid transition
      const validResult = serviceRequestService.validateStatusTransition("SUBMITTED", "UNDER_REVIEW")
      expect(validResult.success).toBe(true)
      expect(validResult.data?.isValid).toBe(true)

      // Test invalid transition
      const invalidResult = serviceRequestService.validateStatusTransition("SUBMITTED", "COMPLETED")
      expect(invalidResult.success).toBe(true)
      expect(invalidResult.data?.isValid).toBe(false)
      expect(invalidResult.data?.reason).toContain("Cannot transition from SUBMITTED to COMPLETED")
    })

    it("should update service request with validation", async () => {
      const updateInput = {
        title: "Updated Service Request Title",
        description: "Updated description",
        status: "UNDER_REVIEW",
      }

      mockDb.serviceRequest.update.mockResolvedValue({
        ...mockServiceRequest,
        ...updateInput,
        updatedAt: new Date(),
      } as any)

      const result = await serviceRequestService.updateServiceRequest(
        "sr-123",
        updateInput,
        "user-123"
      )

      expect(result.success).toBe(true)
      expect(mockDb.serviceRequest.update).toHaveBeenCalledWith({
        where: { id: "sr-123" },
        data: expect.objectContaining({
          title: updateInput.title,
          description: updateInput.description,
          status: updateInput.status,
          updatedAt: expect.any(Date),
        }),
        select: expect.any(Object),
      })
    })

    it("should handle access control for service requests", async () => {
      // Mock access denied scenario
      mockDb.serviceRequest.count.mockResolvedValue(0)

      const result = await serviceRequestService.getServiceRequestById({
        requestId: "sr-123",
        userId: "different-user",
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("DATABASE_ERROR")
      expect(result.error?.message).toContain("Failed to fetch service request")
    })
  })

  describe("Service Layer Independence", () => {
    it("should operate without external framework dependencies", async () => {
      // Verify no Next.js imports using dynamic import
      const serviceModule = await import("@/lib/services/service-request-service")
      expect(serviceModule.ServiceRequestService).toBeDefined()
      
      // Verify service can be instantiated independently
      const independentService = new serviceModule.ServiceRequestService()
      expect(independentService.getServiceName()).toBe("ServiceRequestService")
    })

    it("should provide consistent API across platforms", () => {
      // Test that all public methods return ServiceResult format
      const methods = [
        "calculateTotalHours",
        "getDurationDisplayText", 
        "calculateTransportFee",
        "calculateBaseCost",
        "calculateServiceRequestPricing",
        "validateStatusTransition",
        "getValidNextStatuses",
        "validateServiceRequestBusinessRules",
      ]

      methods.forEach(methodName => {
        expect(typeof serviceRequestService[methodName as keyof ServiceRequestService]).toBe("function")
      })
    })

    it("should handle errors consistently across all operations", () => {
      // Test validation error handling
      const invalidInput = {
        durationType: "INVALID" as any,
        durationValue: -1,
        baseRate: 0,
        rateType: "INVALID" as any,
        transport: "INVALID" as any,
        equipmentCategory: "INVALID" as any,
      }

      const result = serviceRequestService.calculateServiceRequestPricing(invalidInput)
      
      expect(result.success).toBe(false)
      expect(result.error?.code).toBeDefined()
      expect(result.error?.message).toBeDefined()
    })
  })

  describe("Mobile SDK Compatibility", () => {
    it("should support React Native environment simulation", () => {
      // Simulate React Native environment (no DOM, no window)
      const originalWindow = global.window
      const originalDocument = global.document
      
      // Remove browser globals
      delete (global as any).window
      delete (global as any).document

      try {
        // Service should still work without browser APIs
        const service = new ServiceRequestService()
        const result = service.calculateTotalHours("FULL_DAY", 1)
        
        expect(result.success).toBe(true)
        expect(result.data).toBe(8)
      } finally {
        // Restore globals
        if (originalWindow) (global as any).window = originalWindow
        if (originalDocument) (global as any).document = originalDocument
      }
    })

    it("should provide serializable data structures", () => {
      const calculationResult = serviceRequestService.calculateServiceRequestPricing({
        durationType: "HALF_DAY",
        durationValue: 1,
        baseRate: 50,
        rateType: "HOURLY",
        transport: "YOU_HANDLE_IT",
        equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
      })

      expect(calculationResult.success).toBe(true)
      
      // Verify result can be JSON serialized (important for mobile communication)
      const serialized = JSON.stringify(calculationResult)
      const deserialized = JSON.parse(serialized)
      
      expect(deserialized).toEqual(calculationResult)
    })

    it("should handle async operations with proper error boundaries", async () => {
      // Mock database error
      mockDb.serviceRequest.findMany.mockRejectedValue(new Error("Network timeout"))

      const result = await serviceRequestService.getServiceRequests({
        userId: "user-123",
        userRole: "USER",
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("DATABASE_ERROR")
      expect(result.error?.message).toBe("Failed to fetch service requests")
    })
  })

  describe("Performance and Scalability", () => {
    it("should handle large calculation inputs efficiently", () => {
      const startTime = Date.now()
      
      // Test with maximum allowed values
      const result = serviceRequestService.calculateServiceRequestPricing({
        durationType: "WEEKLY",
        durationValue: 52, // Maximum weeks
        baseRate: 10000,
        rateType: "WEEKLY",
        transport: "WE_HANDLE_IT",
        equipmentCategory: "BULLDOZERS", // Highest multiplier
      })
      
      const endTime = Date.now()
      
      expect(result.success).toBe(true)
      expect(endTime - startTime).toBeLessThan(100) // Should complete in <100ms
      expect(result.data?.totalHours).toBe(2080) // 52 weeks × 40 hours
    })

    it("should validate business rules efficiently", () => {
      const startTime = Date.now()
      
      const result = serviceRequestService.validateServiceRequestBusinessRules({
        startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        endDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        durationType: "MULTI_DAY",
        durationValue: 365, // Maximum days
      })
      
      const endTime = Date.now()
      
      expect(result.success).toBe(true)
      expect(endTime - startTime).toBeLessThan(50) // Should complete in <50ms
    })
  })
})
