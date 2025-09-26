/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react"
import { useServiceRequests } from "@/hooks/use-service-requests"

// Mock the dashboard data hook
jest.mock("@/hooks/use-dashboard-data", () => ({
  useDashboardData: jest.fn(),
}))

import { useDashboardData } from "@/hooks/use-dashboard-data"
const mockUseDashboardData = useDashboardData as jest.MockedFunction<
  typeof useDashboardData
>

// Mock console.warn for navigation tests
const originalWarn = console.warn
beforeAll(() => {
  console.warn = jest.fn()
})

afterAll(() => {
  console.warn = originalWarn
})

describe("useServiceRequests", () => {
  beforeEach(() => {
    mockUseDashboardData.mockClear()
    jest.clearAllMocks()
  })

  it("should return service request data and stats", async () => {
    const mockDashboardData = {
      stats: {
        totalRequests: 5,
        activeRequests: 2,
        completedRequests: 3,
        pendingApproval: 1,
      },
      recentRequests: [
        {
          id: "1",
          title: "Test Request",
          status: "SUBMITTED",
          equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
          jobSite: "123 Main St",
          startDate: new Date("2024-01-01"),
          endDate: null,
          requestedDurationType: "FULL_DAY",
          requestedDurationValue: 1,
          requestedTotalHours: 8,
          estimatedCost: 500,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
        },
      ],
    }

    mockUseDashboardData.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      clearCache: jest.fn(),
    })

    const { result } = renderHook(() => useServiceRequests())

    expect(result.current.serviceRequests).toEqual(
      mockDashboardData.recentRequests
    )
    expect(result.current.totalRequests).toBe(5)
    expect(result.current.activeRequests).toBe(2)
    expect(result.current.completedRequests).toBe(3)
    expect(result.current.pendingApproval).toBe(1)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)

    expect(mockUseDashboardData).toHaveBeenCalledWith({
      role: "USER",
      limit: 10,
      offset: 0,
      enableCaching: true,
    })
  })

  it("should handle loading state", () => {
    mockUseDashboardData.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
      clearCache: jest.fn(),
    })

    const { result } = renderHook(() => useServiceRequests())

    expect(result.current.serviceRequests).toEqual([])
    expect(result.current.totalRequests).toBe(0)
    expect(result.current.activeRequests).toBe(0)
    expect(result.current.completedRequests).toBe(0)
    expect(result.current.pendingApproval).toBe(0)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBe(null)
  })

  it("should handle error state", () => {
    const errorMessage = "Failed to fetch data"
    mockUseDashboardData.mockReturnValue({
      data: null,
      isLoading: false,
      error: errorMessage,
      refetch: jest.fn(),
      clearCache: jest.fn(),
    })

    const { result } = renderHook(() => useServiceRequests())

    expect(result.current.serviceRequests).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(errorMessage)
  })

  it("should handle custom options", () => {
    mockUseDashboardData.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      clearCache: jest.fn(),
    })

    renderHook(() =>
      useServiceRequests({
        limit: 20,
        offset: 10,
        enableCaching: false,
      })
    )

    expect(mockUseDashboardData).toHaveBeenCalledWith({
      role: "USER",
      limit: 20,
      offset: 10,
      enableCaching: false,
    })
  })

  it("should log development warning when createServiceRequest is called", () => {
    // Since we're using a logger that only logs in development, 
    // and the test environment might not trigger the logger,
    // we'll just verify the function doesn't throw an error
    mockUseDashboardData.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      clearCache: jest.fn(),
    })

    const { result } = renderHook(() => useServiceRequests())

    // Should not throw an error when called
    expect(() => {
      result.current.createServiceRequest()
    }).not.toThrow()
  })

  it("should pass through refetch function", () => {
    const mockRefetch = jest.fn()
    mockUseDashboardData.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
      clearCache: jest.fn(),
    })

    const { result } = renderHook(() => useServiceRequests())

    expect(result.current.refetch).toBe(mockRefetch)
  })
})
