import { NextRequest } from "next/server"
import { z } from "zod"

import { authenticateRequest, hasRole } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"
import { UserRole } from "@/lib/permissions"

/**
 * Query parameters schema for dashboard operator endpoint
 */
const dashboardOperatorQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).optional().default(15),
  offset: z.coerce.number().min(0).optional().default(0),
  enableCaching: z.coerce.boolean().optional().default(true),
})

/**
 * GET /api/dashboard/operator
 * 
 * Returns operator-specific dashboard data including:
 * - Operator assignment statistics
 * - Own service requests + assigned requests
 * - Active assignments
 * 
 * Requires OPERATOR role or higher
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

    // Check if user has OPERATOR role or higher
    if (!hasRole(authResult.user, "OPERATOR")) {
      return new Response(
        JSON.stringify({ error: "Operator access required" }),
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
    const queryResult = dashboardOperatorQuerySchema.safeParse({
      limit: searchParams.get("limit"),
      offset: searchParams.get("offset"),
      enableCaching: searchParams.get("enableCaching"),
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

    const { limit, offset, enableCaching } = queryResult.data

    // Get dashboard service instance
    const dashboardService = ServiceFactory.getDashboardService()

    // Fetch dashboard data using service layer
    const result = await dashboardService.getDashboardData(
      {
        userId: authResult.user.id,
        userRole: "OPERATOR" as UserRole,
        limit,
        offset,
      },
      {
        enableCaching,
        cacheKey: `dashboard_operator_${authResult.user.id}_${limit}_${offset}`,
        cacheTTL: 180, // 3 minutes (more dynamic data)
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
      ? { "Cache-Control": "private, max-age=180" } // 3 minutes for operator data
      : { "Cache-Control": "no-cache, no-store, must-revalidate" }

    return new Response(
      JSON.stringify({
        data: result.data,
        meta: {
          limit,
          offset,
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
          "X-RateLimit-Limit": "150",
          "X-RateLimit-Remaining": "149", // TODO: Implement actual rate limiting
        }
      }
    )

  } catch (error) {
    console.error("Dashboard operator API error:", error)
    
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
