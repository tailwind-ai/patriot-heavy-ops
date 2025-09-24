import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  extractBearerToken,
  isTokenExpired,
} from '@/lib/auth-utils'
import { JWTPayload } from '@/types/mobile-auth'

// Mock environment variables
jest.mock('@/env.mjs', () => ({
  env: {
    NEXTAUTH_SECRET: 'test-secret-key-for-jwt-signing'
  }
}))

describe('Auth Utils', () => {
  describe('Password hashing and verification', () => {
    it('should hash a password', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)
      
      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(50) // bcrypt hashes are typically 60 chars
    })

    it('should verify a correct password', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)
      
      const isValid = await verifyPassword(password, hash)
      expect(isValid).toBe(true)
    })

    it('should reject an incorrect password', async () => {
      const password = 'testpassword123'
      const wrongPassword = 'wrongpassword'
      const hash = await hashPassword(password)
      
      const isValid = await verifyPassword(wrongPassword, hash)
      expect(isValid).toBe(false)
    })
  })

  describe('JWT token generation', () => {
    const mockPayload = {
      userId: 'user-123',
      email: 'test@example.com',
      role: 'USER'
    }

    it('should generate an access token', () => {
      const token = generateAccessToken(mockPayload)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })

    it('should generate a refresh token', () => {
      const token = generateRefreshToken(mockPayload)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })

    it('should generate valid tokens consistently', () => {
      const token1 = generateAccessToken(mockPayload)
      const token2 = generateAccessToken(mockPayload)
      
      // Both tokens should be valid and contain the same user data
      const decoded1 = verifyToken(token1)
      const decoded2 = verifyToken(token2)
      
      expect(decoded1).toBeDefined()
      expect(decoded2).toBeDefined()
      expect(decoded1?.userId).toBe(mockPayload.userId)
      expect(decoded2?.userId).toBe(mockPayload.userId)
      expect(decoded1?.email).toBe(mockPayload.email)
      expect(decoded2?.email).toBe(mockPayload.email)
    })
  })

  describe('JWT token verification', () => {
    const mockPayload = {
      userId: 'user-123',
      email: 'test@example.com',
      role: 'USER'
    }

    it('should verify a valid access token', () => {
      const token = generateAccessToken(mockPayload)
      const decoded = verifyToken(token)
      
      expect(decoded).toBeDefined()
      expect(decoded?.userId).toBe(mockPayload.userId)
      expect(decoded?.email).toBe(mockPayload.email)
      expect(decoded?.role).toBe(mockPayload.role)
      expect(decoded?.iat).toBeDefined()
      expect(decoded?.exp).toBeDefined()
    })

    it('should verify a valid refresh token', () => {
      const token = generateRefreshToken(mockPayload)
      const decoded = verifyToken(token)
      
      expect(decoded).toBeDefined()
      expect(decoded?.userId).toBe(mockPayload.userId)
      expect(decoded?.email).toBe(mockPayload.email)
      expect(decoded?.role).toBe(mockPayload.role)
    })

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid.jwt.token'
      const decoded = verifyToken(invalidToken)
      
      expect(decoded).toBeNull()
    })

    it('should return null for malformed token', () => {
      const malformedToken = 'not-a-jwt-token'
      const decoded = verifyToken(malformedToken)
      
      expect(decoded).toBeNull()
    })

    it('should return null for empty token', () => {
      const decoded = verifyToken('')
      
      expect(decoded).toBeNull()
    })
  })

  describe('Bearer token extraction', () => {
    it('should extract token from valid Bearer header', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
      const authHeader = `Bearer ${token}`
      
      const extracted = extractBearerToken(authHeader)
      expect(extracted).toBe(token)
    })

    it('should return null for missing Bearer prefix', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
      
      const extracted = extractBearerToken(token)
      expect(extracted).toBeNull()
    })

    it('should return null for null header', () => {
      const extracted = extractBearerToken(null)
      expect(extracted).toBeNull()
    })

    it('should return null for empty header', () => {
      const extracted = extractBearerToken('')
      expect(extracted).toBeNull()
    })

    it('should handle Bearer with extra spaces', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
      const authHeader = `Bearer  ${token}` // Extra space
      
      const extracted = extractBearerToken(authHeader)
      expect(extracted).toBe(` ${token}`) // Should include the extra space
    })
  })

  describe('Token expiration checking', () => {
    it('should detect expired token', () => {
      const expiredPayload: JWTPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        exp: Math.floor(Date.now() / 1000) - 3600 // Expired 1 hour ago
      }
      
      const isExpired = isTokenExpired(expiredPayload)
      expect(isExpired).toBe(true)
    })

    it('should detect valid token', () => {
      const validPayload: JWTPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        exp: Math.floor(Date.now() / 1000) + 3600 // Expires in 1 hour
      }
      
      const isExpired = isTokenExpired(validPayload)
      expect(isExpired).toBe(false)
    })

    it('should consider token expired if no exp field', () => {
      const noExpPayload: JWTPayload = {
        userId: 'user-123',
        email: 'test@example.com'
        // No exp field
      }
      
      const isExpired = isTokenExpired(noExpPayload)
      expect(isExpired).toBe(true)
    })

    it('should apply 30 second buffer for expiration', () => {
      const almostExpiredPayload: JWTPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        exp: Math.floor(Date.now() / 1000) + 15 // Expires in 15 seconds
      }
      
      const isExpired = isTokenExpired(almostExpiredPayload)
      expect(isExpired).toBe(true) // Should be considered expired due to 30s buffer
    })

    it('should not expire token with sufficient time remaining', () => {
      const validPayload: JWTPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        exp: Math.floor(Date.now() / 1000) + 60 // Expires in 60 seconds
      }
      
      const isExpired = isTokenExpired(validPayload)
      expect(isExpired).toBe(false) // Should not be expired (60s > 30s buffer)
    })
  })

  describe('Integration tests', () => {
    it('should create and verify token end-to-end', () => {
      const payload = {
        userId: 'user-456',
        email: 'integration@test.com',
        role: 'ADMIN'
      }
      
      // Generate token
      const token = generateAccessToken(payload)
      
      // Verify token
      const decoded = verifyToken(token)
      
      expect(decoded).toBeDefined()
      expect(decoded?.userId).toBe(payload.userId)
      expect(decoded?.email).toBe(payload.email)
      expect(decoded?.role).toBe(payload.role)
      
      // Check expiration
      expect(isTokenExpired(decoded!)).toBe(false)
    })

    it('should handle token lifecycle correctly', () => {
      const payload = {
        userId: 'user-789',
        email: 'lifecycle@test.com'
      }
      
      // Generate both token types
      const accessToken = generateAccessToken(payload)
      const refreshToken = generateRefreshToken(payload)
      
      // Both should be valid
      const accessDecoded = verifyToken(accessToken)
      const refreshDecoded = verifyToken(refreshToken)
      
      expect(accessDecoded).toBeDefined()
      expect(refreshDecoded).toBeDefined()
      
      // Both should have same user data
      expect(accessDecoded?.userId).toBe(refreshDecoded?.userId)
      expect(accessDecoded?.email).toBe(refreshDecoded?.email)
      
      // Refresh token should have longer expiry
      expect(refreshDecoded?.exp).toBeGreaterThan(accessDecoded?.exp!)
    })
  })
})