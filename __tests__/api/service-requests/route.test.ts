import { NextRequest } from "next/server"
import { GET, POST } from "@/app/api/service-requests/route"
import {
  createMockRequest,
  getResponseJson,
  assertResponse,
  TEST_USERS,
} from "@/__tests__/helpers/api-test-helpers"
import {
  VALID_SERVICE_REQUEST_DATA,
  INVALID_SERVICE_REQUEST_DATA,
  MOCK_SERVICE_REQUEST,
} from "@/__tests__/helpers/mock-data"
import { getCurrentUserWithRole } from "@/lib/session"
import { authenticateRequest } from "@/lib/middleware/mobile-auth"

// Mock dependencies
jest.mock("@/lib/session")
jest.mock("@/lib/middleware/mobile-auth")
jest.mock("@/lib/db", () => ({
  db: {
    serviceRequest: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}))

import { db } from "@/lib/db"

// Use any type for Prisma mocks to avoid complex type issues
const mockDb = db as any
const mockGetCurrentUserWithRole =
  getCurrentUserWithRole as jest.MockedFunction<typeof getCurrentUserWithRole>
const mockAuthenticateRequest = 
  authenticateRequest as jest.MockedFunction<typeof authenticateRequest>

describe("/api/service-requests", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock mobile auth to return unauthenticated by default (fallback to session)
    mockAuthenticateRequest.mockResolvedValue({
      isAuthenticated: false,
      error: 'No valid authentication found'
    })
  })

  describe("GET /api/service-requests", () => {
    describe("Authentication", () => {
      it("should return 401 when no session exists", async () => {
        mockGetCurrentUserWithRole.mockResolvedValue(null)

        const req = createMockRequest('GET', 'http://localhost/api/service-requests')
        const response = await GET(req)

        assertResponse(response, 401)
      })

      it("should authenticate with JWT Bearer token", async () => {
        const user = { ...TEST_USERS.USER }
        
        // Mock JWT authentication success
        mockAuthenticateRequest.mockResolvedValue({
          isAuthenticated: true,
          user: {
            id: user.id,
            email: user.email,
            role: user.role
          },
          authMethod: 'jwt'
        })

        const mockRequests = [{ ...MOCK_SERVICE_REQUEST, userId: user.id }]
        mockDb.serviceRequest.findMany.mockResolvedValue(mockRequests)

        const req = createMockRequest('GET', 'http://localhost/api/service-requests', undefined, {
          authorization: 'Bearer valid.jwt.token'
        })
        const response = await GET(req)

        assertResponse(response, 200)
        expect(mockAuthenticateRequest).toHaveBeenCalledWith(req)
      })

      it("should fallback to session auth when JWT fails", async () => {
        const user = { ...TEST_USERS.USER }
        
        // Mock JWT auth failure, session auth success
        mockAuthenticateRequest.mockResolvedValue({
          isAuthenticated: false,
          error: 'Invalid token'
        })
        mockGetCurrentUserWithRole.mockResolvedValue(user)

        const mockRequests = [{ ...MOCK_SERVICE_REQUEST, userId: user.id }]
        mockDb.serviceRequest.findMany.mockResolvedValue(mockRequests)

        const req = createMockRequest('GET', 'http://localhost/api/service-requests', undefined, {
          authorization: 'Bearer invalid.token'
        })
        const response = await GET(req)

        assertResponse(response, 200)
        expect(mockAuthenticateRequest).toHaveBeenCalledWith(req)
        expect(mockGetCurrentUserWithRole).toHaveBeenCalled()
      })
    })

    describe("Role-based Access Control", () => {
      it("should return own requests for USER role", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetCurrentUserWithRole.mockResolvedValue(user)

        const mockRequests = [{ ...MOCK_SERVICE_REQUEST, userId: user.id }]
        mockDb.serviceRequest.findMany.mockResolvedValue(mockRequests)

        const req = createMockRequest('GET', 'http://localhost/api/service-requests')
        const response = await GET(req)

        assertResponse(response, 200)

        const data = await getResponseJson(response)
        expect(data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: mockRequests[0]!.id,
              title: mockRequests[0]!.title,
              userId: mockRequests[0]!.userId,
            }),
          ])
        )

        // Verify query filters for USER role
        expect(mockDb.serviceRequest.findMany).toHaveBeenCalledWith({
          select: expect.objectContaining({
            id: true,
            title: true,
            status: true,
          }),
          where: {
            userId: user.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        })
      })

      it("should return own + assigned requests for OPERATOR role", async () => {
        const user = { ...TEST_USERS.OPERATOR }
        mockGetCurrentUserWithRole.mockResolvedValue(user)

        const mockRequests = [{ ...MOCK_SERVICE_REQUEST, userId: user.id }]
        mockDb.serviceRequest.findMany.mockResolvedValue(mockRequests)

        const req = createMockRequest('GET', 'http://localhost/api/service-requests')
        const response = await GET(req)

        assertResponse(response, 200)

        // Verify query includes OR condition for operators
        expect(mockDb.serviceRequest.findMany).toHaveBeenCalledWith({
          select: expect.objectContaining({
            id: true,
            title: true,
            status: true,
          }),
          where: {
            OR: [
              { userId: user.id },
              {
                userAssignments: {
                  some: {
                    operatorId: user.id,
                  },
                },
              },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
        })
      })

      it("should return all requests for MANAGER role", async () => {
        const user = { ...TEST_USERS.MANAGER }
        mockGetCurrentUserWithRole.mockResolvedValue(user)

        const mockRequests = [MOCK_SERVICE_REQUEST]
        mockDb.serviceRequest.findMany.mockResolvedValue(mockRequests)

        const req = createMockRequest('GET', 'http://localhost/api/service-requests')
        const response = await GET(req)

        assertResponse(response, 200)

        // Verify no where clause for managers (can see all)
        expect(mockDb.serviceRequest.findMany).toHaveBeenCalledWith({
          select: expect.objectContaining({
            id: true,
            title: true,
            status: true,
            user: {
              select: {
                name: true,
                email: true,
                company: true,
              },
            },
          }),
          orderBy: {
            createdAt: "desc",
          },
        })
      })

      it("should return all requests for ADMIN role", async () => {
        const user = { ...TEST_USERS.ADMIN }
        mockGetCurrentUserWithRole.mockResolvedValue(user)

        const mockRequests = [MOCK_SERVICE_REQUEST]
        mockDb.serviceRequest.findMany.mockResolvedValue(mockRequests)

        const req = createMockRequest('GET', 'http://localhost/api/service-requests')
        const response = await GET(req)

        assertResponse(response, 200)

        // Verify no where clause for admins (can see all)
        expect(mockDb.serviceRequest.findMany).toHaveBeenCalledWith({
          select: expect.objectContaining({
            id: true,
            title: true,
            status: true,
            user: {
              select: {
                name: true,
                email: true,
                company: true,
              },
            },
          }),
          orderBy: {
            createdAt: "desc",
          },
        })
      })
    })

    describe("Error Handling", () => {
      it("should handle database errors gracefully", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetCurrentUserWithRole.mockResolvedValue(user)

        mockDb.serviceRequest.findMany.mockRejectedValue(
          new Error("Database error")
        )

        const req = createMockRequest('GET', 'http://localhost/api/service-requests')
        const response = await GET(req)

        assertResponse(response, 500)
      })
    })
  })

  describe("POST /api/service-requests", () => {
    describe("Authentication", () => {
      it("should return 401 when no session exists", async () => {
        mockGetCurrentUserWithRole.mockResolvedValue(null)

        const request = createMockRequest(
          "POST",
          "http://localhost:3000/api/service-requests",
          VALID_SERVICE_REQUEST_DATA
        ) as NextRequest
        const response = await POST(request)

        assertResponse(response, 401)
      })
    })

    describe("Authorization", () => {
      it("should allow USER role to submit requests", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetCurrentUserWithRole.mockResolvedValue(user)

        const mockCreatedRequest = {
          id: "new-request-id",
          title: VALID_SERVICE_REQUEST_DATA.title,
          status: "SUBMITTED",
          createdAt: new Date(),
        }
        mockDb.serviceRequest.create.mockResolvedValue(mockCreatedRequest)

        const request = createMockRequest(
          "POST",
          "http://localhost:3000/api/service-requests",
          VALID_SERVICE_REQUEST_DATA
        ) as NextRequest
        const response = await POST(request)

        assertResponse(response, 200)

        const data = await getResponseJson(response)
        expect(data).toEqual(
          expect.objectContaining({
            id: mockCreatedRequest.id,
            title: mockCreatedRequest.title,
            status: mockCreatedRequest.status,
          })
        )
      })

      it("should allow OPERATOR role to submit requests", async () => {
        const user = { ...TEST_USERS.OPERATOR }
        mockGetCurrentUserWithRole.mockResolvedValue(user)

        const mockCreatedRequest = {
          id: "new-request-id",
          title: VALID_SERVICE_REQUEST_DATA.title,
          status: "SUBMITTED",
          createdAt: new Date(),
        }
        mockDb.serviceRequest.create.mockResolvedValue(mockCreatedRequest)

        const request = createMockRequest(
          "POST",
          "http://localhost:3000/api/service-requests",
          VALID_SERVICE_REQUEST_DATA
        ) as NextRequest
        const response = await POST(request)

        assertResponse(response, 200)
      })

      it("should allow MANAGER role to submit requests", async () => {
        const user = { ...TEST_USERS.MANAGER }
        mockGetCurrentUserWithRole.mockResolvedValue(user)

        const mockCreatedRequest = {
          id: "new-request-id",
          title: VALID_SERVICE_REQUEST_DATA.title,
          status: "SUBMITTED",
          createdAt: new Date(),
        }
        mockDb.serviceRequest.create.mockResolvedValue(mockCreatedRequest)

        const request = createMockRequest(
          "POST",
          "http://localhost:3000/api/service-requests",
          VALID_SERVICE_REQUEST_DATA
        ) as NextRequest
        const response = await POST(request)

        assertResponse(response, 200)
      })

      it("should allow ADMIN role to submit requests", async () => {
        const user = { ...TEST_USERS.ADMIN }
        mockGetCurrentUserWithRole.mockResolvedValue(user)

        const mockCreatedRequest = {
          id: "new-request-id",
          title: VALID_SERVICE_REQUEST_DATA.title,
          status: "SUBMITTED",
          createdAt: new Date(),
        }
        mockDb.serviceRequest.create.mockResolvedValue(mockCreatedRequest)

        const request = createMockRequest(
          "POST",
          "http://localhost:3000/api/service-requests",
          VALID_SERVICE_REQUEST_DATA
        ) as NextRequest
        const response = await POST(request)

        assertResponse(response, 200)
      })
    })

    describe("Data Validation", () => {
      it("should validate required fields", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetCurrentUserWithRole.mockResolvedValue(user)

        const request = createMockRequest(
          "POST",
          "http://localhost:3000/api/service-requests",
          INVALID_SERVICE_REQUEST_DATA
        ) as NextRequest
        const response = await POST(request)

        assertResponse(response, 422)

        const errors = await getResponseJson(response)
        expect(Array.isArray(errors)).toBe(true)
        expect(errors.length).toBeGreaterThan(0)
      })

      it("should validate email format", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetCurrentUserWithRole.mockResolvedValue(user)

        const invalidData = {
          ...VALID_SERVICE_REQUEST_DATA,
          contactEmail: "invalid-email",
        }

        const request = createMockRequest(
          "POST",
          "http://localhost:3000/api/service-requests",
          invalidData
        ) as NextRequest
        const response = await POST(request)

        assertResponse(response, 422)
      })

      it("should validate date format", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetCurrentUserWithRole.mockResolvedValue(user)

        const invalidData = {
          ...VALID_SERVICE_REQUEST_DATA,
          startDate: "invalid-date",
        }

        const request = createMockRequest(
          "POST",
          "http://localhost:3000/api/service-requests",
          invalidData
        ) as NextRequest
        const response = await POST(request)

        assertResponse(response, 422)
      })
    })

    describe("Business Logic", () => {
      it("should calculate total hours correctly", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetCurrentUserWithRole.mockResolvedValue(user)

        const mockCreatedRequest = {
          id: "new-request-id",
          title: VALID_SERVICE_REQUEST_DATA.title,
          status: "SUBMITTED",
          createdAt: new Date(),
        }
        mockDb.serviceRequest.create.mockResolvedValue(mockCreatedRequest)

        const request = createMockRequest(
          "POST",
          "http://localhost:3000/api/service-requests",
          VALID_SERVICE_REQUEST_DATA
        ) as NextRequest
        const response = await POST(request)

        assertResponse(response, 200)

        // Verify total hours calculation in database call
        expect(mockDb.serviceRequest.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            requestedTotalHours: 40, // 5 days * 8 hours for MULTI_DAY
            userId: user.id,
            status: "SUBMITTED",
          }),
          select: expect.any(Object),
        })
      })

      it("should set correct status and user ID", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetCurrentUserWithRole.mockResolvedValue(user)

        const mockCreatedRequest = {
          id: "new-request-id",
          title: VALID_SERVICE_REQUEST_DATA.title,
          status: "SUBMITTED",
          createdAt: new Date(),
        }
        mockDb.serviceRequest.create.mockResolvedValue(mockCreatedRequest)

        const request = createMockRequest(
          "POST",
          "http://localhost:3000/api/service-requests",
          VALID_SERVICE_REQUEST_DATA
        )
        await POST(request)

        expect(mockDb.serviceRequest.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            status: "SUBMITTED",
            userId: user.id,
          }),
          select: expect.any(Object),
        })
      })
    })

    describe("Error Handling", () => {
      it("should handle database errors gracefully", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetCurrentUserWithRole.mockResolvedValue(user)

        mockDb.serviceRequest.create.mockRejectedValue(
          new Error("Database error")
        )

        const request = createMockRequest(
          "POST",
          "http://localhost:3000/api/service-requests",
          VALID_SERVICE_REQUEST_DATA
        ) as NextRequest
        const response = await POST(request)

        assertResponse(response, 500)
      })

      it("should handle malformed JSON gracefully", async () => {
        const user = { ...TEST_USERS.USER }
        mockGetCurrentUserWithRole.mockResolvedValue(user)

        // Create request with invalid JSON - using helper for consistency
        const request = createMockRequest(
          "POST",
          "http://localhost:3000/api/service-requests"
        )
        // Override the body with invalid JSON by creating a new request
        const invalidRequest = new Request(request.url, {
          method: request.method,
          body: "invalid json",
          headers: request.headers,
        })

        const response = await POST(invalidRequest as NextRequest)

        assertResponse(response, 500)
      })
    })
  })
})
