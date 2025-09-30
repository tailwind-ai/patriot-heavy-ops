// Mock Prisma database client for testing

export const mockUser = {
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
}

export const mockServiceRequest = {
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
}

export const mockUserSubscription = {
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  upsert: jest.fn(),
}

export const mockPost = {
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
}

export const mockOperatorApplication = {
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

export const mockUserAssignment = {
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

export const mockServiceRequestStatusHistory = {
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

export const mockTransaction = jest.fn()

export const db = {
  user: mockUser,
  serviceRequest: mockServiceRequest,
  userSubscription: mockUserSubscription,
  post: mockPost,
  operatorApplication: mockOperatorApplication,
  userAssignment: mockUserAssignment,
  serviceRequestStatusHistory: mockServiceRequestStatusHistory,
  $transaction: mockTransaction,
}

// Helper to reset all mocks
export const resetDbMocks = () => {
  Object.values(mockUser).forEach((mock) => mock.mockReset())
  Object.values(mockServiceRequest).forEach((mock) => mock.mockReset())
  Object.values(mockUserSubscription).forEach((mock) => mock.mockReset())
  Object.values(mockPost).forEach((mock) => mock.mockReset())
  Object.values(mockOperatorApplication).forEach((mock) => mock.mockReset())
  Object.values(mockUserAssignment).forEach((mock) => mock.mockReset())
  Object.values(mockServiceRequestStatusHistory).forEach((mock) =>
    mock.mockReset()
  )
  mockTransaction.mockReset()
}

// Common mock data
export const mockUserData = {
  id: "test-user-id",
  name: "Test User",
  email: "test@example.com",
  image: null,
  role: "USER",
  password: "$2a$12$hashedpassword",
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
}

export const mockUserWithoutPassword = {
  id: "test-user-id",
  name: "Test User",
  email: "test@example.com",
  image: null,
  role: "USER",
}

export const mockServiceRequestData = {
  id: "test-request-id",
  title: "Test Service Request",
  description: "Test description",
  contactName: "Test Contact",
  contactEmail: "contact@test.com",
  contactPhone: "555-0123",
  company: "Test Company",
  jobSite: "Test Job Site",
  transport: "WE_HANDLE_IT",
  startDate: new Date("2024-01-15"),
  endDate: new Date("2024-01-20"),
  equipmentCategory: "BACKHOES_EXCAVATORS",
  equipmentDetail: "Test equipment details",
  requestedDurationType: "MULTI_DAY",
  requestedDurationValue: 5,
  requestedTotalHours: 40,
  rateType: "DAILY",
  baseRate: 800,
  status: "SUBMITTED",
  userId: "test-user-id",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
}
