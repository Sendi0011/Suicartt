"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import ThreeDLogo from "@/components/three-d-logo"
import { useSuiWallet } from "@/components/sui-wallet-provider"
import { escrowFunctions } from "@/lib/sui-client"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function CreateEscrow() {
  const [sellerAddress, setSellerAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [assetType, setAssetType] = useState<"digital" | "physical">("digital")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { connected, connect, signAndExecuteTransaction } = useSuiWallet()
  const { toast } = useToast()

  // Check if we're in demo mode (no contract deployed)
  const isDemoMode = !process.env.NEXT_PUBLIC_ESCROW_PACKAGE_ID || process.env.NEXT_PUBLIC_ESCROW_PACKAGE_ID === "0x0"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your Sui wallet to continue.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Create transaction block based on asset type
      const txb =
        assetType === "digital"
          ? escrowFunctions.createDigitalEscrow(sellerAddress, Number.parseFloat(amount), description)
          : escrowFunctions.createPhysicalEscrow(sellerAddress, Number.parseFloat(amount), description)

      // Sign and execute transaction
      const result = await signAndExecuteTransaction(txb)

      toast({
        title: "Escrow created successfully!",
        description: `Transaction digest: ${result.digest.substring(0, 10)}...`,
      })

      // Reset form
      setSellerAddress("")
      setAmount("")
      setDescription("")
    } catch (error) {
      console.error("Error creating escrow:", error)
      toast({
        title: "Failed to create escrow",
        description: "There was an error creating your escrow. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      {isDemoMode && (
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Demo Mode</AlertTitle>
          <AlertDescription>
            Running in demo mode with simulated transactions. Set NEXT_PUBLIC_ESCROW_PACKAGE_ID environment variable to
            interact with a real contract.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create New Escrow</CardTitle>
            <CardDescription>
              Start a secure transaction by creating an escrow. The funds will be locked until the transaction is
              complete.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seller-address">Seller Address</Label>
                <Input
                  id="seller-address"
                  placeholder="0x..."
                  value={sellerAddress}
                  onChange={(e) => setSellerAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (SUI)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.001"
                  step="0.001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what is being purchased..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Asset Type</Label>
                <RadioGroup
                  value={assetType}
                  onValueChange={(value) => setAssetType(value as "digital" | "physical")}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="digital" id="digital" />
                    <Label htmlFor="digital" className="cursor-pointer">
                      Digital Asset (transferred on-chain)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="physical" id="physical" />
                    <Label htmlFor="physical" className="cursor-pointer">
                      Physical Good/Service (delivered off-chain)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              {connected ? (
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Escrow"}
                </Button>
              ) : (
                <Button type="button" className="w-full" onClick={connect}>
                  Connect Wallet to Continue
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>

        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-48 h-48 md:w-64 md:h-64">
            <ThreeDLogo size={300} animated />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Secure Escrow on Sui</h2>
            <p className="text-muted-foreground">
              Your funds are securely locked in a smart contract until the transaction is complete.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 border rounded-lg bg-muted/30">
        <h3 className="text-lg font-medium mb-4">How the Escrow Process Works</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Digital Assets</h4>
            <ol className="space-y-2 list-decimal list-inside">
              <li>You create an escrow by depositing SUI tokens and specifying the seller's address.</li>
              <li>The seller deposits the digital asset into the escrow.</li>
              <li>You can review the asset and either confirm the transaction or request a refund.</li>
              <li>If confirmed, the seller receives the SUI tokens and you receive the digital asset.</li>
              <li>If refunded, you receive your SUI tokens back and the seller receives their asset back.</li>
            </ol>
          </div>

          <div>
            <h4 className="font-medium mb-2">Physical Goods/Services</h4>
            <ol className="space-y-2 list-decimal list-inside">
              <li>You create an escrow by depositing SUI tokens and specifying the seller's address.</li>
              <li>The seller delivers the physical good or performs the service off-chain.</li>
              <li>After receiving the item or service, you confirm the transaction.</li>
              <li>When confirmed, the seller receives the SUI tokens.</li>
              <li>If there's an issue, you can request a refund before confirming.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
