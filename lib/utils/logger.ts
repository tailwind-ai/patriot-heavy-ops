/**
 * Logger Utility
 * 
 * Environment-aware logging system that can be configured for different environments.
 * Replaces direct console usage to provide better control over logging in production.
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
  enableRemote: boolean
  remoteEndpoint?: string | undefined
}

class Logger {
  private config: LoggerConfig

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
      enableConsole: process.env.NODE_ENV !== 'production',
      enableRemote: process.env.NODE_ENV === 'production',
      remoteEndpoint: process.env.LOGGING_ENDPOINT || undefined,
      ...config,
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level
  }

  private formatMessage(level: string, message: string, context?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` ${JSON.stringify(context)}` : ''
    return `[${timestamp}] ${level}: ${message}${contextStr}`
  }

  private async sendToRemote(level: string, message: string, context?: Record<string, unknown>) {
    if (!this.config.enableRemote || !this.config.remoteEndpoint) {
      return
    }

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level,
          message,
          context,
          timestamp: new Date().toISOString(),
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        }),
      })
    } catch (error) {
      // Fallback to console if remote logging fails
      if (this.config.enableConsole) {
        // eslint-disable-next-line no-console
        console.error('Failed to send log to remote endpoint:', error)
      }
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog(LogLevel.DEBUG)) return

    const formatted = this.formatMessage('DEBUG', message, context)
    
    if (this.config.enableConsole) {
      // eslint-disable-next-line no-console
      console.debug(formatted)
    }
    
    this.sendToRemote('DEBUG', message, context)
  }

  info(message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog(LogLevel.INFO)) return

    const formatted = this.formatMessage('INFO', message, context)
    
    if (this.config.enableConsole) {
      // eslint-disable-next-line no-console
      console.info(formatted)
    }
    
    this.sendToRemote('INFO', message, context)
  }

  warn(message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog(LogLevel.WARN)) return

    const formatted = this.formatMessage('WARN', message, context)
    
    if (this.config.enableConsole) {
      // eslint-disable-next-line no-console
      console.warn(formatted)
    }
    
    this.sendToRemote('WARN', message, context)
  }

  error(message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog(LogLevel.ERROR)) return

    const formatted = this.formatMessage('ERROR', message, context)
    
    if (this.config.enableConsole) {
      // eslint-disable-next-line no-console
      console.error(formatted)
    }
    
    this.sendToRemote('ERROR', message, context)
  }

  /**
   * Development-only warning for guidance messages
   * Only logs in development environment to avoid production noise
   */
  devWarn(message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'production') {
      return
    }
    
    this.warn(`[DEV] ${message}`, context)
  }
}

// Export singleton instance
export const logger = new Logger()

// Export factory for custom configurations
export const createLogger = (config?: Partial<LoggerConfig>) => new Logger(config)
