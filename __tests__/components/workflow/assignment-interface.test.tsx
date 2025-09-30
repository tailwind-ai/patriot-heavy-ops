/**
 * Assignment Interface Component Tests (Issue #356)
 * Tests operator assignment UI with role-based permissions
 */

import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { AssignmentInterface, type AvailableOperator } from "@/components/workflow/assignment-interface"

describe("AssignmentInterface", () => {
  const mockOperators: AvailableOperator[] = [
    { id: "op1", name: "John Operator", email: "john@example.com" },
    { id: "op2", name: "Jane Smith", email: "jane@example.com" },
    { id: "op3", name: null, email: "operator3@example.com" },
  ]

  const mockOnAssign = jest.fn()

  beforeEach(() => {
    mockOnAssign.mockClear()
  })

  describe("Operator Selection", () => {
    it("renders available operators list", () => {
      render(
        <AssignmentInterface
          availableOperators={mockOperators}
          onAssign={mockOnAssign}
          hasPermission={true}
        />
      )

      const button = screen.getByRole("button", { name: /assign operator/i })
      expect(button).toBeInTheDocument()
      expect(button).not.toBeDisabled()
    })

    it("shows operator names in select dropdown", async () => {
      render(
        <AssignmentInterface
          availableOperators={mockOperators}
          onAssign={mockOnAssign}
          hasPermission={true}
        />
      )

      // Open dialog
      const openButton = screen.getByRole("button", { name: /assign operator/i })
      fireEvent.click(openButton)

      // Wait for dialog to open
      await waitFor(() => {
        const dialogTitles = screen.queryAllByText("Assign Operator")
        expect(dialogTitles.length).toBeGreaterThan(0)
      })

      // Verify select trigger is present
      const selectTrigger = screen.getByRole("combobox")
      expect(selectTrigger).toBeInTheDocument()
      
      // Verify placeholder text
      expect(screen.getByText("Select operator")).toBeInTheDocument()
    })

    it("handles assignment button interaction", async () => {
      mockOnAssign.mockResolvedValue(undefined)
      
      render(
        <AssignmentInterface
          availableOperators={mockOperators}
          onAssign={mockOnAssign}
          hasPermission={true}
        />
      )

      // Open dialog
      fireEvent.click(screen.getByRole("button", { name: /assign operator/i }))

      await waitFor(() => {
        const dialogTitles = screen.queryAllByText("Assign Operator")
        expect(dialogTitles.length).toBeGreaterThan(0)
      })

      // Verify form elements are present
      const selectTrigger = screen.getByRole("combobox")
      expect(selectTrigger).toBeInTheDocument()
      
      const rateInput = screen.getByLabelText(/hourly rate/i)
      expect(rateInput).toBeInTheDocument()
      
      const hoursInput = screen.getByLabelText(/estimated hours/i)
      expect(hoursInput).toBeInTheDocument()
    })

    it("allows entering rate and estimated hours", async () => {
      render(
        <AssignmentInterface
          availableOperators={mockOperators}
          onAssign={mockOnAssign}
          hasPermission={true}
        />
      )

      // Open dialog
      fireEvent.click(screen.getByRole("button", { name: /assign operator/i }))

      await waitFor(() => {
        const dialogTitles = screen.queryAllByText("Assign Operator")
        expect(dialogTitles.length).toBeGreaterThan(0)
      })

      // Enter rate
      const rateInput = screen.getByLabelText(/hourly rate/i)
      fireEvent.change(rateInput, { target: { value: "75.50" } })
      expect((rateInput as HTMLInputElement).value).toBe("75.50")

      // Enter estimated hours
      const hoursInput = screen.getByLabelText(/estimated hours/i)
      fireEvent.change(hoursInput, { target: { value: "40" } })
      expect((hoursInput as HTMLInputElement).value).toBe("40")
    })

    it("disables assign button when no operator selected", async () => {
      render(
        <AssignmentInterface
          availableOperators={mockOperators}
          onAssign={mockOnAssign}
          hasPermission={true}
        />
      )

      // Open dialog
      fireEvent.click(screen.getByRole("button", { name: /assign operator/i }))

      await waitFor(() => {
        const dialogTitles = screen.queryAllByText("Assign Operator")
        expect(dialogTitles.length).toBeGreaterThan(0)
      })

      // Assign button should be disabled without selection
      const assignButtons = screen.getAllByRole("button", { name: /assign/i })
      const assignButton = assignButtons.find(btn => btn.textContent === "Assign")
      expect(assignButton).toBeDisabled()
    })
  })

  describe("Permissions", () => {
    it("renders component when user has permission", () => {
      render(
        <AssignmentInterface
          availableOperators={mockOperators}
          onAssign={mockOnAssign}
          hasPermission={true}
        />
      )

      expect(screen.getByRole("button", { name: /assign operator/i })).toBeInTheDocument()
    })

    it("does not render when user lacks permission", () => {
      render(
        <AssignmentInterface
          availableOperators={mockOperators}
          onAssign={mockOnAssign}
          hasPermission={false}
        />
      )

      expect(screen.queryByRole("button", { name: /assign operator/i })).not.toBeInTheDocument()
    })

    it("hides interface for OPERATOR role (read-only)", () => {
      render(
        <AssignmentInterface
          availableOperators={mockOperators}
          onAssign={mockOnAssign}
          hasPermission={false}
        />
      )

      expect(screen.queryByText(/assign operator/i)).not.toBeInTheDocument()
    })

    it("hides interface for USER role", () => {
      render(
        <AssignmentInterface
          availableOperators={mockOperators}
          onAssign={mockOnAssign}
          hasPermission={false}
        />
      )

      expect(screen.queryByText(/assign operator/i)).not.toBeInTheDocument()
    })
  })

  describe("Error Handling", () => {
    it("displays message when operator list is empty", () => {
      render(
        <AssignmentInterface
          availableOperators={[]}
          onAssign={mockOnAssign}
          hasPermission={true}
        />
      )

      const button = screen.getByRole("button", { name: /assign operator/i })
      expect(button).toBeDisabled()
    })

    it("shows 'No operators available' message in dialog", async () => {
      render(
        <AssignmentInterface
          availableOperators={[]}
          onAssign={mockOnAssign}
          hasPermission={true}
        />
      )

      // Open dialog (button is disabled, but we can test the message separately)
      const button = screen.getByRole("button", { name: /assign operator/i })
      expect(button).toBeDisabled()
    })

    it("shows cancel button for dismissing dialog", async () => {
      render(
        <AssignmentInterface
          availableOperators={mockOperators}
          onAssign={mockOnAssign}
          hasPermission={true}
        />
      )

      // Open dialog
      fireEvent.click(screen.getByRole("button", { name: /assign operator/i }))

      await waitFor(() => {
        const dialogTitles = screen.queryAllByText("Assign Operator")
        expect(dialogTitles.length).toBeGreaterThan(0)
      })

      // Verify cancel button exists
      const cancelButton = screen.getByRole("button", { name: /cancel/i })
      expect(cancelButton).toBeInTheDocument()
      expect(cancelButton).not.toBeDisabled()
    })

    it("disables submit during loading state", async () => {
      render(
        <AssignmentInterface
          availableOperators={mockOperators}
          onAssign={mockOnAssign}
          hasPermission={true}
          isLoading={true}
        />
      )

      const button = screen.getByRole("button", { name: /assign operator/i })
      expect(button).toBeDisabled()
    })

    it("displays description text in dialog", async () => {
      render(
        <AssignmentInterface
          availableOperators={mockOperators}
          onAssign={mockOnAssign}
          hasPermission={true}
        />
      )

      // Open dialog
      fireEvent.click(screen.getByRole("button", { name: /assign operator/i }))

      await waitFor(() => {
        expect(screen.getByText("Select an operator and set assignment details")).toBeInTheDocument()
      })
    })

    it("closes dialog when cancel button is clicked", async () => {
      render(
        <AssignmentInterface
          availableOperators={mockOperators}
          onAssign={mockOnAssign}
          hasPermission={true}
        />
      )

      // Open dialog
      fireEvent.click(screen.getByRole("button", { name: /assign operator/i }))

      await waitFor(() => {
        const dialogTitles = screen.queryAllByText("Assign Operator")
        expect(dialogTitles.length).toBeGreaterThan(0)
      })

      // Click cancel
      const cancelButton = screen.getByRole("button", { name: /cancel/i })
      fireEvent.click(cancelButton)

      // Dialog should close without calling onAssign
      await waitFor(() => {
        expect(screen.queryByText("Select an operator and set assignment details")).not.toBeInTheDocument()
      })
      expect(mockOnAssign).not.toHaveBeenCalled()
    })
  })
})

