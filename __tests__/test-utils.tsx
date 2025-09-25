import React, { ReactElement } from "react"
import { render, RenderOptions } from "@testing-library/react"
import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

/* eslint-disable @typescript-eslint/no-explicit-any */

// Type-safe mock interfaces
interface MockResponse {
  ok: boolean
  status?: number
  json: () => Promise<any>
}

interface MockRequest {
  json: () => Promise<any>
  method: string
}

type MockFetch = jest.MockedFunction<typeof fetch>

// Mock session data for testing
export const mockSession: Session = {
  user: {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    image: null,
    role: "USER",
  },
  expires: "2024-12-31",
}

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  session?: Session | null
}

const AllTheProviders = ({
  children,
  session = null,
}: {
  children: React.ReactNode
  session?: Session | null
}) => {
  return <SessionProvider session={session}>{children}</SessionProvider>
}

const customRender = (
  ui: ReactElement,
  { session, ...options }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders session={session ?? null}>{children}</AllTheProviders>
  )

  return render(ui, { wrapper: Wrapper, ...options })
}

// Re-export everything
export * from "@testing-library/react"
export { customRender as render }

// Test helpers
export const createMockRequest = (
  body: any = {},
  method: string = "POST"
): MockRequest => {
  return {
    json: jest.fn().mockResolvedValue(body),
    method,
  }
}

export const createMockResponse = () => {
  const json = jest.fn()
  const status = jest.fn(() => ({ json }))

  return {
    json,
    status,
    ok: true,
  }
}

// Mock user with different roles for testing
export const createMockUser = (
  role: "USER" | "OPERATOR" | "MANAGER" | "ADMIN" = "USER"
) => ({
  id: "test-user-id",
  name: "Test User",
  email: "test@example.com",
  role,
  image: null,
})

// Mock session with specific role
export const createMockSession = (
  role: "USER" | "OPERATOR" | "MANAGER" | "ADMIN" = "USER"
): Session => ({
  user: createMockUser(role),
  expires: "2024-12-31",
})

// Mock fetch for successful responses
export const mockFetchSuccess = (data: any = {}) => {
  const mockFetch = global.fetch as MockFetch
  const mockResponse: MockResponse = {
    ok: true,
    json: () => Promise.resolve(data),
  }
  mockFetch.mockResolvedValueOnce(mockResponse as Response)
}

// Mock fetch for error responses
export const mockFetchError = (
  message: string = "Error",
  status: number = 400
) => {
  const mockFetch = global.fetch as MockFetch
  const mockResponse: MockResponse = {
    ok: false,
    status,
    json: () => Promise.resolve({ message }),
  }
  mockFetch.mockResolvedValueOnce(mockResponse as Response)
}

// Mock geocoding API responses for address autocomplete testing
export const mockGeocodingResponse = (
  suggestions: Array<{
    display_name: string
    lat: string
    lon: string
    place_id: string
  }> = []
) => {
  mockFetchSuccess(suggestions)
}

// Helper to wait for async operations in tests
export const waitForAsync = () =>
  new Promise((resolve) => setTimeout(resolve, 0))
