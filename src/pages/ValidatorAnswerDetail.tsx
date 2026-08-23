import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import type { AnswerCategory } from '@/api/client'
import { Skeleton } from '@/components/ui/skeleton'

const CATEGORY_STYLE: Record<string, { badge: string; dot: string; label: string }> = {
  CORRECT:       { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-400', label: 'Correct' },
  HALLUCINATION: { badge: 'bg-orange-50 text-orange-700 ring-orange-200',   dot: 'bg-orange-400',  label: 'Hallucination' },
  MALICIOUS:     { badge: 'bg-red-50 text-red-700 ring-red-200',            dot: 'bg-red-400',     label: 'Malicious' },
  WRONG:         { badge: 'bg-amber-50 text-amber-700 ring-amber-200',      dot: 'bg-amber-400',   label: 'Wrong' },
}

function CategoryBadge({ category }: { category: AnswerCategory }) {
  const s = CATEGORY_STYLE[category]
  if (!s) return <span className="font-mono text-[10px] text-zinc-300">—</span>
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ring-1 ring-inset ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

export function ValidatorAnswerDetail() {
  const { hash, validatorId } = useParams<{ hash: string; validatorId: string }>()
  const decodedId = validatorId ? decodeURIComponent(validatorId) : ''

  const { data: tx, isLoading } = useQuery({
    queryKey: ['transaction', hash],
    queryFn: () => api.getTransaction(hash!),
    enabled: !!hash,
  })

  const va = tx?.validator_answers?.find(a => a.validator_id === decodedId)

  if (isLoading || !tx) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-7 w-full max-w-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    )
  }

  if (!va) {
    return (
      <div className="space-y-4">
        <Link to={`/transactions/${hash}`} className="text-sm text-zinc-400 hover:text-zinc-700">
          ← Transaction
        </Link>
        <p className="text-sm text-zinc-400">Validator not found for this transaction.</p>
      </div>
    )
  }

  const verdicts = va.judge_verdicts ?? []
  const total = va.correct_votes + va.hallucination_votes + va.malicious_votes + va.wrong_votes

  const voteCounts = [
    { key: 'CORRECT',       count: va.correct_votes,       dot: 'bg-emerald-400', label: 'Correct' },
    { key: 'HALLUCINATION', count: va.hallucination_votes, dot: 'bg-orange-400',  label: 'Hallucination' },
    { key: 'MALICIOUS',     count: va.malicious_votes,     dot: 'bg-red-400',     label: 'Malicious' },
    { key: 'WRONG',         count: va.wrong_votes,         dot: 'bg-amber-400',   label: 'Wrong' },
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
        <Link to="/transactions" className="hover:text-zinc-700 transition-colors">Transactions</Link>
        <span>/</span>
        <Link to={`/transactions/${hash}`} className="max-w-[180px] truncate hover:text-zinc-700 transition-colors">
          {hash}
        </Link>
        <span>/</span>
        <span className="max-w-[180px] truncate text-zinc-600">{decodedId}</span>
      </div>

      {/* Validator header */}
      <div>
        <h1 className="break-all font-mono text-lg font-semibold text-zinc-900">{decodedId}</h1>
        <div className="mt-1.5 flex items-center gap-2">
          <p className="text-sm text-zinc-400">Validator answer</p>
          <CategoryBadge category={va.category} />
        </div>
      </div>

      {/* Answer card */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-6 py-4">
          <p className="text-sm font-semibold text-zinc-900">Answer</p>
          {va.consumption != null && va.consumption > 0 && (
            <p className="mt-0.5 font-mono text-[10px] text-zinc-400">{va.consumption} tokens consumed</p>
          )}
        </div>
        <div className="px-6 py-5">
          <p className="text-sm leading-relaxed text-zinc-700">{va.answer}</p>
        </div>
      </div>

      {/* Vote summary */}
      {total > 0 && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-6 py-4">
            <p className="text-sm font-semibold text-zinc-900">Vote Summary</p>
            <p className="mt-0.5 font-mono text-[10px] text-zinc-400">{total} judge votes</p>
          </div>

          {/* Segmented bar */}
          <div className="px-6 pt-5">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-100">
              {voteCounts.map(v =>
                v.count > 0 ? (
                  <div
                    key={v.key}
                    className={`h-full transition-all ${v.dot}`}
                    style={{ width: `${(v.count / total) * 100}%` }}
                  />
                ) : null
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-zinc-100 border-t border-zinc-100 mt-4 sm:grid-cols-4">
            {voteCounts.map(v => (
              <div key={v.key} className="bg-white px-6 py-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`h-2 w-2 rounded-full ${v.dot}`} />
                  <span className="text-[11px] text-zinc-400">{v.label}</span>
                </div>
                <span className="font-mono text-2xl font-semibold text-zinc-900">{v.count}</span>
                <span className="ml-1.5 font-mono text-xs text-zinc-400">
                  {total > 0 ? `${Math.round((v.count / total) * 100)}%` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-judge verdicts */}
      {verdicts.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-6 py-4">
            <p className="text-sm font-semibold text-zinc-900">Judge Verdicts</p>
            <p className="mt-0.5 font-mono text-[10px] text-zinc-400">{verdicts.length} judges</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-50 bg-zinc-50/50">
                <th className="px-6 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                  Judge
                </th>
                <th className="px-6 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                  Verdict
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {verdicts.map((v, i) => (
                <tr key={`${v.judge_id}-${i}`} className="hover:bg-zinc-50/40">
                  <td className="px-6 py-3.5 font-mono text-xs text-zinc-600 break-all">
                    {v.judge_id}
                  </td>
                  <td className="px-6 py-3.5">
                    <CategoryBadge category={v.category} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {verdicts.length === 0 && (
        <p className="text-center text-sm text-zinc-300">No judge verdicts available for this answer.</p>
      )}
    </div>
  )
}
