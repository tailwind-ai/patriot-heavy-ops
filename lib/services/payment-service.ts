/**
 * Payment Service
 *
 * Platform-agnostic payment processing service integrating Stripe and workflow engine.
 * Handles deposits, final payments, refunds, and payment status synchronization.
 *
 * Design Principles:
 * - Zero Next.js/React dependencies for mobile compatibility
 * - Framework-agnostic implementation
 * - Testable in Node.js environment
 * - Complete null safety patterns (Epic #301)
 * - Financial audit trail maintenance
 * - Idempotent payment operations
 */

import Stripe from "stripe"
import { BaseService, ServiceResult, ServiceLogger } from "./base-service"
import { ServiceRequestService } from "./service-request-service"
import { RepositoryFactory } from "@/lib/repositories"
import { decimalToNumber, numberToDecimal } from "@/lib/utils/decimal"
import type { Payment } from "@prisma/client"
import type { PaymentRepository } from "@/lib/repositories"

// Type definitions for payment operations

/**
 * Payment Intent creation result from Stripe
 */
export type PaymentIntentResult = {
  paymentIntentId: string
  clientSecret: string
  amount: number
  currency: string
  status: string
}

/**
 * Deposit payment creation input
 */
export type CreateDepositPaymentInput = {
  serviceRequestId: string
  amount: number
  userId: string
  metadata?: Record<string, string>
}

/**
 * Final payment creation input
 */
export type CreateFinalPaymentInput = {
  serviceRequestId: string
  amount: number
  userId: string
  metadata?: Record<string, string>
}

/**
 * Payment confirmation input (from webhook)
 */
export type ConfirmPaymentInput = {
  stripePaymentIntentId: string
  stripeChargeId?: string
  userId: string
}

/**
 * Refund payment input
 */
export type RefundPaymentInput = {
  paymentId: string
  amount?: number // Partial refund amount (optional)
  reason?: string
  userId: string
}

/**
 * Payment history result
 */
export type PaymentHistoryEntry = {
  id: string
  type: string
  amount: number
  currency: string
  status: string
  stripePaymentIntentId: string | null
  stripeChargeId: string | null
  paidAt: Date | null
  refundedAt: Date | null
  createdAt: Date
}

/**
 * Payment Service
 * Handles all payment operations with Stripe integration
 */
export class PaymentService extends BaseService {
  private stripe: Stripe
  private paymentRepository: PaymentRepository
  private serviceRequestService: ServiceRequestService

  constructor(
    stripe: Stripe,
    paymentRepository?: PaymentRepository,
    serviceRequestService?: ServiceRequestService,
    logger?: ServiceLogger
  ) {
    super("PaymentService", logger)
    this.stripe = stripe
    this.paymentRepository =
      paymentRepository || RepositoryFactory.getPaymentRepository()
    this.serviceRequestService =
      serviceRequestService || new ServiceRequestService()
  }

