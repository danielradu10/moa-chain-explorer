import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import type { TxSummary, TxClassificationSummary, FinalAnswerSummary } from '@/api/client'
import { Skeleton } from '@/components/ui/skeleton'

const SUBDOMAIN_COLOR: Record<string, string> = {
  systems_programming:                'bg-blue-400',
  web_front_end:                      'bg-violet-400',
  back_end_with_apis:                 'bg-indigo-400',
  ml_ai_engineering:                  'bg-fuchsia-400',
  data_engineering:                   'bg-cyan-400',
  dev_ops:                            'bg-orange-400',
  security:                           'bg-red-400',
  mobile_dev:                         'bg-teal-400',
  test_engineering_and_qa_automation: 'bg-lime-400',
  blockchain_engineering:             'bg-amber-400',
  cloud_engineering:                  'bg-sky-400',
  databases:                          'bg-emerald-400',
  non_related:                        'bg-zinc-300',
}

function HashCell({ hash }: { hash: string }) {
  return (
    <span className="font-mono text-[11px] text-zinc-400">
      {hash.slice(0, 10)}…{hash.slice(-6)}
    </span>
  )
}

function TxLink({ hash }: { hash: string }) {
  return (
    <Link
      to={`/transactions/${hash}`}
      className="font-mono text-[11px] text-zinc-500 transition-colors hover:text-zinc-900"
    >
      {hash.slice(0, 10)}…{hash.slice(-6)}
    </Link>
  )
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status === 'SYNTHESIZED'                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' :
    status === 'SKIPPED'                          ? 'bg-zinc-100 text-zinc-400 ring-zinc-200' :
    status === 'READY_FOR_MINI_ROUND_THREE'       ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' :
    status === 'INSUFFICIENT_CORRECT_ANSWERS'     ? 'bg-amber-50 text-amber-700 ring-amber-200' :
    'bg-zinc-100 text-zinc-400 ring-zinc-200'

  const label =
    status === 'READY_FOR_MINI_ROUND_THREE'   ? 'READY' :
    status === 'INSUFFICIENT_CORRECT_ANSWERS' ? 'INSUFFICIENT' :
    status

  return (
    <span className={`inline-flex shrink-0 items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ring-1 ring-inset ${style}`}>
      {label}
    </span>
  )
}

