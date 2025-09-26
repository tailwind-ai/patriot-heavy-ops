import { NextRequest } from "next/server"
import { z } from "zod"

import { authenticateRequest, hasRole } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"
import { UserRole } from "@/lib/permissions"

/**
 * Query parameters schema for dashboard admin endpoint
 */
const dashboardAdminQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(25),
  offset: z.coerce.number().min(0).optional().default(0),
  enableCaching: z.coerce.boolean().optional().default(true),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

/**
 * GET /api/dashboard/admin
 *
 * Returns admin-specific dashboard data including:
 * - Complete system statistics with revenue and average job duration
 * - All service requests with full user and operator details
 * - All active assignments across the platform
 * - Recent user registrations and activity
 * - Optional date range filtering for analytics
 *
 * Requires ADMIN role
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
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }
      )
    }

    // Check if user has ADMIN role (exact match required)
    if (!hasRole(authResult.user, "ADMIN")) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      })
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url)
    const queryResult = dashboardAdminQuerySchema.safeParse({
      limit: searchParams.get("limit"),
      offset: searchParams.get("offset"),
      enableCaching: searchParams.get("enableCaching"),
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
    })

    if (!queryResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid query parameters",
          details: queryResult.error.issues,
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const { limit, offset, enableCaching, startDate, endDate } =
      queryResult.data

    // Validate date range if provided
    if (startDate && endDate && startDate > endDate) {
      return new Response(
        JSON.stringify({
          error: "Invalid date range: startDate must be before endDate",
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Get dashboard service instance
    const dashboardService = ServiceFactory.getDashboardService()

    // Build options for service call
    const options: any = {
      userId: authResult.user.id,
      userRole: "ADMIN" as UserRole,
      limit,
      offset,
    }

    // Add date range if provided
    if (startDate && endDate) {
      options.dateRange = { start: startDate, end: endDate }
    }

    // Fetch dashboard data using service layer
    const result = await dashboardService.getDashboardData(options, {
      enableCaching,
      cacheKey: `dashboard_admin_${
        authResult.user.id
      }_${limit}_${offset}_${startDate?.toISOString()}_${endDate?.toISOString()}`,
      cacheTTL: 60, // 1 minute (admin data is most sensitive to changes)
    })

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Failed to fetch dashboard data",
          details: result.error?.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Return successful response with appropriate caching headers
    const cacheHeaders = enableCaching
      ? { "Cache-Control": "private, max-age=60" } // 1 minute for admin data
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
          cached: enableCaching,
          timestamp: new Date().toISOString(),
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...cacheHeaders,
          "X-RateLimit-Limit": "300",
          "X-RateLimit-Remaining": "299", // TODO: Implement actual rate limiting
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "X-XSS-Protection": "1; mode=block",
        },
      }
    )
  } catch (error) {
    console.error("Dashboard admin API error:", error)

    // Handle Response objects thrown by middleware
    if (error instanceof Response) {
      return error
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
