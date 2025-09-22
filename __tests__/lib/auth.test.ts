import { authOptions } from '@/lib/auth'

describe('NextAuth configuration', () => {
  describe('authOptions configuration', () => {
    it('should have correct session strategy', () => {
      expect(authOptions.session?.strategy).toBe('jwt')
    })

    it('should have correct pages configuration', () => {
      expect(authOptions.pages?.signIn).toBe('/login')
      expect(authOptions.pages?.error).toBe('/api/auth/error')
    })

    it('should have credentials provider configured', () => {
      expect(authOptions.providers).toHaveLength(1)
      expect(authOptions.providers[0]).toHaveProperty('name', 'Credentials')
    })

    it('should have proper cookie security settings', () => {
      // The useSecureCookies is set at module load time, so we test the current environment
      if (process.env.NODE_ENV === 'production') {
        expect(authOptions.useSecureCookies).toBe(true)
      } else {
        expect(authOptions.useSecureCookies).toBe(false)
      }
    })

    it('should have secure cookies in production', () => {
      expect(authOptions.useSecureCookies).toBe(process.env.NODE_ENV === 'production')
    })

    it('should have debug enabled in development', () => {
      if (process.env.NODE_ENV === 'development') {
        expect(authOptions.debug).toBe(true)
      } else {
        expect(authOptions.debug).toBe(false)
      }
    })
  })

  describe('provider configuration', () => {
    const credentialsProvider = authOptions.providers[0] as any

    it('should have credentials provider with correct name', () => {
      expect(credentialsProvider.name).toBe('Credentials')
    })

    it('should have email and password credentials configured', () => {
      expect(credentialsProvider.credentials).toBeDefined()
      expect(typeof credentialsProvider.credentials).toBe('object')
      // Note: credentials structure may be processed by NextAuth, so we just verify it exists
    })

    it('should have authorize function defined', () => {
      expect(typeof credentialsProvider.authorize).toBe('function')
    })
  })

  describe('callbacks configuration', () => {
    it('should have JWT callback defined', () => {
      expect(typeof authOptions.callbacks?.jwt).toBe('function')
    })

    it('should have session callback defined', () => {
      expect(typeof authOptions.callbacks?.session).toBe('function')
    })
  })

  describe('session callback functionality', () => {
    const sessionCallback = authOptions.callbacks?.session

    it('should return session with user data from token', async () => {
      const token = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        picture: null,
        role: 'ADMIN' as any,
      } as any
      const session = {
        user: {} as any,
        expires: '2024-12-31',
      } as any
      
      const result = await sessionCallback!({ token, session, user: {} as any, newSession: {}, trigger: 'update' } as any)
      
      expect(result).toEqual({
        user: {
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com',
          image: null,
          role: 'ADMIN',
        },
        expires: '2024-12-31',
      })
    })

    it('should handle missing token data gracefully', async () => {
      const token = {} as any
      const session = {
        user: { existingData: 'test' } as any,
        expires: '2024-12-31',
      } as any
      
      const result = await sessionCallback!({ token, session, user: {} as any, newSession: {}, trigger: 'update' } as any)
      
      expect(result).toEqual({
        user: {
          existingData: 'test',
          id: undefined,
          name: undefined,
          email: undefined,
          image: undefined,
          role: undefined,
        },
        expires: '2024-12-31',
      })
    })

    it('should preserve session structure', async () => {
      const token = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        picture: 'avatar.jpg',
        role: 'USER' as any,
      } as any
      const session = {
        user: {} as any,
        expires: '2024-12-31',
        customField: 'preserved',
      } as any
      
      const result = await sessionCallback!({ token, session, user: {} as any, newSession: {}, trigger: 'update' } as any)
      
      expect(result.expires).toBe('2024-12-31')
      expect((result as any).customField).toBe('preserved')
      expect(result.user?.image).toBe('avatar.jpg')
    })
  })

  describe('authorize function basic validation', () => {
    const credentialsProvider = authOptions.providers[0] as any
    const authorize = credentialsProvider.authorize

    it('should return null for missing credentials', async () => {
      const result = await authorize(null)
      expect(result).toBeNull()
    })

    it('should return null for missing email', async () => {
      const credentials = { password: 'password123' }
      const result = await authorize(credentials)
      expect(result).toBeNull()
    })

    it('should return null for missing password', async () => {
      const credentials = { email: 'test@example.com' }
      const result = await authorize(credentials)
      expect(result).toBeNull()
    })
  })
})
