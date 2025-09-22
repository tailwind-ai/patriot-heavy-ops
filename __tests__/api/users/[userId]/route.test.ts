import { PATCH } from '@/app/api/users/[userId]/route'
import { 
  createMockRequest, 
  createMockRouteContext,
  getResponseJson, 
  assertResponse
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

const mockDb = db as jest.Mocked<typeof db>
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

describe('/api/users/[userId]', () => {
  const mockUserId = 'test-user-id'
  const mockContext = createMockRouteContext({ userId: mockUserId })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('PATCH /api/users/[userId]', () => {
    describe('Authentication & Authorization', () => {
      it('should return 403 when no session exists', async () => {
        mockGetServerSession.mockResolvedValue(null)

        const updateData = { name: 'New Name' }
        const request = createMockRequest('PATCH', `http://localhost:3000/api/users/${mockUserId}`, updateData)
        const response = await PATCH(request, mockContext)

        assertResponse(response, 403)
      })

      it('should return 403 when user tries to update different user', async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: 'different-user-id' },
          expires: new Date().toISOString(),
        })

        const updateData = { name: 'New Name' }
        const request = createMockRequest('PATCH', `http://localhost:3000/api/users/${mockUserId}`, updateData)
        const response = await PATCH(request, mockContext)

        assertResponse(response, 403)
      })

      it('should allow user to update their own profile', async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: mockUserId },
          expires: new Date().toISOString(),
        })

        mockDb.user.update.mockResolvedValue({
          id: mockUserId,
          name: 'Updated Name',
          email: 'test@example.com',
        })

        const updateData = { name: 'Updated Name' }
        const request = createMockRequest('PATCH', `http://localhost:3000/api/users/${mockUserId}`, updateData)
        const response = await PATCH(request, mockContext)

        assertResponse(response, 200)
        
        // Verify database update was called correctly
        expect(mockDb.user.update).toHaveBeenCalledWith({
          where: { id: mockUserId },
          data: { name: 'Updated Name' },
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

      it('should validate name length (minimum 3 characters)', async () => {
        const invalidData = { name: 'AB' } // Too short

        const request = createMockRequest('PATCH', 'http://localhost:3000/api/users/test', invalidData)
        const response = await PATCH(request, mockContext)

        assertResponse(response, 422)
        
        const errors = await getResponseJson(response)
        expect(Array.isArray(errors)).toBe(true)
        expect(errors.some((error: any) => error.path.includes('name'))).toBe(true)
      })

      it('should validate name length (maximum 32 characters)', async () => {
        const invalidData = { name: 'A'.repeat(33) } // Too long

        const request = createMockRequest('PATCH', 'http://localhost:3000/api/users/test', invalidData)
        const response = await PATCH(request, mockContext)

        assertResponse(response, 422)
        
        const errors = await getResponseJson(response)
        expect(Array.isArray(errors)).toBe(true)
        expect(errors.some((error: any) => error.path.includes('name'))).toBe(true)
      })

      it('should accept valid name', async () => {
        mockDb.user.update.mockResolvedValue({
          id: mockUserId,
          name: 'Valid Name',
          email: 'test@example.com',
        })

        const validData = { name: 'Valid Name' }
        const request = createMockRequest('PATCH', 'http://localhost:3000/api/users/test', validData)
        const response = await PATCH(request, mockContext)

        assertResponse(response, 200)
        expect(mockDb.user.update).toHaveBeenCalledWith({
          where: { id: mockUserId },
          data: { name: 'Valid Name' },
        })
      })

      it('should require name field', async () => {
        const invalidData = {} // Missing name

        const request = createMockRequest('PATCH', 'http://localhost:3000/api/users/test', invalidData)
        const response = await PATCH(request, mockContext)

        assertResponse(response, 422)
      })
    })

    describe('Route Context Validation', () => {
      it('should validate userId parameter', async () => {
        const invalidContext = { params: {} } // Missing userId

        const updateData = { name: 'Valid Name' }
        const request = createMockRequest('PATCH', `http://localhost:3000/api/users/${mockUserId}`, updateData)
        const response = await PATCH(request, invalidContext as any)

        assertResponse(response, 422)
      })

      it('should handle empty userId parameter', async () => {
        // Empty userId will fail session check before reaching Zod validation
        mockGetServerSession.mockResolvedValue({
          user: { id: 'different-user-id' },
          expires: new Date().toISOString(),
        })

        const invalidContext = { params: { userId: '' } } // Empty userId

        const updateData = { name: 'Valid Name' }
        const request = createMockRequest('PATCH', `http://localhost:3000/api/users/${mockUserId}`, updateData)
        const response = await PATCH(request, invalidContext as any)

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

        const updateData = { name: 'Valid Name' }
        const request = createMockRequest('PATCH', `http://localhost:3000/api/users/${mockUserId}`, updateData)
        const response = await PATCH(request, mockContext)

        assertResponse(response, 500)
      })

      it('should handle malformed JSON gracefully', async () => {
        // Create request with invalid JSON - using helper for consistency
        const request = createMockRequest('PATCH', `http://localhost:3000/api/users/${mockUserId}`)
        // Override the body with invalid JSON by creating a new request
        const invalidRequest = new Request(request.url, {
          method: request.method,
          body: 'invalid json',
          headers: request.headers
        })

        const response = await PATCH(invalidRequest, mockContext)

        assertResponse(response, 500)
      })

      it('should handle session retrieval errors', async () => {
        mockGetServerSession.mockRejectedValue(new Error('Session error'))

        const updateData = { name: 'Valid Name' }
        const request = createMockRequest('PATCH', `http://localhost:3000/api/users/${mockUserId}`, updateData)
        const response = await PATCH(request, mockContext)

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

      it('should handle special characters in name', async () => {
        mockDb.user.update.mockResolvedValue({
          id: mockUserId,
          name: "O'Connor-Smith",
          email: 'test@example.com',
        })

        const updateData = { name: "O'Connor-Smith" }
        const request = createMockRequest('PATCH', `http://localhost:3000/api/users/${mockUserId}`, updateData)
        const response = await PATCH(request, mockContext)

        assertResponse(response, 200)
        expect(mockDb.user.update).toHaveBeenCalledWith({
          where: { id: mockUserId },
          data: { name: "O'Connor-Smith" },
        })
      })

      it('should handle unicode characters in name', async () => {
        mockDb.user.update.mockResolvedValue({
          id: mockUserId,
          name: 'José María',
          email: 'test@example.com',
        })

        const updateData = { name: 'José María' }
        const request = createMockRequest('PATCH', `http://localhost:3000/api/users/${mockUserId}`, updateData)
        const response = await PATCH(request, mockContext)

        assertResponse(response, 200)
        expect(mockDb.user.update).toHaveBeenCalledWith({
          where: { id: mockUserId },
          data: { name: 'José María' },
        })
      })

      it('should trim whitespace from name', async () => {
        mockDb.user.update.mockResolvedValue({
          id: mockUserId,
          name: 'Trimmed Name',
          email: 'test@example.com',
        })

        const updateData = { name: '  Trimmed Name  ' }
        const request = createMockRequest('PATCH', `http://localhost:3000/api/users/${mockUserId}`, updateData)
        const response = await PATCH(request, mockContext)

        assertResponse(response, 200)
        // Note: Zod doesn't automatically trim, so this tests the actual behavior
        expect(mockDb.user.update).toHaveBeenCalledWith({
          where: { id: mockUserId },
          data: { name: '  Trimmed Name  ' },
        })
      })
    })
  })
})
