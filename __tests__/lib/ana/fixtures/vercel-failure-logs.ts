/**
 * Test fixtures for Vercel deployment failure scenarios
 * Used for testing Ana's Vercel deployment analysis capabilities
 */

export const VERCEL_FAILURE_LOGS = {
  BUILD_TIMEOUT: `
    [12:34:56.789] Running build in Washington, D.C., USA (East) – iad1
    [12:34:56.890] Cloning github.com/user/repo (Branch: main, Commit: abc123)
    [12:34:57.123] Cloning completed: 1.234s
    [12:34:57.234] Running "vercel build"
    [12:34:57.345] Detected Next.js
    [12:34:57.456] Installing dependencies...
    [12:35:27.789] npm install completed: 30.333s
    [12:35:27.890] Building application...
    [12:45:27.890] Error: Build timed out after 10 minutes
    [12:45:27.891] Build failed with exit code 1
  `,

  MEMORY_LIMIT_EXCEEDED: `
    [12:34:56.789] Running build in Washington, D.C., USA (East) – iad1
    [12:34:57.890] Building application...
    [12:35:45.123] Generating static pages...
    [12:36:12.456] Error: Process ran out of memory
    [12:36:12.457] JavaScript heap out of memory
    [12:36:12.458] FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
    [12:36:12.459] Build failed with exit code 134
  `,

  ENVIRONMENT_VARIABLE_MISSING: `
    [12:34:56.789] Running build in Washington, D.C., USA (East) – iad1
    [12:34:57.890] Building application...
    [12:35:12.345] Error: Environment variable DATABASE_URL is required but not set
    [12:35:12.346] at validateEnv (/vercel/path0/.next/server/chunks/123.js:1:234)
    [12:35:12.347] at Object.<anonymous> (/vercel/path0/.next/server/app/api/route.js:5:67)
    [12:35:12.348] Build failed with exit code 1
  `,

  DEPENDENCY_INSTALLATION_FAILED: `
    [12:34:56.789] Running build in Washington, D.C., USA (East) – iad1
    [12:34:57.890] Installing dependencies...
    [12:35:12.345] npm ERR! code ERESOLVE
    [12:35:12.346] npm ERR! ERESOLVE unable to resolve dependency tree
    [12:35:12.347] npm ERR! peer dep missing: react@^18.0.0, required by @radix-ui/react-dialog@1.0.3
    [12:35:12.348] npm ERR! Fix the upstream dependency conflict, or retry
    [12:35:12.349] npm ERR! this command with --force, or --legacy-peer-deps
    [12:35:12.350] Build failed with exit code 1
  `,

  NEXT_JS_BUILD_ERROR: `
    [12:34:56.789] Running build in Washington, D.C., USA (East) – iad1
    [12:34:57.890] Building application...
    [12:35:12.345] > Build error occurred
    [12:35:12.346] Error: Cannot resolve module './components/MissingComponent' from 'pages/index.tsx'
    [12:35:12.347] 
    [12:35:12.348] > Build failed because of webpack errors
    [12:35:12.349] Build failed with exit code 1
  `,

  FUNCTION_SIZE_LIMIT: `
    [12:34:56.789] Running build in Washington, D.C., USA (East) – iad1
    [12:34:57.890] Building application...
    [12:35:45.123] Generating serverless functions...
    [12:36:12.456] Error: Serverless Function "api/large-function.js" is 52.1 MB which exceeds the maximum size limit of 50 MB
    [12:36:12.457] Try reducing the size of your Serverless Function or use Edge Runtime
    [12:36:12.458] Build failed with exit code 1
  `,

  STATIC_GENERATION_ERROR: `
    [12:34:56.789] Running build in Washington, D.C., USA (East) – iad1
    [12:34:57.890] Building application...
    [12:35:45.123] Generating static pages...
    [12:36:12.456] Error occurred prerendering page "/products/[id]"
    [12:36:12.457] TypeError: Cannot read properties of undefined (reading 'name')
    [12:36:12.458] at getStaticProps (/vercel/path0/.next/server/pages/products/[id].js:123:45)
    [12:36:12.459] Build failed with exit code 1
  `,

  PRISMA_MIGRATION_ERROR: `
    [12:34:56.789] Running build in Washington, D.C., USA (East) – iad1
    [12:34:57.890] Building application...
    [12:35:12.345] Running prisma generate...
    [12:35:23.456] Error: P1001: Can't reach database server at 'localhost:5432'
    [12:35:23.457] Please make sure your database server is running at 'localhost:5432'
    [12:35:23.458] Prisma schema validation failed
    [12:35:23.459] Build failed with exit code 1
  `,

  TYPESCRIPT_BUILD_ERROR: `
    [12:34:56.789] Running build in Washington, D.C., USA (East) – iad1
    [12:34:57.890] Building application...
    [12:35:12.345] Type checking...
    [12:35:23.456] pages/api/users.ts:45:12 - error TS2322: Type 'string' is not assignable to type 'number'
    [12:35:23.457] components/Button.tsx:23:8 - error TS2339: Property 'onClick' does not exist on type 'Props'
    [12:35:23.458] Found 2 errors. Watching for file changes.
    [12:35:23.459] Build failed with exit code 1
  `,

  EDGE_RUNTIME_ERROR: `
    [12:34:56.789] Running build in Washington, D.C., USA (East) – iad1
    [12:34:57.890] Building application...
    [12:35:45.123] Compiling Edge Runtime functions...
    [12:36:12.456] Error: The Edge Runtime does not support Node.js 'fs' module
    [12:36:12.457] Used in: api/edge-function.js
    [12:36:12.458] Consider using fetch() instead of fs.readFile()
    [12:36:12.459] Build failed with exit code 1
  `,

  DEPLOYMENT_TIMEOUT: `
    [12:34:56.789] Running build in Washington, D.C., USA (East) – iad1
    [12:34:57.890] Building application...
    [12:35:45.123] Build completed successfully
    [12:35:45.234] Uploading build outputs...
    [12:45:45.234] Error: Deployment timed out after 10 minutes
    [12:45:45.235] Failed to upload build artifacts
    [12:45:45.236] Deployment failed
  `,

  CUSTOM_BUILD_COMMAND_ERROR: `
    [12:34:56.789] Running build in Washington, D.C., USA (East) – iad1
    [12:34:57.890] Running custom build command: "npm run build:custom"
    [12:35:12.345] > build:custom
    [12:35:12.346] > custom-build-tool --production
    [12:35:23.456] Error: custom-build-tool: command not found
    [12:35:23.457] Build script failed
    [12:35:23.458] Build failed with exit code 127
  `,

  MIXED_VERCEL_ERRORS: `
    [12:34:56.789] Running build in Washington, D.C., USA (East) – iad1
    [12:34:57.890] Installing dependencies...
    [12:35:12.345] npm WARN deprecated package@1.0.0
    [12:35:23.456] Dependencies installed successfully
    [12:35:23.567] Building application...
    [12:35:45.123] Error: Environment variable API_KEY is required but not set
    [12:35:45.234] pages/api/data.ts:12:5 - error TS2322: Type 'string' is not assignable to type 'number'
    [12:35:45.345] Error: Serverless Function "api/large.js" is 52.1 MB which exceeds the limit
    [12:35:45.456] Build failed with exit code 1
  `,
} as const

