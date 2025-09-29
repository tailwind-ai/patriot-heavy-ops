/**
 * Dashboard Data Service Layer
 *
 * Platform-agnostic service for dashboard data access across all user roles.
 * Designed for cross-platform reuse including future React Native mobile apps.
 *
 * Design Principles:
 * - Zero Next.js/React dependencies for mobile compatibility
 * - Framework-agnostic implementation
 * - Role-specific data filtering and access control
 * - Mobile-ready caching and offline support
 * - Single responsibility for dashboard business logic
 */

import { BaseService, ServiceResult, ServiceLogger } from "./base-service"
import { UserRole } from "../permissions"
import { db } from "../db"
import { decimalToNumber, decimalToHours } from "../utils/decimal"

// Dashboard data types
export interface DashboardUser {
  id: string
  name: string | null
  email: string | null
  role: string
  company: string | null
  createdAt: Date
}

export interface DashboardServiceRequest {
  id: string
  title: string
  status: string
  equipmentCategory: string
  jobSite: string
  startDate: Date
  endDate: Date | null
  requestedDurationType: string
  requestedDurationValue: number
  requestedTotalHours: number | null
  estimatedCost: number | null
  createdAt: Date
  updatedAt: Date
  user?: {
    name: string | null
    email: string | null
    company: string | null
  }
  assignedOperators?: Array<{
    id: string
    name: string | null
    email: string | null
  }>
}

export interface DashboardStats {
  totalRequests: number
  activeRequests: number
  completedRequests: number
  pendingApproval: number
  revenue?: number
  averageJobDuration?: number
}

export interface OperatorAssignment {
  id: string
  serviceRequestId: string
  operatorId: string
  assignedAt: Date
  status: string
  serviceRequest: {
    title: string
    jobSite: string
    startDate: Date
    endDate: Date | null
    status: string
  }
}

export interface DashboardDataOptions {
  userId: string
  userRole: UserRole
  limit?: number
  offset?: number
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface CacheOptions {
  enableCaching?: boolean
  cacheKey?: string
  cacheTTL?: number // Time to live in seconds
}

/**
 * Dashboard Data Service
 * Provides role-specific dashboard data access with mobile-ready caching
 */
export class DashboardService extends BaseService {
  private cache: Map<string, { data: unknown; expires: number }> = new Map()

  constructor(logger?: ServiceLogger) {
    super("DashboardService", logger)
  }

  /**
   * Get dashboard data based on user role
   */
  async getDashboardData(
    options: DashboardDataOptions,
    cacheOptions?: CacheOptions
  ): Promise<
    ServiceResult<{
      stats: DashboardStats
      recentRequests: DashboardServiceRequest[]
      assignments?: OperatorAssignment[]
      users?: DashboardUser[]
    }>
  > {
    this.logOperation("getDashboardData", {
      userId: "[REDACTED]",
      userRole: options.userRole,
      limit: options.limit,
    })

    const validation = this.validateRequired(
      options as unknown as Record<string, unknown>,
      ["userId", "userRole"]
    )
    if (!validation.success) {
      return this.createError(
        validation.error?.code || "VALIDATION_ERROR",
        validation.error?.message || "Validation failed",
        validation.error?.details
      )
    }

    // Check cache first
    const cacheKey =
      cacheOptions?.cacheKey ||
      `dashboard_${options.userId}_${options.userRole}`
    if (cacheOptions?.enableCaching) {
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        return this.createSuccess(
          cached as {
            stats: DashboardStats
            recentRequests: DashboardServiceRequest[]
            assignments?: OperatorAssignment[]
            users?: DashboardUser[]
          }
        )
      }
    }

    return this.handleAsync(
      async () => {
        let dashboardData: {
          stats: DashboardStats
          recentRequests: DashboardServiceRequest[]
          assignments?: OperatorAssignment[]
          users?: DashboardUser[]
        }

        switch (options.userRole) {
          case "USER":
            dashboardData = await this.getUserDashboardData(options)
            break
          case "OPERATOR":
            dashboardData = await this.getOperatorDashboardData(options)
            break
          case "MANAGER":
            dashboardData = await this.getManagerDashboardData(options)
            break
          case "ADMIN":
            dashboardData = await this.getAdminDashboardData(options)
            break
          default:
            throw new Error(`Invalid user role: ${options.userRole}`)
        }

        // Cache the result
        if (cacheOptions?.enableCaching) {
          this.setCache(cacheKey, dashboardData, cacheOptions.cacheTTL || 300) // 5 min default
        }

        return dashboardData
      },
      "DASHBOARD_DATA_ERROR",
      "Failed to fetch dashboard data"
    )
  }

