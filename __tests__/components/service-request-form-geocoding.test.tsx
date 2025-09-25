/**
 * ServiceRequestForm Component Tests
 *
 * Tests the presentation layer and user interactions of ServiceRequestForm.
 * Business logic is tested separately in the hook tests.
 */

import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ServiceRequestForm } from "@/components/service-request-form"
import { useServiceRequestForm } from "@/hooks/use-service-request-form"

// Mock the custom hook
jest.mock("@/hooks/use-service-request-form", () => ({
  useServiceRequestForm: jest.fn(),
}))

// Mock toast
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}))

describe("ServiceRequestForm Component", () => {
  const mockUser = {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
  }

  const mockHookReturn = {
    form: {
      register: jest.fn(() => ({})),
      handleSubmit: jest.fn((fn) => (e: any) => {
        e.preventDefault()
        fn({})
      }),
      setValue: jest.fn(),
      formState: { errors: {} },
    },
    onSubmit: jest.fn(),
    isSaving: false,
    isLoadingAddresses: false,
    jobSiteInput: "",
    jobSiteSuggestions: [],
    handleJobSiteInputChange: jest.fn(),
    handleAddressSelect: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useServiceRequestForm as jest.Mock).mockReturnValue(mockHookReturn)
  })

  describe("Component Rendering", () => {
    it("should render all form sections", () => {
      render(<ServiceRequestForm user={mockUser} />)

      expect(screen.getByText("Contact Information")).toBeInTheDocument()
      expect(screen.getByText("Service Request Details")).toBeInTheDocument()
      expect(screen.getByText("Job Site Information")).toBeInTheDocument()
      expect(screen.getByText("Equipment Requirements")).toBeInTheDocument()
      expect(screen.getByText("Duration & Pricing")).toBeInTheDocument()
    })

    it("should render all form fields", () => {
      render(<ServiceRequestForm user={mockUser} />)

      // Contact Information
      expect(screen.getByLabelText(/contact name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/company/i)).toBeInTheDocument()

      // Service Request Details
      expect(screen.getByLabelText(/request title/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()

      // Job Site Information
      expect(screen.getByLabelText(/job site address/i)).toBeInTheDocument()
      expect(screen.getByText(/equipment transport/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/start date/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/end date/i)).toBeInTheDocument()

      // Equipment Requirements
      expect(screen.getByLabelText(/equipment category/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/equipment details/i)).toBeInTheDocument()

      // Duration & Pricing
      expect(screen.getByLabelText(/duration type/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/duration value/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/total hours/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/rate type/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/base rate/i)).toBeInTheDocument()
    })

    it("should render submit button", () => {
      render(<ServiceRequestForm user={mockUser} />)

      const submitButton = screen.getByRole("button", { name: /submit service request/i })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toHaveAttribute("type", "submit")
    })
  })

  describe("User Interactions", () => {
    it("should call hook's handleJobSiteInputChange when job site input changes", async () => {
      const user = userEvent.setup()
      render(<ServiceRequestForm user={mockUser} />)

      const jobSiteInput = screen.getByLabelText(/job site address/i)
      await user.type(jobSiteInput, "123 Main St")

      expect(mockHookReturn.handleJobSiteInputChange).toHaveBeenCalled()
    })

    it("should call form submission handler when form is submitted", async () => {
      const user = userEvent.setup()
      render(<ServiceRequestForm user={mockUser} />)

      const submitButton = screen.getByRole("button", { name: /submit service request/i })
      await user.click(submitButton)

      expect(mockHookReturn.form.handleSubmit).toHaveBeenCalled()
    })

    it("should display loading state when saving", () => {
      const loadingHookReturn = {
        ...mockHookReturn,
        isSaving: true,
      }
      ;(useServiceRequestForm as jest.Mock).mockReturnValue(loadingHookReturn)

      render(<ServiceRequestForm user={mockUser} />)

      const submitButton = screen.getByRole("button", { name: /submit service request/i })
      expect(submitButton).toBeDisabled()
      expect(screen.getByText("Submit Service Request")).toBeInTheDocument()
    })

    it("should display loading spinner when saving", () => {
      const loadingHookReturn = {
        ...mockHookReturn,
        isSaving: true,
      }
      ;(useServiceRequestForm as jest.Mock).mockReturnValue(loadingHookReturn)

      render(<ServiceRequestForm user={mockUser} />)

      expect(document.querySelector(".animate-spin")).toBeInTheDocument()
    })
  })

  describe("Address Suggestions", () => {
    it("should display address suggestions when provided by hook", () => {
      const suggestionsHookReturn = {
        ...mockHookReturn,
        jobSiteSuggestions: [
          {
            placeId: "place-1",
            displayName: "123 Main St, City, State",
          },
          {
            placeId: "place-2", 
            displayName: "456 Oak Ave, City, State",
          },
        ],
      }
      ;(useServiceRequestForm as jest.Mock).mockReturnValue(suggestionsHookReturn)

      render(<ServiceRequestForm user={mockUser} />)

      expect(screen.getByText("123 Main St")).toBeInTheDocument()
      expect(screen.getByText("456 Oak Ave")).toBeInTheDocument()
    })

    it("should call handleAddressSelect when suggestion is clicked", async () => {
      const user = userEvent.setup()
      const suggestionsHookReturn = {
        ...mockHookReturn,
        jobSiteSuggestions: [
          {
            placeId: "place-1",
            displayName: "123 Main St, City, State",
          },
        ],
      }
      ;(useServiceRequestForm as jest.Mock).mockReturnValue(suggestionsHookReturn)

      render(<ServiceRequestForm user={mockUser} />)

      const suggestion = screen.getByText("123 Main St")
      await user.click(suggestion)

      expect(mockHookReturn.handleAddressSelect).toHaveBeenCalledWith({
        placeId: "place-1",
        displayName: "123 Main St, City, State",
      })
    })

    it("should show loading spinner when addresses are loading", () => {
      const loadingHookReturn = {
        ...mockHookReturn,
        isLoadingAddresses: true,
      }
      ;(useServiceRequestForm as jest.Mock).mockReturnValue(loadingHookReturn)

      render(<ServiceRequestForm user={mockUser} />)

      expect(document.querySelector(".animate-spin")).toBeInTheDocument()
    })

    it("should handle keyboard navigation for suggestions", async () => {
      const user = userEvent.setup()
      const suggestionsHookReturn = {
        ...mockHookReturn,
        jobSiteSuggestions: [
          {
            placeId: "place-1",
            displayName: "123 Main St, City, State",
          },
        ],
      }
      ;(useServiceRequestForm as jest.Mock).mockReturnValue(suggestionsHookReturn)

      render(<ServiceRequestForm user={mockUser} />)

      const suggestionButtons = screen.getAllByRole("button")
      const addressSuggestion = suggestionButtons.find(button => 
        button.textContent?.includes("123 Main St")
      )
      
      expect(addressSuggestion).toBeDefined()
      expect(addressSuggestion).toHaveAttribute("tabIndex", "0")
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
              contactName: { message: "Contact name is required" },
              jobSite: { message: "Job site is required" },
            },
          },
        },
      }
      ;(useServiceRequestForm as jest.Mock).mockReturnValue(errorHookReturn)

      render(<ServiceRequestForm user={mockUser} />)

      expect(screen.getByText("Contact name is required")).toBeInTheDocument()
      expect(screen.getByText("Job site is required")).toBeInTheDocument()
    })
  })

  describe("Component Props", () => {
    it("should accept custom className", () => {
      const { container } = render(
        <ServiceRequestForm user={mockUser} className="custom-class" />
      )

      const form = container.querySelector("form")
      expect(form).toHaveClass("custom-class")
    })

    it("should pass user prop to hook", () => {
      render(<ServiceRequestForm user={mockUser} />)

      expect(useServiceRequestForm).toHaveBeenCalledWith({ user: mockUser })
    })
  })
})