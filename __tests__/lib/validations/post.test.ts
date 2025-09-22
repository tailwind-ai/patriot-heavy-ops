import { postPatchSchema } from '@/lib/validations/post'

describe('Post Validation Schemas', () => {
  describe('postPatchSchema', () => {
    it('should validate complete valid post patch data', () => {
      const validData = {
        title: 'Updated Post Title',
        content: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'This is updated content'
              }
            }
          ]
        }
      }

      const result = postPatchSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should validate partial updates (all fields optional)', () => {
      const partialUpdates = [
        {},
        { title: 'New Title' },
        { content: { blocks: [] } },
        { title: 'Title Only' },
        { content: 'Simple string content' }
      ]

      partialUpdates.forEach(data => {
        const result = postPatchSchema.safeParse(data)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(data)
        }
      })
    })

    describe('title validation', () => {
      it('should accept valid titles', () => {
        const validTitles = [
          'ABC', // Minimum length (3 characters)
          'Short Title',
          'Medium Length Post Title Here',
          'A'.repeat(128) // Maximum length
        ]

        validTitles.forEach(title => {
          const result = postPatchSchema.safeParse({ title })
          expect(result.success).toBe(true)
          if (result.success) {
            expect(result.data.title).toBe(title)
          }
        })
      })

      it('should reject titles that are too short', () => {
        const shortTitles = ['', 'A', 'AB']

        shortTitles.forEach(title => {
          const result = postPatchSchema.safeParse({ title })
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues[0].path).toEqual(['title'])
          }
        })
      })

      it('should reject titles that are too long', () => {
        const longTitle = 'A'.repeat(129) // Exceeds maximum length
        
        const result = postPatchSchema.safeParse({ title: longTitle })
        
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].path).toEqual(['title'])
        }
      })

      it('should reject non-string title values', () => {
        const invalidValues = [123, null, [], {}]

        invalidValues.forEach(title => {
          const result = postPatchSchema.safeParse({ title })
          expect(result.success).toBe(false)
        })
      })
    })

    describe('content validation', () => {
      it('should accept any content type (z.any())', () => {
        const validContentTypes = [
          null,
          undefined,
          '',
          'Simple string content',
          123,
          true,
          [],
          {},
          {
            blocks: [
              {
                type: 'paragraph',
                data: { text: 'Editor.js content' }
              }
            ]
          },
          {
            version: '2.22.2',
            time: 1629876543210,
            blocks: [
              {
                id: 'abc123',
                type: 'header',
                data: {
                  text: 'Main Header',
                  level: 1
                }
              },
              {
                id: 'def456',
                type: 'paragraph',
                data: {
                  text: 'This is a paragraph with <b>bold</b> text.'
                }
              },
              {
                id: 'ghi789',
                type: 'list',
                data: {
                  style: 'unordered',
                  items: ['First item', 'Second item', 'Third item']
                }
              }
            ]
          }
        ]

        validContentTypes.forEach(content => {
          const result = postPatchSchema.safeParse({ content })
          expect(result.success).toBe(true)
          if (result.success) {
            expect(result.data.content).toEqual(content)
          }
        })
      })

      it('should handle complex Editor.js content structures', () => {
        const complexContent = {
          version: '2.22.2',
          time: 1629876543210,
          blocks: [
            {
              id: 'header-block',
              type: 'header',
              data: {
                text: 'Article Title',
                level: 1
              }
            },
            {
              id: 'paragraph-block',
              type: 'paragraph',
              data: {
                text: 'This is the introduction paragraph with some <mark>highlighted</mark> text.'
              }
            },
            {
              id: 'image-block',
              type: 'image',
              data: {
                file: {
                  url: 'https://example.com/image.jpg'
                },
                caption: 'Example image caption',
                withBorder: false,
                stretched: false,
                withBackground: false
              }
            },
            {
              id: 'list-block',
              type: 'list',
              data: {
                style: 'ordered',
                items: [
                  'First numbered item',
                  'Second numbered item with <b>bold</b> text',
                  'Third item'
                ]
              }
            },
            {
              id: 'quote-block',
              type: 'quote',
              data: {
                text: 'This is a quote block',
                caption: 'Quote Author',
                alignment: 'left'
              }
            },
            {
              id: 'code-block',
              type: 'code',
              data: {
                code: 'console.log("Hello, World!");'
              }
            }
          ]
        }

        const result = postPatchSchema.safeParse({ content: complexContent })
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.content).toEqual(complexContent)
        }
      })
    })

    describe('edge cases', () => {
      it('should handle empty object', () => {
        const result = postPatchSchema.safeParse({})
        
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual({})
        }
      })

      it('should handle undefined values correctly', () => {
        const dataWithUndefined = {
          title: undefined,
          content: undefined
        }

        const result = postPatchSchema.safeParse(dataWithUndefined)
        expect(result.success).toBe(true)
        if (result.success) {
          // Undefined optional fields should not appear in parsed data
          expect(result.data).toEqual({})
        }
      })

      it('should handle mixed valid and invalid fields', () => {
        const mixedData = {
          title: 'AB', // Too short
          content: { valid: 'content' } // Valid (any type allowed)
        }

        const result = postPatchSchema.safeParse(mixedData)
        expect(result.success).toBe(false)
        if (!result.success) {
          // Should have error for title only
          expect(result.error.issues).toHaveLength(1)
          expect(result.error.issues[0].path).toEqual(['title'])
        }
      })

      it('should preserve content structure exactly', () => {
        const contentWithSpecialStructure = {
          nested: {
            deeply: {
              structured: {
                content: 'value',
                array: [1, 2, { inner: 'object' }],
                boolean: true,
                null_value: null
              }
            }
          }
        }

        const result = postPatchSchema.safeParse({ content: contentWithSpecialStructure })
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.content).toEqual(contentWithSpecialStructure)
        }
      })
    })

    describe('type safety', () => {
      it('should accept various data types for content field', () => {
        const dataTypes = [
          { content: 'string' },
          { content: 42 },
          { content: true },
          { content: false },
          { content: null },
          { content: [] },
          { content: {} },
          { content: { complex: { nested: 'object' } } }
        ]

        dataTypes.forEach(data => {
          const result = postPatchSchema.safeParse(data)
          expect(result.success).toBe(true)
        })
      })

      it('should reject invalid title types', () => {
        const invalidTitleTypes = [
          { title: 123 },
          { title: true },
          { title: [] },
          { title: {} },
          { title: null }
        ]

        invalidTitleTypes.forEach(data => {
          const result = postPatchSchema.safeParse(data)
          expect(result.success).toBe(false)
        })
      })
    })

    describe('real-world scenarios', () => {
      it('should handle typical blog post update', () => {
        const blogPostUpdate = {
          title: 'How to Build Better Web Applications',
          content: {
            version: '2.22.2',
            time: Date.now(),
            blocks: [
              {
                type: 'header',
                data: { text: 'Introduction', level: 2 }
              },
              {
                type: 'paragraph',
                data: { text: 'Building web applications requires careful consideration of many factors...' }
              }
            ]
          }
        }

        const result = postPatchSchema.safeParse(blogPostUpdate)
        expect(result.success).toBe(true)
      })

      it('should handle title-only update', () => {
        const titleOnlyUpdate = {
          title: 'Updated Article Title'
        }

        const result = postPatchSchema.safeParse(titleOnlyUpdate)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(titleOnlyUpdate)
        }
      })

      it('should handle content-only update', () => {
        const contentOnlyUpdate = {
          content: {
            blocks: [
              {
                type: 'paragraph',
                data: { text: 'Updated content without changing title' }
              }
            ]
          }
        }

        const result = postPatchSchema.safeParse(contentOnlyUpdate)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(contentOnlyUpdate)
        }
      })
    })
  })
})
