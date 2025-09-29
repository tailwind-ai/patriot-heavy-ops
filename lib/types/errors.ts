/**
 * Enhanced Error Types for Issue #301 - Null Safety & Error Boundaries
 * 
 * This module provides a comprehensive, structured error handling system with:
 * - Categorized error types for better debugging and handling
 * - Factory functions for consistent error creation
 * - Type guards for error identification
 * - Retry logic support for transient errors
 * - Severity levels for error prioritization
 */

// Base error interface that all application errors extend
export type ApplicationError = {
  readonly code: string
  readonly message: string
  readonly severity: 'low' | 'medium' | 'high' | 'critical'
  readonly retryable: boolean
  readonly timestamp: string
  readonly details?: Record<string, unknown>
}

// Specific error types for different categories
export type ValidationError = ApplicationError & {
  readonly code: 'VALIDATION_ERROR'
  readonly field?: string
  readonly expectedType?: string
}

export type AuthenticationError = ApplicationError & {
  readonly code: 'AUTHENTICATION_ERROR' | 'INVALID_CREDENTIALS' | 'TOKEN_EXPIRED'
  readonly userId?: string
}

export type AuthorizationError = ApplicationError & {
  readonly code: 'AUTHORIZATION_ERROR' | 'INSUFFICIENT_PERMISSIONS' | 'ACCESS_DENIED'
  readonly userId?: string
  readonly requiredRole?: string
  readonly resource?: string
}

export type DatabaseError = ApplicationError & {
  readonly code: 'DATABASE_ERROR' | 'CONNECTION_FAILED' | 'QUERY_FAILED' | 'CONSTRAINT_VIOLATION'
  readonly query?: string
  readonly table?: string
}

export type NetworkError = ApplicationError & {
  readonly code: 'NETWORK_ERROR' | 'REQUEST_TIMEOUT' | 'CONNECTION_REFUSED'
  readonly url?: string
  readonly statusCode?: number
  readonly method?: string
}

export type BusinessLogicError = ApplicationError & {
  readonly code: 'BUSINESS_LOGIC_ERROR' | 'INVALID_OPERATION' | 'PRECONDITION_FAILED'
  readonly operation?: string
  readonly context?: Record<string, unknown>
}

export type SystemError = ApplicationError & {
  readonly code: 'SYSTEM_ERROR' | 'INTERNAL_ERROR' | 'SERVICE_UNAVAILABLE'
  readonly service?: string
  readonly component?: string
}

export type ExternalServiceError = ApplicationError & {
  readonly code: 'EXTERNAL_SERVICE_ERROR' | 'API_ERROR' | 'THIRD_PARTY_ERROR'
  readonly service: string
  readonly endpoint?: string
  readonly statusCode?: number
}

// Union type of all possible errors
export type AppError = 
  | ValidationError 
  | AuthenticationError 
  | AuthorizationError 
  | DatabaseError 
  | NetworkError 
  | BusinessLogicError 
  | SystemError 
  | ExternalServiceError

// Result type for operations that can fail
export type Result<T> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: AppError }

// Error codes constants for consistency
export const ERROR_CODES = {
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  
  // Authentication
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Authorization
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  ACCESS_DENIED: 'ACCESS_DENIED',
  
  // Database
  DATABASE_ERROR: 'DATABASE_ERROR',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  QUERY_FAILED: 'QUERY_FAILED',
  CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION',
  
  // Network
  NETWORK_ERROR: 'NETWORK_ERROR',
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
  CONNECTION_REFUSED: 'CONNECTION_REFUSED',
  
  // Business Logic
  BUSINESS_LOGIC_ERROR: 'BUSINESS_LOGIC_ERROR',
  INVALID_OPERATION: 'INVALID_OPERATION',
  PRECONDITION_FAILED: 'PRECONDITION_FAILED',
  
  // System
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // External Services
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  API_ERROR: 'API_ERROR',
  THIRD_PARTY_ERROR: 'THIRD_PARTY_ERROR',
  
  // Legacy codes for backward compatibility
  NOT_FOUND: 'NOT_FOUND',
  PASSWORD_CHANGE_FAILED: 'PASSWORD_CHANGE_FAILED'
} as const

