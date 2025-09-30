/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react"
import { useManagerQueue } from "@/hooks/use-manager-queue"
import * as useDashboardDataModule from "@/hooks/use-dashboard-data"

// Mock the useDashboardData hook
jest.mock("@/hooks/use-dashboard-data")

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

// Mock notifications
const mockNotifications = {
  showNotification: jest.fn(),
  showSuccess: jest.fn(),
  showError: jest.fn(),
  showWarning: jest.fn(),
}

describe("useManagerQueue", () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockFetch.mockReset()
    jest.clearAllMocks()
    Object.values(mockNotifications).forEach(mock => mock.mockClear())
  })

  describe("Null Safety - API Response Handling", () => {
    it("should handle null response object gracefully in approveRequest", async () => {
      const mockUseDashboardData = jest.spyOn(useDashboardDataModule, "useDashboardData")
      mockUseDashboardData.mockReturnValue({
        data: {
          stats: { totalRequests: 0, activeRequests: 0, completedRequests: 0, pendingApproval: 0 },
          recentRequests: [],
          assignments: [],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        clearCache: jest.fn(),
      })

      // Mock fetch to return null
      mockFetch.mockResolvedValue(null as unknown as Response)

      const { result } = renderHook(() =>
        useManagerQueue({ notifications: mockNotifications })
      )

      await act(async () => {
        await result.current.approveRequest("request-1")
      })

      // When response is null, !response?.ok is true, enters error block with default message
      expect(mockNotifications.showError).toHaveBeenCalledWith(
        "Failed to approve request",
        "Failed to approve request"
      )
    })

    it("should handle undefined response.ok in approveRequest", async () => {
      const mockUseDashboardData = jest.spyOn(useDashboardDataModule, "useDashboardData")
      mockUseDashboardData.mockReturnValue({
        data: {
          stats: { totalRequests: 0, activeRequests: 0, completedRequests: 0, pendingApproval: 0 },
          recentRequests: [],
          assignments: [],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        clearCache: jest.fn(),
      })

      // Mock response without ok property
      mockFetch.mockResolvedValue({
        status: 500,
        json: async () => ({}),
      } as Response)

      const { result } = renderHook(() =>
        useManagerQueue({ notifications: mockNotifications })
      )

      await act(async () => {
        await result.current.approveRequest("request-1")
      })

      expect(mockNotifications.showError).toHaveBeenCalled()
    })

    it("should handle null errorData in approveRequest", async () => {
      const mockUseDashboardData = jest.spyOn(useDashboardDataModule, "useDashboardData")
      mockUseDashboardData.mockReturnValue({
        data: {
          stats: { totalRequests: 0, activeRequests: 0, completedRequests: 0, pendingApproval: 0 },
          recentRequests: [],
          assignments: [],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        clearCache: jest.fn(),
      })

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => null,
      } as Response)

      const { result } = renderHook(() =>
        useManagerQueue({ notifications: mockNotifications })
      )

      await act(async () => {
        await result.current.approveRequest("request-1")
      })

      // When json returns null (doesn't throw), it falls back to default message
      expect(mockNotifications.showError).toHaveBeenCalledWith(
        "Failed to approve request",
        "Failed to approve request"
      )
    })

    it("should handle null response in rejectRequest", async () => {
      const mockUseDashboardData = jest.spyOn(useDashboardDataModule, "useDashboardData")
      mockUseDashboardData.mockReturnValue({
        data: {
          stats: { totalRequests: 0, activeRequests: 0, completedRequests: 0, pendingApproval: 0 },
          recentRequests: [],
          assignments: [],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        clearCache: jest.fn(),
      })

      mockFetch.mockResolvedValue(null as unknown as Response)

      const { result } = renderHook(() =>
        useManagerQueue({ notifications: mockNotifications })
      )

      await act(async () => {
        await result.current.rejectRequest("request-1", "Test reason")
      })

      // When response is null, !response?.ok is true, enters error block with default message
      expect(mockNotifications.showError).toHaveBeenCalledWith(
        "Failed to reject request",
        "Failed to reject request"
      )
    })

    it("should handle undefined errorData.error in rejectRequest", async () => {
      const mockUseDashboardData = jest.spyOn(useDashboardDataModule, "useDashboardData")
      mockUseDashboardData.mockReturnValue({
        data: {
          stats: { totalRequests: 0, activeRequests: 0, completedRequests: 0, pendingApproval: 0 },
          recentRequests: [],
          assignments: [],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        clearCache: jest.fn(),
      })

      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({}),
      } as Response)

      const { result } = renderHook(() =>
        useManagerQueue({ notifications: mockNotifications })
      )

      await act(async () => {
        await result.current.rejectRequest("request-1")
      })

      expect(mockNotifications.showError).toHaveBeenCalledWith(
        "Failed to reject request",
        "Failed to reject request"
      )
    })

    it("should handle null response in assignOperator", async () => {
      const mockUseDashboardData = jest.spyOn(useDashboardDataModule, "useDashboardData")
      mockUseDashboardData.mockReturnValue({
        data: {
          stats: { totalRequests: 0, activeRequests: 0, completedRequests: 0, pendingApproval: 0 },
          recentRequests: [],
          assignments: [],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        clearCache: jest.fn(),
      })

      mockFetch.mockResolvedValue(null as unknown as Response)

      const { result } = renderHook(() =>
        useManagerQueue({ notifications: mockNotifications })
      )

      await act(async () => {
        await result.current.assignOperator("request-1", "operator-1")
      })

      // When response is null, !response?.ok is true, enters error block with default message
      expect(mockNotifications.showError).toHaveBeenCalledWith(
        "Failed to assign operator",
        "Failed to assign operator"
      )
    })
  })

  describe("Null Safety - Data Filtering", () => {
    it("should handle null dashboardData.recentRequests", () => {
      const mockUseDashboardData = jest.spyOn(useDashboardDataModule, "useDashboardData")
      mockUseDashboardData.mockReturnValue({
        data: {
          stats: { totalRequests: 0, activeRequests: 0, completedRequests: 0, pendingApproval: 0 },
          recentRequests: null as unknown as [],
          assignments: [],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        clearCache: jest.fn(),
      })

      const { result } = renderHook(() => useManagerQueue())

      // Should return empty array instead of crashing
      expect(result.current.allRequests).toEqual([])
      expect(result.current.pendingApprovals).toEqual([])
    })

    it("should handle requests with null status in filter", () => {
      const mockUseDashboardData = jest.spyOn(useDashboardDataModule, "useDashboardData")
      mockUseDashboardData.mockReturnValue({
        data: {
          stats: { totalRequests: 3, activeRequests: 1, completedRequests: 0, pendingApproval: 2 },
          recentRequests: [
            {
              id: "1",
              title: "Test",
              status: "SUBMITTED",
              equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
              jobSite: "Site 1",
              startDate: new Date(),
              endDate: null,
              requestedDurationType: "FULL_DAY",
              requestedDurationValue: 1,
              requestedTotalHours: 8,
              estimatedCost: 500,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: "2",
              title: "Test 2",
              status: null as unknown as string,
              equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
              jobSite: "Site 2",
              startDate: new Date(),
              endDate: null,
              requestedDurationType: "FULL_DAY",
              requestedDurationValue: 1,
              requestedTotalHours: 8,
              estimatedCost: 500,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: "3",
              title: "Test 3",
              status: "UNDER_REVIEW",
              equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
              jobSite: "Site 3",
              startDate: new Date(),
              endDate: null,
              requestedDurationType: "FULL_DAY",
              requestedDurationValue: 1,
              requestedTotalHours: 8,
              estimatedCost: 500,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          assignments: [],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        clearCache: jest.fn(),
      })

      const { result } = renderHook(() => useManagerQueue())

      // Should filter out request with null status
      expect(result.current.pendingApprovals).toHaveLength(2)
      expect(result.current.pendingApprovals[0]?.id).toBe("1")
      expect(result.current.pendingApprovals[1]?.id).toBe("3")
    })

    it("should handle null dashboardData.assignments", () => {
      const mockUseDashboardData = jest.spyOn(useDashboardDataModule, "useDashboardData")
      mockUseDashboardData.mockReturnValue({
        data: {
          stats: { totalRequests: 0, activeRequests: 0, completedRequests: 0, pendingApproval: 0 },
          recentRequests: [],
          assignments: null as unknown as [],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        clearCache: jest.fn(),
      })

      const { result } = renderHook(() => useManagerQueue())

      // Should return empty array instead of crashing
      expect(result.current.activeAssignments).toEqual([])
    })

    it("should handle null dashboardData.stats", () => {
      const mockUseDashboardData = jest.spyOn(useDashboardDataModule, "useDashboardData")
      mockUseDashboardData.mockReturnValue({
        data: {
          stats: null as any,
          recentRequests: [],
          assignments: [],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        clearCache: jest.fn(),
      })

      const { result } = renderHook(() => useManagerQueue())

      // Should use default stats
      expect(result.current.totalRequests).toBe(0)
      expect(result.current.activeRequests).toBe(0)
      expect(result.current.completedRequests).toBe(0)
      expect(result.current.pendingApproval).toBe(0)
      expect(result.current.revenue).toBe(0)
    })

    it("should handle null stats.revenue", () => {
      const mockUseDashboardData = jest.spyOn(useDashboardDataModule, "useDashboardData")
      mockUseDashboardData.mockReturnValue({
        data: {
          stats: {
            totalRequests: 5,
            activeRequests: 2,
            completedRequests: 3,
            pendingApproval: 1,
            revenue: null as unknown as number,
          },
          recentRequests: [],
          assignments: [],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        clearCache: jest.fn(),
      })

      const { result } = renderHook(() => useManagerQueue())

      // Should default to 0 if revenue is null
      expect(result.current.revenue).toBe(0)
    })
  })

  describe("Successful Operations", () => {
    it("should approve request successfully", async () => {
      const mockUseDashboardData = jest.spyOn(useDashboardDataModule, "useDashboardData")
      const mockRefetch = jest.fn()
      mockUseDashboardData.mockReturnValue({
        data: {
          stats: { totalRequests: 1, activeRequests: 0, completedRequests: 0, pendingApproval: 1 },
          recentRequests: [],
          assignments: [],
        },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
        clearCache: jest.fn(),
      })

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      } as Response)

      const { result } = renderHook(() =>
        useManagerQueue({ notifications: mockNotifications })
      )

      await act(async () => {
        await result.current.approveRequest("request-1")
      })

      expect(mockNotifications.showSuccess).toHaveBeenCalledWith(
        "Service request approved successfully."
      )
      expect(mockRefetch).toHaveBeenCalled()
    })

    it("should reject request successfully", async () => {
      const mockUseDashboardData = jest.spyOn(useDashboardDataModule, "useDashboardData")
      const mockRefetch = jest.fn()
      mockUseDashboardData.mockReturnValue({
        data: {
          stats: { totalRequests: 1, activeRequests: 0, completedRequests: 0, pendingApproval: 1 },
          recentRequests: [],
          assignments: [],
        },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
        clearCache: jest.fn(),
      })

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      } as Response)

      const { result } = renderHook(() =>
        useManagerQueue({ notifications: mockNotifications })
      )

      await act(async () => {
        await result.current.rejectRequest("request-1", "Not qualified")
      })

      expect(mockNotifications.showSuccess).toHaveBeenCalledWith(
        "Service request rejected."
      )
      expect(mockRefetch).toHaveBeenCalled()
    })

    it("should assign operator successfully", async () => {
      const mockUseDashboardData = jest.spyOn(useDashboardDataModule, "useDashboardData")
      const mockRefetch = jest.fn()
      mockUseDashboardData.mockReturnValue({
        data: {
          stats: { totalRequests: 1, activeRequests: 1, completedRequests: 0, pendingApproval: 0 },
          recentRequests: [],
          assignments: [],
        },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
        clearCache: jest.fn(),
      })

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      } as Response)

      const { result } = renderHook(() =>
        useManagerQueue({ notifications: mockNotifications })
      )

      await act(async () => {
        await result.current.assignOperator("request-1", "operator-1")
      })

      expect(mockNotifications.showSuccess).toHaveBeenCalledWith(
        "Operator assigned successfully."
      )
      expect(mockRefetch).toHaveBeenCalled()
    })
  })
})
