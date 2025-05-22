"use client"

import type { Transaction } from "@/lib/db"
import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronDown, ChevronUp, Download, ExternalLink, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSuiWallet } from "@/components/sui-wallet-provider"
import { transactionDb } from "@/lib/db"
import { useToast } from "@/hooks/use-toast"

export default function TransactionHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 5

  const { connected, address } = useSuiWallet()
  const { toast } = useToast()

  // Fetch transactions when wallet is connected
  useEffect(() => {
    async function fetchTransactions() {
      if (!connected || !address) return

      setLoading(true)
      try {
        const userTransactions = await transactionDb.getUserTransactions(address)
        setTransactions(userTransactions)
      } catch (error) {
        console.error("Error fetching transactions:", error)
        toast({
          title: "Failed to load transactions",
          description: "There was an error loading your transaction history.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [connected, address, toast])

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((tx) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === "" ||
        tx.id.toLowerCase().includes(searchLower) ||
        tx.counterparty_address.toLowerCase().includes(searchLower) ||
        tx.amount.toString().includes(searchQuery)

      // Status filter
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(tx.status)

      // Type filter
      const matchesType = typeFilter === "all" || tx.transaction_type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === "date") {
        return sortDirection === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else if (sortField === "amount") {
        return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
      }
      return 0
    })

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedTransaction(expandedTransaction === id ? null : id)
  }

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
    setCurrentPage(1)
  }

  const handleTypeFilterChange = (type: string) => {
    setTypeFilter(type)
    setCurrentPage(1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const exportTransactions = () => {
    if (filteredTransactions.length === 0) {
      toast({
        title: "No transactions to export",
        description: "There are no transactions matching your current filters.",
        variant: "destructive",
      })
      return
    }

    // Create CSV content
    const headers = ["ID", "Type", "Amount", "Status", "Created", "Completed", "Counterparty", "Asset ID"]
    const csvContent =
      headers.join(",") +
      "\n" +
      filteredTransactions
        .map((tx) => {
          return [
            tx.id,
            tx.transaction_type,
            tx.amount,
            tx.status,
            new Date(tx.created_at).toLocaleDateString(),
            tx.completed_at ? new Date(tx.completed_at).toLocaleDateString() : "",
            tx.counterparty_address,
            tx.asset_id,
          ].join(",")
        })
        .join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `suicart-transactions-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Transactions exported",
      description: `${filteredTransactions.length} transactions have been exported to CSV.`,
    })
  }

  if (!connected) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Please connect your wallet to view your transaction history.</p>
            <Button onClick={() => {}}>Connect Wallet</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-muted-foreground">View and manage your past escrow transactions</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportTransactions} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
          <CardDescription>Narrow down your transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by ID or address..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {statusFilter.length === 0 ? "All Statuses" : `${statusFilter.length} selected`}
                    <Filter className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("Completed")}
                    onCheckedChange={() => handleStatusFilterChange("Completed")}
                  >
                    Completed
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("Pending")}
                    onCheckedChange={() => handleStatusFilterChange("Pending")}
                  >
                    Pending
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("Refunded")}
                    onCheckedChange={() => handleStatusFilterChange("Refunded")}
                  >
                    Refunded
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Transaction Type</label>
              <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="buyer">As Buyer</SelectItem>
                  <SelectItem value="seller">As Seller</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Loading your transaction history...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="table" className="mb-8">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="cards">Card View</TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Type</TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-primary"
                          onClick={() => toggleSort("date")}
                        >
                          Date
                          {sortField === "date" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            ))}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-primary"
                          onClick={() => toggleSort("amount")}
                        >
                          Amount
                          {sortField === "amount" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            ))}
                        </button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.length > 0 ? (
                      paginatedTransactions.map((tx) => (
                        <React.Fragment key={tx.id}>
                          <TableRow className="cursor-pointer" onClick={() => toggleExpand(tx.id)}>
                            <TableCell>
                              <Badge variant="outline">{tx.transaction_type === "buyer" ? "Bought" : "Sold"}</Badge>
                            </TableCell>
                            <TableCell>{new Date(tx.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{tx.amount} SUI</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  tx.status === "Completed"
                                    ? "default"
                                    : tx.status === "Refunded"
                                      ? "destructive"
                                      : "outline"
                                }
                              >
                                {tx.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                {expandedTransaction === tx.id ? "Hide" : "View"}
                              </Button>
                            </TableCell>
                          </TableRow>
                          {expandedTransaction === tx.id && (
                            <TableRow>
                              <TableCell colSpan={5} className="bg-muted/30">
                                <div className="py-2 px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Transaction ID</p>
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs font-mono truncate">{tx.id}</p>
                                      <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Asset ID</p>
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs font-mono truncate">{tx.asset_id}</p>
                                      <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {tx.transaction_type === "buyer" ? "Seller" : "Buyer"}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs font-mono truncate">{tx.counterparty_address}</p>
                                      <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Completed Date</p>
                                    <p className="text-sm">
                                      {tx.completed_at
                                        ? new Date(tx.completed_at).toLocaleString()
                                        : "Not completed yet"}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="cards">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((tx) => (
                    <Card key={tx.id} className="w-full">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">
                              {tx.amount} SUI {tx.transaction_type === "buyer" ? "Purchase" : "Sale"}
                            </CardTitle>
                            <Badge
                              variant={
                                tx.status === "Completed"
                                  ? "default"
                                  : tx.status === "Refunded"
                                    ? "destructive"
                                    : "outline"
                              }
                            >
                              {tx.status}
                            </Badge>
                          </div>
                          <Badge variant="outline">{new Date(tx.created_at).toLocaleDateString()}</Badge>
                        </div>
                        <CardDescription>Transaction with {tx.counterparty_address.substring(0, 8)}...</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Transaction ID</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-mono truncate">{tx.id}</p>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Completed</p>
                            <p className="text-sm">
                              {tx.completed_at ? new Date(tx.completed_at).toLocaleString() : "Not completed yet"}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => toggleExpand(tx.id)}
                          >
                            {expandedTransaction === tx.id ? "Hide Details" : "View Details"}
                          </Button>
                          {expandedTransaction === tx.id && (
                            <div className="mt-4 pt-4 border-t space-y-2">
                              <div>
                                <p className="text-sm text-muted-foreground">Asset ID</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-mono truncate">{tx.asset_id}</p>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  {tx.transaction_type === "buyer" ? "Seller Address" : "Buyer Address"}
                                </p>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-mono truncate">{tx.counterparty_address}</p>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="col-span-full">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <p className="text-muted-foreground">No transactions found matching your filters.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}{" "}
                transactions
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
