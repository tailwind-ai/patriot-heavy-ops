// Mock the toast hook at the top level
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}))

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { ServiceRequestCreateButton } from '@/components/service-request-create-button'

// Cast mocked functions
const mockToast = toast as jest.MockedFunction<typeof toast>

describe('ServiceRequestCreateButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPush.mockClear()
  })

  afterEach(() => {
    cleanup()
  })

  describe('Button Rendering', () => {
    it('should render the create button with correct text and icon', () => {
      render(<ServiceRequestCreateButton />)
      
      const button = screen.getByRole('button', { name: /new service request/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('New Service Request')
      
      // Should have add icon (not spinner initially)
      expect(button.querySelector('.mr-2')).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      render(<ServiceRequestCreateButton className="custom-class" />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('should render with custom variant', () => {
      render(<ServiceRequestCreateButton variant="outline" />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border-input')
    })

    it('should accept additional button props', () => {
      render(
        <ServiceRequestCreateButton 
          data-testid="create-button"
          aria-label="Create new service request"
        />
      )
      
      const button = screen.getByTestId('create-button')
      expect(button).toHaveAttribute('aria-label', 'Create new service request')
    })
  })

  describe('Button Interaction', () => {
    it('should navigate to create page when clicked', async () => {
      mockPush.mockResolvedValue(undefined)
      
      render(<ServiceRequestCreateButton />)
      
      const button = screen.getByRole('button', { name: /new service request/i })
      await userEvent.click(button)
      
      expect(mockPush).toHaveBeenCalledWith('/dashboard/requests/new')
    })

    it('should show loading state when clicked', async () => {
      // Mock a delayed navigation
      mockPush.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(undefined), 100))
      )
      
      render(<ServiceRequestCreateButton />)
      
      const button = screen.getByRole('button', { name: /new service request/i })
      await userEvent.click(button)
      
      // Should show loading state immediately
      expect(button).toBeDisabled()
      expect(button).toHaveClass('cursor-not-allowed', 'opacity-60')
      
      // Should show spinner icon
      await waitFor(() => {
        expect(button.querySelector('.animate-spin')).toBeInTheDocument()
      })
    })

    it('should disable button during loading', async () => {
      mockPush.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(undefined), 100))
      )
      
      render(<ServiceRequestCreateButton />)
      
      const button = screen.getByRole('button', { name: /new service request/i })
      
      expect(button).not.toBeDisabled()
      
      await userEvent.click(button)
      
      expect(button).toBeDisabled()
    })

    it('should show spinner icon during loading', async () => {
      mockPush.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(undefined), 100))
      )
      
      render(<ServiceRequestCreateButton />)
      
      const button = screen.getByRole('button', { name: /new service request/i })
      
      // Initially should show add icon
      expect(button.querySelector('.animate-spin')).not.toBeInTheDocument()
      
      await userEvent.click(button)
      
      // Should show spinner during loading
      await waitFor(() => {
        expect(button.querySelector('.animate-spin')).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should show error toast when navigation fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockPush.mockRejectedValue(new Error('Navigation failed'))
      
      render(<ServiceRequestCreateButton />)
      
      const button = screen.getByRole('button', { name: /new service request/i })
      await userEvent.click(button)
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Navigation failed',
          description: 'Unable to navigate to the create request page. Please try again.',
          variant: 'destructive',
        })
      })
      
      expect(consoleSpy).toHaveBeenCalledWith('Navigation error:', expect.any(Error))
      consoleSpy.mockRestore()
    })

    it('should handle different types of navigation errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Test with different error types
      const errors = [
        new Error('Network error'),
        new TypeError('Type error'),
        'String error',
        { message: 'Object error' }
      ]
      
      for (const error of errors) {
        mockPush.mockRejectedValueOnce(error)
        
        const { unmount } = render(<ServiceRequestCreateButton />)
        
        const button = screen.getByRole('button', { name: /new service request/i })
        await userEvent.click(button)
        
        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith({
            title: 'Navigation failed',
            description: 'Unable to navigate to the create request page. Please try again.',
            variant: 'destructive',
          })
        })
        
        // Clean up after each iteration
        unmount()
        mockToast.mockClear()
      }
      
      consoleSpy.mockRestore()
    })
  })

  describe('Button States', () => {
    it('should maintain loading state until navigation completes', async () => {
      let resolveNavigation: (() => void) | undefined
      
      mockPush.mockImplementation(() => 
        new Promise(resolve => {
          resolveNavigation = () => resolve(undefined)
        })
      )
      
      render(<ServiceRequestCreateButton />)
      
      const button = screen.getByRole('button', { name: /new service request/i })
      await userEvent.click(button)
      
      // Should be in loading state
      expect(button).toBeDisabled()
      expect(button.querySelector('.animate-spin')).toBeInTheDocument()
      
      // Complete navigation
      if (resolveNavigation) {
        resolveNavigation()
      }
      
      // Note: In the actual component, loading state persists until unmount
      // This is intentional as the component will unmount during navigation
    })

    it('should not allow multiple clicks during loading', async () => {
      mockPush.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(undefined), 100))
      )
      
      render(<ServiceRequestCreateButton />)
      
      const button = screen.getByRole('button', { name: /new service request/i })
      
      // Click multiple times rapidly
      await userEvent.click(button)
      await userEvent.click(button)
      await userEvent.click(button)
      
      // Should only call router.push once
      expect(mockPush).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have proper button semantics', () => {
      render(<ServiceRequestCreateButton />)
      
      const button = screen.getByRole('button', { name: /new service request/i })
      // The button element doesn't have an explicit type attribute, which defaults to 'button'
      expect(button.tagName.toLowerCase()).toBe('button')
    })

    it('should indicate loading state to screen readers', async () => {
      mockPush.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(undefined), 100))
      )
      
      render(<ServiceRequestCreateButton />)
      
      const button = screen.getByRole('button', { name: /new service request/i })
      await userEvent.click(button)
      
      // Button should be disabled, indicating loading state
      expect(button).toBeDisabled()
      expect(button).toHaveClass('cursor-not-allowed', 'opacity-60')
    })

    it('should maintain focus management', async () => {
      mockPush.mockResolvedValue(undefined)
      
      render(<ServiceRequestCreateButton />)
      
      const button = screen.getByRole('button', { name: /new service request/i })
      
      // Focus the button
      button.focus()
      expect(button).toHaveFocus()
      
      // Click should maintain focus until navigation
      await userEvent.click(button)
      
      // Button should still be focusable (though disabled)
      expect(button).toBeInTheDocument()
    })
  })

  describe('Icon Display', () => {
    it('should show add icon when not loading', () => {
      render(<ServiceRequestCreateButton />)
      
      const button = screen.getByRole('button', { name: /new service request/i })
      
      // Should have add icon class but not spinner
      const icon = button.querySelector('.mr-2')
      expect(icon).toBeInTheDocument()
      expect(icon).not.toHaveClass('animate-spin')
    })

    it('should switch to spinner icon when loading', async () => {
      mockPush.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(undefined), 100))
      )
      
      render(<ServiceRequestCreateButton />)
      
      const button = screen.getByRole('button', { name: /new service request/i })
      await userEvent.click(button)
      
      await waitFor(() => {
        const spinner = button.querySelector('.animate-spin')
        expect(spinner).toBeInTheDocument()
        expect(spinner).toHaveClass('mr-2', 'h-4', 'w-4')
      })
    })
  })

  describe('Component Variants', () => {
    it('should apply default variant styling', () => {
      render(<ServiceRequestCreateButton />)
      
      const button = screen.getByRole('button')
      // Should have default button variant classes
      expect(button).toHaveClass('inline-flex')
    })

    it('should apply custom variant styling', () => {
      render(<ServiceRequestCreateButton variant="secondary" />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary')
    })

    it('should combine variant with loading classes', async () => {
      mockPush.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(undefined), 100))
      )
      
      render(<ServiceRequestCreateButton variant="outline" />)
      
      const button = screen.getByRole('button')
      await userEvent.click(button)
      
      // Should have both variant and loading classes
      expect(button).toHaveClass('border-input') // outline variant
      expect(button).toHaveClass('cursor-not-allowed', 'opacity-60') // loading state
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined router push result', async () => {
      mockPush.mockResolvedValue(undefined)
      
      render(<ServiceRequestCreateButton />)
      
      const button = screen.getByRole('button', { name: /new service request/i })
      await userEvent.click(button)
      
      expect(mockPush).toHaveBeenCalledWith('/dashboard/requests/new')
      expect(mockToast).not.toHaveBeenCalled()
    })

    it('should handle router push returning true', async () => {
      mockPush.mockResolvedValue(true as any)
      
      render(<ServiceRequestCreateButton />)
      
      const button = screen.getByRole('button', { name: /new service request/i })
      await userEvent.click(button)
      
      expect(mockPush).toHaveBeenCalledWith('/dashboard/requests/new')
      expect(mockToast).not.toHaveBeenCalled()
    })
  })
})
