/**
 * Authentication Service Tests
 *
 * Comprehensive unit tests for AuthService covering both NextAuth session
 * and JWT Bearer token authentication patterns.
 */

import {
  AuthService,
  AuthUser,
  LoginCredentials,
  RegisterData,
} from "../../../lib/services/auth-service"
import { ServiceLogger } from "../../../lib/services/base-service"
import type { UserRole } from "@prisma/client"
import { hashPassword } from "../../../lib/auth-utils"

// Mock the database
jest.mock("../../../lib/db")

// Mock auth-utils
jest.mock("../../../lib/auth-utils", () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
}))

import { mockUser as mockUserModel } from "../../../lib/db"
import { verifyPassword } from "../../../lib/auth-utils"

// const mockDb = db as jest.Mocked<typeof db>
const mockHashPassword = hashPassword as jest.MockedFunction<
  typeof hashPassword
>
const mockVerifyPassword = verifyPassword as jest.MockedFunction<
  typeof verifyPassword
>

// Mock logger for testing
class MockLogger implements ServiceLogger {
  public logs: Array<{
    level: string
    message: string
    meta?: Record<string, unknown>
  }> = []

  info(message: string, meta?: Record<string, unknown>): void {
    this.logs.push({ level: "info", message, ...(meta && { meta }) })
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logs.push({ level: "warn", message, ...(meta && { meta }) })
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.logs.push({ level: "error", message, ...(meta && { meta }) })
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logs.push({ level: "debug", message, ...(meta && { meta }) })
  }

  clear(): void {
    this.logs = []
  }
}

