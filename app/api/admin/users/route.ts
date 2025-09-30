/**
 * Admin Users API Route
 * 
 * GET /api/admin/users - List users filtered by role
 * 
 * Requires ADMIN role authentication
 * Supports both session cookies and JWT Bearer tokens (mobile-ready)
 * Following .cursorrules.md Platform Mode standards (Issue #226)
 */

import { NextRequest } from "next/server"
import { z } from "zod"
import { authenticateRequest, hasRole } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"
import type { UserRole } from "@prisma/client"

/**
 * Query parameters schema for admin users endpoint
 */
const adminUsersQuerySchema = z.object({
  role: z.enum(["USER", "OPERATOR", "MANAGER", "ADMIN"]),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  page: z.coerce.number().min(1).optional().default(1),
})

/**
 * GET /api/admin/users
 * 
 * Returns list of users filtered by role with pagination
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

    // Check if user has ADMIN role (strict check - no role hierarchy)
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
    const queryResult = adminUsersQuerySchema.safeParse({
      role: searchParams.get("role") || undefined,
      limit: searchParams.get("limit") || undefined,
      page: searchParams.get("page") || undefined,
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

    const { role, limit, page } = queryResult.data

    // Get admin service instance
    const adminService = await ServiceFactory.getAdminService()

    // Fetch users by role using service layer
    const result = await adminService.getUsersByRole(
      role as UserRole,
      { limit, page }
    )

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Failed to fetch users",
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
      "USERS_LISTED",
      undefined,
      {
        operation: "list_users_by_role",
        role,
        limit,
        page,
      }
    )

    // Return successful response with security headers
    return new Response(
      JSON.stringify({
        data: result.data || [],
        meta: {
          role,
          limit,
          page,
          authMethod: authResult.authMethod,
          timestamp: new Date().toISOString(),
        },
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
    console.error("Admin users API error:", error)

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
