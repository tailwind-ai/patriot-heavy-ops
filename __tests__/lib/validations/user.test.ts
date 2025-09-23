import { userNameSchema, operatorApplicationSchema, userUpdateSchema } from '@/lib/validations/user'

describe('User Validation Schemas', () => {
  describe('userNameSchema', () => {
    it('should validate valid names', () => {
      const validNames = [
        'John',
        'Jane Doe',
        'Mike Johnson',
        'A'.repeat(32), // Maximum length
        'Bob' // Minimum valid length
      ]

      validNames.forEach(name => {
        const result = userNameSchema.safeParse({ name })
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.name).toBe(name)
        }
      })
    })

    it('should reject names that are too short', () => {
      const shortNames = ['', 'A', 'AB']

      shortNames.forEach(name => {
        const result = userNameSchema.safeParse({ name })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0]?.path).toEqual(['name'])
        }
      })
    })

    it('should reject names that are too long', () => {
      const longName = 'A'.repeat(33) // Exceeds maximum length
      
      const result = userNameSchema.safeParse({ name: longName })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(['name'])
      }
    })

    it('should reject missing name field', () => {
      const result = userNameSchema.safeParse({})
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(['name'])
      }
    })

    it('should reject non-string name values', () => {
      const invalidValues = [123, null, undefined, [], {}]

      invalidValues.forEach(name => {
        const result = userNameSchema.safeParse({ name })
        expect(result.success).toBe(false)
      })
    })
  })

  describe('operatorApplicationSchema', () => {
    it('should validate valid location', () => {
      const validLocations = [
        'Austin, TX',
        'Dallas, Texas, USA',
        'Houston, TX 77001',
        'San Antonio, TX, United States',
        '123 Main St, Austin, TX 78701'
      ]

      validLocations.forEach(location => {
        const result = operatorApplicationSchema.safeParse({ location })
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.location).toBe(location)
        }
      })
    })

    it('should reject empty location', () => {
      const result = operatorApplicationSchema.safeParse({ location: '' })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Please select a location')
        expect(result.error.issues[0]?.path).toEqual(['location'])
      }
    })

    it('should reject missing location field', () => {
      const result = operatorApplicationSchema.safeParse({})
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(['location'])
      }
    })

    it('should reject non-string location values', () => {
      const invalidValues = [123, null, undefined, [], {}]

      invalidValues.forEach(location => {
        const result = operatorApplicationSchema.safeParse({ location })
        expect(result.success).toBe(false)
      })
    })
  })

  describe('userUpdateSchema', () => {
    const validUpdateData = {
      name: 'Updated Name',
      phone: '1234567890',
      company: 'Test Company',
      role: 'OPERATOR' as const
    }

    it('should validate complete valid update data', () => {
      const result = userUpdateSchema.safeParse(validUpdateData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validUpdateData)
      }
    })

    it('should validate partial update data (all fields optional)', () => {
      const partialUpdates = [
        { name: 'New Name' },
        { phone: '9876543210' },
        { company: 'New Company' },
        { role: 'ADMIN' as const },
        { name: 'Test', phone: '1111111111' },
        {}
      ]

      partialUpdates.forEach(data => {
        const result = userUpdateSchema.safeParse(data)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(data)
        }
      })
    })

    describe('name validation', () => {
      it('should accept valid names', () => {
        const validNames = ['A', 'John Doe', 'A'.repeat(100)]

        validNames.forEach(name => {
          const result = userUpdateSchema.safeParse({ name })
          expect(result.success).toBe(true)
        })
      })

      it('should reject empty name', () => {
        const result = userUpdateSchema.safeParse({ name: '' })
        
        expect(result.success).toBe(false)
      })

      it('should reject name exceeding 100 characters', () => {
        const longName = 'A'.repeat(101)
        const result = userUpdateSchema.safeParse({ name: longName })
        
        expect(result.success).toBe(false)
      })
    })

    describe('phone validation', () => {
      it('should accept valid phone numbers', () => {
        const validPhones = [
          '1234567890',
          '+1-555-123-4567',
          '(555) 123-4567',
          '555.123.4567',
          '12345678901234567890' // 20 characters (max)
        ]

        validPhones.forEach(phone => {
          const result = userUpdateSchema.safeParse({ phone })
          expect(result.success).toBe(true)
        })
      })

      it('should reject phone numbers that are too short', () => {
        const shortPhones = ['', '123', '123456789']

        shortPhones.forEach(phone => {
          const result = userUpdateSchema.safeParse({ phone })
          expect(result.success).toBe(false)
        })
      })

      it('should reject phone numbers that are too long', () => {
        const longPhone = '1'.repeat(21)
        const result = userUpdateSchema.safeParse({ phone: longPhone })
        
        expect(result.success).toBe(false)
      })
    })

    describe('company validation', () => {
      it('should accept valid company names', () => {
        const validCompanies = [
          'A',
          'Acme Corp',
          'Very Long Company Name Inc.',
          'A'.repeat(100) // Maximum length
        ]

        validCompanies.forEach(company => {
          const result = userUpdateSchema.safeParse({ company })
          expect(result.success).toBe(true)
        })
      })

      it('should reject empty company name', () => {
        const result = userUpdateSchema.safeParse({ company: '' })
        
        expect(result.success).toBe(false)
      })

      it('should reject company name exceeding 100 characters', () => {
        const longCompany = 'A'.repeat(101)
        const result = userUpdateSchema.safeParse({ company: longCompany })
        
        expect(result.success).toBe(false)
      })
    })

    describe('role validation', () => {
      it('should accept valid roles', () => {
        const validRoles = ['USER', 'OPERATOR', 'MANAGER', 'ADMIN'] as const

        validRoles.forEach(role => {
          const result = userUpdateSchema.safeParse({ role })
          expect(result.success).toBe(true)
          if (result.success) {
            expect(result.data.role).toBe(role)
          }
        })
      })

      it('should reject invalid roles', () => {
        const invalidRoles = ['INVALID', 'user', 'admin', 'SUPER_ADMIN', '']

        invalidRoles.forEach(role => {
          const result = userUpdateSchema.safeParse({ role })
          expect(result.success).toBe(false)
        })
      })
    })

    describe('type safety', () => {
      it('should reject non-string values for string fields', () => {
        const invalidData = [
          { name: 123 },
          { phone: true },
          { company: [] },
          { name: null },
          { phone: {} }
        ]

        invalidData.forEach(data => {
          const result = userUpdateSchema.safeParse(data)
          expect(result.success).toBe(false)
        })
      })
    })

    describe('edge cases', () => {
      it('should handle undefined values correctly', () => {
        const dataWithUndefined = {
          name: undefined,
          phone: undefined,
          company: undefined,
          role: undefined
        }

        const result = userUpdateSchema.safeParse(dataWithUndefined)
        expect(result.success).toBe(true)
        if (result.success) {
          // Undefined optional fields should not appear in parsed data
          expect(result.data).toEqual({})
        }
      })

      it('should handle mixed valid and invalid fields', () => {
        const mixedData = {
          name: 'Valid Name',
          phone: '123', // Too short
          company: 'Valid Company',
          role: 'INVALID_ROLE'
        }

        const result = userUpdateSchema.safeParse(mixedData)
        expect(result.success).toBe(false)
        if (!result.success) {
          // Should have errors for both phone and role
          const errorPaths = result.error.issues.map(issue => issue.path[0])
          expect(errorPaths).toContain('phone')
          expect(errorPaths).toContain('role')
        }
      })
    })
  })
})
