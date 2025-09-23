// Set environment variables before Next.js config loads
process.env.NEXTAUTH_SECRET = "test-secret-key-for-testing-only"
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test"
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000"
process.env.NEXTAUTH_URL = "http://localhost:3000"
process.env.NODE_ENV = "test"

import nextJest from "next/jest"

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: "./",
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you based on your tsconfig.json paths)
    "^@/(.*)$": "<rootDir>/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  collectCoverageFrom: [
    "lib/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "app/api/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 35,
      functions: 34,
      lines: 37,
      statements: 37,
    },
  },
  testMatch: [
    "**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)",
    "**/*.(test|spec).(js|jsx|ts|tsx)",
  ],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig)
