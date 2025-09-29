import {
  getCurrentUser,
  getCurrentUserWithRole,
  requireAuth,
  requireRole,
} from "@/lib/session"
import { getServerSession } from "next-auth/next"

// Mock next-auth
jest.mock("next-auth/next")
const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>

describe("session management", () => {
  beforeEach(() => {
    mockGetServerSession.mockReset()
  })

  describe("getCurrentUser", () => {
    it("should return user when session exists", async () => {
      const mockUser = {
        id: "user-123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
        role: "USER",
      }

      mockGetServerSession.mockResolvedValue({
        user: mockUser,
        expires: "2024-12-31",
      })

      const result = await getCurrentUser()

      expect(result).toEqual(mockUser)
      expect(mockGetServerSession).toHaveBeenCalledWith(expect.any(Object))
    })

    it("should return undefined when no session exists", async () => {
      mockGetServerSession.mockResolvedValue(null)

      const result = await getCurrentUser()

      expect(result).toBeUndefined()
      expect(mockGetServerSession).toHaveBeenCalledWith(expect.any(Object))
    })

    it("should return undefined when session exists but no user", async () => {
      mockGetServerSession.mockResolvedValue({
        expires: "2024-12-31",
      } as any)

      const result = await getCurrentUser()

      expect(result).toBeUndefined()
    })

    it("should handle session with partial user data", async () => {
      const partialUser = {
        id: "user-123",
        email: "john@example.com",
      }

      mockGetServerSession.mockResolvedValue({
        user: partialUser,
        expires: "2024-12-31",
      } as any)

      const result = await getCurrentUser()

      expect(result).toEqual(partialUser)
    })
  })

  describe("getCurrentUserWithRole", () => {
    it("should return user with role when session exists", async () => {
      const mockUser = {
        id: "user-123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
        role: "ADMIN",
      }

      mockGetServerSession.mockResolvedValue({
        user: mockUser,
        expires: "2024-12-31",
      })

      const result = await getCurrentUserWithRole()

      expect(result).toEqual({
        id: "user-123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
        role: "ADMIN",
      })
    })

    it("should return null when no session exists", async () => {
      mockGetServerSession.mockResolvedValue(null)

      const result = await getCurrentUserWithRole()

      expect(result).toBeNull()
    })

    it("should return null when session exists but no user", async () => {
      mockGetServerSession.mockResolvedValue({
        expires: "2024-12-31",
      } as any)

      const result = await getCurrentUserWithRole()

      expect(result).toBeNull()
    })

    it("should default role to USER when role is missing", async () => {
      const mockUser = {
        id: "user-123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
        // role is missing
      }

      mockGetServerSession.mockResolvedValue({
        user: mockUser,
        expires: "2024-12-31",
      } as any)

      const result = await getCurrentUserWithRole()

      expect(result).toEqual({
        id: "user-123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
        role: "USER",
      })
    })

    it("should preserve existing role when present", async () => {
      const mockUser = {
        id: "user-123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
        role: "OPERATOR",
      }

      mockGetServerSession.mockResolvedValue({
        user: mockUser,
        expires: "2024-12-31",
      })

      const result = await getCurrentUserWithRole()

      expect(result).not.toBeNull()
      expect(result!.role).toBe("OPERATOR")
    })
  })

  describe("requireAuth", () => {
    it("should return user when authenticated", async () => {
      const mockUser = {
        id: "user-123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
        role: "USER",
      }

      mockGetServerSession.mockResolvedValue({
        user: mockUser,
        expires: "2024-12-31",
      })

      const result = await requireAuth()

      expect(result).toEqual(mockUser)
    })

    it("should throw error when not authenticated", async () => {
      mockGetServerSession.mockResolvedValue(null)

      await expect(requireAuth()).rejects.toThrow("Authentication required")
    })

    it("should throw error when session exists but no user", async () => {
      mockGetServerSession.mockResolvedValue({
        expires: "2024-12-31",
      } as any)

      await expect(requireAuth()).rejects.toThrow("Authentication required")
    })
  })

  describe("requireRole", () => {
    const mockUserWithRole = (role: string) => ({
      id: "user-123",
      name: "John Doe",
      email: "john@example.com",
      image: null,
      role,
    })

    it("should return user when user has required role (string)", async () => {
      mockGetServerSession.mockResolvedValue({
        user: mockUserWithRole("ADMIN"),
        expires: "2024-12-31",
      })

      const result = await requireRole("ADMIN")

      expect(result.role).toBe("ADMIN")
    })

    it("should return user when user has one of required roles (array)", async () => {
      mockGetServerSession.mockResolvedValue({
        user: mockUserWithRole("OPERATOR"),
        expires: "2024-12-31",
      })

      const result = await requireRole(["ADMIN", "OPERATOR"])

      expect(result.role).toBe("OPERATOR")
    })

    it("should throw error when user does not have required role (string)", async () => {
      mockGetServerSession.mockResolvedValue({
        user: mockUserWithRole("USER"),
        expires: "2024-12-31",
      })

      await expect(requireRole("ADMIN")).rejects.toThrow(
        "Access denied. Required role: ADMIN"
      )
    })

    it("should throw error when user does not have any required roles (array)", async () => {
      mockGetServerSession.mockResolvedValue({
        user: mockUserWithRole("USER"),
        expires: "2024-12-31",
      })

      await expect(requireRole(["ADMIN", "OPERATOR"])).rejects.toThrow(
        "Access denied. Required role: ADMIN or OPERATOR"
      )
    })

    it("should throw error when not authenticated", async () => {
      mockGetServerSession.mockResolvedValue(null)

      await expect(requireRole("ADMIN")).rejects.toThrow(
        "Authentication required"
      )
    })

    it("should handle user with missing role (defaults to USER)", async () => {
      const userWithoutRole = {
        id: "user-123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
        // role is missing, should default to USER
      }

      mockGetServerSession.mockResolvedValue({
        user: userWithoutRole,
        expires: "2024-12-31",
      } as any)

      const result = await requireRole("USER")

      expect(result.role).toBe("USER")
    })

    it("should reject user with missing role when requiring higher privileges", async () => {
      const userWithoutRole = {
        id: "user-123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
        // role is missing, should default to USER
      }

      mockGetServerSession.mockResolvedValue({
        user: userWithoutRole,
        expires: "2024-12-31",
      } as any)

      await expect(requireRole("ADMIN")).rejects.toThrow(
        "Access denied. Required role: ADMIN"
      )
    })

    it("should handle empty array of required roles", async () => {
      mockGetServerSession.mockResolvedValue({
        user: mockUserWithRole("USER"),
        expires: "2024-12-31",
      })

      // Empty array should not match any role
      await expect(requireRole([])).rejects.toThrow(
        "Access denied. Required role:"
      )
    })
  })

  describe("error handling", () => {
    it("should handle getServerSession throwing an error", async () => {
      mockGetServerSession.mockRejectedValue(new Error("Session error"))

      await expect(getCurrentUser()).rejects.toThrow("Session error")
    })

    it("should handle malformed session data", async () => {
      mockGetServerSession.mockResolvedValue({
        user: "invalid-user-data",
        expires: "2024-12-31",
      } as any)

      const result = await getCurrentUser()

      expect(result).toBe("invalid-user-data")
    })
  })

  describe("integration scenarios", () => {
    it("should work with realistic session data", async () => {
      const realisticSession = {
        user: {
          id: "clp123abc456",
          name: "Jane Smith",
          email: "jane.smith@contractor.com",
          image: "https://example.com/avatar.jpg",
          role: "CONTRACTOR",
        },
        expires: "2024-01-15T10:30:00.000Z",
      }

      mockGetServerSession.mockResolvedValue(realisticSession)

      const user = await getCurrentUser()
      const userWithRole = await getCurrentUserWithRole()
      const authUser = await requireAuth()
      const roleUser = await requireRole(["CONTRACTOR", "ADMIN"])

      expect(user).toEqual(realisticSession.user)
      expect(userWithRole).toEqual(realisticSession.user)
      expect(authUser).toEqual(realisticSession.user)
      expect(roleUser).toEqual(realisticSession.user)
    })
  })
})
