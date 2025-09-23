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
   * Handle async operations with standardized error handling
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
      const details = error instanceof Error 
        ? { originalError: error.message, stack: error.stack }
        : { originalError: String(error) };

      return this.createError<T>(errorCode, errorMessage, details);
    }
  }

  /**
   * Validate required parameters
   */
  protected validateRequired(
    params: Record<string, unknown>,
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
