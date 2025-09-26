"use client"

import * as React from "react"
import { useDashboardData, type DashboardServiceRequest } from "./use-dashboard-data"
import { logger } from "@/lib/utils/logger"
import { toast } from "@/components/ui/use-toast"

export interface UseServiceRequestsOptions {
  limit?: number
  offset?: number
  enableCaching?: boolean
}

export interface UseServiceRequestsReturn {
  serviceRequests: DashboardServiceRequest[]
  totalRequests: number
  activeRequests: number
  completedRequests: number
  pendingApproval: number
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  createServiceRequest: () => void
}

/**
 * Custom hook for USER role service request management
 * 
 * Provides service request data and actions for regular users.
 * Abstracts dashboard data access and provides user-specific functionality.
 * 
 * @param options - Service request options
 * @returns Service request data, stats, and control functions
 */
export function useServiceRequests(options: UseServiceRequestsOptions = {}): UseServiceRequestsReturn {
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useDashboardData({
    role: "USER",
    limit: options.limit || 10,
    offset: options.offset || 0,
    enableCaching: options.enableCaching !== false, // Default to true
  })

  // Navigate to service request creation
  const createServiceRequest = React.useCallback(() => {
    // Platform-agnostic navigation - should be handled by parent component
    // 
    // Example usage in Next.js:
    // const router = useRouter()
    // const handleCreateRequest = () => router.push('/dashboard/requests/new')
    // <UserDashboard onNavigateToCreateRequest={handleCreateRequest} />
    //
    // Example usage in React Native:
    // const navigation = useNavigation()
    // const handleCreateRequest = () => navigation.navigate('CreateRequest')
    // <UserDashboard onNavigateToCreateRequest={handleCreateRequest} />
    //
    // See components/dashboard/README.md for complete implementation guide
    logger.devWarn(
      "createServiceRequest called - navigation should be handled by parent component",
      {
        guidance: "Pass onNavigateToCreateRequest prop to UserDashboard component",
        documentation: "See components/dashboard/README.md for implementation examples",
        component: "useServiceRequests",
      }
    )
  }, [])

  // Extract service request data and stats
  const serviceRequests = dashboardData?.recentRequests || []
  const stats = dashboardData?.stats || {
    totalRequests: 0,
    activeRequests: 0,
    completedRequests: 0,
    pendingApproval: 0,
  }

  return {
    serviceRequests,
    totalRequests: stats.totalRequests,
    activeRequests: stats.activeRequests,
    completedRequests: stats.completedRequests,
    pendingApproval: stats.pendingApproval,
    isLoading,
    error,
    refetch,
    createServiceRequest,
  }
}
