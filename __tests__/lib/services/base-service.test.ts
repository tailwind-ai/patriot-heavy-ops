/**
 * Base Service Tests
 * 
 * Unit tests for the BaseService abstract class and related infrastructure.
 * Tests error handling, logging, validation, and async operation patterns.
 */

import { BaseService, ConsoleLogger, ServiceLogger, ServiceResult } from '../../../lib/services/base-service';

// Test implementation of BaseService
class TestService extends BaseService {
  constructor(logger?: ServiceLogger) {
    super('TestService', logger);
  }

  // Expose protected methods for testing
  public testCreateError<T>(code: string, message: string, details?: Record<string, unknown>): ServiceResult<T> {
    return this.createError<T>(code, message, details);
  }

  public testCreateSuccess<T>(data: T): ServiceResult<T> {
    return this.createSuccess(data);
  }

  public testHandleAsync<T>(
    operation: () => Promise<T>,
    errorCode: string,
    errorMessage: string
  ): Promise<ServiceResult<T>> {
    return this.handleAsync(operation, errorCode, errorMessage);
  }

  public testValidateRequired(
    params: Record<string, unknown>,
    requiredFields: string[]
  ): ServiceResult<void> {
    return this.validateRequired(params, requiredFields);
  }

  public testLogOperation(operation: string, meta?: Record<string, unknown>): void {
    this.logOperation(operation, meta);
  }
}

// Mock logger for testing
class MockLogger implements ServiceLogger {
  public logs: Array<{ level: string; message: string; meta?: Record<string, unknown> }> = [];

  info(message: string, meta?: Record<string, unknown>): void {
    this.logs.push({ level: 'info', message, ...(meta && { meta }) });
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logs.push({ level: 'warn', message, ...(meta && { meta }) });
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.logs.push({ level: 'error', message, ...(meta && { meta }) });
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logs.push({ level: 'debug', message, ...(meta && { meta }) });
  }

  clear(): void {
    this.logs = [];
  }
}

