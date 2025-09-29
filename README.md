# Patriot Heavy Ops

**Live Site**: https://patriot-heavy-ops.vercel.app  
**Github Repo**: https://github.com/henry-family/patriot-heavy-ops/

Connect contractors with vetted heavy equipment operators (military-trained) for construction and industrial projects.

## Core User Stories

### Contractors (Hiring)

- "I need heavy equipment with qualified operators for my construction project"
- "I want to browse available equipment types and select what I need"
- "I want to specify my project requirements and get matched with available packages (equipment + operators)"

### Operators (Job Seekers)

- "I want to showcase my military training and equipment certifications"
- "I need to find construction projects that match my skills and availability"
- "I want to be easily discoverable by contractors looking for my expertise"

## Henry Family Platform Context

**Github Organization**: https://github.com/henry-family/

Patriot Heavy Ops is built on the Henry Family Platform foundation below along with exceptional open source projects to accelerate development and ensure modern, scalable architecture.

- **[Vision](docs/context/vision.md)** - Purpose, target customers, personas, and success metrics
- **[Architecture](docs/context/architecture.md)** - System components, data flow, AI integration, and deployment strategy
- **[Tech Stack](docs/context/tech-stack.md)** - Technology dependencies, frameworks, and development tools
- **[Current Release](docs/context/roadmap/current-release.md)** - Active development focus and milestones
- **[Next Release](docs/context/roadmap/next-release.md)** - Upcoming features and planned development
- **[Seed Data](docs/context/seed-data/README.md)** - comprehensive seed data.

## 🚀 Open Source Starter Kit

<p>
    <a href="https://github.com/shadcn-ui/taxonomy/stargazers"><img src="https://img.shields.io/github/stars/shadcn-ui/taxonomy" alt="Taxonomy GitHub stars"></a>
    <a href="https://github.com/shadcn-ui/ui/stargazers"><img src="https://img.shields.io/github/stars/shadcn-ui/ui" alt="shadcn/ui GitHub stars"></a>
    <a href="https://github.com/t3-oss/create-t3-app/stargazers"><img src="https://img.shields.io/github/stars/t3-oss/create-t3-app" alt="T3 App GitHub stars"></a>
    <a href="https://github.com/shadcn-ui/taxonomy/blob/main/LICENSE"><img src="https://img.shields.io/github/license/shadcn-ui/taxonomy" alt="License"></a>
    <a href="https://twitter.com/shadcn"><img src="https://img.shields.io/twitter/follow/shadcn?style=social" alt="Twitter"></a>
</p>

Please star ⭐ these repos if you find them valuable for your own projects! 😀

### 📖 Foundation Projects

