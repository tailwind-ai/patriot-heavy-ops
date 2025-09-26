/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from "@testing-library/react"
import { useDashboardData } from "@/hooks/use-dashboard-data"

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock toast
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}))

describe("useDashboardData", () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it("should fetch USER dashboard data successfully", async () => {
    const mockData = {
      data: {
        stats: {
          totalRequests: 5,
          activeRequests: 2,
          completedRequests: 3,
          pendingApproval: 1,
        },
        recentRequests: [
          {
            id: "1",
            title: "Test Request",
            status: "SUBMITTED",
            equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
            jobSite: "123 Main St",
            startDate: "2024-01-01T00:00:00.000Z",
            endDate: null,
            requestedDurationType: "FULL_DAY",
            requestedDurationValue: 1,
            requestedTotalHours: 8,
            estimatedCost: 500,
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
          },
        ],
      },
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    const { result } = renderHook(() =>
      useDashboardData({
        role: "USER",
        limit: 10,
        enableCaching: true,
      })
    )

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual({
      stats: mockData.data.stats,
      recentRequests: [
        {
          ...mockData.data.recentRequests[0],
          startDate: new Date("2024-01-01T00:00:00.000Z"),
          endDate: null,
          createdAt: new Date("2024-01-01T00:00:00.000Z"),
          updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        },
      ],
    })
    expect(result.current.error).toBe(null)
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/dashboard/user?limit=10&enableCaching=true",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
  })

  it("should fetch OPERATOR dashboard data successfully", async () => {
    const mockData = {
      data: {
        stats: {
          totalRequests: 10,
          activeRequests: 3,
          completedRequests: 7,
          pendingApproval: 0,
        },
        recentRequests: [],
        assignments: [
          {
            id: "1",
            serviceRequestId: "req-1",
            operatorId: "op-1",
            assignedAt: "2024-01-01T00:00:00.000Z",
            status: "ACTIVE",
            serviceRequest: {
              title: "Test Assignment",
              jobSite: "456 Oak Ave",
              startDate: "2024-01-02T00:00:00.000Z",
              endDate: null,
              status: "JOB_IN_PROGRESS",
            },
          },
        ],
      },
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    const { result } = renderHook(() =>
      useDashboardData({
        role: "OPERATOR",
        limit: 15,
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const expectedAssignment = mockData.data.assignments?.[0]
    expect(expectedAssignment).toBeDefined()
    expect(expectedAssignment?.serviceRequest).toBeDefined()
    
    expect(result.current.data).toEqual({
      stats: mockData.data.stats,
      recentRequests: [],
      assignments: [
        {
          ...expectedAssignment!,
          assignedAt: new Date("2024-01-01T00:00:00.000Z"),
          serviceRequest: {
            ...expectedAssignment!.serviceRequest,
            startDate: new Date("2024-01-02T00:00:00.000Z"),
            endDate: null,
          },
        },
      ],
    })
    expect(mockFetch).toHaveBeenCalledWith("/api/dashboard/operator?limit=15", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
  })

  it("should handle authentication error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "Authentication required" }),
    })

    const { result } = renderHook(() =>
      useDashboardData({
        role: "USER",
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe("Authentication required. Please log in.")
  })

  it("should handle authorization error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: "Access denied" }),
    })

    const { result } = renderHook(() =>
      useDashboardData({
        role: "ADMIN",
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(
      "Access denied. Insufficient permissions."
    )
  })

  it("should handle network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"))

    const { result } = renderHook(() =>
      useDashboardData({
        role: "USER",
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(
      "Network error. Please check your connection and try again."
    )
  })

  it("should build correct query parameters", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { stats: {}, recentRequests: [] } }),
    })

    const startDate = new Date("2024-01-01")
    const endDate = new Date("2024-01-31")

    const { result } = renderHook(() =>
      useDashboardData({
        role: "MANAGER",
        limit: 20,
        offset: 10,
        enableCaching: false,
        dateRange: { start: startDate, end: endDate },
      })
    )

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/dashboard/manager?limit=20&offset=10&enableCaching=false&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        expect.any(Object)
      )
    })
  })

  it("should handle refetch", async () => {
    const mockData = {
      data: {
        stats: {
          totalRequests: 1,
          activeRequests: 0,
          completedRequests: 1,
          pendingApproval: 0,
        },
        recentRequests: [],
      },
    }

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    })

    const { result } = renderHook(() =>
      useDashboardData({
        role: "USER",
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)

    // Trigger refetch
    await result.current.refetch()

    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it("should throw error for invalid role", () => {
    expect(() => {
      renderHook(() =>
        useDashboardData({
          role: "INVALID_ROLE" as any,
        })
      )
    }).toThrow("Invalid user role: INVALID_ROLE")
  })
})
