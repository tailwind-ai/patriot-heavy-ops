/**
 * Base Repository Pattern
 *
 * Abstract base class for all data access repositories.
 * Provides platform-agnostic data operations compatible with both web and mobile.
 *
 * Design Principles:
 * - Framework-agnostic (works with React Native)
 * - Testable with mocked database operations
 * - Consistent error handling and logging
 * - Support for offline-first mobile patterns
 */

import { PrismaClient } from "@prisma/client"
import {
  ServiceError,
  ServiceLogger,
  ConsoleLogger,
} from "@/lib/services/base-service"

export interface RepositoryOptions {
  logger?: ServiceLogger
  enableCaching?: boolean
  offlineMode?: boolean
}

export interface PaginationOptions {
  page?: number
  limit?: number
  cursor?: string
}

export interface FilterOptions {
  where?: Record<string, unknown>
  orderBy?: Record<string, unknown>
  include?: Record<string, unknown>
  select?: Record<string, unknown>
}

export type RepositoryResult<T> =
  | {
      success: true
      data: T
      error?: never
      pagination?: {
        page: number
        limit: number
        total: number
        hasNext: boolean
        hasPrev: boolean
      }
    }
  | { success: false; data?: never; error: ServiceError; pagination?: never }

/**
 * Abstract base repository class
 * All data repositories should extend this class
 */
export abstract class BaseRepository {
  protected db: PrismaClient
  protected logger: ServiceLogger
  protected repositoryName: string
  protected options: RepositoryOptions

  constructor(
    db: PrismaClient,
    repositoryName: string,
    options: RepositoryOptions = {}
  ) {
    this.db = db
    this.repositoryName = repositoryName
    this.logger = options.logger || new ConsoleLogger()
    this.options = {
      enableCaching: false,
      offlineMode: false,
      ...options,
    }
  }

  /**
   * Create a standardized error result
   */
  protected createError<T>(
    code: string,
    message: string,
    details?: Record<string, unknown>
  ): RepositoryResult<T> {
    const error: ServiceError = {
      code,
      message,
      ...(details && { details }),
      timestamp: new Date(),
    }

    this.logger.error(`${this.repositoryName} Error: ${message}`, {
      code,
      details,
    })

    return {
      success: false,
      error,
    }
  }

  /**
   * Create a successful result
   */
  protected createSuccess<T>(
    data: T,
    pagination?: {
      page: number
      limit: number
      total: number
      hasNext: boolean
      hasPrev: boolean
    }
  ): RepositoryResult<T> {
    return {
      success: true,
      data,
      ...(pagination && { pagination }),
    } as RepositoryResult<T>
  }

  /**
   * Handle async database operations with standardized error handling
   */
  protected async handleAsync<T>(
    operation: () => Promise<T>,
    errorCode: string,
    errorMessage: string,
    operationName?: string
  ): Promise<RepositoryResult<T>> {
    try {
      if (operationName) {
        this.logOperation(operationName)
      }

      const result = await operation()
      return this.createSuccess(result)
    } catch (error) {
      const details =
        error instanceof Error
          ? {
              originalError: error.message,
              stack: error.stack,
              ...(error.name === "PrismaClientKnownRequestError" &&
                "code" in error && {
                  prismaCode: error.code,
                }),
            }
          : { originalError: String(error) }

      return this.createError<T>(errorCode, errorMessage, details)
    }
  }

  /**
   * Validate required parameters
   */
  protected validateRequired<T extends Record<string, unknown>>(
    params: T,
    requiredFields: string[]
  ): RepositoryResult<void> {
    const missing = requiredFields.filter(
      (field) =>
        params[field] === undefined ||
        params[field] === null ||
        params[field] === ""
    )

    if (missing.length > 0) {
      return this.createError<void>(
        "VALIDATION_ERROR",
        "Missing required parameters",
        { missingFields: missing }
      )
    }

    return this.createSuccess(undefined as void)
  }

  /**
   * Log repository operation
   */
  protected logOperation(
    operation: string,
    meta?: Record<string, unknown>
  ): void {
    this.logger.info(`${this.repositoryName}: ${operation}`, meta)
  }

  /**
   * Build pagination metadata
   */
  protected buildPagination(
    page: number,
    limit: number,
    total: number
  ): {
    page: number
    limit: number
    total: number
    hasNext: boolean
    hasPrev: boolean
  } {
    return {
      page,
      limit,
      total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    }
  }

  /**
   * Apply common query filters and options
   */
  protected applyFilters<T extends Record<string, unknown>>(
    baseQuery: T,
    filters: FilterOptions
  ): T {
    const query = { ...baseQuery }

    if (filters.where) {
      const existingWhere = (query as Record<string, unknown>).where
      ;(query as Record<string, unknown>).where = {
        ...(existingWhere && typeof existingWhere === "object"
          ? existingWhere
          : {}),
        ...filters.where,
      }
    }

    if (filters.orderBy) {
      ;(query as Record<string, unknown>).orderBy = filters.orderBy
    }

    if (filters.include) {
      ;(query as Record<string, unknown>).include = filters.include
    }

    if (filters.select) {
      ;(query as Record<string, unknown>).select = filters.select
    }

    return query
  }

  /**
   * Apply pagination to query
   */
  protected applyPagination<T extends Record<string, unknown>>(
    baseQuery: T,
    pagination: PaginationOptions
  ): T {
    const query = { ...baseQuery }

    if (pagination.limit) {
      ;(query as Record<string, unknown>).take = pagination.limit
    }

    if (pagination.page && pagination.limit) {
      ;(query as Record<string, unknown>).skip =
        (pagination.page - 1) * pagination.limit
    }

    if (pagination.cursor) {
      ;(query as Record<string, unknown>).cursor = { id: pagination.cursor }
      ;(query as Record<string, unknown>).skip = 1 // Skip the cursor record
    }

    return query
  }

  /**
   * Get repository name for identification
   */
  public getRepositoryName(): string {
    return this.repositoryName
  }

  /**
   * Check if repository is in offline mode
   */
  public isOfflineMode(): boolean {
    return this.options.offlineMode || false
  }

  /**
   * Enable/disable caching (useful for mobile scenarios)
   */
  public setCaching(enabled: boolean): void {
    this.options.enableCaching = enabled
  }

  /**
   * Set offline mode (useful for mobile scenarios)
   */
  public setOfflineMode(enabled: boolean): void {
    this.options.offlineMode = enabled
  }
}

/**
 * Common repository interface for basic CRUD operations
 * Repositories can implement this for standardized operations
 */
export interface CrudRepository<T, CreateInput, UpdateInput> {
  findById(id: string): Promise<RepositoryResult<T | null>>
  findMany(
    filters?: FilterOptions,
    pagination?: PaginationOptions
  ): Promise<RepositoryResult<T[]>>
  create(data: CreateInput): Promise<RepositoryResult<T>>
  update(id: string, data: UpdateInput): Promise<RepositoryResult<T>>
  delete(id: string): Promise<RepositoryResult<boolean>>
  count(filters?: FilterOptions): Promise<RepositoryResult<number>>
}
