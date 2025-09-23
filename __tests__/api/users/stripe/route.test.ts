import { GET } from "@/app/api/users/stripe/route"
import {
  getResponseJson,
  assertResponse,
} from "@/__tests__/helpers/api-test-helpers"
import { getServerSession } from "next-auth/next"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { stripe } from "@/lib/stripe"

// Mock dependencies
jest.mock("next-auth/next")
jest.mock("@/lib/subscription")
jest.mock("@/lib/stripe", () => ({
  stripe: {
    billingPortal: {
      sessions: {
        create: jest.fn(),
      },
    },
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
  },
}))

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>
const mockGetUserSubscriptionPlan =
  getUserSubscriptionPlan as jest.MockedFunction<typeof getUserSubscriptionPlan>
const mockStripe = stripe as jest.Mocked<typeof stripe>

describe("/api/users/stripe", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/users/stripe", () => {
    describe("Authentication", () => {
      it("should return 403 when no session exists", async () => {
        mockGetServerSession.mockResolvedValue(null)

        const response = await GET()

        assertResponse(response, 403)
      })

      it("should return 403 when session has no user", async () => {
        mockGetServerSession.mockResolvedValue({
          user: null,
          expires: new Date().toISOString(),
        } as any)

        const response = await GET()

        assertResponse(response, 403)
      })

      it("should return 403 when user has no email", async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: "user-123" }, // No email
          expires: new Date().toISOString(),
        } as any)

        const response = await GET()

        assertResponse(response, 403)
      })
    })

    describe("Pro Plan - Billing Portal", () => {
      beforeEach(() => {
        mockGetServerSession.mockResolvedValue({
          user: { id: "user-123", email: "test@example.com" },
          expires: new Date().toISOString(),
        })
      })

      it("should create billing portal session for pro users", async () => {
        const mockSubscriptionPlan = {
          isPro: true,
          stripeCustomerId: "cus_123",
          stripeSubscriptionId: "sub_123",
          stripeCurrentPeriodEnd: Date.now() + 86400000,
          name: "PRO",
          description: "Pro plan",
          stripePriceId: "price_123",
        }
        mockGetUserSubscriptionPlan.mockResolvedValue(mockSubscriptionPlan)

        const mockPortalSession = {
          url: "https://billing.stripe.com/session/123",
        }
        ;(mockStripe.billingPortal.sessions.create as any).mockResolvedValue(
          mockPortalSession
        )

        const response = await GET()

        assertResponse(response, 200)

        const data = await getResponseJson(response)
        expect(data).toEqual({ url: "https://billing.stripe.com/session/123" })

        expect(mockStripe.billingPortal.sessions.create).toHaveBeenCalledWith({
          customer: "cus_123",
          return_url: expect.stringContaining("/dashboard/billing"),
        })
      })

      it("should handle billing portal creation errors", async () => {
        const mockSubscriptionPlan = {
          isPro: true,
          stripeCustomerId: "cus_123",
          stripeSubscriptionId: "sub_123",
          stripeCurrentPeriodEnd: Date.now() + 86400000,
          name: "PRO",
          description: "Pro plan",
          stripePriceId: "price_123",
        }
        mockGetUserSubscriptionPlan.mockResolvedValue(mockSubscriptionPlan)
        ;(mockStripe.billingPortal.sessions.create as any).mockRejectedValue(
          new Error("Stripe API error")
        )

        const response = await GET()

        assertResponse(response, 500)
      })
    })

    describe("Free Plan - Checkout Session", () => {
      beforeEach(() => {
        mockGetServerSession.mockResolvedValue({
          user: { id: "user-123", email: "test@example.com" },
          expires: new Date().toISOString(),
        })
      })

      it("should create checkout session for free users", async () => {
        const mockSubscriptionPlan = {
          isPro: false,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          stripeCurrentPeriodEnd: 0,
          name: "Free",
          description: "Free plan",
          stripePriceId: "",
        }
        mockGetUserSubscriptionPlan.mockResolvedValue(mockSubscriptionPlan)

        const mockCheckoutSession = {
          url: "https://checkout.stripe.com/session/123",
        }
        ;(mockStripe.checkout.sessions.create as any).mockResolvedValue(
          mockCheckoutSession
        )

        const response = await GET()

        assertResponse(response, 200)

        const data = await getResponseJson(response)
        expect(data).toEqual({ url: "https://checkout.stripe.com/session/123" })

        expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith({
          success_url: expect.stringContaining("/dashboard/billing"),
          cancel_url: expect.stringContaining("/dashboard/billing"),
          payment_method_types: ["card"],
          mode: "subscription",
          billing_address_collection: "auto",
          customer_email: "test@example.com",
          line_items: [
            {
              price: expect.any(String), // proPlan.stripePriceId
              quantity: 1,
            },
          ],
          metadata: {
            userId: "user-123",
          },
        })
      })

      it("should create checkout session for pro users without customer ID", async () => {
        const mockSubscriptionPlan = {
          isPro: true,
          stripeCustomerId: null, // No customer ID
          stripeSubscriptionId: null,
          stripeCurrentPeriodEnd: Date.now() + 86400000,
          name: "PRO",
          description: "Pro plan",
          stripePriceId: "price_123",
        }
        mockGetUserSubscriptionPlan.mockResolvedValue(mockSubscriptionPlan)

        const mockCheckoutSession = {
          url: "https://checkout.stripe.com/session/456",
        }
        ;(mockStripe.checkout.sessions.create as any).mockResolvedValue(
          mockCheckoutSession
        )

        const response = await GET()

        assertResponse(response, 200)

        const data = await getResponseJson(response)
        expect(data).toEqual({ url: "https://checkout.stripe.com/session/456" })

        // Should create checkout session, not billing portal
        expect(mockStripe.checkout.sessions.create).toHaveBeenCalled()
        expect(mockStripe.billingPortal.sessions.create).not.toHaveBeenCalled()
      })

      it("should handle checkout session creation errors", async () => {
        const mockSubscriptionPlan = {
          isPro: false,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          stripeCurrentPeriodEnd: 0,
          name: "Free",
          description: "Free plan",
          stripePriceId: "",
        }
        mockGetUserSubscriptionPlan.mockResolvedValue(mockSubscriptionPlan)
        ;(mockStripe.checkout.sessions.create as any).mockRejectedValue(
          new Error("Stripe checkout error")
        )

        const response = await GET()

        assertResponse(response, 500)
      })
    })

    describe("Error Handling", () => {
      beforeEach(() => {
        mockGetServerSession.mockResolvedValue({
          user: { id: "user-123", email: "test@example.com" },
          expires: new Date().toISOString(),
        })
      })

      it("should handle subscription plan retrieval errors", async () => {
        mockGetUserSubscriptionPlan.mockRejectedValue(
          new Error("User not found")
        )

        const response = await GET()

        assertResponse(response, 500)
      })

      it("should handle session retrieval errors", async () => {
        mockGetServerSession.mockRejectedValue(new Error("Session error"))

        const response = await GET()

        assertResponse(response, 500)
      })

      it("should handle unexpected errors gracefully", async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: "user-123", email: "test@example.com" },
          expires: new Date().toISOString(),
        })

        // Mock an unexpected error in getUserSubscriptionPlan
        mockGetUserSubscriptionPlan.mockImplementation(() => {
          throw new Error("Unexpected database error")
        })

        const response = await GET()

        assertResponse(response, 500)
      })
    })

    describe("Edge Cases", () => {
      beforeEach(() => {
        mockGetServerSession.mockResolvedValue({
          user: { id: "user-123", email: "test@example.com" },
          expires: new Date().toISOString(),
        })
      })

      it("should handle empty stripe customer ID", async () => {
        const mockSubscriptionPlan = {
          isPro: true,
          stripeCustomerId: "", // Empty string
          stripeSubscriptionId: null,
          stripeCurrentPeriodEnd: Date.now() + 86400000,
          name: "PRO",
          description: "Pro plan",
          stripePriceId: "price_123",
        }
        mockGetUserSubscriptionPlan.mockResolvedValue(mockSubscriptionPlan)

        const mockCheckoutSession = {
          url: "https://checkout.stripe.com/session/789",
        }
        ;(mockStripe.checkout.sessions.create as any).mockResolvedValue(
          mockCheckoutSession
        )

        const response = await GET()

        assertResponse(response, 200)

        // Should create checkout session since customer ID is empty
        expect(mockStripe.checkout.sessions.create).toHaveBeenCalled()
        expect(mockStripe.billingPortal.sessions.create).not.toHaveBeenCalled()
      })

      it("should handle special characters in user email", async () => {
        mockGetServerSession.mockResolvedValue({
          user: { id: "user-123", email: "test+special@example.com" },
          expires: new Date().toISOString(),
        })

        const mockSubscriptionPlan = {
          isPro: false,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          stripeCurrentPeriodEnd: 0,
          name: "Free",
          description: "Free plan",
          stripePriceId: "",
        }
        mockGetUserSubscriptionPlan.mockResolvedValue(mockSubscriptionPlan)

        const mockCheckoutSession = {
          url: "https://checkout.stripe.com/session/special",
        }
        ;(mockStripe.checkout.sessions.create as any).mockResolvedValue(
          mockCheckoutSession
        )

        const response = await GET()

        assertResponse(response, 200)

        expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
          expect.objectContaining({
            customer_email: "test+special@example.com",
          })
        )
      })
    })
  })
})
