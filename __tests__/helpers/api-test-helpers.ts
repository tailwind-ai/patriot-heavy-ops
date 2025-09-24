import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { UserRole } from '@/lib/permissions'

// Extract getServerSession mock to avoid duplication
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

/**
 * Create a mock NextRequest for testing API routes
 */
export function createMockRequest(
  method: string,
  url: string = 'http://localhost:3000/api/test',
  body?: any,
  headers?: Record<string, string>
): NextRequest {
  const requestInit: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    requestInit.body = JSON.stringify(body)
  }

  // Create a mock NextRequest that extends Request
  const request = new Request(url, requestInit) as NextRequest
  
  // Add NextRequest-specific properties
  Object.defineProperty(request, 'nextUrl', {
    value: new URL(url),
    writable: false,
  })

  Object.defineProperty(request, 'cookies', {
    value: {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      has: jest.fn(),
      clear: jest.fn(),
    },
    writable: false,
  })

  Object.defineProperty(request, 'geo', {
    value: undefined,
    writable: false,
  })

  Object.defineProperty(request, 'ip', {
    value: '127.0.0.1',
    writable: false,
  })

  Object.defineProperty(request, 'page', {
    value: undefined,
    writable: false,
  })

  Object.defineProperty(request, 'ua', {
    value: undefined,
    writable: false,
  })

  return request
}

/**
 * Mock a user session for testing
 */
export function mockSession(user: {
  id: string
  name?: string | null
  email?: string | null
  role?: UserRole
}) {
  mockGetServerSession.mockResolvedValue({
    user: {
      id: user.id,
      name: user.name || 'Test User',
      email: user.email || 'test@example.com',
      role: user.role || 'USER',
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  })
}

/**
 * Mock no session (unauthenticated user)
 */
export function mockNoSession() {
  mockGetServerSession.mockResolvedValue(null)
}

/**
 * Create mock route context for dynamic routes (Next.js 15 - params are now async)
 */
export function createMockRouteContext(params: Record<string, string>) {
  return {
    params: Promise.resolve(params),
  }
}

/**
 * Create mock route context for service request routes (Next.js 15)
 */
export function createMockServiceRequestContext(requestId: string) {
  return {
    params: Promise.resolve({ requestId }),
  }
}

/**
 * Create mock route context for user routes (Next.js 15)
 */
export function createMockUserContext(userId: string) {
  return {
    params: Promise.resolve({ userId }),
  }
}

/**
 * Helper to extract JSON from Response object
 */
export async function getResponseJson(response: Response) {
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

/**
 * Helper to assert response status and content type
 */
export function assertResponse(
  response: Response,
  expectedStatus: number,
  expectedContentType?: string
) {
  expect(response.status).toBe(expectedStatus)
  
  if (expectedContentType) {
    expect(response.headers.get('content-type')).toContain(expectedContentType)
  }
}

/**
 * Common test user data for different roles
 */
export const TEST_USERS = {
  USER: {
    id: 'user-test-id',
    name: 'Test User',
    email: 'user@test.com',
    role: 'USER' as UserRole,
  },
  OPERATOR: {
    id: 'operator-test-id',
    name: 'Test Operator',
    email: 'operator@test.com',
    role: 'OPERATOR' as UserRole,
  },
  MANAGER: {
    id: 'manager-test-id',
    name: 'Test Manager',
    email: 'manager@test.com',
    role: 'MANAGER' as UserRole,
  },
  ADMIN: {
    id: 'admin-test-id',
    name: 'Test Admin',
    email: 'admin@test.com',
    role: 'ADMIN' as UserRole,
  },
} as const

/**
 * Reset all mocks between tests
 */
export function resetAllMocks() {
  jest.clearAllMocks()
}
