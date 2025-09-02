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
        "fixed inset-0 top-0 z-50 flex justify-end"
      )}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Menu Panel - Slides in from right */}
      <div className="relative z-20 h-full w-full max-w-sm bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Logo and Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2" onClick={onClose}>
            <div className="h-6 w-6 bg-black rounded"></div>
            <span className="font-bold text-black">{siteConfig.name}</span>
          </Link>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <Icons.close className="h-5 w-5" />
          </button>
        </div>
        
        {/* Navigation Content - Full height with scroll */}
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
          {/* Navigation Items */}
          <nav className="flex-1 p-6">
            <div className="grid grid-flow-row auto-rows-max text-sm space-y-2">
              {items.slice(0, 3).map((item, index) => (
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
              
              {/* Separator with equal spacing */}
              <div className="mt-8 mb-8">
                <div className="border-t border-gray-200"></div>
              </div>
              
              {/* About Us and Contact Us */}
              {items.slice(3, 5).map((item, index) => (
                <Link
                  key={index + 3}
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
              
              {/* Login and Sign Up Buttons */}
              <div className="space-y-3">
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
            </div>
          </nav>
          
          {children}
        </div>
      </div>
    </div>
  )
}
