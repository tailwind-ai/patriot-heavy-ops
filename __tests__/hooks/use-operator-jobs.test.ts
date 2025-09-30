/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react"
import { useOperatorJobs } from "@/hooks/use-operator-jobs"
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

describe("useOperatorJobs", () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockFetch.mockReset()
    jest.clearAllMocks()
    Object.values(mockNotifications).forEach(mock => mock.mockClear())
  })

  describe("Null Safety - API Response Handling", () => {
    it("should handle null response object gracefully in acceptJob", async () => {
      // Mock dashboard data
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

      // Mock fetch to return null (simulating network failure)
      mockFetch.mockResolvedValue(null as unknown as Response)

      const { result } = renderHook(() =>
        useOperatorJobs({ notifications: mockNotifications })
      )

      await act(async () => {
        await result.current.acceptJob("job-1")
      })

      // When response is null, !response?.ok is true, enters error block with default message
      expect(mockNotifications.showError).toHaveBeenCalledWith(
        "Failed to accept job",
        "Failed to accept job"
      )
    })

    it("should handle undefined response.ok in acceptJob", async () => {
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
        useOperatorJobs({ notifications: mockNotifications })
      )

      await act(async () => {
        await result.current.acceptJob("job-1")
      })

      // Should handle missing ok property
      expect(mockNotifications.showError).toHaveBeenCalled()
    })

    it("should handle null response.json() in acceptJob", async () => {
      const mockUseDashboardData = jest.spyOn(useDashboardDataModule, "useDashboardData")
      const mockRefetch = jest.fn()
      mockUseDashboardData.mockReturnValue({
        data: {
          stats: { totalRequests: 0, activeRequests: 0, completedRequests: 0, pendingApproval: 0 },
          recentRequests: [],
          assignments: [],
        },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
        clearCache: jest.fn(),
      })

      // Mock response with json that returns null
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => null,
      } as Response)

      const { result } = renderHook(() =>
        useOperatorJobs({ notifications: mockNotifications })
      )

      await act(async () => {
        await result.current.acceptJob("job-1")
      })

      // When json returns null (doesn't throw), it falls back to default message
      expect(mockNotifications.showError).toHaveBeenCalledWith(
        "Failed to accept job",
        "Failed to accept job"
      )
    })

    it("should handle undefined errorData.error in acceptJob", async () => {
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

      // Mock error response without error field
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({}),
      } as Response)

      const { result } = renderHook(() =>
        useOperatorJobs({ notifications: mockNotifications })
      )

      await act(async () => {
        await result.current.acceptJob("job-1")
      })

      // Should use default error message
      expect(mockNotifications.showError).toHaveBeenCalledWith(
        "Failed to accept job",
        "Failed to accept job"
      )
    })

    it("should handle null response in completeJob", async () => {
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
        useOperatorJobs({ notifications: mockNotifications })
      )

      await act(async () => {
        await result.current.completeJob("assignment-1")
      })

      // When response is null, !response?.ok is true, enters error block with default message
      expect(mockNotifications.showError).toHaveBeenCalledWith(
        "Failed to complete job",
        "Failed to complete job"
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

      const { result } = renderHook(() => useOperatorJobs())

      // Should return empty array instead of crashing
      expect(result.current.availableJobs).toEqual([])
    })

    it("should handle requests with null status in filter", () => {
      const mockUseDashboardData = jest.spyOn(useDashboardDataModule, "useDashboardData")
      mockUseDashboardData.mockReturnValue({
        data: {
          stats: { totalRequests: 2, activeRequests: 1, completedRequests: 0, pendingApproval: 0 },
          recentRequests: [
            {
              id: "1",
              title: "Test",
              status: "APPROVED",
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
          ],
          assignments: [],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        clearCache: jest.fn(),
      })

      const { result } = renderHook(() => useOperatorJobs())

      // Should filter out request with null status
      expect(result.current.availableJobs).toHaveLength(1)
      expect(result.current.availableJobs[0]?.id).toBe("1")
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

      const { result } = renderHook(() => useOperatorJobs())

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

      const { result } = renderHook(() => useOperatorJobs())

      // Should use default stats
      expect(result.current.totalAssignments).toBe(0)
      expect(result.current.activeJobs).toBe(0)
      expect(result.current.completedJobs).toBe(0)
    })
  })

  describe("Successful Operations", () => {
    it("should accept job successfully", async () => {
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
        useOperatorJobs({ notifications: mockNotifications })
      )

      await act(async () => {
        await result.current.acceptJob("job-1")
      })

      expect(mockNotifications.showSuccess).toHaveBeenCalledWith(
        "Job accepted successfully. You will be notified of next steps."
      )
      expect(mockRefetch).toHaveBeenCalled()
    })

    it("should complete job successfully", async () => {
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
        useOperatorJobs({ notifications: mockNotifications })
      )

      await act(async () => {
        await result.current.completeJob("assignment-1")
      })

      expect(mockNotifications.showSuccess).toHaveBeenCalledWith(
        "Job marked as completed. Thank you for your work!"
      )
      expect(mockRefetch).toHaveBeenCalled()
    })
  })
})
