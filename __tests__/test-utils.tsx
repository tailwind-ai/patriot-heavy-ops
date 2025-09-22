import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'

// Mock session data for testing
export const mockSession: Session = {
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    image: null,
    role: 'USER',
  },
  expires: '2024-12-31',
}

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: Session | null
}

const AllTheProviders = ({ 
  children, 
  session = null 
}: { 
  children: React.ReactNode
  session?: Session | null 
}) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}

const customRender = (
  ui: ReactElement,
  { session, ...options }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders session={session}>{children}</AllTheProviders>
  )
  
  return render(ui, { wrapper: Wrapper, ...options })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Test helpers
export const createMockRequest = (body: any = {}, method: string = 'POST') => {
  return {
    json: jest.fn().mockResolvedValue(body),
    method,
  } as any
}

export const createMockResponse = () => {
  const json = jest.fn()
  const status = jest.fn(() => ({ json }))
  
  return {
    json,
    status,
    ok: true,
  } as any
}
