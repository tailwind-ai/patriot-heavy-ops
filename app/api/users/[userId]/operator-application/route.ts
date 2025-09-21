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

    // For now, we'll just log the application since we don't have the full operator model yet
    // In Phase 2, this will create an operator application record
    console.log(`Operator application submitted for user ${session.user.id}:`, payload)

    // TODO: In Phase 2, create operator application record in database
    // await db.operatorApplication.create({
    //   data: {
    //     userId: session.user.id,
    //     location: payload.location,
    //     status: "pending",
    //   },
    // })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
