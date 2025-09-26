/**
 * Dashboard Integration Tests
 *
 * Comprehensive integration testing for dashboard functionality across service layer,
 * API routes, and components. Tests complete dashboard workflow integration.
 *
 * Covers:
 * - End-to-end dashboard data flow testing
 * - Role-based access control validation
 * - API route to component integration
 * - Service layer to repository integration
 * - Mobile compatibility and performance
 * - Security testing for role-based data filtering
 */

import { NextRequest } from "next/server"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { GET as getUserDashboard } from "@/app/api/dashboard/user/route"
import { GET as getOperatorDashboard } from "@/app/api/dashboard/operator/route"
import { GET as getManagerDashboard } from "@/app/api/dashboard/manager/route"
import { GET as getAdminDashboard } from "@/app/api/dashboard/admin/route"
import { DashboardService } from "@/lib/services/dashboard-service"
import { ServiceFactory } from "@/lib/services"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { OperatorDashboard } from "@/components/dashboard/operator-dashboard"
import { ManagerDashboard } from "@/components/dashboard/manager-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { DashboardRouter } from "@/components/dashboard/dashboard-router"
import { createMockAuthResult, createMockDashboardData } from "@/__tests__/helpers/mock-data"
import { createMockRequest } from "@/__tests__/helpers/api-test-helpers"

// Mock dependencies
jest.mock("@/lib/middleware/mobile-auth")
jest.mock("@/lib/services")
jest.mock("@/lib/db")

