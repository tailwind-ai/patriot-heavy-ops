/**
 * Jest Configuration for Integration Tests
 * 
 * This configuration is specifically for integration tests that test
 * the interaction between different parts of the system.
 */

// Set environment variables before Next.js config loads
process.env.NEXTAUTH_SECRET = "test-secret-key-for-integration-testing"
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test"
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000"
process.env.NEXTAUTH_URL = "http://localhost:3000"
process.env.NODE_ENV = "test"

const nextJest = require("next/jest")

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: "./",
})

// Integration test specific configuration
const integrationJestConfig = {
  displayName: 'Integration Tests',
  testMatch: [
    '<rootDir>/__tests__/integration/**/*.test.{js,ts,tsx}',
    '<rootDir>/__tests__/**/*.integration.test.{js,ts,tsx}'
  ],
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    '<rootDir>/__tests__/setup.integration.ts'
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  // Integration tests may take longer
  testTimeout: 30000,
  // Run integration tests serially to avoid conflicts
  maxWorkers: 1,
  // Don't collect coverage for integration tests by default
  collectCoverage: false,
  // Clear mocks between tests for integration testing
  clearMocks: true,
  restoreMocks: true,
  verbose: true,
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"]
}

module.exports = createJestConfig(integrationJestConfig)
