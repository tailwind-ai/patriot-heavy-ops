/**
 * Enhanced Error Types Tests - Issue #301
 *
 * Tests for structured error types and error boundary patterns
 * Following cursorrules.md Platform Mode - conservative, proven patterns only
 */

import { describe, it, expect } from "@jest/globals"
import {
  createValidationError,
  createAuthenticationError,
  createAuthorizationError,
  createDatabaseError,
  createNetworkError,
  createBusinessLogicError,
  createSystemError,
  createExternalServiceError,
  createSuccessResult,
  createErrorResult,
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
  type Result,
} from "../../lib/types/errors"

describe("Enhanced Error Types - Issue #301", () => {
  describe("Error Factory Functions", () => {
    it("should create validation errors with proper structure", () => {
      const error = createValidationError(
        ERROR_CODES.INVALID_INPUT,
        "Email format is invalid",
        {
          field: "email",
          value: "invalid-email",
          constraint: "email format",
          userMessage: "Please enter a valid email address",
        }
      )

      expect(error.code).toBe(ERROR_CODES.INVALID_INPUT)
      expect(error.message).toBe("Email format is invalid")
      expect(error.category).toBe("validation")
      expect(error.severity).toBe("medium")
      expect(error.retryable).toBe(false)
      expect(error.field).toBe("email")
      expect(error.value).toBe("invalid-email")
      expect(error.constraint).toBe("email format")
      expect(error.userMessage).toBe("Please enter a valid email address")
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it("should create authentication errors with proper structure", () => {
      const error = createAuthenticationError(
        ERROR_CODES.INVALID_CREDENTIALS,
        "Invalid username or password",
        {
          attemptCount: 3,
          userMessage: "Login failed. Please check your credentials.",
        }
      )

      expect(error.code).toBe(ERROR_CODES.INVALID_CREDENTIALS)
      expect(error.category).toBe("authentication")
      expect(error.severity).toBe("high")
      expect(error.retryable).toBe(false)
      expect(error.attemptCount).toBe(3)
      expect(error.userMessage).toBe(
        "Login failed. Please check your credentials."
      )
    })

    it("should create authorization errors with proper structure", () => {
      const error = createAuthorizationError(
        ERROR_CODES.ACCESS_DENIED,
        "User does not have required permissions",
        {
          requiredRole: "ADMIN",
          currentRole: "USER",
          resource: "/admin/users",
        }
      )

      expect(error.code).toBe(ERROR_CODES.ACCESS_DENIED)
      expect(error.category).toBe("authorization")
      expect(error.severity).toBe("high")
      expect(error.retryable).toBe(false)
      expect(error.requiredRole).toBe("ADMIN")
      expect(error.currentRole).toBe("USER")
      expect(error.resource).toBe("/admin/users")
    })

    it("should create database errors with proper structure", () => {
      const error = createDatabaseError(
        ERROR_CODES.CONSTRAINT_VIOLATION,
        "Unique constraint violation on email field",
        {
          operation: "create",
          table: "users",
          constraint: "unique_email",
        }
      )

      expect(error.code).toBe(ERROR_CODES.CONSTRAINT_VIOLATION)
      expect(error.category).toBe("database")
      expect(error.severity).toBe("critical")
      expect(error.retryable).toBe(true)
      expect(error.operation).toBe("create")
      expect(error.table).toBe("users")
      expect(error.constraint).toBe("unique_email")
    })

    it("should create network errors with proper structure", () => {
      const error = createNetworkError(
        ERROR_CODES.SERVICE_UNAVAILABLE,
        "External service is temporarily unavailable",
        {
          statusCode: 503,
          endpoint: "/api/external/service",
          timeout: false,
        }
      )

      expect(error.code).toBe(ERROR_CODES.SERVICE_UNAVAILABLE)
      expect(error.category).toBe("network")
      expect(error.severity).toBe("critical") // 5xx status codes are critical
      expect(error.retryable).toBe(true)
      expect(error.statusCode).toBe(503)
      expect(error.endpoint).toBe("/api/external/service")
      expect(error.timeout).toBe(false)
    })

    it("should create business logic errors with proper structure", () => {
      const error = createBusinessLogicError(
        ERROR_CODES.BUSINESS_RULE_VIOLATION,
        "Cannot delete user with active subscriptions",
        {
          rule: "no_delete_with_active_subscriptions",
          expectedValue: 0,
          actualValue: 2,
        }
      )

      expect(error.code).toBe(ERROR_CODES.BUSINESS_RULE_VIOLATION)
      expect(error.category).toBe("business_logic")
      expect(error.severity).toBe("medium")
      expect(error.retryable).toBe(false)
      expect(error.rule).toBe("no_delete_with_active_subscriptions")
      expect(error.expectedValue).toBe(0)
      expect(error.actualValue).toBe(2)
    })

    it("should create system errors with proper structure", () => {
      const error = createSystemError(
        ERROR_CODES.OUT_OF_MEMORY,
        "System is running low on memory",
        {
          component: "image-processor",
          memoryUsage: 95,
        }
      )

      expect(error.code).toBe(ERROR_CODES.OUT_OF_MEMORY)
      expect(error.category).toBe("system")
      expect(error.severity).toBe("critical")
      expect(error.retryable).toBe(true)
      expect(error.component).toBe("image-processor")
      expect(error.memoryUsage).toBe(95)
    })

    it("should create external service errors with proper structure", () => {
      const error = createExternalServiceError(
        ERROR_CODES.THIRD_PARTY_TIMEOUT,
        "Payment gateway request timed out",
        {
          service: "stripe",
          endpoint: "/v1/charges",
          responseTime: 30000,
        }
      )

      expect(error.code).toBe(ERROR_CODES.THIRD_PARTY_TIMEOUT)
      expect(error.category).toBe("external_service")
      expect(error.severity).toBe("high")
      expect(error.retryable).toBe(true)
      expect(error.service).toBe("stripe")
      expect(error.endpoint).toBe("/v1/charges")
      expect(error.responseTime).toBe(30000)
    })
  })

  describe("Result Type Handling", () => {
    it("should create success results correctly", () => {
      const data = { id: "123", name: "Test User" }
      const result = createSuccessResult(data)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(data)
      expect(result.error).toBeUndefined()
    })

    it("should create error results correctly", () => {
      const error = createValidationError(
        ERROR_CODES.INVALID_INPUT,
        "Test error"
      )
      const result = createErrorResult(error)

      expect(result.success).toBe(false)
      expect(result.error).toEqual(error)
      expect(result.data).toBeUndefined()
    })

    it("should handle result type narrowing correctly", () => {
      const successResult: Result<string> = createSuccessResult("test data")
      const errorResult: Result<string> = createErrorResult(
        createValidationError(ERROR_CODES.INVALID_INPUT, "Test error")
      )

      if (successResult.success) {
        // TypeScript should narrow the type here
        expect(successResult.data).toBe("test data")
        expect(successResult.error).toBeUndefined()
      }

      if (!errorResult.success) {
        // TypeScript should narrow the type here
        expect(errorResult.error.code).toBe(ERROR_CODES.INVALID_INPUT)
        expect(errorResult.data).toBeUndefined()
      }
    })
  })

  describe("Type Guards", () => {
    const validationError = createValidationError(
      ERROR_CODES.INVALID_INPUT,
      "Test"
    )
    const authError = createAuthenticationError(
      ERROR_CODES.INVALID_CREDENTIALS,
      "Test"
    )
    const authzError = createAuthorizationError(
      ERROR_CODES.ACCESS_DENIED,
      "Test"
    )
    const dbError = createDatabaseError(ERROR_CODES.RECORD_NOT_FOUND, "Test")
    const networkError = createNetworkError(ERROR_CODES.NETWORK_TIMEOUT, "Test")
    const businessError = createBusinessLogicError(
      ERROR_CODES.BUSINESS_RULE_VIOLATION,
      "Test"
    )
    const systemError = createSystemError(ERROR_CODES.OUT_OF_MEMORY, "Test")
    const externalError = createExternalServiceError(
      ERROR_CODES.EXTERNAL_API_ERROR,
      "Test"
    )

    it("should correctly identify validation errors", () => {
      expect(isValidationError(validationError)).toBe(true)
      expect(isValidationError(authError)).toBe(false)
    })

    it("should correctly identify authentication errors", () => {
      expect(isAuthenticationError(authError)).toBe(true)
      expect(isAuthenticationError(validationError)).toBe(false)
    })

    it("should correctly identify authorization errors", () => {
      expect(isAuthorizationError(authzError)).toBe(true)
      expect(isAuthorizationError(authError)).toBe(false)
    })

    it("should correctly identify database errors", () => {
      expect(isDatabaseError(dbError)).toBe(true)
      expect(isDatabaseError(networkError)).toBe(false)
    })

    it("should correctly identify network errors", () => {
      expect(isNetworkError(networkError)).toBe(true)
      expect(isNetworkError(dbError)).toBe(false)
    })

    it("should correctly identify business logic errors", () => {
      expect(isBusinessLogicError(businessError)).toBe(true)
      expect(isBusinessLogicError(systemError)).toBe(false)
    })

    it("should correctly identify system errors", () => {
      expect(isSystemError(systemError)).toBe(true)
      expect(isSystemError(externalError)).toBe(false)
    })

    it("should correctly identify external service errors", () => {
      expect(isExternalServiceError(externalError)).toBe(true)
      expect(isExternalServiceError(validationError)).toBe(false)
    })
  })

  describe("Error Severity and Retry Logic", () => {
    it("should correctly identify critical errors", () => {
      const criticalError = createDatabaseError(
        ERROR_CODES.DATABASE_CONNECTION_FAILED,
        "Test"
      )
      const nonCriticalError = createValidationError(
        ERROR_CODES.INVALID_INPUT,
        "Test"
      )

      expect(isCriticalError(criticalError)).toBe(true)
      expect(isCriticalError(nonCriticalError)).toBe(false)
    })

    it("should correctly identify retryable errors", () => {
      const retryableError = createNetworkError(
        ERROR_CODES.NETWORK_TIMEOUT,
        "Test"
      )
      const nonRetryableError = createValidationError(
        ERROR_CODES.INVALID_INPUT,
        "Test"
      )

      expect(isRetryableError(retryableError)).toBe(true)
      expect(isRetryableError(nonRetryableError)).toBe(false)
    })

    it("should set appropriate severity for network errors based on status code", () => {
      const serverError = createNetworkError(
        ERROR_CODES.SERVICE_UNAVAILABLE,
        "Test",
        { statusCode: 500 }
      )
      const clientError = createNetworkError(
        ERROR_CODES.SERVICE_UNAVAILABLE,
        "Test",
        { statusCode: 400 }
      )

      expect(serverError.severity).toBe("critical")
      expect(clientError.severity).toBe("high")
    })
  })

  describe("Error Codes Constants", () => {
    it("should have all required error codes defined", () => {
      expect(ERROR_CODES.VALIDATION_FAILED).toBe("VALIDATION_FAILED")
      expect(ERROR_CODES.INVALID_CREDENTIALS).toBe("INVALID_CREDENTIALS")
      expect(ERROR_CODES.ACCESS_DENIED).toBe("ACCESS_DENIED")
      expect(ERROR_CODES.DATABASE_CONNECTION_FAILED).toBe(
        "DATABASE_CONNECTION_FAILED"
      )
      expect(ERROR_CODES.NETWORK_TIMEOUT).toBe("NETWORK_TIMEOUT")
      expect(ERROR_CODES.BUSINESS_RULE_VIOLATION).toBe(
        "BUSINESS_RULE_VIOLATION"
      )
      expect(ERROR_CODES.OUT_OF_MEMORY).toBe("OUT_OF_MEMORY")
      expect(ERROR_CODES.EXTERNAL_API_ERROR).toBe("EXTERNAL_API_ERROR")
    })

    it("should have consistent error code format", () => {
      const errorCodes = Object.values(ERROR_CODES)

      errorCodes.forEach((code) => {
        expect(code).toMatch(/^[A-Z_]+$/) // Should be uppercase with underscores
        expect(code.length).toBeGreaterThan(3) // Should be descriptive
      })
    })
  })
})
