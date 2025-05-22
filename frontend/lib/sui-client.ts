// This is a simplified implementation of a Sui client
// In a real application, you would use the actual Sui SDK

import { SuiClient } from "@mysten/sui.js/client"
import { TransactionBlock } from "@mysten/sui.js/transactions"

// Get the network from environment variables with a default value
const network = process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet"
// Get the package ID from environment variables
const packageId = process.env.NEXT_PUBLIC_ESCROW_PACKAGE_ID

// Network configuration
const networks = {
  devnet: "https://fullnode.devnet.sui.io:443",
  testnet: "https://fullnode.testnet.sui.io:443",
  mainnet: "https://fullnode.mainnet.sui.io:443",
}

// Create Sui client
export const suiClient = new SuiClient({ url: networks[network as keyof typeof networks] })

// Check if we're in development/demo mode (no real contract deployed)
const isDemoMode = !packageId || packageId === "0x0"

// Log warning if package ID is not set or is the placeholder
if (isDemoMode) {
  console.warn(
    "NEXT_PUBLIC_ESCROW_PACKAGE_ID is not set or is the placeholder value. Running in demo mode with simulated transactions. Set this environment variable to interact with a real contract.",
  )
}

// Escrow contract functions
export const escrowFunctions = {
  // Create a new digital escrow
  createDigitalEscrow: (seller: string, amount: number, description: string) => {
    const txb = new TransactionBlock()

    if (isDemoMode) {
      // In demo mode, just return a mock transaction
      console.log("Demo mode: Creating mock digital escrow transaction")
      return txb
    }

    // Split the coin for the escrow amount
    const [coin] = txb.splitCoins(txb.gas, [txb.pure(amount * 1_000_000_000)]) // Convert to MIST (SUI smallest unit)

    // Call the create_digital_escrow function from the contract
    txb.moveCall({
      target: `${packageId}::escrow::create_digital_escrow`,
      arguments: [coin, txb.pure(seller), txb.pure(description)],
    })

    return txb
  },

  // Create a new physical escrow
  createPhysicalEscrow: (seller: string, amount: number, description: string) => {
    const txb = new TransactionBlock()

    if (isDemoMode) {
      // In demo mode, just return a mock transaction
      console.log("Demo mode: Creating mock physical escrow transaction")
      return txb
    }

    // Split the coin for the escrow amount
    const [coin] = txb.splitCoins(txb.gas, [txb.pure(amount * 1_000_000_000)]) // Convert to MIST (SUI smallest unit)

    // Call the create_physical_escrow function from the contract
    txb.moveCall({
      target: `${packageId}::escrow::create_physical_escrow`,
      arguments: [coin, txb.pure(seller), txb.pure(description)],
    })

    return txb
  },

  // Deposit asset to an escrow
  depositAsset: (escrowId: string, assetId: string) => {
    const txb = new TransactionBlock()

    if (isDemoMode) {
      // In demo mode, just return a mock transaction
      console.log("Demo mode: Creating mock deposit asset transaction")
      return txb
    }

    // Call the deposit_asset function from the contract
    txb.moveCall({
      target: `${packageId}::escrow::deposit_asset`,
      arguments: [txb.object(escrowId), txb.object(assetId)],
    })

    return txb
  },

  // Confirm an escrow transaction
  confirmEscrow: (escrowId: string) => {
    const txb = new TransactionBlock()

    if (isDemoMode) {
      // In demo mode, just return a mock transaction
      console.log("Demo mode: Creating mock confirm escrow transaction")
      return txb
    }

    // Call the confirm function from the contract
    txb.moveCall({
      target: `${packageId}::escrow::confirm`,
      arguments: [txb.object(escrowId)],
    })

    return txb
  },

  // Refund an escrow transaction
  refundEscrow: (escrowId: string) => {
    const txb = new TransactionBlock()

    if (isDemoMode) {
      // In demo mode, just return a mock transaction
      console.log("Demo mode: Creating mock refund escrow transaction")
      return txb
    }

    // Call the refund function from the contract
    txb.moveCall({
      target: `${packageId}::escrow::refund`,
      arguments: [txb.object(escrowId)],
    })

    return txb
  },

  // Mint a new asset (for testing)
  mintAsset: (value: number) => {
    const txb = new TransactionBlock()

    if (isDemoMode) {
      // In demo mode, just return a mock transaction
      console.log("Demo mode: Creating mock mint asset transaction")
      return txb
    }

    // Call the mint_asset function from the contract
    const asset = txb.moveCall({
      target: `${packageId}::escrow::mint_asset`,
      arguments: [txb.pure(value)],
    })

    // Return the created asset
    txb.transferObjects([asset], txb.pure(txb.setSender))

    return txb
  },
}

