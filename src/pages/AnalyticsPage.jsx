import { useEffect, useState } from 'react'
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import { fetchDeals, fetchStores } from '../api/cheapshark'


ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function AnalyticsPage() {
    const [deals, setDeals] = useState([])
    const [stores, setStores] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        Promise.all([fetchDeals({ pageSize: 60 }), fetchStores()])
            .then(([dealsData, storesData]) => {
                setDeals(Array.isArray(dealsData) ? dealsData : [])
                setStores(storesData)
                setError(null)
            })
            .catch((err) => {
                console.error(err)
                setError(err.message)
            })
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="max-w-6xl mx-auto p-6 text-slate-400">Загрузка аналитики...</div>
    }

    if (error) {
        return <div className="max-w-6xl mx-auto p-6 text-red-400">Ошибка: {error}</div>
    }

    const storeCounts = deals.reduce((acc, d) => {
        const name = stores[d.storeID] || `Store #${d.storeID}`
        acc[name] = (acc[name] || 0) + 1
        return acc
    }, {})

    const topStores = Object.entries(storeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
    
    const pieData = {
        labels: topStores.map(([name]) => name),
        datasets: [
            {
                label: 'Сделок',
                data: topStores.map(([, count]) => count),
                backgroundColor: [
                    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
                ],
                borderColor: '#1e293b',
                borderWidth: 2,
            },
        ],
    }

    const topDiscounts = [...deals]
        .filter((d) => parseFloat(d.savings) > 0)
        .sort((a, b) => parseFloat(b.savings) - parseFloat(a.savings))
        .slice(0, 10)
    
    const barData = {
        labels: topDiscounts.map((d) => d.title.length > 25 ? d.title.slice(0, 25) + '...' : d.title),
        datasets: [
            {
                label: 'Скидка, %',
                data: topDiscounts.map((d) => Math.round(parseFloat(d.savings))),
                backgroundColor: '#10b981',
                borderRadius: 4,
            },
        ],
    }

    const priceBuckets = { '0-5': 0, '5-10': 0, '10-20': 0, '20-30': 0, '30-40': 0, '40+': 0 }
    deals.forEach((d) => {
        const p = parseFloat(d.salePrice)

        if (p < 5) priceBuckets['0-5']++
        else if (p < 10) priceBuckets['5-10']++
        else if (p < 20) priceBuckets['10-20']++
        else if (p < 30) priceBuckets['20-30']++
        else if (p < 40) priceBuckets['30-40']++
        else priceBuckets['40+']++
    })

    const priceData = {
        labels: Object.keys(priceBuckets),
        datasets: [
            {
                label: 'Количество игр',
                data: Object.values(priceBuckets),
                backgroundColor: '#6366f1',
                borderRadius: 4,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#cbd5e1' },
            },
        },
        scales: {
            x: { ticks: { color: '#cbd5e1' }, grid: { color: '#334155' } },
            y: { ticks: { color: '#cbd5e1' }, grid: { color: '#334155' } },
        },
    }

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#cbd5e1',
                    padding: 10,
                    boxWidth: 14,
                    font: { size: 11 },
                },
            },
        },
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-2">Аналитика скидок</h2>
            <p className="text-slate-400 mb-6">
                На основе {deals.length} актуальных сделок из CheapShark
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <h3 className="font-semibold mb-4">Сделки по магазин (топ-6)</h3>

                    <div className="h-80">
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <h3 className="font-semibold mb-4">Топ 10 игр по размеру скидки</h3>

                    <div className="h-80">
                        <Bar data={barData} options={{ ...chartOptions, indexAxis: 'y', }} />
                    </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 lg:col-span-2">
                    <h3 className="font-semibold mb-4">Распределение цен</h3>

                    <div className="h-80">
                        <Bar data={priceData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    )
}