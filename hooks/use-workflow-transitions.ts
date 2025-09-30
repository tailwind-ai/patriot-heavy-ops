"use client"

/**
 * useWorkflowTransitions Hook
 * 
 * Fetches and manages available status transitions for a service request
 * based on current status and user role.
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
 * Status transition with permission check
 */
export type StatusTransition = {
  fromStatus: ServiceRequestStatus | undefined
  toStatus: ServiceRequestStatus
  isValid: boolean
  hasPermission: boolean
  reason: string | undefined
}

/**
 * Hook options
 */
export type UseWorkflowTransitionsOptions = {
  requestId: string
  currentStatus: ServiceRequestStatus
  userRole: "USER" | "OPERATOR" | "MANAGER" | "ADMIN"
  notifications?: NotificationCallbacks
}

/**
 * Hook return value
 */
export type UseWorkflowTransitionsReturn = {
  transitions: StatusTransition[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Custom hook to fetch available workflow transitions
 * 
 * @param options - Request ID, current status, user role, and optional notifications
 * @returns Available transitions, loading state, error state, and refetch function
 */
export function useWorkflowTransitions(
  options: UseWorkflowTransitionsOptions
): UseWorkflowTransitionsReturn {
  const { requestId, currentStatus, userRole, notifications: optionsNotifications } = options
  
  // Use provided notifications or fallback to no-op
  const notifications = React.useMemo(
    () => optionsNotifications || createNoOpNotifications(),
    [optionsNotifications]
  )

  // State
  const [transitions, setTransitions] = React.useState<StatusTransition[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch transitions
  const fetchTransitions = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const url = `/api/service-requests/${requestId}/transitions?status=${currentStatus}&role=${userRole}`
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response?.ok) {
        let errorMessage = "Failed to load available actions"

        try {
          const errorData = await response?.json?.()
          
          if (response?.status === 404) {
            errorMessage = "Service request not found"
          } else if (response?.status === 401) {
            errorMessage = "Authentication required. Please log in."
          } else if (response?.status === 403) {
            errorMessage = "Access denied. You may not be authorized."
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
            errorMessage = "Access denied. You may not be authorized."
          } else if (response?.status && response.status >= 500) {
            errorMessage = "Server error. Please try again later."
          }
        }

        setError(errorMessage)
        setTransitions([])
        notifications.showError(errorMessage, "Failed to load actions")
        return
      }

      const data = await response.json()
      setTransitions(data?.transitions || [])
      setError(null)
    } catch {
      const errorMessage =
        "Unable to load available actions. Please check your connection."
      setError(errorMessage)
      setTransitions([])
      notifications.showError(errorMessage, "Failed to load actions")
    } finally {
      setIsLoading(false)
    }
  }, [requestId, currentStatus, userRole, notifications])

  // Fetch on mount and when dependencies change
  React.useEffect(() => {
    fetchTransitions()
  }, [fetchTransitions])

  return {
    transitions,
    isLoading,
    error,
    refetch: fetchTransitions,
  }
}
