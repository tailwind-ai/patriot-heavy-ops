/**
 * Service Request Business Logic Service
 *
 * Platform-agnostic business logic for service request operations.
 * Designed for cross-platform reuse including future React Native mobile apps.
 *
 * Design Principles:
 * - Zero Next.js/React dependencies for mobile compatibility
 * - Framework-agnostic implementation
 * - Testable in Node.js environment
 * - Single responsibility for service request business rules
 */

import { BaseService, ServiceResult, ServiceLogger } from "./base-service"
import { db } from "../db"
import { hasPermissionSafe } from "../permissions"
import { serviceRequestSchema, serviceRequestUpdateSchema } from "../validations/service-request"
import type { ServiceRequest, ServiceRequestStatus } from "@prisma/client"

// Type definitions for service request business logic
export type DurationType = "HALF_DAY" | "FULL_DAY" | "MULTI_DAY" | "WEEKLY"
export type RateType = "HOURLY" | "HALF_DAY" | "DAILY" | "WEEKLY"
export type EquipmentCategory =
  | "SKID_STEERS_TRACK_LOADERS"
  | "FRONT_END_LOADERS"
  | "BACKHOES_EXCAVATORS"
  | "BULLDOZERS"
  | "GRADERS"
  | "DUMP_TRUCKS"
  | "WATER_TRUCKS"
  | "SWEEPERS"
  | "TRENCHERS"

export type TransportOption = "WE_HANDLE_IT" | "YOU_HANDLE_IT"

export type ServiceRequestCalculationInput = {
  durationType: DurationType
  durationValue: number
  baseRate: number
  rateType: RateType
  transport: TransportOption
  equipmentCategory: EquipmentCategory
} & Record<string, unknown>

export type ServiceRequestCalculationResult = {
  totalHours: number
  baseCost: number
  transportFee: number
  totalEstimate: number
  durationDisplay: string
}

export type StatusTransition = {
  fromStatus: string | undefined
  toStatus: string
  isValid: boolean
  reason: string | undefined
}

// Workflow Engine types (Issue #222)
export type StatusTransitionWithPermissions = {
  fromStatus: string | undefined
  toStatus: string
  isValid: boolean
  hasPermission: boolean
  reason: string | undefined
}

export type BusinessRuleValidation = {
  canTransition: boolean
  reasons: string[]
}

export type StatusHistoryEntry = {
  id: string
  serviceRequestId: string
  fromStatus: string | null
  toStatus: string
  changedBy: string
  reason: string | null
  notes: string | null
  createdAt: Date
}

export type UserRole = "USER" | "OPERATOR" | "MANAGER" | "ADMIN"

// Workflow mutation types (Issue #223)
export type ChangeStatusInput = {
  requestId: string
  newStatus: string
  userId: string
  userRole: UserRole
  reason?: string
  notes?: string
}

export type AssignOperatorInput = {
  requestId: string
  operatorId: string
  userId: string
  userRole: UserRole
  rate?: number
  estimatedHours?: number
}

// CRUD operation types
export type AuthenticatedUser = {
  id: string
  email: string
  role: string
}

export type ServiceRequestCreateInput = {
  title: string
  description?: string
  contactName: string
  contactEmail: string
  contactPhone: string
  company?: string
  jobSite: string
  transport: TransportOption
  startDate: string
  endDate?: string
  equipmentCategory: EquipmentCategory
  equipmentDetail: string
  requestedDurationType: DurationType
  requestedDurationValue: number
  rateType: RateType
  baseRate: number
  userId: string
}

// Type for input that may include requestedTotalHours (to be excluded during validation)
export type ServiceRequestCreateInputWithOptionalTotal = ServiceRequestCreateInput & {
  requestedTotalHours?: number
}

export type ServiceRequestUpdateInput = {
  title?: string
  description?: string
  transport?: TransportOption
  startDate?: string
  endDate?: string
  equipmentCategory?: EquipmentCategory
  equipmentDetail?: string
  status?: string
  internalNotes?: string
}

export type ServiceRequestListOptions = {
  userId: string
  userRole: string
} & Record<string, unknown>

export type ServiceRequestAccessOptions = {
  requestId: string
  userId: string
  userRole?: string
} & Record<string, unknown>

/**
 * Service Request Business Logic Service
 * Handles all business rules and calculations for service requests
 */
export class ServiceRequestService extends BaseService {
  // Transport fee rates (in dollars)
  private static readonly TRANSPORT_FEES = {
    WE_HANDLE_IT: 150, // Standard transport fee when we handle delivery
    YOU_HANDLE_IT: 0, // No fee when customer handles transport
  }

  // Equipment category multipliers for pricing
  private static readonly EQUIPMENT_MULTIPLIERS = {
    SKID_STEERS_TRACK_LOADERS: 1.0,
    FRONT_END_LOADERS: 1.2,
    BACKHOES_EXCAVATORS: 1.1,
    BULLDOZERS: 1.5,
    GRADERS: 1.3,
    DUMP_TRUCKS: 1.1,
    WATER_TRUCKS: 1.0,
    SWEEPERS: 1.2,
    TRENCHERS: 1.1,
  }

