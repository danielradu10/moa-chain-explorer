import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function TxSubmit() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ sender: '', prompt: '', nonce: 1, tip: 0 })
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.sender.trim() || !form.prompt.trim()) {
      setError('Sender and Prompt are required.')
      return
    }
    setIsPending(true)
    setError(null)
    try {
      const res = await api.submitTransaction({
        sender: form.sender.trim(),
        prompt: form.prompt.trim(),
        nonce: form.nonce,
        tip: form.tip,
      })
      navigate(`/transactions/${res.tx_hash}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit transaction.')
      setIsPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link
          to="/transactions"
          className="text-sm text-zinc-400 transition-colors hover:text-zinc-700"
        >
          ← Transactions
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
          Submit Transaction
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Submit a new inference prompt to the MoA Chain.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="space-y-1.5">
            <Label htmlFor="sender">Sender</Label>
            <Input
              id="sender"
              placeholder="alice"
              value={form.sender}
              onChange={e => setForm(f => ({ ...f, sender: e.target.value }))}
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Explain the difference between optimistic and pessimistic locking in relational databases and when you would choose each."
              value={form.prompt}
              onChange={e => setForm(f => ({ ...f, prompt: e.target.value }))}
              disabled={isPending}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nonce">Nonce</Label>
              <Input
                id="nonce"
                type="number"
                min={0}
                value={form.nonce}
                onChange={e => setForm(f => ({ ...f, nonce: Number(e.target.value) }))}
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tip">Tip</Label>
              <Input
                id="tip"
                type="number"
                min={0}
                value={form.tip}
                onChange={e => setForm(f => ({ ...f, tip: Number(e.target.value) }))}
                disabled={isPending}
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <Link
              to="/transactions"
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-700"
            >
              Cancel
            </Link>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Submitting…' : 'Submit Transaction'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
