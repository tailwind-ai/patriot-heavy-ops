/**
 * Enhanced Error Types Tests
 *
 * Comprehensive test suite for structured error handling types.
 * Tests all 8 error categories, factory functions, type guards, and error categorization.
 *
 * TDD Implementation: These tests are written FIRST and should FAIL initially.
 */

import {
  // Factory Functions
  createValidationError,
  createAuthenticationError,
  createAuthorizationError,
  createDatabaseError,
  createNetworkError,
  createBusinessLogicError,
  createSystemError,
  createExternalServiceError,

  // Type Guards
  isValidationError,
  isAuthenticationError,
  isAuthorizationError,
  isDatabaseError,
  isNetworkError,
  isBusinessLogicError,
  isSystemError,
  isExternalServiceError,
  isStructuredError,

  // Enums
  ErrorSeverity,
  ErrorCategory,
} from "../../lib/types/errors"

describe("Enhanced Error Types - Structured Error Handling", () => {
  describe("ErrorSeverity Enum", () => {
    it("should define LOW severity level", () => {
      expect(ErrorSeverity.LOW).toBeDefined()
    })

    it("should define MEDIUM severity level", () => {
      expect(ErrorSeverity.MEDIUM).toBeDefined()
    })

    it("should define HIGH severity level", () => {
      expect(ErrorSeverity.HIGH).toBeDefined()
    })

    it("should define CRITICAL severity level", () => {
      expect(ErrorSeverity.CRITICAL).toBeDefined()
    })
  })

  describe("ErrorCategory Enum", () => {
    it("should define all 8 error categories", () => {
      expect(ErrorCategory.VALIDATION).toBe("VALIDATION")
      expect(ErrorCategory.AUTHENTICATION).toBe("AUTHENTICATION")
      expect(ErrorCategory.AUTHORIZATION).toBe("AUTHORIZATION")
      expect(ErrorCategory.DATABASE).toBe("DATABASE")
      expect(ErrorCategory.NETWORK).toBe("NETWORK")
      expect(ErrorCategory.BUSINESS_LOGIC).toBe("BUSINESS_LOGIC")
      expect(ErrorCategory.SYSTEM).toBe("SYSTEM")
      expect(ErrorCategory.EXTERNAL_SERVICE).toBe("EXTERNAL_SERVICE")
    })
  })

  describe("ValidationError Factory", () => {
    it("should create ValidationError with required fields", () => {
      const error = createValidationError(
        "Invalid email format",
        "INVALID_EMAIL"
      )

      expect(error.category).toBe(ErrorCategory.VALIDATION)
      expect(error.code).toBe("INVALID_EMAIL")
      expect(error.message).toBe("Invalid email format")
      expect(error.severity).toBe(ErrorSeverity.LOW)
      expect(error.timestamp).toBeInstanceOf(Date)
      expect(error.retryable).toBe(false)
    })

    it("should create ValidationError with optional fields", () => {
      const details = { field: "email", value: "invalid" }
      const error = createValidationError(
        "Invalid email format",
        "INVALID_EMAIL",
        details,
        ErrorSeverity.MEDIUM
      )

      expect(error.details).toEqual(details)
      expect(error.severity).toBe(ErrorSeverity.MEDIUM)
    })

    it("should create ValidationError with field validation details", () => {
      const error = createValidationError(
        "Missing required fields",
        "VALIDATION_ERROR",
        { missingFields: ["name", "email"] }
      )

      expect(error.details?.missingFields).toEqual(["name", "email"])
    })
  })

  describe("AuthenticationError Factory", () => {
    it("should create AuthenticationError with required fields", () => {
      const error = createAuthenticationError(
        "Invalid credentials",
        "INVALID_CREDENTIALS"
      )

      expect(error.category).toBe(ErrorCategory.AUTHENTICATION)
      expect(error.code).toBe("INVALID_CREDENTIALS")
      expect(error.message).toBe("Invalid credentials")
      expect(error.severity).toBe(ErrorSeverity.MEDIUM)
      expect(error.timestamp).toBeInstanceOf(Date)
      expect(error.retryable).toBe(false)
    })

    it("should create AuthenticationError with token expiration", () => {
      const error = createAuthenticationError("Token expired", "TOKEN_EXPIRED")

      expect(error.code).toBe("TOKEN_EXPIRED")
      expect(error.retryable).toBe(false)
    })
  })

  describe("AuthorizationError Factory", () => {
    it("should create AuthorizationError with required fields", () => {
      const error = createAuthorizationError(
        "Insufficient permissions",
        "ACCESS_DENIED"
      )

      expect(error.category).toBe(ErrorCategory.AUTHORIZATION)
      expect(error.code).toBe("ACCESS_DENIED")
      expect(error.message).toBe("Insufficient permissions")
      expect(error.severity).toBe(ErrorSeverity.MEDIUM)
      expect(error.timestamp).toBeInstanceOf(Date)
      expect(error.retryable).toBe(false)
    })

    it("should create AuthorizationError with role requirements", () => {
      const error = createAuthorizationError(
        "Requires admin role",
        "INSUFFICIENT_PERMISSIONS",
        { requiredRole: "ADMIN", userRole: "USER" }
      )

      expect(error.details?.requiredRole).toBe("ADMIN")
      expect(error.details?.userRole).toBe("USER")
    })
  })

  describe("DatabaseError Factory", () => {
    it("should create DatabaseError with required fields", () => {
      const error = createDatabaseError(
        "Connection timeout",
        "DB_CONNECTION_ERROR"
      )

      expect(error.category).toBe(ErrorCategory.DATABASE)
      expect(error.code).toBe("DB_CONNECTION_ERROR")
      expect(error.message).toBe("Connection timeout")
      expect(error.severity).toBe(ErrorSeverity.HIGH)
      expect(error.timestamp).toBeInstanceOf(Date)
      expect(error.retryable).toBe(true)
    })

    it("should create DatabaseError with query details", () => {
      const error = createDatabaseError("Query failed", "DB_QUERY_ERROR", {
        query: "SELECT * FROM users",
        table: "users",
      })

      expect(error.details?.query).toBe("SELECT * FROM users")
      expect(error.details?.table).toBe("users")
    })

    it("should mark database errors as retryable by default", () => {
      const error = createDatabaseError("Connection lost", "DB_CONNECTION_LOST")

      expect(error.retryable).toBe(true)
    })
  })

  describe("NetworkError Factory", () => {
    it("should create NetworkError with required fields", () => {
      const error = createNetworkError("Request timeout", "NETWORK_TIMEOUT")

      expect(error.category).toBe(ErrorCategory.NETWORK)
      expect(error.code).toBe("NETWORK_TIMEOUT")
      expect(error.message).toBe("Request timeout")
      expect(error.severity).toBe(ErrorSeverity.MEDIUM)
      expect(error.timestamp).toBeInstanceOf(Date)
      expect(error.retryable).toBe(true)
    })

    it("should create NetworkError with HTTP status details", () => {
      const error = createNetworkError(
        "Service unavailable",
        "SERVICE_UNAVAILABLE",
        { statusCode: 503, url: "https://api.example.com" }
      )

      expect(error.details?.statusCode).toBe(503)
      expect(error.details?.url).toBe("https://api.example.com")
    })
  })

  describe("BusinessLogicError Factory", () => {
    it("should create BusinessLogicError with required fields", () => {
      const error = createBusinessLogicError(
        "Cannot process order",
        "ORDER_PROCESSING_FAILED"
      )

      expect(error.category).toBe(ErrorCategory.BUSINESS_LOGIC)
      expect(error.code).toBe("ORDER_PROCESSING_FAILED")
      expect(error.message).toBe("Cannot process order")
      expect(error.severity).toBe(ErrorSeverity.MEDIUM)
      expect(error.timestamp).toBeInstanceOf(Date)
      expect(error.retryable).toBe(false)
    })

    it("should create BusinessLogicError with business rule details", () => {
      const error = createBusinessLogicError(
        "Insufficient balance",
        "INSUFFICIENT_BALANCE",
        { required: 100, available: 50 }
      )

      expect(error.details?.required).toBe(100)
      expect(error.details?.available).toBe(50)
    })
  })

  describe("SystemError Factory", () => {
    it("should create SystemError with required fields", () => {
      const error = createSystemError("Out of memory", "OUT_OF_MEMORY")

      expect(error.category).toBe(ErrorCategory.SYSTEM)
      expect(error.code).toBe("OUT_OF_MEMORY")
      expect(error.message).toBe("Out of memory")
      expect(error.severity).toBe(ErrorSeverity.CRITICAL)
      expect(error.timestamp).toBeInstanceOf(Date)
      expect(error.retryable).toBe(false)
    })

    it("should create SystemError with stack trace", () => {
      const error = createSystemError(
        "Unhandled exception",
        "UNHANDLED_EXCEPTION",
        { stack: "Error: test\n  at line 1" }
      )

      expect(error.details?.stack).toContain("Error: test")
    })
  })

  describe("ExternalServiceError Factory", () => {
    it("should create ExternalServiceError with required fields", () => {
      const error = createExternalServiceError(
        "Stripe API failed",
        "STRIPE_ERROR"
      )

      expect(error.category).toBe(ErrorCategory.EXTERNAL_SERVICE)
      expect(error.code).toBe("STRIPE_ERROR")
      expect(error.message).toBe("Stripe API failed")
      expect(error.severity).toBe(ErrorSeverity.HIGH)
      expect(error.timestamp).toBeInstanceOf(Date)
      expect(error.retryable).toBe(true)
    })

    it("should create ExternalServiceError with service details", () => {
      const error = createExternalServiceError(
        "Payment processing failed",
        "PAYMENT_GATEWAY_ERROR",
        { service: "Stripe", endpoint: "/v1/charges" }
      )

      expect(error.details?.service).toBe("Stripe")
      expect(error.details?.endpoint).toBe("/v1/charges")
    })
  })

  describe("Type Guards - isValidationError", () => {
    it("should return true for ValidationError", () => {
      const error = createValidationError("Invalid input", "INVALID_INPUT")

      expect(isValidationError(error)).toBe(true)
    })

    it("should return false for non-ValidationError", () => {
      const error = createAuthenticationError("Invalid token", "INVALID_TOKEN")

      expect(isValidationError(error)).toBe(false)
    })

    it("should return false for null", () => {
      expect(isValidationError(null)).toBe(false)
    })
  })

  describe("Type Guards - isAuthenticationError", () => {
    it("should return true for AuthenticationError", () => {
      const error = createAuthenticationError(
        "Invalid credentials",
        "INVALID_CREDENTIALS"
      )

      expect(isAuthenticationError(error)).toBe(true)
    })

    it("should return false for non-AuthenticationError", () => {
      const error = createValidationError("Invalid input", "INVALID_INPUT")

      expect(isAuthenticationError(error)).toBe(false)
    })
  })

  describe("Type Guards - isAuthorizationError", () => {
    it("should return true for AuthorizationError", () => {
      const error = createAuthorizationError("Access denied", "ACCESS_DENIED")

      expect(isAuthorizationError(error)).toBe(true)
    })

    it("should return false for non-AuthorizationError", () => {
      const error = createValidationError("Invalid input", "INVALID_INPUT")

      expect(isAuthorizationError(error)).toBe(false)
    })
  })

  describe("Type Guards - isDatabaseError", () => {
    it("should return true for DatabaseError", () => {
      const error = createDatabaseError("Query failed", "DB_QUERY_ERROR")

      expect(isDatabaseError(error)).toBe(true)
    })

    it("should return false for non-DatabaseError", () => {
      const error = createNetworkError("Timeout", "NETWORK_TIMEOUT")

      expect(isDatabaseError(error)).toBe(false)
    })
  })

  describe("Type Guards - isNetworkError", () => {
    it("should return true for NetworkError", () => {
      const error = createNetworkError("Connection failed", "CONNECTION_FAILED")

      expect(isNetworkError(error)).toBe(true)
    })

    it("should return false for non-NetworkError", () => {
      const error = createDatabaseError("Query failed", "DB_QUERY_ERROR")

      expect(isNetworkError(error)).toBe(false)
    })
  })

  describe("Type Guards - isBusinessLogicError", () => {
    it("should return true for BusinessLogicError", () => {
      const error = createBusinessLogicError("Rule violation", "RULE_VIOLATION")

      expect(isBusinessLogicError(error)).toBe(true)
    })

    it("should return false for non-BusinessLogicError", () => {
      const error = createSystemError("System failure", "SYSTEM_FAILURE")

      expect(isBusinessLogicError(error)).toBe(false)
    })
  })

  describe("Type Guards - isSystemError", () => {
    it("should return true for SystemError", () => {
      const error = createSystemError("Critical failure", "CRITICAL_FAILURE")

      expect(isSystemError(error)).toBe(true)
    })

    it("should return false for non-SystemError", () => {
      const error = createExternalServiceError("API failed", "API_FAILED")

      expect(isSystemError(error)).toBe(false)
    })
  })

  describe("Type Guards - isExternalServiceError", () => {
    it("should return true for ExternalServiceError", () => {
      const error = createExternalServiceError("API timeout", "API_TIMEOUT")

      expect(isExternalServiceError(error)).toBe(true)
    })

    it("should return false for non-ExternalServiceError", () => {
      const error = createSystemError("System error", "SYSTEM_ERROR")

      expect(isExternalServiceError(error)).toBe(false)
    })
  })

  describe("Type Guards - isStructuredError", () => {
    it("should return true for any StructuredError", () => {
      const validationError = createValidationError("Invalid", "INVALID")
      const authError = createAuthenticationError("Auth failed", "AUTH_FAILED")
      const dbError = createDatabaseError("DB error", "DB_ERROR")

      expect(isStructuredError(validationError)).toBe(true)
      expect(isStructuredError(authError)).toBe(true)
      expect(isStructuredError(dbError)).toBe(true)
    })

    it("should return false for non-StructuredError", () => {
      const plainObject = { message: "error" }
      const error = new Error("Standard error")

      expect(isStructuredError(plainObject)).toBe(false)
      expect(isStructuredError(error)).toBe(false)
      expect(isStructuredError(null)).toBe(false)
      expect(isStructuredError(undefined)).toBe(false)
    })
  })

  describe("Error Severity Levels", () => {
    it("should assign LOW severity to ValidationError by default", () => {
      const error = createValidationError("Invalid", "INVALID")
      expect(error.severity).toBe(ErrorSeverity.LOW)
    })

    it("should assign MEDIUM severity to AuthenticationError by default", () => {
      const error = createAuthenticationError("Auth failed", "AUTH_FAILED")
      expect(error.severity).toBe(ErrorSeverity.MEDIUM)
    })

    it("should assign MEDIUM severity to AuthorizationError by default", () => {
      const error = createAuthorizationError("Access denied", "ACCESS_DENIED")
      expect(error.severity).toBe(ErrorSeverity.MEDIUM)
    })

    it("should assign HIGH severity to DatabaseError by default", () => {
      const error = createDatabaseError("DB error", "DB_ERROR")
      expect(error.severity).toBe(ErrorSeverity.HIGH)
    })

    it("should assign MEDIUM severity to NetworkError by default", () => {
      const error = createNetworkError("Network error", "NETWORK_ERROR")
      expect(error.severity).toBe(ErrorSeverity.MEDIUM)
    })

    it("should assign MEDIUM severity to BusinessLogicError by default", () => {
      const error = createBusinessLogicError("Logic error", "LOGIC_ERROR")
      expect(error.severity).toBe(ErrorSeverity.MEDIUM)
    })

    it("should assign CRITICAL severity to SystemError by default", () => {
      const error = createSystemError("System error", "SYSTEM_ERROR")
      expect(error.severity).toBe(ErrorSeverity.CRITICAL)
    })

    it("should assign HIGH severity to ExternalServiceError by default", () => {
      const error = createExternalServiceError("Service error", "SERVICE_ERROR")
      expect(error.severity).toBe(ErrorSeverity.HIGH)
    })
  })

  describe("Error Retry Logic", () => {
    it("should mark DatabaseError as retryable", () => {
      const error = createDatabaseError("Connection lost", "CONNECTION_LOST")
      expect(error.retryable).toBe(true)
    })

    it("should mark NetworkError as retryable", () => {
      const error = createNetworkError("Timeout", "TIMEOUT")
      expect(error.retryable).toBe(true)
    })

    it("should mark ExternalServiceError as retryable", () => {
      const error = createExternalServiceError("API timeout", "API_TIMEOUT")
      expect(error.retryable).toBe(true)
    })

    it("should mark ValidationError as non-retryable", () => {
      const error = createValidationError("Invalid", "INVALID")
      expect(error.retryable).toBe(false)
    })

    it("should mark AuthenticationError as non-retryable", () => {
      const error = createAuthenticationError("Invalid token", "INVALID_TOKEN")
      expect(error.retryable).toBe(false)
    })

    it("should mark AuthorizationError as non-retryable", () => {
      const error = createAuthorizationError("Access denied", "ACCESS_DENIED")
      expect(error.retryable).toBe(false)
    })

    it("should mark BusinessLogicError as non-retryable", () => {
      const error = createBusinessLogicError("Rule violation", "RULE_VIOLATION")
      expect(error.retryable).toBe(false)
    })

    it("should mark SystemError as non-retryable", () => {
      const error = createSystemError("Critical error", "CRITICAL_ERROR")
      expect(error.retryable).toBe(false)
    })
  })
})