  // Valid status transitions
  private static readonly VALID_STATUS_TRANSITIONS = new Map([
    ["SUBMITTED", ["UNDER_REVIEW", "CANCELLED"]],
    ["UNDER_REVIEW", ["APPROVED", "REJECTED", "CANCELLED"]],
    ["APPROVED", ["OPERATOR_MATCHING", "CANCELLED"]],
    ["REJECTED", ["SUBMITTED", "CANCELLED"]], // Allow resubmission
    ["OPERATOR_MATCHING", ["OPERATOR_ASSIGNED", "CANCELLED"]],
    [
      "OPERATOR_ASSIGNED",
      ["EQUIPMENT_CHECKING", "OPERATOR_MATCHING", "CANCELLED"],
    ],
    [
      "EQUIPMENT_CHECKING",
      ["EQUIPMENT_CONFIRMED", "OPERATOR_MATCHING", "CANCELLED"],
    ],
    ["EQUIPMENT_CONFIRMED", ["DEPOSIT_REQUESTED", "CANCELLED"]],
    ["DEPOSIT_REQUESTED", ["DEPOSIT_PENDING", "CANCELLED"]],
    ["DEPOSIT_PENDING", ["DEPOSIT_RECEIVED", "CANCELLED"]],
    ["DEPOSIT_RECEIVED", ["JOB_SCHEDULED", "CANCELLED"]],
    ["JOB_SCHEDULED", ["JOB_IN_PROGRESS", "CANCELLED"]],
    ["JOB_IN_PROGRESS", ["JOB_COMPLETED", "CANCELLED"]],
    ["JOB_COMPLETED", ["INVOICED"]],
    ["INVOICED", ["PAYMENT_PENDING"]],
    ["PAYMENT_PENDING", ["PAYMENT_RECEIVED"]],
    ["PAYMENT_RECEIVED", ["CLOSED"]],
    ["CANCELLED", []], // Terminal state
    ["CLOSED", []], // Terminal state
  ])

  // Role-based transition permissions (Issue #222 - Workflow Engine)
  // Defines which roles can perform which types of status transitions
  private static readonly ROLE_TRANSITION_PERMISSIONS = {
    ADMIN: {
      // Admin can transition any valid status
      canTransitionAny: true,
      allowedStatuses: [] as string[], // Not used when canTransitionAny is true
    },
    MANAGER: {
      canTransitionAny: false,
      allowedStatuses: [
        "SUBMITTED",
        "UNDER_REVIEW",
        "APPROVED",
        "REJECTED",
        "OPERATOR_MATCHING",
        "OPERATOR_ASSIGNED",
        "EQUIPMENT_CHECKING",
        "EQUIPMENT_CONFIRMED",
        "DEPOSIT_REQUESTED",
        "DEPOSIT_PENDING",
        "DEPOSIT_RECEIVED",
        "JOB_SCHEDULED",
        "JOB_IN_PROGRESS",
        "JOB_COMPLETED",
        "INVOICED",
        "CANCELLED",
        // Note: MANAGER cannot transition PAYMENT_PENDING, PAYMENT_RECEIVED, or CLOSED
      ],
    },
    OPERATOR: {
      canTransitionAny: false,
      allowedStatuses: [
        "OPERATOR_ASSIGNED", // Can update their assignment status
        "EQUIPMENT_CHECKING",
        "EQUIPMENT_CONFIRMED",
        "JOB_SCHEDULED",
        "JOB_IN_PROGRESS",
        "JOB_COMPLETED",
        // Note: OPERATOR can only manage job execution, not administrative or payment statuses
      ],
    },
    USER: {
      canTransitionAny: false,
      allowedStatuses: [
        "SUBMITTED", // Users can only submit initially
        // Note: Users cannot transition existing requests - only create new submissions
      ],
    },
  }

  constructor(logger?: ServiceLogger) {
    super("ServiceRequestService", logger)
  }

  /**
   * Calculate total hours based on duration type and value
   */
  public calculateTotalHours(
    durationType: DurationType,
    durationValue: number
  ): ServiceResult<number> {
    this.logOperation("calculateTotalHours", { durationType, durationValue })

    const validation = this.validateRequired({ durationType, durationValue }, [
      "durationType",
      "durationValue",
    ])
    if (!validation.success) {
      return this.createError<number>(
        validation.error?.code || "VALIDATION_ERROR",
        validation.error?.message || "Validation failed",
        validation.error?.details
      )
    }

    if (durationValue <= 0) {
      return this.createError(
        "INVALID_DURATION",
        "Duration value must be positive",
        {
          durationValue,
        }
      )
    }

    let totalHours: number
    switch (durationType) {
      case "HALF_DAY":
        totalHours = 4 * durationValue
        break
      case "FULL_DAY":
        totalHours = 8 * durationValue
        break
      case "MULTI_DAY":
        totalHours = 8 * durationValue // 8 hours per day
        break
      case "WEEKLY":
        totalHours = 40 * durationValue // 40 hours per week (5 days × 8 hours)
        break
      default:
        return this.createError(
          "INVALID_DURATION_TYPE",
          "Invalid duration type",
          {
            durationType,
          }
        )
    }

    return this.createSuccess(totalHours)
  }

