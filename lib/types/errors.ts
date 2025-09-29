/**
 * Enhanced Structured Error Types - Issue #301
 * 
 * Comprehensive error handling types per cursorrules.md requirements
 * Following Platform Mode - conservative, proven patterns only
 */

// Base error interface for all application errors
export interface BaseError {
  readonly code: string
  readonly message: string
  readonly timestamp: Date
  readonly context?: Record<string, unknown>
}

// Error severity levels
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

// Error categories for different types of failures
export type ErrorCategory = 
  | 'validation'
  | 'authentication' 
  | 'authorization'
  | 'database'
  | 'network'
  | 'business_logic'
  | 'system'
  | 'external_service'

// Enhanced error interface with categorization
export interface CategorizedError extends BaseError {
  readonly category: ErrorCategory
  readonly severity: ErrorSeverity
  readonly retryable: boolean
  readonly userMessage?: string
}

// Validation-specific error details
export interface ValidationError extends CategorizedError {
  readonly category: 'validation'
  readonly field?: string
  readonly value?: unknown
  readonly constraint?: string
}

// Authentication-specific error details  
export interface AuthenticationError extends CategorizedError {
  readonly category: 'authentication'
  readonly attemptCount?: number
  readonly lockoutUntil?: Date
}

// Authorization-specific error details
export interface AuthorizationError extends CategorizedError {
  readonly category: 'authorization'
  readonly requiredRole?: string
  readonly currentRole?: string
  readonly resource?: string
}

// Database-specific error details
export interface DatabaseError extends CategorizedError {
  readonly category: 'database'
  readonly operation?: 'create' | 'read' | 'update' | 'delete'
  readonly table?: string
  readonly constraint?: string
}

// Network-specific error details
export interface NetworkError extends CategorizedError {
  readonly category: 'network'
  readonly statusCode?: number
  readonly endpoint?: string
  readonly timeout?: boolean
}

// Business logic error details
export interface BusinessLogicError extends CategorizedError {
  readonly category: 'business_logic'
  readonly rule?: string
  readonly expectedValue?: unknown
  readonly actualValue?: unknown
}

// System error details
export interface SystemError extends CategorizedError {
  readonly category: 'system'
  readonly component?: string
  readonly memoryUsage?: number
  readonly diskSpace?: number
}

// External service error details
export interface ExternalServiceError extends CategorizedError {
  readonly category: 'external_service'
  readonly service?: string
  readonly endpoint?: string
  readonly responseTime?: number
}

// Union type for all specific error types
export type ApplicationError = 
  | ValidationError
  | AuthenticationError
  | AuthorizationError
  | DatabaseError
  | NetworkError
  | BusinessLogicError
  | SystemError
  | ExternalServiceError

// Error result wrapper for operations that can fail
export interface ErrorResult<T = unknown> {
  readonly success: false
  readonly error: ApplicationError
  readonly data?: never
}

// Success result wrapper
export interface SuccessResult<T> {
  readonly success: true
  readonly data: T
  readonly error?: never
}

// Combined result type
export type Result<T> = SuccessResult<T> | ErrorResult<T>

// Error factory functions for creating typed errors
export const createValidationError = (
  code: string,
  message: string,
  options?: {
    field?: string
    value?: unknown
    constraint?: string
    context?: Record<string, unknown>
    userMessage?: string
  }
): ValidationError => {
  const baseError = {
    code,
    message,
    category: 'validation' as const,
    severity: 'medium' as const,
    retryable: false,
    timestamp: new Date(),
  }
  
  return {
    ...baseError,
    ...(options?.field !== undefined && { field: options.field }),
    ...(options?.value !== undefined && { value: options.value }),
    ...(options?.constraint !== undefined && { constraint: options.constraint }),
    ...(options?.context !== undefined && { context: options.context }),
    ...(options?.userMessage !== undefined && { userMessage: options.userMessage }),
  }
}

