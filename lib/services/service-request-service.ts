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

import { BaseService, ServiceResult } from "./base-service"

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

export interface ServiceRequestCalculationInput {
  durationType: DurationType
  durationValue: number
  baseRate: number
  rateType: RateType
  transport: TransportOption
  equipmentCategory: EquipmentCategory
}

export interface ServiceRequestCalculationResult {
  totalHours: number
  baseCost: number
  transportFee: number
  totalEstimate: number
  durationDisplay: string
}

export interface StatusTransition {
  fromStatus: string | undefined
  toStatus: string
  isValid: boolean
  reason: string | undefined
}

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

  constructor() {
    super("ServiceRequestService")
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
        validation.error!.code,
        validation.error!.message,
        validation.error!.details
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
        validation.error!.code,
        validation.error!.message,
        validation.error!.details
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
        validation.error!.code,
        validation.error!.message,
        validation.error!.details
      )
    }

    const fee = ServiceRequestService.TRANSPORT_FEES[transport]
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
        validation.error!.code,
        validation.error!.message,
        validation.error!.details
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
      ServiceRequestService.EQUIPMENT_MULTIPLIERS[equipmentCategory]
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
      input as unknown as Record<string, unknown>
    )

    // Calculate total hours
    const hoursResult = this.calculateTotalHours(
      input.durationType,
      input.durationValue
    )
    if (!hoursResult.success) {
      return this.createError<ServiceRequestCalculationResult>(
        hoursResult.error!.code,
        hoursResult.error!.message,
        hoursResult.error!.details
      )
    }

    // Calculate duration display
    const displayResult = this.getDurationDisplayText(
      input.durationType,
      input.durationValue
    )
    if (!displayResult.success) {
      return this.createError<ServiceRequestCalculationResult>(
        displayResult.error!.code,
        displayResult.error!.message,
        displayResult.error!.details
      )
    }

    // Calculate base cost
    const baseCostResult = this.calculateBaseCost(
      hoursResult.data!,
      input.baseRate,
      input.rateType,
      input.equipmentCategory
    )
    if (!baseCostResult.success) {
      return this.createError<ServiceRequestCalculationResult>(
        baseCostResult.error!.code,
        baseCostResult.error!.message,
        baseCostResult.error!.details
      )
    }

    // Calculate transport fee
    const transportResult = this.calculateTransportFee(input.transport)
    if (!transportResult.success) {
      return this.createError<ServiceRequestCalculationResult>(
        transportResult.error!.code,
        transportResult.error!.message,
        transportResult.error!.details
      )
    }

    const result: ServiceRequestCalculationResult = {
      totalHours: hoursResult.data!,
      baseCost: baseCostResult.data!,
      transportFee: transportResult.data!,
      totalEstimate: baseCostResult.data! + transportResult.data!,
      durationDisplay: displayResult.data!,
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
        validation.error!.code,
        validation.error!.message,
        validation.error!.details
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
        validation.error!.code,
        validation.error!.message,
        validation.error!.details
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

    // Start date must be in the future
    if (startDate <= now) {
      errors.push("Start date must be in the future")
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
}
