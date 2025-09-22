import { User } from "@prisma/client"
import type { Icon } from "lucide-react"
import type { ReactNode } from "react"

import { Icons } from "@/components/icons"

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavLink[]
    }
)

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export type DocsConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type MarketingConfig = {
  mainNav: MainNavItem[]
}

export type DashboardConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type SubscriptionPlan = {
  name: string
  description: string
  stripePriceId: string
}

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
    stripeCurrentPeriodEnd: number
    isPro: boolean
  }

// =============================================================================
// COMPONENT PROP TYPES
// =============================================================================

/**
 * Base component props with children
 */
export interface BaseComponentProps {
  children?: ReactNode
  className?: string
}

/**
 * Component props with optional children
 */
export interface ComponentProps extends BaseComponentProps {
  id?: string
  'data-testid'?: string
}

/**
 * Form component props
 */
export interface FormComponentProps extends ComponentProps {
  disabled?: boolean
  loading?: boolean
  error?: string | null
}

/**
 * Modal/Dialog component props
 */
export interface ModalProps extends ComponentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
}

/**
 * Button component props
 */
export interface ButtonProps extends ComponentProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

/**
 * Input component props
 */
export interface InputProps extends ComponentProps {
  type?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  disabled?: boolean
  required?: boolean
  error?: string | null
}

/**
 * Select component props
 */
export interface SelectProps extends ComponentProps {
  value?: string
  defaultValue?: string
  placeholder?: string
  onChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  error?: string | null
  options: Array<{
    value: string
    label: string
    disabled?: boolean
  }>
}

// =============================================================================
// LAYOUT TYPES
// =============================================================================

/**
 * Layout component props
 */
export interface LayoutProps extends BaseComponentProps {
  title?: string
  description?: string
}

/**
 * Page props with metadata
 */
export interface PageProps {
  params?: Record<string, string>
  searchParams?: Record<string, string | string[] | undefined>
}

/**
 * Dashboard layout props
 */
export interface DashboardLayoutProps extends LayoutProps {
  user: User
  subscriptionPlan?: UserSubscriptionPlan
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Make specified properties required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Make specified properties optional
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Extract keys of type T that are of type U
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

/**
 * Non-empty array type
 */
export type NonEmptyArray<T> = [T, ...T[]]

/**
 * Branded type for better type safety
 */
export type Brand<T, B> = T & { __brand: B }

/**
 * ID types for better type safety
 */
export type UserId = Brand<string, 'UserId'>
export type PostId = Brand<string, 'PostId'>
export type ServiceRequestId = Brand<string, 'ServiceRequestId'>

// =============================================================================
// ERROR TYPES
// =============================================================================

/**
 * Application error with context
 */
export interface AppError extends Error {
  code?: string
  statusCode?: number
  context?: Record<string, unknown>
}

/**
 * Validation error
 */
export interface ValidationError extends AppError {
  field?: string
  value?: unknown
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  error: string
  message?: string
  statusCode: number
  timestamp: string
  path?: string
}
