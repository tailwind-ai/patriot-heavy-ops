/**
 * Outstatic API Route
 *
 * This handles all Outstatic admin requests at /api/outstatic
 * Provides authentication and content management endpoints
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { OutstaticApi } from "outstatic"
import { NextRequest } from "next/server"

type GetParams = {
  params: Promise<{
    ost?: string[]
  }>
}

export async function GET(req: NextRequest, context: GetParams) {
  const params = await context.params
  // Type casting required due to Outstatic library API mismatch with Next.js 15
  return OutstaticApi.GET(req as any, { params } as any)
}

export async function POST(req: NextRequest, context: GetParams) {
  const params = await context.params
  // Type casting required due to Outstatic library API mismatch with Next.js 15
  return OutstaticApi.POST(req as any, { params } as any)
}
