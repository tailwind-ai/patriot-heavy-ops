/**
 * Service Request Repository - Advanced Prisma Type Safety Tests
 *
 * Tests for Issue #321: Advanced Prisma Type Safety Patterns
 * Validates that repository methods use Prisma.ServiceRequestGetPayload for enhanced type safety
 */

import { ServiceRequestRepository } from "@/lib/repositories/service-request-repository"
import { Prisma } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

// Helper to convert number to Prisma Decimal type for testing
const toDecimal = (value: number): Decimal => new Decimal(value)

// Mock Prisma Client
const mockPrismaClient = {
  serviceRequest: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
} as any

describe("ServiceRequestRepository - Advanced Prisma Type Safety (Issue #321)", () => {
  let repository: ServiceRequestRepository

  beforeEach(() => {
    repository = new ServiceRequestRepository(mockPrismaClient)
    jest.clearAllMocks()
  })

  describe("Prisma.ServiceRequestGetPayload type integration", () => {
    it("should use Prisma.ServiceRequestGetPayload for findById with complex includes", async () => {
      // Test that complex queries with nested relations are properly typed

      const mockServiceRequest: Prisma.ServiceRequestGetPayload<{
        include: {
          user: {
            select: {
              name: true
              email: true
              company: true
            }
          }
          userAssignments: {
            include: {
              operator: {
                select: {
                  id: true
                  name: true
                  email: true
                }
              }
            }
          }
          statusHistory: {
            include: {
              changedByUser: {
                select: {
                  name: true
                  email: true
                }
              }
            }
            orderBy: {
              createdAt: "desc"
            }
          }
        }
      }> = {
        id: "sr123",
        title: "Heavy Equipment Request",
        description: "Need bulldozer for construction site",
        userId: "user123",
        contactName: "John Doe",
        contactEmail: "john@example.com",
        contactPhone: "555-0123",
        company: "Construction Co",
        jobSite: "123 Main St, Austin, TX",
        transport: "WE_HANDLE_IT",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-06-05"),
        equipmentCategory: "BULLDOZERS",
        equipmentDetail: "D8 Bulldozer or equivalent",
        requestedDurationType: "MULTI_DAY",
        requestedDurationValue: 5,
        requestedTotalHours: toDecimal(40),
        rateType: "DAILY",
        baseRate: toDecimal(1200),
        status: "SUBMITTED",
        priority: "NORMAL",
        estimatedCost: toDecimal(6000),
        depositAmount: null,
        depositPaid: false,
        depositPaidAt: null,
        finalAmount: null,
        finalPaid: false,
        finalPaidAt: null,
        stripeDepositPaymentIntentId: null,
        stripeFinalPaymentIntentId: null,
        assignedManagerId: null,
        rejectionReason: null,
        internalNotes: null,
        createdAt: new Date("2024-05-15"),
        updatedAt: new Date("2024-05-15"),
        user: {
          name: "John Doe",
          email: "john@example.com",
          company: "Construction Co",
        },
        userAssignments: [
          {
            id: "assign1",
            serviceRequestId: "sr123",
            operatorId: "op123",
            status: "pending",
            rate: toDecimal(85),
            estimatedHours: toDecimal(40),
            actualHours: null,
            assignedAt: new Date("2024-05-16"),
            acceptedAt: null,
            completedAt: null,
            createdAt: new Date("2024-05-16"),
            updatedAt: new Date("2024-05-16"),
            operator: {
              id: "op123",
              name: "Operator Smith",
              email: "operator@example.com",
            },
          },
        ],
        statusHistory: [
          {
            id: "hist1",
            serviceRequestId: "sr123",
            fromStatus: null,
            toStatus: "SUBMITTED",
            changedBy: "user123",
            reason: null,
            notes: "Initial submission",
            createdAt: new Date("2024-05-15"),
            changedByUser: {
              name: "John Doe",
              email: "john@example.com",
            },
          },
        ],
      }

      mockPrismaClient.serviceRequest.findUnique.mockResolvedValue(
        mockServiceRequest
      )

      const result = await repository.findById("sr123")

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()

      if (result.data) {
        // Type assertions for main service request fields
        expect(result.data.id).toBe("sr123")
        expect(result.data.title).toBe("Heavy Equipment Request")
        expect(result.data.status).toBe("SUBMITTED")
        expect(result.data.equipmentCategory).toBe("BULLDOZERS")

        // Type assertions for nested user relation
        expect(result.data.user).toBeDefined()
        expect(result.data.user.name).toBe("John Doe")
        expect(result.data.user.email).toBe("john@example.com")

        // Type assertions for userAssignments relation
        expect(result.data.userAssignments).toBeDefined()
        expect(Array.isArray(result.data.userAssignments)).toBe(true)
        expect(result.data.userAssignments).toHaveLength(1)

        if (result.data.userAssignments[0]) {
          const assignment = result.data.userAssignments[0]
          expect(assignment.status).toBe("pending")
          expect(assignment.operator).toBeDefined()
          expect(assignment.operator.name).toBe("Operator Smith")
        }

        // Type assertions for statusHistory relation
        expect(result.data.statusHistory).toBeDefined()
        expect(Array.isArray(result.data.statusHistory)).toBe(true)
        expect(result.data.statusHistory).toHaveLength(1)

        if (result.data.statusHistory[0]) {
          const history = result.data.statusHistory[0]
          expect(history.toStatus).toBe("SUBMITTED")
          expect(history.changedByUser).toBeDefined()
          expect(history.changedByUser.name).toBe("John Doe")
        }
      }
    })

    it("should use Prisma.ServiceRequestGetPayload for findManyWithRoleAccess with select", async () => {
      // Test that selective queries are properly typed using Prisma.ServiceRequestGetPayload

      const mockServiceRequests: Array<
        Prisma.ServiceRequestGetPayload<{
          select: {
            id: true
            title: true
            status: true
            equipmentCategory: true
            jobSite: true
            startDate: true
            endDate: true
            requestedDurationType: true
            requestedDurationValue: true
            estimatedCost: true
            createdAt: true
            updatedAt: true
            user: {
              select: {
                name: true
                email: true
                company: true
              }
            }
          }
        }>
      > = [
        {
          id: "sr1",
          title: "Request 1",
          status: "SUBMITTED",
          equipmentCategory: "BULLDOZERS",
          jobSite: "Site 1",
          startDate: new Date("2024-06-01"),
          endDate: new Date("2024-06-05"),
          requestedDurationType: "MULTI_DAY",
          requestedDurationValue: 5,
          estimatedCost: toDecimal(6000),
          createdAt: new Date("2024-05-15"),
          updatedAt: new Date("2024-05-15"),
          user: {
            name: "User One",
            email: "user1@example.com",
            company: "Company One",
          },
        },
        {
          id: "sr2",
          title: "Request 2",
          status: "UNDER_REVIEW",
          equipmentCategory: "BACKHOES_EXCAVATORS",
          jobSite: "Site 2",
          startDate: new Date("2024-06-10"),
          endDate: null,
          requestedDurationType: "FULL_DAY",
          requestedDurationValue: 1,
          estimatedCost: toDecimal(1500),
          createdAt: new Date("2024-05-16"),
          updatedAt: new Date("2024-05-17"),
          user: {
            name: "User Two",
            email: "user2@example.com",
            company: "Company Two",
          },
        },
      ]

      mockPrismaClient.serviceRequest.findMany.mockResolvedValue(
        mockServiceRequests
      )

      const result = await repository.findManyWithRoleAccess({
        userId: "user123",
        userRole: "ADMIN",
      })

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data).toHaveLength(2)

      if (result.data) {
        // Type assertions for array of Prisma.ServiceRequestGetPayload
        const firstRequest = result.data[0]
        const secondRequest = result.data[1]

        expect(firstRequest?.id).toBe("sr1")
        expect(firstRequest?.title).toBe("Request 1")
        expect(firstRequest?.equipmentCategory).toBe("BULLDOZERS")
        expect(firstRequest?.user.name).toBe("User One")

        expect(secondRequest?.id).toBe("sr2")
        expect(secondRequest?.status).toBe("UNDER_REVIEW")
        expect(secondRequest?.user.email).toBe("user2@example.com")
      }
    })

    it("should use Prisma.ServiceRequestGetPayload for create operations", async () => {
      // Test that create operations return properly typed Prisma.ServiceRequestGetPayload

      const mockCreatedRequest: Prisma.ServiceRequestGetPayload<{
        include: {
          user: {
            select: {
              name: true
              email: true
              company: true
            }
          }
        }
      }> = {
        id: "sr_new",
        title: "New Equipment Request",
        description: "Urgent excavator needed",
        userId: "user456",
        contactName: "Jane Smith",
        contactEmail: "jane@example.com",
        contactPhone: "555-0456",
        company: "Smith Construction",
        jobSite: "789 Oak Ave, Dallas, TX",
        transport: "YOU_HANDLE_IT",
        startDate: new Date("2024-07-01"),
        endDate: new Date("2024-07-10"),
        equipmentCategory: "BACKHOES_EXCAVATORS",
        equipmentDetail: "Mini excavator 3-5 ton",
        requestedDurationType: "MULTI_DAY",
        requestedDurationValue: 10,
        requestedTotalHours: toDecimal(80),
        rateType: "DAILY",
        baseRate: toDecimal(800),
        status: "SUBMITTED",
        priority: "NORMAL",
        estimatedCost: null,
        depositAmount: null,
        depositPaid: false,
        depositPaidAt: null,
        finalAmount: null,
        finalPaid: false,
        finalPaidAt: null,
        stripeDepositPaymentIntentId: null,
        stripeFinalPaymentIntentId: null,
        assignedManagerId: null,
        rejectionReason: null,
        internalNotes: null,
        createdAt: new Date("2024-06-15"),
        updatedAt: new Date("2024-06-15"),
        user: {
          name: "Jane Smith",
          email: "jane@example.com",
          company: "Smith Construction",
        },
      }

      mockPrismaClient.serviceRequest.create.mockResolvedValue(
        mockCreatedRequest
      )

      const result = await repository.create({
        title: "New Equipment Request",
        description: "Urgent excavator needed",
        contactName: "Jane Smith",
        contactEmail: "jane@example.com",
        contactPhone: "555-0456",
        company: "Smith Construction",
        jobSite: "789 Oak Ave, Dallas, TX",
        transport: "YOU_HANDLE_IT",
        startDate: new Date("2024-07-01"),
        endDate: new Date("2024-07-10"),
        equipmentCategory: "BACKHOES_EXCAVATORS",
        equipmentDetail: "Mini excavator 3-5 ton",
        requestedDurationType: "MULTI_DAY",
        requestedDurationValue: 10,
        requestedTotalHours: 80,
        rateType: "DAILY",
        baseRate: 800,
        userId: "user456",
      })

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()

      if (result.data) {
        // Type assertions for created service request
        expect(result.data.id).toBe("sr_new")
        expect(result.data.title).toBe("New Equipment Request")
        expect(result.data.status).toBe("SUBMITTED")
        expect(result.data.equipmentCategory).toBe("BACKHOES_EXCAVATORS")

        // The create method returns ServiceRequest with user relation included
        if ("user" in result.data && result.data.user) {
          const user = result.data.user as {
            name: string | null
            email: string | null
            company: string | null
          }
          expect(user).toBeDefined()
          expect(user.name).toBe("Jane Smith")
        }
      }
    })
  })

  describe("Type safety for complex query patterns", () => {
    it("should properly type queries with multiple nested relations", async () => {
      // Test that deeply nested relations maintain type safety with Prisma.ServiceRequestGetPayload

      const mockComplexRequest: Prisma.ServiceRequestGetPayload<{
        include: {
          user: { select: { name: true; email: true; company: true } }
          userAssignments: {
            include: {
              operator: { select: { id: true; name: true; email: true } }
            }
          }
          statusHistory: {
            include: {
              changedByUser: { select: { name: true; email: true } }
            }
          }
        }
      }> = {
        id: "sr_complex",
        title: "Complex Request",
        description: null,
        userId: "user789",
        contactName: "Complex User",
        contactEmail: "complex@example.com",
        contactPhone: "555-0789",
        company: "Complex Co",
        jobSite: "Complex Site",
        transport: "WE_HANDLE_IT",
        startDate: new Date("2024-08-01"),
        endDate: null,
        equipmentCategory: "GRADERS",
        equipmentDetail: "Motor grader",
        requestedDurationType: "WEEKLY",
        requestedDurationValue: 2,
        requestedTotalHours: toDecimal(80),
        rateType: "WEEKLY",
        baseRate: toDecimal(5000),
        status: "OPERATOR_ASSIGNED",
        priority: "HIGH",
        estimatedCost: toDecimal(10000),
        depositAmount: toDecimal(3000),
        depositPaid: true,
        depositPaidAt: new Date("2024-07-20"),
        finalAmount: null,
        finalPaid: false,
        finalPaidAt: null,
        stripeDepositPaymentIntentId: "pi_deposit123",
        stripeFinalPaymentIntentId: null,
        assignedManagerId: "mgr123",
        rejectionReason: null,
        internalNotes: "Priority client",
        createdAt: new Date("2024-07-15"),
        updatedAt: new Date("2024-07-22"),
        user: {
          name: "Complex User",
          email: "complex@example.com",
          company: "Complex Co",
        },
        userAssignments: [
          {
            id: "assign_complex",
            serviceRequestId: "sr_complex",
            operatorId: "op_complex",
            status: "accepted",
            rate: toDecimal(95),
            estimatedHours: toDecimal(80),
            actualHours: null,
            assignedAt: new Date("2024-07-18"),
            acceptedAt: new Date("2024-07-19"),
            completedAt: null,
            createdAt: new Date("2024-07-18"),
            updatedAt: new Date("2024-07-19"),
            operator: {
              id: "op_complex",
              name: "Expert Operator",
              email: "expert@example.com",
            },
          },
        ],
        statusHistory: [
          {
            id: "hist_complex1",
            serviceRequestId: "sr_complex",
            fromStatus: null,
            toStatus: "SUBMITTED",
            changedBy: "user789",
            reason: null,
            notes: null,
            createdAt: new Date("2024-07-15"),
            changedByUser: {
              name: "Complex User",
              email: "complex@example.com",
            },
          },
          {
            id: "hist_complex2",
            serviceRequestId: "sr_complex",
            fromStatus: "SUBMITTED",
            toStatus: "OPERATOR_ASSIGNED",
            changedBy: "mgr123",
            reason: "Operator found",
            notes: "Assigned to expert operator",
            createdAt: new Date("2024-07-18"),
            changedByUser: {
              name: "Manager Name",
              email: "manager@example.com",
            },
          },
        ],
      }

      mockPrismaClient.serviceRequest.findUnique.mockResolvedValue(
        mockComplexRequest
      )

      const result = await repository.findById("sr_complex")

      expect(result.success).toBe(true)

      if (result.data) {
        // TypeScript should know the exact shape of all nested relations
        expect(result.data.user).toBeDefined()
        expect(result.data.userAssignments).toBeDefined()
        expect(result.data.statusHistory).toBeDefined()

        // Deep nesting type checks
        if (result.data.userAssignments[0]) {
          expect(result.data.userAssignments[0].operator).toBeDefined()
          expect(result.data.userAssignments[0].operator.name).toBe(
            "Expert Operator"
          )
        }

        if (result.data.statusHistory[1]) {
          expect(result.data.statusHistory[1].changedByUser).toBeDefined()
          expect(result.data.statusHistory[1].changedByUser.name).toBe(
            "Manager Name"
          )
        }
      }
    })

    it("should maintain type safety when queries return null", async () => {
      mockPrismaClient.serviceRequest.findUnique.mockResolvedValue(null)

      const result = await repository.findById("nonexistent")

      expect(result.success).toBe(true)
      expect(result.data).toBeNull()

      // With proper typing, result.data can be null and TypeScript should know this
      if (result.data === null) {
        expect(result.data).toBeNull()
      }
    })

    it("should properly type empty arrays in relations", async () => {
      const mockRequestWithEmptyRelations: Prisma.ServiceRequestGetPayload<{
        include: {
          user: { select: { name: true; email: true; company: true } }
          userAssignments: {
            include: {
              operator: { select: { id: true; name: true; email: true } }
            }
          }
          statusHistory: {
            include: {
              changedByUser: { select: { name: true; email: true } }
            }
          }
        }
      }> = {
        id: "sr_empty",
        title: "Empty Relations Request",
        description: null,
        userId: "user999",
        contactName: "Test User",
        contactEmail: "test@example.com",
        contactPhone: "555-0999",
        company: null,
        jobSite: "Test Site",
        transport: "WE_HANDLE_IT",
        startDate: new Date("2024-09-01"),
        endDate: null,
        equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
        equipmentDetail: "Skid steer",
        requestedDurationType: "FULL_DAY",
        requestedDurationValue: 1,
        requestedTotalHours: toDecimal(8),
        rateType: "DAILY",
        baseRate: toDecimal(500),
        status: "SUBMITTED",
        priority: "NORMAL",
        estimatedCost: null,
        depositAmount: null,
        depositPaid: false,
        depositPaidAt: null,
        finalAmount: null,
        finalPaid: false,
        finalPaidAt: null,
        stripeDepositPaymentIntentId: null,
        stripeFinalPaymentIntentId: null,
        assignedManagerId: null,
        rejectionReason: null,
        internalNotes: null,
        createdAt: new Date("2024-08-25"),
        updatedAt: new Date("2024-08-25"),
        user: {
          name: "Test User",
          email: "test@example.com",
          company: null,
        },
        userAssignments: [], // Empty array
        statusHistory: [], // Empty array
      }

      mockPrismaClient.serviceRequest.findUnique.mockResolvedValue(
        mockRequestWithEmptyRelations
      )

      const result = await repository.findById("sr_empty")

      expect(result.success).toBe(true)

      if (result.data) {
        // TypeScript should know these are arrays even when empty
        expect(Array.isArray(result.data.userAssignments)).toBe(true)
        expect(result.data.userAssignments).toHaveLength(0)

        expect(Array.isArray(result.data.statusHistory)).toBe(true)
        expect(result.data.statusHistory).toHaveLength(0)
      }
    })
  })
})
