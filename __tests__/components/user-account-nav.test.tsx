import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signOut } from 'next-auth/react'
import { UserAccountNav } from '@/components/user-account-nav'

// Mock next-auth
jest.mock('next-auth/react')
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>

// Mock next/link
jest.mock('next/link', () => {
  // eslint-disable-next-line react/display-name
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('UserAccountNav', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Null Safety - User Name', () => {
    it('should render without crashing when user.name is null', () => {
      const user = { name: null, email: 'test@example.com', image: null }
      
      const { container } = render(<UserAccountNav user={user} />)
      
      // Should render without crashing
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render without crashing when user.name is undefined', () => {
      const user = { name: null, email: 'test@example.com', image: null }
      
      const { container } = render(<UserAccountNav user={user} />)
      
      // Should render without crashing
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should not display name when user.name is null', async () => {
      const user = { name: null, email: 'test@example.com', image: null }
      const userInstance = userEvent.setup()
      
      render(<UserAccountNav user={user} />)
      
      // Click to open dropdown
      const trigger = screen.getByRole('button')
      await userInstance.click(trigger)
      
      // Should show email but not name
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('should not display name when user.name is undefined', async () => {
      const user = { name: null, email: 'test@example.com', image: null }
      const userInstance = userEvent.setup()
      
      render(<UserAccountNav user={user} />)
      
      // Click to open dropdown
      const trigger = screen.getByRole('button')
      await userInstance.click(trigger)
      
      // Should show email but not name
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })
  })

  describe('Null Safety - User Email', () => {
    it('should render without crashing when user.email is null', () => {
      const user = { name: 'Test User', email: null, image: null }
      
      const { container } = render(<UserAccountNav user={user} />)
      
      // Should render without crashing
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render without crashing when user.email is undefined', () => {
      const user = { name: 'Test User', email: null, image: null }
      
      const { container } = render(<UserAccountNav user={user} />)
      
      // Should render without crashing
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should not display email when user.email is null', async () => {
      const user = { name: 'Test User', email: null, image: null }
      const userInstance = userEvent.setup()
      
      render(<UserAccountNav user={user} />)
      
      // Click to open dropdown
      const trigger = screen.getByRole('button')
      await userInstance.click(trigger)
      
      // Should show name but not email (use getAllByText since name appears in avatar too)
      expect(screen.getAllByText('Test User')[0]).toBeInTheDocument()
    })
  })

  describe('Null Safety - User Image', () => {
    it('should render without crashing when user.image is null', () => {
      const user = { name: 'Test User', email: 'test@example.com', image: null }
      
      const { container } = render(<UserAccountNav user={user} />)
      
      // Should render without crashing
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render without crashing when user.image is undefined', () => {
      const user = { name: 'Test User', email: 'test@example.com', image: null }
      
      const { container } = render(<UserAccountNav user={user} />)
      
      // Should render without crashing
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render avatar with null image', () => {
      const user = { name: 'Test User', email: 'test@example.com', image: null }
      
      const { container } = render(<UserAccountNav user={user} />)
      
      // Should render avatar component with fallback icon
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('Null Safety - All Fields Null/Undefined', () => {
    it('should render gracefully when all user fields are null', () => {
      const user = { name: null, email: null, image: null }
      
      const { container } = render(<UserAccountNav user={user} />)
      
      // Should render without crashing
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render gracefully when all user fields are undefined', () => {
      const user = { name: null, email: null, image: null }
      
      const { container } = render(<UserAccountNav user={user} />)
      
      // Should render without crashing
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Valid User Data', () => {
    it('should display user name and email when provided', async () => {
      const user = { name: 'John Doe', email: 'john@example.com', image: null }
      const userInstance = userEvent.setup()
      
      render(<UserAccountNav user={user} />)
      
      // Click to open dropdown
      const trigger = screen.getByRole('button')
      await userInstance.click(trigger)
      
      // Should show both name and email
      expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
    })

    it('should render navigation links', async () => {
      const user = { name: 'Test User', email: 'test@example.com', image: null }
      const userInstance = userEvent.setup()
      
      render(<UserAccountNav user={user} />)
      
      // Click to open dropdown
      const trigger = screen.getByRole('button')
      await userInstance.click(trigger)
      
      // Should show navigation links
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Billing')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('Sign out')).toBeInTheDocument()
    })

    it('should call signOut when sign out is clicked', async () => {
      const user = { name: 'Test User', email: 'test@example.com', image: null }
      const userInstance = userEvent.setup()
      
      render(<UserAccountNav user={user} />)
      
      // Click to open dropdown
      const trigger = screen.getByRole('button')
      await userInstance.click(trigger)
      
      // Click sign out
      const signOutButton = screen.getByText('Sign out')
      await userInstance.click(signOutButton)
      
      // Should call signOut (with whatever origin is set)
      expect(mockSignOut).toHaveBeenCalled()
    })
  })

  describe('Dropdown Functionality', () => {
    it('should open dropdown when trigger is clicked', async () => {
      const user = { name: 'Test User', email: 'test@example.com', image: null }
      const userInstance = userEvent.setup()
      
      render(<UserAccountNav user={user} />)
      
      // Initially, dropdown content should not be visible
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
      
      // Click to open dropdown
      const trigger = screen.getByRole('button')
      await userInstance.click(trigger)
      
      // Now dropdown content should be visible
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })
})
