import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateHash(hash: string, chars = 8): string {
  if (hash.length <= chars * 2 + 2) return hash
  return `${hash.slice(0, chars)}…${hash.slice(-chars)}`
}

export function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleTimeString()
}
