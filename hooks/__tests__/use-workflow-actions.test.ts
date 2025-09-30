/**
 * Tests for useWorkflowActions hook
 * 
 * Platform Mode: Test-driven development for workflow action operations
 */

import { renderHook, waitFor, act } from "@testing-library/react"
import { useWorkflowActions } from "../use-workflow-actions"

// Mock fetch globally
global.fetch = jest.fn()

describe("useWorkflowActions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("Hook initialization", () => {
    it("should initialize with correct default state", () => {
      const { result } = renderHook(() =>
        useWorkflowActions({
          requestId: "test-request-123",
        })
      )

      expect(result.current.isChangingStatus).toBe(false)
      expect(result.current.error).toBeNull()
      expect(typeof result.current.changeStatus).toBe("function")
    })

    it("should accept optional notifications callback", () => {
      const mockNotifications = {
        showSuccess: jest.fn(),
        showError: jest.fn(),
        showNotification: jest.fn(),
        showWarning: jest.fn(),
      }

      const { result } = renderHook(() =>
        useWorkflowActions({
          requestId: "test-request-123",
          notifications: mockNotifications,
        })
      )

      expect(typeof result.current.changeStatus).toBe("function")
    })

    it("should accept optional onSuccess callback", () => {
      const onSuccess = jest.fn()

      const { result } = renderHook(() =>
        useWorkflowActions({
          requestId: "test-request-123",
          onSuccess,
        })
      )

      expect(typeof result.current.changeStatus).toBe("function")
    })
  })

  describe("Change status operation", () => {
    it("should change status successfully", async () => {
      const mockUpdatedRequest = {
        id: "test-request-123",
        status: "UNDER_REVIEW",
        title: "Test Request",
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdatedRequest,
      })

      const { result } = renderHook(() =>
        useWorkflowActions({
          requestId: "test-request-123",
        })
      )

      let changeResult
      await act(async () => {
        changeResult = await result.current.changeStatus({
          newStatus: "UNDER_REVIEW",
          reason: "Starting review",
        })
      })

      expect(changeResult).toBe(true)
      expect(result.current.isChangingStatus).toBe(false)
      expect(result.current.error).toBeNull()
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/service-requests/test-request-123/status",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            newStatus: "UNDER_REVIEW",
            reason: "Starting review",
          }),
        })
      )
    })

    it("should include optional notes in request", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "test-request-123", status: "APPROVED" }),
      })

      const { result } = renderHook(() =>
        useWorkflowActions({
          requestId: "test-request-123",
        })
      )

      await act(async () => {
        await result.current.changeStatus({
          newStatus: "APPROVED",
          reason: "Meets all requirements",
          notes: "Internal note: Fast-track this",
        })
      })

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/service-requests/test-request-123/status",
        expect.objectContaining({
          body: JSON.stringify({
            newStatus: "APPROVED",
            reason: "Meets all requirements",
            notes: "Internal note: Fast-track this",
          }),
        })
      )
    })

    it("should call onSuccess callback on successful change", async () => {
      const onSuccess = jest.fn()
      const mockUpdatedRequest = {
        id: "test-request-123",
        status: "APPROVED",
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdatedRequest,
      })

      const { result } = renderHook(() =>
        useWorkflowActions({
          requestId: "test-request-123",
          onSuccess,
        })
      )

      await act(async () => {
        await result.current.changeStatus({
          newStatus: "APPROVED",
        })
      })

      expect(onSuccess).toHaveBeenCalledWith(mockUpdatedRequest)
    })

    it("should show success notification on successful change", async () => {
      const mockNotifications = {
        showSuccess: jest.fn(),
        showError: jest.fn(),
        showNotification: jest.fn(),
        showWarning: jest.fn(),
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "test-request-123", status: "APPROVED" }),
      })

      const { result } = renderHook(() =>
        useWorkflowActions({
          requestId: "test-request-123",
          notifications: mockNotifications,
        })
      )

      await act(async () => {
        await result.current.changeStatus({
          newStatus: "APPROVED",
        })
      })

      expect(mockNotifications.showSuccess).toHaveBeenCalledWith(
        "Status changed successfully"
      )
    })
  })

  describe("Error handling", () => {
    it("should handle network errors", async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      )

      const { result } = renderHook(() =>
        useWorkflowActions({
          requestId: "test-request-123",
        })
      )

      let changeResult
      await act(async () => {
        changeResult = await result.current.changeStatus({
          newStatus: "APPROVED",
        })
      })

      expect(changeResult).toBe(false)
      expect(result.current.error).toBe(
        "Unable to change status. Please check your connection."
      )
    })

    it("should handle 404 not found errors", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: "Request not found" }),
      })

      const { result } = renderHook(() =>
        useWorkflowActions({
          requestId: "nonexistent-123",
        })
      )

      let changeResult
      await act(async () => {
        changeResult = await result.current.changeStatus({
          newStatus: "APPROVED",
        })
      })

      expect(changeResult).toBe(false)
      expect(result.current.error).toBe("Service request not found")
    })

    it("should handle 401 authentication errors", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: "Unauthorized" }),
      })

      const { result } = renderHook(() =>
        useWorkflowActions({
          requestId: "test-request-123",
        })
      )

      let changeResult
      await act(async () => {
        changeResult = await result.current.changeStatus({
          newStatus: "APPROVED",
        })
      })

      expect(changeResult).toBe(false)
      expect(result.current.error).toBe(
        "Authentication required. Please log in."
      )
    })

    it("should handle 403 permission errors", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: "Insufficient permissions" }),
      })

      const { result } = renderHook(() =>
        useWorkflowActions({
          requestId: "test-request-123",
        })
      )

      let changeResult
      await act(async () => {
        changeResult = await result.current.changeStatus({
          newStatus: "APPROVED",
        })
      })

      expect(changeResult).toBe(false)
      expect(result.current.error).toBe(
        "You don't have permission to change this status"
      )
    })

    it("should handle 400 invalid transition errors", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "Invalid status transition" }),
      })

      const { result } = renderHook(() =>
        useWorkflowActions({
          requestId: "test-request-123",
        })
      )

      let changeResult
      await act(async () => {
        changeResult = await result.current.changeStatus({
          newStatus: "CLOSED",
        })
      })

      expect(changeResult).toBe(false)
      expect(result.current.error).toBe("Invalid status transition")
    })

    it("should handle 500 server errors", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Internal server error" }),
      })

      const { result } = renderHook(() =>
        useWorkflowActions({
          requestId: "test-request-123",
        })
      )

      let changeResult
      await act(async () => {
        changeResult = await result.current.changeStatus({
          newStatus: "APPROVED",
        })
      })

      expect(changeResult).toBe(false)
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

      const { result } = renderHook(() =>
        useWorkflowActions({
          requestId: "test-request-123",
          notifications: mockNotifications,
        })
      )

      await act(async () => {
        await result.current.changeStatus({
          newStatus: "APPROVED",
        })
      })

      expect(mockNotifications.showError).toHaveBeenCalledWith(
        "Unable to change status. Please check your connection.",
        "Status change failed"
      )
    })
  })

  describe("Loading state", () => {
    it("should set isChangingStatus to true during operation", async () => {
      let resolvePromise: (value: unknown) => void
      const mockPromise = new Promise((resolve) => {
        resolvePromise = resolve
      })

      ;(global.fetch as jest.Mock).mockReturnValueOnce(mockPromise)

      const { result } = renderHook(() =>
        useWorkflowActions({
          requestId: "test-request-123",
        })
      )

      act(() => {
        result.current.changeStatus({
          newStatus: "APPROVED",
        })
      })

      // Should be loading
      expect(result.current.isChangingStatus).toBe(true)

      // Resolve the promise
      await act(async () => {
        resolvePromise({
          ok: true,
          json: async () => ({ id: "test-request-123", status: "APPROVED" }),
        })
        await mockPromise
      })

      // Should no longer be loading
      expect(result.current.isChangingStatus).toBe(false)
    })
  })

  describe("Error state management", () => {
    it("should clear previous error on new operation", async () => {
      // First operation fails
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      )

      const { result } = renderHook(() =>
        useWorkflowActions({
          requestId: "test-request-123",
        })
      )

      await act(async () => {
        await result.current.changeStatus({
          newStatus: "APPROVED",
        })
      })

      expect(result.current.error).not.toBeNull()

      // Second operation succeeds
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "test-request-123", status: "APPROVED" }),
      })

      await act(async () => {
        await result.current.changeStatus({
          newStatus: "APPROVED",
        })
      })

      expect(result.current.error).toBeNull()
    })
  })
})
