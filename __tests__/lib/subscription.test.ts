/**
 * Subscription Tests
 *
 * Unit tests for subscription management functions.
 * Tests user subscription plan retrieval, pro/free tier logic, and edge cases.
 *
 * Coverage Target: 40% → 80%
 * Issue: #355 - Critical Test Coverage - Payment & Financial Security
 */

import { getUserSubscriptionPlan } from "@/lib/subscription"
import { freePlan, proPlan } from "@/config/subscriptions"

// Mock db module
jest.mock("@/lib/db", () => ({
  db: {
    user: {
      findFirst: jest.fn(),
    },
  },
}))

import { db } from "@/lib/db"

const DAY_IN_MS = 86_400_000 // 24 hours in milliseconds

describe("getUserSubscriptionPlan", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Pro User Scenarios", () => {
    it("should return pro plan for active pro user", async () => {
      // Arrange - user with active pro subscription
      const futureDate = new Date(Date.now() + 30 * DAY_IN_MS) // 30 days from now
      const mockUser = {
        stripeSubscriptionId: "sub_123",
        stripeCurrentPeriodEnd: futureDate,
        stripeCustomerId: "cus_123",
        stripePriceId: "price_123",
      }

      ;(db.user.findFirst as jest.Mock).mockResolvedValue(mockUser)

      // Act
      const result = await getUserSubscriptionPlan("user_123")

      // Assert
      expect(result.isPro).toBe(true)
      expect(result.name).toBe(proPlan.name)
      expect(result.description).toBe(proPlan.description)
      expect(result.stripePriceId).toBe(proPlan.stripePriceId)
      expect(result.stripeSubscriptionId).toBe("sub_123")
      expect(result.stripeCustomerId).toBe("cus_123")
      expect(result.stripeCurrentPeriodEnd).toBe(futureDate.getTime())

      // Verify correct user query
      expect(db.user.findFirst).toHaveBeenCalledWith({
        where: { id: "user_123" },
        select: {
          stripeSubscriptionId: true,
          stripeCurrentPeriodEnd: true,
          stripeCustomerId: true,
          stripePriceId: true,
        },
      })
    })

    it("should return pro plan for user within grace period (expires today)", async () => {
      // Arrange - subscription ends today but still in 24-hour grace period
      const today = new Date()
      const mockUser = {
        stripeSubscriptionId: "sub_123",
        stripeCurrentPeriodEnd: today,
        stripeCustomerId: "cus_123",
        stripePriceId: "price_123",
      }

      ;(db.user.findFirst as jest.Mock).mockResolvedValue(mockUser)

      // Act
      const result = await getUserSubscriptionPlan("user_123")

      // Assert - should still be pro due to DAY_IN_MS buffer
      expect(result.isPro).toBe(true)
      expect(result.name).toBe(proPlan.name)
    })

    it("should handle pro user with all Stripe fields populated", async () => {
      // Arrange
      const futureDate = new Date(Date.now() + 15 * DAY_IN_MS)
      const mockUser = {
        stripeSubscriptionId: "sub_active_123",
        stripeCurrentPeriodEnd: futureDate,
        stripeCustomerId: "cus_premium_456",
        stripePriceId: "price_pro_789",
      }

      ;(db.user.findFirst as jest.Mock).mockResolvedValue(mockUser)

      // Act
      const result = await getUserSubscriptionPlan("user_456")

      // Assert
      expect(result.isPro).toBe(true)
      expect(result.stripeSubscriptionId).toBe("sub_active_123")
      expect(result.stripeCustomerId).toBe("cus_premium_456")
    })
  })

  describe("Free User Scenarios", () => {
    it("should return free plan for user without subscription", async () => {
      // Arrange - user with no Stripe data
      const mockUser = {
        stripeSubscriptionId: null,
        stripeCurrentPeriodEnd: null,
        stripeCustomerId: null,
        stripePriceId: null,
      }

      ;(db.user.findFirst as jest.Mock).mockResolvedValue(mockUser)

      // Act
      const result = await getUserSubscriptionPlan("user_123")

      // Assert
      expect(result.isPro).toBe(false)
      expect(result.name).toBe(freePlan.name)
      expect(result.description).toBe(freePlan.description)
      expect(result.stripePriceId).toBe(freePlan.stripePriceId)
      expect(result.stripeSubscriptionId).toBeNull()
      expect(result.stripeCustomerId).toBeNull()
      expect(result.stripeCurrentPeriodEnd).toBe(0)
    })

    it("should return free plan for expired subscription", async () => {
      // Arrange - subscription expired more than 24 hours ago
      const expiredDate = new Date(Date.now() - 2 * DAY_IN_MS) // 2 days ago
      const mockUser = {
        stripeSubscriptionId: "sub_expired",
        stripeCurrentPeriodEnd: expiredDate,
        stripeCustomerId: "cus_123",
        stripePriceId: "price_123",
      }

      ;(db.user.findFirst as jest.Mock).mockResolvedValue(mockUser)

      // Act
      const result = await getUserSubscriptionPlan("user_123")

      // Assert
      expect(result.isPro).toBe(false)
      expect(result.name).toBe(freePlan.name)
      // Expired subscription data is still returned
      expect(result.stripeSubscriptionId).toBe("sub_expired")
      expect(result.stripeCustomerId).toBe("cus_123")
      expect(result.stripeCurrentPeriodEnd).toBe(expiredDate.getTime())
    })

    it("should return free plan for user with price ID but no period end", async () => {
      // Arrange - incomplete subscription data
      const mockUser = {
        stripeSubscriptionId: "sub_123",
        stripeCurrentPeriodEnd: null, // Missing period end
        stripeCustomerId: "cus_123",
        stripePriceId: "price_123",
      }

      ;(db.user.findFirst as jest.Mock).mockResolvedValue(mockUser)

      // Act
      const result = await getUserSubscriptionPlan("user_123")

      // Assert
      expect(result.isPro).toBe(false)
      expect(result.name).toBe(freePlan.name)
    })

    it("should return free plan for user with period end but no price ID", async () => {
      // Arrange - incomplete subscription data
      const futureDate = new Date(Date.now() + 30 * DAY_IN_MS)
      const mockUser = {
        stripeSubscriptionId: "sub_123",
        stripeCurrentPeriodEnd: futureDate,
        stripeCustomerId: "cus_123",
        stripePriceId: null, // Missing price ID
      }

      ;(db.user.findFirst as jest.Mock).mockResolvedValue(mockUser)

      // Act
      const result = await getUserSubscriptionPlan("user_123")

      // Assert
      expect(result.isPro).toBe(false)
      expect(result.name).toBe(freePlan.name)
    })
  })

  describe("Edge Cases and Expiration Logic", () => {
    it("should handle subscription expiring exactly 24 hours ago (boundary test)", async () => {
      // Arrange - subscription expired exactly 24 hours ago
      const exactlyOneDayAgo = new Date(Date.now() - DAY_IN_MS)
      const mockUser = {
        stripeSubscriptionId: "sub_123",
        stripeCurrentPeriodEnd: exactlyOneDayAgo,
        stripeCustomerId: "cus_123",
        stripePriceId: "price_123",
      }

      ;(db.user.findFirst as jest.Mock).mockResolvedValue(mockUser)

      // Act
      const result = await getUserSubscriptionPlan("user_123")

      // Assert - should be free (grace period ended)
      expect(result.isPro).toBe(false)
      expect(result.name).toBe(freePlan.name)
    })

    it("should handle subscription expiring in 1 second", async () => {
      // Arrange - subscription expires very soon
      const almostExpired = new Date(Date.now() + 1000) // 1 second from now
      const mockUser = {
        stripeSubscriptionId: "sub_123",
        stripeCurrentPeriodEnd: almostExpired,
        stripeCustomerId: "cus_123",
        stripePriceId: "price_123",
      }

      ;(db.user.findFirst as jest.Mock).mockResolvedValue(mockUser)

      // Act
      const result = await getUserSubscriptionPlan("user_123")

      // Assert - should still be pro (within grace period)
      expect(result.isPro).toBe(true)
      expect(result.name).toBe(proPlan.name)
    })

    it("should handle far future expiration date", async () => {
      // Arrange - subscription expires in 10 years
      const farFuture = new Date(Date.now() + 3650 * DAY_IN_MS) // 10 years
      const mockUser = {
        stripeSubscriptionId: "sub_lifetime",
        stripeCurrentPeriodEnd: farFuture,
        stripeCustomerId: "cus_123",
        stripePriceId: "price_123",
      }

      ;(db.user.findFirst as jest.Mock).mockResolvedValue(mockUser)

      // Act
      const result = await getUserSubscriptionPlan("user_123")

      // Assert
      expect(result.isPro).toBe(true)
      expect(result.stripeCurrentPeriodEnd).toBe(farFuture.getTime())
    })
  })

  describe("Null Safety and Error Handling", () => {
    it("should throw error when user not found", async () => {
      // Arrange
      ;(db.user.findFirst as jest.Mock).mockResolvedValue(null)

      // Act & Assert
      await expect(getUserSubscriptionPlan("nonexistent_user")).rejects.toThrow(
        "User not found"
      )
    })

    it("should handle null stripeCurrentPeriodEnd safely", async () => {
      // Arrange
      const mockUser = {
        stripeSubscriptionId: "sub_123",
        stripeCurrentPeriodEnd: null,
        stripeCustomerId: "cus_123",
        stripePriceId: "price_123",
      }

      ;(db.user.findFirst as jest.Mock).mockResolvedValue(mockUser)

      // Act
      const result = await getUserSubscriptionPlan("user_123")

      // Assert
      expect(result.isPro).toBe(false)
      expect(result.stripeCurrentPeriodEnd).toBe(0)
    })

    it("should handle undefined Stripe fields", async () => {
      // Arrange
      const mockUser = {
        stripeSubscriptionId: undefined,
        stripeCurrentPeriodEnd: undefined,
        stripeCustomerId: undefined,
        stripePriceId: undefined,
      }

      ;(db.user.findFirst as jest.Mock).mockResolvedValue(mockUser)

      // Act
      const result = await getUserSubscriptionPlan("user_123")

      // Assert
      expect(result.isPro).toBe(false)
      expect(result.stripeSubscriptionId).toBeUndefined()
      expect(result.stripeCustomerId).toBeUndefined()
      expect(result.stripeCurrentPeriodEnd).toBe(0)
    })

    it("should handle mix of null and undefined values", async () => {
      // Arrange
      const mockUser = {
        stripeSubscriptionId: null,
        stripeCurrentPeriodEnd: undefined,
        stripeCustomerId: "cus_123",
        stripePriceId: null,
      }

      ;(db.user.findFirst as jest.Mock).mockResolvedValue(mockUser)

      // Act
      const result = await getUserSubscriptionPlan("user_123")

      // Assert
      expect(result.isPro).toBe(false)
      expect(result.stripeCustomerId).toBe("cus_123")
      expect(result.stripeCurrentPeriodEnd).toBe(0)
    })
  })

  describe("Grace Period Logic", () => {
    it("should apply 24-hour grace period to expired subscriptions", async () => {
      // Arrange - subscription expired 12 hours ago (within grace period)
      const twelveHoursAgo = new Date(Date.now() - (DAY_IN_MS / 2))
      const mockUser = {
        stripeSubscriptionId: "sub_123",
        stripeCurrentPeriodEnd: twelveHoursAgo,
        stripeCustomerId: "cus_123",
        stripePriceId: "price_123",
      }

      ;(db.user.findFirst as jest.Mock).mockResolvedValue(mockUser)

      // Act
      const result = await getUserSubscriptionPlan("user_123")

      // Assert - should still be pro due to grace period
      expect(result.isPro).toBe(true)
      expect(result.name).toBe(proPlan.name)
    })

    it("should not apply grace period after 24 hours", async () => {
      // Arrange - subscription expired 25 hours ago (outside grace period)
      const twentyFiveHoursAgo = new Date(Date.now() - (DAY_IN_MS + 3600000))
      const mockUser = {
        stripeSubscriptionId: "sub_123",
        stripeCurrentPeriodEnd: twentyFiveHoursAgo,
        stripeCustomerId: "cus_123",
        stripePriceId: "price_123",
      }

      ;(db.user.findFirst as jest.Mock).mockResolvedValue(mockUser)

      // Act
      const result = await getUserSubscriptionPlan("user_123")

      // Assert - should be free (grace period expired)
      expect(result.isPro).toBe(false)
      expect(result.name).toBe(freePlan.name)
    })
  })
})

