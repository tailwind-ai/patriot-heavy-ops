import * as React from "react"
import Link from "next/link"
import Image from "next/image"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)} style={{ backgroundColor: '#232C43' }}>
      {/* Section 1: Main Footer Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* LEFT Column - Logo, Description, Social Media */}
          <div className="space-y-4 md:col-span-1">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Image
                src="/images/logo-white-horizontal.webp"
                alt="Patriot Heavy Ops"
                width={125}
                height={25}
                className="w-auto object-contain"
              />
            </div>
            
            {/* Description */}
            <p className="text-sm leading-relaxed text-white/80">
              Patriot Heavy Ops provides reliable heavy equipment operators with military-training for residential builds, commercial developments, and transportation infrastructure projects.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <Link href="#" className="text-white/80 transition-colors hover:text-white">
                <Icons.facebook className="size-5" />
              </Link>
              <Link href="#" className="text-white/80 transition-colors hover:text-white">
                <Icons.linkedin className="size-5" />
              </Link>
              <Link href="#" className="text-white/80 transition-colors hover:text-white">
                <Icons.twitter className="size-5" />
              </Link>
            </div>
          </div>
          
          {/* RIGHT Column - Page Links */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div>
                <h3 className="mb-4 font-semibold text-white">Services</h3>
                <ul className="space-y-2">
                  <li><Link href="/operators" className="text-sm text-white/80 transition-colors hover:text-white">Hire Operators</Link></li>
                  <li><Link href="/equipment" className="text-sm text-white/80 transition-colors hover:text-white">Find Equipment</Link></li>
                  <li><Link href="/quote" className="text-sm text-white/80 transition-colors hover:text-white">Get a Quote</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 font-semibold text-white">Company</h3>
                <ul className="space-y-2">
                  <li><Link href="/about-us" className="text-sm text-white/80 transition-colors hover:text-white">Company</Link></li>
                  <li><Link href="/contact" className="text-sm text-white/80 transition-colors hover:text-white">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 font-semibold text-white">Support</h3>
                <ul className="space-y-2">
                  <li><Link href="/terms" className="text-sm text-white/80 transition-colors hover:text-white">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="text-sm text-white/80 transition-colors hover:text-white">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section 2: Copyright and Legal Links */}
      <div className="border-t border-white/20">
        <div className="container py-6">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            {/* Copyright */}
            <p className="text-center text-sm text-white/80 md:text-left">
              Copyright © 2025 Tailwind Performance LLC DBA Patriot Heavy Ops | Heavy Construction Equipment with Military-Trained Operators
            </p>
            
            {/* Legal Links */}
            <div className="flex space-x-6">
              <Link href="/terms" className="text-sm text-white/80 transition-colors hover:text-white">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-white/80 transition-colors hover:text-white">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
