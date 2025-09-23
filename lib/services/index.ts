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
} from './base-service';

// Authentication service
export {
  AuthService,
  type AuthUser,
  type LoginCredentials,
  type RegisterData,
  type AuthToken,
  type SessionData,
} from './auth-service';

// Import for factory
import { AuthService } from './auth-service';

// Service factory for dependency injection
export class ServiceFactory {
  private static authService: AuthService | null = null;

  /**
   * Get singleton instance of AuthService
   */
  static getAuthService(): AuthService {
    if (!this.authService) {
      this.authService = new AuthService();
    }
    return this.authService;
  }

  /**
   * Reset all service instances (useful for testing)
   */
  static reset(): void {
    this.authService = null;
  }
}
