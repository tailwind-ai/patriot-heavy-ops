#!/usr/bin/env tsx

/**
 * Ana CLI - Simplified Background Agent
 * Analyzes CI failures and Cursor Bugbot reviews, adds items to Cursor TODO list
 */

import { Octokit } from "@octokit/rest"
import { spawn } from "child_process"
import { writeFileSync } from "fs"

interface AnaTodo {
  id: string
  content: string
  priority: "low" | "medium" | "high" | "critical"
  files?: string[] | undefined
  lineNumbers?: number[] | undefined
  issueType: "ci_failure" | "cursor_bugbot"
  relatedPR: string
  createdAt: string
  rootCause?: string
  impact?: string
  suggestedFix?: string
  affectedComponents?: string[]
}

interface AnaResults {
  todos: AnaTodo[]
  summary: string
  analysisDate: string
}

export class AnaAnalyzer {
  private octokit: Octokit
  private owner: string
  private repo: string

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_ACCESS_TOKEN,
    })
    this.owner = "samuelhenry"
    this.repo = "patriot-heavy-ops"
  }

  /**
   * Analyze CI Test failures and create Cursor TODOs
   */
  async analyzeCIFailures(
    workflowRunId: string,
    prNumber: number
  ): Promise<AnaResults> {
    console.log(`🔍 Ana analyzing CI Test failures for PR #${prNumber}...`)

    try {
      // Get workflow run details (for future use)
      await this.octokit.rest.actions.getWorkflowRun({
        owner: this.owner,
        repo: this.repo,
        run_id: parseInt(workflowRunId),
      })

      // Get workflow run jobs
      const jobs = await this.octokit.rest.actions.listJobsForWorkflowRun({
        owner: this.owner,
        repo: this.repo,
        run_id: parseInt(workflowRunId),
      })

      const todos: AnaTodo[] = []
      const summary = `CI Test workflow failed with ${jobs.data.jobs.length} jobs`

      // Analyze each failed job
      for (const job of jobs.data.jobs) {
        if (job.conclusion === "failure") {
          console.log(`  📋 Analyzing failed job: ${job.name}`)

          // Get job logs
          const logs =
            await this.octokit.rest.actions.downloadJobLogsForWorkflowRun({
              owner: this.owner,
              repo: this.repo,
              job_id: job.id,
            })

          const logContent = Buffer.from(logs.data as ArrayBuffer).toString(
            "utf-8"
          )
          const analysis = this.analyzeJobLogs(job.name, logContent)

          // Create todos for each identified issue
          for (const issue of analysis.issues) {
            const todo: AnaTodo = {
              id: `ci-${workflowRunId}-${job.id}-${Date.now()}`,
              content: issue.description,
              priority: issue.priority,
              files: issue.files ?? undefined,
              lineNumbers: issue.lineNumbers ?? undefined,
              issueType: "ci_failure",
              relatedPR: `#${prNumber}`,
              createdAt: new Date().toISOString(),
            }
            todos.push(todo)

            // Add to Cursor TODO list
            await this.addToCursorTodo(todo)
          }
        }
      }

      const results: AnaResults = {
        todos,
        summary,
        analysisDate: new Date().toISOString(),
      }

      // Save results
      writeFileSync("ana-results.json", JSON.stringify(results, null, 2))
      console.log(
        `✅ Ana created ${todos.length} TODOs from CI failure analysis`
      )

      return results
    } catch (error) {
      console.error("❌ Error analyzing CI failures:", error)
      throw error
    }
  }

  /**
   * Analyze Vercel deployment failure and create Cursor TODOs
   */
  async analyzeVercelFailure(
    checkSuiteId: string,
    prNumber: number
  ): Promise<AnaResults> {
    console.log(
      `🔍 Ana analyzing Vercel deployment failure for PR #${prNumber}...`
    )

    try {
      // Get the check suite details
      const checkSuite = await this.octokit.rest.checks.getSuite({
        owner: this.owner,
        repo: this.repo,
        check_suite_id: parseInt(checkSuiteId),
      })

      console.log(`  📝 Check Suite: ${checkSuite.data.app?.name || "Unknown"}`)
      console.log(`  📝 Status: ${checkSuite.data.status}`)
      console.log(`  📝 Conclusion: ${checkSuite.data.conclusion}`)

      // Create a todo for the Vercel deployment failure
      const todo: AnaTodo = {
        id: `vercel-${checkSuiteId}-${Date.now()}`,
        content: `Vercel deployment failed for PR #${prNumber}. Check deployment logs and configuration.`,
        priority: "high",
        issueType: "ci_failure",
        relatedPR: `#${prNumber}`,
        createdAt: new Date().toISOString(),
        rootCause: "Vercel deployment process failed",
        impact: "Application not deployed to production environment",
        suggestedFix:
          "Check Vercel logs, environment variables, build configuration, and deployment settings",
        affectedComponents: ["deployment", "production"],
      }

      // Add to Cursor TODO list
      await this.addToCursorTodo(todo)

      const results: AnaResults = {
        todos: [todo],
        summary: `Vercel deployment failure analysis found 1 issue`,
        analysisDate: new Date().toISOString(),
      }

      // Save results
      writeFileSync("ana-results.json", JSON.stringify(results, null, 2))
      console.log(
        `✅ Ana created 1 TODO from Vercel deployment failure analysis`
      )

      return results
    } catch (error) {
      console.error("❌ Error analyzing Vercel deployment failure:", error)
      throw error
    }
  }

  /**
   * Analyze Cursor Bugbot check suite completion and create Cursor TODOs
   */
  async analyzeCursorBugbotCheck(
    checkSuiteId: string,
    prNumber: number
  ): Promise<AnaResults> {
    console.log(
      `🔍 Ana analyzing Cursor Bugbot check suite for PR #${prNumber}...`
    )

    try {
      // Get the check suite details
      const checkSuite = await this.octokit.rest.checks.getSuite({
        owner: this.owner,
        repo: this.repo,
        check_suite_id: parseInt(checkSuiteId),
      })

      console.log(`  📝 Check Suite: ${checkSuite.data.app?.name || "Unknown"}`)
      console.log(`  📝 Status: ${checkSuite.data.status}`)
      console.log(`  📝 Conclusion: ${checkSuite.data.conclusion}`)

      // Get check runs to see what issues were found
      const checkRuns = await this.octokit.rest.checks.listForSuite({
        owner: this.owner,
        repo: this.repo,
        check_suite_id: parseInt(checkSuiteId),
      })

      const todos: AnaTodo[] = []

      // Analyze each check run for issues
      for (const checkRun of checkRuns.data.check_runs) {
        if (
          checkRun.conclusion === "failure" ||
          checkRun.conclusion === "neutral"
        ) {
          // Get detailed output from the check run
          let checkRunDetails
          try {
            checkRunDetails = await this.octokit.rest.checks.get({
              owner: this.owner,
              repo: this.repo,
              check_run_id: checkRun.id,
            })
          } catch {
            console.log(
              `  ⚠️ Could not get details for check run ${checkRun.id}`
            )
            continue
          }

          const output = checkRunDetails.data.output?.summary || ""
          const title = checkRunDetails.data.output?.title || ""

          // Create a todo for this check run issue
          const todo: AnaTodo = {
            id: `cursor-check-${checkRun.id}-${Date.now()}`,
            content: `Cursor Bugbot found issue: ${title || checkRun.name}${
              output ? ` - ${output.substring(0, 100)}...` : ""
            }`,
            priority: checkRun.conclusion === "failure" ? "high" : "medium",
            issueType: "cursor_bugbot",
            relatedPR: `#${prNumber}`,
            createdAt: new Date().toISOString(),
            rootCause: "Code analysis identified by Cursor Bugbot",
            impact:
              checkRun.conclusion === "failure"
                ? "Critical issue that may cause runtime problems"
                : "Code quality or maintainability concern",
            suggestedFix:
              "Review Cursor Bugbot analysis and address identified issues",
            affectedComponents: ["code-quality", "analysis"],
          }

          todos.push(todo)

          // Add to Cursor TODO list
          await this.addToCursorTodo(todo)
        }
      }

      // If no specific issues found but check suite completed, create a general todo
      if (todos.length === 0 && checkSuite.data.conclusion === "success") {
        const todo: AnaTodo = {
          id: `cursor-check-success-${checkSuiteId}-${Date.now()}`,
          content: `Cursor Bugbot completed analysis for PR #${prNumber} - no issues found`,
          priority: "low",
          issueType: "cursor_bugbot",
          relatedPR: `#${prNumber}`,
          createdAt: new Date().toISOString(),
          rootCause: "Successful code analysis",
          impact: "No issues detected",
          suggestedFix: "Continue with current implementation",
          affectedComponents: ["code-quality"],
        }

        todos.push(todo)
        await this.addToCursorTodo(todo)
      }

      const results: AnaResults = {
        todos,
        summary: `Cursor Bugbot check suite analysis found ${todos.length} items`,
        analysisDate: new Date().toISOString(),
      }

      // Save results
      writeFileSync("ana-results.json", JSON.stringify(results, null, 2))
      console.log(
        `✅ Ana created ${todos.length} TODOs from Cursor Bugbot check suite analysis`
      )

      return results
    } catch (error) {
      console.error("❌ Error analyzing Cursor Bugbot check suite:", error)
      throw error
    }
  }

  /**
   * Analyze Cursor Bugbot review and create Cursor TODOs
   */
  async analyzeCursorBugbot(
    prNumber: number,
    commentId: number
  ): Promise<AnaResults> {
    console.log(`🔍 Ana analyzing Cursor Bugbot review for PR #${prNumber}...`)

    try {
      // Get the comment
      const comment = await this.octokit.rest.issues.getComment({
        owner: this.owner,
        repo: this.repo,
        comment_id: commentId,
      })

      const commentBody = comment.data.body || ""
      console.log(`  📝 Comment preview: ${commentBody.substring(0, 100)}...`)

      // Analyze the comment for issues
      const analysis = this.analyzeCursorBugbotComment(commentBody)
      const todos: AnaTodo[] = []

      // Create todos for each identified issue
      for (const issue of analysis.issues) {
        const todo: AnaTodo = {
          id: `cursor-${commentId}-${Date.now()}`,
          content: issue.description,
          priority: issue.priority,
          files: issue.files ?? undefined,
          lineNumbers: issue.lineNumbers ?? undefined,
          issueType: "cursor_bugbot",
          relatedPR: `#${prNumber}`,
          createdAt: new Date().toISOString(),
        }
        todos.push(todo)

        // Add to Cursor TODO list
        await this.addToCursorTodo(todo)
      }

      const results: AnaResults = {
        todos,
        summary: `Cursor Bugbot review analysis found ${todos.length} issues`,
        analysisDate: new Date().toISOString(),
      }

      // Save results
      writeFileSync("ana-results.json", JSON.stringify(results, null, 2))
      console.log(
        `✅ Ana created ${todos.length} TODOs from Cursor Bugbot analysis`
      )

      return results
    } catch (error) {
      console.error("❌ Error analyzing Cursor Bugbot review:", error)
      throw error
    }
  }

  /**
   * Analyze job logs to extract failure information with root cause analysis
   */
  private analyzeJobLogs(
    jobName: string,
    logContent: string
  ): {
    issues: Array<{
      description: string
      priority: "low" | "medium" | "high" | "critical"
      files?: string[] | undefined
      lineNumbers?: number[] | undefined
      rootCause?: string
      impact?: string
      suggestedFix?: string
      affectedComponents?: string[]
    }>
  } {
    const issues: Array<{
      description: string
      priority: "low" | "medium" | "high" | "critical"
      files?: string[] | undefined
      lineNumbers?: number[] | undefined
      rootCause?: string
      impact?: string
      suggestedFix?: string
      affectedComponents?: string[]
    }> = []

    // Enhanced failure patterns with root cause analysis
    const patterns = [
      {
        regex: /error\s+in\s+([^\s]+\.(ts|tsx|js|jsx)):(\d+):(\d+)/gi,
        priority: "high" as const,
        extractFiles: true,
        extractLines: true,
        analyzeRootCause: (match: RegExpExecArray, logContent: string) => {
          const fileName = match[1] || ""
          const lineNum = match[3] || ""
          return this.analyzeTypeScriptError(fileName, lineNum, logContent)
        },
      },
      {
        regex: /test\s+failed[:\s]+([^\n]+)/gi,
        priority: "high" as const,
        extractFiles: false,
        extractLines: false,
        analyzeRootCause: (match: RegExpExecArray, logContent: string) => {
          return this.analyzeTestFailure(match[1] || "", logContent)
        },
      },
      {
        regex: /build\s+failed[:\s]+([^\n]+)/gi,
        priority: "critical" as const,
        extractFiles: false,
        extractLines: false,
        analyzeRootCause: (match: RegExpExecArray, logContent: string) => {
          return this.analyzeBuildFailure(match[1] || "", logContent)
        },
      },
      {
        regex: /lint\s+error[:\s]+([^\n]+)/gi,
        priority: "medium" as const,
        extractFiles: false,
        extractLines: false,
        analyzeRootCause: (match: RegExpExecArray, logContent: string) => {
          return this.analyzeLintError(match[1] || "", logContent)
        },
      },
      // New patterns for common root causes
      {
        regex: /database\s+connection\s+(?:failed|timeout|error)/gi,
        priority: "critical" as const,
        extractFiles: false,
        extractLines: false,
        analyzeRootCause: (match: RegExpExecArray, logContent: string) => {
          return this.analyzeDatabaseIssue(logContent)
        },
      },
      {
        regex:
          /environment\s+variable\s+['"]([^'"]+)['"]\s+(?:not\s+found|missing|undefined)/gi,
        priority: "high" as const,
        extractFiles: false,
        extractLines: false,
        analyzeRootCause: (match: RegExpExecArray) => {
          return this.analyzeEnvironmentVariableIssue(match[1] || "")
        },
      },
      {
        regex: /import\s+error[:\s]+([^\n]+)/gi,
        priority: "high" as const,
        extractFiles: false,
        extractLines: false,
        analyzeRootCause: (match: RegExpExecArray, logContent: string) => {
          return this.analyzeImportError(match[1] || "", logContent)
        },
      },
    ]

    for (const pattern of patterns) {
      let match
      while ((match = pattern.regex.exec(logContent)) !== null) {
        const description = match[1] || `Failure in ${jobName}`
        const files = pattern.extractFiles && match[1] ? [match[1]] : undefined
        const lineNumbers =
          pattern.extractLines && match[3] ? [parseInt(match[3])] : undefined

        // Perform root cause analysis
        const rootCauseAnalysis = pattern.analyzeRootCause
          ? pattern.analyzeRootCause(match, logContent)
          : null

        const issue: any = {
          description: `${jobName}: ${description}`,
          priority: pattern.priority,
        }

        if (files) issue.files = files
        if (lineNumbers) issue.lineNumbers = lineNumbers
        if (rootCauseAnalysis?.rootCause)
          issue.rootCause = rootCauseAnalysis.rootCause
        if (rootCauseAnalysis?.impact) issue.impact = rootCauseAnalysis.impact
        if (rootCauseAnalysis?.suggestedFix)
          issue.suggestedFix = rootCauseAnalysis.suggestedFix
        if (rootCauseAnalysis?.affectedComponents)
          issue.affectedComponents = rootCauseAnalysis.affectedComponents

        issues.push(issue)
      }
    }

    // If no specific patterns found, perform general failure analysis
    if (issues.length === 0) {
      const generalAnalysis = this.analyzeGeneralFailure(jobName, logContent)
      const generalIssue: any = {
        description: `${jobName} failed - ${generalAnalysis.description}`,
        priority: generalAnalysis.priority,
      }

      if (generalAnalysis.rootCause)
        generalIssue.rootCause = generalAnalysis.rootCause
      if (generalAnalysis.impact) generalIssue.impact = generalAnalysis.impact
      if (generalAnalysis.suggestedFix)
        generalIssue.suggestedFix = generalAnalysis.suggestedFix
      if (generalAnalysis.affectedComponents)
        generalIssue.affectedComponents = generalAnalysis.affectedComponents

      issues.push(generalIssue)
    }

    return { issues }
  }

  /**
   * Analyze TypeScript compilation errors for root causes
   */
  private analyzeTypeScriptError(
    fileName: string,
    lineNumber: string,
    logContent: string
  ): {
    rootCause?: string
    impact?: string
    suggestedFix?: string
    affectedComponents?: string[]
  } {
    const isComponent =
      fileName.includes("/components/") || fileName.includes("\\components\\")
    const isApiRoute =
      fileName.includes("/api/") || fileName.includes("\\api\\")
    const isUtility = fileName.includes("/utils/") || fileName.includes("/lib/")

    let rootCause = "TypeScript compilation error"
    let impact = "Blocks build process"
    let suggestedFix = "Review TypeScript error and fix type issues"
    const affectedComponents: string[] = []

    // Analyze specific TypeScript error patterns
    if (
      logContent.includes("Property") &&
      logContent.includes("does not exist")
    ) {
      rootCause = "Missing property or interface definition"
      suggestedFix =
        "Check interface definitions and ensure all required properties are defined"
    } else if (logContent.includes("Cannot find module")) {
      rootCause = "Missing dependency or incorrect import path"
      suggestedFix = "Verify import paths and install missing dependencies"
    } else if (
      logContent.includes("Type") &&
      logContent.includes("is not assignable")
    ) {
      rootCause = "Type mismatch between expected and actual types"
      suggestedFix = "Review type definitions and ensure proper type casting"
    } else if (
      logContent.includes("Unused variable") ||
      logContent.includes("unused")
    ) {
      rootCause = "Unused code or variables"
      impact = "Code quality issue"
      suggestedFix =
        "Remove unused variables or add eslint-disable comment if intentional"
    }

    // Determine affected components based on file location
    if (isComponent) {
      affectedComponents.push("UI Components")
      impact = "Affects user interface rendering"
    } else if (isApiRoute) {
      affectedComponents.push("API Routes")
      impact = "Affects API functionality"
    } else if (isUtility) {
      affectedComponents.push("Utility Functions")
      impact = "May affect multiple system components"
    }

    return { rootCause, impact, suggestedFix, affectedComponents }
  }

  /**
   * Analyze test failures for root causes
   */
  private analyzeTestFailure(
    errorMessage: string,
    logContent: string
  ): {
    rootCause?: string
    impact?: string
    suggestedFix?: string
    affectedComponents?: string[]
  } {
    let rootCause = "Test failure"
    let impact = "Indicates potential functionality issues"
    let suggestedFix = "Review test logic and fix failing assertions"
    const affectedComponents: string[] = []

    // Analyze common test failure patterns
    if (logContent.includes("expect") && logContent.includes("toBe")) {
      rootCause = "Assertion failure - actual result doesn't match expected"
      suggestedFix = "Check test data and assertion logic"
    } else if (logContent.includes("timeout")) {
      rootCause = "Test timeout - operation took too long"
      suggestedFix = "Increase timeout or optimize slow operations"
    } else if (logContent.includes("database") || logContent.includes("db")) {
      rootCause = "Database-related test failure"
      impact = "Affects data persistence and retrieval"
      suggestedFix = "Check database setup, migrations, or test data"
      affectedComponents.push("Database Layer")
    } else if (logContent.includes("mock") || logContent.includes("spy")) {
      rootCause = "Mock or spy setup issue"
      suggestedFix = "Review mock configurations and ensure proper setup"
    } else if (
      logContent.includes("environment") ||
      logContent.includes("process.env")
    ) {
      rootCause = "Environment variable issue in tests"
      impact = "Test environment configuration problem"
      suggestedFix =
        "Ensure all required environment variables are set for tests"
      affectedComponents.push("Configuration")
    }

    return { rootCause, impact, suggestedFix, affectedComponents }
  }

  /**
   * Analyze build failures for root causes
   */
  private analyzeBuildFailure(
    errorMessage: string,
    logContent: string
  ): {
    rootCause?: string
    impact?: string
    suggestedFix?: string
    affectedComponents?: string[]
  } {
    let rootCause = "Build failure"
    const impact = "Prevents application deployment"
    let suggestedFix = "Review build configuration and dependencies"
    const affectedComponents: string[] = ["Build System"]

    // Analyze specific build failure patterns
    if (logContent.includes("webpack") || logContent.includes("compilation")) {
      rootCause = "Webpack compilation error"
      suggestedFix =
        "Check webpack configuration and resolve compilation errors"
    } else if (
      logContent.includes("dependency") ||
      logContent.includes("package")
    ) {
      rootCause = "Dependency resolution issue"
      suggestedFix = "Run npm/yarn install and check package.json"
    } else if (logContent.includes("memory") || logContent.includes("heap")) {
      rootCause = "Memory allocation issue during build"
      suggestedFix = "Increase Node.js memory limit or optimize build process"
    } else if (
      logContent.includes("permission") ||
      logContent.includes("access")
    ) {
      rootCause = "File permission issue"
      suggestedFix =
        "Check file permissions and ensure build directory is writable"
    } else if (
      logContent.includes("disk space") ||
      logContent.includes("space")
    ) {
      rootCause = "Insufficient disk space"
      suggestedFix = "Free up disk space on the build server"
    }

    return { rootCause, impact, suggestedFix, affectedComponents }
  }

  /**
   * Analyze linting errors for root causes
   */
  private analyzeLintError(
    errorMessage: string,
    logContent: string
  ): {
    rootCause?: string
    impact?: string
    suggestedFix?: string
    affectedComponents?: string[]
  } {
    let rootCause = "Code style or quality issue"
    let impact = "Code quality degradation"
    let suggestedFix = "Fix linting violations according to project standards"
    const affectedComponents: string[] = ["Code Quality"]

    // Analyze specific linting patterns
    if (logContent.includes("unused")) {
      rootCause = "Unused imports, variables, or functions"
      suggestedFix = "Remove unused code or add eslint-disable comments"
    } else if (
      logContent.includes("prettier") ||
      logContent.includes("format")
    ) {
      rootCause = "Code formatting issue"
      suggestedFix = "Run prettier to fix formatting"
    } else if (
      logContent.includes("security") ||
      logContent.includes("vulnerability")
    ) {
      rootCause = "Security vulnerability detected"
      impact = "Potential security risk"
      suggestedFix = "Update dependencies or fix security issues"
      affectedComponents.push("Security")
    } else if (logContent.includes("complexity")) {
      rootCause = "High code complexity"
      impact = "Reduced maintainability"
      suggestedFix = "Refactor to reduce complexity"
    }

    return { rootCause, impact, suggestedFix, affectedComponents }
  }

  /**
   * Analyze database-related issues for root causes
   */
  private analyzeDatabaseIssue(logContent: string): {
    rootCause?: string
    impact?: string
    suggestedFix?: string
    affectedComponents?: string[]
  } {
    let rootCause = "Database connectivity issue"
    const impact = "Affects data persistence and retrieval"
    let suggestedFix = "Check database connection configuration"
    const affectedComponents = ["Database Layer", "API Routes"]

    if (logContent.includes("timeout")) {
      rootCause = "Database connection timeout"
      suggestedFix = "Check database server status and network connectivity"
    } else if (
      logContent.includes("authentication") ||
      logContent.includes("credential")
    ) {
      rootCause = "Database authentication failure"
      suggestedFix = "Verify database credentials and permissions"
    } else if (
      logContent.includes("migration") ||
      logContent.includes("schema")
    ) {
      rootCause = "Database schema or migration issue"
      suggestedFix = "Run database migrations or check schema compatibility"
    } else if (
      logContent.includes("pool") ||
      logContent.includes("connection pool")
    ) {
      rootCause = "Database connection pool exhausted"
      suggestedFix =
        "Increase connection pool size or optimize connection usage"
    }

    return { rootCause, impact, suggestedFix, affectedComponents }
  }

  /**
   * Analyze environment variable issues for root causes
   */
  private analyzeEnvironmentVariableIssue(variableName: string): {
    rootCause?: string
    impact?: string
    suggestedFix?: string
    affectedComponents?: string[]
  } {
    const rootCause = `Missing or undefined environment variable: ${variableName}`
    let impact = "Application configuration issue"
    let suggestedFix = `Set the ${variableName} environment variable`
    const affectedComponents: string[] = ["Configuration"]

    // Determine impact based on variable type
    if (variableName.includes("DATABASE") || variableName.includes("DB_")) {
      impact = "Database connectivity will fail"
      suggestedFix = `Add ${variableName} to environment configuration and CI secrets`
      affectedComponents.push("Database Layer")
    } else if (variableName.includes("API") || variableName.includes("KEY")) {
      impact = "External API integration will fail"
      suggestedFix = `Add ${variableName} to environment configuration and CI secrets`
      affectedComponents.push("External Integrations")
    } else if (
      variableName.includes("AUTH") ||
      variableName.includes("SECRET")
    ) {
      impact = "Authentication system will fail"
      suggestedFix = `Add ${variableName} to environment configuration and CI secrets`
      affectedComponents.push("Authentication")
    }

    return { rootCause, impact, suggestedFix, affectedComponents }
  }

  /**
   * Analyze import/module errors for root causes
   */
  private analyzeImportError(
    errorMessage: string,
    logContent: string
  ): {
    rootCause?: string
    impact?: string
    suggestedFix?: string
    affectedComponents?: string[]
  } {
    let rootCause = "Module import error"
    let impact = "Module loading failure"
    let suggestedFix = "Check import paths and module availability"
    const affectedComponents: string[] = ["Module System"]

    if (logContent.includes("Cannot resolve module")) {
      rootCause = "Module not found or incorrect path"
      suggestedFix = "Verify import path and ensure module is installed"
    } else if (logContent.includes("export") || logContent.includes("import")) {
      rootCause = "Export/import mismatch"
      suggestedFix =
        "Check if the module exports the requested function/variable"
    } else if (logContent.includes("circular")) {
      rootCause = "Circular dependency detected"
      impact = "Module loading deadlock"
      suggestedFix = "Refactor to eliminate circular dependencies"
    } else if (
      logContent.includes("type") ||
      logContent.includes("interface")
    ) {
      rootCause = "Type-only import issue"
      suggestedFix = "Use 'import type' for type-only imports"
    }

    return { rootCause, impact, suggestedFix, affectedComponents }
  }

  /**
   * Analyze general failures when no specific pattern matches
   */
  private analyzeGeneralFailure(
    jobName: string,
    logContent: string
  ): {
    description: string
    priority: "low" | "medium" | "high" | "critical"
    rootCause?: string
    impact?: string
    suggestedFix?: string
    affectedComponents?: string[]
  } {
    // Look for any error indicators in the logs
    const errorIndicators = [
      "error",
      "failed",
      "exception",
      "timeout",
      "crashed",
    ]
    const hasErrors = errorIndicators.some((indicator) =>
      logContent.toLowerCase().includes(indicator)
    )

    let priority: "low" | "medium" | "high" | "critical" = "medium"
    let rootCause = "Unknown failure cause"
    let impact = "Job execution failed"
    let suggestedFix = "Review logs for specific error details"
    const affectedComponents: string[] = [jobName]

    if (hasErrors) {
      priority = "high"
      rootCause = "Job failed with errors - manual investigation required"
      impact = "May affect dependent jobs or deployment"
      suggestedFix = "Check full logs for error details and system status"
    }

    return {
      description: "Manual investigation required",
      priority,
      rootCause,
      impact,
      suggestedFix,
      affectedComponents,
    }
  }

  /**
   * Analyze Cursor Bugbot comment for issues with root cause analysis
   */
  private analyzeCursorBugbotComment(commentBody: string): {
    issues: Array<{
      description: string
      priority: "low" | "medium" | "high" | "critical"
      files?: string[] | undefined
      lineNumbers?: number[] | undefined
      rootCause?: string
      impact?: string
      suggestedFix?: string
      affectedComponents?: string[]
    }>
  } {
    const issues: Array<{
      description: string
      priority: "low" | "medium" | "high" | "critical"
      files?: string[] | undefined
      lineNumbers?: number[] | undefined
      rootCause?: string
      impact?: string
      suggestedFix?: string
      affectedComponents?: string[]
    }> = []

    // Extract file references
    const filePattern = /`([^`]+\.(ts|tsx|js|jsx))`/g
    const files: string[] = []
    let match
    while ((match = filePattern.exec(commentBody)) !== null) {
      if (match[1]) {
        files.push(match[1])
      }
    }

    // Extract line numbers
    const linePattern = /line\s+(\d+)/gi
    const lineNumbers: number[] = []
    while ((match = linePattern.exec(commentBody)) !== null) {
      if (match[1]) {
        lineNumbers.push(parseInt(match[1]))
      }
    }

    // Perform intelligent analysis of the Cursor Bugbot comment
    const analysis = this.analyzeCursorBugbotContent(commentBody, files)

    // Create detailed todos based on analysis
    for (const issueAnalysis of analysis.issues) {
      const bugbotIssue: any = {
        description: issueAnalysis.description,
        priority: issueAnalysis.priority,
      }

      if (files.length > 0) bugbotIssue.files = files
      if (lineNumbers.length > 0) bugbotIssue.lineNumbers = lineNumbers
      if (issueAnalysis.rootCause)
        bugbotIssue.rootCause = issueAnalysis.rootCause
      if (issueAnalysis.impact) bugbotIssue.impact = issueAnalysis.impact
      if (issueAnalysis.suggestedFix)
        bugbotIssue.suggestedFix = issueAnalysis.suggestedFix
      if (issueAnalysis.affectedComponents)
        bugbotIssue.affectedComponents = issueAnalysis.affectedComponents

      issues.push(bugbotIssue)
    }

    // If no specific issues were identified, create a general review todo
    if (issues.length === 0) {
      const generalBugbotIssue: any = {
        description: `Cursor Bugbot Review: ${commentBody.substring(0, 200)}${
          commentBody.length > 200 ? "..." : ""
        }`,
        priority: analysis.generalPriority,
      }

      if (files.length > 0) generalBugbotIssue.files = files
      if (lineNumbers.length > 0) generalBugbotIssue.lineNumbers = lineNumbers
      if (analysis.generalRootCause)
        generalBugbotIssue.rootCause = analysis.generalRootCause
      if (analysis.generalImpact)
        generalBugbotIssue.impact = analysis.generalImpact
      if (analysis.generalSuggestedFix)
        generalBugbotIssue.suggestedFix = analysis.generalSuggestedFix
      if (analysis.generalAffectedComponents)
        generalBugbotIssue.affectedComponents =
          analysis.generalAffectedComponents

      issues.push(generalBugbotIssue)
    }

    return { issues }
  }

  /**
   * Analyze Cursor Bugbot comment content for specific issues and root causes
   */
  private analyzeCursorBugbotContent(
    commentBody: string,
    files: string[]
  ): {
    issues: Array<{
      description: string
      priority: "low" | "medium" | "high" | "critical"
      rootCause?: string
      impact?: string
      suggestedFix?: string
      affectedComponents?: string[]
    }>
    generalPriority: "low" | "medium" | "high" | "critical"
    generalRootCause?: string
    generalImpact?: string
    generalSuggestedFix?: string
    generalAffectedComponents?: string[]
  } {
    const issues: Array<{
      description: string
      priority: "low" | "medium" | "high" | "critical"
      rootCause?: string
      impact?: string
      suggestedFix?: string
      affectedComponents?: string[]
    }> = []

    const commentLower = commentBody.toLowerCase()

    // Analyze specific issue types mentioned in the comment
    if (
      commentLower.includes("type error") ||
      commentLower.includes("typescript error")
    ) {
      issues.push({
        description: "TypeScript type error identified",
        priority: "high",
        rootCause: "Type mismatch or missing type definition",
        impact: "Blocks compilation and may cause runtime issues",
        suggestedFix: "Fix type definitions or add proper type casting",
        affectedComponents: this.getAffectedComponentsFromFiles(files),
      })
    }

    if (commentLower.includes("unused") || commentLower.includes("dead code")) {
      issues.push({
        description: "Unused code or variables detected",
        priority: "low",
        rootCause: "Code that is no longer referenced or needed",
        impact: "Increases bundle size and reduces code maintainability",
        suggestedFix:
          "Remove unused code or add eslint-disable comment if intentional",
        affectedComponents: this.getAffectedComponentsFromFiles(files),
      })
    }

    if (
      commentLower.includes("security") ||
      commentLower.includes("vulnerability")
    ) {
      issues.push({
        description: "Security vulnerability identified",
        priority: "critical",
        rootCause: "Potential security risk in the code",
        impact: "May expose sensitive data or allow unauthorized access",
        suggestedFix: "Review and fix security issues immediately",
        affectedComponents: [
          "Security",
          ...this.getAffectedComponentsFromFiles(files),
        ],
      })
    }

    if (commentLower.includes("performance") || commentLower.includes("slow")) {
      issues.push({
        description: "Performance issue identified",
        priority: "medium",
        rootCause: "Inefficient code or resource usage",
        impact: "Degrades user experience and system performance",
        suggestedFix: "Optimize code or implement performance improvements",
        affectedComponents: this.getAffectedComponentsFromFiles(files),
      })
    }

    if (
      commentLower.includes("accessibility") ||
      commentLower.includes("a11y")
    ) {
      issues.push({
        description: "Accessibility issue identified",
        priority: "medium",
        rootCause: "Missing accessibility features or compliance issues",
        impact: "Excludes users with disabilities from using the application",
        suggestedFix:
          "Add proper ARIA labels, alt text, and accessibility features",
        affectedComponents: [
          "UI Components",
          ...this.getAffectedComponentsFromFiles(files),
        ],
      })
    }

    if (
      commentLower.includes("memory leak") ||
      commentLower.includes("memory issue")
    ) {
      issues.push({
        description: "Memory leak or memory issue identified",
        priority: "high",
        rootCause: "Improper memory management or resource cleanup",
        impact:
          "May cause application crashes or degraded performance over time",
        suggestedFix: "Implement proper cleanup and memory management",
        affectedComponents: this.getAffectedComponentsFromFiles(files),
      })
    }

    // Determine general analysis if no specific issues found
    let generalPriority: "low" | "medium" | "high" | "critical" = "medium"
    let generalRootCause = "Code review feedback from Cursor Bugbot"
    let generalImpact = "Code quality and maintainability improvement"
    let generalSuggestedFix = "Review and address the feedback provided"
    const generalAffectedComponents = this.getAffectedComponentsFromFiles(files)

    if (
      commentLower.includes("critical") ||
      commentLower.includes("security")
    ) {
      generalPriority = "critical"
      generalRootCause = "Critical issue identified by Cursor Bugbot"
      generalImpact = "May cause system failures or security vulnerabilities"
      generalSuggestedFix = "Address critical issues immediately"
    } else if (commentLower.includes("error") || commentLower.includes("bug")) {
      generalPriority = "high"
      generalRootCause = "Bug or error identified by Cursor Bugbot"
      generalImpact = "May cause functionality issues"
      generalSuggestedFix = "Fix the identified bug or error"
    } else if (
      commentLower.includes("suggestion") ||
      commentLower.includes("improvement")
    ) {
      generalPriority = "low"
      generalRootCause = "Code improvement suggestion from Cursor Bugbot"
      generalImpact = "Code quality enhancement opportunity"
      generalSuggestedFix = "Consider implementing the suggested improvement"
    }

    return {
      issues,
      generalPriority,
      generalRootCause,
      generalImpact,
      generalSuggestedFix,
      generalAffectedComponents,
    }
  }

  /**
   * Determine affected components based on file paths
   */
  private getAffectedComponentsFromFiles(files: string[]): string[] {
    const components = new Set<string>()

    for (const file of files) {
      if (file.includes("/components/") || file.includes("\\components\\")) {
        components.add("UI Components")
      }
      if (file.includes("/api/") || file.includes("\\api\\")) {
        components.add("API Routes")
      }
      if (
        file.includes("/lib/") ||
        file.includes("/utils/") ||
        file.includes("\\lib\\") ||
        file.includes("\\utils\\")
      ) {
        components.add("Utility Functions")
      }
      if (file.includes("/hooks/") || file.includes("\\hooks\\")) {
        components.add("React Hooks")
      }
      if (file.includes("/types/") || file.includes("\\types\\")) {
        components.add("Type Definitions")
      }
      if (file.includes("/config/") || file.includes("\\config\\")) {
        components.add("Configuration")
      }
    }

    return Array.from(components)
  }

  /**
   * Add todo to Cursor TODO list using Cursor agent with enhanced root cause information
   */
  public async addToCursorTodo(todo: AnaTodo): Promise<void> {
    try {
      // Create enhanced content with root cause analysis
      let enhancedContent = todo.content

      if (todo.rootCause) {
        enhancedContent += `\n\n🔍 **Root Cause:** ${todo.rootCause}`
      }

      if (todo.impact) {
        enhancedContent += `\n\n💥 **Impact:** ${todo.impact}`
      }

      if (todo.suggestedFix) {
        enhancedContent += `\n\n🛠️ **Suggested Fix:** ${todo.suggestedFix}`
      }

      if (todo.affectedComponents && todo.affectedComponents.length > 0) {
        enhancedContent += `\n\n📦 **Affected Components:** ${todo.affectedComponents.join(
          ", "
        )}`
      }

      // Create a structured prompt for Cursor agent to create TODO
      const todoPrompt = `Create a TODO item with the following details:
