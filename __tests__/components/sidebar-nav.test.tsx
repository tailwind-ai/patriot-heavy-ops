import { render, screen } from '@testing-library/react'
import { DocsSidebarNav } from '@/components/sidebar-nav'
import type { SidebarNavItem } from 'types'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/dashboard'),
}))

describe('DocsSidebarNav', () => {
  describe('Null Safety - Empty Items', () => {
    it('should render gracefully with empty items array', () => {
      const { container } = render(<DocsSidebarNav items={[]} />)
      
      // Should render nothing but not crash
      expect(container.firstChild).toBeNull()
    })

    it('should return null when items array is empty', () => {
      const { container } = render(<DocsSidebarNav items={[]} />)
      
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Null Safety - Item Title', () => {
    it('should render without crashing when item.title is provided', () => {
      const items: SidebarNavItem[] = [
        {
          title: 'Section 1',
          href: '/section1',
        },
      ]
      
      render(<DocsSidebarNav items={items} />)
      
      expect(screen.getByText('Section 1')).toBeInTheDocument()
    })
  })

  describe('Null Safety - Item Href', () => {
    it('should handle item without href gracefully', () => {
      const items: SidebarNavItem[] = [
        {
          title: 'Section',
          items: [
            {
              title: 'Subsection',
              href: '/subsection',
            },
          ],
        },
      ]
      
      const { container } = render(<DocsSidebarNav items={items} />)
      
      // Should render without crashing
      expect(container.firstChild).toBeInTheDocument()
      expect(screen.getByText('Section')).toBeInTheDocument()
    })

    it('should render disabled item without href', () => {
      const items: SidebarNavItem[] = [
        {
          title: 'Parent',
          items: [
            {
              title: 'Disabled Item',
              disabled: true,
            } as SidebarNavItem,
          ],
        },
      ]
      
      const { container } = render(<DocsSidebarNav items={items} />)
      
      // Should render the disabled item
      expect(screen.getByText('Disabled Item')).toBeInTheDocument()
      expect(container.querySelector('span')).toHaveClass('cursor-not-allowed')
    })
  })

  describe('Null Safety - Item Disabled', () => {
    it('should handle undefined disabled property', () => {
      const items: SidebarNavItem[] = [
        {
          title: 'Parent',
          items: [
            {
              title: 'Normal Item',
              href: '/normal',
            },
          ],
        },
      ]
      
      render(<DocsSidebarNav items={items} />)
      
      // Should render as enabled link
      expect(screen.getByText('Normal Item')).toBeInTheDocument()
      const link = screen.getByText('Normal Item').closest('a')
      expect(link).toHaveAttribute('href', '/normal')
    })

    it('should render disabled item when disabled is true', () => {
      const items: SidebarNavItem[] = [
        {
          title: 'Parent',
          items: [
            {
              title: 'Disabled',
              disabled: true,
              href: '/disabled',
            },
          ],
        },
      ]
      
      render(<DocsSidebarNav items={items} />)
      
      // Should render as span, not link
      const element = screen.getByText('Disabled')
      expect(element.closest('span')).toBeInTheDocument()
      expect(element.closest('a')).not.toBeInTheDocument()
    })
  })

  describe('Null Safety - Item External', () => {
    it('should handle undefined external property', () => {
      const items: SidebarNavItem[] = [
        {
          title: 'Parent',
          items: [
            {
              title: 'Internal Link',
              href: '/internal',
            },
          ],
        },
      ]
      
      render(<DocsSidebarNav items={items} />)
      
      const link = screen.getByText('Internal Link').closest('a')
      // Internal links should either not have target or have empty target
      const targetAttr = link?.getAttribute('target')
      expect(targetAttr === '' || targetAttr === null).toBe(true)
    })

    it('should render external link with target blank when external is true', () => {
      const items: SidebarNavItem[] = [
        {
          title: 'Parent',
          items: [
            {
              title: 'External Link',
              href: 'https://example.com',
              external: true,
            },
          ],
        },
      ]
      
      render(<DocsSidebarNav items={items} />)
      
      const link = screen.getByText('External Link').closest('a')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')
    })
  })

  describe('Null Safety - Nested Items', () => {
    it('should handle undefined nested items', () => {
      const items: SidebarNavItem[] = [
        {
          title: 'Section',
          href: '/section',
        },
      ]
      
      render(<DocsSidebarNav items={items} />)
      
      // Should render section title without crashing
      expect(screen.getByText('Section')).toBeInTheDocument()
    })

    it('should render nested items when provided', () => {
      const items: SidebarNavItem[] = [
        {
          title: 'Parent Section',
          items: [
            {
              title: 'Child 1',
              href: '/child1',
            },
            {
              title: 'Child 2',
              href: '/child2',
            },
          ],
        },
      ]
      
      render(<DocsSidebarNav items={items} />)
      
      expect(screen.getByText('Parent Section')).toBeInTheDocument()
      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
    })

    it('should handle empty nested items array', () => {
      const items: SidebarNavItem[] = [
        {
          title: 'Section',
          items: [],
        },
      ]
      
      render(<DocsSidebarNav items={items} />)
      
      // Should render section title
      expect(screen.getByText('Section')).toBeInTheDocument()
    })
  })

  describe('Valid Data', () => {
    it('should render complex navigation structure', () => {
      const items: SidebarNavItem[] = [
        {
          title: 'Getting Started',
          items: [
            {
              title: 'Introduction',
              href: '/intro',
            },
            {
              title: 'Installation',
              href: '/install',
            },
          ],
        },
        {
          title: 'Advanced',
          items: [
            {
              title: 'Configuration',
              href: '/config',
            },
            {
              title: 'External Docs',
              href: 'https://docs.example.com',
              external: true,
            },
            {
              title: 'Coming Soon',
              disabled: true,
            } as SidebarNavItem,
          ],
        },
      ]
      
      render(<DocsSidebarNav items={items} />)
      
      // Should render all sections and items
      expect(screen.getByText('Getting Started')).toBeInTheDocument()
      expect(screen.getByText('Introduction')).toBeInTheDocument()
      expect(screen.getByText('Installation')).toBeInTheDocument()
      expect(screen.getByText('Advanced')).toBeInTheDocument()
      expect(screen.getByText('Configuration')).toBeInTheDocument()
      expect(screen.getByText('External Docs')).toBeInTheDocument()
      expect(screen.getByText('Coming Soon')).toBeInTheDocument()
    })

    it('should highlight active path', () => {
      const items: SidebarNavItem[] = [
        {
          title: 'Section',
          items: [
            {
              title: 'Active Page',
              href: '/dashboard',
            },
            {
              title: 'Other Page',
              href: '/other',
            },
          ],
        },
      ]
      
      render(<DocsSidebarNav items={items} />)
      
      // Active page should have bg-muted class
      const activeLink = screen.getByText('Active Page').closest('a')
      expect(activeLink).toHaveClass('bg-muted')
      
      const otherLink = screen.getByText('Other Page').closest('a')
      expect(otherLink).not.toHaveClass('bg-muted')
    })
  })
})
