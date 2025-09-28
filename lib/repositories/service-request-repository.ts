/**
 * Service Request Repository
 * 
 * Handles all data operations for service requests with role-based access control.
 * Abstracts Prisma operations behind a mobile-compatible interface.
 */

import { PrismaClient } from "@prisma/client"
import type { ServiceRequest, ServiceRequestStatus, UserRole } from "@prisma/client"
import { 
  BaseRepository, 
  CrudRepository, 
  FilterOptions, 
  PaginationOptions, 
  RepositoryResult,
  RepositoryOptions 
} from "./base-repository"

// Type definitions for service request operations
export interface ServiceRequestWithUser extends ServiceRequest {
  user: {
    name: string | null;
    email: string | null;
    company: string | null;
  };
}

export interface ServiceRequestCreateInput {
  title: string;
  description?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  company?: string;
  jobSite: string;
  transport: string;
  startDate: Date;
  endDate?: Date;
  equipmentCategory: string;
  equipmentDetail: string;
  requestedDurationType: string;
  requestedDurationValue: number;
  requestedTotalHours: number;
  rateType: string;
  baseRate: number;
  userId: string;
}

export interface ServiceRequestUpdateInput {
  title?: string;
  description?: string;
  status?: ServiceRequestStatus;
  priority?: string;
  estimatedCost?: number;
  assignedManagerId?: string;
  rejectionReason?: string;
  internalNotes?: string;
}

export interface ServiceRequestFilters {
  userId?: string;
  status?: ServiceRequestStatus;
  assignedManagerId?: string;
  equipmentCategory?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  priority?: string;
}

export interface RoleBasedAccessOptions {
  userId: string;
  userRole: UserRole;
}

/**
 * Service Request Repository Implementation
 */
export class ServiceRequestRepository extends BaseRepository implements CrudRepository<ServiceRequest, ServiceRequestCreateInput, ServiceRequestUpdateInput> {
  
  constructor(db: PrismaClient, options?: RepositoryOptions) {
    super(db, "ServiceRequestRepository", options);
  }

