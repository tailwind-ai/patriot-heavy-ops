import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { env } from "@/env.mjs"

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * JWT token payload interface
 */
export interface JWTPayload {
  userId: string
  email: string
  role?: string
  iat?: number
  exp?: number
}

/**
 * Generate a JWT access token
 */
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(
    payload,
    env.NEXTAUTH_SECRET,
    { 
      expiresIn: '15m',
      issuer: 'patriot-heavy-ops',
      audience: 'mobile-app'
    }
  )
}

/**
 * Generate a JWT refresh token
 */
export function generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(
    payload,
    env.NEXTAUTH_SECRET,
    { 
      expiresIn: '7d',
      issuer: 'patriot-heavy-ops',
      audience: 'mobile-app'
    }
  )
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, env.NEXTAUTH_SECRET, {
      issuer: 'patriot-heavy-ops',
      audience: 'mobile-app'
    }) as JWTPayload
    
    return decoded
  } catch (error) {
    // Token is invalid, expired, or malformed
    return null
  }
}

/**
 * Extract Bearer token from Authorization header
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  return authHeader.substring(7) // Remove 'Bearer ' prefix
}

/**
 * Check if a token is expired (with 30 second buffer)
 */
export function isTokenExpired(payload: JWTPayload): boolean {
  if (!payload.exp) return true
  
  const now = Math.floor(Date.now() / 1000)
  const buffer = 30 // 30 second buffer
  
  return payload.exp <= (now + buffer)
}
