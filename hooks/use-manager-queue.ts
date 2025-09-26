"use client"

import * as React from "react"
import { useDashboardData, type DashboardServiceRequest, type OperatorAssignment } from "./use-dashboard-data"
import { NotificationCallbacks, createNoOpNotifications } from "@/lib/utils/notifications"

export interface UseManagerQueueOptions {
  limit?: number
  offset?: number
  enableCaching?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface UseManagerQueueReturn {
  pendingApprovals: DashboardServiceRequest[]
  allRequests: DashboardServiceRequest[]
  activeAssignments: OperatorAssignment[]
  totalRequests: number
  activeRequests: number
  completedRequests: number
  pendingApproval: number
  revenue: number
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  approveRequest: (requestId: string) => Promise<void>
  rejectRequest: (requestId: string, reason?: string) => Promise<void>
  assignOperator: (requestId: string, operatorId: string) => Promise<void>
}

/**
 * Custom hook for MANAGER role approval queue management
 * 
 * Provides approval queue data and management actions for managers.
 * Handles service request approvals, operator assignments, and oversight.
 * 
 * @param options - Manager queue options including date range filtering
 * @returns Queue data, stats, and management functions
 */
export function useManagerQueue(options: UseManagerQueueOptions = {}): UseManagerQueueReturn {
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useDashboardData({
    role: "MANAGER",
    limit: options.limit || 20,
    offset: options.offset || 0,
    enableCaching: options.enableCaching !== false, // Default to true
    ...(options.dateRange && { dateRange: options.dateRange }),
  })

  // Approve a service request
  const approveRequest = React.useCallback(async (requestId: string) => {
    try {
      const response = await fetch(`/api/service-requests/${requestId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        let errorMessage = "Failed to approve request"
        
        try {
          const errorData = await response.json()
          if (response.status === 401) {
            errorMessage = "Authentication required. Please log in."
          } else if (response.status === 403) {
            errorMessage = "Access denied. Manager permissions required."
          } else if (response.status === 409) {
            errorMessage = "Request cannot be approved at this time. Check request status."
          } else if (errorData?.error) {
            errorMessage = errorData.error
          }
        } catch {
          // Use status-based fallback
          if (response.status === 401) {
            errorMessage = "Authentication required. Please log in."
          } else if (response.status === 403) {
            errorMessage = "Access denied. Manager permissions required."
          } else if (response.status >= 500) {
            errorMessage = "Server error. Please try again later."
          }
        }

        // TODO: Add notification callback support
        console.error("Failed to approve request:", errorMessage)
        return
      }

      // TODO: Add notification callback support
      console.log("Service request approved successfully.")

      // Refresh data to show updated status
      await refetch()
    } catch {
      // TODO: Add notification callback support
      console.log("Notification:", {
        title: "Network error",
        description: "Unable to connect to the server. Please check your connection and try again.",
        variant: "destructive",
      })
    }
  }, [refetch])

  // Reject a service request
  const rejectRequest = React.useCallback(async (requestId: string, reason?: string) => {
    try {
      const response = await fetch(`/api/service-requests/${requestId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
        credentials: "include",
      })

      if (!response.ok) {
        let errorMessage = "Failed to reject request"
        
        try {
          const errorData = await response.json()
          if (response.status === 401) {
            errorMessage = "Authentication required. Please log in."
          } else if (response.status === 403) {
            errorMessage = "Access denied. Manager permissions required."
          } else if (response.status === 409) {
            errorMessage = "Request cannot be rejected at this time. Check request status."
          } else if (errorData?.error) {
            errorMessage = errorData.error
          }
        } catch {
          // Use status-based fallback
          if (response.status === 401) {
            errorMessage = "Authentication required. Please log in."
          } else if (response.status === 403) {
            errorMessage = "Access denied. Manager permissions required."
          } else if (response.status >= 500) {
            errorMessage = "Server error. Please try again later."
          }
        }

        // TODO: Add notification callback support
      console.log("Notification:", {
          title: "Failed to reject request",
          description: errorMessage,
          variant: "destructive",
        })
        return
      }

      // TODO: Add notification callback support
      console.log("Notification:", {
        description: "Service request rejected.",
      })

      // Refresh data to show updated status
      await refetch()
    } catch {
      // TODO: Add notification callback support
      console.log("Notification:", {
        title: "Network error",
        description: "Unable to connect to the server. Please check your connection and try again.",
        variant: "destructive",
      })
    }
  }, [refetch])

  // Assign operator to a service request
  const assignOperator = React.useCallback(async (requestId: string, operatorId: string) => {
    try {
      const response = await fetch(`/api/service-requests/${requestId}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ operatorId }),
        credentials: "include",
      })

      if (!response.ok) {
        let errorMessage = "Failed to assign operator"
        
        try {
          const errorData = await response.json()
          if (response.status === 401) {
            errorMessage = "Authentication required. Please log in."
          } else if (response.status === 403) {
            errorMessage = "Access denied. Manager permissions required."
          } else if (response.status === 409) {
            errorMessage = "Operator assignment failed. Check availability."
          } else if (errorData?.error) {
            errorMessage = errorData.error
          }
        } catch {
          // Use status-based fallback
          if (response.status === 401) {
            errorMessage = "Authentication required. Please log in."
          } else if (response.status === 403) {
            errorMessage = "Access denied. Manager permissions required."
          } else if (response.status >= 500) {
            errorMessage = "Server error. Please try again later."
          }
        }

        // TODO: Add notification callback support
      console.log("Notification:", {
          title: "Failed to assign operator",
          description: errorMessage,
          variant: "destructive",
        })
        return
      }

      // TODO: Add notification callback support
      console.log("Notification:", {
        description: "Operator assigned successfully.",
      })

      // Refresh data to show updated assignments
      await refetch()
    } catch {
      // TODO: Add notification callback support
      console.log("Notification:", {
        title: "Network error",
        description: "Unable to connect to the server. Please check your connection and try again.",
        variant: "destructive",
      })
    }
  }, [refetch])

  // Extract manager-specific data
  const allRequests = dashboardData?.recentRequests || []
  const pendingApprovals = allRequests.filter(
    request => request.status === "SUBMITTED" || request.status === "UNDER_REVIEW"
  )
  const activeAssignments = dashboardData?.assignments || []
  
  const stats = dashboardData?.stats || {
    totalRequests: 0,
    activeRequests: 0,
    completedRequests: 0,
    pendingApproval: 0,
    revenue: 0,
  }

  return {
    pendingApprovals,
    allRequests,
    activeAssignments,
    totalRequests: stats.totalRequests,
    activeRequests: stats.activeRequests,
    completedRequests: stats.completedRequests,
    pendingApproval: stats.pendingApproval,
    revenue: stats.revenue || 0,
    isLoading,
    error,
    refetch,
    approveRequest,
    rejectRequest,
    assignOperator,
  }
}
