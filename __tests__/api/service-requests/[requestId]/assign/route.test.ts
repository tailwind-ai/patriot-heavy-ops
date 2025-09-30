/**
 * Operator Assignment API Endpoint Tests (Issue #223)
 * Tests for POST /api/service-requests/[id]/assign
 */

import { POST } from "@/app/api/service-requests/[requestId]/assign/route"
import { authenticateRequest } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"

// Mock dependencies
jest.mock("@/lib/middleware/mobile-auth")
jest.mock("@/lib/services")

const mockAuthenticateRequest = authenticateRequest as jest.MockedFunction<
  typeof authenticateRequest
>

describe("POST /api/service-requests/[requestId]/assign", () => {
  let mockServiceRequestService: any

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock service factory
    mockServiceRequestService = {
      assignOperator: jest.fn(),
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
      json: jest.fn().mockResolvedValue({ operatorId: "op-123" }),
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
        id: "manager-123",
        email: "manager@example.com",
        role: "MANAGER",
      },
    })

    const mockRequest = {
      json: jest.fn().mockResolvedValue({ operatorId: "" }), // Invalid
    } as any

    const mockContext = {
      params: Promise.resolve({ requestId: "req-123" }),
    }

    const response = await POST(mockRequest, mockContext)
    expect(response.status).toBe(422)
  })

  it("should assign operator successfully as MANAGER", async () => {
    mockAuthenticateRequest.mockResolvedValue({
      isAuthenticated: true,
      user: {
        id: "manager-123",
        email: "manager@example.com",
        role: "MANAGER",
      },
    })

    mockServiceRequestService.assignOperator.mockResolvedValue({
      success: true,
      data: {
        id: "assignment-123",
        status: "pending",
      },
    })

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        operatorId: "op-123",
        rate: 75.5,
        estimatedHours: 40,
      }),
    } as any

    const mockContext = {
      params: Promise.resolve({ requestId: "req-123" }),
    }

    const response = await POST(mockRequest, mockContext)
    expect(response.status).toBe(201)

    const data = await response.json()
    expect(data.id).toBe("assignment-123")
    expect(data.status).toBe("pending")
  })

  it("should reject non-MANAGER/ADMIN users", async () => {
    mockAuthenticateRequest.mockResolvedValue({
      isAuthenticated: true,
      user: {
        id: "user-123",
        email: "user@example.com",
        role: "USER",
      },
    })

    mockServiceRequestService.assignOperator.mockResolvedValue({
      success: false,
      error: {
        code: "INSUFFICIENT_PERMISSIONS",
        message: "Role USER does not have permission to assign operators",
      },
    })

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        operatorId: "op-123",
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

    mockServiceRequestService.assignOperator.mockResolvedValue({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Service request not found",
      },
    })

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        operatorId: "op-123",
      }),
    } as any

    const mockContext = {
      params: Promise.resolve({ requestId: "non-existent" }),
    }

    const response = await POST(mockRequest, mockContext)
    expect(response.status).toBe(404)
  })
})
