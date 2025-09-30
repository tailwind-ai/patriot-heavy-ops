/**
 * Workflow History API Endpoint (Issue #223)
 * GET /api/service-requests/[id]/history - Get status history
 */

import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"

/**
 * GET /api/service-requests/[id]/history
 * Get status change history for a service request
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

    // Use service layer to get status history
    const serviceRequestService = ServiceFactory.getServiceRequestService()
    const result = await serviceRequestService.getStatusHistory(params.requestId)

    if (!result.success) {
      // Handle specific error types
      if (result.error?.code === "NOT_FOUND") {
        return NextResponse.json(
          { error: "Service request not found" },
          { status: 404 }
        )
      }

      // Generic error
      return NextResponse.json(
        { error: "Failed to retrieve status history" },
        { status: 500 }
      )
    }

    // Return status history
    return NextResponse.json(result.data, { status: 200 })
  } catch (error) {
    console.error("Status history error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
