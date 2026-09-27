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
        lowerPrice: 0,
        upperPrice: 0,
        sortBy: 'Price',
        order: 'asc',
        onSale: 1,
        storeID: '',
    })

    const isMetacritic = filters.sortBy === 'Metacritic'
    const isReviews = filters.sortBy === 'Reviews'

    const invertDesc = isMetacritic || isReviews

    useEffect(() => {
        fetchStores()
            .then(setStores)
            .catch((err) => console.error('Ошибка загрузки магазинов:', err))
    }, [])

    useEffect(() => {
        fetchDeals({
            title: filters.title,
            lowerPrice: filters.lowerPrice || undefined,
            upperPrice: filters.upperPrice > 0 ? filters.upperPrice : undefined,
            sortBy: filters.sortBy,
            pageSize: 24,
            pageNumber: page,
            desc: invertDesc
                    ? (filters.order === 'asc' ? 1 : 0)
                    : (filters.order === 'desc' ? 1 : 0),
            onSale: filters.onSale,
            storeID: filters.storeID || undefined,
            metacritic: filters.sortBy === 'Metacritic' ? 1 : undefined,
            steamRating: filters.sortBy === 'Reviews' ? 1: undefined,
         })
            .then((data) => {
                const list = Array.isArray(data) ? data : []
                setDeals(list)
                setError(null)
            })
            .catch((err) => {
                console.error('Ошибка запроса:', err)
                setError(err.message)
            })
            .finally(() => setLoading(false))
    }, [filters, page])

    const handleApplyFilters = useCallback((newFilters) => {
        setLoading(true)
        setPage(0)
        setFilters(newFilters)
    }, [])

    const handlePageChange = (nextPage) => {
        setLoading(true)
        setPage(nextPage)
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Скидки на игры</h2>

            <Filters onApply={handleApplyFilters} loading={loading} stores={stores}/>

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
                        onClick={() => handlePageChange(Math.max(0, page - 1))}
                        disabled={page === 0 || loading}
                        className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        ← Назада
                    </button>

                    <span className="text-slate-400">Страница {page + 1}</span>

                    <button
                        onClick={() => handlePageChange(page + 1)}
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