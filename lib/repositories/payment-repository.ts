/**
 * Payment Repository
 *
 * Handles all data operations for payments including Stripe payment tracking,
 * deposits, final payments, and refunds.
 * Abstracts Prisma operations behind a mobile-compatible interface.
 *
 * Design Principles:
 * - Framework-agnostic (works with React Native)
 * - Testable with mocked database operations
 * - Consistent error handling and logging
 * - Complete null safety patterns (Epic #301)
 * - Financial audit trail maintenance
 */

import { PrismaClient, Prisma } from "@prisma/client"
import type { Payment } from "@prisma/client"
import {
  BaseRepository,
  CrudRepository,
  FilterOptions,
  PaginationOptions,
  RepositoryResult,
  RepositoryOptions,
} from "./base-repository"

// Type definitions for payment operations

/**
 * Payment creation input
 */
export type PaymentCreateInput = {
  serviceRequestId: string
  type: string // DEPOSIT, FINAL
  amount: number | Prisma.Decimal
  currency?: string
  status: string // PENDING, COMPLETED, FAILED, REFUNDED
  stripePaymentIntentId?: string | null
  stripeChargeId?: string | null
  paidAt?: Date | null
}

/**
 * Payment update input
 */
export type PaymentUpdateInput = {
  status?: string
  stripePaymentIntentId?: string | null
  stripeChargeId?: string | null
  paidAt?: Date | null
  refundedAt?: Date | null
}

/**
 * Payment with service request relation
 */
export interface PaymentWithServiceRequest extends Payment {
  serviceRequest: {
    id: string
    title: string
    status: string
    userId: string
    contactName: string
    contactEmail: string
  }
}

/**
 * Payment filters for query operations
 */
export interface PaymentFilters {
  serviceRequestId?: string
  type?: string
  status?: string
  createdAfter?: Date
  createdBefore?: Date
}

/**
 * Payment Repository
 * Implements CRUD operations and payment-specific queries
 */
