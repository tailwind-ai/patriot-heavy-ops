# Schema Changelog

## v0.1.0 (2025-10-13)

**Initial Schema Setup**

Core models established for Patriot Heavy Ops marketplace:

### Authentication & Users
- `Account` - OAuth provider accounts
- `Session` - User sessions
- `User` - Users with roles (CONTRACTOR, OPERATOR, MANAGER)
  - Operator-specific fields: militaryBranch, yearsOfService, certifications
  - Stripe customer integration fields
- `VerificationToken` - Email verification tokens

### Service Requests & Workflow
- `ServiceRequest` - Equipment rental requests
  - Status: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  - Equipment type, location, dates, pricing
- `ServiceRequestStatusHistory` - Audit trail for status changes
- `UserAssignment` - Operator assignments to requests

### Content Management
- `Post` - Blog posts and content (Outstatic integration)

### Enums
- `UserRole`: USER, CONTRACTOR, OPERATOR, MANAGER
- `ServiceRequestStatus`: PENDING, IN_PROGRESS, COMPLETED, CANCELLED

**Total Models**: 9
**Total Enums**: 2
