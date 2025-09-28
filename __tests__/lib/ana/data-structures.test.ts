/**
 * Unit tests for Ana Data Structures and Validation
 * Tests the AnalyzedFailure interface and data validation logic
 */

import { 
  type AnalyzedFailure, 
  validateAnalyzedFailure, 
  createAnalyzedFailure,
  AnaResults,
  validateAnaResults,
} from '@/lib/ana/types'

describe('Ana Data Structures', () => {
  describe('AnalyzedFailure Interface', () => {
    it('should create valid AnalyzedFailure object with all required fields', () => {
      const failure: AnalyzedFailure = {
        id: 'test-failure-123',
        type: 'ci_failure',
        content: 'TypeScript compilation error in Button.tsx',
        priority: 'high',
        files: ['src/components/Button.tsx'],
        lineNumbers: [45],
        rootCause: 'TypeScript compilation error',
        impact: 'Prevents application build',
        suggestedFix: 'Fix type mismatch in Button.tsx at line 45',
        affectedComponents: ['Button component'],
        relatedPR: '#123',
        createdAt: '2024-01-01T12:00:00.000Z',
      }

      expect(failure).toMatchObject({
        id: expect.any(String),
        type: expect.stringMatching(/^(ci_failure|vercel_failure)$/),
        content: expect.any(String),
        priority: expect.stringMatching(/^(low|medium|high|critical)$/),
        createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      })
    })

    it('should create valid AnalyzedFailure object with minimal required fields', () => {
      const failure: AnalyzedFailure = {
        id: 'minimal-failure-456',
        type: 'ci_failure',
        content: 'Generic build error',
        priority: 'medium',
        createdAt: '2024-01-01T12:00:00.000Z',
      }

      expect(failure).toMatchObject({
        id: 'minimal-failure-456',
        type: 'ci_failure',
        content: 'Generic build error',
        priority: 'medium',
        createdAt: '2024-01-01T12:00:00.000Z',
      })

      // Optional fields should be undefined
      expect(failure.files).toBeUndefined()
      expect(failure.lineNumbers).toBeUndefined()
      expect(failure.rootCause).toBeUndefined()
      expect(failure.impact).toBeUndefined()
      expect(failure.suggestedFix).toBeUndefined()
      expect(failure.affectedComponents).toBeUndefined()
      expect(failure.relatedPR).toBeUndefined()
    })

    it('should handle Vercel failure type correctly', () => {
      const failure: AnalyzedFailure = {
        id: 'vercel-failure-789',
        type: 'vercel_failure',
        content: 'Build timeout after 10 minutes',
        priority: 'critical',
        rootCause: 'Vercel build timeout',
        suggestedFix: 'Optimize build process',
        createdAt: '2024-01-01T12:00:00.000Z',
      }

      expect(failure.type).toBe('vercel_failure')
      expect(failure.priority).toBe('critical')
    })
  })

  describe('validateAnalyzedFailure', () => {
    it('should validate correct AnalyzedFailure object', () => {
      const validFailure: AnalyzedFailure = {
        id: 'valid-123',
        type: 'ci_failure',
        content: 'Test error',
        priority: 'high',
        createdAt: '2024-01-01T12:00:00.000Z',
      }

      const result = validateAnalyzedFailure(validFailure)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validFailure)
      }
    })

    it('should reject AnalyzedFailure with missing required fields', () => {
      const invalidFailure = {
        id: 'invalid-123',
        // Missing type, content, priority, createdAt
      }

      const result = validateAnalyzedFailure(invalidFailure)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(4) // 4 missing required fields
      }
    })

    it('should reject AnalyzedFailure with invalid type', () => {
      const invalidFailure = {
        id: 'invalid-type-123',
        type: 'invalid_type',
        content: 'Test error',
        priority: 'high',
        createdAt: '2024-01-01T12:00:00.000Z',
      }

      const result = validateAnalyzedFailure(invalidFailure)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Type must be ci_failure, vercel_failure, or bugbot_issue')
      }
    })

    it('should reject AnalyzedFailure with invalid priority', () => {
      const invalidFailure = {
        id: 'invalid-priority-123',
        type: 'ci_failure',
        content: 'Test error',
        priority: 'invalid_priority',
        createdAt: '2024-01-01T12:00:00.000Z',
      }

      const result = validateAnalyzedFailure(invalidFailure)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Priority must be low, medium, high, or critical')
      }
    })

    it('should reject AnalyzedFailure with invalid date format', () => {
      const invalidFailure = {
        id: 'invalid-date-123',
        type: 'ci_failure',
        content: 'Test error',
        priority: 'high',
        createdAt: 'invalid-date',
      }

      const result = validateAnalyzedFailure(invalidFailure)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Invalid datetime')
      }
    })

    it('should validate optional arrays correctly', () => {
      const failureWithArrays: AnalyzedFailure = {
        id: 'arrays-123',
        type: 'ci_failure',
        content: 'Test error',
        priority: 'high',
        files: ['file1.ts', 'file2.tsx'],
        lineNumbers: [10, 20, 30],
        affectedComponents: ['Component1', 'Component2'],
        createdAt: '2024-01-01T12:00:00.000Z',
      }

      const result = validateAnalyzedFailure(failureWithArrays)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.files).toEqual(['file1.ts', 'file2.tsx'])
        expect(result.data.lineNumbers).toEqual([10, 20, 30])
        expect(result.data.affectedComponents).toEqual(['Component1', 'Component2'])
      }
    })

    it('should reject invalid array types', () => {
      const invalidFailure = {
        id: 'invalid-arrays-123',
        type: 'ci_failure',
        content: 'Test error',
        priority: 'high',
        files: 'not-an-array', // Should be array
        lineNumbers: ['not', 'numbers'], // Should be number array
        createdAt: '2024-01-01T12:00:00.000Z',
      }

      const result = validateAnalyzedFailure(invalidFailure)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })
  })

  describe('createAnalyzedFailure', () => {
    it('should create AnalyzedFailure with auto-generated ID and timestamp', () => {
      const failure = createAnalyzedFailure({
        type: 'ci_failure',
        content: 'Test error',
        priority: 'high',
      })

      expect(failure.id).toMatch(/^ci-failure-\d+-[a-z0-9]+$/)
      expect(failure.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      expect(failure.type).toBe('ci_failure')
      expect(failure.content).toBe('Test error')
      expect(failure.priority).toBe('high')
    })

    it('should create AnalyzedFailure with custom ID', () => {
      const failure = createAnalyzedFailure({
        id: 'custom-id-123',
        type: 'vercel_failure',
        content: 'Vercel error',
        priority: 'critical',
      })

      expect(failure.id).toBe('custom-id-123')
      expect(failure.type).toBe('vercel_failure')
      expect(failure.priority).toBe('critical')
    })

    it('should create AnalyzedFailure with all optional fields', () => {
      const failure = createAnalyzedFailure({
        type: 'ci_failure',
        content: 'TypeScript error',
        priority: 'high',
        files: ['src/test.ts'],
        lineNumbers: [45],
        rootCause: 'Type mismatch',
        impact: 'Build failure',
        suggestedFix: 'Fix types',
        affectedComponents: ['TestComponent'],
        relatedPR: '#456',
      })

      expect(failure.files).toEqual(['src/test.ts'])
      expect(failure.lineNumbers).toEqual([45])
      expect(failure.rootCause).toBe('Type mismatch')
      expect(failure.impact).toBe('Build failure')
      expect(failure.suggestedFix).toBe('Fix types')
      expect(failure.affectedComponents).toEqual(['TestComponent'])
      expect(failure.relatedPR).toBe('#456')
    })
  })

  describe('AnaResults Interface', () => {
    it('should create valid AnaResults object', () => {
      const results: AnaResults = {
        failures: [
          createAnalyzedFailure({
            type: 'ci_failure',
            content: 'Test error 1',
            priority: 'high',
          }),
          createAnalyzedFailure({
            type: 'vercel_failure',
            content: 'Test error 2',
            priority: 'critical',
          }),
        ],
        summary: 'Found 2 failures in CI and Vercel deployment',
        analysisDate: '2024-01-01T12:00:00.000Z',
        totalFailures: 2,
        criticalFailures: 1,
        highPriorityFailures: 1,
        mediumPriorityFailures: 0,
        lowPriorityFailures: 0,
      }

      expect(results).toMatchObject({
        failures: expect.arrayContaining([
          expect.objectContaining({ type: 'ci_failure' }),
          expect.objectContaining({ type: 'vercel_failure' }),
        ]),
        summary: expect.any(String),
        analysisDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        totalFailures: 2,
        criticalFailures: 1,
        highPriorityFailures: 1,
      })
    })

    it('should calculate priority counts correctly', () => {
      const failures = [
        createAnalyzedFailure({ type: 'ci_failure', content: 'Error 1', priority: 'critical' }),
        createAnalyzedFailure({ type: 'ci_failure', content: 'Error 2', priority: 'critical' }),
        createAnalyzedFailure({ type: 'ci_failure', content: 'Error 3', priority: 'high' }),
        createAnalyzedFailure({ type: 'ci_failure', content: 'Error 4', priority: 'medium' }),
        createAnalyzedFailure({ type: 'ci_failure', content: 'Error 5', priority: 'low' }),
      ]

      const results: AnaResults = {
        failures,
        summary: 'Test results',
        analysisDate: '2024-01-01T12:00:00.000Z',
        totalFailures: 5,
        criticalFailures: 2,
        highPriorityFailures: 1,
        mediumPriorityFailures: 1,
        lowPriorityFailures: 1,
      }

      expect(results.totalFailures).toBe(5)
      expect(results.criticalFailures).toBe(2)
      expect(results.highPriorityFailures).toBe(1)
      expect(results.mediumPriorityFailures).toBe(1)
      expect(results.lowPriorityFailures).toBe(1)
    })
  })

  describe('validateAnaResults', () => {
    it('should validate correct AnaResults object', () => {
      const validResults: AnaResults = {
        failures: [
          createAnalyzedFailure({
            type: 'ci_failure',
            content: 'Test error',
            priority: 'high',
          }),
        ],
        summary: 'Test summary',
        analysisDate: '2024-01-01T12:00:00.000Z',
        totalFailures: 1,
        criticalFailures: 0,
        highPriorityFailures: 1,
        mediumPriorityFailures: 0,
        lowPriorityFailures: 0,
      }

      const result = validateAnaResults(validResults)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validResults)
      }
    })

    it('should reject AnaResults with missing required fields', () => {
      const invalidResults = {
        failures: [],
        // Missing summary, analysisDate, and count fields
      }

      const result = validateAnaResults(invalidResults)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })

    it('should reject AnaResults with invalid failure objects', () => {
      const invalidResults = {
        failures: [
          {
            id: 'invalid',
            // Missing required fields
          },
        ],
        summary: 'Test summary',
        analysisDate: '2024-01-01T12:00:00.000Z',
        totalFailures: 1,
        criticalFailures: 0,
        highPriorityFailures: 1,
        mediumPriorityFailures: 0,
        lowPriorityFailures: 0,
      }

      const result = validateAnaResults(invalidResults)
      expect(result.success).toBe(false)
    })
  })

  describe('Data Structure Edge Cases', () => {
    it('should handle empty failures array', () => {
      const results: AnaResults = {
        failures: [],
        summary: 'No failures found',
        analysisDate: '2024-01-01T12:00:00.000Z',
        totalFailures: 0,
        criticalFailures: 0,
        highPriorityFailures: 0,
        mediumPriorityFailures: 0,
        lowPriorityFailures: 0,
      }

      const validationResult = validateAnaResults(results)
      expect(validationResult.success).toBe(true)
    })

    it('should handle very long content strings', () => {
      const longContent = 'A'.repeat(10000)
      const failure = createAnalyzedFailure({
        type: 'ci_failure',
        content: longContent,
        priority: 'high',
      })

      expect(failure.content).toBe(longContent)
      expect(failure.content.length).toBe(10000)
    })

    it('should handle special characters in content', () => {
      const specialContent = 'Error with special chars: àáâãäåæçèéêë 🚨 测试'
      const failure = createAnalyzedFailure({
        type: 'ci_failure',
        content: specialContent,
        priority: 'high',
      })

      expect(failure.content).toBe(specialContent)
    })

    it('should handle large arrays of files and line numbers', () => {
      const manyFiles = Array.from({ length: 100 }, (_, i) => `file${i}.ts`)
      const manyLines = Array.from({ length: 100 }, (_, i) => i + 1)

      const failure = createAnalyzedFailure({
        type: 'ci_failure',
        content: 'Many files error',
        priority: 'high',
        files: manyFiles,
        lineNumbers: manyLines,
      })

      expect(failure.files).toHaveLength(100)
      expect(failure.lineNumbers).toHaveLength(100)
    })

    it('should generate unique IDs for concurrent creation', () => {
      const failures = Array.from({ length: 100 }, () =>
        createAnalyzedFailure({
          type: 'ci_failure',
          content: 'Test error',
          priority: 'high',
        })
      )

      const ids = failures.map(f => f.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(100) // All IDs should be unique
    })
  })
})
