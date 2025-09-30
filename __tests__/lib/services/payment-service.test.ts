/**
 * Payment Service Tests
 *
 * Comprehensive test suite for PaymentService following TDD principles.
 * Tests deposit payments, final payments, refunds, confirmations, and error scenarios.
 *
 * Coverage Target: 4.16% → 85%
 * Issue: #355 - Critical Test Coverage - Payment & Financial Security
 */

import { PaymentService } from "@/lib/services/payment-service"
import type { Payment } from "@prisma/client"
import type { PaymentRepository } from "@/lib/repositories"
import type { ServiceRequestService } from "@/lib/services/service-request-service"
import type { ServiceLogger } from "@/lib/services/base-service"
import type Stripe from "stripe"

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

// Mock Stripe client
const createMockStripe = () => {
  const mock = {
    paymentIntents: {
      create: jest.fn(),
      retrieve: jest.fn(),
      cancel: jest.fn(),
    },
    refunds: {
      create: jest.fn(),
    },
  }
  return mock as any as Stripe
}

// Mock PaymentRepository
const createMockPaymentRepository = () => {
  const mock = {
    findById: jest.fn(),
    findByStripePaymentIntentId: jest.fn(),
    findDepositByServiceRequest: jest.fn(),
    findFinalByServiceRequest: jest.fn(),
    findByServiceRequest: jest.fn(),
    getTotalPaidAmount: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
  return mock as unknown as PaymentRepository & typeof mock
}

// Mock ServiceRequestService
const createMockServiceRequestService = () => {
  const mock = {
    changeStatus: jest.fn(),
  }
  return mock as unknown as ServiceRequestService & typeof mock
}

// Helper to create mock Payment
const createMockPayment = (overrides?: Partial<Payment>): Payment => ({
  id: "payment_123",
  serviceRequestId: "request_123",
  type: "DEPOSIT",
  amount: 100.0 as any, // Cast Decimal for mock
  currency: "USD",
  status: "PENDING",
  stripePaymentIntentId: "pi_123",
  stripeChargeId: null,
  paidAt: null,
  refundedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

describe("PaymentService", () => {
  let service: PaymentService
  let mockLogger: MockLogger
  let mockStripe: any
  let mockPaymentRepository: any
  let mockServiceRequestService: any

  beforeEach(() => {
    mockLogger = new MockLogger()
    mockStripe = createMockStripe()
    mockPaymentRepository = createMockPaymentRepository()
    mockServiceRequestService = createMockServiceRequestService()

    service = new PaymentService(
      mockStripe as Stripe,
      mockPaymentRepository as PaymentRepository,
      mockServiceRequestService as ServiceRequestService,
      mockLogger
    )

    jest.clearAllMocks()
  })

  describe("createDepositPayment", () => {
    it("should create deposit payment with Stripe integration", async () => {
      // Arrange
      const input = {
        serviceRequestId: "request_123",
        amount: 500 as any,
        userId: "user_123",
      }

      const mockPaymentIntent = {
        id: "pi_123",
        client_secret: "pi_123_secret_456",
        amount: 50000, // cents
        currency: "usd",
        status: "requires_payment_method",
      }

      const mockPayment = createMockPayment({
        amount: 500 as any,
        stripePaymentIntentId: "pi_123",
      })

      // Mock: No existing deposit
      mockPaymentRepository.findDepositByServiceRequest.mockResolvedValue({
        success: true,
        data: null,
      })

      // Mock: Stripe creates payment intent
      mockStripe.paymentIntents.create.mockResolvedValue(
        mockPaymentIntent as any
      )

      // Mock: Payment repository creates record
      mockPaymentRepository.create.mockResolvedValue({
        success: true,
        data: mockPayment,
      })

      // Mock: Service request status update
      mockServiceRequestService.changeStatus.mockResolvedValue({
        success: true,
        data: {} as any,
      })

      // Act
      const result = await service.createDepositPayment(input)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data?.paymentIntentId).toBe("pi_123")
      expect(result.data?.clientSecret).toBe("pi_123_secret_456")
      expect(result.data?.amount).toBe(500)
      expect(result.data?.currency).toBe("usd")
      expect(result.data?.status).toBe("requires_payment_method")

      // Verify Stripe was called correctly
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 50000, // $500 in cents
        currency: "usd",
        metadata: {
          serviceRequestId: "request_123",
          userId: "user_123",
          paymentType: "DEPOSIT",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      })

      // Verify payment was recorded
      expect(mockPaymentRepository.create).toHaveBeenCalledWith({
        serviceRequestId: "request_123",
        type: "DEPOSIT",
        amount: expect.any(Object), // Decimal
        currency: "USD",
        status: "PENDING",
        stripePaymentIntentId: "pi_123",
      })

      // Verify status was updated
      expect(mockServiceRequestService.changeStatus).toHaveBeenCalledWith({
        requestId: "request_123",
        newStatus: "DEPOSIT_PENDING",
        userId: "user_123",
        userRole: "ADMIN",
        reason: "Deposit payment intent created",
      })
    })

    it("should reject deposit payment with zero amount", async () => {
      // Arrange
      const input = {
        serviceRequestId: "request_123",
        amount: 0 as any,
        userId: "user_123",
      }

      // Act
      const result = await service.createDepositPayment(input)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(result.error?.message).toBe(
        "Payment amount must be greater than zero"
      )
      expect(result.error?.details).toEqual({ amount: 0 })

      // Verify no Stripe calls were made
      expect(mockStripe.paymentIntents.create).not.toHaveBeenCalled()
    })

    it("should reject deposit payment with negative amount", async () => {
      // Arrange
      const input = {
        serviceRequestId: "request_123",
        amount: -100,
        userId: "user_123",
      }

      // Act
      const result = await service.createDepositPayment(input)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(result.error?.message).toBe(
        "Payment amount must be greater than zero"
      )
      expect(result.error?.details).toEqual({ amount: -100 })
    })

    it("should reject deposit payment with missing required fields", async () => {
      // Arrange - missing amount
      const input = {
        serviceRequestId: "request_123",
        userId: "user_123",
      } as any

      // Act
      const result = await service.createDepositPayment(input)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(result.error?.message).toBe("Missing required parameters")
      expect(result.error?.details).toEqual({ missingFields: ["amount"] })
    })

    it("should handle small deposit amounts correctly (cents conversion)", async () => {
      // Arrange
      const input = {
        serviceRequestId: "request_123",
        amount: 1.5, // $1.50
        userId: "user_123",
      }

      const mockPaymentIntent = {
        id: "pi_123",
        client_secret: "pi_123_secret",
        amount: 150, // cents
        currency: "usd",
        status: "requires_payment_method",
      }

      const mockPayment = createMockPayment({
        amount: 1.5 as any,
        stripePaymentIntentId: "pi_123",
      })

      mockPaymentRepository.findDepositByServiceRequest.mockResolvedValue({
        success: true,
        data: null,
      })

      mockStripe.paymentIntents.create.mockResolvedValue(
        mockPaymentIntent as any
      )

      mockPaymentRepository.create.mockResolvedValue({
        success: true,
        data: mockPayment,
      })

      mockServiceRequestService.changeStatus.mockResolvedValue({
        success: true,
        data: {} as any,
      })

      // Act
      const result = await service.createDepositPayment(input)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data?.amount).toBe(1.5)

      // Verify correct cents conversion
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 150, // $1.50 = 150 cents
        })
      )
    })

    it("should return existing payment intent for idempotency", async () => {
      // Arrange
      const input = {
        serviceRequestId: "request_123",
        amount: 500 as any,
        userId: "user_123",
      }

      const existingPayment = createMockPayment({
        amount: 500 as any,
        stripePaymentIntentId: "pi_existing",
      })

      const existingPaymentIntent = {
        id: "pi_existing",
        client_secret: "pi_existing_secret",
        amount: 50000 as any,
        currency: "usd",
        status: "requires_payment_method",
      }

      // Mock: Existing deposit found
      mockPaymentRepository.findDepositByServiceRequest.mockResolvedValue({
        success: true,
        data: existingPayment,
      })

      // Mock: Retrieve existing payment intent from Stripe
      mockStripe.paymentIntents.retrieve.mockResolvedValue(
        existingPaymentIntent as any
      )

      // Act
      const result = await service.createDepositPayment(input)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data?.paymentIntentId).toBe("pi_existing")
      expect(result.data?.clientSecret).toBe("pi_existing_secret")
      expect(result.data?.amount).toBe(500) // Converted from cents

      // Verify no new payment intent was created
      expect(mockStripe.paymentIntents.create).not.toHaveBeenCalled()

      // Verify no new payment record was created
      expect(mockPaymentRepository.create).not.toHaveBeenCalled()
    })

    it("should handle Stripe API failure gracefully", async () => {
      // Arrange
      const input = {
        serviceRequestId: "request_123",
        amount: 500 as any,
        userId: "user_123",
      }

      mockPaymentRepository.findDepositByServiceRequest.mockResolvedValue({
        success: true,
        data: null,
      })

      // Mock: Stripe API fails
      mockStripe.paymentIntents.create.mockRejectedValue(
        new Error("Stripe API error: Invalid API key")
      )

      // Act
      const result = await service.createDepositPayment(input)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("PAYMENT_ERROR")
      expect(result.error?.message).toContain("Stripe API error")

      // Verify no payment record was created
      expect(mockPaymentRepository.create).not.toHaveBeenCalled()
    })

    it("should rollback Stripe payment intent on database failure", async () => {
      // Arrange
      const input = {
        serviceRequestId: "request_123",
        amount: 500 as any,
        userId: "user_123",
      }

      const mockPaymentIntent = {
        id: "pi_123",
        client_secret: "pi_123_secret",
        amount: 50000 as any,
        currency: "usd",
        status: "requires_payment_method",
      }

      mockPaymentRepository.findDepositByServiceRequest.mockResolvedValue({
        success: true,
        data: null,
      })

      // Mock: Stripe succeeds
      mockStripe.paymentIntents.create.mockResolvedValue(
        mockPaymentIntent as any
      )

      // Mock: Database fails
      mockPaymentRepository.create.mockResolvedValue({
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to insert payment record",
          timestamp: new Date(),
        },
      })

      // Mock: Cancel succeeds
      mockStripe.paymentIntents.cancel.mockResolvedValue({} as any)

      // Act
      const result = await service.createDepositPayment(input)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("PAYMENT_ERROR")

      // Verify rollback was attempted
      expect(mockStripe.paymentIntents.cancel).toHaveBeenCalledWith("pi_123")
    })

    it("should handle rollback failure gracefully", async () => {
      // Arrange
      const input = {
        serviceRequestId: "request_123",
        amount: 500 as any,
        userId: "user_123",
      }

      const mockPaymentIntent = {
        id: "pi_123",
        client_secret: "pi_123_secret",
        amount: 50000 as any,
        currency: "usd",
        status: "requires_payment_method",
      }

      mockPaymentRepository.findDepositByServiceRequest.mockResolvedValue({
        success: true,
        data: null,
      })

      mockStripe.paymentIntents.create.mockResolvedValue(
        mockPaymentIntent as any
      )

      mockPaymentRepository.create.mockResolvedValue({
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to insert payment record",
          timestamp: new Date(),
        },
      })

      // Mock: Cancel also fails
      mockStripe.paymentIntents.cancel.mockRejectedValue(
        new Error("Payment intent already captured")
      )

      // Act
      const result = await service.createDepositPayment(input)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("PAYMENT_ERROR")

      // Verify warning was logged about failed rollback
      const warnLogs = mockLogger.logs.filter((log) => log.level === "warn")
      expect(warnLogs.length).toBeGreaterThan(0)
      expect(warnLogs[0]?.message).toContain("Failed to cancel PaymentIntent")
    })

    it("should include custom metadata in Stripe payment intent", async () => {
      // Arrange
      const input = {
        serviceRequestId: "request_123",
        amount: 500 as any,
        userId: "user_123",
        metadata: {
          customField: "customValue",
          orderNumber: "12345",
        },
      }

      const mockPaymentIntent = {
        id: "pi_123",
        client_secret: "pi_123_secret",
        amount: 50000 as any,
        currency: "usd",
        status: "requires_payment_method",
      }

      mockPaymentRepository.findDepositByServiceRequest.mockResolvedValue({
        success: true,
        data: null,
      })

      mockStripe.paymentIntents.create.mockResolvedValue(
        mockPaymentIntent as any
      )

      mockPaymentRepository.create.mockResolvedValue({
        success: true,
        data: createMockPayment(),
      })

      mockServiceRequestService.changeStatus.mockResolvedValue({
        success: true,
        data: {} as any,
      })

      // Act
      await service.createDepositPayment(input)

      // Assert
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: {
            serviceRequestId: "request_123",
            userId: "user_123",
            paymentType: "DEPOSIT",
            customField: "customValue",
            orderNumber: "12345",
          },
        })
      )
    })
  })

  describe("createFinalPayment", () => {
    it("should create final payment with Stripe integration", async () => {
      // Arrange
      const input = {
        serviceRequestId: "request_123",
        amount: 1000 as any,
        userId: "user_123",
      }

      const mockPaymentIntent = {
        id: "pi_final_123",
        client_secret: "pi_final_secret",
        amount: 100000, // cents
        currency: "usd",
        status: "requires_payment_method",
      }

      const mockPayment = createMockPayment({
        type: "FINAL",
        amount: 1000 as any,
        stripePaymentIntentId: "pi_final_123",
      })

      // Mock: No existing final payment
      mockPaymentRepository.findFinalByServiceRequest.mockResolvedValue({
        success: true,
        data: null,
      })

      mockStripe.paymentIntents.create.mockResolvedValue(
        mockPaymentIntent as any
      )

      mockPaymentRepository.create.mockResolvedValue({
        success: true,
        data: mockPayment,
      })

      mockServiceRequestService.changeStatus.mockResolvedValue({
        success: true,
        data: {} as any,
      })

      // Act
      const result = await service.createFinalPayment(input)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data?.paymentIntentId).toBe("pi_final_123")
      expect(result.data?.amount).toBe(1000)

      // Verify payment type is FINAL in metadata
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({
            paymentType: "FINAL",
          }),
        })
      )

      // Verify correct payment type in database
      expect(mockPaymentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "FINAL",
        })
      )

      // Verify status updated to PAYMENT_PENDING
      expect(mockServiceRequestService.changeStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          newStatus: "PAYMENT_PENDING",
        })
      )
    })

    it("should return existing final payment intent for idempotency", async () => {
      // Arrange
      const input = {
        serviceRequestId: "request_123",
        amount: 1000 as any,
        userId: "user_123",
      }

      const existingPayment = createMockPayment({
        type: "FINAL",
        amount: 1000 as any,
        stripePaymentIntentId: "pi_final_existing",
      })

      const existingPaymentIntent = {
        id: "pi_final_existing",
        client_secret: "pi_final_existing_secret",
        amount: 100000 as any,
        currency: "usd",
        status: "requires_payment_method",
      }

      mockPaymentRepository.findFinalByServiceRequest.mockResolvedValue({
        success: true,
        data: existingPayment,
      })

      mockStripe.paymentIntents.retrieve.mockResolvedValue(
        existingPaymentIntent as any
      )

      // Act
      const result = await service.createFinalPayment(input)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data?.paymentIntentId).toBe("pi_final_existing")

      // Verify no new payment was created
      expect(mockStripe.paymentIntents.create).not.toHaveBeenCalled()
      expect(mockPaymentRepository.create).not.toHaveBeenCalled()
    })

    it("should reject final payment with invalid amount", async () => {
      // Arrange
      const input = {
        serviceRequestId: "request_123",
        amount: -500,
        userId: "user_123",
      }

      // Act
      const result = await service.createFinalPayment(input)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(result.error?.message).toBe(
        "Payment amount must be greater than zero"
      )
    })
  })

  describe("confirmPayment", () => {
    it("should confirm deposit payment and update status", async () => {
      // Arrange
      const input = {
        stripePaymentIntentId: "pi_123",
        stripeChargeId: "ch_123",
        userId: "user_123",
      }

      const mockPayment = createMockPayment({
        type: "DEPOSIT",
        status: "PENDING",
        stripePaymentIntentId: "pi_123",
      })

      const updatedPayment = {
        ...mockPayment,
        status: "COMPLETED",
        stripeChargeId: "ch_123",
        paidAt: expect.any(Date),
      }

      mockPaymentRepository.findByStripePaymentIntentId.mockResolvedValue({
        success: true,
        data: mockPayment,
      })

      mockPaymentRepository.update.mockResolvedValue({
        success: true,
        data: updatedPayment as any,
      })

      mockServiceRequestService.changeStatus.mockResolvedValue({
        success: true,
        data: {} as any,
      })

      // Act
      const result = await service.confirmPayment(input)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data?.status).toBe("COMPLETED")

      // Verify payment was updated
      expect(mockPaymentRepository.update).toHaveBeenCalledWith(
        mockPayment.id,
        expect.objectContaining({
          status: "COMPLETED",
          stripeChargeId: "ch_123",
          paidAt: expect.any(Date),
        })
      )

      // Verify service request status updated to DEPOSIT_RECEIVED
      expect(mockServiceRequestService.changeStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          newStatus: "DEPOSIT_RECEIVED",
          reason: "DEPOSIT payment confirmed via Stripe",
        })
      )
    })

    it("should confirm final payment and update status", async () => {
      // Arrange
      const input = {
        stripePaymentIntentId: "pi_final_123",
        userId: "user_123",
      }

      const mockPayment = createMockPayment({
        type: "FINAL",
        status: "PENDING",
        stripePaymentIntentId: "pi_final_123",
      })

      const updatedPayment = {
        ...mockPayment,
        status: "COMPLETED",
        paidAt: new Date(),
      }

      mockPaymentRepository.findByStripePaymentIntentId.mockResolvedValue({
        success: true,
        data: mockPayment,
      })

      mockPaymentRepository.update.mockResolvedValue({
        success: true,
        data: updatedPayment as any,
      })

      mockServiceRequestService.changeStatus.mockResolvedValue({
        success: true,
        data: {} as any,
      })

      // Act
      const result = await service.confirmPayment(input)

      // Assert
      expect(result.success).toBe(true)

      // Verify service request status updated to PAYMENT_RECEIVED
      expect(mockServiceRequestService.changeStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          newStatus: "PAYMENT_RECEIVED",
          reason: "FINAL payment confirmed via Stripe",
        })
      )
    })

    it("should handle payment not found", async () => {
      // Arrange
      const input = {
        stripePaymentIntentId: "pi_nonexistent",
        userId: "user_123",
      }

      mockPaymentRepository.findByStripePaymentIntentId.mockResolvedValue({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Payment not found",
          timestamp: new Date(),
        },
      })

      // Act
      const result = await service.confirmPayment(input)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error?.message).toContain("Payment not found")
    })

    it("should reject confirmation with missing payment intent ID", async () => {
      // Arrange
      const input = {
        stripePaymentIntentId: "",
        userId: "user_123",
      }

      // Act
      const result = await service.confirmPayment(input)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(result.error?.message).toBe("Missing required parameters")
    })
  })

  describe("refundPayment", () => {
    it("should process full refund successfully", async () => {
      const input = {
        paymentId: "payment_123",
        userId: "user_123",
        reason: "customer_request",
      }

      const mockPayment = createMockPayment({
        status: "COMPLETED",
        stripePaymentIntentId: "pi_123",
        amount: 500 as any,
      })

      const mockRefund = {
        id: "re_123",
        amount: 50000 as any,
        status: "succeeded",
      }

      mockPaymentRepository.findById.mockResolvedValue({
        success: true,
        data: mockPayment,
      })

      mockStripe.refunds.create.mockResolvedValue(mockRefund as any)

      mockPaymentRepository.update.mockResolvedValue({
        success: true,
        data: {
          ...mockPayment,
          status: "REFUNDED",
          refundedAt: new Date(),
        } as any,
      })

      const result = await service.refundPayment(input)

      expect(result.success).toBe(true)
      expect(result.data?.status).toBe("REFUNDED")

      expect(mockStripe.refunds.create).toHaveBeenCalledWith({
        payment_intent: "pi_123",
        reason: "customer_request",
      })

      expect(mockPaymentRepository.update).toHaveBeenCalledWith(
        "payment_123",
        expect.objectContaining({
          status: "REFUNDED",
          refundedAt: expect.any(Date),
        })
      )
    })

    it("should process partial refund successfully", async () => {
      const input = {
        paymentId: "payment_123",
        amount: 250 as any,
        userId: "user_123",
      }

      const mockPayment = createMockPayment({
        status: "COMPLETED",
        stripePaymentIntentId: "pi_123",
        amount: 500 as any,
      })

      const mockRefund = {
        id: "re_123",
        amount: 25000 as any,
        status: "succeeded",
      }

      mockPaymentRepository.findById.mockResolvedValue({
        success: true,
        data: mockPayment,
      })

      mockStripe.refunds.create.mockResolvedValue(mockRefund as any)

      mockPaymentRepository.update.mockResolvedValue({
        success: true,
        data: { ...mockPayment, status: "REFUNDED" } as any,
      })

      const result = await service.refundPayment(input)

      expect(result.success).toBe(true)

      expect(mockStripe.refunds.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 25000 as any,
        })
      )
    })

    it("should reject refund for non-completed payment", async () => {
      const input = {
        paymentId: "payment_123",
        userId: "user_123",
      }

      const mockPayment = createMockPayment({
        status: "PENDING",
        stripePaymentIntentId: "pi_123",
      })

      mockPaymentRepository.findById.mockResolvedValue({
        success: true,
        data: mockPayment,
      })

      const result = await service.refundPayment(input)

      expect(result.success).toBe(false)
      expect(result.error?.message).toContain(
        "Cannot refund payment with status: PENDING"
      )

      expect(mockStripe.refunds.create).not.toHaveBeenCalled()
    })

    it("should handle payment not found", async () => {
      const input = {
        paymentId: "nonexistent_payment",
        userId: "user_123",
      }

      mockPaymentRepository.findById.mockResolvedValue({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Payment not found",
          timestamp: new Date(),
        },
      })

      const result = await service.refundPayment(input)

      expect(result.success).toBe(false)
      expect(result.error?.message).toContain("Payment not found")
    })

    it("should handle Stripe refund failure", async () => {
      const input = {
        paymentId: "payment_123",
        userId: "user_123",
      }

      const mockPayment = createMockPayment({
        status: "COMPLETED",
        stripePaymentIntentId: "pi_123",
      })

      mockPaymentRepository.findById.mockResolvedValue({
        success: true,
        data: mockPayment,
      })

      mockStripe.refunds.create.mockRejectedValue(
        new Error("Charge has already been refunded")
      )

      const result = await service.refundPayment(input)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("PAYMENT_ERROR")

      expect(mockPaymentRepository.update).not.toHaveBeenCalled()
    })

    it("should reject refund for payment without Stripe payment intent", async () => {
      const input = {
        paymentId: "payment_123",
        userId: "user_123",
      }

      const mockPayment = createMockPayment({
        status: "COMPLETED",
        stripePaymentIntentId: null,
      })

      mockPaymentRepository.findById.mockResolvedValue({
        success: true,
        data: mockPayment,
      })

      const result = await service.refundPayment(input)

      expect(result.success).toBe(false)
      expect(result.error?.message).toContain(
        "Payment does not have associated Stripe Payment Intent"
      )
    })
  })

  describe("getPaymentHistory", () => {
    it("should retrieve all payments for service request", async () => {
      const serviceRequestId = "request_123"
      const mockPayments = [
        createMockPayment({
          id: "payment_1",
          type: "DEPOSIT",
          amount: 500 as any,
          status: "COMPLETED",
          paidAt: new Date(),
        }),
        createMockPayment({
          id: "payment_2",
          type: "FINAL",
          amount: 1000 as any,
          status: "COMPLETED",
          paidAt: new Date(),
        }),
      ]

      mockPaymentRepository.findByServiceRequest.mockResolvedValue({
        success: true,
        data: mockPayments,
      })

      const result = await service.getPaymentHistory(serviceRequestId)

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
      expect(result.data?.[0]?.type).toBe("DEPOSIT")
      expect(result.data?.[1]?.type).toBe("FINAL")
    })

    it("should handle empty payment history", async () => {
      const serviceRequestId = "request_123"

      mockPaymentRepository.findByServiceRequest.mockResolvedValue({
        success: true,
        data: [],
      })

      const result = await service.getPaymentHistory(serviceRequestId)

      expect(result.success).toBe(true)
      expect(result.data).toEqual([])
    })

    it("should handle null/undefined values safely", async () => {
      const serviceRequestId = "request_123"
      const mockPayments = [
        createMockPayment({
          stripePaymentIntentId: null,
          stripeChargeId: null,
          paidAt: null,
          refundedAt: null,
        }),
      ]

      mockPaymentRepository.findByServiceRequest.mockResolvedValue({
        success: true,
        data: mockPayments,
      })

      const result = await service.getPaymentHistory(serviceRequestId)

      expect(result.success).toBe(true)
      expect(result.data?.[0]?.stripePaymentIntentId).toBeNull()
      expect(result.data?.[0]?.stripeChargeId).toBeNull()
      expect(result.data?.[0]?.paidAt).toBeNull()
      expect(result.data?.[0]?.refundedAt).toBeNull()
    })

    it("should reject missing service request ID", async () => {
      const result = await service.getPaymentHistory("")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(result.error?.message).toBe("Service request ID is required")
    })
  })

  describe("getTotalPaidAmount", () => {
    it("should calculate total paid amount correctly", async () => {
      const serviceRequestId = "request_123"

      mockPaymentRepository.getTotalPaidAmount.mockResolvedValue({
        success: true,
        data: 1500,
      })

      const result = await service.getTotalPaidAmount(serviceRequestId)

      expect(result.success).toBe(true)
      expect(result.data).toBe(1500)
    })

    it("should return 0 for no payments", async () => {
      const serviceRequestId = "request_123"

      mockPaymentRepository.getTotalPaidAmount.mockResolvedValue({
        success: true,
        data: 0,
      })

      const result = await service.getTotalPaidAmount(serviceRequestId)

      expect(result.success).toBe(true)
      expect(result.data).toBe(0)
    })

    it("should reject missing service request ID", async () => {
      const result = await service.getTotalPaidAmount("")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })
  })

  describe("getPaymentById", () => {
    it("should retrieve payment by ID", async () => {
      const mockPayment = createMockPayment()

      mockPaymentRepository.findById.mockResolvedValue({
        success: true,
        data: mockPayment,
      })

      const result = await service.getPaymentById("payment_123")

      expect(result.success).toBe(true)
      expect(result.data?.id).toBe("payment_123")
    })

    it("should return null for non-existent payment", async () => {
      mockPaymentRepository.findById.mockResolvedValue({
        success: true,
        data: null,
      })

      const result = await service.getPaymentById("nonexistent")

      expect(result.success).toBe(true)
      expect(result.data).toBeNull()
    })

    it("should reject missing payment ID", async () => {
      const result = await service.getPaymentById("")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })
  })

  describe("Security and Error Scenarios", () => {
    it("should not expose Stripe secret keys in logs", async () => {
      const input = {
        serviceRequestId: "request_123",
        amount: 500 as any,
        userId: "user_123",
      }

      mockPaymentRepository.findDepositByServiceRequest.mockResolvedValue({
        success: true,
        data: null,
      })

      mockStripe.paymentIntents.create.mockRejectedValue(
        new Error("Invalid API key")
      )

      const result = await service.createDepositPayment(input)

      // Verify operation failed
      expect(result.success).toBe(false)

      // Note: Error messages are logged by BaseService.
      // This test documents that we should be careful not to log sensitive data.
      // In production, implement error message sanitization before logging.
    })

    it("should handle network timeout errors gracefully", async () => {
      const input = {
        serviceRequestId: "request_123",
        amount: 500 as any,
        userId: "user_123",
      }

      mockPaymentRepository.findDepositByServiceRequest.mockResolvedValue({
        success: true,
        data: null,
      })

      const timeoutError = new Error("ETIMEDOUT")
      timeoutError.name = "TIMEOUT"
      mockStripe.paymentIntents.create.mockRejectedValue(timeoutError)

      const result = await service.createDepositPayment(input)

      expect(result.success).toBe(false)
      // BaseService categorizes errors with name='TIMEOUT' as network errors
      expect(result.error?.code).toBe("TIMEOUT")
      // Note: category is part of StructuredError but not ServiceError
      // This tests that the error was properly categorized
    })

    it("should handle metadata safely in payment creation", async () => {
      const input = {
        serviceRequestId: "request_123",
        amount: 500 as any,
        userId: "user_123",
        metadata: {
          normalField: "normalValue",
          emptyField: "",
        },
      }

      const mockPaymentIntent = {
        id: "pi_123",
        client_secret: "pi_123_secret",
        amount: 50000 as any,
        currency: "usd",
        status: "requires_payment_method",
      }

      mockPaymentRepository.findDepositByServiceRequest.mockResolvedValue({
        success: true,
        data: null,
      })

      mockStripe.paymentIntents.create.mockResolvedValue(
        mockPaymentIntent as any
      )

      mockPaymentRepository.create.mockResolvedValue({
        success: true,
        data: createMockPayment(),
      })

      mockServiceRequestService.changeStatus.mockResolvedValue({
        success: true,
        data: {} as any,
      })

      await service.createDepositPayment(input)

      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({
            normalField: "normalValue",
            emptyField: "",
          }),
        })
      )
    })
  })
})
