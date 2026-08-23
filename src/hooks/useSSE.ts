import { useEffect, useRef, useState } from 'react'

export type SSEState<T> = {
  data: T | null
  error: string | null
  connected: boolean
}

export function useSSE<T>(url: string): SSEState<T> {
  const [state, setState] = useState<SSEState<T>>({ data: null, error: null, connected: false })
  const urlRef = useRef(url)
  urlRef.current = url

  useEffect(() => {
    const es = new EventSource(urlRef.current)

    es.onopen = () => setState(s => ({ ...s, connected: true, error: null }))

    es.onmessage = (e: MessageEvent) => {
      try {
        setState(s => ({ ...s, data: JSON.parse(e.data) as T, connected: true }))
      } catch {
        setState(s => ({ ...s, error: 'parse error' }))
      }
    }

    es.onerror = () => {
      setState(s => ({ ...s, connected: false, error: 'connection lost' }))
      es.close()
    }

    return () => {
      es.close()
      setState({ data: null, error: null, connected: false })
    }
  }, [url])

  return state
}