**[Taxonomy](https://github.com/shadcn-ui/taxonomy)** - Modern Next.js 13 Application Template  
An open source application showcasing Next.js 13's latest features including App Router, Server Components, and modern React patterns. Taxonomy provides the architectural foundation for Patriot Heavy Ops with its comprehensive implementation of authentication, database integration, and full-stack TypeScript patterns. The project demonstrates best practices for building scalable, maintainable applications with modern tooling.

**[shadcn/ui](https://github.com/shadcn-ui/ui)** - Beautiful & Accessible Component Library  
A collection of copy-and-paste components built on Radix UI primitives and styled with Tailwind CSS. These components form the entire UI foundation of Patriot Heavy Ops, providing accessible, customizable, and beautifully designed interface elements. The library's approach of providing source code rather than a package dependency gives us full control over styling and behavior while maintaining consistency and accessibility standards.

**[T3 Stack](https://github.com/t3-oss/create-t3-app)** - Full-Stack TypeScript Development  
The T3 Stack provides type-safe environment management and development patterns that ensure robust, maintainable code. Patriot Heavy Ops leverages T3's `@t3-oss/env-nextjs` for environment variable validation and follows T3's opinionated approach to full-stack TypeScript development, ensuring type safety from database to UI.

These open source foundations save months of development time by providing battle-tested patterns, components, and architecture, allowing us to focus on what makes Patriot Heavy Ops unique - connecting contractors with military-trained heavy equipment operators.

## 🛠️ Built With

- [Next.js](https://nextjs.org)
  This React framework provides server-side rendering and static site generation for Patriot Heavy Ops. It powers the entire application architecture with App Router and API routes. The main configuration for Next.js can be found in `next.config.mjs`.
- [React](https://reactjs.org)
  This JavaScript library builds the interactive user interfaces for Patriot Heavy Ops, including contractor dashboards, operator profiles, and service request forms. The React components are located in the `components/` and `app/` directories.
- [TypeScript](https://www.typescriptlang.org)
  This typed superset of JavaScript ensures code reliability and maintainability across Patriot Heavy Ops. TypeScript definitions and configurations can be found in `tsconfig.json` and type definitions in the `types/` directory.
- [Tailwind CSS](https://tailwindcss.com)
  This utility-first CSS framework rapidly builds custom user interfaces for Patriot Heavy Ops with responsive design. The configuration for Tailwind CSS can be found in `tailwind.config.js` with custom styling in `styles/globals.css`.
- [Prisma](https://www.prisma.io)
  This database toolkit handles object-relational mapping for Patriot Heavy Ops, managing users, service requests, and operator assignments. Prisma configuration and schema can be found in the `prisma/` directory with models for contractors, operators, and equipment bookings.
- [PostgreSQL](https://www.postgresql.org)
  This powerful relational database stores all Patriot Heavy Ops application data including user profiles, service requests, and payment records. The connection to PostgreSQL is managed through Prisma with Docker Compose configuration in `docker-compose.yml`.
- [NextAuth.js](https://next-auth.js.org)
  This authentication solution handles user login and authorization for Patriot Heavy Ops contractors and operators. The NextAuth.js configuration and providers can be found in `lib/auth.ts` with credential-based authentication.
- [Stripe](https://stripe.com)
  This payment processing service handles deposits and final payments for Patriot Heavy Ops equipment bookings. The integration of Stripe is found in `lib/stripe.ts` and payment-related API routes in `app/api/`.
- [React Hook Form](https://react-hook-form.com)
  This library manages form state and validation for Patriot Heavy Ops service request forms and user registration. Form components utilize React Hook Form with Zod validation schemas found in `lib/validations/`.
- [Zod](https://zod.dev)
  This TypeScript-first schema validation library ensures data integrity for Patriot Heavy Ops forms and API endpoints. Validation schemas are located in `lib/validations/` for user input and service requests.
- [Radix UI](https://www.radix-ui.com)
  This low-level UI primitive library provides accessible components for Patriot Heavy Ops interface elements. Radix components are used throughout the `components/ui/` directory for dialogs, dropdowns, and form controls.
- [Lucide React](https://lucide.dev)
  This icon library provides consistent iconography throughout Patriot Heavy Ops interface. Icons are implemented in `components/icons.tsx` and used across the application.
- [Jest](https://jestjs.io)
  This testing framework ensures code quality for Patriot Heavy Ops with unit and integration tests. Jest configuration can be found in `jest.config.js` with tests located in the `__tests__/` directory.
- [Docker](https://www.docker.com)
  This containerization platform provides consistent development environments for Patriot Heavy Ops. Docker configuration can be found in `Dockerfile.dev` and `docker-compose.yml` for local development setup.
- [Vercel Analytics](https://vercel.com/analytics)
  This analytics service tracks user behavior and performance metrics for Patriot Heavy Ops. Analytics integration is configured in the application components for monitoring contractor and operator engagement.

## Development Workflow

### Pre-commit Validation

Per `.cursorrules.md` standards, all code changes must pass validation before committing:

```bash
# Manual validation (run before every commit)
npm run validate

# Docker-based validation (recommended for consistency)
npm run validate:docker

# Or use the validation script directly
./scripts/validate-pre-commit.sh
```

The validation process includes:
- **TypeScript type checking**: `npx tsc --noEmit`
- **ESLint code quality**: `npx eslint . --quiet`

### Local CI Simulation

Before pushing changes, simulate the CI environment:

```bash
# Run all tests in Docker environment
docker-compose exec app npm test

# Full validation pipeline
docker-compose exec app npm run validate && docker-compose exec app npm test
```

### Type Safety Standards

This project enforces strict type safety:
- **Zero `any` types allowed** - Use proper TypeScript types
- **Unused parameters** - Prefix with underscore (`_unused`)
- **Optional chaining required** - Use `obj?.prop` for uncertain data
- **Error boundaries** - Wrap uncertain operations in try-catch blocks
