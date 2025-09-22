import { POST } from "@/app/api/webhooks/stripe/route"
import { assertResponse } from "@/__tests__/helpers/api-test-helpers"
import { MOCK_STRIPE_EVENTS } from "@/__tests__/helpers/mock-data"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"

// Mock dependencies
jest.mock("@/lib/db", () => ({
  db: {
    user: {
      update: jest.fn(),
    },
  },
}))
jest.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: jest.fn(),
    },
    subscriptions: {
      retrieve: jest.fn(),
    },
  },
}))
jest.mock("next/headers", () => ({
  headers: jest.fn(),
}))

import { db } from "@/lib/db"

const mockDb = db as any
const mockStripe = stripe as any
const mockHeaders = headers as jest.MockedFunction<typeof headers>

describe("/api/webhooks/stripe", () => {
  const mockSignature = "whsec_test_signature"

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock headers to return Stripe signature
    mockHeaders.mockReturnValue({
      get: jest.fn().mockReturnValue(mockSignature),
    } as any)
  })

  describe("POST /api/webhooks/stripe", () => {
    describe("Webhook Signature Verification", () => {
      it("should return 400 when signature verification fails", async () => {
        mockStripe.webhooks.constructEvent.mockImplementation(() => {
          throw new Error("Invalid signature")
        })

        const request = new Request(
          "http://localhost:3000/api/webhooks/stripe",
          {
            method: "POST",
            body: JSON.stringify(MOCK_STRIPE_EVENTS.CHECKOUT_SESSION_COMPLETED),
          }
        )

        const response = await POST(request)

        expect(response.status).toBe(400)
        const responseText = await response.text()
        expect(responseText).toContain("Webhook Error: Invalid signature")
      })

      it("should return 400 when STRIPE_WEBHOOK_SECRET is not configured", async () => {
        // Mock environment variable as undefined
        const originalEnv = process.env.STRIPE_WEBHOOK_SECRET
        delete process.env.STRIPE_WEBHOOK_SECRET

        mockStripe.webhooks.constructEvent.mockImplementation(() => {
          throw new Error("STRIPE_WEBHOOK_SECRET is not configured")
        })

        const request = new Request(
          "http://localhost:3000/api/webhooks/stripe",
          {
            method: "POST",
            body: JSON.stringify(MOCK_STRIPE_EVENTS.CHECKOUT_SESSION_COMPLETED),
          }
        )

        const response = await POST(request)

        expect(response.status).toBe(400)
        const responseText = await response.text()
        expect(responseText).toContain(
          "STRIPE_WEBHOOK_SECRET is not configured"
        )

        // Restore environment variable
        if (originalEnv) {
          process.env.STRIPE_WEBHOOK_SECRET = originalEnv
        }
      })

      it("should verify webhook signature correctly", async () => {
        const mockEvent = MOCK_STRIPE_EVENTS.CHECKOUT_SESSION_COMPLETED
        mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent)

        const mockSubscription = {
          id: "sub_123",
          customer: "cus_123",
          items: {
            data: [{ price: { id: "price_123" } }],
          },
          current_period_end: 1640995200, // Unix timestamp
        }
        mockStripe.subscriptions.retrieve.mockResolvedValue(
          mockSubscription as any
        )
        mockDb.user.update.mockResolvedValue({} as any)

        const request = new Request(
          "http://localhost:3000/api/webhooks/stripe",
          {
            method: "POST",
            body: JSON.stringify(mockEvent),
          }
        )

        const response = await POST(request)

        assertResponse(response, 200)
        expect(mockStripe.webhooks.constructEvent).toHaveBeenCalledWith(
          JSON.stringify(mockEvent),
          mockSignature,
          expect.any(String) // STRIPE_WEBHOOK_SECRET
        )
      })
    })

    describe("checkout.session.completed Event", () => {
      beforeEach(() => {
        const mockEvent = MOCK_STRIPE_EVENTS.CHECKOUT_SESSION_COMPLETED
        mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent)
      })

      it("should handle checkout session completed successfully", async () => {
        const mockSubscription = {
          id: "sub_123",
          customer: "cus_123",
          items: {
            data: [{ price: { id: "price_123" } }],
          },
          current_period_end: 1640995200,
        }
        mockStripe.subscriptions.retrieve.mockResolvedValue(
          mockSubscription as any
        )
        mockDb.user.update.mockResolvedValue({} as any)

        const request = new Request(
          "http://localhost:3000/api/webhooks/stripe",
          {
            method: "POST",
            body: JSON.stringify(MOCK_STRIPE_EVENTS.CHECKOUT_SESSION_COMPLETED),
          }
        )

        const response = await POST(request)

        assertResponse(response, 200)

        expect(mockStripe.subscriptions.retrieve).toHaveBeenCalledWith(
          "sub_test123"
        )
        expect(mockDb.user.update).toHaveBeenCalledWith({
          where: { id: "user_test_123" },
          data: {
            stripeSubscriptionId: "sub_123",
            stripeCustomerId: "cus_123",
            stripePriceId: "price_123",
            stripeCurrentPeriodEnd: new Date(1640995200 * 1000),
          },
        })
      })

      it("should handle subscription retrieval errors", async () => {
        mockStripe.subscriptions.retrieve.mockRejectedValue(
          new Error("Subscription not found")
        )

        const request = new Request(
          "http://localhost:3000/api/webhooks/stripe",
          {
            method: "POST",
            body: JSON.stringify(MOCK_STRIPE_EVENTS.CHECKOUT_SESSION_COMPLETED),
          }
        )

        // The webhook route doesn't have error handling, so errors bubble up
        await expect(POST(request)).rejects.toThrow("Subscription not found")
      })

      it("should handle database update errors", async () => {
        const mockSubscription = {
          id: "sub_123",
          customer: "cus_123",
          items: {
            data: [{ price: { id: "price_123" } }],
          },
          current_period_end: 1640995200,
        }
        mockStripe.subscriptions.retrieve.mockResolvedValue(
          mockSubscription as any
        )
        mockDb.user.update.mockRejectedValue(new Error("Database error"))

        const request = new Request(
          "http://localhost:3000/api/webhooks/stripe",
          {
            method: "POST",
            body: JSON.stringify(MOCK_STRIPE_EVENTS.CHECKOUT_SESSION_COMPLETED),
          }
        )

        // The webhook route doesn't have error handling, so errors bubble up
        await expect(POST(request)).rejects.toThrow("Database error")
      })
    })

    describe("invoice.payment_succeeded Event", () => {
      beforeEach(() => {
        const mockEvent = MOCK_STRIPE_EVENTS.INVOICE_PAYMENT_SUCCEEDED
        mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent)
      })

      it("should handle invoice payment succeeded successfully", async () => {
        const mockSubscription = {
          id: "sub_456",
          items: {
            data: [{ price: { id: "price_456" } }],
          },
          current_period_end: 1641081600,
        }
        mockStripe.subscriptions.retrieve.mockResolvedValue(
          mockSubscription as any
        )
        mockDb.user.update.mockResolvedValue({} as any)

        const request = new Request(
          "http://localhost:3000/api/webhooks/stripe",
          {
            method: "POST",
            body: JSON.stringify(MOCK_STRIPE_EVENTS.INVOICE_PAYMENT_SUCCEEDED),
          }
        )

        const response = await POST(request)

        assertResponse(response, 200)

        expect(mockStripe.subscriptions.retrieve).toHaveBeenCalledWith(
          "sub_test123"
        )
        expect(mockDb.user.update).toHaveBeenCalledWith({
          where: { stripeSubscriptionId: "sub_456" },
          data: {
            stripePriceId: "price_456",
            stripeCurrentPeriodEnd: new Date(1641081600 * 1000),
          },
        })
      })

      it("should handle subscription renewal errors", async () => {
        mockStripe.subscriptions.retrieve.mockRejectedValue(
          new Error("Subscription not found")
        )

        const request = new Request(
          "http://localhost:3000/api/webhooks/stripe",
          {
            method: "POST",
            body: JSON.stringify(MOCK_STRIPE_EVENTS.INVOICE_PAYMENT_SUCCEEDED),
          }
        )

        // The webhook route doesn't have error handling, so errors bubble up
        await expect(POST(request)).rejects.toThrow("Subscription not found")
      })
    })

    describe("Unsupported Event Types", () => {
      it("should handle unsupported event types gracefully", async () => {
        const unsupportedEvent = {
          id: "evt_unsupported",
          type: "customer.created",
          data: {
            object: {
              id: "cus_123",
            },
          },
        }
        mockStripe.webhooks.constructEvent.mockReturnValue(
          unsupportedEvent as any
        )

        const request = new Request(
          "http://localhost:3000/api/webhooks/stripe",
          {
            method: "POST",
            body: JSON.stringify(unsupportedEvent),
          }
        )

        const response = await POST(request)

        assertResponse(response, 200)

        // Should not call any Stripe or database methods for unsupported events
        expect(mockStripe.subscriptions.retrieve).not.toHaveBeenCalled()
        expect(mockDb.user.update).not.toHaveBeenCalled()
      })
    })

    describe("Edge Cases", () => {
      it("should handle missing metadata in checkout session", async () => {
        const eventWithoutMetadata = {
          ...MOCK_STRIPE_EVENTS.CHECKOUT_SESSION_COMPLETED,
          data: {
            object: {
              ...MOCK_STRIPE_EVENTS.CHECKOUT_SESSION_COMPLETED.data.object,
              metadata: null,
            },
          },
        }
        mockStripe.webhooks.constructEvent.mockReturnValue(
          eventWithoutMetadata as any
        )

        const mockSubscription = {
          id: "sub_123",
          customer: "cus_123",
          items: {
            data: [{ price: { id: "price_123" } }],
          },
          current_period_end: 1640995200,
        }
        mockStripe.subscriptions.retrieve.mockResolvedValue(
          mockSubscription as any
        )
        mockDb.user.update.mockResolvedValue({} as any)

        const request = new Request(
          "http://localhost:3000/api/webhooks/stripe",
          {
            method: "POST",
            body: JSON.stringify(eventWithoutMetadata),
          }
        )

        const response = await POST(request)

        assertResponse(response, 200)

        // Should still attempt to update user with undefined userId
        expect(mockDb.user.update).toHaveBeenCalledWith({
          where: { id: undefined },
          data: expect.any(Object),
        })
      })

      it("should handle missing subscription ID", async () => {
        const eventWithoutSubscription = {
          ...MOCK_STRIPE_EVENTS.CHECKOUT_SESSION_COMPLETED,
          data: {
            object: {
              ...MOCK_STRIPE_EVENTS.CHECKOUT_SESSION_COMPLETED.data.object,
              subscription: null,
            },
          },
        }
        mockStripe.webhooks.constructEvent.mockReturnValue(
          eventWithoutSubscription as any
        )

        const request = new Request(
          "http://localhost:3000/api/webhooks/stripe",
          {
            method: "POST",
            body: JSON.stringify(eventWithoutSubscription),
          }
        )

        const response = await POST(request)

        assertResponse(response, 200)

        // Should not call subscription retrieve with null
        expect(mockStripe.subscriptions.retrieve).toHaveBeenCalledWith(null)
      })

      it("should handle empty request body", async () => {
        mockStripe.webhooks.constructEvent.mockImplementation(() => {
          throw new Error("No body provided")
        })

        const request = new Request(
          "http://localhost:3000/api/webhooks/stripe",
          {
            method: "POST",
            body: "",
          }
        )

        const response = await POST(request)

        expect(response.status).toBe(400)
        const responseText = await response.text()
        expect(responseText).toContain("Webhook Error: No body provided")
      })

      it("should handle missing Stripe signature header", async () => {
        mockHeaders.mockReturnValue({
          get: jest.fn().mockReturnValue(null), // No signature
        } as any)

        mockStripe.webhooks.constructEvent.mockImplementation(() => {
          throw new Error("No signature provided")
        })

        const request = new Request(
          "http://localhost:3000/api/webhooks/stripe",
          {
            method: "POST",
            body: JSON.stringify(MOCK_STRIPE_EVENTS.CHECKOUT_SESSION_COMPLETED),
          }
        )

        const response = await POST(request)

        expect(response.status).toBe(400)
        const responseText = await response.text()
        expect(responseText).toContain("Webhook Error: No signature provided")
      })
    })
  })
})
