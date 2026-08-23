import { useSSE } from './useSSE'
import type { LiveRoundResponse } from '@/api/client'

export function useLiveRound() {
  return useSSE<LiveRoundResponse>('/api/v1/round/stream')
}