export const createAuthenticationError = (
  code: string,
  message: string,
  options?: {
    attemptCount?: number
    lockoutUntil?: Date
    context?: Record<string, unknown>
    userMessage?: string
  }
): AuthenticationError => {
  const baseError = {
    code,
    message,
    category: 'authentication' as const,
    severity: 'high' as const,
    retryable: false,
    timestamp: new Date(),
  }
  
  return {
    ...baseError,
    ...(options?.attemptCount !== undefined && { attemptCount: options.attemptCount }),
    ...(options?.lockoutUntil !== undefined && { lockoutUntil: options.lockoutUntil }),
    ...(options?.context !== undefined && { context: options.context }),
    ...(options?.userMessage !== undefined && { userMessage: options.userMessage }),
  }
}

export const createAuthorizationError = (
  code: string,
  message: string,
  options?: {
    requiredRole?: string
    currentRole?: string
    resource?: string
    context?: Record<string, unknown>
    userMessage?: string
  }
): AuthorizationError => {
  const baseError = {
    code,
    message,
    category: 'authorization' as const,
    severity: 'high' as const,
    retryable: false,
    timestamp: new Date(),
  }
  
  return {
    ...baseError,
    ...(options?.requiredRole !== undefined && { requiredRole: options.requiredRole }),
    ...(options?.currentRole !== undefined && { currentRole: options.currentRole }),
    ...(options?.resource !== undefined && { resource: options.resource }),
    ...(options?.context !== undefined && { context: options.context }),
    ...(options?.userMessage !== undefined && { userMessage: options.userMessage }),
  }
}

export const createDatabaseError = (
  code: string,
  message: string,
  options?: {
    operation?: 'create' | 'read' | 'update' | 'delete'
    table?: string
    constraint?: string
    context?: Record<string, unknown>
    userMessage?: string
  }
): DatabaseError => {
  const baseError = {
    code,
    message,
    category: 'database' as const,
    severity: 'critical' as const,
    retryable: true,
    timestamp: new Date(),
  }
  
  return {
    ...baseError,
    ...(options?.operation !== undefined && { operation: options.operation }),
    ...(options?.table !== undefined && { table: options.table }),
    ...(options?.constraint !== undefined && { constraint: options.constraint }),
    ...(options?.context !== undefined && { context: options.context }),
    ...(options?.userMessage !== undefined && { userMessage: options.userMessage }),
  }
}

export const createNetworkError = (
  code: string,
  message: string,
  options?: {
    statusCode?: number
    endpoint?: string
    timeout?: boolean
    context?: Record<string, unknown>
    userMessage?: string
  }
): NetworkError => {
  const severity = options?.statusCode && options.statusCode >= 500 ? 'critical' : 'high'
  const baseError = {
    code,
    message,
    category: 'network' as const,
    severity: severity as 'critical' | 'high',
    retryable: true,
    timestamp: new Date(),
  }
  
  return {
    ...baseError,
    ...(options?.statusCode !== undefined && { statusCode: options.statusCode }),
    ...(options?.endpoint !== undefined && { endpoint: options.endpoint }),
    ...(options?.timeout !== undefined && { timeout: options.timeout }),
    ...(options?.context !== undefined && { context: options.context }),
    ...(options?.userMessage !== undefined && { userMessage: options.userMessage }),
  }
}

export const createBusinessLogicError = (
  code: string,
  message: string,
  options?: {
    rule?: string
    expectedValue?: unknown
    actualValue?: unknown
    context?: Record<string, unknown>
    userMessage?: string
  }
): BusinessLogicError => {
  const baseError = {
    code,
    message,
    category: 'business_logic' as const,
    severity: 'medium' as const,
    retryable: false,
    timestamp: new Date(),
  }
  
  return {
    ...baseError,
    ...(options?.rule !== undefined && { rule: options.rule }),
    ...(options?.expectedValue !== undefined && { expectedValue: options.expectedValue }),
    ...(options?.actualValue !== undefined && { actualValue: options.actualValue }),
    ...(options?.context !== undefined && { context: options.context }),
    ...(options?.userMessage !== undefined && { userMessage: options.userMessage }),
  }
}

