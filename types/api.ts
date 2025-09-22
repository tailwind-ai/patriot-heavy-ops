import { Prisma } from '@prisma/client'

// =============================================================================
// GENERIC API RESPONSE TYPES
// =============================================================================

/**
 * Standard API response wrapper for all endpoints
 */
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

/**
 * API error response structure
 */
export interface ApiError {
  error: string
  message?: string
  success: false
  issues?: Array<{
    code: string
    message: string
    path: (string | number)[]
  }>
}

/**
 * Paginated API response
 */
export interface PaginatedApiResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// =============================================================================
// USER TYPES
// =============================================================================

/**
 * User response for API endpoints
 */
export interface UserResponse {
  id: string
  name: string | null
  email: string | null
  role: 'USER' | 'OPERATOR' | 'MANAGER' | 'ADMIN'
  phone?: string | null
  company?: string | null
  image?: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Operator-specific user response
 */
export interface OperatorResponse extends UserResponse {
  militaryBranch?: string | null
  yearsOfService?: number | null
  certifications: string[]
  preferredLocations: string[]
  isAvailable: boolean
}

/**
 * User with subscription information
 */
export interface UserWithSubscriptionResponse extends UserResponse {
  subscription: {
    isPro: boolean
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    stripeCurrentPeriodEnd?: string | null
  }
}

// =============================================================================
// POST TYPES
// =============================================================================

/**
 * Post list item response
 */
export interface PostListResponse {
  id: string
  title: string
  published: boolean
  createdAt: string
}

/**
 * Full post response
 */
export interface PostResponse {
  id: string
  title: string
  content: unknown | null
  published: boolean
  createdAt: string
  updatedAt: string
  authorId: string
  author?: UserResponse
}

/**
 * Post creation response
 */
export interface PostCreateResponse {
  id: string
}

// =============================================================================
// SERVICE REQUEST TYPES
// =============================================================================

/**
 * Service request list item response
 */
export interface ServiceRequestListResponse {
  id: string
  title: string
  status: ServiceRequestStatus
  equipmentCategory: EquipmentCategory
  jobSite: string
  startDate: string
  endDate: string | null
  requestedDurationType: DurationType
  requestedDurationValue: number
  estimatedCost: string | null
  createdAt: string
  updatedAt: string
  user?: {
    name: string | null
    email: string | null
    company: string | null
  }
}

/**
 * Full service request response
 */
export interface ServiceRequestResponse {
  id: string
  title: string
  description: string | null
  
  // Contact & Company Info
  contactName: string
  contactEmail: string
  contactPhone: string
  company: string | null
  
  // Job Details
  jobSite: string
  transport: TransportOption
  startDate: string
  endDate: string | null
  
  // Equipment Requirements
  equipmentCategory: EquipmentCategory
  equipmentDetail: string
  
  // Duration & Pricing
  requestedDurationType: DurationType
  requestedDurationValue: number
  requestedTotalHours: string
  rateType: RateType
  baseRate: string
  
  // Workflow Status
  status: ServiceRequestStatus
  priority: string
  
  // Financial Tracking
  estimatedCost: string | null
  depositAmount: string | null
  depositPaid: boolean
  depositPaidAt: string | null
  finalAmount: string | null
  finalPaid: boolean
  finalPaidAt: string | null
  
  // Management Fields
  assignedManagerId: string | null
  rejectionReason: string | null
  internalNotes: string | null
  
  // Timestamps
  createdAt: string
  updatedAt: string
  
