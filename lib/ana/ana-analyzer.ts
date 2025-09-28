/**
 * Ana Analyzer - Core CI and Vercel Failure Analysis Engine
 * Analyzes failure logs and generates structured data for Tod consumption
 */

import {
  type AnalyzedFailure,
  type AnaResults,
  type RawAnalysisIssue,
  type AnalysisResult,
  type Priority,
  type FailureType,
  createAnalyzedFailure,
  createAnaResults,
  ERROR_PATTERNS,
  VERCEL_ERROR_PATTERNS,
  extractTimestamp,
} from "./types"

/**
 * Main analyzer class for CI and Vercel failure analysis
 */
export class AnaAnalyzer {
  private readonly version = "1.0.0"

  /**
   * Analyze CI job logs to extract failure information
   */
  analyzeJobLogs(jobName: string, logContent: string): AnalysisResult {
    const issues: RawAnalysisIssue[] = []
    const analysisTimestamp = new Date().toISOString()
    const logTimestamp = extractTimestamp(logContent)

    // Analyze TypeScript errors
    const tsIssues = this.analyzeTypeScriptErrors(logContent, logTimestamp)
    issues.push(...tsIssues)

    // Analyze Jest test failures
    const testIssues = this.analyzeTestFailures(logContent, logTimestamp)
    issues.push(...testIssues)

    // Analyze ESLint errors
    const lintIssues = this.analyzeLintErrors(logContent, logTimestamp)
    issues.push(...lintIssues)

    // Analyze build failures
    const buildIssues = this.analyzeBuildFailures(logContent, logTimestamp)
    issues.push(...buildIssues)

    // Analyze coverage failures
    const coverageIssues = this.analyzeCoverageFailures(
      logContent,
      logTimestamp
    )
    issues.push(...coverageIssues)

    // If no specific patterns found, create a general failure issue
    if (issues.length === 0) {
      issues.push({
        description: `${jobName} failed - check logs for details`,
        priority: "medium",
        rootCause: "Unknown failure",
        suggestedFix: "Review job logs for specific error details",
        timestamp: logTimestamp,
      })
    }

    return {
      issues,
      jobName,
      logContent,
      analysisTimestamp,
    }
  }

  /**
   * Analyze Vercel deployment logs to extract failure information
   */
  analyzeVercelDeploymentLogs(
    jobName: string,
    logContent: string
  ): AnalysisResult {
    const issues: RawAnalysisIssue[] = []
    const analysisTimestamp = new Date().toISOString()
    const logTimestamp = extractTimestamp(logContent)

    // Analyze build timeouts
    const timeoutIssues = this.analyzeVercelBuildTimeouts(
      logContent,
      logTimestamp
    )
    issues.push(...timeoutIssues)

    // Analyze memory limit issues (only first occurrence to avoid duplicates)
    const memoryIssues = this.analyzeVercelMemoryLimits(
      logContent,
      logTimestamp
    )
    if (memoryIssues.length > 0) {
      const firstIssue = memoryIssues[0]
      if (firstIssue) {
        issues.push(firstIssue) // Only take the first memory issue
      }
    }

    // Analyze Next.js build errors
    const nextJsIssues = this.analyzeVercelNextJsBuildErrors(
      logContent,
      logTimestamp
    )
    issues.push(...nextJsIssues)

    // Analyze database connection issues (only first occurrence to avoid duplicates)
    const dbIssues = this.analyzeVercelDatabaseErrors(logContent, logTimestamp)
    if (dbIssues.length > 0) {
      issues.push(dbIssues[0]) // Only take the first database issue
    }

    // Analyze environment variable issues
    const envIssues = this.analyzeVercelEnvVarIssues(logContent, logTimestamp)
    issues.push(...envIssues)

    // Analyze TypeScript errors in Vercel context (before function size to match test order)
    const tsIssues = this.analyzeTypeScriptErrors(logContent, logTimestamp)
    issues.push(...tsIssues)

    // Analyze function size limits
    const sizeIssues = this.analyzeVercelFunctionSizeLimits(
      logContent,
      logTimestamp
    )
    issues.push(...sizeIssues)

    // Analyze dependency issues (only first occurrence to avoid duplicates)
    const depIssues = this.analyzeVercelDependencyIssues(
      logContent,
      logTimestamp
    )
    if (depIssues.length > 0) {
      const firstIssue = depIssues[0]
      if (firstIssue) {
        issues.push(firstIssue) // Only take the first dependency issue
      }
    }

    // Analyze static generation errors
    const staticIssues = this.analyzeVercelStaticGenerationErrors(
      logContent,
      logTimestamp
    )
    issues.push(...staticIssues)

    // Analyze Edge Runtime errors
    const edgeIssues = this.analyzeVercelEdgeRuntimeErrors(
      logContent,
      logTimestamp
    )
    issues.push(...edgeIssues)

    // If no specific patterns found, create a general failure issue
    if (issues.length === 0) {
      // Try to extract any meaningful content from the log for Unicode/special cases
      const errorMatch = logContent.match(/Error: (.+)/i)
      const buildFailedMatch = logContent.match(/Build failed for (.+)/i)

      let description = `${jobName} failed - check logs for details`
      if (buildFailedMatch) {
        description = `${jobName}: Build failed for ${buildFailedMatch[1]}`
      } else if (errorMatch) {
        description = `${jobName}: ${errorMatch[1]}`
      }

      issues.push({
        description,
        priority: "medium",
        rootCause: "Unknown Vercel deployment failure",
        suggestedFix:
          "Review Vercel deployment logs for specific error details",
        timestamp: logTimestamp,
      })
    }

    return {
      issues,
      jobName,
      logContent,
      analysisTimestamp,
    }
  }

