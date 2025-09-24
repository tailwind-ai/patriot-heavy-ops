import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { verifyToken, generateAccessToken, generateRefreshToken, isTokenExpired } from "@/lib/auth-utils"
import { authRateLimit } from "@/lib/middleware/rate-limit"

/**
 * Token refresh request schema
 */
const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required")
})

/**
 * Token refresh response interface
 */
interface TokenRefreshResponse {
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
 * POST /api/auth/mobile/refresh
 * Refresh JWT tokens using a valid refresh token
 */
export async function POST(req: NextRequest): Promise<NextResponse<TokenRefreshResponse>> {
  // Apply rate limiting
  const rateLimitResponse = await authRateLimit(req)
  if (rateLimitResponse) {
    return rateLimitResponse as NextResponse<TokenRefreshResponse>
  }

  try {
    const body = await req.json()
    const { refreshToken } = refreshTokenSchema.parse(body)

    // Verify the refresh token
    const payload = verifyToken(refreshToken)
    
    if (!payload) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid or expired refresh token" 
        },
        { status: 401 }
      )
    }

    // Check if token is expired (refresh tokens have longer expiry)
    if (isTokenExpired(payload)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Refresh token has expired" 
        },
        { status: 401 }
      )
    }

    // Verify user still exists and get current data
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: "User not found" 
        },
        { status: 401 }
      )
    }

    // Generate new tokens with current user data
    const tokenPayload = {
      userId: user.id,
      email: user.email || '',
      role: user.role || undefined
    }

    const newAccessToken = generateAccessToken(tokenPayload)
    const newRefreshToken = generateRefreshToken(tokenPayload)

    // Return new tokens
    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email || '',
        name: user.name || undefined,
        role: user.role || undefined
      }
    })

  } catch (error) {
    console.error('Token refresh error:', error)

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
        error: "Token refresh failed" 
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/mobile/refresh
 * Return method not allowed for GET requests
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  )
}
