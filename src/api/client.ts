// Typed API client for the MoA Chain explorer API.
// All fetch calls go through the Vite proxy (/api → localhost:8080).

export interface HealthResponse {
  status: string
  chain_length: number
  current_round: number
  current_mini_round: number
  current_epoch: number
}

export interface TxSummary {
  tx_hash: string
  sender: string
  prompt: string
  labels?: string[]
}

export interface TxClassificationSummary {
  tx_hash: string
  status: string
  correct_count: number
}

export interface FinalAnswerSummary {
  tx_hash: string
  status: string
  answer?: string
}

export interface MR1Response {
  block_hash: string
  transactions: TxSummary[]
  subdomains_frequency: Record<string, number>
  non_related_tx_hashes?: string[]
}

export interface MR2Response {
  block_hash: string
  answer_classifications: TxClassificationSummary[]
}

export interface MR3Response {
  block_hash: string
  final_answers: FinalAnswerSummary[]
}

export interface RoundSummary {
  round: number
  epoch: number
  status: string
  tx_count: number
  block_hash?: string
}

export interface RoundResponse {
  round: number
  epoch: number
  status: string
  mr1?: MR1Response
  mr2?: MR2Response
  mr3?: MR3Response
}

export interface BlockResponse {
  header_hash: string
  previous_hash: string
  round: number
  epoch: number
  transactions: TxSummary[]
  subdomains_frequency?: Record<string, number>
  non_related_tx_hashes?: string[]
  answer_classifications?: TxClassificationSummary[]
  final_answers?: FinalAnswerSummary[]
}

export type TxStatus = 'SUBMITTED' | 'PREPROCESSING' | 'PENDING' | 'FINALIZED'

export type AnswerCategory = 'CORRECT' | 'HALLUCINATION' | 'MALICIOUS' | 'WRONG' | ''

export interface JudgeVerdict {
  judge_id: string
  category: AnswerCategory
}

export interface ValidatorAnswer {
  validator_id: string
  answer: string
  category: AnswerCategory
  consumption?: number
  correct_votes: number
  hallucination_votes: number
  malicious_votes: number
  wrong_votes: number
  judge_verdicts?: JudgeVerdict[]
}

export interface ValidatorLabelVote {
  validator_id: string
  labels: string[]
}

export interface TransactionResponse {
  tx_hash: string
  status: TxStatus
  round?: number
  sender?: string
  prompt?: string
  labels?: string[]
  local_answer?: string
  block_hash?: string
  final_answer?: string
  final_status?: string
  validator_answers?: ValidatorAnswer[]
  label_votes?: ValidatorLabelVote[]
  synthesis_proposer?: string
  synthesis_approvers?: string[]
}

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

export interface LiveRoundResponse {
  epoch: number
  round: number
  mini_round: number
  step: string
}

export interface TxEvent {
  tx_hash: string
  status: TxStatus
}

const BASE = '/api/v1'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(BASE + path)
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`)
  return res.json() as Promise<T>
}

export const api = {
  health: () => get<HealthResponse>('/health'),

  getBlock: (hash: string) => get<BlockResponse>(`/blocks/${hash}`),

  getRounds: () => get<RoundSummary[]>('/rounds'),
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
    return res.json() as Promise<SubmitTransactionResponse>
  },
}