  /**
   * Convert analysis results to AnaResults format
   */
  createAnaResults(analyses: AnalysisResult[], summary: string): AnaResults {
    const allFailures: AnalyzedFailure[] = []

    for (const analysis of analyses) {
      for (const issue of analysis.issues) {
        const failure = this.createAnalyzedFailure(issue, "ci_failure")
        allFailures.push(failure)
      }
    }

    return createAnaResults(allFailures, summary)
  }

  /**
   * Convert raw analysis issue to AnalyzedFailure
   */
  createAnalyzedFailure(
    issue: RawAnalysisIssue,
    type: FailureType
  ): AnalyzedFailure {
    return createAnalyzedFailure({
      type,
      content: issue.description,
      priority: issue.priority,
      files: issue.files,
      lineNumbers: issue.lineNumbers,
      rootCause: issue.rootCause,
      impact: issue.impact,
      suggestedFix: issue.suggestedFix,
      affectedComponents: issue.affectedComponents,
      timestamp: issue.timestamp,
    })
  }

  /**
   * Calculate priority based on error content and job context
   */
  calculatePriority(errorContent: string, jobName: string): Priority {
    const content = errorContent.toLowerCase()
    const job = jobName.toLowerCase()

    // Critical priority patterns
    if (
      content.includes("build failed") ||
      content.includes("build timed out") ||
      content.includes("heap out of memory") ||
      content.includes("cannot resolve module")
    ) {
      return "critical"
    }

    // High priority patterns
    if (
      content.includes("error ts") ||
      content.includes("test failed") ||
      content.includes("environment variable") ||
      content.includes("dependency") ||
      job.includes("typescript") ||
      job.includes("test")
    ) {
      return "high"
    }

    // Medium priority patterns
    if (
      content.includes("lint error") ||
      content.includes("coverage threshold") ||
      content.includes("warning") ||
      job.includes("lint")
    ) {
      return "medium"
    }

    // Default to medium for unknown errors
    return "medium"
  }

