/**
 * Admin Operator Approval API Route
 * 
 * POST /api/admin/operators/[operatorId]/approve - Approve operator application
 * 
 * Requires ADMIN role authentication
 * Supports both session cookies and JWT Bearer tokens (mobile-ready)
 * Following .cursorrules.md Platform Mode standards (Issue #226)
 */

import { NextRequest } from "next/server"
import { authenticateRequest, hasRole } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"

/**
 * POST /api/admin/operators/[operatorId]/approve
 * 
 * Approve an operator application - changes user role to OPERATOR
 * Validates that application data is complete before approval
 * Admin operation with audit logging
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ operatorId: string }> }
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

    // Extract operatorId from route params
    const { operatorId } = await context.params

    // Get admin service instance
    const adminService = await ServiceFactory.getAdminService()

    // Approve operator application using service layer
    const result = await adminService.approveOperatorApplication(operatorId)

    if (!result.success) {
      // Handle specific error codes with appropriate HTTP status
      const errorCode = result.error?.code || "UNKNOWN_ERROR"
      
      if (errorCode === "USER_NOT_FOUND") {
        return new Response(
          JSON.stringify({
            error: "User not found",
            details: result.error?.message,
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      if (errorCode === "INVALID_APPLICATION") {
        return new Response(
          JSON.stringify({
            error: "Invalid application",
            details: result.error?.message,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      // Generic error response for other failures
      return new Response(
        JSON.stringify({
          error: "Failed to approve operator application",
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
      "OPERATOR_APPLICATION_APPROVED",
      operatorId,
      {
        operation: "approve_operator_application",
        operatorEmail: result.data?.email,
      }
    )

    // Return successful response with security headers
    return new Response(
      JSON.stringify({
        data: result.data,
        meta: {
          operatorId,
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
    console.error("Admin operator approval API error:", error)

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
