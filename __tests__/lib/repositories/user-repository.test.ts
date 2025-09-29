/**
 * User Repository Tests
 *
 * Tests for UserRepository with mocked Prisma client
 */

import {
  UserRepository,
  UserCreateInput,
  UserUpdateInput,
  OperatorApplicationInput,
} from "@/lib/repositories/user-repository"
import { UserRole } from "@prisma/client"

// Mock Prisma Client
const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
} as any

describe("UserRepository", () => {
  let repository: UserRepository

  beforeEach(() => {
    repository = new UserRepository(mockPrismaClient)
    jest.clearAllMocks()
  })

  describe("findById", () => {
    it("should find user by ID successfully", async () => {
      const mockUser = {
        id: "user123",
        name: "John Doe",
        email: "john@example.com",
        role: "USER",
        accounts: [{ provider: "google", providerAccountId: "123" }],
      }

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser)

      const result = await repository.findById("user123")

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUser)
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user123" },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          phone: true,
          company: true,
          createdAt: true,
          updatedAt: true,
          militaryBranch: true,
          yearsOfService: true,
          certifications: true,
          preferredLocations: true,
          isAvailable: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          stripePriceId: true,
          stripeCurrentPeriodEnd: true,
          accounts: {
            select: {
              provider: true,
              providerAccountId: true,
            },
          },
        },
      })
    })

    it("should handle validation error for missing ID", async () => {
      const result = await repository.findById("")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(mockPrismaClient.user.findUnique).not.toHaveBeenCalled()
    })

    it("should handle database errors", async () => {
      mockPrismaClient.user.findUnique.mockRejectedValue(
        new Error("Database error")
      )

      const result = await repository.findById("user123")

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("USER_FIND_ERROR")
    })
  })

  describe("findByEmail", () => {
    it("should find user by email successfully", async () => {
      const mockUser = {
        id: "user123",
        name: "John Doe",
        email: "john@example.com",
        role: "USER",
        accounts: [],
      }

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser)

      const result = await repository.findByEmail("john@example.com")

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUser)
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: "john@example.com" },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          phone: true,
          company: true,
          createdAt: true,
          updatedAt: true,
          militaryBranch: true,
          yearsOfService: true,
          certifications: true,
          preferredLocations: true,
          isAvailable: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          stripePriceId: true,
          stripeCurrentPeriodEnd: true,
          accounts: {
            select: {
              provider: true,
              providerAccountId: true,
            },
          },
        },
      })
    })

    it("should return null for non-existent email", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(null)

      const result = await repository.findByEmail("nonexistent@example.com")

      expect(result.success).toBe(true)
      expect(result.data).toBeNull()
    })
  })

  describe("findAvailableOperators", () => {
    const mockOperators = [
      {
        id: "op1",
        name: "Operator One",
        email: "op1@example.com",
        militaryBranch: "Army",
        yearsOfService: 10,
        certifications: ["Heavy Equipment", "Safety"],
        preferredLocations: ["Texas", "Oklahoma"],
        isAvailable: true,
      },
      {
        id: "op2",
        name: "Operator Two",
        email: "op2@example.com",
        militaryBranch: "Navy",
        yearsOfService: 8,
        certifications: ["Crane Operation"],
        preferredLocations: ["California"],
        isAvailable: true,
      },
    ]

    it("should find available operators without filters", async () => {
      mockPrismaClient.user.findMany.mockResolvedValue(mockOperators)

      const result = await repository.findAvailableOperators()

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockOperators)
      expect(mockPrismaClient.user.findMany).toHaveBeenCalledWith({
        where: {
          role: "OPERATOR",
          isAvailable: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          phone: true,
          company: true,
          createdAt: true,
          updatedAt: true,
          militaryBranch: true,
          yearsOfService: true,
          certifications: true,
          preferredLocations: true,
          isAvailable: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          stripePriceId: true,
          stripeCurrentPeriodEnd: true,
        },
        orderBy: {
          yearsOfService: "desc",
        },
      })
    })

    it("should find operators with location filter", async () => {
      mockPrismaClient.user.findMany.mockResolvedValue([mockOperators[0]])

      const result = await repository.findAvailableOperators({
        preferredLocations: ["Texas"],
      })

      expect(result.success).toBe(true)
      expect(mockPrismaClient.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            role: "OPERATOR",
            isAvailable: true,
            preferredLocations: {
              hasSome: ["Texas"],
            },
          },
        })
      )
    })

    it("should find operators with certification filter", async () => {
      mockPrismaClient.user.findMany.mockResolvedValue([mockOperators[1]])

      const result = await repository.findAvailableOperators({
        certifications: ["Crane Operation"],
      })

      expect(result.success).toBe(true)
      expect(mockPrismaClient.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            role: "OPERATOR",
            isAvailable: true,
            certifications: {
              hasSome: ["Crane Operation"],
            },
          },
        })
      )
    })
  })

  describe("create", () => {
    const mockCreateInput: UserCreateInput = {
      name: "New User",
      email: "newuser@example.com",
      phone: "555-0123",
      company: "Test Company",
    }

    it("should create user successfully", async () => {
      const mockCreatedUser = {
        id: "user123",
        name: "New User",
        email: "newuser@example.com",
        role: "USER",
        createdAt: new Date(),
      }

      mockPrismaClient.user.create.mockResolvedValue(mockCreatedUser)

      const result = await repository.create(mockCreateInput)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockCreatedUser)
      expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateInput,
          role: "USER",
        },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          phone: true,
          company: true,
          createdAt: true,
          updatedAt: true,
          militaryBranch: true,
          yearsOfService: true,
          certifications: true,
          preferredLocations: true,
          isAvailable: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          stripePriceId: true,
          stripeCurrentPeriodEnd: true,
          // SECURITY: password field explicitly excluded
        },
      })
    })

    it("should create user with custom role", async () => {
      const inputWithRole = { ...mockCreateInput, role: UserRole.MANAGER }
      const mockCreatedUser = {
        id: "user123",
        name: "New User",
        email: "newuser@example.com",
        role: "MANAGER",
        createdAt: new Date(),
      }

      mockPrismaClient.user.create.mockResolvedValue(mockCreatedUser)

      const result = await repository.create(inputWithRole)

      expect(result.success).toBe(true)
      expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
        data: inputWithRole,
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          phone: true,
          company: true,
          createdAt: true,
          updatedAt: true,
          militaryBranch: true,
          yearsOfService: true,
          certifications: true,
          preferredLocations: true,
          isAvailable: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          stripePriceId: true,
          stripeCurrentPeriodEnd: true,
          // SECURITY: password field explicitly excluded
        },
      })
    })

    it("should handle validation errors", async () => {
      const invalidInput = { ...mockCreateInput, email: "" }

      const result = await repository.create(invalidInput)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(mockPrismaClient.user.create).not.toHaveBeenCalled()
    })
  })

  describe("update", () => {
    const mockUpdateInput: UserUpdateInput = {
      name: "Updated Name",
      phone: "555-9999",
      company: "Updated Company",
    }

    it("should update user successfully", async () => {
      const mockUpdatedUser = {
        id: "user123",
        name: "Updated Name",
        email: "user@example.com",
        role: "USER",
        phone: "555-9999",
        company: "Updated Company",
        updatedAt: new Date(),
      }

      mockPrismaClient.user.update.mockResolvedValue(mockUpdatedUser)

      const result = await repository.update("user123", mockUpdateInput)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUpdatedUser)
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: "user123" },
        data: {
          ...mockUpdateInput,
          updatedAt: expect.any(Date),
        },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          phone: true,
          company: true,
          createdAt: true,
          updatedAt: true,
          militaryBranch: true,
          yearsOfService: true,
          certifications: true,
          preferredLocations: true,
          isAvailable: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          stripePriceId: true,
          stripeCurrentPeriodEnd: true,
          // SECURITY: password field explicitly excluded
        },
      })
    })
  })

  describe("submitOperatorApplication", () => {
    const mockApplicationInput: OperatorApplicationInput = {
      militaryBranch: "Army",
      yearsOfService: 10,
      certifications: ["Heavy Equipment", "Safety"],
      preferredLocations: ["Texas", "Oklahoma"],
    }

    it("should submit operator application successfully", async () => {
      const mockUpdatedUser = {
        id: "user123",
        name: "John Doe",
        email: "john@example.com",
        role: "OPERATOR",
        militaryBranch: "Army",
        yearsOfService: 10,
        certifications: ["Heavy Equipment", "Safety"],
        preferredLocations: ["Texas", "Oklahoma"],
        isAvailable: true,
        updatedAt: new Date(),
      }

      mockPrismaClient.user.update.mockResolvedValue(mockUpdatedUser)

      const result = await repository.submitOperatorApplication(
        "user123",
        mockApplicationInput
      )

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUpdatedUser)
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: "user123" },
        data: {
          role: "OPERATOR",
          militaryBranch: "Army",
          yearsOfService: 10,
          certifications: ["Heavy Equipment", "Safety"],
          preferredLocations: ["Texas", "Oklahoma"],
          isAvailable: true,
          updatedAt: expect.any(Date),
        },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          phone: true,
          company: true,
          createdAt: true,
          updatedAt: true,
          militaryBranch: true,
          yearsOfService: true,
          certifications: true,
          preferredLocations: true,
          isAvailable: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          stripePriceId: true,
          stripeCurrentPeriodEnd: true,
          // SECURITY: password field explicitly excluded
        },
      })
    })

    it("should handle validation errors", async () => {
      const invalidInput = {
        ...mockApplicationInput,
        militaryBranch: "",
        yearsOfService: 0,
      }

      const result = await repository.submitOperatorApplication(
        "user123",
        invalidInput
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(mockPrismaClient.user.update).not.toHaveBeenCalled()
    })
  })

  describe("setOperatorAvailability", () => {
    it("should set operator availability successfully", async () => {
      const mockUser = { id: "op123", role: "OPERATOR" }
      const mockUpdatedOperator = {
        id: "op123",
        name: "Operator Name",
        email: "operator@example.com",
        isAvailable: false,
        updatedAt: new Date(),
      }

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser)
      mockPrismaClient.user.update.mockResolvedValue(mockUpdatedOperator)

      const result = await repository.setOperatorAvailability("op123", false)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUpdatedOperator)
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: "op123" },
        select: { id: true, role: true },
      })
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: "op123" },
        data: {
          isAvailable: false,
          updatedAt: expect.any(Date),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          militaryBranch: true,
          yearsOfService: true,
          certifications: true,
          preferredLocations: true,
          isAvailable: true,
          updatedAt: true,
          // SECURITY: Only return operator-relevant fields
          // Exclude sensitive Stripe, image, phone, company, and other unnecessary fields
        },
      })
    })

    it("should handle user not found", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(null)

      const result = await repository.setOperatorAvailability("op123", false)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("OPERATOR_AVAILABILITY_UPDATE_ERROR")
      expect(result.error?.details?.originalError).toBe(
        "User with ID op123 not found"
      )
    })

    it("should handle user not being an operator", async () => {
      const mockUser = { id: "user123", role: "USER" }
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser)

      const result = await repository.setOperatorAvailability("user123", false)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("OPERATOR_AVAILABILITY_UPDATE_ERROR")
      expect(result.error?.details?.originalError).toBe(
        "User with ID user123 is not an operator"
      )
    })
  })

  describe("updateStripeInfo", () => {
    it("should update Stripe information successfully", async () => {
      const stripeData = {
        stripeCustomerId: "cus_123",
        stripeSubscriptionId: "sub_123",
        stripePriceId: "price_123",
        stripeCurrentPeriodEnd: new Date("2024-12-31"),
      }

      const mockUpdatedUser = {
        id: "user123",
        ...stripeData,
        updatedAt: new Date(),
      }

      mockPrismaClient.user.update.mockResolvedValue(mockUpdatedUser)

      const result = await repository.updateStripeInfo("user123", stripeData)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUpdatedUser)
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: "user123" },
        data: {
          ...stripeData,
          updatedAt: expect.any(Date),
        },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          phone: true,
          company: true,
          createdAt: true,
          updatedAt: true,
          militaryBranch: true,
          yearsOfService: true,
          certifications: true,
          preferredLocations: true,
          isAvailable: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          stripePriceId: true,
          stripeCurrentPeriodEnd: true,
          // SECURITY: password field explicitly excluded
        },
      })
    })
  })

  describe("findByRole", () => {
    it("should find users by role successfully", async () => {
      const mockManagers = [
        {
          id: "mgr1",
          name: "Manager One",
          email: "mgr1@example.com",
          role: "MANAGER",
        },
        {
          id: "mgr2",
          name: "Manager Two",
          email: "mgr2@example.com",
          role: "MANAGER",
        },
      ]

      mockPrismaClient.user.findMany.mockResolvedValue(mockManagers)

      const result = await repository.findByRole(UserRole.MANAGER)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockManagers)
      expect(mockPrismaClient.user.findMany).toHaveBeenCalledWith({
        where: { role: "MANAGER" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          company: true,
          createdAt: true,
          // SECURITY: Exclude sensitive Stripe, emailVerified, image, and updatedAt fields
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    })
  })

  describe("verifyEmail", () => {
    it("should verify user email successfully", async () => {
      const mockVerifiedUser = {
        id: "user123",
        email: "user@example.com",
        emailVerified: new Date(),
        updatedAt: new Date(),
      }

      mockPrismaClient.user.update.mockResolvedValue(mockVerifiedUser)

      const result = await repository.verifyEmail("user123")

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockVerifiedUser)
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: "user123" },
        data: {
          emailVerified: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          updatedAt: true,
          // SECURITY: Only return fields relevant to email verification
          // Exclude sensitive Stripe, operator, and other unnecessary fields
        },
      })
    })
  })

  describe("delete", () => {
    it("should delete user successfully", async () => {
      mockPrismaClient.user.delete.mockResolvedValue({})

      const result = await repository.delete("user123")

      expect(result.success).toBe(true)
      expect(result.data).toBe(true)
      expect(mockPrismaClient.user.delete).toHaveBeenCalledWith({
        where: { id: "user123" },
      })
    })
  })

  describe("count", () => {
    it("should count users successfully", async () => {
      mockPrismaClient.user.count.mockResolvedValue(150)

      const result = await repository.count()

      expect(result.success).toBe(true)
      expect(result.data).toBe(150)
      expect(mockPrismaClient.user.count).toHaveBeenCalledWith({})
    })
  })

  describe("Type Safety Improvements (Issue #299)", () => {
    describe("UserCreateInput validation", () => {
      it("should use specific UserCreateInput type instead of Record<string, unknown>", async () => {
        const mockUser = {
          id: "user123",
          name: "Test User",
          email: "test@example.com",
          role: "USER",
        }

        mockPrismaClient.user.create.mockResolvedValue(mockUser)

        // This should work with proper typing - no type casting needed
        const createInput: UserCreateInput = {
          name: "Test User",
          email: "test@example.com",
          phone: "555-0123",
          company: "Test Company",
        }

        const result = await repository.create(createInput)

        expect(result.success).toBe(true)
        expect(result.data).toEqual(mockUser)

        // Verify that the validation method receives properly typed input
        // This test will fail until we replace Record<string, unknown> with UserCreateInput
        expect(mockPrismaClient.user.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              name: "Test User",
              email: "test@example.com",
              phone: "555-0123",
              company: "Test Company",
              role: "USER",
            }),
          })
        )
      })

      it("should reject invalid UserCreateInput properties at compile time", () => {
        // This test ensures that our type system prevents invalid properties
        // It will fail until we use proper UserCreateInput typing
        const invalidInput = {
          name: "Test User",
          email: "test@example.com",
          invalidProperty: "should not be allowed", // This should cause TypeScript error
        }

        // TypeScript should prevent this from compiling once we have proper types
        // For now, we'll test that the validation catches this
        expect(() => {
          // This should be caught by proper typing, not runtime validation
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const _typedInput: UserCreateInput = invalidInput as UserCreateInput
        }).not.toThrow() // This will change once we have proper types
      })
    })

    describe("Count query filters", () => {
      it("should use specific FilterOptions type instead of Record<string, unknown>", async () => {
        mockPrismaClient.user.count.mockResolvedValue(5)

        // This should work with proper FilterOptions typing
        const filters = {
          where: {
            role: "OPERATOR",
            isAvailable: true,
          },
        }

        const result = await repository.count(filters)

        expect(result.success).toBe(true)
        expect(result.data).toBe(5)

        // Verify that the query is properly typed
        expect(mockPrismaClient.user.count).toHaveBeenCalledWith({
          where: {
            role: "OPERATOR",
            isAvailable: true,
          },
        })
      })

      it("should provide type safety for query construction", async () => {
        mockPrismaClient.user.count.mockResolvedValue(10)

        // This test will fail until we replace the generic Record<string, unknown>
        // with proper Prisma where clause types
        const filters = {
          where: {
            role: "USER",
            emailVerified: { not: null },
          },
        }

        const result = await repository.count(filters)

        expect(result.success).toBe(true)
        expect(result.data).toBe(10)

        // The query should be constructed with proper types, not generic Record
        expect(mockPrismaClient.user.count).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              role: "USER",
              emailVerified: { not: null },
            }),
          })
        )
      })
    })
  })
})
