import { renderHook, act, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { useOperatorApplicationForm } from '@/hooks/use-operator-application-form'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))
jest.mock('@/components/ui/use-toast')

const mockRouter = {
  refresh: jest.fn(),
}

const mockUser = {
  id: 'user-1',
  name: 'John Doe',
}

// Mock fetch
global.fetch = jest.fn()

describe('useOperatorApplicationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should initialize with default form values', () => {
    const { result } = renderHook(() => useOperatorApplicationForm({ user: mockUser }))

    expect(result.current.form.getValues()).toMatchObject({
      location: '',
    })
    expect(result.current.inputValue).toBe('')
    expect(result.current.suggestions).toHaveLength(0)
    expect(result.current.isSaving).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('should handle input change and trigger address search', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        {
          place_id: 'place-1',
          display_name: '123 Main St, City, State',
          lat: '40.7128',
          lon: '-74.0060',
        },
      ],
    })

    const { result } = renderHook(() => useOperatorApplicationForm({ user: mockUser }))

    act(() => {
      result.current.handleInputChange('123 Main')
    })

    expect(result.current.inputValue).toBe('123 Main')
    expect(result.current.form.getValues('location')).toBe('123 Main')

    // Wait for debounced search
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/geocoding?q=123%20Main')
    }, { timeout: 500 })

    await waitFor(() => {
      expect(result.current.suggestions).toHaveLength(1)
      expect(result.current.suggestions[0]).toMatchObject({
        place_id: 'place-1',
        display_name: '123 Main St, City, State',
      })
    })
  })

  it('should not search for addresses with less than 3 characters', async () => {
    const { result } = renderHook(() => useOperatorApplicationForm({ user: mockUser }))

    act(() => {
      result.current.handleInputChange('12')
    })

    expect(result.current.inputValue).toBe('12')
    expect(result.current.form.getValues('location')).toBe('12')

    // Wait to ensure no search is triggered
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled()
    }, { timeout: 500 })

    expect(result.current.suggestions).toHaveLength(0)
  })

  it('should handle address selection', () => {
    const { result } = renderHook(() => useOperatorApplicationForm({ user: mockUser }))

    const suggestion = {
      place_id: 'place-1',
      display_name: '123 Main St, City, State',
      lat: '40.7128',
      lon: '-74.0060',
    }

    act(() => {
      result.current.handleAddressSelect(suggestion)
    })

    expect(result.current.inputValue).toBe('123 Main St, City, State')
    expect(result.current.form.getValues('location')).toBe('123 Main St, City, State')
    expect(result.current.suggestions).toHaveLength(0)
  })

  it('should handle geocoding API errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useOperatorApplicationForm({ user: mockUser }))

    act(() => {
      result.current.handleInputChange('123 Main')
    })

    // Wait for debounced search
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    }, { timeout: 500 })

    await waitFor(() => {
      expect(result.current.suggestions).toHaveLength(0)
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should handle suggestions blur with delay', () => {
    const { result } = renderHook(() => useOperatorApplicationForm({ user: mockUser }))

    // Set some suggestions first
    act(() => {
      result.current.handleInputChange('123 Main St')
    })

    // Mock suggestions being set
    act(() => {
      // Simulate suggestions being set by the search
      result.current.suggestions.push({
        place_id: 'place-1',
        display_name: '123 Main St, City, State',
        lat: '40.7128',
        lon: '-74.0060',
      })
    })

    act(() => {
      result.current.handleSuggestionsBlur()
    })

    // Suggestions should still be there immediately
    expect(result.current.suggestions).toBeDefined()

    // After the delay, suggestions should be cleared
    setTimeout(() => {
      expect(result.current.suggestions).toHaveLength(0)
    }, 200)
  })

  it('should submit form successfully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })

    const { result } = renderHook(() => useOperatorApplicationForm({ user: mockUser }))

    const formData = {
      location: '123 Main St, City, State',
    }

    await act(async () => {
      await result.current.onSubmit(formData)
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/users/user-1/operator-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: '123 Main St, City, State',
      }),
    })

    expect(toast).toHaveBeenCalledWith({
      description: 'Your operator application has been submitted for review.',
    })

    expect(mockRouter.refresh).toHaveBeenCalled()
  })

  it('should handle form submission errors', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
    })

    const { result } = renderHook(() => useOperatorApplicationForm({ user: mockUser }))

    const formData = {
      location: '123 Main St, City, State',
    }

    await act(async () => {
      await result.current.onSubmit(formData)
    })

    expect(toast).toHaveBeenCalledWith({
      title: 'Something went wrong.',
      description: 'Your application was not submitted. Please try again.',
      variant: 'destructive',
    })
  })

  it('should handle network errors during submission', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useOperatorApplicationForm({ user: mockUser }))

    const formData = {
      location: '123 Main St, City, State',
    }

    await act(async () => {
      await result.current.onSubmit(formData)
    })

    expect(toast).toHaveBeenCalledWith({
      title: 'Network error',
      description: 'Unable to connect to the server. Please check your internet connection and try again.',
      variant: 'destructive',
    })
  })

  it('should set loading states correctly during submission', async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    ;(global.fetch as jest.Mock).mockReturnValue(promise)

    const { result } = renderHook(() => useOperatorApplicationForm({ user: mockUser }))

    const formData = {
      location: '123 Main St, City, State',
    }

    // Start submission
    act(() => {
      result.current.onSubmit(formData)
    })

    // Should be saving
    expect(result.current.isSaving).toBe(true)

    // Resolve the promise
    act(() => {
      resolvePromise!({
        ok: true,
        json: async () => ({ success: true }),
      })
    })

    await waitFor(() => {
      expect(result.current.isSaving).toBe(false)
    })
  })
})
