import { NextRequest, NextResponse } from 'next/server'
import { POST, GET } from '@/app/api/auth/mobile/refresh/route'
import { mockUser, resetDbMocks } from '@/__mocks__/lib/db'
import { verifyToken, generateAccessToken, generateRefreshToken, isTokenExpired } from '@/lib/auth-utils'
import { authRateLimit } from '@/lib/middleware/rate-limit'

// Mock dependencies
jest.mock('@/lib/db')
jest.mock('@/lib/auth-utils')
jest.mock('@/lib/middleware/rate-limit')
const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>
const mockGenerateAccessToken = generateAccessToken as jest.MockedFunction<typeof generateAccessToken>
const mockGenerateRefreshToken = generateRefreshToken as jest.MockedFunction<typeof generateRefreshToken>
const mockIsTokenExpired = isTokenExpired as jest.MockedFunction<typeof isTokenExpired>
const mockAuthRateLimit = authRateLimit as jest.MockedFunction<typeof authRateLimit>

describe('/api/auth/mobile/refresh', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetDbMocks()
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
      email: 'test@example.com',
      name: 'Test User',
      role: 'USER'
    }

    it('should successfully refresh tokens with valid refresh token', async () => {
      mockVerifyToken.mockReturnValue(mockTokenPayload)
      mockIsTokenExpired.mockReturnValue(false)
      mockUser.findUnique.mockResolvedValue(mockUser)
      mockGenerateAccessToken.mockReturnValue('new-access-token')
      mockGenerateRefreshToken.mockReturnValue('new-refresh-token')

      const req = new NextRequest('http://localhost/api/auth/mobile/refresh', {
        method: 'POST',
        body: JSON.stringify(validRefreshData)
      })

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
      expect(mockUser.findUnique).toHaveBeenCalledWith({
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

      const req = new NextRequest('http://localhost/api/auth/mobile/refresh', {
        method: 'POST',
        body: JSON.stringify(validRefreshData)
      })

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

      const req = new NextRequest('http://localhost/api/auth/mobile/refresh', {
        method: 'POST',
        body: JSON.stringify(validRefreshData)
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Refresh token has expired')
    })

    it('should return 401 when user not found in database', async () => {
      mockVerifyToken.mockReturnValue(mockTokenPayload)
      mockIsTokenExpired.mockReturnValue(false)
      mockUser.findUnique.mockResolvedValue(null)

      const req = new NextRequest('http://localhost/api/auth/mobile/refresh', {
        method: 'POST',
        body: JSON.stringify(validRefreshData)
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('User not found')
    })

    it('should return 400 for missing refresh token', async () => {
      const invalidData = {}

      const req = new NextRequest('http://localhost/api/auth/mobile/refresh', {
        method: 'POST',
        body: JSON.stringify(invalidData)
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('required')
    })

    it('should return 400 for empty refresh token', async () => {
      const invalidData = {
        refreshToken: ''
      }

      const req = new NextRequest('http://localhost/api/auth/mobile/refresh', {
        method: 'POST',
        body: JSON.stringify(invalidData)
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should handle database errors gracefully', async () => {
      mockVerifyToken.mockReturnValue(mockTokenPayload)
      mockIsTokenExpired.mockReturnValue(false)
      mockUser.findUnique.mockRejectedValue(new Error('Database connection failed'))

      const req = new NextRequest('http://localhost/api/auth/mobile/refresh', {
        method: 'POST',
        body: JSON.stringify(validRefreshData)
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Token refresh failed')
    })

    it('should handle malformed JSON gracefully', async () => {
      const req = new NextRequest('http://localhost/api/auth/mobile/refresh', {
        method: 'POST',
        body: 'invalid-json'
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Token refresh failed')
    })

    it('should apply rate limiting', async () => {
      const rateLimitResponse = NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
      mockAuthRateLimit.mockResolvedValue(rateLimitResponse)

      const req = new NextRequest('http://localhost/api/auth/mobile/refresh', {
        method: 'POST',
        body: JSON.stringify(validRefreshData)
      })

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
      mockUser.findUnique.mockResolvedValue(updatedUser)
      mockGenerateAccessToken.mockReturnValue('new-access-token')
      mockGenerateRefreshToken.mockReturnValue('new-refresh-token')

      const req = new NextRequest('http://localhost/api/auth/mobile/refresh', {
        method: 'POST',
        body: JSON.stringify(validRefreshData)
      })

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
      mockUser.findUnique.mockResolvedValue(userWithoutRole)
      mockGenerateAccessToken.mockReturnValue('new-access-token')
      mockGenerateRefreshToken.mockReturnValue('new-refresh-token')

      const req = new NextRequest('http://localhost/api/auth/mobile/refresh', {
        method: 'POST',
        body: JSON.stringify(validRefreshData)
      })

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
      mockUser.findUnique.mockResolvedValue(userWithoutName)
      mockGenerateAccessToken.mockReturnValue('new-access-token')
      mockGenerateRefreshToken.mockReturnValue('new-refresh-token')

      const req = new NextRequest('http://localhost/api/auth/mobile/refresh', {
        method: 'POST',
        body: JSON.stringify(validRefreshData)
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user.name).toBeUndefined()
    })

    it('should verify token expiration before processing', async () => {
      mockVerifyToken.mockReturnValue(mockTokenPayload)
      mockIsTokenExpired.mockReturnValue(false)
      mockUser.findUnique.mockResolvedValue(mockUser)

      const req = new NextRequest('http://localhost/api/auth/mobile/refresh', {
        method: 'POST',
        body: JSON.stringify(validRefreshData)
      })

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
