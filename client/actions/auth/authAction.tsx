import { NavigateFunction, useNavigate } from 'react-router-dom'
import { authUser } from '../../src/reducer/authSlice'
// import { storeUserFaceMatches } from './userFaceMatchesAction'
import { navigateTo } from '../../utils/navigateHelper'
import { getBaseUrl } from '../api'
const BASE_URL = getBaseUrl()

// Get current user details
export const getCurrentUserDetails = (callback?: () => void) => async (dispatch: any) => {
    // const state = store.getState()
    if (!localStorage.getItem('authToken')) {
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
        const updatedData = { id: result.data._id, ...result.data }
        delete updatedData._id
        dispatch(authUser(updatedData))
        if (result.data.plan_status === 'active') {
            // dispatch(storeUserFaceMatches(state.userFaceMatches.userFaceMatches, result.data._id))
            navigateTo('/insight')
        } else {
            navigateTo('/subscribe')
        }
    } catch (error) {
        console.log(error)
    } finally {
        if (callback) {
            callback()
        }
    }
}
