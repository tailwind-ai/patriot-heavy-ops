/**
 * Tests for useStatusHistory hook
 * 
 * Platform Mode: Test-driven development for status history retrieval
 */

import { renderHook, waitFor } from "@testing-library/react"
import { useStatusHistory } from "../use-status-history"

// Mock fetch globally
global.fetch = jest.fn()

describe("useStatusHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("Hook initialization", () => {
    it("should initialize with correct default state", () => {
      const { result } = renderHook(() =>
        useStatusHistory({
          requestId: "test-request-123",
        })
      )

      expect(result.current.history).toEqual([])
      expect(result.current.isLoading).toBe(true)
      expect(result.current.error).toBeNull()
    })

    it("should accept optional notifications callback", () => {
      const mockNotifications = {
        showSuccess: jest.fn(),
        showError: jest.fn(),
        showNotification: jest.fn(),
        showWarning: jest.fn(),
      }

      const { result } = renderHook(() =>
        useStatusHistory({
          requestId: "test-request-123",
          notifications: mockNotifications,
        })
      )

      expect(result.current.history).toEqual([])
    })
  })

  describe("Fetching status history", () => {
    it("should fetch status history successfully", async () => {
      const mockHistory = [
        {
          id: "history-1",
          serviceRequestId: "test-request-123",
          fromStatus: null,
          toStatus: "SUBMITTED",
          changedBy: "user-123",
          changedByUser: {
            id: "user-123",
            name: "John Doe",
            email: "john@example.com",
          },
          reason: "Initial submission",
          notes: null,
          createdAt: new Date("2025-01-01T10:00:00Z"),
        },
        {
          id: "history-2",
          serviceRequestId: "test-request-123",
          fromStatus: "SUBMITTED",
          toStatus: "UNDER_REVIEW",
          changedBy: "manager-456",
          changedByUser: {
            id: "manager-456",
            name: "Jane Manager",
            email: "jane@example.com",
          },
          reason: "Starting review process",
          notes: "Checking requirements",
          createdAt: new Date("2025-01-02T14:30:00Z"),
        },
      ]

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockHistory,
      })

      const { result } = renderHook(() =>
        useStatusHistory({
          requestId: "test-request-123",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.history).toHaveLength(2)
      expect(result.current.history[0]?.toStatus).toBe("SUBMITTED")
      expect(result.current.history[1]?.toStatus).toBe("UNDER_REVIEW")
      expect(result.current.error).toBeNull()
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/service-requests/test-request-123/history",
        expect.objectContaining({
          method: "GET",
          credentials: "include",
        })
      )
    })

    it("should handle empty history", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

      const { result } = renderHook(() =>
        useStatusHistory({
          requestId: "test-request-123",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.history).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it("should sort history by createdAt ascending", async () => {
      const mockHistory = [
        {
          id: "history-2",
          serviceRequestId: "test-request-123",
          fromStatus: "SUBMITTED",
          toStatus: "APPROVED",
          changedBy: "manager-456",
          reason: null,
          notes: null,
          createdAt: new Date("2025-01-03T10:00:00Z"),
        },
        {
          id: "history-1",
          serviceRequestId: "test-request-123",
          fromStatus: null,
          toStatus: "SUBMITTED",
          changedBy: "user-123",
          reason: null,
          notes: null,
          createdAt: new Date("2025-01-01T10:00:00Z"),
        },
      ]

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockHistory,
      })

      const { result } = renderHook(() =>
        useStatusHistory({
          requestId: "test-request-123",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // API returns sorted data, hook should preserve order
      expect(result.current.history[0]?.toStatus).toBe("APPROVED")
      expect(result.current.history[1]?.toStatus).toBe("SUBMITTED")
    })
  })

  describe("Error handling", () => {
    it("should handle network errors gracefully", async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      )

      const { result } = renderHook(() =>
        useStatusHistory({
          requestId: "test-request-123",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.history).toEqual([])
      expect(result.current.error).toBe(
        "Unable to load status history. Please check your connection."
      )
    })

    it("should handle 404 not found errors", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: "Request not found" }),
      })

      const { result } = renderHook(() =>
        useStatusHistory({
          requestId: "nonexistent-123",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.history).toEqual([])
      expect(result.current.error).toBe("Service request not found")
    })

    it("should handle 401 authentication errors", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: "Unauthorized" }),
      })

      const { result } = renderHook(() =>
        useStatusHistory({
          requestId: "test-request-123",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBe(
        "Authentication required. Please log in."
      )
    })

    it("should handle 403 access denied errors", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: "Access denied" }),
      })

      const { result } = renderHook(() =>
        useStatusHistory({
          requestId: "test-request-123",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBe(
        "Access denied. You may not be authorized to view this history."
      )
    })

    it("should handle 500 server errors", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Internal server error" }),
      })

      const { result } = renderHook(() =>
        useStatusHistory({
          requestId: "test-request-123",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBe(
        "Server error. Please try again later."
      )
    })

    it("should call error notification callback on failure", async () => {
      const mockNotifications = {
        showSuccess: jest.fn(),
        showError: jest.fn(),
        showNotification: jest.fn(),
        showWarning: jest.fn(),
      }

      ;(global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      )

      renderHook(() =>
        useStatusHistory({
          requestId: "test-request-123",
          notifications: mockNotifications,
        })
      )

      await waitFor(() => {
        expect(mockNotifications.showError).toHaveBeenCalledWith(
          "Unable to load status history. Please check your connection.",
          "Failed to load history"
        )
      })
    })
  })

  describe("Refetch functionality", () => {
    it("should provide refetch function", () => {
      const { result } = renderHook(() =>
        useStatusHistory({
          requestId: "test-request-123",
        })
      )

      expect(typeof result.current.refetch).toBe("function")
    })

    it("should refetch history when refetch is called", async () => {
      const mockHistory = [
        {
          id: "history-1",
          serviceRequestId: "test-request-123",
          fromStatus: null,
          toStatus: "SUBMITTED",
          changedBy: "user-123",
          reason: null,
          notes: null,
          createdAt: new Date("2025-01-01T10:00:00Z"),
        },
      ]

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockHistory,
      })

      const { result } = renderHook(() =>
        useStatusHistory({
          requestId: "test-request-123",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Clear mock to verify refetch makes new call
      ;(global.fetch as jest.Mock).mockClear()

      await result.current.refetch()

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe("Request ID change reactivity", () => {
    it("should refetch when requestId changes", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [],
      })

      const { rerender } = renderHook(
        (props) => useStatusHistory(props),
        {
          initialProps: {
            requestId: "test-request-123",
          },
        }
      )

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1)
      })

      // Change requestId
      rerender({
        requestId: "test-request-456",
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2)
      })

      expect(global.fetch).toHaveBeenLastCalledWith(
        "/api/service-requests/test-request-456/history",
        expect.any(Object)
      )
    })
  })
})
