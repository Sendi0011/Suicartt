import { LockIcon, RefreshCw, Shield, Zap } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose Suicart?</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform provides a secure and efficient way to handle digital transactions on the Sui blockchain.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <LockIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Secure Escrow</h3>
            <p className="text-center text-muted-foreground">
              Funds are locked in a secure smart contract until all conditions are met.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Trustless</h3>
            <p className="text-center text-muted-foreground">
              No need to trust the other party - the blockchain enforces the rules.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Fast & Efficient</h3>
            <p className="text-center text-muted-foreground">
              Transactions are processed quickly on the Sui blockchain.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <RefreshCw className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Full Refunds</h3>
            <p className="text-center text-muted-foreground">
              Buyers can get a full refund if the seller doesn't deliver.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
