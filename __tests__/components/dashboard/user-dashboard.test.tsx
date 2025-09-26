/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react"
import { UserDashboard } from "@/components/dashboard/user-dashboard"

// Mock the service requests hook
jest.mock("@/hooks/use-service-requests", () => ({
  useServiceRequests: jest.fn(),
}))

// Mock the service request create button
jest.mock("@/components/service-request-create-button", () => ({
  ServiceRequestCreateButton: ({ variant }: { variant?: string }) => (
    <button data-testid="create-button" data-variant={variant}>
      Create Service Request
    </button>
  ),
}))

import { useServiceRequests } from "@/hooks/use-service-requests"
const mockUseServiceRequests = useServiceRequests as jest.MockedFunction<
  typeof useServiceRequests
>

describe("UserDashboard", () => {
  beforeEach(() => {
    mockUseServiceRequests.mockClear()
  })

  it("should render loading state", () => {
    mockUseServiceRequests.mockReturnValue({
      serviceRequests: [],
      totalRequests: 0,
      activeRequests: 0,
      completedRequests: 0,
      pendingApproval: 0,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
      createServiceRequest: jest.fn(),
    })

    const { container } = render(<UserDashboard />)

    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(
      screen.getByText("Manage your equipment service requests")
    ).toBeInTheDocument()

    // Should show loading skeletons - check for skeleton class instead of testid
    const skeletons = container.querySelectorAll(".animate-pulse")
    expect(skeletons.length).toBeGreaterThan(0) // Should have multiple skeleton elements
  })

  it("should render error state", () => {
    const mockRefetch = jest.fn()
    mockUseServiceRequests.mockReturnValue({
      serviceRequests: [],
      totalRequests: 0,
      activeRequests: 0,
      completedRequests: 0,
      pendingApproval: 0,
      isLoading: false,
      error: "Failed to fetch data",
      refetch: mockRefetch,
      createServiceRequest: jest.fn(),
    })

    render(<UserDashboard />)

    expect(screen.getByText("Failed to fetch data")).toBeInTheDocument()

    const tryAgainButton = screen.getByText("Try Again")
    expect(tryAgainButton).toBeInTheDocument()

    fireEvent.click(tryAgainButton)
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it("should render dashboard with service requests", () => {
    const mockServiceRequests = [
      {
        id: "1",
        title: "Excavator Rental",
        status: "SUBMITTED",
        equipmentCategory: "EXCAVATORS",
        jobSite: "123 Main St, City, State",
        startDate: new Date("2024-01-15"),
        endDate: null,
        requestedDurationType: "FULL_DAY",
        requestedDurationValue: 1,
        requestedTotalHours: 8,
        estimatedCost: 750,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "2",
        title: "Skid Steer Service",
        status: "JOB_COMPLETED",
        equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
        jobSite: "456 Oak Ave, Town, State",
        startDate: new Date("2024-01-10"),
        endDate: new Date("2024-01-12"),
        requestedDurationType: "FULL_DAY",
        requestedDurationValue: 2,
        requestedTotalHours: 16,
        estimatedCost: 1200,
        createdAt: new Date("2023-12-28"),
        updatedAt: new Date("2024-01-12"),
      },
    ]

    mockUseServiceRequests.mockReturnValue({
      serviceRequests: mockServiceRequests,
      totalRequests: 5,
      activeRequests: 2,
      completedRequests: 3,
      pendingApproval: 1,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      createServiceRequest: jest.fn(),
    })

    render(<UserDashboard />)

    // Check stats cards
    expect(screen.getByText("Total Requests")).toBeInTheDocument()
    expect(screen.getByText("5")).toBeInTheDocument()
    expect(screen.getByText("Active Requests")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getAllByText("Completed")).toHaveLength(2) // One in stats card, one in badge
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("Pending Approval")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()

    // Check service requests
    expect(screen.getByText("Excavator Rental")).toBeInTheDocument()
    expect(screen.getByText("EXCAVATORS")).toBeInTheDocument()
    expect(screen.getByText("Under Review")).toBeInTheDocument()
    expect(screen.getByText("$750.00")).toBeInTheDocument()

    expect(screen.getByText("Skid Steer Service")).toBeInTheDocument()
    expect(screen.getByText("SKID STEERS TRACK LOADERS")).toBeInTheDocument()
    expect(screen.getAllByText("Completed")).toHaveLength(2) // One in stats card, one in badge
    expect(screen.getByText("$1,200.00")).toBeInTheDocument()
  })

  it("should render empty state when no service requests", () => {
    mockUseServiceRequests.mockReturnValue({
      serviceRequests: [],
      totalRequests: 0,
      activeRequests: 0,
      completedRequests: 0,
      pendingApproval: 0,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      createServiceRequest: jest.fn(),
    })

    render(<UserDashboard />)

    expect(screen.getByText("No service requests yet")).toBeInTheDocument()
    expect(
      screen.getByText(
        "Get started by creating your first equipment service request."
      )
    ).toBeInTheDocument()

    // Should have create buttons in header and empty state
    const createButtons = screen.getAllByTestId("create-button")
    expect(createButtons).toHaveLength(2)
    expect(createButtons[1]).toHaveAttribute("data-variant", "outline")
  })

  it("should handle refresh action", () => {
    const mockRefetch = jest.fn()
    mockUseServiceRequests.mockReturnValue({
      serviceRequests: [
        {
          id: "1",
          title: "Test Request",
          status: "SUBMITTED",
          equipmentCategory: "EXCAVATORS",
          jobSite: "Test Location",
          startDate: new Date("2024-01-15"),
          endDate: null,
          requestedDurationType: "FULL_DAY",
          requestedDurationValue: 1,
          requestedTotalHours: 8,
          estimatedCost: 500,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
        },
      ],
      totalRequests: 1,
      activeRequests: 1,
      completedRequests: 0,
      pendingApproval: 1,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
      createServiceRequest: jest.fn(),
    })

    render(<UserDashboard />)

    const refreshButton = screen.getByText("Refresh")
    expect(refreshButton).toBeInTheDocument()

    fireEvent.click(refreshButton)
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it("should format currency correctly", () => {
    mockUseServiceRequests.mockReturnValue({
      serviceRequests: [
        {
          id: "1",
          title: "Test Request",
          status: "SUBMITTED",
          equipmentCategory: "EXCAVATORS",
          jobSite: "Test Location",
          startDate: new Date("2024-01-15"),
          endDate: null,
          requestedDurationType: "FULL_DAY",
          requestedDurationValue: 1,
          requestedTotalHours: 8,
          estimatedCost: null, // Test null cost
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
        },
      ],
      totalRequests: 1,
      activeRequests: 1,
      completedRequests: 0,
      pendingApproval: 1,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      createServiceRequest: jest.fn(),
    })

    render(<UserDashboard />)

    expect(screen.getByText("TBD")).toBeInTheDocument() // Should show TBD for null cost
  })

  it("should be accessible", () => {
    mockUseServiceRequests.mockReturnValue({
      serviceRequests: [],
      totalRequests: 0,
      activeRequests: 0,
      completedRequests: 0,
      pendingApproval: 0,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      createServiceRequest: jest.fn(),
    })

    render(<UserDashboard />)

    // Check for proper heading structure
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Dashboard"
    )

    // Check for proper button accessibility
    const createButtons = screen.getAllByRole("button")
    expect(createButtons.length).toBeGreaterThan(0)
  })
})