export class PaymentRepository
  extends BaseRepository
  implements CrudRepository<Payment, PaymentCreateInput, PaymentUpdateInput>
{
  constructor(db: PrismaClient, options?: RepositoryOptions) {
    super(db, "PaymentRepository", options)
  }

  /**
   * Find payment by ID
   */
  async findById(id: string): Promise<RepositoryResult<Payment | null>> {
    return this.handleAsync(
      async () => {
        const payment = await this.db.payment.findUnique({
          where: { id },
        })
        return payment
      },
      "PAYMENT_NOT_FOUND",
      `Failed to find payment with ID: ${id}`,
      "findById"
    )
  }

  /**
   * Find payment by Stripe Payment Intent ID
   * Useful for webhook handling
   */
  async findByStripePaymentIntentId(
    stripePaymentIntentId: string
  ): Promise<RepositoryResult<Payment | null>> {
    return this.handleAsync(
      async () => {
        const payment = await this.db.payment.findFirst({
          where: { stripePaymentIntentId },
        })
        return payment
      },
      "PAYMENT_NOT_FOUND",
      `Failed to find payment with Stripe Payment Intent ID: ${stripePaymentIntentId}`,
      "findByStripePaymentIntentId"
    )
  }

  /**
   * Find all payments for a service request
   * Returns payments ordered by creation date (newest first)
   */
  async findByServiceRequest(
    serviceRequestId: string
  ): Promise<RepositoryResult<Payment[]>> {
    return this.handleAsync(
      async () => {
        const payments = await this.db.payment.findMany({
          where: { serviceRequestId },
          orderBy: { createdAt: "desc" },
        })
        return payments
      },
      "PAYMENT_QUERY_ERROR",
      `Failed to find payments for service request: ${serviceRequestId}`,
      "findByServiceRequest"
    )
  }

  /**
   * Find payments with service request details
   * Useful for admin views and reporting
   */
  async findWithServiceRequest(
    id: string
  ): Promise<RepositoryResult<PaymentWithServiceRequest | null>> {
    return this.handleAsync(
      async () => {
        const payment = await this.db.payment.findUnique({
          where: { id },
          include: {
            serviceRequest: {
              select: {
                id: true,
                title: true,
                status: true,
                userId: true,
                contactName: true,
                contactEmail: true,
              },
            },
          },
        })
        return payment
      },
      "PAYMENT_NOT_FOUND",
      `Failed to find payment with service request details: ${id}`,
      "findWithServiceRequest"
    )
  }

  /**
   * Find many payments with filters and pagination
   */
  async findMany(
    filters?: FilterOptions,
    pagination?: PaginationOptions
  ): Promise<RepositoryResult<Payment[]>> {
    return this.handleAsync(
      async () => {
        let query: Prisma.PaymentFindManyArgs = {}

        // Apply filters
        if (filters) {
          query = this.applyFilters(query, filters)
        }

        // Apply pagination
        if (pagination) {
          query = this.applyPagination(query, pagination)
        }

        const payments = await this.db.payment.findMany(query)
        return payments
      },
      "PAYMENT_QUERY_ERROR",
      "Failed to fetch payments",
      "findMany"
    )
  }

  /**
   * Find payments by filters with type-safe options
   */
  async findByFilters(
    filters: PaymentFilters,
    pagination?: PaginationOptions
  ): Promise<RepositoryResult<Payment[]>> {
    return this.handleAsync(
      async () => {
        const where: Prisma.PaymentWhereInput = {}

        // Apply payment-specific filters with null safety
        if (filters?.serviceRequestId) {
          where.serviceRequestId = filters.serviceRequestId
        }

        if (filters?.type) {
          where.type = filters.type
        }

        if (filters?.status) {
          where.status = filters.status
        }

        // Date range filters
        if (filters?.createdAfter || filters?.createdBefore) {
          where.createdAt = {}
          if (filters?.createdAfter) {
            where.createdAt.gte = filters.createdAfter
          }
          if (filters?.createdBefore) {
            where.createdAt.lte = filters.createdBefore
          }
        }

        let query: Prisma.PaymentFindManyArgs = { where }

        // Apply pagination if provided
        if (pagination) {
          query = this.applyPagination(query, pagination)
        }

        // Default ordering by creation date
        query.orderBy = { createdAt: "desc" }

        const payments = await this.db.payment.findMany(query)
        return payments
      },
      "PAYMENT_QUERY_ERROR",
      "Failed to fetch payments by filters",
      "findByFilters"
    )
  }

  /**
   * Create new payment record
   */
  async create(data: PaymentCreateInput): Promise<RepositoryResult<Payment>> {
    // Validate required fields
    const validation = this.validateRequired(data, [
      "serviceRequestId",
      "type",
      "amount",
      "status",
    ])

    if (!validation.success) {
      return this.createError<Payment>(
        validation.error?.code || "VALIDATION_ERROR",
        validation.error?.message || "Validation failed",
        validation.error?.details
      )
    }

    return this.handleAsync(
      async () => {
        const payment = await this.db.payment.create({
          data: {
            serviceRequestId: data.serviceRequestId,
            type: data.type,
            amount: data.amount,
            currency: data.currency ?? "USD",
            status: data.status,
            stripePaymentIntentId: data.stripePaymentIntentId ?? null,
            stripeChargeId: data.stripeChargeId ?? null,
            paidAt: data.paidAt ?? null,
          },
        })
        return payment
      },
      "PAYMENT_CREATE_ERROR",
      "Failed to create payment",
      "create"
    )
  }

  /**
   * Update payment record
   */
  async update(
    id: string,
    data: PaymentUpdateInput
  ): Promise<RepositoryResult<Payment>> {
    return this.handleAsync(
      async () => {
        const payment = await this.db.payment.update({
          where: { id },
          data: {
            ...(data.status && { status: data.status }),
            ...(data.stripePaymentIntentId !== undefined && {
              stripePaymentIntentId: data.stripePaymentIntentId,
            }),
            ...(data.stripeChargeId !== undefined && {
              stripeChargeId: data.stripeChargeId,
            }),
            ...(data.paidAt !== undefined && { paidAt: data.paidAt }),
            ...(data.refundedAt !== undefined && {
              refundedAt: data.refundedAt,
            }),
          },
        })
        return payment
      },
      "PAYMENT_UPDATE_ERROR",
      `Failed to update payment: ${id}`,
      "update"
    )
  }

  /**
   * Delete payment record
   */
  async delete(id: string): Promise<RepositoryResult<boolean>> {
    return this.handleAsync(
      async () => {
        await this.db.payment.delete({
          where: { id },
        })
        return true
      },
      "PAYMENT_DELETE_ERROR",
      `Failed to delete payment: ${id}`,
      "delete"
    )
  }

  /**
   * Count payments with optional filters
   */
  async count(filters?: FilterOptions): Promise<RepositoryResult<number>> {
    return this.handleAsync(
      async () => {
        let where: Prisma.PaymentWhereInput = {}

        if (filters?.where) {
          where = filters.where as Prisma.PaymentWhereInput
        }

        const count = await this.db.payment.count({ where })
        return count
      },
      "PAYMENT_COUNT_ERROR",
      "Failed to count payments",
      "count"
    )
  }

  /**
   * Count payments by service request
   */
  async countByServiceRequest(
    serviceRequestId: string
  ): Promise<RepositoryResult<number>> {
    return this.handleAsync(
      async () => {
        const count = await this.db.payment.count({
          where: { serviceRequestId },
        })
        return count
      },
      "PAYMENT_COUNT_ERROR",
      `Failed to count payments for service request: ${serviceRequestId}`,
      "countByServiceRequest"
    )
  }

  /**
   * Find deposit payment for service request
   */
  async findDepositByServiceRequest(
    serviceRequestId: string
  ): Promise<RepositoryResult<Payment | null>> {
    return this.handleAsync(
      async () => {
        const payment = await this.db.payment.findFirst({
          where: {
            serviceRequestId,
            type: "DEPOSIT",
          },
          orderBy: { createdAt: "desc" },
        })
        return payment
      },
      "PAYMENT_NOT_FOUND",
      `Failed to find deposit payment for service request: ${serviceRequestId}`,
      "findDepositByServiceRequest"
    )
  }

  /**
   * Find final payment for service request
   */
  async findFinalByServiceRequest(
    serviceRequestId: string
  ): Promise<RepositoryResult<Payment | null>> {
    return this.handleAsync(
      async () => {
        const payment = await this.db.payment.findFirst({
          where: {
            serviceRequestId,
            type: "FINAL",
          },
          orderBy: { createdAt: "desc" },
        })
        return payment
      },
      "PAYMENT_NOT_FOUND",
      `Failed to find final payment for service request: ${serviceRequestId}`,
      "findFinalByServiceRequest"
    )
  }

  /**
   * Get total paid amount for service request
   * Returns sum of all completed payments
   */
  async getTotalPaidAmount(
    serviceRequestId: string
  ): Promise<RepositoryResult<number>> {
    return this.handleAsync(
      async () => {
        const result = await this.db.payment.aggregate({
          where: {
            serviceRequestId,
            status: "COMPLETED",
          },
          _sum: {
            amount: true,
          },
        })

        // Safe decimal conversion with null check
        const totalAmount = result?._sum?.amount
        if (!totalAmount) {
          return 0
        }

        // Convert Prisma Decimal to number
        return parseFloat(totalAmount.toFixed(2))
      },
      "PAYMENT_AGGREGATE_ERROR",
      `Failed to calculate total paid amount for service request: ${serviceRequestId}`,
      "getTotalPaidAmount"
    )
  }
}
