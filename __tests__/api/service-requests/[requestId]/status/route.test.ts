/**
 * Workflow Status API Endpoint Tests (Issue #223)
 * Tests for POST /api/service-requests/[id]/status
 */

import { POST } from "@/app/api/service-requests/[requestId]/status/route"
import { authenticateRequest } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"

// Mock dependencies
jest.mock("@/lib/middleware/mobile-auth")
jest.mock("@/lib/services")

const mockAuthenticateRequest = authenticateRequest as jest.MockedFunction<
  typeof authenticateRequest
>

describe("POST /api/service-requests/[requestId]/status", () => {
  let mockServiceRequestService: any

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock service factory
    mockServiceRequestService = {
      changeStatus: jest.fn(),
    }

    ;(ServiceFactory.getServiceRequestService as jest.Mock) = jest
      .fn()
      .mockReturnValue(mockServiceRequestService)
  })

  it("should confirm endpoint exists", async () => {
    expect(typeof POST).toBe("function")
  })

  it("should require authentication", async () => {
    mockAuthenticateRequest.mockResolvedValue({
      isAuthenticated: false,
      error: "No authentication",
    })

    const mockRequest = {
      json: jest.fn().mockResolvedValue({ newStatus: "UNDER_REVIEW" }),
    } as any

    const mockContext = {
      params: Promise.resolve({ requestId: "req-123" }),
    }

    const response = await POST(mockRequest, mockContext)
    expect(response.status).toBe(401)
  })

  it("should validate request body", async () => {
    mockAuthenticateRequest.mockResolvedValue({
      isAuthenticated: true,
      user: {
        id: "user-123",
        email: "test@example.com",
        role: "MANAGER",
      },
    })

    const mockRequest = {
      json: jest.fn().mockResolvedValue({ newStatus: "" }), // Invalid empty status
    } as any

    const mockContext = {
      params: Promise.resolve({ requestId: "req-123" }),
    }

    const response = await POST(mockRequest, mockContext)
    expect(response.status).toBe(422)
  })

  it("should change status successfully with MANAGER role", async () => {
    mockAuthenticateRequest.mockResolvedValue({
      isAuthenticated: true,
      user: {
        id: "manager-123",
        email: "manager@example.com",
        role: "MANAGER",
      },
    })

    mockServiceRequestService.changeStatus.mockResolvedValue({
      success: true,
      data: {
        id: "req-123",
        status: "UNDER_REVIEW",
        title: "Test Request",
      },
    })

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        newStatus: "UNDER_REVIEW",
        reason: "Ready for review",
      }),
    } as any

    const mockContext = {
      params: Promise.resolve({ requestId: "req-123" }),
    }

    const response = await POST(mockRequest, mockContext)
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.status).toBe("UNDER_REVIEW")
  })

  it("should return 403 for insufficient permissions", async () => {
    mockAuthenticateRequest.mockResolvedValue({
      isAuthenticated: true,
      user: {
        id: "user-123",
        email: "user@example.com",
        role: "USER",
      },
    })

    mockServiceRequestService.changeStatus.mockResolvedValue({
      success: false,
      error: {
        code: "INSUFFICIENT_PERMISSIONS",
        message: "User does not have permission",
      },
    })

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        newStatus: "APPROVED",
      }),
    } as any

    const mockContext = {
      params: Promise.resolve({ requestId: "req-123" }),
    }

    const response = await POST(mockRequest, mockContext)
    expect(response.status).toBe(403)
  })

  it("should return 404 for non-existent request", async () => {
    mockAuthenticateRequest.mockResolvedValue({
      isAuthenticated: true,
      user: {
        id: "manager-123",
        email: "manager@example.com",
        role: "MANAGER",
      },
    })

    mockServiceRequestService.changeStatus.mockResolvedValue({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Service request not found",
      },
    })

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        newStatus: "UNDER_REVIEW",
      }),
    } as any

    const mockContext = {
      params: Promise.resolve({ requestId: "non-existent" }),
    }

    const response = await POST(mockRequest, mockContext)
    expect(response.status).toBe(404)
  })
})
