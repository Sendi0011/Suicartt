import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`Missing Supabase environment variables. 
  Make sure NEXT_PUBLIC_SUPABASE_URL and one of NEXT_PUBLIC_SUPABASE_ANON_KEY, 
  SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY are set.`)
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// --- Transaction Types ---
export interface Transaction {
  id: string
  user_address: string
  counterparty_address: string
  amount: number
  status: "Pending" | "Completed" | "Refunded"
  asset_id: string
  transaction_type: "buyer" | "seller"
  created_at: string
  completed_at: string | null
}

// --- Transaction DB Functions ---
export const transactionDb = {
  // Get all transactions for a user (either as user or counterparty)
  async getUserTransactions(userAddress: string): Promise<Transaction[]> {
    if (!userAddress) {
      console.error("Invalid userAddress passed to getUserTransactions:", userAddress)
      return []
    }

    try {
      console.log("Fetching transactions for user:", userAddress)
      const safeAddress = userAddress.replace(/,/g, "")

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .or(`user_address.eq.${safeAddress},counterparty_address.eq.${safeAddress}`)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching transactions:", JSON.stringify(error, null, 2))
        return []
      }

      return data || []
    } catch (err) {
      console.error("Unexpected error fetching transactions:", err)
      return []
    }
  },

  // Get a single transaction by ID
  async getTransaction(id: string): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase.from("transactions").select("*").eq("id", id).single()
      if (error) {
        console.error("Error fetching transaction:", JSON.stringify(error, null, 2))
        return null
      }
      return data
    } catch (err) {
      console.error("Unexpected error fetching transaction:", err)
      return null
    }
  },

  // Create a new transaction
  async createTransaction(
    transaction: Omit<Transaction, "id" | "created_at" | "completed_at">,
  ): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert([{ ...transaction, created_at: new Date().toISOString() }])
        .select()
        .single()

      if (error) {
        console.error("Error creating transaction:", JSON.stringify(error, null, 2))
        return null
      }
      return data
    } catch (err) {
      console.error("Unexpected error creating transaction:", err)
      return null
    }
  },

  // Update an existing transaction
  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("Error updating transaction:", JSON.stringify(error, null, 2))
        return null
      }
      return data
    } catch (err) {
      console.error("Unexpected error updating transaction:", err)
      return null
    }
  },

  // Mark transaction as completed or refunded
  async completeTransaction(id: string, status: "Completed" | "Refunded"): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .update({ status, completed_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("Error completing transaction:", JSON.stringify(error, null, 2))
        return null
      }
      return data
    } catch (err) {
      console.error("Unexpected error completing transaction:", err)
      return null
    }
  },
}

// --- User Profile Types ---
export interface UserProfile {
  address: string
  username: string | null
  avatar_url: string | null
  created_at: string
  transaction_count: number
}

// --- User Profile DB Functions ---
export const userDb = {
  // Get a user profile by address, or create if missing
  async getUserProfile(address: string): Promise<UserProfile | null> {
    if (!address) {
      console.error("Invalid address passed to getUserProfile:", address)
      return null
    }

    try {
      const { data, error } = await supabase.from("user_profiles").select("*").eq("address", address).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user profile:", JSON.stringify(error, null, 2))
        return null
      }

      if (!data) {
        // Create new profile if none found
        return await this.createUserProfile(address)
      }

      return data
    } catch (err) {
      console.error("Unexpected error fetching user profile:", err)
      return null
    }
  },

  // Create a new user profile
  async createUserProfile(address: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .insert([{ address, created_at: new Date().toISOString(), transaction_count: 0 }])
        .select()
        .single()

      if (error) {
        console.error("Error creating user profile:", JSON.stringify(error, null, 2))
        return null
      }

      return data
    } catch (err) {
      console.error("Unexpected error creating user profile:", err)
      return null
    }
  },

  // Update user profile
  async updateUserProfile(address: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update(updates)
        .eq("address", address)
        .select()
        .single()

      if (error) {
        console.error("Error updating user profile:", JSON.stringify(error, null, 2))
        return null
      }

      return data
    } catch (err) {
      console.error("Unexpected error updating user profile:", err)
      return null
    }
  },

  // Increment transaction count using a stored procedure
  async incrementTransactionCount(address: string): Promise<void> {
    try {
      const { error } = await supabase.rpc("increment_transaction_count", { user_address: address })

      if (error) {
        console.error("Error incrementing transaction count:", JSON.stringify(error, null, 2))
      }
    } catch (err) {
      console.error("Unexpected error incrementing transaction count:", err)
    }
  },
}
