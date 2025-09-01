import * as React from "react"
import Link from "next/link"

import { MainNavItem } from "types"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { useLockBody } from "@/hooks/use-lock-body"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"

interface MobileNavProps {
  items: MainNavItem[]
  children?: React.ReactNode
  onClose: () => void
}

export function MobileNav({ items, children, onClose }: MobileNavProps) {
  useLockBody()

  return (
    <div
      className={cn(
        "fixed inset-0 top-20 z-50 grid h-[calc(100vh-5rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80"
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-white/95 backdrop-blur-sm p-4 text-black shadow-md max-w-sm ml-auto">
        {/* Logo and Close Button */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" onClick={onClose}>
            <div className="h-6 w-6 bg-black rounded"></div>
            <span className="font-bold text-black">{siteConfig.name}</span>
          </Link>
          <button onClick={onClose} className="p-2">
            <Icons.close className="h-5 w-5" />
          </button>
        </div>
        
        {/* Navigation Items */}
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex w-full items-center rounded-md p-3 text-sm font-medium text-black hover:bg-gray-100 transition-colors",
                item.disabled && "cursor-not-allowed opacity-60"
              )}
              onClick={onClose}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        
        {/* Separator */}
        <div className="border-t border-gray-200" />
        
        {/* Login and Sign Up Buttons */}
        <div className="flex flex-col space-y-3">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full justify-center"
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
        
        {children}
      </div>
    </div>
  )
}
