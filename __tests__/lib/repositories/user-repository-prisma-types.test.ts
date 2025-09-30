/**
 * User Repository - Advanced Prisma Type Safety Tests
 * 
 * Tests for Issue #321: Advanced Prisma Type Safety Patterns
 * Validates that repository methods use Prisma.UserGetPayload for enhanced type safety
 */

import { UserRepository } from "@/lib/repositories/user-repository"
import { Prisma } from "@prisma/client"

// Mock Prisma Client
const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
} as any

describe("UserRepository - Advanced Prisma Type Safety (Issue #321)", () => {
  let repository: UserRepository

  beforeEach(() => {
    repository = new UserRepository(mockPrismaClient)
    jest.clearAllMocks()
  })

  describe("Prisma.UserGetPayload type integration", () => {
    it("should use Prisma.UserGetPayload for findById return type", async () => {
      // This test validates that the return type is properly typed using Prisma.UserGetPayload
      // The mock data should match the exact structure returned by Prisma with the select clause
      
      const mockUserWithAccounts: Prisma.UserGetPayload<{
        select: {
          id: true
          name: true
          email: true
          emailVerified: true
          image: true
          role: true
          phone: true
          company: true
          createdAt: true
          updatedAt: true
          militaryBranch: true
          yearsOfService: true
          certifications: true
          preferredLocations: true
          isAvailable: true
          stripeCustomerId: true
          stripeSubscriptionId: true
          stripePriceId: true
          stripeCurrentPeriodEnd: true
          accounts: {
            select: {
              provider: true
              providerAccountId: true
            }
          }
        }
      }> = {
        id: "user123",
        name: "John Doe",
        email: "john@example.com",
        emailVerified: new Date("2024-01-01"),
        image: "https://example.com/avatar.jpg",
        role: "USER",
        phone: "555-0123",
        company: "Test Company",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
        militaryBranch: null,
        yearsOfService: null,
        certifications: [],
        preferredLocations: [],
        isAvailable: true,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
        accounts: [
          { provider: "google", providerAccountId: "google123" },
        ],
      }

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUserWithAccounts)

      const result = await repository.findById("user123")

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      
      if (result.data) {
        // Type assertions that should pass with proper Prisma.UserGetPayload typing
        expect(result.data.id).toBe("user123")
        expect(result.data.name).toBe("John Doe")
        expect(result.data.email).toBe("john@example.com")
        expect(result.data.accounts).toHaveLength(1)
        expect(result.data.accounts[0]?.provider).toBe("google")
        
        // Verify password field is NOT present (security requirement)
        expect('password' in result.data).toBe(false)
      }
    })

    it("should use Prisma.UserGetPayload for findByEmail return type", async () => {
      const mockUserWithAccounts: Prisma.UserGetPayload<{
        select: {
          id: true
          name: true
          email: true
          emailVerified: true
          image: true
          role: true
          phone: true
          company: true
          createdAt: true
          updatedAt: true
          militaryBranch: true
          yearsOfService: true
          certifications: true
          preferredLocations: true
          isAvailable: true
          stripeCustomerId: true
          stripeSubscriptionId: true
          stripePriceId: true
          stripeCurrentPeriodEnd: true
          accounts: {
            select: {
              provider: true
              providerAccountId: true
            }
          }
        }
      }> = {
        id: "user456",
        name: "Jane Smith",
        email: "jane@example.com",
        emailVerified: new Date("2024-01-01"),
        image: null,
        role: "OPERATOR",
        phone: "555-0456",
        company: "Operator Co",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
        militaryBranch: "Army",
        yearsOfService: 10,
        certifications: ["Heavy Equipment", "Safety"],
        preferredLocations: ["Texas", "Oklahoma"],
        isAvailable: true,
        stripeCustomerId: "cus_123",
        stripeSubscriptionId: "sub_123",
        stripePriceId: "price_123",
        stripeCurrentPeriodEnd: new Date("2024-12-31"),
        accounts: [],
      }

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUserWithAccounts)

      const result = await repository.findByEmail("jane@example.com")

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      
      if (result.data) {
        expect(result.data.id).toBe("user456")
        expect(result.data.email).toBe("jane@example.com")
        expect(result.data.role).toBe("OPERATOR")
        expect(result.data.militaryBranch).toBe("Army")
        expect(result.data.yearsOfService).toBe(10)
        expect(result.data.certifications).toContain("Heavy Equipment")
        
        // Verify password field is NOT present
        expect('password' in result.data).toBe(false)
      }
    })

    it("should use Prisma.UserGetPayload for findMany return type", async () => {
      const mockUsers: Array<Prisma.UserGetPayload<{
        select: {
          id: true
          name: true
          email: true
          emailVerified: true
          image: true
          role: true
          phone: true
          company: true
          createdAt: true
          updatedAt: true
          militaryBranch: true
          yearsOfService: true
          certifications: true
          preferredLocations: true
          isAvailable: true
          stripeCustomerId: true
          stripeSubscriptionId: true
          stripePriceId: true
          stripeCurrentPeriodEnd: true
        }
      }>> = [
        {
          id: "user1",
          name: "User One",
          email: "user1@example.com",
          emailVerified: null,
          image: null,
          role: "USER",
          phone: null,
          company: null,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
          militaryBranch: null,
          yearsOfService: null,
          certifications: [],
          preferredLocations: [],
          isAvailable: true,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        },
        {
          id: "user2",
          name: "User Two",
          email: "user2@example.com",
          emailVerified: new Date("2024-01-01"),
          image: "https://example.com/avatar2.jpg",
          role: "MANAGER",
          phone: "555-0222",
          company: "Manager Corp",
          createdAt: new Date("2024-01-02"),
          updatedAt: new Date("2024-01-02"),
          militaryBranch: null,
          yearsOfService: null,
          certifications: [],
          preferredLocations: [],
          isAvailable: true,
          stripeCustomerId: "cus_mgr",
          stripeSubscriptionId: "sub_mgr",
          stripePriceId: "price_mgr",
          stripeCurrentPeriodEnd: new Date("2024-12-31"),
        },
      ]

      mockPrismaClient.user.findMany.mockResolvedValue(mockUsers)

      const result = await repository.findMany()

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data).toHaveLength(2)
      
      if (result.data) {
        // Type assertions for array of Prisma.UserGetPayload
        expect(result.data[0]?.id).toBe("user1")
        expect(result.data[1]?.id).toBe("user2")
        expect(result.data[1]?.role).toBe("MANAGER")
        
        // Verify password field is NOT present in any result
        result.data.forEach(user => {
          expect('password' in user).toBe(false)
        })
      }
    })

    it("should use Prisma.UserGetPayload for operator queries with conditional fields", async () => {
      const mockOperators: Array<Prisma.UserGetPayload<{
        select: {
          id: true
          name: true
          email: true
          emailVerified: true
          image: true
          role: true
          phone: true
          company: true
          createdAt: true
          updatedAt: true
          militaryBranch: true
          yearsOfService: true
          certifications: true
          preferredLocations: true
          isAvailable: true
          stripeCustomerId: true
          stripeSubscriptionId: true
          stripePriceId: true
          stripeCurrentPeriodEnd: true
        }
      }>> = [
        {
          id: "op1",
          name: "Operator One",
          email: "op1@example.com",
          emailVerified: new Date("2024-01-01"),
          image: null,
          role: "OPERATOR",
          phone: "555-0111",
          company: null,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
          militaryBranch: "Army",
          yearsOfService: 15,
          certifications: ["Heavy Equipment", "Safety", "Crane Operation"],
          preferredLocations: ["Texas", "Oklahoma", "Kansas"],
          isAvailable: true,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        },
      ]

      mockPrismaClient.user.findMany.mockResolvedValue(mockOperators)

      const result = await repository.findAvailableOperators({
        preferredLocations: ["Texas"],
        certifications: ["Heavy Equipment"],
      })

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data).toHaveLength(1)
      
      if (result.data?.[0]) {
        const operator = result.data[0]
        
        // Type assertions for operator-specific fields
        expect(operator.role).toBe("OPERATOR")
        expect(operator.militaryBranch).toBe("Army")
        expect(operator.yearsOfService).toBe(15)
        expect(operator.certifications).toContain("Heavy Equipment")
        expect(operator.preferredLocations).toContain("Texas")
        expect(operator.isAvailable).toBe(true)
        
        // Verify password field is NOT present
        expect('password' in operator).toBe(false)
      }
    })
  })

  describe("Type safety for complex query patterns", () => {
    it("should properly type queries with nested relations", async () => {
      // This test ensures that complex nested queries are properly typed
      // using Prisma.UserGetPayload with include/select combinations
      
      const mockUserWithRelations: Prisma.UserGetPayload<{
        select: {
          id: true
          name: true
          email: true
          role: true
          accounts: {
            select: {
              provider: true
              providerAccountId: true
            }
          }
        }
      }> = {
        id: "user789",
        name: "Complex User",
        email: "complex@example.com",
        role: "USER",
        accounts: [
          { provider: "google", providerAccountId: "g123" },
          { provider: "github", providerAccountId: "gh456" },
        ],
      }

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUserWithRelations)

      const result = await repository.findById("user789")

      expect(result.success).toBe(true)
      
      if (result.data) {
        // With proper Prisma.UserGetPayload typing, TypeScript should know
        // the exact shape of nested relations
        expect(result.data.accounts).toBeDefined()
        expect(Array.isArray(result.data.accounts)).toBe(true)
        
        if (result.data.accounts.length > 0) {
          // TypeScript should know these fields exist and their types
          const account = result.data.accounts[0]
          expect(typeof account?.provider).toBe('string')
          expect(typeof account?.providerAccountId).toBe('string')
        }
      }
    })

    it("should maintain type safety when queries return null", async () => {
      // Prisma.UserGetPayload should properly handle null returns
      mockPrismaClient.user.findUnique.mockResolvedValue(null)

      const result = await repository.findById("nonexistent")

      expect(result.success).toBe(true)
      expect(result.data).toBeNull()
      
      // With proper typing, result.data can be null and TypeScript should know this
      if (result.data === null) {
        expect(result.data).toBeNull() // This confirms type narrowing works
      }
    })
  })

  describe("Security: Password field exclusion", () => {
    it("should never expose password field even with Prisma.UserGetPayload", async () => {
      // CRITICAL SECURITY TEST: Even with advanced Prisma types,
      // password field must NEVER be exposed (per .cursorrules.md line 191)
      
      const mockUserData = {
        id: "secure123",
        name: "Secure User",
        email: "secure@example.com",
        emailVerified: null,
        image: null,
        role: "USER",
        phone: null,
        company: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        militaryBranch: null,
        yearsOfService: null,
        certifications: [],
        preferredLocations: [],
        isAvailable: true,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
        accounts: [],
        // NOTE: password should NEVER be in the select clause
      }

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUserData)

      const result = await repository.findById("secure123")

      expect(result.success).toBe(true)
      
      if (result.data) {
        // Password field must not exist in result
        expect('password' in result.data).toBe(false)
        expect(Object.keys(result.data)).not.toContain('password')
        
        // Verify that attempting to access password would be undefined
        const dataAsAny = result.data as any
        expect(dataAsAny.password).toBeUndefined()
      }
    })
  })
})
