# Testing Infrastructure Setup & Framework Upgrade Plan

## Context & Objectives

I'm stabilizing an application fork with 95% test coverage before implementing business requirements. Current testing validates implementation but not actual requirements/intended behavior. Need to establish automated quality gates and upgrade major frameworks safely.

**Current Status:**

- ✅ Jest (90% coverage thresholds), ESLint, Prettier, Husky dependency, Commitlint
- ❌ Missing: Pre-commit hooks, lint-staged, GitHub Actions, VS Code debugging, snapshot testing

**Major Framework Upgrades Planned:**

1. Next.js 13 → 15
2. React 18 → 19
3. Prisma 4 → 6

## Phase 1: Pre-Commit Automation Setup

### Step 1A: Initialize Husky & lint-staged

```bash
# Initialize Husky
npm run prepare

# Install lint-staged
npm install --save-dev lint-staged@15.2.10
```

### Step 1B: Configure lint-staged in package.json

Add this configuration to package.json:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "npm test -- --bail --findRelatedTests --passWithNoTests"
    ],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  },
  "scripts": {
    "prepare": "husky install"
  }
}
```

### Step 1C: Create pre-commit hook

Create `.husky/pre-commit` file:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### Step 1D: Test pre-commit workflow

```bash
# Make test change and commit to verify hooks work
git add .
git commit -m "test: verify pre-commit hooks"
```

## Phase 2: GitHub Actions CI/CD

### Step 2A: Create GitHub Actions workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main, sam-dev]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run TypeScript check
        run: npx tsc --noEmit

      - name: Run ESLint
        run: npm run lint

      - name: Run tests with coverage
        run: npm test -- --coverage --watchAll=false

      - name: Upload coverage to GitHub
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

      - name: Build application
        run: npm run build

  integration:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Start services
        run: docker-compose up -d

      - name: Run integration tests
        run: npm run test:integration

      - name: Stop services
        run: docker-compose down
```

## Phase 3: Enhanced Testing Configuration

### Step 3A: VS Code/Cursor test debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache", "--no-coverage"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Step 3B: Add snapshot testing setup

Install snapshot testing utilities:

```bash
npm install --save-dev @testing-library/jest-dom
```

Update Jest config for snapshots:

```json
{
  "collectCoverageFrom": [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!**/__snapshots__/**"
  ]
}
```

## Phase 4: Framework Upgrade Process

### Verification Commands for Each Phase

```bash
# Quick verification suite
npm run build && npm run lint && npm test && npx tsc --noEmit

# Full development workflow test
docker-compose up -d
npm run dev
# Test: http://localhost:3000, login, dashboard, forms

# Database integration test
npx prisma generate && npx prisma db push
```

### Step 4A: Next.js 13 → 15 Upgrade

```bash
# Before upgrade - baseline verification
npm test -- --coverage
npm run build
npm run lint
npx tsc --noEmit

# Upgrade Next.js
npm install next@15 @next/bundle-analyzer@15
npm install --save-dev @types/node@latest

# Post-upgrade verification
npm test
npm run build
npm run dev
```

### Step 4B: React 18 → 19 Upgrade

```bash
# Upgrade React
npm install react@19 react-dom@19
npm install --save-dev @types/react@19 @types/react-dom@19

# Update testing library if needed
npm install --save-dev @testing-library/react@latest

# Verification
npm test
npm run build
```

### Step 4C: Prisma 4 → 6 Upgrade

```bash
# Upgrade Prisma
npm install prisma@6 @prisma/client@6

# Update database
npx prisma generate
npx prisma db push

# Verification
npm test
docker-compose up -d
npx prisma db seed
```

## Success Criteria for Each Phase

**Phase 1 Success:**

- Pre-commit hooks run automatically
- lint-staged fixes code before commits
- Tests run on related files only
- Commits blocked if quality checks fail

**Phase 2 Success:**

- GitHub Actions runs on every push/PR
- Coverage reports uploaded to GitHub
- CI blocks merges if tests fail
- Integration tests pass in CI environment

**Phase 3 Success:**

- Can debug tests directly in Cursor/VS Code
- Snapshot tests capture UI changes
- Coverage excludes appropriate files
- Test debugging workflow is smooth

**Phase 4 Success (Per Framework):**

- All existing tests pass after upgrade
- No TypeScript compilation errors
- Application builds successfully
- Development server works
- Database operations function
- No performance regressions

## Instructions for AI Assistant

1. **Work incrementally** - Complete one phase before starting next
2. **Verify each step** - Run verification commands after each change
3. **Handle rollbacks** - If issues arise, rollback specific changes with `git checkout HEAD -- <file>`
4. **Test thoroughly** - Don't proceed to next phase until current phase passes all success criteria
5. **Document issues** - Note any unexpected errors or compatibility issues
6. **Maintain Docker-first approach** - Use `docker-compose exec app` for all Node.js commands during testing

## Rollback Strategy

```bash
# Quick rollback options
git reset --hard HEAD~1              # Full rollback
git checkout HEAD -- package.json    # Rollback dependencies
git checkout sam-dev                  # Switch back to stable branch
```

Start with Phase 1 and proceed systematically through each phase, verifying success criteria before moving forward.
