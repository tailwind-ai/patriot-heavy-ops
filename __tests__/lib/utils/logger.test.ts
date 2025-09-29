/**
 * Logger Utility Tests
 * 
 * Tests for interface → type conversion and Record<string, unknown> pattern fixes
 * Following TDD approach for Issue #300 Phase 1A
 */

import { logger, createLogger, LogLevel } from "@/lib/utils/logger"

describe("Logger Utility - Interface → Type Conversion Tests", () => {
  describe("LoggerConfig Type Definition", () => {
    it("should fail: LoggerConfig should be a type, not an interface", () => {
      // This test will fail until we convert interface to type
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs")
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path")
      const loggerSource = fs.readFileSync(
        path.join(process.cwd(), "lib/utils/logger.ts"),
        "utf8"
      )
      
      // Should NOT contain interface LoggerConfig
      expect(loggerSource).not.toMatch(/interface\s+LoggerConfig/)
      
      // Should contain type LoggerConfig
      expect(loggerSource).toMatch(/type\s+LoggerConfig\s*=/)
    })

    it("should fail: Record<string, unknown> patterns should be replaced with specific types", () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs")
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path")
      const loggerSource = fs.readFileSync(
        path.join(process.cwd(), "lib/utils/logger.ts"),
        "utf8"
      )
      
      // Should NOT contain Record<string, unknown> patterns
      const recordPatterns = loggerSource.match(/Record<string,\s*unknown>/g) || []
      expect(recordPatterns.length).toBe(0)
    })
  })

  describe("Type Safety Validation", () => {
    it("should maintain backward compatibility for createLogger function", () => {
      // Test that createLogger still accepts partial config
      const customLogger = createLogger({
        level: LogLevel.ERROR,
        enableConsole: false
      })
      
      expect(customLogger).toBeDefined()
      expect(typeof customLogger.info).toBe("function")
      expect(typeof customLogger.error).toBe("function")
    })

    it("should maintain type safety for context parameters", () => {
      // Test that context parameters are properly typed
      const testContext = {
        userId: "123",
        action: "test",
        metadata: { count: 1 }
      }
      
      // These should not throw TypeScript errors
      expect(() => {
        logger.info("Test message", testContext)
        logger.error("Test error", testContext)
        logger.warn("Test warning", testContext)
        logger.debug("Test debug", testContext)
        logger.devWarn("Test dev warning", testContext)
      }).not.toThrow()
    })

    it("should properly type the LoggerConfig after conversion", () => {
      // Test that the type definition works correctly
      const config = {
        level: LogLevel.INFO,
        enableConsole: true,
        enableRemote: false,
        remoteEndpoint: "https://example.com/logs"
      }
      
      const customLogger = createLogger(config)
      expect(customLogger).toBeDefined()
    })
  })

  describe("Functional Behavior (should remain unchanged)", () => {
    beforeEach(() => {
      // Mock console methods to avoid noise in tests
      jest.spyOn(console, 'debug').mockImplementation(() => {})
      jest.spyOn(console, 'info').mockImplementation(() => {})
      jest.spyOn(console, 'warn').mockImplementation(() => {})
      jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it("should log messages at appropriate levels", () => {
      const testLogger = createLogger({ 
        level: LogLevel.INFO, 
        enableConsole: true,
        enableRemote: false 
      })
      
      testLogger.info("Test info message")
      testLogger.error("Test error message")
      
      expect(console.info).toHaveBeenCalled()
      expect(console.error).toHaveBeenCalled()
    })

    it("should handle context objects properly", () => {
      const testLogger = createLogger({ 
        level: LogLevel.DEBUG, 
        enableConsole: true,
        enableRemote: false 
      })
      
      const context = { userId: "123", action: "test" }
      testLogger.debug("Test with context", context)
      
      expect(console.debug).toHaveBeenCalledWith(
        expect.stringContaining("Test with context")
      )
    })

    it("should respect log levels", () => {
      const testLogger = createLogger({ 
        level: LogLevel.ERROR, 
        enableConsole: true,
        enableRemote: false 
      })
      
      testLogger.debug("Should not log")
      testLogger.info("Should not log")
      testLogger.warn("Should not log")
      testLogger.error("Should log")
      
      expect(console.debug).not.toHaveBeenCalled()
      expect(console.info).not.toHaveBeenCalled()
      expect(console.warn).not.toHaveBeenCalled()
      expect(console.error).toHaveBeenCalled()
    })
  })
})
