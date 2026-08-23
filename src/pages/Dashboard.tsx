import { HealthStrip } from '@/components/dashboard/HealthStrip'
import { StepProgress } from '@/components/dashboard/StepProgress'
import { StepLog } from '@/components/dashboard/StepLog'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">Live view of the MoA Chain local simulator.</p>
      </div>

      <HealthStrip />
      <StepProgress />
      <StepLog />
      <RecentTransactions />
    </div>
  )
}
