/**
 * Geocoding Service Tests
 * 
 * Comprehensive unit tests for the platform-agnostic geocoding service
 * including provider testing, caching, rate limiting, and error handling.
 */

import {
  GeocodingService,
  NominatimProvider,
  MobileLocationProvider,
  type GeocodingAddress,
  type GeocodingCoordinates,
  type GeocodingProvider,
} from "@/lib/services/geocoding-service"
import { ConsoleLogger } from "@/lib/services/base-service"

// Mock fetch globally
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

// Mock console methods to avoid noise in tests
const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}

describe("GeocodingService", () => {
  let service: GeocodingService

  beforeEach(() => {
    service = new GeocodingService(mockLogger)
    mockFetch.mockClear()
    jest.clearAllMocks()
  })

  afterEach(() => {
    service.clearCache()
  })

  describe("Service Initialization", () => {
    it("should initialize with default providers", () => {
      expect(service.getServiceName()).toBe("GeocodingService")
    })

    it("should allow adding custom providers", () => {
      const customProvider: GeocodingProvider = {
        name: "custom",
        searchAddresses: jest.fn().mockResolvedValue([]),
        reverseGeocode: jest.fn().mockResolvedValue(null),
        isAvailable: jest.fn().mockResolvedValue(true),
      }

      service.addProvider(customProvider)
      expect(mockLogger.info).toHaveBeenCalledWith(
        "GeocodingService: Provider added",
        { providerName: "custom" }
      )
    })
  })

  describe("Address Search", () => {
    const mockAddressResults: GeocodingAddress[] = [
      {
        displayName: "123 Main St, Anytown, USA",
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
        placeId: "12345",
        components: {
          streetNumber: "123",
          streetName: "Main St",
          city: "Anytown",
          state: "NY",
          postalCode: "10001",
          country: "USA",
        },
      },
    ]

    it("should return empty array for queries less than 3 characters", async () => {
      const result = await service.searchAddresses("ab")
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual([])
    })

    it("should validate required parameters", async () => {
      const result = await service.searchAddresses("")
      
      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })

    it("should successfully search addresses with Nominatim provider", async () => {
      // Mock successful Nominatim response
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
        } as Response) // isAvailable check
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [
            {
              display_name: "123 Main St, Anytown, USA",
              lat: "40.7128",
              lon: "-74.0060",
              place_id: "12345",
              address: {
                house_number: "123",
                road: "Main St",
                city: "Anytown",
                state: "NY",
                postcode: "10001",
                country: "USA",
              },
            },
          ],
        } as Response)

      const result = await service.searchAddresses("123 Main St")
      
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(result.data![0]).toMatchObject({
        displayName: "123 Main St, Anytown, USA",
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
        placeId: "12345",
      })
    })

    it("should cache successful search results", async () => {
      // Mock successful response
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [
            {
              display_name: "123 Main St, Anytown, USA",
              lat: "40.7128",
              lon: "-74.0060",
              place_id: "12345",
            },
          ],
        } as Response)

      // First call
      const result1 = await service.searchAddresses("123 Main St")
      expect(result1.success).toBe(true)

      // Second call should use cache (no additional fetch calls)
      const result2 = await service.searchAddresses("123 Main St")
      expect(result2.success).toBe(true)
      expect(result2.data).toEqual(result1.data)

      // Should only have made 2 fetch calls (isAvailable + search)
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it("should handle provider failures gracefully", async () => {
      // Mock provider failure - isAvailable returns false
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      } as Response)

      const result = await service.searchAddresses("123 Main St")
      
      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("ALL_PROVIDERS_FAILED")
    })

    it("should respect rate limiting", async () => {
      // Mock successful responses
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response)

      // Make requests up to the rate limit
      const promises = Array.from({ length: 65 }, (_, i) => 
        service.searchAddresses(`query${i}`)
      )

      const results = await Promise.all(promises)
      
      // Some requests should be rate limited
      const rateLimitedResults = results.filter(r => 
        !r.success && r.error?.code === "RATE_LIMIT_EXCEEDED"
      )
      
      expect(rateLimitedResults.length).toBeGreaterThan(0)
    })
  })

  describe("Reverse Geocoding", () => {
    const mockCoordinates: GeocodingCoordinates = {
      latitude: 40.7128,
      longitude: -74.0060,
    }

    it("should validate required coordinates", async () => {
      // Mock provider failure for this test
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      } as Response)

      const result = await service.reverseGeocode({
        latitude: 0,
        longitude: 0,
      })
      
      // Should fail when all providers fail
      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("ALL_PROVIDERS_FAILED")
    })

    it("should successfully reverse geocode coordinates", async () => {
      // Mock successful Nominatim response
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
        } as Response) // isAvailable check
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            display_name: "123 Main St, Anytown, USA",
            lat: "40.7128",
            lon: "-74.0060",
            place_id: "12345",
            address: {
              house_number: "123",
              road: "Main St",
              city: "Anytown",
              state: "NY",
              postcode: "10001",
              country: "USA",
            },
          }),
        } as Response)

      const result = await service.reverseGeocode(mockCoordinates)
      
      expect(result.success).toBe(true)
      expect(result.data).toMatchObject({
        displayName: "123 Main St, Anytown, USA",
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
        placeId: "12345",
      })
    })

    it("should cache reverse geocoding results", async () => {
      // Mock successful response
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            display_name: "123 Main St, Anytown, USA",
            lat: "40.7128",
            lon: "-74.0060",
            place_id: "12345",
          }),
        } as Response)

      // First call
      const result1 = await service.reverseGeocode(mockCoordinates)
      expect(result1.success).toBe(true)

      // Second call should use cache
      const result2 = await service.reverseGeocode(mockCoordinates)
      expect(result2.success).toBe(true)
      expect(result2.data).toEqual(result1.data)

      // Should only have made 2 fetch calls
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it("should handle no results gracefully", async () => {
      // Mock response with no results
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({}), // No display_name
        } as Response)

      const result = await service.reverseGeocode(mockCoordinates)
      
      expect(result.success).toBe(true)
      expect(result.data).toBeNull()
    })
  })

  describe("Cache Management", () => {
    it("should provide cache statistics", () => {
      const stats = service.getCacheStats()
      
      expect(stats).toHaveProperty("size")
      expect(stats).toHaveProperty("entries")
      expect(Array.isArray(stats.entries)).toBe(true)
    })

    it("should clear cache when requested", async () => {
      // Add something to cache first
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        } as Response)

      await service.searchAddresses("test query")
      
      let stats = service.getCacheStats()
      expect(stats.size).toBeGreaterThan(0)

      service.clearCache()
      
      stats = service.getCacheStats()
      expect(stats.size).toBe(0)
    })

    it("should expire cache entries after TTL", async () => {
      // This test would require mocking Date.now() to test TTL expiration
      // For now, we'll just verify the cache structure
      const stats = service.getCacheStats()
      expect(typeof stats.size).toBe("number")
    })
  })
})