  // Relations
  user: UserResponse
  assignedManager?: UserResponse | null
  userAssignments: UserAssignmentResponse[]
}

/**
 * Service request creation response
 */
export interface ServiceRequestCreateResponse {
  id: string
  title: string
  status: ServiceRequestStatus
  createdAt: string
}

/**
 * Service request update response
 */
export interface ServiceRequestUpdateResponse {
  id: string
  title: string
  status: ServiceRequestStatus
  updatedAt: string
}

// =============================================================================
// USER ASSIGNMENT TYPES
// =============================================================================

/**
 * User assignment response
 */
export interface UserAssignmentResponse {
  id: string
  serviceRequestId: string
  operatorId: string
  status: string
  rate: string | null
  estimatedHours: string | null
  actualHours: string | null
  assignedAt: string
  acceptedAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
  operator: UserResponse
}

// =============================================================================
// STRIPE/BILLING TYPES
// =============================================================================

/**
 * Stripe session response
 */
export interface StripeSessionResponse {
  url: string
}

// =============================================================================
// ENUMS (matching Prisma schema)
// =============================================================================

export type UserRole = 'USER' | 'OPERATOR' | 'MANAGER' | 'ADMIN'

export type TransportOption = 'WE_HANDLE_IT' | 'YOU_HANDLE_IT'

export type EquipmentCategory = 
  | 'SKID_STEERS_TRACK_LOADERS'
  | 'FRONT_END_LOADERS'
  | 'BACKHOES_EXCAVATORS'
  | 'BULLDOZERS'
  | 'GRADERS'
  | 'DUMP_TRUCKS'
  | 'WATER_TRUCKS'
  | 'SWEEPERS'
  | 'TRENCHERS'

export type ServiceRequestStatus = 
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'OPERATOR_MATCHING'
  | 'OPERATOR_ASSIGNED'
  | 'EQUIPMENT_CHECKING'
  | 'EQUIPMENT_CONFIRMED'
  | 'DEPOSIT_REQUESTED'
  | 'DEPOSIT_PENDING'
  | 'DEPOSIT_RECEIVED'
  | 'JOB_SCHEDULED'
  | 'JOB_IN_PROGRESS'
  | 'JOB_COMPLETED'
  | 'INVOICED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_RECEIVED'
  | 'CLOSED'
  | 'CANCELLED'

export type DurationType = 
  | 'HALF_DAY'    // 4 hours
  | 'FULL_DAY'    // 8 hours  
  | 'MULTI_DAY'   // Multiple days
  | 'WEEKLY'      // Weekly booking

export type RateType = 
  | 'HOURLY'
  | 'HALF_DAY'
  | 'DAILY'
  | 'WEEKLY'

// =============================================================================
// PRISMA UTILITY TYPES
// =============================================================================

/**
 * User with role information
 */
export type UserWithRole = Prisma.UserGetPayload<{
  select: {
    id: true
    name: true
    email: true
    role: true
    phone: true
    company: true
    image: true
    createdAt: true
    updatedAt: true
  }
}>

/**
 * Service request with user information
 */
export type ServiceRequestWithUser = Prisma.ServiceRequestGetPayload<{
  include: {
    user: {
      select: {
        id: true
        name: true
        email: true
        company: true
      }
    }
  }
}>

/**
 * Service request with full relations
 */
export type ServiceRequestWithRelations = Prisma.ServiceRequestGetPayload<{
  include: {
    user: {
      select: {
        id: true
        name: true
        email: true
      }
    }
    assignedManager: {
      select: {
        id: true
        name: true
        email: true
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
  }
}>

/**
 * Post with author information
 */
export type PostWithAuthor = Prisma.PostGetPayload<{
  include: {
    author: {
      select: {
        id: true
        name: true
        email: true
      }
    }
  }
}>

// =============================================================================
// FORM DATA TYPES
// =============================================================================

/**
 * Service request form data
 */
export interface ServiceRequestFormData {
  title: string
  description?: string
  contactName: string
  contactEmail: string
  contactPhone: string
  company?: string
  jobSite: string
  transport: TransportOption
  startDate: string
  endDate?: string
  equipmentCategory: EquipmentCategory
  equipmentDetail: string
  requestedDurationType: DurationType
  requestedDurationValue: number
  rateType: RateType
  baseRate: number
}

/**
 * User update form data
 */
export interface UserUpdateFormData {
  name?: string
  email?: string
  phone?: string
  company?: string
}

/**
 * Operator application form data
 */
export interface OperatorApplicationFormData {
  militaryBranch: string
  yearsOfService: number
  certifications: string[]
  preferredLocations: string[]
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Extract the data type from an ApiResponse
 */
export type ExtractApiData<T> = T extends ApiResponse<infer U> ? U : never

/**
 * Make all properties optional except specified ones
 */
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>

/**
 * Convert Date fields to string for API responses
 */
export type DateToString<T> = {
  [K in keyof T]: T[K] extends Date | null ? string | null :
                  T[K] extends Date | undefined ? string | undefined :
                  T[K] extends Date ? string :
                  T[K]
}
