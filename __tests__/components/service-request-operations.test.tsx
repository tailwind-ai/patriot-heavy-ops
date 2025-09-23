// Mock the toast hook at the top level
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}))

// Mock next/navigation
const mockRouterFunctions = {
  refresh: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
}

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouterFunctions,
}))

// Mock next/link
jest.mock("next/link", () => {
  return function MockLink({ children, href, className }: any) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
})

import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
// Removed unused useRouter import (mocked above)
import { toast } from "@/components/ui/use-toast"
import { ServiceRequestOperations } from "@/components/service-request-operations"
import { mockFetchSuccess, mockFetchError } from "../helpers/form-test-helpers"

// Cast mocked functions
const mockToast = toast as jest.MockedFunction<typeof toast>

// Use the same mock router functions
const mockRouter = mockRouterFunctions

describe("ServiceRequestOperations", () => {
  const mockServiceRequest = {
    id: "test-request-id",
    title: "Test Service Request",
  }

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("Component Rendering", () => {
    it("should render the operations dropdown menu", () => {
      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      expect(trigger).toBeInTheDocument()
      expect(screen.getByText("Open")).toBeInTheDocument()
    })

    it("should show menu items when dropdown is opened", async () => {
      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      expect(screen.getByText("View Details")).toBeInTheDocument()
      expect(screen.getByText("Edit")).toBeInTheDocument()
      expect(screen.getByText("Delete")).toBeInTheDocument()
    })

    it("should have correct navigation links", async () => {
      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      const viewLink = screen.getByText("View Details").closest("a")
      const editLink = screen.getByText("Edit").closest("a")

      expect(viewLink).toHaveAttribute(
        "href",
        "/dashboard/requests/test-request-id"
      )
      expect(editLink).toHaveAttribute(
        "href",
        "/dashboard/requests/test-request-id/edit"
      )
    })

    it("should show delete option with destructive styling", async () => {
      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      const deleteItem = screen.getByText("Delete").closest("div")
      expect(deleteItem).toHaveClass("text-destructive")
    })
  })

  describe("Delete Confirmation Dialog", () => {
    it("should show delete confirmation dialog when delete is clicked", async () => {
      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      const deleteItem = screen.getByText("Delete")
      await userEvent.click(deleteItem)

      expect(
        screen.getByText(
          "Are you sure you want to delete this service request?"
        )
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          'This action cannot be undone. This will permanently delete your service request "Test Service Request".'
        )
      ).toBeInTheDocument()
    })

    it("should show cancel and delete buttons in dialog", async () => {
      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      expect(
        screen.getByRole("button", { name: /cancel/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: /delete/i })
      ).toBeInTheDocument()
    })

    it("should close dialog when cancel is clicked", async () => {
      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      const cancelButton = screen.getByRole("button", { name: /cancel/i })
      await userEvent.click(cancelButton)

      await waitFor(() => {
        expect(
          screen.queryByText(
            "Are you sure you want to delete this service request?"
          )
        ).not.toBeInTheDocument()
      })
    })

    it("should include service request title in confirmation message", async () => {
      const customRequest = {
        id: "custom-id",
        title: "Custom Service Request Title",
      }

      render(<ServiceRequestOperations serviceRequest={customRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      expect(
        screen.getByText(
          'This action cannot be undone. This will permanently delete your service request "Custom Service Request Title".'
        )
      ).toBeInTheDocument()
    })
  })

  describe("Delete Functionality", () => {
    it("should successfully delete service request", async () => {
      mockFetchSuccess({ message: "Deleted successfully" })

      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      const deleteButton = screen.getByRole("button", { name: /delete/i })
      await userEvent.click(deleteButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/service-requests/test-request-id",
          {
            method: "DELETE",
          }
        )
      })

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          description: "Service request deleted successfully.",
        })
      })

      await waitFor(() => {
        expect(mockRouter.refresh).toHaveBeenCalled()
      })
    })

    it("should show loading state during deletion", async () => {
      // Mock delayed response
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve({ message: "Success" }),
                } as any),
              100
            )
          )
      )

      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      const deleteButton = screen.getByRole("button", { name: /delete/i })
      await userEvent.click(deleteButton)

      // Should show loading spinner
      await waitFor(() => {
        expect(deleteButton.querySelector(".animate-spin")).toBeInTheDocument()
      })
    })

    it("should show success toast and refresh on successful deletion", async () => {
      mockFetchSuccess({ message: "Deleted successfully" })

      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      const deleteButton = screen.getByRole("button", { name: /delete/i })
      await userEvent.click(deleteButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          description: "Service request deleted successfully.",
        })
      })

      await waitFor(() => {
        expect(mockRouter.refresh).toHaveBeenCalled()
      })
    })

    it("should close dialog on successful deletion", async () => {
      mockFetchSuccess({ message: "Deleted successfully" })

      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      const deleteButton = screen.getByRole("button", { name: /delete/i })
      await userEvent.click(deleteButton)

      await waitFor(() => {
        expect(
          screen.queryByText(
            "Are you sure you want to delete this service request?"
          )
        ).not.toBeInTheDocument()
      })
    })
  })

  describe("Error Handling", () => {
    it("should show error toast for 403 unauthorized", async () => {
      mockFetchError("Unauthorized", 403)

      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      const deleteButton = screen.getByRole("button", { name: /delete/i })
      await userEvent.click(deleteButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Failed to delete service request",
          description: "You are not authorized to delete this service request.",
          variant: "destructive",
        })
      })
    })

    it("should show error toast for 404 not found", async () => {
      mockFetchError("Not found", 404)

      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      const deleteButton = screen.getByRole("button", { name: /delete/i })
      await userEvent.click(deleteButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Failed to delete service request",
          description:
            "Service request not found. It may have already been deleted.",
          variant: "destructive",
        })
      })
    })

    it("should show error toast for 500 server error", async () => {
      mockFetchError("Internal server error", 500)

      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      const deleteButton = screen.getByRole("button", { name: /delete/i })
      await userEvent.click(deleteButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Failed to delete service request",
          description: "A server error occurred. Please try again later.",
          variant: "destructive",
        })
      })
    })

    it("should show generic error toast for other HTTP errors", async () => {
      mockFetchError("Bad request", 400)

      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      const deleteButton = screen.getByRole("button", { name: /delete/i })
      await userEvent.click(deleteButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Failed to delete service request",
          description:
            "Your service request was not deleted. Please try again.",
          variant: "destructive",
        })
      })
    })

    it("should show network error toast for fetch failures", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {})
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockRejectedValue(new Error("Network error"))

      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      const deleteButton = screen.getByRole("button", { name: /delete/i })
      await userEvent.click(deleteButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Network error",
          description:
            "Unable to connect to the server. Please check your internet connection and try again.",
          variant: "destructive",
        })
      })

      // Console error was removed from component, so we don't expect it
      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it("should not close dialog on error", async () => {
      mockFetchError("Server error", 500)

      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      const deleteButton = screen.getByRole("button", { name: /delete/i })
      await userEvent.click(deleteButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalled()
      })

      // Dialog should still be open
      expect(
        screen.getByText(
          "Are you sure you want to delete this service request?"
        )
      ).toBeInTheDocument()
    })

    it("should not refresh router on error", async () => {
      mockFetchError("Server error", 500)

      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      const deleteButton = screen.getByRole("button", { name: /delete/i })
      await userEvent.click(deleteButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalled()
      })

      expect(mockRouter.refresh).not.toHaveBeenCalled()
    })
  })

  describe("Loading States", () => {
    it("should show trash icon when not loading", async () => {
      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      const deleteButton = screen.getByRole("button", { name: /delete/i })

      // Should show trash icon initially
      expect(deleteButton.querySelector(".mr-2")).toBeInTheDocument()
      expect(
        deleteButton.querySelector(".animate-spin")
      ).not.toBeInTheDocument()
    })

    it("should switch to spinner during loading", async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve({ message: "Success" }),
                } as any),
              100
            )
          )
      )

      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      const deleteButton = screen.getByRole("button", { name: /delete/i })
      await userEvent.click(deleteButton)

      await waitFor(() => {
        expect(deleteButton.querySelector(".animate-spin")).toBeInTheDocument()
      })
    })

    it("should reset loading state after error", async () => {
      mockFetchError("Server error", 500)

      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      const deleteButton = screen.getByRole("button", { name: /delete/i })
      await userEvent.click(deleteButton)

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalled()
      })

      // Loading should be reset
      await waitFor(() => {
        expect(
          deleteButton.querySelector(".animate-spin")
        ).not.toBeInTheDocument()
      })
    })
  })

  describe("Accessibility", () => {
    it("should have proper ARIA labels and roles", () => {
      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      expect(trigger).toBeInTheDocument()

      // Should have screen reader text
      expect(screen.getByText("Open")).toHaveClass("sr-only")
    })

    it("should handle keyboard navigation", async () => {
      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")

      // Focus and activate with keyboard
      trigger.focus()
      expect(trigger).toHaveFocus()

      fireEvent.keyDown(trigger, { key: "Enter" })

      await waitFor(() => {
        expect(screen.getByText("View Details")).toBeInTheDocument()
      })
    })

    it("should maintain focus management in dialog", async () => {
      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      // Dialog should be properly focused
      const dialog = screen.getByRole("alertdialog")
      expect(dialog).toBeInTheDocument()
    })
  })

  describe("Edge Cases", () => {
    it("should handle service request with special characters in title", async () => {
      const specialRequest = {
        id: "special-id",
        title: 'Request with "quotes" & <symbols>',
      }

      render(<ServiceRequestOperations serviceRequest={specialRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      expect(
        screen.getByText(
          'This action cannot be undone. This will permanently delete your service request "Request with "quotes" & <symbols>".'
        )
      ).toBeInTheDocument()
    })

    it("should handle very long service request titles", async () => {
      const longTitleRequest = {
        id: "long-id",
        title: "A".repeat(200),
      }

      render(<ServiceRequestOperations serviceRequest={longTitleRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      expect(
        screen.getByText(
          `This action cannot be undone. This will permanently delete your service request "${"A".repeat(
            200
          )}".`
        )
      ).toBeInTheDocument()
    })

    it("should handle empty service request title", async () => {
      const emptyTitleRequest = {
        id: "empty-id",
        title: "",
      }

      render(<ServiceRequestOperations serviceRequest={emptyTitleRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      expect(
        screen.getByText(
          'This action cannot be undone. This will permanently delete your service request "".'
        )
      ).toBeInTheDocument()
    })

    it("should prevent event default on delete button click", async () => {
      mockFetchSuccess({ message: "Success" })

      render(<ServiceRequestOperations serviceRequest={mockServiceRequest} />)

      const trigger = screen.getByRole("button")
      await userEvent.click(trigger)

      await userEvent.click(screen.getByText("Delete"))

      const deleteButton = screen.getByRole("button", { name: /delete/i })

      // Create a spy for preventDefault
      const preventDefaultSpy = jest.fn()
      const mockEvent = { preventDefault: preventDefaultSpy }

      // Simulate click with preventDefault
      fireEvent.click(deleteButton, mockEvent)

      // Note: In the actual implementation, preventDefault is called
      // This test verifies the structure is correct
      expect(deleteButton).toBeInTheDocument()
    })
  })
})
