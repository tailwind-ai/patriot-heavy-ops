/**
 * Test fixtures for CI failure log scenarios
 * Used for testing Ana's failure analysis capabilities
 */

export const CI_FAILURE_LOGS = {
  TYPESCRIPT_ERRORS: `
    src/components/Button.tsx:45:12 - error TS2322: Type 'string' is not assignable to type 'number'.
    src/components/Input.tsx:23:8 - error TS2339: Property 'value' does not exist on type 'Props'.
    lib/utils.ts:67:15 - error TS2345: Argument of type 'undefined' is not assignable to parameter of type 'string'.
    
    Found 3 errors in 3 files.
    
    Errors  Files
         1  src/components/Button.tsx:45
         1  src/components/Input.tsx:23
         1  lib/utils.ts:67
  `,

  JEST_TEST_FAILURES: `
    FAIL __tests__/components/Button.test.tsx
      Button component
        ✕ should render correctly (15 ms)
        ✕ should handle click events (8 ms)
    
    ● Button component › should render correctly
    
      expect(received).toBe(expected) // Object.is equality
    
      Expected: "Submit"
      Received: "Click me"
    
        12 |     render(<Button>Submit</Button>)
        13 |     const button = screen.getByRole('button')
      > 14 |     expect(button).toBe('Submit')
           |                    ^
        15 |   })
    
        at Object.<anonymous> (__tests__/components/Button.test.tsx:14:20)
    
    ● Button component › should handle click events
    
      TypeError: Cannot read properties of undefined (reading 'onClick')
    
        at Object.<anonymous> (__tests__/components/Button.test.tsx:20:25)
    
    FAIL __tests__/lib/utils.test.ts
      Utils
        ✕ should format currency correctly (5 ms)
    
    Test Suites: 2 failed, 15 passed, 17 total
    Tests:       3 failed, 45 passed, 48 total
    Snapshots:   0 total
    Time:        12.345 s
  `,

  ESLINT_ERRORS: `
    /src/components/Header.tsx
      15:1   error    'React' is not defined                    no-undef
      23:5   error    Missing semicolon                         semi
      45:12  warning  'props' is defined but never used        @typescript-eslint/no-unused-vars
      67:8   error    Expected '===' and instead saw '=='      eqeqeq
    
    /src/pages/index.tsx
      8:1    error    'useState' is not defined                 no-undef
      12:15  error    Missing return type on function          @typescript-eslint/explicit-function-return-type
    
    /lib/auth.ts
      34:7   error    'user' is assigned a value but never used no-unused-vars
      56:12  warning  Prefer const assertion                    prefer-const
    
    ✖ 8 problems (6 errors, 2 warnings)
      4 errors and 1 warning potentially fixable with the --fix option.
  `,

  BUILD_FAILURES: `
    > Build error occurred
    Error: Cannot resolve module './components/MissingComponent' from 'src/pages/index.tsx'
    
    Module not found: Error: Can't resolve './missing-file' in '/app/src/components'
    resolve './missing-file' in '/app/src/components'
      using description file: /app/package.json (relative path: ./src/components)
        Field 'browser' doesn't contain a valid alias configuration
    
    ModuleNotFoundError: Module not found: Error: Can't resolve '@/lib/missing-utils' in '/app/src/pages'
    
    Build failed with 3 errors:
     - Cannot resolve './components/MissingComponent'
     - Cannot resolve './missing-file'
     - Cannot resolve '@/lib/missing-utils'
  `,

  COVERAGE_FAILURES: `
    =============================== Coverage summary ===============================
    Statements   : 82.45% ( 1234/1496 ) - Threshold: 90%
    Branches     : 78.23% ( 567/725 ) - Threshold: 90%
    Functions    : 85.67% ( 234/273 ) - Threshold: 90%
    Lines        : 83.12% ( 1156/1391 ) - Threshold: 90%
    ================================================================================
    
    Coverage threshold for statements (90%) not met: 82.45%
    Coverage threshold for branches (90%) not met: 78.23%
    Coverage threshold for functions (90%) not met: 85.67%
    Coverage threshold for lines (90%) not met: 83.12%
    
    Uncovered files:
      src/components/UntestedComponent.tsx: 0% coverage
      lib/unused-utils.ts: 15% coverage
      src/pages/legacy-page.tsx: 45% coverage
  `,

  INTEGRATION_TEST_FAILURES: `
    Running integration tests...
    
    ✕ API Authentication Flow
      Expected status 200, received 401
      Authentication token validation failed
      
    ✕ Database Connection Test
      Error: connect ECONNREFUSED 127.0.0.1:5432
      Could not connect to PostgreSQL database
      
    ✕ External Service Integration
      Timeout: Request to https://api.external-service.com timed out after 30000ms
      
    Integration Tests: 3 failed, 0 passed
    Total time: 45.678s
  `,

  DOCKER_BUILD_FAILURES: `
    Step 5/12 : RUN npm ci
     ---> Running in 1234567890ab
    npm ERR! code ENOENT
    npm ERR! syscall open
    npm ERR! path /app/package.json
    npm ERR! errno -2
    npm ERR! enoent ENOENT: no such file or directory, open '/app/package.json'
    
    Step 8/12 : COPY . .
     ---> Running in abcdef123456
    COPY failed: file not found in build context or excluded by .dockerignore: stat missing-file.txt: file does not exist
    
    The command '/bin/sh -c npm ci' returned a non-zero code: 254
  `,

  MIXED_FAILURES: `
    TypeScript compilation errors:
    src/components/Button.tsx:45:12 - error TS2322: Type 'string' is not assignable to type 'number'.
    
    ESLint errors:
    /src/components/Header.tsx
      15:1  error  'React' is not defined  no-undef
    
    Jest test failures:
    FAIL __tests__/components/Button.test.tsx
      ✕ should render correctly (15 ms)
    
    Build errors:
    Module not found: Error: Can't resolve './missing-file'
    
    Coverage failures:
    Coverage threshold for statements (90%) not met: 82.45%
  `,

  EMPTY_LOG: '',

  MALFORMED_LOG: `
    This is not a standard log format
    Random text with no patterns
    Some numbers: 123 456 789
    File paths without errors: src/file.ts
    Error without proper format
  `,

  LARGE_LOG: Array(1000).fill('error in src/test.ts:10:5 - Type error').join('\n'),

  UNICODE_LOG: `
    error in src/测试文件.ts:10:5 - Unicode file name error
    Error message with emoji: 🚨 Build failed
    Special characters: àáâãäåæçèéêë
    Chinese characters: 错误信息
  `,

  PERFORMANCE_LOG: `
    Performance issues detected:
    
    Bundle size exceeded: 2.5MB (limit: 2MB)
    Largest chunks:
      - main.js: 1.2MB
      - vendor.js: 800KB
      - styles.css: 500KB
    
    Slow components detected:
      - LargeTable: 450ms render time
      - ComplexChart: 320ms render time
    
    Memory usage: 150MB (warning threshold: 100MB)
  `,

  SECURITY_WARNINGS: `
    Security vulnerabilities found:
    
    High severity:
      - lodash@4.17.15: Prototype Pollution vulnerability
      - axios@0.18.0: Server-Side Request Forgery
    
    Medium severity:
      - express@4.16.0: Denial of Service vulnerability
    
    Low severity:
      - moment@2.24.0: Regular Expression Denial of Service
    
    Run 'npm audit fix' to fix 3 of 4 vulnerabilities.
  `,
} as const