  /**
   * Get human-readable duration display text
   */
  public getDurationDisplayText(
    durationType: DurationType,
    durationValue: number
  ): ServiceResult<string> {
    this.logOperation("getDurationDisplayText", { durationType, durationValue })

    const validation = this.validateRequired({ durationType, durationValue }, [
      "durationType",
      "durationValue",
    ])
    if (!validation.success) {
      return this.createError<string>(
        validation.error?.code || "VALIDATION_ERROR",
        validation.error?.message || "Validation failed",
        validation.error?.details
      )
    }

    if (durationValue <= 0) {
      return this.createError(
        "INVALID_DURATION",
        "Duration value must be positive",
        {
          durationValue,
        }
      )
    }

    let displayText: string
    switch (durationType) {
      case "HALF_DAY":
        displayText =
          durationValue === 1
            ? "Half Day (4 hours)"
            : `${durationValue} Half Days (${4 * durationValue} hours)`
        break
      case "FULL_DAY":
        displayText =
          durationValue === 1
            ? "Full Day (8 hours)"
            : `${durationValue} Full Days (${8 * durationValue} hours)`
        break
      case "MULTI_DAY":
        displayText = `${durationValue} Days (${8 * durationValue} hours)`
        break
      case "WEEKLY":
        displayText =
          durationValue === 1
            ? "1 Week (40 hours)"
            : `${durationValue} Weeks (${40 * durationValue} hours)`
        break
      default:
        return this.createError(
          "INVALID_DURATION_TYPE",
          "Invalid duration type",
          {
            durationType,
          }
        )
    }

    return this.createSuccess(displayText)
  }

  /**
   * Calculate transport fee based on transport option
   */
  public calculateTransportFee(
    transport: TransportOption
  ): ServiceResult<number> {
    this.logOperation("calculateTransportFee", { transport })

    const validation = this.validateRequired({ transport }, ["transport"])
    if (!validation.success) {
      return this.createError<number>(
        validation.error?.code || "VALIDATION_ERROR",
        validation.error?.message || "Validation failed",
        validation.error?.details
      )
    }

    const fee = ServiceRequestService.TRANSPORT_FEES?.[transport]
    if (fee === undefined) {
      return this.createError(
        "INVALID_TRANSPORT_OPTION",
        "Invalid transport option",
        {
          transport,
        }
      )
    }

    return this.createSuccess(fee)
  }

  /**
   * Calculate base cost based on hours, rate, and rate type
   */
  public calculateBaseCost(
    totalHours: number,
    baseRate: number,
    rateType: RateType,
    equipmentCategory: EquipmentCategory
  ): ServiceResult<number> {
    this.logOperation("calculateBaseCost", {
      totalHours,
      baseRate,
      rateType,
      equipmentCategory,
    })

    const validation = this.validateRequired(
      { totalHours, baseRate, rateType, equipmentCategory },
      ["totalHours", "baseRate", "rateType", "equipmentCategory"]
    )
    if (!validation.success) {
      return this.createError<number>(
        validation.error?.code || "VALIDATION_ERROR",
        validation.error?.message || "Validation failed",
        validation.error?.details
      )
    }

    if (totalHours <= 0 || baseRate <= 0) {
      return this.createError(
        "INVALID_CALCULATION_INPUT",
        "Hours and rate must be positive",
        {
          totalHours,
          baseRate,
        }
      )
    }

    const multiplier =
      ServiceRequestService.EQUIPMENT_MULTIPLIERS?.[equipmentCategory]
    if (multiplier === undefined) {
      return this.createError(
        "INVALID_EQUIPMENT_CATEGORY",
        "Invalid equipment category",
        {
          equipmentCategory,
        }
      )
    }

    let baseCost: number
    switch (rateType) {
      case "HOURLY":
        baseCost = totalHours * baseRate
        break
      case "HALF_DAY":
        baseCost = Math.ceil(totalHours / 4) * baseRate
        break
      case "DAILY":
        baseCost = Math.ceil(totalHours / 8) * baseRate
        break
      case "WEEKLY":
        baseCost = Math.ceil(totalHours / 40) * baseRate
        break
      default:
        return this.createError("INVALID_RATE_TYPE", "Invalid rate type", {
          rateType,
        })
    }

    // Apply equipment category multiplier
    const finalCost = baseCost * multiplier

    return this.createSuccess(Math.round(finalCost * 100) / 100) // Round to 2 decimal places
  }

  /**
   * Calculate complete service request pricing
   */
  public calculateServiceRequestPricing(
    input: ServiceRequestCalculationInput
  ): ServiceResult<ServiceRequestCalculationResult> {
    this.logOperation(
      "calculateServiceRequestPricing",
      input
    )

    // Calculate total hours
    const hoursResult = this.calculateTotalHours(
      input.durationType,
      input.durationValue
    )
    if (!hoursResult.success) {
      return this.createError<ServiceRequestCalculationResult>(
        hoursResult.error?.code || "CALCULATION_ERROR",
        hoursResult.error?.message || "Hours calculation failed",
        hoursResult.error?.details
      )
    }

    // Calculate duration display
    const displayResult = this.getDurationDisplayText(
      input.durationType,
      input.durationValue
    )
    if (!displayResult.success) {
      return this.createError<ServiceRequestCalculationResult>(
        displayResult.error?.code || "CALCULATION_ERROR",
        displayResult.error?.message || "Display calculation failed",
        displayResult.error?.details
      )
    }

    // Calculate base cost
    const baseCostResult = this.calculateBaseCost(
      hoursResult.data as number,
      input.baseRate,
      input.rateType,
      input.equipmentCategory
    )
    if (!baseCostResult.success) {
      return this.createError<ServiceRequestCalculationResult>(
        baseCostResult.error?.code || "CALCULATION_ERROR",
        baseCostResult.error?.message || "Base cost calculation failed",
        baseCostResult.error?.details
      )
    }

    // Calculate transport fee
    const transportResult = this.calculateTransportFee(input.transport)
    if (!transportResult.success) {
      return this.createError<ServiceRequestCalculationResult>(
        transportResult.error?.code || "CALCULATION_ERROR",
        transportResult.error?.message || "Transport calculation failed",
        transportResult.error?.details
      )
    }

    const result: ServiceRequestCalculationResult = {
      totalHours: hoursResult.data as number,
      baseCost: baseCostResult.data as number,
      transportFee: transportResult.data as number,
      totalEstimate: (baseCostResult.data as number) + (transportResult.data as number),
      durationDisplay: displayResult.data as string,
    }

    return this.createSuccess(result)
  }

