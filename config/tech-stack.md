# Technology Stack: Patriot Heavy Ops

> **Last Updated:** 2025-10-13  
> **Project**: Patriot Heavy Ops - Military-trained operator marketplace

**Repository**: [Henry-Family/patriot-heavy-ops](https://github.com/Henry-Family/patriot-heavy-ops)  
**Live Site**: https://patriot-heavy-ops.vercel.app

## Deployment

- **Method**: Vercel (Next.js deployment platform)
- **Platform**: Vercel
- **Type**: Serverless web application
- **Confidence**: 1.0
- **Evidence**:
  - `.vercel` directory
  - Next.js 15 configuration optimized for Vercel
  - Vercel Analytics integration
  - Environment variables configured for Vercel deployment

## Database

- **ORM**: Prisma 6.16.2
- **Database**: PostgreSQL (Vercel Postgres / local Docker)
- **Type**: Relational Database
- **Confidence**: 1.0
- **Models**: 9 core models
- **Evidence**:
  - `prisma/schema.prisma`
  - `prisma/migrations/`
  - `@prisma/client` dependency
  - `@next-auth/prisma-adapter`

### Database Models

Core Models:
- **Authentication**: Account, Session, VerificationToken, User (with role: CONTRACTOR | OPERATOR | MANAGER)
- **Service Requests**: ServiceRequest, ServiceRequestStatusHistory
- **Assignments**: UserAssignment (operator assignments to service requests)
- **Content**: Post (blog/content management via Outstatic)

Key Features:
- User roles: CONTRACTOR (hires), OPERATOR (military-trained), MANAGER (admin)
- Service request workflow: PENDING → IN_PROGRESS → COMPLETED | CANCELLED
- Operator-specific fields: militaryBranch, yearsOfService, certifications
- Stripe integration for payments

## CI/CD

- **Platform**: GitHub Actions
- **Confidence**: 1.0
- **Workflows**: Automated testing and deployment
  - Tests run on every PR
  - Lint checks enforced via Husky pre-commit hooks
  - Vercel automatically deploys on push to main/dev branches

### Testing & Quality

- **Test Frameworks**: 
  - Jest 30.1.3 (unit/integration tests)
  - @testing-library/react 16.3.0
  - @testing-library/jest-dom 6.8.0
  - MSW 2.11.3 (API mocking)
- **Linters**: 
  - ESLint 8.39.0 (with TypeScript support)
  - Prettier 2.8.8 (with Tailwind CSS plugin)
  - eslint-plugin-react-hooks 5.2.0
  - eslint-plugin-tailwindcss 3.11.0
- **Pre-commit Hooks**: Husky 8.0.3
- **Type Checking**: TypeScript 5.9.2
- **Coverage Targets**: 35%+ branches, 34%+ functions, 37%+ lines

## Technology Stack

### Frontend

- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript 5.9.2
- **Styling**: Tailwind CSS 3.3.1
- **UI Components**: shadcn/ui (Radix UI primitives + Tailwind)
- **Icons**: Lucide React 0.544.0
- **Forms**: React Hook Form 7.43.9 + Zod 3.21.4 validation
- **State Management**: React 19.1.1 + Next.js server components
- **Blog/CMS**: Outstatic 2.0.10 (Git-based headless CMS)

### Backend

- **Framework**: Next.js 15 API Routes
- **Authentication**: NextAuth.js 4.24.11
- **Database Client**: Prisma 6.16.2
- **Session Strategy**: Database-backed sessions
- **Email**: Postmark 4.0.5 + SendGrid 8.1.6
- **Payments**: Stripe 11.18.0
- **Environment Validation**: @t3-oss/env-nextjs 0.2.2

### Features

- **Authentication Methods**: Credentials (email/password), GitHub OAuth
- **User Roles**: CONTRACTOR, OPERATOR, MANAGER
- **Service Request Workflow**: Multi-stage booking system
- **Payment Processing**: Stripe integration for deposits and final payments
- **Blog/Content**: Outstatic for marketing content and blog posts
- **Analytics**: Vercel Analytics

### Development

- **Node Version**: >=18.0.0
- **Package Manager**: npm
- **Environment**: Docker Compose for local development
- **Local Database**: PostgreSQL via Docker
- **Development Server**: Next.js dev server
- **Testing**: Docker-based test environment

### Development Tools

- **Docker**: Dockerfile.dev + docker-compose.yml for consistent dev environment
- **Scripts**:
  - `npm run validate` - TypeScript + ESLint checks
  - `npm run validate:docker` - Validation in Docker container
  - `npm test` - Jest test suite
  - `npm run test:ci` - CI-optimized test runs
  - `npm run todo` - Export Cursor TODOs

### Security & Compliance

- **Password Hashing**: bcryptjs 3.0.2
- **JWT Tokens**: jsonwebtoken 9.0.2
- **Input Validation**: Zod schemas for all forms and API endpoints
- **Environment Variables**: Validated at build time (@t3-oss/env-nextjs)
- **Military Verification**: DD-214 document upload and verification
- **Payment Security**: Stripe handles PCI compliance

## Architecture Patterns

### Repository Pattern

- All database access through repository classes
- Type-safe queries using Prisma.ModelGetPayload
- Consistent error handling with RepositoryResult<T>
- Location: `lib/repositories/`

### Service Layer

- Business logic separated from API routes
- Services coordinate between repositories
- Location: `lib/services/`

### API Routes

- RESTful API design
- Located in `app/api/`
- NextAuth.js authentication on protected routes
- Stripe webhooks for payment events

## Deployment Architecture

### Production Environment

- **Hosting**: Vercel (serverless)
- **Database**: Vercel Postgres (managed PostgreSQL)
- **File Storage**: Vercel Blob (for operator documents/certifications)
- **CDN**: Vercel Edge Network
- **Analytics**: Vercel Analytics

### Development Environment

- **Local**: Docker Compose (PostgreSQL + Next.js dev server)
- **Database**: PostgreSQL 16 in Docker container
- **Hot Reload**: Next.js Fast Refresh
- **Testing**: Isolated Docker environment

## Open Source Foundations

Based on:
- **[Taxonomy](https://github.com/shadcn-ui/taxonomy)** - Next.js 13+ application architecture
- **[shadcn/ui](https://github.com/shadcn-ui/ui)** - Beautiful, accessible component library
- **[T3 Stack](https://github.com/t3-oss/create-t3-app)** - Type-safe environment management

## Dependencies Summary

### Core Dependencies (30 packages)

- Next.js, React, React DOM
- Prisma Client, NextAuth.js
- Stripe, Postmark, SendGrid
- Radix UI components (20+ packages)
- Form handling (React Hook Form, Zod)
- Utilities (date-fns, clsx, tailwind-merge)
- Blog/CMS (Outstatic, gray-matter, react-markdown)
- Analytics (Vercel Analytics)
- Roadmapper (fs-extra, glob, yaml)

### Dev Dependencies (25 packages)

- TypeScript, ESLint, Prettier
- Jest, Testing Library
- Tailwind CSS + plugins
- Husky, lint-staged
- Commitlint
- MSW (API mocking)

## Notes

- **Military-focused marketplace**: Connects contractors with military-trained operators
- **Stripe integration**: Handles deposits (20%) and final payments
- **Role-based access control**: CONTRACTOR, OPERATOR, MANAGER roles
- **Service request workflow**: PENDING → IN_PROGRESS → COMPLETED/CANCELLED
- **Docker-first development**: All development happens in Docker containers
- **Repository pattern**: Consistent data access layer
- **Type safety**: Zero `any` types allowed, strict TypeScript configuration
- **Test coverage**: Minimum 35% branches, 34% functions, 37% lines
- **Roadmapper integration**: Product planning and release management built-in
