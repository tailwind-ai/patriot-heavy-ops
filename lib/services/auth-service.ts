/**
 * Authentication Service
 *
 * Platform-agnostic authentication service supporting both NextAuth sessions
 * and JWT Bearer tokens for mobile compatibility.
 *
 * Design Principles:
 * - Zero Next.js/React dependencies
 * - Dual authentication support (sessions + JWT)
 * - Mobile SDK compatible
 * - Framework-agnostic implementation
 */

import { BaseService, ServiceResult, ServiceLogger } from "./base-service"
import { hashPassword, verifyPassword } from "../auth-utils"
import { db } from "../db"
import { UserRole } from "@prisma/client"

export interface AuthUser {
  id: string
  email: string
  name: string | null
  image: string | null
  role: UserRole
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name?: string
}

export interface AuthToken {
  token: string
  expiresAt: Date
  user: AuthUser
}

export interface SessionData {
  user: AuthUser
  expires: string
}

/**
 * Authentication service with dual auth support
 */
export class AuthService extends BaseService {
  constructor(logger?: ServiceLogger) {
    super("AuthService", logger)
  }

  /**
   * Authenticate user with email/password
   * Returns user data for both session and token-based auth
   */
  async authenticate(
    credentials: LoginCredentials
  ): Promise<ServiceResult<AuthUser>> {
    this.logOperation("authenticate", { email: credentials.email })

    const validation = this.validateRequired(
      this.toValidationRecord(credentials),
      ["email", "password"]
    )
    if (!validation.success) {
      return this.createError(
        "VALIDATION_ERROR",
        validation.error?.message || "Validation failed"
      )
    }

    return this.handleAsync(
      async () => {
        // Find user by email
        const user = await db.user.findUnique({
          where: {
            email: credentials.email.toLowerCase(),
          },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            password: true,
          },
        })

        if (!user) {
          throw new Error("Invalid credentials")
        }

        if (!user.password) {
          throw new Error("Password not set for user")
        }

        // Verify password
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        )
        if (!isValid) {
          throw new Error("Invalid credentials")
        }

        // Return user without password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...authUser } = user
        return authUser as AuthUser
      },
      "AUTH_FAILED",
      "Authentication failed"
    )
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<ServiceResult<AuthUser>> {
    this.logOperation("register", { email: data.email })

    const validation = this.validateRequired(this.toValidationRecord(data), [
      "email",
      "password",
    ])
    if (!validation.success) {
      return this.createError(
        "VALIDATION_ERROR",
        validation.error?.message || "Validation failed"
      )
    }

    return this.handleAsync(
      async () => {
        // Check if user already exists
        const existingUser = await db.user.findUnique({
          where: {
            email: data.email.toLowerCase(),
          },
        })

        if (existingUser) {
          throw new Error("User already exists")
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password)

        // Create user
        const user = await db.user.create({
          data: {
            email: data.email.toLowerCase(),
            password: hashedPassword,
            name: data.name || null,
            role: UserRole.USER,
          },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
          },
        })

        return user as AuthUser
      },
      "REGISTRATION_FAILED",
      "User registration failed"
    )
  }

  /**
   * Get user by ID
   * Used for token validation and session refresh
   */
  async getUserById(userId: string): Promise<ServiceResult<AuthUser>> {
    this.logOperation("getUserById", { userId })

    const validation = this.validateRequired({ userId }, ["userId"])
    if (!validation.success) {
      return this.createError(
        "VALIDATION_ERROR",
        validation.error?.message || "Validation failed"
      )
    }

    return this.handleAsync(
      async () => {
        const user = await db.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
          },
        })

        if (!user) {
          throw new Error("User not found")
        }

        return user as AuthUser
      },
      "USER_NOT_FOUND",
      "User not found"
    )
  }

  /**
   * Get user by email
   * Used for session-based authentication
   */
  async getUserByEmail(email: string): Promise<ServiceResult<AuthUser>> {
    this.logOperation("getUserByEmail", { email })

    const validation = this.validateRequired({ email }, ["email"])
    if (!validation.success) {
      return this.createError(
        "VALIDATION_ERROR",
        validation.error?.message || "Validation failed"
      )
    }

    return this.handleAsync(
      async () => {
        const user = await db.user.findUnique({
          where: {
            email: email.toLowerCase(),
          },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
          },
        })

        if (!user) {
          throw new Error("User not found")
        }

        return user as AuthUser
      },
      "USER_NOT_FOUND",
      "User not found"
    )
  }

  /**
   * Update user profile
   */
  async updateUser(
    userId: string,
    updates: Partial<Pick<AuthUser, "name" | "image">>
  ): Promise<ServiceResult<AuthUser>> {
    this.logOperation("updateUser", { userId, updates })

    const validation = this.validateRequired({ userId }, ["userId"])
    if (!validation.success) {
      return this.createError(
        "VALIDATION_ERROR",
        validation.error?.message || "Validation failed"
      )
    }

    return this.handleAsync(
      async () => {
        const user = await db.user.update({
          where: {
            id: userId,
          },
          data: updates,
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
          },
        })

        return user as AuthUser
      },
      "UPDATE_FAILED",
      "User update failed"
    )
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<ServiceResult<void>> {
    this.logOperation("changePassword", { userId })

    const validation = this.validateRequired(
      { userId, currentPassword, newPassword },
      ["userId", "currentPassword", "newPassword"]
    )
    if (!validation.success) {
      return validation
    }

    return this.handleAsync(
      async () => {
        // Get current password hash
        const user = await db.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            password: true,
          },
        })

        if (!user?.password) {
          throw new Error("User not found or password not set")
        }

        // Verify current password
        const isValid = await verifyPassword(currentPassword, user.password)
        if (!isValid) {
          throw new Error("Current password is incorrect")
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword)

        // Update password
        await db.user.update({
          where: {
            id: userId,
          },
          data: {
            password: hashedPassword,
          },
        })

        return undefined
      },
      "PASSWORD_CHANGE_FAILED",
      "Password change failed"
    )
  }

  /**
   * Validate session data format
   * Used by NextAuth integration
   */
  validateSessionData(sessionData: unknown): sessionData is SessionData {
    if (!sessionData || typeof sessionData !== "object") {
      return false
    }

    const session = sessionData as Record<string, unknown>

    return (
      typeof session.expires === "string" &&
      typeof session.user === "object" &&
      session.user !== null &&
      this.validateAuthUser(session.user)
    )
  }

  /**
   * Validate auth user data format
   */
  validateAuthUser(userData: unknown): userData is AuthUser {
    if (!userData || typeof userData !== "object") {
      return false
    }

    const user = userData as Record<string, unknown>

    return (
      typeof user.id === "string" &&
      typeof user.email === "string" &&
      (user.name === null || typeof user.name === "string") &&
      (user.image === null || typeof user.image === "string") &&
      Object.values(UserRole).includes(user.role as UserRole)
    )
  }

  /**
   * Helper method to safely convert objects for validation
   */
  private toValidationRecord(obj: unknown): Record<string, unknown> {
    return obj as Record<string, unknown>
  }
}
