/**
 * Platform-Agnostic Notification System
 *
 * Provides a unified interface for notifications that works across platforms.
 * Supports Next.js (with toast), React Native, and testing environments.
 */

import { logger } from "./logger"

export type NotificationOptions = {
  title?: string
  description: string
  variant?: "default" | "destructive" | "success" | "warning"
  duration?: number
}

export type NotificationCallbacks = {
  showNotification: (options: NotificationOptions) => void
  showSuccess: (message: string, title?: string) => void
  showError: (message: string, title?: string) => void
  showWarning: (message: string, title?: string) => void
}

/**
 * Default no-op notification callbacks for testing or when notifications aren't needed
 * Includes a flag to identify no-op implementations
 */
export const createNoOpNotifications = (): NotificationCallbacks & {
  isNoOp: boolean
} => ({
  showNotification: () => {},
  showSuccess: () => {},
  showError: () => {},
  showWarning: () => {},
  isNoOp: true,
})

/**
 * Create notification callbacks for Next.js using the toast system
 * This should be called from components, not from hooks directly
 */
export const createToastNotifications = (
  toast: (options: {
    title?: string
    description: string
    variant?: "default" | "destructive"
    duration?: number
  }) => void
): NotificationCallbacks => ({
  showNotification: (options) => {
    // Map notification variants to toast variants
    const mapVariant = (variant?: string): "default" | "destructive" => {
      switch (variant) {
        case "success":
        case "warning":
        case "default":
          return "default"
        case "destructive":
          return "destructive"
        default:
          return "default"
      }
    }

    toast({
      ...(options.title && { title: options.title }),
      description: options.description,
      variant: mapVariant(options.variant),
      ...(options.duration && { duration: options.duration }),
    })
  },

  showSuccess: (message, title = "Success") => {
    toast({
      title,
      description: message,
      variant: "default",
    })
  },

  showError: (message, title = "Error") => {
    toast({
      title,
      description: message,
      variant: "destructive",
    })
  },

  showWarning: (message, title = "Warning") => {
    toast({
      title,
      description: message,
      variant: "default",
    })
  },
})

/**
 * Create notification callbacks for React Native
 * Example implementation - would use React Native's Alert or a toast library
 */
export const createReactNativeNotifications = (): NotificationCallbacks => ({
  showNotification: (options) => {
    // Example: Alert.alert(options.title || 'Notification', options.description)
    logger.info(
      `[${options.variant?.toUpperCase() || "INFO"}] ${options.title || ""}: ${
        options.description
      }`
    )
  },

  showSuccess: (message, title = "Success") => {
    // Example: Alert.alert(title, message)
    logger.info(`[SUCCESS] ${title}: ${message}`)
  },

  showError: (message, title = "Error") => {
    // Example: Alert.alert(title, message)
    logger.info(`[ERROR] ${title}: ${message}`)
  },

  showWarning: (message, title = "Warning") => {
    // Example: Alert.alert(title, message)
    logger.info(`[WARNING] ${title}: ${message}`)
  },
})

/**
 * Type guard to check if notifications are provided
 */
export const hasNotifications = (
  notifications?: NotificationCallbacks
): notifications is NotificationCallbacks => {
  return notifications !== undefined
}

/**
 * Check if notifications are meaningful (not no-op implementation)
 * Useful to avoid showing feedback when using fallback notifications
 */
export const hasRealNotifications = (
  notifications?: NotificationCallbacks
): boolean => {
  if (!notifications) return false
  return !("isNoOp" in notifications && notifications.isNoOp === true)
}
