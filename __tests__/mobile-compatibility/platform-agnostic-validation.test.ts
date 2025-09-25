/**
 * Platform-Agnostic Validation Tests
 *
 * Validates that the service layer is truly platform-agnostic and ready for
 * React Native mobile app development. Tests framework independence and
 * mobile SDK compatibility.
 *
 * Design Principles:
 * - Zero web framework dependencies
 * - React Native environment simulation
 * - Cross-platform API consistency
 * - Mobile-first architecture validation
 */

import { ServiceFactory, AuthService, ServiceRequestService, GeocodingService } from "@/lib/services"
import { RepositoryFactory } from "@/lib/repositories"

// Mock all external dependencies to test in isolation
jest.mock("@/lib/db", () => ({
  db: {
    serviceRequest: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}))

jest.mock("@/lib/auth-utils", () => ({
  hashPassword: jest.fn().mockResolvedValue("hashed-password"),
  verifyPassword: jest.fn().mockResolvedValue(true),
  generateAccessToken: jest.fn().mockReturnValue("mock-token"),
  verifyToken: jest.fn().mockReturnValue({ userId: "user-123" }),
}))

describe("Platform-Agnostic Validation Tests", () => {
  beforeEach(() => {
    // Reset all services and repositories
    ServiceFactory.reset()
    RepositoryFactory.reset()
  })

  afterEach(() => {
    ServiceFactory.reset()
    RepositoryFactory.reset()
  })

  describe("Framework Independence", () => {
    it("should instantiate all services without Next.js dependencies", () => {
      // Verify services can be created without any web framework context
      const authService = ServiceFactory.getAuthService()
      const serviceRequestService = ServiceFactory.getServiceRequestService()
      const geocodingService = ServiceFactory.getGeocodingService()

      expect(authService).toBeInstanceOf(AuthService)
      expect(serviceRequestService).toBeInstanceOf(ServiceRequestService)
      expect(geocodingService).toBeInstanceOf(GeocodingService)
    })

    it("should work without browser globals", () => {
      // Remove all browser-specific globals
      const originalWindow = global.window
      const originalDocument = global.document
      const originalNavigator = global.navigator
      const originalLocation = global.location

      delete (global as any).window
      delete (global as any).document
      delete (global as any).navigator
      delete (global as any).location

      try {
        // Services should still work without browser APIs
        const authService = new AuthService()
        const serviceRequestService = new ServiceRequestService()
        
        expect(authService.getServiceName()).toBe("AuthService")
        expect(serviceRequestService.getServiceName()).toBe("ServiceRequestService")

        // Test core business logic
        const calculationResult = serviceRequestService.calculateTotalHours("FULL_DAY", 2)
        expect(calculationResult.success).toBe(true)
        expect(calculationResult.data).toBe(16)
      } finally {
        // Restore globals
        if (originalWindow) (global as any).window = originalWindow
        if (originalDocument) (global as any).document = originalDocument
        if (originalNavigator) (global as any).navigator = originalNavigator
        if (originalLocation) (global as any).location = originalLocation
      }
    })

    it("should not import Next.js specific modules", () => {
      // Verify no Next.js imports in service layer
      const serviceModules = [
        "@/lib/services/auth-service",
        "@/lib/services/service-request-service",
        "@/lib/services/geocoding-service",
        "@/lib/services/base-service",
      ]

      serviceModules.forEach(modulePath => {
        const moduleCode = require("fs").readFileSync(
          require.resolve(modulePath.replace("@/", "../../") + ".ts"),
          "utf8"
        )

        // Check for Next.js specific imports
        const nextjsImports = [
          "next/",
          "next-auth",
          "next/router",
          "next/navigation",
          "next/headers",
          "next/server",
        ]

        nextjsImports.forEach(nextImport => {
          expect(moduleCode).not.toContain(`from "${nextImport}`)
          expect(moduleCode).not.toContain(`import("${nextImport}`)
        })
      })
    })

    it("should not import React dependencies", () => {
      // Verify no React imports in service layer
      const serviceModules = [
        "@/lib/services/auth-service",
        "@/lib/services/service-request-service", 
        "@/lib/services/geocoding-service",
        "@/lib/services/base-service",
      ]

      serviceModules.forEach(modulePath => {
        const moduleCode = require("fs").readFileSync(
          require.resolve(modulePath.replace("@/", "../../") + ".ts"),
          "utf8"
        )

        // Check for React specific imports
        const reactImports = [
          "react",
          "react-dom",
          "react/",
          "@/components/",
          "@/app/",
        ]

        reactImports.forEach(reactImport => {
          expect(moduleCode).not.toContain(`from "${reactImport}`)
          expect(moduleCode).not.toContain(`import("${reactImport}`)
        })
      })
    })
  })

  describe("React Native Environment Simulation", () => {
    it("should work in React Native-like environment", () => {
      // Simulate React Native environment
      const mockReactNativeGlobals = {
        __DEV__: true,
        global: global,
        // React Native doesn't have these browser APIs
        window: undefined,
        document: undefined,
        localStorage: undefined,
        sessionStorage: undefined,
      }

      // Override globals to simulate React Native
      const originalGlobals = {
        window: global.window,
        document: global.document,
        localStorage: (global as any).localStorage,
        sessionStorage: (global as any).sessionStorage,
      }

      Object.assign(global, mockReactNativeGlobals)

      try {
        // Test service instantiation
        const authService = new AuthService()
        const serviceRequestService = new ServiceRequestService()

        // Test business logic operations
        const hoursResult = serviceRequestService.calculateTotalHours("WEEKLY", 2)
        expect(hoursResult.success).toBe(true)
        expect(hoursResult.data).toBe(80) // 2 weeks × 40 hours

        const transportResult = serviceRequestService.calculateTransportFee("WE_HANDLE_IT")
        expect(transportResult.success).toBe(true)
        expect(transportResult.data).toBe(150)

        // Test validation methods
        const validUser = {
          id: "user-123",
          email: "test@example.com",
          name: "Test User",
          image: null,
          role: "USER" as const,
        }

        const isValidUser = authService.validateAuthUser(validUser)
        expect(isValidUser).toBe(true)
      } finally {
        // Restore original globals
        Object.assign(global, originalGlobals)
      }
    })

    it("should handle mobile-specific data serialization", () => {
      const serviceRequestService = new ServiceRequestService()

      // Test complex calculation result
      const calculationResult = serviceRequestService.calculateServiceRequestPricing({
        durationType: "MULTI_DAY",
        durationValue: 5,
        baseRate: 200,
        rateType: "DAILY",
        transport: "WE_HANDLE_IT",
        equipmentCategory: "BULLDOZERS",
      })

      expect(calculationResult.success).toBe(true)

      // Verify result is JSON serializable (critical for mobile apps)
      const serialized = JSON.stringify(calculationResult)
      const deserialized = JSON.parse(serialized)

      expect(deserialized).toEqual(calculationResult)
      expect(deserialized.data.totalHours).toBe(40) // 5 days × 8 hours
      expect(deserialized.data.baseCost).toBe(1500) // 5 days × $200 × 1.5 multiplier
      expect(deserialized.data.transportFee).toBe(150)
      expect(deserialized.data.totalEstimate).toBe(1650)
    })

    it("should provide consistent error handling for mobile apps", () => {
      const serviceRequestService = new ServiceRequestService()

      // Test error scenarios that mobile apps need to handle
      const invalidResult = serviceRequestService.calculateTotalHours("INVALID" as any, -1)

      expect(invalidResult.success).toBe(false)
      expect(invalidResult.error).toBeDefined()
      expect(invalidResult.error?.code).toBeDefined()
      expect(invalidResult.error?.message).toBeDefined()

      // Verify error is serializable
      const serializedError = JSON.stringify(invalidResult)
      const deserializedError = JSON.parse(serializedError)

      // Compare structure without timestamp (which gets serialized as string)
      expect(deserializedError.success).toEqual(invalidResult.success)
      expect(deserializedError.error?.code).toEqual(invalidResult.error?.code)
      expect(deserializedError.error?.message).toEqual(invalidResult.error?.message)
    })
  })

  describe("Cross-Platform API Consistency", () => {
    it("should provide consistent ServiceResult format across all operations", () => {
      const authService = new AuthService()
      const serviceRequestService = new ServiceRequestService()

      // Test synchronous operations
      const syncResults = [
        serviceRequestService.calculateTotalHours("FULL_DAY", 1),
        serviceRequestService.calculateTransportFee("YOU_HANDLE_IT"),
        serviceRequestService.validateStatusTransition("SUBMITTED", "UNDER_REVIEW"),
        serviceRequestService.getValidNextStatuses("SUBMITTED"),
      ]

      syncResults.forEach(result => {
        expect(result).toHaveProperty("success")
        expect(typeof result.success).toBe("boolean")
        
        if (result.success) {
          expect(result).toHaveProperty("data")
        } else {
          expect(result).toHaveProperty("error")
          expect(result.error).toHaveProperty("code")
          expect(result.error).toHaveProperty("message")
        }
      })

      // Test validation methods
      const validationResults = [
        authService.validateAuthUser({ id: "123", email: "test@example.com", name: null, image: null, role: "USER" }),
        authService.validateSessionData({ user: {}, expires: "2024-12-31" }),
      ]

      validationResults.forEach(result => {
        expect(typeof result).toBe("boolean")
      })
    })

    it("should handle async operations consistently", async () => {
      const authService = new AuthService()

      // Mock successful database responses
      const mockDb = require("@/lib/db").db
      mockDb.user.findUnique.mockResolvedValue({
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: "USER",
      })

      const asyncResults = await Promise.all([
        authService.getUserById("user-123"),
        authService.getUserByEmail("test@example.com"),
      ])

      asyncResults.forEach(result => {
        expect(result).toHaveProperty("success")
        expect(typeof result.success).toBe("boolean")
        
        if (result.success) {
          expect(result).toHaveProperty("data")
        } else {
          expect(result).toHaveProperty("error")
        }
      })
    })

    it("should provide mobile-friendly type definitions", () => {
      // Verify all exported types are available and properly structured
      const { 
        AuthService,
        ServiceRequestService,
        GeocodingService,
      } = require("@/lib/services")

      // Test type instantiation
      const authService = new AuthService()
      const serviceRequestService = new ServiceRequestService()
      const geocodingService = new GeocodingService()

      // Verify service names are consistent
      expect(authService.getServiceName()).toBe("AuthService")
      expect(serviceRequestService.getServiceName()).toBe("ServiceRequestService")
      expect(geocodingService.getServiceName()).toBe("GeocodingService")
    })
  })

  describe("Mobile SDK Integration Patterns", () => {
    it("should support dependency injection for mobile testing", () => {
      // Test that services can be mocked/replaced for mobile unit testing
      const customLogger = {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
      }

      const authService = new AuthService(customLogger)
      const serviceRequestService = new ServiceRequestService(customLogger)

      // Trigger logging
      serviceRequestService.calculateTotalHours("FULL_DAY", 1)

      expect(customLogger.info).toHaveBeenCalled()
    })

    it("should handle network failures gracefully for mobile apps", async () => {
      const authService = new AuthService()

      // Mock network failure
      const mockDb = require("@/lib/db").db
      mockDb.user.findUnique.mockRejectedValue(new Error("Network request failed"))

      const result = await authService.getUserById("user-123")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("USER_NOT_FOUND")
      expect(result.error?.message).toBe("User not found")
    })

    it("should provide offline-capable business logic", () => {
      const serviceRequestService = new ServiceRequestService()

      // Test that core business logic works without network
      const offlineOperations = [
        () => serviceRequestService.calculateTotalHours("WEEKLY", 4),
        () => serviceRequestService.getDurationDisplayText("MULTI_DAY", 10),
        () => serviceRequestService.calculateTransportFee("YOU_HANDLE_IT"),
        () => serviceRequestService.validateStatusTransition("APPROVED", "OPERATOR_MATCHING"),
        () => serviceRequestService.validateServiceRequestBusinessRules({
          startDate: new Date(Date.now() + 86400000).toISOString(),
          durationType: "FULL_DAY",
          durationValue: 3,
        }),
      ]

      offlineOperations.forEach(operation => {
        const result = operation()
        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
      })
    })
  })

  describe("Performance for Mobile Devices", () => {
    it("should perform calculations efficiently on mobile hardware", () => {
      const serviceRequestService = new ServiceRequestService()

      // Simulate mobile device constraints
      const startTime = Date.now()
      
      // Perform multiple calculations
      const calculations = Array.from({ length: 100 }, (_, i) => 
        serviceRequestService.calculateServiceRequestPricing({
          durationType: "FULL_DAY",
          durationValue: i + 1,
          baseRate: 100 + i,
          rateType: "DAILY",
          transport: i % 2 === 0 ? "WE_HANDLE_IT" : "YOU_HANDLE_IT",
          equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
        })
      )

      const endTime = Date.now()

      // All calculations should succeed
      calculations.forEach(result => {
        expect(result.success).toBe(true)
      })

      // Should complete quickly even on slower mobile devices
      expect(endTime - startTime).toBeLessThan(500) // <500ms for 100 calculations
    })

    it("should minimize memory usage for mobile apps", () => {
      // Test that services don't hold unnecessary references
      const initialMemory = process.memoryUsage().heapUsed

      // Create and use services
      const services = Array.from({ length: 10 }, () => ({
        auth: new AuthService(),
        serviceRequest: new ServiceRequestService(),
        geocoding: new GeocodingService(),
      }))

      // Use services
      services.forEach(({ serviceRequest }) => {
        serviceRequest.calculateTotalHours("FULL_DAY", 1)
      })

      // Clear references
      services.length = 0

      // Force garbage collection if available
      if (global.gc) {
        global.gc()
      }

      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory

      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
    })
  })

  describe("Mobile Authentication Patterns", () => {
    it("should support token-based authentication for mobile apps", () => {
      const authService = new AuthService()

      // Test user data validation (important for JWT payload validation)
      const tokenPayload = {
        id: "user-123",
        email: "mobile@example.com",
        name: "Mobile User",
        image: null,
        role: "USER" as const,
      }

      const isValid = authService.validateAuthUser(tokenPayload)
      expect(isValid).toBe(true)
    })

    it("should handle session data for hybrid authentication", () => {
      const authService = new AuthService()

      // Test session data validation (for web-mobile hybrid apps)
      const sessionData = {
        user: {
          id: "user-123",
          email: "hybrid@example.com",
          name: "Hybrid User",
          image: "https://example.com/avatar.jpg",
          role: "OPERATOR" as const,
        },
        expires: "2024-12-31T23:59:59.999Z",
      }

      const isValid = authService.validateSessionData(sessionData)
      expect(isValid).toBe(true)
    })

    it("should provide consistent error codes for mobile error handling", async () => {
      const authService = new AuthService()

      // Mock various error scenarios
      const mockDb = require("@/lib/db").db

      // Test validation error
      const validationResult = await authService.authenticate({
        email: "", // Invalid
        password: "", // Invalid
      })

      expect(validationResult.success).toBe(false)
      expect(validationResult.error?.code).toBe("VALIDATION_ERROR")

      // Test user not found
      mockDb.user.findUnique.mockResolvedValue(null)
      const notFoundResult = await authService.getUserById("nonexistent")

      expect(notFoundResult.success).toBe(false)
      expect(notFoundResult.error?.code).toBe("USER_NOT_FOUND")
    })
  })
})
