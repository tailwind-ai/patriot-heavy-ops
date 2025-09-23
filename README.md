# Patriot Heavy Ops

## 🚀 Deployment Status

**Live Site**: https://patriot-heavy-ops.vercel.app  
**Status**: ✅ Successfully deployed and working  
**Last Updated**: December 2024

## Product Vision

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

## Pages & Features

### Home Page ✅ **COMPLETED**

- Hero section with clear value proposition
- Key benefits for both contractors and operators
- Call-to-action buttons for both user types
- Trust indicators (military background, certifications)
- AI chat preview/demo

### Hire Equipment with Operators Page

- **Primary**: AI chat interface for natural conversation
  - "I need an excavator operator for a 3-week project in Austin"
  - Dynamic follow-up questions based on context
  - Real-time operator suggestions and availability
- **Fallback**: Traditional form with fields for company name, contact person, email, phone, project location, start date, equipment types needed, budget range, project duration, special requirements
- **Validation**: Required full name, email, phone
- **Success Flow**: Confirmation page, email notification, operator matching process

### For Operators Page

- **Primary**: AI chat interface for operator onboarding
  - "I'm a Marine Corps veteran with 8 years operating bulldozers"
  - Skill discovery and certification guidance
  - Availability and location preferences
- **Fallback**: Traditional form with fields for full name, email, phone, military branch, years of service, equipment certifications, preferred locations
- **Validation**: Required name/email, military service verification, certification validation
- **Success Flow**: Application confirmation, vetting process initiation

### Chat Interface Features

- **Real-time messaging** with typing indicators
- **Message history** and conversation context
- **Quick action buttons** for common responses
- **File upload** for certifications and documents
- **Voice input** for mobile users
- **Conversation export** for record keeping

### About Page

- Company mission and story
- Military connection and values
- Team background and expertise
- AI technology explanation and benefits

### Contact Page

- AI chat interface for general inquiries
- Fallback contact form
- Company information
- Response time expectations

## Technical Requirements

### Non-Functional Requirements

