/**
 * User Repository
 *
 * Handles all data operations for users including authentication, profiles, and operator management.
 * Abstracts Prisma operations behind a mobile-compatible interface.
 *
 * SECURITY IMPLEMENTATION (GitHub Issue #292):
 * - All methods use explicit `select` statements to prevent password field exposure
 * - SafeUser and SafeUserWithAccounts types ensure type safety without password field
 * - Following .cursorrules.md Platform Mode standards for security and type safety
 * - Comprehensive security tests prevent regression of password exposure vulnerability
 *
 * SECURE QUERY PATTERNS:
 * - Use `select` instead of `include` for user queries
 * - Always exclude password field from select statements
 * - Return SafeUser types instead of full User types
 * - Minimal field selection based on use case requirements
 */

import { PrismaClient } from "@prisma/client"
import type { User, UserRole } from "@prisma/client"
import {
  BaseRepository,
  FilterOptions,
  PaginationOptions,
  RepositoryResult,
  RepositoryOptions,
} from "./base-repository"

// Type definitions for user operations

/**
 * SafeUser type - User without password field for security
 * Following .cursorrules.md Platform Mode type safety standards
 */
export type SafeUser = Omit<User, "password">

/**
 * SafeUser with accounts relation
 */
export interface SafeUserWithAccounts extends SafeUser {
  accounts: Array<{
    provider: string
    providerAccountId: string
  }>
}

/**
 * @deprecated Use SafeUserWithAccounts instead
 * This interface exposes the full User type which may include password
 */
export interface UserWithAccounts extends User {
  accounts: Array<{
    provider: string
    providerAccountId: string
  }>
}

export interface UserCreateInput {
  name?: string
  email: string
  password?: string
  role?: UserRole
  phone?: string
  company?: string
  image?: string
}

export interface UserUpdateInput {
  name?: string
  email?: string
  phone?: string
  company?: string
  image?: string
  role?: UserRole
  // Operator-specific fields
  militaryBranch?: string
  yearsOfService?: number
  certifications?: string[]
  preferredLocations?: string[]
  isAvailable?: boolean
  // Stripe fields
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  stripePriceId?: string
  stripeCurrentPeriodEnd?: Date
}

export interface OperatorApplicationInput {
  militaryBranch: string
  yearsOfService: number
  certifications: string[]
  preferredLocations: string[]
}

export interface UserFilters {
  role?: UserRole
  company?: string
  isAvailable?: boolean
  hasStripeSubscription?: boolean
  emailVerified?: boolean
}

/**
 * User Repository Implementation
 *
 * SECURITY NOTE: This repository implements secure patterns by returning SafeUser types
 * instead of full User types to prevent password field exposure (Issue #292)
 */
export class UserRepository extends BaseRepository {
  constructor(db: PrismaClient, options?: RepositoryOptions) {
    super(db, "UserRepository", options)
  }

