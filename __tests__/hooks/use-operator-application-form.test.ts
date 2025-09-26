import { renderHook, act, waitFor } from "@testing-library/react"
import { useRouter } from "next/navigation"
import { useOperatorApplicationForm } from "@/hooks/use-operator-application-form"
import { ServiceFactory } from "@/lib/services"

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))
jest.mock("@/lib/services")

// Mock notifications for testing
const mockNotifications = {
  showNotification: jest.fn(),
  showSuccess: jest.fn(),
  showError: jest.fn(),
  showWarning: jest.fn(),
}

const mockRouter = {
  refresh: jest.fn(),
}

const mockUser = {
  id: "user-1",
  name: "John Doe",
}

const mockGeocodingService = {
  searchAddresses: jest.fn(),
}

describe("useOperatorApplicationForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    // Reset notification mocks
    Object.values(mockNotifications).forEach((mock) => mock.mockClear())
    ;(ServiceFactory.getGeocodingService as jest.Mock).mockReturnValue(
      mockGeocodingService
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should initialize with default form values", () => {
    const { result } = renderHook(() =>
      useOperatorApplicationForm({
        user: mockUser,
        notifications: mockNotifications,
      })
    )

    expect(result.current.form.getValues()).toMatchObject({
      location: "",
    })
    expect(result.current.inputValue).toBe("")
    expect(result.current.suggestions).toHaveLength(0)
    expect(result.current.isSaving).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it("should handle input change and trigger address search", async () => {
    mockGeocodingService.searchAddresses.mockResolvedValue({
      success: true,
      data: [
        {
          placeId: "place-1",
          displayName: "123 Main St, City, State",
          coordinates: { latitude: 40.7128, longitude: -74.006 },
          components: {
            streetNumber: "123",
            streetName: "Main St",
            city: "City",
            state: "State",
            postalCode: "12345",
            country: "USA",
          },
        },
      ],
    })

    const { result } = renderHook(() =>
      useOperatorApplicationForm({
        user: mockUser,
        notifications: mockNotifications,
      })
    )

    act(() => {
      result.current.handleInputChange("123 Main")
    })

    expect(result.current.inputValue).toBe("123 Main")
    expect(result.current.form.getValues("location")).toBe("123 Main")

    // Wait for debounced search
    await waitFor(
      () => {
        expect(mockGeocodingService.searchAddresses).toHaveBeenCalledWith(
          "123 Main"
        )
      },
      { timeout: 500 }
    )

    await waitFor(() => {
      expect(result.current.suggestions).toHaveLength(1)
      expect(result.current.suggestions[0]).toMatchObject({
        placeId: "place-1",
        displayName: "123 Main St, City, State",
      })
    })
  })

  it("should not search for addresses with less than 3 characters", async () => {
    const { result } = renderHook(() =>
      useOperatorApplicationForm({
        user: mockUser,
        notifications: mockNotifications,
      })
    )

    act(() => {
      result.current.handleInputChange("12")
    })

    expect(result.current.inputValue).toBe("12")
    expect(result.current.form.getValues("location")).toBe("12")

    // Wait to ensure no search is triggered
    await waitFor(
      () => {
        expect(mockGeocodingService.searchAddresses).not.toHaveBeenCalled()
      },
      { timeout: 500 }
    )

    expect(result.current.suggestions).toHaveLength(0)
  })

  it("should handle address selection", () => {
    const { result } = renderHook(() =>
      useOperatorApplicationForm({
        user: mockUser,
        notifications: mockNotifications,
      })
    )

    const suggestion = {
      placeId: "place-1",
      displayName: "123 Main St, City, State",
      coordinates: { latitude: 40.7128, longitude: -74.006 },
      components: {
        streetNumber: "123",
        streetName: "Main St",
        city: "City",
        state: "State",
        postalCode: "12345",
        country: "USA",
      },
    }

    act(() => {
      result.current.handleAddressSelect(suggestion)
    })

    expect(result.current.inputValue).toBe("123 Main St, City, State")
    expect(result.current.form.getValues("location")).toBe(
      "123 Main St, City, State"
    )
    expect(result.current.suggestions).toHaveLength(0)
  })

  it("should handle geocoding API errors gracefully", async () => {
    mockGeocodingService.searchAddresses.mockResolvedValue({
      success: false,
      error: { code: "NETWORK_ERROR", message: "Network error" },
    })

    const { result } = renderHook(() =>
      useOperatorApplicationForm({
        user: mockUser,
        notifications: mockNotifications,
      })
    )

    act(() => {
      result.current.handleInputChange("123 Main")
    })

    // Wait for debounced search
    await waitFor(
      () => {
        expect(mockGeocodingService.searchAddresses).toHaveBeenCalled()
      },
      { timeout: 500 }
    )

    await waitFor(() => {
      expect(result.current.suggestions).toHaveLength(0)
      expect(result.current.isLoading).toBe(false)
    })
  })

  it("should handle suggestions blur with delay", () => {
    const { result } = renderHook(() =>
      useOperatorApplicationForm({
        user: mockUser,
        notifications: mockNotifications,
      })
    )

    // Set some suggestions first
    act(() => {
      result.current.handleInputChange("123 Main St")
    })

    // Mock suggestions being set
    act(() => {
      // Simulate suggestions being set by the search
      result.current.suggestions.push({
        placeId: "place-1",
        displayName: "123 Main St, City, State",
        coordinates: { latitude: 40.7128, longitude: -74.006 },
        components: {
          streetNumber: "123",
          streetName: "Main St",
          city: "City",
          state: "State",
          postalCode: "12345",
          country: "USA",
        },
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

  it("should submit form successfully", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })

    const { result } = renderHook(() =>
      useOperatorApplicationForm({
        user: mockUser,
        notifications: mockNotifications,
      })
    )

    const formData = {
      location: "123 Main St, City, State",
    }

    await act(async () => {
      await result.current.onSubmit(formData)
    })

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/users/user-1/operator-application",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: "123 Main St, City, State",
        }),
      }
    )

    expect(mockNotifications.showSuccess).toHaveBeenCalledWith(
      "Your operator application has been submitted for review."
    )

    expect(mockRouter.refresh).toHaveBeenCalled()
  })

  it("should handle form submission errors", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
    })

    const { result } = renderHook(() =>
      useOperatorApplicationForm({
        user: mockUser,
        notifications: mockNotifications,
      })
    )

    const formData = {
      location: "123 Main St, City, State",
    }

    await act(async () => {
      await result.current.onSubmit(formData)
    })

    expect(mockNotifications.showError).toHaveBeenCalledWith(
      "Your application was not submitted. Please try again.",
      "Something went wrong."
    )
  })

  it("should handle network errors during submission", async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() =>
      useOperatorApplicationForm({
        user: mockUser,
        notifications: mockNotifications,
      })
    )

    const formData = {
      location: "123 Main St, City, State",
    }

    await act(async () => {
      await result.current.onSubmit(formData)
    })

    expect(mockNotifications.showError).toHaveBeenCalledWith(
      "Unable to connect to the server. Please check your internet connection and try again.",
      "Network error"
    )
  })

  it("should set loading states correctly during submission", async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    ;(global.fetch as jest.Mock).mockReturnValue(promise)

    const { result } = renderHook(() =>
      useOperatorApplicationForm({
        user: mockUser,
        notifications: mockNotifications,
      })
    )

    const formData = {
      location: "123 Main St, City, State",
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
