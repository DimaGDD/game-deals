import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
    const { pathname } = useLocation()

    const linkClass = (path) =>
        `px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
            pathname === path
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 hover:bg-slate-700'
        }`
    
    return (
        <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
            <div className="max-w-6xl mx-auto flex items-center justify-between p-3">
                <h1 className="text-lg md:text-xl font-bold text-indigo-400">
                    🎮 Game Deals
                </h1>

                <div className="flex gap-2">
                    <Link to="/" className={linkClass('/')}>Поиск</Link>
                    <Link to="/analytics" className={linkClass('/analytics')}>Аналитика</Link>
                </div>
            </div>
        </nav>
    )
}