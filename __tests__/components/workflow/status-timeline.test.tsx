/**
 * Status Timeline Component Tests (Issue #356)
 * Tests visual status progression display
 */

import React from "react"
import { render, screen } from "@testing-library/react"
import { StatusTimeline } from "@/components/workflow/status-timeline"
import type { ServiceRequestStatus } from "@prisma/client"

describe("StatusTimeline", () => {
  describe("Rendering", () => {
    it("renders timeline with current status highlighted", () => {
      render(<StatusTimeline currentStatus="UNDER_REVIEW" />)

      expect(screen.getByText("Status Timeline")).toBeInTheDocument()
      expect(screen.getAllByText("Under Review").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Being evaluated").length).toBeGreaterThan(0)
    })

    it("displays all workflow stages", () => {
      render(<StatusTimeline currentStatus="SUBMITTED" />)

      expect(screen.getAllByText("Submitted").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Under Review").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Approved").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Finding Operator").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Operator Assigned").length).toBeGreaterThan(0)
      expect(screen.getAllByText("In Progress").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Completed").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Closed").length).toBeGreaterThan(0)
    })

    it("renders correctly for initial SUBMITTED status", () => {
      render(<StatusTimeline currentStatus="SUBMITTED" />)

      expect(screen.getAllByText("Submitted").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Request received").length).toBeGreaterThan(0)
    })

    it("renders correctly for in-progress OPERATOR_ASSIGNED status", () => {
      render(<StatusTimeline currentStatus="OPERATOR_ASSIGNED" />)

      expect(screen.getAllByText("Operator Assigned").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Operator confirmed").length).toBeGreaterThan(
        0
      )
    })

    it("renders correctly for final CLOSED status", () => {
      render(<StatusTimeline currentStatus="CLOSED" />)

      expect(screen.getAllByText("Closed").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Request closed").length).toBeGreaterThan(0)
    })
  })

  describe("Visual States", () => {
    it("shows completed states before current status", () => {
      render(<StatusTimeline currentStatus="APPROVED" />)

      // Previous statuses should be visible
      expect(screen.getAllByText("Submitted").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Under Review").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Approved").length).toBeGreaterThan(0)
    })

    it("shows current status with distinctive styling", () => {
      const { container } = render(
        <StatusTimeline currentStatus="UNDER_REVIEW" />
      )

      // Current status should have blue styling (check for blue-related classes)
      expect(container.querySelector(".text-blue-600")).toBeInTheDocument()
    })

    it("shows future states as pending", () => {
      render(<StatusTimeline currentStatus="SUBMITTED" />)

      // Future statuses should still be visible but styled differently
      expect(screen.getAllByText("Under Review").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Approved").length).toBeGreaterThan(0)
    })

    it("displays checkmarks for completed states", () => {
      const { container } = render(<StatusTimeline currentStatus="APPROVED" />)

      // Should have green background for completed states
      const completedStates = container.querySelectorAll(".bg-green-500")
      expect(completedStates.length).toBeGreaterThan(0)
    })

    it("displays clock icon for current state", () => {
      const { container } = render(
        <StatusTimeline currentStatus="UNDER_REVIEW" />
      )

      // Should have blue background for current state
      const currentState = container.querySelectorAll(".bg-blue-500")
      expect(currentState.length).toBeGreaterThan(0)
    })

    it("displays circle icon for pending states", () => {
      const { container } = render(<StatusTimeline currentStatus="SUBMITTED" />)

      // Should have gray border for pending states
      const pendingStates = container.querySelectorAll(".border-gray-300")
      expect(pendingStates.length).toBeGreaterThan(0)
    })
  })

  describe("Status Progression", () => {
    it("correctly identifies completed, current, and pending states for early stage", () => {
      const { container } = render(
        <StatusTimeline currentStatus="UNDER_REVIEW" />
      )

      // SUBMITTED should be completed (green)
      expect(container.querySelector(".bg-green-500")).toBeInTheDocument()

      // UNDER_REVIEW should be current (blue)
      expect(container.querySelector(".bg-blue-500")).toBeInTheDocument()

      // Future states should be pending (gray border)
      const pendingStates = container.querySelectorAll(".border-gray-300")
      expect(pendingStates.length).toBeGreaterThan(0)
    })

    it("correctly identifies states for mid-workflow status", () => {
      const { container } = render(
        <StatusTimeline currentStatus="OPERATOR_ASSIGNED" />
      )

      // Multiple completed states
      const completedStates = container.querySelectorAll(".bg-green-500")
      expect(completedStates.length).toBeGreaterThan(2)

      // One current state
      const currentStates = container.querySelectorAll(".bg-blue-500")
      expect(currentStates.length).toBeGreaterThan(0)

      // Some pending states
      const pendingStates = container.querySelectorAll(".border-gray-300")
      expect(pendingStates.length).toBeGreaterThan(0)
    })

    it("shows all states as completed when at final status", () => {
      const { container } = render(<StatusTimeline currentStatus="CLOSED" />)

      // All previous states should be completed
      const completedStates = container.querySelectorAll(".bg-green-500")
      expect(completedStates.length).toBeGreaterThan(5)

      // CLOSED should be current
      const currentStates = container.querySelectorAll(".bg-blue-500")
      expect(currentStates.length).toBeGreaterThan(0)
    })
  })

  describe("Responsive Design", () => {
    it("renders mobile layout structure", () => {
      const { container } = render(
        <StatusTimeline currentStatus="UNDER_REVIEW" />
      )

      // Mobile layout should have vertical timeline (md:hidden class)
      const mobileLayout = container.querySelector(".md\\:hidden")
      expect(mobileLayout).toBeInTheDocument()
    })

    it("renders desktop layout structure", () => {
      const { container } = render(
        <StatusTimeline currentStatus="UNDER_REVIEW" />
      )

      // Desktop layout should have horizontal stepper (hidden md:block)
      const desktopLayout = container.querySelector(".md\\:block")
      expect(desktopLayout).toBeInTheDocument()
    })

    it("includes connector lines between statuses", () => {
      const { container } = render(<StatusTimeline currentStatus="APPROVED" />)

      // Should have connector lines (various colored lines)
      const greenConnectors = container.querySelectorAll(".bg-green-500")
      const grayConnectors = container.querySelectorAll(".bg-gray-300")

      expect(greenConnectors.length + grayConnectors.length).toBeGreaterThan(0)
    })
  })

  describe("Custom Styling", () => {
    it("applies custom className when provided", () => {
      const { container } = render(
        <StatusTimeline currentStatus="SUBMITTED" className="custom-class" />
      )

      expect(container.querySelector(".custom-class")).toBeInTheDocument()
    })

    it("maintains consistent spacing between timeline items", () => {
      const { container } = render(
        <StatusTimeline currentStatus="UNDER_REVIEW" />
      )

      // Should have space-y-4 for mobile layout spacing
      expect(container.querySelector(".space-y-4")).toBeInTheDocument()
    })
  })

  describe("All Status Types", () => {
    it("handles REJECTED status correctly", () => {
      render(<StatusTimeline currentStatus="REJECTED" />)
      // Should still render without errors even though REJECTED is not in STATUS_FLOW
      expect(screen.getByText("Status Timeline")).toBeInTheDocument()
    })

    it("handles CANCELLED status correctly", () => {
      render(<StatusTimeline currentStatus="CANCELLED" />)
      // Should still render without errors even though CANCELLED is not in STATUS_FLOW
      expect(screen.getByText("Status Timeline")).toBeInTheDocument()
    })

    it("handles equipment-related statuses", () => {
      render(<StatusTimeline currentStatus="EQUIPMENT_CONFIRMED" />)
      expect(screen.getByText("Status Timeline")).toBeInTheDocument()
    })

    it("handles deposit-related statuses", () => {
      render(<StatusTimeline currentStatus="DEPOSIT_RECEIVED" />)
      expect(screen.getByText("Status Timeline")).toBeInTheDocument()
    })

    it("handles payment-related statuses", () => {
      render(<StatusTimeline currentStatus="PAYMENT_RECEIVED" />)
      expect(screen.getByText("Status Timeline")).toBeInTheDocument()
    })

    // Test that all statuses in the standard flow render without errors
    const standardFlowStatuses: ServiceRequestStatus[] = [
      "SUBMITTED",
      "UNDER_REVIEW",
      "APPROVED",
      "OPERATOR_MATCHING",
      "OPERATOR_ASSIGNED",
      "JOB_IN_PROGRESS",
      "JOB_COMPLETED",
      "CLOSED",
    ]

    standardFlowStatuses.forEach((status) => {
      it(`renders correctly for ${status} status`, () => {
        render(<StatusTimeline currentStatus={status} />)
        expect(screen.getByText("Status Timeline")).toBeInTheDocument()
      })
    })
  })
})
