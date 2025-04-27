import api from "@/lib/axios"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get userId from searchParams
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // Or from headers
    // const userId = request.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const response = await api.get(`/profile/${userId}`)

    // Return the data from the API response
    return NextResponse.json(response.data)
  } catch (error:any) {
    console.error("Error fetching profile info", error)

    // Check if it's an API error with status
    if (error.response?.status) {
      return NextResponse.json(
        { error: error.response.data?.message || "Error from external API" },
        { status: error.response.status },
      )
    }

    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
