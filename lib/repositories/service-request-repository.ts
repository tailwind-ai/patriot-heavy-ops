/**
 * Service Request Repository
 *
 * Handles all data operations for service requests with role-based access control.
 * Abstracts Prisma operations behind a mobile-compatible interface.
 * 
 * ADVANCED TYPE SAFETY (Issue #321):
 * - Uses Prisma.ServiceRequestGetPayload for complex queries with relations
 * - Type-safe nested includes for user, userAssignments, and statusHistory
 * - Automatic schema synchronization through Prisma-generated types
 */

import { PrismaClient, Prisma } from "@prisma/client"
import type {
  ServiceRequest,
  ServiceRequestStatus,
  UserRole,
  TransportOption,
  EquipmentCategory,
  DurationType,
  RateType,
} from "@prisma/client"
import {
  BaseRepository,
  CrudRepository,
  FilterOptions,
  PaginationOptions,
  RepositoryResult,
  RepositoryOptions,
} from "./base-repository"
import { transportOptions } from "../validations/service-request"

// Type definitions for service request operations

/**
 * ServiceRequest with user relation using Prisma.ServiceRequestGetPayload
 * 
 * This type uses Prisma-generated types to ensure type safety for the user relation.
 * The payload type automatically reflects the exact structure returned by queries
 * with the user relation included.
 * 
 * @example
 * ```typescript
 * const request: ServiceRequestWithUser = await repo.findManyWithRoleAccess(...)
 * // TypeScript knows the exact shape of the nested user object
 * console.log(request.user.name) // Type-safe access to user.name
 * ```
 */
export type ServiceRequestWithUser = Prisma.ServiceRequestGetPayload<{
  select: {
    id: true
    title: true
    status: true
    equipmentCategory: true
    jobSite: true
    startDate: true
    endDate: true
    requestedDurationType: true
    requestedDurationValue: true
    estimatedCost: true
    createdAt: true
    updatedAt: true
    user: {
      select: {
        name: true
        email: true
        company: true
      }
    }
  }
}>

/**
 * ServiceRequest with full relations using Prisma.ServiceRequestGetPayload
 * 
 * This type represents a service request with all related data included:
 * - user: The user who created the request
 * - userAssignments: Operator assignments with operator details
 * - statusHistory: Complete status change history with user who made changes
 * 
 * Using Prisma.ServiceRequestGetPayload ensures compile-time type safety for
 * deeply nested relations and automatic updates when the schema changes.
 * 
 * @example
 * ```typescript
 * const request: ServiceRequestWithRelations = await repo.findById("sr123")
 * // TypeScript knows all nested relation shapes
 * request.userAssignments.forEach(assignment => {
 *   console.log(assignment.operator.name) // Type-safe nested access
 * })
 * ```
 */
export type ServiceRequestWithRelations = Prisma.ServiceRequestGetPayload<{
  include: {
    user: {
      select: {
        name: true
        email: true
        company: true
      }
    }
    userAssignments: {
      include: {
        operator: {
          select: {
            id: true
            name: true
            email: true
          }
        }
      }
    }
    statusHistory: {
      include: {
        changedByUser: {
          select: {
            name: true
            email: true
          }
        }
      }
      orderBy: {
        createdAt: "desc"
      }
    }
  }
}>

export interface ServiceRequestCreateInput extends Record<string, unknown> {
  title: string
  description?: string
  contactName: string
  contactEmail: string
  contactPhone: string
  company?: string
  jobSite: string
  transport: string
  startDate: Date
  endDate?: Date
  equipmentCategory: string
  equipmentDetail: string
  requestedDurationType: string
  requestedDurationValue: number
  requestedTotalHours: number
  rateType: string
  baseRate: number
  userId: string
}

export interface ServiceRequestUpdateInput {
  title?: string
  description?: string
  status?: ServiceRequestStatus
  priority?: string
  estimatedCost?: number
  assignedManagerId?: string
  rejectionReason?: string
  internalNotes?: string
}

export interface ServiceRequestFilters {
  userId?: string
  status?: ServiceRequestStatus
  assignedManagerId?: string
  equipmentCategory?: string
  startDateFrom?: Date
  startDateTo?: Date
  priority?: string
}

export interface RoleBasedAccessOptions extends Record<string, unknown> {
  userId: string
  userRole: UserRole
}

/**
 * Service Request Repository Implementation
 */
