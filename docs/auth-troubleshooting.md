# Authentication Troubleshooting Guide

## Issue: Registration and Login Not Working

### Problem
- User registration was failing with "Internal server error"
- Login functionality was not working
- Database connection authentication errors

### Root Cause
The application was unable to connect to the PostgreSQL database due to incorrect environment variables:
- `DATABASE_URL` was using wrong password (`postgres` instead of `password`)
- Environment variables were not properly loaded in development

### Solution
1. **Fixed Database Credentials**: Updated `DATABASE_URL` to use correct password from `docker-compose.yml`
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5433/patriot_heavy_ops"
   ```

2. **Created Environment File**: Added `.env.development.local` with proper configuration:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5433/patriot_heavy_ops"
   NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Regenerated Prisma Client**: Ensured Prisma client was in sync with database schema

### Verification
- ✅ User registration creates accounts successfully
- ✅ Database connection established
- ✅ Password hashing and validation working
- ✅ Strict password requirements maintained (12+ chars, complexity rules)

### Environment Setup for Development
To set up the development environment:

1. Ensure Docker containers are running:
   ```bash
   docker-compose up -d
   ```

2. Create `.env.development.local` with database credentials from `docker-compose.yml`

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### Password Requirements
The system maintains strict password validation:
- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number
- At least one special character
- No common words (password, admin, etc.)
- No keyboard patterns (qwerty, asdf, etc.)
- No 3+ repeated characters in a row
