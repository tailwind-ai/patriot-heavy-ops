/**
 * Workflow Transitions API Endpoint (Issue #223)
 * GET /api/workflow/transitions - Get valid status transitions for role
 */

import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"

/**
 * GET /api/workflow/transitions
 * Get valid status transitions for the current user's role
 * Query params: ?currentStatus=SUBMITTED
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate user (supports both JWT and session)
    const authResult = await authenticateRequest(req)
    
    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const user = authResult.user

    // Get currentStatus from query params
    const searchParams = req.nextUrl.searchParams
    const currentStatus = searchParams.get("currentStatus")

    if (!currentStatus) {
      return NextResponse.json(
        { error: "currentStatus query parameter is required" },
        { status: 400 }
      )
    }

    // Use service layer to get valid transitions
    const serviceRequestService = ServiceFactory.getServiceRequestService()
    const result = serviceRequestService.getValidNextStatuses(currentStatus)

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to get valid transitions" },
        { status: 500 }
      )
    }

    // Return transitions with role context
    return NextResponse.json({
      currentStatus,
      role: user.role || "USER",
      validTransitions: result.data || [],
    }, { status: 200 })
  } catch (error) {
    console.error("Get transitions error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
