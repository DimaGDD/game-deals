import { useState, useEffect } from 'react'


const SORT_OPTIONS = [
    { value: 'Deal Rating', label: 'По рейтингу сделки' },
    { value: 'Price', label: 'По цене' },
    { value: 'Metacritic', label: 'По рейтингу Metacritic' },
    { value: 'Release', label: 'По дате выхода' },
    { value: 'Savings', label: 'По размеру скидки' },
    { value: 'Reviews', label: 'По отзывам Steam' },
]


export default function Filters({ onApply, loading }) {
    const [title, setTitle] = useState('')
    const [maxPrice, setMaxPrice] = useState(50)
    const [sortBy, setSortBy] = useState('Deal Rating')
    const [order, setOrder] = useState('asc')

    useEffect(() => {
        const timer = setTimeout(() => {
            onApply({ title, upperPrice: maxPrice, sortBy, order })
        }, 500)

        return () => clearTimeout(timer)
    }, [title, maxPrice, sortBy, order])

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm text-slate-400 mb-1">
                        Название игры
                    </label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Например, Witcher"
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">
                        Максимальная цена: <span className="text-indigo-400 font-medium">${maxPrice}</span>
                    </label>

                    <input
                        type="range"
                        min="0"
                        max="60"
                        step="5"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">
                        Сортировка
                    </label>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">
                        Порядок
                    </label>

                    <div className="flex rounded-lg overflow-hidden border border-slate-600">
                        <button
                            type="button"
                            onClick={() => setOrder('asc')}
                            className={`flex-1 px-3 py-2 text-sm transition-colors cursor-pointer ${
                                order === 'asc' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            ↑ Возрастание
                        </button>

                        <button
                            type="button"
                            onClick={() => setOrder('desc')}
                            className={`flex-1 px-3 py-2 text-sm transition-colors cursor-pointer ${
                                order === 'desc' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            ↓ Убывание
                        </button>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="mt-3 text-sm text-indigo-400">Обновление...</div>
            )}
        </div>
    )
}