describe('BaseService', () => {
  let testService: TestService;
  let mockLogger: MockLogger;

  beforeEach(() => {
    mockLogger = new MockLogger();
    testService = new TestService(mockLogger);
  });

  describe('constructor', () => {
    it('should initialize with service name and logger', () => {
      expect(testService.getServiceName()).toBe('TestService');
    });

    it('should use ConsoleLogger as default', () => {
      const service = new TestService();
      expect(service.getServiceName()).toBe('TestService');
    });
  });

  describe('createError', () => {
    it('should create standardized error result', () => {
      const result = testService.testCreateError('TEST_ERROR', 'Test error message', { detail: 'test' });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('TEST_ERROR');
      expect(result.error?.message).toBe('Test error message');
      expect(result.error?.details).toEqual({ detail: 'test' });
      expect(result.error?.timestamp).toBeInstanceOf(Date);
      expect(result.data).toBeUndefined();
    });

    it('should log error when created', () => {
      testService.testCreateError('TEST_ERROR', 'Test error message');

      expect(mockLogger.logs).toHaveLength(1);
      expect(mockLogger.logs[0]?.level).toBe('error');
      expect(mockLogger.logs[0]?.message).toContain('TestService Error: Test error message');
    });
  });

  describe('createSuccess', () => {
    it('should create successful result with data', () => {
      const testData = { id: '123', name: 'test' };
      const result = testService.testCreateSuccess(testData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(testData);
      expect(result.error).toBeUndefined();
    });
  });

  describe('handleAsync', () => {
    it('should handle successful async operations', async () => {
      const testData = { result: 'success' };
      const operation = jest.fn().mockResolvedValue(testData);

      const result = await testService.testHandleAsync(operation, 'ERROR_CODE', 'Error message');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(testData);
      expect(result.error).toBeUndefined();
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should handle async operation errors', async () => {
      const error = new Error('Operation failed');
      const operation = jest.fn().mockRejectedValue(error);

      const result = await testService.testHandleAsync(operation, 'OPERATION_ERROR', 'Operation failed');

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('OPERATION_ERROR');
      expect(result.error?.message).toBe('Operation failed');
      expect(result.error?.details?.originalError).toBe('Operation failed');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should handle non-Error exceptions', async () => {
      const operation = jest.fn().mockRejectedValue('String error');

      const result = await testService.testHandleAsync(operation, 'ERROR_CODE', 'Error message');

      expect(result.success).toBe(false);
      expect(result.error?.details?.originalError).toBe('String error');
    });
  });

  describe('validateRequired', () => {
    it('should pass validation when all required fields are present', () => {
      const params = { field1: 'value1', field2: 'value2', field3: 123 };
      const result = testService.testValidateRequired(params, ['field1', 'field2']);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should fail validation when required fields are missing', () => {
      const params = { field1: 'value1' };
      const result = testService.testValidateRequired(params, ['field1', 'field2', 'field3']);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('VALIDATION_ERROR');
      expect(result.error?.message).toBe('Missing required parameters');
      expect(result.error?.details?.missingFields).toEqual(['field2', 'field3']);
    });

    it('should fail validation for null values', () => {
      const params = { field1: 'value1', field2: null };
      const result = testService.testValidateRequired(params, ['field1', 'field2']);

      expect(result.success).toBe(false);
      expect(result.error?.details?.missingFields).toEqual(['field2']);
    });

    it('should fail validation for undefined values', () => {
      const params = { field1: 'value1', field2: undefined };
      const result = testService.testValidateRequired(params, ['field1', 'field2']);

      expect(result.success).toBe(false);
      expect(result.error?.details?.missingFields).toEqual(['field2']);
    });

    it('should fail validation for empty strings', () => {
      const params = { field1: 'value1', field2: '' };
      const result = testService.testValidateRequired(params, ['field1', 'field2']);

      expect(result.success).toBe(false);
      expect(result.error?.details?.missingFields).toEqual(['field2']);
    });
  });

  describe('logOperation', () => {
    it('should log operation with service name', () => {
      testService.testLogOperation('test operation');

      expect(mockLogger.logs).toHaveLength(1);
      expect(mockLogger.logs[0]?.level).toBe('info');
      expect(mockLogger.logs[0]?.message).toBe('TestService: test operation');
    });

    it('should log operation with metadata', () => {
      const meta = { userId: '123', action: 'create' };
      testService.testLogOperation('test operation', meta);

      expect(mockLogger.logs).toHaveLength(1);
      expect(mockLogger.logs[0]?.meta).toEqual(meta);
    });
  });

  describe('getServiceName', () => {
    it('should return the service name', () => {
      expect(testService.getServiceName()).toBe('TestService');
    });
  });
});

describe('ConsoleLogger', () => {
  let logger: ConsoleLogger;
  let consoleSpy: {
    info: jest.SpyInstance;
    warn: jest.SpyInstance;
    error: jest.SpyInstance;
    debug: jest.SpyInstance;
  };

  beforeEach(() => {
    logger = new ConsoleLogger();
    consoleSpy = {
      info: jest.spyOn(console, 'info').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
      debug: jest.spyOn(console, 'debug').mockImplementation(),
    };
  });

  afterEach(() => {
    Object.values(consoleSpy).forEach(spy => spy.mockRestore());
  });

  it('should log info messages', () => {
    logger.info('test message', { key: 'value' });

    expect(consoleSpy.info).toHaveBeenCalledWith('[INFO] test message', '{"key":"value"}');
  });

  it('should log warn messages', () => {
    logger.warn('test warning');

    expect(consoleSpy.warn).toHaveBeenCalledWith('[WARN] test warning', '');
  });

  it('should log error messages', () => {
    logger.error('test error', { error: 'details' });

    expect(consoleSpy.error).toHaveBeenCalledWith('[ERROR] test error', '{"error":"details"}');
  });

  it('should log debug messages in development', () => {
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      configurable: true
    });

    logger.debug('test debug');

    expect(consoleSpy.debug).toHaveBeenCalledWith('[DEBUG] test debug', '');

    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      configurable: true
    });
  });

  it('should not log debug messages in production', () => {
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      configurable: true
    });

    logger.debug('test debug');

    expect(consoleSpy.debug).not.toHaveBeenCalled();

    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      configurable: true
    });
  });
});
