/**
 * Date Transform Utility Tests
 * 
 * Tests for interface → type conversion and [key: string]: unknown pattern fixes
 * Following TDD approach for Issue #300 Phase 1C
 */

import {
  transformServiceRequest,
  transformAssignment,
  transformUser,
  transformDashboardData,
} from "@/lib/utils/date-transform"

describe("Date Transform Utility - Interface → Type Conversion Tests", () => {
  describe("Interface → Type Conversion", () => {
    it("should fail: All interfaces should be converted to types", () => {
      // This test will fail until we convert interfaces to types
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs")
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path")
      const dateTransformSource = fs.readFileSync(
        path.join(process.cwd(), "lib/utils/date-transform.ts"),
        "utf8"
      )
      
      // Should NOT contain any interface definitions
      const interfaceMatches = dateTransformSource.match(/^interface\s+\w+/gm) || []
      expect(interfaceMatches.length).toBe(0)
      
      // Should contain type definitions instead (8 original + 1 AdditionalProperties)
      const typeMatches = dateTransformSource.match(/^type\s+\w+\s*=/gm) || []
      expect(typeMatches.length).toBe(9) // 8 interfaces + 1 AdditionalProperties type
    })

    it("should fail: [key: string]: unknown patterns should be replaced with specific types", () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs")
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path")
      const dateTransformSource = fs.readFileSync(
        path.join(process.cwd(), "lib/utils/date-transform.ts"),
        "utf8"
      )
      
      // Should NOT contain [key: string]: unknown patterns
      const unknownPatterns = dateTransformSource.match(/\[key: string\]:\s*unknown/g) || []
      expect(unknownPatterns.length).toBe(0)
    })
  })

  describe("Type Safety Validation", () => {
    it("should maintain backward compatibility for transformServiceRequest", () => {
      const input = {
        id: "req-123",
        title: "Test Request",
        status: "PENDING",
        equipmentCategory: "EXCAVATOR",
        jobSite: "Test Site",
        startDate: "2024-01-01T10:00:00Z",
        endDate: "2024-01-02T18:00:00Z",
        requestedDurationType: "FULL_DAY",
        requestedDurationValue: 2,
        requestedTotalHours: 16,
        estimatedCost: 1000,
        createdAt: "2024-01-01T08:00:00Z",
        updatedAt: "2024-01-01T09:00:00Z",
        customField: "custom value"
      }
      
      const result = transformServiceRequest(input)
      
      expect(result.id).toBe("req-123")
      expect(result.startDate).toBeInstanceOf(Date)
      expect(result.endDate).toBeInstanceOf(Date)
      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.updatedAt).toBeInstanceOf(Date)
      expect(result.customField).toBe("custom value")
    })

    it("should maintain backward compatibility for transformAssignment", () => {
      const input = {
        id: "assign-123",
        serviceRequestId: "req-123",
        operatorId: "op-123",
        assignedAt: "2024-01-01T10:00:00Z",
        status: "ACTIVE",
        serviceRequest: {
          id: "req-123",
          title: "Test Request",
          status: "PENDING",
          equipmentCategory: "EXCAVATOR",
          jobSite: "Test Site",
          startDate: "2024-01-01T10:00:00Z",
          endDate: "2024-01-02T18:00:00Z",
          requestedDurationType: "FULL_DAY",
          requestedDurationValue: 2,
          requestedTotalHours: 16,
          estimatedCost: 1000,
          createdAt: "2024-01-01T08:00:00Z",
          updatedAt: "2024-01-01T09:00:00Z",
        },
        customField: "assignment custom"
      }
      
      const result = transformAssignment(input)
      
      expect(result.id).toBe("assign-123")
      expect(result.assignedAt).toBeInstanceOf(Date)
      expect(result.serviceRequest.startDate).toBeInstanceOf(Date)
      expect(result.customField).toBe("assignment custom")
    })

    it("should maintain backward compatibility for transformUser", () => {
      const input = {
        id: "user-123",
        name: "John Doe",
        email: "john@example.com",
        role: "OPERATOR",
        company: "Test Company",
        createdAt: "2024-01-01T08:00:00Z",
        customField: "user custom"
      }
      
      const result = transformUser(input)
      
      expect(result.id).toBe("user-123")
      expect(result.name).toBe("John Doe")
      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.customField).toBe("user custom")
    })

    it("should maintain backward compatibility for transformDashboardData", () => {
      const input = {
        data: {
          stats: {
            totalRequests: 10,
            activeRequests: 5,
            completedRequests: 3,
            pendingApproval: 2
          },
          recentRequests: [{
            id: "req-123",
            title: "Test Request",
            status: "PENDING",
            equipmentCategory: "EXCAVATOR",
            jobSite: "Test Site",
            startDate: "2024-01-01T10:00:00Z",
            endDate: "2024-01-02T18:00:00Z",
            requestedDurationType: "FULL_DAY",
            requestedDurationValue: 2,
            requestedTotalHours: 16,
            estimatedCost: 1000,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T09:00:00Z",
          }],
          assignments: [],
          users: []
        }
      }
      
      const result = transformDashboardData(input)
      
      expect(result.stats.totalRequests).toBe(10)
      expect(result.recentRequests).toHaveLength(1)
      expect(result.recentRequests[0]?.startDate).toBeInstanceOf(Date)
      expect(result.assignments).toHaveLength(0)
      expect(result.users).toHaveLength(0)
    })
  })

  describe("Functional Behavior (should remain unchanged)", () => {
    it("should handle null endDate correctly", () => {
      const input = {
        id: "req-123",
        title: "Test Request",
        status: "PENDING",
        equipmentCategory: "EXCAVATOR",
        jobSite: "Test Site",
        startDate: "2024-01-01T10:00:00Z",
        endDate: null,
        requestedDurationType: "FULL_DAY",
        requestedDurationValue: 1,
        requestedTotalHours: 8,
        estimatedCost: 500,
        createdAt: "2024-01-01T08:00:00Z",
        updatedAt: "2024-01-01T09:00:00Z",
      }
      
      const result = transformServiceRequest(input)
      
      expect(result.endDate).toBeNull()
      expect(result.startDate).toBeInstanceOf(Date)
    })

    it("should handle empty arrays in dashboard data", () => {
      const input = {
        data: {
          stats: {
            totalRequests: 0,
            activeRequests: 0,
            completedRequests: 0,
            pendingApproval: 0
          }
        }
      }
      
      const result = transformDashboardData(input)
      
      expect(result.recentRequests).toHaveLength(0)
      expect(result.assignments).toHaveLength(0)
      expect(result.users).toHaveLength(0)
    })

    it("should preserve all original properties", () => {
      const input = {
        id: "req-123",
        title: "Test Request",
        status: "PENDING",
        equipmentCategory: "EXCAVATOR",
        jobSite: "Test Site",
        startDate: "2024-01-01T10:00:00Z",
        endDate: "2024-01-02T18:00:00Z",
        requestedDurationType: "FULL_DAY",
        requestedDurationValue: 2,
        requestedTotalHours: 16,
        estimatedCost: 1000,
        createdAt: "2024-01-01T08:00:00Z",
        updatedAt: "2024-01-01T09:00:00Z",
        customProperty: "should be preserved",
        nestedObject: { key: "value" },
        arrayProperty: [1, 2, 3]
      }
      
      const result = transformServiceRequest(input)
      
      // All original properties should be preserved
      expect(result.customProperty).toBe("should be preserved")
      expect(result.nestedObject).toEqual({ key: "value" })
      expect(result.arrayProperty).toEqual([1, 2, 3])
    })
  })
})
