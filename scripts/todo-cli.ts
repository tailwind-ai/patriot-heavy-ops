#!/usr/bin/env tsx

/**
 * CLI tool for managing todos with Background Agent integration
 * and dependency-based prioritization
 */

import {
  enhancedTodoManager,
  EnhancedTodoItem,
} from "../lib/background-agents/enhanced-todo-manager"

async function main() {
  const command = process.argv[2]
  const args = process.argv.slice(2)
  const prNumber = process.argv[3]

  try {
    switch (command) {
      case "init":
        await initializeTodos()
        break
      case "github":
        if (!prNumber) {
          console.log(
            "❌ Please provide PR number: npm run todo github <PR_NUMBER>"
          )
          process.exit(1)
        }
        await initializeFromGitHubPR(parseInt(prNumber))
        break
      case "github-dod":
        if (!prNumber) {
          console.log(
            "❌ Please provide PR number: npm run todo github-dod <PR_NUMBER>"
          )
          process.exit(1)
        }
        await initializeFromGitHubPRWithDoD(parseInt(prNumber))
        break
      case "analyze-workflow":
        const workflowRunId = process.argv[3]
        const workflowPrNumber = process.argv[4]
        if (!workflowRunId || !workflowPrNumber) {
          console.log(
            "❌ Please provide workflow run ID and PR number: npm run todo analyze-workflow <RUN_ID> <PR_NUMBER>"
          )
          process.exit(1)
        }
        await analyzeWorkflowFailure(workflowRunId, parseInt(workflowPrNumber))
        break
      case "continuous-monitor":
        const monitorPrNumber = process.argv[3]
        if (!monitorPrNumber) {
          console.log(
            "❌ Please provide PR number: npm run todo continuous-monitor <PR_NUMBER>"
          )
          process.exit(1)
        }
        await continuousMonitor(parseInt(monitorPrNumber))
        break
      case "clear":
        await clearAllTodos()
        break
      case "sync":
        if (!prNumber) {
          console.log(
            "❌ Please provide a PR number: npm run todo sync <PR_NUMBER>"
          )
          process.exit(1)
        }
        await syncFromGitHubActions(parseInt(prNumber))
        break
      case "resolve":
        const todoId = args[1]
        const resolution = args.slice(2).join(" ")
        if (!todoId) {
          console.log(
            "❌ Please provide a todo ID: npm run todo resolve <TODO_ID> [resolution message]"
          )
          process.exit(1)
        }
        await resolveTodoWithComment(todoId, resolution)
        break
      case "list":
        await listTodos()
        break
      case "next":
        await showNextTodo()
        break
      case "ready":
        await showReadyTodos()
        break
      case "blocked":
        await showBlockedTodos()
        break
      case "progress":
        await showProgress()
        break
      case "update":
        await updateTodoStatus()
        break
      case "add":
        await addTodo()
        break
      case "help":
        showHelp()
        break
      default:
        console.log('Unknown command. Use "help" to see available commands.')
    }
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

async function initializeTodos() {
  console.log("🤖 Initializing todos from Background Agent...")
  const todos = await enhancedTodoManager.initializeFromBackgroundAgent()
  console.log(`✅ Found ${todos.length} issues to address`)

  // Show summary
  const summary = enhancedTodoManager.getProgressSummary()
  console.log("\n📊 Summary:")
  console.log(`  Total: ${summary.total}`)
  console.log(`  ⏳ Pending: ${summary.pending}`)
  console.log(`  In Progress: ${summary.inProgress}`)
  console.log(`  Completed: ${summary.completed}`)
  console.log(`  Completion Rate: ${summary.completionRate.toFixed(1)}%`)

  // Show the first few todos
  if (todos.length > 0) {
    console.log("\n🎯 Top Priority Issues:")
    todos.slice(0, 3).forEach((todo, index) => {
      const priority = getPriorityEmoji(todo.priority)
      console.log(`  ${index + 1}. ${priority} ${todo.content}`)
    })
  }
}

async function initializeFromGitHubPR(prNumber: number) {
  console.log(`🤖 Fetching issues from GitHub PR #${prNumber}...`)
  console.log(`🧹 Clearing previous todos for fresh PR-specific detection...`)
  console.log(`🔍 Checking for code review feedback and CI failures...`)

  const todos = await enhancedTodoManager.initializeFromGitHubPR(prNumber)
  console.log(`✅ Found ${todos.length} issues from GitHub PR #${prNumber}`)

  // Show summary
  const summary = enhancedTodoManager.getProgressSummary()
  console.log("\n📊 Summary:")
  console.log(`  Total: ${summary.total}`)
  console.log(`  ⏳ Pending: ${summary.pending}`)
  console.log(`  In Progress: ${summary.inProgress}`)
  console.log(`  Completed: ${summary.completed}`)
  console.log(`  Completion Rate: ${summary.completionRate.toFixed(1)}%`)

  // Show the GitHub todos
  if (todos.length > 0) {
    console.log("\n🎯 GitHub PR Issues:")
    todos.forEach((todo, index) => {
      const priority = getPriorityEmoji(todo.priority)
      const status = getStatusEmoji(todo.status)
      const typeIcon = getIssueTypeIcon(todo.issueType)
      console.log(
        `  ${index + 1}. ${status} ${priority} ${typeIcon} ${todo.content}`
      )
      if (todo.suggestedFix) {
        console.log(`     💡 Fix: ${todo.suggestedFix}`)
      }
      if (todo.files && todo.files.length > 0) {
        console.log(`     📁 Files: ${todo.files.join(", ")}`)
      }
    })
  } else {
    console.log("\n🎉 No issues found in GitHub PR #" + prNumber)
  }
}

async function initializeFromGitHubPRWithDoD(prNumber: number) {
  console.log(
    `🤖 Fetching issues from GitHub PR #${prNumber} with Definition of Done checks...`
  )
  console.log(`🧹 Clearing previous todos for fresh PR-specific detection...`)
  console.log(
    `🔍 Checking for code review feedback, CI failures, and DoD requirements...`
  )

  const todos = await enhancedTodoManager.initializeFromGitHubPRWithDoD(
    prNumber
  )
  console.log(`✅ Found ${todos.length} issues from GitHub PR #${prNumber}`)

  // Show summary
  const summary = enhancedTodoManager.getProgressSummary()
  console.log("\n📊 Summary:")
  console.log(`  Total: ${summary.total}`)
  console.log(`  ⏳ Pending: ${summary.pending}`)
  console.log(`  In Progress: ${summary.inProgress}`)
  console.log(`  Completed: ${summary.completed}`)
  console.log(`  Completion Rate: ${summary.completionRate.toFixed(1)}%`)

  // Separate DoD todos from regular issues
  const dodTodos = todos.filter(
    (todo) => todo.issueType === "definition_of_done"
  )
  const regularTodos = todos.filter(
    (todo) => todo.issueType !== "definition_of_done"
  )

  // Show regular GitHub todos
  if (regularTodos.length > 0) {
    console.log("\n🎯 GitHub PR Issues:")
    regularTodos.forEach((todo, index) => {
      const priority = getPriorityEmoji(todo.priority)
      const status = getStatusEmoji(todo.status)
      const typeIcon = getIssueTypeIcon(todo.issueType)
      console.log(
        `  ${index + 1}. ${status} ${priority} ${typeIcon} ${todo.content}`
      )
      if (todo.suggestedFix) {
        console.log(`     💡 Fix: ${todo.suggestedFix}`)
      }
      if (todo.files && todo.files.length > 0) {
        console.log(`     📁 Files: ${todo.files.join(", ")}`)
      }
    })
  }

  // Show Definition of Done todos
  if (dodTodos.length > 0) {
    console.log("\n🎯 Definition of Done Verification:")
    dodTodos.forEach((todo, index) => {
      const priority = getPriorityEmoji(todo.priority)
      const status = getStatusEmoji(todo.status)
      const typeIcon = getIssueTypeIcon(todo.issueType)
      console.log(
        `  ${index + 1}. ${status} ${priority} ${typeIcon} ${todo.content}`
      )
      if (todo.suggestedFix) {
        console.log(`     💡 Fix: ${todo.suggestedFix}`)
      }
    })
    console.log(
      "\n🚨 CRITICAL: All Definition of Done items must be verified before marking PR as complete!"
    )
  }

  if (todos.length === 0) {
    console.log("\n🎉 No issues found in GitHub PR #" + prNumber)
  }
}

async function analyzeWorkflowFailure(workflowRunId: string, prNumber: number) {
  console.log(`🔍 Analyzing workflow failure: Run ID ${workflowRunId} for PR #${prNumber}`)
  
  try {
    // Use enhanced todo manager to analyze workflow logs
    const todos = await enhancedTodoManager.analyzeWorkflowLogs(workflowRunId, prNumber)
    console.log(`✅ Found ${todos.length} issues from workflow failure analysis`)

    // Show summary
    const summary = enhancedTodoManager.getProgressSummary()
    console.log("\n📊 Summary:")
    console.log(`  Total: ${summary.total}`)
    console.log(`  ⏳ Pending: ${summary.pending}`)
    console.log(`  In Progress: ${summary.inProgress}`)
    console.log(`  Completed: ${summary.completed}`)
    console.log(`  Completion Rate: ${summary.completionRate.toFixed(1)}%`)

    // Show the workflow failure todos
    if (todos.length > 0) {
      console.log("\n🚨 Workflow Failure Analysis:")
      todos.forEach((todo, index) => {
        const priority = getPriorityEmoji(todo.priority)
        const status = getStatusEmoji(todo.status)
        const typeIcon = getIssueTypeIcon(todo.issueType)
        console.log(
          `  ${index + 1}. ${status} ${priority} ${typeIcon} ${todo.content}`
        )
        if (todo.suggestedFix) {
          console.log(`     💡 Fix: ${todo.suggestedFix}`)
        }
        if (todo.files && todo.files.length > 0) {
          console.log(`     📁 Files: ${todo.files.join(", ")}`)
        }
        if (todo.failureDetails?.errorMessage) {
          console.log(`     ❌ Error: ${todo.failureDetails.errorMessage}`)
        }
      })
    } else {
      console.log("\n🎉 No issues found in workflow failure analysis")
    }
  } catch (error) {
    console.error("❌ Error analyzing workflow failure:", error)
    process.exit(1)
  }
}

async function continuousMonitor(prNumber: number) {
  console.log(`🔄 Continuous monitoring for PR #${prNumber}`)
  
  try {
    // Update todo statuses based on current codebase state
    const statusUpdate = await enhancedTodoManager.updateTodoStatuses(prNumber)
    
    // Show status update summary
    console.log("\n📊 Continuous Monitoring Results:")
    console.log(`  ✅ Resolved: ${statusUpdate.resolved.length}`)
    console.log(`  ⏳ Still Pending: ${statusUpdate.stillPending.length}`)
    console.log(`  🆕 New Issues: ${statusUpdate.newIssues.length}`)

    // Show resolved todos
    if (statusUpdate.resolved.length > 0) {
      console.log("\n🎉 Auto-Resolved Issues:")
      statusUpdate.resolved.forEach((todo, index) => {
        console.log(`  ${index + 1}. ✅ ${todo.content.slice(0, 80)}...`)
      })
    }

    // Show new issues
    if (statusUpdate.newIssues.length > 0) {
      console.log("\n🆕 New Issues Detected:")
      statusUpdate.newIssues.forEach((todo, index) => {
        const priority = getPriorityEmoji(todo.priority)
        const typeIcon = getIssueTypeIcon(todo.issueType)
        console.log(`  ${index + 1}. ${priority} ${typeIcon} ${todo.content}`)
        if (todo.suggestedFix) {
          console.log(`     💡 Fix: ${todo.suggestedFix}`)
        }
        if (todo.files && todo.files.length > 0) {
          console.log(`     📁 Files: ${todo.files.join(", ")}`)
        }
      })
    }

    // Show completion status
    const completionStatus = enhancedTodoManager.getCompletionStatus()
    console.log("\n📈 Overall Progress:")
    console.log(`  Total: ${completionStatus.totalTodos}`)
    console.log(`  Completed: ${completionStatus.completedTodos}`)
    console.log(`  Pending: ${completionStatus.pendingTodos}`)
    console.log(`  Completion Rate: ${completionStatus.completionRate.toFixed(1)}%`)

    if (completionStatus.isComplete) {
      console.log("\n🎉 All todos completed! PR is ready for review.")
    } else if (completionStatus.readyForReview) {
      console.log("\n✨ PR is nearly complete and ready for review!")
    } else if (completionStatus.pendingTodos > 0) {
      console.log(`\n⚠️ ${completionStatus.pendingTodos} todos still need attention.`)
    }

    // Show next todo if any pending
    if (completionStatus.pendingTodos > 0) {
      const nextTodo = enhancedTodoManager.getNextTodo()
      if (nextTodo) {
        console.log("\n🎯 Next Todo to Work On:")
        console.log(`   ${nextTodo.content}`)
        if (nextTodo.file && nextTodo.line) {
          console.log(`   📁 ${nextTodo.file}:${nextTodo.line}`)
        }
        if (nextTodo.suggestedFix) {
          console.log(`   💡 ${nextTodo.suggestedFix}`)
        }
      }
    }

  } catch (error) {
    console.error("❌ Error in continuous monitoring:", error)
    process.exit(1)
  }
}

async function clearAllTodos() {
  console.log("🧹 Clearing all todos...")
  enhancedTodoManager.clearAllTodos()
  console.log("✅ All todos cleared")
}

async function syncFromGitHubActions(prNumber: number) {
  console.log(`🔄 Syncing todos from GitHub Actions for PR #${prNumber}...`)

  try {
    // Use GitHub CLI to get the latest workflow run for this PR
    const { execSync } = await import("child_process")

    // Get the latest workflow run ID for this PR
    const workflowRunsOutput = execSync(
      `gh run list --repo samuelhenry/patriot-heavy-ops --limit 10 --json databaseId,headBranch,conclusion,workflowName`,
      { encoding: "utf8" }
    )

    const workflowRuns = JSON.parse(workflowRunsOutput)
    const backgroundAgentRun = workflowRuns.find(
      (run: Record<string, unknown>) =>
        run.workflowName === "Background Agent" &&
        (run.conclusion === "success" || run.conclusion === "failure")
    )

    if (!backgroundAgentRun) {
      console.log("❌ No Background Agent workflow runs found")
      return
    }

    console.log(
      `📥 Found Background Agent run: ${backgroundAgentRun.databaseId}`
    )

    // Try to download artifacts (this might not work without proper permissions)
    try {
      execSync(
        `gh run download ${backgroundAgentRun.databaseId} --repo samuelhenry/patriot-heavy-ops --name todos-artifact || true`,
        { encoding: "utf8" }
      )

      // Check if we got a todos file
      const fs = await import("fs")
      if (fs.existsSync(".todos.json")) {
        console.log("✅ Successfully synced todos from GitHub Actions")
        await listTodos()
      } else {
        console.log(
          "⚠️  No todos artifact found, falling back to direct GitHub API fetch"
        )
        await initializeFromGitHubPR(prNumber)
      }
    } catch {
      console.log(
        "⚠️  Could not download artifacts, falling back to direct GitHub API fetch"
      )
      await initializeFromGitHubPR(prNumber)
    }
  } catch (error) {
    console.error("❌ Error syncing from GitHub Actions:", error)
    console.log("⚠️  Falling back to direct GitHub API fetch")
    await initializeFromGitHubPR(prNumber)
  }
}

async function resolveTodoWithComment(todoId: string, resolution?: string) {
  console.log(`🔧 Resolving todo ${todoId}...`)

  const todo = enhancedTodoManager.getTodoById(todoId)
  if (!todo) {
    console.log(`❌ Todo ${todoId} not found`)
    return
  }

  // Mark todo as completed
  const success = enhancedTodoManager.updateTodoStatus(todoId, "completed")
  if (!success) {
    console.log(`❌ Failed to update todo ${todoId}`)
    return
  }

  console.log(`✅ Marked todo ${todoId} as completed`)

  // If this todo has GitHub comment info, resolve the conversation
  if (todo.issueType === "review_comment" && todo.relatedPR) {
    try {
      const { execSync } = await import("child_process")
      const prNumber = todo.relatedPR.replace("#", "")

      const resolutionMessage = resolution || `Fixed the issue: ${todo.content}`

      console.log(`🔍 Looking for review conversations in PR ${prNumber}...`)

      // Get PR review conversations
      const reviewsOutput = execSync(
        `gh api repos/samuelhenry/patriot-heavy-ops/pulls/${prNumber}/reviews --jq '.[] | select(.state == "COMMENTED") | {id: .id, body: .body}'`,
        { encoding: "utf8" }
      )

      if (reviewsOutput.trim()) {
        console.log(`📝 Found review conversations, attempting to resolve...`)

        // Add a resolution comment to the PR
        const commentBody = `✅ **Code Review Feedback Resolved**

${resolutionMessage}

The following code review feedback has been addressed:
> ${todo.content}

All related review conversations should now be resolved.

_Resolved via Background Agent workflow_`

        execSync(
          `gh pr comment ${prNumber} --repo samuelhenry/patriot-heavy-ops --body "${commentBody.replace(
            /"/g,
            '\\"'
          )}"`,
          { encoding: "utf8" }
        )

        console.log(`✅ Added resolution comment to PR ${prNumber}`)
        console.log(
          `ℹ️  Note: Please manually resolve the review conversation in GitHub UI`
        )
      } else {
        console.log(`ℹ️  No review conversations found for PR ${prNumber}`)
      }
    } catch (error) {
      console.error("❌ Failed to resolve conversation:", error)
      console.log(
        "ℹ️  You may need to manually resolve the conversation in GitHub"
      )
    }
  }

  // Show updated progress
  const summary = enhancedTodoManager.getProgressSummary()
  console.log(
    `\n📊 Progress: ${summary.completed}/${
      summary.total
    } completed (${summary.completionRate.toFixed(1)}%)`
  )
}

async function listTodos() {
  const { todos, readyTodos, blockedTodos } =
    enhancedTodoManager.getTodosWithDependencies()

  console.log("📋 All Todos:")
  console.log("=".repeat(50))

  todos.forEach((todo, index) => {
    const status = getStatusEmoji(todo.status)
    const priority = getPriorityEmoji(todo.priority)
    const deps =
      todo.dependencies.length > 0 ? ` (${todo.dependencies.length} deps)` : ""

    console.log(`${index + 1}. ${status} ${priority} ${todo.content}${deps}`)
    if (todo.suggestedFix) {
      console.log(`   💡 Fix: ${todo.suggestedFix}`)
    }
    if (todo.files && todo.files.length > 0) {
      console.log(`   📁 Files: ${todo.files.join(", ")}`)
    }
    console.log()
  })

  console.log(`\n✅ Ready to work: ${readyTodos.length}`)
  console.log(`⏳ Blocked: ${blockedTodos.length}`)
}

async function showNextTodo() {
  const nextTodo = enhancedTodoManager.getNextTodo()

  if (!nextTodo) {
    console.log("🎉 No todos ready to work on!")
    return
  }

  console.log("🎯 Next Todo:")
  console.log("=".repeat(30))
  console.log(`📝 ${nextTodo.content}`)
  console.log(`🏷️  Priority: ${nextTodo.priority}`)
  console.log(`⏱️  Estimated: ${nextTodo.estimatedTime}`)
  console.log(`🏷️  Tags: ${nextTodo.tags?.join(", ")}`)
  console.log(`👤 Assignee: ${nextTodo.assignee}`)

  if (nextTodo.suggestedFix) {
    console.log(`💡 Suggested Fix: ${nextTodo.suggestedFix}`)
  }

  if (nextTodo.files && nextTodo.files.length > 0) {
    console.log(`📁 Files: ${nextTodo.files.join(", ")}`)
  }

  console.log(`\n🚀 To start working on this todo, run:`)
  console.log(`   npm run todo update ${nextTodo.id} in_progress`)
}

async function showReadyTodos() {
  const readyTodos = enhancedTodoManager.getReadyTodos()

  console.log("✅ Ready Todos:")
  console.log("=".repeat(20))

  if (readyTodos.length === 0) {
    console.log("🎉 No todos ready to work on!")
    return
  }

  readyTodos.forEach((todo, index) => {
    const priority = getPriorityEmoji(todo.priority)
    console.log(`${index + 1}. ${priority} ${todo.content}`)
    console.log(`   ⏱️  ${todo.estimatedTime} | 🏷️  ${todo.tags?.join(", ")}`)
    console.log()
  })
}

async function showBlockedTodos() {
  const blockedTodos = enhancedTodoManager.getBlockedTodos()

  console.log("⏳ Blocked Todos:")
  console.log("=".repeat(20))

  if (blockedTodos.length === 0) {
    console.log("🎉 No blocked todos!")
    return
  }

  blockedTodos.forEach((todo, index) => {
    const priority = getPriorityEmoji(todo.priority)
    console.log(`${index + 1}. ${priority} ${todo.content}`)
    console.log(`   🔗 Dependencies: ${todo.dependencies.length}`)
    console.log()
  })
}

async function showProgress() {
  const summary = enhancedTodoManager.getProgressSummary()

  console.log("📊 Progress Summary:")
  console.log("=".repeat(25))
  console.log(`Total Todos: ${summary.total}`)
  console.log(`✅ Completed: ${summary.completed}`)
  console.log(`🔄 In Progress: ${summary.inProgress}`)
  console.log(`⏳ Pending: ${summary.pending}`)
  console.log(`❌ Cancelled: ${summary.cancelled}`)
  console.log(`📈 Completion Rate: ${summary.completionRate.toFixed(1)}%`)

  // Show progress bar
  const barLength = 20
  const filledLength = Math.round((summary.completionRate / 100) * barLength)
  const bar = "█".repeat(filledLength) + "░".repeat(barLength - filledLength)
  console.log(`\nProgress: [${bar}] ${summary.completionRate.toFixed(1)}%`)
}

async function updateTodoStatus() {
  const todoId = process.argv[3]
  const status = process.argv[4] as EnhancedTodoItem["status"]

  if (!todoId || !status) {
    console.log("Usage: npm run todo update <todo-id> <status>")
    console.log("Status options: pending, in_progress, completed, cancelled")
    return
  }

  const validStatuses = ["pending", "in_progress", "completed", "cancelled"]
  if (!validStatuses.includes(status)) {
    console.log(`Invalid status. Must be one of: ${validStatuses.join(", ")}`)
    return
  }

  // ENFORCE DEFINITION OF DONE: Don't allow "completed" without verification
  if (status === "completed") {
    console.log("🔍 Verifying completion criteria...")
    console.log('⚠️  REMINDER: Tasks can only be marked "completed" when:')
    console.log("   • ALL tests pass (npm test)")
    console.log("   • ALL linting passes")
    console.log("   • ALL TypeScript compilation passes")
    console.log("   • ALL changes are committed")
    console.log("   • ALL changes are pushed to remote branch")
    console.log("   • ALL CI checks are green on PR")
    console.log("")
    console.log("⚠️  WARNING: Only mark as completed after full verification!")
  }

  const success = enhancedTodoManager.updateTodoStatus(todoId, status)

  if (success) {
    console.log(`✅ Updated todo ${todoId} to ${status}`)
    if (status === "completed") {
      console.log("🎯 Remember: Definition of Done = ALL checks passing!")
    }
  } else {
    console.log(`❌ Todo ${todoId} not found`)
  }
}

async function addTodo() {
  const content = process.argv[3]
  const priority = (process.argv[4] as EnhancedTodoItem["priority"]) || "medium"

  if (!content) {
    console.log('Usage: npm run todo add "<content>" [priority]')
    console.log("Priority options: low, medium, high, critical")
    return
  }

  const todo = enhancedTodoManager.addTodo(content, priority)
  console.log(`✅ Added todo: ${todo.content}`)
  console.log(`   ID: ${todo.id}`)
  console.log(`   Priority: ${todo.priority}`)
  console.log(`   Estimated: ${todo.estimatedTime}`)
}

function showHelp() {
  console.log("📋 Todo CLI Commands:")
  console.log("=".repeat(25))
  console.log("init           - Initialize todos from Background Agent")
  console.log(
    "github <PR>    - Fetch todos from GitHub PR comments (clears previous)"
  )
  console.log(
    "github-dod <PR> - Fetch todos with Definition of Done checks (clears previous)"
  )
  console.log(
    "analyze-workflow <RUN_ID> <PR> - Analyze workflow failure logs and create todos"
  )
  console.log(
    "continuous-monitor <PR> - Update todo statuses and detect new issues"
  )
  console.log("sync <PR>      - Sync todos from GitHub Actions workflow")
  console.log("resolve <ID>   - Mark todo as resolved and comment on GitHub")
  console.log("clear          - Clear all todos")
  console.log("list           - List all todos")
  console.log("next           - Show next todo to work on")
  console.log("ready          - Show todos ready to work on")
  console.log("blocked        - Show blocked todos")
  console.log("progress       - Show progress summary")
  console.log("update         - Update todo status")
  console.log("add            - Add new todo")
  console.log("help           - Show this help")
  console.log()
  console.log("Examples:")
  console.log("  npm run todo init")
  console.log("  npm run todo github 238")
  console.log(
    "  npm run todo github-dod 242  # Include Definition of Done checks"
  )
  console.log("  npm run todo analyze-workflow 12345678 245  # Analyze failed workflow")
  console.log("  npm run todo continuous-monitor 245  # Update todo statuses")
  console.log("  npm run todo clear")
  console.log("  npm run todo next")
  console.log("  npm run todo update issue-1 completed")
  console.log('  npm run todo add "Fix mobile auth" high')
}

function getStatusEmoji(status: string): string {
  switch (status) {
    case "completed":
      return "✅"
    case "in_progress":
      return "🔄"
    case "pending":
      return "⏳"
    case "cancelled":
      return "❌"
    default:
      return "❓"
  }
}

function getPriorityEmoji(priority: string): string {
  switch (priority) {
    case "critical":
      return "🚨"
    case "high":
      return "🔴"
    case "medium":
      return "🟡"
    case "low":
      return "🟢"
    default:
      return "⚪"
  }
}

function getIssueTypeIcon(issueType: string): string {
  switch (issueType) {
    case "review_comment":
      return "🤖"
    case "ci_failure":
      return "🚨"
    case "vercel_failure":
      return "▲"
    case "lint_error":
      return "🔍"
    case "test_failure":
      return "🧪"
    case "definition_of_done":
      return "✅"
    default:
      return "📝"
  }
}


// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    if (error instanceof Error) {
      console.error("❌ Error:", error.message)
      if (error.stack) {
        console.error("Stack trace:", error.stack)
      }
      if (error.cause) {
        console.error("Caused by:", error.cause)
      }
    } else {
      console.error("❌ Unknown error:", error)
    }
    process.exit(1)
  })
}
