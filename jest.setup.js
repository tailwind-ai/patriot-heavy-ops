import '@testing-library/jest-dom'

// Mock environment variables before any imports
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.NODE_ENV = 'test'

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
  },
}))


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


// Global test utilities
global.fetch = jest.fn()

// Mock Next.js Response and Request
global.Response = class Response {
  constructor(body, init) {
    this.body = body
    this.status = init?.status || 200
    this.statusText = init?.statusText || 'OK'
    this.headers = new Map(Object.entries(init?.headers || {}))
  }
  
  json() {
    return Promise.resolve(JSON.parse(this.body))
  }
  
  text() {
    return Promise.resolve(this.body)
  }
}

global.Request = class Request {
  constructor(url, init) {
    this.url = url
    this.method = init?.method || 'GET'
    this.headers = new Map(Object.entries(init?.headers || {}))
    this.body = init?.body
  }
  
  json() {
    return Promise.resolve(JSON.parse(this.body))
  }
}

// Setup for each test
beforeEach(() => {
  jest.clearAllMocks()
})
