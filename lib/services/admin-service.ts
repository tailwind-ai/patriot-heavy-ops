/**
 * Admin Management Service Layer
 *
 * Platform-agnostic service for administrative operations including user management,
 * operator application processing, and system metrics.
 * Designed for cross-platform reuse including future React Native mobile apps.
 *
 * Design Principles:
 * - Zero Next.js/React dependencies for mobile compatibility
 * - Framework-agnostic implementation
 * - Centralized admin business logic
 * - Comprehensive audit logging
 * - Single responsibility for admin operations
 *
 * Following .cursorrules.md Platform Mode standards (Issue #225)
 */

import { UserRole, User } from "@prisma/client"
import { BaseService, ServiceResult, ServiceLogger } from "./base-service"
import { DashboardService, DashboardStats } from "./dashboard-service"

/**
 * Pagination options for admin queries
 * Duplicated here to maintain layer separation (services should not import from repositories)
 */
export interface PaginationOptions {
  page?: number
  limit?: number
  cursor?: string
}

/**
 * SafeUser type - User without password field for security
 * Duplicated here to maintain layer separation
 */
export type SafeUser = Omit<User, "password">

/**
 * Minimal user info for role-based queries
 * Duplicated here to maintain layer separation
 */
export type UserRoleInfo = Pick<
  SafeUser,
  "id" | "name" | "email" | "role" | "phone" | "company" | "createdAt"
> & {
  militaryBranch?: string | null
  yearsOfService?: number | null
  certifications?: string[]
  preferredLocations?: string[]
  isAvailable?: boolean
}

/**
 * User creation input for admin operations
 */
export interface AdminUserCreateInput extends Record<string, unknown> {
  name?: string
  email: string
  password?: string
  role?: UserRole
  phone?: string
  company?: string
  image?: string
}

/**
 * User update input for admin operations
 */
export interface AdminUserUpdateInput {
  name?: string
  email?: string
  phone?: string
  company?: string
  image?: string
  role?: UserRole
  militaryBranch?: string
  yearsOfService?: number
  certifications?: string[]
  preferredLocations?: string[]
  isAvailable?: boolean
}

/**
 * System-wide metrics for admin dashboard
 */
export interface SystemMetrics {
  totalUsers: number
  usersByRole: {
    USER: number
    OPERATOR: number
    MANAGER: number
    ADMIN: number
  }
  serviceRequests: DashboardStats
}

/**
 * User growth and distribution metrics
 */
export interface UserMetrics {
  totalUsers: number
  usersByRole: {
    USER: number
    OPERATOR: number
    MANAGER: number
    ADMIN: number
  }
  newUsersLast30Days: number
}

/**
 * Admin action types for audit logging
 */
export type AdminActionType =
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DELETED"
  | "USER_ROLE_CHANGED"
  | "OPERATOR_APPLICATION_APPROVED"
  | "OPERATOR_APPLICATION_REJECTED"
  | "SYSTEM_METRICS_ACCESSED"

/**
 * Admin Management Service
 * Provides centralized business logic for administrative operations
 */
