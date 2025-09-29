"use client"

import * as React from "react"
// Removed unused Link import
// Removed unused useSelectedLayoutSegment import

import { MainNavItem } from "types"
// Removed unused imports
import { Icons } from "@/components/icons"
import { MobileNav } from "@/components/mobile-nav"

type MainNavProps = {
  items?: MainNavItem[]
  children?: React.ReactNode
}

export function MainNav({ items, children }: MainNavProps) {
  // const segment = useSelectedLayoutSegment()
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)

  return (
    <>
      {/* Hamburger Menu - Works on all screen sizes */}
      <button
        className="flex items-center space-x-2 text-white"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <Icons.close /> : <Icons.menu />}
      </button>
      
      {/* Mobile Menu Overlay - Works on all screen sizes */}
      {showMobileMenu && items && (
        <MobileNav items={items} onClose={() => setShowMobileMenu(false)}>
          {children}
        </MobileNav>
      )}
    </>
  )
}
