/**
 * Tests for Enhanced Error Types - Issue #301
 *
 * This test suite validates the comprehensive error handling system including:
 * - Error factory functions
 * - Type guards
 * - Result type handling
 * - Error severity and retry logic
 */

import {
  createValidationError,
  createAuthenticationError,
  createAuthorizationError,
  createDatabaseError,
  createNetworkError,
  createBusinessLogicError,
  createSystemError,
  createExternalServiceError,
  createSuccess,
  createError,
  isValidationError,
  isAuthenticationError,
  isAuthorizationError,
  isDatabaseError,
  isNetworkError,
  isBusinessLogicError,
  isSystemError,
  isExternalServiceError,
  isCriticalError,
  isRetryableError,
  ERROR_CODES,
  createLegacyError,
} from "../../lib/types/errors"

describe("Enhanced Error Types - Issue #301", () => {
  describe("Error Factory Functions", () => {
    it("should create validation errors with proper structure", () => {
      const error = createValidationError("Invalid email format", {
        field: "email",
        expectedType: "string",
      })

      expect(error.code).toBe("VALIDATION_ERROR")
      expect(error.message).toBe("Invalid email format")
      expect(error.severity).toBe("medium")
      expect(error.retryable).toBe(false)
      expect(error.field).toBe("email")
      expect(error.expectedType).toBe("string")
      expect(error.timestamp).toBeDefined()
    })

    it("should create authentication errors with proper structure", () => {
      const error = createAuthenticationError(
        "Invalid credentials",
        "INVALID_CREDENTIALS",
        {
          userId: "user123",
        }
      )

      expect(error.code).toBe("INVALID_CREDENTIALS")
      expect(error.message).toBe("Invalid credentials")
      expect(error.severity).toBe("high")
      expect(error.retryable).toBe(false)
      expect(error.userId).toBe("user123")
      expect(error.timestamp).toBeDefined()
    })

    it("should create authorization errors with proper structure", () => {
      const error = createAuthorizationError("Access denied", "ACCESS_DENIED", {
        userId: "user123",
        requiredRole: "ADMIN",
        resource: "/admin/users",
      })

      expect(error.code).toBe("ACCESS_DENIED")
      expect(error.message).toBe("Access denied")
      expect(error.severity).toBe("high")
      expect(error.retryable).toBe(false)
      expect(error.userId).toBe("user123")
      expect(error.requiredRole).toBe("ADMIN")
      expect(error.resource).toBe("/admin/users")
    })

    it("should create database errors with proper structure", () => {
      const error = createDatabaseError(
        "Connection failed",
        "CONNECTION_FAILED",
        {
          query: "SELECT * FROM users",
          table: "users",
        }
      )

      expect(error.code).toBe("CONNECTION_FAILED")
      expect(error.message).toBe("Connection failed")
      expect(error.severity).toBe("critical")
      expect(error.retryable).toBe(true)
      expect(error.query).toBe("SELECT * FROM users")
      expect(error.table).toBe("users")
    })

    it("should create network errors with proper structure", () => {
      const error = createNetworkError("Request timeout", "REQUEST_TIMEOUT", {
        url: "https://api.example.com",
        statusCode: 408,
        method: "GET",
      })

      expect(error.code).toBe("REQUEST_TIMEOUT")
      expect(error.message).toBe("Request timeout")
      expect(error.severity).toBe("high")
      expect(error.retryable).toBe(true)
      expect(error.url).toBe("https://api.example.com")
      expect(error.statusCode).toBe(408)
      expect(error.method).toBe("GET")
    })

    it("should create business logic errors with proper structure", () => {
      const error = createBusinessLogicError(
        "Invalid operation",
        "INVALID_OPERATION",
        {
          operation: "deleteUser",
          context: { userId: "user123", reason: "has active orders" },
        }
      )

      expect(error.code).toBe("INVALID_OPERATION")
      expect(error.message).toBe("Invalid operation")
      expect(error.severity).toBe("medium")
      expect(error.retryable).toBe(false)
      expect(error.operation).toBe("deleteUser")
      expect(error.context).toEqual({
        userId: "user123",
        reason: "has active orders",
      })
    })

    it("should create system errors with proper structure", () => {
      const error = createSystemError(
        "Service unavailable",
        "SERVICE_UNAVAILABLE",
        {
          service: "payment-service",
          component: "stripe-integration",
        }
      )

      expect(error.code).toBe("SERVICE_UNAVAILABLE")
      expect(error.message).toBe("Service unavailable")
      expect(error.severity).toBe("critical")
      expect(error.retryable).toBe(true)
      expect(error.service).toBe("payment-service")
      expect(error.component).toBe("stripe-integration")
    })

    it("should create external service errors with proper structure", () => {
      const error = createExternalServiceError(
        "API error",
        "stripe",
        "API_ERROR",
        {
          endpoint: "/v1/charges",
          statusCode: 500,
        }
      )

      expect(error.code).toBe("API_ERROR")
      expect(error.message).toBe("API error")
      expect(error.severity).toBe("high")
      expect(error.retryable).toBe(true)
      expect(error.service).toBe("stripe")
      expect(error.endpoint).toBe("/v1/charges")
      expect(error.statusCode).toBe(500)
    })
  })

  describe("Result Type Handling", () => {
    it("should create success results correctly", () => {
      const result = createSuccess({ id: 1, name: "Test" })

      expect(result.success).toBe(true)
      expect(result.data).toEqual({ id: 1, name: "Test" })
      expect(result.error).toBeUndefined()
    })

    it("should create error results correctly", () => {
      const error = createValidationError("Test error")
      const result = createError(error)

      expect(result.success).toBe(false)
      expect(result.error).toBe(error)
      expect(result.data).toBeUndefined()
    })

    it("should handle result type narrowing correctly", () => {
      const successResult = createSuccess("test data")
      const errorResult = createError(createValidationError("test error"))

      if (successResult.success) {
        // TypeScript should narrow the type here
        expect(successResult.data).toBe("test data")
        // error should not exist on success result
        expect(successResult.error).toBeUndefined()
      }

      if (!errorResult.success) {
        // TypeScript should narrow the type here
        expect(errorResult.error.code).toBe("VALIDATION_ERROR")
        // data should not exist on error result
        expect(errorResult.data).toBeUndefined()
      }
    })
  })

  describe("Type Guards", () => {
    it("should correctly identify validation errors", () => {
      const validationError = createValidationError("Test")
      const authError = createAuthenticationError("Test")

      expect(isValidationError(validationError)).toBe(true)
      expect(isValidationError(authError)).toBe(false)
    })

    it("should correctly identify authentication errors", () => {
      const authError = createAuthenticationError("Test", "INVALID_CREDENTIALS")
      const validationError = createValidationError("Test")

      expect(isAuthenticationError(authError)).toBe(true)
      expect(isAuthenticationError(validationError)).toBe(false)
    })

    it("should correctly identify authorization errors", () => {
      const authzError = createAuthorizationError("Test", "ACCESS_DENIED")
      const authError = createAuthenticationError("Test")

      expect(isAuthorizationError(authzError)).toBe(true)
      expect(isAuthorizationError(authError)).toBe(false)
    })

    it("should correctly identify database errors", () => {
      const dbError = createDatabaseError("Test", "CONNECTION_FAILED")
      const networkError = createNetworkError("Test")

      expect(isDatabaseError(dbError)).toBe(true)
      expect(isDatabaseError(networkError)).toBe(false)
    })

    it("should correctly identify network errors", () => {
      const networkError = createNetworkError("Test", "REQUEST_TIMEOUT")
      const dbError = createDatabaseError("Test")

      expect(isNetworkError(networkError)).toBe(true)
      expect(isNetworkError(dbError)).toBe(false)
    })

    it("should correctly identify business logic errors", () => {
      const businessError = createBusinessLogicError(
        "Test",
        "INVALID_OPERATION"
      )
      const systemError = createSystemError("Test")

      expect(isBusinessLogicError(businessError)).toBe(true)
      expect(isBusinessLogicError(systemError)).toBe(false)
    })

    it("should correctly identify system errors", () => {
      const systemError = createSystemError("Test", "SERVICE_UNAVAILABLE")
      const businessError = createBusinessLogicError("Test")

      expect(isSystemError(systemError)).toBe(true)
      expect(isSystemError(businessError)).toBe(false)
    })

    it("should correctly identify external service errors", () => {
      const externalError = createExternalServiceError(
        "Test",
        "stripe",
        "API_ERROR"
      )
      const systemError = createSystemError("Test")

      expect(isExternalServiceError(externalError)).toBe(true)
      expect(isExternalServiceError(systemError)).toBe(false)
    })
  })

  describe("Error Severity and Retry Logic", () => {
    it("should correctly identify critical errors", () => {
      const criticalError = createDatabaseError("Test") // Critical by default
      const mediumError = createValidationError("Test") // Medium by default

      expect(isCriticalError(criticalError)).toBe(true)
      expect(isCriticalError(mediumError)).toBe(false)
    })

    it("should correctly identify retryable errors", () => {
      const retryableError = createNetworkError("Test") // Retryable by default
      const nonRetryableError = createValidationError("Test") // Not retryable by default

      expect(isRetryableError(retryableError)).toBe(true)
      expect(isRetryableError(nonRetryableError)).toBe(false)
    })

    it("should set appropriate severity for network errors based on status code", () => {
      const serverError = createNetworkError("Server error", "NETWORK_ERROR", {
        statusCode: 500,
      })
      const clientError = createNetworkError("Client error", "NETWORK_ERROR", {
        statusCode: 400,
      })

      expect(serverError.severity).toBe("critical")
      expect(clientError.severity).toBe("high")
    })
  })

  describe("Error Codes Constants", () => {
    it("should have all required error codes defined", () => {
      expect(ERROR_CODES.VALIDATION_ERROR).toBe("VALIDATION_ERROR")
      expect(ERROR_CODES.AUTHENTICATION_ERROR).toBe("AUTHENTICATION_ERROR")
      expect(ERROR_CODES.AUTHORIZATION_ERROR).toBe("AUTHORIZATION_ERROR")
      expect(ERROR_CODES.DATABASE_ERROR).toBe("DATABASE_ERROR")
      expect(ERROR_CODES.NETWORK_ERROR).toBe("NETWORK_ERROR")
      expect(ERROR_CODES.BUSINESS_LOGIC_ERROR).toBe("BUSINESS_LOGIC_ERROR")
      expect(ERROR_CODES.SYSTEM_ERROR).toBe("SYSTEM_ERROR")
      expect(ERROR_CODES.EXTERNAL_SERVICE_ERROR).toBe("EXTERNAL_SERVICE_ERROR")

      // Legacy codes
      expect(ERROR_CODES.NOT_FOUND).toBe("NOT_FOUND")
      expect(ERROR_CODES.PASSWORD_CHANGE_FAILED).toBe("PASSWORD_CHANGE_FAILED")
    })

    it("should have consistent error code format", () => {
      const codes = Object.values(ERROR_CODES)

      codes.forEach((code) => {
        expect(typeof code).toBe("string")
        expect(code.length).toBeGreaterThan(0)
        expect(code).toMatch(/^[A-Z_]+$/) // Should be uppercase with underscores
      })
    })
  })

  describe("Legacy Support", () => {
    it("should handle legacy error codes", () => {
      const notFoundError = createLegacyError("NOT_FOUND", "User not found")
      const passwordError = createLegacyError(
        "PASSWORD_CHANGE_FAILED",
        "Password change failed"
      )
      const unknownError = createLegacyError("UNKNOWN_ERROR", "Unknown error")

      expect(isValidationError(notFoundError)).toBe(true)
      expect(isAuthenticationError(passwordError)).toBe(true)
      expect(isSystemError(unknownError)).toBe(true)

      expect(notFoundError.details?.legacyCode).toBe("NOT_FOUND")
      expect(passwordError.details?.legacyCode).toBe("PASSWORD_CHANGE_FAILED")
      expect(unknownError.details?.legacyCode).toBe("UNKNOWN_ERROR")
    })
  })
})
