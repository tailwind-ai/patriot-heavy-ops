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
            Equipment We Run
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Browse our comprehensive selection of heavy construction equipment.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Image
                src="/images/track-loader.webp"
                alt="Track Loader"
                width={160}
                height={96}
                className="h-24 w-40 object-cover"
              />
              <div className="space-y-2">
                <h3 className="font-bold">Skid Steers & Track Loaders</h3>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="flex items-center justify-center h-24 w-40 bg-white rounded">
                <Image
                  src="/images/front-end-loader.webp"
                  alt="Front End Loader"
                  width={160}
                  height={96}
                  className="h-24 w-40 object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Front End Loaders</h3>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="flex items-center justify-center h-24 w-40 bg-white rounded">
                <Image
                  src="/images/backhoe.webp"
                  alt="Backhoe"
                  width={160}
                  height={96}
                  className="h-24 w-40 object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Backhoes & Excavators</h3>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="flex items-center justify-center h-24 w-40 bg-white rounded">
                <Image
                  src="/images/bulldozer.webp"
                  alt="Bulldozer"
                  width={160}
                  height={96}
                  className="h-24 w-40 object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Bulldozers</h3>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="flex items-center justify-center h-24 w-40 bg-white rounded">
                <Image
                  src="/images/grader.png"
                  alt="Grader"
                  width={160}
                  height={96}
                  className="h-24 w-40 object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Graders</h3>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="flex items-center justify-center h-24 w-40 bg-white rounded">
                <Image
                  src="/images/dump-truck.webp"
                  alt="Dump Truck"
                  width={160}
                  height={96}
                  className="h-24 w-40 object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Dump Trucks</h3>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="flex items-center justify-center h-24 w-40 bg-white rounded">
                <Image
                  src="/images/water-truck.webp"
                  alt="Water Truck"
                  width={160}
                  height={96}
                  className="h-24 w-40 object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Water Trucks</h3>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="flex items-center justify-center h-24 w-28 bg-white rounded">
                <Image
                  src="/images/sweepr.png"
                  alt="Sweeper"
                  width={112}
                  height={96}
                  className="h-24 w-28 object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Sweepers</h3>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="flex items-center justify-center h-24 w-40 bg-white rounded">
                <Image
                  src="/images/trencher.webp"
                  alt="Trencher"
                  width={160}
                  height={96}
                  className="h-24 w-40 object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Trenchers</h3>
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
