/**
 * Decimal Utility Functions
 * 
 * Provides safe conversion utilities for Prisma Decimal values to prevent precision loss.
 * Uses decimal.js library (included with Prisma) for accurate financial and duration calculations.
 */

import { Prisma } from "@prisma/client"

/**
 * Safely converts Prisma Decimal to number with proper precision handling
 * For financial data, maintains precision up to 2 decimal places
 * 
 * @param decimal - Prisma Decimal value (can be null/undefined)
 * @returns number with 2 decimal places precision, or null if input is null/undefined
 * 
 * @example
 * const cost = decimalToNumber(request.estimatedCost) // 123.45
 * const revenue = decimalToNumber(stats.totalRevenue) // 1234.56
 */
export function decimalToNumber(decimal: Prisma.Decimal | null | undefined): number | null {
  if (!decimal) return null
  // Use toFixed(2) for financial precision, then parseFloat to convert to number
  return parseFloat(decimal.toFixed(2))
}

/**
 * Safely converts Prisma Decimal to number for duration calculations
 * Maintains higher precision for time calculations (4 decimal places)
 * 
 * @param decimal - Prisma Decimal value (can be null/undefined)
 * @returns number with 4 decimal places precision, or 0 if input is null/undefined
 * 
 * @example
 * const hours = decimalToHours(assignment.actualHours) // 8.2500
 * const duration = decimalToHours(request.requestedTotalHours) // 40.0000
 */
export function decimalToHours(decimal: Prisma.Decimal | null | undefined): number {
  if (!decimal) return 0
  // Use toFixed(4) for duration precision, then parseFloat to convert to number
  return parseFloat(decimal.toFixed(4))
}

/**
 * Safely converts Prisma Decimal to number for rate calculations
 * Maintains precision up to 4 decimal places for accurate rate calculations
 * 
 * @param decimal - Prisma Decimal value (can be null/undefined)
 * @returns number with 4 decimal places precision, or null if input is null/undefined
 * 
 * @example
 * const rate = decimalToRate(operator.hourlyRate) // 75.2500
 * const baseRate = decimalToRate(request.baseRate) // 150.0000
 */
export function decimalToRate(decimal: Prisma.Decimal | null | undefined): number | null {
  if (!decimal) return null
  // Use toFixed(4) for rate precision, then parseFloat to convert to number
  return parseFloat(decimal.toFixed(4))
}

/**
 * Safely converts Prisma Decimal to string for display purposes
 * Maintains full precision for display without conversion loss
 * 
 * @param decimal - Prisma Decimal value (can be null/undefined)
 * @param decimalPlaces - Number of decimal places to display (default: 2)
 * @returns formatted string or null if input is null/undefined
 * 
 * @example
 * const displayCost = decimalToString(request.estimatedCost) // "123.45"
 * const displayRate = decimalToString(rate, 4) // "75.2500"
 */
export function decimalToString(
  decimal: Prisma.Decimal | null | undefined, 
  decimalPlaces: number = 2
): string | null {
  if (!decimal) return null
  return decimal.toFixed(decimalPlaces)
}

/**
 * Creates a new Prisma Decimal from a number or string
 * Useful for creating Decimal values for database operations
 * 
 * @param value - Number or string to convert to Decimal
 * @returns Prisma Decimal instance
 * 
 * @example
 * const cost = numberToDecimal(123.45)
 * const rate = numberToDecimal("75.25")
 */
export function numberToDecimal(value: number | string): Prisma.Decimal {
  return new Prisma.Decimal(value)
}

/**
 * Type guard to check if a value is a Prisma Decimal
 * 
 * @param value - Value to check
 * @returns true if value is a Prisma Decimal
 * 
 * @example
 * if (isDecimal(someValue)) {
 *   const num = decimalToNumber(someValue)
 * }
 */
export function isDecimal(value: unknown): value is Prisma.Decimal {
  return value instanceof Prisma.Decimal
}
