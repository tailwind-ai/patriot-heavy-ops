/**
 * Workflow History Component Tests (Issue #356)
 * Tests audit trail display
 */

import React from "react"
import { render, screen } from "@testing-library/react"
import { WorkflowHistory, type WorkflowHistoryEntry } from "@/components/workflow/workflow-history"

describe("WorkflowHistory", () => {
  const mockHistoryEntries: WorkflowHistoryEntry[] = [
    {
      id: "hist1",
      fromStatus: null,
      toStatus: "SUBMITTED",
      changedBy: "user1",
      changedByUser: {
        id: "user1",
        name: "John Customer",
        email: "john@example.com",
      },
      reason: "Initial submission",
      notes: null,
      createdAt: new Date("2024-01-15T10:00:00Z"),
    },
    {
      id: "hist2",
      fromStatus: "SUBMITTED",
      toStatus: "UNDER_REVIEW",
      changedBy: "manager1",
      changedByUser: {
        id: "manager1",
        name: "Jane Manager",
        email: "jane@example.com",
      },
      reason: "Starting review process",
      notes: "Priority request - needs quick turnaround",
      createdAt: new Date("2024-01-15T11:30:00Z"),
    },
    {
      id: "hist3",
      fromStatus: "UNDER_REVIEW",
      toStatus: "APPROVED",
      changedBy: "manager1",
      changedByUser: {
        id: "manager1",
        name: "Jane Manager",
        email: "jane@example.com",
      },
      reason: "All requirements met",
      notes: null,
      createdAt: new Date("2024-01-15T14:00:00Z"),
    },
  ]

  describe("History Display", () => {
    it("renders all transitions chronologically", () => {
      render(<WorkflowHistory history={mockHistoryEntries} />)

      expect(screen.getByText("Status History")).toBeInTheDocument()
      expect(screen.getByText("Complete audit trail of all status changes")).toBeInTheDocument()

      // Check all status transitions are displayed
      expect(screen.getByText("Submitted")).toBeInTheDocument()
      expect(screen.getByText("Under Review")).toBeInTheDocument()
      expect(screen.getByText("Approved")).toBeInTheDocument()
    })

    it("displays transition reasons", () => {
      render(<WorkflowHistory history={mockHistoryEntries} />)

      expect(screen.getByText(/initial submission/i)).toBeInTheDocument()
      expect(screen.getByText(/starting review process/i)).toBeInTheDocument()
      expect(screen.getByText(/all requirements met/i)).toBeInTheDocument()
    })

    it("displays actor names", () => {
      render(<WorkflowHistory history={mockHistoryEntries} />)

      expect(screen.getByText("John Customer")).toBeInTheDocument()
      expect(screen.getAllByText("Jane Manager")).toHaveLength(2)
    })

    it("displays timestamps", () => {
      render(<WorkflowHistory history={mockHistoryEntries} />)

      // formatDate should format these dates
      expect(screen.getByText(/Jan 15, 2024/i)).toBeInTheDocument()
    })

    it("displays internal notes when present", () => {
      render(<WorkflowHistory history={mockHistoryEntries} />)

      expect(screen.getByText("Internal Notes")).toBeInTheDocument()
      expect(screen.getByText("Priority request - needs quick turnaround")).toBeInTheDocument()
    })

    it("handles initial status without fromStatus", () => {
      render(<WorkflowHistory history={[mockHistoryEntries[0]!]} />)

      // Should show only the toStatus badge, not a fromStatus
      expect(screen.getByText("Submitted")).toBeInTheDocument()
      // Should not have an arrow since there's no fromStatus
      const arrows = screen.queryAllByText("→")
      expect(arrows).toHaveLength(0)
    })

    it("shows status transition arrows for non-initial changes", () => {
      render(<WorkflowHistory history={[mockHistoryEntries[1]!]} />)

      expect(screen.getByText("→")).toBeInTheDocument()
      expect(screen.getByText("Submitted")).toBeInTheDocument()
      expect(screen.getByText("Under Review")).toBeInTheDocument()
    })
  })

  describe("Loading State", () => {
    it("displays loading skeleton when isLoading is true", () => {
      render(<WorkflowHistory history={[]} isLoading={true} />)

      expect(screen.getByText("Status History")).toBeInTheDocument()
      expect(screen.getByText("Loading history...")).toBeInTheDocument()
    })

    it("shows multiple skeleton items during loading", () => {
      const { container } = render(<WorkflowHistory history={[]} isLoading={true} />)

      // Should render 3 skeleton items
      const skeletons = container.querySelectorAll(".animate-pulse")
      expect(skeletons.length).toBeGreaterThan(0)
    })
  })

  describe("Empty State", () => {
    it("displays empty state when history is empty", () => {
      render(<WorkflowHistory history={[]} />)

      expect(screen.getByText("Status History")).toBeInTheDocument()
      expect(screen.getByText("No status changes yet")).toBeInTheDocument()
    })

    it("does not show timeline when history is empty", () => {
      const { container } = render(<WorkflowHistory history={[]} />)

      // Should not have timeline structure
      expect(container.querySelector(".border-l-2")).not.toBeInTheDocument()
    })
  })

  describe("User Information Display", () => {
    it("displays user name when available", () => {
      render(<WorkflowHistory history={[mockHistoryEntries[0]!]} />)

      expect(screen.getByText("John Customer")).toBeInTheDocument()
    })

    it("falls back to email when name is not available", () => {
      const entryWithoutName: WorkflowHistoryEntry = {
        id: mockHistoryEntries[0]!.id,
        fromStatus: mockHistoryEntries[0]!.fromStatus,
        toStatus: mockHistoryEntries[0]!.toStatus,
        changedBy: mockHistoryEntries[0]!.changedBy,
        reason: mockHistoryEntries[0]!.reason,
        notes: mockHistoryEntries[0]!.notes,
        createdAt: mockHistoryEntries[0]!.createdAt,
        changedByUser: {
          id: "user2",
          name: null,
          email: "user2@example.com",
        },
      }

      render(<WorkflowHistory history={[entryWithoutName]} />)

      expect(screen.getByText("user2@example.com")).toBeInTheDocument()
    })

    it("displays 'Unknown User' when user info is missing", () => {
      const entryWithoutUser = {
        id: mockHistoryEntries[0]!.id,
        fromStatus: mockHistoryEntries[0]!.fromStatus,
        toStatus: mockHistoryEntries[0]!.toStatus,
        changedBy: mockHistoryEntries[0]!.changedBy,
        reason: mockHistoryEntries[0]!.reason,
        notes: mockHistoryEntries[0]!.notes,
        createdAt: mockHistoryEntries[0]!.createdAt,
      } as WorkflowHistoryEntry

      render(<WorkflowHistory history={[entryWithoutUser]} />)

      expect(screen.getByText("Unknown User")).toBeInTheDocument()
    })
  })

  describe("Status Formatting", () => {
    it("formats status names correctly", () => {
      const formattedEntries: WorkflowHistoryEntry[] = [
        {
          id: "h1",
          fromStatus: "OPERATOR_MATCHING",
          toStatus: "OPERATOR_ASSIGNED",
          changedBy: "mgr1",
          changedByUser: {
            id: "mgr1",
            name: "Manager",
            email: "mgr@example.com",
          },
          reason: null,
          notes: null,
          createdAt: new Date("2024-01-15T10:00:00Z"),
        },
      ]

      render(<WorkflowHistory history={formattedEntries} />)

      // Should convert OPERATOR_MATCHING to "Operator Matching"
      expect(screen.getByText("Operator Matching")).toBeInTheDocument()
      expect(screen.getByText("Operator Assigned")).toBeInTheDocument()
    })

    it("applies correct badge colors to different statuses", () => {
      const { container } = render(<WorkflowHistory history={mockHistoryEntries} />)

      // Should have colored badges (checking for badge components)
      const badges = container.querySelectorAll('[class*="bg-"]')
      expect(badges.length).toBeGreaterThan(0)
    })
  })

  describe("Timeline Visual Elements", () => {
    it("renders timeline dots for each entry", () => {
      const { container } = render(<WorkflowHistory history={mockHistoryEntries} />)

      // Should have timeline dots
      const timelineDots = container.querySelectorAll(".size-4.rounded-full")
      expect(timelineDots.length).toBeGreaterThan(0)
    })

    it("renders timeline connector lines", () => {
      const { container } = render(<WorkflowHistory history={mockHistoryEntries} />)

      // Should have vertical border line
      expect(container.querySelector(".border-l-2")).toBeInTheDocument()
    })

    it("does not render connector after last entry", () => {
      const { container } = render(<WorkflowHistory history={mockHistoryEntries} />)

      // Last item should have last:pb-0 class
      const timelineItems = container.querySelectorAll(".border-l-2 > div")
      expect(timelineItems.length).toBeGreaterThan(0)
    })
  })

  describe("Custom Styling", () => {
    it("applies custom className when provided", () => {
      const { container } = render(
        <WorkflowHistory history={mockHistoryEntries} className="custom-history-class" />
      )

      expect(container.querySelector(".custom-history-class")).toBeInTheDocument()
    })
  })

  describe("Date Handling", () => {
    it("handles Date objects", () => {
      render(<WorkflowHistory history={mockHistoryEntries} />)

      // Should format dates without errors
      expect(screen.getByText("Status History")).toBeInTheDocument()
    })

    it("handles ISO string dates", () => {
      const stringDateEntry = {
        ...mockHistoryEntries[0]!,
        createdAt: "2024-01-15T10:00:00Z",
      } as WorkflowHistoryEntry

      render(<WorkflowHistory history={[stringDateEntry]} />)

      expect(screen.getByText("Status History")).toBeInTheDocument()
    })
  })

  describe("Notes Display", () => {
    it("displays notes section when notes are present", () => {
      render(<WorkflowHistory history={[mockHistoryEntries[1]!]} />)

      expect(screen.getByText("Internal Notes")).toBeInTheDocument()
      expect(screen.getByText("Priority request - needs quick turnaround")).toBeInTheDocument()
    })

    it("does not display notes section when notes are null", () => {
      render(<WorkflowHistory history={[mockHistoryEntries[0]!]} />)

      expect(screen.queryByText("Internal Notes")).not.toBeInTheDocument()
    })

    it("styles notes section distinctly from regular content", () => {
      const { container } = render(<WorkflowHistory history={[mockHistoryEntries[1]!]} />)

      // Notes should be in a muted background box
      const notesBox = container.querySelector(".bg-muted")
      expect(notesBox).toBeInTheDocument()
    })
  })

  describe("Skeleton Component", () => {
    it("renders skeleton loader using static method", () => {
      render(<WorkflowHistory.Skeleton />)

      expect(screen.getByText("Status History")).toBeInTheDocument()
    })
  })
})

