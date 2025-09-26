import { NextRequest } from "next/server"
import { z } from "zod"

import { authenticateRequest } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"
import { UserRole } from "@/lib/permissions"

/**
 * Query parameters schema for dashboard user endpoint
 */
const dashboardUserQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).optional().default(10),
  offset: z.coerce.number().min(0).optional().default(0),
  enableCaching: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined) return true
      return val !== "false" && val !== "0"
    }),
})

/**
 * GET /api/dashboard/user
 * 
 * Returns user-specific dashboard data including:
 * - Personal service request statistics
 * - Recent service requests
 * 
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

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url)
    const queryResult = dashboardUserQuerySchema.safeParse({
      limit: searchParams.get("limit") || undefined,
      offset: searchParams.get("offset") || undefined,
      enableCaching: searchParams.get("enableCaching") || undefined,
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
        userRole: "USER" as UserRole,
        limit,
        offset,
      },
      {
        enableCaching,
        cacheKey: `dashboard_user_${authResult.user.id}_${limit}_${offset}`,
        cacheTTL: 300, // 5 minutes
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
      ? { "Cache-Control": "private, max-age=300" } // 5 minutes for authenticated data
      : { "Cache-Control": "no-cache, no-store, must-revalidate" }

    return new Response(
      JSON.stringify({
        data: result.data,
        meta: {
          limit,
          offset,
          authMethod: authResult.authMethod,
          cached: enableCaching
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...cacheHeaders,
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": "99", // TODO: Implement actual rate limiting
        }
      }
    )

  } catch (error) {
    console.error("Dashboard user API error:", error)
    
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
