"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ExternalLink, History, Package, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useSuiWallet } from "@/components/sui-wallet-provider"
import { getEscrowsByOwner } from "@/lib/sui-client"
import { useToast } from "@/hooks/use-toast"

interface Escrow {
  objectId: string
  content: {
    id: { id: string }
    buyer: string
    seller: string
    amount: { value: number }
    asset_type: number
    description: string
    status: string
  }
  hasAssetDeposited?: boolean
  createdAt: string
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("buyer")
  const [escrows, setEscrows] = useState<Escrow[]>([])
  const [loading, setLoading] = useState(true)

  const { connected, address, signAndExecuteTransaction } = useSuiWallet()
  const { toast } = useToast()

  // Fetch escrows when wallet is connected
  useEffect(() => {
    async function fetchEscrows() {
      if (!connected || !address) return

      setLoading(true)
      try {
        const userEscrows = await getEscrowsByOwner(address)

        // Transform the data to match our Escrow interface
        const formattedEscrows = userEscrows.map((escrow) => ({
          objectId: escrow.objectId,
          content: escrow.content as any,
          hasAssetDeposited: Math.random() > 0.5, // Mock data - in real app, check if asset is deposited
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10 * 86400000)).toISOString(), // Random date within last 10 days
        }))

        setEscrows(formattedEscrows)
      } catch (error) {
        console.error("Error fetching escrows:", error)
        toast({
          title: "Failed to load escrows",
          description: "There was an error loading your escrow transactions.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEscrows()
  }, [connected, address, toast])

  const handleConfirm = (id: string) => {
    toast({
      title: "Confirming escrow",
      description: `Initiating confirmation for escrow ${id.substring(0, 8)}...`,
    })
  }

  const handleRefund = (id: string) => {
    toast({
      title: "Requesting refund",
      description: `Initiating refund for escrow ${id.substring(0, 8)}...`,
    })
  }

  const handleDeposit = (id: string) => {
    toast({
      title: "Depositing asset",
      description: `Initiating asset deposit for escrow ${id.substring(0, 8)}...`,
    })
  }

  // Filter escrows based on active tab
  const buyerEscrows = escrows.filter((escrow) => escrow.content.buyer === address)
  const sellerEscrows = escrows.filter((escrow) => escrow.content.seller === address)

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Escrow Dashboard</h1>
          <p className="text-muted-foreground">Manage your escrow transactions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/create-escrow">
            <Button>Create New Escrow</Button>
          </Link>
          <Link href="/transactions">
            <Button variant="outline" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              View History
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="buyer" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="buyer">As Buyer</TabsTrigger>
          <TabsTrigger value="seller">As Seller</TabsTrigger>
        </TabsList>

        <TabsContent value="buyer" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">Loading your escrows...</p>
              </CardContent>
            </Card>
          ) : buyerEscrows.length > 0 ? (
            buyerEscrows.map((escrow) => (
              <Card key={escrow.objectId} className="w-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">
                          Escrow with {escrow.content.seller.substring(0, 8)}...
                        </CardTitle>
                        {escrow.content.asset_type === 0 ? (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            Digital
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <ShoppingBag className="h-3 w-3" />
                            Physical
                          </Badge>
                        )}
                      </div>
                      <CardDescription>Created on {new Date(escrow.createdAt).toLocaleDateString()}</CardDescription>
                    </div>
                    {escrow.content.asset_type === 0 ? (
                      <Badge variant={escrow.hasAssetDeposited ? "default" : "outline"}>
                        {escrow.hasAssetDeposited ? "Asset Deposited" : "Awaiting Asset"}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Awaiting Delivery</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium">{escrow.content.amount.value / 1_000_000_000} SUI</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium">{escrow.content.status}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-sm">{escrow.content.description}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Escrow ID</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-xs truncate">{escrow.objectId}</p>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {escrow.content.asset_type === 0 ? (
                    // Digital asset flow
                    escrow.hasAssetDeposited ? (
                      <>
                        <Button variant="outline" onClick={() => handleRefund(escrow.objectId)}>
                          Request Refund
                        </Button>
                        <Button onClick={() => handleConfirm(escrow.objectId)}>Confirm & Release</Button>
                      </>
                    ) : (
                      <Button variant="outline" onClick={() => handleRefund(escrow.objectId)}>
                        Cancel & Refund
                      </Button>
                    )
                  ) : (
                    // Physical good flow
                    <>
                      <Button variant="outline" onClick={() => handleRefund(escrow.objectId)}>
                        Request Refund
                      </Button>
                      <Button onClick={() => handleConfirm(escrow.objectId)}>Confirm Receipt & Release</Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">You don't have any active escrows as a buyer.</p>
                <Link href="/create-escrow">
                  <Button>Create New Escrow</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="seller" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">Loading your escrows...</p>
              </CardContent>
            </Card>
          ) : sellerEscrows.length > 0 ? (
            sellerEscrows.map((escrow) => (
              <Card key={escrow.objectId} className="w-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">Escrow from {escrow.content.buyer.substring(0, 8)}...</CardTitle>
                        {escrow.content.asset_type === 0 ? (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            Digital
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <ShoppingBag className="h-3 w-3" />
                            Physical
                          </Badge>
                        )}
                      </div>
                      <CardDescription>Created on {new Date(escrow.createdAt).toLocaleDateString()}</CardDescription>
                    </div>
                    {escrow.content.asset_type === 0 ? (
                      <Badge variant={escrow.hasAssetDeposited ? "default" : "outline"}>
                        {escrow.hasAssetDeposited ? "Asset Deposited" : "Deposit Required"}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Deliver Item</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium">{escrow.content.amount.value / 1_000_000_000} SUI</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium">{escrow.content.status}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-sm">{escrow.content.description}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Escrow ID</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-xs truncate">{escrow.objectId}</p>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  {escrow.content.asset_type === 0 && !escrow.hasAssetDeposited ? (
                    // Digital asset that needs to be deposited
                    <Button onClick={() => handleDeposit(escrow.objectId)}>Deposit Digital Asset</Button>
                  ) : (
                    // Physical good or digital asset already deposited
                    <Button variant="outline" disabled>
                      Awaiting Buyer
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">You don't have any active escrows as a seller.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
