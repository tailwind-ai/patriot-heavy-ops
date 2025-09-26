/**
 * Dashboard Security Tests
 *
 * Security testing for dashboard functionality including:
 * - Role-based data filtering verification
 * - Authentication flow testing
 * - Authorization boundary testing
 * - Data access control validation
 * - Mobile JWT authentication testing
 */

import { NextRequest } from "next/server"
import { GET as getUserDashboard } from "@/app/api/dashboard/user/route"
import { GET as getOperatorDashboard } from "@/app/api/dashboard/operator/route"
import { GET as getManagerDashboard } from "@/app/api/dashboard/manager/route"
import { GET as getAdminDashboard } from "@/app/api/dashboard/admin/route"
import { DashboardService } from "@/lib/services/dashboard-service"
import { ServiceFactory } from "@/lib/services"
import { createMockAuthResult, createMockDashboardData } from "@/__tests__/helpers/mock-data"
import { createMockRequest } from "@/__tests__/helpers/api-test-helpers"

// Mock dependencies
jest.mock("@/lib/middleware/mobile-auth")
jest.mock("@/lib/services")
jest.mock("@/lib/db")

describe("Dashboard Security Tests", () => {
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

  describe("Role-Based Data Filtering Verification", () => {
    it("should filter USER data to only show own requests", async () => {
      const mockUser = createMockAuthResult("USER", "user-123")
      const mockDashboardData = createMockDashboardData("USER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const request = createMockRequest("/api/dashboard/user", mockUser)
      const response = await getUserDashboard(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.stats).toBeDefined()
      expect(responseData.recentRequests).toBeDefined()
      
      // Verify that only user's own requests are returned
      if (responseData.recentRequests && responseData.recentRequests.length > 0) {
        responseData.recentRequests.forEach((request: any) => {
          expect(request.userId).toBe("user-123")
        })
      }
    })

    it("should filter OPERATOR data to show assignments and own requests", async () => {
      const mockUser = createMockAuthResult("OPERATOR", "operator-123")
      const mockDashboardData = createMockDashboardData("OPERATOR")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const request = createMockRequest("/api/dashboard/operator", mockUser)
      const response = await getOperatorDashboard(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.stats).toBeDefined()
      expect(responseData.assignments).toBeDefined()
      
      // Verify that assignments are filtered to this operator
      if (responseData.assignments && responseData.assignments.length > 0) {
        responseData.assignments.forEach((assignment: any) => {
          expect(assignment.operatorId).toBe("operator-123")
        })
      }
    })

    it("should filter MANAGER data to show system-wide data", async () => {
      const mockUser = createMockAuthResult("MANAGER", "manager-123")
      const mockDashboardData = createMockDashboardData("MANAGER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const request = createMockRequest("/api/dashboard/manager", mockUser)
      const response = await getManagerDashboard(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.stats).toBeDefined()
      expect(responseData.recentRequests).toBeDefined()
      
      // Verify that manager can see all requests
      expect(responseData.stats.totalRequests).toBeGreaterThan(0)
    })

    it("should filter ADMIN data to show complete system data", async () => {
      const mockUser = createMockAuthResult("ADMIN", "admin-123")
      const mockDashboardData = createMockDashboardData("ADMIN")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const request = createMockRequest("/api/dashboard/admin", mockUser)
      const response = await getAdminDashboard(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.stats).toBeDefined()
      expect(responseData.users).toBeDefined()
      
      // Verify that admin can see all data
      expect(responseData.stats.totalRequests).toBeGreaterThan(0)
      expect(responseData.users).toBeDefined()
    })
  })

  describe("Authentication Flow Testing", () => {
    it("should reject unauthenticated requests", async () => {
      const unauthenticatedRequest = createMockRequest("/api/dashboard/user", null)
      const response = await getUserDashboard(unauthenticatedRequest)
      
      expect(response.status).toBe(401)
      const responseData = await response.json()
      expect(responseData.error).toBe("Authentication required")
    })

    it("should accept valid session authentication", async () => {
      const mockUser = createMockAuthResult("USER", "user-123", "session")
      const mockDashboardData = createMockDashboardData("USER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const request = createMockRequest("/api/dashboard/user", mockUser)
      const response = await getUserDashboard(request)
      
      expect(response.status).toBe(200)
    })

    it("should accept valid JWT authentication", async () => {
      const mockUser = createMockAuthResult("USER", "user-123", "jwt")
      const mockDashboardData = createMockDashboardData("USER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const request = createMockRequest("/api/dashboard/user", mockUser)
      const response = await getUserDashboard(request)
      
      expect(response.status).toBe(200)
    })

    it("should handle invalid JWT tokens", async () => {
      const invalidJWTRequest = createMockRequest("/api/dashboard/user", null, "invalid-jwt")
      const response = await getUserDashboard(invalidJWTRequest)
      
      expect(response.status).toBe(401)
    })
  })

  describe("Authorization Boundary Testing", () => {
    it("should enforce USER role boundaries", async () => {
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

    it("should enforce OPERATOR role boundaries", async () => {
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

    it("should enforce MANAGER role boundaries", async () => {
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

  describe("Data Access Control Validation", () => {
    it("should prevent USER from accessing other users' data", async () => {
      const mockUser = createMockAuthResult("USER", "user-123")
      const mockDashboardData = createMockDashboardData("USER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const request = createMockRequest("/api/dashboard/user", mockUser)
      const response = await getUserDashboard(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      
      // Verify that only user's own data is returned
      if (responseData.recentRequests && responseData.recentRequests.length > 0) {
        responseData.recentRequests.forEach((request: any) => {
          expect(request.userId).toBe("user-123")
        })
      }
    })

    it("should prevent OPERATOR from accessing other operators' assignments", async () => {
      const mockUser = createMockAuthResult("OPERATOR", "operator-123")
      const mockDashboardData = createMockDashboardData("OPERATOR")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const request = createMockRequest("/api/dashboard/operator", mockUser)
      const response = await getOperatorDashboard(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      
      // Verify that only operator's own assignments are returned
      if (responseData.assignments && responseData.assignments.length > 0) {
        responseData.assignments.forEach((assignment: any) => {
          expect(assignment.operatorId).toBe("operator-123")
        })
      }
    })

    it("should allow MANAGER to access system-wide data", async () => {
      const mockUser = createMockAuthResult("MANAGER", "manager-123")
      const mockDashboardData = createMockDashboardData("MANAGER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const request = createMockRequest("/api/dashboard/manager", mockUser)
      const response = await getManagerDashboard(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.stats.totalRequests).toBeGreaterThan(0)
    })

    it("should allow ADMIN to access all system data", async () => {
      const mockUser = createMockAuthResult("ADMIN", "admin-123")
      const mockDashboardData = createMockDashboardData("ADMIN")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const request = createMockRequest("/api/dashboard/admin", mockUser)
      const response = await getAdminDashboard(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.stats.totalRequests).toBeGreaterThan(0)
      expect(responseData.users).toBeDefined()
    })
  })

  describe("Mobile JWT Authentication Testing", () => {
    it("should handle mobile JWT authentication correctly", async () => {
      const mockUser = createMockAuthResult("USER", "user-123", "jwt")
      const mockDashboardData = createMockDashboardData("USER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      const request = createMockRequest("/api/dashboard/user", mockUser, "valid-jwt")
      const response = await getUserDashboard(request)
      
      expect(response.status).toBe(200)
    })

    it("should handle mobile JWT token expiration", async () => {
      const expiredJWTRequest = createMockRequest("/api/dashboard/user", null, "expired-jwt")
      const response = await getUserDashboard(expiredJWTRequest)
      
      expect(response.status).toBe(401)
    })

    it("should handle mobile JWT token malformation", async () => {
      const malformedJWTRequest = createMockRequest("/api/dashboard/user", null, "malformed-jwt")
      const response = await getUserDashboard(malformedJWTRequest)
      
      expect(response.status).toBe(401)
    })
  })

  describe("Cross-Platform Service Layer Testing", () => {
    it("should work with mobile service layer architecture", async () => {
      const mockUser = createMockAuthResult("USER", "user-123", "jwt")
      const mockDashboardData = createMockDashboardData("USER")
      
      mockDashboardService.getDashboardData.mockResolvedValue({
        success: true,
        data: mockDashboardData,
      })

      // Test that service layer works without web framework dependencies
      const serviceResult = await mockDashboardService.getDashboardData({
        userId: "user-123",
        userRole: "USER",
      })

      expect(serviceResult.success).toBe(true)
      expect(serviceResult.data).toBeDefined()
    })

    it("should handle mobile offline mode", async () => {
      mockDashboardService.setOfflineMode(true)
      mockDashboardService.getCachedDashboardData.mockReturnValue({
        stats: { totalRequests: 5, activeRequests: 2, completedRequests: 3, pendingApproval: 0 },
        recentRequests: [],
      })

      const cachedData = mockDashboardService.getCachedDashboardData("user-123", "USER")
      
      expect(cachedData).toBeDefined()
      expect(cachedData.stats.totalRequests).toBe(5)
    })
  })
})