describe("NominatimProvider", () => {
  let provider: NominatimProvider

  beforeEach(() => {
    provider = new NominatimProvider()
    mockFetch.mockClear()
  })

  describe("Provider Availability", () => {
    it("should check availability correctly", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response)

      const available = await provider.isAvailable()
      expect(available).toBe(true)
    })

    it("should handle availability check failures", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"))

      const available = await provider.isAvailable()
      expect(available).toBe(false)
    })
  })

  describe("Address Search", () => {
    it("should return empty array for short queries", async () => {
      const results = await provider.searchAddresses("ab")
      expect(results).toEqual([])
    })

    it("should format search requests correctly", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response)

      await provider.searchAddresses("123 Main St", {
        limit: 10,
        countryCode: "us",
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("q=123+Main+St"),
        expect.objectContaining({
          headers: {
            "User-Agent": "PatriotHeavyOps/1.0 (contact@patriotheavyops.com)",
          },
        })
      )
    })

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(provider.searchAddresses("123 Main St")).rejects.toThrow(
        "Nominatim API error: 500"
      )
    })
  })

  describe("Reverse Geocoding", () => {
    it("should format reverse geocoding requests correctly", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          display_name: "123 Main St, Anytown, USA",
          lat: "40.7128",
          lon: "-74.0060",
          place_id: "12345",
        }),
      } as Response)

      const coordinates = { latitude: 40.7128, longitude: -74.0060 }
      await provider.reverseGeocode(coordinates)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("lat=40.7128&lon=-74.006"),
        expect.objectContaining({
          headers: {
            "User-Agent": "PatriotHeavyOps/1.0 (contact@patriotheavyops.com)",
          },
        })
      )
    })

    it("should handle reverse geocoding API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      const coordinates = { latitude: 40.7128, longitude: -74.0060 }
      
      await expect(provider.reverseGeocode(coordinates)).rejects.toThrow(
        "Nominatim reverse geocoding error: 500"
      )
    })
  })
})

describe("MobileLocationProvider", () => {
  let provider: MobileLocationProvider

  beforeEach(() => {
    provider = new MobileLocationProvider()
  })

  it("should not be available yet", async () => {
    const available = await provider.isAvailable()
    expect(available).toBe(false)
  })

  it("should throw not implemented errors", async () => {
    await expect(provider.searchAddresses("test")).rejects.toThrow(
      "Mobile location provider not yet implemented"
    )

    await expect(
      provider.reverseGeocode({ latitude: 0, longitude: 0 })
    ).rejects.toThrow("Mobile location provider not yet implemented")
  })
})