// Get escrow objects owned by an address
export async function getEscrowsByOwner(address: string) {
  if (isDemoMode) {
    // In demo mode, return mock data
    console.log("Demo mode: Returning mock escrows")
    return [
      {
        objectId: "0x123",
        version: "1",
        digest: "digest1",
        type: `${packageId}::escrow::Escrow`,
        content: {
          id: { id: "0x123" },
          buyer: address,
          seller: "0xabc",
          amount: { value: 10 },
          asset_type: 0, // Digital
          description: "Digital artwork NFT",
          status: "Pending",
        },
      },
      {
        objectId: "0x456",
        version: "1",
        digest: "digest2",
        type: `${packageId}::escrow::Escrow`,
        content: {
          id: { id: "0x456" },
          buyer: "0xdef",
          seller: address,
          amount: { value: 5 },
          asset_type: 1, // Physical
          description: "Vintage watch",
          status: "Pending",
        },
      },
    ]
  }

  try {
    const objects = await suiClient.getOwnedObjects({
      owner: address,
      filter: {
        StructType: `${packageId}::escrow::Escrow`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    })

    return objects.data
  } catch (error) {
    console.error("Error fetching escrows:", error)
    return []
  }
}

// Get asset objects owned by an address
export async function getAssetsByOwner(address: string) {
  if (isDemoMode) {
    // In demo mode, return mock data
    console.log("Demo mode: Returning mock assets")
    return [
      {
        objectId: "0x789",
        version: "1",
        digest: "digest3",
        type: `${packageId}::escrow::Asset`,
        content: {
          id: { id: "0x789" },
          value: 100,
        },
      },
    ]
  }

  try {
    const objects = await suiClient.getOwnedObjects({
      owner: address,
      filter: {
        StructType: `${packageId}::escrow::Asset`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    })

    return objects.data
  } catch (error) {
    console.error("Error fetching assets:", error)
    return []
  }
}

// Get transaction history for an address
export async function getTransactionHistory(address: string) {
  if (isDemoMode) {
    // In demo mode, return mock data
    console.log("Demo mode: Returning mock transaction history")
    return [
      {
        digest: "0xabcdef1",
        transaction: {
          data: {
            sender: address,
          },
        },
        effects: {
          status: { status: "success" },
        },
        events: [
          {
            type: `${packageId}::escrow::EscrowCreatedEvent`,
            parsedJson: {
              escrow_id: "0x123",
              buyer: address,
              seller: "0xabc",
              amount: 10,
              asset_type: 0, // Digital
              description: "Digital artwork NFT",
            },
          },
        ],
        timestamp_ms: Date.now() - 86400000, // 1 day ago
      },
      {
        digest: "0xabcdef2",
        transaction: {
          data: {
            sender: address,
          },
        },
        effects: {
          status: { status: "success" },
        },
        events: [
          {
            type: `${packageId}::escrow::EscrowCreatedEvent`,
            parsedJson: {
              escrow_id: "0x456",
              buyer: address,
              seller: "0xdef",
              amount: 5,
              asset_type: 1, // Physical
              description: "Vintage watch",
            },
          },
        ],
        timestamp_ms: Date.now() - 172800000, // 2 days ago
      },
    ]
  }

  try {
    const transactions = await suiClient.queryTransactionBlocks({
      filter: {
        FromAddress: address,
      },
      options: {
        showInput: true,
        showEffects: true,
        showEvents: true,
      },
    })

    return transactions.data
  } catch (error) {
    console.error("Error fetching transaction history:", error)
    return []
  }
}
