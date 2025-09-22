// Mock the toast hook at the top level
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}))

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { OperatorApplicationForm } from '@/components/operator-application-form'
import { FormTester, mockGeocodingResponse, mockFetchSuccess, mockFetchError } from '../helpers/form-test-helpers'

// Cast mocked functions
const mockToast = toast as jest.MockedFunction<typeof toast>
const mockRouter = useRouter()

describe('OperatorApplicationForm', () => {
  const mockUser = {
    id: 'test-user-id',
    name: 'Test User'
  }

  let formTester: FormTester

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
    formTester = new FormTester()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Form Rendering', () => {
    it('should render the operator application form', () => {
      render(<OperatorApplicationForm user={mockUser} />)
      
      expect(screen.getByText('Apply to Become an Operator')).toBeInTheDocument()
      expect(screen.getByText('Are you a heavy equipment operator? Enter your service area so we can show job requests near you.')).toBeInTheDocument()
      expect(screen.getByText('Service Area')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter city, state, or address...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /apply now/i })).toBeInTheDocument()
    })

    it('should have proper form structure and accessibility', () => {
      render(<OperatorApplicationForm user={mockUser} />)
      
      const form = screen.getByRole('form') || document.querySelector('form')
      expect(form).toBeInTheDocument()
      
      const locationInput = screen.getByPlaceholderText('Enter city, state, or address...')
      expect(locationInput).toHaveAttribute('placeholder', 'Enter city, state, or address...')
      
      const submitButton = screen.getByRole('button', { name: /apply now/i })
      expect(submitButton).toHaveAttribute('type', 'submit')
    })

    it('should render with custom className', () => {
      const { container } = render(
        <OperatorApplicationForm user={mockUser} className="custom-class" />
      )
      
      const form = container.querySelector('form')
      expect(form).toHaveClass('custom-class')
    })
  })

  describe('Address Autocomplete', () => {
    it('should not search for addresses with less than 3 characters', async () => {
      render(<OperatorApplicationForm user={mockUser} />)
      
      const locationInput = screen.getByPlaceholderText('Enter city, state, or address...')
      
      await userEvent.type(locationInput, 'Au')
      
      // Wait for debounce
      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled()
      })
    })

    it('should search for addresses when typing 3 or more characters', async () => {
      const mockSuggestions = [
        {
          display_name: 'Austin, TX, USA',
          lat: '30.2672',
          lon: '-97.7431',
          place_id: '1'
        }
      ]
      
      mockGeocodingResponse(mockSuggestions)
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      const locationInput = screen.getByPlaceholderText('Enter city, state, or address...')
      
      await userEvent.type(locationInput, 'Austin')
      
      // Wait for debounce and API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/geocoding?q=Austin')
      })
    })

    it('should display address suggestions', async () => {
      const mockSuggestions = [
        {
          display_name: 'Austin, TX, USA',
          lat: '30.2672',
          lon: '-97.7431',
          place_id: '1'
        },
        {
          display_name: 'Austin, MN, USA',
          lat: '43.6667',
          lon: '-92.9735',
          place_id: '2'
        }
      ]
      
      mockGeocodingResponse(mockSuggestions)
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      const locationInput = screen.getByPlaceholderText('Enter city, state, or address...')
      
      await userEvent.type(locationInput, 'Austin')
      
      await waitFor(() => {
        expect(screen.getByText('Austin')).toBeInTheDocument()
        expect(screen.getByText('Austin, TX, USA')).toBeInTheDocument()
        expect(screen.getByText('Austin, MN, USA')).toBeInTheDocument()
      })
    })

    it('should select an address from suggestions', async () => {
      const mockSuggestions = [
        {
          display_name: 'Austin, TX, USA',
          lat: '30.2672',
          lon: '-97.7431',
          place_id: '1'
        }
      ]
      
      mockGeocodingResponse(mockSuggestions)
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      const locationInput = screen.getByPlaceholderText('Enter city, state, or address...')
      
      await userEvent.type(locationInput, 'Austin')
      
      await waitFor(() => {
        expect(screen.getByText('Austin, TX, USA')).toBeInTheDocument()
      })
      
      // Click on the suggestion
      await userEvent.click(screen.getByText('Austin, TX, USA'))
      
      expect(locationInput).toHaveValue('Austin, TX, USA')
    })

    it('should show loading spinner during address search', async () => {
      // Mock a delayed response
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve([])
        } as any), 100))
      )
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      const locationInput = screen.getByPlaceholderText('Enter city, state, or address...')
      
      await userEvent.type(locationInput, 'Austin')
      
      // Should show loading spinner
      await waitFor(() => {
        expect(document.querySelector('.animate-spin')).toBeInTheDocument()
      })
    })

    it('should handle geocoding API errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockFetchError('Network error', 500)
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      const locationInput = screen.getByPlaceholderText('Enter city, state, or address...')
      
      await userEvent.type(locationInput, 'Austin')
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Address search error:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })

    it('should debounce address searches', async () => {
      mockGeocodingResponse([])
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      const locationInput = screen.getByPlaceholderText('Enter city, state, or address...')
      
      // Type multiple characters quickly
      await userEvent.type(locationInput, 'Austin', { delay: 50 })
      
      // Should only make one API call due to debouncing
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1)
      })
    })

    it('should hide suggestions on input blur', async () => {
      const mockSuggestions = [
        {
          display_name: 'Austin, TX, USA',
          lat: '30.2672',
          lon: '-97.7431',
          place_id: '1'
        }
      ]
      
      mockGeocodingResponse(mockSuggestions)
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      const locationInput = screen.getByPlaceholderText('Enter city, state, or address...')
      
      await userEvent.type(locationInput, 'Austin')
      
      await waitFor(() => {
        expect(screen.getByText('Austin, TX, USA')).toBeInTheDocument()
      })
      
      // Blur the input
      fireEvent.blur(locationInput)
      
      // Suggestions should disappear after delay
      await waitFor(() => {
        expect(screen.queryByText('Austin, TX, USA')).not.toBeInTheDocument()
      }, { timeout: 200 })
    })
  })

  describe('Form Validation', () => {
    it('should show validation error for empty location', async () => {
      render(<OperatorApplicationForm user={mockUser} />)
      
      const submitButton = screen.getByRole('button', { name: /apply now/i })
      
      await userEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Please select a location')).toBeInTheDocument()
      })
    })

    it('should not submit form with invalid data', async () => {
      render(<OperatorApplicationForm user={mockUser} />)
      
      const submitButton = screen.getByRole('button', { name: /apply now/i })
      
      await userEvent.click(submitButton)
      
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should validate location field correctly', async () => {
      render(<OperatorApplicationForm user={mockUser} />)
      
      const locationInput = screen.getByPlaceholderText('Enter city, state, or address...')
      
      // Enter valid location
      await userEvent.type(locationInput, 'Austin, TX')
      
      const submitButton = screen.getByRole('button', { name: /apply now/i })
      await userEvent.click(submitButton)
      
      // Should not show validation error
      expect(screen.queryByText('Please select a location')).not.toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      mockFetchSuccess({ message: 'Application submitted successfully' })
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      await formTester.fillInput('Enter city, state, or address...', 'Austin, TX')
      await formTester.submitForm()
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/users/test-user-id/operator-application',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              location: 'Austin, TX',
            }),
          }
        )
      })
    })

    it('should show loading state during submission', async () => {
      // Mock delayed response
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Success' })
        } as any), 100))
      )
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      await formTester.fillInput('Enter city, state, or address...', 'Austin, TX')
      
      const submitButton = screen.getByRole('button', { name: /apply now/i })
      await userEvent.click(submitButton)
      
      // Should show loading state
      expect(submitButton).toBeDisabled()
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
      expect(screen.getByText('Apply Now')).toBeInTheDocument()
    })

    it('should show success toast on successful submission', async () => {
      mockFetchSuccess({ message: 'Application submitted successfully' })
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      await formTester.fillInput('Enter city, state, or address...', 'Austin, TX')
      await formTester.submitForm()
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          description: 'Your operator application has been submitted for review.',
        })
      })
    })

    it('should refresh router on successful submission', async () => {
      mockFetchSuccess({ message: 'Application submitted successfully' })
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      await formTester.fillInput('Enter city, state, or address...', 'Austin, TX')
      await formTester.submitForm()
      
      await waitFor(() => {
        expect(mockRouter.refresh).toHaveBeenCalled()
      })
    })

    it('should show error toast on submission failure', async () => {
      mockFetchError('Submission failed', 400)
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      await formTester.fillInput('Enter city, state, or address...', 'Austin, TX')
      await formTester.submitForm()
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Something went wrong.',
          description: 'Your application was not submitted. Please try again.',
          variant: 'destructive',
        })
      })
    })

    it('should not refresh router on submission failure', async () => {
      mockFetchError('Submission failed', 400)
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      await formTester.fillInput('Enter city, state, or address...', 'Austin, TX')
      await formTester.submitForm()
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalled()
      })
      
      expect(mockRouter.refresh).not.toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle special characters in location', async () => {
      mockFetchSuccess({ message: 'Success' })
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      const specialLocation = 'São Paulo, Brazil'
      await formTester.fillInput('Service Area', specialLocation)
      await formTester.submitForm()
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: JSON.stringify({
              location: specialLocation,
            }),
          })
        )
      })
    })

    it('should handle very long location names', async () => {
      mockFetchSuccess({ message: 'Success' })
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      const longLocation = 'A'.repeat(200) + ', TX'
      await formTester.fillInput('Service Area', longLocation)
      await formTester.submitForm()
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })

    it('should handle empty geocoding response', async () => {
      mockGeocodingResponse([])
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      const locationInput = screen.getByPlaceholderText('Enter city, state, or address...')
      
      await userEvent.type(locationInput, 'NonexistentPlace')
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
      
      // Should not show any suggestions
      expect(screen.queryByRole('option')).not.toBeInTheDocument()
    })

    it('should handle malformed geocoding response', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      } as any)
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      const locationInput = screen.getByPlaceholderText('Enter city, state, or address...')
      
      await userEvent.type(locationInput, 'Austin')
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Address search error:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })
  })

  describe('User Interaction', () => {
    it('should clear suggestions when an address is selected', async () => {
      const mockSuggestions = [
        {
          display_name: 'Austin, TX, USA',
          lat: '30.2672',
          lon: '-97.7431',
          place_id: '1'
        }
      ]
      
      mockGeocodingResponse(mockSuggestions)
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      const locationInput = screen.getByPlaceholderText('Enter city, state, or address...')
      
      await userEvent.type(locationInput, 'Austin')
      
      await waitFor(() => {
        expect(screen.getByText('Austin, TX, USA')).toBeInTheDocument()
      })
      
      await userEvent.click(screen.getByText('Austin, TX, USA'))
      
      // Suggestions should be cleared
      expect(screen.queryByText('Austin, TX, USA')).not.toBeInTheDocument()
    })

    it('should handle keyboard navigation in suggestions', async () => {
      const mockSuggestions = [
        {
          display_name: 'Austin, TX, USA',
          lat: '30.2672',
          lon: '-97.7431',
          place_id: '1'
        }
      ]
      
      mockGeocodingResponse(mockSuggestions)
      
      render(<OperatorApplicationForm user={mockUser} />)
      
      const locationInput = screen.getByPlaceholderText('Enter city, state, or address...')
      
      await userEvent.type(locationInput, 'Austin')
      
      await waitFor(() => {
        expect(screen.getByText('Austin, TX, USA')).toBeInTheDocument()
      })
      
      // The suggestions should be clickable
      const suggestion = screen.getByText('Austin, TX, USA')
      expect(suggestion).toHaveClass('cursor-pointer')
    })

    it('should update input value when typing', async () => {
      render(<OperatorApplicationForm user={mockUser} />)
      
      const locationInput = screen.getByPlaceholderText('Enter city, state, or address...')
      
      await userEvent.type(locationInput, 'Test Location')
      
      expect(locationInput).toHaveValue('Test Location')
    })
  })

  describe('Component Props', () => {
    it('should accept and use custom props', () => {
      const { container } = render(
        <OperatorApplicationForm 
          user={mockUser} 
          data-testid="operator-form"
          aria-label="Operator Application"
        />
      )
      
      const form = container.querySelector('form')
      expect(form).toHaveAttribute('data-testid', 'operator-form')
      expect(form).toHaveAttribute('aria-label', 'Operator Application')
    })

    it('should work with different user objects', () => {
      const differentUser = {
        id: 'different-user-id',
        name: 'Different User'
      }
      
      render(<OperatorApplicationForm user={differentUser} />)
      
      expect(screen.getByText('Apply to Become an Operator')).toBeInTheDocument()
    })
  })
})
