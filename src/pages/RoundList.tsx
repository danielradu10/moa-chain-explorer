import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import type { RoundSummary } from '@/api/client'
import { Skeleton } from '@/components/ui/skeleton'

const STATUS_STYLE: Record<string, string> = {
  FINALIZED:   'bg-emerald-50 text-emerald-700 ring-emerald-200',
  MR3_COMPLETE:'bg-emerald-50 text-emerald-700 ring-emerald-200',
  MR2_COMPLETE:'bg-blue-50 text-blue-700 ring-blue-200',
  MR1_COMPLETE:'bg-zinc-100 text-zinc-600 ring-zinc-200',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ring-1 ring-inset ${STATUS_STYLE[status] ?? 'bg-zinc-100 text-zinc-400 ring-zinc-200'}`}>
      {status}
    </span>
  )
}

function RoundRow({ r }: { r: RoundSummary }) {
  return (
    <tr className="group hover:bg-zinc-50/60 transition-colors">
      <td className="px-6 py-3.5">
        <Link
          to={`/rounds/${r.round}`}
          className="font-mono text-sm font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors"
        >
          #{r.round}
        </Link>
      </td>
      <td className="px-6 py-3.5 font-mono text-xs text-zinc-400 tabular-nums">{r.epoch}</td>
      <td className="px-6 py-3.5"><StatusBadge status={r.status} /></td>
      <td className="px-6 py-3.5 font-mono text-xs tabular-nums text-zinc-600">{r.tx_count}</td>
      <td className="px-6 py-3.5">
        {r.block_hash ? (
          <span className="font-mono text-[11px] text-zinc-400">
            {r.block_hash.slice(0, 10)}…{r.block_hash.slice(-6)}
          </span>
        ) : (
          <span className="font-mono text-[11px] text-zinc-300">—</span>
        )}
      </td>
      <td className="px-6 py-3.5 text-right">
        <Link
          to={`/rounds/${r.round}`}
          className="font-mono text-[10px] text-zinc-300 group-hover:text-zinc-500 transition-colors"
        >
          →
        </Link>
      </td>
    </tr>
  )
}

export function RoundList() {
  const { data: rounds, isLoading } = useQuery({
    queryKey: ['rounds'],
    queryFn: api.getRounds,
    refetchInterval: 3_000,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Rounds</h1>
        <p className="mt-0.5 text-sm text-zinc-400">
          {rounds ? `${rounds.length} rounds` : 'Loading…'}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="space-y-px p-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : !rounds || rounds.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-zinc-300">No rounds yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                {['Round', 'Epoch', 'Status', 'Transactions', 'Block hash', ''].map(h => (
                  <th key={h} className="px-6 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {rounds.map(r => <RoundRow key={r.round} r={r} />)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
