import { Link, NavLink } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { useLiveRound } from '@/hooks/useLiveRound'

const MINI_ROUND_LABEL: Record<number, string> = { 1: 'MR1', 2: 'MR2', 3: 'MR3' }

export function Navbar() {
  const { data: live, connected } = useLiveRound()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-14 items-center gap-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L11 4V8L6 11L1 8V4L6 1Z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight text-zinc-900">
              MoA Chain
            </span>
          </Link>

          <Separator orientation="vertical" className="h-5" />

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {[
              { to: '/', label: 'Dashboard' },
              { to: '/transactions', label: 'Transactions' },
              { to: '/transactions/submit', label: 'Submit' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-zinc-100 font-medium text-zinc-900'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Live round ticker — right-aligned */}
          <div className="ml-auto flex items-center gap-2.5">
            {live ? (
              <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1">
                <span className="relative flex h-1.5 w-1.5">
                  {connected && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                </span>
                <span className="font-mono text-xs text-zinc-600">
                  Round {live.round}
                  {live.mini_round > 0 && (
                    <> · <span className="text-zinc-900 font-medium">{MINI_ROUND_LABEL[live.mini_round] ?? `MR${live.mini_round}`}</span></>
                  )}
                  {' · '}
                  <span className="text-zinc-500">{live.step}</span>
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-zinc-300" />
                </span>
                <span className="font-mono text-xs text-zinc-400">Connecting…</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
