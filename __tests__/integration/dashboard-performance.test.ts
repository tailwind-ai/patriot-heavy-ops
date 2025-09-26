/**
 * Dashboard Performance Tests
 *
 * Performance testing for dashboard functionality including:
 * - Dashboard load time benchmarks
 * - Mobile performance validation
 * - API response time testing
 * - Component rendering performance
 * - Mobile compatibility and responsive design
 */

import React from "react"
import { NextRequest } from "next/server"
import { render, screen, waitFor } from "@testing-library/react"
import { performance } from "perf_hooks"
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

describe("Dashboard Performance Tests", () => {
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

  describe("Dashboard Load Time Benchmarks", () => {
    it("should load USER dashboard within performance threshold", async () => {
      const mockUser = createMockAuthResult("USER", "user-123")
      const mockDashboardData = createMockDashboardData("USER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const startTime = performance.now()
      
      // Test API response time
      const request = createMockRequest("/api/dashboard/user", mockUser)
      const response = await getUserDashboard(request)
      const apiTime = performance.now() - startTime

      expect(response.status).toBe(200)
      expect(apiTime).toBeLessThan(500) // API should respond within 500ms

      // Test component rendering time
      const renderStart = performance.now()
      render(React.createElement(UserDashboard))
      
      await waitFor(() => {
        expect(screen.getByText(/service requests/i)).toBeInTheDocument()
      })
      const renderTime = performance.now() - renderStart

      expect(renderTime).toBeLessThan(1000) // Component should render within 1s
    })

    it("should load OPERATOR dashboard within performance threshold", async () => {
      const mockUser = createMockAuthResult("OPERATOR", "operator-123")
      const mockDashboardData = createMockDashboardData("OPERATOR")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const startTime = performance.now()
      
      const request = createMockRequest("/api/dashboard/operator", mockUser)
      const response = await getOperatorDashboard(request)
      const apiTime = performance.now() - startTime

      expect(response.status).toBe(200)
      expect(apiTime).toBeLessThan(500)

      const renderStart = performance.now()
      render(React.createElement(OperatorDashboard))
      
      await waitFor(() => {
        expect(screen.getByText(/available jobs/i)).toBeInTheDocument()
      })
      const renderTime = performance.now() - renderStart

      expect(renderTime).toBeLessThan(1000)
    })

    it("should load MANAGER dashboard within performance threshold", async () => {
      const mockUser = createMockAuthResult("MANAGER", "manager-123")
      const mockDashboardData = createMockDashboardData("MANAGER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const startTime = performance.now()
      
      const request = createMockRequest("/api/dashboard/manager", mockUser)
      const response = await getManagerDashboard(request)
      const apiTime = performance.now() - startTime

      expect(response.status).toBe(200)
      expect(apiTime).toBeLessThan(500)

      const renderStart = performance.now()
      render(React.createElement(ManagerDashboard))
      
      await waitFor(() => {
        expect(screen.getByText(/approval queue/i)).toBeInTheDocument()
      })
      const renderTime = performance.now() - renderStart

      expect(renderTime).toBeLessThan(1000)
    })

    it("should load ADMIN dashboard within performance threshold", async () => {
      const mockUser = createMockAuthResult("ADMIN", "admin-123")
      const mockDashboardData = createMockDashboardData("ADMIN")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const startTime = performance.now()
      
      const request = createMockRequest("/api/dashboard/admin", mockUser)
      const response = await getAdminDashboard(request)
      const apiTime = performance.now() - startTime

      expect(response.status).toBe(200)
      expect(apiTime).toBeLessThan(500)

      const renderStart = performance.now()
      render(React.createElement(AdminDashboard))
      
      await waitFor(() => {
        expect(screen.getByText(/system overview/i)).toBeInTheDocument()
      })
      const renderTime = performance.now() - renderStart

      expect(renderTime).toBeLessThan(1000)
    })
  })

  describe("API Response Time Testing", () => {
    it("should handle large datasets efficiently", async () => {
      const mockUser = createMockAuthResult("USER", "user-123")
      const largeDataset = createMockDashboardData("USER", 1000) // 1000 requests
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: largeDataset,
      })

      const startTime = performance.now()
      
      const request = createMockRequest("/api/dashboard/user?limit=100", mockUser)
      const response = await getUserDashboard(request)
      const responseTime = performance.now() - startTime

      expect(response.status).toBe(200)
      expect(responseTime).toBeLessThan(1000) // Should handle large datasets within 1s
    })

    it("should handle concurrent API requests efficiently", async () => {
      const mockUser = createMockAuthResult("USER", "user-123")
      const mockDashboardData = createMockDashboardData("USER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const startTime = performance.now()
      
      // Simulate 10 concurrent requests
      const requests = Array.from({ length: 10 }, () => 
        createMockRequest("/api/dashboard/user", mockUser)
      )

      const responses = await Promise.all(
        requests.map(request => getUserDashboard(request))
      )
      const totalTime = performance.now() - startTime

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })

      // Concurrent requests should complete within reasonable time
      expect(totalTime).toBeLessThan(2000) // 2s for 10 concurrent requests
    })

    it("should handle different data loads efficiently", async () => {
      const mockUser = createMockAuthResult("USER", "user-123")
      
      // Test with different data sizes
      const dataSizes = [10, 50, 100, 500]
      
      for (const size of dataSizes) {
        const mockData = createMockDashboardData("USER", size)
        mockDashboardService.getDashboardData.mockResolvedValue({
          success: true,
          data: mockData,
        })

        const startTime = performance.now()
        
        const request = createMockRequest(`/api/dashboard/user?limit=${size}`, mockUser)
        const response = await getUserDashboard(request)
        const responseTime = performance.now() - startTime

        expect(response.status).toBe(200)
        expect(responseTime).toBeLessThan(500) // Should handle any size within 500ms
      }
    })
  })

  describe("Component Rendering Performance", () => {
    it("should render UserDashboard efficiently", async () => {
      const startTime = performance.now()
      
      render(React.createElement(UserDashboard))
      
      await waitFor(() => {
        expect(screen.getByText(/service requests/i)).toBeInTheDocument()
      })
      
      const renderTime = performance.now() - startTime
      expect(renderTime).toBeLessThan(1000) // Should render within 1s
    })

    it("should render OperatorDashboard efficiently", async () => {
      const startTime = performance.now()
      
      render(React.createElement(OperatorDashboard))
      
      await waitFor(() => {
        expect(screen.getByText(/available jobs/i)).toBeInTheDocument()
      })
      
      const renderTime = performance.now() - startTime
      expect(renderTime).toBeLessThan(1000)
    })

    it("should render ManagerDashboard efficiently", async () => {
      const startTime = performance.now()
      
      render(React.createElement(ManagerDashboard))
      
      await waitFor(() => {
        expect(screen.getByText(/approval queue/i)).toBeInTheDocument()
      })
      
      const renderTime = performance.now() - startTime
      expect(renderTime).toBeLessThan(1000)
    })

    it("should render AdminDashboard efficiently", async () => {
      const startTime = performance.now()
      
      render(React.createElement(AdminDashboard))
      
      await waitFor(() => {
        expect(screen.getByText(/system overview/i)).toBeInTheDocument()
      })
      
      const renderTime = performance.now() - startTime
      expect(renderTime).toBeLessThan(1000)
    })
  })

  describe("Mobile Performance Validation", () => {
    it("should handle mobile viewport efficiently", async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375, // Mobile width
      })

      const startTime = performance.now()
      
      render(React.createElement(UserDashboard))
      
      await waitFor(() => {
        expect(screen.getByText(/service requests/i)).toBeInTheDocument()
      })
      
      const renderTime = performance.now() - startTime
      expect(renderTime).toBeLessThan(1000) // Should render quickly on mobile
    })

    it("should handle tablet viewport efficiently", async () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768, // Tablet width
      })

      const startTime = performance.now()
      
      render(React.createElement(OperatorDashboard))
      
      await waitFor(() => {
        expect(screen.getByText(/available jobs/i)).toBeInTheDocument()
      })
      
      const renderTime = performance.now() - startTime
      expect(renderTime).toBeLessThan(1000)
    })

    it("should handle desktop viewport efficiently", async () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920, // Desktop width
      })

      const startTime = performance.now()
      
      render(React.createElement(ManagerDashboard))
      
      await waitFor(() => {
        expect(screen.getByText(/approval queue/i)).toBeInTheDocument()
      })
      
      const renderTime = performance.now() - startTime
      expect(renderTime).toBeLessThan(1000)
    })
  })

  describe("Memory Usage Optimization", () => {
    it("should not leak memory during repeated renders", async () => {
      const initialMemory = process.memoryUsage().heapUsed
      
      // Render and unmount multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<UserDashboard />)
        
        await waitFor(() => {
          expect(screen.getByText(/service requests/i)).toBeInTheDocument()
        })
        
        unmount()
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc()
      }
      
      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
    })

    it("should handle large datasets without memory issues", async () => {
      const mockUser = createMockAuthResult("USER", "user-123")
      const largeDataset = createMockDashboardData("USER", 5000) // 5000 requests
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: largeDataset,
      })

      const initialMemory = process.memoryUsage().heapUsed
      
      const request = createMockRequest("/api/dashboard/user?limit=100", mockUser)
      const response = await getUserDashboard(request)
      
      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory
      
      expect(response.status).toBe(200)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024) // Less than 50MB increase
    })
  })
})