Priority: ${todo.priority}
Content: ${enhancedContent}
${todo.files && todo.files.length > 0 ? `Files: ${todo.files.join(", ")}` : ""}
Related PR: ${todo.relatedPR}

Please add this to the project TODO list.`

      try {
        // Use Cursor agent to create the TODO using its built-in TODO system
        const child = spawn("cursor", ["agent", "--print", todoPrompt], {
          stdio: ["pipe", "pipe", "pipe"],
          timeout: 30000, // 30 second timeout
        })

        let errorOutput = ""

        child.stdout?.on("data", () => {
          // Cursor agent output handled internally
        })

        child.stderr?.on("data", (data) => {
          errorOutput += data.toString()
        })

        // Wait for the process to complete
        await new Promise<void>((resolve, reject) => {
          child.on("close", (code) => {
            if (code === 0) {
              resolve()
            } else {
              reject(
                new Error(
                  `Cursor agent exited with code ${code}: ${errorOutput}`
                )
              )
            }
          })
          child.on("error", reject)
          child.on("timeout", () => {
            child.kill()
            reject(new Error("Cursor agent command timed out"))
          })
        })

        console.log(
          `  ✅ Added to Cursor TODO via agent: ${todo.content.substring(
            0,
            50
          )}...`
        )
      } catch (agentError) {
        console.warn(`  ⚠️  Cursor agent failed: ${agentError}`)
        // Fallback: save to local TODO file
        await this.saveTodoToFile(todo, enhancedContent)
      }
    } catch (error) {
      console.warn(`  ⚠️  Failed to add to Cursor TODO: ${error}`)
      // Continue processing even if Cursor CLI fails
    }
  }

  /**
   * Save TODO to a local file as backup
   */
  private async saveTodoToFile(
    todo: AnaTodo,
    enhancedContent: string
  ): Promise<void> {
    try {
      const todoEntry = `## TODO: ${todo.content}
