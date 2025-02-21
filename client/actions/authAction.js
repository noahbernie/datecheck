import { getBaseUrl } from './api'
const basUrl = getBaseUrl()

export const registerUser = async() => {
    try {
        const res = await fetch(`${basUrl}/api/register`)
        const { token } = res.data.data
        localStorage.setItem('AuthToken', token)
    } catch (error) {
        throw new Error(error.error || 'Failed to register user')
    }
}