import axios from 'axios'

const BASE = 'https://www.cheapshark.com/api/1.0'


export async function fetchDeals({
    title = '',
    upperPrice = 50,
    lowerPrice = 0,
    sortBy = 'Deal Rating',
    pageSize = 60,
    pageNumber = 0,
} = {}) {
    const params = {
        title,
        upperPrice,
        lowerPrice,
        sortBy,
        pageSize,
        pageNumber,
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