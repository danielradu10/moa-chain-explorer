import { useSSE } from './useSSE'
import type { TxEvent } from '@/api/client'

export function useTxEvents(hash: string) {
  return useSSE<TxEvent>(`/api/v1/transactions/${hash}/events`)
}