type ExpectedVercelAnalysis = {
  issueCount: number
  priorities: readonly string[]
  rootCauses: readonly string[]
  suggestedFixes?: readonly string[]
  files?: readonly string[]
  lineNumbers?: readonly number[]
}

export const EXPECTED_VERCEL_ANALYSIS: Record<string, ExpectedVercelAnalysis> =
  {
    BUILD_TIMEOUT: {
      issueCount: 1,
      priorities: ["critical"],
      rootCauses: ["Vercel build timeout"],
      suggestedFixes: [
        "Optimize build process to complete within time limit, consider build caching",
      ],
    },

    MEMORY_LIMIT_EXCEEDED: {
      issueCount: 1,
      priorities: ["critical"],
      rootCauses: ["Memory limit exceeded"],
      suggestedFixes: [
        "Reduce memory usage during build, optimize large dependencies",
      ],
    },

    ENVIRONMENT_VARIABLE_MISSING: {
      issueCount: 1,
      priorities: ["high"],
      rootCauses: ["Missing environment variable"],
      suggestedFixes: [
        "Add DATABASE_URL environment variable in Vercel dashboard",
      ],
    },

    DEPENDENCY_INSTALLATION_FAILED: {
      issueCount: 1,
      priorities: ["high"],
      rootCauses: ["Dependency resolution conflict"],
      suggestedFixes: [
        "Fix peer dependency conflicts, update package versions",
      ],
    },

    NEXT_JS_BUILD_ERROR: {
      issueCount: 1,
      priorities: ["critical"],
      rootCauses: ["Next.js build failure - missing module"],
      suggestedFixes: [
        "Check import paths and ensure all required components exist",
      ],
    },

    FUNCTION_SIZE_LIMIT: {
      issueCount: 1,
      priorities: ["high"],
      rootCauses: ["Serverless function size limit exceeded"],
      suggestedFixes: ["Reduce function bundle size or use Edge Runtime"],
    },

    STATIC_GENERATION_ERROR: {
      issueCount: 1,
      priorities: ["high"],
      rootCauses: ["Static page generation failure"],
      suggestedFixes: ["Fix getStaticProps error in /products/[id] page"],
    },

    PRISMA_MIGRATION_ERROR: {
      issueCount: 1,
      priorities: ["high"],
      rootCauses: ["Database connection failure"],
      suggestedFixes: ["Configure database connection for build environment"],
    },

    TYPESCRIPT_BUILD_ERROR: {
      issueCount: 2,
      priorities: ["high", "high"],
      files: ["pages/api/users.ts", "components/Button.tsx"],
      lineNumbers: [45, 23],
      rootCauses: [
        "TypeScript compilation error",
        "TypeScript compilation error",
      ],
    },

    EDGE_RUNTIME_ERROR: {
      issueCount: 1,
      priorities: ["high"],
      files: ["api/edge-function.js"],
      rootCauses: ["Edge Runtime compatibility issue"],
      suggestedFixes: [
        "Replace Node.js modules with Edge Runtime compatible alternatives",
      ],
    },

    MIXED_VERCEL_ERRORS: {
      issueCount: 3,
      priorities: ["high", "high", "high"],
      rootCauses: [
        "Missing environment variable",
        "TypeScript compilation error",
        "Serverless function size limit exceeded",
      ],
    },
  } as const