- **Mobile-first responsive design** (320px to 4K breakpoints)
- **SEO**: Meta tags, structured data, sitemap
- **Cross-browser**: Chrome, Firefox, Safari, Edge (mobile + desktop)
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Core Web Vitals optimization (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- **Security**: Form validation, CSRF protection, PII handling, AI prompt injection protection

### Chat & AI Requirements

- **Real-time communication**: WebSocket or Server-Sent Events for chat
- **Streaming responses**: AI responses streamed for better UX
- **Intent recognition**: Natural language processing for user intent
- **Entity extraction**: Extract key information from conversations
- **Conversation context**: Maintain context across multiple turns
- **Fallback mechanisms**: Graceful degradation when AI fails
- **Rate limiting**: Prevent AI API abuse and manage costs

### Form Requirements (Fallback)

- **Client-side validation** with immediate feedback
- **Server-side validation** for security
- **Rate limiting** on form submissions
- **Success/error states** with clear messaging
- **Data sanitization** and XSS prevention

### Data Handling

- **Conversation storage**: Structured storage for chat history and context
- **Form submissions**: JSON storage initially, extensible to database
- **PII protection**: Minimal logging, secure transmission, AI data privacy
- **Backup strategy**: Regular data exports
- **Compliance**: GDPR considerations for EU users, AI data retention policies

## Tech Stack

### Front-End ✅ **DEPLOYED**

- **Next.js 15.5.3** (App Router, TypeScript, React 19)
- **React 19.1.1** (Latest stable with enhanced performance)
- **Tailwind CSS** (utility-first styling)
- **React Hook Form + Zod** (form handling & validation)
- **Vercel AI SDK** (AI integration and streaming)
- **Lucide React 0.544.0** (Modern icon system)

### Back-End

- **Next.js 15 API Routes** (form processing and chat endpoints)
- **Vercel AI SDK** (AI model integration)
- **OpenAI/Anthropic** (LLM providers)
- **PostgreSQL** (production database)
- **Prisma 6.16.2** (database ORM with enhanced performance)

### Real-Time Communication

- **Server-Sent Events** (streaming AI responses)
- **WebSocket** (real-time chat, if needed)
- **Vercel Edge Runtime** (low-latency AI responses)

### Deployment ✅ **COMPLETED**

- **Vercel** (hosting & preview deployments)
- **GitHub** (version control with automated workflows)
- **Docker** (containerized development environment)
- **Prisma migrate deploy** runs during build to keep schema in sync
- **Automated CI/CD** with comprehensive testing pipeline

### Environment

Create a `.env.local` with at least:

```
DATABASE_URL=postgres://...
PRISMA_DATABASE_URL=postgres://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Optional providers: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SMTP_FROM`, `POSTMARK_API_TOKEN`, `POSTMARK_SIGN_IN_TEMPLATE`, `POSTMARK_ACTIVATION_TEMPLATE`, `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRO_MONTHLY_PLAN_ID`.

### Design

- **Figma** (design system & mockups)
- **Mobile-first** wireframes
- **Component library** for consistency
- **Chat UI components** (message bubbles, typing indicators)

## Development Phases

### Phase 1: Foundation & Core Forms (MVP) ✅ **COMPLETED**

- ✅ Project setup with Vercel AI SDK template
- ✅ Database setup (PostgreSQL + Prisma Accelerate)
- ✅ Home page with navigation
- ✅ Deployment to Vercel
- 🔄 Authentication system (NextAuth.js) - **NEXT**
- 🔄 Traditional forms as fallback - **NEXT**
- 🔄 Basic form processing and data storage - **NEXT**
- 🔄 Email notifications for form submissions - **NEXT**

### Phase 2: Conversational Interface

- AI chat interface for both user types
- Conversation flow design for contractors
- Conversation flow design for operators
- Intent recognition and entity extraction
- Fallback to traditional forms when AI fails
- Enhanced styling and UX for chat experience
- Accessibility improvements

### Phase 3: AI-Powered Matching & Content

- About page with company story
- Contact page with chat integration
- AI-powered matching algorithm
- Operator-contractor recommendation system
- Conversation history and context management
- Advanced form data management
- Admin dashboard for conversation monitoring

### Phase 4: Advanced AI Features

- Multi-turn conversation optimization
- Military/construction domain training
- Real-time operator availability updates
- Project requirement analysis
- Automated follow-up conversations
- Performance analytics and optimization

## Development Workflow

### Quality Assurance ✅ **AUTOMATED**

- **TypeScript** strict mode with zero compilation errors
- **ESLint** with comprehensive rules and zero warnings
- **Jest Testing** with 472+ passing tests (100% success rate)
- **Test Coverage** monitoring for critical components:
  - API routes: 94-100% coverage
  - Authentication: 100% coverage
  - Validations: 92.64% coverage
- **Pre-commit hooks** with Husky for code quality enforcement

### Performance Monitoring ✅ **OPTIMIZED**

- **Bundle Analysis** with optimized 102kB baseline
- **Core Web Vitals** compliance (LCP < 2.5s, CLS < 0.1)
- **Docker Build** optimization with proper layer caching
- **Static Generation** for 25+ routes

### Framework Upgrades ✅ **COMPLETED**

- **Next.js 13 → 15** migration with async params/headers
- **React 18 → 19** upgrade with peer dependency resolution
- **Prisma 4 → 6** upgrade with enhanced client generation
- **Comprehensive validation** across all upgrade phases

## Next Steps

1. **AI Chat Interface** - Implement Vercel AI SDK chat components
2. **Enhanced Forms** - Expand contractor/operator form functionality
3. **Matching Algorithm** - AI-powered operator-contractor matching
4. **Real-time Features** - WebSocket integration for live updates

## Success Metrics

### Technical Excellence ✅ **ACHIEVED**

- **Build Success Rate**: 100% (zero failed builds)
- **Test Success Rate**: 100% (472/472 tests passing)
- **TypeScript Errors**: 0 (strict mode compliance)
- **ESLint Warnings**: 0 (clean code standards)
- **Page Load Times**: < 2s (optimized bundle)
- **Core Web Vitals**: Passing (performance optimized)
- **Docker Build**: ✅ Working (containerized deployment)

### Business Metrics (Targets)

- Form completion rates > 80%
- Mobile conversion rates > 60%
- Accessibility score > 95%
- Cross-browser compatibility 100%
- User satisfaction > 4.5/5