  /**
   * Get USER role dashboard data
   */
  private async getUserDashboardData(options: DashboardDataOptions) {
    const stats = await this.getUserStats(options.userId)
    const recentRequests = await this.getUserServiceRequests(options)

    return {
      stats,
      recentRequests,
    }
  }

  /**
   * Get OPERATOR role dashboard data
   */
  private async getOperatorDashboardData(options: DashboardDataOptions) {
    const stats = await this.getOperatorStats(options.userId)
    const recentRequests = await this.getOperatorServiceRequests(options)
    const assignments = await this.getOperatorAssignments(
      options.userId,
      options.limit
    )

    return {
      stats,
      recentRequests,
      assignments,
    }
  }

  /**
   * Get MANAGER role dashboard data
   */
  private async getManagerDashboardData(options: DashboardDataOptions) {
    const stats = await this.getManagerStats(options.dateRange)
    const recentRequests = await this.getAllServiceRequests(options)
    const assignments = await this.getAllActiveAssignments(options.limit)

    return {
      stats,
      recentRequests,
      assignments,
    }
  }

  /**
   * Get ADMIN role dashboard data
   */
  private async getAdminDashboardData(options: DashboardDataOptions) {
    const stats = await this.getAdminStats(options.dateRange)
    const recentRequests = await this.getAllServiceRequests(options)
    const assignments = await this.getAllActiveAssignments(options.limit)
    const users = await this.getRecentUsers(options.limit)

    return {
      stats,
      recentRequests,
      assignments,
      users,
    }
  }

  /**
   * Get statistics for USER role
   */
  private async getUserStats(userId: string): Promise<DashboardStats> {
    const [totalRequests, activeRequests, completedRequests] =
      await Promise.all([
        db?.serviceRequest.count({ where: { userId } }),
        db?.serviceRequest.count({
          where: {
            userId,
            status: {
              in: [
                "SUBMITTED",
                "UNDER_REVIEW",
                "APPROVED",
                "OPERATOR_MATCHING",
                "OPERATOR_ASSIGNED",
                "EQUIPMENT_CHECKING",
                "EQUIPMENT_CONFIRMED",
                "DEPOSIT_REQUESTED",
                "DEPOSIT_PENDING",
                "DEPOSIT_RECEIVED",
                "JOB_SCHEDULED",
                "JOB_IN_PROGRESS",
              ],
            },
          },
        }),
        db?.serviceRequest.count({
          where: {
            userId,
            status: {
              in: [
                "JOB_COMPLETED",
                "INVOICED",
                "PAYMENT_PENDING",
                "PAYMENT_RECEIVED",
                "CLOSED",
              ],
            },
          },
        }),
      ])

    const pendingApproval = await db?.serviceRequest.count({
      where: {
        userId,
        status: { in: ["SUBMITTED", "UNDER_REVIEW"] },
      },
    })

    return {
      totalRequests,
      activeRequests,
      completedRequests,
      pendingApproval,
    }
  }

  /**
   * Get statistics for OPERATOR role
   */
  private async getOperatorStats(operatorId: string): Promise<DashboardStats> {
    const [totalAssignments, activeAssignments, completedAssignments] =
      await Promise.all([
        db?.userAssignment.count({ where: { operatorId } }),
        db?.userAssignment.count({
          where: {
            operatorId,
            serviceRequest: {
              status: {
                in: [
                  "OPERATOR_ASSIGNED",
                  "EQUIPMENT_CHECKING",
                  "EQUIPMENT_CONFIRMED",
                  "DEPOSIT_REQUESTED",
                  "DEPOSIT_PENDING",
                  "DEPOSIT_RECEIVED",
                  "JOB_SCHEDULED",
                  "JOB_IN_PROGRESS",
                ],
              },
            },
          },
        }),
        db?.userAssignment.count({
          where: {
            operatorId,
            serviceRequest: {
              status: {
                in: [
                  "JOB_COMPLETED",
                  "INVOICED",
                  "PAYMENT_PENDING",
                  "PAYMENT_RECEIVED",
                  "CLOSED",
                ],
              },
            },
          },
        }),
      ])

    // Also include their own service requests
    const ownRequests = await db?.serviceRequest.count({
      where: { userId: operatorId },
    })

    return {
      totalRequests: totalAssignments + ownRequests,
      activeRequests: activeAssignments,
      completedRequests: completedAssignments,
      pendingApproval: 0, // Operators don't have pending approvals
    }
  }

