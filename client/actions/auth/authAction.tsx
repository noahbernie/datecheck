import { authUser, setShowAuth, setShowPaywall } from '../../src/reducer/authSlice'
import { getBaseUrl } from '../api'
const BASE_URL = getBaseUrl()

// Get current user details
export const getCurrentUserDetails = (callback?: () => void) => async (dispatch: any) => {
    if (!localStorage.getItem('authToken')) {
        // dispatch(setIsProfileReadyAction())
        if (callback) {
            callback()
        }
        return
    }

    try {
        const response = await fetch(`${BASE_URL}/api/user/users-details`, {
            method: 'POST',
            headers: {
                'Authorization': `${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const result = await response.json()

        // Dispatch user update action
        dispatch(authUser(result.data))
        dispatch(setShowAuth(false))
        dispatch(setShowPaywall(true))
    } catch (error) {
        // dispatch(handleUserUpdateError(error))
        console.log(error)
    } finally {
        console.log('inside finnally')
        if (callback) {
            callback()
        }
    }
}
