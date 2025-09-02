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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT Column - Logo, Description, Social Media */}
          <div className="md:col-span-1 space-y-4">
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
            <p className="text-white/80 text-sm leading-relaxed">
              Patriot Heavy Ops provides reliable heavy equipment operators with military-training for residential builds, commercial developments, and transportation infrastructure projects.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <Link href="#" className="text-white/80 hover:text-white transition-colors">
                <Icons.facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/80 hover:text-white transition-colors">
                <Icons.linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/80 hover:text-white transition-colors">
                <Icons.twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          {/* RIGHT Column - Page Links */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold text-white mb-4">Services</h3>
                <ul className="space-y-2">
                  <li><Link href="/operators" className="text-white/80 hover:text-white transition-colors text-sm">Hire Operators</Link></li>
                  <li><Link href="/equipment" className="text-white/80 hover:text-white transition-colors text-sm">Find Equipment</Link></li>
                  <li><Link href="/quote" className="text-white/80 hover:text-white transition-colors text-sm">Get a Quote</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link href="/about-us" className="text-white/80 hover:text-white transition-colors text-sm">Company</Link></li>
                  <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors text-sm">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><Link href="/terms" className="text-white/80 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="text-white/80 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section 2: Copyright and Legal Links */}
      <div className="border-t border-white/20">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-white/80 text-sm text-center md:text-left">
              Copyright © 2025 Tailwind Performance LLC DBA Patriot Heavy Ops | Heavy Construction Equipment with Military-Trained Operators
            </p>
            
            {/* Legal Links */}
            <div className="flex space-x-6">
              <Link href="/terms" className="text-white/80 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-white/80 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
