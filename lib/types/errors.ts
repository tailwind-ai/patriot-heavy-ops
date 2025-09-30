/**
 * Enhanced Error Types - Structured Error Handling
 * 
 * Provides comprehensive error categorization with 8 distinct error types.
 * Implements factory functions, type guards, and severity/retry patterns.
 * 
 * Design Principles:
 * - Type-safe error categorization
 * - Backward compatible with existing ServiceError
 * - Runtime type identification via type guards
 * - Severity levels for error prioritization
 * - Retry logic patterns for transient errors
 */

import { ServiceError } from '../services/base-service';

/**
 * Error Severity Levels
 * Used for error prioritization and alerting
 */
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Error Category Types
 * Defines the 8 primary error categories
 */
export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  SYSTEM = 'SYSTEM',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
}

/**
 * Base Structured Error Interface
 * Extends ServiceError with category, severity, and retry information
 */
export type StructuredError = ServiceError & {
  category: ErrorCategory;
  severity: ErrorSeverity;
  retryable: boolean;
};

/**
 * ValidationError - Form and input validation failures
 */
export type ValidationError = StructuredError & {
  category: ErrorCategory.VALIDATION;
};

/**
 * AuthenticationError - Login and credential issues
 */
export type AuthenticationError = StructuredError & {
  category: ErrorCategory.AUTHENTICATION;
};

/**
 * AuthorizationError - Permission and access control
 */
export type AuthorizationError = StructuredError & {
  category: ErrorCategory.AUTHORIZATION;
};

/**
 * DatabaseError - Database connection and query issues
 */
export type DatabaseError = StructuredError & {
  category: ErrorCategory.DATABASE;
};

/**
 * NetworkError - API and external service failures
 */
export type NetworkError = StructuredError & {
  category: ErrorCategory.NETWORK;
};

/**
 * BusinessLogicError - Domain-specific rule violations
 */
export type BusinessLogicError = StructuredError & {
  category: ErrorCategory.BUSINESS_LOGIC;
};

/**
 * SystemError - Infrastructure and runtime issues
 */
export type SystemError = StructuredError & {
  category: ErrorCategory.SYSTEM;
};

/**
 * ExternalServiceError - Third-party integration failures
 */
export type ExternalServiceError = StructuredError & {
  category: ErrorCategory.EXTERNAL_SERVICE;
};

/**
 * Factory function for ValidationError
 */
export function createValidationError(
  message: string,
  code: string,
  details?: Record<string, unknown>,
  severity: ErrorSeverity = ErrorSeverity.LOW
): ValidationError {
  return {
    category: ErrorCategory.VALIDATION,
    code,
    message,
    severity,
    retryable: false,
    timestamp: new Date(),
    ...(details && { details }),
  };
}

/**
 * Factory function for AuthenticationError
 */
export function createAuthenticationError(
  message: string,
  code: string,
  details?: Record<string, unknown>,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM
): AuthenticationError {
  return {
    category: ErrorCategory.AUTHENTICATION,
    code,
    message,
    severity,
    retryable: false,
    timestamp: new Date(),
    ...(details && { details }),
  };
}

/**
 * Factory function for AuthorizationError
 */
export function createAuthorizationError(
  message: string,
  code: string,
  details?: Record<string, unknown>,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM
): AuthorizationError {
  return {
    category: ErrorCategory.AUTHORIZATION,
    code,
    message,
    severity,
    retryable: false,
    timestamp: new Date(),
    ...(details && { details }),
  };
}

/**
 * Factory function for DatabaseError
 */
export function createDatabaseError(
  message: string,
  code: string,
  details?: Record<string, unknown>,
  severity: ErrorSeverity = ErrorSeverity.HIGH
): DatabaseError {
  return {
    category: ErrorCategory.DATABASE,
    code,
    message,
    severity,
    retryable: true,
    timestamp: new Date(),
    ...(details && { details }),
  };
}

/**
 * Factory function for NetworkError
 */
export function createNetworkError(
  message: string,
  code: string,
  details?: Record<string, unknown>,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM
): NetworkError {
  return {
    category: ErrorCategory.NETWORK,
    code,
    message,
    severity,
    retryable: true,
    timestamp: new Date(),
    ...(details && { details }),
  };
}

/**
 * Factory function for BusinessLogicError
 */
export function createBusinessLogicError(
  message: string,
  code: string,
  details?: Record<string, unknown>,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM
): BusinessLogicError {
  return {
    category: ErrorCategory.BUSINESS_LOGIC,
    code,
    message,
    severity,
    retryable: false,
    timestamp: new Date(),
    ...(details && { details }),
  };
}

/**
 * Factory function for SystemError
 */
export function createSystemError(
  message: string,
  code: string,
  details?: Record<string, unknown>,
  severity: ErrorSeverity = ErrorSeverity.CRITICAL
): SystemError {
  return {
    category: ErrorCategory.SYSTEM,
    code,
    message,
    severity,
    retryable: false,
    timestamp: new Date(),
    ...(details && { details }),
  };
}

/**
 * Factory function for ExternalServiceError
 */
export function createExternalServiceError(
  message: string,
  code: string,
  details?: Record<string, unknown>,
  severity: ErrorSeverity = ErrorSeverity.HIGH
): ExternalServiceError {
  return {
    category: ErrorCategory.EXTERNAL_SERVICE,
    code,
    message,
    severity,
    retryable: true,
    timestamp: new Date(),
    ...(details && { details }),
  };
}

/**
 * Type guard for ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'category' in error &&
    error.category === ErrorCategory.VALIDATION
  );
}

/**
 * Type guard for AuthenticationError
 */
export function isAuthenticationError(error: unknown): error is AuthenticationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'category' in error &&
    error.category === ErrorCategory.AUTHENTICATION
  );
}

/**
 * Type guard for AuthorizationError
 */
export function isAuthorizationError(error: unknown): error is AuthorizationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'category' in error &&
    error.category === ErrorCategory.AUTHORIZATION
  );
}

/**
 * Type guard for DatabaseError
 */
export function isDatabaseError(error: unknown): error is DatabaseError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'category' in error &&
    error.category === ErrorCategory.DATABASE
  );
}

/**
 * Type guard for NetworkError
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'category' in error &&
    error.category === ErrorCategory.NETWORK
  );
}

/**
 * Type guard for BusinessLogicError
 */
export function isBusinessLogicError(error: unknown): error is BusinessLogicError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'category' in error &&
    error.category === ErrorCategory.BUSINESS_LOGIC
  );
}

/**
 * Type guard for SystemError
 */
export function isSystemError(error: unknown): error is SystemError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'category' in error &&
    error.category === ErrorCategory.SYSTEM
  );
}

/**
 * Type guard for ExternalServiceError
 */
export function isExternalServiceError(error: unknown): error is ExternalServiceError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'category' in error &&
    error.category === ErrorCategory.EXTERNAL_SERVICE
  );
}

/**
 * Type guard for any StructuredError
 */
export function isStructuredError(error: unknown): error is StructuredError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'category' in error &&
    'severity' in error &&
    'retryable' in error &&
    'code' in error &&
    'message' in error &&
    'timestamp' in error
  );
}