export class ServiceRequestRepository
  extends BaseRepository
  implements
    CrudRepository<
      ServiceRequest,
      ServiceRequestCreateInput,
      ServiceRequestUpdateInput
    >
{
  constructor(db: PrismaClient, options?: RepositoryOptions) {
    super(db, "ServiceRequestRepository", options)
  }

  /**
   * Find service request by ID with all relations
   * 
   * Returns a ServiceRequestWithRelations type that includes:
   * - Full service request details
   * - User information (name, email, company)
   * - User assignments with operator details
   * - Status history with user who made changes
   * 
   * Uses Prisma.ServiceRequestGetPayload for compile-time type safety.
   */
  async findById(
    id: string
  ): Promise<RepositoryResult<ServiceRequestWithRelations | null>> {
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
        this.db.serviceRequest.findUnique({
          where: { id },
          include: {
            user: {
              select: {
                name: true,
                email: true,
                company: true,
              },
            },
            userAssignments: {
              include: {
                operator: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            statusHistory: {
              include: {
                changedByUser: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        }),
      "SERVICE_REQUEST_FIND_ERROR",
      "Failed to find service request",
      `findById(${id})`
    )
  }

  /**
   * Find service requests with role-based access control
   */
  async findManyWithRoleAccess(
    accessOptions: RoleBasedAccessOptions,
    filters?: ServiceRequestFilters,
    pagination?: PaginationOptions
  ): Promise<RepositoryResult<ServiceRequestWithUser[]>> {
    const validation = this.validateRequired(
      accessOptions,
      ["userId", "userRole"]
    )
    if (!validation.success) {
      const errorMessage =
        typeof validation.error === "string"
          ? validation.error
          : validation.error?.message || "Validation failed"
      return this.createError("VALIDATION_ERROR", errorMessage)
    }

    return this.handleAsync(
      async () => {
        const baseQuery = this.buildRoleBasedQuery(accessOptions)
        const whereClause = this.buildWhereClause(baseQuery.where, filters)

        const query = {
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
          orderBy: {
            createdAt: "desc" as const,
          },
        }

        // Apply pagination if provided
        if (pagination) {
          return this.db.serviceRequest.findMany(
            this.applyPagination(query, pagination)
          )
        }

        return this.db.serviceRequest.findMany(query)
      },
      "SERVICE_REQUEST_FIND_MANY_ERROR",
      "Failed to find service requests",
      `findManyWithRoleAccess(${accessOptions.userRole})`
    ) as Promise<RepositoryResult<ServiceRequestWithUser[]>>
  }

  /**
   * Standard findMany implementation
   */
  async findMany(
    filters?: FilterOptions,
    pagination?: PaginationOptions
  ): Promise<RepositoryResult<ServiceRequest[]>> {
    return this.handleAsync(
      () => {
        let query = {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                company: true,
              },
            },
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

        return this.db.serviceRequest.findMany(query)
      },
      "SERVICE_REQUEST_FIND_MANY_ERROR",
      "Failed to find service requests",
      "findMany"
    )
  }

  /**
   * Create new service request
   */
  async create(
    data: ServiceRequestCreateInput
  ): Promise<RepositoryResult<ServiceRequest>> {
    const validation = this.validateRequired(
      data,
      [
        "title",
        "contactName",
        "contactEmail",
        "contactPhone",
        "jobSite",
        "equipmentCategory",
        "equipmentDetail",
        "userId",
      ]
    )
    if (!validation.success) {
      const errorMessage =
        typeof validation.error === "string"
          ? validation.error
          : validation.error?.message || "Validation failed"
      return this.createError("VALIDATION_ERROR", errorMessage)
    }

    // Validate transport option
    if (!this.validateTransportOption(data.transport)) {
      return this.createError(
        "VALIDATION_ERROR",
        `Invalid transport option: ${data.transport}. Must be one of: ${transportOptions.join(", ")}`
      )
    }

    return this.handleAsync(
      () =>
        this.db.serviceRequest.create({
          data: {
            ...data,
            status: "SUBMITTED" as const,
            transport: data.transport as TransportOption,
            equipmentCategory: data.equipmentCategory as EquipmentCategory,
            requestedDurationType: data.requestedDurationType as DurationType,
            rateType: data.rateType as RateType,
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
                company: true,
              },
            },
          },
        }),
      "SERVICE_REQUEST_CREATE_ERROR",
      "Failed to create service request",
      "create"
    )
  }

  /**
   * Update service request
   */
  async update(
    id: string,
    data: ServiceRequestUpdateInput
  ): Promise<RepositoryResult<ServiceRequest>> {
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
        this.db.serviceRequest.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date(),
          },
        }),
      "SERVICE_REQUEST_UPDATE_ERROR",
      "Failed to update service request",
      `update(${id})`
    )
  }

  /**
   * Delete service request
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
        await this.db.serviceRequest.delete({
          where: { id },
        })
        return true
      },
      "SERVICE_REQUEST_DELETE_ERROR",
      "Failed to delete service request",
      `delete(${id})`
    )
  }

  /**
   * Count service requests with optional filters
   */
  async count(filters?: FilterOptions): Promise<RepositoryResult<number>> {
    return this.handleAsync(
      () => {
        let query = {}

        if (filters) {
          query = this.applyFilters(query, filters)
        }

        return this.db.serviceRequest.count(query)
      },
      "SERVICE_REQUEST_COUNT_ERROR",
      "Failed to count service requests",
      "count"
    )
  }

  /**
   * Update service request status with history tracking
   */
  async updateStatus(
    id: string,
    newStatus: ServiceRequestStatus,
    changedBy: string,
    reason?: string,
    notes?: string
  ): Promise<RepositoryResult<ServiceRequest>> {
    const validation = this.validateRequired({ id, newStatus, changedBy }, [
      "id",
      "newStatus",
      "changedBy",
    ])
    if (!validation.success) {
      const errorMessage =
        typeof validation.error === "string"
          ? validation.error
          : validation.error?.message || "Validation failed"
      return this.createError("VALIDATION_ERROR", errorMessage)
    }

    return this.handleAsync(
      async () => {
        // Get current status
        const current = await this.db.serviceRequest.findUnique({
          where: { id },
          select: { status: true },
        })

        if (!current) {
          throw new Error(`Service request with ID ${id} not found`)
        }

        // Update status and create history record in transaction
        return this.db.$transaction(async (tx) => {
          // Update the service request
          const updated = await tx.serviceRequest.update({
            where: { id },
            data: {
              status: newStatus,
              updatedAt: new Date(),
            },
          })

          // Create status history record
          await tx.serviceRequestStatusHistory.create({
            data: {
              serviceRequestId: id,
              fromStatus: current.status,
              toStatus: newStatus,
              changedBy,
              reason: reason || null,
              notes: notes || null,
            },
          })

          return updated
        })
      },
      "SERVICE_REQUEST_STATUS_UPDATE_ERROR",
      "Failed to update service request status",
      `updateStatus(${id}, ${newStatus})`
    )
  }

  /**
   * Build role-based query conditions
   */
  private buildRoleBasedQuery(accessOptions: RoleBasedAccessOptions) {
    const { userId, userRole } = accessOptions

    switch (userRole) {
      case "ADMIN":
      case "MANAGER":
        // Managers and Admins can see all requests
        return { where: {} }

      case "OPERATOR":
        // Operators can see requests they're assigned to + their own requests
        return {
          where: {
            OR: [
              { userId }, // Their own requests
              {
                userAssignments: {
                  some: {
                    operatorId: userId,
                  },
                },
              }, // Requests they're assigned to
            ],
          },
        }

      case "USER":
      default:
        // Regular users can only see their own requests
        return {
          where: {
            userId,
          },
        }
    }
  }

  /**
   * Validate transport option value
   */
  private validateTransportOption(transport: string): transport is TransportOption {
    return transportOptions.includes(transport as TransportOption)
  }

  /**
   * Build where clause with additional filters
   */
  private buildWhereClause(
    baseWhere: Record<string, unknown>,
    filters?: ServiceRequestFilters
  ) {
    if (!filters) {
      return baseWhere
    }

    const additionalFilters: Record<string, unknown> = {}

    if (filters.status) {
      additionalFilters.status = filters.status
    }

    if (filters.assignedManagerId) {
      additionalFilters.assignedManagerId = filters.assignedManagerId
    }

    if (filters.equipmentCategory) {
      additionalFilters.equipmentCategory = filters.equipmentCategory
    }

    if (filters.priority) {
      additionalFilters.priority = filters.priority
    }

    if (filters.startDateFrom || filters.startDateTo) {
      const dateFilter: { gte?: Date; lte?: Date } = {}
      if (filters.startDateFrom) {
        dateFilter.gte = filters.startDateFrom
      }
      if (filters.startDateTo) {
        dateFilter.lte = filters.startDateTo
      }
      additionalFilters.startDate = dateFilter
    }

    // Combine base where with additional filters
    if (Object.keys(additionalFilters).length === 0) {
      return baseWhere
    }

    if (baseWhere.OR) {
      // If base query has OR conditions, wrap everything properly
      return {
        AND: [baseWhere, additionalFilters],
      }
    }

    return {
      ...baseWhere,
      ...additionalFilters,
    }
  }
}
