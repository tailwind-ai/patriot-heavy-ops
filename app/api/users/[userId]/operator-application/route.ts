import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { operatorApplicationSchema } from "@/lib/validations/user"

const routeContextSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
})

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route context.
    const { params } = routeContextSchema.parse(context)

    // Ensure user is authenticated and has access to this user.
    const session = await getServerSession(authOptions)
    if (!session?.user || params.userId !== session?.user.id) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const body = await req.json()
    const payload = operatorApplicationSchema.parse(body)

    // First, get the current user to preserve existing data
    const existingUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { preferredLocations: true }
    })

    // Update user record with operator application data
    // Preserve existing preferred locations and add the new service area
    // 
    // TODO: Consider adding a dedicated field like 'pendingOperatorApplication' or separate table
    // to distinguish between user location preferences and operator service area applications.
    // For now, we use preferredLocations as it serves the immediate need and can be filtered
    // by admin approval workflow based on user role.
    const updatedUser = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        // Preserve existing preferred locations and add new service area if not already present
        preferredLocations: existingUser?.preferredLocations?.includes(payload.location) 
          ? existingUser.preferredLocations 
          : [...(existingUser?.preferredLocations || []), payload.location],
        // Note: Role change to OPERATOR should be handled by admin approval workflow
        // For now, we keep the user as USER until admin approves the application
      },
    })

    console.log(`Operator application submitted and saved for user ${session.user.id}:`, {
      location: payload.location,
      userId: session.user.id,
    })

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

    console.error("Error processing operator application:", error)
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
