"use client"

import * as React from "react"
import { UserRole } from "@/lib/permissions"
import { toast } from "@/components/ui/use-toast"
import { transformDashboardData } from "@/lib/utils/date-transform"
import { logger } from "@/lib/utils/logger"

// Cache busting utilities
let cacheSequence = 0
const getCacheBuster = () => {
  cacheSequence += 1
  return `${Date.now()}-${cacheSequence}`
}

// Debounce utility for cache clearing
const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Types from dashboard service
export interface DashboardStats {
  totalRequests: number
  activeRequests: number
  completedRequests: number
  pendingApproval: number
  revenue?: number
  averageJobDuration?: number
}

export interface DashboardServiceRequest {
  id: string
  title: string
  status: string
  equipmentCategory: string
  jobSite: string
  startDate: Date
  endDate: Date | null
  requestedDurationType: string
  requestedDurationValue: number
  requestedTotalHours: number | null
  estimatedCost: number | null
  createdAt: Date
  updatedAt: Date
  user?: {
    name: string | null
    email: string | null
    company: string | null
  }
  assignedOperators?: Array<{
    id: string
    name: string | null
    email: string | null
  }>
}

export interface OperatorAssignment {
  id: string
  serviceRequestId: string
  operatorId: string
  assignedAt: Date
  status: string
  serviceRequest: {
    title: string
    jobSite: string
    startDate: Date
    endDate: Date | null
    status: string
  }
}

export interface DashboardUser {
  id: string
  name: string | null
  email: string | null
  role: string
  company: string | null
  createdAt: Date
}

export interface DashboardData {
  stats: DashboardStats
  recentRequests: DashboardServiceRequest[]
  assignments?: OperatorAssignment[]
  users?: DashboardUser[]
}

export interface UseDashboardDataOptions {
  role: UserRole
  limit?: number
  offset?: number
  enableCaching?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface UseDashboardDataReturn {
  data: DashboardData | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  clearCache: () => void
}

/**
 * Custom hook for fetching role-specific dashboard data
 *
 * Provides platform-agnostic dashboard data access with mobile-ready caching.
 * Designed for cross-platform reuse including future React Native mobile apps.
 *
 * @param options - Dashboard data options including role and filters
 * @returns Dashboard data, loading state, error state, and control functions
 */
export function useDashboardData(
  options: UseDashboardDataOptions
): UseDashboardDataReturn {
  const [data, setData] = React.useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)

  // Build API endpoint based on role
  const getApiEndpoint = React.useCallback((role: UserRole): string => {
    const baseUrl = "/api/dashboard"
    switch (role) {
      case "USER":
        return `${baseUrl}/user`
      case "OPERATOR":
        return `${baseUrl}/operator`
      case "MANAGER":
        return `${baseUrl}/manager`
      case "ADMIN":
        return `${baseUrl}/admin`
      default:
        throw new Error(`Invalid user role: ${role}`)
    }
  }, [])

  // Build query parameters
  const buildQueryParams = React.useCallback(
    (opts: UseDashboardDataOptions & { cacheBuster?: string }): string => {
      const params = new URLSearchParams()

      if (opts.limit) params.set("limit", opts.limit.toString())
      if (opts.offset) params.set("offset", opts.offset.toString())
      if (opts.enableCaching !== undefined) {
        params.set("enableCaching", opts.enableCaching.toString())
      }
      if (opts.dateRange?.start) {
        params.set("startDate", opts.dateRange.start.toISOString())
      }
      if (opts.dateRange?.end) {
        params.set("endDate", opts.dateRange.end.toISOString())
      }
      if (opts.cacheBuster) {
        params.set("_t", opts.cacheBuster)
      }

      return params.toString()
    },
    []
  )

