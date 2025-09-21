import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")

    if (!query || query.length < 3) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    // Construct Nominatim API URL with safe parameters
    const nominatimUrl = new URL("https://nominatim.openstreetmap.org/search")
    nominatimUrl.searchParams.set("q", query)
    nominatimUrl.searchParams.set("format", "json")
    nominatimUrl.searchParams.set("addressdetails", "1")
    nominatimUrl.searchParams.set("limit", "5")
    nominatimUrl.searchParams.set("countrycodes", "us")

    const response = await fetch(nominatimUrl.toString(), {
      headers: {
        "User-Agent": "PatriotHeavyOps/1.0 (contact@patriotheavyops.com)",
      },
    })

    if (!response.ok) {
      console.error("Nominatim API error:", response.status, response.statusText)
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const data = await response.json()

    // Filter and sanitize the response data
    const sanitizedData = data.map((item: any) => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
      place_id: item.place_id,
    }))

    return new Response(JSON.stringify(sanitizedData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300", // Cache for 5 minutes
      },
    })
  } catch (error) {
    console.error("Geocoding API error:", error)
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