  /**
   * Get statistics for MANAGER role
   */
  private async getManagerStats(dateRange?: {
    start: Date
    end: Date
  }): Promise<DashboardStats> {
    const whereClause = dateRange
      ? {
          createdAt: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        }
      : {}

    const [totalRequests, activeRequests, completedRequests, pendingApproval] =
      await Promise.all([
        db?.serviceRequest.count({ where: whereClause }),
        db?.serviceRequest.count({
          where: {
            ...whereClause,
            status: {
              in: [
                "SUBMITTED",
                "UNDER_REVIEW",
                "APPROVED",
                "OPERATOR_MATCHING",
                "OPERATOR_ASSIGNED",
                "EQUIPMENT_CHECKING",
                "EQUIPMENT_CONFIRMED",
                "DEPOSIT_REQUESTED",
                "DEPOSIT_PENDING",
                "DEPOSIT_RECEIVED",
                "JOB_SCHEDULED",
                "JOB_IN_PROGRESS",
              ],
            },
          },
        }),
        db?.serviceRequest.count({
          where: {
            ...whereClause,
            status: {
              in: [
                "JOB_COMPLETED",
                "INVOICED",
                "PAYMENT_PENDING",
                "PAYMENT_RECEIVED",
                "CLOSED",
              ],
            },
          },
        }),
        db?.serviceRequest.count({
          where: {
            ...whereClause,
            status: { in: ["SUBMITTED", "UNDER_REVIEW"] },
          },
        }),
      ])

    // Calculate revenue from completed requests
    const revenueResult = await db?.serviceRequest.aggregate({
      where: {
        ...whereClause,
        status: { in: ["PAYMENT_RECEIVED", "CLOSED"] },
        estimatedCost: { not: null },
      },
      _sum: {
        estimatedCost: true,
      },
    })

    return {
      totalRequests,
      activeRequests,
      completedRequests,
      pendingApproval,
      revenue: decimalToNumber(revenueResult._sum.estimatedCost) || 0,
    }
  }

  /**
   * Get statistics for ADMIN role
   */
  private async getAdminStats(dateRange?: {
    start: Date
    end: Date
  }): Promise<DashboardStats> {
    const stats = await this.getManagerStats(dateRange) // Inherit manager stats

    // Add admin-specific metrics
    const avgDurationResult = await db?.serviceRequest.aggregate({
      where: {
        status: {
          in: [
            "JOB_COMPLETED",
            "INVOICED",
            "PAYMENT_PENDING",
            "PAYMENT_RECEIVED",
            "CLOSED",
          ],
        },
      },
      _avg: {
        requestedTotalHours: true,
      },
    })

    return {
      ...stats,
      averageJobDuration: decimalToHours(
        avgDurationResult._avg?.requestedTotalHours
      ),
    }
  }

