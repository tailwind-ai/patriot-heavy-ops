#!/usr/bin/env tsx

/**
 * Export pending todos in a Cursor-friendly markdown file.
 * Source: .todos.json produced by Background Agent.
 */

import fs from "fs"
import path from "path"

type Todo = {
  content: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "critical"
  files?: string[]
  suggestedFix?: string
}

const TODO_FILE = path.join(process.cwd(), ".todos.json")
const OUTPUT_FILE = path.join(process.cwd(), "CURSOR_TODOS.md")

function formatTodo(todo: Todo): string {
  const priorityIcon =
    todo.priority === "critical"
      ? "🚨"
      : todo.priority === "high"
      ? "🔴"
      : todo.priority === "medium"
      ? "🟡"
      : "🟢"
  const files =
    Array.isArray(todo.files) && todo.files.length > 0
      ? `\n   - Files: ${todo.files.join(", ")}`
      : ""
  const fix = todo.suggestedFix ? `\n   - Fix: ${todo.suggestedFix}` : ""
  return `- [ ] ${priorityIcon} ${todo.content}${files}${fix}`
}

function main(): void {
  let pending: Todo[] = []
  if (fs.existsSync(TODO_FILE)) {
    const data = JSON.parse(fs.readFileSync(TODO_FILE, "utf8")) as Todo[]
    pending = data.filter((t) => t.status === "pending")
  }

  const lines: string[] = []
  lines.push("## Cursor Todos")
  lines.push("")
  if (pending.length === 0) {
    lines.push("- [ ] No pending todos")
  } else {
    pending.forEach((t) => lines.push(formatTodo(t)))
  }
  lines.push("")
  lines.push("<!-- generated:cursor-todos -->")

  fs.writeFileSync(OUTPUT_FILE, lines.join("\n"))
  // eslint-disable-next-line no-console
  console.log(`Wrote ${pending.length} pending todos to ${OUTPUT_FILE}`)
}

main()
