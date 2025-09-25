import { render, waitFor } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { signIn } from 'next-auth/react'
import { UserAuthForm } from '@/components/user-auth-form'

// Mock next-auth
jest.mock('next-auth/react')
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>

// Mock fetch for registration
global.fetch = jest.fn()
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

// Mock toast
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}))

import { toast } from '@/components/ui/use-toast'
const mockToast = toast as jest.MockedFunction<typeof toast>

describe('UserAuthForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
    mockToast.mockClear()
  })

  describe('Login Mode', () => {
    it('should render login form by default', () => {
      render(<UserAuthForm />)
      
      expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
      expect(screen.queryByPlaceholderText('Full name')).not.toBeInTheDocument()
      expect(screen.queryByPlaceholderText('Confirm password')).not.toBeInTheDocument()
    })

    it('should handle successful login', async () => {
      const user = userEvent.setup()
      mockSignIn.mockResolvedValue({ error: null } as any)
      
      render(<UserAuthForm mode="login" />)
      
      await user.type(screen.getByPlaceholderText('name@example.com'), 'test@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'password123')
      await user.click(screen.getByRole('button', { name: /sign in/i }))
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
          email: 'test@example.com',
          password: 'password123',
          redirect: true,
          callbackUrl: '/dashboard',
        })
      })
    })

    it('should handle login error', async () => {
      const user = userEvent.setup()
      mockSignIn.mockResolvedValue({ error: 'CredentialsSignin' } as any)
      
      render(<UserAuthForm mode="login" />)
      
      await user.type(screen.getByPlaceholderText('name@example.com'), 'test@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: /sign in/i }))
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Something went wrong.',
          description: 'Invalid email or password',
          variant: 'destructive',
        })
      })
    })

    it('should validate required fields in login', async () => {
      const user = userEvent.setup()
      
      render(<UserAuthForm mode="login" />)
      
      // Try to submit without filling fields
      await user.click(screen.getByRole('button', { name: /sign in/i }))
      
      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Invalid email')).toBeInTheDocument()
      })
      
      expect(mockSignIn).not.toHaveBeenCalled()
    })

    it('should validate email format in login', async () => {
      const user = userEvent.setup()
      
      render(<UserAuthForm mode="login" />)
      
      await user.type(screen.getByPlaceholderText('name@example.com'), 'invalid-email')
      await user.type(screen.getByPlaceholderText('Password'), 'password123')
      await user.click(screen.getByRole('button', { name: /sign in/i }))
      
      // The form validation prevents submission, so signIn should not be called
      expect(mockSignIn).not.toHaveBeenCalled()
    })

    it('should validate password requirement in login', async () => {
      const user = userEvent.setup()
      
      render(<UserAuthForm mode="login" />)
      
      await user.type(screen.getByPlaceholderText('name@example.com'), 'test@example.com')
      // Leave password empty
      await user.click(screen.getByRole('button', { name: /sign in/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Password is required')).toBeInTheDocument()
      })
      
      expect(mockSignIn).not.toHaveBeenCalled()
    })
  })

  describe('Register Mode', () => {
    it('should render registration form', () => {
      render(<UserAuthForm mode="register" />)
      
      expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })

    it('should handle successful registration and auto-login', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          message: 'User created successfully',
          user: { id: '1', email: 'test@example.com' }
        }),
      } as any)
      
      mockSignIn.mockResolvedValue({ error: null } as any)
      
      render(<UserAuthForm mode="register" />)
      
      await user.type(screen.getByPlaceholderText('Full name'), 'John Doe')
      await user.type(screen.getByPlaceholderText('name@example.com'), 'test@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'MyStr0ng!P@ssw0rd')
      await user.type(screen.getByPlaceholderText('Confirm password'), 'MyStr0ng!P@ssw0rd')
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'John Doe',
            email: 'test@example.com',
            password: 'MyStr0ng!P@ssw0rd',
            confirmPassword: 'MyStr0ng!P@ssw0rd',
          }),
        })
      })
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
          email: 'test@example.com',
          password: 'MyStr0ng!P@ssw0rd',
          redirect: true,
          callbackUrl: '/dashboard',
        })
      })
    })

    it('should handle registration failure', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Registration failed' }),
      } as any)
      
      render(<UserAuthForm mode="register" />)
      
      await user.type(screen.getByPlaceholderText('Full name'), 'John Doe')
      await user.type(screen.getByPlaceholderText('name@example.com'), 'test@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'MyStr0ng!P@ssw0rd')
      await user.type(screen.getByPlaceholderText('Confirm password'), 'MyStr0ng!P@ssw0rd')
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Something went wrong.',
          description: 'Registration failed',
          variant: 'destructive',
        })
      })
      
      expect(mockSignIn).not.toHaveBeenCalled()
    })

    it('should handle auto-login failure after successful registration', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          message: 'User created successfully',
          user: { id: '1', email: 'test@example.com' }
        }),
      } as any)
      
      mockSignIn.mockResolvedValue({ error: 'CredentialsSignin' } as any)
      
      render(<UserAuthForm mode="register" />)
      
      await user.type(screen.getByPlaceholderText('Full name'), 'John Doe')
      await user.type(screen.getByPlaceholderText('name@example.com'), 'test@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'MyStr0ng!P@ssw0rd')
      await user.type(screen.getByPlaceholderText('Confirm password'), 'MyStr0ng!P@ssw0rd')
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Account created',
          description: 'You can now sign in with your email and password.',
        })
      })
    })

    it('should validate all required fields in registration', async () => {
      const user = userEvent.setup()
      
      render(<UserAuthForm mode="register" />)
      
      // Try to submit without filling fields
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument()
        expect(screen.getByText('Invalid email')).toBeInTheDocument()
        expect(screen.getByText('Password must be at least 12 characters')).toBeInTheDocument()
      })
      
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should validate password strength in registration', async () => {
      const user = userEvent.setup()
      
      render(<UserAuthForm mode="register" />)
      
      await user.type(screen.getByPlaceholderText('Full name'), 'John Doe')
      await user.type(screen.getByPlaceholderText('name@example.com'), 'test@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'weak')
      await user.type(screen.getByPlaceholderText('Confirm password'), 'weak')
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 12 characters')).toBeInTheDocument()
      })
      
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should validate password confirmation match', async () => {
      const user = userEvent.setup()
      
      render(<UserAuthForm mode="register" />)
      
      await user.type(screen.getByPlaceholderText('Full name'), 'John Doe')
      await user.type(screen.getByPlaceholderText('name@example.com'), 'test@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'MyStr0ng!P@ssw0rd')
      await user.type(screen.getByPlaceholderText('Confirm password'), 'DifferentP@ssw0rd')
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      await waitFor(() => {
        expect(screen.getByText("Passwords don't match")).toBeInTheDocument()
      })
      
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('Loading States', () => {
    it('should show loading state during login', async () => {
      const user = userEvent.setup()
      mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ error: null } as any), 100)))
      
      render(<UserAuthForm mode="login" />)
      
      await user.type(screen.getByPlaceholderText('name@example.com'), 'test@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'password123')
      await user.click(screen.getByRole('button', { name: /sign in/i }))
      
      // Should show loading state - look for submit button specifically
      expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled()
      // Check for loading spinner by class instead of test-id
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('should show loading state during registration', async () => {
      const user = userEvent.setup()
      mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' })
      } as any), 100)))
      
      render(<UserAuthForm mode="register" />)
      
      await user.type(screen.getByPlaceholderText('Full name'), 'John Doe')
      await user.type(screen.getByPlaceholderText('name@example.com'), 'test@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'MyStr0ng!P@ssw0rd')
      await user.type(screen.getByPlaceholderText('Confirm password'), 'MyStr0ng!P@ssw0rd')
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      // Should show loading state - look for submit button specifically
      expect(screen.getByRole('button', { name: /create account/i })).toBeDisabled()
      // Check for loading spinner by class instead of test-id
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('should disable form fields during loading', async () => {
      const user = userEvent.setup()
      mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ error: null } as any), 100)))
      
      render(<UserAuthForm mode="login" />)
      
      await user.type(screen.getByPlaceholderText('name@example.com'), 'test@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'password123')
      await user.click(screen.getByRole('button', { name: /sign in/i }))
      
      // All form fields should be disabled
      expect(screen.getByPlaceholderText('name@example.com')).toBeDisabled()
      expect(screen.getByPlaceholderText('Password')).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<UserAuthForm mode="register" />)
      
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
    })

    it('should show error messages for form validation', async () => {
      const user = userEvent.setup()
      
      render(<UserAuthForm mode="login" />)
      
      await user.click(screen.getByRole('button', { name: /sign in/i }))
      
      await waitFor(() => {
        // Check that error messages appear (the form uses react-hook-form validation)
        expect(screen.getByText('Invalid email')).toBeInTheDocument()
        expect(screen.getByText('Password is required')).toBeInTheDocument()
      })
    })

    it('should have proper button text for each mode', () => {
      const { rerender } = render(<UserAuthForm mode="login" />)
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
      
      rerender(<UserAuthForm mode="register" />)
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })
  })

  describe('Email Normalization', () => {
    it('should normalize email to lowercase in login', async () => {
      const user = userEvent.setup()
      mockSignIn.mockResolvedValue({ error: null } as any)
      
      render(<UserAuthForm mode="login" />)
      
      await user.type(screen.getByPlaceholderText('name@example.com'), 'TEST@EXAMPLE.COM')
      await user.type(screen.getByPlaceholderText('Password'), 'password123')
      await user.click(screen.getByRole('button', { name: /sign in/i }))
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
          email: 'test@example.com',
          password: 'password123',
          redirect: true,
          callbackUrl: '/dashboard',
        })
      })
    })

    it('should send email as entered in registration (normalization happens server-side)', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      } as any)
      
      render(<UserAuthForm mode="register" />)
      
      await user.type(screen.getByPlaceholderText('Full name'), 'John Doe')
      await user.type(screen.getByPlaceholderText('name@example.com'), 'TEST@EXAMPLE.COM')
      await user.type(screen.getByPlaceholderText('Password'), 'MyStr0ng!P@ssw0rd')
      await user.type(screen.getByPlaceholderText('Confirm password'), 'MyStr0ng!P@ssw0rd')
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'John Doe',
            email: 'TEST@EXAMPLE.COM', // Email normalization happens server-side, not client-side
            password: 'MyStr0ng!P@ssw0rd',
            confirmPassword: 'MyStr0ng!P@ssw0rd',
          }),
        })
      })
    })
  })
})
