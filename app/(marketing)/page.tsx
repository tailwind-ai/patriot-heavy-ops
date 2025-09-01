import Link from "next/link"
import Image from "next/image"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <>
      <section className="relative min-h-screen flex flex-col justify-center -mt-5">
        {/* Background Images */}
        <div className="absolute inset-0 -z-10">
          {/* Mobile Background */}
          <div className="block md:hidden">
            <Image
              src="/images/hero-mobile.webp"
              alt="Military personnel with construction equipment at sunset"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          {/* Desktop Background */}
          <div className="hidden md:block">
            <Image
              src="/images/hero-desktop.webp"
              alt="Military personnel with bulldozer and aircraft at sunset"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="container relative flex max-w-[64rem] flex-col items-center gap-4 text-center px-4">
          <div className="rounded-2xl bg-background/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium">
            Heavy Construction Equipment with Military-Trained Operators
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white">
            Patriot Heavy Ops
          </h1>
          <p className="max-w-[42rem] leading-normal text-white/90 sm:text-xl sm:leading-8">
            Reliable heavy equipment operators for residential builds, commercial developments, and transportation infrastructure improvements.
          </p>
          <div className="space-x-4">
            <Link href="/hire" className={cn(buttonVariants({ size: "lg" }))}>
              Hire Operators
            </Link>
            <Link
              href="/operators"
              className={cn(buttonVariants({ size: "lg" }), "bg-white text-black hover:bg-gray-100")}
            >
              Find Equipment
            </Link>
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

      <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Available Equipment
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Browse our comprehensive selection of heavy construction equipment.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">Excavators</h3>
                <p className="text-sm text-muted-foreground">
                  Various sizes and types of excavators for different project needs.
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
                <h3 className="font-bold">Bulldozers</h3>
                <p className="text-sm text-muted-foreground">
                  Heavy-duty bulldozers for earthmoving and site preparation.
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
                <h3 className="font-bold">Cranes</h3>
                <p className="text-sm text-muted-foreground">
                  Mobile and tower cranes for lifting and material handling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Ready to Find Equipment?
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Get in touch to discuss your equipment needs and find the perfect solution.
          </p>
          <div className="space-x-4">
            <Link href="/quote" className={cn(buttonVariants({ size: "lg" }))}>
              Get a Quote
            </Link>
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
