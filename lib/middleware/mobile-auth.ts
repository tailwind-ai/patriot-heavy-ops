import { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { extractBearerToken, verifyToken } from "@/lib/auth-utils"
import { db } from "@/lib/db"

/**
 * Authentication result interface
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
 * Authenticate request using either NextAuth session or JWT Bearer token
 * Maintains backward compatibility with existing session-based auth
 */
export async function authenticateRequest(req: NextRequest): Promise<AuthResult> {
  // First, try JWT Bearer token authentication
  const authHeader = req.headers.get('authorization')
  const bearerToken = extractBearerToken(authHeader)
  
  if (bearerToken) {
    const jwtResult = await authenticateWithJWT(bearerToken)
    if (jwtResult.isAuthenticated) {
      return { ...jwtResult, authMethod: 'jwt' }
    }
  }
  
  // Fallback to NextAuth session authentication
  try {
    const session = await getServerSession(authOptions)
    
    if (session?.user?.id) {
      return {
        isAuthenticated: true,
        user: {
          id: session.user.id,
          email: session.user.email || '',
          role: session.user.role
        },
        authMethod: 'session'
      }
    }
  } catch (error) {
    console.error('Session authentication error:', error)
  }
  
  return {
    isAuthenticated: false,
    error: 'No valid authentication found'
  }
}

/**
 * Authenticate using JWT Bearer token
 */
async function authenticateWithJWT(token: string): Promise<AuthResult> {
  const payload = verifyToken(token)
  
  if (!payload) {
    return {
      isAuthenticated: false,
      error: 'Invalid or expired token'
    }
  }
  
  // Verify user still exists in database
  try {
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true
      }
    })
    
    if (!user) {
      return {
        isAuthenticated: false,
        error: 'User not found'
      }
    }
    
    return {
      isAuthenticated: true,
      user: {
        id: user.id,
        email: user.email || '',
        role: user.role || undefined
      }
    }
  } catch (error) {
    console.error('Database error during JWT authentication:', error)
    return {
      isAuthenticated: false,
      error: 'Authentication failed'
    }
  }
}

/**
 * Middleware helper for API routes that require authentication
 * Returns user info or throws appropriate HTTP response
 */
export async function requireAuth(req: NextRequest): Promise<AuthResult['user']> {
  const authResult = await authenticateRequest(req)
  
  if (!authResult.isAuthenticated || !authResult.user) {
    throw new Response(
      JSON.stringify({ error: authResult.error || 'Authentication required' }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
  
  return authResult.user
}

/**
 * Check if user has required role
 */
export function hasRole(user: AuthResult['user'], requiredRole: string): boolean {
  if (!user?.role) return false
  return user.role === requiredRole || user.role === 'ADMIN'
}

/**
 * Middleware helper for API routes that require specific role
 */
export async function requireRole(req: NextRequest, requiredRole: string): Promise<AuthResult['user']> {
  const user = await requireAuth(req)
  
  if (!hasRole(user, requiredRole)) {
    throw new Response(
      JSON.stringify({ error: 'Insufficient permissions' }),
      { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
  
  return user
}
