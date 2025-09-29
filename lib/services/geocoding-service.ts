/**
 * Geocoding Service
 *
 * Platform-agnostic geocoding service that supports multiple providers
 * and is designed for both web and mobile applications.
 *
 * Design Principles:
 * - Zero React/DOM dependencies for mobile compatibility
 * - Provider pattern for multiple geocoding sources
 * - Offline-first with caching and fallback mechanisms
 * - Rate limiting and data usage optimization
 */

import { BaseService, ServiceResult, ServiceLogger } from "./base-service"

// Core geocoding types
export interface GeocodingCoordinates {
  latitude: number
  longitude: number
}

export interface GeocodingAddress {
  displayName: string
  coordinates: GeocodingCoordinates
  placeId: string
  components?: {
    streetNumber?: string
    streetName?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
}

export interface GeocodingSearchOptions {
  limit?: number
  countryCode?: string
  bounds?: {
    northeast: GeocodingCoordinates
    southwest: GeocodingCoordinates
  }
}

export interface GeocodingCacheEntry {
  query: string
  results: GeocodingAddress[]
  timestamp: number
  ttl: number
}

// Provider interface for different geocoding sources
export interface GeocodingProvider {
  name: string
  searchAddresses(
    query: string,
    options?: GeocodingSearchOptions
  ): Promise<GeocodingAddress[]>
  reverseGeocode(
    coordinates: GeocodingCoordinates
  ): Promise<GeocodingAddress | null>
  isAvailable(): Promise<boolean>
}

// Web API provider for Nominatim/OpenStreetMap
export class NominatimProvider implements GeocodingProvider {
  name = "nominatim"
  private baseUrl = "https://nominatim.openstreetmap.org"
  private userAgent = "PatriotHeavyOps/1.0 (contact@patriotheavyops.com)"

  async searchAddresses(
    query: string,
    options: GeocodingSearchOptions = {}
  ): Promise<GeocodingAddress[]> {
    if (query.length < 3) {
      return []
    }

    const url = new URL(`${this.baseUrl}/search`)
    url.searchParams.set("q", query)
    url.searchParams.set("format", "json")
    url.searchParams.set("addressdetails", "1")
    url.searchParams.set("limit", String(options.limit || 5))

    if (options.countryCode) {
      url.searchParams.set("countrycodes", options.countryCode)
    }

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": this.userAgent,
      },
    })

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`)
    }

    const data = await response.json()

    return data.map((item: unknown) => {
      const nominatimItem = item as {
        display_name: string
        lat: string
        lon: string
        place_id: string
        address?: {
          house_number?: string
          road?: string
          city?: string
          town?: string
          village?: string
          state?: string
          postcode?: string
          country?: string
        }
      }

      const result: GeocodingAddress = {
        displayName: nominatimItem.display_name,
        coordinates: {
          latitude: parseFloat(nominatimItem.lat),
          longitude: parseFloat(nominatimItem.lon),
        },
        placeId: nominatimItem.place_id,
      }

      if (nominatimItem.address) {
        const components: {
          streetNumber?: string
          streetName?: string
          city?: string
          state?: string
          postalCode?: string
          country?: string
        } = {}

        if (nominatimItem.address.house_number) {
          components.streetNumber = nominatimItem.address.house_number
        }
        if (nominatimItem.address.road) {
          components.streetName = nominatimItem.address.road
        }
        if (
          nominatimItem.address.city ||
          nominatimItem.address.town ||
          nominatimItem.address.village
        ) {
          components.city =
            nominatimItem.address.city ||
            nominatimItem.address.town ||
            nominatimItem.address.village ||
            ""
        }
        if (nominatimItem.address.state) {
          components.state = nominatimItem.address.state
        }
        if (nominatimItem.address.postcode) {
          components.postalCode = nominatimItem.address.postcode
        }
        if (nominatimItem.address.country) {
          components.country = nominatimItem.address.country
        }

        if (Object.keys(components).length > 0) {
          result.components = components
        }
      }

      return result
    })
  }

  async reverseGeocode(
    coordinates: GeocodingCoordinates
  ): Promise<GeocodingAddress | null> {
    const url = new URL(`${this.baseUrl}/reverse`)
    url.searchParams.set("lat", String(coordinates.latitude))
    url.searchParams.set("lon", String(coordinates.longitude))
    url.searchParams.set("format", "json")
    url.searchParams.set("addressdetails", "1")

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": this.userAgent,
      },
    })

    if (!response.ok) {
      throw new Error(`Nominatim reverse geocoding error: ${response.status}`)
    }

    const data = (await response.json()) as {
      display_name?: string
      lat: string
      lon: string
      place_id: string
      address?: {
        house_number?: string
        road?: string
        city?: string
        town?: string
        village?: string
        state?: string
        postcode?: string
        country?: string
      }
    }

    if (!data.display_name) {
      return null
    }

    const result: GeocodingAddress = {
      displayName: data.display_name,
      coordinates: {
        latitude: parseFloat(data.lat),
        longitude: parseFloat(data.lon),
      },
      placeId: data.place_id,
    }

    if (data.address) {
      const components: {
        streetNumber?: string
        streetName?: string
        city?: string
        state?: string
        postalCode?: string
        country?: string
      } = {}

      if (data.address.house_number) {
        components.streetNumber = data.address.house_number
      }
      if (data.address.road) {
        components.streetName = data.address.road
      }
      if (data.address.city || data.address.town || data.address.village) {
        components.city =
          data.address.city || data.address.town || data.address.village || ""
      }
      if (data.address.state) {
        components.state = data.address.state
      }
      if (data.address.postcode) {
        components.postalCode = data.address.postcode
      }
      if (data.address.country) {
        components.country = data.address.country
      }

      if (Object.keys(components).length > 0) {
        result.components = components
      }
    }

    return result
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/status`, {
        method: "HEAD",
        headers: { "User-Agent": this.userAgent },
      })
      return response.ok
    } catch {
      return false
    }
  }
}

