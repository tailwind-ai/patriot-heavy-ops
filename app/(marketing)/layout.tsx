import Link from "next/link"
import Image from "next/image"

import { marketingConfig } from "@/config/marketing"
// Removed unused imports
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="absolute inset-x-0 top-0 z-50 bg-transparent">
        <div className="container flex h-20 items-center">
          <div className="flex h-10 w-full items-center justify-between">
            {/* Left-aligned logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo-white-horizontal.webp"
                alt="Patriot Heavy Ops"
                width={125}
                height={25}
                className="w-auto object-contain"
              />
            </Link>
            
            {/* Right-aligned elements */}
            <div className="flex items-center space-x-4">
              <Link
                href="/quote"
                className="rounded-md px-3 py-1 text-base text-white transition-colors hover:bg-white/20"
              >
                Get a Fast Quote
              </Link>
              <MainNav items={marketingConfig.mainNav} />
            </div>
          </div>
        </div>
      </header>
      
      {/* Thin gray separator line */}
      <div className="absolute inset-x-0 top-20 z-40">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
