import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import SearchPage from './pages/SearchPage'
import AnalyticsPage from './pages/AnalyticsPage'

export default function App() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        <Navbar />

        <main className="flex-1">
            <Routes>
                <Route path="/" element={<SearchPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
        </main>

        <footer className="border-t border-slate-800 py-4 text-center text-sm text-slate-500">
            Данные:{' '}
            <a
                href="https://www.cheapshark.com/"
                target="_blank"
                rel="nooper noreferrer"
                className="text-indigo-400 hover:underline"
            >
                CheapShark API
            </a>
            
            {' . '}Сделано на React + Vite + Tailwind
        </footer>
    </div>
  )
}