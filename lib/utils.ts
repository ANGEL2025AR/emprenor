import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely serialize a date value from MongoDB to ISO string.
 * Handles Date objects, BSON dates, and string dates.
 */
export function safeDate(value: unknown, fallback: string | null = ""): string | null {
  if (!value) return fallback
  try {
    if (value instanceof Date) return value.toISOString()
    if (typeof value === "string") return new Date(value).toISOString()
    if (typeof value === "object" && value !== null && "$date" in (value as Record<string, unknown>)) {
      return new Date((value as Record<string, string>).$date).toISOString()
    }
    return new Date(String(value)).toISOString()
  } catch {
    return fallback
  }
}

/**
 * Format a currency value safely, avoiding NaN.
 */
export function formatCurrency(value: unknown, currency = "ARS"): string {
  const num = Number(value)
  if (isNaN(num)) return "$0"
  return new Intl.NumberFormat("es-AR", { style: "currency", currency }).format(num)
}

/**
 * Safe percentage calculation avoiding division by zero.
 */
export function safePercent(part: number, total: number, decimals = 1): number {
  if (!total || total === 0) return 0
  return Number(((part / total) * 100).toFixed(decimals))
}
