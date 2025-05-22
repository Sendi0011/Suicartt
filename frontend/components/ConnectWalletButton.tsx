"use client"

import { useSuiWallet } from "./sui-wallet-provider"
import { Button } from "@/components/ui/button"

export function WalletConnectButton() {
  const { connected, address, disconnect } = useSuiWallet()

  if (connected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">{address.substring(0, 6)}...{address.slice(-4)}</span>
        <Button variant="outline" size="sm" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    )
  }

  // You can replace this with @mysten/wallet-kit <ConnectButton /> if preferred
  return (
    <Button onClick={() => window.dispatchEvent(new Event('connect-wallet'))}>
      Connect Wallet
    </Button>
  )
}