  /**
   * Create deposit payment intent
   * Creates a Stripe PaymentIntent and records it in the database
   */
  async createDepositPayment(
    input: CreateDepositPaymentInput
  ): Promise<ServiceResult<PaymentIntentResult>> {
    // Validate required fields
    const validation = this.validateRequired(input, [
      "serviceRequestId",
      "amount",
      "userId",
    ])

    if (!validation.success) {
      return this.createError<PaymentIntentResult>(
        "VALIDATION_ERROR",
        validation.error?.message || "Missing required fields",
        validation.error?.details
      )
    }

    // Validate amount is positive
    if (input.amount <= 0) {
      return this.createError<PaymentIntentResult>(
        "VALIDATION_ERROR",
        "Payment amount must be greater than zero",
        { amount: input.amount }
      )
    }

    this.logOperation("createDepositPayment", {
      serviceRequestId: input.serviceRequestId,
      amount: input.amount,
    })

    return this.handleAsync(
      async () => {
        // Check for existing deposit payment
        const existingDeposit =
          await this.paymentRepository.findDepositByServiceRequest(
            input.serviceRequestId
          )

        if (existingDeposit?.success && existingDeposit?.data) {
          // Return existing payment intent for idempotency
          if (existingDeposit.data.stripePaymentIntentId) {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(
              existingDeposit.data.stripePaymentIntentId
            )

            return {
              paymentIntentId: paymentIntent.id,
              clientSecret: paymentIntent.client_secret || "",
              amount: paymentIntent.amount / 100, // Convert from cents
              currency: paymentIntent.currency,
              status: paymentIntent.status,
            }
          }
        }

        // Create Stripe PaymentIntent
        const amountInCents = Math.round(input.amount * 100)
        const paymentIntent = await this.stripe.paymentIntents.create({
          amount: amountInCents,
          currency: "usd",
          metadata: {
            serviceRequestId: input.serviceRequestId,
            userId: input.userId,
            paymentType: "DEPOSIT",
            ...(input.metadata || {}),
          },
          automatic_payment_methods: {
            enabled: true,
          },
        })

        // Safe access to PaymentIntent properties
        if (!paymentIntent?.id) {
          throw new Error("Failed to create Stripe PaymentIntent")
        }

        // Record payment in database
        const paymentResult = await this.paymentRepository.create({
          serviceRequestId: input.serviceRequestId,
          type: "DEPOSIT",
          amount: numberToDecimal(input.amount),
          currency: "USD",
          status: "PENDING",
          stripePaymentIntentId: paymentIntent.id,
        })

        if (!paymentResult?.success || !paymentResult?.data) {
          // Rollback: Cancel the payment intent
          await this.stripe.paymentIntents.cancel(paymentIntent.id).catch(() => {
            // Log but don't throw - payment intent cleanup is best-effort
            this.logger.warn("Failed to cancel PaymentIntent after DB error", {
              paymentIntentId: paymentIntent.id,
            })
          })

          throw new Error(
            paymentResult?.error?.message || "Failed to record payment"
          )
        }

        // Update service request status to DEPOSIT_PENDING
        await this.serviceRequestService.changeStatus({
          requestId: input.serviceRequestId,
          newStatus: "DEPOSIT_PENDING",
          userId: input.userId,
          userRole: "ADMIN", // System operation
          reason: "Deposit payment intent created",
        })

        return {
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret || "",
          amount: input.amount,
          currency: "usd",
          status: paymentIntent.status,
        }
      },
      "PAYMENT_ERROR",
      "Failed to create deposit payment"
    )
  }

  /**
   * Create final payment intent
   * Creates a Stripe PaymentIntent for final payment after job completion
   */
  async createFinalPayment(
    input: CreateFinalPaymentInput
  ): Promise<ServiceResult<PaymentIntentResult>> {
    // Validate required fields
    const validation = this.validateRequired(input, [
      "serviceRequestId",
      "amount",
      "userId",
    ])

    if (!validation.success) {
      return this.createError<PaymentIntentResult>(
        "VALIDATION_ERROR",
        validation.error?.message || "Missing required fields",
        validation.error?.details
      )
    }

    // Validate amount is positive
    if (input.amount <= 0) {
      return this.createError<PaymentIntentResult>(
        "VALIDATION_ERROR",
        "Payment amount must be greater than zero",
        { amount: input.amount }
      )
    }

    this.logOperation("createFinalPayment", {
      serviceRequestId: input.serviceRequestId,
      amount: input.amount,
    })

    return this.handleAsync(
      async () => {
        // Check for existing final payment
        const existingFinal =
          await this.paymentRepository.findFinalByServiceRequest(
            input.serviceRequestId
          )

        if (existingFinal?.success && existingFinal?.data) {
          // Return existing payment intent for idempotency
          if (existingFinal.data.stripePaymentIntentId) {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(
              existingFinal.data.stripePaymentIntentId
            )

            return {
              paymentIntentId: paymentIntent.id,
              clientSecret: paymentIntent.client_secret || "",
              amount: paymentIntent.amount / 100, // Convert from cents
              currency: paymentIntent.currency,
              status: paymentIntent.status,
            }
          }
        }

        // Create Stripe PaymentIntent
        const amountInCents = Math.round(input.amount * 100)
        const paymentIntent = await this.stripe.paymentIntents.create({
          amount: amountInCents,
          currency: "usd",
          metadata: {
            serviceRequestId: input.serviceRequestId,
            userId: input.userId,
            paymentType: "FINAL",
            ...(input.metadata || {}),
          },
          automatic_payment_methods: {
            enabled: true,
          },
        })

        // Safe access to PaymentIntent properties
        if (!paymentIntent?.id) {
          throw new Error("Failed to create Stripe PaymentIntent")
        }

        // Record payment in database
        const paymentResult = await this.paymentRepository.create({
          serviceRequestId: input.serviceRequestId,
          type: "FINAL",
          amount: numberToDecimal(input.amount),
          currency: "USD",
          status: "PENDING",
          stripePaymentIntentId: paymentIntent.id,
        })

        if (!paymentResult?.success || !paymentResult?.data) {
          // Rollback: Cancel the payment intent
          await this.stripe.paymentIntents.cancel(paymentIntent.id).catch(() => {
            this.logger.warn("Failed to cancel PaymentIntent after DB error", {
              paymentIntentId: paymentIntent.id,
            })
          })

          throw new Error(
            paymentResult?.error?.message || "Failed to record payment"
          )
        }

        // Update service request status to PAYMENT_PENDING
        await this.serviceRequestService.changeStatus({
          requestId: input.serviceRequestId,
          newStatus: "PAYMENT_PENDING",
          userId: input.userId,
          userRole: "ADMIN", // System operation
          reason: "Final payment intent created",
        })

        return {
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret || "",
          amount: input.amount,
          currency: "usd",
          status: paymentIntent.status,
        }
      },
      "PAYMENT_ERROR",
      "Failed to create final payment"
    )
  }

