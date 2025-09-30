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

// Service factory for dependency injection
export class ServiceFactory {
  private static authService: AuthService | null = null
  private static geocodingService: GeocodingService | null = null
  private static serviceRequestService: ServiceRequestService | null = null
  private static dashboardService: DashboardService | null = null

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
   * Reset all service instances (useful for testing)
   */
  static reset(): void {
    this.authService = null
    this.geocodingService = null
    this.serviceRequestService = null
    this.dashboardService = null
  }
}