  /**
   * Validate status transition
   */
  public validateStatusTransition(
    fromStatus: string | undefined,
    toStatus: string
  ): ServiceResult<StatusTransition> {
    this.logOperation("validateStatusTransition", { fromStatus, toStatus })

    const validation = this.validateRequired({ toStatus }, ["toStatus"])
    if (!validation.success) {
      return this.createError<StatusTransition>(
        validation.error?.code || "VALIDATION_ERROR",
        validation.error?.message || "Validation failed",
        validation.error?.details
      )
    }

    // Handle initial status (no fromStatus)
    if (!fromStatus) {
      const isValid = toStatus === "SUBMITTED"
      return this.createSuccess({
        fromStatus,
        toStatus,
        isValid,
        reason: isValid ? undefined : "Initial status must be SUBMITTED",
      })
    }

    const validTransitions =
      ServiceRequestService.VALID_STATUS_TRANSITIONS.get(fromStatus)
    if (!validTransitions) {
      return this.createSuccess({
        fromStatus,
        toStatus,
        isValid: false,
        reason: `Invalid source status: ${fromStatus}`,
      })
    }

    const isValid = validTransitions.includes(toStatus)
    return this.createSuccess({
      fromStatus,
      toStatus,
      isValid,
      reason: isValid
        ? undefined
        : `Cannot transition from ${fromStatus} to ${toStatus}`,
    })
  }

  /**
   * Get valid next statuses for a given status
   */
  public getValidNextStatuses(currentStatus: string): ServiceResult<string[]> {
    this.logOperation("getValidNextStatuses", { currentStatus })

    const validation = this.validateRequired({ currentStatus }, [
      "currentStatus",
    ])
    if (!validation.success) {
      return this.createError<string[]>(
        validation.error?.code || "VALIDATION_ERROR",
        validation.error?.message || "Validation failed",
        validation.error?.details
      )
    }

    const validStatuses =
      ServiceRequestService.VALID_STATUS_TRANSITIONS.get(currentStatus)
    if (!validStatuses) {
      return this.createError("INVALID_STATUS", "Invalid current status", {
        currentStatus,
      })
    }

    return this.createSuccess([...validStatuses])
  }

  /**
   * Validate business rules for service request data
   */
  public validateServiceRequestBusinessRules(data: {
    startDate: string
    endDate?: string
    durationType: DurationType
    durationValue: number
  }): ServiceResult<{ isValid: boolean; errors: string[] }> {
    this.logOperation("validateServiceRequestBusinessRules", data)

    const errors: string[] = []
    const startDate = new Date(data.startDate)
    const now = new Date()

    // Start date must be in the future or current time (allow scheduling for now or later)
    if (startDate.getTime() < now.getTime()) {
      errors.push("Start date cannot be in the past")
    }

    // End date validation if provided
    if (data.endDate) {
      const endDate = new Date(data.endDate)
      if (endDate <= startDate) {
        errors.push("End date must be after start date")
      }
    }

    // Duration value constraints
    if (data.durationValue > 52 && data.durationType === "WEEKLY") {
      errors.push("Weekly bookings cannot exceed 52 weeks")
    }

    if (data.durationValue > 365 && data.durationType === "MULTI_DAY") {
      errors.push("Multi-day bookings cannot exceed 365 days")
    }

    if (
      data.durationValue > 30 &&
      (data.durationType === "HALF_DAY" || data.durationType === "FULL_DAY")
    ) {
      errors.push("Daily bookings cannot exceed 30 days")
    }

    return this.createSuccess({
      isValid: errors.length === 0,
      errors,
    })
  }

