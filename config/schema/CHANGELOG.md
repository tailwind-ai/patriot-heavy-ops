# Schema Changelog

> **Note:** This file tracks database schema changes over time.

## Instructions

When your database schema changes:
1. Document the change here
2. Save a snapshot of the schema file (e.g., `v1.0.0-schema.prisma`)
3. Update the current schema file

---

## v0.1.0 - 2025-10-07

### Initial Schema Import

Imported initial Prisma schema from [fxonai/saas-starter-kit](https://github.com/fxonai/saas-starter-kit).

### Schema Overview

**21 Models**:
- **Authentication**: Account, Session, VerificationToken, User
- **Teams & Access**: Team, TeamMember, Invitation
- **Programs**: Program, ProgramUser, Stage, Task, UserProgress
- **Security**: PasswordReset, ApiKey, AuditLog
- **Billing**: Subscription, Service, Price
- **SSO/SAML**: jackson_store, jackson_index, jackson_ttl

**9 Enums**:
- Role (ADMIN, OWNER, MEMBER)
- SystemRole (SYSTEM_ADMIN, TECH_SUPPORT, USER)
- ProgramStatus (DRAFT, ACTIVE, ARCHIVED)
- ParticipantStatus (ENROLLED, IN_PROGRESS, COMPLETED, DROPPED)
- StageStatus (DRAFT, ACTIVE, ARCHIVED)
- TaskStatus (DRAFT, ACTIVE, ARCHIVED)
- TaskType (READING, VIDEO, QUIZ, ASSIGNMENT, MEETING, etc.)
- ProgressStatus (NOT_STARTED, IN_PROGRESS, COMPLETED, SKIPPED)
- AuditLogAction (TASK_STARTED, TASK_COMPLETED, etc.)

### Key Features
- Multi-tenant SaaS with team-based access control
- Hierarchical program structure (Program → Stage → Task)
- User progress tracking with audit logs
- SAML SSO integration via BoxyHQ Jackson
- Soft deletes on key models
- Comprehensive indexing for performance

### Database
- PostgreSQL 16.4
- ORM: Prisma

### Snapshot
- File: `schema.prisma`

---

## Example Format

## v1.1.0 - 2025-02-01

### Changes
- Added `User.role` field (enum: admin, user, guest)
- Created `Session` table for authentication
- Added index on `User.email`

### Migration Notes
- Run migration: `npx prisma migrate dev`
- Seed default roles: `npm run seed`

### Snapshot
- File: `v1.1.0-schema.prisma`

---
