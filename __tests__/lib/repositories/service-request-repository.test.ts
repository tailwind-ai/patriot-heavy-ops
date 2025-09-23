/**
 * Service Request Repository Tests
 * 
 * Tests for ServiceRequestRepository with mocked Prisma client
 */

import { ServiceRequestRepository, ServiceRequestCreateInput, ServiceRequestUpdateInput } from "@/lib/repositories/service-request-repository"
import { ServiceRequestStatus, UserRole } from "@prisma/client"

// Mock Prisma Client
const mockPrismaClient = {
  serviceRequest: {
    findUnique: jest.fn(),
    findManyWithRoleAccess: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  serviceRequestStatusHistory: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
} as any

describe("ServiceRequestRepository", () => {
  let repository: ServiceRequestRepository

  beforeEach(() => {
    repository = new ServiceRequestRepository(mockPrismaClient)
    jest.clearAllMocks()
  })

  describe("findById", () => {
    it("should find service request by ID successfully", async () => {
      const mockServiceRequest = {
        id: "sr123",
        title: "Test Request",
        status: "SUBMITTED",
        user: { name: "John Doe", email: "john@example.com", company: "Test Co" },
      }

      mockPrismaClient.serviceRequest.findUnique.mockResolvedValue(mockServiceRequest)

      const result = await repository.findById("sr123")

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockServiceRequest)
      expect(mockPrismaClient.serviceRequest.findUnique).toHaveBeenCalledWith({
        where: { id: "sr123" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              company: true,
            },
          },
          userAssignments: {
            include: {
              operator: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          statusHistory: {
            include: {
              changedByUser: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      })
    })

    it("should handle validation error for missing ID", async () => {
      const result = await repository.findById("")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(mockPrismaClient.serviceRequest.findUnique).not.toHaveBeenCalled()
    })

    it("should handle database errors", async () => {
      mockPrismaClient.serviceRequest.findUnique.mockRejectedValue(new Error("Database error"))

      const result = await repository.findById("sr123")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("SERVICE_REQUEST_FIND_ERROR")
    })
  })

  describe("findManyWithRoleAccess", () => {
    const mockServiceRequests = [
      {
        id: "sr123",
        title: "Test Request 1",
        status: "SUBMITTED",
        user: { name: "John Doe", email: "john@example.com", company: "Test Co" },
      },
      {
        id: "sr124",
        title: "Test Request 2",
        status: "APPROVED",
        user: { name: "Jane Smith", email: "jane@example.com", company: "Test Co" },
      },
    ]

    it("should find requests for ADMIN role", async () => {
      mockPrismaClient.serviceRequest.findManyWithRoleAccess.mockResolvedValue(mockServiceRequests)

      const result = await repository.findManyWithRoleAccess({
        userId: "user123",
        userRole: UserRole.ADMIN,
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockServiceRequests)
      expect(mockPrismaClient.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        })
      )
    })

    it("should find requests for MANAGER role", async () => {
      mockPrismaClient.serviceRequest.findManyWithRoleAccess.mockResolvedValue(mockServiceRequests)

      const result = await repository.findManyWithRoleAccess({
        userId: "manager123",
        userRole: UserRole.MANAGER,
      })

      expect(result.success).toBe(true)
      expect(mockPrismaClient.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        })
      )
    })

    it("should find requests for OPERATOR role", async () => {
      mockPrismaClient.serviceRequest.findManyWithRoleAccess.mockResolvedValue(mockServiceRequests)

      const result = await repository.findManyWithRoleAccess({
        userId: "operator123",
        userRole: UserRole.OPERATOR,
      })

      expect(result.success).toBe(true)
      expect(mockPrismaClient.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { userId: "operator123" },
              {
                userAssignments: {
                  some: {
                    operatorId: "operator123",
                  },
                },
              },
            ],
          },
        })
      )
    })

    it("should find requests for USER role", async () => {
      mockPrismaClient.serviceRequest.findManyWithRoleAccess.mockResolvedValue(mockServiceRequests)

      const result = await repository.findManyWithRoleAccess({
        userId: "user123",
        userRole: UserRole.USER,
      })

      expect(result.success).toBe(true)
      expect(mockPrismaClient.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId: "user123",
          },
        })
      )
    })

    it("should apply additional filters", async () => {
      mockPrismaClient.serviceRequest.findManyWithRoleAccess.mockResolvedValue(mockServiceRequests)

      const result = await repository.findManyWithRoleAccess(
        {
          userId: "user123",
          userRole: UserRole.USER,
        },
        {
          status: ServiceRequestStatus.APPROVED,
          equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
        }
      )

      expect(result.success).toBe(true)
      expect(mockPrismaClient.serviceRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId: "user123",
            status: "APPROVED",
            equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
          },
        })
      )
    })
  })

  describe("create", () => {
    const mockCreateInput: ServiceRequestCreateInput = {
      title: "New Service Request",
      contactName: "John Doe",
      contactEmail: "john@example.com",
      contactPhone: "555-0123",
      jobSite: "123 Main St",
      equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
      equipmentDetail: "Compact track loader",
      transport: "WE_HANDLE_IT",
      startDate: new Date("2024-01-15"),
      requestedDurationType: "FULL_DAY",
      requestedDurationValue: 1,
      requestedTotalHours: 8,
      rateType: "DAILY",
      baseRate: 500,
      userId: "user123",
    }

    it("should create service request successfully", async () => {
      const mockCreatedRequest = {
        id: "sr123",
        title: "New Service Request",
        status: "SUBMITTED",
        createdAt: new Date(),
      }

      mockPrismaClient.serviceRequest.create.mockResolvedValue(mockCreatedRequest)

      const result = await repository.create(mockCreateInput)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockCreatedRequest)
      expect(mockPrismaClient.serviceRequest.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateInput,
          status: "SUBMITTED",
        },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
        },
      })
    })

    it("should handle validation errors", async () => {
      const invalidInput = { ...mockCreateInput, title: "", contactEmail: "" }

      const result = await repository.create(invalidInput)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(mockPrismaClient.serviceRequest.create).not.toHaveBeenCalled()
    })
  })

  describe("update", () => {
    const mockUpdateInput: ServiceRequestUpdateInput = {
      title: "Updated Request",
      status: ServiceRequestStatus.APPROVED,
      estimatedCost: 1000,
    }

    it("should update service request successfully", async () => {
      const mockUpdatedRequest = {
        id: "sr123",
        title: "Updated Request",
        status: "APPROVED",
        estimatedCost: 1000,
        updatedAt: new Date(),
      }

      mockPrismaClient.serviceRequest.update.mockResolvedValue(mockUpdatedRequest)

      const result = await repository.update("sr123", mockUpdateInput)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUpdatedRequest)
      expect(mockPrismaClient.serviceRequest.update).toHaveBeenCalledWith({
        where: { id: "sr123" },
        data: {
          ...mockUpdateInput,
          updatedAt: expect.any(Date),
        },
      })
    })

    it("should handle validation error for missing ID", async () => {
      const result = await repository.update("", mockUpdateInput)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(mockPrismaClient.serviceRequest.update).not.toHaveBeenCalled()
    })
  })

  describe("delete", () => {
    it("should delete service request successfully", async () => {
      mockPrismaClient.serviceRequest.delete.mockResolvedValue({})

      const result = await repository.delete("sr123")

      expect(result.success).toBe(true)
      expect(result.data).toBe(true)
      expect(mockPrismaClient.serviceRequest.delete).toHaveBeenCalledWith({
        where: { id: "sr123" },
      })
    })

    it("should handle validation error for missing ID", async () => {
      const result = await repository.delete("")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(mockPrismaClient.serviceRequest.delete).not.toHaveBeenCalled()
    })
  })

  describe("count", () => {
    it("should count service requests successfully", async () => {
      mockPrismaClient.serviceRequest.count.mockResolvedValue(42)

      const result = await repository.count()

      expect(result.success).toBe(true)
      expect(result.data).toBe(42)
      expect(mockPrismaClient.serviceRequest.count).toHaveBeenCalledWith({})
    })

    it("should count with filters", async () => {
      mockPrismaClient.serviceRequest.count.mockResolvedValue(10)

      const result = await repository.count({
        where: { status: "APPROVED" },
      })

      expect(result.success).toBe(true)
      expect(result.data).toBe(10)
      expect(mockPrismaClient.serviceRequest.count).toHaveBeenCalledWith({
        where: { status: "APPROVED" },
      })
    })
  })

  describe("updateStatus", () => {
    it("should update status with history tracking", async () => {
      const mockCurrentRequest = { status: "SUBMITTED" }
      const mockUpdatedRequest = {
        id: "sr123",
        status: "APPROVED",
        updatedAt: new Date(),
      }

      mockPrismaClient.serviceRequest.findUnique.mockResolvedValue(mockCurrentRequest)
      mockPrismaClient.$transaction.mockImplementation(async (callback: any) => {
        return callback({
          serviceRequest: {
            update: jest.fn().mockResolvedValue(mockUpdatedRequest),
          },
          serviceRequestStatusHistory: {
            create: jest.fn().mockResolvedValue({}),
          },
        })
      })

      const result = await repository.updateStatus(
        "sr123",
        ServiceRequestStatus.APPROVED,
        "manager123",
        "Approved by manager",
        "All requirements met"
      )

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUpdatedRequest)
      expect(mockPrismaClient.$transaction).toHaveBeenCalled()
    })

    it("should handle service request not found", async () => {
      mockPrismaClient.serviceRequest.findUnique.mockResolvedValue(null)

      const result = await repository.updateStatus(
        "sr123",
        ServiceRequestStatus.APPROVED,
        "manager123"
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("SERVICE_REQUEST_STATUS_UPDATE_ERROR")
    })

    it("should handle validation errors", async () => {
      const result = await repository.updateStatus(
        "",
        ServiceRequestStatus.APPROVED,
        ""
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(mockPrismaClient.serviceRequest.findUnique).not.toHaveBeenCalled()
    })
  })
})
