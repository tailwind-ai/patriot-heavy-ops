/**
 * OperatorApplicationForm Component Tests
 *
 * Tests the presentation layer and user interactions of OperatorApplicationForm.
 * Business logic is tested separately in the hook tests.
 */

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { OperatorApplicationForm } from "@/components/operator-application-form"
import { useOperatorApplicationForm } from "@/hooks/use-operator-application-form"

// Mock the custom hook
jest.mock("@/hooks/use-operator-application-form", () => ({
  useOperatorApplicationForm: jest.fn(),
}))

// Mock the toast hook
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}))

describe("OperatorApplicationForm Component", () => {
  const mockUser = {
    id: "test-user-id",
    name: "Test User",
  }

  const mockHookReturn = {
    form: {
      handleSubmit: jest.fn((fn) => (e: any) => {
        e.preventDefault()
        fn({})
      }),
      formState: { errors: {} },
    },
    onSubmit: jest.fn(),
    isSaving: false,
    isLoading: false,
    inputValue: "",
    suggestions: [],
    handleInputChange: jest.fn(),
    handleAddressSelect: jest.fn(),
    handleSuggestionsBlur: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useOperatorApplicationForm as jest.Mock).mockReturnValue(mockHookReturn)
  })

  describe("Component Rendering", () => {
    it("should render the operator application form", () => {
      render(<OperatorApplicationForm user={mockUser} />)

      expect(
        screen.getByText("Apply to Become an Operator")
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          "Are you a heavy equipment operator? Enter your service area so we can show job requests near you."
        )
      ).toBeInTheDocument()
      expect(screen.getByText("Service Area")).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText("Enter city, state, or address...")
      ).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: /apply now/i })
      ).toBeInTheDocument()
    })

    it("should have proper form structure and accessibility", () => {
      render(<OperatorApplicationForm user={mockUser} />)

      const form = document.querySelector("form")
      expect(form).toBeInTheDocument()

      const locationInput = screen.getByPlaceholderText(
        "Enter city, state, or address..."
      )
      expect(locationInput).toHaveAttribute(
        "placeholder",
        "Enter city, state, or address..."
      )

      const submitButton = screen.getByRole("button", { name: /apply now/i })
      expect(submitButton).toHaveAttribute("type", "submit")
    })

    it("should render with custom className", () => {
      const { container } = render(
        <OperatorApplicationForm user={mockUser} className="custom-class" />
      )

      const form = container.querySelector("form")
      expect(form).toHaveClass("custom-class")
    })
  })

  describe("User Interactions", () => {
    it("should call hook's handleInputChange when location input changes", async () => {
      const user = userEvent.setup()
      render(<OperatorApplicationForm user={mockUser} />)

      const locationInput = screen.getByPlaceholderText(
        "Enter city, state, or address..."
      )

      await user.type(locationInput, "Austin")

      expect(mockHookReturn.handleInputChange).toHaveBeenCalled()
    })

    it("should call form submission handler when form is submitted", async () => {
      const user = userEvent.setup()
      render(<OperatorApplicationForm user={mockUser} />)

      const submitButton = screen.getByRole("button", { name: /apply now/i })
      await user.click(submitButton)

      expect(mockHookReturn.form.handleSubmit).toHaveBeenCalled()
    })

    it("should call handleSuggestionsBlur when input loses focus", async () => {
      const user = userEvent.setup()
      render(<OperatorApplicationForm user={mockUser} />)

      const locationInput = screen.getByPlaceholderText(
        "Enter city, state, or address..."
      )

      await user.click(locationInput)
      await user.tab() // Move focus away

      expect(mockHookReturn.handleSuggestionsBlur).toHaveBeenCalled()
    })
  })

  describe("Loading States", () => {
    it("should display loading state when saving", () => {
      const loadingHookReturn = {
        ...mockHookReturn,
        isSaving: true,
      }
      ;(useOperatorApplicationForm as jest.Mock).mockReturnValue(
        loadingHookReturn
      )

      render(<OperatorApplicationForm user={mockUser} />)

      const submitButton = screen.getByRole("button", { name: /apply now/i })
      expect(submitButton).toBeDisabled()
      expect(screen.getByText("Apply Now")).toBeInTheDocument()
    })

    it("should display loading spinner when saving", () => {
      const loadingHookReturn = {
        ...mockHookReturn,
        isSaving: true,
      }
      ;(useOperatorApplicationForm as jest.Mock).mockReturnValue(
        loadingHookReturn
      )

      render(<OperatorApplicationForm user={mockUser} />)

      expect(document.querySelector(".animate-spin")).toBeInTheDocument()
    })

    it("should show loading spinner when searching addresses", () => {
      const loadingHookReturn = {
        ...mockHookReturn,
        isLoading: true,
      }
      ;(useOperatorApplicationForm as jest.Mock).mockReturnValue(
        loadingHookReturn
      )

      render(<OperatorApplicationForm user={mockUser} />)

      expect(document.querySelector(".animate-spin")).toBeInTheDocument()
    })
  })

  describe("Address Suggestions", () => {
    it("should display address suggestions when provided by hook", () => {
      const suggestionsHookReturn = {
        ...mockHookReturn,
        suggestions: [
          {
            placeId: "place-1",
            displayName: "Austin, TX, USA",
            coordinates: { latitude: 30.2672, longitude: -97.7431 },
            components: {
              streetNumber: "",
              streetName: "",
              city: "Austin",
              state: "TX",
              postalCode: "",
              country: "USA",
            },
          },
          {
            placeId: "place-2",
            displayName: "Austin, MN, USA",
            coordinates: { latitude: 43.6667, longitude: -92.9735 },
            components: {
              streetNumber: "",
              streetName: "",
              city: "Austin",
              state: "MN",
              postalCode: "",
              country: "USA",
            },
          },
        ],
      }
      ;(useOperatorApplicationForm as jest.Mock).mockReturnValue(
        suggestionsHookReturn
      )

      render(<OperatorApplicationForm user={mockUser} />)

      expect(screen.getAllByText("Austin")).toHaveLength(2) // Two Austin entries
      expect(screen.getByText("Austin, TX, USA")).toBeInTheDocument()
      expect(screen.getByText("Austin, MN, USA")).toBeInTheDocument()
    })

    it("should call handleAddressSelect when suggestion is clicked", async () => {
      const user = userEvent.setup()
      const suggestionsHookReturn = {
        ...mockHookReturn,
        suggestions: [
          {
            placeId: "place-1",
            displayName: "Austin, TX, USA",
            coordinates: { latitude: 30.2672, longitude: -97.7431 },
            components: {
              streetNumber: "",
              streetName: "",
              city: "Austin",
              state: "TX",
              postalCode: "",
              country: "USA",
            },
          },
        ],
      }
      ;(useOperatorApplicationForm as jest.Mock).mockReturnValue(
        suggestionsHookReturn
      )

      render(<OperatorApplicationForm user={mockUser} />)

      const suggestion = screen.getByText("Austin, TX, USA")
      await user.click(suggestion)

      expect(mockHookReturn.handleAddressSelect).toHaveBeenCalledWith({
        placeId: "place-1",
        displayName: "Austin, TX, USA",
        coordinates: { latitude: 30.2672, longitude: -97.7431 },
        components: {
          streetNumber: "",
          streetName: "",
          city: "Austin",
          state: "TX",
          postalCode: "",
          country: "USA",
        },
      })
    })

    it("should handle keyboard navigation for suggestions", async () => {
      const suggestionsHookReturn = {
        ...mockHookReturn,
        suggestions: [
          {
            placeId: "place-1",
            displayName: "Austin, TX, USA",
            coordinates: { latitude: 30.2672, longitude: -97.7431 },
            components: {
              streetNumber: "",
              streetName: "",
              city: "Austin",
              state: "TX",
              postalCode: "",
              country: "USA",
            },
          },
        ],
      }
      ;(useOperatorApplicationForm as jest.Mock).mockReturnValue(
        suggestionsHookReturn
      )

      render(<OperatorApplicationForm user={mockUser} />)

      const suggestionButtons = screen.getAllByRole("button")
      const addressSuggestion = suggestionButtons.find((button) =>
        button.textContent?.includes("Austin")
      )

      expect(addressSuggestion).toBeDefined()
      expect(addressSuggestion).toHaveAttribute("tabIndex", "0")
    })
  })

  describe("Form Input Values", () => {
    it("should display input value from hook", () => {
      const valueHookReturn = {
        ...mockHookReturn,
        inputValue: "Austin, TX",
      }
      ;(useOperatorApplicationForm as jest.Mock).mockReturnValue(
        valueHookReturn
      )

      render(<OperatorApplicationForm user={mockUser} />)

      const locationInput = screen.getByPlaceholderText(
        "Enter city, state, or address..."
      )
      expect(locationInput).toHaveValue("Austin, TX")
    })
  })

  describe("Form Validation", () => {
    it("should display validation errors from hook", () => {
      const errorHookReturn = {
        ...mockHookReturn,
        form: {
          ...mockHookReturn.form,
          formState: {
            errors: {
              location: { message: "Please select a location" },
            },
          },
        },
      }
      ;(useOperatorApplicationForm as jest.Mock).mockReturnValue(
        errorHookReturn
      )

      render(<OperatorApplicationForm user={mockUser} />)

      expect(screen.getByText("Please select a location")).toBeInTheDocument()
    })
  })

  describe("Component Props", () => {
    it("should accept and use custom props", () => {
      const { container } = render(
        <OperatorApplicationForm
          user={mockUser}
          data-testid="operator-form"
          aria-label="Operator Application"
        />
      )

      const form = container.querySelector("form")
      expect(form).toHaveAttribute("data-testid", "operator-form")
      expect(form).toHaveAttribute("aria-label", "Operator Application")
    })

    it("should pass user prop to hook", () => {
      render(<OperatorApplicationForm user={mockUser} />)

      expect(useOperatorApplicationForm).toHaveBeenCalledWith({
        user: mockUser,
      })
    })

    it("should work with different user objects", () => {
      const differentUser = {
        id: "different-user-id",
        name: "Different User",
      }

      render(<OperatorApplicationForm user={differentUser} />)

      expect(
        screen.getByText("Apply to Become an Operator")
      ).toBeInTheDocument()
      expect(useOperatorApplicationForm).toHaveBeenCalledWith({
        user: differentUser,
      })
    })
  })
})
