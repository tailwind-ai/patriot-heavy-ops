"use client"

import * as React from "react"
import {
  useDashboardData,
  type DashboardServiceRequest,
  type OperatorAssignment,
} from "./use-dashboard-data"
import {
  NotificationCallbacks,
  createNoOpNotifications,
} from "@/lib/utils/notifications"

export type UseOperatorJobsOptions = {
  limit?: number
  offset?: number
  enableCaching?: boolean
  notifications?: NotificationCallbacks
}

export type UseOperatorJobsReturn = {
  availableJobs: DashboardServiceRequest[]
  activeAssignments: OperatorAssignment[]
  totalAssignments: number
  activeJobs: number
  completedJobs: number
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  acceptJob: (jobId: string) => Promise<void>
  completeJob: (assignmentId: string) => Promise<void>
}

/**
 * Custom hook for OPERATOR role job management
 *
 * Provides job assignment data and actions for operators.
 * Handles both available jobs and active assignments.
 *
 * @param options - Operator job options
 * @returns Job data, assignments, and control functions
 */
export function useOperatorJobs(
  options: UseOperatorJobsOptions = {}
): UseOperatorJobsReturn {
  // Extract notifications to avoid dependency on entire options object
  const { notifications: optionsNotifications, ...restOptions } = options
  
  // Use provided notifications or fallback to no-op
  const notifications = React.useMemo(
    () => optionsNotifications || createNoOpNotifications(),
    [optionsNotifications]
  )

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useDashboardData({
    role: "OPERATOR",
    limit: restOptions.limit || 15,
    offset: restOptions.offset || 0,
    enableCaching: restOptions.enableCaching !== false, // Default to true
    notifications,
  })

  // Accept a job assignment
  const acceptJob = React.useCallback(
    async (jobId: string) => {
      try {
        const response = await fetch(`/api/service-requests/${jobId}/accept`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        if (!response.ok) {
          let errorMessage = "Failed to accept job"

          try {
            const errorData = await response.json()
            if (response?.status === 401) {
              errorMessage = "Authentication required. Please log in."
            } else if (response?.status === 403) {
              errorMessage =
                "Access denied. You may not be authorized for this job."
            } else if (response?.status === 409) {
              errorMessage = "Job is no longer available or already assigned."
            } else if (errorData?.error) {
              errorMessage = errorData.error
            }
          } catch {
            // Use status-based fallback
            if (response?.status === 401) {
              errorMessage = "Authentication required. Please log in."
            } else if (response?.status === 403) {
              errorMessage =
                "Access denied. You may not be authorized for this job."
            } else if (response?.status >= 500) {
              errorMessage = "Server error. Please try again later."
            }
          }

          notifications.showError(errorMessage, "Failed to accept job")
          return
        }

        notifications.showSuccess(
          "Job accepted successfully. You will be notified of next steps."
        )

        // Refresh data to show updated assignments
        await refetch()
      } catch {
        notifications.showError(
          "Unable to connect to the server. Please check your connection and try again.",
          "Network error"
        )
      }
    },
    [refetch, notifications]
  )

  // Complete a job assignment
  const completeJob = React.useCallback(
    async (assignmentId: string) => {
      try {
        const response = await fetch(
          `/api/assignments/${assignmentId}/complete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        )

        if (!response.ok) {
          let errorMessage = "Failed to complete job"

          try {
            const errorData = await response.json()
            if (response?.status === 401) {
              errorMessage = "Authentication required. Please log in."
            } else if (response?.status === 403) {
              errorMessage =
                "Access denied. You may not be authorized to complete this job."
            } else if (response?.status === 409) {
              errorMessage =
                "Job cannot be completed at this time. Check job status."
            } else if (errorData?.error) {
              errorMessage = errorData.error
            }
          } catch {
            // Use status-based fallback
            if (response?.status === 401) {
              errorMessage = "Authentication required. Please log in."
            } else if (response?.status === 403) {
              errorMessage =
                "Access denied. You may not be authorized to complete this job."
            } else if (response?.status >= 500) {
              errorMessage = "Server error. Please try again later."
            }
          }

          notifications.showError(errorMessage, "Failed to complete job")
          return
        }

        notifications.showSuccess(
          "Job marked as completed. Thank you for your work!"
        )

        // Refresh data to show updated status
        await refetch()
      } catch {
        notifications.showError(
          "Unable to connect to the server. Please check your connection and try again.",
          "Network error"
        )
      }
    },
    [refetch, notifications]
  )

  // Extract operator-specific data
  const availableJobs =
    dashboardData?.recentRequests?.filter(
      (request) =>
        request.status === "OPERATOR_MATCHING" || request.status === "APPROVED"
    ) || []

  const activeAssignments = dashboardData?.assignments || []

  const stats = dashboardData?.stats || {
    totalRequests: 0,
    activeRequests: 0,
    completedRequests: 0,
    pendingApproval: 0,
  }

  return {
    availableJobs,
    activeAssignments,
    totalAssignments: stats.totalRequests,
    activeJobs: stats.activeRequests,
    completedJobs: stats.completedRequests,
    isLoading,
    error,
    refetch,
    acceptJob,
    completeJob,
  }
}