  /**
   * Get service requests for USER role
   */
  private async getUserServiceRequests(
    options: DashboardDataOptions
  ): Promise<DashboardServiceRequest[]> {
    const requests = await db?.serviceRequest.findMany({
      where: { userId: options.userId },
      select: {
        id: true,
        title: true,
        status: true,
        equipmentCategory: true,
        jobSite: true,
        startDate: true,
        endDate: true,
        requestedDurationType: true,
        requestedDurationValue: true,
        requestedTotalHours: true,
        estimatedCost: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: options.limit || 10,
      skip: options.offset || 0,
    })

    return requests.map((request) => ({
      ...request,
      estimatedCost: decimalToNumber(request.estimatedCost),
      requestedTotalHours: decimalToHours(request.requestedTotalHours),
    }))
  }

  /**
   * Get service requests for OPERATOR role (own + assigned)
   */
  private async getOperatorServiceRequests(
    options: DashboardDataOptions
  ): Promise<DashboardServiceRequest[]> {
    const requests = await db?.serviceRequest.findMany({
      where: {
        OR: [
          { userId: options.userId }, // Own requests
          {
            userAssignments: {
              some: { operatorId: options.userId },
            },
          }, // Assigned requests
        ],
      },
      select: {
        id: true,
        title: true,
        status: true,
        equipmentCategory: true,
        jobSite: true,
        startDate: true,
        endDate: true,
        requestedDurationType: true,
        requestedDurationValue: true,
        requestedTotalHours: true,
        estimatedCost: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            email: true,
            company: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: options.limit || 10,
      skip: options.offset || 0,
    })

    return requests.map((request) => ({
      ...request,
      estimatedCost: decimalToNumber(request.estimatedCost),
      requestedTotalHours: decimalToHours(request.requestedTotalHours),
    }))
  }

  /**
   * Get all service requests (MANAGER/ADMIN roles)
   */
  private async getAllServiceRequests(
    options: DashboardDataOptions
  ): Promise<DashboardServiceRequest[]> {
    const whereClause = options.dateRange
      ? {
          createdAt: {
            gte: options.dateRange.start,
            lte: options.dateRange.end,
          },
        }
      : {}

    const requests = await db?.serviceRequest.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        status: true,
        equipmentCategory: true,
        jobSite: true,
        startDate: true,
        endDate: true,
        requestedDurationType: true,
        requestedDurationValue: true,
        requestedTotalHours: true,
        estimatedCost: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            email: true,
            company: true,
          },
        },
        userAssignments: {
          select: {
            operator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: options.limit || 20,
      skip: options.offset || 0,
    })

    return requests.map((request) => ({
      ...request,
      estimatedCost: decimalToNumber(request.estimatedCost),
      requestedTotalHours: decimalToHours(request.requestedTotalHours),
      assignedOperators: request.userAssignments.map(
        (assignment) => assignment.operator
      ),
    }))
  }

  /**
   * Get operator assignments
   */
  private async getOperatorAssignments(
    operatorId: string,
    limit?: number
  ): Promise<OperatorAssignment[]> {
    const assignments = await db?.userAssignment.findMany({
      where: { operatorId },
      select: {
        id: true,
        serviceRequestId: true,
        operatorId: true,
        assignedAt: true,
        status: true,
        serviceRequest: {
          select: {
            title: true,
            jobSite: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
      orderBy: { assignedAt: "desc" },
      take: limit || 10,
    })

    return assignments
  }

  /**
   * Get all active assignments (MANAGER/ADMIN)
   */
  private async getAllActiveAssignments(
    limit?: number
  ): Promise<OperatorAssignment[]> {
    const assignments = await db?.userAssignment.findMany({
      where: {
        serviceRequest: {
          status: {
            in: [
              "OPERATOR_ASSIGNED",
              "EQUIPMENT_CHECKING",
              "EQUIPMENT_CONFIRMED",
              "DEPOSIT_REQUESTED",
              "DEPOSIT_PENDING",
              "DEPOSIT_RECEIVED",
              "JOB_SCHEDULED",
              "JOB_IN_PROGRESS",
            ],
          },
        },
      },
      select: {
        id: true,
        serviceRequestId: true,
        operatorId: true,
        assignedAt: true,
        status: true,
        serviceRequest: {
          select: {
            title: true,
            jobSite: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
      orderBy: { assignedAt: "desc" },
      take: limit || 15,
    })

    return assignments
  }

  /**
   * Get recent users (ADMIN only)
   */
  private async getRecentUsers(limit?: number): Promise<DashboardUser[]> {
    const users = await db?.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit || 10,
    })

    return users
  }

  /**
   * Cache management for mobile offline support
   */
  public getFromCache(key: string): unknown | null {
    const cached = this.cache.get(key)
    if (cached && cached.expires > Date.now()) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  public setCache(key: string, data: unknown, ttlSeconds: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttlSeconds * 1000,
    })
  }

  /**
   * Clear cache (useful for mobile app state management)
   */
  public clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }

  /**
   * Enable offline mode (mobile-ready)
   * Note: Offline mode is handled at the database connection level
   */
  public setOfflineMode(enabled: boolean): void {
    // Offline mode would be handled by the database connection layer
    // This method is kept for API compatibility
    this.logOperation("setOfflineMode", { enabled })
  }

  /**
   * Get cached dashboard data for offline access
   */
  public getCachedDashboardData(
    userId: string,
    userRole: UserRole
  ): unknown | null {
    const cacheKey = `dashboard_${userId}_${userRole}`
    return this.getFromCache(cacheKey)
  }
}
