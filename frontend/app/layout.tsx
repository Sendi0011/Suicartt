import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SuiWalletProvider } from "@/components/sui-wallet-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Suicart - Secure Blockchain Escrow Platform",
  description: "Secure escrow services on the Sui blockchain for digital assets and SUI tokens",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SuiWalletProvider>
            <div suppressHydrationWarning>{children}</div>
          </SuiWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
