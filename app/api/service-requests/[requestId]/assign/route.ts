/**
 * Operator Assignment API Endpoint (Issue #223)
 * POST /api/service-requests/[id]/assign - Assign operator to service request
 */

import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"
import type { AssignOperatorInput } from "@/lib/services"
import { z } from "zod"

/**
 * Request body validation schema
 */
const assignOperatorSchema = z.object({
  operatorId: z.string().min(1, "Operator ID is required"),
  rate: z.number().optional(),
  estimatedHours: z.number().optional(),
})

/**
 * POST /api/service-requests/[id]/assign
 * Assign operator to a service request
 */
export async function POST(
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

    // Parse and validate request body
    const body = await req.json()
    const validation = assignOperatorSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: validation.error.issues },
        { status: 422 }
      )
    }

    const { operatorId, rate, estimatedHours } = validation.data

    // Use service layer to assign operator
    const serviceRequestService = ServiceFactory.getServiceRequestService()
    
    const input: AssignOperatorInput = {
      requestId: params.requestId,
      operatorId,
      userId: user.id,
      userRole: (user.role as "USER" | "OPERATOR" | "MANAGER" | "ADMIN") || "USER",
      ...(rate && { rate }),
      ...(estimatedHours && { estimatedHours }),
    }

    const result = await serviceRequestService.assignOperator(input)

    if (!result.success) {
      // Handle specific error types
      if (result.error?.code === "NOT_FOUND") {
        return NextResponse.json(
          { error: result.error.message || "Resource not found" },
          { status: 404 }
        )
      }

      if (result.error?.code === "INSUFFICIENT_PERMISSIONS") {
        return NextResponse.json(
          { error: result.error.message },
          { status: 403 }
        )
      }

      if (result.error?.code === "INVALID_ROLE") {
        return NextResponse.json(
          { error: result.error.message },
          { status: 400 }
        )
      }

      // Generic error
      return NextResponse.json(
        { error: "Failed to assign operator" },
        { status: 500 }
      )
    }

    // Return created assignment (201 Created)
    return NextResponse.json(result.data, { status: 201 })
  } catch (error) {
    console.error("Assign operator error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
