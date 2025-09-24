import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { verifyPassword, generateAccessToken, generateRefreshToken } from "@/lib/auth-utils"
import { authRateLimit } from "@/lib/middleware/rate-limit"

/**
 * Mobile login request schema
 */
const mobileLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
})

/**
 * Mobile login response interface
 */
interface MobileLoginResponse {
  success: boolean
  accessToken?: string
  refreshToken?: string
  user?: {
    id: string
    email: string
    name?: string
    role?: string
  }
  error?: string
}

/**
 * POST /api/auth/mobile/login
 * Authenticate user and return JWT tokens for mobile app consumption
 */
export async function POST(req: NextRequest): Promise<NextResponse<MobileLoginResponse>> {
  // Apply rate limiting
  const rateLimitResponse = await authRateLimit(req)
  if (rateLimitResponse) {
    return rateLimitResponse as NextResponse<MobileLoginResponse>
  }

  try {
    const body = await req.json()
    const { email, password } = mobileLoginSchema.parse(body)

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true
      }
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid email or password" 
        },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid email or password" 
        },
        { status: 401 }
      )
    }

    // Generate JWT tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role || undefined
    }

    const accessToken = generateAccessToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    // Return successful response with tokens
    return NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
        role: user.role || undefined
      }
    })

  } catch (error) {
    console.error('Mobile login error:', error)

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.errors[0]?.message || "Invalid request data" 
        },
        { status: 400 }
      )
    }

    // Handle database errors
    return NextResponse.json(
      { 
        success: false, 
        error: "Authentication failed" 
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/mobile/login
 * Return method not allowed for GET requests
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  )
}
