import { rest } from 'msw'
import crypto from 'crypto'
import { MOCK_GEOCODING_RESPONSE, MOCK_STRIPE_EVENTS } from '../helpers/mock-data'

/**
 * MSW handlers for mocking external API calls during testing
 */
export const handlers = [
  // Nominatim Geocoding API
  rest.get('https://nominatim.openstreetmap.org/search', (req, res, ctx) => {
    const query = req.url.searchParams.get('q')
    
    if (!query) {
      return res(ctx.status(400), ctx.json({ error: 'Missing query parameter' }))
    }

    // Simulate different responses based on query
    if (query.includes('invalid') || query.includes('error')) {
      return res(ctx.status(500), ctx.json({ error: 'Geocoding service error' }))
    }

    if (query.includes('notfound') || query.includes('nowhere')) {
      return res(ctx.json([]))
    }

    // Return mock successful response
    return res(ctx.json(MOCK_GEOCODING_RESPONSE))
  }),

  // Stripe API - Create Checkout Session
  rest.post('https://api.stripe.com/v1/checkout/sessions', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123',
        payment_status: 'unpaid',
        customer: 'cus_test123',
      })
    )
  }),

  // Stripe API - Create Billing Portal Session
  rest.post('https://api.stripe.com/v1/billing_portal/sessions', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'bps_test_123',
        url: 'https://billing.stripe.com/session/bps_test_123',
        customer: 'cus_test123',
      })
    )
  }),

  // Stripe API - Retrieve Customer
  rest.get('https://api.stripe.com/v1/customers/:customerId', (req, res, ctx) => {
    const { customerId } = req.params
    
    if (customerId === 'cus_notfound') {
      return res(ctx.status(404), ctx.json({ error: { message: 'No such customer' } }))
    }

    return res(
      ctx.json({
        id: customerId,
        email: 'test@example.com',
        subscriptions: {
          data: [],
        },
      })
    )
  }),

  // Stripe API - Create Customer
  rest.post('https://api.stripe.com/v1/customers', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'cus_test123',
        email: 'test@example.com',
        created: Math.floor(Date.now() / 1000),
      })
    )
  }),

  // Stripe Webhook Endpoint (for testing webhook signature verification)
  rest.post('/api/webhooks/stripe', (req, res, ctx) => {
    // This will be handled by the actual route handler in tests
    return res(ctx.status(200))
  }),

  // Mock error responses for testing error handling
  rest.get('https://api.stripe.com/v1/customers/error', (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ error: { message: 'Internal server error' } }))
  }),

  rest.get('https://nominatim.openstreetmap.org/search/error', (req, res, ctx) => {
    return res(ctx.status(503), ctx.text('Service temporarily unavailable'))
  }),
]

/**
 * Error handlers for testing error scenarios
 */
export const errorHandlers = [
  // Geocoding service down
  rest.get('https://nominatim.openstreetmap.org/search', (req, res, ctx) => {
    return res(ctx.status(503), ctx.text('Service temporarily unavailable'))
  }),

  // Stripe API errors
  rest.post('https://api.stripe.com/v1/checkout/sessions', (req, res, ctx) => {
    return res(ctx.status(400), ctx.json({ 
      error: { 
        message: 'Invalid request parameters',
        type: 'invalid_request_error'
      } 
    }))
  }),

  rest.post('https://api.stripe.com/v1/billing_portal/sessions', (req, res, ctx) => {
    return res(ctx.status(400), ctx.json({ 
      error: { 
        message: 'Invalid customer ID',
        type: 'invalid_request_error'
      } 
    }))
  }),
]

/**
 * Helper to create Stripe webhook signature for testing
 */
export function createStripeWebhookSignature(payload: string, secret: string = 'whsec_test123'): string {
  const timestamp = Math.floor(Date.now() / 1000)
  const signedPayload = `${timestamp}.${payload}`
  const signature = crypto.createHmac('sha256', secret).update(signedPayload, 'utf8').digest('hex')
  
  return `t=${timestamp},v1=${signature}`
}

/**
 * Mock Stripe webhook events for testing
 */
export const mockStripeWebhookEvents = {
  customerSubscriptionCreated: JSON.stringify(MOCK_STRIPE_EVENTS.CUSTOMER_SUBSCRIPTION_CREATED),
  customerSubscriptionDeleted: JSON.stringify(MOCK_STRIPE_EVENTS.CUSTOMER_SUBSCRIPTION_DELETED),
  invoicePaymentSucceeded: JSON.stringify(MOCK_STRIPE_EVENTS.INVOICE_PAYMENT_SUCCEEDED),
  unknownEvent: JSON.stringify({
    id: 'evt_unknown',
    type: 'unknown.event.type',
    data: { object: {} },
  }),
}
