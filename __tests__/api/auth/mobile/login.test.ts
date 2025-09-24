import { NextResponse } from "next/server"
import { POST, GET } from "@/app/api/auth/mobile/login/route"
import { createMockRequest } from "@/__tests__/helpers/api-test-helpers"
import {
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth-utils"
import { authRateLimit } from "@/lib/middleware/rate-limit"

// Mock dependencies
jest.mock("@/lib/auth-utils")
jest.mock("@/lib/middleware/rate-limit")

// Import the mocked database
import { mockUser } from "@/__mocks__/lib/db"
const mockVerifyPassword = verifyPassword as jest.MockedFunction<
  typeof verifyPassword
>
const mockGenerateAccessToken = generateAccessToken as jest.MockedFunction<
  typeof generateAccessToken
>
const mockGenerateRefreshToken = generateRefreshToken as jest.MockedFunction<
  typeof generateRefreshToken
>
const mockAuthRateLimit = authRateLimit as jest.MockedFunction<
  typeof authRateLimit
>

describe("/api/auth/mobile/login", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock rate limiting to allow requests by default
    mockAuthRateLimit.mockResolvedValue(null)
  })

  describe("POST", () => {
    const validLoginData = {
      email: "test@example.com",
      password: "password123",
    }

    const mockUserData = {
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
      role: "USER",
      password: "hashed-password",
    }

    it("should successfully login with valid credentials", async () => {
      mockUser.findUnique.mockResolvedValue(mockUserData)
      mockVerifyPassword.mockResolvedValue(true)
      mockGenerateAccessToken.mockReturnValue("access-token")
      mockGenerateRefreshToken.mockReturnValue("refresh-token")

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/mobile/login",
        validLoginData
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.accessToken).toBe("access-token")
      expect(data.refreshToken).toBe("refresh-token")
      expect(data.user).toEqual({
        id: mockUserData.id,
        email: mockUserData.email,
        name: mockUserData.name,
        role: mockUserData.role,
      })

      expect(mockUser.findUnique).toHaveBeenCalledWith({
        where: { email: validLoginData.email.toLowerCase() },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          password: true,
        },
      })
    })

    it("should return 401 for invalid email", async () => {
      mockUser.findUnique.mockResolvedValue(null)

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/mobile/login",
        validLoginData
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Invalid email or password")
      expect(data.accessToken).toBeUndefined()
      expect(data.refreshToken).toBeUndefined()
    })

    it("should return 401 for user without password", async () => {
      const userWithoutPassword = { ...mockUserData, password: null }
      mockUser.findUnique.mockResolvedValue(userWithoutPassword)

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/mobile/login",
        validLoginData
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Invalid email or password")
    })

    it("should return 401 for invalid password", async () => {
      mockUser.findUnique.mockResolvedValue(mockUserData)
      mockVerifyPassword.mockResolvedValue(false)

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/mobile/login",
        validLoginData
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Invalid email or password")
    })

    it("should return 400 for invalid request data", async () => {
      const invalidData = {
        email: "invalid-email",
        password: "",
      }

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/mobile/login",
        invalidData
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain("Invalid")
    })

    it("should return 400 for missing email", async () => {
      const invalidData = {
        password: "password123",
      }

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/mobile/login",
        invalidData
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it("should return 400 for missing password", async () => {
      const invalidData = {
        email: "test@example.com",
      }

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/mobile/login",
        invalidData
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it("should handle database errors gracefully", async () => {
      mockUser.findUnique.mockRejectedValue(
        new Error("Database connection failed")
      )

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/mobile/login",
        validLoginData
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Authentication failed")
    })

    it("should handle malformed JSON gracefully", async () => {
      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/mobile/login",
        "invalid-json"
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe("Expected object, received string")
    })

    it("should apply rate limiting", async () => {
      const rateLimitResponse = NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429 }
      )
      mockAuthRateLimit.mockResolvedValue(rateLimitResponse)

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/mobile/login",
        validLoginData
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.error).toBe("Rate limit exceeded")
      expect(mockAuthRateLimit).toHaveBeenCalledWith(req)
    })

    it("should normalize email to lowercase", async () => {
      const upperCaseEmailData = {
        email: "TEST@EXAMPLE.COM",
        password: "password123",
      }

      mockUser.findUnique.mockResolvedValue(mockUserData)
      mockVerifyPassword.mockResolvedValue(true)
      mockGenerateAccessToken.mockReturnValue("access-token")
      mockGenerateRefreshToken.mockReturnValue("refresh-token")

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/mobile/login",
        upperCaseEmailData
      )

      await POST(req)

      expect(mockUser.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" }, // Should be lowercase
        select: expect.any(Object),
      })
    })

    it("should generate tokens with correct payload", async () => {
      mockUser.findUnique.mockResolvedValue(mockUserData)
      mockVerifyPassword.mockResolvedValue(true)
      mockGenerateAccessToken.mockReturnValue("access-token")
      mockGenerateRefreshToken.mockReturnValue("refresh-token")

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/mobile/login",
        validLoginData
      )

      await POST(req)

      const expectedPayload = {
        userId: mockUserData.id,
        email: mockUserData.email,
        role: mockUserData.role,
      }

      expect(mockGenerateAccessToken).toHaveBeenCalledWith(expectedPayload)
      expect(mockGenerateRefreshToken).toHaveBeenCalledWith(expectedPayload)
    })

    it("should handle user with no role", async () => {
      const userWithoutRole = { ...mockUserData, role: null }
      mockUser.findUnique.mockResolvedValue(userWithoutRole)
      mockVerifyPassword.mockResolvedValue(true)
      mockGenerateAccessToken.mockReturnValue("access-token")
      mockGenerateRefreshToken.mockReturnValue("refresh-token")

      const req = createMockRequest(
        "POST",
        "http://localhost/api/auth/mobile/login",
        validLoginData
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user.role).toBeUndefined()

      const expectedPayload = {
        userId: userWithoutRole.id,
        email: userWithoutRole.email,
        role: undefined,
      }

      expect(mockGenerateAccessToken).toHaveBeenCalledWith(expectedPayload)
    })
  })

  describe("GET", () => {
    it("should return 405 Method Not Allowed", async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(405)
      expect(data.error).toBe("Method not allowed")
    })
  })
})
