import { GET } from '@/app/api/geocoding/route'
import { 
  createMockRequest, 
  getResponseJson, 
  assertResponse
} from '@/__tests__/helpers/api-test-helpers'
import { MOCK_GEOCODING_RESPONSE } from '@/__tests__/helpers/mock-data'

// Mock global fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('/api/geocoding', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/geocoding', () => {
    describe('Query Parameter Validation', () => {
      it('should return empty array when no query parameter', async () => {
        const request = createMockRequest('GET', 'http://localhost:3000/api/geocoding')
        const response = await GET(request)

        assertResponse(response, 200, 'application/json')
        
        const data = await getResponseJson(response)
        expect(data).toEqual([])
      })

      it('should return empty array when query is too short', async () => {
        const request = createMockRequest('GET', 'http://localhost:3000/api/geocoding?q=ab')
        const response = await GET(request)

        assertResponse(response, 200, 'application/json')
        
        const data = await getResponseJson(response)
        expect(data).toEqual([])
      })

      it('should return empty array when query is empty string', async () => {
        const request = createMockRequest('GET', 'http://localhost:3000/api/geocoding?q=')
        const response = await GET(request)

        assertResponse(response, 200, 'application/json')
        
        const data = await getResponseJson(response)
        expect(data).toEqual([])
      })

      it('should accept query with minimum 3 characters', async () => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(MOCK_GEOCODING_RESPONSE),
        })

        const request = createMockRequest('GET', 'http://localhost:3000/api/geocoding?q=aus')
        const response = await GET(request)

        assertResponse(response, 200, 'application/json')
        
        const data = await getResponseJson(response)
        expect(Array.isArray(data)).toBe(true)
        expect(data.length).toBeGreaterThan(0)
      })
    })

    describe('Nominatim API Integration', () => {
      it('should proxy request to Nominatim with correct parameters', async () => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(MOCK_GEOCODING_RESPONSE),
        })

        const request = createMockRequest('GET', 'http://localhost:3000/api/geocoding?q=Austin%20Texas')
        const response = await GET(request)

        assertResponse(response, 200, 'application/json')
        
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('https://nominatim.openstreetmap.org/search'),
          expect.objectContaining({
            headers: {
              'User-Agent': 'PatriotHeavyOps/1.0 (contact@patriotheavyops.com)',
            },
          })
        )

        // Verify URL parameters
        const fetchCall = mockFetch.mock.calls[0]
        const url = new URL(fetchCall[0])
        expect(url.searchParams.get('q')).toBe('Austin Texas')
        expect(url.searchParams.get('format')).toBe('json')
        expect(url.searchParams.get('addressdetails')).toBe('1')
        expect(url.searchParams.get('limit')).toBe('5')
        expect(url.searchParams.get('countrycodes')).toBe('us')
      })

      it('should return sanitized geocoding results', async () => {
        const mockNominatimResponse = [
          {
            display_name: 'Austin, Travis County, Texas, United States',
            lat: '30.2672',
            lon: '-97.7431',
            place_id: '12345',
            osm_id: '67890',
            osm_type: 'relation',
            licence: 'Data © OpenStreetMap contributors',
            // Extra fields that should be filtered out
            importance: 0.8,
            icon: 'https://example.com/icon.png',
          },
        ]

        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockNominatimResponse),
        })

        const request = createMockRequest('GET', 'http://localhost:3000/api/geocoding?q=Austin')
        const response = await GET(request)

        assertResponse(response, 200, 'application/json')
        
        const data = await getResponseJson(response)
        expect(data).toEqual([
          {
            display_name: 'Austin, Travis County, Texas, United States',
            lat: '30.2672',
            lon: '-97.7431',
            place_id: '12345',
          },
        ])
      })
    })

    describe('Error Handling', () => {
      it('should return empty array when Nominatim API fails', async () => {
        mockFetch.mockResolvedValue({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        })

        const request = createMockRequest('GET', 'http://localhost:3000/api/geocoding?q=Houston')
        const response = await GET(request)

        assertResponse(response, 200, 'application/json')
        
        const data = await getResponseJson(response)
        expect(data).toEqual([])
      })

      it('should return empty array when fetch throws an error', async () => {
        mockFetch.mockRejectedValue(new Error('Network error'))

        const request = createMockRequest('GET', 'http://localhost:3000/api/geocoding?q=Phoenix')
        const response = await GET(request)

        assertResponse(response, 200, 'application/json')
        
        const data = await getResponseJson(response)
        expect(data).toEqual([])
      })

      it('should return empty array when Nominatim returns invalid JSON', async () => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.reject(new Error('Invalid JSON')),
        })

        const request = createMockRequest('GET', 'http://localhost:3000/api/geocoding?q=Denver')
        const response = await GET(request)

        assertResponse(response, 200, 'application/json')
        
        const data = await getResponseJson(response)
        expect(data).toEqual([])
      })
    })

    describe('Response Headers', () => {
      it('should include proper content-type header', async () => {
        const request = createMockRequest('GET', 'http://localhost:3000/api/geocoding?q=ab')
        const response = await GET(request)

        expect(response.headers.get('content-type')).toBe('application/json')
      })

      it('should include cache-control header for successful responses', async () => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(MOCK_GEOCODING_RESPONSE),
        })

        const request = createMockRequest('GET', 'http://localhost:3000/api/geocoding?q=Miami')
        const response = await GET(request)

        assertResponse(response, 200, 'application/json')
        expect(response.headers.get('cache-control')).toBe('public, max-age=300')
      })

      it('should include content-type header for error responses', async () => {
        mockFetch.mockResolvedValue({
          ok: false,
          status: 500,
        })

        const request = createMockRequest('GET', 'http://localhost:3000/api/geocoding?q=Portland')
        const response = await GET(request)

        assertResponse(response, 200, 'application/json')
      })
    })

    describe('Edge Cases', () => {
      it('should handle special characters in query', async () => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(MOCK_GEOCODING_RESPONSE),
        })

        const request = createMockRequest('GET', 'http://localhost:3000/api/geocoding?q=São%20Paulo')
        const response = await GET(request)

        assertResponse(response, 200, 'application/json')
        
        const data = await getResponseJson(response)
        expect(Array.isArray(data)).toBe(true)
      })

      it('should handle very long query strings', async () => {
        const longQuery = 'A'.repeat(200)
        
        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve([]),
        })

        const request = createMockRequest('GET', `http://localhost:3000/api/geocoding?q=${encodeURIComponent(longQuery)}`)
        const response = await GET(request)

        assertResponse(response, 200, 'application/json')
        
        const data = await getResponseJson(response)
        expect(data).toEqual([])
      })

      it('should handle queries with multiple spaces', async () => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(MOCK_GEOCODING_RESPONSE),
        })

        const request = createMockRequest('GET', 'http://localhost:3000/api/geocoding?q=New%20%20%20York%20%20%20City')
        const response = await GET(request)

        assertResponse(response, 200, 'application/json')
        
        // Verify the query parameter was passed correctly
        const fetchCall = mockFetch.mock.calls[0]
        const url = new URL(fetchCall[0])
        expect(url.searchParams.get('q')).toBe('New   York   City')
      })

      it('should handle empty Nominatim response array', async () => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve([]),
        })

        const request = createMockRequest('GET', 'http://localhost:3000/api/geocoding?q=NonexistentCity')
        const response = await GET(request)

        assertResponse(response, 200, 'application/json')
        
        const data = await getResponseJson(response)
        expect(data).toEqual([])
      })

      it('should handle malformed Nominatim response objects', async () => {
        const malformedResponse = [
          {
            // Missing required fields
            some_field: 'value',
          },
          {
            display_name: 'Valid Location',
            lat: '40.7128',
            lon: '-74.0060',
            place_id: '54321',
          },
        ]

        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(malformedResponse),
        })

        const request = createMockRequest('GET', 'http://localhost:3000/api/geocoding?q=TestCity')
        const response = await GET(request)

        assertResponse(response, 200, 'application/json')
        
        const data = await getResponseJson(response)
        expect(data).toEqual([
          {
            display_name: undefined,
            lat: undefined,
            lon: undefined,
            place_id: undefined,
          },
          {
            display_name: 'Valid Location',
            lat: '40.7128',
            lon: '-74.0060',
            place_id: '54321',
          },
        ])
      })

      it('should handle null/undefined query parameter gracefully', async () => {
        const request = createMockRequest('GET', 'http://localhost:3000/api/geocoding?q=null')
        const response = await GET(request)

        assertResponse(response, 200, 'application/json')
        
        const data = await getResponseJson(response)
        expect(Array.isArray(data)).toBe(true)
      })
    })
  })
})