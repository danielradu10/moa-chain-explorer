import { Routes, Route } from 'react-router-dom'
import { LiveRoundProvider } from '@/contexts/LiveRoundContext'
import { Navbar } from '@/components/layout/Navbar'
import { Dashboard } from '@/pages/Dashboard'

export default function App() {
  return (
    <LiveRoundProvider>
      <div className="min-h-svh">
        <Navbar />
        <main className="mx-auto max-w-7xl px-6 py-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Phase 3 routes added here */}
          </Routes>
        </main>
      </div>
    </LiveRoundProvider>
  )
}
