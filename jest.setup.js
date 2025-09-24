import '@testing-library/jest-dom'

// Mock environment variables before any imports
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.NODE_ENV = 'test'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test123'

// Mock the env module completely to avoid validation
jest.mock('./env.mjs', () => ({
  env: {
    NEXTAUTH_SECRET: 'test-secret',
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    NEXTAUTH_URL: 'http://localhost:3000',
    GITHUB_CLIENT_ID: 'test-github-id',
    GITHUB_CLIENT_SECRET: 'test-github-secret',
    POSTMARK_API_TOKEN: 'test-postmark-token',
    STRIPE_API_KEY: 'sk_test_123',
    STRIPE_WEBHOOK_SECRET: 'whsec_test123',
  },
}))

// Mock the database - must be done before any imports
jest.mock('./lib/db', () => {
  const mockUser = {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  }

  const mockServiceRequest = {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  }

  const mockUserSubscription = {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
  }

  const mockPost = {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  }

  const mockOperatorApplication = {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  const mockUserAssignment = {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  return {
    db: {
      user: mockUser,
      serviceRequest: mockServiceRequest,
      userSubscription: mockUserSubscription,
      post: mockPost,
      operatorApplication: mockOperatorApplication,
      userAssignment: mockUserAssignment,
    },
    mockUser,
    mockServiceRequest,
    mockUserSubscription,
    mockPost,
    mockOperatorApplication,
    mockUserAssignment,
  }
})

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    customers: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
    billingPortal: {
      sessions: {
        create: jest.fn(),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  }))
})

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
}))

// Mock NextAuth server-side
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}))

// Note: Session utilities are not globally mocked to preserve existing tests
// Individual API tests will mock these functions as needed

// Import whatwg-fetch for proper Response/Request polyfill
import 'whatwg-fetch'

// Add TextEncoder/TextDecoder polyfills for MSW
const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Note: MSW server setup is done per-test file to avoid import issues

// Mock NextResponse for API route testing
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => {
      const response = new Response(JSON.stringify(data), {
        status: init?.status || 200,
        statusText: init?.statusText || 'OK',
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      })
      
      // Add json method to response for testing
      response.json = async () => data
      return response
    }),
    redirect: jest.fn((url, status = 302) => {
      return new Response(null, {
        status,
        headers: { Location: url },
      })
    }),
  },
}))

// Global test utilities
global.fetch = jest.fn()

// Setup for each test
beforeEach(() => {
  jest.clearAllMocks()
})
