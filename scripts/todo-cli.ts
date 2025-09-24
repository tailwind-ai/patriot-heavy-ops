#!/usr/bin/env tsx

/**
 * CLI tool for managing todos with Background Agent integration
 * and dependency-based prioritization
 */

import { enhancedTodoManager, EnhancedTodoItem } from "../lib/background-agents/enhanced-todo-manager"

async function main() {
  const command = process.argv[2]
  const prNumber = process.argv[3]
  
  try {
    switch (command) {
      case 'init':
        await initializeTodos()
        break
      case 'github':
        if (!prNumber) {
          console.log('❌ Please provide PR number: npm run todo github <PR_NUMBER>')
          process.exit(1)
        }
        await initializeFromGitHubPR(parseInt(prNumber))
        break
      case 'clear':
        await clearAllTodos()
        break
      case 'list':
        await listTodos()
        break
      case 'next':
        await showNextTodo()
        break
      case 'ready':
        await showReadyTodos()
        break
      case 'blocked':
        await showBlockedTodos()
        break
      case 'progress':
        await showProgress()
        break
      case 'update':
        await updateTodoStatus()
        break
      case 'add':
        await addTodo()
        break
      case 'help':
        showHelp()
        break
      default:
        console.log('Unknown command. Use "help" to see available commands.')
    }
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

async function initializeTodos() {
  console.log('🤖 Initializing todos from Background Agent...')
  const todos = await enhancedTodoManager.initializeFromBackgroundAgent()
  console.log(`✅ Found ${todos.length} issues to address`)
  
  // Show summary
  const summary = enhancedTodoManager.getProgressSummary()
  console.log('\n📊 Summary:')
  console.log(`  Total: ${summary.total}`)
  console.log(`  Ready: ${summary.pending}`)
  console.log(`  In Progress: ${summary.inProgress}`)
  console.log(`  Completed: ${summary.completed}`)
  console.log(`  Completion Rate: ${summary.completionRate.toFixed(1)}%`)
  
  // Show the first few todos
  if (todos.length > 0) {
    console.log('\n🎯 Top Priority Issues:')
    todos.slice(0, 3).forEach((todo, index) => {
      const priority = getPriorityEmoji(todo.priority)
      console.log(`  ${index + 1}. ${priority} ${todo.content}`)
    })
  }
}

async function initializeFromGitHubPR(prNumber: number) {
  console.log(`🤖 Fetching issues from GitHub PR #${prNumber}...`)
  console.log(`🧹 Clearing previous todos for fresh PR-specific detection...`)
  console.log(`🔍 Checking for Copilot comments and CI failures...`)
  
  const todos = await enhancedTodoManager.initializeFromGitHubPR(prNumber)
  console.log(`✅ Found ${todos.length} issues from GitHub PR #${prNumber}`)
  
  // Show summary
  const summary = enhancedTodoManager.getProgressSummary()
  console.log('\n📊 Summary:')
  console.log(`  Total: ${summary.total}`)
  console.log(`  Ready: ${summary.pending}`)
  console.log(`  In Progress: ${summary.inProgress}`)
  console.log(`  Completed: ${summary.completed}`)
  console.log(`  Completion Rate: ${summary.completionRate.toFixed(1)}%`)
  
  // Show the GitHub todos
  if (todos.length > 0) {
    console.log('\n🎯 GitHub PR Issues:')
    todos.forEach((todo, index) => {
      const priority = getPriorityEmoji(todo.priority)
      const status = getStatusEmoji(todo.status)
      const typeIcon = getIssueTypeIcon(todo.issueType)
      console.log(`  ${index + 1}. ${status} ${priority} ${typeIcon} ${todo.content}`)
      if (todo.suggestedFix) {
        console.log(`     💡 Fix: ${todo.suggestedFix}`)
      }
      if (todo.files && todo.files.length > 0) {
        console.log(`     📁 Files: ${todo.files.join(', ')}`)
      }
    })
  } else {
    console.log('\n🎉 No issues found in GitHub PR #' + prNumber)
  }
}

async function clearAllTodos() {
  console.log('🧹 Clearing all todos...')
  enhancedTodoManager.clearAllTodos()
  console.log('✅ All todos cleared')
}

async function listTodos() {
  const { todos, readyTodos, blockedTodos } = enhancedTodoManager.getTodosWithDependencies()
  
  console.log('📋 All Todos:')
  console.log('='.repeat(50))
  
  todos.forEach((todo, index) => {
    const status = getStatusEmoji(todo.status)
    const priority = getPriorityEmoji(todo.priority)
    const deps = todo.dependencies.length > 0 ? ` (${todo.dependencies.length} deps)` : ''
    
    console.log(`${index + 1}. ${status} ${priority} ${todo.content}${deps}`)
    if (todo.suggestedFix) {
      console.log(`   💡 Fix: ${todo.suggestedFix}`)
    }
    if (todo.files && todo.files.length > 0) {
      console.log(`   📁 Files: ${todo.files.join(', ')}`)
    }
    console.log()
  })
  
  console.log(`\n✅ Ready to work: ${readyTodos.length}`)
  console.log(`⏳ Blocked: ${blockedTodos.length}`)
}

async function showNextTodo() {
  const nextTodo = enhancedTodoManager.getNextTodo()
  
  if (!nextTodo) {
    console.log('🎉 No todos ready to work on!')
    return
  }
  
  console.log('🎯 Next Todo:')
  console.log('='.repeat(30))
  console.log(`📝 ${nextTodo.content}`)
  console.log(`🏷️  Priority: ${nextTodo.priority}`)
  console.log(`⏱️  Estimated: ${nextTodo.estimatedTime}`)
  console.log(`🏷️  Tags: ${nextTodo.tags?.join(', ')}`)
  console.log(`👤 Assignee: ${nextTodo.assignee}`)
  
  if (nextTodo.suggestedFix) {
    console.log(`💡 Suggested Fix: ${nextTodo.suggestedFix}`)
  }
  
  if (nextTodo.files && nextTodo.files.length > 0) {
    console.log(`📁 Files: ${nextTodo.files.join(', ')}`)
  }
  
  console.log(`\n🚀 To start working on this todo, run:`)
  console.log(`   npm run todo update ${nextTodo.id} in_progress`)
}

async function showReadyTodos() {
  const readyTodos = enhancedTodoManager.getReadyTodos()
  
  console.log('✅ Ready Todos:')
  console.log('='.repeat(20))
  
  if (readyTodos.length === 0) {
    console.log('🎉 No todos ready to work on!')
    return
  }
  
  readyTodos.forEach((todo, index) => {
    const priority = getPriorityEmoji(todo.priority)
    console.log(`${index + 1}. ${priority} ${todo.content}`)
    console.log(`   ⏱️  ${todo.estimatedTime} | 🏷️  ${todo.tags?.join(', ')}`)
    console.log()
  })
}

async function showBlockedTodos() {
  const blockedTodos = enhancedTodoManager.getBlockedTodos()
  
  console.log('⏳ Blocked Todos:')
  console.log('='.repeat(20))
  
  if (blockedTodos.length === 0) {
    console.log('🎉 No blocked todos!')
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
  
  console.log('📊 Progress Summary:')
  console.log('='.repeat(25))
  console.log(`Total Todos: ${summary.total}`)
  console.log(`✅ Completed: ${summary.completed}`)
  console.log(`🔄 In Progress: ${summary.inProgress}`)
  console.log(`⏳ Pending: ${summary.pending}`)
  console.log(`❌ Cancelled: ${summary.cancelled}`)
  console.log(`📈 Completion Rate: ${summary.completionRate.toFixed(1)}%`)
  
  // Show progress bar
  const barLength = 20
  const filledLength = Math.round((summary.completionRate / 100) * barLength)
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength)
  console.log(`\nProgress: [${bar}] ${summary.completionRate.toFixed(1)}%`)
}

async function updateTodoStatus() {
  const todoId = process.argv[3]
  const status = process.argv[4] as EnhancedTodoItem['status']
  
  if (!todoId || !status) {
    console.log('Usage: npm run todo update <todo-id> <status>')
    console.log('Status options: pending, in_progress, completed, cancelled')
    return
  }
  
  const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled']
  if (!validStatuses.includes(status)) {
    console.log(`Invalid status. Must be one of: ${validStatuses.join(', ')}`)
    return
  }
  
  // ENFORCE DEFINITION OF DONE: Don't allow "completed" without verification
  if (status === 'completed') {
    console.log('🔍 Verifying completion criteria...')
    console.log('⚠️  REMINDER: Tasks can only be marked "completed" when:')
    console.log('   • ALL tests pass (npm test)')
    console.log('   • ALL linting passes')
    console.log('   • ALL TypeScript compilation passes')
    console.log('   • ALL CI checks are green')
    console.log('')
    console.log('⚠️  WARNING: Only mark as completed after full verification!')
  }
  
  const success = enhancedTodoManager.updateTodoStatus(todoId, status)
  
  if (success) {
    console.log(`✅ Updated todo ${todoId} to ${status}`)
    if (status === 'completed') {
      console.log('🎯 Remember: Definition of Done = ALL checks passing!')
    }
  } else {
    console.log(`❌ Todo ${todoId} not found`)
  }
}

async function addTodo() {
  const content = process.argv[3]
  const priority = (process.argv[4] as EnhancedTodoItem['priority']) || 'medium'
  
  if (!content) {
    console.log('Usage: npm run todo add "<content>" [priority]')
    console.log('Priority options: low, medium, high, critical')
    return
  }
  
  const todo = enhancedTodoManager.addTodo(content, priority)
  console.log(`✅ Added todo: ${todo.content}`)
  console.log(`   ID: ${todo.id}`)
  console.log(`   Priority: ${todo.priority}`)
  console.log(`   Estimated: ${todo.estimatedTime}`)
}

function showHelp() {
  console.log('📋 Todo CLI Commands:')
  console.log('='.repeat(25))
  console.log('init           - Initialize todos from Background Agent')
  console.log('github <PR>    - Fetch todos from GitHub PR comments (clears previous)')
  console.log('clear          - Clear all todos')
  console.log('list           - List all todos')
  console.log('next           - Show next todo to work on')
  console.log('ready          - Show todos ready to work on')
  console.log('blocked        - Show blocked todos')
  console.log('progress       - Show progress summary')
  console.log('update         - Update todo status')
  console.log('add            - Add new todo')
  console.log('help           - Show this help')
  console.log()
  console.log('Examples:')
  console.log('  npm run todo init')
  console.log('  npm run todo github 238')
  console.log('  npm run todo clear')
  console.log('  npm run todo next')
  console.log('  npm run todo update issue-1 completed')
  console.log('  npm run todo add "Fix mobile auth" high')
}

function getStatusEmoji(status: string): string {
  switch (status) {
    case 'completed': return '✅'
    case 'in_progress': return '🔄'
    case 'pending': return '⏳'
    case 'cancelled': return '❌'
    default: return '❓'
  }
}

function getPriorityEmoji(priority: string): string {
  switch (priority) {
    case 'critical': return '🚨'
    case 'high': return '🔴'
    case 'medium': return '🟡'
    case 'low': return '🟢'
    default: return '⚪'
  }
}

function getIssueTypeIcon(issueType: string): string {
  switch (issueType) {
    case 'copilot_comment': return '🤖'
    case 'ci_failure': return '🚨'
    case 'vercel_failure': return '▲'
    case 'lint_error': return '🔍'
    case 'test_failure': return '🧪'
    default: return '📝'
  }
}

// Run if called directly
if (require.main === module) {
  main()
}
