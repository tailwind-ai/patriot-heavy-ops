/**
 * User Repository
 * 
 * Handles all data operations for users including authentication, profiles, and operator management.
 * Abstracts Prisma operations behind a mobile-compatible interface.
 */

import { PrismaClient } from "@prisma/client"
import type { User, UserRole } from "@prisma/client"
import { 
  BaseRepository, 
  CrudRepository, 
  FilterOptions, 
  PaginationOptions, 
  RepositoryResult,
  RepositoryOptions 
} from "./base-repository"

// Type definitions for user operations
export interface UserWithAccounts extends User {
  accounts: Array<{
    provider: string;
    providerAccountId: string;
  }>;
}

export interface UserCreateInput {
  name?: string;
  email: string;
  password?: string;
  role?: UserRole;
  phone?: string;
  company?: string;
  image?: string;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  image?: string;
  role?: UserRole;
  // Operator-specific fields
  militaryBranch?: string;
  yearsOfService?: number;
  certifications?: string[];
  preferredLocations?: string[];
  isAvailable?: boolean;
  // Stripe fields
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: Date;
}

export interface OperatorApplicationInput {
  militaryBranch: string;
  yearsOfService: number;
  certifications: string[];
  preferredLocations: string[];
}

export interface UserFilters {
  role?: UserRole;
  company?: string;
  isAvailable?: boolean;
  hasStripeSubscription?: boolean;
  emailVerified?: boolean;
}

/**
 * User Repository Implementation
 */
export class UserRepository extends BaseRepository implements CrudRepository<User, UserCreateInput, UserUpdateInput> {
  
  constructor(db: PrismaClient, options?: RepositoryOptions) {
    super(db, "UserRepository", options);
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<RepositoryResult<any>> {
    const validation = this.validateRequired({ id }, ["id"]);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error!,
      };
    }

