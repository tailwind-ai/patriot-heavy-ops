/**
 * Admin Metrics API Route
 * 
 * GET /api/admin/metrics - System-wide analytics and metrics
 * 
 * Requires ADMIN role authentication
 * Supports both session cookies and JWT Bearer tokens (mobile-ready)
 * Following .cursorrules.md Platform Mode standards (Issue #226)
 */

import { NextRequest } from "next/server"
import { z } from "zod"
import { authenticateRequest, hasRole } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"

/**
 * Query parameters schema for metrics endpoint
 */
const metricsQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

/**
 * GET /api/admin/metrics
 * 
 * Returns system-wide metrics including user counts, service request stats
 * Optional date range filtering for time-based analytics
 * Admin operation with audit logging
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

    // Check if user has ADMIN role (strict check)
    if (!hasRole(authResult.user, "ADMIN")) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }
      )
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url)
    const queryResult = metricsQuerySchema.safeParse({
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
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

    const { startDate, endDate } = queryResult.data

    // Validate date range if both dates provided
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

    // Get admin service instance
    const adminService = await ServiceFactory.getAdminService()

    // Prepare date range for service call
    const dateRange = startDate && endDate
      ? { start: startDate, end: endDate }
      : undefined

    // Fetch system metrics using service layer
    const result = await adminService.getSystemMetrics(dateRange)

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Failed to fetch system metrics",
          details: result.error?.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Log admin action for audit trail
    adminService.logAdminAction(
      authResult.user.id,
      "SYSTEM_METRICS_ACCESSED",
      undefined,
      {
        operation: "get_system_metrics",
        hasDateRange: !!dateRange,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      }
    )

    // Build response metadata
    const meta: Record<string, unknown> = {
      authMethod: authResult.authMethod,
      timestamp: new Date().toISOString(),
    }

    if (dateRange) {
      meta.dateRange = {
        start: startDate?.toISOString(),
        end: endDate?.toISOString(),
      }
    }

    // Return successful response with security headers
    return new Response(
      JSON.stringify({
        data: result.data,
        meta,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Content-Type-Options": "nosniff",
        },
      }
    )
  } catch (error) {
    console.error("Admin metrics API error:", error)

    // Handle Response objects thrown by middleware
    if (error instanceof Response) {
      return error
    }

    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
