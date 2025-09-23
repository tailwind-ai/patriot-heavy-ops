import { http, HttpResponse } from "msw"
import crypto from "crypto"
import {
  MOCK_GEOCODING_RESPONSE,
  MOCK_STRIPE_EVENTS,
} from "../helpers/mock-data"

/**
 * MSW handlers for mocking external API calls during testing
 */
export const handlers = [
  // Nominatim Geocoding API
  http.get("https://nominatim.openstreetmap.org/search", ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get("q")

    if (!query) {
      return HttpResponse.json(
        { error: "Missing query parameter" },
        { status: 400 }
      )
    }

    // Simulate different responses based on query
    if (query.includes("invalid") || query.includes("error")) {
      return HttpResponse.json(
        { error: "Geocoding service error" },
        { status: 500 }
      )
    }

    if (query.includes("notfound") || query.includes("nowhere")) {
      return HttpResponse.json([])
    }

    // Return mock successful response
    return HttpResponse.json(MOCK_GEOCODING_RESPONSE)
  }),

  // Stripe API - Create Checkout Session
  http.post("https://api.stripe.com/v1/checkout/sessions", () => {
    return HttpResponse.json({
      id: "cs_test_123",
      url: "https://checkout.stripe.com/pay/cs_test_123",
      payment_status: "unpaid",
      customer: "cus_test123",
    })
  }),

  // Stripe API - Create Billing Portal Session
  http.post("https://api.stripe.com/v1/billing_portal/sessions", () => {
    return HttpResponse.json({
      id: "bps_test_123",
      url: "https://billing.stripe.com/session/bps_test_123",
      customer: "cus_test123",
    })
  }),

  // Stripe API - Retrieve Customer
  http.get("https://api.stripe.com/v1/customers/:customerId", ({ params }) => {
    const { customerId } = params

    if (customerId === "cus_notfound") {
      return HttpResponse.json(
        { error: { message: "No such customer" } },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      id: customerId,
      email: "test@example.com",
      subscriptions: {
        data: [],
      },
    })
  }),

  // Stripe API - Create Customer
  http.post("https://api.stripe.com/v1/customers", () => {
    return HttpResponse.json({
      id: "cus_test123",
      email: "test@example.com",
      created: Math.floor(Date.now() / 1000),
    })
  }),

  // Stripe Webhook Endpoint (for testing webhook signature verification)
  http.post("/api/webhooks/stripe", () => {
    // This will be handled by the actual route handler in tests
    return new HttpResponse(null, { status: 200 })
  }),

  // Mock error responses for testing error handling
  http.get("https://api.stripe.com/v1/customers/error", () => {
    return HttpResponse.json(
      { error: { message: "Internal server error" } },
      { status: 500 }
    )
  }),

  http.get("https://nominatim.openstreetmap.org/search/error", () => {
    return HttpResponse.text("Service temporarily unavailable", { status: 503 })
  }),
]

/**
 * Error handlers for testing error scenarios
 */
export const errorHandlers = [
  // Geocoding service down
  http.get("https://nominatim.openstreetmap.org/search", () => {
    return HttpResponse.text("Service temporarily unavailable", { status: 503 })
  }),

  // Stripe API errors
  http.post("https://api.stripe.com/v1/checkout/sessions", () => {
    return HttpResponse.json(
      {
        error: {
          message: "Invalid request parameters",
          type: "invalid_request_error",
        },
      },
      { status: 400 }
    )
  }),

  http.post("https://api.stripe.com/v1/billing_portal/sessions", () => {
    return HttpResponse.json(
      {
        error: {
          message: "Invalid customer ID",
          type: "invalid_request_error",
        },
      },
      { status: 400 }
    )
  }),
]

/**
 * Helper to create Stripe webhook signature for testing
 */
export function createStripeWebhookSignature(
  payload: string,
  secret: string = "whsec_test123"
): string {
  const timestamp = Math.floor(Date.now() / 1000)
  const signedPayload = `${timestamp}.${payload}`
  const signature = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex")

  return `t=${timestamp},v1=${signature}`
}

/**
 * Mock Stripe webhook events for testing
 */
export const mockStripeWebhookEvents = {
  customerSubscriptionCreated: JSON.stringify(
    MOCK_STRIPE_EVENTS.CUSTOMER_SUBSCRIPTION_CREATED
  ),
  customerSubscriptionDeleted: JSON.stringify(
    MOCK_STRIPE_EVENTS.CUSTOMER_SUBSCRIPTION_DELETED
  ),
  invoicePaymentSucceeded: JSON.stringify(
    MOCK_STRIPE_EVENTS.INVOICE_PAYMENT_SUCCEEDED
  ),
  unknownEvent: JSON.stringify({
    id: "evt_unknown",
    type: "unknown.event.type",
    data: { object: {} },
  }),
}
