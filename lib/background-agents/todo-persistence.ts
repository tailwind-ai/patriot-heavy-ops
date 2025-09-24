/**
 * Simple file-based persistence for todos
 */

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { EnhancedTodoItem } from './enhanced-todo-manager'

const TODO_FILE = join(process.cwd(), '.todos.json')

export class TodoPersistence {
  /**
   * Save todos to file
   */
  static saveTodos(todos: EnhancedTodoItem[]): void {
    try {
      writeFileSync(TODO_FILE, JSON.stringify(todos, null, 2))
    } catch (error) {
      console.error('Failed to save todos:', error)
    }
  }

  /**
   * Load todos from file
   */
  static loadTodos(): EnhancedTodoItem[] {
    try {
      if (!existsSync(TODO_FILE)) {
        return []
      }
      
      const data = readFileSync(TODO_FILE, 'utf-8')
      const todos = JSON.parse(data)
      
      // Convert date strings back to Date objects
      return todos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt)
      }))
    } catch (error) {
      console.error('Failed to load todos:', error)
      return []
    }
  }

  /**
   * Clear all todos
   */
  static clearTodos(): void {
    try {
      if (existsSync(TODO_FILE)) {
        writeFileSync(TODO_FILE, '[]')
      }
    } catch (error) {
      console.error('Failed to clear todos:', error)
    }
  }
}
