# Past Releases

> **Note:** Completed releases are archived here automatically by `/advance-release` command.

---

## v0.1.0 - Initial Platform Setup

**Released:** September 2025  
**Status:** ✅ Completed

### Objectives

Establish foundational platform infrastructure for Patriot Heavy Ops marketplace.

### What Was Delivered

**Authentication & User Management:**
- NextAuth.js integration with credentials and OAuth
- User roles: CONTRACTOR, OPERATOR, MANAGER
- Session management with database-backed sessions
- Operator-specific profile fields (militaryBranch, yearsOfService, certifications)

**Database & Schema:**
- Prisma ORM setup with PostgreSQL
- 9 core models: User, Account, Session, ServiceRequest, UserAssignment, Post, etc.
- Service request workflow (PENDING → IN_PROGRESS → COMPLETED/CANCELLED)
- Audit trail for status changes (ServiceRequestStatusHistory)

**Frontend Foundation:**
- Next.js 15 App Router structure
- shadcn/ui component library integration
- Responsive layouts with Tailwind CSS
- Basic dashboard pages for contractors and operators

**Payment Integration:**
- Stripe integration for payment processing
- Deposit and final payment flow
- Customer and subscription tracking fields

**Development Infrastructure:**
- Docker Compose for local development
- Jest test framework setup
- ESLint + Prettier configuration
- Husky pre-commit hooks
- GitHub Actions CI/CD workflows

**Deployment:**
- Vercel hosting configuration
- Production database connection
- Environment variable management
- Vercel Analytics integration

### Technical Achievements

- Repository pattern implementation for clean data access
- Type-safe API routes with Zod validation
- Comprehensive test coverage setup (Jest + Testing Library)
- Docker-first development workflow
- Strict TypeScript configuration (zero `any` types)

### Metrics

- 9 database models created
- 30+ UI components implemented
- 100+ tests written
- TypeScript coverage: 100%
- Deployed to production: ✅

### Lessons Learned

- Docker-based development provides consistency across team
- Repository pattern makes testing significantly easier
- Strict TypeScript catches bugs early
- shadcn/ui components speed up UI development
- Vercel deployment is seamless with Next.js 15

---

## Archive Structure

Each completed release should include:
- Release number and date
- Objectives
- What was delivered
- Technical achievements
- Metrics
- Lessons learned
- Links to GitHub issues/PRs
