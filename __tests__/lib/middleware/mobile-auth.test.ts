import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth/next'
import {
  authenticateRequest,
  requireAuth,
  hasRole,
  requireRole
} from '@/lib/middleware/mobile-auth'
import { generateAccessToken } from '@/lib/auth-utils'
import { mockUser as mockDbUser, resetDbMocks } from '@/__mocks__/lib/db'
import { createMockRequest } from '@/__tests__/helpers/api-test-helpers'

// Mock dependencies
jest.mock('next-auth/next')
jest.mock('@/lib/db')
jest.mock('@/lib/auth-utils')
jest.mock('@/lib/auth')

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>
const mockGenerateAccessToken = generateAccessToken as jest.MockedFunction<typeof generateAccessToken>

describe('Mobile Authentication Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetDbMocks()
  })

  describe('authenticateRequest', () => {
    it('should authenticate with valid JWT Bearer token', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'USER'
      }

      // Mock database user lookup
      mockDbUser.findUnique.mockResolvedValue(mockUser)

      // Create a mock request with Bearer token
      const token = 'valid.jwt.token'
      const req = createMockRequest('GET', 'http://localhost/api/test', undefined, {
        authorization: `Bearer ${token}`
      })

      // Mock token verification (this would normally be done by verifyToken)
      jest.doMock('@/lib/auth-utils', () => ({
        ...jest.requireActual('@/lib/auth-utils'),
        verifyToken: jest.fn().mockReturnValue({
          userId: mockUser.id,
          email: mockUser.email,
          role: mockUser.role
        })
      }))

      const result = await authenticateRequest(req)

      expect(result.isAuthenticated).toBe(true)
      expect(result.user).toEqual(mockUser)
      expect(result.authMethod).toBe('jwt')
    })

    it('should fallback to session authentication when no Bearer token', async () => {
      const mockSession = {
        user: {
          id: 'user-456',
          email: 'session@example.com',
          role: 'ADMIN'
        }
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const req = createMockRequest('GET','http://localhost/api/test')

      const result = await authenticateRequest(req)

      expect(result.isAuthenticated).toBe(true)
      expect(result.user).toEqual({
        id: mockSession.user.id,
        email: mockSession.user.email,
        role: mockSession.user.role
      })
      expect(result.authMethod).toBe('session')
    })

    it('should return unauthenticated when no valid auth found', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const req = createMockRequest('GET','http://localhost/api/test')

      const result = await authenticateRequest(req)

      expect(result.isAuthenticated).toBe(false)
      expect(result.user).toBeUndefined()
      expect(result.error).toBe('No valid authentication found')
    })

    it('should handle invalid JWT token gracefully', async () => {
      const req = createMockRequest('GET','http://localhost/api/test', {
        headers: {
          authorization: 'Bearer invalid.token'
        }
      })

      // Mock invalid token verification
      jest.doMock('@/lib/auth-utils', () => ({
        ...jest.requireActual('@/lib/auth-utils'),
        verifyToken: jest.fn().mockReturnValue(null)
      }))

      mockGetServerSession.mockResolvedValue(null)

      const result = await authenticateRequest(req)

      expect(result.isAuthenticated).toBe(false)
      expect(result.error).toBe('No valid authentication found')
    })

    it('should handle database errors during JWT auth', async () => {
      const req = createMockRequest('GET','http://localhost/api/test', {
        headers: {
          authorization: 'Bearer valid.token'
        }
      })

      // Mock token verification success but database error
      jest.doMock('@/lib/auth-utils', () => ({
        ...jest.requireActual('@/lib/auth-utils'),
        verifyToken: jest.fn().mockReturnValue({
          userId: 'user-123',
          email: 'test@example.com',
        })
      }))

      mockDbUser.findUnique.mockRejectedValue(new Error('Database error'))
      mockGetServerSession.mockResolvedValue(null)

      const result = await authenticateRequest(req)

      expect(result.isAuthenticated).toBe(false)
      expect(result.error).toBe('No valid authentication found')
    })

    it('should handle user not found in database', async () => {
      const req = createMockRequest('GET','http://localhost/api/test', {
        headers: {
          authorization: 'Bearer valid.token'
        }
      })

      jest.doMock('@/lib/auth-utils', () => ({
        ...jest.requireActual('@/lib/auth-utils'),
        verifyToken: jest.fn().mockReturnValue({
          userId: 'nonexistent-user',
          email: 'test@example.com',
        })
      }))

      mockDbUser.findUnique.mockResolvedValue(null)
      mockGetServerSession.mockResolvedValue(null)

      const result = await authenticateRequest(req)

      expect(result.isAuthenticated).toBe(false)
      expect(result.error).toBe('No valid authentication found')
    })
  })

  describe('requireAuth', () => {
    it('should return user when authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'USER'
      }

      mockDbUser.findUnique.mockResolvedValue(mockUser)

      const req = createMockRequest('GET','http://localhost/api/test', {
        headers: {
          authorization: 'Bearer valid.token'
        }
      })

      jest.doMock('@/lib/auth-utils', () => ({
        ...jest.requireActual('@/lib/auth-utils'),
        verifyToken: jest.fn().mockReturnValue({
          userId: mockUser.id,
          email: mockUser.email,
          role: mockUser.role
        })
      }))

      const user = await requireAuth(req)

      expect(user).toEqual(mockUser)
    })

    it('should throw 401 response when not authenticated', async () => {
      const req = createMockRequest('GET','http://localhost/api/test')
      mockGetServerSession.mockResolvedValue(null)

      await expect(requireAuth(req)).rejects.toThrow()
    })
  })

  describe('hasRole', () => {
    it('should return true for exact role match', () => {
      const user = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'MANAGER'
      }

      expect(hasRole(user, 'MANAGER')).toBe(true)
    })

    it('should return true for admin role regardless of required role', () => {
      const user = {
        id: 'user-123',
        email: 'admin@example.com',
        role: 'admin'
      }

      expect(hasRole(user, 'USER')).toBe(true)
      expect(hasRole(user, 'MANAGER')).toBe(true)
    })

    it('should return false for role mismatch', () => {
      const user = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'USER'
      }

      expect(hasRole(user, 'MANAGER')).toBe(false)
    })

    it('should return false when user has no role', () => {
      const user = {
        id: 'user-123',
        email: 'test@example.com',
      }

      expect(hasRole(user, 'USER')).toBe(false)
    })

    it('should return false when user is undefined', () => {
      expect(hasRole(undefined, 'USER')).toBe(false)
    })
  })

  describe('requireRole', () => {
    it('should return user when role matches', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'manager@example.com',
        role: 'MANAGER'
      }

      mockDbUser.findUnique.mockResolvedValue(mockUser)

      const req = createMockRequest('GET','http://localhost/api/test', {
        headers: {
          authorization: 'Bearer valid.token'
        }
      })

      jest.doMock('@/lib/auth-utils', () => ({
        ...jest.requireActual('@/lib/auth-utils'),
        verifyToken: jest.fn().mockReturnValue({
          userId: mockUser.id,
          email: mockUser.email,
          role: mockUser.role
        })
      }))

      const user = await requireRole(req, 'MANAGER')

      expect(user).toEqual(mockUser)
    })

    it('should throw 403 response when role insufficient', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        role: 'USER'
      }

      mockDbUser.findUnique.mockResolvedValue(mockUser)

      const req = createMockRequest('GET','http://localhost/api/test', {
        headers: {
          authorization: 'Bearer valid.token'
        }
      })

      jest.doMock('@/lib/auth-utils', () => ({
        ...jest.requireActual('@/lib/auth-utils'),
        verifyToken: jest.fn().mockReturnValue({
          userId: mockUser.id,
          email: mockUser.email,
          role: mockUser.role
        })
      }))

      await expect(requireRole(req, 'MANAGER')).rejects.toThrow()
    })

    it('should allow admin role for any required role', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'admin@example.com',
        role: 'admin'
      }

      mockDbUser.findUnique.mockResolvedValue(mockUser)

      const req = createMockRequest('GET','http://localhost/api/test', {
        headers: {
          authorization: 'Bearer valid.token'
        }
      })

      jest.doMock('@/lib/auth-utils', () => ({
        ...jest.requireActual('@/lib/auth-utils'),
        verifyToken: jest.fn().mockReturnValue({
          userId: mockUser.id,
          email: mockUser.email,
          role: mockUser.role
        })
      }))

      const user = await requireRole(req, 'MANAGER')

      expect(user).toEqual(mockUser)
    })
  })

  describe('Backward compatibility', () => {
    it('should maintain compatibility with existing session-based routes', async () => {
      const mockSession = {
        user: {
          id: 'user-789',
          email: 'legacy@example.com',
          role: 'USER'
        }
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      // Request without Bearer token (legacy behavior)
      const req = createMockRequest('GET','http://localhost/api/legacy')

      const result = await authenticateRequest(req)

      expect(result.isAuthenticated).toBe(true)
      expect(result.authMethod).toBe('session')
      expect(result.user).toEqual({
        id: mockSession.user.id,
        email: mockSession.user.email,
        role: mockSession.user.role
      })
    })

    it('should prioritize JWT auth over session auth when both present', async () => {
      const mockJwtUser = {
        id: 'jwt-user',
        email: 'jwt@example.com',
        role: 'USER'
      }

      const mockSession = {
        user: {
          id: 'session-user',
          email: 'session@example.com',
          role: 'USER'
        }
      }

      mockDbUser.findUnique.mockResolvedValue(mockJwtUser)
      mockGetServerSession.mockResolvedValue(mockSession)

      const req = createMockRequest('GET','http://localhost/api/test', {
        headers: {
          authorization: 'Bearer valid.token'
        }
      })

      jest.doMock('@/lib/auth-utils', () => ({
        ...jest.requireActual('@/lib/auth-utils'),
        verifyToken: jest.fn().mockReturnValue({
          userId: mockJwtUser.id,
          email: mockJwtUser.email,
          role: mockJwtUser.role
        })
      }))

      const result = await authenticateRequest(req)

      expect(result.isAuthenticated).toBe(true)
      expect(result.authMethod).toBe('jwt')
      expect(result.user?.id).toBe(mockJwtUser.id) // Should use JWT user, not session user
    })
  })
})
