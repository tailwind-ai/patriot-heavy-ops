/**
 * Workflow UI Component Types
 * 
 * Type definitions for workflow management UI components.
 * Reuses types from service layer for consistency.
 */

import type { ServiceRequestStatus } from "@prisma/client"

/**
 * User role type for workflow operations
 */
export type WorkflowUserRole = "USER" | "OPERATOR" | "MANAGER" | "ADMIN"

/**
 * Status transition information
 */
export type StatusTransition = {
  fromStatus: ServiceRequestStatus | undefined
  toStatus: ServiceRequestStatus
  isValid: boolean
  hasPermission: boolean
  reason: string | undefined
}

/**
 * Status history entry for audit trail
 */
export type StatusHistoryEntry = {
  id: string
  serviceRequestId: string
  fromStatus: ServiceRequestStatus | null
  toStatus: ServiceRequestStatus
  changedBy: string
  changedByUser?: {
    id: string
    name: string | null
    email: string | null
  }
  reason: string | null
  notes: string | null
  createdAt: Date | string
}

/**
 * Operator assignment data
 */
export type OperatorAssignment = {
  id: string
  serviceRequestId: string
  operatorId: string
  operator: {
    id: string
    name: string | null
    email: string | null
  }
  status: string
  rate: number | null
  estimatedHours: number | null
  actualHours: number | null
  assignedAt: Date
  acceptedAt: Date | null
  completedAt: Date | null
}

/**
 * Available operator for assignment
 */
export type AvailableOperator = {
  id: string
  name: string | null
  email: string | null
  role: string
}

/**
 * Status change request
 */
export type StatusChangeRequest = {
  requestId: string
  newStatus: ServiceRequestStatus
  reason?: string
  notes?: string
}

/**
 * Operator assignment request
 */
export type AssignOperatorRequest = {
  requestId: string
  operatorId: string
  rate?: number
  estimatedHours?: number
}