export const createSystemError = (
  code: string,
  message: string,
  options?: {
    component?: string
    memoryUsage?: number
    diskSpace?: number
    context?: Record<string, unknown>
    userMessage?: string
  }
): SystemError => {
  const baseError = {
    code,
    message,
    category: 'system' as const,
    severity: 'critical' as const,
    retryable: true,
    timestamp: new Date(),
  }
  
  return {
    ...baseError,
    ...(options?.component !== undefined && { component: options.component }),
    ...(options?.memoryUsage !== undefined && { memoryUsage: options.memoryUsage }),
    ...(options?.diskSpace !== undefined && { diskSpace: options.diskSpace }),
    ...(options?.context !== undefined && { context: options.context }),
    ...(options?.userMessage !== undefined && { userMessage: options.userMessage }),
  }
}

export const createExternalServiceError = (
  code: string,
  message: string,
  options?: {
    service?: string
    endpoint?: string
    responseTime?: number
    context?: Record<string, unknown>
    userMessage?: string
  }
): ExternalServiceError => {
  const baseError = {
    code,
    message,
    category: 'external_service' as const,
    severity: 'high' as const,
    retryable: true,
    timestamp: new Date(),
  }
  
  return {
    ...baseError,
    ...(options?.service !== undefined && { service: options.service }),
    ...(options?.endpoint !== undefined && { endpoint: options.endpoint }),
    ...(options?.responseTime !== undefined && { responseTime: options.responseTime }),
    ...(options?.context !== undefined && { context: options.context }),
    ...(options?.userMessage !== undefined && { userMessage: options.userMessage }),
  }
}

// Helper functions for result handling
export const createSuccessResult = <T>(data: T): SuccessResult<T> => ({
  success: true,
  data,
})

export const createErrorResult = <T = unknown>(error: ApplicationError): ErrorResult<T> => ({
  success: false,
  error,
})

// Type guards for error checking
export const isValidationError = (error: ApplicationError): error is ValidationError =>
  error.category === 'validation'

export const isAuthenticationError = (error: ApplicationError): error is AuthenticationError =>
  error.category === 'authentication'

export const isAuthorizationError = (error: ApplicationError): error is AuthorizationError =>
  error.category === 'authorization'

export const isDatabaseError = (error: ApplicationError): error is DatabaseError =>
  error.category === 'database'

export const isNetworkError = (error: ApplicationError): error is NetworkError =>
  error.category === 'network'

export const isBusinessLogicError = (error: ApplicationError): error is BusinessLogicError =>
  error.category === 'business_logic'

export const isSystemError = (error: ApplicationError): error is SystemError =>
  error.category === 'system'

export const isExternalServiceError = (error: ApplicationError): error is ExternalServiceError =>
  error.category === 'external_service'

// Error severity helpers
export const isCriticalError = (error: ApplicationError): boolean =>
  error.severity === 'critical'

export const isRetryableError = (error: ApplicationError): boolean =>
  error.retryable

// Common error codes as constants
export const ERROR_CODES = {
  // Validation errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Authentication errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  
  // Authorization errors
  ACCESS_DENIED: 'ACCESS_DENIED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  ROLE_REQUIRED: 'ROLE_REQUIRED',
  
  // Database errors
  DATABASE_CONNECTION_FAILED: 'DATABASE_CONNECTION_FAILED',
  RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
  CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION',
  
  // Network errors
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  CONNECTION_REFUSED: 'CONNECTION_REFUSED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // Business logic errors
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  INVALID_STATE_TRANSITION: 'INVALID_STATE_TRANSITION',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // System errors
  OUT_OF_MEMORY: 'OUT_OF_MEMORY',
  DISK_FULL: 'DISK_FULL',
  SYSTEM_OVERLOAD: 'SYSTEM_OVERLOAD',
  
  // External service errors
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  THIRD_PARTY_TIMEOUT: 'THIRD_PARTY_TIMEOUT',
} as const

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]
