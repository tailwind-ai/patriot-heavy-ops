/**
 * Status Transition Button Component Tests (Issue #356)
 * Tests role-based status transition actions
 */

import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { StatusTransitionButton } from "@/components/workflow/status-transition-button"

describe("StatusTransitionButton", () => {
  const mockOnConfirm = jest.fn()

  beforeEach(() => {
    mockOnConfirm.mockClear()
  })

  describe("Valid Transitions", () => {
    it("renders button for SUBMITTED to UNDER_REVIEW transition", () => {
      render(
        <StatusTransitionButton
          toStatus="UNDER_REVIEW"
          label="Start Review"
          hasPermission={true}
          onConfirm={mockOnConfirm}
        />
      )

      expect(screen.getByRole("button", { name: /start review/i })).toBeInTheDocument()
    })

    it("renders button for UNDER_REVIEW to APPROVED transition", () => {
      render(
        <StatusTransitionButton
          toStatus="APPROVED"
          label="Approve Request"
          hasPermission={true}
          onConfirm={mockOnConfirm}
        />
      )

      expect(screen.getByRole("button", { name: /approve request/i })).toBeInTheDocument()
    })

    it("handles transition confirmation with reason", async () => {
      mockOnConfirm.mockResolvedValue(undefined)

      render(
        <StatusTransitionButton
          toStatus="APPROVED"
          label="Approve"
          hasPermission={true}
          onConfirm={mockOnConfirm}
        />
      )

      // Open dialog
      fireEvent.click(screen.getByRole("button", { name: /approve/i }))

      await waitFor(() => {
        expect(screen.getByText("Confirm Status Change")).toBeInTheDocument()
      })

      // Enter reason
      const reasonInput = screen.getByLabelText(/reason/i)
      fireEvent.change(reasonInput, { target: { value: "All requirements met" } })

      // Confirm
      const confirmButton = screen.getByRole("button", { name: /^confirm$/i })
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockOnConfirm).toHaveBeenCalledWith({
          reason: "All requirements met",
        })
      })
    })

    it("handles transition with both reason and notes", async () => {
      mockOnConfirm.mockResolvedValue(undefined)

      render(
        <StatusTransitionButton
          toStatus="REJECTED"
          label="Reject"
          hasPermission={true}
          onConfirm={mockOnConfirm}
        />
      )

      // Open dialog
      fireEvent.click(screen.getByRole("button", { name: /reject/i }))

      await waitFor(() => {
        expect(screen.getByText("Confirm Status Change")).toBeInTheDocument()
      })

      // Enter reason and notes
      const reasonInput = screen.getByLabelText(/reason \(optional\)/i)
      fireEvent.change(reasonInput, { target: { value: "Missing documentation" } })

      const notesInput = screen.getByLabelText(/internal notes/i)
      fireEvent.change(notesInput, { target: { value: "Need to contact customer" } })

      // Confirm
      const confirmButton = screen.getByRole("button", { name: /^confirm$/i })
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockOnConfirm).toHaveBeenCalledWith({
          reason: "Missing documentation",
          notes: "Need to contact customer",
        })
      })
    })

    it("allows transition without reason (optional)", async () => {
      mockOnConfirm.mockResolvedValue(undefined)

      render(
        <StatusTransitionButton
          toStatus="JOB_IN_PROGRESS"
          label="Start Job"
          hasPermission={true}
          onConfirm={mockOnConfirm}
        />
      )

      // Open dialog
      fireEvent.click(screen.getByRole("button", { name: /start job/i }))

      await waitFor(() => {
        expect(screen.getByText("Confirm Status Change")).toBeInTheDocument()
      })

      // Confirm without entering reason
      const confirmButton = screen.getByRole("button", { name: /^confirm$/i })
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockOnConfirm).toHaveBeenCalledWith({})
      })
    })
  })

  describe("Role Permissions", () => {
    it("renders button when user has permission", () => {
      render(
        <StatusTransitionButton
          toStatus="APPROVED"
          label="Approve"
          hasPermission={true}
          onConfirm={mockOnConfirm}
        />
      )

      expect(screen.getByRole("button", { name: /approve/i })).toBeInTheDocument()
    })

    it("does not render when user lacks permission", () => {
      render(
        <StatusTransitionButton
          toStatus="APPROVED"
          label="Approve"
          hasPermission={false}
          onConfirm={mockOnConfirm}
        />
      )

      expect(screen.queryByRole("button", { name: /approve/i })).not.toBeInTheDocument()
    })

    it("hides button for unauthorized MANAGER transition", () => {
      render(
        <StatusTransitionButton
          toStatus="PAYMENT_RECEIVED"
          label="Mark Paid"
          hasPermission={false}
          onConfirm={mockOnConfirm}
        />
      )

      expect(screen.queryByRole("button", { name: /mark paid/i })).not.toBeInTheDocument()
    })

    it("shows button for OPERATOR job execution transitions", () => {
      render(
        <StatusTransitionButton
          toStatus="JOB_COMPLETED"
          label="Complete Job"
          hasPermission={true}
          onConfirm={mockOnConfirm}
        />
      )

      expect(screen.getByRole("button", { name: /complete job/i })).toBeInTheDocument()
    })

    it("hides button for USER attempting status change", () => {
      render(
        <StatusTransitionButton
          toStatus="UNDER_REVIEW"
          label="Start Review"
          hasPermission={false}
          onConfirm={mockOnConfirm}
        />
      )

      expect(screen.queryByRole("button", { name: /start review/i })).not.toBeInTheDocument()
    })
  })

  describe("Button Variants and Loading States", () => {
    it("renders with default variant", () => {
      render(
        <StatusTransitionButton
          toStatus="APPROVED"
          label="Approve"
          hasPermission={true}
          onConfirm={mockOnConfirm}
        />
      )

      const button = screen.getByRole("button", { name: /approve/i })
      expect(button).toBeInTheDocument()
    })

    it("renders with destructive variant for rejection", () => {
      render(
        <StatusTransitionButton
          toStatus="REJECTED"
          label="Reject"
          variant="destructive"
          hasPermission={true}
          onConfirm={mockOnConfirm}
        />
      )

      const button = screen.getByRole("button", { name: /reject/i })
      expect(button).toBeInTheDocument()
    })

    it("disables button during loading", () => {
      render(
        <StatusTransitionButton
          toStatus="APPROVED"
          label="Approve"
          hasPermission={true}
          isLoading={true}
          onConfirm={mockOnConfirm}
        />
      )

      const button = screen.getByRole("button", { name: /approve/i })
      expect(button).toBeDisabled()
    })

    it("shows loading spinner when isLoading is true", () => {
      render(
        <StatusTransitionButton
          toStatus="APPROVED"
          label="Approve"
          hasPermission={true}
          isLoading={true}
          onConfirm={mockOnConfirm}
        />
      )

      // Lucide Loader2 icon should be present
      const button = screen.getByRole("button", { name: /approve/i })
      expect(button).toBeInTheDocument()
      expect(button).toBeDisabled()
    })

    it("disables button during submission", async () => {
      mockOnConfirm.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

      render(
        <StatusTransitionButton
          toStatus="APPROVED"
          label="Approve"
          hasPermission={true}
          onConfirm={mockOnConfirm}
        />
      )

      // Open dialog
      fireEvent.click(screen.getByRole("button", { name: /approve/i }))

      await waitFor(() => {
        expect(screen.getByText("Confirm Status Change")).toBeInTheDocument()
      })

      // Click confirm
      const confirmButton = screen.getByRole("button", { name: /^confirm$/i })
      fireEvent.click(confirmButton)

      // Button should be disabled during submission
      await waitFor(() => {
        expect(mockOnConfirm).toHaveBeenCalled()
      })
    })
  })

  describe("Dialog Behavior", () => {
    it("opens confirmation dialog on button click", async () => {
      render(
        <StatusTransitionButton
          toStatus="APPROVED"
          label="Approve"
          hasPermission={true}
          onConfirm={mockOnConfirm}
        />
      )

      fireEvent.click(screen.getByRole("button", { name: /approve/i }))

      await waitFor(() => {
        expect(screen.getByText("Confirm Status Change")).toBeInTheDocument()
      })
    })

    it("displays custom description when provided", async () => {
      render(
        <StatusTransitionButton
          toStatus="APPROVED"
          label="Approve"
          description="This will approve the service request and notify the customer."
          hasPermission={true}
          onConfirm={mockOnConfirm}
        />
      )

      fireEvent.click(screen.getByRole("button", { name: /approve/i }))

      await waitFor(() => {
        expect(screen.getByText(/this will approve the service request/i)).toBeInTheDocument()
      })
    })

    it("closes dialog after successful confirmation", async () => {
      mockOnConfirm.mockResolvedValue(undefined)

      render(
        <StatusTransitionButton
          toStatus="APPROVED"
          label="Approve"
          hasPermission={true}
          onConfirm={mockOnConfirm}
        />
      )

      fireEvent.click(screen.getByRole("button", { name: /approve/i }))

      await waitFor(() => {
        expect(screen.getByText("Confirm Status Change")).toBeInTheDocument()
      })

      const confirmButton = screen.getByRole("button", { name: /^confirm$/i })
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(screen.queryByText("Confirm Status Change")).not.toBeInTheDocument()
      })
    })

    it("allows cancellation without submitting", async () => {
      render(
        <StatusTransitionButton
          toStatus="APPROVED"
          label="Approve"
          hasPermission={true}
          onConfirm={mockOnConfirm}
        />
      )

      fireEvent.click(screen.getByRole("button", { name: /approve/i }))

      await waitFor(() => {
        expect(screen.getByText("Confirm Status Change")).toBeInTheDocument()
      })

      const cancelButton = screen.getByRole("button", { name: /cancel/i })
      fireEvent.click(cancelButton)

      await waitFor(() => {
        expect(screen.queryByText("Confirm Status Change")).not.toBeInTheDocument()
      })

      expect(mockOnConfirm).not.toHaveBeenCalled()
    })

    it("resets form fields after successful submission", async () => {
      mockOnConfirm.mockResolvedValue(undefined)

      render(
        <StatusTransitionButton
          toStatus="APPROVED"
          label="Approve"
          hasPermission={true}
          onConfirm={mockOnConfirm}
        />
      )

      // First submission
      fireEvent.click(screen.getByRole("button", { name: /approve/i }))
      await waitFor(() => screen.getByText("Confirm Status Change"))

      const reasonInput = screen.getByLabelText(/reason/i)
      fireEvent.change(reasonInput, { target: { value: "Test reason" } })

      const confirmButton = screen.getByRole("button", { name: /^confirm$/i })
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(screen.queryByText("Confirm Status Change")).not.toBeInTheDocument()
      })

      // Open again - fields should be reset
      fireEvent.click(screen.getByRole("button", { name: /approve/i }))
      await waitFor(() => screen.getByText("Confirm Status Change"))

      const reasonInputNew = screen.getByLabelText(/reason/i)
      expect(reasonInputNew).toHaveValue("")
    })
  })
})

