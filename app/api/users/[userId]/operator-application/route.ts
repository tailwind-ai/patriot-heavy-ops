import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { operatorApplicationSchema } from "@/lib/validations/user"

export async function POST(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    // Validate the route context.
    const params = await context.params

    // Ensure user is authenticated and has access to this user.
    const session = await getServerSession(authOptions)
    if (!session?.user || params.userId !== session?.user.id) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const body = await req.json()
    const payload = operatorApplicationSchema.parse(body)

    // Update user record with operator application data
    // Since we consolidated User and Operator tables, we store the location in preferredLocations
    const updatedUser = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        preferredLocations: [payload.location], // Store the service area
        // Note: Role change to OPERATOR should be handled by admin approval workflow
        // For now, we keep the user as USER until admin approves the application
      },
    })

    // Operator application submitted and saved

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Operator application submitted successfully",
      data: {
        userId: updatedUser.id,
        preferredLocations: updatedUser.preferredLocations,
        role: updatedUser.role,
      }
    }), { 
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    // Error processing operator application
    return new Response(JSON.stringify({ 
      error: "Failed to process operator application",
      message: "An error occurred while saving your application. Please try again."
    }), { 
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
