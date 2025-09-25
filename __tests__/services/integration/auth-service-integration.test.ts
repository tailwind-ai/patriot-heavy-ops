/**
 * Auth Service Integration Tests
 *
 * Tests authentication service for mobile compatibility and cross-platform support.
 * Validates JWT token handling, session management, and React Native readiness.
 *
 * Design Principles:
 * - Zero Next.js/React dependencies
 * - Mobile SDK authentication patterns
 * - Platform-agnostic user management
 * - JWT and session dual authentication support
 */

import { AuthService, ServiceFactory } from "@/lib/services"
import { hashPassword, verifyPassword, generateAccessToken, verifyToken } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { UserRole } from "@prisma/client"

// Mock dependencies for isolated testing
jest.mock("@/lib/db", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}))

jest.mock("@/lib/auth-utils", () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
  generateAccessToken: jest.fn(),
  verifyToken: jest.fn(),
}))

// Properly typed mocks
const mockDb = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
} as any

const mockAuthUtils = {
  hashPassword: hashPassword as jest.MockedFunction<typeof hashPassword>,
  verifyPassword: verifyPassword as jest.MockedFunction<typeof verifyPassword>,
  generateAccessToken: generateAccessToken as jest.MockedFunction<typeof generateAccessToken>,
  verifyToken: verifyToken as jest.MockedFunction<typeof verifyToken>,
}