// Factory functions for creating errors
export function createValidationError(
  message: string,
  options?: { field?: string; expectedType?: string; details?: Record<string, unknown> }
): ValidationError {
  const baseError: ApplicationError = {
    code: ERROR_CODES.VALIDATION_ERROR,
    message,
    severity: 'medium',
    retryable: false,
    timestamp: new Date().toISOString(),
    details: options?.details
  }
  
  return {
    ...baseError,
    ...(options?.field !== undefined && { field: options.field }),
    ...(options?.expectedType !== undefined && { expectedType: options.expectedType })
  }
}

export function createAuthenticationError(
  message: string,
  code: AuthenticationError['code'] = 'AUTHENTICATION_ERROR',
  options?: { userId?: string; details?: Record<string, unknown> }
): AuthenticationError {
  const baseError: ApplicationError = {
    code,
    message,
    severity: 'high',
    retryable: false,
    timestamp: new Date().toISOString(),
    details: options?.details
  }
  
  return {
    ...baseError,
    ...(options?.userId !== undefined && { userId: options.userId })
  }
}

export function createAuthorizationError(
  message: string,
  code: AuthorizationError['code'] = 'AUTHORIZATION_ERROR',
  options?: { userId?: string; requiredRole?: string; resource?: string; details?: Record<string, unknown> }
): AuthorizationError {
  const baseError: ApplicationError = {
    code,
    message,
    severity: 'high',
    retryable: false,
    timestamp: new Date().toISOString(),
    details: options?.details
  }
  
  return {
    ...baseError,
    ...(options?.userId !== undefined && { userId: options.userId }),
    ...(options?.requiredRole !== undefined && { requiredRole: options.requiredRole }),
    ...(options?.resource !== undefined && { resource: options.resource })
  }
}

export function createDatabaseError(
  message: string,
  code: DatabaseError['code'] = 'DATABASE_ERROR',
  options?: { query?: string; table?: string; details?: Record<string, unknown> }
): DatabaseError {
  const baseError: ApplicationError = {
    code,
    message,
    severity: 'critical',
    retryable: true,
    timestamp: new Date().toISOString(),
    details: options?.details
  }
  
  return {
    ...baseError,
    ...(options?.query !== undefined && { query: options.query }),
    ...(options?.table !== undefined && { table: options.table })
  }
}

export function createNetworkError(
  message: string,
  code: NetworkError['code'] = 'NETWORK_ERROR',
  options?: { url?: string; statusCode?: number; method?: string; details?: Record<string, unknown> }
): NetworkError {
  const baseError: ApplicationError = {
    code,
    message,
    retryable: true,
    timestamp: new Date().toISOString(),
    details: options?.details,
    severity: 'high' // Default severity
  }
  
  // Determine severity based on status code
  const severity = options?.statusCode && options.statusCode >= 500 ? 'critical' : 'high'
  
  return {
    ...baseError,
    severity,
    ...(options?.url !== undefined && { url: options.url }),
    ...(options?.statusCode !== undefined && { statusCode: options.statusCode }),
    ...(options?.method !== undefined && { method: options.method })
  }
}

export function createBusinessLogicError(
  message: string,
  code: BusinessLogicError['code'] = 'BUSINESS_LOGIC_ERROR',
  options?: { operation?: string; context?: Record<string, unknown>; details?: Record<string, unknown> }
): BusinessLogicError {
  const baseError: ApplicationError = {
    code,
    message,
    severity: 'medium',
    retryable: false,
    timestamp: new Date().toISOString(),
    details: options?.details
  }
  
  return {
    ...baseError,
    ...(options?.operation !== undefined && { operation: options.operation }),
    ...(options?.context !== undefined && { context: options.context })
  }
}

