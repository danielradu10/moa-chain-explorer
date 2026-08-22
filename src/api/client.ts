// Typed API client for the MoA Chain explorer API.
// All fetch calls go through the Vite proxy (/api → localhost:8080).

export interface SubmitTransactionRequest {
  sender: string
  prompt: string
  nonce: number
  tip: number
}

export interface SubmitTransactionResponse {
  tx_hash: string
  timestamp: number
}

export interface TransactionResponse {
  tx_hash: string
  sender: string
  prompt: string
  status: string
  labels?: string[]
  final_answer?: string
  final_status?: string
  block_hash?: string
}

export interface BlockResponse {
  header_hash: string
  previous_hash: string
  round: number
  epoch: number
  transactions: TransactionResponse[]
}

export interface RoundResponse {
  round: number
  epoch: number
  status: string
  mr1?: unknown
  mr2?: unknown
  mr3?: unknown
}

export interface LiveRoundResponse {
  epoch: number
  round: number
  mini_round: number
  step: string
}

export interface StepEvent {
  epoch: number
  round: number
  mini_round: number
  step: string
}

export interface TxEvent {
  tx_hash: string
  status: string
}

const BASE = '/api/v1'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(BASE + path)
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`)
  return res.json()
}

export const api = {
  health: () => get<{ status: string }>('/health'),

  getBlock: (hash: string) => get<BlockResponse>(`/blocks/${hash}`),

  getRound: (round: number) => get<RoundResponse>(`/rounds/${round}`),

  getLiveRound: () => get<LiveRoundResponse>('/round/current'),

  getTransactions: () => get<TransactionResponse[]>('/transactions'),

  getTransaction: (hash: string) => get<TransactionResponse>(`/transactions/${hash}`),

  submitTransaction: async (req: SubmitTransactionRequest): Promise<SubmitTransactionResponse> => {
    const res = await fetch(`${BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    })
    if (!res.ok) throw new Error(`POST /transactions → ${res.status}`)
    return res.json()
  },

  // streamRound opens an SSE connection for live round step events.
  // Returns an unsubscribe function that closes the connection.
  streamRound: (onEvent: (e: StepEvent) => void): (() => void) => {
    const es = new EventSource(`${BASE}/round/stream`)
    es.onmessage = (e) => {
      try { onEvent(JSON.parse(e.data)) } catch { /* ignore malformed */ }
    }
    return () => es.close()
  },

  // streamTx opens an SSE connection for a single tx's lifecycle events.
  // The server closes the stream when the tx reaches FINALIZED.
  // Returns an unsubscribe function.
  streamTx: (hash: string, onEvent: (e: TxEvent) => void): (() => void) => {
    const es = new EventSource(`${BASE}/transactions/${hash}/events`)
    es.onmessage = (e) => {
      try { onEvent(JSON.parse(e.data)) } catch { /* ignore malformed */ }
    }
    return () => es.close()
  },
}
