"use client"

/**
 * useAssignmentFlow Hook
 * 
 * Provides functions for operator assignment operations.
 * 
 * Platform Mode: Proven patterns, conservative error handling
 */

import * as React from "react"
import {
  NotificationCallbacks,
  createNoOpNotifications,
} from "@/lib/utils/notifications"

/**
 * Assign operator input
 */
export type AssignOperatorInput = {
  operatorId: string
  rate?: number
  estimatedHours?: number
}

/**
 * Hook options
 */
export type UseAssignmentFlowOptions = {
  requestId: string
  notifications?: NotificationCallbacks
  onSuccess?: (assignment: unknown) => void
}

/**
 * Hook return value
 */
export type UseAssignmentFlowReturn = {
  assignOperator: (input: AssignOperatorInput) => Promise<boolean>
  isAssigning: boolean
  error: string | null
}

/**
 * Custom hook for operator assignment operations
 * 
 * @param options - Request ID, optional notifications and success callback
 * @returns Assign operator function, loading state, and error state
 */
export function useAssignmentFlow(
  options: UseAssignmentFlowOptions
): UseAssignmentFlowReturn {
  const { requestId, notifications: optionsNotifications, onSuccess } = options
  
  // Use provided notifications or fallback to no-op
  const notifications = React.useMemo(
    () => optionsNotifications || createNoOpNotifications(),
    [optionsNotifications]
  )

  // State
  const [isAssigning, setIsAssigning] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Assign operator function
  const assignOperator = React.useCallback(
    async (input: AssignOperatorInput): Promise<boolean> => {
      setIsAssigning(true)
      setError(null)

      try {
        const url = `/api/service-requests/${requestId}/assign`
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            operatorId: input.operatorId,
            ...(input.rate !== undefined && { rate: input.rate }),
            ...(input.estimatedHours !== undefined && { estimatedHours: input.estimatedHours }),
          }),
        })

        if (!response?.ok) {
          let errorMessage = "Failed to assign operator"

          try {
            const errorData = await response?.json?.()
            
            if (response?.status === 404) {
              errorMessage = "Service request not found"
            } else if (response?.status === 401) {
              errorMessage = "Authentication required. Please log in."
            } else if (response?.status === 403) {
              errorMessage = "You don't have permission to assign operators"
            } else if (response?.status === 400) {
              errorMessage = errorData?.error || "Invalid assignment request"
            } else if (response?.status === 409) {
              errorMessage = "This operator is already assigned to this request"
            } else if (response?.status && response.status >= 500) {
              errorMessage = "Server error. Please try again later."
            } else if (errorData?.error) {
              errorMessage = errorData.error
            }
          } catch {
            // Use status-based fallback
            if (response?.status === 404) {
              errorMessage = "Service request not found"
            } else if (response?.status === 401) {
              errorMessage = "Authentication required. Please log in."
            } else if (response?.status === 403) {
              errorMessage = "You don't have permission to assign operators"
            } else if (response?.status === 400) {
              errorMessage = "Invalid assignment request"
            } else if (response?.status && response.status >= 500) {
              errorMessage = "Server error. Please try again later."
            }
          }

          setError(errorMessage)
          notifications.showError(errorMessage, "Assignment failed")
          return false
        }

        const assignment = await response.json()
        setError(null)
        notifications.showSuccess("Operator assigned successfully")
        
        if (onSuccess) {
          onSuccess(assignment)
        }
        
        return true
      } catch {
        const errorMessage =
          "Unable to assign operator. Please check your connection."
        setError(errorMessage)
        notifications.showError(errorMessage, "Assignment failed")
        return false
      } finally {
        setIsAssigning(false)
      }
    },
    [requestId, notifications, onSuccess]
  )

  return {
    assignOperator,
    isAssigning,
    error,
  }
}
