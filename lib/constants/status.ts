/**
 * Status Constants
 * 
 * Centralized status constants to prevent typos and improve maintainability.
 * Used across components, services, and database operations.
 */

/**
 * Service Request Status Constants
 */
export const SERVICE_REQUEST_STATUS = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  UNDER_REVIEW: "UNDER_REVIEW", 
  APPROVED: "APPROVED",
  OPERATOR_MATCHING: "OPERATOR_MATCHING",
  OPERATOR_ASSIGNED: "OPERATOR_ASSIGNED",
  JOB_IN_PROGRESS: "JOB_IN_PROGRESS",
  JOB_COMPLETED: "JOB_COMPLETED",
  PAYMENT_RECEIVED: "PAYMENT_RECEIVED",
  CLOSED: "CLOSED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  REJECTED: "REJECTED",
} as const

/**
 * Assignment Status Constants
 */
export const ASSIGNMENT_STATUS = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE", 
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const

/**
 * User Role Constants
 */
export const USER_ROLE = {
  USER: "USER",
  OPERATOR: "OPERATOR",
  MANAGER: "MANAGER", 
  ADMIN: "ADMIN",
} as const

/**
 * Equipment Category Constants
 */
export const EQUIPMENT_CATEGORY = {
  EXCAVATORS: "EXCAVATORS",
  BULLDOZERS: "BULLDOZERS",
  SKID_STEERS_TRACK_LOADERS: "SKID_STEERS_TRACK_LOADERS",
  BACKHOE_LOADERS: "BACKHOE_LOADERS",
  WHEEL_LOADERS: "WHEEL_LOADERS",
  DUMP_TRUCKS: "DUMP_TRUCKS",
  CRANES: "CRANES",
  COMPACTORS: "COMPACTORS",
  GRADERS: "GRADERS",
  TRENCHERS: "TRENCHERS",
} as const

/**
 * Duration Type Constants
 */
export const DURATION_TYPE = {
  HOURLY: "HOURLY",
  HALF_DAY: "HALF_DAY", 
  FULL_DAY: "FULL_DAY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
} as const

// Type exports for TypeScript
export type ServiceRequestStatus = typeof SERVICE_REQUEST_STATUS[keyof typeof SERVICE_REQUEST_STATUS]
export type AssignmentStatus = typeof ASSIGNMENT_STATUS[keyof typeof ASSIGNMENT_STATUS]
export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE]
export type EquipmentCategory = typeof EQUIPMENT_CATEGORY[keyof typeof EQUIPMENT_CATEGORY]
export type DurationType = typeof DURATION_TYPE[keyof typeof DURATION_TYPE]
