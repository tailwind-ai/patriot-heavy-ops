/**
 * Admin User Role Update API Route
 * 
 * POST /api/admin/users/[userId]/role - Change user's role
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
 * Request body schema for role update
 */
const roleUpdateBodySchema = z.object({
  role: z.enum(["USER", "OPERATOR", "MANAGER", "ADMIN"]),
})

/**
 * POST /api/admin/users/[userId]/role
 * 
 * Change a user's role
 * Admin operation with audit logging
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
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

    // Extract userId from route params
    const { userId } = await context.params

    // Parse and validate request body
    const body = await req.json()
    const bodyResult = roleUpdateBodySchema.safeParse(body)

    if (!bodyResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: bodyResult.error.issues,
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const { role } = bodyResult.data

    // Get admin service instance
    const adminService = await ServiceFactory.getAdminService()

    // Change user role using service layer
    const result = await adminService.changeUserRole(
      userId,
      role as UserRole
    )

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Failed to change user role",
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
      "USER_ROLE_CHANGED",
      userId,
      {
        operation: "change_user_role",
        newRole: role,
        previousRole: result.data?.role,
      }
    )

    // Return successful response with security headers
    return new Response(
      JSON.stringify({
        data: result.data,
        meta: {
          userId,
          newRole: role,
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
    console.error("Admin role update API error:", error)

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
