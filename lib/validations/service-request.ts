import * as z from "zod"

export const equipmentCategories = [
  "SKID_STEERS_TRACK_LOADERS",
  "FRONT_END_LOADERS", 
  "BACKHOES_EXCAVATORS",
  "BULLDOZERS",
  "GRADERS",
  "DUMP_TRUCKS",
  "WATER_TRUCKS",
  "SWEEPERS",
  "TRENCHERS"
] as const

export const userRoles = [
  "USER",
  "OPERATOR", 
  "MANAGER",
  "ADMIN"
] as const

export const transportOptions = [
  "WE_HANDLE_IT",
  "YOU_HANDLE_IT"
] as const

export const durationTypes = [
  "HALF_DAY",    // 4 hours
  "FULL_DAY",    // 8 hours  
  "MULTI_DAY",   // Multiple days
  "WEEKLY"       // Weekly booking
] as const

export const rateTypes = [
  "HOURLY",
  "HALF_DAY", 
  "DAILY",
  "WEEKLY"
] as const

export const serviceRequestSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  
  // Contact Information
  contactName: z.string().min(1, "Contact name is required").max(100),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().min(10, "Valid phone number is required").max(20),
  company: z.string().max(100).optional(),
  
  // Job Details
  jobSite: z.string().min(1, "Job site address is required").max(500),
  transport: z.enum(transportOptions, {
    required_error: "Please select transport option"
  }),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Valid start date is required"
  }),
  endDate: z.string().optional().refine((date) => {
    if (!date) return true
    return !isNaN(Date.parse(date))
  }, {
    message: "Valid end date required"
  }),
  
  // Equipment Requirements
  equipmentCategory: z.enum(equipmentCategories, {
    required_error: "Please select equipment category"
  }),
  equipmentDetail: z.string().min(1, "Equipment details are required").max(500),
  
  // Duration & Pricing
  requestedDurationType: z.enum(durationTypes, {
    required_error: "Please select duration type"
  }),
  requestedDurationValue: z.number().int().positive("Duration value must be positive"),
  requestedTotalHours: z.number().positive("Total hours must be positive"),
  rateType: z.enum(rateTypes, {
    required_error: "Please select rate type"
  }),
  baseRate: z.number().positive("Base rate must be positive"),
})

export const serviceRequestStatuses = [
  "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", 
  "OPERATOR_MATCHING", "OPERATOR_ASSIGNED", "EQUIPMENT_CHECKING", 
  "EQUIPMENT_CONFIRMED", "DEPOSIT_REQUESTED", "DEPOSIT_PENDING", 
  "DEPOSIT_RECEIVED", "JOB_SCHEDULED", "JOB_IN_PROGRESS", 
  "JOB_COMPLETED", "INVOICED", "PAYMENT_PENDING", 
  "PAYMENT_RECEIVED", "CLOSED", "CANCELLED"
] as const

export const serviceRequestUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  jobSite: z.string().min(1).max(500).optional(),
  transport: z.enum(transportOptions).optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date))).optional(),
  endDate: z.string().refine((date) => {
    if (!date) return true
    return !isNaN(Date.parse(date))
  }).optional(),
  equipmentCategory: z.enum(equipmentCategories).optional(),
  equipmentDetail: z.string().min(1).max(500).optional(),
  status: z.enum(serviceRequestStatuses).optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).optional(),
  estimatedCost: z.number().positive().optional(),
  depositAmount: z.number().positive().optional(),
  finalAmount: z.number().positive().optional(),
  assignedManagerId: z.string().optional(),
  rejectionReason: z.string().max(500).optional(),
  internalNotes: z.string().max(1000).optional(),
})

export const statusChangeSchema = z.object({
  serviceRequestId: z.string().min(1, "Service request ID is required"),
  fromStatus: z.enum(serviceRequestStatuses).optional(),
  toStatus: z.enum(serviceRequestStatuses),
  reason: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
})

// NOTE: Business logic functions have been moved to ServiceRequestService
// These functions are deprecated and will be removed in a future version
// Use ServiceRequestService.calculateTotalHours() and ServiceRequestService.getDurationDisplayText() instead

/**
 * @deprecated Use ServiceRequestService.calculateTotalHours() instead
 * This function will be removed in a future version
 */
export function calculateTotalHours(durationType: typeof durationTypes[number], durationValue: number): number {
  switch (durationType) {
    case "HALF_DAY":
      return 4 * durationValue
    case "FULL_DAY":
      return 8 * durationValue
    case "MULTI_DAY":
      return 8 * durationValue // 8 hours per day
    case "WEEKLY":
      return 40 * durationValue // 40 hours per week (5 days × 8 hours)
    default:
      return 8 // Default to full day
  }
}

/**
 * @deprecated Use ServiceRequestService.getDurationDisplayText() instead
 * This function will be removed in a future version
 */
export function getDurationDisplayText(durationType: typeof durationTypes[number], durationValue: number): string {
  switch (durationType) {
    case "HALF_DAY":
      return durationValue === 1 ? "Half Day (4 hours)" : `${durationValue} Half Days (${4 * durationValue} hours)`
    case "FULL_DAY":
      return durationValue === 1 ? "Full Day (8 hours)" : `${durationValue} Full Days (${8 * durationValue} hours)`
    case "MULTI_DAY":
      return `${durationValue} Days (${8 * durationValue} hours)`
    case "WEEKLY":
      return durationValue === 1 ? "1 Week (40 hours)" : `${durationValue} Weeks (${40 * durationValue} hours)`
    default:
      return "Unknown duration"
  }
}

export type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>
export type ServiceRequestUpdateData = z.infer<typeof serviceRequestUpdateSchema>
