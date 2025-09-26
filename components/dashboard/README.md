# Dashboard Components

Role-specific dashboard components implementing Issue #220 requirements with mobile-first design and platform-agnostic architecture.

## Overview

This directory contains dashboard components designed for cross-platform compatibility, including future React Native mobile app support. All components follow mobile-first responsive design principles and accessibility standards (WCAG 2.1 AA).

## Components

### UserDashboard

**File**: `user-dashboard.tsx`  
**Role**: USER  
**Purpose**: Service request tracking and creation for regular users

**Features**:

- Service request statistics overview
- Recent service requests list with status badges
- Quick service request creation
- Mobile-optimized layout (320px to 4K)
- Loading states and error handling

**Usage**:

```tsx
import { UserDashboard } from "@/components/dashboard/user-dashboard"

export default function DashboardPage() {
  return <UserDashboard />
}
```

### OperatorDashboard

**File**: `operator-dashboard.tsx`  
**Role**: OPERATOR  
**Purpose**: Job management interface for equipment operators

**Features**:

- Available jobs with accept functionality
- Active assignments with completion tracking
- Operator-specific statistics
- Touch-friendly interfaces for mobile operators
- Job acceptance and completion workflows

**Usage**:

```tsx
import { OperatorDashboard } from "@/components/dashboard/operator-dashboard"

export default function DashboardPage() {
  return <OperatorDashboard />
}
```

### ManagerDashboard

**File**: `manager-dashboard.tsx`  
**Role**: MANAGER  
**Purpose**: Approval queue management and system oversight

**Features**:

- Pending approval queue with approve/reject actions
- System-wide service request overview
- Revenue and performance metrics
- Tabbed interface for different views
- Operator assignment management

**Usage**:

```tsx
import { ManagerDashboard } from "@/components/dashboard/manager-dashboard"

export default function DashboardPage() {
  return <ManagerDashboard />
}
```

### AdminDashboard

**File**: `admin-dashboard.tsx`  
**Role**: ADMIN  
**Purpose**: Complete system metrics and user management

**Features**:

- Comprehensive system statistics
- All service requests with full details
- User management and activity overview
- Advanced analytics and reporting
- Multi-tab interface for different data views

**Usage**:

```tsx
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

export default function DashboardPage() {
  return <AdminDashboard />
}
```

## Custom Hooks

### useDashboardData

**File**: `../../hooks/use-dashboard-data.ts`  
**Purpose**: Platform-agnostic dashboard data fetching with role-based access

**Features**:

- Role-specific API endpoint routing
- Mobile-ready caching support
- Error handling and loading states
- Date range filtering for managers/admins
- Automatic data transformation

**Usage**:

```tsx
import { useDashboardData } from "@/hooks/use-dashboard-data"

function MyComponent() {
  const { data, isLoading, error, refetch } = useDashboardData({
    role: "USER",
    limit: 10,
    enableCaching: true,
  })

  // Component logic
}
```

### useServiceRequests

**File**: `../../hooks/use-service-requests.ts`  
**Purpose**: USER role service request management

**Usage**:

```tsx
import { useServiceRequests } from "@/hooks/use-service-requests"

function UserComponent() {
  const {
    serviceRequests,
    totalRequests,
    activeRequests,
    isLoading,
    createServiceRequest,
  } = useServiceRequests()

  // Component logic
}
```

### useOperatorJobs

**File**: `../../hooks/use-operator-jobs.ts`  
**Purpose**: OPERATOR role job management

**Usage**:

```tsx
import { useOperatorJobs } from "@/hooks/use-operator-jobs"

function OperatorComponent() {
  const { availableJobs, activeAssignments, acceptJob, completeJob } =
    useOperatorJobs()

  // Component logic
}
```

### useManagerQueue

**File**: `../../hooks/use-manager-queue.ts`  
**Purpose**: MANAGER role approval queue management

**Usage**:

```tsx
import { useManagerQueue } from "@/hooks/use-manager-queue"

function ManagerComponent() {
  const { pendingApprovals, approveRequest, rejectRequest, assignOperator } =
    useManagerQueue()

  // Component logic
}
```

## Architecture Principles

### Mobile-First Design

- Responsive breakpoints: 320px (mobile) → 768px (tablet) → 1024px (desktop) → 4K
- Touch-friendly interfaces with minimum 44px touch targets
- Optimized layouts for small screens
- Progressive enhancement for larger screens

### Platform-Agnostic Business Logic

- Zero Next.js/React dependencies in service layer
- Framework-agnostic implementation
- Designed for React Native compatibility
- Separation of concerns between UI and business logic

### Accessibility Compliance

- WCAG 2.1 AA standards
- Proper heading hierarchy
- Keyboard navigation support
- Screen reader compatibility
- High contrast support
- Focus management

### Performance Optimization

- Mobile-ready caching with configurable TTL
- Loading states and skeleton screens
- Error boundaries and graceful degradation
- Optimized bundle size for mobile

## Integration

### API Routes

Components integrate with existing dashboard API routes from Issue #219:

- `/api/dashboard/user` - USER role data
- `/api/dashboard/operator` - OPERATOR role data
- `/api/dashboard/manager` - MANAGER role data
- `/api/dashboard/admin` - ADMIN role data

### Service Layer

Components use the DashboardService from Issue #218:

- Role-based data filtering
- Decimal precision handling
- Mobile-ready caching
- Platform-agnostic implementation

### Main Dashboard Integration

The main dashboard page (`app/(dashboard)/dashboard/page.tsx`) automatically routes to the appropriate component based on user role:

```tsx
const renderDashboard = () => {
  switch (user.role) {
    case "OPERATOR":
      return <OperatorDashboard />
    case "MANAGER":
      return <ManagerDashboard />
    case "ADMIN":
      return <AdminDashboard />
    case "USER":
    default:
      return <UserDashboard />
  }
}
```

## Testing

### Test Coverage

- Component unit tests with React Testing Library
- Custom hook testing with renderHook
- Accessibility testing with jest-axe
- Mobile responsive testing
- Error boundary testing
- Loading state testing

### Test Files

- `__tests__/hooks/use-dashboard-data.test.ts`
- `__tests__/hooks/use-service-requests.test.ts`
- `__tests__/components/dashboard/user-dashboard.test.tsx`
- Additional test files for other components

### Running Tests

```bash
npm test -- --testPathPattern=dashboard
```

## Development Guidelines

### Adding New Dashboard Features

1. Follow mobile-first design principles
2. Implement proper loading and error states
3. Add comprehensive tests
4. Ensure accessibility compliance
5. Update documentation

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow existing component patterns
- Implement responsive design with mobile-first approach
- Use semantic HTML elements
- Maintain consistent spacing and typography

### Performance Considerations

- Implement proper caching strategies
- Use React.memo for expensive components
- Optimize bundle size for mobile
- Implement proper error boundaries
- Use skeleton screens for loading states

## Future Enhancements

### React Native Compatibility

Components are designed for easy migration to React Native:

- Platform-agnostic business logic
- Separated UI and data layers
- Mobile-first design principles
- Touch-friendly interfaces

### Offline Support

- Service worker integration
- Local data caching
- Offline-first architecture
- Sync capabilities

### Real-time Updates

- WebSocket integration
- Live data updates
- Push notifications
- Real-time collaboration features
