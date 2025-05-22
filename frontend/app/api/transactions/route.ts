import { NextResponse } from "next/server"
import { transactionDb } from "@/lib/db"

// Get all transactions for a user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }

  try {
    const transactions = await transactionDb.getUserTransactions(address)
    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

// Create a new transaction
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_address, counterparty_address, amount, status, asset_id, transaction_type } = body

    if (!user_address || !counterparty_address || !amount || !status || !asset_id || !transaction_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const transaction = await transactionDb.createTransaction({
      user_address,
      counterparty_address,
      amount,
      status,
      asset_id,
      transaction_type,
    })

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
