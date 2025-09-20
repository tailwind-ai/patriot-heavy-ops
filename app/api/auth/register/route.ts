import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth-utils"
import { userRegisterSchema } from "@/lib/validations/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Registration request body:", body)
    const { name, email, password } = userRegisterSchema.parse(body)

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    
    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: "User created successfully",
      user: userWithoutPassword,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
