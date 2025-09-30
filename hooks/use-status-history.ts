"use client"

/**
 * useStatusHistory Hook
 * 
 * Fetches and manages status change history (audit trail) for a service request.
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
 * Status history entry
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
  createdAt: Date
}

/**
 * Hook options
 */
export type UseStatusHistoryOptions = {
  requestId: string
  notifications?: NotificationCallbacks
}

/**
 * Hook return value
 */
export type UseStatusHistoryReturn = {
  history: StatusHistoryEntry[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Custom hook to fetch service request status history
 * 
 * @param options - Request ID and optional notifications
 * @returns Status history, loading state, error state, and refetch function
 */
export function useStatusHistory(
  options: UseStatusHistoryOptions
): UseStatusHistoryReturn {
  const { requestId, notifications: optionsNotifications } = options
  
  // Use provided notifications or fallback to no-op
  const notifications = React.useMemo(
    () => optionsNotifications || createNoOpNotifications(),
    [optionsNotifications]
  )

  // State
  const [history, setHistory] = React.useState<StatusHistoryEntry[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch history
  const fetchHistory = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const url = `/api/service-requests/${requestId}/history`
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response?.ok) {
        let errorMessage = "Failed to load status history"

        try {
          const errorData = await response?.json?.()
          
          if (response?.status === 404) {
            errorMessage = "Service request not found"
          } else if (response?.status === 401) {
            errorMessage = "Authentication required. Please log in."
          } else if (response?.status === 403) {
            errorMessage = "Access denied. You may not be authorized to view this history."
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
            errorMessage = "Access denied. You may not be authorized to view this history."
          } else if (response?.status && response.status >= 500) {
            errorMessage = "Server error. Please try again later."
          }
        }

        setError(errorMessage)
        setHistory([])
        notifications.showError(errorMessage, "Failed to load history")
        return
      }

      const data = await response.json()
      setHistory(Array.isArray(data) ? data : [])
      setError(null)
    } catch {
      const errorMessage =
        "Unable to load status history. Please check your connection."
      setError(errorMessage)
      setHistory([])
      notifications.showError(errorMessage, "Failed to load history")
    } finally {
      setIsLoading(false)
    }
  }, [requestId, notifications])

  // Fetch on mount and when requestId changes
  React.useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return {
    history,
    isLoading,
    error,
    refetch: fetchHistory,
  }
}
