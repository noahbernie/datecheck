import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: {},
    showAuth: true,
    showPaywall: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authUser: (state, action) => {
            state.user = action.payload
        },
        setShowAuth: (state, action) => {
            state.showAuth = action.payload
        },
        setShowPaywall: (state, action) => {
            state.showPaywall = action.payload
        }
    }
})

export const { authUser, setShowAuth, setShowPaywall } = authSlice.actions
export default authSlice.reducer