export const EXPECTED_ANALYSIS_RESULTS = {
  TYPESCRIPT_ERRORS: {
    issueCount: 3,
    priorities: ['high', 'high', 'high'],
    files: ['src/components/Button.tsx', 'src/components/Input.tsx', 'lib/utils.ts'],
    lineNumbers: [45, 23, 67],
    rootCauses: ['TypeScript compilation error', 'TypeScript compilation error', 'TypeScript compilation error'],
  },

  JEST_TEST_FAILURES: {
    issueCount: 2,
    priorities: ['high', 'high'],
    files: ['__tests__/components/Button.test.tsx', '__tests__/lib/utils.test.ts'],
    rootCauses: ['Jest test failure', 'Jest test failure'],
  },

  ESLINT_ERRORS: {
    issueCount: 3,
    priorities: ['medium', 'medium', 'medium'],
    files: ['/src/components/Header.tsx', '/src/pages/index.tsx', '/lib/auth.ts'],
    rootCauses: ['ESLint error', 'ESLint error', 'ESLint error'],
  },

  BUILD_FAILURES: {
    issueCount: 1,
    priorities: ['critical'],
    rootCauses: ['Build failure - missing module'],
  },

  MIXED_FAILURES: {
    issueCount: 5,
    priorities: ['high', 'medium', 'high', 'critical', 'medium'],
    rootCauses: [
      'TypeScript compilation error',
      'ESLint error',
      'Jest test failure',
      'Build failure - missing module',
      'Coverage threshold failure',
    ],
  },
} as const

/**
 * Helper function to get log content by scenario name
 */
export function getLogContent(scenario: keyof typeof CI_FAILURE_LOGS): string {
  return CI_FAILURE_LOGS[scenario]
}

/**
 * Helper function to get expected results by scenario name
 */
export function getExpectedResults(scenario: keyof typeof EXPECTED_ANALYSIS_RESULTS) {
  return EXPECTED_ANALYSIS_RESULTS[scenario]
}

/**
 * Re-export Vercel log content function for compatibility
 */
export { getVercelLogContent } from './vercel-failure-logs'
