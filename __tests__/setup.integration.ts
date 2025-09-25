/**
 * Integration Test Setup
 *
 * This file sets up the environment for integration tests.
 * Integration tests test the interaction between different parts of the system.
 */

import "@testing-library/jest-dom"

// Extend Jest timeout for integration tests
jest.setTimeout(30000)

// Mock environment variables for integration tests
// Note: NODE_ENV is set in jest.integration.config.js
process.env.NEXTAUTH_SECRET = "test-secret-for-integration"
process.env.NEXTAUTH_URL = "http://localhost:3000"

// Global setup for integration tests
beforeAll(async () => {
  // Add any global setup needed for integration tests
  // eslint-disable-next-line no-console
  console.log("🧪 Starting integration test suite")
})

afterAll(async () => {
  // Add any global cleanup needed for integration tests
  // eslint-disable-next-line no-console
  console.log("✅ Integration test suite completed")
})

// Reset state between integration tests
beforeEach(() => {
  // Clear any global state between tests
  jest.clearAllMocks()
})