export class AdminService extends BaseService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private userRepository: any // UserRepository - avoiding direct import for layer separation
  private dashboardService: DashboardService

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userRepository: any, // UserRepository - avoiding direct import for layer separation
    dashboardService: DashboardService,
    logger?: ServiceLogger
  ) {
    super("AdminService", logger)
    this.userRepository = userRepository
    this.dashboardService = dashboardService
  }

  /**
   * Create a new user with specified role
   * Admin operation for user provisioning
   */
  async createUser(
    userData: AdminUserCreateInput
  ): Promise<ServiceResult<SafeUser>> {
    this.logOperation("createUser", {
      email: userData.email,
      role: userData.role,
    })

    const validation = this.validateRequired(
      userData as unknown as Record<string, unknown>,
      ["email"]
    )
    if (!validation.success) {
      return this.createError(
        "VALIDATION_ERROR",
        validation.error?.message || "Validation failed",
        validation.error?.details
      )
    }

    return this.handleAsync(
      async () => {
        const result = await this.userRepository.create(userData)

        if (!result.success || !result.data) {
          throw new Error(result.error?.message || "Failed to create user")
        }

        return result.data
      },
      "USER_CREATE_ERROR",
      "Failed to create user"
    )
  }

  /**
   * Update user details
   * Admin operation for user management
   */
  async updateUser(
    userId: string,
    updates: AdminUserUpdateInput
  ): Promise<ServiceResult<SafeUser>> {
    this.logOperation("updateUser", { userId: "[REDACTED]" })

    const validation = this.validateRequired({ userId }, ["userId"])
    if (!validation.success) {
      return this.createError(
        "VALIDATION_ERROR",
        validation.error?.message || "Validation failed"
      )
    }

    return this.handleAsync(
      async () => {
        const result = await this.userRepository.update(userId, updates)

        if (!result.success || !result.data) {
          throw new Error(result.error?.message || "Failed to update user")
        }

        return result.data
      },
      "USER_UPDATE_ERROR",
      "Failed to update user"
    )
  }

  /**
   * Delete user (blocked if user has active service requests)
   * Admin operation with safety checks
   */
  async deleteUser(userId: string): Promise<ServiceResult<boolean>> {
    this.logOperation("deleteUser", { userId: "[REDACTED]" })

    const validation = this.validateRequired({ userId }, ["userId"])
    if (!validation.success) {
      return this.createError(
        "VALIDATION_ERROR",
        validation.error?.message || "Validation failed"
      )
    }

    return this.handleAsync(
      async () => {
        // Check if user exists
        const userResult = await this.userRepository.findById(userId)
        if (!userResult.success || !userResult.data) {
          const error = new Error("User not found")
          error.name = "USER_NOT_FOUND"
          throw error
        }

        // Check for active service requests
        const { db } = await import("@/lib/db")
        const activeRequestsCount = await db?.serviceRequest.count({
          where: {
            userId,
            status: {
              notIn: ["CANCELLED", "CLOSED"],
            },
          },
        })

        if (activeRequestsCount && activeRequestsCount > 0) {
          const error = new Error(
            `Cannot delete user with ${activeRequestsCount} active service requests. Please close all requests first.`
          )
          error.name = "DELETE_BLOCKED"
          throw error
        }

        // Safe to delete
        const deleteResult = await this.userRepository.delete(userId)

        if (!deleteResult.success) {
          throw new Error(
            deleteResult.error?.message || "Failed to delete user"
          )
        }

        return true
      },
      "USER_DELETE_ERROR",
      "Failed to delete user"
    )
  }

  /**
   * Change user role
   * Admin operation for role management
   */
  async changeUserRole(
    userId: string,
    newRole: UserRole
  ): Promise<ServiceResult<SafeUser>> {
    this.logOperation("changeUserRole", {
      userId: "[REDACTED]",
      newRole,
    })

    const validation = this.validateRequired({ userId, newRole }, [
      "userId",
      "newRole",
    ])
    if (!validation.success) {
      return this.createError(
        "VALIDATION_ERROR",
        validation.error?.message || "Validation failed"
      )
    }

    // Validate role is a valid UserRole enum value
    const validRoles: UserRole[] = ["USER", "OPERATOR", "MANAGER", "ADMIN"]
    if (!validRoles.includes(newRole)) {
      return this.createError("VALIDATION_ERROR", "Invalid role specified", {
        validRoles,
      })
    }

    return this.handleAsync(
      async () => {
        const result = await this.userRepository.update(userId, {
          role: newRole,
        })

        if (!result.success || !result.data) {
          throw new Error(result.error?.message || "Failed to change user role")
        }

        return result.data
      },
      "ROLE_CHANGE_ERROR",
      "Failed to change user role"
    )
  }

  /**
   * Approve operator application
   * Changes user role to OPERATOR and ensures availability is set
   */
  async approveOperatorApplication(
    userId: string
  ): Promise<ServiceResult<SafeUser>> {
    this.logOperation("approveOperatorApplication", {
      userId: "[REDACTED]",
    })

    const validation = this.validateRequired({ userId }, ["userId"])
    if (!validation.success) {
      return this.createError(
        "VALIDATION_ERROR",
        validation.error?.message || "Validation failed"
      )
    }

    return this.handleAsync(
      async () => {
        // Verify user has submitted application data
        const userResult = await this.userRepository.findById(userId)
        if (!userResult.success || !userResult.data) {
          throw new Error("User not found")
        }

        const user = userResult.data

        // Check if user has complete application data
        if (
          !user.militaryBranch ||
          !user.yearsOfService ||
          !user.certifications ||
          user.certifications.length === 0 ||
          !user.preferredLocations ||
          user.preferredLocations.length === 0
        ) {
          const error = new Error(
            "Cannot approve application with incomplete application data. User must have military branch, years of service, certifications, and preferred locations."
          )
          error.name = "INVALID_APPLICATION"
          throw error
        }

        // Approve by setting role to OPERATOR and ensuring availability
        const result = await this.userRepository.update(userId, {
          role: "OPERATOR",
          isAvailable: true,
        })

        if (!result.success || !result.data) {
          throw new Error(
            result.error?.message || "Failed to approve operator application"
          )
        }

        return result.data
      },
      "OPERATOR_APPROVAL_ERROR",
      "Failed to approve operator application"
    )
  }

  /**
   * Reject operator application
   * Clears application data to allow resubmission
   */
  async rejectOperatorApplication(
    userId: string
  ): Promise<ServiceResult<SafeUser>> {
    this.logOperation("rejectOperatorApplication", {
      userId: "[REDACTED]",
    })

    const validation = this.validateRequired({ userId }, ["userId"])
    if (!validation.success) {
      return this.createError(
        "VALIDATION_ERROR",
        validation.error?.message || "Validation failed"
      )
    }

    return this.handleAsync(
      async () => {
        // Verify user exists
        const userResult = await this.userRepository.findById(userId)
        if (!userResult.success || !userResult.data) {
          throw new Error("User not found")
        }

        // Clear application data (allows resubmission)
        // Note: We can't set fields to null/undefined with exactOptionalPropertyTypes
        // Instead, we clear arrays and use update to overwrite with empty values
        const { db } = await import("@/lib/db")
        await db?.user.update({
          where: { id: userId },
          data: {
            militaryBranch: null,
            yearsOfService: null,
            certifications: [],
            preferredLocations: [],
            updatedAt: new Date(),
          },
        })

        // Fetch updated user
        const result = await this.userRepository.findById(userId)

        if (!result.success || !result.data) {
          throw new Error(
            result.error?.message || "Failed to reject operator application"
          )
        }

        return result.data
      },
      "OPERATOR_REJECTION_ERROR",
      "Failed to reject operator application"
    )
  }

  /**
   * Get pending operator applications
   * Returns users with application data but still USER role
   */
  async getPendingOperatorApplications(
    pagination?: PaginationOptions
  ): Promise<ServiceResult<UserRoleInfo[]>> {
    this.logOperation("getPendingOperatorApplications")

    return this.handleAsync(
      async () => {
        const { db } = await import("@/lib/db")

        const users = await db?.user.findMany({
          where: {
            role: "USER",
            militaryBranch: { not: null },
            yearsOfService: { not: null },
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            company: true,
            createdAt: true,
            militaryBranch: true,
            yearsOfService: true,
            certifications: true,
            preferredLocations: true,
            isAvailable: true,
          },
          orderBy: { createdAt: "desc" },
          ...(pagination?.limit && { take: pagination.limit }),
          ...(pagination?.page &&
            pagination?.limit && {
              skip: (pagination.page - 1) * pagination.limit,
            }),
        })

        return users || []
      },
      "PENDING_APPLICATIONS_ERROR",
      "Failed to fetch pending operator applications"
    )
  }

  /**
   * Get users by role with pagination
   * Admin operation for user management
   */
  async getUsersByRole(
    role: UserRole,
    pagination?: PaginationOptions
  ): Promise<ServiceResult<UserRoleInfo[]>> {
    this.logOperation("getUsersByRole", { role })

    const validation = this.validateRequired({ role }, ["role"])
    if (!validation.success) {
      return this.createError(
        "VALIDATION_ERROR",
        validation.error?.message || "Validation failed"
      )
    }

    return this.handleAsync(
      async () => {
        const result = await this.userRepository.findByRole(role, pagination)

        if (!result.success) {
          throw new Error(
            result.error?.message || "Failed to fetch users by role"
          )
        }

        return result.data || []
      },
      "USERS_BY_ROLE_ERROR",
      "Failed to fetch users by role"
    )
  }

  /**
   * Get system-wide metrics
   * Aggregates data from multiple sources for admin dashboard
   */
  async getSystemMetrics(dateRange?: {
    start: Date
    end: Date
  }): Promise<ServiceResult<SystemMetrics>> {
    this.logOperation("getSystemMetrics")

    return this.handleAsync(
      async () => {
        const { db } = await import("@/lib/db")

        // Get total user count
        const totalUsers = (await db?.user.count()) || 0

        // Get user counts by role
        const [userCount, operatorCount, managerCount, adminCount] =
          await Promise.all([
            db?.user.count({ where: { role: "USER" } }),
            db?.user.count({ where: { role: "OPERATOR" } }),
            db?.user.count({ where: { role: "MANAGER" } }),
            db?.user.count({ where: { role: "ADMIN" } }),
          ])

        // Get service request stats from DashboardService
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const serviceStats = await (this.dashboardService as any).getAdminStats(
          dateRange
        )

        return {
          totalUsers,
          usersByRole: {
            USER: userCount || 0,
            OPERATOR: operatorCount || 0,
            MANAGER: managerCount || 0,
            ADMIN: adminCount || 0,
          },
          serviceRequests: serviceStats,
        }
      },
      "SYSTEM_METRICS_ERROR",
      "Failed to fetch system metrics"
    )
  }

  /**
   * Get user growth and distribution metrics
   * Admin analytics for user management
   */
  async getUserMetrics(): Promise<ServiceResult<UserMetrics>> {
    this.logOperation("getUserMetrics")

    return this.handleAsync(
      async () => {
        const { db } = await import("@/lib/db")

        // Get total user count
        const totalUsers = (await db?.user.count()) || 0

        // Get user counts by role
        const [userCount, operatorCount, managerCount, adminCount] =
          await Promise.all([
            db?.user.count({ where: { role: "USER" } }),
            db?.user.count({ where: { role: "OPERATOR" } }),
            db?.user.count({ where: { role: "MANAGER" } }),
            db?.user.count({ where: { role: "ADMIN" } }),
          ])

        // Get new users in last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const newUsersLast30Days =
          (await db?.user.count({
            where: {
              createdAt: {
                gte: thirtyDaysAgo,
              },
            },
          })) || 0

        return {
          totalUsers,
          usersByRole: {
            USER: userCount || 0,
            OPERATOR: operatorCount || 0,
            MANAGER: managerCount || 0,
            ADMIN: adminCount || 0,
          },
          newUsersLast30Days,
        }
      },
      "USER_METRICS_ERROR",
      "Failed to fetch user metrics"
    )
  }

  /**
   * Log admin action for audit trail
   * Console logging for MVP (can be enhanced with database logging)
   */
  public logAdminAction(
    adminId: string,
    action: AdminActionType,
    targetId?: string,
    details?: Record<string, unknown>
  ): void {
    const logData = {
      adminId: "[REDACTED]", // Redact sensitive IDs in logs
      action,
      targetId,
      details,
      timestamp: new Date().toISOString(),
    }

    this.logger.info(`ADMIN_ACTION: ${action}`, logData)
  }
}
