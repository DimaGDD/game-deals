import { useState, useRef } from 'react'


const SORT_OPTIONS = [
    { value: 'Price', label: 'По цене' },
    { value: 'Metacritic', label: 'По Metacritic' },
    { value: 'Reviews', label: 'По отзывам Steam' },
]

const DEFAULT_MIN = 0
const DEFAULT_MAX = 0


export default function Filters({ onApply, loading, stores = {} }) {
    const [title, setTitle] = useState('')
    const [sortBy, setSortBy] = useState('Price')
    const [order, setOrder] = useState('asc')
    const [onSale, setOnSale] = useState(true)
    const [storeID, setStoreID] = useState('')

    const [minPrice, setMinPrice] = useState(DEFAULT_MIN)
    const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX)

    const [minDraft, setMinDraft] = useState(String(DEFAULT_MIN))
    const [maxDraft, setMaxDraft] = useState(String(DEFAULT_MAX))

    const minRef = useRef(DEFAULT_MIN)
    const maxRef = useRef(DEFAULT_MAX)

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

    const handlePriceFocus = (kind) => {
        if (kind === 'min') {
            minRef.current = minPrice
            setMinDraft('')
        } else {
            maxRef.current = maxPrice
            setMaxDraft('')
        }
    }

    const handlePriceChange = (kind, raw) => {
        if (kind === 'min') setMinDraft(raw)
        else setMaxDraft(raw)
    }

    const handlePriceBlur = (kind) => {
        const draft = kind === 'min' ? minDraft : maxDraft
        const fallback = kind === 'min' ? minRef.current : maxRef.current
        const parsed = Number(draft)
        const valid = draft.trim() !== '' && Number.isFinite(parsed)

        if (!valid) {
            if (kind === 'min') setMinDraft(String(fallback))
            else setMaxDraft(String(fallback))
            return
        }

        if (kind === 'min') {
            const nextMin = parsed
            const nextMax = nextMin >= maxPrice ? nextMin + 1 : maxPrice

            setMinPrice(nextMin)
            setMinDraft(String(nextMin))

            setMaxPrice(nextMax)
            setMaxDraft(String(nextMax))
        } else {
            const nextMax = parsed
            const nextMin = nextMax <= maxPrice ? Math.max(0, nextMax - 1) : minPrice

            setMaxPrice(nextMax)
            setMaxDraft(String(nextMax))

            setMinPrice(nextMin)
            setMinDraft(String(nextMin))
        }
    }

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Название */}
                <div>
                    <label className="block text-sm text-slate-400 mb-1">
                        Название игры
                    </label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Например, Witcher"
                        className="w-full h-10 bg-slate-900 border border-slate-600 rounded-lg px-3 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                </div>

                {/* Цена от */}
                <div>
                    <label className="block text-sm text-slate-400 mb-1">
                        Цена от
                    </label>

                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={minDraft}
                        onFocus={() => handlePriceFocus('min')}
                        onChange={(e) => handlePriceChange('min', e.target.value)}
                        onBlur={() => handlePriceBlur('min')}
                        className="w-full h-10 bg-slate-900 border border-slate-600 rounded-lg px-3 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                </div>

                {/* Цена до */}
                <div>
                    <label className="block text-sm text-slate-400 mb-1">
                        Цена до
                    </label>

                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={maxDraft}
                        onFocus={() => handlePriceFocus('max')}
                        onChange={(e) => handlePriceChange('max', e.target.value)}
                        onBlur={() => handlePriceBlur('max')}
                        className="w-full h-10 bg-slate-900 border border-slate-600 rounded-lg px-3 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                </div>

                {/* Магазин */}
                <div>
                    <label className="block text-sm text-slate-400 mb-1">
                        Магазин
                    </label>

                    <select
                        value={storeID}
                        onChange={(e) => setStoreID(e.target.value)}
                        className="w-full h-10 bg-slate-900 border border-slate-600 rounded-lg px-3 text-slate-100 focus:border-indigo-500 focus:outline-none transition-colors"
                    >
                        <option value="">Все магазины</option>
                        {Object.entries(stores).map(([id, name]) => (
                            <option key={id} value={id}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Сортировка */}
                <div>
                    <label className="block text-sm text-slate-400 mb-1">
                        Сортировка
                    </label>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full h-10 bg-slate-900 border border-slate-600 rounded-lg px-3 text-slate-100 focus:border-indigo-500 focus:outline-none transition-colors"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Порядок */}
                <div>
                    <label className="block text-sm text-slate-400 mb-1">
                        Порядок
                    </label>

                    <div className="h-10 flex rounded-lg overflow-hidden border border-slate-600">
                        <button
                            type="button"
                            onClick={() => setOrder('asc')}
                            className={`flex-1 text-sm transition-colors cursor-pointer ${
                                order === 'asc'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            ↑ Возрастание
                        </button>

                        <button
                            type="button"
                            onClick={() => setOrder('desc')}
                            className={`flex-1 text-sm transition-colors cursor-pointer ${
                                order === 'desc'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            ↓ Убывание
                        </button>
                    </div>
                </div>
            </div>

            {/* Нижняя панель: чекбокс + кнопка */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={onSale}
                        onChange={(e) => setOnSale(e.target.checked)}
                        className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                    Только игры со скидкой
                </label>

                <button
                    type="button"
                    onClick={applyFilters}
                    disabled={loading}
                    className="w-full sm:w-auto h-10 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer font-medium"
                >
                    {loading ? 'Обновление...' : 'Применить фильтры'}
                </button>
            </div>
        </div>
    )
}