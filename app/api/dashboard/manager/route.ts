import { NextRequest } from "next/server"
import { z } from "zod"

import { authenticateRequest, hasRole } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"
import { UserRole } from "@/lib/permissions"
import type { DashboardDataOptions } from "@/lib/services/dashboard-service"

/**
 * Query parameters schema for dashboard manager endpoint
 */
const dashboardManagerQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  offset: z.coerce.number().min(0).optional().default(0),
  enableCaching: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined) return true
      return val !== "false" && val !== "0"
    }),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

/**
 * GET /api/dashboard/manager
 * 
 * Returns manager-specific dashboard data including:
 * - System-wide service request statistics with revenue
 * - All service requests with user and operator details
 * - Active assignments across all operators
 * - Optional date range filtering
 * 
 * Requires MANAGER role or higher
 * Supports both session cookies and JWT Bearer tokens
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate request (supports both JWT and session)
    const authResult = await authenticateRequest(req)
    
    if (!authResult.isAuthenticated || !authResult.user) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { 
          status: 401,
          headers: { 
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate"
          }
        }
      )
    }

    // Check if user has MANAGER role or higher
    if (!hasRole(authResult.user, "MANAGER")) {
      return new Response(
        JSON.stringify({ error: "Manager access required" }),
        { 
          status: 403,
          headers: { 
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate"
          }
        }
      )
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url)
    const queryResult = dashboardManagerQuerySchema.safeParse({
      limit: searchParams.get("limit") || undefined,
      offset: searchParams.get("offset") || undefined,
      enableCaching: searchParams.get("enableCaching") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    })

    if (!queryResult.success) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid query parameters",
          details: queryResult.error.issues
        }),
        { 
          status: 422,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    const { limit, offset, enableCaching, startDate, endDate } = queryResult.data

    // Validate date range if provided
    if (startDate && endDate && startDate > endDate) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid date range: startDate must be before endDate"
        }),
        { 
          status: 422,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    // Get dashboard service instance
    const dashboardService = ServiceFactory.getDashboardService()

    // Build options for service call
    const options: DashboardDataOptions = {
      userId: authResult.user.id,
      userRole: "MANAGER" as UserRole,
      limit,
      offset,
      ...(startDate && endDate && { dateRange: { start: startDate, end: endDate } }),
    }

    // Fetch dashboard data using service layer
    const result = await dashboardService.getDashboardData(options,
      {
        enableCaching,
        cacheKey: `dashboard_manager_${authResult.user.id}_${limit}_${offset}_${startDate?.toISOString()}_${endDate?.toISOString()}`,
        cacheTTL: 120, // 2 minutes (management data changes frequently)
      }
    )

    if (!result.success) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to fetch dashboard data",
          details: result.error?.message
        }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    // Return successful response with appropriate caching headers
    const cacheHeaders = enableCaching 
      ? { "Cache-Control": "private, max-age=120" } // 2 minutes for management data
      : { "Cache-Control": "no-cache, no-store, must-revalidate" }

    return new Response(
      JSON.stringify({
        data: result.data,
        meta: {
          limit,
          offset,
          dateRange: startDate && endDate ? { startDate, endDate } : null,
          authMethod: authResult.authMethod,
          userRole: authResult.user.role,
          cached: enableCaching
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...cacheHeaders,
          "X-RateLimit-Limit": "200",
          "X-RateLimit-Remaining": "199", // TODO: Implement actual rate limiting
        }
      }
    )

  } catch (error) {
    console.error("Dashboard manager API error:", error)
    
    // Handle Response objects thrown by middleware
    if (error instanceof Response) {
      return error
    }

    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}
