import { NextResponse } from "next/server"
import { transactionDb } from "@/lib/db"

// Get a single transaction
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  try {
    const transaction = await transactionDb.getTransaction(id)

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error("Error fetching transaction:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 })
  }
}

// Update a transaction
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  try {
    const body = await request.json()

    // Whitelist allowed fields to update
    const allowedKeys = [
      "user_address",
      "counterparty_address",
      "amount",
      "status",
      "asset_id",
      "transaction_type",
      "completed_at",
    ]

    const updates = Object.fromEntries(
      Object.entries(body).filter(([key]) => allowedKeys.includes(key))
    )

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const transaction = await transactionDb.updateTransaction(id, updates)

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error("Error updating transaction:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 })
  }
}

// Complete a transaction (set status to Completed or Refunded)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  try {
    const { status } = await request.json()

    if (status !== "Completed" && status !== "Refunded") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const transaction = await transactionDb.completeTransaction(id, status)

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error("Error completing transaction:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Failed to complete transaction" }, { status: 500 })
  }
}