  /**
   * Confirm payment after successful charge
   * Called by Stripe webhook handler when payment succeeds
   */
  async confirmPayment(
    input: ConfirmPaymentInput
  ): Promise<ServiceResult<Payment>> {
    // Validate required fields
    const validation = this.validateRequired(input, [
      "stripePaymentIntentId",
      "userId",
    ])

    if (!validation.success) {
      return this.createError<Payment>(
        "VALIDATION_ERROR",
        validation.error?.message || "Missing required fields",
        validation.error?.details
      )
    }

    this.logOperation("confirmPayment", {
      stripePaymentIntentId: input.stripePaymentIntentId,
    })

    return this.handleAsync(
      async () => {
        // Find payment by Stripe Payment Intent ID
        const paymentResult =
          await this.paymentRepository.findByStripePaymentIntentId(
            input.stripePaymentIntentId
          )

        if (!paymentResult?.success || !paymentResult?.data) {
          throw new Error(
            `Payment not found for Stripe Payment Intent: ${input.stripePaymentIntentId}`
          )
        }

        const payment = paymentResult.data

        // Update payment status to COMPLETED
        const updateResult = await this.paymentRepository.update(payment.id, {
          status: "COMPLETED",
          stripeChargeId: input.stripeChargeId || null,
          paidAt: new Date(),
        })

        if (!updateResult?.success || !updateResult?.data) {
          throw new Error(
            updateResult?.error?.message || "Failed to update payment status"
          )
        }

        // Update service request workflow status based on payment type
        const newStatus =
          payment.type === "DEPOSIT" ? "DEPOSIT_RECEIVED" : "PAYMENT_RECEIVED"

        await this.serviceRequestService.changeStatus({
          requestId: payment.serviceRequestId,
          newStatus,
          userId: input.userId,
          userRole: "ADMIN", // System operation
          reason: `${payment.type} payment confirmed via Stripe`,
        })

        return updateResult.data
      },
      "PAYMENT_ERROR",
      "Failed to confirm payment"
    )
  }

