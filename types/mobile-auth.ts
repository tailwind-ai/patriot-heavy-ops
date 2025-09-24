/**
 * Mobile Authentication Types
 * 
 * TypeScript interfaces for mobile app authentication
 * including JWT tokens, login/refresh requests and responses
 */

/**
 * JWT token payload structure
 */
export interface JWTPayload {
  userId: string
  email: string
  role?: string
  iat?: number
  exp?: number
}

/**
 * Mobile login request body
 */
export interface MobileLoginRequest {
  email: string
  password: string
}

/**
 * Mobile login response
 */
export interface MobileLoginResponse {
  success: boolean
  accessToken?: string
  refreshToken?: string
  user?: {
    id: string
    email: string
    name?: string
    role?: string
  }
  error?: string
}

/**
 * Token refresh request body
 */
export interface TokenRefreshRequest {
  refreshToken: string
}

/**
 * Token refresh response
 */
export interface TokenRefreshResponse {
  success: boolean
  accessToken?: string
  refreshToken?: string
  user?: {
    id: string
    email: string
    name?: string
    role?: string
  }
  error?: string
}

/**
 * Authentication result from middleware
 */
export interface AuthResult {
  isAuthenticated: boolean
  user?: {
    id: string
    email: string
    role?: string
  }
  authMethod?: 'session' | 'jwt'
  error?: string
}

/**
 * User data structure for authenticated requests
 */
export interface AuthenticatedUser {
  id: string
  email: string
  name?: string
  role?: string
}

/**
 * Mobile API error response
 */
export interface MobileApiError {
  success: false
  error: string
  code?: string
}

/**
 * Mobile API success response wrapper
 */
export interface MobileApiSuccess<T = any> {
  success: true
  data: T
}

/**
 * Generic mobile API response
 */
export type MobileApiResponse<T = any> = MobileApiSuccess<T> | MobileApiError

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  message?: string
}

/**
 * Authentication middleware options
 */
export interface AuthMiddlewareOptions {
  requireAuth?: boolean
  allowedRoles?: string[]
  rateLimit?: RateLimitConfig
}
