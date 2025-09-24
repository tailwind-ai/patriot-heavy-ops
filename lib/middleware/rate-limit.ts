import { NextRequest, NextResponse } from "next/server"
import { generateRateLimitKey } from "@/lib/utils/ip-utils"

/**
 * Redis client interface for rate limiting
 * Compatible with popular Redis clients like ioredis and node-redis
 */
interface RedisClient {
  get(key: string): Promise<string | null>
  setex(key: string, seconds: number, value: string): Promise<string>
  del(key: string): Promise<number>
}

/**
 * Rate limiting configuration
 */
interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  message?: string
  keyGenerator?: (req: NextRequest) => string
  store?: RateLimitStore
}

/**
 * Rate limit entry
 */
interface RateLimitEntry {
  count: number
  resetTime: number
}

/**
 * Rate limit store interface for different storage backends
 */
interface RateLimitStore {
  get(key: string): Promise<RateLimitEntry | null>
  set(key: string, entry: RateLimitEntry): Promise<void>
  delete(key: string): Promise<void>
  cleanup?(): Promise<void>
}

/**
 * In-memory rate limit store implementation
 * Suitable for single-instance deployments or development
 */
class MemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, RateLimitEntry>()
  private lastCleanup = Date.now()
  private readonly cleanupInterval = 60000 // 1 minute

  async get(key: string): Promise<RateLimitEntry | null> {
    // Lazy cleanup to avoid setInterval in serverless environments
    await this.lazyCleanup()
    return this.store.get(key) || null
  }

  async set(key: string, entry: RateLimitEntry): Promise<void> {
    this.store.set(key, entry)
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }

  private async lazyCleanup(): Promise<void> {
    const now = Date.now()
    if (now - this.lastCleanup < this.cleanupInterval) {
      return
    }

    this.lastCleanup = now
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key)
      }
    }
  }
}

/**
 * Redis-based rate limit store implementation
 * Suitable for multi-instance production deployments
 */
class RedisRateLimitStore implements RateLimitStore {
  private redis: RedisClient

  constructor(redisClient: RedisClient) {
    this.redis = redisClient
  }

  async get(key: string): Promise<RateLimitEntry | null> {
    try {
      const data = await this.redis.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Redis rate limit get error:', error)
      return null
    }
  }

  async set(key: string, entry: RateLimitEntry): Promise<void> {
    try {
      const ttl = Math.ceil((entry.resetTime - Date.now()) / 1000)
      if (ttl > 0) {
        await this.redis.setex(key, ttl, JSON.stringify(entry))
      }
    } catch (error) {
      console.error('Redis rate limit set error:', error)
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key)
    } catch (error) {
      console.error('Redis rate limit delete error:', error)
    }
  }
}

/**
 * Default in-memory store instance
 */
const defaultStore = new MemoryRateLimitStore()

/**
 * Create a Redis store instance (optional, requires Redis client)
 */
export function createRedisRateLimitStore(redisClient: RedisClient): RateLimitStore {
  return new RedisRateLimitStore(redisClient)
}

/**
 * Default key generator using IP address
 */
function defaultKeyGenerator(req: NextRequest): string {
  return generateRateLimitKey(req, 'rate_limit')
}

/**
 * Rate limiting middleware
 */
export function rateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests, please try again later',
    keyGenerator = defaultKeyGenerator,
    store = defaultStore
  } = config

  return async (req: NextRequest): Promise<NextResponse | null> => {
    const key = keyGenerator(req)
    const now = Date.now()
    const resetTime = now + windowMs

    let entry = await store.get(key)

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      entry = {
        count: 1,
        resetTime
      }
      await store.set(key, entry)
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
    await store.set(key, entry)

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
  keyGenerator: (req: NextRequest) => generateRateLimitKey(req, 'auth_rate_limit')
})

/**
 * General API rate limiter
 * Less restrictive for general API usage
 */
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  message: 'API rate limit exceeded, please slow down',
  keyGenerator: (req: NextRequest) => generateRateLimitKey(req, 'api_rate_limit')
})

/**
 * Apply rate limiting to a request handler
 */
export function withRateLimit<T extends unknown[]>(
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
