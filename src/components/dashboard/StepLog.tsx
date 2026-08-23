import { useLiveRoundContext, type StepEntry } from '@/contexts/LiveRoundContext'
import { STEP_LABEL } from '@/lib/steps'

const MR_PILL: Record<number, string> = {
  0: 'bg-zinc-100 text-zinc-500',
  1: 'bg-blue-50 text-blue-600',
  2: 'bg-violet-50 text-violet-600',
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

function elapsedSincePrev(entry: StepEntry, prev: StepEntry | undefined): string | null {
  if (!prev) return null
  return formatElapsed(entry.timestamp.getTime() - prev.timestamp.getTime())
}

export function StepLog() {
  const { history, live } = useLiveRoundContext()

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
        <p className="text-sm font-semibold text-zinc-900">Step Log</p>
        {live ? (
          <span className="font-mono text-xs text-zinc-400">
            Round <span className="text-zinc-700 font-medium">{live.round}</span>
            {' · '}
            Epoch <span className="text-zinc-700 font-medium">{live.epoch}</span>
          </span>
        ) : (
          <span className="font-mono text-xs text-zinc-300">—</span>
        )}
      </div>

      <div className="max-h-64 overflow-y-auto">
        {history.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-sm text-zinc-300">Waiting for round to start…</p>
          </div>
        ) : (
          <div>
            {history.map((entry, i) => {
              // history[0] is newest; history[i+1] is the chronologically previous step
              const prevEntry = history[i + 1]
              const elapsed = elapsedSincePrev(entry, prevEntry)
              const isNewest = i === 0
              // Show a heavier divider at mini-round boundaries
              const isMRBoundary =
                i < history.length - 1 && entry.miniRound !== history[i + 1].miniRound

              return (
                <div
                  key={`${entry.round}-${entry.miniRound}-${entry.step}`}
                  className={[
                    'flex items-center gap-3 px-6 py-2.5 hover:bg-zinc-50/60 transition-colors',
                    isNewest ? 'bg-zinc-50/40' : '',
                    isMRBoundary ? 'border-b-2 border-zinc-100' : 'border-b border-zinc-50',
                  ].join(' ')}
                >
                  {/* Timestamp */}
                  <span className="w-24 shrink-0 font-mono text-[10px] tabular-nums text-zinc-300">
                    {formatTime(entry.timestamp)}
                  </span>

                  {/* MR pill */}
                  <span
                    className={`inline-flex shrink-0 items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${MR_PILL[entry.miniRound] ?? MR_PILL[0]}`}
                  >
                    MR{entry.miniRound + 1}
                  </span>

                  {/* Step label */}
                  <span
                    className={`min-w-0 flex-1 truncate text-xs ${
                      isNewest ? 'font-medium text-zinc-800' : 'text-zinc-500'
                    }`}
                  >
                    {STEP_LABEL[entry.step] ?? entry.step}
                  </span>

                  {/* Elapsed + live dot for newest; elapsed only for others */}
                  {isNewest ? (
                    <span className="ml-auto flex shrink-0 items-center gap-1.5">
                      {elapsed && (
                        <span className="font-mono text-[10px] tabular-nums text-zinc-300">
                          {elapsed}
                        </span>
                      )}
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                      </span>
                    </span>
                  ) : elapsed ? (
                    <span className="ml-auto font-mono text-[10px] tabular-nums text-zinc-200">
                      {elapsed}
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
