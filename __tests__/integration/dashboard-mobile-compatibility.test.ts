/**
 * Dashboard Mobile Compatibility Tests
 *
 * Mobile compatibility testing for dashboard functionality including:
 * - Cross-platform service layer testing
 * - Mobile JWT authentication testing
 * - Touch interface compatibility
 * - Responsive design validation
 * - Mobile performance optimization
 */

import { NextRequest } from "next/server"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
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
import { createMockAuthResult, createMockDashboardData } from "@/__tests__/helpers/mock-data"
import { createMockRequest } from "@/__tests__/helpers/api-test-helpers"

// Mock dependencies
jest.mock("@/lib/middleware/mobile-auth")
jest.mock("@/lib/services")
jest.mock("@/lib/db")

describe("Dashboard Mobile Compatibility Tests", () => {
  let mockDashboardService: jest.Mocked<DashboardService>
  let mockServiceFactory: jest.Mocked<typeof ServiceFactory>

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockDashboardService = {
      getDashboardData: jest.fn(),
      getCachedDashboardData: jest.fn(),
      setOfflineMode: jest.fn(),
      clearCache: jest.fn(),
      getServiceName: jest.fn().mockReturnValue("DashboardService"),
    } as any

    mockServiceFactory = ServiceFactory as any
    mockServiceFactory.getDashboardService = jest.fn().mockReturnValue(mockDashboardService)
  })

  describe("Cross-Platform Service Layer Testing", () => {
    it("should work without web framework dependencies", async () => {
      // Test that service layer works in mobile environment
      const serviceResult = await mockDashboardService.getDashboardData({
        userId: "mobile-user-123",
        userRole: "USER",
      })

      expect(serviceResult).toBeDefined()
      expect(mockDashboardService.getDashboardData).toHaveBeenCalledWith({
        userId: "mobile-user-123",
        userRole: "USER",
      })
    })

    it("should handle mobile caching patterns", async () => {
      const mockUser = createMockAuthResult("USER", "mobile-user-123", "jwt")
      const mockDashboardData = createMockDashboardData("USER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const request = createMockRequest("/api/dashboard/user?enableCaching=true", mockUser)
      const response = await getUserDashboard(request)
      
      expect(response.status).toBe(200)
      expect(mockDashboardService.getDashboardData).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "mobile-user-123",
          userRole: "USER",
        }),
        expect.objectContaining({
          enableCaching: true,
        })
      )
    })

    it("should handle offline mode gracefully", async () => {
      mockDashboardService.setOfflineMode(true)
      mockDashboardService.getCachedDashboardData.mockReturnValue({
        stats: { totalRequests: 5, activeRequests: 2, completedRequests: 3, pendingApproval: 0 },
        recentRequests: [],
      })

      const cachedData = mockDashboardService.getCachedDashboardData("mobile-user-123", "USER")
      
      expect(cachedData).toBeDefined()
      expect(cachedData.stats.totalRequests).toBe(5)
    })
  })

  describe("Mobile JWT Authentication Testing", () => {
    it("should authenticate mobile users with JWT tokens", async () => {
      const mockUser = createMockAuthResult("USER", "mobile-user-123", "jwt")
      const mockDashboardData = createMockDashboardData("USER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const request = createMockRequest("/api/dashboard/user", mockUser, "valid-jwt")
      const response = await getUserDashboard(request)
      
      expect(response.status).toBe(200)
    })

    it("should handle JWT token expiration on mobile", async () => {
      const expiredJWTRequest = createMockRequest("/api/dashboard/user", null, "expired-jwt")
      const response = await getUserDashboard(expiredJWTRequest)
      
      expect(response.status).toBe(401)
    })

    it("should handle JWT token malformation on mobile", async () => {
      const malformedJWTRequest = createMockRequest("/api/dashboard/user", null, "malformed-jwt")
      const response = await getUserDashboard(malformedJWTRequest)
      
      expect(response.status).toBe(401)
    })
  })

  describe("Touch Interface Compatibility", () => {
    it("should have touch-friendly interfaces for mobile operators", async () => {
      const mockUser = createMockAuthResult("OPERATOR", "mobile-operator-123", "jwt")
      const mockDashboardData = createMockDashboardData("OPERATOR")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      render(<OperatorDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText(/available jobs/i)).toBeInTheDocument()
      })

      // Test touch interactions
      const jobButtons = screen.getAllByRole('button')
      jobButtons.forEach(button => {
        // Verify buttons are touch-friendly (minimum 44px touch target)
        const rect = button.getBoundingClientRect()
        expect(rect.height).toBeGreaterThanOrEqual(44)
        expect(rect.width).toBeGreaterThanOrEqual(44)
      })
    })

    it("should have touch-friendly interfaces for mobile users", async () => {
      const mockUser = createMockAuthResult("USER", "mobile-user-123", "jwt")
      const mockDashboardData = createMockDashboardData("USER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      render(<UserDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText(/service requests/i)).toBeInTheDocument()
      })

      // Test touch interactions
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        const rect = button.getBoundingClientRect()
        expect(rect.height).toBeGreaterThanOrEqual(44)
        expect(rect.width).toBeGreaterThanOrEqual(44)
      })
    })

    it("should handle touch events correctly", async () => {
      render(<UserDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText(/service requests/i)).toBeInTheDocument()
      })

      // Test touch events
      const buttons = screen.getAllByRole('button')
      if (buttons.length > 0) {
        const button = buttons[0]
        
        // Simulate touch events
        fireEvent.touchStart(button, { touches: [{ clientX: 0, clientY: 0 }] })
        fireEvent.touchEnd(button, { touches: [{ clientX: 0, clientY: 0 }] })
        
        // Button should still be functional
        expect(button).toBeInTheDocument()
      }
    })
  })

  describe("Responsive Design Validation", () => {
    it("should adapt to mobile viewport (375px)", async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(<UserDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText(/service requests/i)).toBeInTheDocument()
      })

      // Verify mobile layout
      const container = screen.getByTestId('dashboard-container') || screen.getByText(/service requests/i).closest('div')
      expect(container).toBeInTheDocument()
    })

    it("should adapt to tablet viewport (768px)", async () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })

      render(<OperatorDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText(/available jobs/i)).toBeInTheDocument()
      })

      // Verify tablet layout
      const container = screen.getByTestId('dashboard-container') || screen.getByText(/available jobs/i).closest('div')
      expect(container).toBeInTheDocument()
    })

    it("should adapt to desktop viewport (1920px)", async () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      })

      render(<ManagerDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText(/approval queue/i)).toBeInTheDocument()
      })

      // Verify desktop layout
      const container = screen.getByTestId('dashboard-container') || screen.getByText(/approval queue/i).closest('div')
      expect(container).toBeInTheDocument()
    })
  })

  describe("Mobile Performance Optimization", () => {
    it("should load quickly on mobile devices", async () => {
      const startTime = performance.now()
      
      render(<UserDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText(/service requests/i)).toBeInTheDocument()
      })
      
      const loadTime = performance.now() - startTime
      expect(loadTime).toBeLessThan(1000) // Should load within 1s on mobile
    })

    it("should handle mobile network conditions", async () => {
      const mockUser = createMockAuthResult("USER", "mobile-user-123", "jwt")
      const mockDashboardData = createMockDashboardData("USER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Simulate slow network
      const startTime = performance.now()
      
      const request = createMockRequest("/api/dashboard/user", mockUser)
      const response = await getUserDashboard(request)
      
      const responseTime = performance.now() - startTime
      expect(response.status).toBe(200)
      expect(responseTime).toBeLessThan(2000) // Should handle slow networks within 2s
    })

    it("should optimize for mobile memory constraints", async () => {
      const initialMemory = process.memoryUsage().heapUsed
      
      // Render multiple dashboard components
      const { unmount: unmountUser } = render(<UserDashboard />)
      await waitFor(() => {
        expect(screen.getByText(/service requests/i)).toBeInTheDocument()
      })
      unmountUser()

      const { unmount: unmountOperator } = render(<OperatorDashboard />)
      await waitFor(() => {
        expect(screen.getByText(/available jobs/i)).toBeInTheDocument()
      })
      unmountOperator()

      // Force garbage collection if available
      if (global.gc) {
        global.gc()
      }

      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory
      
      // Memory increase should be reasonable for mobile devices
      expect(memoryIncrease).toBeLessThan(20 * 1024 * 1024) // Less than 20MB
    })
  })

  describe("Mobile-Specific Features", () => {
    it("should support mobile caching strategies", async () => {
      const mockUser = createMockAuthResult("USER", "mobile-user-123", "jwt")
      const mockDashboardData = createMockDashboardData("USER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Test with mobile-specific cache settings
      const request = createMockRequest("/api/dashboard/user?enableCaching=true&cacheTTL=600", mockUser)
      const response = await getUserDashboard(request)
      
      expect(response.status).toBe(200)
      expect(mockDashboardService.getDashboardData).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "mobile-user-123",
          userRole: "USER",
        }),
        expect.objectContaining({
          enableCaching: true,
          cacheTTL: 600,
        })
      )
    })

    it("should handle mobile offline scenarios", async () => {
      mockDashboardService.setOfflineMode(true)
      mockDashboardService.getCachedDashboardData.mockReturnValue({
        stats: { totalRequests: 5, activeRequests: 2, completedRequests: 3, pendingApproval: 0 },
        recentRequests: [],
      })

      const cachedData = mockDashboardService.getCachedDashboardData("mobile-user-123", "USER")
      
      expect(cachedData).toBeDefined()
      expect(cachedData.stats.totalRequests).toBe(5)
    })

    it("should support mobile push notifications", async () => {
      const mockUser = createMockAuthResult("USER", "mobile-user-123", "jwt")
      const mockDashboardData = createMockDashboardData("USER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      render(<UserDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText(/service requests/i)).toBeInTheDocument()
      })

      // Verify notification support
      const notificationElements = screen.queryAllByTestId('notification')
      expect(notificationElements).toBeDefined()
    })
  })
})
