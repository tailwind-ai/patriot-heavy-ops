/**
 * Service Request Service Tests
 *
 * Unit tests for the ServiceRequestService business logic.
 * Tests all calculation methods, validation rules, and error scenarios.
 */

import {
  ServiceRequestService,
  DurationType,
  RateType,
  EquipmentCategory,
  TransportOption,
} from "../../../lib/services/service-request-service"
import { ServiceLogger } from "../../../lib/services/base-service"

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

describe("ServiceRequestService", () => {
  let service: ServiceRequestService
  let mockLogger: MockLogger

  beforeEach(() => {
    mockLogger = new MockLogger()
    service = new ServiceRequestService()
    // Replace logger with mock for testing
    ;(service as any).logger = mockLogger
  })

  describe("calculateTotalHours", () => {
    it("should calculate hours for HALF_DAY correctly", () => {
      const result = service.calculateTotalHours("HALF_DAY", 2)

      expect(result.success).toBe(true)
      expect(result.data).toBe(8) // 4 hours * 2 = 8 hours
    })

    it("should calculate hours for FULL_DAY correctly", () => {
      const result = service.calculateTotalHours("FULL_DAY", 3)

      expect(result.success).toBe(true)
      expect(result.data).toBe(24) // 8 hours * 3 = 24 hours
    })

    it("should calculate hours for MULTI_DAY correctly", () => {
      const result = service.calculateTotalHours("MULTI_DAY", 5)

      expect(result.success).toBe(true)
      expect(result.data).toBe(40) // 8 hours * 5 = 40 hours
    })

    it("should calculate hours for WEEKLY correctly", () => {
      const result = service.calculateTotalHours("WEEKLY", 2)

      expect(result.success).toBe(true)
      expect(result.data).toBe(80) // 40 hours * 2 = 80 hours
    })

    it("should handle single unit durations", () => {
      const halfDay = service.calculateTotalHours("HALF_DAY", 1)
      const fullDay = service.calculateTotalHours("FULL_DAY", 1)
      const multiDay = service.calculateTotalHours("MULTI_DAY", 1)
      const weekly = service.calculateTotalHours("WEEKLY", 1)

      expect(halfDay.data).toBe(4)
      expect(fullDay.data).toBe(8)
      expect(multiDay.data).toBe(8)
      expect(weekly.data).toBe(40)
    })

    it("should reject invalid duration values", () => {
      const result = service.calculateTotalHours("FULL_DAY", 0)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("INVALID_DURATION")
      expect(result.error?.message).toBe("Duration value must be positive")
    })

    it("should reject negative duration values", () => {
      const result = service.calculateTotalHours("FULL_DAY", -1)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("INVALID_DURATION")
    })

    it("should reject invalid duration types", () => {
      const result = service.calculateTotalHours(
        "INVALID_TYPE" as DurationType,
        1
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("INVALID_DURATION_TYPE")
    })

    it("should validate required parameters", () => {
      const result = service.calculateTotalHours(undefined as any, 1)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })

    it("should log operations", () => {
      service.calculateTotalHours("FULL_DAY", 1)

      expect(mockLogger.logs).toHaveLength(1)
      expect(mockLogger.logs[0]?.level).toBe("info")
      expect(mockLogger.logs[0]?.message).toContain("calculateTotalHours")
    })
  })

  describe("getDurationDisplayText", () => {
    it("should generate display text for single HALF_DAY", () => {
      const result = service.getDurationDisplayText("HALF_DAY", 1)

      expect(result.success).toBe(true)
      expect(result.data).toBe("Half Day (4 hours)")
    })

    it("should generate display text for multiple HALF_DAY", () => {
      const result = service.getDurationDisplayText("HALF_DAY", 3)

      expect(result.success).toBe(true)
      expect(result.data).toBe("3 Half Days (12 hours)")
    })

    it("should generate display text for single FULL_DAY", () => {
      const result = service.getDurationDisplayText("FULL_DAY", 1)

      expect(result.success).toBe(true)
      expect(result.data).toBe("Full Day (8 hours)")
    })

    it("should generate display text for multiple FULL_DAY", () => {
      const result = service.getDurationDisplayText("FULL_DAY", 5)

      expect(result.success).toBe(true)
      expect(result.data).toBe("5 Full Days (40 hours)")
    })

    it("should generate display text for MULTI_DAY", () => {
      const result = service.getDurationDisplayText("MULTI_DAY", 7)

      expect(result.success).toBe(true)
      expect(result.data).toBe("7 Days (56 hours)")
    })

    it("should generate display text for single WEEKLY", () => {
      const result = service.getDurationDisplayText("WEEKLY", 1)

      expect(result.success).toBe(true)
      expect(result.data).toBe("1 Week (40 hours)")
    })

    it("should generate display text for multiple WEEKLY", () => {
      const result = service.getDurationDisplayText("WEEKLY", 4)

      expect(result.success).toBe(true)
      expect(result.data).toBe("4 Weeks (160 hours)")
    })

    it("should reject invalid duration values", () => {
      const result = service.getDurationDisplayText("FULL_DAY", 0)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("INVALID_DURATION")
    })

    it("should reject invalid duration types", () => {
      const result = service.getDurationDisplayText(
        "INVALID_TYPE" as DurationType,
        1
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("INVALID_DURATION_TYPE")
    })
  })

  describe("calculateTransportFee", () => {
    it("should return correct fee for WE_HANDLE_IT", () => {
      const result = service.calculateTransportFee("WE_HANDLE_IT")

      expect(result.success).toBe(true)
      expect(result.data).toBe(150)
    })

    it("should return correct fee for YOU_HANDLE_IT", () => {
      const result = service.calculateTransportFee("YOU_HANDLE_IT")

      expect(result.success).toBe(true)
      expect(result.data).toBe(0)
    })

    it("should reject invalid transport options", () => {
      const result = service.calculateTransportFee(
        "INVALID_OPTION" as TransportOption
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("INVALID_TRANSPORT_OPTION")
    })

    it("should validate required parameters", () => {
      const result = service.calculateTransportFee(undefined as any)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })
  })

  describe("calculateBaseCost", () => {
    it("should calculate hourly rate correctly", () => {
      const result = service.calculateBaseCost(
        10,
        50,
        "HOURLY",
        "SKID_STEERS_TRACK_LOADERS"
      )

      expect(result.success).toBe(true)
      expect(result.data).toBe(500) // 10 hours * $50/hour * 1.0 multiplier
    })

    it("should calculate half-day rate correctly", () => {
      const result = service.calculateBaseCost(
        6,
        200,
        "HALF_DAY",
        "SKID_STEERS_TRACK_LOADERS"
      )

      expect(result.success).toBe(true)
      expect(result.data).toBe(400) // ceil(6/4) = 2 half-days * $200 * 1.0 multiplier
    })

    it("should calculate daily rate correctly", () => {
      const result = service.calculateBaseCost(
        12,
        400,
        "DAILY",
        "SKID_STEERS_TRACK_LOADERS"
      )

      expect(result.success).toBe(true)
      expect(result.data).toBe(800) // ceil(12/8) = 2 days * $400 * 1.0 multiplier
    })

    it("should calculate weekly rate correctly", () => {
      const result = service.calculateBaseCost(
        60,
        1500,
        "WEEKLY",
        "SKID_STEERS_TRACK_LOADERS"
      )

      expect(result.success).toBe(true)
      expect(result.data).toBe(3000) // ceil(60/40) = 2 weeks * $1500 * 1.0 multiplier
    })

    it("should apply equipment multipliers correctly", () => {
      const bulldozer = service.calculateBaseCost(
        8,
        100,
        "HOURLY",
        "BULLDOZERS"
      )
      const frontLoader = service.calculateBaseCost(
        8,
        100,
        "HOURLY",
        "FRONT_END_LOADERS"
      )

      expect(bulldozer.success).toBe(true)
      expect(bulldozer.data).toBe(1200) // 8 * 100 * 1.5

      expect(frontLoader.success).toBe(true)
      expect(frontLoader.data).toBe(960) // 8 * 100 * 1.2
    })

    it("should round to 2 decimal places", () => {
      const result = service.calculateBaseCost(
        7,
        33.33,
        "HOURLY",
        "BACKHOES_EXCAVATORS"
      )

      expect(result.success).toBe(true)
      expect(result.data).toBe(256.64) // 7 * 33.33 * 1.1 = 256.641, rounded to 256.64
    })

    it("should reject invalid inputs", () => {
      const zeroHours = service.calculateBaseCost(
        0,
        100,
        "HOURLY",
        "SKID_STEERS_TRACK_LOADERS"
      )
      const zeroRate = service.calculateBaseCost(
        8,
        0,
        "HOURLY",
        "SKID_STEERS_TRACK_LOADERS"
      )

      expect(zeroHours.success).toBe(false)
      expect(zeroHours.error?.code).toBe("INVALID_CALCULATION_INPUT")

      expect(zeroRate.success).toBe(false)
      expect(zeroRate.error?.code).toBe("INVALID_CALCULATION_INPUT")
    })

    it("should reject invalid equipment categories", () => {
      const result = service.calculateBaseCost(
        8,
        100,
        "HOURLY",
        "INVALID_CATEGORY" as EquipmentCategory
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("INVALID_EQUIPMENT_CATEGORY")
    })

    it("should reject invalid rate types", () => {
      const result = service.calculateBaseCost(
        8,
        100,
        "INVALID_RATE" as RateType,
        "SKID_STEERS_TRACK_LOADERS"
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("INVALID_RATE_TYPE")
    })
  })

  describe("calculateServiceRequestPricing", () => {
    const validInput = {
      durationType: "FULL_DAY" as DurationType,
      durationValue: 2,
      baseRate: 400,
      rateType: "DAILY" as RateType,
      transport: "WE_HANDLE_IT" as TransportOption,
      equipmentCategory: "SKID_STEERS_TRACK_LOADERS" as EquipmentCategory,
    }

    it("should calculate complete pricing correctly", () => {
      const result = service.calculateServiceRequestPricing(validInput)

      expect(result.success).toBe(true)
      expect(result.data?.totalHours).toBe(16) // 2 full days * 8 hours
      expect(result.data?.baseCost).toBe(800) // ceil(16/8) = 2 days * $400 * 1.0
      expect(result.data?.transportFee).toBe(150)
      expect(result.data?.totalEstimate).toBe(950) // 800 + 150
      expect(result.data?.durationDisplay).toBe("2 Full Days (16 hours)")
    })

    it("should handle complex equipment multipliers", () => {
      const bulldozerInput = {
        ...validInput,
        equipmentCategory: "BULLDOZERS" as EquipmentCategory,
        baseRate: 500,
        rateType: "HOURLY" as RateType,
      }

      const result = service.calculateServiceRequestPricing(bulldozerInput)

      expect(result.success).toBe(true)
      expect(result.data?.baseCost).toBe(12000) // 16 hours * $500 * 1.5 multiplier
      expect(result.data?.totalEstimate).toBe(12150) // 12000 + 150
    })

    it("should handle YOU_HANDLE_IT transport", () => {
      const selfTransportInput = {
        ...validInput,
        transport: "YOU_HANDLE_IT" as TransportOption,
      }

      const result = service.calculateServiceRequestPricing(selfTransportInput)

      expect(result.success).toBe(true)
      expect(result.data?.transportFee).toBe(0)
      expect(result.data?.totalEstimate).toBe(800) // 800 + 0
    })

    it("should propagate calculation errors", () => {
      const invalidInput = {
        ...validInput,
        durationValue: 0, // Invalid
      }

      const result = service.calculateServiceRequestPricing(invalidInput)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("INVALID_DURATION")
    })
  })

  describe("validateStatusTransition", () => {
    it("should validate initial status transition", () => {
      const result = service.validateStatusTransition(undefined, "SUBMITTED")

      expect(result.success).toBe(true)
      expect(result.data?.isValid).toBe(true)
      expect(result.data?.fromStatus).toBeUndefined()
      expect(result.data?.toStatus).toBe("SUBMITTED")
    })

    it("should reject invalid initial status", () => {
      const result = service.validateStatusTransition(undefined, "APPROVED")

      expect(result.success).toBe(true)
      expect(result.data?.isValid).toBe(false)
      expect(result.data?.reason).toBe("Initial status must be SUBMITTED")
    })

    it("should validate valid status transitions", () => {
      const result = service.validateStatusTransition(
        "SUBMITTED",
        "UNDER_REVIEW"
      )

      expect(result.success).toBe(true)
      expect(result.data?.isValid).toBe(true)
      expect(result.data?.reason).toBeUndefined()
    })

    it("should reject invalid status transitions", () => {
      const result = service.validateStatusTransition(
        "SUBMITTED",
        "JOB_COMPLETED"
      )

      expect(result.success).toBe(true)
      expect(result.data?.isValid).toBe(false)
      expect(result.data?.reason).toBe(
        "Cannot transition from SUBMITTED to JOB_COMPLETED"
      )
    })

    it("should handle terminal statuses", () => {
      const closedResult = service.validateStatusTransition(
        "CLOSED",
        "SUBMITTED"
      )
      const cancelledResult = service.validateStatusTransition(
        "CANCELLED",
        "UNDER_REVIEW"
      )

      expect(closedResult.data?.isValid).toBe(false)
      expect(cancelledResult.data?.isValid).toBe(false)
    })

    it("should handle invalid source status", () => {
      const result = service.validateStatusTransition(
        "INVALID_STATUS",
        "SUBMITTED"
      )

      expect(result.success).toBe(true)
      expect(result.data?.isValid).toBe(false)
      expect(result.data?.reason).toBe("Invalid source status: INVALID_STATUS")
    })

    it("should validate required parameters", () => {
      const result = service.validateStatusTransition(
        "SUBMITTED",
        undefined as any
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })
  })

  describe("getValidNextStatuses", () => {
    it("should return valid next statuses for SUBMITTED", () => {
      const result = service.getValidNextStatuses("SUBMITTED")

      expect(result.success).toBe(true)
      expect(result.data).toEqual(["UNDER_REVIEW", "CANCELLED"])
    })

    it("should return valid next statuses for UNDER_REVIEW", () => {
      const result = service.getValidNextStatuses("UNDER_REVIEW")

      expect(result.success).toBe(true)
      expect(result.data).toEqual(["APPROVED", "REJECTED", "CANCELLED"])
    })

    it("should return empty array for terminal statuses", () => {
      const closedResult = service.getValidNextStatuses("CLOSED")
      const cancelledResult = service.getValidNextStatuses("CANCELLED")

      expect(closedResult.success).toBe(true)
      expect(closedResult.data).toEqual([])

      expect(cancelledResult.success).toBe(true)
      expect(cancelledResult.data).toEqual([])
    })

    it("should reject invalid status", () => {
      const result = service.getValidNextStatuses("INVALID_STATUS")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("INVALID_STATUS")
    })
  })

  describe("validateServiceRequestBusinessRules", () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date()
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

    const validData = {
      startDate: tomorrow.toISOString(),
      endDate: dayAfterTomorrow.toISOString(),
      durationType: "FULL_DAY" as DurationType,
      durationValue: 1,
    }

    it("should validate correct business rules", () => {
      const result = service.validateServiceRequestBusinessRules(validData)

      expect(result.success).toBe(true)
      expect(result.data?.isValid).toBe(true)
      expect(result.data?.errors).toEqual([])
    })

    it("should reject past start dates", () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const result = service.validateServiceRequestBusinessRules({
        ...validData,
        startDate: yesterday.toISOString(),
      })

      expect(result.success).toBe(true)
      expect(result.data?.isValid).toBe(false)
      expect(result.data?.errors).toContain("Start date must be in the future")
    })

    it("should reject end date before start date", () => {
      const result = service.validateServiceRequestBusinessRules({
        ...validData,
        endDate: validData.startDate, // Same as start date
      })

      expect(result.success).toBe(true)
      expect(result.data?.isValid).toBe(false)
      expect(result.data?.errors).toContain("End date must be after start date")
    })

    it("should reject excessive weekly durations", () => {
      const result = service.validateServiceRequestBusinessRules({
        ...validData,
        durationType: "WEEKLY",
        durationValue: 53, // More than 52 weeks
      })

      expect(result.success).toBe(true)
      expect(result.data?.isValid).toBe(false)
      expect(result.data?.errors).toContain(
        "Weekly bookings cannot exceed 52 weeks"
      )
    })

    it("should reject excessive multi-day durations", () => {
      const result = service.validateServiceRequestBusinessRules({
        ...validData,
        durationType: "MULTI_DAY",
        durationValue: 366, // More than 365 days
      })

      expect(result.success).toBe(true)
      expect(result.data?.isValid).toBe(false)
      expect(result.data?.errors).toContain(
        "Multi-day bookings cannot exceed 365 days"
      )
    })

    it("should reject excessive daily durations", () => {
      const halfDayResult = service.validateServiceRequestBusinessRules({
        ...validData,
        durationType: "HALF_DAY",
        durationValue: 31, // More than 30 days
      })

      const fullDayResult = service.validateServiceRequestBusinessRules({
        ...validData,
        durationType: "FULL_DAY",
        durationValue: 31, // More than 30 days
      })

      expect(halfDayResult.data?.isValid).toBe(false)
      expect(halfDayResult.data?.errors).toContain(
        "Daily bookings cannot exceed 30 days"
      )

      expect(fullDayResult.data?.isValid).toBe(false)
      expect(fullDayResult.data?.errors).toContain(
        "Daily bookings cannot exceed 30 days"
      )
    })

    it("should handle multiple validation errors", () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const result = service.validateServiceRequestBusinessRules({
        startDate: yesterday.toISOString(),
        endDate: yesterday.toISOString(),
        durationType: "WEEKLY",
        durationValue: 100,
      })

      expect(result.success).toBe(true)
      expect(result.data?.isValid).toBe(false)
      expect(result.data?.errors.length).toBeGreaterThan(1)
    })

    it("should handle missing end date", () => {
      const result = service.validateServiceRequestBusinessRules({
        startDate: validData.startDate,
        durationType: "FULL_DAY",
        durationValue: 1,
      })

      expect(result.success).toBe(true)
      expect(result.data?.isValid).toBe(true)
    })
  })

  describe("service integration", () => {
    it("should maintain service name", () => {
      expect(service.getServiceName()).toBe("ServiceRequestService")
    })

    it("should log all operations", () => {
      service.calculateTotalHours("FULL_DAY", 1)
      service.getDurationDisplayText("FULL_DAY", 1)
      service.calculateTransportFee("WE_HANDLE_IT")

      expect(mockLogger.logs.length).toBeGreaterThanOrEqual(3)
      expect(mockLogger.logs.every((log) => log.level === "info")).toBe(true)
    })

    it("should handle edge cases gracefully", () => {
      // Test with very large numbers
      const largeHours = service.calculateTotalHours("WEEKLY", 50)
      expect(largeHours.success).toBe(true)
      expect(largeHours.data).toBe(2000)

      // Test with decimal precision
      const precisionCost = service.calculateBaseCost(
        1,
        33.333,
        "HOURLY",
        "BACKHOES_EXCAVATORS"
      )
      expect(precisionCost.success).toBe(true)
      expect(typeof precisionCost.data).toBe("number")
    })
  })
})
