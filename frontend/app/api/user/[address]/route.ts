import { NextResponse } from "next/server"
import { userDb } from "@/lib/db"

// Get a user profile
export async function GET(request: Request, { params }: { params: { address: string } }) {
  const address = params.address

  try {
    const profile = await userDb.getUserProfile(address)

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
  }
}

// Update a user profile
export async function PATCH(request: Request, { params }: { params: { address: string } }) {
  const address = params.address

  try {
    const body = await request.json()
    const profile = await userDb.updateUserProfile(address, body)

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 })
  }
}
