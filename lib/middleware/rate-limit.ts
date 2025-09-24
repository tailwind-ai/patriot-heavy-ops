import { NextRequest, NextResponse } from "next/server"

/**
 * Rate limiting configuration
 */
interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  message?: string
  keyGenerator?: (req: NextRequest) => string
}

/**
 * Rate limit entry
 */
interface RateLimitEntry {
  count: number
  resetTime: number
}

/**
 * In-memory rate limit store
 * In production, consider using Redis or similar external store
 */
const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Clean up expired entries periodically
 */
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean up every minute

/**
 * Default key generator using IP address
 */
function defaultKeyGenerator(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown'
  return `rate_limit:${ip}`
}

/**
 * Rate limiting middleware
 */
export function rateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests, please try again later',
    keyGenerator = defaultKeyGenerator
  } = config

  return async (req: NextRequest): Promise<NextResponse | null> => {
    const key = keyGenerator(req)
    const now = Date.now()
    const resetTime = now + windowMs

    let entry = rateLimitStore.get(key)

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      entry = {
        count: 1,
        resetTime
      }
      rateLimitStore.set(key, entry)
      return null // Allow request
    }

    if (entry.count >= maxRequests) {
      // Rate limit exceeded
      return NextResponse.json(
        { 
          success: false,
          error: message,
          retryAfter: Math.ceil((entry.resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString()
          }
        }
      )
    }

    // Increment counter
    entry.count++
    rateLimitStore.set(key, entry)

    return null // Allow request
  }
}

/**
 * Authentication-specific rate limiter
 * More restrictive for login attempts
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  message: 'Too many authentication attempts, please try again in 15 minutes',
  keyGenerator: (req: NextRequest) => {
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown'
    return `auth_rate_limit:${ip}`
  }
})

/**
 * General API rate limiter
 * Less restrictive for general API usage
 */
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  message: 'API rate limit exceeded, please slow down',
  keyGenerator: (req: NextRequest) => {
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown'
    return `api_rate_limit:${ip}`
  }
})

/**
 * Apply rate limiting to a request handler
 */
export function withRateLimit<T extends any[]>(
  rateLimiter: (req: NextRequest) => Promise<NextResponse | null>,
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    const rateLimitResponse = await rateLimiter(req)
    
    if (rateLimitResponse) {
      return rateLimitResponse
    }
    
    return handler(req, ...args)
  }
}
