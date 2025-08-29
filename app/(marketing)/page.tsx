import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <div className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium">
            Connecting Military-Trained Operators with Construction Projects
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Patriot Heavy Ops
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Connect with vetted heavy equipment operators from military backgrounds. 
            Get reliable, skilled operators for your construction and industrial projects.
          </p>
          <div className="space-x-4">
            <Link href="/hire" className={cn(buttonVariants({ size: "lg" }))}>
              Hire Equipment & Operators
            </Link>
            <Link
              href="/operators"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              For Operators
            </Link>
          </div>
        </div>
      </section>
      
      <section
        id="features"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Why Choose Patriot Heavy Ops?
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Military-trained operators bring discipline, precision, and reliability to your projects.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">Military Training</h3>
                <p className="text-sm text-muted-foreground">
                  Operators with proven discipline and precision from military service.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">Vetted & Certified</h3>
                <p className="text-sm text-muted-foreground">
                  All operators are background-checked and certified for safety.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">Fast Response</h3>
                <p className="text-sm text-muted-foreground">
                  Quick matching and deployment for urgent project needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Ready to Get Started?
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Connect with skilled operators or find your next project opportunity.
          </p>
          <div className="space-x-4">
            <Link href="/hire" className={cn(buttonVariants({ size: "lg" }))}>
              Hire Equipment & Operators
            </Link>
            <Link
              href="/operators"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Join as Operator
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
