import * as React from "react"
import Link from "next/link"
import Image from "next/image"

import { MainNavItem } from "types"
// Removed unused siteConfig import
import { cn } from "@/lib/utils"
import { useLockBody } from "@/hooks/use-lock-body"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"

type MobileNavProps = {
  items: MainNavItem[]
  children?: React.ReactNode
  onClose: () => void
}

export function MobileNav({ items, children, onClose }: MobileNavProps) {
  useLockBody()

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex justify-end"
      )}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Enter' && onClose()}
        role="button"
        tabIndex={0}
      />
      
      {/* Menu Panel - Slides in from right */}
      <div className="relative z-20 size-full max-w-sm bg-white shadow-2xl duration-300 animate-in slide-in-from-right">
        {/* Logo and Close Button */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <Link href="/" className="flex items-center space-x-2" onClick={onClose}>
            <Image
              src="/images/logo-color-h.webp"
              alt="Patriot Heavy Ops"
              width={150}
              height={30}
              className="h-auto w-[150px] object-contain"
            />
          </Link>
          <button onClick={onClose} className="rounded-md p-2 transition-colors hover:bg-gray-100">
            <Icons.close className="size-5" />
          </button>
        </div>
        
        {/* Navigation Content - Full height with scroll */}
        <div className="flex h-[calc(100vh-80px)] flex-col overflow-y-auto">
          {/* Navigation Items */}
          <nav className="flex-1 p-6">
            <div className="grid grid-flow-row auto-rows-max space-y-2 text-sm">
              {items.slice(0, 3).map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex w-full items-center rounded-md p-3 text-sm font-medium text-black transition-colors hover:bg-gray-100",
                    item.disabled && "cursor-not-allowed opacity-60"
                  )}
                  onClick={onClose}
                >
                  {item.title}
                </Link>
              ))}
              
              {/* Separator with equal spacing */}
              <div className="my-8">
                <div className="border-t border-gray-200"></div>
              </div>
              
              {/* About Us and Contact Us */}
              {items.slice(3, 5).map((item, index) => (
                <Link
                  key={index + 3}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex w-full items-center rounded-md p-3 text-sm font-medium text-black transition-colors hover:bg-gray-100",
                    item.disabled && "cursor-not-allowed opacity-60"
                  )}
                  onClick={onClose}
                >
                  {item.title}
                </Link>
              ))}
              
              {/* Login and Sign Up Buttons */}
              <div className="space-y-3">
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-full justify-center text-black hover:text-black"
                  )}
                  onClick={onClose}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "w-full justify-center"
                  )}
                  onClick={onClose}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </nav>
          
          {children}
        </div>
      </div>
    </div>
  )
}