/**
 * Helper function to get Vercel log content by scenario name
 */
export function getVercelLogContent(
  scenario: keyof typeof VERCEL_FAILURE_LOGS
): string {
  return VERCEL_FAILURE_LOGS[scenario]
}

/**
 * Helper function to get expected Vercel analysis results
 */
export function getExpectedVercelResults(
  scenario: keyof typeof EXPECTED_VERCEL_ANALYSIS
): ExpectedVercelAnalysis {
  const result = EXPECTED_VERCEL_ANALYSIS[scenario]
  if (!result) {
    throw new Error(`No expected results found for scenario: ${scenario}`)
  }
  return result
}

/**
 * Common Vercel error patterns for testing
 */
export const VERCEL_ERROR_PATTERNS = {
  BUILD_TIMEOUT: /build timed out after \d+ minutes/i,
  MEMORY_LIMIT: /javascript heap out of memory|process ran out of memory/i,
  ENV_VAR_MISSING: /environment variable .+ is required but not set/i,
  DEPENDENCY_ERROR: /npm err!|yarn error|pnpm err!/i,
  FUNCTION_SIZE_LIMIT: /serverless function .+ exceeds the maximum size limit/i,
  STATIC_GENERATION: /error occurred prerendering page/i,
  TYPESCRIPT_ERROR: /error ts\d+:/i,
  EDGE_RUNTIME: /edge runtime does not support/i,
} as const
