/**
 * Form Testing Utilities
 * 
 * This module provides comprehensive utilities for testing form components with
 * improved error handling, semantic element finding, and flexible mocking.
 * 
 * Key improvements:
 * - Uses try-catch for element finding instead of logical OR
 * - Semantic loading state detection with fallbacks
 * - Proper Jest mocking patterns (mocks must be at module top level)
 * - Null-safe DOM queries with proper error handling
 * - Descriptive error messages for better debugging
 * 
 * @example Toast Mocking Pattern
 * ```typescript
 * // At the top of your test file (before imports):
 * jest.mock('@/components/ui/use-toast', () => ({
 *   toast: jest.fn(),
 * }))
 * 
 * // In your test:
 * import { toast } from '@/components/ui/use-toast'
 * const mockToast = toast as jest.MockedFunction<typeof toast>
 * 
 * // Then use mockToast in your assertions
 * expect(mockToast).toHaveBeenCalledWith({
 *   title: 'Success',
 *   description: 'Form submitted successfully'
 * })
 * ```
 */

import { ReactElement } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'

// Form testing utilities
export class FormTester {
  private user = userEvent.setup()

  // Helper method to find input elements by label or placeholder
  private findInputElement(labelOrPlaceholder: string): HTMLElement {
    // Try label first (more semantic)
    const byLabel = screen.queryByLabelText(labelOrPlaceholder)
    if (byLabel) return byLabel
    
    // Fall back to placeholder
    const byPlaceholder = screen.queryByPlaceholderText(labelOrPlaceholder)
    if (byPlaceholder) return byPlaceholder
    
    // If neither found, throw descriptive error
    throw new Error(`Could not find input element with label or placeholder: "${labelOrPlaceholder}"`)
  }

  async fillInput(labelOrPlaceholder: string, value: string) {
    const input = this.findInputElement(labelOrPlaceholder)
    await this.user.clear(input)
    await this.user.type(input, value)
  }

  async selectOption(labelOrPlaceholder: string, option: string) {
    const select = this.findInputElement(labelOrPlaceholder)
    await this.user.selectOptions(select, option)
  }

  async clickButton(name: string | RegExp) {
    const button = screen.getByRole('button', { name })
    await this.user.click(button)
  }

  async submitForm() {
    const submitButton = screen.getByRole('button', { name: /submit|create|save|apply/i })
    await this.user.click(submitButton)
  }

  expectValidationError(message: string) {
    expect(screen.getByText(message)).toBeInTheDocument()
  }

  expectNoValidationErrors() {
    const errorMessages = [
      'required', 'invalid', 'must be', 'should be', 'cannot be',
      'too short', 'too long', 'does not match'
    ]
    
    errorMessages.forEach(errorText => {
      expect(screen.queryByText(new RegExp(errorText, 'i'))).not.toBeInTheDocument()
    })
  }

  expectLoadingState() {
    // Check for disabled submit button
    const submitButton = screen.getByRole('button', { name: /submit|create|save|apply/i })
    expect(submitButton).toBeDisabled()
    
    // Check for loading indicator using more semantic approaches
    // Try multiple methods to find loading indicator
    const loadingIndicators = [
      screen.queryByRole('status'),
      screen.queryByLabelText(/loading/i),
      screen.queryByText(/loading/i),
      screen.queryByTestId('loading-spinner')
    ].filter(Boolean)
    
    // If no semantic loading indicator found, fall back to spinner class as last resort
    if (loadingIndicators.length === 0) {
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    } else {
      expect(loadingIndicators[0]).toBeInTheDocument()
    }
  }

  expectFormEnabled() {
    const submitButton = screen.getByRole('button', { name: /submit|create|save|apply/i })
    expect(submitButton).not.toBeDisabled()
  }
}

// Address autocomplete testing helpers
export const mockAddressSuggestions = [
  {
    display_name: 'Austin, TX, USA',
    lat: '30.2672',
    lon: '-97.7431',
    place_id: '1'
  },
  {
    display_name: 'Dallas, TX, USA', 
    lat: '32.7767',
    lon: '-96.7970',
    place_id: '2'
  },
  {
    display_name: 'Houston, TX, USA',
    lat: '29.7604',
    lon: '-95.3698', 
    place_id: '3'
  }
]

export const setupAddressAutocomplete = () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
  mockFetch.mockImplementation((url) => {
    if (typeof url === 'string' && url.includes('/api/geocoding')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAddressSuggestions)
      } as any)
    }
    return Promise.reject(new Error('Unhandled fetch'))
  })
}

// Equipment and service request test data
export const mockEquipmentCategories = [
  'EXCAVATOR',
  'BULLDOZER', 
  'CRANE',
  'DUMP_TRUCK',
  'LOADER'
]

export const mockServiceRequestData = {
  title: 'Test Service Request',
  description: 'Test description for service request',
  equipmentCategory: 'EXCAVATOR',
  durationType: 'DAILY',
  totalHours: 8,
  rateType: 'HOURLY',
  startDate: '2024-01-15',
  endDate: '2024-01-15',
  location: 'Austin, TX, USA'
}

// Permission testing helpers
export const renderWithRole = (
  ui: ReactElement,
  role: 'USER' | 'OPERATOR' | 'MANAGER' | 'ADMIN' = 'USER'
) => {
  const mockSession: Session = {
    user: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      role,
      image: null,
    },
    expires: '2024-12-31',
  }

  return render(
    <SessionProvider session={mockSession}>
      {ui}
    </SessionProvider>
  )
}

// Mock fetch for successful responses
export const mockFetchSuccess = (data: any = {}) => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(data),
  } as any)
}

// Mock fetch for error responses
export const mockFetchError = (message: string = 'Error', status: number = 400) => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: () => Promise.resolve({ message }),
  } as any)
}

// Mock geocoding API responses for address autocomplete testing
export const mockGeocodingResponse = (suggestions: Array<{
  display_name: string
  lat: string
  lon: string
  place_id: string
}> = []) => {
  mockFetchSuccess(suggestions)
}

// Toast testing helpers
export const mockToast = {
  toast: jest.fn(),
}

// Note: To mock the toast hook, add this to the top of your test files:
// jest.mock('@/components/ui/use-toast', () => ({
//   toast: jest.fn(),
// }))
// Then import { toast } from '@/components/ui/use-toast' and cast as jest.MockedFunction

// Common test patterns
export const testFormValidation = async (
  formTester: FormTester,
  requiredFields: Array<{ label: string; errorMessage: string }>
) => {
  // Try to submit empty form
  await formTester.submitForm()
  
  // Check for validation errors
  await waitFor(() => {
    requiredFields.forEach(field => {
      formTester.expectValidationError(field.errorMessage)
    })
  })
}

export const testSuccessfulSubmission = async (
  formTester: FormTester,
  formData: Record<string, string>,
  expectedApiCall?: { url: string; method: string; body?: any }
) => {
  // Fill form with valid data
  for (const [field, value] of Object.entries(formData)) {
    await formTester.fillInput(field, value)
  }
  
  // Submit form
  await formTester.submitForm()
  
  // Check loading state appears
  formTester.expectLoadingState()
  
  // If API call is expected, verify it
  if (expectedApiCall) {
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expectedApiCall.url,
        expect.objectContaining({
          method: expectedApiCall.method,
          ...(expectedApiCall.body && {
            body: JSON.stringify(expectedApiCall.body)
          })
        })
      )
    })
  }
}
