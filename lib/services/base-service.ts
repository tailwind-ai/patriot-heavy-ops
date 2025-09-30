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
  createAuthenticationError,
  createAuthorizationError,
  createDatabaseError,
  createNetworkError,
  createSystemError,
  createValidationError,
  StructuredError,
} from '@/lib/types/errors';

export interface ServiceError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

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
   * Categorize error into structured error types
   * Maps generic errors and Prisma errors to structured error categories
   * 
   * For backward compatibility:
   * - Preserves original error.message when available
   * - Uses error.name as code when it matches known patterns
   * - Falls back to provided fallbackCode and fallbackMessage
   */
  protected categorizeError(error: unknown, fallbackCode: string, fallbackMessage: string): StructuredError {
    const details = error instanceof Error 
      ? { originalError: error.message, stack: error.stack }
      : { originalError: String(error) };

    // Determine the message to use: prefer original error message if available
    const message = error instanceof Error && error.message ? error.message : fallbackMessage;

    // Handle Prisma database errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code?: string; meta?: unknown };
      
      // Prisma error codes: P2002 = Unique constraint, P2003 = Foreign key, P2025 = Not found, etc.
      if (typeof prismaError.code === 'string' && prismaError.code.startsWith('P')) {
        return createDatabaseError(
          message,
          `DB_${prismaError.code}`,
          { ...details, prismaCode: prismaError.code, meta: prismaError.meta }
        );
      }
    }

    // Handle standard Error objects with specific names
    if (error instanceof Error) {
      // Authentication errors - check error name OR fallback code
      if (
        error.name === 'INVALID_CREDENTIALS' || 
        error.name === 'TOKEN_EXPIRED' || 
        error.name === 'INVALID_TOKEN' ||
        fallbackCode === 'AUTH_FAILED' ||
        fallbackCode === 'INVALID_CREDENTIALS' ||
        fallbackCode === 'TOKEN_EXPIRED'
      ) {
        const code = (error.name === 'INVALID_CREDENTIALS' || error.name === 'TOKEN_EXPIRED' || error.name === 'INVALID_TOKEN') 
          ? error.name 
          : fallbackCode;
        return createAuthenticationError(message, code, details);
      }
      
      // NOT_FOUND errors - separate from authorization (resource doesn't exist vs. access denied)
      if (error.name === 'NOT_FOUND' || fallbackCode === 'NOT_FOUND') {
        const code = error.name === 'NOT_FOUND' ? error.name : fallbackCode;
        // NOT_FOUND gets categorized as AuthorizationError for HTTP status mapping (404)
        // but preserves NOT_FOUND code for proper routing logic
        return createAuthorizationError(message, code, details);
      }
      
      // Authorization errors - check error name OR fallback code
      if (
        error.name === 'ACCESS_DENIED' || 
        error.name === 'INSUFFICIENT_PERMISSIONS' ||
        fallbackCode === 'ACCESS_DENIED' ||
        fallbackCode === 'INSUFFICIENT_PERMISSIONS' ||
        fallbackCode === 'FORBIDDEN'
      ) {
        const code = (error.name === 'ACCESS_DENIED' || error.name === 'INSUFFICIENT_PERMISSIONS') 
          ? error.name 
          : fallbackCode;
        return createAuthorizationError(message, code, details);
      }
      
      // Validation errors - check error name OR fallback code
      if (
        error.name === 'VALIDATION_ERROR' || 
        error.name === 'INVALID_INPUT' ||
        fallbackCode === 'VALIDATION_ERROR' ||
        fallbackCode === 'INVALID_INPUT'
      ) {
        const code = (error.name === 'VALIDATION_ERROR' || error.name === 'INVALID_INPUT') 
          ? error.name 
          : fallbackCode;
        return createValidationError(message, code, details);
      }
      
      // Database errors - check fallback code patterns
      if (
        fallbackCode.startsWith('DB_') ||
        fallbackCode === 'DATABASE_ERROR' ||
        fallbackCode === 'QUERY_ERROR'
      ) {
        return createDatabaseError(message, fallbackCode, details);
      }
      
      // Network errors - check error name OR fallback code
      if (
        error.name === 'NETWORK_ERROR' || 
        error.name === 'TIMEOUT' || 
        error.name === 'CONNECTION_FAILED' ||
        fallbackCode === 'NETWORK_ERROR' ||
        fallbackCode === 'TIMEOUT' ||
        fallbackCode === 'CONNECTION_FAILED'
      ) {
        const code = (error.name === 'NETWORK_ERROR' || error.name === 'TIMEOUT' || error.name === 'CONNECTION_FAILED') 
          ? error.name 
          : fallbackCode;
        return createNetworkError(message, code, details);
      }
      
      // System errors (catch-all for Error objects)
      return createSystemError(message, fallbackCode, details);
    }

    // Fallback for non-Error objects
    return createSystemError(fallbackMessage, fallbackCode, details);
  }

  /**
   * Handle async operations with standardized error handling
   * Now with enhanced error categorization support
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
      // Use error categorization for structured error handling
      const structuredError = this.categorizeError(error, errorCode, errorMessage);
      
      // Log the categorized error
      this.logger.error(`${this.serviceName} Error [${structuredError.category}]: ${structuredError.message}`, {
        code: structuredError.code,
        severity: structuredError.severity,
        retryable: structuredError.retryable,
        details: structuredError.details,
      });
      
      // Return as ServiceResult (backward compatible)
      return {
        success: false,
        error: structuredError,
      };
    }
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