  /**
   * Find service request by ID
   */
  async findById(id: string): Promise<RepositoryResult<ServiceRequest | null>> {
    const validation = this.validateRequired({ id }, ["id"]);
    if (!validation.success) {
      const errorMessage = typeof validation.error === 'string' 
        ? validation.error 
        : validation.error?.message || 'Validation failed';
      return this.createError('VALIDATION_ERROR', errorMessage);
    }

    return this.handleAsync(
      () => this.db.serviceRequest.findUnique({
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
    );
  }

  /**
   * Find service requests with role-based access control
   */
  async findManyWithRoleAccess(
    accessOptions: RoleBasedAccessOptions,
    filters?: ServiceRequestFilters,
    pagination?: PaginationOptions
  ): Promise<RepositoryResult<ServiceRequestWithUser[]>> {
    const validation = this.validateRequired(accessOptions as unknown as Record<string, unknown>, ["userId", "userRole"]);
    if (!validation.success) {
      const errorMessage = typeof validation.error === 'string' 
        ? validation.error 
        : validation.error?.message || 'Validation failed';
      return this.createError('VALIDATION_ERROR', errorMessage);
    }

    return this.handleAsync(
      async () => {
        const baseQuery = this.buildRoleBasedQuery(accessOptions);
        const whereClause = this.buildWhereClause(baseQuery.where, filters);
        
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
        };

        // Apply pagination if provided
        if (pagination) {
          return this.db.serviceRequest.findMany(
            this.applyPagination(query, pagination)
          );
        }

        return this.db.serviceRequest.findMany(query);
      },
      "SERVICE_REQUEST_FIND_MANY_ERROR",
      "Failed to find service requests",
      `findManyWithRoleAccess(${accessOptions.userRole})`
    ) as Promise<RepositoryResult<ServiceRequestWithUser[]>>;
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
        let query: any = {
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
            createdAt: "desc",
          },
        };

        if (filters) {
          query = this.applyFilters(query, filters);
        }

        if (pagination) {
          query = this.applyPagination(query, pagination);
        }

        return this.db.serviceRequest.findMany(query);
      },
      "SERVICE_REQUEST_FIND_MANY_ERROR",
      "Failed to find service requests",
      "findMany"
    );
  }

  /**
   * Create new service request
   */
  async create(data: ServiceRequestCreateInput): Promise<RepositoryResult<ServiceRequest>> {
    const validation = this.validateRequired(data as unknown as Record<string, unknown>, [
      "title", "contactName", "contactEmail", "contactPhone", 
      "jobSite", "equipmentCategory", "equipmentDetail", "userId"
    ]);
    if (!validation.success) {
      const errorMessage = typeof validation.error === 'string' 
        ? validation.error 
        : validation.error?.message || 'Validation failed';
      return this.createError('VALIDATION_ERROR', errorMessage);
    }

    return this.handleAsync(
      () => this.db.serviceRequest.create({
        data: {
          ...data,
          status: "SUBMITTED" as const,
        } as any,
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
        },
      }),
      "SERVICE_REQUEST_CREATE_ERROR",
      "Failed to create service request",
      "create"
    );
  }

  /**
   * Update service request
   */
  async update(id: string, data: ServiceRequestUpdateInput): Promise<RepositoryResult<ServiceRequest>> {
    const validation = this.validateRequired({ id }, ["id"]);
    if (!validation.success) {
      const errorMessage = typeof validation.error === 'string' 
        ? validation.error 
        : validation.error?.message || 'Validation failed';
      return this.createError('VALIDATION_ERROR', errorMessage);
    }

    return this.handleAsync(
      () => this.db.serviceRequest.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      }),
      "SERVICE_REQUEST_UPDATE_ERROR",
      "Failed to update service request",
      `update(${id})`
    );
  }

  /**
   * Delete service request
   */
  async delete(id: string): Promise<RepositoryResult<boolean>> {
    const validation = this.validateRequired({ id }, ["id"]);
    if (!validation.success) {
      const errorMessage = typeof validation.error === 'string' 
        ? validation.error 
        : validation.error?.message || 'Validation failed';
      return this.createError('VALIDATION_ERROR', errorMessage);
    }

    return this.handleAsync(
      async () => {
        await this.db.serviceRequest.delete({
          where: { id },
        });
        return true;
      },
      "SERVICE_REQUEST_DELETE_ERROR",
      "Failed to delete service request",
      `delete(${id})`
    );
  }

  /**
   * Count service requests with optional filters
   */
  async count(filters?: FilterOptions): Promise<RepositoryResult<number>> {
    return this.handleAsync(
      () => {
        let query: any = {};
        
        if (filters) {
          query = this.applyFilters(query, filters);
        }

        return this.db.serviceRequest.count(query);
      },
      "SERVICE_REQUEST_COUNT_ERROR",
      "Failed to count service requests",
      "count"
    );
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
    const validation = this.validateRequired({ id, newStatus, changedBy }, ["id", "newStatus", "changedBy"]);
    if (!validation.success) {
      const errorMessage = typeof validation.error === 'string' 
        ? validation.error 
        : validation.error?.message || 'Validation failed';
      return this.createError('VALIDATION_ERROR', errorMessage);
    }

    return this.handleAsync(
      async () => {
        // Get current status
        const current = await this.db.serviceRequest.findUnique({
          where: { id },
          select: { status: true },
        });

        if (!current) {
          throw new Error(`Service request with ID ${id} not found`);
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
          });

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
          });

          return updated;
        });
      },
      "SERVICE_REQUEST_STATUS_UPDATE_ERROR",
      "Failed to update service request status",
      `updateStatus(${id}, ${newStatus})`
    );
  }

  /**
   * Build role-based query conditions
   */
  private buildRoleBasedQuery(accessOptions: RoleBasedAccessOptions) {
    const { userId, userRole } = accessOptions;

    switch (userRole) {
      case "ADMIN":
      case "MANAGER":
        // Managers and Admins can see all requests
        return { where: {} };

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
        };

      case "USER":
      default:
        // Regular users can only see their own requests
        return {
          where: {
            userId,
          },
        };
    }
  }

  /**
   * Build where clause with additional filters
   */
  private buildWhereClause(baseWhere: Record<string, unknown>, filters?: ServiceRequestFilters) {
    if (!filters) {
      return baseWhere;
    }

    const additionalFilters: any = {};

    if (filters.status) {
      additionalFilters.status = filters.status;
    }

    if (filters.assignedManagerId) {
      additionalFilters.assignedManagerId = filters.assignedManagerId;
    }

    if (filters.equipmentCategory) {
      additionalFilters.equipmentCategory = filters.equipmentCategory;
    }

    if (filters.priority) {
      additionalFilters.priority = filters.priority;
    }

    if (filters.startDateFrom || filters.startDateTo) {
      additionalFilters.startDate = {};
      if (filters.startDateFrom) {
        additionalFilters.startDate.gte = filters.startDateFrom;
      }
      if (filters.startDateTo) {
        additionalFilters.startDate.lte = filters.startDateTo;
      }
    }

    // Combine base where with additional filters
    if (Object.keys(additionalFilters).length === 0) {
      return baseWhere;
    }

    if (baseWhere.OR) {
      // If base query has OR conditions, wrap everything properly
      return {
        AND: [
          baseWhere,
          additionalFilters,
        ],
      };
    }

    return {
      ...baseWhere,
      ...additionalFilters,
    };
  }
}
