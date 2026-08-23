interface Props {
  proposer: string
  approvers: string[]
}

export function SynthesisVotes({ proposer, approvers }: Props) {
  const total = approvers.length

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <p className="text-sm font-semibold text-zinc-900">MR3 Synthesis Votes</p>
          <span className="font-mono text-[10px] text-zinc-400">{total} approved</span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          quorum reached
        </span>
      </div>

      <div className="divide-y divide-zinc-50">
        {/* Proposer row */}
        <div className="flex items-center gap-3 px-6 py-3">
          <span className="w-28 shrink-0 font-mono text-xs text-zinc-500">{proposer}</span>
          <span className="inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ring-1 ring-inset bg-violet-50 text-violet-700 ring-violet-200">
            SYNTHESIZER
          </span>
        </div>

        {/* Approver rows */}
        {approvers.map((id, i) => (
          <div key={`${id}-${i}`} className="flex items-center gap-3 px-6 py-3">
            <span className="w-28 shrink-0 font-mono text-xs text-zinc-500">{id}</span>
            <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ring-1 ring-inset bg-emerald-50 text-emerald-700 ring-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              APPROVED
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
