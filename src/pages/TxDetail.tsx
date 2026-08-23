import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import { TxStatusBadge } from '@/components/tx/TxStatusBadge'
import { TxProgress } from '@/components/tx/TxProgress'
import { TxTimeline } from '@/components/tx/TxTimeline'
import { ValidatorAnswers } from '@/components/tx/ValidatorAnswers'
import { ValidatorLabels } from '@/components/tx/ValidatorLabels'
import { useTxEvents } from '@/hooks/useTxEvents'
import { Skeleton } from '@/components/ui/skeleton'

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="px-6 py-3">
      <dt className="mb-1 text-[11px] uppercase tracking-widest text-zinc-400">{label}</dt>
      <dd className={`break-words text-sm text-zinc-700 ${mono ? 'font-mono' : ''}`}>{value}</dd>
    </div>
  )
}

export function TxDetail() {
  const { hash } = useParams<{ hash: string }>()
  const { events, connected } = useTxEvents(hash ?? '')

  const { data: tx, isLoading } = useQuery({
    queryKey: ['transaction', hash],
    queryFn: () => api.getTransaction(hash!),
    enabled: !!hash,
    refetchInterval: 3_000,
  })

  if (isLoading || !tx) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="mb-3 h-3.5 w-24" />
          <Skeleton className="h-7 w-full max-w-xl" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-48 rounded-xl lg:col-span-2" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    )
  }

  const detailRows = [
    { label: 'Sender',       value: tx.sender,       mono: false },
    { label: 'Prompt',       value: tx.prompt,        mono: false },
    { label: 'Labels',       value: tx.labels?.join(', '), mono: false },
    { label: 'Block',        value: tx.block_hash,    mono: true  },
    { label: 'Local Answer', value: tx.local_answer,  mono: false },
  ].filter((r): r is { label: string; value: string; mono: boolean } => !!r.value)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/transactions"
          className="text-sm text-zinc-400 transition-colors hover:text-zinc-700"
        >
          ← Transactions
        </Link>
        <div className="mt-3 flex flex-wrap items-start gap-3">
          <h1 className="min-w-0 flex-1 break-all font-mono text-lg font-semibold text-zinc-900">
            {tx.tx_hash}
          </h1>
          <TxStatusBadge status={tx.status} />
        </div>
        <p className="mt-0.5 text-sm text-zinc-400">Transaction</p>
      </div>

      {/* Status bar */}
      <TxProgress status={tx.status} />

      {/* Timeline + metadata */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TxTimeline events={events} connected={connected} />
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-6 py-4">
            <p className="text-sm font-semibold text-zinc-900">Details</p>
          </div>
          <dl className="divide-y divide-zinc-50">
            {detailRows.length > 0
              ? detailRows.map(r => <Field key={r.label} {...r} />)
              : (
                <div className="px-6 py-8 text-center text-sm text-zinc-300">
                  No details yet
                </div>
              )}
          </dl>
        </div>
      </div>

      {/* MR1 label votes — per-validator domain classification */}
      {tx.label_votes && tx.label_votes.length > 0 && (
        <ValidatorLabels votes={tx.label_votes} canonicalLabels={tx.labels} />
      )}

      {/* Per-validator answers — only when finalized with MR2 data */}
      {tx.validator_answers && tx.validator_answers.length > 0 && (
        <ValidatorAnswers txHash={tx.tx_hash} answers={tx.validator_answers} />
      )}

      {/* Final answer — only when present */}
      {tx.final_answer && (
        <div className="overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
          <div className="flex items-center gap-2 border-b border-emerald-100 px-6 py-4">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <p className="text-sm font-semibold text-emerald-900">Final Answer</p>
            {tx.final_status && (
              <span className="ml-auto font-mono text-[10px] text-emerald-600">
                {tx.final_status}
              </span>
            )}
          </div>
          <div className="px-6 py-5">
            <p className="text-sm leading-relaxed text-zinc-800">{tx.final_answer}</p>
          </div>
        </div>
      )}
    </div>
  )
}
