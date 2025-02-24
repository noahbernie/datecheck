import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: {}
}

const authReducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        authUser: (state, action) => {
            state.user = action.payload
        },
    },
})

export const { authUser } = authReducer.actions
export default authReducer.reducer


