import { useNavigate } from 'react-router-dom'
import type { ValidatorAnswer } from '@/api/client'

const CATEGORY_BADGE: Record<string, string> = {
  CORRECT:       'bg-emerald-50 text-emerald-700 ring-emerald-200',
  HALLUCINATION: 'bg-orange-50 text-orange-700 ring-orange-200',
  MALICIOUS:     'bg-red-50 text-red-700 ring-red-200',
  WRONG:         'bg-amber-50 text-amber-700 ring-amber-200',
}

const VOTE_COLOR: Record<string, string> = {
  correct:       'bg-emerald-400',
  hallucination: 'bg-orange-400',
  malicious:     'bg-red-400',
  wrong:         'bg-amber-400',
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ring-1 ring-inset ${CATEGORY_BADGE[category] ?? 'bg-zinc-100 text-zinc-400 ring-zinc-200'}`}>
      {category || '—'}
    </span>
  )
}

function VoteBar({ va }: { va: ValidatorAnswer }) {
  const total = va.correct_votes + va.hallucination_votes + va.malicious_votes + va.wrong_votes
  if (total === 0) return null

  const bars = [
    { key: 'correct',       count: va.correct_votes },
    { key: 'hallucination', count: va.hallucination_votes },
    { key: 'malicious',     count: va.malicious_votes },
    { key: 'wrong',         count: va.wrong_votes },
  ]

  return (
    <div className="flex items-center gap-2">
      {/* Segmented bar */}
      <div className="flex h-1 w-16 overflow-hidden rounded-full bg-zinc-100">
        {bars.map(b =>
          b.count > 0 ? (
            <div
              key={b.key}
              className={`h-full ${VOTE_COLOR[b.key]}`}
              style={{ width: `${(b.count / total) * 100}%` }}
            />
          ) : null
        )}
      </div>
      {/* Count dots */}
      <div className="flex items-center gap-1.5">
        {bars.filter(b => b.count > 0).map(b => (
          <span key={b.key} className="flex items-center gap-0.5 font-mono text-[10px] text-zinc-400">
            <span className={`h-1.5 w-1.5 rounded-full ${VOTE_COLOR[b.key]}`} />
            {b.count}
          </span>
        ))}
      </div>
    </div>
  )
}

interface Props {
  txHash: string
  answers: ValidatorAnswer[]
}

export function ValidatorAnswers({ txHash, answers }: Props) {
  const navigate = useNavigate()
  const correctCount = answers.filter(a => a.category === 'CORRECT').length

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <p className="text-sm font-semibold text-zinc-900">Validator Answers</p>
          <span className="font-mono text-[10px] text-zinc-400">{answers.length} validators</span>
        </div>
        {correctCount > 0 && (
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {correctCount} / {answers.length} correct
          </span>
        )}
      </div>

      <div className="divide-y divide-zinc-50">
        {answers.map((va, i) => (
          <button
            key={`${va.validator_id}-${i}`}
            onClick={() => navigate(`/transactions/${txHash}/validators/${encodeURIComponent(va.validator_id)}`)}
            className="w-full px-6 py-4 text-left transition-colors hover:bg-zinc-50/60 group"
          >
            <div className="mb-2 flex items-center gap-2.5">
              <span className="font-mono text-xs font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">
                {va.validator_id}
              </span>
              <CategoryBadge category={va.category} />
              <VoteBar va={va} />
              {va.consumption != null && va.consumption > 0 && (
                <span className="ml-auto font-mono text-[10px] tabular-nums text-zinc-300">
                  {va.consumption} tok
                </span>
              )}
              <span className="ml-auto font-mono text-[10px] text-zinc-300 group-hover:text-zinc-500 transition-colors">
                →
              </span>
            </div>
            <p className="line-clamp-2 text-sm leading-relaxed text-zinc-600">{va.answer}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
