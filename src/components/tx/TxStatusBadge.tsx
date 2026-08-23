import { Badge } from '@/components/ui/badge'
import type { TxStatus } from '@/api/client'

const STYLES: Record<TxStatus, string> = {
  SUBMITTED:     'bg-zinc-100 text-zinc-500 border-zinc-200',
  PREPROCESSING: 'bg-amber-50 text-amber-700 border-amber-200',
  PENDING:       'bg-blue-50 text-blue-700 border-blue-200',
  FINALIZED:     'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export function TxStatusBadge({ status }: { status: TxStatus }) {
  return (
    <Badge
      variant="outline"
      className={`font-mono text-[10px] tracking-wide px-1.5 py-0 ${STYLES[status] ?? 'bg-zinc-100 text-zinc-500'}`}
    >
      {status}
    </Badge>
  )
}
