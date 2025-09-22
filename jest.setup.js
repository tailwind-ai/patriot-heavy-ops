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

// Mock the database
jest.mock('./lib/db')

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

// Global test utilities
global.fetch = jest.fn()

// Setup for each test
beforeEach(() => {
  jest.clearAllMocks()
})
