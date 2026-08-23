import { useLiveRoundContext } from '@/contexts/LiveRoundContext'
import { MR_STEPS } from '@/lib/steps'
import { Skeleton } from '@/components/ui/skeleton'

type SegmentStatus = 'complete' | 'active' | 'pending' | 'failed'

interface Segment {
  status: SegmentStatus
  fill: number
  stepIdx: number
  total: number
}

function computeSegments(miniRound: number, step: string): Segment[] {
  const isIdle     = step === 'IDLE'
  const isFinished = step === 'FINISHED'
  const isFailed   = step === 'FAILED'

  // Go uses 0-indexed mini_round (0=MR1, 1=MR2, 2=MR3).
  // Normalise to 1-indexed to match MR_STEPS keys [1, 2, 3].
  const currentMR = miniRound + 1

  return [1, 2, 3].map((mr): Segment => {
    if (isFinished) return { status: 'complete', fill: 100, stepIdx: 0, total: 0 }
    if (isIdle)     return { status: 'pending',  fill: 0,   stepIdx: 0, total: 0 }

    if (currentMR > mr) return { status: 'complete', fill: 100, stepIdx: 0, total: 0 }
    if (currentMR < mr) return { status: 'pending',  fill: 0,   stepIdx: 0, total: 0 }

    const steps = MR_STEPS[mr] ?? []
    const idx   = steps.indexOf(step)
    const fill  = idx >= 0 ? ((idx + 1) / steps.length) * 100 : 0

    return {
      status:  isFailed ? 'failed' : 'active',
      fill,
      stepIdx: Math.max(idx + 1, 0),
      total:   steps.length,
    }
  })
}

const MR_LABEL = ['Mini-Round 1', 'Mini-Round 2', 'Mini-Round 3']

export function StepProgress() {
  const { live } = useLiveRoundContext()

  if (!live) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white px-6 py-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[0, 1, 2].map(i => (
            <div key={i}>
              <Skeleton className="h-1.5 w-full rounded-full" />
              <div className="mt-2 flex justify-between">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-14" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const segments = computeSegments(live.mini_round, live.step)

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-6 py-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-900">Consensus Progress</p>
        <p className="font-mono text-xs text-zinc-400">
          Round <span className="text-zinc-700">{live.round}</span>
          {' · '}
          Epoch <span className="text-zinc-700">{live.epoch}</span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {segments.map((seg, i) => (
          <div key={i}>
            <div className="relative h-1.5 overflow-hidden rounded-full bg-zinc-100">
              <div
                className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out ${
                  seg.status === 'complete' ? 'bg-zinc-800' :
                  seg.status === 'active'   ? 'bg-zinc-900' :
                  seg.status === 'failed'   ? 'bg-red-500' :
                  'bg-transparent'
                }`}
                style={{ width: `${seg.fill}%` }}
              />
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xs font-semibold text-zinc-900">{MR_LABEL[i]}</span>
              <span className={`font-mono text-[10px] tracking-wide ${
                seg.status === 'complete' ? 'text-emerald-600' :
                seg.status === 'active'   ? 'text-blue-600'   :
                seg.status === 'failed'   ? 'text-red-500'    :
                'text-zinc-300'
              }`}>
                {seg.status === 'complete' ? 'DONE'            :
                 seg.status === 'active'   ? `${seg.stepIdx} / ${seg.total}` :
                 seg.status === 'failed'   ? 'FAILED'          :
                 'PENDING'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
