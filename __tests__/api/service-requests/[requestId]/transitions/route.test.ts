/**
 * Service Request Transitions API Tests (Issue #356)
 * Tests GET /api/service-requests/[requestId]/transitions
 */

import { NextRequest } from "next/server"
import { GET } from "@/app/api/service-requests/[requestId]/transitions/route"

// Mock the middleware
jest.mock("@/lib/middleware/mobile-auth")
// Mock the service factory
jest.mock("@/lib/services")

import { authenticateRequest } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"

describe("GET /api/service-requests/[requestId]/transitions", () => {
  const mockAuthenticateRequest = authenticateRequest as jest.MockedFunction<
    typeof authenticateRequest
  >
  const mockServiceFactory = ServiceFactory as jest.Mocked<
    typeof ServiceFactory
  >

  const mockServiceRequestService = {
    getServiceRequestById: jest.fn(),
    getValidNextStatuses: jest.fn(),
    validateTransitionWithPermissions: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockServiceFactory.getServiceRequestService = jest
      .fn()
      .mockReturnValue(mockServiceRequestService)
  })

  const createMockRequest = (
    url: string,
    headers: Record<string, string> = {}
  ) => {
    return {
      nextUrl: new URL(url),
      headers: new Map(Object.entries(headers)),
    } as unknown as NextRequest
  }

  const createMockContext = (requestId: string) => ({
    params: Promise.resolve({ requestId }),
  })

  describe("Authentication", () => {
    it("returns 401 when user is not authenticated", async () => {
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: false,
      } as any)

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=SUBMITTED"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Authentication required")
    })

    it("returns 401 when user object is missing", async () => {
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
      } as any)

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=SUBMITTED"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Authentication required")
    })

    it("accepts authenticated user with valid session", async () => {
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: { id: "user1", email: "test@example.com", role: "MANAGER" },
      })

      mockServiceRequestService.getServiceRequestById.mockResolvedValue({
        success: true,
        data: { id: "req123", status: "SUBMITTED" },
      })

      mockServiceRequestService.getValidNextStatuses.mockReturnValue({
        success: true,
        data: ["UNDER_REVIEW", "CANCELLED"],
      })

      mockServiceRequestService.validateTransitionWithPermissions.mockReturnValue(
        {
          success: true,
          data: { toStatus: "UNDER_REVIEW", hasPermission: true },
        }
      )

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=SUBMITTED"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)

      expect(response.status).toBe(200)
    })
  })

  describe("Request Validation", () => {
    beforeEach(() => {
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: { id: "user1", email: "test@example.com", role: "USER" },
      })
    })

    it("returns 400 when status query parameter is missing", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("status query parameter is required")
    })

    it("accepts valid status query parameter", async () => {
      mockServiceRequestService.getServiceRequestById.mockResolvedValue({
        success: true,
        data: { id: "req123", status: "SUBMITTED" },
      })

      mockServiceRequestService.getValidNextStatuses.mockReturnValue({
        success: true,
        data: ["UNDER_REVIEW"],
      })

      mockServiceRequestService.validateTransitionWithPermissions.mockReturnValue(
        {
          success: true,
          data: { toStatus: "UNDER_REVIEW", hasPermission: false },
        }
      )

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=SUBMITTED"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)

      expect(response.status).toBe(200)
      expect(
        mockServiceRequestService.getValidNextStatuses
      ).toHaveBeenCalledWith("SUBMITTED")
    })
  })

  describe("Access Control", () => {
    beforeEach(() => {
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: { id: "user1", email: "test@example.com", role: "USER" },
      })
    })

    it("returns 404 when service request not found", async () => {
      mockServiceRequestService.getServiceRequestById.mockResolvedValue({
        success: false,
        error: { code: "NOT_FOUND", message: "Service request not found" },
      })

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/nonexistent/transitions?status=SUBMITTED"
      )
      const context = createMockContext("nonexistent")

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Service request not found")
    })

    it("returns 403 when user lacks access to service request", async () => {
      mockServiceRequestService.getServiceRequestById.mockResolvedValue({
        success: false,
        error: { code: "ACCESS_DENIED", message: "Access denied" },
      })

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=SUBMITTED"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe("Access denied")
    })

    it("verifies user ownership before returning transitions", async () => {
      mockServiceRequestService.getServiceRequestById.mockResolvedValue({
        success: true,
        data: { id: "req123", userId: "user1", status: "SUBMITTED" },
      })

      mockServiceRequestService.getValidNextStatuses.mockReturnValue({
        success: true,
        data: ["UNDER_REVIEW"],
      })

      mockServiceRequestService.validateTransitionWithPermissions.mockReturnValue(
        {
          success: true,
          data: { toStatus: "UNDER_REVIEW", hasPermission: false },
        }
      )

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=SUBMITTED"
      )
      const context = createMockContext("req123")

      await GET(request, context)

      expect(
        mockServiceRequestService.getServiceRequestById
      ).toHaveBeenCalledWith({
        requestId: "req123",
        userId: "user1",
        userRole: "USER",
      })
    })
  })

  describe("State Machine Validation", () => {
    beforeEach(() => {
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: { id: "manager1", email: "manager@example.com", role: "MANAGER" },
      })

      mockServiceRequestService.getServiceRequestById.mockResolvedValue({
        success: true,
        data: { id: "req123", status: "SUBMITTED" },
      })
    })

    it("returns valid transitions from SUBMITTED status", async () => {
      mockServiceRequestService.getValidNextStatuses.mockReturnValue({
        success: true,
        data: ["UNDER_REVIEW", "CANCELLED"],
      })

      mockServiceRequestService.validateTransitionWithPermissions
        .mockReturnValueOnce({
          success: true,
          data: {
            toStatus: "UNDER_REVIEW",
            hasPermission: true,
            isValid: true,
          },
        })
        .mockReturnValueOnce({
          success: true,
          data: { toStatus: "CANCELLED", hasPermission: true, isValid: true },
        })

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=SUBMITTED"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.transitions).toHaveLength(2)
      expect(data.transitions).toContainEqual({
        toStatus: "UNDER_REVIEW",
        hasPermission: true,
        isValid: true,
      })
      expect(data.transitions).toContainEqual({
        toStatus: "CANCELLED",
        hasPermission: true,
        isValid: true,
      })
    })

    it("returns valid transitions from UNDER_REVIEW status", async () => {
      mockServiceRequestService.getValidNextStatuses.mockReturnValue({
        success: true,
        data: ["APPROVED", "REJECTED", "CANCELLED"],
      })

      mockServiceRequestService.validateTransitionWithPermissions
        .mockReturnValueOnce({
          success: true,
          data: { toStatus: "APPROVED", hasPermission: true, isValid: true },
        })
        .mockReturnValueOnce({
          success: true,
          data: { toStatus: "REJECTED", hasPermission: true, isValid: true },
        })
        .mockReturnValueOnce({
          success: true,
          data: { toStatus: "CANCELLED", hasPermission: true, isValid: true },
        })

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=UNDER_REVIEW"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.transitions).toHaveLength(3)
    })

    it("returns empty array for terminal status CLOSED", async () => {
      mockServiceRequestService.getValidNextStatuses.mockReturnValue({
        success: true,
        data: [],
      })

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=CLOSED"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.transitions).toHaveLength(0)
    })

    it("returns empty array for terminal status CANCELLED", async () => {
      mockServiceRequestService.getValidNextStatuses.mockReturnValue({
        success: true,
        data: [],
      })

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=CANCELLED"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.transitions).toHaveLength(0)
    })

    it("handles failure to get valid transitions", async () => {
      mockServiceRequestService.getValidNextStatuses.mockReturnValue({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid status" },
      })

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=INVALID_STATUS"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("Failed to get valid transitions")
    })
  })

  describe("Role-Based Permissions", () => {
    beforeEach(() => {
      mockServiceRequestService.getServiceRequestById.mockResolvedValue({
        success: true,
        data: { id: "req123", status: "SUBMITTED" },
      })

      mockServiceRequestService.getValidNextStatuses.mockReturnValue({
        success: true,
        data: ["UNDER_REVIEW", "CANCELLED"],
      })
    })

    it("filters transitions based on ADMIN role permissions", async () => {
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: { id: "admin1", email: "admin@example.com", role: "ADMIN" },
      })

      mockServiceRequestService.validateTransitionWithPermissions
        .mockReturnValueOnce({
          success: true,
          data: {
            toStatus: "UNDER_REVIEW",
            hasPermission: true,
            isValid: true,
          },
        })
        .mockReturnValueOnce({
          success: true,
          data: { toStatus: "CANCELLED", hasPermission: true, isValid: true },
        })

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=SUBMITTED"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.transitions).toHaveLength(2)
      expect(
        mockServiceRequestService.validateTransitionWithPermissions
      ).toHaveBeenCalledWith("SUBMITTED", "UNDER_REVIEW", "ADMIN")
    })

    it("filters transitions based on MANAGER role permissions", async () => {
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: { id: "manager1", email: "manager@example.com", role: "MANAGER" },
      })

      mockServiceRequestService.validateTransitionWithPermissions
        .mockReturnValueOnce({
          success: true,
          data: {
            toStatus: "UNDER_REVIEW",
            hasPermission: true,
            isValid: true,
          },
        })
        .mockReturnValueOnce({
          success: true,
          data: { toStatus: "CANCELLED", hasPermission: false, isValid: true },
        })

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=SUBMITTED"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(200)
      // Should include all transitions returned by service (both with and without permission)
      expect(data.transitions).toHaveLength(2)
      expect(data.transitions[0].toStatus).toBe("UNDER_REVIEW")
      expect(data.transitions[0].hasPermission).toBe(true)
      expect(data.transitions[1].toStatus).toBe("CANCELLED")
      expect(data.transitions[1].hasPermission).toBe(false)
    })

    it("filters transitions based on OPERATOR role permissions", async () => {
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: {
          id: "operator1",
          email: "operator@example.com",
          role: "OPERATOR",
        },
      })

      mockServiceRequestService.getValidNextStatuses.mockReturnValue({
        success: true,
        data: ["JOB_COMPLETED"],
      })

      mockServiceRequestService.validateTransitionWithPermissions.mockReturnValueOnce(
        {
          success: true,
          data: {
            toStatus: "JOB_COMPLETED",
            hasPermission: true,
            isValid: true,
          },
        }
      )

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=JOB_IN_PROGRESS"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.transitions).toHaveLength(1)
      expect(
        mockServiceRequestService.validateTransitionWithPermissions
      ).toHaveBeenCalledWith("JOB_IN_PROGRESS", "JOB_COMPLETED", "OPERATOR")
    })

    it("returns transitions with hasPermission false for USER role", async () => {
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: { id: "user1", email: "user@example.com", role: "USER" },
      })

      mockServiceRequestService.validateTransitionWithPermissions
        .mockReturnValueOnce({
          success: true,
          data: {
            toStatus: "UNDER_REVIEW",
            hasPermission: false,
            isValid: true,
          },
        })
        .mockReturnValueOnce({
          success: true,
          data: { toStatus: "CANCELLED", hasPermission: false, isValid: true },
        })

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=SUBMITTED"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(200)
      // USER role gets transitions with hasPermission: false (UI will disable buttons)
      expect(data.transitions).toHaveLength(2)
      expect(data.transitions[0].hasPermission).toBe(false)
      expect(data.transitions[1].hasPermission).toBe(false)
    })

    it("uses authenticated user role, not query parameter", async () => {
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: { id: "user1", email: "user@example.com", role: "USER" },
      })

      mockServiceRequestService.validateTransitionWithPermissions.mockReturnValue(
        {
          success: true,
          data: {
            toStatus: "UNDER_REVIEW",
            hasPermission: false,
            isValid: true,
          },
        }
      )

      // Try to pass ADMIN in query param - should be ignored
      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=SUBMITTED&role=ADMIN"
      )
      const context = createMockContext("req123")

      await GET(request, context)

      // Should use USER role from authenticated user, not ADMIN from query
      expect(
        mockServiceRequestService.validateTransitionWithPermissions
      ).toHaveBeenCalledWith("SUBMITTED", expect.any(String), "USER")
    })

    it("defaults to USER role when user.role is null", async () => {
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: { id: "user1", email: "user@example.com" },
      })

      mockServiceRequestService.validateTransitionWithPermissions.mockReturnValue(
        {
          success: true,
          data: {
            toStatus: "UNDER_REVIEW",
            hasPermission: false,
            isValid: true,
          },
        }
      )

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=SUBMITTED"
      )
      const context = createMockContext("req123")

      await GET(request, context)

      expect(
        mockServiceRequestService.getServiceRequestById
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          userRole: "USER",
        })
      )
    })
  })

  describe("Error Handling", () => {
    beforeEach(() => {
      mockAuthenticateRequest.mockResolvedValue({
        isAuthenticated: true,
        user: { id: "user1", email: "test@example.com", role: "MANAGER" },
      })
    })

    it("returns 500 on unexpected error", async () => {
      mockServiceRequestService.getServiceRequestById.mockRejectedValue(
        new Error("Database error")
      )

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=SUBMITTED"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("Internal server error")
    })

    it("returns 500 when service access verification fails without specific error code", async () => {
      mockServiceRequestService.getServiceRequestById.mockResolvedValue({
        success: false,
        error: { code: "UNKNOWN_ERROR", message: "Something went wrong" },
      })

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=SUBMITTED"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("Failed to verify access")
    })

    it("handles permission validation failure gracefully", async () => {
      mockServiceRequestService.getServiceRequestById.mockResolvedValue({
        success: true,
        data: { id: "req123", status: "SUBMITTED" },
      })

      mockServiceRequestService.getValidNextStatuses.mockReturnValue({
        success: true,
        data: ["UNDER_REVIEW"],
      })

      // Permission check fails
      mockServiceRequestService.validateTransitionWithPermissions.mockReturnValue(
        {
          success: false,
          error: { code: "PERMISSION_ERROR", message: "Permission denied" },
        }
      )

      const request = createMockRequest(
        "http://localhost:3000/api/service-requests/req123/transitions?status=SUBMITTED"
      )
      const context = createMockContext("req123")

      const response = await GET(request, context)
      const data = await response.json()

      // Should return empty transitions array, not error
      expect(response.status).toBe(200)
      expect(data.transitions).toHaveLength(0)
    })
  })
})
