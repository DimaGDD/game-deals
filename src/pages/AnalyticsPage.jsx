import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { fetchDeals, fetchStores, buildRedirectUrl } from '../api/cheapshark'


ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#64748b']

export default function AnalyticsPage() {
    const [deals, setDeals] = useState([])
    const [stores, setStores] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const requestAnalytics = useCallback(() => (
        Promise.all([
            fetchDeals({ pageSize: 60, lowerPrice: 5 }),
            fetchStores(),
        ])
            .then(([dealsData, storesData]) => {
                setDeals(Array.isArray(dealsData) ? dealsData : [])
                setStores(storesData)
            })
    ), [])

    const loadAnalytics = useCallback(() => {
        setLoading(true)
        setError(null)

        return requestAnalytics()
            .catch((err) => {
                console.error('Ошибка загрузки аналитики:', err)
                setError(err.message)
            })
            .finally(() => setLoading(false))
    }, [requestAnalytics])

    useEffect(() => {
        requestAnalytics()
            .catch((err) => {
                console.error('Ошибка загрузки аналитики:', err)
                setError(err.message)
            })
            .finally(() => setLoading(false))
    }, [requestAnalytics])

    const statistics = useMemo(() => getStatistics(deals, stores), [deals, stores])

    if (loading) {
        return <div className="max-w-6xl mx-auto p-6 text-slate-400">Загрузка аналитики...</div>
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="rounded-xl border border-red-900 bg-red-950/40 p-5 text-red-300">
                    <p className="mb-3">Не удалось загрузить аналитику: {error}</p>
                    <button
                        type="button"
                        onClick={loadAnalytics}
                        className="rounded-lg bg-red-700 px-4 py-2 text-sm text-white transition-colors hover:bg-red-600"
                    >
                        Повторить
                    </button>
                </div>
            </div>
        )
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#cbd5e1' } },
        },
        scales: {
            x: { ticks: { color: '#cbd5e1' }, grid: { color: '#334155' } },
            y: { ticks: { color: '#cbd5e1' }, grid: { color: '#334155' } },
        },
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                    <h2 className="text-2xl font-bold">Аналитика AAA-скидок</h2>
                    <p className="mt-1 text-slate-400">
                        Сводка по {deals.length} AAA-предложениям CheapShark
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadAnalytics}
                    className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-700"
                >
                    Обновить данные
                </button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Всего сделок" value={statistics.totalDeals} hint="в текущей выборке" />
                <StatCard label="Средняя скидка" value={`${statistics.averageDiscount}%`} hint="по доступным предложениям" />
                <StatCard label="Средняя цена" value={`$${statistics.averagePrice}`} hint="цена со скидкой" />
                <StatCard
                    label="Максимальная скидка"
                    value={`${statistics.maxDiscount}%`}
                    hint={statistics.bestDeal ? statistics.bestDeal.title : 'нет данных'}
                />
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ChartCard title="Распределение сделок по магазинам">
                    <Doughnut
                        data={{
                            labels: statistics.storeLabels,
                            datasets: [{
                                data: statistics.storeValues,
                                backgroundColor: COLORS,
                                borderColor: '#1e293b',
                                borderWidth: 2,
                            }],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'right',
                                    labels: { color: '#cbd5e1', padding: 10, boxWidth: 14, font: { size: 11 } },
                                },
                            },
                        }}
                    />
                </ChartCard>

                <ChartCard title="Топ-10 игр по размеру скидки">
                    <Bar
                        data={{
                            labels: statistics.topDiscounts.map((deal) => shorten(deal.title)),
                            datasets: [{
                                label: 'Скидка, %',
                                data: statistics.topDiscounts.map((deal) => Math.round(number(deal.savings))),
                                backgroundColor: '#10b981',
                                borderRadius: 4,
                            }],
                        }}
                        options={{ ...chartOptions, indexAxis: 'y' }}
                    />
                </ChartCard>

                <ChartCard title="Распределение скидок">
                    <Bar
                        data={{
                            labels: Object.keys(statistics.discountBuckets),
                            datasets: [{
                                label: 'Количество игр',
                                data: Object.values(statistics.discountBuckets),
                                backgroundColor: '#8b5cf6',
                                borderRadius: 4,
                            }],
                        }}
                        options={chartOptions}
                    />
                </ChartCard>

                <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
                    <h3 className="mb-4 font-semibold">Лучшие предложения</h3>
                    <div className="space-y-3">
                        {statistics.topDiscounts.slice(0, 5).map((deal) => (
                            <a
                                key={deal.dealID}
                                href={buildRedirectUrl(deal.dealID)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between gap-3 border-b border-slate-700 pb-3 last:border-0 last:pb-0 rounded-lg px-2 -mx-2 py-2 transition-colors hover:bg-slate-700/50 cursor-pointer"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium" title={deal.title}>
                                        {deal.title}
                                    </p>

                                    <p className="text-sm text-slate-400">
                                        {statistics.storeName(deal.storeID)} · ${formatPrice(deal.salePrice)}
                                    </p>
                                </div>

                                <span className="shrink-0 rounded bg-emerald-900/60 px-2 py-1 text-sm font-bold text-emerald-300">
                                    -{Math.round(number(deal.savings))}%
                                </span>
                            </a>
                        ))}

                        {statistics.topDiscounts.length === 0 && (
                            <p className="text-slate-400">Нет данных о скидках.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function ChartCard({ title, children }) {
    return (
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <h3 className="mb-4 font-semibold">{title}</h3>
            <div className="h-80">{children}</div>
        </div>
    )
}

function StatCard({ label, value, hint }) {
    return (
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-bold text-indigo-300">{value}</p>
            <p className="mt-1 truncate text-xs text-slate-500" title={hint}>{hint}</p>
        </div>
    )
}

function getStatistics(deals, stores) {
    const validDeals = deals.filter((deal) => Number.isFinite(Number.parseFloat(deal.salePrice)))
    const discounts = deals.map((deal) => number(deal.savings)).filter((value) => value > 0)
    const topDiscounts = [...deals]
        .filter((deal) => number(deal.savings) > 0)
        .sort((a, b) => number(b.savings) - number(a.savings))
        .slice(0, 10)

    const storeCounts = deals.reduce((counts, deal) => {
        const name = stores[deal.storeID] || `Магазин #${deal.storeID}`
        counts[name] = (counts[name] || 0) + 1
        return counts
    }, {})
    const sortedStores = Object.entries(storeCounts).sort((a, b) => b[1] - a[1])
    const visibleStores = sortedStores.slice(0, 6)
    const otherStoreCount = sortedStores.slice(6).reduce((sum, [, count]) => sum + count, 0)

    // распределение по размеру скидки
    const discountBuckets = {
        '0–20%': 0,
        '20–40%': 0,
        '40–60%': 0,
        '60–75%': 0,
        '75–90%': 0,
        '90%+': 0,
    }

    deals.forEach((deal) => {
        const s = number(deal.savings)
        if (s < 20) discountBuckets['0–20%']++
        else if (s < 40) discountBuckets['20–40%']++
        else if (s < 60) discountBuckets['40–60%']++
        else if (s < 75) discountBuckets['60–75%']++
        else if (s < 90) discountBuckets['75–90%']++
        else discountBuckets['90%+']++
    })

    return {
        totalDeals: deals.length,
        averageDiscount: discounts.length
            ? Math.round(discounts.reduce((sum, value) => sum + value, 0) / discounts.length)
            : 0,
        averagePrice: validDeals.length
            ? formatPrice(validDeals.reduce((sum, deal) => sum + number(deal.salePrice), 0) / validDeals.length)
            : '0.00',
        maxDiscount: topDiscounts.length ? Math.round(number(topDiscounts[0].savings)) : 0,
        bestDeal: topDiscounts[0],
        topDiscounts,
        discountBuckets,
        storeLabels: [...visibleStores.map(([name]) => name), ...(otherStoreCount ? ['Остальные'] : [])],
        storeValues: [...visibleStores.map(([, count]) => count), ...(otherStoreCount ? [otherStoreCount] : [])],
        storeName: (storeID) => stores[storeID] || `Магазин #${storeID}`,
    }
}

function number(value) {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : 0
}

function formatPrice(value) {
    return number(value).toFixed(2)
}

function shorten(title) {
    return title.length > 25 ? `${title.slice(0, 25)}...` : title
}