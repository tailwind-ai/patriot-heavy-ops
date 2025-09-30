/**
 * Service Request Workflow Transitions API Endpoint (Issue #224)
 * GET /api/service-requests/[id]/transitions - Get available transitions for request
 */

import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"

/**
 * GET /api/service-requests/[id]/transitions?status=SUBMITTED&role=USER
 * Get available status transitions for a service request based on current status and role
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ requestId: string }> }
) {
  try {
    const params = await context.params

    // Authenticate user (supports both JWT and session)
    const authResult = await authenticateRequest(req)

    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const user = authResult.user

    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const currentStatus = searchParams.get("status")
    const role = searchParams.get("role") || user.role || "USER"

    if (!currentStatus) {
      return NextResponse.json(
        { error: "status query parameter is required" },
        { status: 400 }
      )
    }

    // Verify user has access to this service request
    const serviceRequestService = ServiceFactory.getServiceRequestService()
    const accessResult = await serviceRequestService.getServiceRequestById({
      requestId: params.requestId,
      userId: user.id,
      userRole: user.role || "USER",
    })

    if (!accessResult.success) {
      if (accessResult.error?.code === "NOT_FOUND") {
        return NextResponse.json(
          { error: "Service request not found" },
          { status: 404 }
        )
      }
      if (accessResult.error?.code === "ACCESS_DENIED") {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
      return NextResponse.json(
        { error: "Failed to verify access" },
        { status: 500 }
      )
    }

    // Get valid transitions for this status
    const transitionsResult =
      serviceRequestService.getValidNextStatuses(currentStatus)

    if (!transitionsResult.success) {
      return NextResponse.json(
        { error: "Failed to get valid transitions" },
        { status: 500 }
      )
    }

    // Get transitions with permission checks for user role
    const validStatuses = transitionsResult.data || []
    const transitionsWithPermissions = []

    for (const toStatus of validStatuses) {
      const permissionResult =
        serviceRequestService.validateTransitionWithPermissions(
          currentStatus,
          toStatus,
          role as "USER" | "OPERATOR" | "MANAGER" | "ADMIN"
        )

      if (permissionResult.success && permissionResult.data) {
        transitionsWithPermissions.push(permissionResult.data)
      }
    }

    return NextResponse.json(
      {
        transitions: transitionsWithPermissions,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Get transitions error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
