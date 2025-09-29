/**
 * Base Service Class
 * 
 * Abstract base class for all services in the platform-agnostic service layer.
 * Provides common patterns for error handling, logging, and service lifecycle.
 * 
 * Design Principles:
 * - Zero Next.js/React dependencies for mobile compatibility
 * - Framework-agnostic implementation
 * - Testable in Node.js environment
 * - Single responsibility principle
 */

import {
  type ApplicationError,
  type Result,
  createSuccessResult,
  createErrorResult,
  createDatabaseError,
  createNetworkError,
  createSystemError,
  createValidationError,
  ERROR_CODES,
} from '../types/errors'

// Legacy interface for backward compatibility
export interface ServiceError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

// Legacy interface for backward compatibility  
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: ServiceError;
}

export interface ServiceLogger {
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
  debug(message: string, meta?: Record<string, unknown>): void;
}

/**
 * Default console-based logger implementation
 * Can be replaced with more sophisticated logging in production
 */
export class ConsoleLogger implements ServiceLogger {
  info(message: string, meta?: Record<string, unknown>): void {
    // eslint-disable-next-line no-console
    console.info(`[INFO] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  error(message: string, meta?: Record<string, unknown>): void {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] ${message}`, meta ? JSON.stringify(meta) : '');
    }
  }
}

/**
 * Abstract base service class
 * All platform services should extend this class
 */
export abstract class BaseService {
  protected logger: ServiceLogger;
  protected serviceName: string;

  constructor(serviceName: string, logger?: ServiceLogger) {
    this.serviceName = serviceName;
    this.logger = logger || new ConsoleLogger();
  }

  /**
   * Create a standardized error result
   */
  protected createError<T>(
    code: string,
    message: string,
    details?: Record<string, unknown>
  ): ServiceResult<T> {
    const error: ServiceError = {
      code,
      message,
      ...(details && { details }),
      timestamp: new Date(),
    };

    this.logger.error(`${this.serviceName} Error: ${message}`, {
      code,
      details,
    });

    return {
      success: false,
      error,
    };
  }

  /**
   * Create a successful result
   */
  protected createSuccess<T>(data: T): ServiceResult<T> {
    return {
      success: true,
      data,
    };
  }

  /**
   * Handle async operations with enhanced error boundary patterns
   */
  protected async handleAsync<T>(
    operation: () => Promise<T>,
    errorCode: string,
    errorMessage: string
  ): Promise<ServiceResult<T>> {
    try {
      const result = await operation();
      return this.createSuccess(result);
    } catch (error) {
      return this.handleError<T>(error, errorCode, errorMessage);
    }
  }

  /**
   * Enhanced error handling with comprehensive error boundary patterns
   */
  protected handleError<T>(
    error: unknown,
    fallbackCode: string,
    fallbackMessage: string
  ): ServiceResult<T> {
    const details = error instanceof Error 
      ? { originalError: error.message, stack: error.stack }
      : { originalError: String(error) };

    // Handle specific error types with enhanced categorization
    if (error instanceof Error) {
      // Database errors
      if (error.name === "PrismaClientKnownRequestError" || 
          error.message.includes("database") ||
          error.message.includes("connection")) {
        return this.createError<T>("DATABASE_ERROR", error.message, details);
      }

      // Network/API errors
      if (error.name === "FetchError" || 
          error.message.includes("fetch") ||
          error.message.includes("network")) {
        return this.createError<T>("NETWORK_ERROR", error.message, details);
      }

      // Authentication errors
      if (error.name === "INVALID_CREDENTIALS" ||
          error.message.includes("authentication") ||
          error.message.includes("login")) {
        return this.createError<T>("AUTHENTICATION_ERROR", error.message, details);
      }

      // Authorization errors
      if (error.name === "ACCESS_DENIED" ||
          error.message.includes("permission") ||
          error.message.includes("unauthorized")) {
        return this.createError<T>("ACCESS_DENIED", error.message, details);
      }

      // Validation errors
      if (error.name === "ValidationError" ||
          error.message.includes("validation") ||
          error.message.includes("invalid")) {
        return this.createError<T>("VALIDATION_ERROR", error.message, details);
      }

      // Not found errors
      if (error.name === "NOT_FOUND" ||
          error.message.includes("not found") ||
          error.message.includes("does not exist")) {
        return this.createError<T>("NOT_FOUND", error.message, details);
      }

      // System errors
      if (error.message.includes("memory") ||
          error.message.includes("timeout") ||
          error.message.includes("system")) {
        return this.createError<T>("SYSTEM_ERROR", error.message, details);
      }
    }

    // Fallback to provided error code and message
    return this.createError<T>(fallbackCode, fallbackMessage, details);
  }

  /**
   * Enhanced async operation handler with retry logic for retryable errors
   */
  protected async handleAsyncWithRetry<T>(
    operation: () => Promise<T>,
    errorCode: string,
    errorMessage: string,
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<ServiceResult<T>> {
    let lastError: unknown;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        return this.createSuccess(result);
      } catch (error) {
        lastError = error;
        
        // Check if error is retryable
        const isRetryable = this.isRetryableError(error);
        
        if (!isRetryable || attempt === maxRetries) {
          break;
        }
        
        // Wait before retry with exponential backoff
        await this.delay(retryDelay * Math.pow(2, attempt - 1));
      }
    }
    
    return this.handleError<T>(lastError, errorCode, errorMessage);
  }

  /**
   * Check if an error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    if (!(error instanceof Error)) {
      return false;
    }

    // Network errors are typically retryable
    if (error.name === "FetchError" || 
        error.message.includes("network") ||
        error.message.includes("timeout") ||
        error.message.includes("connection")) {
      return true;
    }

    // Database connection errors are retryable
    if (error.message.includes("database connection") ||
        error.message.includes("connection refused")) {
      return true;
    }

    // System overload errors are retryable
    if (error.message.includes("overload") ||
        error.message.includes("rate limit")) {
      return true;
    }

    return false;
  }

  /**
   * Utility method for delays in retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate required parameters
   */
  protected validateRequired<T extends Record<string, unknown>>(
    params: T,
    requiredFields: string[]
  ): ServiceResult<void> {
    const missing = requiredFields.filter(field => 
      params[field] === undefined || params[field] === null || params[field] === ''
    );

    if (missing.length > 0) {
      return this.createError<void>(
        'VALIDATION_ERROR',
        'Missing required parameters',
        { missingFields: missing }
      );
    }

    return this.createSuccess(undefined);
  }

  /**
   * Log service operation
   */
  protected logOperation(operation: string, meta?: Record<string, unknown>): void {
    this.logger.info(`${this.serviceName}: ${operation}`, meta);
  }

  /**
   * Get service name for identification
   */
  public getServiceName(): string {
    return this.serviceName;
  }
}
