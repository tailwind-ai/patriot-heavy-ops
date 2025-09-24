import { NextRequest, NextResponse } from 'next/server'
import { createMockRequest } from '@/__tests__/helpers/api-test-helpers'
import { POST, GET } from '@/app/api/auth/mobile/refresh/route'
import { verifyToken, generateAccessToken, generateRefreshToken, isTokenExpired } from '@/lib/auth-utils'
import { authRateLimit } from '@/lib/middleware/rate-limit'

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))
jest.mock('@/lib/auth-utils')
jest.mock('@/lib/middleware/rate-limit')

// Import the mocked database
import { db } from '@/lib/db'
const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>
const mockGenerateAccessToken = generateAccessToken as jest.MockedFunction<typeof generateAccessToken>
const mockGenerateRefreshToken = generateRefreshToken as jest.MockedFunction<typeof generateRefreshToken>
const mockIsTokenExpired = isTokenExpired as jest.MockedFunction<typeof isTokenExpired>
const mockAuthRateLimit = authRateLimit as jest.MockedFunction<typeof authRateLimit>
const mockDbUser = db.user.findUnique as jest.MockedFunction<typeof db.user.findUnique>

describe('/api/auth/mobile/refresh', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock rate limiting to allow requests by default
    mockAuthRateLimit.mockResolvedValue(null)
  })

  describe('POST', () => {
    const validRefreshData = {
      refreshToken: 'valid.refresh.token'
    }

    const mockTokenPayload = {
      userId: 'user-123',
      email: 'test@example.com',
      role: 'USER',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days
    }

    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      password: null,
      emailVerified: null,
      image: null,
      role: 'USER',
      phone: null,
      company: null,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      militaryBranch: null,
      yearsOfService: null,
      certifications: [],
      preferredLocations: [],
      isAvailable: true,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      stripePriceId: null,
      stripeCurrentPeriodEnd: null,
    }

    it('should successfully refresh tokens with valid refresh token', async () => {
      mockVerifyToken.mockReturnValue(mockTokenPayload)
      mockIsTokenExpired.mockReturnValue(false)
      mockDbUser.mockResolvedValue(mockUser)
      mockGenerateAccessToken.mockReturnValue('new-access-token')
      mockGenerateRefreshToken.mockReturnValue('new-refresh-token')

      const req = createMockRequest('POST', 'http://localhost/api/auth/mobile/refresh', validRefreshData)

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.accessToken).toBe('new-access-token')
      expect(data.refreshToken).toBe('new-refresh-token')
      expect(data.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role
      })

      expect(mockVerifyToken).toHaveBeenCalledWith(validRefreshData.refreshToken)
      expect(mockDbUser).toHaveBeenCalledWith({
        where: { id: mockTokenPayload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true
        }
      })
    })

    it('should return 401 for invalid refresh token', async () => {
      mockVerifyToken.mockReturnValue(null)

      const req = createMockRequest('POST', 'http://localhost/api/auth/mobile/refresh', validRefreshData)

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid or expired refresh token')
      expect(data.accessToken).toBeUndefined()
      expect(data.refreshToken).toBeUndefined()
    })

    it('should return 401 for expired refresh token', async () => {
      mockVerifyToken.mockReturnValue(mockTokenPayload)
      mockIsTokenExpired.mockReturnValue(true)

      const req = createMockRequest('POST', 'http://localhost/api/auth/mobile/refresh', validRefreshData)

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Refresh token has expired')
    })

    it('should return 401 when user not found in database', async () => {
      mockVerifyToken.mockReturnValue(mockTokenPayload)
      mockIsTokenExpired.mockReturnValue(false)
      mockDbUser.mockResolvedValue(null)

      const req = createMockRequest('POST', 'http://localhost/api/auth/mobile/refresh', validRefreshData)

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('User not found')
    })

    it('should return 400 for missing refresh token', async () => {
      const invalidData = {}

      const req = createMockRequest('POST', 'http://localhost/api/auth/mobile/refresh', invalidData)

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Required')
    })

    it('should return 400 for empty refresh token', async () => {
      const invalidData = {
        refreshToken: ''
      }

      const req = createMockRequest('POST', 'http://localhost/api/auth/mobile/refresh', invalidData)

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should handle database errors gracefully', async () => {
      mockVerifyToken.mockReturnValue(mockTokenPayload)
      mockIsTokenExpired.mockReturnValue(false)
      mockDbUser.mockRejectedValue(new Error('Database connection failed'))

      const req = createMockRequest('POST', 'http://localhost/api/auth/mobile/refresh', validRefreshData)

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Token refresh failed')
    })

    it('should handle malformed JSON gracefully', async () => {
      const req = createMockRequest('POST', 'http://localhost/api/auth/mobile/refresh', 'invalid-json')

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Expected object, received string')
    })

    it('should apply rate limiting', async () => {
      const rateLimitResponse = NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
      mockAuthRateLimit.mockResolvedValue(rateLimitResponse)

      const req = createMockRequest('POST', 'http://localhost/api/auth/mobile/refresh', validRefreshData)

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.error).toBe('Rate limit exceeded')
      expect(mockAuthRateLimit).toHaveBeenCalledWith(req)
    })

    it('should generate new tokens with current user data', async () => {
      const updatedUser = {
        ...mockUser,
        email: 'updated@example.com',
        role: 'MANAGER'
      }

      mockVerifyToken.mockReturnValue(mockTokenPayload)
      mockIsTokenExpired.mockReturnValue(false)
      mockDbUser.mockResolvedValue(updatedUser)
      mockGenerateAccessToken.mockReturnValue('new-access-token')
      mockGenerateRefreshToken.mockReturnValue('new-refresh-token')

      const req = createMockRequest('POST', 'http://localhost/api/auth/mobile/refresh', validRefreshData)

      await POST(req)

      const expectedPayload = {
        userId: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role
      }

      expect(mockGenerateAccessToken).toHaveBeenCalledWith(expectedPayload)
      expect(mockGenerateRefreshToken).toHaveBeenCalledWith(expectedPayload)
    })

    it('should handle user with no role', async () => {
      const userWithoutRole = { ...mockUser, role: null }
      
      mockVerifyToken.mockReturnValue(mockTokenPayload)
      mockIsTokenExpired.mockReturnValue(false)
      mockDbUser.mockResolvedValue(userWithoutRole)
      mockGenerateAccessToken.mockReturnValue('new-access-token')
      mockGenerateRefreshToken.mockReturnValue('new-refresh-token')

      const req = createMockRequest('POST', 'http://localhost/api/auth/mobile/refresh', validRefreshData)

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user.role).toBeUndefined()

      const expectedPayload = {
        userId: userWithoutRole.id,
        email: userWithoutRole.email,
        role: undefined
      }

      expect(mockGenerateAccessToken).toHaveBeenCalledWith(expectedPayload)
    })

    it('should handle user with no name', async () => {
      const userWithoutName = { ...mockUser, name: null }
      
      mockVerifyToken.mockReturnValue(mockTokenPayload)
      mockIsTokenExpired.mockReturnValue(false)
      mockDbUser.mockResolvedValue(userWithoutName)
      mockGenerateAccessToken.mockReturnValue('new-access-token')
      mockGenerateRefreshToken.mockReturnValue('new-refresh-token')

      const req = createMockRequest('POST', 'http://localhost/api/auth/mobile/refresh', validRefreshData)

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user.name).toBeUndefined()
    })

    it('should verify token expiration before processing', async () => {
      mockVerifyToken.mockReturnValue(mockTokenPayload)
      mockIsTokenExpired.mockReturnValue(false)
      mockDbUser.mockResolvedValue(mockUser)

      const req = createMockRequest('POST', 'http://localhost/api/auth/mobile/refresh', validRefreshData)

      await POST(req)

      expect(mockIsTokenExpired).toHaveBeenCalledWith(mockTokenPayload)
    })
  })

  describe('GET', () => {
    it('should return 405 Method Not Allowed', async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(405)
      expect(data.error).toBe('Method not allowed')
    })
  })
})
