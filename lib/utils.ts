import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

// Format number with decimal places
export function formatNumberWithDecimalPlaces(
  value: number,
  decimalPlaces: number = 2
): string {
  const [int, decimal] = value.toString().split(".")
  return decimal ? `${int}.${decimal.padEnd(decimalPlaces, "0")}` : `${int}.00`
}