// Mobile provider interface for future React Native integration
export class MobileLocationProvider implements GeocodingProvider {
  name = "mobile-location"

  async searchAddresses(
    _query: string,
    _options?: GeocodingSearchOptions
  ): Promise<GeocodingAddress[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _unused = { _query, _options }
    // Future implementation for React Native location services
    // This would integrate with device GPS and local geocoding
    throw new Error("Mobile location provider not yet implemented")
  }

  async reverseGeocode(
    _coordinates: GeocodingCoordinates
  ): Promise<GeocodingAddress | null> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _unused = _coordinates
    // Future implementation for React Native reverse geocoding
    throw new Error("Mobile location provider not yet implemented")
  }

  async isAvailable(): Promise<boolean> {
    // Future implementation to check device location permissions
    return false
  }
}

// Main geocoding service
export class GeocodingService extends BaseService {
  private providers: GeocodingProvider[] = []
  private cache: Map<string, GeocodingCacheEntry> = new Map()
  private defaultCacheTTL = 5 * 60 * 1000 // 5 minutes
  private rateLimitMap: Map<string, number[]> = new Map()
  private rateLimitWindow = 60 * 1000 // 1 minute
  private rateLimitMax = 60 // 60 requests per minute

  constructor(logger?: ServiceLogger) {
    super("GeocodingService", logger)

    // Initialize default providers
    this.providers = [new NominatimProvider(), new MobileLocationProvider()]
  }

  /**
   * Add a geocoding provider
   */
  addProvider(provider: GeocodingProvider): void {
    this.providers.push(provider)
    this.logOperation("Provider added", { providerName: provider.name })
  }

