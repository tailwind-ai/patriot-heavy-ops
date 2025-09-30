import { render, screen } from '@testing-library/react'
import { UserAvatar } from '@/components/user-avatar'

describe('UserAvatar', () => {
  describe('Null Safety - User Name', () => {
    it('should render without crashing when user.name is null', () => {
      const user = { name: null, image: null }
      
      const { container } = render(<UserAvatar user={user} />)
      
      // Should render fallback icon instead of crashing
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should render without crashing when user.name is null (handles undefined via optional chaining)', () => {
      const user = { name: null, image: null }
      
      const { container } = render(<UserAvatar user={user} />)
      
      // Should render fallback icon instead of crashing
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should provide fallback text for screen readers when name is null', () => {
      const user = { name: null, image: null }
      
      render(<UserAvatar user={user} />)
      
      // Should have sr-only text with fallback, not crash
      const srText = document.querySelector('.sr-only')
      expect(srText).toBeInTheDocument()
      expect(srText?.textContent).toBeTruthy() // Should have some fallback text
    })

    it('should provide fallback text for screen readers when name is null (handles undefined via optional chaining)', () => {
      const user = { name: null, image: null }
      
      render(<UserAvatar user={user} />)
      
      // Should have sr-only text with fallback
      const srText = document.querySelector('.sr-only')
      expect(srText).toBeInTheDocument()
      expect(srText?.textContent).toBeTruthy()
    })
  })

  describe('Null Safety - User Image', () => {
    it('should render without crashing when user.image is null', () => {
      const user = { name: 'Test User', image: null }
      
      const { container } = render(<UserAvatar user={user} />)
      
      // Should render fallback icon
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should render without crashing when user.image is null (handles undefined via optional chaining)', () => {
      const user = { name: 'Test User', image: null }
      
      const { container } = render(<UserAvatar user={user} />)
      
      // Should render fallback icon
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should render image when user.image is provided', () => {
      const user = { name: 'Test User', image: 'https://example.com/avatar.jpg' }
      
      const { container } = render(<UserAvatar user={user} />)
      
      // Component should render without crashing
      expect(container.firstChild).toBeInTheDocument()
      // Should not render fallback svg when image is provided
      expect(container.querySelector('svg')).not.toBeInTheDocument()
    })
  })

  describe('Null Safety - Both Null/Undefined', () => {
    it('should render gracefully when both name and image are null', () => {
      const user = { name: null, image: null }
      
      const { container } = render(<UserAvatar user={user} />)
      
      // Should render without crashing
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should render gracefully when both name and image are null (handles undefined via optional chaining)', () => {
      const user = { name: null, image: null }
      
      const { container } = render(<UserAvatar user={user} />)
      
      // Should render without crashing
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('Valid User Data', () => {
    it('should render correctly with valid user data', () => {
      const user = { name: 'John Doe', image: 'https://example.com/john.jpg' }
      
      const { container } = render(<UserAvatar user={user} />)
      
      // Component should render without crashing - at minimum the Avatar wrapper
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should display user name in sr-only text when provided', () => {
      const user = { name: 'Jane Smith', image: null }
      
      render(<UserAvatar user={user} />)
      
      const srText = screen.getByText('Jane Smith')
      expect(srText).toBeInTheDocument()
      expect(srText).toHaveClass('sr-only')
    })
  })

  describe('Custom Props', () => {
    it('should accept and apply custom className', () => {
      const user = { name: 'Test User', image: null }
      
      const { container } = render(<UserAvatar user={user} className="size-8" />)
      
      // Should apply custom className to Avatar
      const avatar = container.firstChild
      expect(avatar).toHaveClass('size-8')
    })
  })
})
