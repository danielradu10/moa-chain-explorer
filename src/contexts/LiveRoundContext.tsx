import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'
import { useSSE } from '@/hooks/useSSE'
import type { LiveRoundResponse } from '@/api/client'

export interface StepEntry {
  step: string
  miniRound: number
  round: number
  epoch: number
  timestamp: Date
}

interface LiveRoundContextValue {
  live: LiveRoundResponse | null
  connected: boolean
  history: StepEntry[]
}

const LiveRoundContext = createContext<LiveRoundContextValue>({
  live: null,
  connected: false,
  history: [],
})

export function LiveRoundProvider({ children }: { children: ReactNode }) {
  const { data: live, connected } = useSSE<LiveRoundResponse>('/api/v1/round/stream')
  const [history, setHistory] = useState<StepEntry[]>([])
  const prevRef = useRef<{ step: string; round: number } | null>(null)

  useEffect(() => {
    if (!live) return

    const prev = prevRef.current
    const isNewStep = !prev || prev.step !== live.step || prev.round !== live.round
    if (!isNewStep) return

    const isNewRound = prev !== null && prev.round !== live.round
    const entry: StepEntry = {
      step: live.step,
      miniRound: live.mini_round,
      round: live.round,
      epoch: live.epoch,
      timestamp: new Date(),
    }

    // Newest entry at index 0; clear history on round change
    setHistory(h => isNewRound ? [entry] : [entry, ...h])
    prevRef.current = { step: live.step, round: live.round }
  }, [live])

  return (
    <LiveRoundContext.Provider value={{ live, connected, history }}>
      {children}
    </LiveRoundContext.Provider>
  )
}

export function useLiveRoundContext() {
  return useContext(LiveRoundContext)
}
