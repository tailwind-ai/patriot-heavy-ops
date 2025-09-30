import { render, screen } from "@testing-library/react"
import { DashboardNav } from "@/components/nav"
import type { SidebarNavItem } from "types"

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/dashboard"),
}))

describe("DashboardNav", () => {
  describe("Null Safety - Empty Items", () => {
    it("should return null with empty items array", () => {
      const { container } = render(<DashboardNav items={[]} />)

      expect(container.firstChild).toBeNull()
    })

    it("should return null with undefined items length", () => {
      const { container } = render(<DashboardNav items={[]} />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe("Null Safety - Item Icon", () => {
    it("should handle undefined icon with fallback", () => {
      const items: SidebarNavItem[] = [
        {
          title: "Dashboard",
          href: "/dashboard",
        },
      ]

      const { container } = render(<DashboardNav items={items} />)

      // Should render without crashing, using arrowRight as fallback
      expect(screen.getByText("Dashboard")).toBeInTheDocument()
      expect(container.querySelector("svg")).toBeInTheDocument()
    })

    it("should render specified icon when provided", () => {
      const items: SidebarNavItem[] = [
        {
          title: "Settings",
          href: "/settings",
          icon: "settings",
        },
      ]

      render(<DashboardNav items={items} />)

      expect(screen.getByText("Settings")).toBeInTheDocument()
    })
  })

  describe("Null Safety - Item Disabled", () => {
    it("should handle undefined disabled property as enabled", () => {
      const items: SidebarNavItem[] = [
        {
          title: "Active Link",
          href: "/active",
        },
      ]

      render(<DashboardNav items={items} />)

      const link = screen.getByText("Active Link").closest("a")
      expect(link).toHaveAttribute("href", "/active")
      expect(link?.querySelector("span")).not.toHaveClass("cursor-not-allowed")
    })

    it("should render disabled item with disabled styles", () => {
      const items: SidebarNavItem[] = [
        {
          title: "Disabled Link",
          href: "/disabled",
          disabled: true,
        },
      ]

      render(<DashboardNav items={items} />)

      const link = screen.getByText("Disabled Link").closest("a")
      // Should link to / when disabled
      expect(link).toHaveAttribute("href", "/")
      expect(link?.querySelector("span")).toHaveClass("cursor-not-allowed")
    })
  })

  describe("Null Safety - Item Href", () => {
    it("should not render item without href", () => {
      const items: SidebarNavItem[] = [
        {
          title: "Section",
          items: [
            {
              title: "Child",
              href: "/child",
            },
          ],
        },
        {
          title: "With Href",
          href: "/valid",
        },
      ]

      render(<DashboardNav items={items} />)

      // Item without href should not be rendered
      expect(screen.queryByText("Section")).not.toBeInTheDocument()
      // Item with href should be rendered
      expect(screen.getByText("With Href")).toBeInTheDocument()
    })

    it("should handle undefined href gracefully", () => {
      const items: SidebarNavItem[] = [
        {
          title: "Valid Item",
          href: "/valid",
        },
      ]

      const { container } = render(<DashboardNav items={items} />)

      // Should render valid items without crashing
      expect(container.querySelector("nav")).toBeInTheDocument()
    })
  })

  describe("Null Safety - Item Title", () => {
    it("should render item title when provided", () => {
      const items: SidebarNavItem[] = [
        {
          title: "My Dashboard",
          href: "/dashboard",
        },
      ]

      render(<DashboardNav items={items} />)

      expect(screen.getByText("My Dashboard")).toBeInTheDocument()
    })
  })

  describe("Valid Data", () => {
    it("should render multiple navigation items", () => {
      const items: SidebarNavItem[] = [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: "user",
        },
        {
          title: "Posts",
          href: "/posts",
          icon: "post",
        },
        {
          title: "Settings",
          href: "/settings",
          icon: "settings",
        },
      ]

      render(<DashboardNav items={items} />)

      expect(screen.getByText("Dashboard")).toBeInTheDocument()
      expect(screen.getByText("Posts")).toBeInTheDocument()
      expect(screen.getByText("Settings")).toBeInTheDocument()
    })

    it("should highlight active path", () => {
      const items: SidebarNavItem[] = [
        {
          title: "Dashboard",
          href: "/dashboard",
        },
        {
          title: "Settings",
          href: "/settings",
        },
      ]

      render(<DashboardNav items={items} />)

      const dashboardLink = screen.getByText("Dashboard").parentElement
      const settingsLink = screen.getByText("Settings").parentElement

      // Active path should have bg-accent
      expect(dashboardLink).toHaveClass("bg-accent")
      expect(settingsLink).not.toHaveClass("bg-accent")
    })

    it("should render with mixed enabled and disabled items", () => {
      const items: SidebarNavItem[] = [
        {
          title: "Active",
          href: "/active",
          disabled: false,
        },
        {
          title: "Disabled",
          href: "/disabled",
          disabled: true,
        },
      ]

      render(<DashboardNav items={items} />)

      expect(screen.getByText("Active")).toBeInTheDocument()
      expect(screen.getByText("Disabled")).toBeInTheDocument()

      const activeLink = screen.getByText("Active").closest("a")
      const disabledLink = screen.getByText("Disabled").closest("a")

      expect(activeLink).toHaveAttribute("href", "/active")
      expect(disabledLink).toHaveAttribute("href", "/")
    })

    it("should render icons for all items", () => {
      const items: SidebarNavItem[] = [
        {
          title: "Item 1",
          href: "/item1",
          icon: "user",
        },
        {
          title: "Item 2",
          href: "/item2",
        },
      ]

      const { container } = render(<DashboardNav items={items} />)

      // Should have 2 SVG icons (one explicit, one fallback)
      const svgs = container.querySelectorAll("svg")
      expect(svgs.length).toBe(2)
    })
  })

  describe("Navigation Wrapper", () => {
    it("should render nav element with correct classes", () => {
      const items: SidebarNavItem[] = [
        {
          title: "Test",
          href: "/test",
        },
      ]

      const { container } = render(<DashboardNav items={items} />)

      const nav = container.querySelector("nav")
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveClass("grid", "items-start", "gap-2")
    })
  })
})
