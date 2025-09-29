/**
 * Security Middleware Tests
 * 
 * Tests for interface → type conversion for Issue #300 Phase 1D
 * Following TDD approach
 */

import { NextRequest } from "next/server"
import {
  checkSecurity,
  requireDevelopmentOnly,
  requireLocalhost,
} from "@/lib/middleware/security"

// Mock NextResponse for testing
jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: jest.fn().mockImplementation((body, init) => ({
    body,
    status: init?.status || 200,
  })),
}))

// Mock NextRequest for testing
const createMockRequest = (headers: Record<string, string> = {}): NextRequest => {
  const mockHeaders = new Map(Object.entries(headers))
  return {
    headers: {
      get: (key: string) => mockHeaders.get(key) || null,
    },
  } as NextRequest
}

describe("Security Middleware - Interface → Type Conversion Tests", () => {
  describe("Interface → Type Conversion", () => {
    it("should fail: SecurityConfig should be a type, not an interface", () => {
      // This test will fail until we convert interface to type
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs")
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path")
      const securitySource = fs.readFileSync(
        path.join(process.cwd(), "lib/middleware/security.ts"),
        "utf8"
      )
      
      // Should NOT contain interface SecurityConfig
      expect(securitySource).not.toMatch(/interface\s+SecurityConfig/)
      
      // Should contain type SecurityConfig
      expect(securitySource).toMatch(/type\s+SecurityConfig\s*=/)
    })
  })

  describe("Type Safety Validation", () => {
    it("should maintain backward compatibility for checkSecurity function", async () => {
      const request = createMockRequest({
        "x-forwarded-for": "127.0.0.1"
      })
      
      const config = {
        requireAuth: false,
        allowedIPs: ["127.0.0.1"],
        requireApiKey: false,
        environmentOnly: ["development", "test"]
      }
      
      const result = await checkSecurity(request, config)
      
      expect(result).toBeDefined()
      expect(typeof result.allowed).toBe("boolean")
    })

    it("should properly type SecurityConfig after conversion", async () => {
      const request = createMockRequest()
      
      // Test that the type definition works correctly with all optional properties
      const minimalConfig = {}
      const fullConfig = {
        requireAuth: true,
        allowedIPs: ["127.0.0.1", "::1"],
        requireApiKey: true,
        environmentOnly: ["development"]
      }
      
      // These should not throw TypeScript errors
      const result1 = await checkSecurity(request, minimalConfig)
      const result2 = await checkSecurity(request, fullConfig)
      
      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
    })
  })

  describe("Functional Behavior (should remain unchanged)", () => {
    // We'll mock NODE_ENV per test instead of in beforeEach/afterEach

    it("should allow access when no restrictions are set", async () => {
      const request = createMockRequest()
      const config = {}
      
      const result = await checkSecurity(request, config)
      
      expect(result.allowed).toBe(true)
      expect(result.response).toBeUndefined()
    })

    it("should block access from disallowed IPs", async () => {
      const request = createMockRequest({
        "x-forwarded-for": "192.168.1.100"
      })
      
      const config = {
        allowedIPs: ["127.0.0.1", "::1"]
      }
      
      const result = await checkSecurity(request, config)
      
      expect(result.allowed).toBe(false)
      expect(result.response).toBeDefined()
    })

    it("should allow access from allowed IPs", async () => {
      const request = createMockRequest({
        "x-forwarded-for": "127.0.0.1"
      })
      
      const config = {
        allowedIPs: ["127.0.0.1", "::1"]
      }
      
      const result = await checkSecurity(request, config)
      
      expect(result.allowed).toBe(true)
      expect(result.response).toBeUndefined()
    })

    it("should block access in wrong environment", async () => {
      // Mock NODE_ENV for this test
      const originalEnv = process.env.NODE_ENV
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        configurable: true
      })
      
      const request = createMockRequest()
      const config = {
        environmentOnly: ["development"]
      }
      
      const result = await checkSecurity(request, config)
      
      expect(result.allowed).toBe(false)
      expect(result.response).toBeDefined()
      
      // Restore
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        configurable: true
      })
    })

    it("should allow access in correct environment", async () => {
      // Mock NODE_ENV for this test
      const originalEnv = process.env.NODE_ENV
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        configurable: true
      })
      
      const request = createMockRequest()
      const config = {
        environmentOnly: ["development", "test"]
      }
      
      const result = await checkSecurity(request, config)
      
      expect(result.allowed).toBe(true)
      expect(result.response).toBeUndefined()
      
      // Restore
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        configurable: true
      })
    })

    it("should handle requireDevelopmentOnly correctly", () => {
      // Test development environment
      const originalEnv = process.env.NODE_ENV
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        configurable: true
      })
      expect(requireDevelopmentOnly()).toBe(true)
      
      // Test production environment
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        configurable: true
      })
      expect(requireDevelopmentOnly()).toBe(false)
      
      // Restore
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        configurable: true
      })
    })

    it("should handle requireLocalhost correctly", () => {
      const localhostRequest = createMockRequest({
        "x-forwarded-for": "127.0.0.1"
      })
      expect(requireLocalhost(localhostRequest)).toBe(true)
      
      const remoteRequest = createMockRequest({
        "x-forwarded-for": "192.168.1.100"
      })
      expect(requireLocalhost(remoteRequest)).toBe(false)
    })
  })
})
