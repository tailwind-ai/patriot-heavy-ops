/**
 * Workflow Transitions API Endpoint Tests (Issue #223)
 * Tests for GET /api/workflow/transitions
 */

import { GET } from "@/app/api/workflow/transitions/route"
import { authenticateRequest } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"

// Mock dependencies
jest.mock("@/lib/middleware/mobile-auth")
jest.mock("@/lib/services")

const mockAuthenticateRequest = authenticateRequest as jest.MockedFunction<
  typeof authenticateRequest
>

describe("GET /api/workflow/transitions", () => {
  let mockServiceRequestService: any

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock service factory
    mockServiceRequestService = {
      getValidNextStatuses: jest.fn(),
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

    const mockRequest = {
      nextUrl: { searchParams: new URLSearchParams("currentStatus=SUBMITTED") },
    } as any

    const response = await GET(mockRequest)
    expect(response.status).toBe(401)
  })

  it("should require currentStatus query parameter", async () => {
    mockAuthenticateRequest.mockResolvedValue({
      isAuthenticated: true,
      user: {
        id: "user-123",
        email: "test@example.com",
        role: "MANAGER",
      },
    })

    const mockRequest = {
      nextUrl: { searchParams: new URLSearchParams() }, // No currentStatus
    } as any

    const response = await GET(mockRequest)
    expect(response.status).toBe(400)
  })

  it("should return valid transitions for MANAGER role", async () => {
    mockAuthenticateRequest.mockResolvedValue({
      isAuthenticated: true,
      user: {
        id: "manager-123",
        email: "manager@example.com",
        role: "MANAGER",
      },
    })

    mockServiceRequestService.getValidNextStatuses.mockReturnValue({
      success: true,
      data: ["UNDER_REVIEW", "CANCELLED"],
    })

    const mockRequest = {
      nextUrl: { searchParams: new URLSearchParams("currentStatus=SUBMITTED") },
    } as any

    const response = await GET(mockRequest)
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.currentStatus).toBe("SUBMITTED")
    expect(data.role).toBe("MANAGER")
    expect(data.validTransitions).toContain("UNDER_REVIEW")
    expect(data.validTransitions).toContain("CANCELLED")
  })

  it("should return limited transitions for USER role", async () => {
    mockAuthenticateRequest.mockResolvedValue({
      isAuthenticated: true,
      user: {
        id: "user-123",
        email: "user@example.com",
        role: "USER",
      },
    })

    mockServiceRequestService.getValidNextStatuses.mockReturnValue({
      success: true,
      data: ["SUBMITTED"], // Users can only submit
    })

    const mockRequest = {
      nextUrl: { searchParams: new URLSearchParams("currentStatus=SUBMITTED") },
    } as any

    const response = await GET(mockRequest)
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.role).toBe("USER")
    expect(data.validTransitions).toHaveLength(1)
  })

  it("should return extensive transitions for ADMIN role", async () => {
    mockAuthenticateRequest.mockResolvedValue({
      isAuthenticated: true,
      user: {
        id: "admin-123",
        email: "admin@example.com",
        role: "ADMIN",
      },
    })

    mockServiceRequestService.getValidNextStatuses.mockReturnValue({
      success: true,
      data: ["UNDER_REVIEW", "APPROVED", "REJECTED", "CANCELLED"], // Admin can do more
    })

    const mockRequest: any = {
      nextUrl: { searchParams: new URLSearchParams("currentStatus=SUBMITTED") },
    }

    const response = await GET(mockRequest)
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.role).toBe("ADMIN")
    expect(data.validTransitions.length).toBeGreaterThan(1)
  })
})