    return this.handleAsync(
      () => this.db.user.findUnique({
        where: { id },
        include: {
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
    );
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<RepositoryResult<any>> {
    const validation = this.validateRequired({ email }, ["email"]);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error!,
      };
    }

    return this.handleAsync(
      () => this.db.user.findUnique({
        where: { email },
        include: {
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
    );
  }

  /**
   * Find users with filtering and pagination
   */
  async findMany(
    filters?: FilterOptions,
    pagination?: PaginationOptions
  ): Promise<RepositoryResult<User[]>> {
    return this.handleAsync(
      () => {
        let query: any = {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            company: true,
            image: true,
            isAvailable: true,
            createdAt: true,
            updatedAt: true,
            // Exclude sensitive fields like password
          },
          orderBy: {
            createdAt: "desc",
          },
        };

        if (filters) {
          query = this.applyFilters(query, filters);
        }

        if (pagination) {
          query = this.applyPagination(query, pagination);
        }

        return this.db.user.findMany(query);
      },
      "USER_FIND_MANY_ERROR",
      "Failed to find users",
      "findMany"
    );
  }

  /**
   * Find available operators
   */
  async findAvailableOperators(
    filters?: { preferredLocations?: string[]; certifications?: string[] },
    pagination?: PaginationOptions
  ): Promise<RepositoryResult<User[]>> {
    return this.handleAsync(
      () => {
        const whereClause: any = {
          role: "OPERATOR",
          isAvailable: true,
        };

        // Add location filter if provided
        if (filters?.preferredLocations && filters.preferredLocations.length > 0) {
          whereClause.preferredLocations = {
            hasSome: filters.preferredLocations,
          };
        }

        // Add certification filter if provided
        if (filters?.certifications && filters.certifications.length > 0) {
          whereClause.certifications = {
            hasSome: filters.certifications,
          };
        }

        let query: any = {
          where: whereClause,
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            militaryBranch: true,
            yearsOfService: true,
            certifications: true,
            preferredLocations: true,
            isAvailable: true,
            createdAt: true,
          },
          orderBy: {
            yearsOfService: "desc",
          },
        };

        if (pagination) {
          query = this.applyPagination(query, pagination);
        }

        return this.db.user.findMany(query);
      },
      "OPERATOR_FIND_ERROR",
      "Failed to find available operators",
      "findAvailableOperators"
    );
  }

  /**
   * Create new user
   */
  async create(data: UserCreateInput): Promise<RepositoryResult<any>> {
    const validation = this.validateRequired(data, ["email"]);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error!,
      };
    }

    return this.handleAsync(
      () => this.db.user.create({
        data: {
          ...data,
          role: data.role || "USER",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      "USER_CREATE_ERROR",
      "Failed to create user",
      "create"
    );
  }

  /**
   * Update user
   */
  async update(id: string, data: UserUpdateInput): Promise<RepositoryResult<any>> {
    const validation = this.validateRequired({ id }, ["id"]);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error!,
      };
    }

    return this.handleAsync(
      () => this.db.user.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          company: true,
          image: true,
          updatedAt: true,
        },
      }),
      "USER_UPDATE_ERROR",
      "Failed to update user",
      `update(${id})`
    );
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<RepositoryResult<boolean>> {
    const validation = this.validateRequired({ id }, ["id"]);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error!,
      };
    }

    return this.handleAsync(
      async () => {
        await this.db.user.delete({
          where: { id },
        });
        return true;
      },
      "USER_DELETE_ERROR",
      "Failed to delete user",
      `delete(${id})`
    );
  }

  /**
   * Count users with optional filters
   */
  async count(filters?: FilterOptions): Promise<RepositoryResult<number>> {
    return this.handleAsync(
      () => {
        let query: any = {};
        
        if (filters) {
          query = this.applyFilters(query, filters);
        }

        return this.db.user.count(query);
      },
      "USER_COUNT_ERROR",
      "Failed to count users",
      "count"
    );
  }

  /**
   * Submit operator application (upgrade user to operator)
   */
  async submitOperatorApplication(
    userId: string,
    applicationData: OperatorApplicationInput
  ): Promise<RepositoryResult<any>> {
    const validation = this.validateRequired(
      { userId, ...applicationData }, 
      ["userId", "militaryBranch", "yearsOfService"]
    );
    if (!validation.success) {
      return {
        success: false,
        error: validation.error!,
      };
    }

    return this.handleAsync(
      () => this.db.user.update({
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
          role: true,
          militaryBranch: true,
          yearsOfService: true,
          certifications: true,
          preferredLocations: true,
          isAvailable: true,
          updatedAt: true,
        },
      }),
      "OPERATOR_APPLICATION_ERROR",
      "Failed to submit operator application",
      `submitOperatorApplication(${userId})`
    );
  }

  /**
   * Set operator availability status
   */
  async setOperatorAvailability(
    operatorId: string,
    isAvailable: boolean
  ): Promise<RepositoryResult<any>> {
    const validation = this.validateRequired({ operatorId }, ["operatorId"]);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error!,
      };
    }

    return this.handleAsync(
      async () => {
        // First verify the user exists and is an operator
        const user = await this.db.user.findUnique({
          where: { id: operatorId },
          select: { id: true, role: true },
        });

        if (!user) {
          throw new Error(`User with ID ${operatorId} not found`);
        }

        if (user.role !== "OPERATOR") {
          throw new Error(`User with ID ${operatorId} is not an operator`);
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
            isAvailable: true,
            updatedAt: true,
          },
        });
      },
      "OPERATOR_AVAILABILITY_UPDATE_ERROR",
      "Failed to set operator availability",
      `setOperatorAvailability(${operatorId}, ${isAvailable})`
    );
  }

  /**
   * Update user's Stripe information
   */
  async updateStripeInfo(
    userId: string,
    stripeData: {
      stripeCustomerId?: string;
      stripeSubscriptionId?: string;
      stripePriceId?: string;
      stripeCurrentPeriodEnd?: Date;
    }
  ): Promise<RepositoryResult<any>> {
    const validation = this.validateRequired({ userId }, ["userId"]);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error!,
      };
    }

    return this.handleAsync(
      () => this.db.user.update({
        where: { id: userId },
        data: {
          ...stripeData,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          stripePriceId: true,
          stripeCurrentPeriodEnd: true,
          updatedAt: true,
        },
      }),
      "USER_STRIPE_UPDATE_ERROR",
      "Failed to update user Stripe information",
      `updateStripeInfo(${userId})`
    );
  }

  /**
   * Find users by role
   */
  async findByRole(role: UserRole, pagination?: PaginationOptions): Promise<RepositoryResult<User[]>> {
    const validation = this.validateRequired({ role }, ["role"]);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error!,
      };
    }

    return this.handleAsync(
      () => {
        let query: any = {
          where: { role },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            company: true,
            isAvailable: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        };

        if (pagination) {
          query = this.applyPagination(query, pagination);
        }

        return this.db.user.findMany(query);
      },
      "USER_FIND_BY_ROLE_ERROR",
      "Failed to find users by role",
      `findByRole(${role})`
    );
  }

  /**
   * Verify user email
   */
  async verifyEmail(userId: string): Promise<RepositoryResult<any>> {
    const validation = this.validateRequired({ userId }, ["userId"]);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error!,
      };
    }

    return this.handleAsync(
      () => this.db.user.update({
        where: { id: userId },
        data: {
          emailVerified: new Date(),
          updatedAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          updatedAt: true,
        },
      }),
      "USER_EMAIL_VERIFY_ERROR",
      "Failed to verify user email",
      `verifyEmail(${userId})`
    );
  }
}
