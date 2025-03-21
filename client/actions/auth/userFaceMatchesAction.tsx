import { getBaseUrl } from '../api'
const BASE_URL = getBaseUrl()
const authToken = localStorage.getItem('authToken')

export const storeUserFaceMatches = (data: Array<any>, id: string) => async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/user-image-face-matches`, {
            method: 'POST',
            body: JSON.stringify({ data, id }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const res = await response.json()
        return res
    } catch (error) {
        console.log(error)
        return error
    }
}

export const getImageResult = (imagePath: string) => async () => {
    try {
        const res = await fetch(`${BASE_URL}/api/get-image-result`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ imagePath: imagePath }),
        })
        const response = await res.json()
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}

export const filterResults = (data: any) => async () => {
    try {
        const res = await fetch(`${BASE_URL}/api/filter-results`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data),
        })
        const response = await res.json()
        return response
    } catch (error) {
        return error
    }
}

export const preparedDisplayData = (filterData: any) => async () => {
    try {
        const res = await fetch(`${BASE_URL}/api/prepare-display-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                instagram: filterData.data.instagram || [],
                linkedin: filterData.data.linkedin || [],
                twitter: filterData.data.twitter || [],
                facebook: filterData.data.facebook || [],
                others: filterData.data.others || [],
            }),
        })
        const response = res.json()
        return response
    } catch (error) {
        return error
    }
}

export const getUserFaceImageMatches = () => async () => {
    try {
        const userAuthToken = localStorage.getItem('authToken')
        const res = await fetch(`${BASE_URL}/api/user-image-face-result`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${userAuthToken}`
            }
        })
        const response = res.json()
        return response
    } catch (error) {
        return error
    }
}
