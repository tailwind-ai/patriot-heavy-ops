/**
 * Tests for test-utils.tsx to verify type safety improvements
 * This test ensures our type-safe refactoring doesn't break existing functionality
 */

import {
  createMockRequest,
  createMockResponse,
  mockFetchSuccess,
  mockFetchError,
  mockGeocodingResponse,
} from "./test-utils"

// Mock fetch globally
global.fetch = jest.fn()

describe("test-utils", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("createMockRequest", () => {
    it("should create mock request with proper types", () => {
      const body = { name: "test", id: 123 }
      const request = createMockRequest(body, "POST")
      
      expect(request.method).toBe("POST")
      expect(request.json).toBeDefined()
      expect(typeof request.json).toBe("function")
    })

    it("should handle empty body", () => {
      const request = createMockRequest()
      
      expect(request.method).toBe("POST")
      expect(request.json).toBeDefined()
    })
  })

  describe("createMockResponse", () => {
    it("should create mock response with proper structure", () => {
      const response = createMockResponse()
      
      expect(response.ok).toBe(true)
      expect(response.json).toBeDefined()
      expect(response.status).toBeDefined()
      expect(typeof response.json).toBe("function")
      expect(typeof response.status).toBe("function")
    })
  })

  describe("mockFetchSuccess", () => {
    it("should setup mock for successful fetch with typed data", async () => {
      const testData = { id: 1, name: "test" }
      mockFetchSuccess(testData)
      
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      
      // Call fetch to verify the mock is set up correctly
      const response = await fetch("http://test.com")
      const data = await response.json()
      
      expect(data).toEqual(testData)
      expect(response.ok).toBe(true)
    })
  })

  describe("mockFetchError", () => {
    it("should setup mock for error fetch with proper error structure", async () => {
      mockFetchError("Test error", 400)
      
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      
      // Call fetch to verify the mock is set up correctly
      const response = await fetch("http://test.com")
      const data = await response.json()
      
      expect(data).toEqual({ message: "Test error" })
      expect(response.ok).toBe(false)
    })
  })

  describe("mockGeocodingResponse", () => {
    it("should setup mock for geocoding API with typed suggestions", async () => {
      const suggestions = [
        {
          display_name: "Austin, TX, USA",
          lat: "30.2672",
          lon: "-97.7431",
          place_id: "1",
        }
      ]
      
      mockGeocodingResponse(suggestions)
      
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      
      // Call fetch to verify the mock is set up correctly
      const response = await fetch("http://test.com")
      const data = await response.json()
      
      expect(data).toEqual(suggestions)
      expect(response.ok).toBe(true)
    })
  })
})
