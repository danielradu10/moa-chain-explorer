import type { TxEventEntry } from '@/hooks/useTxEvents'
import type { TxStatus } from '@/api/client'

const DOT_COLOR: Record<TxStatus, string> = {
  SUBMITTED:     'bg-zinc-400',
  PREPROCESSING: 'bg-amber-400',
  PENDING:       'bg-blue-400',
  FINALIZED:     'bg-emerald-500',
}

const LABEL_COLOR: Record<TxStatus, string> = {
  SUBMITTED:     'text-zinc-600',
  PREPROCESSING: 'text-amber-700',
  PENDING:       'text-blue-700',
  FINALIZED:     'text-emerald-700',
}

const STATUS_DISPLAY: Record<TxStatus, string> = {
  SUBMITTED:     'Submitted',
  PREPROCESSING: 'Preprocessing',
  PENDING:       'Pending',
  FINALIZED:     'Finalized',
}

function formatTime(d: Date): string {
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  const ms = String(d.getMilliseconds()).padStart(3, '0')
  return `${h}:${m}:${s}.${ms}`
}

function formatElapsed(ms: number): string {
  if (ms < 1000) return `+${ms}ms`
  if (ms < 60_000) return `+${(ms / 1000).toFixed(2)}s`
  return `+${Math.floor(ms / 60_000)}m${Math.floor((ms % 60_000) / 1000)}s`
}

interface Props {
  events: TxEventEntry[]
  connected: boolean
}

export function TxTimeline({ events, connected }: Props) {
  const isLive = connected && (events.length === 0 || events[events.length - 1].status !== 'FINALIZED')

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        <p className="text-sm font-semibold text-zinc-900">Lifecycle</p>
        {isLive && (
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
            </span>
            Live
          </span>
        )}
      </div>

      <div className="px-6 py-5">
        {events.length === 0 ? (
          <div className="flex items-center gap-2.5 py-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-zinc-300" />
            </span>
            <span className="text-sm text-zinc-400">Waiting for events…</span>
          </div>
        ) : (
          events.map((entry, i) => {
            const isLast = i === events.length - 1
            const prevEntry = events[i - 1]
            const elapsed = prevEntry
              ? formatElapsed(entry.timestamp.getTime() - prevEntry.timestamp.getTime())
              : null
            const showPulse = isLast && isLive

            return (
              <div key={entry.status} className="flex gap-4">
                {/* Dot + connector line */}
                <div className="flex shrink-0 flex-col items-center">
                  {showPulse ? (
                    <span className="relative mt-0.5 flex h-3 w-3">
                      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${DOT_COLOR[entry.status]} opacity-75`} />
                      <span className={`relative inline-flex h-3 w-3 rounded-full ${DOT_COLOR[entry.status]}`} />
                    </span>
                  ) : (
                    <span className={`mt-0.5 h-3 w-3 shrink-0 rounded-full ${DOT_COLOR[entry.status]}`} />
                  )}
                  {!isLast && <div className="my-1 w-px flex-1 bg-zinc-100" />}
                </div>

                {/* Content */}
                <div className={isLast ? 'pb-1' : 'pb-5'}>
                  <div className="flex items-baseline gap-3">
                    <span className={`text-sm font-medium ${LABEL_COLOR[entry.status]}`}>
                      {STATUS_DISPLAY[entry.status]}
                    </span>
                    {elapsed && (
                      <span className="font-mono text-[10px] tabular-nums text-zinc-300">
                        {elapsed}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] tabular-nums text-zinc-300">
                    {formatTime(entry.timestamp)}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
