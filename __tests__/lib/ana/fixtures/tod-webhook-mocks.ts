/**
 * Test doubles and mocks for Tod webhook responses
 * Used for testing Ana → Tod integration without actual Tod server
 */

import { type AnalyzedFailure, type AnaResults } from '@/lib/ana/types'

/**
 * Mock Tod webhook response types
 */
export type TodWebhookResponse = {
  success: boolean
  todosCreated?: number
  todoId?: string
  message?: string
  error?: string
}

export type TodWebhookRequest = {
  source: 'ana'
  type: 'analysis_results' | 'single_failure'
  data: AnaResults | AnalyzedFailure
  metadata: {
    relatedPR: string
    timestamp: string
    version: string
  }
}

/**
 * Mock successful Tod webhook responses
 */
export const TOD_SUCCESS_RESPONSES = {
  ANALYSIS_RESULTS_SUCCESS: {
    success: true,
    todosCreated: 3,
    message: 'Successfully created 3 TODOs from analysis results',
  },

  SINGLE_FAILURE_SUCCESS: {
    success: true,
    todoId: 'todo-abc123',
    message: 'Successfully created TODO for failure',
  },

  EMPTY_RESULTS_SUCCESS: {
    success: true,
    todosCreated: 0,
    message: 'No TODOs created - no failures found',
  },

  BATCH_PROCESSING_SUCCESS: {
    success: true,
    todosCreated: 15,
    message: 'Successfully processed batch of 15 failures',
  },
} as const

/**
 * Mock Tod webhook error responses
 */
export const TOD_ERROR_RESPONSES = {
  VALIDATION_ERROR: {
    success: false,
    error: 'Invalid request payload: missing required field "type"',
  },

  INTERNAL_SERVER_ERROR: {
    success: false,
    error: 'Internal server error: failed to create TODO',
  },

  RATE_LIMIT_ERROR: {
    success: false,
    error: 'Rate limit exceeded: too many requests',
  },

  AUTHENTICATION_ERROR: {
    success: false,
    error: 'Authentication failed: invalid webhook token',
  },

  DATABASE_ERROR: {
    success: false,
    error: 'Database connection failed: unable to save TODO',
  },

  CURSOR_API_ERROR: {
    success: false,
    error: 'Cursor API error: failed to create TODO in workspace',
  },
} as const

/**
 * Mock network error scenarios
 */
export const NETWORK_ERROR_SCENARIOS = {
  CONNECTION_REFUSED: new Error('connect ECONNREFUSED 127.0.0.1:3001'),
  TIMEOUT: new Error('Request timeout after 30000ms'),
  DNS_ERROR: new Error('getaddrinfo ENOTFOUND tod-webhook-server'),
  SSL_ERROR: new Error('SSL certificate verification failed'),
  NETWORK_UNREACHABLE: new Error('Network is unreachable'),
} as const

/**
 * Mock Tod webhook server class for testing
 */
export class MockTodWebhookServer {
  private responses: Map<string, TodWebhookResponse> = new Map()
  private requestLog: TodWebhookRequest[] = []
  private errorScenario: Error | null = null
  private responseDelay = 0

  /**
   * Set a specific response for the next request
   */
  setResponse(response: TodWebhookResponse): void {
    this.responses.set('next', response)
  }

  /**
   * Set responses based on request type
   */
  setResponseForType(type: 'analysis_results' | 'single_failure', response: TodWebhookResponse): void {
    this.responses.set(type, response)
  }

  /**
   * Set an error scenario to simulate network issues
   */
  setErrorScenario(error: Error): void {
    this.errorScenario = error
  }

  /**
   * Set response delay to simulate slow network
   */
  setResponseDelay(delayMs: number): void {
    this.responseDelay = delayMs
  }

