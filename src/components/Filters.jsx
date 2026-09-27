import { useState } from 'react'


const SORT_OPTIONS = [
    { value: 'Price', label: 'По цене' },
    { value: 'Metacritic', label: 'По Metacritic' },
    { value: 'Reviews', label: 'По отзывам Steam' },
]


export default function Filters({ onApply, loading, stores = {} }) {
    const [title, setTitle] = useState('')
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(200)
    const [sortBy, setSortBy] = useState('Price')
    const [order, setOrder] = useState('asc')
    const [onSale, setOnSale] = useState(true)
    const [storeID, setStoreID] = useState('')

    const applyFilters = () => {
        onApply({
            title,
            lowerPrice: minPrice,
            upperPrice: maxPrice,
            sortBy,
            order,
            onSale: onSale ? 1 : 0,
            storeID,
        })
    }

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                        Цена от
                    </label>

                    <input
                        type="number"
                        min="0"
                        max={maxPrice}
                        step="1"
                        value={minPrice}
                        onChange={(e) => {
                            const raw = e.target.value
                            const value = raw === '' ? 0 : Number(raw)
                            setMinPrice(value)
                            if (value > maxPrice) setMaxPrice(value)
                        }}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">
                        Цена до
                    </label>

                    <input
                        type="number"
                        min={minPrice}
                        max="1000"
                        step="1"
                        value={maxPrice}
                        onChange={(e) => {
                            const raw = e.target.value
                            const value = raw === '' ? 200 : Number(raw)
                            setMaxPrice(value)
                            if (value < minPrice) setMinPrice(value)
                        }}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">
                        Магазин
                    </label>

                    <select
                        value={storeID}
                        onChange={(e) => setStoreID(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
                    >
                        <option value="">Все магазины</option>
                        {Object.entries(stores).map(([id, name]) => (
                            <option key={id} value={id}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">
                        Сортировка
                    </label>

                    <select
                        value={sortBy}
                        onChange={(e) => {
                            const value = e.target.value
                            setSortBy(value)
                        }}
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

                <label className="mt-4 flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={onSale}
                        onChange={(e) => setOnSale(e.target.checked)}
                        className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                    Только игры со скидкой
                </label>
            </div>

            <button
                type="button"
                onClick={applyFilters}
                disabled={loading}
                className="mt-4 w-full md:w-auto px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
                Применить фильтры
            </button>

            {loading && (
                <div className="mt-3 text-sm text-indigo-400">Обновление...</div>
            )}
        </div>
    )
}