import { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { userNameSchema } from "@/lib/validations/user"
import { authenticateRequest } from "@/lib/middleware/mobile-auth"

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    // Validate the route context.
    const params = await context.params

    // Try mobile auth first, fallback to session auth
    const authResult = await authenticateRequest(req)
    
    let userId: string | undefined
    if (authResult.isAuthenticated && authResult.user) {
      userId = authResult.user.id
    } else {
      // Fallback to session-based auth for backward compatibility
      const session = await getServerSession(authOptions)
      userId = session?.user?.id
    }

    // Ensure user is authenticated and has access to this user.
    if (!userId || params.userId !== userId) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const body = await req.json()
    const payload = userNameSchema.parse(body)

    // Update the user.
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        name: payload.name,
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
