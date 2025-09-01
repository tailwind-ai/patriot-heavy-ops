import Link from "next/link"
import Image from "next/image"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center">
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
    </>
  )
}
