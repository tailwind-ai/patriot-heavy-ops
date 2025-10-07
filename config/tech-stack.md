# Technology Stack

> **Last Updated:** 2025-10-06 22:09:29  
> **Analysis Report:** [repo-analysis/2025-10-06-220929.md](repo-analysis/2025-10-06-220929.md)

**Repository**: [fxonai/saas-starter-kit](https://github.com/fxonai/saas-starter-kit)

## Deployment

- **Method**: Azure + Docker + GitHub Actions
- **Platform**: Microsoft Azure
- **Type**: Containerized web application
- **Confidence**: 0.95
- **Evidence**:
  - Azure Bicep configuration (azure-deploy.bicep)
  - Azure deployment workflows (.github/workflows/azure-deploy.yml, azure-deploy-only.yml)
  - Docker Compose (docker-compose.yml)
  - Procfile for web deployment
  - Staging environment: fxon-app(staging)

## Database

- **ORM**: Prisma
- **Database**: PostgreSQL 16.4
- **Type**: Relational Database
- **Confidence**: 0.95
- **Models**: 21
- **Evidence**:
  - prisma/schema.prisma
  - prisma/migrations/
  - @prisma/client dependency
  - @next-auth/prisma-adapter

### Database Models

Core Models:
- **Authentication**: Account, Session, VerificationToken, User
- **Teams & Access**: Team, TeamMember, Invitation
- **Programs**: Program, ProgramUser, Stage, Task, UserProgress
- **Security**: PasswordReset, ApiKey, AuditLog
- **Billing**: Subscription, Service, Price
- **SSO/SAML**: jackson_store, jackson_index, jackson_ttl

## CI/CD

- **Platform**: GitHub Actions
- **Confidence**: 0.95
- **Workflows**: 4
  - `main.yml` - Build on push/PR (main, release branches)
  - `azure-deploy.yml` - Azure deployment
  - `azure-deploy-only.yml` - Azure deployment only
  - `main_fxon-app(staging).yml` - Staging deployment

### Testing & Quality

- **Test Frameworks**: 
  - Jest (unit/integration tests)
  - Playwright (E2E tests)
  - @testing-library/jest-dom
- **Linters**: 
  - ESLint (with TypeScript support)
  - Prettier (with Tailwind CSS plugin)
  - eslint-plugin-i18next
- **Pre-commit Hooks**: Husky
- **Type Checking**: TypeScript
- **Additional Tools**: Knip (unused code detection)

## Technology Stack

### Frontend
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components
- **Internationalization**: next-i18next

### Backend
- **Framework**: Next.js API Routes
- **Authentication**: NextAuth.js
- **Database Client**: Prisma
- **Session Strategy**: Database-backed sessions

### Features
- **Team SSO**: Enabled
- **Directory Sync**: Enabled
- **Audit Logs**: Enabled
- **Webhooks**: Configurable
- **Auth Providers**: GitHub, Credentials, SAML, IDP-initiated

### Development
- **Node Version**: 22
- **Package Manager**: npm
- **Environment**: .env.example provided
- **Local Database**: Docker Compose (PostgreSQL)

## Notes

- Project uses BoxyHQ's SAML Jackson for enterprise SSO
- Multi-tenant SaaS architecture with team-based access control
- Comprehensive test coverage with both unit and E2E tests
- Production deployment on Azure with staging environment
- Database migrations managed through Prisma
