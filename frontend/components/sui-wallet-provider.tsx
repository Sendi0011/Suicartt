"use client";

import { createContext, useContext, type ReactNode } from "react";
import { WalletKitProvider, useWalletKit } from "@mysten/wallet-kit";

interface SuiWalletContextType {
  connected: boolean;
  address: string | null;
  disconnect: () => void;
  signAndExecuteTransaction: (transaction: any) => Promise<any>;
}

const SuiWalletContext = createContext<SuiWalletContextType | undefined>(undefined);

export function useSuiWallet() {
  const context = useContext(SuiWalletContext);
  if (!context) {
    throw new Error("useSuiWallet must be used within a SuiWalletProvider");
  }
  return context;
}

export function SuiWalletProvider({ children }: { children: ReactNode }) {
  return <WalletKitProvider>{childrenWithContext(children)}</WalletKitProvider>;
}

function childrenWithContext(children: ReactNode) {
  return <SuiWalletContextBridge>{children}</SuiWalletContextBridge>;
}

function SuiWalletContextBridge({ children }: { children: ReactNode }) {
  const { currentAccount, disconnect, signAndExecuteTransactionBlock } = useWalletKit();

  const connected = !!currentAccount;
  const address = currentAccount?.address || null;

  // Wrap disconnect function
  const disconnectWallet = () => {
    disconnect();
  };

  // Wrap signAndExecuteTransactionBlock to return a Promise
  const signAndExecuteTransaction = (transaction: any) => {
    return new Promise((resolve, reject) => {
      signAndExecuteTransactionBlock(
        { transactionBlock: transaction },
        {
          onSuccess: resolve,
          onError: reject,
        }
      );
    });
  };

  return (
    <SuiWalletContext.Provider
      value={{
        connected,
        address,
        disconnect: disconnectWallet,
        signAndExecuteTransaction,
      }}
    >
      {children}
    </SuiWalletContext.Provider>
  );
}