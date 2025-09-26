/**
 * Date Transformation Utilities
 * 
 * Utilities for transforming date strings to Date objects in API responses.
 * Extracted to avoid code duplication and ensure consistency across the application.
 */

/**
 * Transform a service request object by converting date strings to Date objects
 */
export function transformServiceRequest(request: any) {
  return {
    ...request,
    startDate: new Date(request.startDate),
    endDate: request.endDate ? new Date(request.endDate) : null,
    createdAt: new Date(request.createdAt),
    updatedAt: new Date(request.updatedAt),
  }
}

/**
 * Transform an assignment object by converting date strings to Date objects
 */
export function transformAssignment(assignment: any) {
  return {
    ...assignment,
    assignedAt: new Date(assignment.assignedAt),
    serviceRequest: {
      ...assignment.serviceRequest,
      startDate: new Date(assignment.serviceRequest.startDate),
      endDate: assignment.serviceRequest.endDate 
        ? new Date(assignment.serviceRequest.endDate) 
        : null,
    },
  }
}

/**
 * Transform a user object by converting date strings to Date objects
 */
export function transformUser(user: any) {
  return {
    ...user,
    createdAt: new Date(user.createdAt),
  }
}

/**
 * Transform dashboard data by converting all date strings to Date objects
 */
export function transformDashboardData(result: any) {
  return {
    ...result.data,
    recentRequests: result.data.recentRequests?.map(transformServiceRequest) || [],
    assignments: result.data.assignments?.map(transformAssignment) || [],
    users: result.data.users?.map(transformUser) || [],
  }
}
