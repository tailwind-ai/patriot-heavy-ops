import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ 
        error: "Email parameter is required" 
      }, { status: 400 })
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        emailVerified: true,
        password: true, // Check if password is set
      },
    })

    if (!user) {
      return NextResponse.json({ 
        exists: false,
        message: `User with email ${email} not found in database`
      })
    }

    return NextResponse.json({ 
      exists: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified,
        hasPassword: !!user.password,
      },
      message: "User found in database"
    })
  } catch (error) {
    console.error("Error checking user:", error)
    return NextResponse.json({ 
      error: "Failed to check user",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