  /**
   * Search for addresses matching a query
   */
  async searchAddresses(
    query: string,
    options: GeocodingSearchOptions = {}
  ): Promise<ServiceResult<GeocodingAddress[]>> {
    // Validate input
    const validation = this.validateRequired({ query }, ["query"])
    if (!validation.success) {
      const error = validation.error || {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: {},
      }
      return this.createError(error.code, error.message, error.details)
    }

    if (query.length < 3) {
      return this.createSuccess([])
    }

    // Check rate limiting
    if (!this.checkRateLimit("search")) {
      return this.createError(
        "RATE_LIMIT_EXCEEDED",
        "Too many geocoding requests. Please wait before trying again."
      )
    }

    // Check cache first
    const cacheKey = `search:${query}:${JSON.stringify(options)}`
    const cached = this.getFromCache(cacheKey)
    if (cached) {
      this.logOperation("Cache hit", { query, cacheKey })
      return this.createSuccess(cached.results)
    }

    // Try providers in order until one succeeds
    for (const provider of this.providers) {
      try {
        if (!(await provider.isAvailable())) {
          continue
        }

        this.logOperation("Attempting geocoding", {
          provider: provider.name,
          query: query.substring(0, 50),
        })

        const results = await provider.searchAddresses(query, options)

        // Cache successful results
        this.setCache(cacheKey, results)

        this.logOperation("Geocoding successful", {
          provider: provider.name,
          resultCount: results.length,
        })

        return this.createSuccess(results)
      } catch (error) {
        this.logger.warn(`Provider ${provider.name} failed`, {
          error: error instanceof Error ? error.message : String(error),
          query: query.substring(0, 50),
        })
        continue
      }
    }

    return this.createError(
      "ALL_PROVIDERS_FAILED",
      "Unable to search for addresses at the moment. Please try again later.",
      { query: query.substring(0, 50) }
    )
  }

  /**
   * Reverse geocode coordinates to an address
   */
  async reverseGeocode(
    coordinates: GeocodingCoordinates
  ): Promise<ServiceResult<GeocodingAddress | null>> {
    // Validate input
    const validation = this.validateRequired(
      { latitude: coordinates.latitude, longitude: coordinates.longitude },
      ["latitude", "longitude"]
    )
    if (!validation.success) {
      const error = validation.error || {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: {},
      }
      return this.createError(error.code, error.message, error.details)
    }

    // Check rate limiting
    if (!this.checkRateLimit("reverse")) {
      return this.createError(
        "RATE_LIMIT_EXCEEDED",
        "Too many geocoding requests. Please wait before trying again."
      )
    }

    // Check cache first
    const cacheKey = `reverse:${coordinates.latitude},${coordinates.longitude}`
    const cached = this.getFromCache(cacheKey)
    if (cached && cached.results.length > 0) {
      this.logOperation("Reverse geocoding cache hit", {
        coordinates,
        cacheKey,
      })
      return this.createSuccess(cached.results[0] || null)
    }

    // Try providers in order until one succeeds
    for (const provider of this.providers) {
      try {
        if (!(await provider.isAvailable())) {
          continue
        }

        this.logOperation("Attempting reverse geocoding", {
          provider: provider.name,
          coordinates,
        })

        const result = await provider.reverseGeocode(coordinates)

        // Cache successful results
        if (result) {
          this.setCache(cacheKey, [result])
        }

        this.logOperation("Reverse geocoding successful", {
          provider: provider.name,
          hasResult: !!result,
        })

        return this.createSuccess(result)
      } catch (error) {
        this.logger.warn(`Provider ${provider.name} reverse geocoding failed`, {
          error: error instanceof Error ? error.message : String(error),
          coordinates,
        })
        continue
      }
    }

    return this.createError(
      "ALL_PROVIDERS_FAILED",
      "Unable to reverse geocode coordinates at the moment. Please try again later.",
      { coordinates }
    )
  }

  /**
   * Clear the geocoding cache
   */
  clearCache(): void {
    this.cache.clear()
    this.logOperation("Cache cleared")
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    }
  }

  // Private helper methods
  private checkRateLimit(operation: string): boolean {
    const now = Date.now()

    if (!this.rateLimitMap.has(operation)) {
      this.rateLimitMap.set(operation, [])
    }

    const requests = this.rateLimitMap.get(operation) || []

    // Remove old requests outside the window
    const validRequests = requests.filter(
      (time) => now - time < this.rateLimitWindow
    )

    if (validRequests.length >= this.rateLimitMax) {
      return false
    }

    // Add current request
    validRequests.push(now)
    this.rateLimitMap.set(operation, validRequests)

    return true
  }

  private getFromCache(key: string): GeocodingCacheEntry | null {
    const entry = this.cache.get(key)
    if (!entry) {
      return null
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry
  }

  private setCache(key: string, results: GeocodingAddress[]): void {
    const entry: GeocodingCacheEntry = {
      query: key,
      results,
      timestamp: Date.now(),
      ttl: this.defaultCacheTTL,
    }

    this.cache.set(key, entry)

    // Prevent cache from growing too large
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }
  }
}
