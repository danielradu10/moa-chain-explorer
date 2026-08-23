import { Routes, Route } from 'react-router-dom'
import { LiveRoundProvider } from '@/contexts/LiveRoundContext'
import { Navbar } from '@/components/layout/Navbar'
import { Dashboard } from '@/pages/Dashboard'
import { TxList } from '@/pages/TxList'
import { TxSubmit } from '@/pages/TxSubmit'
import { TxDetail } from '@/pages/TxDetail'
import { ValidatorAnswerDetail } from '@/pages/ValidatorAnswerDetail'
import { RoundList } from '@/pages/RoundList'
import { RoundDetail } from '@/pages/RoundDetail'

export default function App() {
  return (
    <LiveRoundProvider>
      <div className="min-h-svh">
        <Navbar />
        <main className="mx-auto max-w-7xl px-6 py-10">
          <Routes>
            <Route path="/"                                                element={<Dashboard />}             />
            <Route path="/transactions"                                    element={<TxList />}                />
            <Route path="/transactions/submit"                             element={<TxSubmit />}              />
            <Route path="/transactions/:hash"                              element={<TxDetail />}              />
            <Route path="/transactions/:hash/validators/:validatorId"      element={<ValidatorAnswerDetail />} />
            <Route path="/rounds"                                          element={<RoundList />}             />
            <Route path="/rounds/:round"                                   element={<RoundDetail />}           />
          </Routes>
        </main>
      </div>
    </LiveRoundProvider>
  )
}
