/**
 * Payment Repository Tests
 *
 * Comprehensive test suite for PaymentRepository following TDD principles.
 * Tests CRUD operations, payment-specific queries, and null safety patterns.
 */

import {
  PaymentRepository,
  PaymentCreateInput,
  PaymentUpdateInput,
} from "@/lib/repositories/payment-repository"

// Mock Prisma Client using plain object pattern (consistent with existing tests)
const mockPrismaClient = {
  payment: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
  },
} as any

describe("PaymentRepository", () => {
  let repository: PaymentRepository

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    repository = new PaymentRepository(mockPrismaClient)
  })

  describe("findById", () => {
    it("should find payment by ID", async () => {
      const mockPayment = {
        id: "payment_123",
        serviceRequestId: "request_123",
        type: "DEPOSIT",
        amount: 100.0,
        currency: "USD",
        status: "COMPLETED",
        stripePaymentIntentId: "pi_123",
        stripeChargeId: "ch_123",
        paidAt: new Date(),
        refundedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrismaClient.payment.findUnique.mockResolvedValue(mockPayment)

      const result = await repository.findById("payment_123")

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockPayment)
      expect(mockPrismaClient.payment.findUnique).toHaveBeenCalledWith({
        where: { id: "payment_123" },
      })
    })

    it("should return null when payment not found", async () => {
      mockPrismaClient.payment.findUnique.mockResolvedValue(null)

      const result = await repository.findById("nonexistent_id")

      expect(result.success).toBe(true)
      expect(result.data).toBeNull()
    })

    it("should handle database errors", async () => {
      mockPrismaClient.payment.findUnique.mockRejectedValue(
        new Error("Database connection failed")
      )

      const result = await repository.findById("payment_123")

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.error?.code).toBe("PAYMENT_NOT_FOUND")
    })
  })

  describe("findByStripePaymentIntentId", () => {
    it("should find payment by Stripe Payment Intent ID", async () => {
      const mockPayment = {
        id: "payment_123",
        serviceRequestId: "request_123",
        type: "DEPOSIT",
        amount: 100.0,
        currency: "USD",
        status: "COMPLETED",
        stripePaymentIntentId: "pi_123",
        stripeChargeId: "ch_123",
        paidAt: new Date(),
        refundedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrismaClient.payment.findFirst.mockResolvedValue(mockPayment)

      const result = await repository.findByStripePaymentIntentId("pi_123")

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockPayment)
      expect(mockPrismaClient.payment.findFirst).toHaveBeenCalledWith({
        where: { stripePaymentIntentId: "pi_123" },
      })
    })

    it("should return null when payment not found by Stripe Payment Intent ID", async () => {
      mockPrismaClient.payment.findFirst.mockResolvedValue(null)

      const result = await repository.findByStripePaymentIntentId(
        "nonexistent_pi"
      )

      expect(result.success).toBe(true)
      expect(result.data).toBeNull()
    })
  })

  describe("findByServiceRequest", () => {
    it("should find all payments for service request ordered by date", async () => {
      const mockPayments = [
        {
          id: "payment_2",
          serviceRequestId: "request_123",
          type: "FINAL",
          amount: 500.0,
          currency: "USD",
          status: "COMPLETED",
          stripePaymentIntentId: "pi_456",
          stripeChargeId: "ch_456",
          paidAt: new Date("2025-09-30"),
          refundedAt: null,
          createdAt: new Date("2025-09-30"),
          updatedAt: new Date("2025-09-30"),
        },
        {
          id: "payment_1",
          serviceRequestId: "request_123",
          type: "DEPOSIT",
          amount: 100.0,
          currency: "USD",
          status: "COMPLETED",
          stripePaymentIntentId: "pi_123",
          stripeChargeId: "ch_123",
          paidAt: new Date("2025-09-25"),
          refundedAt: null,
          createdAt: new Date("2025-09-25"),
          updatedAt: new Date("2025-09-25"),
        },
      ]

      mockPrismaClient.payment.findMany.mockResolvedValue(mockPayments)

      const result = await repository.findByServiceRequest("request_123")

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockPayments)
      expect(result.data).toHaveLength(2)
      expect(mockPrismaClient.payment.findMany).toHaveBeenCalledWith({
        where: { serviceRequestId: "request_123" },
        orderBy: { createdAt: "desc" },
      })
    })

    it("should return empty array when no payments found", async () => {
      mockPrismaClient.payment.findMany.mockResolvedValue([])

      const result = await repository.findByServiceRequest("request_123")

      expect(result.success).toBe(true)
      expect(result.data).toEqual([])
    })
  })

  describe("findDepositByServiceRequest", () => {
    it("should find deposit payment for service request", async () => {
      const mockPayment = {
        id: "payment_123",
        serviceRequestId: "request_123",
        type: "DEPOSIT",
        amount: 100.0,
        currency: "USD",
        status: "COMPLETED",
        stripePaymentIntentId: "pi_123",
        stripeChargeId: "ch_123",
        paidAt: new Date(),
        refundedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrismaClient.payment.findFirst.mockResolvedValue(mockPayment)

      const result = await repository.findDepositByServiceRequest("request_123")

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockPayment)
      expect(mockPrismaClient.payment.findFirst).toHaveBeenCalledWith({
        where: {
          serviceRequestId: "request_123",
          type: "DEPOSIT",
        },
        orderBy: { createdAt: "desc" },
      })
    })
  })

  describe("findFinalByServiceRequest", () => {
    it("should find final payment for service request", async () => {
      const mockPayment = {
        id: "payment_456",
        serviceRequestId: "request_123",
        type: "FINAL",
        amount: 500.0,
        currency: "USD",
        status: "COMPLETED",
        stripePaymentIntentId: "pi_456",
        stripeChargeId: "ch_456",
        paidAt: new Date(),
        refundedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrismaClient.payment.findFirst.mockResolvedValue(mockPayment)

      const result = await repository.findFinalByServiceRequest("request_123")

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockPayment)
      expect(mockPrismaClient.payment.findFirst).toHaveBeenCalledWith({
        where: {
          serviceRequestId: "request_123",
          type: "FINAL",
        },
        orderBy: { createdAt: "desc" },
      })
    })
  })

  describe("create", () => {
    it("should create payment with required fields", async () => {
      const createInput: PaymentCreateInput = {
        serviceRequestId: "request_123",
        type: "DEPOSIT",
        amount: 100.0,
        status: "PENDING",
      }

      const mockPayment = {
        id: "payment_123",
        ...createInput,
        currency: "USD",
        stripePaymentIntentId: null,
        stripeChargeId: null,
        paidAt: null,
        refundedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrismaClient.payment.create.mockResolvedValue(mockPayment)

      const result = await repository.create(createInput)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockPayment)
      expect(mockPrismaClient.payment.create).toHaveBeenCalledWith({
        data: {
          serviceRequestId: "request_123",
          type: "DEPOSIT",
          amount: 100.0,
          currency: "USD",
          status: "PENDING",
          stripePaymentIntentId: null,
          stripeChargeId: null,
          paidAt: null,
        },
      })
    })

    it("should create payment with all fields including Stripe data", async () => {
      const createInput: PaymentCreateInput = {
        serviceRequestId: "request_123",
        type: "DEPOSIT",
        amount: 100.0,
        currency: "USD",
        status: "COMPLETED",
        stripePaymentIntentId: "pi_123",
        stripeChargeId: "ch_123",
        paidAt: new Date("2025-09-30"),
      }

      const mockPayment = {
        id: "payment_123",
        ...createInput,
        refundedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrismaClient.payment.create.mockResolvedValue(mockPayment)

      const result = await repository.create(createInput)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockPayment)
    })

    it("should fail validation when required fields missing", async () => {
      const invalidInput = {
        serviceRequestId: "request_123",
        // Missing type, amount, status
      } as PaymentCreateInput

      const result = await repository.create(invalidInput)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(mockPrismaClient.payment.create).not.toHaveBeenCalled()
    })

    it("should handle database errors during creation", async () => {
      const createInput: PaymentCreateInput = {
        serviceRequestId: "request_123",
        type: "DEPOSIT",
        amount: 100.0,
        status: "PENDING",
      }

      mockPrismaClient.payment.create.mockRejectedValue(
        new Error("Database constraint violation")
      )

      const result = await repository.create(createInput)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.error?.code).toBe("PAYMENT_CREATE_ERROR")
    })
  })

  describe("update", () => {
    it("should update payment status", async () => {
      const updateInput: PaymentUpdateInput = {
        status: "COMPLETED",
        paidAt: new Date("2025-09-30"),
      }

      const mockPayment = {
        id: "payment_123",
        serviceRequestId: "request_123",
        type: "DEPOSIT",
        amount: 100.0,
        currency: "USD",
        status: "COMPLETED",
        stripePaymentIntentId: "pi_123",
        stripeChargeId: "ch_123",
        paidAt: new Date("2025-09-30"),
        refundedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrismaClient.payment.update.mockResolvedValue(mockPayment)

      const result = await repository.update("payment_123", updateInput)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockPayment)
      expect(mockPrismaClient.payment.update).toHaveBeenCalledWith({
        where: { id: "payment_123" },
        data: {
          status: "COMPLETED",
          paidAt: updateInput.paidAt,
        },
      })
    })

    it("should update payment with Stripe charge ID", async () => {
      const updateInput: PaymentUpdateInput = {
        stripeChargeId: "ch_123",
      }

      const mockPayment = {
        id: "payment_123",
        serviceRequestId: "request_123",
        type: "DEPOSIT",
        amount: 100.0,
        currency: "USD",
        status: "PENDING",
        stripePaymentIntentId: "pi_123",
        stripeChargeId: "ch_123",
        paidAt: null,
        refundedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrismaClient.payment.update.mockResolvedValue(mockPayment)

      const result = await repository.update("payment_123", updateInput)

      expect(result.success).toBe(true)
      expect(result.data?.stripeChargeId).toBe("ch_123")
    })

    it("should update refund information", async () => {
      const refundDate = new Date("2025-09-30")
      const updateInput: PaymentUpdateInput = {
        status: "REFUNDED",
        refundedAt: refundDate,
      }

      const mockPayment = {
        id: "payment_123",
        serviceRequestId: "request_123",
        type: "DEPOSIT",
        amount: 100.0,
        currency: "USD",
        status: "REFUNDED",
        stripePaymentIntentId: "pi_123",
        stripeChargeId: "ch_123",
        paidAt: new Date(),
        refundedAt: refundDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrismaClient.payment.update.mockResolvedValue(mockPayment)

      const result = await repository.update("payment_123", updateInput)

      expect(result.success).toBe(true)
      expect(result.data?.status).toBe("REFUNDED")
      expect(result.data?.refundedAt).toEqual(refundDate)
    })

    it("should handle update errors", async () => {
      mockPrismaClient.payment.update.mockRejectedValue(
        new Error("Payment not found")
      )

      const result = await repository.update("nonexistent_id", {
        status: "COMPLETED",
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("PAYMENT_UPDATE_ERROR")
    })
  })

  describe("delete", () => {
    it("should delete payment by ID", async () => {
      mockPrismaClient.payment.delete.mockResolvedValue({
        id: "payment_123",
      } as any)

      const result = await repository.delete("payment_123")

      expect(result.success).toBe(true)
      expect(result.data).toBe(true)
      expect(mockPrismaClient.payment.delete).toHaveBeenCalledWith({
        where: { id: "payment_123" },
      })
    })

    it("should handle delete errors", async () => {
      mockPrismaClient.payment.delete.mockRejectedValue(
        new Error("Payment not found")
      )

      const result = await repository.delete("nonexistent_id")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("PAYMENT_DELETE_ERROR")
    })
  })

  describe("count", () => {
    it("should count all payments", async () => {
      mockPrismaClient.payment.count.mockResolvedValue(10)

      const result = await repository.count()

      expect(result.success).toBe(true)
      expect(result.data).toBe(10)
      expect(mockPrismaClient.payment.count).toHaveBeenCalledWith({ where: {} })
    })

    it("should count payments with filters", async () => {
      mockPrismaClient.payment.count.mockResolvedValue(5)

      const result = await repository.count({
        where: { status: "COMPLETED" },
      })

      expect(result.success).toBe(true)
      expect(result.data).toBe(5)
      expect(mockPrismaClient.payment.count).toHaveBeenCalledWith({
        where: { status: "COMPLETED" },
      })
    })
  })

  describe("countByServiceRequest", () => {
    it("should count payments for service request", async () => {
      mockPrismaClient.payment.count.mockResolvedValue(3)

      const result = await repository.countByServiceRequest("request_123")

      expect(result.success).toBe(true)
      expect(result.data).toBe(3)
      expect(mockPrismaClient.payment.count).toHaveBeenCalledWith({
        where: { serviceRequestId: "request_123" },
      })
    })
  })

  describe("getTotalPaidAmount", () => {
    it("should calculate total paid amount for completed payments", async () => {
      mockPrismaClient.payment.aggregate.mockResolvedValue({
        _sum: {
          amount: { toFixed: () => "600.00" },
        },
      } as any)

      const result = await repository.getTotalPaidAmount("request_123")

      expect(result.success).toBe(true)
      expect(result.data).toBe(600.0)
      expect(mockPrismaClient.payment.aggregate).toHaveBeenCalledWith({
        where: {
          serviceRequestId: "request_123",
          status: "COMPLETED",
        },
        _sum: {
          amount: true,
        },
      })
    })

    it("should return 0 when no completed payments exist", async () => {
      mockPrismaClient.payment.aggregate.mockResolvedValue({
        _sum: {
          amount: null,
        },
      } as any)

      const result = await repository.getTotalPaidAmount("request_123")

      expect(result.success).toBe(true)
      expect(result.data).toBe(0)
    })

    it("should handle null aggregate result", async () => {
      mockPrismaClient.payment.aggregate.mockResolvedValue({
        _sum: null,
      } as any)

      const result = await repository.getTotalPaidAmount("request_123")

      expect(result.success).toBe(true)
      expect(result.data).toBe(0)
    })
  })

  describe("findByFilters", () => {
    it("should filter payments by type", async () => {
      const mockPayments = [
        {
          id: "payment_123",
          serviceRequestId: "request_123",
          type: "DEPOSIT",
          amount: 100.0,
          currency: "USD",
          status: "COMPLETED",
          stripePaymentIntentId: "pi_123",
          stripeChargeId: "ch_123",
          paidAt: new Date(),
          refundedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockPrismaClient.payment.findMany.mockResolvedValue(mockPayments)

      const result = await repository.findByFilters({
        type: "DEPOSIT",
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockPayments)
      expect(mockPrismaClient.payment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { type: "DEPOSIT" },
        })
      )
    })

    it("should filter payments by date range", async () => {
      const startDate = new Date("2025-09-01")
      const endDate = new Date("2025-09-30")

      mockPrismaClient.payment.findMany.mockResolvedValue([])

      await repository.findByFilters({
        createdAfter: startDate,
        createdBefore: endDate,
      })

      expect(mockPrismaClient.payment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        })
      )
    })

    it("should combine multiple filters", async () => {
      mockPrismaClient.payment.findMany.mockResolvedValue([])

      await repository.findByFilters({
        serviceRequestId: "request_123",
        type: "DEPOSIT",
        status: "COMPLETED",
      })

      expect(mockPrismaClient.payment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            serviceRequestId: "request_123",
            type: "DEPOSIT",
            status: "COMPLETED",
          },
        })
      )
    })
  })
})