  /**
   * Get service requests based on user role and permissions
   */
  async getServiceRequests(
    options: ServiceRequestListOptions
  ): Promise<ServiceResult<ServiceRequest[]>> {
    this.logOperation("getServiceRequests", options)

    const validation = this.validateRequired(options, ["userId", "userRole"])
    if (!validation.success) {
      return this.createError<ServiceRequest[]>(
        validation.error?.code || "VALIDATION_ERROR",
        validation.error?.message || "Validation failed",
        validation.error?.details
      )
    }

    return this.handleAsync(
      async () => {
        let serviceRequests

        if (hasPermissionSafe(options.userRole, "view_all_requests")) {
          // Managers and Admins can see all requests
          serviceRequests = await db?.serviceRequest.findMany({
            select: {
              id: true,
              title: true,
              description: true,
              userId: true,
              contactName: true,
              contactEmail: true,
              contactPhone: true,
              company: true,
              jobSite: true,
              transport: true,
              startDate: true,
              endDate: true,
              equipmentCategory: true,
              equipmentDetail: true,
              requestedDurationType: true,
              requestedDurationValue: true,
              requestedTotalHours: true,
              rateType: true,
              baseRate: true,
              status: true,
              priority: true,
              estimatedCost: true,
              depositAmount: true,
              depositPaid: true,
              depositPaidAt: true,
              finalAmount: true,
              finalPaid: true,
              finalPaidAt: true,
              stripeDepositPaymentIntentId: true,
              stripeFinalPaymentIntentId: true,
              assignedManagerId: true,
              rejectionReason: true,
              internalNotes: true,
              createdAt: true,
              updatedAt: true,
              user: {
                select: {
                  name: true,
                  email: true,
                  company: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          })
        } else if (hasPermissionSafe(options.userRole, "view_assignments")) {
          // Operators can see requests they're assigned to + their own requests
          serviceRequests = await db?.serviceRequest.findMany({
            select: {
              id: true,
              title: true,
              description: true,
              userId: true,
              contactName: true,
              contactEmail: true,
              contactPhone: true,
              company: true,
              jobSite: true,
              transport: true,
              startDate: true,
              endDate: true,
              equipmentCategory: true,
              equipmentDetail: true,
              requestedDurationType: true,
              requestedDurationValue: true,
              requestedTotalHours: true,
              rateType: true,
              baseRate: true,
              status: true,
              priority: true,
              estimatedCost: true,
              depositAmount: true,
              depositPaid: true,
              depositPaidAt: true,
              finalAmount: true,
              finalPaid: true,
              finalPaidAt: true,
              stripeDepositPaymentIntentId: true,
              stripeFinalPaymentIntentId: true,
              assignedManagerId: true,
              rejectionReason: true,
              internalNotes: true,
              createdAt: true,
              updatedAt: true,
            },
            where: {
              OR: [
                { userId: options.userId }, // Their own requests
                {
                  userAssignments: {
                    some: {
                      operatorId: options.userId,
                    },
                  },
                }, // Requests they're assigned to
              ],
            },
            orderBy: {
              createdAt: "desc",
            },
          })
        } else if (hasPermissionSafe(options.userRole, "view_own_requests")) {
          // Regular users can only see their own requests
          serviceRequests = await db?.serviceRequest.findMany({
            select: {
              id: true,
              title: true,
              description: true,
              userId: true,
              contactName: true,
              contactEmail: true,
              contactPhone: true,
              company: true,
              jobSite: true,
              transport: true,
              startDate: true,
              endDate: true,
              equipmentCategory: true,
              equipmentDetail: true,
              requestedDurationType: true,
              requestedDurationValue: true,
              requestedTotalHours: true,
              rateType: true,
              baseRate: true,
              status: true,
              priority: true,
              estimatedCost: true,
              depositAmount: true,
              depositPaid: true,
              depositPaidAt: true,
              finalAmount: true,
              finalPaid: true,
              finalPaidAt: true,
              stripeDepositPaymentIntentId: true,
              stripeFinalPaymentIntentId: true,
              assignedManagerId: true,
              rejectionReason: true,
              internalNotes: true,
              createdAt: true,
              updatedAt: true,
            },
            where: {
              userId: options.userId,
            },
            orderBy: {
              createdAt: "desc",
            },
          })
        } else {
          throw new Error("Insufficient permissions to view service requests")
        }

        return serviceRequests
      },
      "DATABASE_ERROR",
      "Failed to fetch service requests"
    )
  }

  /**
   * Create a new service request
   */
  async createServiceRequest(
    input: ServiceRequestCreateInputWithOptionalTotal,
    userRole: string
  ): Promise<ServiceResult<ServiceRequest>> {
    this.logOperation("createServiceRequest", { ...input, userId: "[REDACTED]" })

    // Check permissions
    if (!hasPermissionSafe(userRole, "submit_requests")) {
      return this.createError(
        "INSUFFICIENT_PERMISSIONS",
        "You don't have permission to submit service requests"
      )
    }

    // Validate input data (exclude requestedTotalHours as it will be calculated)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { requestedTotalHours: _requestedTotalHours, ...inputForValidation } = input
    const validation = serviceRequestSchema.omit({ requestedTotalHours: true }).safeParse(inputForValidation)

    if (!validation.success) {
      return this.createError(
        "VALIDATION_ERROR",
        "Invalid service request data",
        { issues: validation.error.issues }
      )
    }

    // Calculate total hours
    const hoursResult = this.calculateTotalHours(
      input.requestedDurationType,
      input.requestedDurationValue
    )
    if (!hoursResult.success) {
      return this.createError<ServiceRequest>(
        hoursResult.error?.code || "CALCULATION_ERROR",
        hoursResult.error?.message || "Hours calculation failed",
        hoursResult.error?.details
      )
    }

    return this.handleAsync(
      async () => {
        const serviceRequest = await db?.serviceRequest.create({
          data: {
            title: input.title,
            description: input.description ?? null,
            contactName: input.contactName,
            contactEmail: input.contactEmail,
            contactPhone: input.contactPhone,
            company: input.company ?? null,
            jobSite: input.jobSite,
            transport: input.transport,
            startDate: new Date(input.startDate),
            endDate: input.endDate ? new Date(input.endDate) : null,
            equipmentCategory: input.equipmentCategory,
            equipmentDetail: input.equipmentDetail,
            requestedDurationType: input.requestedDurationType,
            requestedDurationValue: input.requestedDurationValue,
            requestedTotalHours: hoursResult.data as number,
            rateType: input.rateType,
            baseRate: input.baseRate,
            status: "SUBMITTED",
            userId: input.userId,
          },
          select: {
            id: true,
            title: true,
            description: true,
            userId: true,
            contactName: true,
            contactEmail: true,
            contactPhone: true,
            company: true,
            jobSite: true,
            transport: true,
            startDate: true,
            endDate: true,
            equipmentCategory: true,
            equipmentDetail: true,
            requestedDurationType: true,
            requestedDurationValue: true,
            requestedTotalHours: true,
            rateType: true,
            baseRate: true,
            status: true,
            priority: true,
            estimatedCost: true,
            depositAmount: true,
            depositPaid: true,
            depositPaidAt: true,
            finalAmount: true,
            finalPaid: true,
            finalPaidAt: true,
            stripeDepositPaymentIntentId: true,
            stripeFinalPaymentIntentId: true,
            assignedManagerId: true,
            rejectionReason: true,
            internalNotes: true,
            createdAt: true,
            updatedAt: true,
          },
        })

        return serviceRequest
      },
      "DATABASE_ERROR",
      "Failed to create service request"
    )
  }

  /**
   * Get a single service request by ID
   */
  async getServiceRequestById(
    options: ServiceRequestAccessOptions
  ): Promise<ServiceResult<ServiceRequest>> {
    this.logOperation("getServiceRequestById", options)

    const validation = this.validateRequired(options, ["requestId", "userId"])
    if (!validation.success) {
      return this.createError<ServiceRequest>(
        validation.error?.code || "VALIDATION_ERROR",
        validation.error?.message || "Validation failed",
        validation.error?.details
      )
    }

    return this.handleAsync(
      async () => {
        // First check if user has access to this request
        const hasAccess = await this.verifyUserHasAccessToRequest(
          options.requestId,
          options.userId
        )

        if (!hasAccess.success) {
          // Database error in access verification
          throw new Error(hasAccess.error?.message || "Database error")
        }
        if (!hasAccess.data) {
          // No access (count = 0)
          const error = new Error("Access denied to this service request")
          error.name = "ACCESS_DENIED"
          throw error
        }

        const serviceRequest = await db?.serviceRequest.findUnique({
          where: {
            id: options.requestId,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            assignedManager: {
              select: {
                id: true,
                name: true,
                email: true,
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
          },
        })

        if (!serviceRequest) {
          const error = new Error("Service request not found")
          error.name = "NOT_FOUND"
          throw error
        }

        return serviceRequest
      },
      "DATABASE_ERROR",
      "Failed to fetch service request"
    )
  }

  /**
   * Update a service request
   */
  async updateServiceRequest(
    requestId: string,
    updates: ServiceRequestUpdateInput,
    userId: string
  ): Promise<ServiceResult<ServiceRequest>> {
    this.logOperation("updateServiceRequest", { requestId, updates, userId: "[REDACTED]" })

    const validation = this.validateRequired({ requestId, userId }, ["requestId", "userId"])
    if (!validation.success) {
      return this.createError<ServiceRequest>(
        validation.error?.code || "VALIDATION_ERROR",
        validation.error?.message || "Validation failed",
        validation.error?.details
      )
    }

    // Validate update data
    const updateValidation = serviceRequestUpdateSchema.safeParse(updates)
    if (!updateValidation.success) {
      return this.createError(
        "VALIDATION_ERROR",
        "Invalid update data",
        { issues: updateValidation.error.issues }
      )
    }

    return this.handleAsync(
      async () => {
        // Check access
        const hasAccess = await this.verifyUserHasAccessToRequest(requestId, userId)
        if (!hasAccess.success) {
          // Database error in access verification
          throw new Error(hasAccess.error?.message || "Database error")
        }
        if (!hasAccess.data) {
          // No access (count = 0)
          const error = new Error("Access denied to this service request")
          error.name = "ACCESS_DENIED"
          throw error
        }

        const updateData: Record<string, unknown> = {
          updatedAt: new Date(),
        }
        
        if (updates.status !== undefined) updateData.status = updates.status
        if (updates.title !== undefined) updateData.title = updates.title
        if (updates.description !== undefined) updateData.description = updates.description
        if (updates.transport !== undefined) updateData.transport = updates.transport
        if (updates.startDate !== undefined) updateData.startDate = new Date(updates.startDate)
        if (updates.endDate !== undefined) updateData.endDate = new Date(updates.endDate)
        if (updates.equipmentCategory !== undefined) updateData.equipmentCategory = updates.equipmentCategory
        if (updates.equipmentDetail !== undefined) updateData.equipmentDetail = updates.equipmentDetail
        if (updates.internalNotes !== undefined) updateData.internalNotes = updates.internalNotes

        const serviceRequest = await db?.serviceRequest.update({
          where: {
            id: requestId,
          },
          data: updateData,
          select: {
            id: true,
            title: true,
            description: true,
            userId: true,
            contactName: true,
            contactEmail: true,
            contactPhone: true,
            company: true,
            jobSite: true,
            transport: true,
            startDate: true,
            endDate: true,
            equipmentCategory: true,
            equipmentDetail: true,
            requestedDurationType: true,
            requestedDurationValue: true,
            requestedTotalHours: true,
            rateType: true,
            baseRate: true,
            status: true,
            priority: true,
            estimatedCost: true,
            depositAmount: true,
            depositPaid: true,
            depositPaidAt: true,
            finalAmount: true,
            finalPaid: true,
            finalPaidAt: true,
            stripeDepositPaymentIntentId: true,
            stripeFinalPaymentIntentId: true,
            assignedManagerId: true,
            rejectionReason: true,
            internalNotes: true,
            createdAt: true,
            updatedAt: true,
          },
        })

        return serviceRequest
      },
      "DATABASE_ERROR",
      "Failed to update service request"
    )
  }

  /**
   * Delete a service request
   */
  async deleteServiceRequest(
    requestId: string,
    userId: string
  ): Promise<ServiceResult<void>> {
    this.logOperation("deleteServiceRequest", { requestId, userId: "[REDACTED]" })

    const validation = this.validateRequired({ requestId, userId }, ["requestId", "userId"])
    if (!validation.success) {
      return validation
    }

    return this.handleAsync(
      async () => {
        // Check access
        const hasAccess = await this.verifyUserHasAccessToRequest(requestId, userId)
        if (!hasAccess.success) {
          // Database error in access verification
          throw new Error(hasAccess.error?.message || "Database error")
        }
        if (!hasAccess.data) {
          // No access (count = 0)
          const error = new Error("Access denied to this service request")
          error.name = "ACCESS_DENIED"
          throw error
        }

        await db?.serviceRequest.delete({
          where: {
            id: requestId,
          },
        })

        return undefined
      },
      "DATABASE_ERROR",
      "Failed to delete service request"
    )
  }

  /**
   * Verify user has access to a specific service request
   */
  private async verifyUserHasAccessToRequest(
    requestId: string,
    userId: string
  ): Promise<ServiceResult<boolean>> {
    return this.handleAsync(
      async () => {
        const count = await db?.serviceRequest.count({
          where: {
            id: requestId,
            userId: userId,
          },
        })
        return count > 0
      },
      "DATABASE_ERROR",
      "Failed to verify access to service request"
    )
  }

  /**
   * Workflow Engine Methods (Issue #222)
   */

  /**
   * Validate status transition with role-based permissions
   * Combines status transition validation with role permission checks
   */
  public validateTransitionWithPermissions(
    fromStatus: string | undefined,
    toStatus: string,
    userRole: UserRole
  ): ServiceResult<StatusTransitionWithPermissions> {
    this.logOperation("validateTransitionWithPermissions", {
      fromStatus,
      toStatus,
      userRole,
    })

    // First validate the status transition itself
    const transitionResult = this.validateStatusTransition(fromStatus, toStatus)
    if (!transitionResult.success) {
      return this.createError<StatusTransitionWithPermissions>(
        transitionResult.error?.code || "VALIDATION_ERROR",
        transitionResult.error?.message || "Validation failed",
        transitionResult.error?.details
      )
    }

    const transition = transitionResult.data
    if (!transition) {
      return this.createError(
        "VALIDATION_ERROR",
        "Failed to validate transition"
      )
    }

    // Check role-based permissions
    const permissions =
      ServiceRequestService.ROLE_TRANSITION_PERMISSIONS?.[userRole]
    if (!permissions) {
      return this.createSuccess({
        fromStatus,
        toStatus,
        isValid: transition.isValid,
        hasPermission: false,
        reason: `Unknown role: ${userRole}`,
      })
    }

    // ADMIN can transition any valid status
    if (permissions.canTransitionAny) {
      return this.createSuccess({
        fromStatus,
        toStatus,
        isValid: transition.isValid,
        hasPermission: true,
        reason: transition.reason,
      })
    }

    // Check if role can transition to this status
    let hasPermission = permissions.allowedStatuses?.includes(toStatus) ?? false

    // Special case: USER can only transition to SUBMITTED for initial submissions (no fromStatus)
    if (userRole === "USER" && toStatus === "SUBMITTED" && fromStatus !== undefined) {
      hasPermission = false
    }

    return this.createSuccess({
      fromStatus,
      toStatus,
      isValid: transition.isValid,
      hasPermission,
      reason: hasPermission
        ? transition.reason
        : `Role ${userRole} does not have permission to transition to ${toStatus}`,
    })
  }

  /**
   * Get status history for a service request
   * Returns audit trail of all status changes
   */
  async getStatusHistory(
    serviceRequestId: string
  ): Promise<ServiceResult<StatusHistoryEntry[]>> {
    this.logOperation("getStatusHistory", { serviceRequestId })

    const validation = this.validateRequired({ serviceRequestId }, [
      "serviceRequestId",
    ])
    if (!validation.success) {
      return this.createError<StatusHistoryEntry[]>(
        validation.error?.code || "VALIDATION_ERROR",
        validation.error?.message || "Validation failed",
        validation.error?.details
      )
    }

    return this.handleAsync(
      async () => {
        const request = await db?.serviceRequest.findUnique({
          where: { id: serviceRequestId },
          include: {
            statusHistory: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        })

        if (!request) {
          const error = new Error("Service request not found")
          error.name = "NOT_FOUND"
          throw error
        }

        return request.statusHistory || []
      },
      "DATABASE_ERROR",
      "Failed to retrieve status history"
    )
  }

  /**
   * Validate business rules for status transitions
   * Checks resource availability, financial requirements, and workflow constraints
   */
  public canTransitionBasedOnBusinessRules(
    fromStatus: string,
    toStatus: string,
    requestData: Record<string, unknown>
  ): ServiceResult<BusinessRuleValidation> {
    this.logOperation("canTransitionBasedOnBusinessRules", {
      fromStatus,
      toStatus,
    })

    const reasons: string[] = []

    // Business rule: Cannot request deposit without estimated cost
    if (toStatus === "DEPOSIT_REQUESTED") {
      if (requestData?.estimatedCost === null || requestData?.estimatedCost === undefined) {
        reasons.push("Estimated cost must be set before requesting deposit")
      }
    }

    // Business rule: Cannot schedule job without start date
    if (toStatus === "JOB_SCHEDULED") {
      if (!requestData?.startDate) {
        reasons.push("Start date must be set before scheduling job")
      }
    }

    // Business rule: Cannot invoice without completing job
    if (toStatus === "INVOICED") {
      if (fromStatus !== "JOB_COMPLETED") {
        reasons.push("Job must be completed before invoicing")
      }
    }

    // Business rule: Cannot mark payment as received without confirmation
    if (toStatus === "PAYMENT_RECEIVED") {
      if (requestData?.finalPaid !== true) {
        reasons.push("Payment must be confirmed before marking as received")
      }
    }

    // Business rule: Cannot mark deposit as received without payment
    if (toStatus === "DEPOSIT_RECEIVED") {
      if (requestData?.depositPaid !== true) {
        reasons.push("Deposit must be paid before marking as received")
      }
    }

    return this.createSuccess({
      canTransition: reasons.length === 0,
      reasons,
    })
  }

  /**
   * Change service request status with workflow validation (Issue #223)
   * Performs atomic transaction: validates permissions, updates status, logs history
   */
  async changeStatus(
    input: ChangeStatusInput
  ): Promise<ServiceResult<ServiceRequest>> {
    this.logOperation("changeStatus", {
      requestId: input.requestId,
      newStatus: input.newStatus,
      userId: "[REDACTED]",
      userRole: input.userRole,
    })

    // Validate required parameters
    const validation = this.validateRequired(
      input,
      ["requestId", "newStatus", "userId", "userRole"]
    )
    if (!validation.success) {
      return this.createError<ServiceRequest>(
        validation.error?.code || "VALIDATION_ERROR",
        validation.error?.message || "Validation failed",
        validation.error?.details
      )
    }

    return this.handleAsync(
      async () => {
        // Get current service request
        const currentRequest = await db?.serviceRequest.findUnique({
          where: { id: input.requestId },
        })

        if (!currentRequest) {
          const error = new Error("Service request not found")
          error.name = "NOT_FOUND"
          throw error
        }

        // Validate transition with permissions
        const transitionValidation = this.validateTransitionWithPermissions(
          currentRequest.status,
          input.newStatus,
          input.userRole
        )

        if (!transitionValidation.success || !transitionValidation.data?.isValid) {
          const error = new Error(
            transitionValidation.error?.message || "Invalid status transition"
          )
          error.name = "INVALID_TRANSITION"
          throw error
        }

        if (!transitionValidation.data.hasPermission) {
          const error = new Error(
            `Role ${input.userRole} does not have permission to transition to ${input.newStatus}`
          )
          error.name = "INSUFFICIENT_PERMISSIONS"
          throw error
        }

        // Check business rules
        const businessRules = this.canTransitionBasedOnBusinessRules(
          currentRequest.status,
          input.newStatus,
          currentRequest as Record<string, unknown>
        )

        if (businessRules.success && businessRules.data && !businessRules.data.canTransition) {
          const error = new Error(
            `Business rule violation: ${businessRules.data.reasons.join(", ")}`
          )
          error.name = "BUSINESS_RULE_VIOLATION"
          throw error
        }

        // Perform atomic transaction: update status + create history
        const updatedRequest = await db?.$transaction(async (tx) => {
          // Update service request status
          const updated = await tx.serviceRequest.update({
            where: { id: input.requestId },
            data: {
              status: input.newStatus as ServiceRequestStatus,
              updatedAt: new Date(),
            },
          })

          // Create status history entry
          await tx.serviceRequestStatusHistory.create({
            data: {
              serviceRequestId: input.requestId,
              fromStatus: currentRequest.status,
              toStatus: input.newStatus as ServiceRequestStatus,
              changedBy: input.userId,
              reason: input.reason || null,
              notes: input.notes || null,
            },
          })

          return updated
        })

        return updatedRequest
      },
      "DATABASE_ERROR",
      "Failed to change service request status"
    )
  }

  /**
   * Assign operator to service request (Issue #223)
   * Creates or updates UserAssignment record with operator assignment
   */
  async assignOperator(
    input: AssignOperatorInput
  ): Promise<ServiceResult<{ id: string; status: string }>> {
    this.logOperation("assignOperator", {
      requestId: input.requestId,
      operatorId: input.operatorId,
      userId: "[REDACTED]",
      userRole: input.userRole,
    })

    // Validate required parameters
    const validation = this.validateRequired(
      input,
      ["requestId", "operatorId", "userId", "userRole"]
    )
    if (!validation.success) {
      return this.createError<{ id: string; status: string }>(
        validation.error?.code || "VALIDATION_ERROR",
        validation.error?.message || "Validation failed",
        validation.error?.details
      )
    }

    // Check permissions - only MANAGER and ADMIN can assign operators
    if (input.userRole !== "MANAGER" && input.userRole !== "ADMIN") {
      return this.createError(
        "INSUFFICIENT_PERMISSIONS",
        `Role ${input.userRole} does not have permission to assign operators`
      )
    }

    return this.handleAsync(
      async () => {
        // Verify service request exists
        const serviceRequest = await db?.serviceRequest.findUnique({
          where: { id: input.requestId },
        })

        if (!serviceRequest) {
          const error = new Error("Service request not found")
          error.name = "NOT_FOUND"
          throw error
        }

        // Verify operator exists and has OPERATOR role
        const operator = await db?.user.findUnique({
          where: { id: input.operatorId },
        })

        if (!operator) {
          const error = new Error("Operator not found")
          error.name = "NOT_FOUND"
          throw error
        }

        if (operator.role !== "OPERATOR") {
          const error = new Error("User is not an operator")
          error.name = "INVALID_ROLE"
          throw error
        }

        // Create operator assignment
        const assignment = await db?.userAssignment.create({
          data: {
            serviceRequestId: input.requestId,
            operatorId: input.operatorId,
            status: "pending",
            rate: input.rate || null,
            estimatedHours: input.estimatedHours || null,
          },
        })

        return {
          id: assignment?.id || "",
          status: assignment?.status || "pending",
        }
      },
      "DATABASE_ERROR",
      "Failed to assign operator"
    )
  }
}
