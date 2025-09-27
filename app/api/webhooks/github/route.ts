import { NextResponse } from "next/server"

// Ana no longer uses webhooks - this route is deprecated

export async function POST() {
  // Ana no longer uses webhooks - all analysis is done via GitHub Actions
  // This endpoint is deprecated and will be removed in the future
  return NextResponse.json({
    message:
      "Ana no longer uses webhooks. Analysis is handled via GitHub Actions.",
    deprecated: true,
  })
}

// All webhook processing functions removed - Ana handles analysis via GitHub Actions
