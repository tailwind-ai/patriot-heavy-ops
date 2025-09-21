import { NextRequest, NextResponse } from "next/server"

/**
 * Security middleware for debugging endpoints
 * Provides multiple layers of protection for sensitive endpoints
 */

export interface SecurityConfig {
  requireAuth?: boolean
  allowedIPs?: string[]
  requireApiKey?: boolean
  environmentOnly?: string[]
}

/**
 * Check if request is from allowed IP addresses
 */
function isAllowedIP(request: NextRequest, allowedIPs: string[]): boolean {
  const clientIP = request.headers.get("x-forwarded-for") || 
                   request.headers.get("x-real-ip") || 
                   "unknown"
  
  return allowedIPs.includes(clientIP)
}

/**
 * Check if request has valid API key
 */
function hasValidApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key")
  const expectedKey = process.env.DEBUG_API_KEY
  
  return apiKey === expectedKey
}

/**
 * Check if request is from allowed environment
 */
function isAllowedEnvironment(allowedEnvs: string[]): boolean {
  const currentEnv = process.env.NODE_ENV
  return allowedEnvs.includes(currentEnv || "development")
}

/**
 * Security middleware for debugging endpoints
 * 
 * Usage:
 * export async function GET(request: NextRequest) {
 *   const securityCheck = await checkSecurity(request, {
 *     requireAuth: true,
 *     allowedIPs: ["127.0.0.1", "::1"],
 *     environmentOnly: ["development"]
 *   })
 *   
 *   if (!securityCheck.allowed) {
 *     return securityCheck.response
 *   }
 *   
 *   // Your endpoint logic here
 * }
 */
export async function checkSecurity(
  request: NextRequest, 
  config: SecurityConfig
): Promise<{ allowed: boolean; response?: NextResponse }> {
  
  // Environment check
  if (config.environmentOnly && !isAllowedEnvironment(config.environmentOnly)) {
    return {
      allowed: false,
      response: new NextResponse("Endpoint not available in this environment", { status: 403 })
    }
  }

  // IP address check
  if (config.allowedIPs && !isAllowedIP(request, config.allowedIPs)) {
    return {
      allowed: false,
      response: new NextResponse("Access denied from this IP", { status: 403 })
    }
  }

  // API key check
  if (config.requireApiKey && !hasValidApiKey(request)) {
    return {
      allowed: false,
      response: new NextResponse("Invalid or missing API key", { status: 401 })
    }
  }

  // Authentication check (would need to be implemented based on your auth system)
  if (config.requireAuth) {
    // This would need to be implemented based on your authentication system
    // For now, we'll assume it's handled by the calling endpoint
  }

  return { allowed: true }
}

/**
 * Simple environment-only protection for debugging endpoints
 */
export function requireDevelopmentOnly(): boolean {
  return process.env.NODE_ENV === "development"
}

/**
 * IP-based protection for debugging endpoints
 */
export function requireLocalhost(request: NextRequest): boolean {
  const clientIP = request.headers.get("x-forwarded-for") || 
                   request.headers.get("x-real-ip") || 
                   "unknown"
  
  return clientIP === "127.0.0.1" || clientIP === "::1" || clientIP === "localhost"
}
