import Link from "next/link"

import { marketingConfig } from "@/config/marketing"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"

interface OperatorsLayoutProps {
  children: React.ReactNode
}

export default async function OperatorsLayout({
  children,
}: OperatorsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="absolute top-0 left-0 right-0 z-50" style={{ backgroundColor: '#0A0C26' }}>
        <div className="container h-20 flex items-center">
          <div className="flex h-10 items-center justify-between w-full">
            {/* Left-aligned logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-black rounded"></div>
              <span className="font-bold text-white text-lg">Patriot Heavy Ops</span>
            </Link>
            
            {/* Right-aligned elements */}
            <div className="flex items-center space-x-4">
              <Link
                href="/quote"
                className="px-3 py-1 text-white hover:bg-white/20 transition-colors rounded-md text-base"
              >
                Get a Fast Quote
              </Link>
              <MainNav items={marketingConfig.mainNav} />
            </div>
          </div>
        </div>
      </header>
      
      {/* Thin gray separator line */}
      <div className="absolute top-20 left-0 right-0 z-40">
        <div className="border-t border-gray-300 w-full"></div>
      </div>
      
      <main className="flex-1 pt-20 bg-white">{children}</main>
      <SiteFooter />
    </div>
  )
}
