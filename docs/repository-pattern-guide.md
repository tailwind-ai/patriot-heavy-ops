# Repository Pattern Implementation Guide

## Overview

The repository pattern provides a platform-agnostic data access layer that abstracts Prisma operations behind mobile-compatible interfaces. This implementation supports both web and React Native applications with consistent error handling, logging, and offline capabilities.

## Architecture

### Core Components

1. **BaseRepository** - Abstract base class with common CRUD operations
2. **ServiceRequestRepository** - Service request data operations with role-based access
3. **UserRepository** - User management and authentication operations
4. **RepositoryFactory** - Dependency injection and singleton management

### Mobile-First Design

- **Framework Agnostic**: No Next.js/React dependencies
- **Offline Support**: Built-in offline mode and caching options
- **Error Handling**: Standardized error responses for network failures
- **Logging**: Configurable logging for debugging and monitoring

## Usage Examples

### Basic Repository Usage

```typescript
import { RepositoryFactory } from "@/lib/repositories"

// Get singleton instances
const userRepo = RepositoryFactory.getUserRepository()
const serviceRepo = RepositoryFactory.getServiceRequestRepository()

// Find user by ID
const userResult = await userRepo.findById("user123")
if (userResult.success) {
  console.log("User found:", userResult.data)
} else {
  console.error("Error:", userResult.error)
}
```

### Role-Based Service Request Access

```typescript
import { repositories } from "@/lib/repositories"

// Get service requests with role-based filtering
const requests = await repositories.getServiceRequests("user123", "OPERATOR")

if (requests.success) {
  // Operator sees their assignments + own requests
  console.log("Accessible requests:", requests.data)
}
```

### Creating Custom Repository Instances

```typescript
import { RepositoryFactory } from "@/lib/repositories"

// For testing with mock database
const mockDb = createMockPrismaClient()
const testRepo = RepositoryFactory.createUserRepository(mockDb, {
  logger: customLogger,
  enableCaching: true,
  offlineMode: true,
})
```

## Mobile Integration

### React Native Compatibility

The repository layer is designed for React Native compatibility:

```typescript
// Mobile app initialization
import { RepositoryFactory } from "@/lib/repositories"

// Initialize repositories with mobile-specific options
await RepositoryFactory.initialize()

// Enable offline mode for mobile
const userRepo = RepositoryFactory.createUserRepository(undefined, {
  offlineMode: true,
  enableCaching: true,
})
```

### Offline Support

```typescript
// Check if repository is in offline mode
if (userRepo.isOfflineMode()) {
  // Handle offline scenario
  console.log("Operating in offline mode")
}

// Toggle offline mode
userRepo.setOfflineMode(true)
```

## Error Handling

All repository methods return standardized `RepositoryResult<T>` objects:

```typescript
interface RepositoryResult<T> {
  success: boolean
  data?: T
  error?: ServiceError
  pagination?: PaginationInfo
}

interface ServiceError {
  code: string
  message: string
  details?: Record<string, unknown>
  timestamp: Date
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Missing or invalid parameters
- `USER_FIND_ERROR` - User lookup failures
- `SERVICE_REQUEST_CREATE_ERROR` - Service request creation failures
- `PRISMA_ERROR` - Database operation errors

## Testing

### Unit Testing with Mocks

```typescript
import { UserRepository } from "@/lib/repositories/user-repository"

const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
} as any

const repository = new UserRepository(mockPrismaClient)

// Test repository methods
mockPrismaClient.user.findUnique.mockResolvedValue(mockUser)
const result = await repository.findById("user123")
expect(result.success).toBe(true)
```

### Integration Testing

```typescript
import { RepositoryFactory } from "@/lib/repositories"

// Set test database
RepositoryFactory.setDatabase(testPrismaClient)

// Test with real database operations
const userRepo = RepositoryFactory.getUserRepository()
const result = await userRepo.create({
  email: "test@example.com",
  name: "Test User",
})
```

## Performance Considerations

### Pagination

```typescript
// Use pagination for large datasets
const result = await serviceRepo.findMany(
  { where: { status: "ACTIVE" } },
  { page: 1, limit: 20 }
)

if (result.pagination) {
  console.log(
    `Page ${result.pagination.page} of ${Math.ceil(
      result.pagination.total / result.pagination.limit
    )}`
  )
}
```

### Filtering and Sorting

```typescript
// Apply filters and sorting
const result = await serviceRepo.findMany({
  where: { status: "SUBMITTED" },
  orderBy: { createdAt: "desc" },
  include: { user: true },
})
```

## Migration from Direct Prisma Usage

### Before (Direct Prisma)

```typescript
// API route with direct Prisma usage
const serviceRequests = await db.serviceRequest.findMany({
  where: { userId: user.id },
  include: { user: true },
})
```

### After (Repository Pattern)

```typescript
// API route with repository pattern
const serviceRepo = RepositoryFactory.getServiceRequestRepository()
const result = await serviceRepo.findManyWithRoleAccess({
  userId: user.id,
  userRole: user.role,
})

if (result.success) {
  const serviceRequests = result.data
}
```

## Best Practices

### 1. Always Check Success Status

```typescript
const result = await userRepo.findById(id)
if (!result.success) {
  return new Response(result.error?.message, { status: 500 })
}
// Use result.data safely
```

### 2. Use Factory Pattern

```typescript
// Preferred: Use factory for singleton instances
const userRepo = RepositoryFactory.getUserRepository()

// Avoid: Creating instances directly
const userRepo = new UserRepository(db) // Don't do this
```

### 3. Handle Validation Errors

```typescript
const result = await userRepo.create(userData)
if (!result.success && result.error?.code === "VALIDATION_ERROR") {
  return new Response(JSON.stringify(result.error.details), { status: 422 })
}
```

### 4. Use Role-Based Access

```typescript
// Use role-based methods for security
const result = await serviceRepo.findManyWithRoleAccess({
  userId: user.id,
  userRole: user.role,
})

// Avoid: Generic findMany without access control
```

## Configuration

### Environment-Specific Settings

```typescript
// Development: Enable debug logging
const repo = RepositoryFactory.createUserRepository(undefined, {
  logger: new ConsoleLogger(),
  enableCaching: false,
})

// Production: Optimize for performance
const repo = RepositoryFactory.createUserRepository(undefined, {
  enableCaching: true,
  offlineMode: false,
})
```

### Mobile-Specific Configuration

```typescript
// React Native app configuration
const mobileRepo = RepositoryFactory.createUserRepository(undefined, {
  offlineMode: true,
  enableCaching: true,
  logger: new MobileLogger(), // Custom mobile logger
})
```

## Troubleshooting

### Common Issues

1. **Mock Database Errors**: Ensure all required Prisma methods are mocked
2. **Validation Failures**: Check required parameters are provided
3. **Role Access Issues**: Verify user role and permissions
4. **Offline Mode**: Ensure proper fallback handling

### Debug Logging

```typescript
// Enable debug logging
const repo = RepositoryFactory.createUserRepository(undefined, {
  logger: new ConsoleLogger(),
})

// Check repository operations in logs
// [INFO] UserRepository: findById(user123)
// [ERROR] UserRepository Error: User not found
```

## Future Enhancements

- GraphQL integration support
- Advanced caching strategies
- Data synchronization for offline mode
- Performance monitoring and metrics
- Automated migration tools
