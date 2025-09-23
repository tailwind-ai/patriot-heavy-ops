/**
 * Repository Layer Exports
 *
 * Central export point for all platform-agnostic repositories.
 * Provides factory pattern for dependency injection and mobile compatibility.
 */

import { PrismaClient } from "@prisma/client"
import { db } from "@/lib/db"

// Base repository infrastructure
export {
  BaseRepository,
  type CrudRepository,
  type FilterOptions,
  type PaginationOptions,
  type RepositoryResult,
  type RepositoryOptions,
} from "./base-repository"

// Service Request Repository
export {
  ServiceRequestRepository,
  type ServiceRequestWithUser,
  type ServiceRequestCreateInput,
  type ServiceRequestUpdateInput,
  type ServiceRequestFilters,
  type RoleBasedAccessOptions,
} from "./service-request-repository"

// User Repository
export {
  UserRepository,
  type UserWithAccounts,
  type UserCreateInput,
  type UserUpdateInput,
  type OperatorApplicationInput,
  type UserFilters,
} from "./user-repository"

/**
 * Repository Factory for dependency injection
 * Provides singleton instances and supports testing with mock databases
 */
export class RepositoryFactory {
  private static serviceRequestRepository: ServiceRequestRepository | null = null
  private static userRepository: UserRepository | null = null
  private static dbInstance: PrismaClient | null = null

  /**
   * Set custom database instance (useful for testing)
   */
  static setDatabase(database: PrismaClient): void {
    this.dbInstance = database
    // Reset all repositories when database changes
    this.reset()
  }

  /**
   * Get database instance
   */
  static getDatabase(): PrismaClient {
    return this.dbInstance || db
  }

  /**
   * Get singleton instance of ServiceRequestRepository
   */
  static getServiceRequestRepository(): ServiceRequestRepository {
    if (!this.serviceRequestRepository) {
      this.serviceRequestRepository = new ServiceRequestRepository(
        this.getDatabase()
      )
    }
    return this.serviceRequestRepository
  }

  /**
   * Get singleton instance of UserRepository
   */
  static getUserRepository(): UserRepository {
    if (!this.userRepository) {
      this.userRepository = new UserRepository(
        this.getDatabase()
      )
    }
    return this.userRepository
  }

  /**
   * Create new repository instances (useful for testing or custom configurations)
   */
  static createServiceRequestRepository(
    database?: PrismaClient,
    options?: RepositoryOptions
  ): ServiceRequestRepository {
    return new ServiceRequestRepository(
      database || this.getDatabase(),
      options
    )
  }

  static createUserRepository(
    database?: PrismaClient,
    options?: RepositoryOptions
  ): UserRepository {
    return new UserRepository(
      database || this.getDatabase(),
      options
    )
  }

  /**
   * Reset all repository instances (useful for testing)
   */
  static reset(): void {
    this.serviceRequestRepository = null
    this.userRepository = null
  }

  /**
   * Initialize all repositories (useful for warming up connections)
   */
  static async initialize(): Promise<void> {
    // Pre-create all repository instances
    this.getServiceRequestRepository()
    this.getUserRepository()

    // Test database connection
    try {
      await this.getDatabase().$connect()
    } catch (error) {
      console.error("Failed to initialize repository database connection:", error)
      throw error
    }
  }

  /**
   * Cleanup all repository connections (useful for graceful shutdown)
   */
  static async cleanup(): Promise<void> {
    try {
      if (this.dbInstance) {
        await this.dbInstance.$disconnect()
      } else {
        await db.$disconnect()
      }
    } catch (error) {
      console.error("Error during repository cleanup:", error)
    } finally {
      this.reset()
    }
  }
}

// Import types for re-export
import type { RepositoryOptions } from "./base-repository"
import { ServiceRequestRepository } from "./service-request-repository"
import { UserRepository } from "./user-repository"

/**
 * Convenience functions for common repository operations
 * These provide a simplified API for the most common use cases
 */
export const repositories = {
  /**
   * Get service requests with role-based access
   */
  getServiceRequests: (userId: string, userRole: string) => {
    return RepositoryFactory.getServiceRequestRepository()
      .findManyWithRoleAccess({ userId, userRole: userRole as any })
  },

  /**
   * Create a new service request
   */
  createServiceRequest: (data: ServiceRequestCreateInput) => {
    return RepositoryFactory.getServiceRequestRepository().create(data)
  },

  /**
   * Get user by ID
   */
  getUserById: (id: string) => {
    return RepositoryFactory.getUserRepository().findById(id)
  },

  /**
   * Get user by email
   */
  getUserByEmail: (email: string) => {
    return RepositoryFactory.getUserRepository().findByEmail(email)
  },

  /**
   * Create a new user
   */
  createUser: (data: UserCreateInput) => {
    return RepositoryFactory.getUserRepository().create(data)
  },

  /**
   * Update user profile
   */
  updateUser: (id: string, data: UserUpdateInput) => {
    return RepositoryFactory.getUserRepository().update(id, data)
  },

  /**
   * Get available operators
   */
  getAvailableOperators: (filters?: { preferredLocations?: string[]; certifications?: string[] }) => {
    return RepositoryFactory.getUserRepository().findAvailableOperators(filters)
  },
}

/**
 * Type exports for external usage
 */
export type {
  ServiceRequestCreateInput,
  ServiceRequestUpdateInput,
  ServiceRequestFilters,
  ServiceRequestWithUser,
  RoleBasedAccessOptions,
} from "./service-request-repository"

export type {
  UserCreateInput,
  UserUpdateInput,
  UserFilters,
  UserWithAccounts,
  OperatorApplicationInput,
} from "./user-repository"
