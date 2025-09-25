import { userAuthSchema, userRegisterSchema, userLoginSchema } from '@/lib/validations/auth'

describe('auth validations', () => {
  describe('userAuthSchema', () => {
    it('should validate valid email', () => {
      const validData = { email: 'test@example.com' }
      
      const result = userAuthSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
      }
    })

    it('should reject invalid email format', () => {
      const invalidEmails = [
        'invalid-email',
        'test@',
        '@example.com',
        'test.example.com',
        'test@.com',
        'test@example.',
        ''
      ]
      
      invalidEmails.forEach(email => {
        const result = userAuthSchema.safeParse({ email })
        expect(result.success).toBe(false)
      })
    })

    it('should reject missing email', () => {
      const result = userAuthSchema.safeParse({})
      
      expect(result.success).toBe(false)
    })
  })

  describe('userLoginSchema', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'anypassword'
      }
      
      const result = userLoginSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
        expect(result.data.password).toBe('anypassword')
      }
    })

    it('should reject invalid email in login', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'anypassword'
      }
      
      const result = userLoginSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
    })

    it('should reject empty password in login', () => {
      const invalidData = {
        email: 'test@example.com',
        password: ''
      }
      
      const result = userLoginSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
    })

    it('should reject missing fields in login', () => {
      const missingEmail = { password: 'password' }
      const missingPassword = { email: 'test@example.com' }
      
      expect(userLoginSchema.safeParse(missingEmail).success).toBe(false)
      expect(userLoginSchema.safeParse(missingPassword).success).toBe(false)
    })
  })

  describe('userRegisterSchema', () => {
    const validRegisterData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'MyStr0ng!P@ssw0rd',
      confirmPassword: 'MyStr0ng!P@ssw0rd'
    }

    it('should validate valid registration data', () => {
      const result = userRegisterSchema.safeParse(validRegisterData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('John Doe')
        expect(result.data.email).toBe('john@example.com')
        expect(result.data.password).toBe('MyStr0ng!P@ssw0rd')
        expect(result.data.confirmPassword).toBe('MyStr0ng!P@ssw0rd')
      }
    })

    describe('name validation', () => {
      it('should reject name shorter than 2 characters', () => {
        const invalidData = { ...validRegisterData, name: 'J' }
        
        const result = userRegisterSchema.safeParse(invalidData)
        
        expect(result.success).toBe(false)
      })

      it('should accept name with 2 characters', () => {
        const validData = { ...validRegisterData, name: 'Jo' }
        
        const result = userRegisterSchema.safeParse(validData)
        
        expect(result.success).toBe(true)
      })

      it('should reject missing name', () => {
        const { name, ...dataWithoutName } = validRegisterData
        void name // Suppress unused variable warning
        
        const result = userRegisterSchema.safeParse(dataWithoutName)
        
        expect(result.success).toBe(false)
      })
    })

    describe('password validation', () => {
      it('should reject password shorter than 12 characters', () => {
        const shortPassword = 'Short1!'
        const invalidData = {
          ...validRegisterData,
          password: shortPassword,
          confirmPassword: shortPassword
        }
        
        const result = userRegisterSchema.safeParse(invalidData)
        
        expect(result.success).toBe(false)
      })

      it('should reject password without uppercase letter', () => {
        const noUppercase = 'lowercase123!@#'
        const invalidData = {
          ...validRegisterData,
          password: noUppercase,
          confirmPassword: noUppercase
        }
        
        const result = userRegisterSchema.safeParse(invalidData)
        
        expect(result.success).toBe(false)
      })

      it('should reject password without lowercase letter', () => {
        const noLowercase = 'UPPERCASE123!@#'
        const invalidData = {
          ...validRegisterData,
          password: noLowercase,
          confirmPassword: noLowercase
        }
        
        const result = userRegisterSchema.safeParse(invalidData)
        
        expect(result.success).toBe(false)
      })

      it('should reject password without number', () => {
        const noNumber = 'NoNumbersHere!@#'
        const invalidData = {
          ...validRegisterData,
          password: noNumber,
          confirmPassword: noNumber
        }
        
        const result = userRegisterSchema.safeParse(invalidData)
        
        expect(result.success).toBe(false)
      })

      it('should reject password without special character', () => {
        const noSpecial = 'NoSpecialChars123'
        const invalidData = {
          ...validRegisterData,
          password: noSpecial,
          confirmPassword: noSpecial
        }
        
        const result = userRegisterSchema.safeParse(invalidData)
        
        expect(result.success).toBe(false)
      })

      it('should reject password with common words', () => {
        const commonPasswords = [
          'MyPassword123!',
          'AdminUser123!',
          'Welcome123!@#',
          'Qwerty123!@#'
        ]
        
        commonPasswords.forEach(password => {
          const invalidData = {
            ...validRegisterData,
            password,
            confirmPassword: password
          }
          
          const result = userRegisterSchema.safeParse(invalidData)
          expect(result.success).toBe(false)
        })
      })

      it('should reject password with keyboard patterns', () => {
        const keyboardPasswords = [
          'Qwerty123!@#',
          'Asdf123!@#',
          'Zxcv123!@#',
          'Abcdef123!@#'
        ]
        
        keyboardPasswords.forEach(password => {
          const invalidData = {
            ...validRegisterData,
            password,
            confirmPassword: password
          }
          
          const result = userRegisterSchema.safeParse(invalidData)
          expect(result.success).toBe(false)
        })
      })

      it('should reject password with repeated characters', () => {
        const repeatedPassword = 'Aaabbb123!@#'  // 3+ repeated characters
        const invalidData = {
          ...validRegisterData,
          password: repeatedPassword,
          confirmPassword: repeatedPassword
        }
        
        const result = userRegisterSchema.safeParse(invalidData)
        
        expect(result.success).toBe(false)
      })

      it('should accept strong password meeting all criteria', () => {
        const strongPasswords = [
          'MyStr0ng!P@ssw0rd',
          'C0mplex#Security$',
          'Ungu3ss@ble&P@ss'
        ]
        
        strongPasswords.forEach(password => {
          const validData = {
            ...validRegisterData,
            password,
            confirmPassword: password
          }
          
          const result = userRegisterSchema.safeParse(validData)
          expect(result.success).toBe(true)
        })
      })
    })

    describe('password confirmation', () => {
      it('should reject when passwords do not match', () => {
        const invalidData = {
          ...validRegisterData,
          password: 'MyStr0ng!P@ssw0rd',
          confirmPassword: 'Diff3rent!P@ssw0rd'
        }
        
        const result = userRegisterSchema.safeParse(invalidData)
        
        expect(result.success).toBe(false)
        if (!result.success) {
          const confirmPasswordError = result.error.errors.find(
            error => error.path.includes('confirmPassword')
          )
          expect(confirmPasswordError).toBeDefined()
          expect(confirmPasswordError?.message).toBe("Passwords don't match")
        }
      })

      it('should accept when passwords match exactly', () => {
        const result = userRegisterSchema.safeParse(validRegisterData)
        
        expect(result.success).toBe(true)
      })
    })

    describe('email validation in registration', () => {
      it('should reject invalid email formats', () => {
        const invalidEmails = [
          'invalid-email',
          'test@',
          '@example.com',
          'test.example.com'
        ]
        
        invalidEmails.forEach(email => {
          const invalidData = { ...validRegisterData, email }
          const result = userRegisterSchema.safeParse(invalidData)
          expect(result.success).toBe(false)
        })
      })

      it('should accept valid email formats', () => {
        const validEmails = [
          'test@example.com',
          'user.name@domain.co.uk',
          'test+tag@example.org',
          'user123@test-domain.com'
        ]
        
        validEmails.forEach(email => {
          const validData = { ...validRegisterData, email }
          const result = userRegisterSchema.safeParse(validData)
          expect(result.success).toBe(true)
        })
      })
    })

    describe('complete validation scenarios', () => {
      it('should provide detailed error messages for multiple validation failures', () => {
        const invalidData = {
          name: 'J',
          email: 'invalid-email',
          password: 'weak',
          confirmPassword: 'different'
        }
        
        const result = userRegisterSchema.safeParse(invalidData)
        
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.errors.length).toBeGreaterThan(1)
        }
      })

      it('should handle missing required fields', () => {
        const result = userRegisterSchema.safeParse({})
        
        expect(result.success).toBe(false)
        if (!result.success) {
          const errorPaths = result.error.errors.map(error => error.path[0])
          expect(errorPaths).toContain('name')
          expect(errorPaths).toContain('email')
          expect(errorPaths).toContain('password')
        }
      })
    })
  })
})
