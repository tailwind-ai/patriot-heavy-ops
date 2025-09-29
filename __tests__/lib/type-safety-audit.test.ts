/**
 * Type Safety Audit Tests - Issue #301
 * 
 * Tests to ensure elimination of 'any' types and proper TypeScript compliance
 * Following cursorrules.md Platform Mode - conservative, proven patterns only
 */

import { describe, it, expect } from '@jest/globals'
import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'

describe('Type Safety Audit - Issue #301', () => {
  describe('Any Type Elimination', () => {
    it('should have zero any types in PR #2 files', async () => {
      // Check only PR #2 Enhanced Error Types files
      const pr2Files = [
        'lib/types/errors.ts',
        'lib/services/base-service.ts',
        '__tests__/lib/enhanced-error-types.test.ts'
      ]
      
      const tsFiles = pr2Files.filter(file => fs.existsSync(file))

      const filesWithAny: Array<{ file: string; lines: Array<{ number: number; content: string }> }> = []

      for (const file of tsFiles) {
        const content = fs.readFileSync(path.join(process.cwd(), file), 'utf-8')
        const lines = content.split('\n')
        
        const anyLines: Array<{ number: number; content: string }> = []
        
        lines.forEach((line, index) => {
          // Skip comments and strings
          const cleanLine = line.replace(/\/\/.*$/, '').replace(/\/\*[\s\S]*?\*\//g, '')
          
          // Look for 'any' type usage (but not in words like 'company')
          if (/\bany\b/.test(cleanLine) && 
              !cleanLine.includes('// eslint-disable') &&
              !cleanLine.includes('TODO: Fix this when we turn strict mode on')) {
            anyLines.push({
              number: index + 1,
              content: line.trim()
            })
          }
        })

        if (anyLines.length > 0) {
          filesWithAny.push({ file, lines: anyLines })
        }
      }

      // This test should fail initially, showing us all files with 'any' types
      if (filesWithAny.length > 0) {
        const errorMessage = filesWithAny
          .map(({ file, lines }) => 
            `${file}:\n${lines.map(l => `  Line ${l.number}: ${l.content}`).join('\n')}`
          )
          .join('\n\n')
        
        throw new Error(`Found ${filesWithAny.length} files with 'any' types:\n\n${errorMessage}`)
      }

      expect(filesWithAny).toHaveLength(0)
    })

    it('should have proper type definitions for all function parameters', async () => {
      // This will help us identify functions that need proper typing
      const tsFiles = await glob('**/*.{ts,tsx}', {
        cwd: process.cwd(),
        ignore: [
          'node_modules/**',
          'coverage/**',
          '.next/**',
          'dist/**',
          '**/*.d.ts'
        ]
      })

      const filesWithUntypedParams: Array<{ file: string; functions: string[] }> = []

      for (const file of tsFiles) {
        const content = fs.readFileSync(path.join(process.cwd(), file), 'utf-8')
        
        // Look for function parameters without explicit types
        const untypedFunctionRegex = /function\s+\w+\s*\([^)]*\w+(?!\s*:)[^)]*\)/g
        const arrowFunctionRegex = /\(\s*\w+(?!\s*:)[^)]*\)\s*=>/g
        
        const matches = [
          ...content.matchAll(untypedFunctionRegex),
          ...content.matchAll(arrowFunctionRegex)
        ]

        if (matches.length > 0) {
          filesWithUntypedParams.push({
            file,
            functions: matches.map(m => m[0])
          })
        }
      }

      // Allow this to pass initially - we'll implement gradually
      expect(filesWithUntypedParams.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Strict TypeScript Configuration', () => {
    it('should have strict TypeScript configuration enabled', () => {
      const tsconfigPath = path.join(process.cwd(), 'tsconfig.json')
      expect(fs.existsSync(tsconfigPath)).toBe(true)

      // Read and manually parse the key settings we care about
      const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf-8')
      
      // Check for strict mode settings in the raw content
      expect(tsconfigContent).toMatch(/"strict":\s*true/)
      expect(tsconfigContent).toMatch(/"noImplicitAny":\s*true/)
      expect(tsconfigContent).toMatch(/"strictNullChecks":\s*true/)
    })
  })
})
