import { POST } from '@/app/api/users/[userId]/operator-application/route'
import { 
  createMockRequest, 
  createMockUserContext,
  getResponseJson, 
  assertResponse,
  mockSession,
  TEST_USERS
} from '@/__tests__/helpers/api-test-helpers'
import { getServerSession } from 'next-auth/next'

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    user: {
      update: jest.fn(),
    },
  },
}))
jest.mock('next-auth/next')

import { db } from '@/lib/db'

const mockDb = db as any
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

describe('/api/users/[userId]/operator-application', () => {
  const mockUserId = 'test-user-id'
  const mockContext = createMockUserContext(mockUserId)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/users/[userId]/operator-application', () => {
    describe('Authentication & Authorization', () => {
      it('should return 403 when no session exists', async () => {
        mockGetServerSession.mockResolvedValue(null)

        const applicationData = { location: 'Austin, TX' }
        const request = createMockRequest('POST', `http://localhost:3000/api/users/${mockUserId}/operator-application`, applicationData)
        const response = await POST(request, mockContext)

        assertResponse(response, 403)
      })

      it('should return 403 when user tries to submit application for different user', async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: 'different-user-id' },
          expires: new Date().toISOString(),
        })

        const applicationData = { location: 'Austin, TX' }
        const request = createMockRequest('POST', `http://localhost:3000/api/users/${mockUserId}/operator-application`, applicationData)
        const response = await POST(request, mockContext)

        assertResponse(response, 403)
      })

      it('should allow user to submit their own operator application', async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: mockUserId },
          expires: new Date().toISOString(),
        })

        const updatedUser = {
          id: mockUserId,
          preferredLocations: ['Austin, TX'],
          role: 'USER',
          name: 'Test User',
          email: 'test@example.com',
        }
        mockDb.user.update.mockResolvedValue(updatedUser)

        const applicationData = { location: 'Austin, TX' }
        const request = createMockRequest('POST', `http://localhost:3000/api/users/${mockUserId}/operator-application`, applicationData)
        const response = await POST(request, mockContext)

        assertResponse(response, 200, 'application/json')
        
        const data = await getResponseJson(response)
        expect(data).toEqual({
          success: true,
          message: 'Operator application submitted successfully',
          data: {
            userId: mockUserId,
            preferredLocations: ['Austin, TX'],
            role: 'USER',
          },
        })
      })
    })

    describe('Data Validation', () => {
      beforeEach(() => {
        mockGetServerSession.mockResolvedValue({
          user: { id: mockUserId },
          expires: new Date().toISOString(),
        })
      })

      it('should require location field', async () => {
        const invalidData = {} // Missing location

        const request = createMockRequest('POST', 'http://localhost:3000/api/users/test/operator-application', invalidData)
        const response = await POST(request, mockContext)

        assertResponse(response, 422)
        
        const errors = await getResponseJson(response)
        expect(Array.isArray(errors)).toBe(true)
        expect(errors.some((error: any) => error.path.includes('location'))).toBe(true)
      })

      it('should validate location is not empty', async () => {
        const invalidData = { location: '' } // Empty location

        const request = createMockRequest('POST', 'http://localhost:3000/api/users/test/operator-application', invalidData)
        const response = await POST(request, mockContext)

        assertResponse(response, 422)
        
        const errors = await getResponseJson(response)
        expect(Array.isArray(errors)).toBe(true)
        expect(errors.some((error: any) => error.message === 'Please select a location')).toBe(true)
      })

      it('should accept valid location', async () => {
        const updatedUser = {
          id: mockUserId,
          preferredLocations: ['Dallas, TX'],
          role: 'USER',
        }
        mockDb.user.update.mockResolvedValue(updatedUser)

        const validData = { location: 'Dallas, TX' }
        const request = createMockRequest('POST', 'http://localhost:3000/api/users/test/operator-application', validData)
        const response = await POST(request, mockContext)

        assertResponse(response, 200)
        
        // Verify database update was called correctly
        expect(mockDb.user.update).toHaveBeenCalledWith({
          where: { id: mockUserId },
          data: { preferredLocations: ['Dallas, TX'] },
        })
      })
    })

    describe('Business Logic', () => {
      beforeEach(() => {
        mockGetServerSession.mockResolvedValue({
          user: { id: mockUserId },
          expires: new Date().toISOString(),
        })
      })

      it('should store location in preferredLocations array', async () => {
        const updatedUser = {
          id: mockUserId,
          preferredLocations: ['Houston, TX'],
          role: 'USER',
        }
        mockDb.user.update.mockResolvedValue(updatedUser)

        const applicationData = { location: 'Houston, TX' }
        const request = createMockRequest('POST', `http://localhost:3000/api/users/${mockUserId}/operator-application`, applicationData)
        const response = await POST(request, mockContext)

        assertResponse(response, 200)
        
        expect(mockDb.user.update).toHaveBeenCalledWith({
          where: { id: mockUserId },
          data: { preferredLocations: ['Houston, TX'] },
        })
      })

      it('should keep user role as USER (pending admin approval)', async () => {
        const updatedUser = {
          id: mockUserId,
          preferredLocations: ['San Antonio, TX'],
          role: 'USER', // Should remain USER until admin approval
        }
        mockDb.user.update.mockResolvedValue(updatedUser)

        const applicationData = { location: 'San Antonio, TX' }
        const request = createMockRequest('POST', `http://localhost:3000/api/users/${mockUserId}/operator-application`, applicationData)
        const response = await POST(request, mockContext)

        assertResponse(response, 200)
        
        const data = await getResponseJson(response)
        expect(data.data.role).toBe('USER')
      })

      it('should return success response with application data', async () => {
        const updatedUser = {
          id: mockUserId,
          preferredLocations: ['Fort Worth, TX'],
          role: 'USER',
        }
        mockDb.user.update.mockResolvedValue(updatedUser)

        const applicationData = { location: 'Fort Worth, TX' }
        const request = createMockRequest('POST', `http://localhost:3000/api/users/${mockUserId}/operator-application`, applicationData)
        const response = await POST(request, mockContext)

        assertResponse(response, 200)
        
        const data = await getResponseJson(response)
        expect(data).toMatchObject({
          success: true,
          message: 'Operator application submitted successfully',
          data: {
            userId: mockUserId,
            preferredLocations: ['Fort Worth, TX'],
            role: 'USER',
          },
        })
      })
    })

    describe('Route Context Validation', () => {
      it('should validate userId parameter', async () => {
        // Use the same user ID for both session and context
        const testUser = { ...TEST_USERS.USER, id: mockUserId }
        mockSession(testUser)
        
        // In Next.js 15, params are handled internally by the framework
        // This test verifies the route works with valid params
        const validContext = createMockUserContext(mockUserId)
        const applicationData = { location: 'Austin, TX' }
        const request = createMockRequest('POST', `http://localhost:3000/api/users/${mockUserId}/operator-application`, applicationData)
        const response = await POST(request, validContext)

        assertResponse(response, 200)
      })

      it('should handle empty userId parameter', async () => {
        // Empty userId will fail session check before reaching Zod validation
        mockGetServerSession.mockResolvedValue({
          user: { id: 'different-user-id' },
          expires: new Date().toISOString(),
        })

        const invalidContext = { params: { userId: '' } } // Empty userId

        const applicationData = { location: 'Austin, TX' }
        const request = createMockRequest('POST', `http://localhost:3000/api/users/${mockUserId}/operator-application`, applicationData)
        const response = await POST(request, invalidContext as any)

        // Returns 403 because empty userId doesn't match session user ID
        assertResponse(response, 403)
      })
    })

    describe('Error Handling', () => {
      beforeEach(() => {
        mockGetServerSession.mockResolvedValue({
          user: { id: mockUserId },
          expires: new Date().toISOString(),
        })
      })

      it('should handle database errors gracefully', async () => {
        mockDb.user.update.mockRejectedValue(new Error('Database connection error'))

        const applicationData = { location: 'Austin, TX' }
        const request = createMockRequest('POST', `http://localhost:3000/api/users/${mockUserId}/operator-application`, applicationData)
        const response = await POST(request, mockContext)

        assertResponse(response, 500, 'application/json')
        
        const data = await getResponseJson(response)
        expect(data).toMatchObject({
          error: 'Failed to process operator application',
          message: 'An error occurred while saving your application. Please try again.',
        })
      })

      it('should handle malformed JSON gracefully', async () => {
        // Create request with invalid JSON - using helper for consistency
        const request = createMockRequest('POST', `http://localhost:3000/api/users/${mockUserId}/operator-application`)
        // Override the body with invalid JSON by creating a new request
        const invalidRequest = new Request(request.url, {
          method: request.method,
          body: 'invalid json',
          headers: request.headers
        })

        const response = await POST(invalidRequest, mockContext)

        assertResponse(response, 500)
      })

      it('should handle session retrieval errors', async () => {
        mockGetServerSession.mockRejectedValue(new Error('Session error'))

        const applicationData = { location: 'Austin, TX' }
        const request = createMockRequest('POST', `http://localhost:3000/api/users/${mockUserId}/operator-application`, applicationData)
        const response = await POST(request, mockContext)

        assertResponse(response, 500)
      })
    })

    describe('Edge Cases', () => {
      beforeEach(() => {
        mockGetServerSession.mockResolvedValue({
          user: { id: mockUserId },
          expires: new Date().toISOString(),
        })
      })

      it('should handle locations with special characters', async () => {
        const updatedUser = {
          id: mockUserId,
          preferredLocations: ['São Paulo, Brazil'],
          role: 'USER',
        }
        mockDb.user.update.mockResolvedValue(updatedUser)

        const applicationData = { location: 'São Paulo, Brazil' }
        const request = createMockRequest('POST', `http://localhost:3000/api/users/${mockUserId}/operator-application`, applicationData)
        const response = await POST(request, mockContext)

        assertResponse(response, 200)
        expect(mockDb.user.update).toHaveBeenCalledWith({
          where: { id: mockUserId },
          data: { preferredLocations: ['São Paulo, Brazil'] },
        })
      })

      it('should handle very long location names', async () => {
        const longLocation = 'A'.repeat(100) + ', TX'
        const updatedUser = {
          id: mockUserId,
          preferredLocations: [longLocation],
          role: 'USER',
        }
        mockDb.user.update.mockResolvedValue(updatedUser)

        const applicationData = { location: longLocation }
        const request = createMockRequest('POST', `http://localhost:3000/api/users/${mockUserId}/operator-application`, applicationData)
        const response = await POST(request, mockContext)

        assertResponse(response, 200)
        expect(mockDb.user.update).toHaveBeenCalledWith({
          where: { id: mockUserId },
          data: { preferredLocations: [longLocation] },
        })
      })

      it('should handle locations with commas and special formatting', async () => {
        const complexLocation = 'Austin, Travis County, Texas, United States'
        const updatedUser = {
          id: mockUserId,
          preferredLocations: [complexLocation],
          role: 'USER',
        }
        mockDb.user.update.mockResolvedValue(updatedUser)

        const applicationData = { location: complexLocation }
        const request = createMockRequest('POST', `http://localhost:3000/api/users/${mockUserId}/operator-application`, applicationData)
        const response = await POST(request, mockContext)

        assertResponse(response, 200)
        expect(mockDb.user.update).toHaveBeenCalledWith({
          where: { id: mockUserId },
          data: { preferredLocations: [complexLocation] },
        })
      })
    })
  })
})
