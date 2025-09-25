# Patriot Heavy Ops

## 🚀 Deployment Status

**Live Site**: https://patriot-heavy-ops.vercel.app  
**Status**: ✅ Successfully deployed and working  
**Last Updated**: December 2024

<!-- Testing Background Agent failure analysis -->

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

### About Page

- Company mission and story
- Military connection and values
- Team background and expertise

### Hire Equipment with Operators Page

### For Operators Page

### Contact Page

### Equipment Page

### Pricing Page

## Technical Requirements

### Non-Functional Requirements

- **Mobile-first responsive design** (320px to 4K breakpoints)
- **SEO**: Meta tags, structured data, sitemap
- **Cross-browser**: Chrome, Firefox, Safari, Edge (mobile + desktop)
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Core Web Vitals optimization (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- **Security**: Form validation, CSRF protection, PII handling

### Form Requirements

- **Client-side validation** with immediate feedback
- **Server-side validation** for security
- **Rate limiting** on form submissions
- **Success/error states** with clear messaging
- **Data sanitization** and XSS prevention

### Data Handling

- **Form submissions**: JSON storage initially, extensible to database
- **PII protection**: Minimal logging, secure transmission
- **Backup strategy**: Regular data exports
- **Compliance**: GDPR considerations for EU users

## Tech Stack

### Front-End ✅ **DEPLOYED**

- **Next.js 13.3.4** (App Router, TypeScript)
- **Tailwind CSS** (utility-first styling)
- **React Hook Form + Zod** (form handling & validation)

### Back-End

- **Next.js API Routes** (form processing)
- **PostgreSQL** (production database)
- **Prisma** (database ORM)

## Success Metrics

- Form completion rates > 80%
- Mobile conversion rates
- Page load times < 2s
- Accessibility score > 95%
- Cross-browser compatibility 100%# Trigger fresh Vercel deployment
