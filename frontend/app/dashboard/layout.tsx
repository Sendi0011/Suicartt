import type React from "react"
import Link from "next/link"
import { LayoutDashboard, History, Settings, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardWalletConnect } from "./DashboardWalletConnect"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8">
              <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold">S</span>
              </div>
            </div>
            <span className="text-xl font-bold">Suicart</span>
          </Link>
          <div className="flex items-center gap-4">
            <DashboardWalletConnect />
          </div>
        </div>
      </header>
      <div className="flex-1 container grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 py-6">
        <aside className="hidden md:flex flex-col gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/transactions">
            <Button variant="ghost" className="w-full justify-start">
              <History className="mr-2 h-4 w-4" />
              Transactions
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
          <Link href="/help">
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help
            </Button>
          </Link>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}
