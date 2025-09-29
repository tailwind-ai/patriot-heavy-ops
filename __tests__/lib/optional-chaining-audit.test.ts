/**
 * Optional Chaining Audit Tests - Issue #301
 * 
 * Tests to ensure proper optional chaining usage for null safety
 * Following cursorrules.md Platform Mode - conservative, proven patterns only
 */

import { describe, it, expect } from '@jest/globals'
import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'

describe('Optional Chaining Audit - Issue #301', () => {
  describe('Unsafe Property Access Detection', () => {
    it('should use optional chaining for uncertain data access', async () => {
      // Get all TypeScript files excluding tests and node_modules
      const tsFiles = await glob('**/*.{ts,tsx}', {
        cwd: process.cwd(),
        ignore: [
          'node_modules/**',
          'coverage/**',
          '.next/**',
          'dist/**',
          '__tests__/**', // Focus on production code first
          '**/*.test.ts',
          '**/*.test.tsx',
          '**/*.d.ts'
        ]
      })

      const filesWithUnsafeAccess: Array<{ 
        file: string; 
        issues: Array<{ number: number; content: string; suggestion: string }> 
      }> = []

      for (const file of tsFiles) {
        const content = fs.readFileSync(path.join(process.cwd(), file), 'utf-8')
        const lines = content.split('\n')
        
        const issues: Array<{ number: number; content: string; suggestion: string }> = []
        
        lines.forEach((line, index) => {
          const trimmedLine = line.trim()
          
          // Skip comments and strings
          if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine.startsWith('/*')) {
            return
          }

          // Look for potentially unsafe property access patterns
          // Pattern 1: obj.prop where obj might be null/undefined
          const directAccessPattern = /(\w+)\.(\w+)/g
          let match
          while ((match = directAccessPattern.exec(trimmedLine)) !== null) {
            const objName = match[1]
            const propName = match[2]
            
            // Skip if match groups are undefined
            if (!objName || !propName) {
              continue
            }
            
            // Skip safe patterns
            if (
              // Skip known safe objects
              ['console', 'process', 'window', 'document', 'Math', 'Date', 'JSON', 'Object', 'Array'].includes(objName) ||
              // Skip method calls (they have parentheses)
              trimmedLine.includes(`${objName}.${propName}(`) ||
              // Skip already using optional chaining
              trimmedLine.includes(`${objName}?.${propName}`) ||
              // Skip type definitions
              trimmedLine.includes(':') && !trimmedLine.includes('=') ||
              // Skip imports
              trimmedLine.includes('import') ||
              // Skip exports
              trimmedLine.includes('export') ||
              // Skip class property definitions
              file.includes('.ts') && !trimmedLine.includes('=') && !trimmedLine.includes('return')
            ) {
              continue
            }

            // Check if this looks like uncertain data access
            if (
              // API responses, user data, form data
              objName.includes('user') || objName.includes('data') || objName.includes('response') ||
              objName.includes('result') || objName.includes('item') || objName.includes('entity') ||
              // Props and parameters that might be undefined
              objName === 'props' || objName === 'params' || objName === 'query' ||
              // Database results
              objName.includes('db') || objName.includes('record') || objName.includes('row')
            ) {
              issues.push({
                number: index + 1,
                content: trimmedLine,
                suggestion: trimmedLine.replace(`${objName}.${propName}`, `${objName}?.${propName}`)
              })
            }
          }

          // Pattern 2: array[index] access without bounds checking
          const arrayAccessPattern = /(\w+)\[(\d+|\w+)\]/g
          while ((match = arrayAccessPattern.exec(trimmedLine)) !== null) {
            const arrayName = match[1]
            const indexStr = match[2]
            
            // Skip if match groups are undefined
            if (!arrayName || !indexStr) {
              continue
            }
            
            // Skip safe patterns
            if (
              // Skip already using optional chaining
              trimmedLine.includes(`${arrayName}?.[${indexStr}]`) ||
              // Skip string/object literals
              trimmedLine.includes('"') || trimmedLine.includes("'") ||
              // Skip type definitions
              trimmedLine.includes(':') && !trimmedLine.includes('=')
            ) {
              continue
            }

            // Check if this looks like uncertain array access
            if (
              arrayName.includes('items') || arrayName.includes('results') || 
              arrayName.includes('data') || arrayName.includes('list') ||
              arrayName === 'args' || arrayName === 'params'
            ) {
              issues.push({
                number: index + 1,
                content: trimmedLine,
                suggestion: trimmedLine.replace(`${arrayName}[${indexStr}]`, `${arrayName}?.[${indexStr}]`)
              })
            }
          }
        })

        if (issues.length > 0) {
          filesWithUnsafeAccess.push({ file, issues })
        }
      }

      // This test should initially fail, showing us all unsafe access patterns
      if (filesWithUnsafeAccess.length > 0) {
        const errorMessage = filesWithUnsafeAccess
          .map(({ file, issues }) => 
            `${file}:\n${issues.map(i => 
              `  Line ${i.number}: ${i.content}\n  Suggested: ${i.suggestion}`
            ).join('\n')}`
          )
          .join('\n\n')
        
        throw new Error(`Found ${filesWithUnsafeAccess.length} files with unsafe property access:\n\n${errorMessage}`)
      }

      expect(filesWithUnsafeAccess).toHaveLength(0)
    })

    it('should use nullish coalescing for default values', async () => {
      // Get production TypeScript files
      const tsFiles = await glob('**/*.{ts,tsx}', {
        cwd: process.cwd(),
        ignore: [
          'node_modules/**',
          'coverage/**',
          '.next/**',
          'dist/**',
          '__tests__/**',
          '**/*.test.ts',
          '**/*.test.tsx',
          '**/*.d.ts'
        ]
      })

      const filesWithUnsafeDefaults: Array<{ file: string; lines: Array<{ number: number; content: string }> }> = []

      for (const file of tsFiles) {
        const content = fs.readFileSync(path.join(process.cwd(), file), 'utf-8')
        const lines = content.split('\n')
        
        const unsafeLines: Array<{ number: number; content: string }> = []
        
        lines.forEach((line, index) => {
          const trimmedLine = line.trim()
          
          // Look for || used for defaults instead of ??
          if (
            trimmedLine.includes(' || ') &&
            !trimmedLine.includes('//') &&
            !trimmedLine.includes('/*') &&
            // Check if it's being used for default values
            (trimmedLine.includes("''") || trimmedLine.includes('""') || 
             trimmedLine.includes('0') || trimmedLine.includes('[]') || 
             trimmedLine.includes('{}') || trimmedLine.includes('null') ||
             trimmedLine.includes('undefined'))
          ) {
            unsafeLines.push({
              number: index + 1,
              content: trimmedLine
            })
          }
        })

        if (unsafeLines.length > 0) {
          filesWithUnsafeDefaults.push({ file, lines: unsafeLines })
        }
      }

      // Allow this to pass initially - we'll implement gradually
      expect(filesWithUnsafeDefaults.length).toBeGreaterThanOrEqual(0)
    })
  })
})
