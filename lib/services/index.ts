/**
 * Service Layer Exports
 *
 * Central export point for all platform-agnostic services.
 * This module provides the foundation for both web and mobile applications.
 */

// Base service infrastructure
export {
  BaseService,
  ConsoleLogger,
  type ServiceError,
  type ServiceResult,
  type ServiceLogger,
} from "./base-service"

// Authentication service
import { AuthService } from "./auth-service"
export {
  AuthService,
  type AuthUser,
  type LoginCredentials,
  type RegisterData,
  type AuthToken,
  type SessionData,
} from "./auth-service"

// Geocoding service
import { GeocodingService } from "./geocoding-service"
export {
  GeocodingService,
  NominatimProvider,
  MobileLocationProvider,
  type GeocodingCoordinates,
  type GeocodingAddress,
  type GeocodingSearchOptions,
  type GeocodingProvider,
  type GeocodingCacheEntry,
} from "./geocoding-service"

// Service Request business logic service
import { ServiceRequestService } from "./service-request-service"
export {
  ServiceRequestService,
  type DurationType,
  type RateType,
  type EquipmentCategory,
  type TransportOption,
  type ServiceRequestCalculationInput,
  type ServiceRequestCalculationResult,
  type StatusTransition,
  type StatusTransitionWithPermissions,
  type BusinessRuleValidation,
  type StatusHistoryEntry,
  type UserRole,
  type ChangeStatusInput,
  type AssignOperatorInput,
} from "./service-request-service"

// Dashboard data service
import { DashboardService } from "./dashboard-service"
export {
  DashboardService,
  type DashboardUser,
  type DashboardServiceRequest,
  type DashboardStats,
  type OperatorAssignment,
  type DashboardDataOptions,
  type CacheOptions,
} from "./dashboard-service"

// Admin management service
import { AdminService } from "./admin-service"
export {
  AdminService,
  type AdminUserCreateInput,
  type AdminUserUpdateInput,
  type SystemMetrics,
  type UserMetrics,
  type AdminActionType,
} from "./admin-service"

// Payment processing service
import { PaymentService } from "./payment-service"
export {
  PaymentService,
  type PaymentIntentResult,
  type CreateDepositPaymentInput,
  type CreateFinalPaymentInput,
  type ConfirmPaymentInput,
  type RefundPaymentInput,
  type PaymentHistoryEntry,
} from "./payment-service"

// Service factory for dependency injection
export class ServiceFactory {
  private static authService: AuthService | null = null
  private static geocodingService: GeocodingService | null = null
  private static serviceRequestService: ServiceRequestService | null = null
  private static dashboardService: DashboardService | null = null
  private static adminService: AdminService | null = null
  private static paymentService: PaymentService | null = null
  private static adminServicePromise: Promise<AdminService> | null = null

  /**
   * Get singleton instance of AuthService
   */
  static getAuthService(): AuthService {
    if (!this.authService) {
      this.authService = new AuthService()
    }
    return this.authService
  }

  /**
   * Get singleton instance of GeocodingService
   */
  static getGeocodingService(): GeocodingService {
    if (!this.geocodingService) {
      this.geocodingService = new GeocodingService()
    }
    return this.geocodingService
  }

  /**
   * Get singleton instance of ServiceRequestService
   */
  static getServiceRequestService(): ServiceRequestService {
    if (!this.serviceRequestService) {
      this.serviceRequestService = new ServiceRequestService()
    }
    return this.serviceRequestService
  }

  /**
   * Get singleton instance of DashboardService
   */
  static getDashboardService(): DashboardService {
    if (!this.dashboardService) {
      this.dashboardService = new DashboardService()
    }
    return this.dashboardService
  }

  /**
   * Get singleton instance of AdminService
   * Note: AdminService requires UserRepository and DashboardService
   * Uses Promise-based lock to prevent race conditions in concurrent calls
   */
  static async getAdminService(): Promise<AdminService> {
    // Return existing instance if available
    if (this.adminService) {
      return this.adminService
    }

    // If initialization is in progress, wait for it
    if (this.adminServicePromise) {
      return this.adminServicePromise
    }

    // Start new initialization with race condition protection
    this.adminServicePromise = (async () => {
      const { RepositoryFactory } = await import("@/lib/repositories")
      const userRepository = RepositoryFactory.getUserRepository()
      const dashboardService = this.getDashboardService()
      this.adminService = new AdminService(userRepository, dashboardService)
      this.adminServicePromise = null // Clear promise after completion
      return this.adminService
    })()

    return this.adminServicePromise
  }

  /**
   * Get singleton instance of PaymentService
   * Note: PaymentService requires Stripe SDK, PaymentRepository, and ServiceRequestService
   * Uses dynamic import for Stripe to avoid circular dependencies
   */
  static getPaymentService(): PaymentService {
    if (!this.paymentService) {
      // Dynamic import to avoid circular dependencies
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { stripe } = require("@/lib/stripe")
      const paymentRepository = RepositoryFactory.getPaymentRepository()
      const serviceRequestService = this.getServiceRequestService()
      this.paymentService = new PaymentService(
        stripe,
        paymentRepository,
        serviceRequestService
      )
    }
    return this.paymentService
  }

  /**
   * Reset all service instances (useful for testing)
   */
  static reset(): void {
    this.authService = null
    this.geocodingService = null
    this.serviceRequestService = null
    this.dashboardService = null
    this.adminService = null
    this.paymentService = null
    this.adminServicePromise = null
  }
}