function SectionHeader({ mr, label, blockHash }: { mr: string; label: string; blockHash: string }) {
  const mrStyle =
    mr === 'MR1' ? 'bg-zinc-800 text-white' :
    mr === 'MR2' ? 'bg-blue-600 text-white' :
    'bg-violet-600 text-white'

  return (
    <div className="flex items-center gap-3 border-b border-zinc-100 px-6 py-4">
      <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${mrStyle}`}>{mr}</span>
      <p className="text-sm font-semibold text-zinc-900">{label}</p>
      <div className="ml-auto flex items-center gap-1.5">
        <span className="font-mono text-[10px] text-zinc-400">block</span>
        <HashCell hash={blockHash} />
      </div>
    </div>
  )
}

function SubdomainFrequency({ freq }: { freq: Record<string, number> }) {
  const total = Object.values(freq).reduce((s, v) => s + v, 0)
  if (total === 0) return null

  const entries = Object.entries(freq).sort((a, b) => b[1] - a[1])

  return (
    <div className="border-b border-zinc-50 px-6 py-4">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Subdomain frequency</p>
      <div className="space-y-2">
        {entries.map(([label, count]) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-48 shrink-0 font-mono text-[10px] text-zinc-500">{label.replace(/_/g, ' ')}</span>
            <div className="flex-1 overflow-hidden rounded-full bg-zinc-100" style={{ height: 6 }}>
              <div
                className={`h-full rounded-full ${SUBDOMAIN_COLOR[label] ?? 'bg-zinc-400'}`}
                style={{ width: `${(count / total) * 100}%` }}
              />
            </div>
            <span className="w-6 text-right font-mono text-[10px] tabular-nums text-zinc-400">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MR1Table({ txs }: { txs: TxSummary[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-zinc-50 bg-zinc-50/50">
          {['Hash', 'Sender', 'Prompt', 'Labels'].map(h => (
            <th key={h} className="px-6 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-zinc-400">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-50">
        {txs.map(tx => (
          <tr key={tx.tx_hash} className="hover:bg-zinc-50/40">
            <td className="px-6 py-3"><TxLink hash={tx.tx_hash} /></td>
            <td className="px-6 py-3 font-mono text-xs text-zinc-500">{tx.sender}</td>
            <td className="px-6 py-3 max-w-xs">
              <p className="truncate text-xs text-zinc-600">{tx.prompt}</p>
            </td>
            <td className="px-6 py-3">
              <div className="flex flex-wrap gap-1">
                {tx.labels?.map(l => (
                  <span key={l} className="font-mono text-[10px] text-zinc-400">{l.replace(/_/g, ' ')}</span>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function MR2Table({ classifications }: { classifications: TxClassificationSummary[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-zinc-50 bg-zinc-50/50">
          {['Hash', 'Status', 'Correct answers'].map(h => (
            <th key={h} className="px-6 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-zinc-400">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-50">
        {classifications.map(c => (
          <tr key={c.tx_hash} className="hover:bg-zinc-50/40">
            <td className="px-6 py-3"><TxLink hash={c.tx_hash} /></td>
            <td className="px-6 py-3"><StatusBadge status={c.status} /></td>
            <td className="px-6 py-3 font-mono text-xs tabular-nums text-zinc-600">{c.correct_count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function MR3Table({ finalAnswers }: { finalAnswers: FinalAnswerSummary[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-zinc-50 bg-zinc-50/50">
          {['Hash', 'Status', 'Answer'].map(h => (
            <th key={h} className="px-6 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-zinc-400">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-50">
        {finalAnswers.map(fa => (
          <tr key={fa.tx_hash} className="hover:bg-zinc-50/40">
            <td className="px-6 py-3"><TxLink hash={fa.tx_hash} /></td>
            <td className="px-6 py-3"><StatusBadge status={fa.status} /></td>
            <td className="px-6 py-3 max-w-sm">
              <p className="truncate text-xs text-zinc-600">{fa.answer ?? '—'}</p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function RoundDetail() {
  const { round } = useParams<{ round: string }>()
  const roundNum = Number(round)

  const { data, isLoading } = useQuery({
    queryKey: ['round', roundNum],
    queryFn: () => api.getRound(roundNum),
    enabled: !isNaN(roundNum),
    refetchInterval: 3_000,
  })

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  const statusStyle =
    data.status === 'MR3_COMPLETE' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' :
    data.status === 'MR2_COMPLETE' ? 'bg-blue-50 text-blue-700 ring-blue-200' :
    data.status === 'MR1_COMPLETE' ? 'bg-zinc-100 text-zinc-600 ring-zinc-200' :
    'bg-zinc-100 text-zinc-400 ring-zinc-200'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/rounds" className="text-sm text-zinc-400 transition-colors hover:text-zinc-700">
          ← Rounds
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <h1 className="font-mono text-2xl font-semibold text-zinc-900">Round {data.round}</h1>
          <span className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-semibold ring-1 ring-inset ${statusStyle}`}>
            {data.status}
          </span>
        </div>
        <p className="mt-0.5 font-mono text-sm text-zinc-400">Epoch {data.epoch}</p>
      </div>

      {/* MR1 */}
      {data.mr1 && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <SectionHeader mr="MR1" label="Domain Classification" blockHash={data.mr1.block_hash} />
          <SubdomainFrequency freq={data.mr1.subdomains_frequency} />
          {data.mr1.non_related_tx_hashes && data.mr1.non_related_tx_hashes.length > 0 && (
            <div className="border-b border-zinc-50 px-6 py-3">
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Non-related</p>
              <div className="flex flex-wrap gap-2">
                {data.mr1.non_related_tx_hashes.map(h => <TxLink key={h} hash={h} />)}
              </div>
            </div>
          )}
          {data.mr1.transactions.length > 0
            ? <MR1Table txs={data.mr1.transactions} />
            : <p className="px-6 py-8 text-center text-sm text-zinc-300">No transactions this round</p>
          }
        </div>
      )}

      {/* MR2 */}
      {data.mr2 && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <SectionHeader mr="MR2" label="Answer Judging" blockHash={data.mr2.block_hash} />
          {data.mr2.answer_classifications.length > 0
            ? <MR2Table classifications={data.mr2.answer_classifications} />
            : <p className="px-6 py-8 text-center text-sm text-zinc-300">No classifications</p>
          }
        </div>
      )}

      {/* MR3 */}
      {data.mr3 && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <SectionHeader mr="MR3" label="Synthesis" blockHash={data.mr3.block_hash} />
          {data.mr3.final_answers.length > 0
            ? <MR3Table finalAnswers={data.mr3.final_answers} />
            : <p className="px-6 py-8 text-center text-sm text-zinc-300">No final answers</p>
          }
        </div>
      )}
    </div>
  )
}