  /**
   * Refund payment
   * Creates a Stripe refund and updates payment record
   */
  async refundPayment(
    input: RefundPaymentInput
  ): Promise<ServiceResult<Payment>> {
    // Validate required fields
    const validation = this.validateRequired(input, ["paymentId", "userId"])

    if (!validation.success) {
      return this.createError<Payment>(
        "VALIDATION_ERROR",
        validation.error?.message || "Missing required fields",
        validation.error?.details
      )
    }

    this.logOperation("refundPayment", {
      paymentId: input.paymentId,
      amount: input.amount,
    })

    return this.handleAsync(
      async () => {
        // Get payment record
        const paymentResult = await this.paymentRepository.findById(
          input.paymentId
        )

        if (!paymentResult?.success || !paymentResult?.data) {
          throw new Error(`Payment not found: ${input.paymentId}`)
        }

        const payment = paymentResult.data

        // Validate payment can be refunded
        if (payment.status !== "COMPLETED") {
          throw new Error(
            `Cannot refund payment with status: ${payment.status}`
          )
        }

        if (!payment.stripePaymentIntentId) {
          throw new Error("Payment does not have associated Stripe Payment Intent")
        }

        // Create Stripe refund
        const refundParams: Stripe.RefundCreateParams = {
          payment_intent: payment.stripePaymentIntentId,
          ...(input.amount && {
            amount: Math.round(input.amount * 100), // Convert to cents
          }),
          ...(input.reason && { reason: input.reason as Stripe.RefundCreateParams.Reason }),
        }

        const refund = await this.stripe.refunds.create(refundParams)

        // Safe access to refund properties
        if (!refund?.id) {
          throw new Error("Failed to create Stripe refund")
        }

        // Update payment record
        const updateResult = await this.paymentRepository.update(payment.id, {
          status: "REFUNDED",
          refundedAt: new Date(),
        })

        if (!updateResult?.success || !updateResult?.data) {
          this.logger.error("Failed to update payment after refund", {
            paymentId: payment.id,
            refundId: refund.id,
          })
          throw new Error("Failed to record refund in database")
        }

        // Log audit trail
        this.logger.info("Payment refunded successfully", {
          paymentId: payment.id,
          serviceRequestId: payment.serviceRequestId,
          refundId: refund.id,
          amount: refund.amount / 100,
          userId: input.userId,
        })

        return updateResult.data
      },
      "PAYMENT_ERROR",
      "Failed to refund payment"
    )
  }

  /**
   * Get payment history for service request
   * Returns all payments with safe array operations and null safety
   */
  async getPaymentHistory(
    serviceRequestId: string
  ): Promise<ServiceResult<PaymentHistoryEntry[]>> {
    if (!serviceRequestId) {
      return this.createError<PaymentHistoryEntry[]>(
        "VALIDATION_ERROR",
        "Service request ID is required"
      )
    }

    this.logOperation("getPaymentHistory", { serviceRequestId })

    return this.handleAsync(
      async () => {
        const paymentsResult =
          await this.paymentRepository.findByServiceRequest(serviceRequestId)

        if (!paymentsResult?.success) {
          throw new Error(
            paymentsResult?.error?.message || "Failed to fetch payment history"
          )
        }

        // Safe array operations with null filtering
        const payments = paymentsResult?.data ?? []
        const history: PaymentHistoryEntry[] = payments
          .filter((p) => p?.id) // Filter out any null/undefined entries
          .map((payment) => ({
            id: payment.id,
            type: payment.type,
            amount: decimalToNumber(payment.amount) ?? 0,
            currency: payment.currency,
            status: payment.status,
            stripePaymentIntentId: payment.stripePaymentIntentId ?? null,
            stripeChargeId: payment.stripeChargeId ?? null,
            paidAt: payment.paidAt ?? null,
            refundedAt: payment.refundedAt ?? null,
            createdAt: payment.createdAt,
          }))

        return history
      },
      "PAYMENT_ERROR",
      "Failed to retrieve payment history"
    )
  }

  /**
   * Get total paid amount for service request
   * Returns sum of all completed payments
   */
  async getTotalPaidAmount(
    serviceRequestId: string
  ): Promise<ServiceResult<number>> {
    if (!serviceRequestId) {
      return this.createError<number>(
        "VALIDATION_ERROR",
        "Service request ID is required"
      )
    }

    this.logOperation("getTotalPaidAmount", { serviceRequestId })

    return this.handleAsync(
      async () => {
        const totalResult = await this.paymentRepository.getTotalPaidAmount(
          serviceRequestId
        )

        if (!totalResult?.success) {
          throw new Error(
            totalResult?.error?.message ||
              "Failed to calculate total paid amount"
          )
        }

        return totalResult.data ?? 0
      },
      "PAYMENT_ERROR",
      "Failed to get total paid amount"
    )
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(
    paymentId: string
  ): Promise<ServiceResult<Payment | null>> {
    if (!paymentId) {
      return this.createError<Payment | null>(
        "VALIDATION_ERROR",
        "Payment ID is required"
      )
    }

    return this.handleAsync<Payment | null>(
      async () => {
        const result = await this.paymentRepository.findById(paymentId)
        if (!result?.success) {
          throw new Error(result?.error?.message || "Failed to fetch payment")
        }
        return result.data ?? null
      },
      "PAYMENT_ERROR",
      "Failed to get payment"
    )
  }
}
