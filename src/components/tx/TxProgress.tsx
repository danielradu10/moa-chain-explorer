import type { TxStatus } from '@/api/client'

const TX_STATUSES: TxStatus[] = ['SUBMITTED', 'PREPROCESSING', 'PENDING', 'FINALIZED']

const STATUS_DISPLAY: Record<TxStatus, string> = {
  SUBMITTED:     'Submitted',
  PREPROCESSING: 'Preprocessing',
  PENDING:       'Pending',
  FINALIZED:     'Finalized',
}

const ACTIVE_BAR: Record<TxStatus, string> = {
  SUBMITTED:     'bg-zinc-800',
  PREPROCESSING: 'bg-amber-400',
  PENDING:       'bg-blue-500',
  FINALIZED:     'bg-emerald-500',
}

const ACTIVE_LABEL: Record<TxStatus, string> = {
  SUBMITTED:     'text-zinc-600',
  PREPROCESSING: 'text-amber-600',
  PENDING:       'text-blue-600',
  FINALIZED:     'text-emerald-600',
}

export function TxProgress({ status }: { status: TxStatus }) {
  const currentIdx = TX_STATUSES.indexOf(status)

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-6 py-5 shadow-sm">
      <p className="mb-5 text-sm font-semibold text-zinc-900">Status</p>
      <div className="grid grid-cols-4 gap-4">
        {TX_STATUSES.map((s, i) => {
          const isComplete = i < currentIdx
          const isActive   = i === currentIdx

          return (
            <div key={s}>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className={`absolute left-0 top-0 h-full w-full rounded-full transition-all duration-700 ease-out ${
                    isComplete ? 'bg-zinc-800' :
                    isActive   ? ACTIVE_BAR[s] :
                    'bg-transparent'
                  }`}
                />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xs font-semibold text-zinc-900">{STATUS_DISPLAY[s]}</span>
                <span className={`font-mono text-[10px] tracking-wide ${
                  isComplete ? 'text-emerald-600' :
                  isActive   ? ACTIVE_LABEL[s]   :
                  'text-zinc-300'
                }`}>
                  {isComplete ? 'DONE' : isActive ? '●' : '—'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