- **Priority:** ${todo.priority}
- **Type:** ${todo.issueType}
- **Related PR:** ${todo.relatedPR}
- **Created:** ${todo.createdAt}
${todo.rootCause ? `- **Root Cause:** ${todo.rootCause}` : ""}
${todo.impact ? `- **Impact:** ${todo.impact}` : ""}
${todo.suggestedFix ? `- **Suggested Fix:** ${todo.suggestedFix}` : ""}
${
  todo.affectedComponents && todo.affectedComponents.length > 0
    ? `- **Affected Components:** ${todo.affectedComponents.join(", ")}`
    : ""
}
${
  todo.files && todo.files.length > 0
    ? `- **Files:** ${todo.files.join(", ")}`
    : ""
}

${enhancedContent}

---

`

      const todoFile = "ana-generated-todos.md"
      writeFileSync(todoFile, todoEntry, { flag: "a" }) // Append to file

      console.log(`  📝 Saved TODO to local file: ${todoFile}`)
    } catch (error) {
      console.warn(`  ⚠️  Failed to save TODO to file: ${error}`)
    }
  }
}

async function main() {
  const command = process.argv[2]

  try {
    const analyzer = new AnaAnalyzer()

    switch (command) {
      case "analyze-ci-failures":
        const workflowRunId = process.argv[3]
        const prNumber = parseInt(process.argv[4] || "0")

        if (!workflowRunId || !prNumber) {
          console.log(
            "❌ Usage: npx tsx scripts/ana-cli.ts analyze-ci-failures <WORKFLOW_RUN_ID> <PR_NUMBER>"
          )
          process.exit(1)
        }

        await analyzer.analyzeCIFailures(workflowRunId, prNumber)
        break

      case "analyze-cursor-bugbot":
        const prNum = parseInt(process.argv[3] || "0")
        const commentId = parseInt(process.argv[4] || "0")

        if (!prNum || !commentId) {
          console.log(
            "❌ Usage: npx tsx scripts/ana-cli.ts analyze-cursor-bugbot <PR_NUMBER> <COMMENT_ID>"
          )
          process.exit(1)
        }

        await analyzer.analyzeCursorBugbot(prNum, commentId)
        break

      case "analyze-vercel-failure":
        const checkSuiteId = process.argv[3] || ""
        const vercelPrNum = parseInt(process.argv[4] || "0")

        if (!checkSuiteId || !vercelPrNum) {
          console.log(
            "❌ Usage: npx tsx scripts/ana-cli.ts analyze-vercel-failure <CHECK_SUITE_ID> <PR_NUMBER>"
          )
          process.exit(1)
        }

        await analyzer.analyzeVercelFailure(checkSuiteId, vercelPrNum)
        break

      case "analyze-cursor-bugbot-check":
        const cursorCheckSuiteId = process.argv[3] || ""
        const cursorPrNum = parseInt(process.argv[4] || "0")

        if (!cursorCheckSuiteId || !cursorPrNum) {
          console.log(
            "❌ Usage: npx tsx scripts/ana-cli.ts analyze-cursor-bugbot-check <CHECK_SUITE_ID> <PR_NUMBER>"
          )
          process.exit(1)
        }

        await analyzer.analyzeCursorBugbotCheck(cursorCheckSuiteId, cursorPrNum)
        break

      default:
        console.log("❌ Unknown command. Available commands:")
        console.log("  analyze-ci-failures <WORKFLOW_RUN_ID> <PR_NUMBER>")
        console.log("  analyze-cursor-bugbot <PR_NUMBER> <COMMENT_ID>")
        console.log(
          "  analyze-cursor-bugbot-check <CHECK_SUITE_ID> <PR_NUMBER>"
        )
        console.log("  analyze-vercel-failure <CHECK_SUITE_ID> <PR_NUMBER>")
        process.exit(1)
    }
  } catch (error) {
    console.error("❌ Error:", error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Fatal error:", error)
    process.exit(1)
  })
}
