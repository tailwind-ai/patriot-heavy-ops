import { NextRequest } from "next/server"

/**
 * Extract client IP address from NextRequest
 * Handles various proxy headers and fallbacks
 */
export function extractClientIP(req: NextRequest): string {
  // Check x-forwarded-for header (most common proxy header)
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    const firstIp = forwarded.split(',')[0]
    return firstIp ? firstIp.trim() : 'unknown'
  }

  // Check x-real-ip header (nginx proxy)
  const realIp = req.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  // Check x-client-ip header (some proxies)
  const clientIp = req.headers.get('x-client-ip')
  if (clientIp) {
    return clientIp.trim()
  }

  // Check cf-connecting-ip header (Cloudflare)
  const cfIp = req.headers.get('cf-connecting-ip')
  if (cfIp) {
    return cfIp.trim()
  }

  // Fallback to unknown if no IP can be determined
  return 'unknown'
}

/**
 * Generate a rate limit key based on IP address and prefix
 */
export function generateRateLimitKey(req: NextRequest, prefix: string): string {
  const ip = extractClientIP(req)
  return `${prefix}:${ip}`
}
