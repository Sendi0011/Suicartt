import { ArrowRight } from "lucide-react"

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our escrow service makes digital transactions safe and simple.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
          <div className="grid gap-2 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary mx-auto">
              <span className="text-3xl font-bold text-primary-foreground">1</span>
            </div>
            <h3 className="text-xl font-bold">Buyer Creates Escrow</h3>
            <p className="text-muted-foreground">
              Buyer initiates the escrow by depositing SUI tokens and specifying the seller's address.
            </p>
          </div>
          <div className="relative flex justify-center lg:col-span-1">
            <ArrowRight className="hidden h-8 w-8 rotate-90 text-muted-foreground/30 lg:block lg:rotate-0" />
          </div>
          <div className="grid gap-2 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary mx-auto">
              <span className="text-3xl font-bold text-primary-foreground">2</span>
            </div>
            <h3 className="text-xl font-bold">Seller Deposits Asset</h3>
            <p className="text-muted-foreground">
              Seller deposits the digital asset into the escrow, making it ready for transfer.
            </p>
          </div>
          <div className="relative flex justify-center lg:col-span-1">
            <ArrowRight className="hidden h-8 w-8 rotate-90 text-muted-foreground/30 lg:block lg:rotate-0" />
          </div>
          <div className="grid gap-2 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary mx-auto">
              <span className="text-3xl font-bold text-primary-foreground">3</span>
            </div>
            <h3 className="text-xl font-bold">Buyer Confirms or Refunds</h3>
            <p className="text-muted-foreground">
              Buyer can either confirm the transaction to release funds to the seller and receive the asset, or request
              a refund.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
