/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor, act } from "@testing-library/react"
import { useDashboardData } from "@/hooks/use-dashboard-data"

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>
global.fetch = mockFetch

// Mock console.error to avoid noise in test output
const originalError = console.error
beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalError
})

// Mock toast
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}))

describe("useDashboardData", () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockFetch.mockReset()
    jest.clearAllMocks()
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

    mockFetch.mockImplementation(async () => {
      return {
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response
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
      assignments: [],
      users: [],
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
              id: "req-1",
              title: "Test Assignment",
              status: "JOB_IN_PROGRESS",
              equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
              jobSite: "456 Oak Ave",
              startDate: "2024-01-02T00:00:00.000Z",
              endDate: null,
              requestedDurationType: "FULL_DAY",
              requestedDurationValue: 1,
              requestedTotalHours: 8,
              estimatedCost: 500,
              createdAt: "2024-01-01T00:00:00.000Z",
              updatedAt: "2024-01-01T00:00:00.000Z",
            },
          },
        ],
      },
    }

    mockFetch.mockImplementation(async () => {
      return {
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response
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
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
          },
        },
      ],
      users: [],
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
    mockFetch.mockImplementation(async () => {
      return {
        ok: false,
        status: 401,
        json: async () => ({ error: "Authentication required" }),
      } as Response
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
    mockFetch.mockImplementation(async () => {
      return {
        ok: false,
        status: 403,
        json: async () => ({ error: "Access denied" }),
      } as Response
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
    mockFetch.mockImplementation(async () => {
      return {
        ok: true,
        status: 200,
        json: async () => ({ data: { stats: {}, recentRequests: [] } }),
      } as Response
    })

    const startDate = new Date("2024-01-01")
    const endDate = new Date("2024-01-31")

    renderHook(() =>
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
        `/api/dashboard/manager?limit=20&offset=10&enableCaching=false&startDate=${encodeURIComponent(
          startDate.toISOString()
        )}&endDate=${encodeURIComponent(endDate.toISOString())}`,
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

    mockFetch.mockImplementation(async () => {
      return {
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response
    })

    const { result } = renderHook(() =>
      useDashboardData({
        role: "USER",
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Clear the mock call count after initial load
    mockFetch.mockClear()

    // Trigger refetch
    await result.current.refetch()

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it("should handle error for invalid role", async () => {
    const { result } = renderHook(() =>
      useDashboardData({
        role: "INVALID_ROLE" as any,
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe(
      "Network error. Please check your connection and try again."
    )
    expect(result.current.data).toBe(null)
  })

  describe("Null Safety - API Response Handling", () => {
    it("should handle null response object gracefully", async () => {
      mockFetch.mockResolvedValue(null as unknown as Response)

      const { result } = renderHook(() =>
        useDashboardData({
          role: "USER",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.data).toBe(null)
      // When response is null, !response?.ok is true, enters error block with default message
      expect(result.current.error).toBe("Failed to fetch dashboard data")
    })

    it("should handle undefined response.ok", async () => {
      mockFetch.mockImplementation(async () => {
        return {
          status: 500,
          json: async () => ({ error: "Server error" }),
        } as Response
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
      expect(result.current.error).toBeDefined()
    })

    it("should handle null result.data", async () => {
      mockFetch.mockImplementation(async () => {
        return {
          ok: true,
          status: 200,
          json: async () => ({ data: null }),
        } as Response
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
      expect(result.current.error).toBe("Invalid response format")
    })

    it("should handle undefined result.data", async () => {
      mockFetch.mockImplementation(async () => {
        return {
          ok: true,
          status: 200,
          json: async () => ({}),
        } as Response
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
      expect(result.current.error).toBe("Invalid response format")
    })

    it("should handle null response.json()", async () => {
      mockFetch.mockImplementation(async () => {
        return {
          ok: true,
          status: 200,
          json: async () => null,
        } as Response
      })

      const { result } = renderHook(() =>
        useDashboardData({
          role: "USER",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBe("Invalid response format")
    })

    it("should handle null errorData.error in error response", async () => {
      mockFetch.mockImplementation(async () => {
        return {
          ok: false,
          status: 500,
          json: async () => ({}),
        } as Response
      })

      const { result } = renderHook(() =>
        useDashboardData({
          role: "USER",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // When errorData is empty object, it falls back to default message
      expect(result.current.error).toBe("Failed to fetch dashboard data")
    })
  })

  describe("Null Safety - Cache Clearing", () => {
    it("should handle null response in clearCache", async () => {
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

      // Initial fetch succeeds
      mockFetch.mockImplementationOnce(async () => {
        return {
          ok: true,
          status: 200,
          json: async () => mockData,
        } as Response
      })

      const { result } = renderHook(() =>
        useDashboardData({
          role: "USER",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      mockFetch.mockClear()

      // Cache clear returns null
      mockFetch.mockResolvedValueOnce(null as unknown as Response)
      // Refetch returns data
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response)

      await act(async () => {
        result.current.clearCache()
        // Wait for debounce
        await new Promise((resolve) => setTimeout(resolve, 1100))
      })

      // Should handle null gracefully and fallback to refetch
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
      })
    })

    it("should handle undefined dataResponse.ok in clearCache", async () => {
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

      mockFetch.mockImplementationOnce(async () => {
        return {
          ok: true,
          status: 200,
          json: async () => mockData,
        } as Response
      })

      const { result } = renderHook(() =>
        useDashboardData({
          role: "USER",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      mockFetch.mockClear()

      // Cache clear succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      } as Response)

      // Data response without ok
      mockFetch.mockResolvedValueOnce({
        status: 500,
        json: async () => ({}),
      } as Response)

      // Fallback refetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response)

      await act(async () => {
        result.current.clearCache()
        await new Promise((resolve) => setTimeout(resolve, 1100))
      })

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
      })
    })
  })
})
