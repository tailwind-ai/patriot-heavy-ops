/**
 * Tests for useWorkflowTransitions hook
 * 
 * Platform Mode: Test-driven development for workflow transition logic
 */

import { renderHook, waitFor } from "@testing-library/react"
import type { ServiceRequestStatus } from "@prisma/client"
import { useWorkflowTransitions } from "../use-workflow-transitions"

// Mock fetch globally
global.fetch = jest.fn()

describe("useWorkflowTransitions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("Hook initialization", () => {
    it("should initialize with correct default state", () => {
      const { result } = renderHook(() =>
        useWorkflowTransitions({
          requestId: "test-request-123",
          currentStatus: "SUBMITTED",
          userRole: "USER",
        })
      )

      expect(result.current.transitions).toEqual([])
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
        useWorkflowTransitions({
          requestId: "test-request-123",
          currentStatus: "SUBMITTED",
          userRole: "USER",
          notifications: mockNotifications,
        })
      )

      expect(result.current.transitions).toEqual([])
    })
  })

  describe("Fetching available transitions", () => {
    it("should fetch available transitions for USER role", async () => {
      const mockTransitions = [
        {
          fromStatus: "SUBMITTED",
          toStatus: "CANCELLED",
          isValid: true,
          hasPermission: true,
          reason: "User can cancel their own request",
        },
      ]

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ transitions: mockTransitions }),
      })

      const { result } = renderHook(() =>
        useWorkflowTransitions({
          requestId: "test-request-123",
          currentStatus: "SUBMITTED",
          userRole: "USER",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.transitions).toEqual(mockTransitions)
      expect(result.current.error).toBeNull()
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/service-requests/test-request-123/transitions?status=SUBMITTED",
        expect.objectContaining({
          method: "GET",
          credentials: "include",
        })
      )
    })

    it("should fetch available transitions for MANAGER role", async () => {
      const mockTransitions = [
        {
          fromStatus: "SUBMITTED",
          toStatus: "UNDER_REVIEW",
          isValid: true,
          hasPermission: true,
          reason: "Manager can review submitted requests",
        },
        {
          fromStatus: "SUBMITTED",
          toStatus: "APPROVED",
          isValid: true,
          hasPermission: true,
          reason: "Manager can approve requests",
        },
        {
          fromStatus: "SUBMITTED",
          toStatus: "REJECTED",
          isValid: true,
          hasPermission: true,
          reason: "Manager can reject requests",
        },
      ]

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ transitions: mockTransitions }),
      })

      const { result } = renderHook(() =>
        useWorkflowTransitions({
          requestId: "test-request-123",
          currentStatus: "SUBMITTED",
          userRole: "MANAGER",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.transitions).toHaveLength(3)
      expect(result.current.error).toBeNull()
    })

    it("should filter transitions based on hasPermission", async () => {
      const mockTransitions = [
        {
          fromStatus: "SUBMITTED",
          toStatus: "UNDER_REVIEW",
          isValid: true,
          hasPermission: true,
          reason: "Allowed",
        },
        {
          fromStatus: "SUBMITTED",
          toStatus: "APPROVED",
          isValid: true,
          hasPermission: false,
          reason: "Not allowed for this role",
        },
      ]

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ transitions: mockTransitions }),
      })

      const { result } = renderHook(() =>
        useWorkflowTransitions({
          requestId: "test-request-123",
          currentStatus: "SUBMITTED",
          userRole: "USER",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Hook should include all transitions, components decide filtering
      expect(result.current.transitions).toHaveLength(2)
    })
  })

  describe("Error handling", () => {
    it("should handle network errors gracefully", async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      )

      const { result } = renderHook(() =>
        useWorkflowTransitions({
          requestId: "test-request-123",
          currentStatus: "SUBMITTED",
          userRole: "USER",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.transitions).toEqual([])
      expect(result.current.error).toBe(
        "Unable to load available actions. Please check your connection."
      )
    })

    it("should handle 404 not found errors", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: "Request not found" }),
      })

      const { result } = renderHook(() =>
        useWorkflowTransitions({
          requestId: "nonexistent-123",
          currentStatus: "SUBMITTED",
          userRole: "USER",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.transitions).toEqual([])
      expect(result.current.error).toBe("Service request not found")
    })

    it("should handle 401 authentication errors", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: "Unauthorized" }),
      })

      const { result } = renderHook(() =>
        useWorkflowTransitions({
          requestId: "test-request-123",
          currentStatus: "SUBMITTED",
          userRole: "USER",
        })
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBe(
        "Authentication required. Please log in."
      )
    })

    it("should handle 500 server errors", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Internal server error" }),
      })

      const { result } = renderHook(() =>
        useWorkflowTransitions({
          requestId: "test-request-123",
          currentStatus: "SUBMITTED",
          userRole: "USER",
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
        useWorkflowTransitions({
          requestId: "test-request-123",
          currentStatus: "SUBMITTED",
          userRole: "USER",
          notifications: mockNotifications,
        })
      )

      await waitFor(() => {
        expect(mockNotifications.showError).toHaveBeenCalledWith(
          "Unable to load available actions. Please check your connection.",
          "Failed to load actions"
        )
      })
    })
  })

  describe("Refetch functionality", () => {
    it("should provide refetch function", () => {
      const { result } = renderHook(() =>
        useWorkflowTransitions({
          requestId: "test-request-123",
          currentStatus: "SUBMITTED",
          userRole: "USER",
        })
      )

      expect(typeof result.current.refetch).toBe("function")
    })

    it("should refetch transitions when refetch is called", async () => {
      const mockTransitions = [
        {
          fromStatus: "SUBMITTED",
          toStatus: "CANCELLED",
          isValid: true,
          hasPermission: true,
          reason: "Can cancel",
        },
      ]

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ transitions: mockTransitions }),
      })

      const { result } = renderHook(() =>
        useWorkflowTransitions({
          requestId: "test-request-123",
          currentStatus: "SUBMITTED",
          userRole: "USER",
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

  describe("Status change reactivity", () => {
    it("should refetch when currentStatus changes", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ transitions: [] }),
      })

      type HookProps = {
        requestId: string
        currentStatus: ServiceRequestStatus
        userRole: "USER" | "OPERATOR" | "MANAGER" | "ADMIN"
      }

      const { rerender } = renderHook(
        (props: HookProps) => useWorkflowTransitions(props),
        {
          initialProps: {
            requestId: "test-request-123",
            currentStatus: "SUBMITTED" as ServiceRequestStatus,
            userRole: "USER" as const,
          },
        }
      )

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1)
      })

      // Change status
      rerender({
        requestId: "test-request-123",
        currentStatus: "UNDER_REVIEW" as ServiceRequestStatus,
        userRole: "USER" as const,
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2)
      })

      expect(global.fetch).toHaveBeenLastCalledWith(
        "/api/service-requests/test-request-123/transitions?status=UNDER_REVIEW",
        expect.any(Object)
      )
    })
  })
})
