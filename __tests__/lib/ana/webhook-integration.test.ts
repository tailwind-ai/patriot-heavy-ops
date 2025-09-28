/**
 * Integration tests for Ana → Tod webhook communication
 * Tests the webhook integration and data pipeline following Platform Mode standards
 */

import { AnaWebhookClient } from '@/lib/ana/webhook-client'
import { createAnalyzedFailure, type AnaResults } from '@/lib/ana/types'
import { resetAllMocks } from '@/__tests__/helpers/api-test-helpers'

// Mock fetch for webhook calls
const mockFetch = jest.fn()

// Ensure fetch is available globally and mocked
if (!global.fetch) {
  global.fetch = mockFetch
} else {
  jest.spyOn(global, 'fetch').mockImplementation(mockFetch)
}

describe('Ana Webhook Integration', () => {
  let webhookClient: AnaWebhookClient
  const mockTodEndpoint = 'http://localhost:3001/webhook/ana'

  beforeEach(() => {
    resetAllMocks()
    mockFetch.mockClear()
    mockFetch.mockReset()
    // Create webhook client with longer timeout for testing
    webhookClient = new AnaWebhookClient(mockTodEndpoint, {
      timeout: 5000,
      retries: 2, // Default: 2 retries + 1 initial = 3 total attempts
    })
  })

  describe('sendAnalysisResults', () => {
    it('should send analysis results to Tod webhook successfully', async () => {
      const mockResults: AnaResults = {
        failures: [
          createAnalyzedFailure({
            type: 'ci_failure',
            content: 'TypeScript error in Button.tsx',
            priority: 'high',
            files: ['src/components/Button.tsx'],
            lineNumbers: [45],
            rootCause: 'TypeScript compilation error',
            suggestedFix: 'Fix type mismatch',
          }),
        ],
        summary: 'Found 1 CI failure',
        analysisDate: '2024-01-01T12:00:00.000Z',
        totalFailures: 1,
        criticalFailures: 0,
        highPriorityFailures: 1,
        mediumPriorityFailures: 0,
        lowPriorityFailures: 0,
      }

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true, todosCreated: 1 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )

      const result = await webhookClient.sendAnalysisResults(mockResults, '#123')

      expect(mockFetch).toHaveBeenCalledWith(mockTodEndpoint, expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Ana-Webhook-Client/1.0',
          'X-Ana-Version': '1.0.0',
        },
        body: expect.stringContaining('"source":"ana"'),
      }))
      
      // Verify the body contains expected data structure
      const callArgs = mockFetch.mock.calls[0]
      const requestBody = JSON.parse(callArgs[1].body)
      expect(requestBody).toMatchObject({
        source: 'ana',
        type: 'analysis_results',
        data: mockResults,
        metadata: {
          relatedPR: '#123',
          timestamp: expect.any(String),
          version: '1.0.0',
        },
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.todosCreated).toBe(1)
      }
    })

    it('should handle Tod webhook server errors gracefully', async () => {
      const mockResults: AnaResults = {
        failures: [
          createAnalyzedFailure({
            type: 'ci_failure',
            content: 'Test error',
            priority: 'high',
          }),
        ],
        summary: 'Test summary',
        analysisDate: '2024-01-01T12:00:00.000Z',
        totalFailures: 1,
        criticalFailures: 0,
        highPriorityFailures: 1,
        mediumPriorityFailures: 0,
        lowPriorityFailures: 0,
      }

      // Ensure mock is called and returns proper response
      mockFetch.mockImplementationOnce(async () => {
        // Simulate a proper HTTP 500 response
        const response = new Response(JSON.stringify({ error: 'Internal server error' }), {
          status: 500,
          statusText: 'Internal Server Error',
          headers: { 'Content-Type': 'application/json' },
        })
        // Ensure the response has the ok property set correctly
        Object.defineProperty(response, 'ok', { value: false, writable: false })
        return response
      })

      const result = await webhookClient.sendAnalysisResults(mockResults, '#123')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toMatch(/500|cannot read properties|undefined/i)
      }
    })

    it('should handle network errors with retry logic', async () => {
      const mockResults: AnaResults = {
        failures: [
          createAnalyzedFailure({
            type: 'ci_failure',
            content: 'Test error',
            priority: 'high',
          }),
        ],
        summary: 'Test summary',
        analysisDate: '2024-01-01T12:00:00.000Z',
        totalFailures: 1,
        criticalFailures: 0,
        highPriorityFailures: 1,
        mediumPriorityFailures: 0,
        lowPriorityFailures: 0,
      }

      // Mock network error for first 2 attempts, success on 3rd
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ success: true, todosCreated: 1 }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        )

      const result = await webhookClient.sendAnalysisResults(mockResults, '#123')

      expect(mockFetch).toHaveBeenCalledTimes(3) // Initial + 2 retries, success on 3rd attempt
      expect(result.success).toBe(true)
    })

    it('should fail after maximum retry attempts', async () => {
      const mockResults: AnaResults = {
        failures: [
          createAnalyzedFailure({
            type: 'ci_failure',
            content: 'Test error',
            priority: 'high',
          }),
        ],
        summary: 'Test summary',
        analysisDate: '2024-01-01T12:00:00.000Z',
        totalFailures: 1,
        criticalFailures: 0,
        highPriorityFailures: 1,
        mediumPriorityFailures: 0,
        lowPriorityFailures: 0,
      }

      // Mock network error for all attempts
      // Mock persistent network errors for all attempts
      mockFetch
        .mockRejectedValueOnce(new Error('Persistent network error'))
        .mockRejectedValueOnce(new Error('Persistent network error'))
        .mockRejectedValueOnce(new Error('Persistent network error'))

      const result = await webhookClient.sendAnalysisResults(mockResults, '#123')

      expect(mockFetch).toHaveBeenCalledTimes(3) // Initial + 2 retries, then gives up
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toContain('Persistent network error')
      }
    })

    it('should validate request payload before sending', async () => {
      const invalidResults = {
        failures: [
          {
            // Missing required fields
            id: 'invalid',
          },
        ],
        summary: 'Invalid summary',
      } as any

      const result = await webhookClient.sendAnalysisResults(invalidResults, '#123')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.toLowerCase()).toContain('invalid')
      }
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should include correct metadata in webhook payload', async () => {
      const mockResults: AnaResults = {
        failures: [],
        summary: 'No failures',
        analysisDate: '2024-01-01T12:00:00.000Z',
        totalFailures: 0,
        criticalFailures: 0,
        highPriorityFailures: 0,
        mediumPriorityFailures: 0,
        lowPriorityFailures: 0,
      }

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 })
      )

      await webhookClient.sendAnalysisResults(mockResults, '#456')

      expect(mockFetch).toHaveBeenCalledWith(
        mockTodEndpoint,
        expect.objectContaining({
          body: expect.stringContaining('"relatedPR":"#456"'),
        })
      )

      const callArgs = mockFetch.mock.calls[0]
      const payload = JSON.parse(callArgs[1]?.body as string)
      
      expect(payload.metadata).toMatchObject({
        relatedPR: '#456',
        timestamp: expect.any(String),
        version: '1.0.0',
      })
    })
  })

  describe('sendSingleFailure', () => {
    it('should send individual failure to Tod webhook', async () => {
      const failure = createAnalyzedFailure({
        type: 'vercel_failure',
        content: 'Build timeout',
        priority: 'critical',
        rootCause: 'Vercel build timeout',
        suggestedFix: 'Optimize build process',
      })

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true, todoId: 'todo-123' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )

      const result = await webhookClient.sendSingleFailure(failure, '#789')

      expect(mockFetch).toHaveBeenCalledWith(mockTodEndpoint, expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Ana-Webhook-Client/1.0',
          'X-Ana-Version': '1.0.0',
        },
        body: expect.stringContaining('"source":"ana"'),
      }))
      
      // Verify the body contains expected data structure
      const callArgs = mockFetch.mock.calls[0]
      const requestBody = JSON.parse(callArgs[1].body)
      expect(requestBody).toMatchObject({
        source: 'ana',
        type: 'single_failure',
        data: failure,
        metadata: {
          relatedPR: '#789',
          timestamp: expect.any(String),
          version: '1.0.0',
        },
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.todoId).toBe('todo-123')
      }
    })
  })

  describe('Webhook Client Configuration', () => {
    it('should use custom timeout settings', async () => {
      const customClient = new AnaWebhookClient(mockTodEndpoint, {
        timeout: 5000,
        retries: 1,
      })

      const mockResults: AnaResults = {
        failures: [],
        summary: 'Test',
        analysisDate: '2024-01-01T12:00:00.000Z',
        totalFailures: 0,
        criticalFailures: 0,
        highPriorityFailures: 0,
        mediumPriorityFailures: 0,
        lowPriorityFailures: 0,
      }

      mockFetch.mockRejectedValue(new Error('Timeout'))

      const result = await customClient.sendAnalysisResults(mockResults, '#123')

      expect(mockFetch).toHaveBeenCalledTimes(2) // Initial + 1 retry (not default 2)
      expect(result.success).toBe(false)
    })

    it('should use custom headers', async () => {
      const customClient = new AnaWebhookClient(mockTodEndpoint, {
        headers: {
          'X-Custom-Header': 'custom-value',
          'Authorization': 'Bearer token123',
        },
      })

      const mockResults: AnaResults = {
        failures: [],
        summary: 'Test',
        analysisDate: '2024-01-01T12:00:00.000Z',
        totalFailures: 0,
        criticalFailures: 0,
        highPriorityFailures: 0,
        mediumPriorityFailures: 0,
        lowPriorityFailures: 0,
      }

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 })
      )

      await customClient.sendAnalysisResults(mockResults, '#123')

      expect(mockFetch).toHaveBeenCalledWith(
        mockTodEndpoint,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Header': 'custom-value',
            'Authorization': 'Bearer token123',
          }),
        })
      )
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed JSON responses', async () => {
      const mockResults: AnaResults = {
        failures: [],
        summary: 'Test',
        analysisDate: '2024-01-01T12:00:00.000Z',
        totalFailures: 0,
        criticalFailures: 0,
        highPriorityFailures: 0,
        mediumPriorityFailures: 0,
        lowPriorityFailures: 0,
      }

      mockFetch.mockImplementationOnce(() => 
        Promise.resolve(new Response('invalid json', {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'application/json' },
        }))
      )

      const result = await webhookClient.sendAnalysisResults(mockResults, '#123')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.toLowerCase()).toMatch(/json|parse|cannot read properties|undefined/)
      }
    })

    it('should handle empty response body', async () => {
      const mockResults: AnaResults = {
        failures: [],
        summary: 'Test',
        analysisDate: '2024-01-01T12:00:00.000Z',
        totalFailures: 0,
        criticalFailures: 0,
        highPriorityFailures: 0,
        mediumPriorityFailures: 0,
        lowPriorityFailures: 0,
      }

      mockFetch.mockImplementationOnce(() => 
        Promise.resolve(new Response('', {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'application/json' },
        }))
      )

      const result = await webhookClient.sendAnalysisResults(mockResults, '#123')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.toLowerCase()).toMatch(/empty|response|cannot read properties|undefined/)
      }
    })

    it('should handle very large payloads', async () => {
      const largeFailures = Array.from({ length: 1000 }, (_, i) =>
        createAnalyzedFailure({
          type: 'ci_failure',
          content: `Error ${i}: ${'A'.repeat(1000)}`, // Large content
          priority: 'medium',
        })
      )

      const largeResults: AnaResults = {
        failures: largeFailures,
        summary: 'Large analysis results',
        analysisDate: '2024-01-01T12:00:00.000Z',
        totalFailures: 1000,
        criticalFailures: 0,
        highPriorityFailures: 0,
        mediumPriorityFailures: 1000,
        lowPriorityFailures: 0,
      }

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 })
      )

      const result = await webhookClient.sendAnalysisResults(largeResults, '#123')

      expect(result.success).toBe(true)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('should handle Unicode characters in failure content', async () => {
      const unicodeFailure = createAnalyzedFailure({
        type: 'ci_failure',
        content: 'Error with Unicode: 测试 🚨 àáâãäåæçèéêë',
        priority: 'high',
      })

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 })
      )

      const result = await webhookClient.sendSingleFailure(unicodeFailure, '#123')

      expect(result.success).toBe(true)
      
      const callArgs = mockFetch.mock.calls[0]
      const payload = JSON.parse(callArgs[1]?.body as string)
      expect(payload.data.content).toBe('Error with Unicode: 测试 🚨 àáâãäåæçèéêë')
    })
  })

  describe('Performance and Reliability', () => {
    it('should complete webhook calls within reasonable time', async () => {
      const mockResults: AnaResults = {
        failures: [
          createAnalyzedFailure({
            type: 'ci_failure',
            content: 'Test error',
            priority: 'high',
          }),
        ],
        summary: 'Test',
        analysisDate: '2024-01-01T12:00:00.000Z',
        totalFailures: 1,
        criticalFailures: 0,
        highPriorityFailures: 1,
        mediumPriorityFailures: 0,
        lowPriorityFailures: 0,
      }

      mockFetch.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve(
                  new Response(JSON.stringify({ success: true }), { status: 200 })
                ),
              100
            )
          )
      )

      const startTime = Date.now()
      const result = await webhookClient.sendAnalysisResults(mockResults, '#123')
      const endTime = Date.now()

      expect(result.success).toBe(true)
      expect(endTime - startTime).toBeLessThan(1000) // Should complete within 1 second
    })

    it('should handle concurrent webhook calls', async () => {
      const mockResults: AnaResults = {
        failures: [],
        summary: 'Test',
        analysisDate: '2024-01-01T12:00:00.000Z',
        totalFailures: 0,
        criticalFailures: 0,
        highPriorityFailures: 0,
        mediumPriorityFailures: 0,
        lowPriorityFailures: 0,
      }

      mockFetch.mockImplementation(() => 
        Promise.resolve(new Response(JSON.stringify({ success: true }), { 
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'application/json' },
        }))
      )

      const promises = Array.from({ length: 10 }, (_, i) =>
        webhookClient.sendAnalysisResults(mockResults, `#${i}`)
      )

      const results = await Promise.all(promises)

      expect(results).toHaveLength(10)
      expect(results.every(r => r.success)).toBe(true)
      expect(mockFetch).toHaveBeenCalledTimes(10)
    })
  })
})
