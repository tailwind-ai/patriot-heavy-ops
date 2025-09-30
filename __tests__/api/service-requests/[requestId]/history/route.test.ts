/**
 * Workflow History API Endpoint Tests (Issue #223)
 * Tests for GET /api/service-requests/[id]/history
 */

import { GET } from "@/app/api/service-requests/[requestId]/history/route"
import { authenticateRequest } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"

// Mock dependencies
jest.mock("@/lib/middleware/mobile-auth")
jest.mock("@/lib/services")

const mockAuthenticateRequest = authenticateRequest as jest.MockedFunction<
  typeof authenticateRequest
>

describe("GET /api/service-requests/[requestId]/history", () => {
  let mockServiceRequestService: any

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock service factory
    mockServiceRequestService = {
      getStatusHistory: jest.fn(),
    }

    ;(ServiceFactory.getServiceRequestService as jest.Mock) = jest
      .fn()
      .mockReturnValue(mockServiceRequestService)
  })

  it("should confirm endpoint exists", async () => {
    expect(typeof GET).toBe("function")
  })

  it("should require authentication", async () => {
    mockAuthenticateRequest.mockResolvedValue({
      isAuthenticated: false,
      error: "No authentication",
    })

    const mockRequest = {} as any
    const mockContext = {
      params: Promise.resolve({ requestId: "req-123" }),
    }

    const response = await GET(mockRequest, mockContext)
    expect(response.status).toBe(401)
  })

  it("should return status history for authenticated user", async () => {
    mockAuthenticateRequest.mockResolvedValue({
      isAuthenticated: true,
      user: {
        id: "user-123",
        email: "test@example.com",
        role: "USER",
      },
    })

    const mockHistory = [
      {
        id: "hist-1",
        serviceRequestId: "req-123",
        fromStatus: null,
        toStatus: "SUBMITTED",
        changedBy: "user-123",
        reason: null,
        notes: null,
        createdAt: new Date("2024-01-01"),
      },
      {
        id: "hist-2",
        serviceRequestId: "req-123",
        fromStatus: "SUBMITTED",
        toStatus: "UNDER_REVIEW",
        changedBy: "manager-123",
        reason: "Ready for review",
        notes: null,
        createdAt: new Date("2024-01-02"),
      },
    ]

    mockServiceRequestService.getStatusHistory.mockResolvedValue({
      success: true,
      data: mockHistory,
    })

    const mockRequest = {} as any
    const mockContext = {
      params: Promise.resolve({ requestId: "req-123" }),
    }

    const response = await GET(mockRequest, mockContext)
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data).toHaveLength(2)
    expect(data[0].toStatus).toBe("SUBMITTED")
    expect(data[1].toStatus).toBe("UNDER_REVIEW")
  })

  it("should return 404 for non-existent request", async () => {
    mockAuthenticateRequest.mockResolvedValue({
      isAuthenticated: true,
      user: {
        id: "user-123",
        email: "test@example.com",
        role: "USER",
      },
    })

    mockServiceRequestService.getStatusHistory.mockResolvedValue({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Service request not found",
      },
    })

    const mockRequest = {} as any
    const mockContext = {
      params: Promise.resolve({ requestId: "non-existent" }),
    }

    const response = await GET(mockRequest, mockContext)
    expect(response.status).toBe(404)
  })
})