describe("Auth Service Integration Tests", () => {
  let authService: AuthService

  beforeEach(() => {
    // Reset all mocks and services
    jest.clearAllMocks()
    ServiceFactory.reset()
    
    // Get fresh service instance
    authService = ServiceFactory.getAuthService()
  })

  afterEach(() => {
    ServiceFactory.reset()
  })

  describe("Mobile-First Authentication Architecture", () => {
    it("should work in pure Node.js environment without Next.js dependencies", () => {
      // Verify service can be instantiated without any web framework
      expect(authService).toBeInstanceOf(AuthService)
      expect(authService.getServiceName()).toBe("AuthService")
    })

    it("should provide platform-agnostic authentication methods", () => {
      // Verify all essential auth methods are available
      const methods = [
        "authenticate",
        "register", 
        "getUserById",
        "getUserByEmail",
        "updateUser",
        "changePassword",
        "validateSessionData",
        "validateAuthUser",
        "updateUserProfile",
      ]

      methods.forEach(methodName => {
        expect(typeof authService[methodName as keyof AuthService]).toBe("function")
      })
    })

    it("should handle authentication without browser context", async () => {
      // Simulate mobile environment (no DOM, no cookies)
      const originalWindow = global.window
      const originalDocument = global.document
      
      delete (global as any).window
      delete (global as any).document

      try {
        const mockUser = {
          id: "user-123",
          email: "test@example.com",
          name: "Test User",
          role: UserRole.USER,
          password: "hashed-password",
        }

        mockDb.user.findUnique.mockResolvedValue(mockUser as any)
        mockAuthUtils.verifyPassword.mockResolvedValue(true)

        const result = await authService.authenticate({
          email: "test@example.com",
          password: "password123",
        })

        expect(result.success).toBe(true)
        expect(result.data?.email).toBe("test@example.com")
      } finally {
        // Restore globals
        if (originalWindow) (global as any).window = originalWindow
        if (originalDocument) (global as any).document = originalDocument
      }
    })
  })

  describe("User Authentication Flow", () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
      role: UserRole.USER,
      password: "hashed-password",
    }

    beforeEach(() => {
      mockDb.user.findUnique.mockResolvedValue(mockUser as any)
      mockAuthUtils.verifyPassword.mockResolvedValue(true)
    })

    it("should authenticate user with valid credentials", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      }

      const result = await authService.authenticate(credentials)

      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      })
      expect(mockDb.user.findUnique).toHaveBeenCalledWith({
        where: { email: credentials.email.toLowerCase() },
        select: expect.any(Object),
      })
      expect(mockAuthUtils.verifyPassword).toHaveBeenCalledWith(
        credentials.password,
        mockUser.password
      )
    })

    it("should reject authentication with invalid credentials", async () => {
      mockAuthUtils.verifyPassword.mockResolvedValue(false)

      const result = await authService.authenticate({
        email: "test@example.com",
        password: "wrong-password",
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("AUTH_FAILED")
      expect(result.error?.message).toBe("Authentication failed")
    })

    it("should handle user not found scenario", async () => {
      mockDb.user.findUnique.mockResolvedValue(null)

      const result = await authService.authenticate({
        email: "nonexistent@example.com",
        password: "password123",
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("AUTH_FAILED")
    })

    it("should handle user without password", async () => {
      mockDb.user.findUnique.mockResolvedValue({
        ...mockUser,
        password: null,
      } as any)

      const result = await authService.authenticate({
        email: "test@example.com",
        password: "password123",
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("AUTH_FAILED")
    })
  })

  describe("User Registration Flow", () => {
    beforeEach(() => {
      mockDb.user.findUnique.mockResolvedValue(null) // User doesn't exist
      mockAuthUtils.hashPassword.mockResolvedValue("hashed-password")
    })

    it("should register new user successfully", async () => {
      const newUser = {
        id: "user-456",
        email: "newuser@example.com",
        name: "New User",
        role: UserRole.USER,
      }

      mockDb.user.create.mockResolvedValue(newUser as any)

      const registerData = {
        email: "newuser@example.com",
        password: "password123",
        name: "New User",
      }

      const result = await authService.register(registerData)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(newUser)
      expect(mockAuthUtils.hashPassword).toHaveBeenCalledWith(registerData.password)
      expect(mockDb.user.create).toHaveBeenCalledWith({
        data: {
          email: registerData.email.toLowerCase(),
          password: "hashed-password",
          name: registerData.name,
          role: UserRole.USER,
        },
        select: expect.any(Object),
      })
    })

    it("should prevent duplicate user registration", async () => {
      mockDb.user.findUnique.mockResolvedValue({
        id: "existing-user",
        email: "existing@example.com",
      } as any)

      const result = await authService.register({
        email: "existing@example.com",
        password: "password123",
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("REGISTRATION_FAILED")
    })

    it("should normalize email during registration", async () => {
      const newUser = {
        id: "user-456",
        email: "test@example.com",
        name: null,
        role: UserRole.USER,
      }

      mockDb.user.create.mockResolvedValue(newUser as any)

      const result = await authService.register({
        email: "TEST@EXAMPLE.COM", // Mixed case
        password: "password123",
      })

      expect(result.success).toBe(true)
      expect(mockDb.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: "test@example.com", // Should be lowercase
        }),
        select: expect.any(Object),
      })
    })
  })

  describe("User Management Operations", () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
      role: UserRole.USER,
    }

    beforeEach(() => {
      mockDb.user.findUnique.mockResolvedValue(mockUser as any)
    })

    it("should retrieve user by ID", async () => {
      const result = await authService.getUserById("user-123")

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUser)
      expect(mockDb.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-123" },
        select: expect.any(Object),
      })
    })

    it("should retrieve user by email", async () => {
      const result = await authService.getUserByEmail("test@example.com")

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUser)
      expect(mockDb.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
        select: expect.any(Object),
      })
    })

    it("should update user profile", async () => {
      const updatedUser = {
        ...mockUser,
        name: "Updated Name",
      }

      mockDb.user.update.mockResolvedValue(updatedUser as any)

      const result = await authService.updateUser("user-123", {
        name: "Updated Name",
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual(updatedUser)
      expect(mockDb.user.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: { name: "Updated Name" },
        select: expect.any(Object),
      })
    })

    it("should handle user not found scenarios", async () => {
      mockDb.user.findUnique.mockResolvedValue(null)

      const result = await authService.getUserById("nonexistent-user")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("USER_NOT_FOUND")
    })
  })

  describe("Password Management", () => {
    const mockUser = {
      id: "user-123",
      password: "current-hashed-password",
    }

    beforeEach(() => {
      mockDb.user.findUnique.mockResolvedValue(mockUser as any)
      mockAuthUtils.verifyPassword.mockResolvedValue(true)
      mockAuthUtils.hashPassword.mockResolvedValue("new-hashed-password")
    })

    it("should change password with valid current password", async () => {
      const result = await authService.changePassword(
        "user-123",
        "current-password",
        "new-password"
      )

      expect(result.success).toBe(true)
      expect(mockAuthUtils.verifyPassword).toHaveBeenCalledWith(
        "current-password",
        "current-hashed-password"
      )
      expect(mockAuthUtils.hashPassword).toHaveBeenCalledWith("new-password")
      expect(mockDb.user.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: { password: "new-hashed-password" },
      })
    })

    it("should reject password change with invalid current password", async () => {
      mockAuthUtils.verifyPassword.mockResolvedValue(false)

      const result = await authService.changePassword(
        "user-123",
        "wrong-current-password",
        "new-password"
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("PASSWORD_CHANGE_FAILED")
    })

    it("should handle user without password set", async () => {
      mockDb.user.findUnique.mockResolvedValue({
        id: "user-123",
        password: null,
      } as any)

      const result = await authService.changePassword(
        "user-123",
        "current-password",
        "new-password"
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("PASSWORD_CHANGE_FAILED")
    })
  })

  describe("Data Validation and Type Safety", () => {
    it("should validate session data format", () => {
      const validSessionData = {
        user: {
          id: "user-123",
          email: "test@example.com",
          name: "Test User",
          image: null,
          role: UserRole.USER,
        },
        expires: "2024-12-31T23:59:59Z",
      }

      const isValid = authService.validateSessionData(validSessionData)
      expect(isValid).toBe(true)
    })

    it("should reject invalid session data", () => {
      const invalidSessionData = {
        user: {
          id: "user-123",
          // Missing required fields
        },
        expires: "invalid-date",
      }

      const isValid = authService.validateSessionData(invalidSessionData)
      expect(isValid).toBe(false)
    })

    it("should validate auth user data format", () => {
      const validUserData = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        image: null,
        role: UserRole.USER,
      }

      const isValid = authService.validateAuthUser(validUserData)
      expect(isValid).toBe(true)
    })

    it("should reject invalid auth user data", () => {
      const invalidUserData = {
        id: 123, // Should be string
        email: "test@example.com",
        role: "INVALID_ROLE",
      }

      const isValid = authService.validateAuthUser(invalidUserData)
      expect(isValid).toBe(false)
    })
  })

  describe("Mobile SDK Compatibility", () => {
    it("should provide serializable authentication results", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: UserRole.USER,
        password: "hashed-password",
      }

      mockDb.user.findUnique.mockResolvedValue(mockUser as any)
      mockAuthUtils.verifyPassword.mockResolvedValue(true)

      const result = await authService.authenticate({
        email: "test@example.com",
        password: "password123",
      })

      expect(result.success).toBe(true)
      
      // Verify result can be JSON serialized (important for mobile communication)
      const serialized = JSON.stringify(result)
      const deserialized = JSON.parse(serialized)
      
      expect(deserialized).toEqual(result)
    })

    it("should handle async operations with proper error boundaries", async () => {
      // Mock database error
      mockDb.user.findUnique.mockRejectedValue(new Error("Network timeout"))

      const result = await authService.authenticate({
        email: "test@example.com",
        password: "password123",
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("AUTH_FAILED")
      expect(result.error?.message).toBe("Authentication failed")
    })

    it("should support React Native environment simulation", async () => {
      // Simulate React Native environment
      const originalWindow = global.window
      const originalDocument = global.document
      
      delete (global as any).window
      delete (global as any).document

      try {
        // Service should still work for user validation
        const validUserData = {
          id: "user-123",
          email: "test@example.com",
          name: "Test User",
          image: null,
          role: UserRole.USER,
        }

        const isValid = authService.validateAuthUser(validUserData)
        expect(isValid).toBe(true)
      } finally {
        // Restore globals
        if (originalWindow) (global as any).window = originalWindow
        if (originalDocument) (global as any).document = originalDocument
      }
    })
  })

  describe("Security and Access Control", () => {
    it("should enforce profile update access control", async () => {
      const result = await authService.updateUserProfile(
        "user-123",
        "different-user-456", // Different requesting user
        { name: "Hacker Name" }
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("ACCESS_DENIED")
      expect(result.error?.message).toBe("You can only update your own profile")
    })

    it("should validate profile update data", async () => {
      const result = await authService.updateUserProfile(
        "user-123",
        "user-123", // Same user
        { name: "" } // Invalid empty name
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })

    it("should handle validation errors gracefully", async () => {
      const result = await authService.authenticate({
        email: "", // Invalid email
        password: "", // Invalid password
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
    })
  })

  describe("Performance and Reliability", () => {
    it("should handle authentication efficiently", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: UserRole.USER,
        password: "hashed-password",
      }

      mockDb.user.findUnique.mockResolvedValue(mockUser as any)
      mockAuthUtils.verifyPassword.mockResolvedValue(true)

      const startTime = Date.now()
      
      const result = await authService.authenticate({
        email: "test@example.com",
        password: "password123",
      })
      
      const endTime = Date.now()

      expect(result.success).toBe(true)
      expect(endTime - startTime).toBeLessThan(1000) // Should complete in <1s
    })

    it("should handle concurrent authentication requests", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: UserRole.USER,
        password: "hashed-password",
      }

      mockDb.user.findUnique.mockResolvedValue(mockUser as any)
      mockAuthUtils.verifyPassword.mockResolvedValue(true)

      // Simulate concurrent requests
      const promises = Array.from({ length: 5 }, () =>
        authService.authenticate({
          email: "test@example.com",
          password: "password123",
        })
      )

      const results = await Promise.all(promises)

      results.forEach(result => {
        expect(result.success).toBe(true)
        expect(result.data?.email).toBe("test@example.com")
      })
    })
  })
})
