import { hashPassword, verifyPassword } from '@/lib/auth-utils'

describe('auth-utils', () => {
  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'testPassword123!'
      const hash = await hashPassword(password)
      
      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(50) // bcrypt hashes are typically 60 chars
    })

    it('should generate different hashes for the same password (salt randomization)', async () => {
      const password = 'testPassword123!'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)
      
      expect(hash1).not.toBe(hash2)
      expect(hash1).toBeDefined()
      expect(hash2).toBeDefined()
    })

    it('should handle empty password', async () => {
      const hash = await hashPassword('')
      
      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
    })

    it('should handle very long passwords', async () => {
      const longPassword = 'a'.repeat(1000)
      const hash = await hashPassword(longPassword)
      
      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
    })

    it('should handle special characters in password', async () => {
      const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const hash = await hashPassword(specialPassword)
      
      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
    })
  })

  describe('verifyPassword', () => {
    it('should verify correct password against hash', async () => {
      const password = 'testPassword123!'
      const hash = await hashPassword(password)
      
      const isValid = await verifyPassword(password, hash)
      
      expect(isValid).toBe(true)
    })

    it('should reject incorrect password against hash', async () => {
      const password = 'testPassword123!'
      const wrongPassword = 'wrongPassword456!'
      const hash = await hashPassword(password)
      
      const isValid = await verifyPassword(wrongPassword, hash)
      
      expect(isValid).toBe(false)
    })

    it('should reject empty password against valid hash', async () => {
      const password = 'testPassword123!'
      const hash = await hashPassword(password)
      
      const isValid = await verifyPassword('', hash)
      
      expect(isValid).toBe(false)
    })

    it('should reject password against empty hash', async () => {
      const password = 'testPassword123!'
      
      const isValid = await verifyPassword(password, '')
      
      expect(isValid).toBe(false)
    })

    it('should reject password against invalid hash format', async () => {
      const password = 'testPassword123!'
      const invalidHash = 'not-a-valid-hash'
      
      const isValid = await verifyPassword(password, invalidHash)
      
      expect(isValid).toBe(false)
    })

    it('should handle case sensitivity correctly', async () => {
      const password = 'TestPassword123!'
      const hash = await hashPassword(password)
      
      const isValidSame = await verifyPassword('TestPassword123!', hash)
      const isValidDifferentCase = await verifyPassword('testpassword123!', hash)
      
      expect(isValidSame).toBe(true)
      expect(isValidDifferentCase).toBe(false)
    })

    it('should handle unicode characters', async () => {
      const password = 'test密码123!🔒'
      const hash = await hashPassword(password)
      
      const isValid = await verifyPassword(password, hash)
      
      expect(isValid).toBe(true)
    })
  })

  describe('integration tests', () => {
    it('should maintain consistency across multiple hash/verify cycles', async () => {
      const passwords = [
        'simple123',
        'Complex!Password@2023',
        '🚀🔐SecurePass!',
        'a'.repeat(100)
      ]
      
      for (const password of passwords) {
        const hash = await hashPassword(password)
        const isValid = await verifyPassword(password, hash)
        
        expect(isValid).toBe(true)
      }
    })

    it('should reject cross-password verification', async () => {
      const password1 = 'password1'
      const password2 = 'password2'
      
      const hash1 = await hashPassword(password1)
      const hash2 = await hashPassword(password2)
      
      expect(await verifyPassword(password1, hash2)).toBe(false)
      expect(await verifyPassword(password2, hash1)).toBe(false)
    })
  })
})
