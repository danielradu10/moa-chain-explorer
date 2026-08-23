import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import { Skeleton } from '@/components/ui/skeleton'

interface StatCardProps {
  label: string
  value: number | undefined
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-6 py-5 shadow-sm">
      <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">{label}</p>
      <div className="mt-2">
        {value !== undefined ? (
          <p className="text-3xl font-semibold tracking-tight text-zinc-900">{value.toLocaleString()}</p>
        ) : (
          <Skeleton className="h-9 w-20 mt-0.5" />
        )}
      </div>
    </div>
  )
}

export function HealthStrip() {
  const { data } = useQuery({
    queryKey: ['health'],
    queryFn: api.health,
    refetchInterval: 5_000,
  })

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard label="Chain Length"   value={data?.chain_length} />
      <StatCard label="Current Round"  value={data?.current_round} />
      <StatCard label="Current Epoch"  value={data?.current_epoch} />
    </div>
  )
}
