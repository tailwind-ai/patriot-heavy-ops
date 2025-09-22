import { ReactElement } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'

// Form testing utilities
export class FormTester {
  private user = userEvent.setup()

  async fillInput(labelOrPlaceholder: string, value: string) {
    const input = screen.getByLabelText(labelOrPlaceholder) || 
                  screen.getByPlaceholderText(labelOrPlaceholder)
    await this.user.clear(input)
    await this.user.type(input, value)
  }

  async selectOption(labelOrPlaceholder: string, option: string) {
    const select = screen.getByLabelText(labelOrPlaceholder) || 
                   screen.getByPlaceholderText(labelOrPlaceholder)
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
    
    // Check for loading spinner
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
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

// Toast testing helpers
export const mockToast = {
  toast: jest.fn(),
}

// Mock the toast hook
jest.mock('@/components/ui/use-toast', () => mockToast)

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