  /**
   * Find user by ID
   * SECURITY FIX: Uses select instead of include to prevent password exposure
   * Returns SafeUserWithAccounts type following .cursorrules.md Platform Mode standards
   */
  async findById(
    id: string
  ): Promise<RepositoryResult<SafeUserWithAccounts | null>> {
    const validation = this.validateRequired({ id }, ["id"])
    if (!validation.success) {
      const errorMessage =
        typeof validation.error === "string"
          ? validation.error
          : validation.error?.message || "Validation failed"
      return this.createError("VALIDATION_ERROR", errorMessage)
    }

    return this.handleAsync(
      () =>
        this.db.user.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            role: true,
            phone: true,
            company: true,
            createdAt: true,
            updatedAt: true,
            militaryBranch: true,
            yearsOfService: true,
            certifications: true,
            preferredLocations: true,
            isAvailable: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
            // SECURITY: password field explicitly excluded
            accounts: {
              select: {
                provider: true,
                providerAccountId: true,
              },
            },
          },
        }),
      "USER_FIND_ERROR",
      "Failed to find user",
      `findById(${id})`
    )
  }

  /**
   * Find user by email
   * SECURITY FIX: Uses select instead of include to prevent password exposure
   * Returns SafeUserWithAccounts type following .cursorrules.md Platform Mode standards
   */
  async findByEmail(
    email: string
  ): Promise<RepositoryResult<SafeUserWithAccounts | null>> {
    const validation = this.validateRequired({ email }, ["email"])
    if (!validation.success) {
      const errorMessage =
        typeof validation.error === "string"
          ? validation.error
          : validation.error?.message || "Validation failed"
      return this.createError("VALIDATION_ERROR", errorMessage)
    }

    return this.handleAsync(
      () =>
        this.db.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            role: true,
            phone: true,
            company: true,
            createdAt: true,
            updatedAt: true,
            militaryBranch: true,
            yearsOfService: true,
            certifications: true,
            preferredLocations: true,
            isAvailable: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
            // SECURITY: password field explicitly excluded
            accounts: {
              select: {
                provider: true,
                providerAccountId: true,
              },
            },
          },
        }),
      "USER_FIND_BY_EMAIL_ERROR",
      "Failed to find user by email",
      `findByEmail(${email})`
    )
  }

  /**
   * Find users with filtering and pagination
   */
  async findMany(
    filters?: FilterOptions,
    pagination?: PaginationOptions
  ): Promise<RepositoryResult<SafeUser[]>> {
    return this.handleAsync(
      () => {
        let query = {
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            role: true,
            phone: true,
            company: true,
            createdAt: true,
            updatedAt: true,
            militaryBranch: true,
            yearsOfService: true,
            certifications: true,
            preferredLocations: true,
            isAvailable: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
            // Exclude sensitive fields like password
          },
          orderBy: {
            createdAt: "desc" as const,
          },
        }

        if (filters) {
          query = this.applyFilters(query, filters)
        }

        if (pagination) {
          query = this.applyPagination(query, pagination)
        }

        return this.db.user.findMany(query)
      },
      "USER_FIND_MANY_ERROR",
      "Failed to find users",
      "findMany"
    )
  }

  /**
   * Find available operators
   */
  async findAvailableOperators(
    filters?: { preferredLocations?: string[]; certifications?: string[] },
    pagination?: PaginationOptions
  ): Promise<RepositoryResult<SafeUser[]>> {
    return this.handleAsync(
      () => {
        const whereClause = {
          role: "OPERATOR" as const,
          isAvailable: true,
        } as {
          role: "OPERATOR"
          isAvailable: boolean
          preferredLocations?: { hasSome: string[] }
          certifications?: { hasSome: string[] }
        }

        // Add location filter if provided
        if (
          filters?.preferredLocations &&
          filters.preferredLocations.length > 0
        ) {
          whereClause.preferredLocations = {
            hasSome: filters.preferredLocations,
          }
        }

        // Add certification filter if provided
        if (filters?.certifications && filters.certifications.length > 0) {
          whereClause.certifications = {
            hasSome: filters.certifications,
          }
        }

        let query = {
          where: whereClause,
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            role: true,
            phone: true,
            company: true,
            createdAt: true,
            updatedAt: true,
            militaryBranch: true,
            yearsOfService: true,
            certifications: true,
            preferredLocations: true,
            isAvailable: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
          },
          orderBy: {
            yearsOfService: "desc" as const,
          },
        }

        if (pagination) {
          query = this.applyPagination(query, pagination)
        }

        return this.db.user.findMany(query)
      },
      "OPERATOR_FIND_ERROR",
      "Failed to find available operators",
      "findAvailableOperators"
    )
  }

  /**
   * Create new user
   */
  async create(data: UserCreateInput): Promise<RepositoryResult<SafeUser>> {
    const validation = this.validateRequired(
      data as unknown as Record<string, unknown>,
      ["email"]
    )
    if (!validation.success) {
      const errorMessage =
        typeof validation.error === "string"
          ? validation.error
          : validation.error?.message || "Validation failed"
      return this.createError("VALIDATION_ERROR", errorMessage)
    }

    return this.handleAsync(
      () =>
        this.db.user.create({
          data: {
            ...data,
            role: data.role || "USER",
          },
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            role: true,
            phone: true,
            company: true,
            createdAt: true,
            updatedAt: true,
            militaryBranch: true,
            yearsOfService: true,
            certifications: true,
            preferredLocations: true,
            isAvailable: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
            // SECURITY: password field explicitly excluded
          },
        }),
      "USER_CREATE_ERROR",
      "Failed to create user",
      "create"
    )
  }

  /**
   * Update user
   */
  async update(
    id: string,
    data: UserUpdateInput
  ): Promise<RepositoryResult<SafeUser>> {
    const validation = this.validateRequired({ id }, ["id"])
    if (!validation.success) {
      const errorMessage =
        typeof validation.error === "string"
          ? validation.error
          : validation.error?.message || "Validation failed"
      return this.createError("VALIDATION_ERROR", errorMessage)
    }

    return this.handleAsync(
      () =>
        this.db.user.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date(),
          },
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            role: true,
            phone: true,
            company: true,
            createdAt: true,
            updatedAt: true,
            militaryBranch: true,
            yearsOfService: true,
            certifications: true,
            preferredLocations: true,
            isAvailable: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
            // SECURITY: password field explicitly excluded
          },
        }),
      "USER_UPDATE_ERROR",
      "Failed to update user",
      `update(${id})`
    )
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<RepositoryResult<boolean>> {
    const validation = this.validateRequired({ id }, ["id"])
    if (!validation.success) {
      const errorMessage =
        typeof validation.error === "string"
          ? validation.error
          : validation.error?.message || "Validation failed"
      return this.createError("VALIDATION_ERROR", errorMessage)
    }

    return this.handleAsync(
      async () => {
        await this.db.user.delete({
          where: { id },
        })
        return true
      },
      "USER_DELETE_ERROR",
      "Failed to delete user",
      `delete(${id})`
    )
  }

  /**
   * Count users with optional filters
   */
  async count(filters?: FilterOptions): Promise<RepositoryResult<number>> {
    return this.handleAsync(
      () => {
        let query: { where?: Record<string, unknown> } = {}

        if (filters) {
          query = this.applyFilters(query, filters)
        }

        return this.db.user.count(query)
      },
      "USER_COUNT_ERROR",
      "Failed to count users",
      "count"
    )
  }

  /**
   * Submit operator application (upgrade user to operator)
   */
  async submitOperatorApplication(
    userId: string,
    applicationData: OperatorApplicationInput
  ): Promise<RepositoryResult<SafeUser>> {
    const validation = this.validateRequired({ userId, ...applicationData }, [
      "userId",
      "militaryBranch",
      "yearsOfService",
    ])
    if (!validation.success) {
      const errorMessage =
        typeof validation.error === "string"
          ? validation.error
          : validation.error?.message || "Validation failed"
      return this.createError("VALIDATION_ERROR", errorMessage)
    }

    return this.handleAsync(
      () =>
        this.db.user.update({
          where: { id: userId },
          data: {
            role: "OPERATOR",
            militaryBranch: applicationData.militaryBranch,
            yearsOfService: applicationData.yearsOfService,
            certifications: applicationData.certifications || [],
            preferredLocations: applicationData.preferredLocations || [],
            isAvailable: true,
            updatedAt: new Date(),
          },
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            role: true,
            phone: true,
            company: true,
            createdAt: true,
            updatedAt: true,
            militaryBranch: true,
            yearsOfService: true,
            certifications: true,
            preferredLocations: true,
            isAvailable: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
            // SECURITY: password field explicitly excluded
          },
        }),
      "OPERATOR_APPLICATION_ERROR",
      "Failed to submit operator application",
      `submitOperatorApplication(${userId})`
    )
  }

  /**
   * Set operator availability status
   */
  async setOperatorAvailability(
    operatorId: string,
    isAvailable: boolean
  ): Promise<RepositoryResult<SafeUser>> {
    const validation = this.validateRequired({ operatorId }, ["operatorId"])
    if (!validation.success) {
      const errorMessage =
        typeof validation.error === "string"
          ? validation.error
          : validation.error?.message || "Validation failed"
      return this.createError("VALIDATION_ERROR", errorMessage)
    }

    return this.handleAsync(
      async () => {
        // First verify the user exists and is an operator
        const user = await this.db.user.findUnique({
          where: { id: operatorId },
          select: { id: true, role: true },
        })

        if (!user) {
          throw new Error(`User with ID ${operatorId} not found`)
        }

        if (user.role !== "OPERATOR") {
          throw new Error(`User with ID ${operatorId} is not an operator`)
        }

        // Update availability
        return this.db.user.update({
          where: { id: operatorId },
          data: {
            isAvailable,
            updatedAt: new Date(),
          },
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            role: true,
            phone: true,
            company: true,
            createdAt: true,
            updatedAt: true,
            militaryBranch: true,
            yearsOfService: true,
            certifications: true,
            preferredLocations: true,
            isAvailable: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
            // SECURITY: password field explicitly excluded
          },
        })
      },
      "OPERATOR_AVAILABILITY_UPDATE_ERROR",
      "Failed to set operator availability",
      `setOperatorAvailability(${operatorId}, ${isAvailable})`
    )
  }

  /**
   * Update user's Stripe information
   */
  async updateStripeInfo(
    userId: string,
    stripeData: {
      stripeCustomerId?: string
      stripeSubscriptionId?: string
      stripePriceId?: string
      stripeCurrentPeriodEnd?: Date
    }
  ): Promise<RepositoryResult<SafeUser>> {
    const validation = this.validateRequired({ userId }, ["userId"])
    if (!validation.success) {
      const errorMessage =
        typeof validation.error === "string"
          ? validation.error
          : validation.error?.message || "Validation failed"
      return this.createError("VALIDATION_ERROR", errorMessage)
    }

    return this.handleAsync(
      () =>
        this.db.user.update({
          where: { id: userId },
          data: {
            ...stripeData,
            updatedAt: new Date(),
          },
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            role: true,
            phone: true,
            company: true,
            createdAt: true,
            updatedAt: true,
            militaryBranch: true,
            yearsOfService: true,
            certifications: true,
            preferredLocations: true,
            isAvailable: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
            // SECURITY: password field explicitly excluded
          },
        }),
      "USER_STRIPE_UPDATE_ERROR",
      "Failed to update user Stripe information",
      `updateStripeInfo(${userId})`
    )
  }

  /**
   * Find users by role
   */
  async findByRole(
    role: UserRole,
    pagination?: PaginationOptions
  ): Promise<RepositoryResult<SafeUser[]>> {
    const validation = this.validateRequired({ role }, ["role"])
    if (!validation.success) {
      const errorMessage =
        typeof validation.error === "string"
          ? validation.error
          : validation.error?.message || "Validation failed"
      return this.createError("VALIDATION_ERROR", errorMessage)
    }

    return this.handleAsync(
      () => {
        let query = {
          where: { role },
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            role: true,
            phone: true,
            company: true,
            createdAt: true,
            updatedAt: true,
            militaryBranch: true,
            yearsOfService: true,
            certifications: true,
            preferredLocations: true,
            isAvailable: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
          },
          orderBy: {
            createdAt: "desc" as const,
          },
        }

        if (pagination) {
          query = this.applyPagination(query, pagination)
        }

        return this.db.user.findMany(query)
      },
      "USER_FIND_BY_ROLE_ERROR",
      "Failed to find users by role",
      `findByRole(${role})`
    )
  }

  /**
   * Verify user email
   */
  async verifyEmail(userId: string): Promise<RepositoryResult<SafeUser>> {
    const validation = this.validateRequired({ userId }, ["userId"])
    if (!validation.success) {
      const errorMessage =
        typeof validation.error === "string"
          ? validation.error
          : validation.error?.message || "Validation failed"
      return this.createError("VALIDATION_ERROR", errorMessage)
    }

    return this.handleAsync(
      () =>
        this.db.user.update({
          where: { id: userId },
          data: {
            emailVerified: new Date(),
            updatedAt: new Date(),
          },
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            role: true,
            phone: true,
            company: true,
            createdAt: true,
            updatedAt: true,
            militaryBranch: true,
            yearsOfService: true,
            certifications: true,
            preferredLocations: true,
            isAvailable: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
            // SECURITY: password field explicitly excluded
          },
        }),
      "USER_EMAIL_VERIFY_ERROR",
      "Failed to verify user email",
      `verifyEmail(${userId})`
    )
  }
}
