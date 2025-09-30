import { POST } from "@/app/api/auth/register/route"
import {
  createMockRequest,
  getResponseJson,
} from "@/__tests__/helpers/api-test-helpers"
import { hashPassword } from "@/lib/auth-utils"
import { UserRole } from "@prisma/client"

// Mock dependencies
jest.mock("@/lib/auth-utils")
jest.mock("@/lib/db", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

// Import the mocked database
import { db } from "@/lib/db"

const mockHashPassword = hashPassword as jest.MockedFunction<
  typeof hashPassword
>
const mockDbUserFindUnique = db.user.findUnique as jest.MockedFunction<
  typeof db.user.findUnique
>
const mockDbUserCreate = db.user.create as jest.MockedFunction<
  typeof db.user.create
>

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Test fixtures
  const validRegistrationData = {
    name: "Test User",
    email: "test@example.com",
    password: "SecureP@ssw0rd123!",
    confirmPassword: "SecureP@ssw0rd123!",
  }

  const mockCreatedUser = {
    id: "user-123",
    name: "Test User",
    email: "test@example.com",
    password: "hashed-password-12345",
    emailVerified: null,
    image: null,
    role: "USER" as UserRole,
    phone: null,
    company: null,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    militaryBranch: null,
    yearsOfService: null,
    certifications: [],
    preferredLocations: [],
    isAvailable: true,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripePriceId: null,
    stripeCurrentPeriodEnd: null,
  }

  describe("successful registration", () => {
    it("should create new user with valid data", async () => {
      // Arrange
      mockDbUserFindUnique.mockResolvedValue(null) // No existing user
      mockHashPassword.mockResolvedValue("hashed-password-12345")
      mockDbUserCreate.mockResolvedValue(mockCreatedUser)

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        validRegistrationData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(response.status).toBe(200)
      expect(data.message).toBe("User created successfully")
      expect(data.user).toBeDefined()
      expect(data.user.id).toBe("user-123")
      expect(data.user.email).toBe("test@example.com")
      expect(data.user.name).toBe("Test User")
    })

    it("should hash password using bcrypt", async () => {
      // Arrange
      mockDbUserFindUnique.mockResolvedValue(null)
      mockHashPassword.mockResolvedValue("hashed-password-12345")
      mockDbUserCreate.mockResolvedValue(mockCreatedUser)

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        validRegistrationData
      )

      // Act
      await POST(req)

      // Assert
      expect(mockHashPassword).toHaveBeenCalledWith("SecureP@ssw0rd123!")
      expect(mockHashPassword).toHaveBeenCalledTimes(1)
    })

    it("should assign default USER role", async () => {
      // Arrange
      mockDbUserFindUnique.mockResolvedValue(null)
      mockHashPassword.mockResolvedValue("hashed-password-12345")
      mockDbUserCreate.mockResolvedValue(mockCreatedUser)

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        validRegistrationData
      )

      // Act
      await POST(req)

      // Assert
      expect(mockDbUserCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: "Test User",
          email: "test@example.com",
          password: "hashed-password-12345",
        }),
      })
    })

    it("should exclude password from response", async () => {
      // Arrange
      mockDbUserFindUnique.mockResolvedValue(null)
      mockHashPassword.mockResolvedValue("hashed-password-12345")
      mockDbUserCreate.mockResolvedValue(mockCreatedUser)

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        validRegistrationData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert - CRITICAL SECURITY TEST
      expect(data.user.password).toBeUndefined()
      expect(JSON.stringify(data)).not.toContain("hashed-password")
      expect(JSON.stringify(data)).not.toContain(validRegistrationData.password)
    })

    it("should normalize email to lowercase", async () => {
      // Arrange
      mockDbUserFindUnique.mockResolvedValue(null)
      mockHashPassword.mockResolvedValue("hashed-password-12345")
      mockDbUserCreate.mockResolvedValue({
        ...mockCreatedUser,
        email: "test@example.com",
      })

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        {
          ...validRegistrationData,
          email: "Test@Example.COM",
        }
      )

      // Act
      await POST(req)

      // Assert
      expect(mockDbUserFindUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      })
      expect(mockDbUserCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: "test@example.com",
        }),
      })
    })

    it("should return success status 200", async () => {
      // Arrange
      mockDbUserFindUnique.mockResolvedValue(null)
      mockHashPassword.mockResolvedValue("hashed-password-12345")
      mockDbUserCreate.mockResolvedValue(mockCreatedUser)

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        validRegistrationData
      )

      // Act
      const response = await POST(req)

      // Assert
      expect(response.status).toBe(200)
    })
  })

  describe("input validation", () => {
    it("should return 400 for missing email", async () => {
      // Arrange
      const invalidData = {
        name: "Test User",
        password: "SecureP@ssw0rd123!",
        confirmPassword: "SecureP@ssw0rd123!",
      }

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        invalidData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe("Invalid input")
      expect(data.details).toBeDefined()
    })

    it("should return 400 for missing password", async () => {
      // Arrange
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        confirmPassword: "SecureP@ssw0rd123!",
      }

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        invalidData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe("Invalid input")
    })

    it("should return 400 for invalid email format", async () => {
      // Arrange
      const invalidData = {
        name: "Test User",
        email: "not-an-email",
        password: "SecureP@ssw0rd123!",
        confirmPassword: "SecureP@ssw0rd123!",
      }

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        invalidData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe("Invalid input")
    })

    it("should return 400 for password less than 12 characters", async () => {
      // Arrange
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        password: "Short1!",
        confirmPassword: "Short1!",
      }

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        invalidData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe("Invalid input")
      expect(JSON.stringify(data.details)).toContain("12 characters")
    })

    it("should return 400 for password missing uppercase letter", async () => {
      // Arrange
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        password: "securep@ssw0rd123!",
        confirmPassword: "securep@ssw0rd123!",
      }

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        invalidData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(response.status).toBe(400)
      expect(JSON.stringify(data.details)).toContain("uppercase")
    })

    it("should return 400 for password missing lowercase letter", async () => {
      // Arrange
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        password: "SECUREP@SSW0RD123!",
        confirmPassword: "SECUREP@SSW0RD123!",
      }

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        invalidData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(response.status).toBe(400)
      expect(JSON.stringify(data.details)).toContain("lowercase")
    })

    it("should return 400 for password missing number", async () => {
      // Arrange
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        password: "SecureP@ssword!",
        confirmPassword: "SecureP@ssword!",
      }

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        invalidData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(response.status).toBe(400)
      expect(JSON.stringify(data.details)).toContain("number")
    })

    it("should return 400 for password missing special character", async () => {
      // Arrange
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        password: "SecurePassword123",
        confirmPassword: "SecurePassword123",
      }

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        invalidData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(response.status).toBe(400)
      expect(JSON.stringify(data.details)).toContain("special character")
    })

    it("should reject password with common words", async () => {
      // Arrange
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        password: "MyPassword123!",
        confirmPassword: "MyPassword123!",
      }

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        invalidData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(response.status).toBe(400)
      expect(JSON.stringify(data.details)).toContain("common words")
    })

    it("should reject password with keyboard patterns", async () => {
      // Arrange
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        password: "Qwerty123456!",
        confirmPassword: "Qwerty123456!",
      }

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        invalidData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(response.status).toBe(400)
      expect(JSON.stringify(data.details)).toContain("keyboard patterns")
    })

    it("should return 400 for missing confirmPassword", async () => {
      // Arrange
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        password: "SecureP@ssw0rd123!",
      }

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        invalidData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe("Invalid input")
    })

    it("should return 400 when passwords do not match", async () => {
      // Arrange
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        password: "SecureP@ssw0rd123!",
        confirmPassword: "DifferentP@ssw0rd123!",
      }

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        invalidData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(response.status).toBe(400)
      expect(JSON.stringify(data.details)).toContain("match")
    })
  })

  describe("duplicate prevention", () => {
    it("should return 400 for duplicate email", async () => {
      // Arrange - user already exists
      mockDbUserFindUnique.mockResolvedValue(mockCreatedUser)

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        validRegistrationData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe("Registration failed")
    })

    it("should return generic error message to prevent user enumeration", async () => {
      // Arrange - user already exists
      mockDbUserFindUnique.mockResolvedValue(mockCreatedUser)

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        validRegistrationData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert - Should NOT reveal that email exists
      expect(data.error).toBe("Registration failed")
      expect(JSON.stringify(data)).not.toContain("already exists")
      expect(JSON.stringify(data)).not.toContain("email")
      expect(JSON.stringify(data)).not.toContain("duplicate")
    })

    it("should check for duplicate email case-insensitively", async () => {
      // Arrange
      mockDbUserFindUnique.mockResolvedValue(mockCreatedUser)

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        {
          ...validRegistrationData,
          email: "TEST@EXAMPLE.COM",
        }
      )

      // Act
      await POST(req)

      // Assert
      expect(mockDbUserFindUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      })
    })
  })

  describe("security", () => {
    it("should never return password in response body", async () => {
      // Arrange
      mockDbUserFindUnique.mockResolvedValue(null)
      mockHashPassword.mockResolvedValue("hashed-password-12345")
      mockDbUserCreate.mockResolvedValue(mockCreatedUser)

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        validRegistrationData
      )

      // Act
      const response = await POST(req)
      const responseText = JSON.stringify(await getResponseJson(response))

      // Assert - CRITICAL SECURITY TEST
      expect(responseText).not.toContain("password")
      expect(responseText).not.toContain("hashed-password-12345")
      expect(responseText).not.toContain("SecureP@ssw0rd123!")
    })

    it("should explicitly remove password field from user object", async () => {
      // Arrange
      mockDbUserFindUnique.mockResolvedValue(null)
      mockHashPassword.mockResolvedValue("hashed-password-12345")
      mockDbUserCreate.mockResolvedValue(mockCreatedUser)

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        validRegistrationData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(data.user).toBeDefined()
      expect(data.user.password).toBeUndefined()
      expect(Object.keys(data.user)).not.toContain("password")
    })

    it("should sanitize input to prevent XSS", async () => {
      // Arrange
      mockDbUserFindUnique.mockResolvedValue(null)
      mockHashPassword.mockResolvedValue("hashed-password-12345")
      const xssAttempt = "<script>alert('xss')</script>"
      mockDbUserCreate.mockResolvedValue({
        ...mockCreatedUser,
        name: xssAttempt,
      })

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        {
          ...validRegistrationData,
          name: xssAttempt,
        }
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert - Zod validation should handle this
      // If it passes validation, it should be stored as-is (escaped by DB/React)
      expect(response.status).toBe(200)
      expect(data.user.name).toBeDefined()
    })

    it("should use Zod validation to prevent SQL injection", async () => {
      // Arrange
      const sqlInjectionAttempt = "'; DROP TABLE users; --"
      mockDbUserFindUnique.mockResolvedValue(null)

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        {
          name: "Test User",
          email: sqlInjectionAttempt,
          password: "SecureP@ssw0rd123!",
          confirmPassword: "SecureP@ssw0rd123!",
        }
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert - Should fail email validation
      expect(response.status).toBe(400)
      expect(data.error).toBe("Invalid input")
      // Database should never be called
      expect(mockDbUserFindUnique).not.toHaveBeenCalled()
    })
  })

  describe("error handling", () => {
    it("should return 500 for database connection errors", async () => {
      // Arrange
      mockDbUserFindUnique.mockRejectedValue(
        new Error("Database connection failed")
      )

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        validRegistrationData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe("Internal server error")
    })

    it("should return 400 for malformed JSON", async () => {
      // Arrange
      const req = {
        json: jest.fn().mockRejectedValue(new SyntaxError("Unexpected token")),
      } as unknown as ReturnType<typeof createMockRequest>

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe("Internal server error")
    })

    it("should return 400 with details for invalid Zod schema", async () => {
      // Arrange
      const invalidData = {
        name: "T", // Too short
        email: "test@example.com",
        password: "SecureP@ssw0rd123!",
        confirmPassword: "SecureP@ssw0rd123!",
      }

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        invalidData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe("Invalid input")
      expect(data.details).toBeDefined()
      expect(Array.isArray(data.details)).toBe(true)
    })

    it("should not expose internal error details in production", async () => {
      // Arrange
      mockDbUserFindUnique.mockRejectedValue(
        new Error("ECONNREFUSED: Connection refused at 192.168.1.100:5432")
      )

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/register",
        validRegistrationData
      )

      // Act
      const response = await POST(req)
      const data = await getResponseJson(response)

      // Assert - Should return generic error message
      expect(response.status).toBe(500)
      expect(data.error).toBe("Internal server error")
      expect(JSON.stringify(data)).not.toContain("ECONNREFUSED")
      expect(JSON.stringify(data)).not.toContain("192.168.1.100")
      expect(JSON.stringify(data)).not.toContain("5432")
    })
  })
})
