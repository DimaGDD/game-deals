import axios from 'axios'

const BASE = 'https://www.cheapshark.com/api/1.0'


export async function fetchDeals({
    title = '',
    upperPrice = 200,
    lowerPrice = 0,
    sortBy = 'Price',
    pageSize = 24,
    pageNumber = 0,
    desc = 0,
    onSale = 1,
    storeID = undefined,
    metacritic = undefined,
    steamRating = undefined,
} = {}) {
    const params = {
        title,
        upperPrice,
        lowerPrice,
        sortBy,
        pageSize,
        pageNumber,
        desc,
        onSale,
    }

    if (storeID !== undefined && storeID !== '') {
        params.storeID = storeID
    }

    if (metacritic !== undefined && metacritic > 0) {
        params.metacritic = metacritic
    }

    if (steamRating !== undefined && steamRating > 0) {
        params.steamRating = steamRating
    }

    const { data } = await axios.get(`${BASE}/deals`, { params })

    return data
}


export async function fetchStores() {
    const { data } = await axios.get(`${BASE}/stores`)

    return data.reduce((acc, s) => {
        acc[s.storeID] = s.storeName
        return acc
    }, {})
}


export function buildRedirectUrl(dealID) {
    return `https://www.cheapshark.com/redirect?dealID=${dealID}`
}


export function formatReleaseDate(ts) {
    if (!ts) return '-'

    return new Date(ts * 1000).toLocaleDateString('ru-RU')
}