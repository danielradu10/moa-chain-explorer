import { useState, useEffect, useRef } from 'react'
import { useSSE } from './useSSE'
import type { TxEvent, TxStatus } from '@/api/client'

export interface TxEventEntry {
  status: TxStatus
  timestamp: Date
}

export function useTxEvents(hash: string) {
  const { data: event, connected } = useSSE<TxEvent>(
    `/api/v1/transactions/${hash}/events`,
  )
  const [events, setEvents] = useState<TxEventEntry[]>([])
  const prevRef = useRef<string | null>(null)

  useEffect(() => {
    if (!event) return
    if (event.status === prevRef.current) return
    prevRef.current = event.status
    setEvents(h => [...h, { status: event.status, timestamp: new Date() }])
  }, [event])

  return { events, connected }
}
