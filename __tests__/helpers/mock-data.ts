import { UserRole } from '@/lib/permissions'

/**
 * Mock service request data for testing
 */
export const MOCK_SERVICE_REQUEST = {
  id: 'test-request-id',
  title: 'Test Excavator Job',
  description: 'Need excavator for foundation work',
  contactName: 'John Contractor',
  contactEmail: 'john@contractor.com',
  contactPhone: '555-0123',
  company: 'Contractor LLC',
  jobSite: '123 Construction St, Austin, TX 78701',
  transport: 'WE_HANDLE_IT',
  startDate: new Date('2024-01-15'),
  endDate: new Date('2024-01-20'),
  equipmentCategory: 'BACKHOES_EXCAVATORS',
  equipmentDetail: 'Mid-size excavator for foundation digging',
  requestedDurationType: 'MULTI_DAY',
  requestedDurationValue: 5,
  requestedTotalHours: 40,
  rateType: 'DAILY',
  baseRate: 800,
  status: 'SUBMITTED',
  priority: 'NORMAL',
  estimatedCost: 4000,
  userId: 'user-test-id',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
} as const

/**
 * Mock service request with relations
 */
export const MOCK_SERVICE_REQUEST_WITH_RELATIONS = {
  ...MOCK_SERVICE_REQUEST,
  user: {
    id: 'user-test-id',
    name: 'Test User',
    email: 'user@test.com',
  },
  assignedManager: {
    id: 'manager-test-id',
    name: 'Test Manager',
    email: 'manager@test.com',
  },
  userAssignments: [
    {
      id: 'assignment-1',
      operatorId: 'operator-test-id',
      operator: {
        id: 'operator-test-id',
        name: 'Test Operator',
        email: 'operator@test.com',
      },
    },
  ],
} as const

/**
 * Mock user data for different roles
 */
export const MOCK_USERS = {
  USER: {
    id: 'user-test-id',
    name: 'Test User',
    email: 'user@test.com',
    image: null,
    role: 'USER' as UserRole,
    company: 'Test Company',
    phone: '555-0100',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  OPERATOR: {
    id: 'operator-test-id',
    name: 'Test Operator',
    email: 'operator@test.com',
    image: null,
    role: 'OPERATOR' as UserRole,
    company: null,
    phone: '555-0200',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  MANAGER: {
    id: 'manager-test-id',
    name: 'Test Manager',
    email: 'manager@test.com',
    image: null,
    role: 'MANAGER' as UserRole,
    company: 'Patriot Heavy Ops',
    phone: '555-0300',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  ADMIN: {
    id: 'admin-test-id',
    name: 'Test Admin',
    email: 'admin@test.com',
    image: null,
    role: 'ADMIN' as UserRole,
    company: 'Patriot Heavy Ops',
    phone: '555-0400',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
} as const

/**
 * Mock operator application data
 */
export const MOCK_OPERATOR_APPLICATION = {
  militaryBranch: 'Army',
  yearsOfService: 8,
  equipmentExperience: ['BACKHOES_EXCAVATORS', 'BULLDOZERS'],
  certifications: ['CDL Class A', 'OSHA 30'],
  preferredLocation: 'Austin, TX',
  locationData: {
    display_name: 'Austin, Travis County, Texas, United States',
    lat: '30.2672',
    lon: '-97.7431',
  },
  availability: 'FULL_TIME',
  additionalInfo: 'Experienced heavy equipment operator with military background',
} as const

/**
 * Mock user subscription data
 */
export const MOCK_USER_SUBSCRIPTION = {
  id: 'sub-test-id',
  userId: 'user-test-id',
  stripeCustomerId: 'cus_test123',
  stripeSubscriptionId: 'sub_test123',
  stripePriceId: 'price_test123',
  stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
} as const

/**
 * Mock Stripe webhook event data
 */
export const MOCK_STRIPE_EVENTS = {
  CHECKOUT_SESSION_COMPLETED: {
    id: 'evt_checkout_test123',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_session123',
        customer: 'cus_test123',
        subscription: 'sub_test123',
        metadata: {
          userId: 'user_test_123',
        },
        payment_status: 'paid',
        mode: 'subscription',
      },
    },
  },
  INVOICE_PAYMENT_SUCCEEDED: {
    id: 'evt_invoice_test125',
    type: 'invoice.payment_succeeded',
    data: {
      object: {
        id: 'in_test_invoice123',
        customer: 'cus_test123',
        subscription: 'sub_test123',
        billing_reason: 'subscription_cycle',
        payment_intent: 'pi_test123',
      },
    },
  },
  CUSTOMER_SUBSCRIPTION_CREATED: {
    id: 'evt_test123',
    type: 'customer.subscription.created',
    data: {
      object: {
        id: 'sub_test123',
        customer: 'cus_test123',
        items: {
          data: [
            {
              price: {
                id: 'price_test123',
              },
            },
          ],
        },
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
      },
    },
  },
  CUSTOMER_SUBSCRIPTION_DELETED: {
    id: 'evt_test124',
    type: 'customer.subscription.deleted',
    data: {
      object: {
        id: 'sub_test123',
        customer: 'cus_test123',
      },
    },
  },
} as const

/**
 * Mock geocoding response data
 */
export const MOCK_GEOCODING_RESPONSE = [
  {
    display_name: 'Austin, Travis County, Texas, United States',
    lat: '30.2672',
    lon: '-97.7431',
    importance: 0.75,
    place_id: 123456,
    licence: 'Test licence',
    osm_type: 'relation',
    osm_id: 123456,
    boundingbox: ['30.0986', '30.5168', '-97.9383', '-97.5614'],
    class: 'place',
    type: 'city',
  },
] as const

/**
 * Valid service request form data for testing
 */
export const VALID_SERVICE_REQUEST_DATA = {
  title: 'Foundation Excavation Project',
  description: 'Need excavator for residential foundation work',
  contactName: 'John Smith',
  contactEmail: 'john.smith@contractor.com',
  contactPhone: '555-123-4567',
  company: 'Smith Construction LLC',
  jobSite: '456 Oak Street, Austin, TX 78701',
  transport: 'WE_HANDLE_IT',
  startDate: '2024-02-01',
  endDate: '2024-02-05',
  equipmentCategory: 'BACKHOES_EXCAVATORS',
  equipmentDetail: 'Mid-size excavator (15-20 ton) for foundation digging',
  requestedDurationType: 'MULTI_DAY',
  requestedDurationValue: 5,
  requestedTotalHours: 40,
  rateType: 'DAILY',
  baseRate: 750,
} as const

/**
 * Invalid service request data for validation testing
 */
export const INVALID_SERVICE_REQUEST_DATA = {
  title: '', // Invalid: empty title
  contactName: 'John',
  contactEmail: 'invalid-email', // Invalid: not a valid email
  contactPhone: '123', // Invalid: too short
  jobSite: '',
  startDate: 'invalid-date', // Invalid: not a valid date
  equipmentCategory: 'INVALID_CATEGORY', // Invalid: not in enum
  requestedDurationValue: -1, // Invalid: negative number
  baseRate: 0, // Invalid: must be positive
} as const