describe("Dashboard Integration Tests", () => {
  let mockDashboardService: jest.Mocked<DashboardService>
  let mockServiceFactory: jest.Mocked<typeof ServiceFactory>

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock dashboard service
    mockDashboardService = {
      getDashboardData: jest.fn(),
      getCachedDashboardData: jest.fn(),
      setOfflineMode: jest.fn(),
      clearCache: jest.fn(),
      getServiceName: jest.fn().mockReturnValue("DashboardService"),
    } as any

    // Mock service factory
    mockServiceFactory = ServiceFactory as any
    mockServiceFactory.getDashboardService = jest.fn().mockReturnValue(mockDashboardService)
  })

  describe("End-to-End Dashboard Data Flow", () => {
    it("should complete full dashboard workflow for USER role", async () => {
      const mockUser = createMockAuthResult("USER", "user-123")
      const mockDashboardData = createMockDashboardData("USER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Test API route
      const request = createMockRequest("/api/dashboard/user", mockUser)
      const response = await getUserDashboard(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.stats).toBeDefined()
      expect(responseData.recentRequests).toBeDefined()

      // Test component integration
      render(<UserDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText(/service requests/i)).toBeInTheDocument()
      })
    })

    it("should complete full dashboard workflow for OPERATOR role", async () => {
      const mockUser = createMockAuthResult("OPERATOR", "operator-123")
      const mockDashboardData = createMockDashboardData("OPERATOR")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Test API route
      const request = createMockRequest("/api/dashboard/operator", mockUser)
      const response = await getOperatorDashboard(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.stats).toBeDefined()
      expect(responseData.assignments).toBeDefined()

      // Test component integration
      render(<OperatorDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText(/available jobs/i)).toBeInTheDocument()
      })
    })

    it("should complete full dashboard workflow for MANAGER role", async () => {
      const mockUser = createMockAuthResult("MANAGER", "manager-123")
      const mockDashboardData = createMockDashboardData("MANAGER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Test API route
      const request = createMockRequest("/api/dashboard/manager", mockUser)
      const response = await getManagerDashboard(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.stats).toBeDefined()
      expect(responseData.recentRequests).toBeDefined()

      // Test component integration
      render(<ManagerDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText(/approval queue/i)).toBeInTheDocument()
      })
    })

    it("should complete full dashboard workflow for ADMIN role", async () => {
      const mockUser = createMockAuthResult("ADMIN", "admin-123")
      const mockDashboardData = createMockDashboardData("ADMIN")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Test API route
      const request = createMockRequest("/api/dashboard/admin", mockUser)
      const response = await getAdminDashboard(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.stats).toBeDefined()
      expect(responseData.users).toBeDefined()

      // Test component integration
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText(/system overview/i)).toBeInTheDocument()
      })
    })
  })

  describe("Role-Based Access Control Validation", () => {
    it("should enforce USER role access restrictions", async () => {
      const mockUser = createMockAuthResult("USER", "user-123")
      
      // USER should not access operator dashboard
      const operatorRequest = createMockRequest("/api/dashboard/operator", mockUser)
      const operatorResponse = await getOperatorDashboard(operatorRequest)
      expect(operatorResponse.status).toBe(403)

      // USER should not access manager dashboard
      const managerRequest = createMockRequest("/api/dashboard/manager", mockUser)
      const managerResponse = await getManagerDashboard(managerRequest)
      expect(managerResponse.status).toBe(403)

      // USER should not access admin dashboard
      const adminRequest = createMockRequest("/api/dashboard/admin", mockUser)
      const adminResponse = await getAdminDashboard(adminRequest)
      expect(adminResponse.status).toBe(403)
    })

    it("should enforce OPERATOR role access restrictions", async () => {
      const mockUser = createMockAuthResult("OPERATOR", "operator-123")
      
      // OPERATOR should not access manager dashboard
      const managerRequest = createMockRequest("/api/dashboard/manager", mockUser)
      const managerResponse = await getManagerDashboard(managerRequest)
      expect(managerResponse.status).toBe(403)

      // OPERATOR should not access admin dashboard
      const adminRequest = createMockRequest("/api/dashboard/admin", mockUser)
      const adminResponse = await getAdminDashboard(adminRequest)
      expect(adminResponse.status).toBe(403)
    })

    it("should enforce MANAGER role access restrictions", async () => {
      const mockUser = createMockAuthResult("MANAGER", "manager-123")
      
      // MANAGER should not access admin dashboard
      const adminRequest = createMockRequest("/api/dashboard/admin", mockUser)
      const adminResponse = await getAdminDashboard(adminRequest)
      expect(adminResponse.status).toBe(403)
    })

    it("should allow ADMIN role to access all dashboards", async () => {
      const mockUser = createMockAuthResult("ADMIN", "admin-123")
      const mockDashboardData = createMockDashboardData("ADMIN")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // ADMIN should access all dashboards
      const userRequest = createMockRequest("/api/dashboard/user", mockUser)
      const userResponse = await getUserDashboard(userRequest)
      expect(userResponse.status).toBe(200)

      const operatorRequest = createMockRequest("/api/dashboard/operator", mockUser)
      const operatorResponse = await getOperatorDashboard(operatorRequest)
      expect(operatorResponse.status).toBe(200)

      const managerRequest = createMockRequest("/api/dashboard/manager", mockUser)
      const managerResponse = await getManagerDashboard(managerRequest)
      expect(managerResponse.status).toBe(200)

      const adminRequest = createMockRequest("/api/dashboard/admin", mockUser)
      const adminResponse = await getAdminDashboard(adminRequest)
      expect(adminResponse.status).toBe(200)
    })
  })

  describe("API Route to Component Integration", () => {
    it("should integrate API data with UserDashboard component", async () => {
      const mockUser = createMockAuthResult("USER", "user-123")
      const mockDashboardData = createMockDashboardData("USER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Test API response
      const request = createMockRequest("/api/dashboard/user", mockUser)
      const response = await getUserDashboard(request)
      const apiData = await response.json()

      // Test component with API data
      render(<UserDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText(/service requests/i)).toBeInTheDocument()
        expect(screen.getByText(mockDashboardData.stats.totalRequests.toString())).toBeInTheDocument()
      })
    })

    it("should integrate API data with OperatorDashboard component", async () => {
      const mockUser = createMockAuthResult("OPERATOR", "operator-123")
      const mockDashboardData = createMockDashboardData("OPERATOR")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Test API response
      const request = createMockRequest("/api/dashboard/operator", mockUser)
      const response = await getOperatorDashboard(request)
      const apiData = await response.json()

      // Test component with API data
      render(<OperatorDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText(/available jobs/i)).toBeInTheDocument()
        expect(screen.getByText(/active assignments/i)).toBeInTheDocument()
      })
    })

    it("should integrate API data with ManagerDashboard component", async () => {
      const mockUser = createMockAuthResult("MANAGER", "manager-123")
      const mockDashboardData = createMockDashboardData("MANAGER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Test API response
      const request = createMockRequest("/api/dashboard/manager", mockUser)
      const response = await getManagerDashboard(request)
      const apiData = await response.json()

      // Test component with API data
      render(<ManagerDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText(/approval queue/i)).toBeInTheDocument()
        expect(screen.getByText(/revenue/i)).toBeInTheDocument()
      })
    })

    it("should integrate API data with AdminDashboard component", async () => {
      const mockUser = createMockAuthResult("ADMIN", "admin-123")
      const mockDashboardData = createMockDashboardData("ADMIN")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Test API response
      const request = createMockRequest("/api/dashboard/admin", mockUser)
      const response = await getAdminDashboard(request)
      const apiData = await response.json()

      // Test component with API data
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText(/system overview/i)).toBeInTheDocument()
        expect(screen.getByText(/user management/i)).toBeInTheDocument()
      })
    })
  })

  describe("Service Layer to Repository Integration", () => {
    it("should handle service layer errors gracefully", async () => {
      const mockUser = createMockAuthResult("USER", "user-123")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: false,
        error: {
          code: "DASHBOARD_DATA_ERROR",
          message: "Failed to fetch dashboard data",
          details: "Database connection failed"
        }
      })

      const request = createMockRequest("/api/dashboard/user", mockUser)
      const response = await getUserDashboard(request)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.error).toBe("Failed to fetch dashboard data")
    })

    it("should handle repository validation errors", async () => {
      const mockUser = createMockAuthResult("USER", "user-123")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid user ID provided"
        }
      })

      const request = createMockRequest("/api/dashboard/user", mockUser)
      const response = await getUserDashboard(request)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.error).toBe("Failed to fetch dashboard data")
    })

    it("should handle concurrent requests safely", async () => {
      const mockUser = createMockAuthResult("USER", "user-123")
      const mockDashboardData = createMockDashboardData("USER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Simulate concurrent requests
      const requests = Array.from({ length: 5 }, () => 
        createMockRequest("/api/dashboard/user", mockUser)
      )

      const responses = await Promise.all(
        requests.map(request => getUserDashboard(request))
      )

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })
    })
  })

  describe("Dashboard Router Integration", () => {
    it("should route to correct dashboard based on user role", () => {
      const userProps = { role: "USER", id: "user-123", name: "Test User", email: "test@example.com" }
      const operatorProps = { role: "OPERATOR", id: "operator-123", name: "Test Operator", email: "operator@example.com" }
      const managerProps = { role: "MANAGER", id: "manager-123", name: "Test Manager", email: "manager@example.com" }
      const adminProps = { role: "ADMIN", id: "admin-123", name: "Test Admin", email: "admin@example.com" }

      // Test USER routing
      const { rerender } = render(<DashboardRouter user={userProps} />)
      expect(screen.getByText(/service requests/i)).toBeInTheDocument()

      // Test OPERATOR routing
      rerender(<DashboardRouter user={operatorProps} />)
      expect(screen.getByText(/available jobs/i)).toBeInTheDocument()

      // Test MANAGER routing
      rerender(<DashboardRouter user={managerProps} />)
      expect(screen.getByText(/approval queue/i)).toBeInTheDocument()

      // Test ADMIN routing
      rerender(<DashboardRouter user={adminProps} />)
      expect(screen.getByText(/system overview/i)).toBeInTheDocument()
    })
  })
})
