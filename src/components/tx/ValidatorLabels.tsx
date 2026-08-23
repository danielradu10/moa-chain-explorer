import type { ValidatorLabelVote } from '@/api/client'

const SUBDOMAIN_COLOR: Record<string, string> = {
  systems_programming:           'bg-blue-50 text-blue-700 ring-blue-200',
  web_front_end:                 'bg-violet-50 text-violet-700 ring-violet-200',
  back_end_with_apis:            'bg-indigo-50 text-indigo-700 ring-indigo-200',
  ml_ai_engineering:             'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200',
  data_engineering:              'bg-cyan-50 text-cyan-700 ring-cyan-200',
  dev_ops:                       'bg-orange-50 text-orange-700 ring-orange-200',
  security:                      'bg-red-50 text-red-700 ring-red-200',
  mobile_dev:                    'bg-teal-50 text-teal-700 ring-teal-200',
  test_engineering_and_qa_automation: 'bg-lime-50 text-lime-700 ring-lime-200',
  blockchain_engineering:        'bg-amber-50 text-amber-700 ring-amber-200',
  cloud_engineering:             'bg-sky-50 text-sky-700 ring-sky-200',
  databases:                     'bg-emerald-50 text-emerald-700 ring-emerald-200',
  non_related:                   'bg-zinc-100 text-zinc-500 ring-zinc-200',
}

function LabelPill({ label }: { label: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-medium ring-1 ring-inset ${SUBDOMAIN_COLOR[label] ?? 'bg-zinc-100 text-zinc-500 ring-zinc-200'}`}>
      {label.replace(/_/g, ' ')}
    </span>
  )
}

interface Props {
  votes: ValidatorLabelVote[]
  canonicalLabels?: string[]
}

export function ValidatorLabels({ votes, canonicalLabels }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <p className="text-sm font-semibold text-zinc-900">MR1 Label Votes</p>
          <span className="font-mono text-[10px] text-zinc-400">{votes.length} validators</span>
        </div>
        {canonicalLabels && canonicalLabels.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-zinc-400">canonical</span>
            {canonicalLabels.map(l => <LabelPill key={l} label={l} />)}
          </div>
        )}
      </div>

      <div className="divide-y divide-zinc-50">
        {votes.map((v, i) => (
          <div key={`${v.validator_id}-${i}`} className="flex items-center gap-3 px-6 py-3">
            <span className="w-28 shrink-0 font-mono text-xs text-zinc-500">{v.validator_id}</span>
            <div className="flex flex-wrap gap-1.5">
              {v.labels.map(l => <LabelPill key={l} label={l} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