export function createSystemError(
  message: string,
  code: SystemError['code'] = 'SYSTEM_ERROR',
  options?: { service?: string; component?: string; details?: Record<string, unknown> }
): SystemError {
  const baseError: ApplicationError = {
    code,
    message,
    severity: 'critical',
    retryable: true,
    timestamp: new Date().toISOString(),
    details: options?.details
  }
  
  return {
    ...baseError,
    ...(options?.service !== undefined && { service: options.service }),
    ...(options?.component !== undefined && { component: options.component })
  }
}

export function createExternalServiceError(
  message: string,
  service: string,
  code: ExternalServiceError['code'] = 'EXTERNAL_SERVICE_ERROR',
  options?: { endpoint?: string; statusCode?: number; details?: Record<string, unknown> }
): ExternalServiceError {
  const baseError: ApplicationError = {
    code,
    message,
    severity: 'high',
    retryable: true,
    timestamp: new Date().toISOString(),
    details: options?.details
  }
  
  return {
    ...baseError,
    service,
    ...(options?.endpoint !== undefined && { endpoint: options.endpoint }),
    ...(options?.statusCode !== undefined && { statusCode: options.statusCode })
  }
}

// Result factory functions
export function createSuccess<T>(data: T): Result<T> {
  return { success: true, data }
}

export function createError<T>(error: AppError): Result<T> {
  return { success: false, error }
}

// Type guards for error identification
export function isValidationError(error: AppError): error is ValidationError {
  return error.code === 'VALIDATION_ERROR'
}

export function isAuthenticationError(error: AppError): error is AuthenticationError {
  return ['AUTHENTICATION_ERROR', 'INVALID_CREDENTIALS', 'TOKEN_EXPIRED'].includes(error.code)
}

export function isAuthorizationError(error: AppError): error is AuthorizationError {
  return ['AUTHORIZATION_ERROR', 'INSUFFICIENT_PERMISSIONS', 'ACCESS_DENIED'].includes(error.code)
}

export function isDatabaseError(error: AppError): error is DatabaseError {
  return ['DATABASE_ERROR', 'CONNECTION_FAILED', 'QUERY_FAILED', 'CONSTRAINT_VIOLATION'].includes(error.code)
}

export function isNetworkError(error: AppError): error is NetworkError {
  return ['NETWORK_ERROR', 'REQUEST_TIMEOUT', 'CONNECTION_REFUSED'].includes(error.code)
}

export function isBusinessLogicError(error: AppError): error is BusinessLogicError {
  return ['BUSINESS_LOGIC_ERROR', 'INVALID_OPERATION', 'PRECONDITION_FAILED'].includes(error.code)
}

export function isSystemError(error: AppError): error is SystemError {
  return ['SYSTEM_ERROR', 'INTERNAL_ERROR', 'SERVICE_UNAVAILABLE'].includes(error.code)
}

export function isExternalServiceError(error: AppError): error is ExternalServiceError {
  return ['EXTERNAL_SERVICE_ERROR', 'API_ERROR', 'THIRD_PARTY_ERROR'].includes(error.code)
}

// Utility functions for error handling
export function isCriticalError(error: AppError): boolean {
  return error.severity === 'critical'
}

export function isRetryableError(error: AppError): boolean {
  return error.retryable
}

// Legacy support - map old error codes to new system
export function createLegacyError(code: string, message: string): AppError {
  switch (code) {
    case 'NOT_FOUND':
      return createValidationError(message, { details: { legacyCode: code } })
    case 'PASSWORD_CHANGE_FAILED':
      return createAuthenticationError(message, 'AUTHENTICATION_ERROR', { details: { legacyCode: code } })
    default:
      return createSystemError(message, 'SYSTEM_ERROR', { details: { legacyCode: code } })
  }
}