  /**
   * Mock fetch implementation
   */
  async mockFetch(_url: string, options: RequestInit): Promise<Response> {
    // Simulate network error if set
    if (this.errorScenario) {
      throw this.errorScenario
    }

    // Parse request
    const request: TodWebhookRequest = JSON.parse(options.body as string)
    this.requestLog.push(request)

    // Simulate response delay
    if (this.responseDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.responseDelay))
    }

    // Get appropriate response
    let response = this.responses.get('next') || this.responses.get(request.type)
    
    if (!response) {
      // Default success response
      response = request.type === 'analysis_results' 
        ? TOD_SUCCESS_RESPONSES.ANALYSIS_RESULTS_SUCCESS
        : TOD_SUCCESS_RESPONSES.SINGLE_FAILURE_SUCCESS
    }

    // Clear 'next' response after use
    this.responses.delete('next')

    // Create proper Response object with correct properties
    const responseObj = new Response(JSON.stringify(response), {
      status: response.success ? 200 : 500,
      statusText: response.success ? 'OK' : 'Internal Server Error',
      headers: { 'Content-Type': 'application/json' },
    })
    
    // Ensure the ok property is set correctly
    Object.defineProperty(responseObj, 'ok', { 
      value: response.success, 
      writable: false 
    })
    
    return responseObj
  }

  /**
   * Get logged requests for verification
   */
  getRequestLog(): TodWebhookRequest[] {
    return [...this.requestLog]
  }

  /**
   * Get the last request
   */
  getLastRequest(): TodWebhookRequest | undefined {
    return this.requestLog[this.requestLog.length - 1]
  }

  /**
   * Clear request log and responses
   */
  reset(): void {
    this.requestLog = []
    this.responses.clear()
    this.errorScenario = null
    this.responseDelay = 0
  }

  /**
   * Verify that a request was made with specific data
   */
  verifyRequestMade(predicate: (request: TodWebhookRequest) => boolean): boolean {
    return this.requestLog.some(predicate)
  }

  /**
   * Get request count
   */
  getRequestCount(): number {
    return this.requestLog.length
  }
}

/**
 * Helper function to create mock fetch implementation
 */
export function createMockFetch(server: MockTodWebhookServer) {
  return jest.fn().mockImplementation((url: string, options: RequestInit) => 
    server.mockFetch(url, options)
  )
}

/**
 * Common test scenarios for Tod webhook integration
 */
export const TOD_TEST_SCENARIOS = {
  SUCCESSFUL_ANALYSIS: {
    description: 'Successful analysis results processing',
    response: TOD_SUCCESS_RESPONSES.ANALYSIS_RESULTS_SUCCESS,
    expectedTodos: 3,
  },

  SUCCESSFUL_SINGLE_FAILURE: {
    description: 'Successful single failure processing',
    response: TOD_SUCCESS_RESPONSES.SINGLE_FAILURE_SUCCESS,
    expectedTodoId: 'todo-abc123',
  },

  VALIDATION_FAILURE: {
    description: 'Request validation failure',
    response: TOD_ERROR_RESPONSES.VALIDATION_ERROR,
    expectedError: 'validation',
  },

  SERVER_ERROR: {
    description: 'Tod server internal error',
    response: TOD_ERROR_RESPONSES.INTERNAL_SERVER_ERROR,
    expectedError: 'Internal server error',
  },

  NETWORK_TIMEOUT: {
    description: 'Network timeout scenario',
    error: NETWORK_ERROR_SCENARIOS.TIMEOUT,
    expectedError: 'timeout',
  },

  CONNECTION_REFUSED: {
    description: 'Connection refused scenario',
    error: NETWORK_ERROR_SCENARIOS.CONNECTION_REFUSED,
    expectedError: 'ECONNREFUSED',
  },
} as const

/**
 * Helper to create test webhook payloads
 */
export function createTestWebhookPayload(
  type: 'analysis_results' | 'single_failure',
  data: AnaResults | AnalyzedFailure,
  relatedPR = '#123'
): TodWebhookRequest {
  return {
    source: 'ana',
    type,
    data,
    metadata: {
      relatedPR,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  }
}

/**
 * Helper to validate webhook request structure
 */
export function validateWebhookRequest(request: TodWebhookRequest): boolean {
  return (
    request.source === 'ana' &&
    ['analysis_results', 'single_failure'].includes(request.type) &&
    request.data !== undefined &&
    request.metadata?.relatedPR !== undefined &&
    request.metadata?.timestamp !== undefined &&
    request.metadata?.version !== undefined
  )
}

/**
 * Helper to simulate different network conditions
 */
export const NETWORK_CONDITIONS = {
  FAST: { delay: 50, errorRate: 0 },
  SLOW: { delay: 2000, errorRate: 0 },
  UNRELIABLE: { delay: 500, errorRate: 0.3 },
  OFFLINE: { delay: 0, errorRate: 1 },
} as const

/**
 * Mock webhook server factory for different test scenarios
 */
export function createMockTodServer(scenario: keyof typeof TOD_TEST_SCENARIOS): MockTodWebhookServer {
  const server = new MockTodWebhookServer()
  const testScenario = TOD_TEST_SCENARIOS[scenario]

  if ('response' in testScenario) {
    server.setResponse(testScenario.response)
  }

  if ('error' in testScenario) {
    server.setErrorScenario(testScenario.error)
  }

  return server
}
