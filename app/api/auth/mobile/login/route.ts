import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { generateAccessToken, generateRefreshToken } from "@/lib/auth-utils"
import { authRateLimit } from "@/lib/middleware/rate-limit"
import { ServiceFactory } from "@/lib/services"

/**
 * Mobile login request schema
 */
const mobileLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
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
    name?: string | undefined
    role?: string
  }
  error?: string
}

/**
 * POST /api/auth/mobile/login
 * Authenticate user and return JWT tokens for mobile app consumption
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse<MobileLoginResponse>> {
  // Apply rate limiting
  const rateLimitResponse = await authRateLimit(req)
  if (rateLimitResponse) {
    return rateLimitResponse as NextResponse<MobileLoginResponse>
  }

  try {
    const body = await req.json()
    const { email, password } = mobileLoginSchema.parse(body)

    // Use service layer for authentication
    const authService = ServiceFactory.getAuthService()
    const result = await authService.authenticate({ email, password })

    if (!result.success) {
      // Check if it's a database error vs authentication failure
      const errorMessage = String(result.error?.details?.originalError || result.error?.message || "")
      if (errorMessage.toLowerCase().includes("database") || errorMessage.toLowerCase().includes("connection")) {
        return NextResponse.json(
          {
            success: false,
            error: "Authentication failed",
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      )
    }

    const user = result.data
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication failed",
        },
        { status: 401 }
      )
    }

    // Generate JWT tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role || undefined,
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
        role: user.role || undefined,
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Mobile login error:", error)

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.errors[0]?.message || "Invalid request data",
        },
        { status: 400 }
      )
    }

    // Handle database errors
    return NextResponse.json(
      {
        success: false,
        error: "Authentication failed",
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
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
