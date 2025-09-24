/**
 * ServiceRequestForm Geocoding Integration Tests
 *
 * Tests the integration between ServiceRequestForm and the new GeocodingService
 * to ensure the refactoring maintains existing functionality.
 */

import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ServiceRequestForm } from "@/components/service-request-form"
import { ServiceFactory, type GeocodingAddress } from "@/lib/services"

// Mock the service factory
jest.mock("@/lib/services", () => ({
  ServiceFactory: {
    getGeocodingService: jest.fn(),
  },
}))

// Mock toast
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}))

// Mock router
const mockPush = jest.fn()
const mockRefresh = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

describe("ServiceRequestForm Geocoding Integration", () => {
  const mockUser = {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
  }

  const mockGeocodingService = {
    searchAddresses: jest.fn(),
    reverseGeocode: jest.fn(),
    clearCache: jest.fn(),
    getCacheStats: jest.fn(),
    getServiceName: jest.fn().mockReturnValue("GeocodingService"),
  }

  const mockAddresses: GeocodingAddress[] = [
    {
      displayName: "123 Main St, Anytown, NY 10001, USA",
      coordinates: { latitude: 40.7128, longitude: -74.006 },
      placeId: "12345",
      components: {
        streetNumber: "123",
        streetName: "Main St",
        city: "Anytown",
        state: "NY",
        postalCode: "10001",
        country: "USA",
      },
    },
    {
      displayName: "456 Oak Ave, Somewhere, NY 10002, USA",
      coordinates: { latitude: 40.7589, longitude: -73.9851 },
      placeId: "67890",
      components: {
        streetNumber: "456",
        streetName: "Oak Ave",
        city: "Somewhere",
        state: "NY",
        postalCode: "10002",
        country: "USA",
      },
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(ServiceFactory.getGeocodingService as jest.Mock).mockReturnValue(
      mockGeocodingService
    )
    mockGeocodingService.searchAddresses.mockResolvedValue({
      success: true,
      data: mockAddresses,
    })
  })

  describe("Address Search Integration", () => {
    it("should use geocoding service for address search", async () => {
      const user = userEvent.setup()

      render(<ServiceRequestForm user={mockUser} />)

      const jobSiteInput = screen.getByLabelText(/job site address/i)

      // Type in the address field
      await user.type(jobSiteInput, "123 Main")

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
        { timeout: 1000 }
      )
    })

    it("should display address suggestions from geocoding service", async () => {
      const user = userEvent.setup()

      render(<ServiceRequestForm user={mockUser} />)

      const jobSiteInput = screen.getByLabelText(/job site address/i)

      // Type in the address field
      await user.type(jobSiteInput, "123 Main")

      // Wait for suggestions to appear
      await waitFor(() => {
        expect(screen.getByText("123 Main St")).toBeInTheDocument()
        expect(screen.getByText("456 Oak Ave")).toBeInTheDocument()
      })

      // Check that full addresses are shown in the details
      expect(
        screen.getByText("123 Main St, Anytown, NY 10001, USA")
      ).toBeInTheDocument()
      expect(
        screen.getByText("456 Oak Ave, Somewhere, NY 10002, USA")
      ).toBeInTheDocument()
    })

    it("should select address suggestion and update form", async () => {
      const user = userEvent.setup()

      render(<ServiceRequestForm user={mockUser} />)

      const jobSiteInput = screen.getByLabelText(/job site address/i)

      // Type in the address field
      await user.type(jobSiteInput, "123 Main")

      // Wait for suggestions to appear
      await waitFor(() => {
        expect(screen.getByText("123 Main St")).toBeInTheDocument()
      })

      // Click on the first suggestion
      await user.click(screen.getByText("123 Main St"))

      // Check that the input value was updated
      expect(jobSiteInput).toHaveValue("123 Main St, Anytown, NY 10001, USA")

      // Check that suggestions are hidden
      expect(screen.queryByText("456 Oak Ave")).not.toBeInTheDocument()
    })

    it("should handle keyboard navigation for address selection", async () => {
      const user = userEvent.setup()

      render(<ServiceRequestForm user={mockUser} />)

      const jobSiteInput = screen.getByLabelText(/job site address/i)

      // Type in the address field
      await user.type(jobSiteInput, "123 Main")

      // Wait for suggestions to appear
      await waitFor(() => {
        expect(screen.getByText("123 Main St")).toBeInTheDocument()
      })

      // Use keyboard to select suggestion
      const firstSuggestion = screen.getByRole("button", {
        name: /123 Main St/,
      })
      firstSuggestion.focus()
      await user.keyboard("{Enter}")

      // Check that the input value was updated
      expect(jobSiteInput).toHaveValue("123 Main St, Anytown, NY 10001, USA")
    })

    it("should not search for queries less than 3 characters", async () => {
      const user = userEvent.setup()

      render(<ServiceRequestForm user={mockUser} />)

      const jobSiteInput = screen.getByLabelText(/job site address/i)

      // Type short query
      await user.type(jobSiteInput, "12")

      // Wait a bit to ensure debounce would have triggered
      await waitFor(
        () => {
          expect(mockGeocodingService.searchAddresses).not.toHaveBeenCalled()
        },
        { timeout: 500 }
      )
    })

    it("should show loading indicator during search", async () => {
      const user = userEvent.setup()

      // Make the service take some time to respond
      mockGeocodingService.searchAddresses.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ success: true, data: [] }), 100)
          )
      )

      render(<ServiceRequestForm user={mockUser} />)

      const jobSiteInput = screen.getByLabelText(/job site address/i)

      // Type in the address field
      await user.type(jobSiteInput, "123 Main")

      // Check for loading spinner by class name since it doesn't have role="status"
      await waitFor(() => {
        expect(document.querySelector(".animate-spin")).toBeInTheDocument()
      })
    })
  })

  describe("Error Handling", () => {
    it("should handle geocoding service errors gracefully", async () => {
      const user = userEvent.setup()
      const mockToast = jest.requireMock("@/components/ui/use-toast")

      // Mock service error
      mockGeocodingService.searchAddresses.mockResolvedValue({
        success: false,
        error: {
          code: "ALL_PROVIDERS_FAILED",
          message: "Unable to search for addresses at the moment.",
          timestamp: new Date(),
        },
      })

      render(<ServiceRequestForm user={mockUser} />)

      const jobSiteInput = screen.getByLabelText(/job site address/i)

      // Type in the address field
      await user.type(jobSiteInput, "123 Main")

      // Wait for error handling
      await waitFor(() => {
        expect(mockToast.toast).toHaveBeenCalledWith({
          title: "Address search unavailable",
          description: "Unable to search for addresses at the moment.",
          variant: "destructive",
        })
      })
    })

    it("should handle unexpected errors gracefully", async () => {
      const user = userEvent.setup()
      const mockToast = jest.requireMock("@/components/ui/use-toast")

      // Mock service throwing an error
      mockGeocodingService.searchAddresses.mockRejectedValue(
        new Error("Network error")
      )

      render(<ServiceRequestForm user={mockUser} />)

      const jobSiteInput = screen.getByLabelText(/job site address/i)

      // Type in the address field
      await user.type(jobSiteInput, "123 Main")

      // Wait for error handling
      await waitFor(() => {
        expect(mockToast.toast).toHaveBeenCalledWith({
          title: "Address search unavailable",
          description:
            "Unable to search for addresses at the moment. Please enter the address manually.",
          variant: "destructive",
        })
      })
    })

    it("should handle rate limiting errors", async () => {
      const user = userEvent.setup()
      const mockToast = jest.requireMock("@/components/ui/use-toast")

      // Mock rate limiting error
      mockGeocodingService.searchAddresses.mockResolvedValue({
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message:
            "Too many geocoding requests. Please wait before trying again.",
          timestamp: new Date(),
        },
      })

      render(<ServiceRequestForm user={mockUser} />)

      const jobSiteInput = screen.getByLabelText(/job site address/i)

      // Type in the address field
      await user.type(jobSiteInput, "123 Main")

      // Wait for error handling
      await waitFor(() => {
        expect(mockToast.toast).toHaveBeenCalledWith({
          title: "Address search unavailable",
          description:
            "Too many geocoding requests. Please wait before trying again.",
          variant: "destructive",
        })
      })
    })
  })

  describe("Service Integration", () => {
    it("should get geocoding service from ServiceFactory", () => {
      render(<ServiceRequestForm user={mockUser} />)

      expect(ServiceFactory.getGeocodingService).toHaveBeenCalled()
    })

    it("should pass correct options to geocoding service", async () => {
      const user = userEvent.setup()

      render(<ServiceRequestForm user={mockUser} />)

      const jobSiteInput = screen.getByLabelText(/job site address/i)

      // Type in the address field
      await user.type(jobSiteInput, "123 Main Street")

      // Wait for debounced search
      await waitFor(() => {
        expect(mockGeocodingService.searchAddresses).toHaveBeenCalledWith(
          "123 Main Street",
          {
            limit: 5,
            countryCode: "us",
          }
        )
      })
    })

    it("should handle empty results from service", async () => {
      const user = userEvent.setup()

      // Mock empty results
      mockGeocodingService.searchAddresses.mockResolvedValue({
        success: true,
        data: [],
      })

      render(<ServiceRequestForm user={mockUser} />)

      const jobSiteInput = screen.getByLabelText(/job site address/i)

      // Type in the address field
      await user.type(jobSiteInput, "nonexistent address")

      // Wait for search to complete
      await waitFor(() => {
        expect(mockGeocodingService.searchAddresses).toHaveBeenCalled()
      })

      // Should not show any address suggestion buttons (but submit button will still be there)
      expect(screen.queryByText(/123 Main St/)).not.toBeInTheDocument()
      expect(screen.queryByText(/456 Oak Ave/)).not.toBeInTheDocument()
    })
  })

  describe("Debouncing", () => {
    it("should debounce address search requests", async () => {
      const user = userEvent.setup()

      render(<ServiceRequestForm user={mockUser} />)

      const jobSiteInput = screen.getByLabelText(/job site address/i)

      // Type the entire string at once to avoid multiple debounce triggers
      await user.type(jobSiteInput, "123 Main St")

      // Wait for debounce to settle
      await waitFor(
        () => {
          expect(mockGeocodingService.searchAddresses).toHaveBeenCalledTimes(1)
          expect(mockGeocodingService.searchAddresses).toHaveBeenCalledWith(
            "123 Main St",
            {
              limit: 5,
              countryCode: "us",
            }
          )
        },
        { timeout: 1000 }
      )
    })
  })
})
