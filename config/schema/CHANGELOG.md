# Schema Changelog

> **Note:** This file tracks database schema changes over time.

## Instructions

When your database schema changes:
1. Document the change here
2. Save a snapshot of the schema file (e.g., `v1.0.0-schema.prisma`)
3. Update the current schema file

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
