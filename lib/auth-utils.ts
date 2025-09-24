import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { env } from "@/env.mjs"

/**
 * JWT Configuration Constants
 */
export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  ISSUER: 'patriot-heavy-ops',
  AUDIENCE: 'mobile-app',
  EXPIRATION_BUFFER_SECONDS: 30, // Buffer for clock skew tolerance
} as const

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
      expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE
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
      expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY,
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE
    }
  )
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, env.NEXTAUTH_SECRET, {
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE
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
 * Check if a token is expired (with configurable buffer for clock skew)
 */
export function isTokenExpired(payload: JWTPayload): boolean {
  if (!payload.exp) return true
  
  const now = Math.floor(Date.now() / 1000)
  
  return payload.exp <= (now + JWT_CONFIG.EXPIRATION_BUFFER_SECONDS)
}
