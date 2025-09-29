/**
 * Rate Limit Middleware Tests
 *
 * Tests for interface → type conversion for Issue #300 Phase 1E
 * Following TDD approach
 */

import { NextRequest, NextResponse } from "next/server"
import {
  rateLimit,
  authRateLimit,
  apiRateLimit,
  withRateLimit,
  createRedisRateLimitStore,
} from "@/lib/middleware/rate-limit"

// Mock NextRequest and NextResponse for testing
jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({
      body,
      status: init?.status || 200,
      headers: init?.headers || {},
    })),
  },
}))

// Mock IP utils
jest.mock("@/lib/utils/ip-utils", () => ({
  generateRateLimitKey: jest.fn((req, prefix) => `${prefix}:test-ip`),
}))

// Mock NextRequest for testing
const createMockRequest = (
  headers: Record<string, string> = {}
): NextRequest => {
  const mockHeaders = new Map(Object.entries(headers))
  return {
    headers: {
      get: (key: string) => mockHeaders.get(key) || null,
    },
  } as NextRequest
}

describe("Rate Limit Middleware - Interface → Type Conversion Tests", () => {
  describe("Interface → Type Conversion", () => {
    it("should fail: All interfaces should be converted to types", () => {
      // This test will fail until we convert interfaces to types
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs")
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path")
      const rateLimitSource = fs.readFileSync(
        path.join(process.cwd(), "lib/middleware/rate-limit.ts"),
        "utf8"
      )

      // Should NOT contain any interface definitions
      const interfaceMatches = rateLimitSource.match(/^interface\s+\w+/gm) || []
      expect(interfaceMatches.length).toBe(0)

      // Should contain type definitions instead
      const typeMatches = rateLimitSource.match(/^type\s+\w+\s*=/gm) || []
      expect(typeMatches.length).toBe(4) // 4 interfaces should become 4 types
    })
  })

  describe("Type Safety Validation", () => {
    it("should maintain backward compatibility for rateLimit function", async () => {
      const request = createMockRequest()

      const config = {
        windowMs: 60000,
        maxRequests: 10,
        message: "Test rate limit exceeded",
      }

      const rateLimiter = rateLimit(config)
      const result = await rateLimiter(request)

      // First request should be allowed (null response)
      expect(result).toBeNull()
    })

    it("should maintain backward compatibility for createRedisRateLimitStore", () => {
      const mockRedisClient = {
        get: jest.fn().mockResolvedValue(null),
        setex: jest.fn().mockResolvedValue("OK"),
        del: jest.fn().mockResolvedValue(1),
      }

      const store = createRedisRateLimitStore(mockRedisClient)

      expect(store).toBeDefined()
      expect(typeof store.get).toBe("function")
      expect(typeof store.set).toBe("function")
      expect(typeof store.delete).toBe("function")
    })

    it("should properly type all converted interfaces", async () => {
      // Test RedisClient type
      const mockRedisClient = {
        get: jest.fn().mockResolvedValue('{"count":1,"resetTime":123456}'),
        setex: jest.fn().mockResolvedValue("OK"),
        del: jest.fn().mockResolvedValue(1),
      }

      // Test RateLimitConfig type
      const config = {
        windowMs: 60000,
        maxRequests: 10,
        message: "Custom message",
        keyGenerator: (_req: NextRequest) => "custom-key", // eslint-disable-line @typescript-eslint/no-unused-vars
      }

      // Test RateLimitEntry type (implicitly through store operations)
      const store = createRedisRateLimitStore(mockRedisClient)
      const entry = await store.get("test-key")

      // These should not throw TypeScript errors
      expect(mockRedisClient.get).toBeDefined()
      expect(config.windowMs).toBe(60000)
      expect(entry).toBeDefined()
    })
  })

  describe("Functional Behavior (should remain unchanged)", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should allow requests within rate limit", async () => {
      const request = createMockRequest()

      const rateLimiter = rateLimit({
        windowMs: 60000,
        maxRequests: 5,
      })

      // First few requests should be allowed
      const result1 = await rateLimiter(request)
      const result2 = await rateLimiter(request)
      const result3 = await rateLimiter(request)

      expect(result1).toBeNull()
      expect(result2).toBeNull()
      expect(result3).toBeNull()
    })

    it("should block requests exceeding rate limit", async () => {
      const request = createMockRequest()

      const rateLimiter = rateLimit({
        windowMs: 60000,
        maxRequests: 2,
      })

      // First two requests should be allowed
      await rateLimiter(request)
      await rateLimiter(request)

      // Third request should be blocked
      const result = await rateLimiter(request)

      expect(result).not.toBeNull()
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.any(String),
          retryAfter: expect.any(Number),
        }),
        expect.objectContaining({
          status: 429,
          headers: expect.any(Object),
        })
      )
    })

    it("should handle custom key generator", async () => {
      const request = createMockRequest()

      const customKeyGenerator = jest.fn().mockReturnValue("custom-key")

      const rateLimiter = rateLimit({
        windowMs: 60000,
        maxRequests: 5,
        keyGenerator: customKeyGenerator,
      })

      await rateLimiter(request)

      expect(customKeyGenerator).toHaveBeenCalledWith(request)
    })

    it("should handle withRateLimit wrapper", async () => {
      const request = createMockRequest()
      const mockHandler = jest
        .fn()
        .mockResolvedValue({ status: 200, body: "success" })

      const rateLimiter = jest.fn().mockResolvedValue(null) // Allow request

      const wrappedHandler = withRateLimit(rateLimiter, mockHandler)
      const result = await wrappedHandler(request)

      expect(rateLimiter).toHaveBeenCalledWith(request)
      expect(mockHandler).toHaveBeenCalledWith(request)
      expect(result).toEqual({ status: 200, body: "success" })
    })

    it("should block in withRateLimit when rate limited", async () => {
      const request = createMockRequest()
      const mockHandler = jest.fn()

      const rateLimitResponse = { status: 429, body: "Rate limited" }
      const rateLimiter = jest.fn().mockResolvedValue(rateLimitResponse)

      const wrappedHandler = withRateLimit(rateLimiter, mockHandler)
      const result = await wrappedHandler(request)

      expect(rateLimiter).toHaveBeenCalledWith(request)
      expect(mockHandler).not.toHaveBeenCalled()
      expect(result).toBe(rateLimitResponse)
    })

    it("should handle authRateLimit preset", async () => {
      const request = createMockRequest()

      // authRateLimit should be a function that returns a rate limiter
      const result = await authRateLimit(request)

      // First request should be allowed
      expect(result).toBeNull()
    })

    it("should handle apiRateLimit preset", async () => {
      const request = createMockRequest()

      // apiRateLimit should be a function that returns a rate limiter
      const result = await apiRateLimit(request)

      // First request should be allowed
      expect(result).toBeNull()
    })
  })
})
