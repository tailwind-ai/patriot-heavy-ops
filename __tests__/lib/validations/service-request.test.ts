import {
  serviceRequestSchema,
  serviceRequestUpdateSchema,
  statusChangeSchema,
  calculateTotalHours,
  getDurationDisplayText,
  equipmentCategories,
  transportOptions,
  durationTypes,
  rateTypes,
  serviceRequestStatuses
} from '@/lib/validations/service-request'

describe('Service Request Validation Schemas', () => {
  const validServiceRequestData = {
    title: 'Excavation Project',
    description: 'Need excavation work for foundation',
    contactName: 'John Doe',
    contactEmail: 'john@example.com',
    contactPhone: '1234567890',
    company: 'Acme Construction',
    jobSite: '123 Main St, Austin, TX 78701',
    transport: 'WE_HANDLE_IT' as const,
    startDate: '2024-01-15',
    endDate: '2024-01-16',
    equipmentCategory: 'BACKHOES_EXCAVATORS' as const,
    equipmentDetail: 'Need 20-ton excavator with operator',
    requestedDurationType: 'FULL_DAY' as const,
    requestedDurationValue: 2,
    requestedTotalHours: 16,
    rateType: 'DAILY' as const,
    baseRate: 500
  }

  describe('serviceRequestSchema', () => {
    it('should validate complete valid service request data', () => {
      const result = serviceRequestSchema.safeParse(validServiceRequestData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validServiceRequestData)
      }
    })

    describe('title validation', () => {
      it('should accept valid titles', () => {
        const validTitles = [
          'A',
          'Short Title',
          'Very Long Title That Describes The Project In Detail',
          'A'.repeat(200) // Maximum length
        ]

        validTitles.forEach(title => {
          const data = { ...validServiceRequestData, title }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(true)
        })
      })

      it('should reject empty title', () => {
        const data = { ...validServiceRequestData, title: '' }
        const result = serviceRequestSchema.safeParse(data)
        
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Title is required')
        }
      })

      it('should reject title exceeding 200 characters', () => {
        const data = { ...validServiceRequestData, title: 'A'.repeat(201) }
        const result = serviceRequestSchema.safeParse(data)
        
        expect(result.success).toBe(false)
      })
    })

    describe('description validation', () => {
      it('should accept valid descriptions', () => {
        const validDescriptions = [
          undefined,
          '',
          'Short description',
          'A'.repeat(1000) // Maximum length
        ]

        validDescriptions.forEach(description => {
          const data = { ...validServiceRequestData, description }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(true)
        })
      })

      it('should reject description exceeding 1000 characters', () => {
        const data = { ...validServiceRequestData, description: 'A'.repeat(1001) }
        const result = serviceRequestSchema.safeParse(data)
        
        expect(result.success).toBe(false)
      })
    })

    describe('contact information validation', () => {
      it('should validate contact name', () => {
        // Valid names
        const validNames = ['A', 'John Doe', 'A'.repeat(100)]
        validNames.forEach(contactName => {
          const data = { ...validServiceRequestData, contactName }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(true)
        })

        // Invalid names
        const data = { ...validServiceRequestData, contactName: '' }
        const result = serviceRequestSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Contact name is required')
        }
      })

      it('should validate contact email', () => {
        // Valid emails
        const validEmails = [
          'test@example.com',
          'user.name@domain.co.uk',
          'test+tag@example.org'
        ]
        validEmails.forEach(contactEmail => {
          const data = { ...validServiceRequestData, contactEmail }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(true)
        })

        // Invalid emails
        const invalidEmails = ['invalid-email', 'test@', '@example.com']
        invalidEmails.forEach(contactEmail => {
          const data = { ...validServiceRequestData, contactEmail }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues[0].message).toBe('Valid email is required')
          }
        })
      })

      it('should validate contact phone', () => {
        // Valid phones
        const validPhones = ['1234567890', '+1-555-123-4567', '12345678901234567890']
        validPhones.forEach(contactPhone => {
          const data = { ...validServiceRequestData, contactPhone }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(true)
        })

        // Invalid phones
        const invalidPhones = ['', '123', '123456789']
        invalidPhones.forEach(contactPhone => {
          const data = { ...validServiceRequestData, contactPhone }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues[0].message).toBe('Valid phone number is required')
          }
        })
      })

      it('should validate optional company field', () => {
        // Valid companies (including undefined)
        const validCompanies = [undefined, '', 'Acme Corp', 'A'.repeat(100)]
        validCompanies.forEach(company => {
          const data = { ...validServiceRequestData, company }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(true)
        })

        // Invalid company (too long)
        const data = { ...validServiceRequestData, company: 'A'.repeat(101) }
        const result = serviceRequestSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    describe('job details validation', () => {
      it('should validate job site', () => {
        // Valid job sites
        const validSites = ['A', '123 Main St, Austin, TX', 'A'.repeat(500)]
        validSites.forEach(jobSite => {
          const data = { ...validServiceRequestData, jobSite }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(true)
        })

        // Invalid job site
        const data = { ...validServiceRequestData, jobSite: '' }
        const result = serviceRequestSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Job site address is required')
        }
      })

      it('should validate transport options', () => {
        transportOptions.forEach(transport => {
          const data = { ...validServiceRequestData, transport }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(true)
        })

        // Invalid transport option
        const data = { ...validServiceRequestData, transport: 'INVALID' as any }
        const result = serviceRequestSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          // Zod generates default enum error message when invalid value provided
          expect(result.error.issues[0].message).toContain('Invalid enum value')
          expect(result.error.issues[0].path).toEqual(['transport'])
        }
      })

      it('should validate start date', () => {
        // Valid dates
        const validDates = ['2024-01-15', '2023-12-31', '2025-06-30']
        validDates.forEach(startDate => {
          const data = { ...validServiceRequestData, startDate }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(true)
        })

        // Invalid dates
        const invalidDates = ['invalid-date', '2024-13-01', '2024-01-32', '']
        invalidDates.forEach(startDate => {
          const data = { ...validServiceRequestData, startDate }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues[0].message).toBe('Valid start date is required')
          }
        })
      })

      it('should validate optional end date', () => {
        // Valid end dates (including undefined)
        const validDates = [undefined, '2024-01-16', '2024-12-31']
        validDates.forEach(endDate => {
          const data = { ...validServiceRequestData, endDate }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(true)
        })

        // Invalid end date
        const data = { ...validServiceRequestData, endDate: 'invalid-date' }
        const result = serviceRequestSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Valid end date required')
        }
      })
    })

    describe('equipment validation', () => {
      it('should validate equipment categories', () => {
        equipmentCategories.forEach(equipmentCategory => {
          const data = { ...validServiceRequestData, equipmentCategory }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(true)
        })

        // Invalid equipment category
        const data = { ...validServiceRequestData, equipmentCategory: 'INVALID' as any }
        const result = serviceRequestSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Invalid enum value')
          expect(result.error.issues[0].path).toEqual(['equipmentCategory'])
        }
      })

      it('should validate equipment detail', () => {
        // Valid details
        const validDetails = ['A', 'Need 20-ton excavator', 'A'.repeat(500)]
        validDetails.forEach(equipmentDetail => {
          const data = { ...validServiceRequestData, equipmentDetail }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(true)
        })

        // Invalid detail
        const data = { ...validServiceRequestData, equipmentDetail: '' }
        const result = serviceRequestSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Equipment details are required')
        }
      })
    })

    describe('duration and pricing validation', () => {
      it('should validate duration type', () => {
        durationTypes.forEach(requestedDurationType => {
          const data = { ...validServiceRequestData, requestedDurationType }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(true)
        })

        // Invalid duration type
        const data = { ...validServiceRequestData, requestedDurationType: 'INVALID' as any }
        const result = serviceRequestSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Invalid enum value')
          expect(result.error.issues[0].path).toEqual(['requestedDurationType'])
        }
      })

      it('should validate duration value', () => {
        // Valid values
        const validValues = [1, 2, 10, 100]
        validValues.forEach(requestedDurationValue => {
          const data = { ...validServiceRequestData, requestedDurationValue }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(true)
        })

        // Invalid values
        const invalidValues = [
          { value: 0, expectedMessage: 'Duration value must be positive' },
          { value: -1, expectedMessage: 'Duration value must be positive' },
          { value: 1.5, expectedMessage: 'Expected integer, received float' }
        ]
        invalidValues.forEach(({ value, expectedMessage }) => {
          const data = { ...validServiceRequestData, requestedDurationValue: value }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues[0].message).toBe(expectedMessage)
          }
        })
      })

      it('should validate total hours', () => {
        // Valid hours
        const validHours = [1, 8, 40, 100.5]
        validHours.forEach(requestedTotalHours => {
          const data = { ...validServiceRequestData, requestedTotalHours }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(true)
        })

        // Invalid hours
        const invalidHours = [0, -1]
        invalidHours.forEach(requestedTotalHours => {
          const data = { ...validServiceRequestData, requestedTotalHours }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues[0].message).toBe('Total hours must be positive')
          }
        })
      })

      it('should validate rate type', () => {
        rateTypes.forEach(rateType => {
          const data = { ...validServiceRequestData, rateType }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(true)
        })

        // Invalid rate type
        const data = { ...validServiceRequestData, rateType: 'INVALID' as any }
        const result = serviceRequestSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Invalid enum value')
          expect(result.error.issues[0].path).toEqual(['rateType'])
        }
      })

      it('should validate base rate', () => {
        // Valid rates
        const validRates = [1, 50, 500, 1000.50]
        validRates.forEach(baseRate => {
          const data = { ...validServiceRequestData, baseRate }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(true)
        })

        // Invalid rates
        const invalidRates = [0, -1]
        invalidRates.forEach(baseRate => {
          const data = { ...validServiceRequestData, baseRate }
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues[0].message).toBe('Base rate must be positive')
          }
        })
      })
    })

    describe('required fields validation', () => {
      it('should reject missing required fields', () => {
        const requiredFields = [
          'title', 'contactName', 'contactEmail', 'contactPhone',
          'jobSite', 'transport', 'startDate', 'equipmentCategory',
          'equipmentDetail', 'requestedDurationType', 'requestedDurationValue',
          'requestedTotalHours', 'rateType', 'baseRate'
        ]

        requiredFields.forEach(field => {
          const data = { ...validServiceRequestData }
          delete (data as any)[field]
          
          const result = serviceRequestSchema.safeParse(data)
          expect(result.success).toBe(false)
        })
      })
    })
  })

  describe('serviceRequestUpdateSchema', () => {
    it('should validate partial updates (all fields optional)', () => {
      const partialUpdates = [
        {},
        { title: 'Updated Title' },
        { description: 'Updated description' },
        { status: 'APPROVED' as const },
        { priority: 'HIGH' as const },
        { estimatedCost: 1000 },
        { title: 'New Title', status: 'UNDER_REVIEW' as const }
      ]

      partialUpdates.forEach(data => {
        const result = serviceRequestUpdateSchema.safeParse(data)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(data)
        }
      })
    })

    it('should validate status updates', () => {
      serviceRequestStatuses.forEach(status => {
        const result = serviceRequestUpdateSchema.safeParse({ status })
        expect(result.success).toBe(true)
      })

      // Invalid status
      const result = serviceRequestUpdateSchema.safeParse({ status: 'INVALID' as any })
      expect(result.success).toBe(false)
    })

    it('should validate priority updates', () => {
      const validPriorities = ['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const
      validPriorities.forEach(priority => {
        const result = serviceRequestUpdateSchema.safeParse({ priority })
        expect(result.success).toBe(true)
      })

      // Invalid priority
      const result = serviceRequestUpdateSchema.safeParse({ priority: 'INVALID' as any })
      expect(result.success).toBe(false)
    })

    it('should validate monetary fields', () => {
      const monetaryFields = ['estimatedCost', 'depositAmount', 'finalAmount']
      
      monetaryFields.forEach(field => {
        // Valid amounts
        const validAmounts = [0.01, 100, 1000.50]
        validAmounts.forEach(amount => {
          const result = serviceRequestUpdateSchema.safeParse({ [field]: amount })
          expect(result.success).toBe(true)
        })

        // Invalid amounts
        const invalidAmounts = [0, -1]
        invalidAmounts.forEach(amount => {
          const result = serviceRequestUpdateSchema.safeParse({ [field]: amount })
          expect(result.success).toBe(false)
        })
      })
    })
  })

  describe('statusChangeSchema', () => {
    const validStatusChange = {
      serviceRequestId: 'req_123',
      toStatus: 'APPROVED' as const,
      reason: 'Meets all requirements',
      notes: 'Approved by manager'
    }

    it('should validate complete status change', () => {
      const result = statusChangeSchema.safeParse(validStatusChange)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validStatusChange)
      }
    })

    it('should validate minimal status change', () => {
      const minimalChange = {
        serviceRequestId: 'req_123',
        toStatus: 'REJECTED' as const
      }

      const result = statusChangeSchema.safeParse(minimalChange)
      expect(result.success).toBe(true)
    })

    it('should reject missing required fields', () => {
      // Missing serviceRequestId
      const result1 = statusChangeSchema.safeParse({ toStatus: 'APPROVED' as const })
      expect(result1.success).toBe(false)

      // Missing toStatus
      const result2 = statusChangeSchema.safeParse({ serviceRequestId: 'req_123' })
      expect(result2.success).toBe(false)
    })

    it('should validate status transitions', () => {
      serviceRequestStatuses.forEach(status => {
        const result = statusChangeSchema.safeParse({
          serviceRequestId: 'req_123',
          toStatus: status
        })
        expect(result.success).toBe(true)
      })
    })
  })

  describe('helper functions', () => {
    describe('calculateTotalHours', () => {
      it('should calculate hours for HALF_DAY', () => {
        expect(calculateTotalHours('HALF_DAY', 1)).toBe(4)
        expect(calculateTotalHours('HALF_DAY', 2)).toBe(8)
        expect(calculateTotalHours('HALF_DAY', 3)).toBe(12)
      })

      it('should calculate hours for FULL_DAY', () => {
        expect(calculateTotalHours('FULL_DAY', 1)).toBe(8)
        expect(calculateTotalHours('FULL_DAY', 2)).toBe(16)
        expect(calculateTotalHours('FULL_DAY', 5)).toBe(40)
      })

      it('should calculate hours for MULTI_DAY', () => {
        expect(calculateTotalHours('MULTI_DAY', 1)).toBe(8)
        expect(calculateTotalHours('MULTI_DAY', 3)).toBe(24)
        expect(calculateTotalHours('MULTI_DAY', 7)).toBe(56)
      })

      it('should calculate hours for WEEKLY', () => {
        expect(calculateTotalHours('WEEKLY', 1)).toBe(40)
        expect(calculateTotalHours('WEEKLY', 2)).toBe(80)
        expect(calculateTotalHours('WEEKLY', 4)).toBe(160)
      })

      it('should return default for invalid duration type', () => {
        expect(calculateTotalHours('INVALID' as any, 1)).toBe(8)
      })
    })

    describe('getDurationDisplayText', () => {
      it('should format HALF_DAY display text', () => {
        expect(getDurationDisplayText('HALF_DAY', 1)).toBe('Half Day (4 hours)')
        expect(getDurationDisplayText('HALF_DAY', 2)).toBe('2 Half Days (8 hours)')
        expect(getDurationDisplayText('HALF_DAY', 3)).toBe('3 Half Days (12 hours)')
      })

      it('should format FULL_DAY display text', () => {
        expect(getDurationDisplayText('FULL_DAY', 1)).toBe('Full Day (8 hours)')
        expect(getDurationDisplayText('FULL_DAY', 2)).toBe('2 Full Days (16 hours)')
        expect(getDurationDisplayText('FULL_DAY', 5)).toBe('5 Full Days (40 hours)')
      })

      it('should format MULTI_DAY display text', () => {
        expect(getDurationDisplayText('MULTI_DAY', 1)).toBe('1 Days (8 hours)')
        expect(getDurationDisplayText('MULTI_DAY', 3)).toBe('3 Days (24 hours)')
        expect(getDurationDisplayText('MULTI_DAY', 7)).toBe('7 Days (56 hours)')
      })

      it('should format WEEKLY display text', () => {
        expect(getDurationDisplayText('WEEKLY', 1)).toBe('1 Week (40 hours)')
        expect(getDurationDisplayText('WEEKLY', 2)).toBe('2 Weeks (80 hours)')
        expect(getDurationDisplayText('WEEKLY', 4)).toBe('4 Weeks (160 hours)')
      })

      it('should handle invalid duration type', () => {
        expect(getDurationDisplayText('INVALID' as any, 1)).toBe('Unknown duration')
      })
    })
  })
})