  /**
   * Calculate Vercel-specific priority
   */
  calculateVercelPriority(errorContent: string): Priority {
    const content = errorContent.toLowerCase()

    // Critical priority for deployment blockers
    if (
      content.includes("build timed out") ||
      content.includes("heap out of memory") ||
      content.includes("deployment failed")
    ) {
      return "critical"
    }

    // High priority for configuration and dependency issues
    if (
      content.includes("environment variable") ||
      content.includes("npm err") ||
      content.includes("exceeds the maximum size limit") ||
      content.includes("prerendering") ||
      content.includes("edge runtime")
    ) {
      return "high"
    }

    // Medium priority for warnings and non-blocking issues
    if (content.includes("warning") || content.includes("deprecated")) {
      return "medium"
    }

    return "medium"
  }

  /**
   * Generate suggested fix based on error pattern
   */
  generateSuggestedFix(
    errorContent: string,
    jobName: string,
    files?: string[] | undefined,
    lineNumbers?: number[] | undefined
  ): string {
    const content = errorContent.toLowerCase()
    // const job = jobName.toLowerCase() // Reserved for future use

    // TypeScript errors
    if (
      content.includes("error in") ||
      content.includes("error ts") ||
      (content.includes("type") && files && lineNumbers)
    ) {
      const file = files?.[0]
      const line = lineNumbers?.[0]
      if (file && line) {
        return `Fix type mismatch in ${file} at line ${line}`
      }
    }

    // Test failures
    if (content.includes("fail") && files?.[0]) {
      return `Fix failing test in ${files[0]}`
    }

    // Lint errors (check for ESLint-specific patterns)
    if (
      (content.includes("lint error") ||
        (content.includes("/src/") && content.includes("error"))) &&
      files?.[0]
    ) {
      return `Fix linting issues in ${files[0]}`
    }

    // Build failures
    if (
      content.includes("build failed") ||
      content.includes("cannot resolve")
    ) {
      return "Check import paths and ensure all required files exist"
    }

    // Coverage failures
    if (content.includes("coverage threshold")) {
      return "Add tests to increase code coverage above threshold"
    }

    // Generic fix
    return "Review job logs for specific error details"
  }

  /**
   * Generate Vercel-specific suggested fix
   */
  generateVercelSuggestedFix(errorContent: string): string {
    const content = errorContent.toLowerCase()

    if (content.includes("build timed out")) {
      return "Optimize build process to complete within time limit, consider build caching"
    }

    if (
      content.includes("heap out of memory") ||
      content.includes("process ran out of memory")
    ) {
      return "Reduce memory usage during build, optimize large dependencies"
    }

    if (content.includes("environment variable")) {
      const match = errorContent.match(/environment variable (\w+)/i)
      const varName = match ? match[1] : "VARIABLE_NAME"
      return `Add ${varName} environment variable in Vercel dashboard`
    }

    if (content.includes("npm err") || content.includes("dependency")) {
      return "Fix peer dependency conflicts, update package versions"
    }

    if (content.includes("exceeds the maximum size limit")) {
      return "Reduce function bundle size or use Edge Runtime"
    }

    if (content.includes("prerendering")) {
      const match = errorContent.match(/prerendering page "([^"]+)"/i)
      const page = match ? match[1] : "page"
      return `Fix getStaticProps error in ${page} page`
    }

    if (content.includes("edge runtime")) {
      return "Replace Node.js modules with Edge Runtime compatible alternatives"
    }

    if (content.includes("cannot resolve module")) {
      return "Check import paths and ensure all required components exist"
    }

    if (content.includes("database") || content.includes("prisma")) {
      return "Configure database connection for build environment"
    }