  // Fetch dashboard data
  const fetchDashboardData = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const endpoint = getApiEndpoint(options.role)
      const queryParams = buildQueryParams(options)
      const url = queryParams ? `${endpoint}?${queryParams}` : endpoint

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session auth
      })

      if (!response.ok) {
        let errorMessage = "Failed to fetch dashboard data"

        try {
          const errorData = await response.json()
          if (response.status === 401) {
            errorMessage = "Authentication required. Please log in."
          } else if (response.status === 403) {
            errorMessage = "Access denied. Insufficient permissions."
          } else if (response.status === 422) {
            errorMessage = "Invalid request parameters."
          } else if (errorData?.error) {
            errorMessage = errorData.error
          }
        } catch {
          // Use status-based fallback messages
          if (response.status === 401) {
            errorMessage = "Authentication required. Please log in."
          } else if (response.status === 403) {
            errorMessage = "Access denied. Insufficient permissions."
          } else if (response.status >= 500) {
            errorMessage = "Server error. Please try again later."
          }
        }

        setError(errorMessage)
        return
      }

      const result = await response.json()

      if (result.data) {
        // Transform date strings back to Date objects using utility function
        const transformedData: DashboardData = transformDashboardData(result)
        setData(transformedData)
      } else {
        setError("Invalid response format")
      }
    } catch (err) {
      // Network or parsing error
      setError("Network error. Please check your connection and try again.")
      logger.error("Dashboard data fetch error", {
        error: err,
        role: options.role,
      })
    } finally {
      setIsLoading(false)
    }
  }, [options, getApiEndpoint, buildQueryParams])

  // Refetch function for manual refresh
  const refetch = React.useCallback(async () => {
    await fetchDashboardData()
  }, [fetchDashboardData])

  // Internal cache clearing function
  const clearCacheInternal = React.useCallback(async () => {
    // Keep current data during refresh for better UX
    // Only clear error state
    setError(null)

    // Show user feedback
    toast({
      description: "Dashboard cache cleared. Refreshing data...",
    })

    try {
      // Call server-side cache clearing endpoint with DELETE method
      const cacheEndpoint = getApiEndpoint(options.role)
      const cacheUrl = `${cacheEndpoint}/cache`

      const cacheResponse = await fetch(cacheUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        credentials: "include",
      })

      if (!cacheResponse.ok) {
        logger.warn(
          "Cache clear request failed, proceeding with local refresh",
          { role: options.role }
        )
      }

      // Force refetch with cache-busting parameter
      const dataEndpoint = getApiEndpoint(options.role)
      const optionsWithCacheBuster = {
        ...options,
        enableCaching: false,
        cacheBuster: getCacheBuster(),
      }
      const queryParams = buildQueryParams(optionsWithCacheBuster)
      const dataUrl = queryParams
        ? `${dataEndpoint}?${queryParams}`
        : dataEndpoint

      const dataResponse = await fetch(dataUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        credentials: "include",
      })

      if (dataResponse.ok) {
        const result = await dataResponse.json()
        if (result.data) {
          // Transform date strings back to Date objects using utility function
          const transformedData: DashboardData = transformDashboardData(result)
          setData(transformedData)
        }
      } else {
        // Fallback to regular refetch if cache-busted request fails
        await refetch()
      }
    } catch (error) {
      logger.warn("Cache clear failed", { error, role: options.role })
      toast({
        title: "Cache clear failed",
        description:
          "Unable to clear server cache, but data will be refreshed.",
        variant: "destructive",
      })

      // Still attempt to refetch even if cache clear failed
      await refetch()
    }
  }, [options, getApiEndpoint, buildQueryParams, fetchDashboardData, refetch])

  // Debounced cache clearing to prevent rapid successive calls
  const clearCache = React.useMemo(
    () => debounce(clearCacheInternal, 1000), // 1 second debounce
    [clearCacheInternal]
  )

  // Initial fetch and refetch on options change
  React.useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return {
    data,
    isLoading,
    error,
    refetch,
    clearCache,
  }
}
