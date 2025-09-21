// Mock Prisma database client for testing

export const mockUser = {
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

export const db = {
  user: mockUser,
  // Add other models as needed
}

// Helper to reset all mocks
export const resetDbMocks = () => {
  Object.values(mockUser).forEach(mock => mock.mockReset())
}

// Common mock data
export const mockUserData = {
  id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  image: null,
  role: 'USER',
  password: '$2a$12$hashedpassword',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
}

export const mockUserWithoutPassword = {
  id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  image: null,
  role: 'USER',
}
