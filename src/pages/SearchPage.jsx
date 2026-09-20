import { useEffect, useState, useCallback } from 'react'
import { fetchDeals, fetchStores } from '../api/cheapshark'
import DealCard from '../components/DealCard'
import Filters from '../components/Filters'


export default function SearchPage() {
    const [deals, setDeals] = useState([])
    const [stores, setStores] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(0)
    const [filters, setFilters] = useState({
        title: '',
        upperPrice: 50,
        sortBy: 'Deal Rating',
        order: 'asc',
    })

    useEffect(() => {
        fetchStores()
            .then(setStores)
            .catch((err) => console.error('Ошибка загрузки магазинов:', err))
    }, [])

    useEffect(() => {
        setLoading(true)
        fetchDeals({
            title: filters.title,
            upperPrice: filters.upperPrice,
            sortBy: filters.sortBy,
            pageSize: 60,
            pageNumber: page,
         })
            .then((data) => {
                const list = Array.isArray(data) ? data : []
                const withDiscount = list.filter((d) => parseFloat(d.savings) > 0)

                setDeals(sortDeals(withDiscount, filters.sortBy, filters.order))
                setError(null)
            })
            .catch((err) => {
                console.error('Ошибка запроса:', err)
                setError(err.message)
            })
            .finally(() => setLoading(false))
    }, [filters, page])

    const handleApplyFilters = useCallback((newFilters) => {
        setPage(0)
        setFilters(newFilters)
    }, [])

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Скидки на игры</h2>

            <Filters onApply={handleApplyFilters} loading={loading} />

            {error && <div className="text-red-400 mb-4">Ошибка: {error}</div>}

            {!loading && deals.length === 0 && !error && (
                <div className="text-slate-400 text-center py-12">
                    Ничего не найдено. Попробуйте изменить фильтр
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {deals.map((deal) => (
                    <DealCard key={deal.dealID} deal={deal} storeName={stores[deal.storeID]} />
                ))}
            </div>

            {deals.length > 0 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0 || loading}
                        className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        ← Назада
                    </button>

                    <span className="text-slate-400">Страница {page + 1}</span>

                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={loading || deals.length < 24}
                        className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        Впереда →
                    </button>
                </div>
            )}

            <div className="text-sm text-slate-500 mt-6">
                Найдено: {deals.length}
            </div>
        </div>
    )
}


function sortDeals(deals, sortBy, order) {
    console.warn('sortDeals вызвана:', {
        count: deals.length,
        sortBy,
        order,
        firstThreeMetacritic: deals.slice(0, 3).map(d => d.metacriticScore),
    })

    const dir = order === 'desc' ? -1 : 1
    const sorted = [...deals].sort((a, b) => {
        let va, vb
        switch (sortBy) {
            case 'Price':
                va = parseFloat(a.salePrice)
                vb = parseFloat(b.salePrice)
                break
            case 'Metacritic':
                va = parseFloat(a.metacriticScore) || 0
                vb = parseFloat(b.metacriticScore) || 0

                if (va === 0 && vb === 0) return 0
                if (va === 0) return 1
                if (vb === 0) return -1

                break
            case 'Release':
                va = parseFloat(a.releaseDate) || 0
                vb = parseFloat(b.releaseDate) || 0
                break
            case 'Savings':
                va = parseFloat(a.savings)
                vb = parseFloat(b.savings)

                if (va === 0 && vb === 0) return 0
                if (va === 0) return 1
                if (vb === 0) return -1
                
                break
            case 'Reviews':
                va = parseFloat(a.steamRatingPercent) || 0
                vb = parseFloat(b.steamRatingPercent) || 0

                if (va === 0 && vb === 0) return 0
                if (va === 0) return 1
                if (vb === 0) return -1

                break
            case 'Deal Rating':
                va = parseFloat(a.dealRating) || 0
                vb = parseFloat(b.dealRating) || 0

                if (va === 0 && vb === 0) return 0
                if (va === 0) return 1
                if (vb === 0) return -1

                break
        }

        if (va < vb) return -1 * dir
        if (va > vb) return 1 * dir
        return 0
    })

    return sorted
}