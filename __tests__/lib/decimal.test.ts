/**
 * Tests for Decimal utility functions
 * Ensures proper precision handling and conversion accuracy
 */

import { Prisma } from "@prisma/client"
import {
  decimalToNumber,
  decimalToHours,
  decimalToRate,
  decimalToString,
  numberToDecimal,
  isDecimal,
} from "../../lib/utils/decimal"

describe("Decimal Utilities", () => {
  describe("decimalToNumber", () => {
    it("should convert Decimal to number with 2 decimal places", () => {
      const decimal = new Prisma.Decimal("123.456789")
      const result = decimalToNumber(decimal)
      expect(result).toBe(123.46)
    })

    it("should handle null input", () => {
      expect(decimalToNumber(null)).toBeNull()
    })

    it("should handle undefined input", () => {
      expect(decimalToNumber(undefined)).toBeNull()
    })

    it("should handle zero", () => {
      const decimal = new Prisma.Decimal("0")
      expect(decimalToNumber(decimal)).toBe(0)
    })

    it("should handle negative numbers", () => {
      const decimal = new Prisma.Decimal("-123.456")
      expect(decimalToNumber(decimal)).toBe(-123.46)
    })

    it("should maintain financial precision", () => {
      const decimal = new Prisma.Decimal("1234.995")
      expect(decimalToNumber(decimal)).toBe(1235.0)
    })
  })

  describe("decimalToHours", () => {
    it("should convert Decimal to number with 4 decimal places", () => {
      const decimal = new Prisma.Decimal("8.123456789")
      const result = decimalToHours(decimal)
      expect(result).toBe(8.1235)
    })

    it("should return 0 for null input", () => {
      expect(decimalToHours(null)).toBe(0)
    })

    it("should return 0 for undefined input", () => {
      expect(decimalToHours(undefined)).toBe(0)
    })

    it("should handle fractional hours", () => {
      const decimal = new Prisma.Decimal("40.2500")
      expect(decimalToHours(decimal)).toBe(40.25)
    })

    it("should handle very precise durations", () => {
      const decimal = new Prisma.Decimal("1.999999")
      expect(decimalToHours(decimal)).toBe(2.0)
    })
  })

  describe("decimalToRate", () => {
    it("should convert Decimal to number with 4 decimal places", () => {
      const decimal = new Prisma.Decimal("75.123456789")
      const result = decimalToRate(decimal)
      expect(result).toBe(75.1235)
    })

    it("should handle null input", () => {
      expect(decimalToRate(null)).toBeNull()
    })

    it("should handle undefined input", () => {
      expect(decimalToRate(undefined)).toBeNull()
    })

    it("should handle high precision rates", () => {
      const decimal = new Prisma.Decimal("150.9999")
      expect(decimalToRate(decimal)).toBe(150.9999)
    })
  })

  describe("decimalToString", () => {
    it("should convert Decimal to string with default 2 decimal places", () => {
      const decimal = new Prisma.Decimal("123.456789")
      const result = decimalToString(decimal)
      expect(result).toBe("123.46")
    })

    it("should convert Decimal to string with custom decimal places", () => {
      const decimal = new Prisma.Decimal("123.456789")
      const result = decimalToString(decimal, 4)
      expect(result).toBe("123.4568")
    })

    it("should handle null input", () => {
      expect(decimalToString(null)).toBeNull()
    })

    it("should handle undefined input", () => {
      expect(decimalToString(undefined)).toBeNull()
    })

    it("should handle zero decimal places", () => {
      const decimal = new Prisma.Decimal("123.456")
      expect(decimalToString(decimal, 0)).toBe("123")
    })
  })

  describe("numberToDecimal", () => {
    it("should convert number to Decimal", () => {
      const result = numberToDecimal(123.45)
      expect(result).toBeInstanceOf(Prisma.Decimal)
      expect(result.toString()).toBe("123.45")
    })

    it("should convert string to Decimal", () => {
      const result = numberToDecimal("123.45")
      expect(result).toBeInstanceOf(Prisma.Decimal)
      expect(result.toString()).toBe("123.45")
    })

    it("should handle negative numbers", () => {
      const result = numberToDecimal(-123.45)
      expect(result.toString()).toBe("-123.45")
    })

    it("should handle zero", () => {
      const result = numberToDecimal(0)
      expect(result.toString()).toBe("0")
    })
  })

  describe("isDecimal", () => {
    it("should return true for Decimal instances", () => {
      const decimal = new Prisma.Decimal("123.45")
      expect(isDecimal(decimal)).toBe(true)
    })

    it("should return false for numbers", () => {
      expect(isDecimal(123.45)).toBe(false)
    })

    it("should return false for strings", () => {
      expect(isDecimal("123.45")).toBe(false)
    })

    it("should return false for null", () => {
      expect(isDecimal(null)).toBe(false)
    })

    it("should return false for undefined", () => {
      expect(isDecimal(undefined)).toBe(false)
    })

    it("should return false for objects", () => {
      expect(isDecimal({})).toBe(false)
    })
  })

  describe("Precision Loss Prevention", () => {
    it("should prevent precision loss in financial calculations", () => {
      // Test case that would lose precision with Number() conversion
      const decimal = new Prisma.Decimal("999999999999999.99")
      const result = decimalToNumber(decimal)
      expect(result).toBe(999999999999999.99)
    })

    it("should maintain accuracy for duration calculations", () => {
      // Test precise duration that could lose precision
      const decimal = new Prisma.Decimal("123.123456789")
      const result = decimalToHours(decimal)
      expect(result).toBe(123.1235)
    })

    it("should handle edge cases without precision loss", () => {
      // Test numbers that are problematic for floating point
      const decimal = new Prisma.Decimal("0.1")
      const result = decimalToNumber(decimal)
      expect(result).toBe(0.1)
    })
  })

  describe("Integration with Dashboard Service Types", () => {
    it("should work with estimatedCost conversion", () => {
      const estimatedCost = new Prisma.Decimal("1234.56")
      const result = decimalToNumber(estimatedCost)
      expect(result).toBe(1234.56)
      expect(typeof result).toBe("number")
    })

    it("should work with requestedTotalHours conversion", () => {
      const totalHours = new Prisma.Decimal("40.2500")
      const result = decimalToHours(totalHours)
      expect(result).toBe(40.25)
      expect(typeof result).toBe("number")
    })

    it("should work with rate conversions", () => {
      const rate = new Prisma.Decimal("75.2500")
      const result = decimalToRate(rate)
      expect(result).toBe(75.25)
      expect(typeof result).toBe("number")
    })
  })
})
