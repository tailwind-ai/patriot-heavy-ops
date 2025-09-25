import { renderHook, act, waitFor } from "@testing-library/react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { ServiceFactory } from "@/lib/services"
import { useServiceRequestForm } from "@/hooks/use-service-request-form"

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))
jest.mock("@/components/ui/use-toast")
jest.mock("@/lib/services")

const mockRouter = {
  push: jest.fn(),
  refresh: jest.fn(),
}

const mockGeocodingService = {
  searchAddresses: jest.fn(),
}

const mockUser = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
}

// Mock fetch
global.fetch = jest.fn()

describe("useServiceRequestForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(ServiceFactory.getGeocodingService as jest.Mock).mockReturnValue(
      mockGeocodingService
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should initialize with default form values", () => {
    const { result } = renderHook(() =>
      useServiceRequestForm({ user: mockUser })
    )

    expect(result.current.form.getValues()).toMatchObject({
      contactName: "John Doe",
      contactEmail: "john@example.com",
      contactPhone: "",
      company: "",
      title: "",
      description: "",
      jobSite: "",
      transport: "WE_HANDLE_IT",
      equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
      requestedDurationType: "FULL_DAY",
      requestedDurationValue: 1,
      requestedTotalHours: 8,
      rateType: "DAILY",
      baseRate: 500,
    })
  })

  it("should update total hours when duration changes", () => {
    const { result } = renderHook(() =>
      useServiceRequestForm({ user: mockUser })
    )

    act(() => {
      result.current.form.setValue("requestedDurationType", "HALF_DAY")
      result.current.form.setValue("requestedDurationValue", 2)
    })

    // Total hours should be calculated: HALF_DAY (4 hours) * 2 = 8 hours
    expect(result.current.form.getValues("requestedTotalHours")).toBe(8)
  })

  it("should handle job site input change and trigger address search", async () => {
    mockGeocodingService.searchAddresses.mockResolvedValue({
      success: true,
      data: [
        {
          placeId: "place-1",
          displayName: "123 Main St, City, State",
        },
      ],
    })

    const { result } = renderHook(() =>
      useServiceRequestForm({ user: mockUser })
    )

    act(() => {
      result.current.handleJobSiteInputChange("123 Main")
    })

    expect(result.current.jobSiteInput).toBe("123 Main")
    expect(result.current.form.getValues("jobSite")).toBe("123 Main")

    // Wait for debounced search
    await waitFor(
      () => {
        expect(mockGeocodingService.searchAddresses).toHaveBeenCalledWith(
          "123 Main",
          {
            limit: 5,
            countryCode: "us",
          }
        )
      },
      { timeout: 500 }
    )

    await waitFor(() => {
      expect(result.current.jobSiteSuggestions).toHaveLength(1)
    })
  })

  it("should handle address selection", () => {
    const { result } = renderHook(() =>
      useServiceRequestForm({ user: mockUser })
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

    expect(result.current.jobSiteInput).toBe("123 Main St, City, State")
    expect(result.current.form.getValues("jobSite")).toBe(
      "123 Main St, City, State"
    )
    expect(result.current.jobSiteSuggestions).toHaveLength(0)
  })

  it("should handle geocoding service errors gracefully", async () => {
    mockGeocodingService.searchAddresses.mockResolvedValue({
      success: false,
      error: { message: "Service unavailable" },
    })

    const { result } = renderHook(() =>
      useServiceRequestForm({ user: mockUser })
    )

    act(() => {
      result.current.handleJobSiteInputChange("123 Main")
    })

    await waitFor(
      () => {
        expect(mockGeocodingService.searchAddresses).toHaveBeenCalled()
      },
      { timeout: 500 }
    )

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: "Address search unavailable",
        description: "Service unavailable",
        variant: "destructive",
      })
    })
  })

  it("should submit form successfully", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "request-1" }),
    })

    const { result } = renderHook(() =>
      useServiceRequestForm({ user: mockUser })
    )

    const formData = {
      contactName: "John Doe",
      contactEmail: "john@example.com",
      contactPhone: "555-1234",
      company: "Test Company",
      title: "Test Request",
      description: "Test description",
      jobSite: "123 Main St",
      transport: "WE_HANDLE_IT" as const,
      startDate: "2024-01-01",
      endDate: "2024-01-02",
      equipmentCategory: "SKID_STEERS_TRACK_LOADERS" as const,
      equipmentDetail: "Small loader",
      requestedDurationType: "FULL_DAY" as const,
      requestedDurationValue: 1,
      requestedTotalHours: 8,
      rateType: "DAILY" as const,
      baseRate: 500,
    }

    await act(async () => {
      await result.current.onSubmit(formData)
    })

    expect(global.fetch).toHaveBeenCalledWith("/api/service-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    expect(toast).toHaveBeenCalledWith({
      description: "Your service request has been created successfully.",
    })

    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard")
    expect(mockRouter.refresh).toHaveBeenCalled()
  })

  it("should handle form submission errors", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => [{ message: "Validation failed" }],
    })

    const { result } = renderHook(() =>
      useServiceRequestForm({ user: mockUser })
    )

    const formData = {
      contactName: "John Doe",
      contactEmail: "john@example.com",
      contactPhone: "555-1234",
      company: "Test Company",
      title: "Test Request",
      description: "Test description",
      jobSite: "123 Main St",
      transport: "WE_HANDLE_IT" as const,
      startDate: "2024-01-01",
      endDate: "2024-01-02",
      equipmentCategory: "SKID_STEERS_TRACK_LOADERS" as const,
      equipmentDetail: "Small loader",
      requestedDurationType: "FULL_DAY" as const,
      requestedDurationValue: 1,
      requestedTotalHours: 8,
      rateType: "DAILY" as const,
      baseRate: 500,
    }

    await act(async () => {
      await result.current.onSubmit(formData)
    })

    expect(toast).toHaveBeenCalledWith({
      title: "Failed to create service request",
      description: "Validation error: Validation failed",
      variant: "destructive",
    })
  })

  it("should handle network errors", async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() =>
      useServiceRequestForm({ user: mockUser })
    )

    const formData = {
      contactName: "John Doe",
      contactEmail: "john@example.com",
      contactPhone: "555-1234",
      company: "Test Company",
      title: "Test Request",
      description: "Test description",
      jobSite: "123 Main St",
      transport: "WE_HANDLE_IT" as const,
      startDate: "2024-01-01",
      endDate: "2024-01-02",
      equipmentCategory: "SKID_STEERS_TRACK_LOADERS" as const,
      equipmentDetail: "Small loader",
      requestedDurationType: "FULL_DAY" as const,
      requestedDurationValue: 1,
      requestedTotalHours: 8,
      rateType: "DAILY" as const,
      baseRate: 500,
    }

    await act(async () => {
      await result.current.onSubmit(formData)
    })

    expect(toast).toHaveBeenCalledWith({
      title: "Network error",
      description:
        "Unable to connect to the server. Please check your internet connection and try again.",
      variant: "destructive",
    })
  })
})