describe("AuthService", () => {
  let authService: AuthService
  let mockLogger: MockLogger

  const mockUser: AuthUser = {
    id: "user-123",
    email: "test@example.com",
    name: "Test User",
    image: null,
    role: "USER" as UserRole,
  }

  const mockUserWithPassword = {
    ...mockUser,
    password: "hashed-password",
  }

  beforeEach(() => {
    mockLogger = new MockLogger()
    authService = new AuthService(mockLogger)
    jest.clearAllMocks()
  })

  describe("constructor", () => {
    it("should initialize with AuthService name", () => {
      expect(authService.getServiceName()).toBe("AuthService")
    })
  })

  describe("authenticate", () => {
    const credentials: LoginCredentials = {
      email: "test@example.com",
      password: "password123",
    }

    it("should authenticate user with valid credentials", async () => {
      mockUserModel.findUnique.mockResolvedValue(mockUserWithPassword)
      mockVerifyPassword.mockResolvedValue(true)

      const result = await authService.authenticate(credentials)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUser)
      expect(mockUserModel.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          role: true,
          password: true,
        },
      })
      expect(mockVerifyPassword).toHaveBeenCalledWith(
        "password123",
        "hashed-password"
      )
    })

    it("should fail authentication with invalid email", async () => {
      mockUserModel.findUnique.mockResolvedValue(null)

      const result = await authService.authenticate(credentials)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("AUTH_FAILED")
      expect(result.error?.message).toBe("Authentication failed")
    })

    it("should fail authentication with invalid password", async () => {
      mockUserModel.findUnique.mockResolvedValue(mockUserWithPassword)
      mockVerifyPassword.mockResolvedValue(false)

      const result = await authService.authenticate(credentials)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("AUTH_FAILED")
    })

    it("should fail authentication when user has no password", async () => {
      mockUserModel.findUnique.mockResolvedValue({
        ...mockUser,
        password: null,
      })

      const result = await authService.authenticate(credentials)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("AUTH_FAILED")
    })

    it("should validate required credentials", async () => {
      const result = await authService.authenticate({
        email: "",
        password: "test",
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })

    it("should log authentication attempts", async () => {
      mockUserModel.findUnique.mockResolvedValue(mockUserWithPassword)
      mockVerifyPassword.mockResolvedValue(true)

      await authService.authenticate(credentials)

      expect(
        mockLogger.logs.some(
          (log) =>
            log.level === "info" &&
            log.message.includes("authenticate") &&
            log.meta?.email === "test@example.com"
        )
      ).toBe(true)
    })
  })

  describe("register", () => {
    const registerData: RegisterData = {
      email: "new@example.com",
      password: "password123",
      name: "New User",
    }

    it("should register new user successfully", async () => {
      mockUserModel.findUnique.mockResolvedValue(null) // User doesn't exist
      mockHashPassword.mockResolvedValue("hashed-password")
      mockUserModel.create.mockResolvedValue(mockUser)

      const result = await authService.register(registerData)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUser)
      expect(mockHashPassword).toHaveBeenCalledWith("password123")
      expect(mockUserModel.create).toHaveBeenCalledWith({
        data: {
          email: "new@example.com",
          password: "hashed-password",
          name: "New User",
          role: "USER" as UserRole,
        },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          role: true,
        },
      })
    })

    it("should fail registration if user already exists", async () => {
      mockUserModel.findUnique.mockResolvedValue(mockUser)

      const result = await authService.register(registerData)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("REGISTRATION_FAILED")
    })

    it("should validate required registration data", async () => {
      const result = await authService.register({ email: "", password: "test" })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })

    it("should handle registration with minimal data", async () => {
      const minimalData = { email: "test@example.com", password: "password123" }
      mockUserModel.findUnique.mockResolvedValue(null)
      mockHashPassword.mockResolvedValue("hashed-password")
      mockUserModel.create.mockResolvedValue(mockUser)

      const result = await authService.register(minimalData)

      expect(result.success).toBe(true)
      expect(mockUserModel.create).toHaveBeenCalledWith({
        data: {
          email: "test@example.com",
          password: "hashed-password",
          name: null,
          role: "USER" as UserRole,
        },
        select: expect.any(Object),
      })
    })
  })

  describe("getUserById", () => {
    it("should get user by ID successfully", async () => {
      mockUserModel.findUnique.mockResolvedValue(mockUser)

      const result = await authService.getUserById("user-123")

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUser)
      expect(mockUserModel.findUnique).toHaveBeenCalledWith({
        where: { id: "user-123" },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          role: true,
        },
      })
    })

    it("should fail when user not found", async () => {
      mockUserModel.findUnique.mockResolvedValue(null)

      const result = await authService.getUserById("nonexistent")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("USER_NOT_FOUND")
    })

    it("should validate required userId", async () => {
      const result = await authService.getUserById("")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })
  })

  describe("getUserByEmail", () => {
    it("should get user by email successfully", async () => {
      mockUserModel.findUnique.mockResolvedValue(mockUser)

      const result = await authService.getUserByEmail("test@example.com")

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUser)
      expect(mockUserModel.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          role: true,
        },
      })
    })

    it("should fail when user not found", async () => {
      mockUserModel.findUnique.mockResolvedValue(null)

      const result = await authService.getUserByEmail("nonexistent@example.com")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("USER_NOT_FOUND")
    })
  })

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      const updates = { name: "Updated Name", image: "new-image.jpg" }
      const updatedUser = { ...mockUser, ...updates }
      mockUserModel.update.mockResolvedValue(updatedUser)

      const result = await authService.updateUser("user-123", updates)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(updatedUser)
      expect(mockUserModel.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: updates,
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          role: true,
        },
      })
    })

    it("should validate required userId", async () => {
      const result = await authService.updateUser("", { name: "Test" })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })
  })

  describe("changePassword", () => {
    it("should change password successfully", async () => {
      mockUserModel.findUnique.mockResolvedValue({
        password: "old-hashed-password",
      })
      mockVerifyPassword.mockResolvedValue(true)
      mockHashPassword.mockResolvedValue("new-hashed-password")
      mockUserModel.update.mockResolvedValue(mockUser)

      const result = await authService.changePassword(
        "user-123",
        "oldPassword",
        "newPassword"
      )

      expect(result.success).toBe(true)
      expect(mockVerifyPassword).toHaveBeenCalledWith(
        "oldPassword",
        "old-hashed-password"
      )
      expect(mockHashPassword).toHaveBeenCalledWith("newPassword")
      expect(mockUserModel.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: { password: "new-hashed-password" },
      })
    })

    it("should fail with incorrect current password", async () => {
      mockUserModel.findUnique.mockResolvedValue({
        password: "old-hashed-password",
      })
      mockVerifyPassword.mockResolvedValue(false)

      const result = await authService.changePassword(
        "user-123",
        "wrongPassword",
        "newPassword"
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("PASSWORD_CHANGE_FAILED")
    })

    it("should fail when user not found", async () => {
      mockUserModel.findUnique.mockResolvedValue(null)

      const result = await authService.changePassword(
        "user-123",
        "oldPassword",
        "newPassword"
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("PASSWORD_CHANGE_FAILED")
    })
  })

  describe("validateSessionData", () => {
    it("should validate correct session data", () => {
      const sessionData = {
        expires: "2024-12-31T23:59:59.999Z",
        user: mockUser,
      }

      const result = authService.validateSessionData(sessionData)

      expect(result).toBe(true)
    })

    it("should reject invalid session data", () => {
      const invalidCases = [
        null,
        undefined,
        {},
        { expires: "2024-12-31T23:59:59.999Z" }, // missing user
        { user: mockUser }, // missing expires
        { expires: 123, user: mockUser }, // wrong expires type
        { expires: "2024-12-31T23:59:59.999Z", user: null }, // null user
      ]

      invalidCases.forEach((sessionData) => {
        expect(authService.validateSessionData(sessionData)).toBe(false)
      })
    })
  })

  describe("validateAuthUser", () => {
    it("should validate correct auth user", () => {
      const result = authService.validateAuthUser(mockUser)
      expect(result).toBe(true)
    })

    it("should reject invalid auth user data", () => {
      const invalidCases = [
        null,
        undefined,
        {},
        { ...mockUser, id: 123 }, // wrong id type
        { ...mockUser, email: null }, // wrong email type
        { ...mockUser, role: "INVALID_ROLE" }, // invalid role
        { ...mockUser, id: undefined }, // missing required field
      ]

      invalidCases.forEach((userData) => {
        expect(authService.validateAuthUser(userData)).toBe(false)
      })
    })

    it("should accept null name and image", () => {
      const userWithNulls = { ...mockUser, name: null, image: null }
      expect(authService.validateAuthUser(userWithNulls)).toBe(true)
    })
  })
})
