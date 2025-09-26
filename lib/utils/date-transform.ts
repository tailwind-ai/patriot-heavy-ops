/**
 * Date Transformation Utilities
 * 
 * Utilities for transforming date strings to Date objects in API responses.
 * Extracted to avoid code duplication and ensure consistency across the application.
 */

// Input interfaces (from API responses with string dates)
interface ServiceRequestInput {
  id: string
  title: string
  status: string
  equipmentCategory: string
  jobSite: string
  startDate: string
  endDate: string | null
  requestedDurationType: string
  requestedDurationValue: number
  requestedTotalHours: number
  estimatedCost: number
  createdAt: string
  updatedAt: string
  [key: string]: any
}

interface AssignmentInput {
  id: string
  serviceRequestId: string
  operatorId: string
  assignedAt: string
  status: string
  serviceRequest: ServiceRequestInput
  [key: string]: any
}

interface UserInput {
  id: string
  name: string | null
  email: string
  role: string
  company: string | null
  createdAt: string
  [key: string]: any
}

interface DashboardDataInput {
  stats: {
    totalRequests: number
    activeRequests: number
    completedRequests: number
    pendingApproval: number
  }
  recentRequests?: ServiceRequestInput[]
  assignments?: AssignmentInput[]
  users?: UserInput[]
}

// Output interfaces (with Date objects)
interface ServiceRequestOutput {
  id: string
  title: string
  status: string
  equipmentCategory: string
  jobSite: string
  startDate: Date
  endDate: Date | null
  requestedDurationType: string
  requestedDurationValue: number
  requestedTotalHours: number
  estimatedCost: number
  createdAt: Date
  updatedAt: Date
  [key: string]: any
}

interface AssignmentOutput {
  id: string
  serviceRequestId: string
  operatorId: string
  assignedAt: Date
  status: string
  serviceRequest: ServiceRequestOutput
  [key: string]: any
}

interface UserOutput {
  id: string
  name: string | null
  email: string
  role: string
  company: string | null
  createdAt: Date
  [key: string]: any
}

interface DashboardDataOutput {
  stats: {
    totalRequests: number
    activeRequests: number
    completedRequests: number
    pendingApproval: number
  }
  recentRequests: ServiceRequestOutput[]
  assignments: AssignmentOutput[]
  users: UserOutput[]
}

/**
 * Transform a service request object by converting date strings to Date objects
 */
export function transformServiceRequest(request: ServiceRequestInput): ServiceRequestOutput {
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
export function transformAssignment(assignment: AssignmentInput): AssignmentOutput {
  return {
    ...assignment,
    assignedAt: new Date(assignment.assignedAt),
    serviceRequest: transformServiceRequest(assignment.serviceRequest),
  }
}

/**
 * Transform a user object by converting date strings to Date objects
 */
export function transformUser(user: UserInput): UserOutput {
  return {
    ...user,
    createdAt: new Date(user.createdAt),
  }
}

/**
 * Transform dashboard data by converting all date strings to Date objects
 */
export function transformDashboardData(result: { data: DashboardDataInput }): DashboardDataOutput {
  return {
    ...result.data,
    recentRequests: result.data.recentRequests?.map(transformServiceRequest) || [],
    assignments: result.data.assignments?.map(transformAssignment) || [],
    users: result.data.users?.map(transformUser) || [],
  }
}
