/**
 * ServiceFactory Tests
 *
 * Tests for the singleton service factory.
 * Following .cursorrules.md Test Mode standards.
 *
 * Test Coverage:
 * - Singleton pattern for all services
 * - Async singleton race condition prevention
 * - Service instance reuse
 */

import { ServiceFactory } from "@/lib/services"

describe("ServiceFactory", () => {
  beforeEach(() => {
    // Reset all service instances before each test
    ServiceFactory.reset()
  })

  describe("singleton pattern", () => {
    it("should return the same AuthService instance", () => {
      const service1 = ServiceFactory.getAuthService()
      const service2 = ServiceFactory.getAuthService()

      expect(service1).toBe(service2)
    })

    it("should return the same GeocodingService instance", () => {
      const service1 = ServiceFactory.getGeocodingService()
      const service2 = ServiceFactory.getGeocodingService()

      expect(service1).toBe(service2)
    })

    it("should return the same ServiceRequestService instance", () => {
      const service1 = ServiceFactory.getServiceRequestService()
      const service2 = ServiceFactory.getServiceRequestService()

      expect(service1).toBe(service2)
    })

    it("should return the same DashboardService instance", () => {
      const service1 = ServiceFactory.getDashboardService()
      const service2 = ServiceFactory.getDashboardService()

      expect(service1).toBe(service2)
    })

    it("should return the same AdminService instance", async () => {
      const service1 = await ServiceFactory.getAdminService()
      const service2 = await ServiceFactory.getAdminService()

      expect(service1).toBe(service2)
    })
  })

  describe("async singleton race condition", () => {
    it("should prevent race condition when getAdminService called concurrently", async () => {
      // Call getAdminService multiple times concurrently
      const promises = [
        ServiceFactory.getAdminService(),
        ServiceFactory.getAdminService(),
        ServiceFactory.getAdminService(),
        ServiceFactory.getAdminService(),
        ServiceFactory.getAdminService(),
      ]

      // Wait for all promises to resolve
      const services = await Promise.all(promises)

      // All returned services should be the same instance
      const firstService = services[0]
      services.forEach((service) => {
        expect(service).toBe(firstService)
      })
    })

    it("should return same instance when called sequentially after concurrent calls", async () => {
      // First concurrent call
      const promise1 = ServiceFactory.getAdminService()
      const promise2 = ServiceFactory.getAdminService()

      const [service1, service2] = await Promise.all([promise1, promise2])

      // Sequential call after concurrent calls complete
      const service3 = await ServiceFactory.getAdminService()

      expect(service1).toBe(service2)
      expect(service2).toBe(service3)
    })
  })

  describe("reset", () => {
    it("should reset all service instances", async () => {
      // Create instances
      const auth1 = ServiceFactory.getAuthService()
      const geocoding1 = ServiceFactory.getGeocodingService()
      const admin1 = await ServiceFactory.getAdminService()

      // Reset
      ServiceFactory.reset()

      // Get new instances
      const auth2 = ServiceFactory.getAuthService()
      const geocoding2 = ServiceFactory.getGeocodingService()
      const admin2 = await ServiceFactory.getAdminService()

      // Should be different instances
      expect(auth2).not.toBe(auth1)
      expect(geocoding2).not.toBe(geocoding1)
      expect(admin2).not.toBe(admin1)
    })
  })
})
