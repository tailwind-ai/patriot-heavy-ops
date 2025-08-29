# Patriot Heavy Ops

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

### Home Page
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

### Front-End
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (utility-first styling)
- **React Hook Form + Zod** (form handling & validation)
- **MDX** (content pages)
- **Vercel AI SDK** (AI integration and streaming)
- **React Hook Form** (form fallback handling)

### Back-End
- **Next.js API Routes** (form processing and chat endpoints)
- **Vercel AI SDK** (AI model integration)
- **OpenAI/Anthropic** (LLM providers)
- **SQLite** (local data storage, extensible)
- **Prisma** (database ORM)
- **JSON** (initial data format)

### Real-Time Communication
- **Server-Sent Events** (streaming AI responses)
- **WebSocket** (real-time chat, if needed)
- **Vercel Edge Runtime** (low-latency AI responses)

### Deployment
- **Vercel** (hosting & preview deployments)
- **GitHub** (version control)

### Design
- **Figma** (design system & mockups)
- **Mobile-first** wireframes
- **Component library** for consistency
- **Chat UI components** (message bubbles, typing indicators)

## Development Phases

### Phase 1: Foundation & Core Forms (MVP)
- Project setup with Vercel AI SDK template
- Authentication system (NextAuth.js)
- Database setup (SQLite + Prisma)
- Home page with navigation
- Traditional forms as fallback:
  - Hire Equipment with Operators form
  - For Operators form
- Basic form processing and data storage
- Email notifications for form submissions

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

## Success Metrics
- Form completion rates > 80%
- Mobile conversion rates
- Page load times < 2s
- Accessibility score > 95%
- Cross-browser compatibility 100%