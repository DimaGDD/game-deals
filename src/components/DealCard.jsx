import { buildRedirectUrl, formatReleaseDate } from '../api/cheapshark'

export default function DealCard({ deal, storeName }) {
    const savings = Math.round(parseFloat(deal.savings))
    const salePrice = parseFloat(deal.salePrice).toFixed(2)
    const normalPrice = parseFloat(deal.normalPrice).toFixed(2)
    const hasDiscount = savings > 0

    return (
        <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-indigo-500 transition-colors flex flex-col">
            <div className="aspect-video bg-slate-700 overflow-hidden">
                <img src={deal.thumb} alt={deal.title} className="w-full h-full object-hidden" loading="lazy" />
            </div>

            <div className="p-4 flex-col flex-1">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]" title={deal.title}>
                    {deal.title}
                </h3>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {hasDiscount && (
                        <span className="bg-green-600 text-white text-sm font-bold px-2 py-1 rounded">
                            -{savings}%
                        </span>
                    )}

                    <span className="text-2xl font-bold text-green-400">${salePrice}</span>

                    {hasDiscount && (
                        <span className="text-slate-500 line-through text-sm">${normalPrice}</span>
                    )}
                </div>

                <div className="text-sm text-slate-400 space-y-1 mb-4">
                    <div>🏪 {storeName || `Store #${deal.storeID}`}</div>

                    {deal.dealRating && parseFloat(deal.dealRating) > 0 && (
                        <div>
                            🔥 Рейтинг сделки:{' '}
                            <span className="text-amber-400 font-medium">
                                {parseFloat(deal.dealRating).toFixed(1)} / 10.0
                            </span>
                        </div>
                    )}

                    {deal.metacriticScore && deal.metacriticScore !== '0' && (
                        <div>⭐ Metactritic: {deal.metacriticScore}</div>
                    )}

                    {deal.steamRatingPercent && deal.steamRatingPercent !== '0' && (
                        <div>
                            🎮 Steam:{' '}
                            <span className={steamColor(deal.steamRatingPercent)}>
                                {deal.steamRatingPercent}%
                            </span>
                            {deal.steamRatingText && (
                                <span className="text-slate-500"> · {deal.steamRatingText}</span>
                            )}
                        </div>
                    )}

                    <div>📅 {formatReleaseDate(deal.releaseDate)}</div>
                </div>

                <a
                    href={buildRedirectUrl(deal.dealID)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto block text-center bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg transition-colors"
                >
                    Перейти в магазин →
                </a>
            </div>
        </div>
    )
}

function steamColor(percent) {
    const p = parseFloat(percent)

    if (p >= 90) return 'text-emerald-400 font-medium'
    if (p >= 75) return 'text-green-400 font-medium'
    if (p >= 50) return 'text-amber-400 font-medium'

    return 'text-red-400 font-medium'
}