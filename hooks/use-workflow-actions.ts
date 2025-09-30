"use client"

/**
 * useWorkflowActions Hook
 * 
 * Provides functions to execute workflow actions (status transitions).
 * 
 * Platform Mode: Proven patterns, conservative error handling
 */

import * as React from "react"
import type { ServiceRequestStatus } from "@prisma/client"
import {
  NotificationCallbacks,
  createNoOpNotifications,
} from "@/lib/utils/notifications"

/**
 * Status change input
 */
export type StatusChangeInput = {
  newStatus: ServiceRequestStatus | string
  reason?: string
  notes?: string
}

/**
 * Hook options
 */
export type UseWorkflowActionsOptions = {
  requestId: string
  notifications?: NotificationCallbacks
  onSuccess?: (updatedRequest: unknown) => void
}

/**
 * Hook return value
 */
export type UseWorkflowActionsReturn = {
  changeStatus: (input: StatusChangeInput) => Promise<boolean>
  isChangingStatus: boolean
  error: string | null
}

/**
 * Custom hook for workflow action operations
 * 
 * @param options - Request ID, optional notifications and success callback
 * @returns Change status function, loading state, and error state
 */
export function useWorkflowActions(
  options: UseWorkflowActionsOptions
): UseWorkflowActionsReturn {
  const { requestId, notifications: optionsNotifications, onSuccess } = options
  
  // Use provided notifications or fallback to no-op
  const notifications = React.useMemo(
    () => optionsNotifications || createNoOpNotifications(),
    [optionsNotifications]
  )

  // State
  const [isChangingStatus, setIsChangingStatus] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Change status function
  const changeStatus = React.useCallback(
    async (input: StatusChangeInput): Promise<boolean> => {
      setIsChangingStatus(true)
      setError(null)

      try {
        const url = `/api/service-requests/${requestId}/status`
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            newStatus: input.newStatus,
            ...(input.reason && { reason: input.reason }),
            ...(input.notes && { notes: input.notes }),
          }),
        })

        if (!response?.ok) {
          let errorMessage = "Failed to change status"

          try {
            const errorData = await response?.json?.()
            
            if (response?.status === 404) {
              errorMessage = "Service request not found"
            } else if (response?.status === 401) {
              errorMessage = "Authentication required. Please log in."
            } else if (response?.status === 403) {
              errorMessage = "You don't have permission to change this status"
            } else if (response?.status === 400) {
              errorMessage = errorData?.error || "Invalid status transition"
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
              errorMessage = "You don't have permission to change this status"
            } else if (response?.status === 400) {
              errorMessage = "Invalid status transition"
            } else if (response?.status && response.status >= 500) {
              errorMessage = "Server error. Please try again later."
            }
          }

          setError(errorMessage)
          notifications.showError(errorMessage, "Status change failed")
          return false
        }

        const updatedRequest = await response.json()
        setError(null)
        notifications.showSuccess("Status changed successfully")
        
        if (onSuccess) {
          onSuccess(updatedRequest)
        }
        
        return true
      } catch {
        const errorMessage =
          "Unable to change status. Please check your connection."
        setError(errorMessage)
        notifications.showError(errorMessage, "Status change failed")
        return false
      } finally {
        setIsChangingStatus(false)
      }
    },
    [requestId, notifications, onSuccess]
  )

  return {
    changeStatus,
    isChangingStatus,
    error,
  }
}
