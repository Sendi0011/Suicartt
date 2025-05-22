"use client"

import { createContext, useContext, type ReactNode } from "react"
import { WalletKitProvider, useWalletKit } from "@mysten/wallet-kit"

interface SuiWalletContextType {
  connected: boolean
  address: string | null
  disconnect: () => void
  signAndExecuteTransaction: (transaction: any) => Promise<any>
}

const SuiWalletContext = createContext<SuiWalletContextType | undefined>(undefined)

export function useSuiWallet() {
  const context = useContext(SuiWalletContext)
  if (!context) {
    throw new Error("useSuiWallet must be used within a SuiWalletProvider")
  }
  return context
}

export function SuiWalletProvider({ children }: { children: ReactNode }) {
  return (
    <WalletKitProvider autoConnect={false}>
      <SuiWalletContextBridge>{children}</SuiWalletContextBridge>
    </WalletKitProvider>
  )
}

function SuiWalletContextBridge({ children }: { children: ReactNode }) {
  const {
    connected,
    currentAccount,
    signAndExecuteTransactionBlock,
    disconnect,
  } = useWalletKit()

  const address = currentAccount?.address || null

  return (
    <SuiWalletContext.Provider
      value={{
        connected,
        address,
        disconnect,
        signAndExecuteTransaction: signAndExecuteTransactionBlock,
      }}
    >
      {children}
    </SuiWalletContext.Provider>
  )
}
