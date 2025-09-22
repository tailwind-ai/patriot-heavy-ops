import { GET, PATCH, DELETE } from '@/app/api/service-requests/[requestId]/route'
import { 
  createMockRequest, 
  createMockRouteContext,
  getResponseJson, 
  assertResponse,
  TEST_USERS 
} from '@/__tests__/helpers/api-test-helpers'
import { 
  MOCK_SERVICE_REQUEST_WITH_RELATIONS,
  MOCK_SERVICE_REQUEST 
} from '@/__tests__/helpers/mock-data'
import { getServerSession } from 'next-auth/next'

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    serviceRequest: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}))
jest.mock('next-auth/next')

import { db } from '@/lib/db'

const mockDb = db as jest.Mocked<typeof db>
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

describe('/api/service-requests/[requestId]', () => {
  const mockRequestId = 'test-request-id'
  const mockContext = createMockRouteContext({ requestId: mockRequestId })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/service-requests/[requestId]', () => {
    describe('Authentication & Authorization', () => {
      it('should return 403 when user has no access to request', async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: 'different-user-id' },
          expires: new Date().toISOString(),
        })
        
        mockDb.serviceRequest.count.mockResolvedValue(0)

        const response = await GET(createMockRequest('GET'), mockContext)

        assertResponse(response, 403)
      })

      it('should return 403 when no session exists', async () => {
        mockGetServerSession.mockResolvedValue(null)

        const response = await GET(createMockRequest('GET'), mockContext)

        assertResponse(response, 403)
      })

      it('should allow access when user owns the request', async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: TEST_USERS.USER.id },
          expires: new Date().toISOString(),
        })
        
        mockDb.serviceRequest.count.mockResolvedValue(1)
        mockDb.serviceRequest.findUnique.mockResolvedValue(MOCK_SERVICE_REQUEST_WITH_RELATIONS)

        const response = await GET(createMockRequest('GET'), mockContext)

        assertResponse(response, 200)
        
        const data = await getResponseJson(response)
        expect(data).toEqual(expect.objectContaining({
          id: MOCK_SERVICE_REQUEST_WITH_RELATIONS.id,
          title: MOCK_SERVICE_REQUEST_WITH_RELATIONS.title,
        }))
      })
    })

    describe('Data Retrieval', () => {
      beforeEach(() => {
        mockGetServerSession.mockResolvedValue({
          user: { id: TEST_USERS.USER.id },
          expires: new Date().toISOString(),
        })
        mockDb.serviceRequest.count.mockResolvedValue(1)
      })

      it('should return service request with relations', async () => {
        mockDb.serviceRequest.findUnique.mockResolvedValue(MOCK_SERVICE_REQUEST_WITH_RELATIONS)

        const response = await GET(createMockRequest('GET'), mockContext)

        assertResponse(response, 200)
        
        // Verify it includes relations
        expect(mockDb.serviceRequest.findUnique).toHaveBeenCalledWith({
          where: { id: mockRequestId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            assignedManager: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            userAssignments: {
              include: {
                operator: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        })
      })

      it('should return 404 when request does not exist', async () => {
        mockDb.serviceRequest.findUnique.mockResolvedValue(null)

        const response = await GET(createMockRequest('GET'), mockContext)

        assertResponse(response, 404)
      })
    })

    describe('Error Handling', () => {
      it('should handle database errors gracefully', async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: TEST_USERS.USER.id },
          expires: new Date().toISOString(),
        })
        
        mockDb.serviceRequest.count.mockRejectedValue(new Error('Database error'))

        const response = await GET(createMockRequest('GET'), mockContext)

        assertResponse(response, 500)
      })
    })
  })

  describe('PATCH /api/service-requests/[requestId]', () => {
    const updateData = {
      title: 'Updated Title',
      description: 'Updated description',
      status: 'UNDER_REVIEW' as const,
    }

    describe('Authentication & Authorization', () => {
      it('should return 403 when user has no access to request', async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: 'different-user-id' },
          expires: new Date().toISOString(),
        })
        
        mockDb.serviceRequest.count.mockResolvedValue(0)

        const request = createMockRequest('PATCH', 'http://localhost:3000/api/service-requests/test', updateData)
        const response = await PATCH(request, mockContext)

        assertResponse(response, 403)
      })

      it('should allow updates when user owns the request', async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: TEST_USERS.USER.id },
          expires: new Date().toISOString(),
        })
        
        mockDb.serviceRequest.count.mockResolvedValue(1)
        
        const updatedRequest = {
          id: mockRequestId,
          title: updateData.title,
          status: updateData.status,
          updatedAt: new Date(),
        }
        mockDb.serviceRequest.update.mockResolvedValue(updatedRequest)

        const request = createMockRequest('PATCH', 'http://localhost:3000/api/service-requests/test', updateData)
        const response = await PATCH(request, mockContext)

        assertResponse(response, 200)
        
        const data = await getResponseJson(response)
        expect(data).toEqual(expect.objectContaining({
          id: updatedRequest.id,
          title: updatedRequest.title,
          status: updatedRequest.status,
        }))
      })
    })

    describe('Data Validation', () => {
      beforeEach(() => {
        mockGetServerSession.mockResolvedValue({
          user: { id: TEST_USERS.USER.id },
          expires: new Date().toISOString(),
        })
        mockDb.serviceRequest.count.mockResolvedValue(1)
      })

      it('should validate update data with Zod schema', async () => {
        const invalidData = {
          title: '', // Invalid: empty title
          status: 'INVALID_STATUS', // Invalid: not in enum
        }

        const request = createMockRequest('PATCH', 'http://localhost:3000/api/service-requests/test', invalidData)
        const response = await PATCH(request, mockContext)

        assertResponse(response, 422)
        
        const errors = await getResponseJson(response)
        expect(Array.isArray(errors)).toBe(true)
      })

      it('should handle date parsing correctly', async () => {
        const validData = {
          startDate: '2024-02-01',
          endDate: '2024-02-05',
        }
        
        const updatedRequest = {
          id: mockRequestId,
          title: 'Test',
          status: 'SUBMITTED',
          updatedAt: new Date(),
        }
        mockDb.serviceRequest.update.mockResolvedValue(updatedRequest)

        const request = createMockRequest('PATCH', 'http://localhost:3000/api/service-requests/test', validData)
        const response = await PATCH(request, mockContext)

        assertResponse(response, 200)
        
        // Verify dates are parsed correctly
        expect(mockDb.serviceRequest.update).toHaveBeenCalledWith({
          where: { id: mockRequestId },
          data: expect.objectContaining({
            startDate: new Date(validData.startDate),
            endDate: new Date(validData.endDate),
            updatedAt: expect.any(Date),
          }),
          select: expect.any(Object),
        })
      })
    })

    describe('Error Handling', () => {
      it('should handle database errors gracefully', async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: TEST_USERS.USER.id },
          expires: new Date().toISOString(),
        })
        
        mockDb.serviceRequest.count.mockResolvedValue(1)
        mockDb.serviceRequest.update.mockRejectedValue(new Error('Database error'))

        const request = createMockRequest('PATCH', 'http://localhost:3000/api/service-requests/test', updateData)
        const response = await PATCH(request, mockContext)

        assertResponse(response, 500)
      })

      it('should handle malformed JSON gracefully', async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: TEST_USERS.USER.id },
          expires: new Date().toISOString(),
        })
        
        mockDb.serviceRequest.count.mockResolvedValue(1)

        // Create request with invalid JSON - using helper for consistency
        const request = createMockRequest('PATCH', 'http://localhost:3000/api/service-requests/test')
        // Override the body with invalid JSON by creating a new request
        const invalidRequest = new Request(request.url, {
          method: request.method,
          body: 'invalid json',
          headers: request.headers
        })

        const response = await PATCH(invalidRequest, mockContext)

        assertResponse(response, 500)
      })
    })
  })

  describe('DELETE /api/service-requests/[requestId]', () => {
    describe('Authentication & Authorization', () => {
      it('should return 403 when user has no access to request', async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: 'different-user-id' },
          expires: new Date().toISOString(),
        })
        
        mockDb.serviceRequest.count.mockResolvedValue(0)

        const response = await DELETE(createMockRequest('DELETE'), mockContext)

        assertResponse(response, 403)
      })

      it('should allow deletion when user owns the request', async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: TEST_USERS.USER.id },
          expires: new Date().toISOString(),
        })
        
        mockDb.serviceRequest.count.mockResolvedValue(1)
        mockDb.serviceRequest.delete.mockResolvedValue(MOCK_SERVICE_REQUEST)

        const response = await DELETE(createMockRequest('DELETE'), mockContext)

        assertResponse(response, 204)
        
        // Verify deletion was called
        expect(mockDb.serviceRequest.delete).toHaveBeenCalledWith({
          where: { id: mockRequestId },
        })
      })
    })

    describe('Error Handling', () => {
      it('should handle database errors gracefully', async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: TEST_USERS.USER.id },
          expires: new Date().toISOString(),
        })
        
        mockDb.serviceRequest.count.mockResolvedValue(1)
        mockDb.serviceRequest.delete.mockRejectedValue(new Error('Database error'))

        const response = await DELETE(createMockRequest('DELETE'), mockContext)

        assertResponse(response, 500)
      })

      it('should handle invalid context parameters', async () => {
        const invalidContext = { params: {} } // Missing requestId

        const response = await DELETE(createMockRequest('DELETE'), invalidContext as any)

        // This triggers a Zod validation error for missing requestId
        assertResponse(response, 422)
      })
    })
  })
})
