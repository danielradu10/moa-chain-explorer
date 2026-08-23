import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import { TxStatusBadge } from '@/components/tx/TxStatusBadge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { truncateHash } from '@/lib/utils'

export function TxList() {
  const { data: txs, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: api.getTransactions,
    refetchInterval: 5_000,
  })

  const count = txs?.length ?? 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Transactions</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {isLoading
              ? 'Loading…'
              : `${count} transaction${count !== 1 ? 's' : ''} in this session`}
          </p>
        </div>
        <Button asChild size="sm">
          <Link to="/transactions/submit">Submit</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-100 hover:bg-transparent">
              <TableHead className="w-36 text-[11px] uppercase tracking-widest text-zinc-400">Hash</TableHead>
              <TableHead className="w-40 text-[11px] uppercase tracking-widest text-zinc-400">Sender</TableHead>
              <TableHead className="text-[11px] uppercase tracking-widest text-zinc-400">Prompt</TableHead>
              <TableHead className="w-32 text-[11px] uppercase tracking-widest text-zinc-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i} className="border-zinc-50">
                    <TableCell><Skeleton className="h-3.5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-3.5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-3.5 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-3.5 w-20" /></TableCell>
                  </TableRow>
                ))
              : count === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-sm text-zinc-400">
                      No transactions yet —{' '}
                      <Link
                        to="/transactions/submit"
                        className="text-zinc-600 underline underline-offset-2 hover:text-zinc-900 transition-colors"
                      >
                        submit one
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              : (txs ?? []).map(tx => (
                  <TableRow
                    key={tx.tx_hash}
                    className="border-zinc-50 transition-colors hover:bg-zinc-50/50"
                  >
                    <TableCell>
                      <Link
                        to={`/transactions/${tx.tx_hash}`}
                        className="font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-900"
                      >
                        {truncateHash(tx.tx_hash)}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-zinc-500">
                      {tx.sender ?? '—'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-xs text-zinc-600">
                      {tx.prompt ?? '—'}
                    </TableCell>
                    <TableCell>
                      <TxStatusBadge status={tx.status} />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