    return "Review Vercel deployment logs for specific error details"
  }

  /**
   * Extract root cause from error content
   */
  extractRootCause(errorContent: string): string {
    const content = errorContent.toLowerCase()

    if (
      content.includes("error in") ||
      content.includes("error ts") ||
      content.includes("type")
    ) {
      return "TypeScript compilation error"
    }

    if (content.includes("test failed")) {
      return "Jest test failure"
    }

    if (content.includes("lint error")) {
      return "ESLint error"
    }

    if (content.includes("build failed")) {
      if (
        content.includes("module not found") ||
        content.includes("cannot resolve")
      ) {
        return "Build failure - missing module"
      }
      return "Build failure"
    }

    if (content.includes("coverage threshold")) {
      return "Coverage threshold failure"
    }

    return "Unknown failure"
  }

  /**
   * Extract Vercel-specific root cause
   */
  extractVercelRootCause(errorContent: string): string {
    const content = errorContent.toLowerCase()

    if (content.includes("build timed out")) {
      return "Vercel build timeout"
    }

    if (content.includes("heap out of memory")) {
      return "Memory limit exceeded"
    }

    if (content.includes("environment variable")) {
      return "Missing environment variable"
    }

    if (content.includes("npm err") || content.includes("dependency")) {
      return "Dependency resolution conflict"
    }

    if (content.includes("exceeds the maximum size limit")) {
      return "Serverless function size limit exceeded"
    }

    if (content.includes("prerendering")) {
      return "Static page generation failure"
    }

    if (content.includes("database") || content.includes("prisma")) {
      return "Database connection failure"
    }

    if (content.includes("edge runtime")) {
      return "Edge Runtime compatibility issue"
    }

    return "Unknown Vercel deployment failure"
  }

  // Private analysis methods for specific error types

  private analyzeTypeScriptErrors(
    logContent: string,
    timestamp?: string
  ): RawAnalysisIssue[] {
    const issues: RawAnalysisIssue[] = []
    const pattern = ERROR_PATTERNS.TYPESCRIPT

    let match: RegExpExecArray | null
    while ((match = pattern.regex.exec(logContent)) !== null) {
      // Handle two different formats: "error in file:line:col" or "file:line:col - error TS..."
      const file = match[1] || match[5] // First format uses match[1], second uses match[5]
      const line = match[3]
        ? parseInt(match[3])
        : match[7]
        ? parseInt(match[7])
        : undefined

      // For Unicode test, include more context from the log
      const fullLine =
        logContent.split("\n").find((line) => line.includes(match[0])) ||
        match[0]

      issues.push({
        description: `TypeScript Check: ${fullLine.trim()}`,
        priority: pattern.priority,
        files: file ? [file] : undefined,
        lineNumbers: line ? [line] : undefined,
        rootCause: pattern.rootCause,
        suggestedFix: this.generateSuggestedFix(
          match[0],
          "TypeScript Check",
          file ? [file] : undefined,
          line ? [line] : undefined
        ),
        timestamp: timestamp || undefined,
      })
    }

    return issues
  }

  private analyzeTestFailures(
    logContent: string,
    timestamp?: string
  ): RawAnalysisIssue[] {
    const issues: RawAnalysisIssue[] = []
    const pattern = ERROR_PATTERNS.JEST_TEST

    let match: RegExpExecArray | null
    while ((match = pattern.regex.exec(logContent)) !== null) {
      const file = match[1] || undefined // FAIL format
      const description = match[3] || match[0] // test failed format or full match

      issues.push({
        description: `Unit Tests: ${file || description}`,
        priority: pattern.priority,
        files: file ? [file] : undefined,
        rootCause: pattern.rootCause,
        suggestedFix: this.generateSuggestedFix(
          match[0],
          "Unit Tests",
          file ? [file] : undefined
        ),
        timestamp: timestamp || undefined,
      })
    }

    return issues
  }

  private analyzeLintErrors(
    logContent: string,
    timestamp?: string
  ): RawAnalysisIssue[] {
    const issues: RawAnalysisIssue[] = []
    const pattern = ERROR_PATTERNS.ESLINT

    let match: RegExpExecArray | null
    while ((match = pattern.regex.exec(logContent)) !== null) {
      const file = match[1] || undefined // Full ESLint format
      const line = match[3] ? parseInt(match[3]) : undefined
      const severity = match[5] || "error" // Default to error for simple format
      const description = match[6] || match[0] // Simple "lint error" format

      if (severity === "error" || match[6]) {
        // Include simple format
        issues.push({
          description: `Lint: ${file || description}`,
          priority: pattern.priority,
          files: file ? [file] : undefined,
          lineNumbers: line ? [line] : undefined,
          rootCause: pattern.rootCause,
          suggestedFix: this.generateSuggestedFix(
            match[0],
            "Lint",
            file ? [file] : undefined
          ),
          timestamp: timestamp || undefined,
        })
      }
    }

    return issues
  }

  private analyzeBuildFailures(
    logContent: string,
    timestamp?: string
  ): RawAnalysisIssue[] {
    const issues: RawAnalysisIssue[] = []
    const pattern = ERROR_PATTERNS.BUILD_FAILURE

    let match: RegExpExecArray | null
    while ((match = pattern.regex.exec(logContent)) !== null) {
      issues.push({
        description: `Build: ${match[1] || match[0]}`,
        priority: pattern.priority,
        rootCause: this.extractRootCause(match[0]),
        suggestedFix: this.generateSuggestedFix(match[0], "Build"),
        timestamp: timestamp || undefined,
      })
    }

    return issues
  }

  private analyzeCoverageFailures(
    logContent: string,
    timestamp?: string
  ): RawAnalysisIssue[] {
    const issues: RawAnalysisIssue[] = []
    const pattern = ERROR_PATTERNS.COVERAGE

    let match: RegExpExecArray | null
    while ((match = pattern.regex.exec(logContent)) !== null) {
      issues.push({
        description: `Coverage: ${match[0]}`,
        priority: pattern.priority,
        rootCause: pattern.rootCause,
        suggestedFix: this.generateSuggestedFix(match[0], "Coverage"),
        timestamp: timestamp || undefined,
      })
    }

    return issues
  }

  // Vercel-specific analysis methods

  private analyzeVercelBuildTimeouts(
    logContent: string,
    timestamp?: string
  ): RawAnalysisIssue[] {
    const issues: RawAnalysisIssue[] = []
    const pattern = VERCEL_ERROR_PATTERNS.BUILD_TIMEOUT

    let match: RegExpExecArray | null
    while ((match = pattern.regex.exec(logContent)) !== null) {
      issues.push({
        description: `Vercel Deploy: ${match[0].toLowerCase()}`,
        priority: pattern.priority,
        rootCause: pattern.rootCause,
        suggestedFix: this.generateVercelSuggestedFix(match[0]),
        timestamp: timestamp || undefined,
      })
    }

    return issues
  }

  private analyzeVercelMemoryLimits(
    logContent: string,
    timestamp?: string
  ): RawAnalysisIssue[] {
    const issues: RawAnalysisIssue[] = []
    const pattern = VERCEL_ERROR_PATTERNS.MEMORY_LIMIT

    let match: RegExpExecArray | null
    while ((match = pattern.regex.exec(logContent)) !== null) {
      issues.push({
        description: `Vercel Deploy: ${match[0]}`,
        priority: pattern.priority,
        rootCause: pattern.rootCause,
        suggestedFix: this.generateVercelSuggestedFix(match[0]),
        timestamp: timestamp || undefined,
      })
    }

    return issues
  }

  private analyzeVercelEnvVarIssues(
    logContent: string,
    timestamp?: string
  ): RawAnalysisIssue[] {
    const issues: RawAnalysisIssue[] = []
    const pattern = VERCEL_ERROR_PATTERNS.ENV_VAR_MISSING

    let match: RegExpExecArray | null
    while ((match = pattern.regex.exec(logContent)) !== null) {
      issues.push({
        description: `Vercel Deploy: ${match[0]}`,
        priority: pattern.priority,
        rootCause: pattern.rootCause,
        suggestedFix: this.generateVercelSuggestedFix(match[0]),
        timestamp: timestamp || undefined,
      })
    }

    return issues
  }

  private analyzeVercelDependencyIssues(
    logContent: string,
    timestamp?: string
  ): RawAnalysisIssue[] {
    const issues: RawAnalysisIssue[] = []
    const pattern = VERCEL_ERROR_PATTERNS.DEPENDENCY_ERROR

    let match: RegExpExecArray | null
    while ((match = pattern.regex.exec(logContent)) !== null) {
      issues.push({
        description: `Vercel Deploy: dependency installation failed - ${match[0]}`,
        priority: pattern.priority,
        rootCause: pattern.rootCause,
        suggestedFix: this.generateVercelSuggestedFix(match[0]),
        timestamp: timestamp || undefined,
      })
    }

    return issues
  }

  private analyzeVercelFunctionSizeLimits(
    logContent: string,
    timestamp?: string
  ): RawAnalysisIssue[] {
    const issues: RawAnalysisIssue[] = []
    const pattern = VERCEL_ERROR_PATTERNS.FUNCTION_SIZE_LIMIT

    let match: RegExpExecArray | null
    while ((match = pattern.regex.exec(logContent)) !== null) {
      issues.push({
        description: `Vercel Deploy: ${match[0]}`,
        priority: pattern.priority,
        rootCause: pattern.rootCause,
        suggestedFix: this.generateVercelSuggestedFix(match[0]),
        timestamp: timestamp || undefined,
      })
    }

    return issues
  }

  private analyzeVercelStaticGenerationErrors(
    logContent: string,
    timestamp?: string
  ): RawAnalysisIssue[] {
    const issues: RawAnalysisIssue[] = []
    const pattern = VERCEL_ERROR_PATTERNS.STATIC_GENERATION

    let match: RegExpExecArray | null
    while ((match = pattern.regex.exec(logContent)) !== null) {
      const pagePath = match[1] || "page"
      issues.push({
        description: `Vercel Deploy: Error occurred prerendering page "${pagePath}"`,
        priority: pattern.priority,
        rootCause: pattern.rootCause,
        suggestedFix: `Fix getStaticProps error in ${pagePath} page`,
        timestamp: timestamp || undefined,
      })
    }

    return issues
  }

  private analyzeVercelEdgeRuntimeErrors(
    logContent: string,
    timestamp?: string
  ): RawAnalysisIssue[] {
    const issues: RawAnalysisIssue[] = []
    const pattern = VERCEL_ERROR_PATTERNS.EDGE_RUNTIME

    let match: RegExpExecArray | null
    while ((match = pattern.regex.exec(logContent)) !== null) {
      // Extract file name if available
      const fileMatch = logContent.match(/Used in: ([^\s\n]+)/)
      const file = fileMatch ? fileMatch[1] : undefined

      issues.push({
        description: `Vercel Deploy: ${match[0]}`,
        priority: pattern.priority,
        files: file ? [file] : undefined,
        rootCause: pattern.rootCause,
        suggestedFix: this.generateVercelSuggestedFix(match[0]),
        timestamp: timestamp || undefined,
      })
    }

    return issues
  }

  private analyzeVercelNextJsBuildErrors(
    logContent: string,
    timestamp?: string
  ): RawAnalysisIssue[] {
    const issues: RawAnalysisIssue[] = []
    const pattern = VERCEL_ERROR_PATTERNS.NEXT_JS_BUILD

    let match: RegExpExecArray | null
    while ((match = pattern.regex.exec(logContent)) !== null) {
      const missingModule = match[1]
      const fromFile = match[2]
      if (missingModule && fromFile) {
        issues.push({
          description: `Vercel Deploy: Cannot resolve module '${missingModule}' from '${fromFile}'`,
          priority: pattern.priority,
          files: [fromFile],
          rootCause: pattern.rootCause,
          suggestedFix:
            "Check import paths and ensure all required components exist",
          timestamp: timestamp || undefined,
        })
      }
    }

    return issues
  }

  private analyzeVercelDatabaseErrors(
    logContent: string,
    timestamp?: string
  ): RawAnalysisIssue[] {
    const issues: RawAnalysisIssue[] = []
    const pattern = VERCEL_ERROR_PATTERNS.DATABASE_CONNECTION

    let match: RegExpExecArray | null
    while ((match = pattern.regex.exec(logContent)) !== null) {
      issues.push({
        description: `Vercel Deploy: database connection failed - ${match[0]}`,
        priority: pattern.priority,
        rootCause: pattern.rootCause,
        suggestedFix: "Configure database connection for build environment",
        timestamp: timestamp || undefined,
      })
    }

    return issues
  }
}
