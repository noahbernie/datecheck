import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userFaceMatches: [],
    imageFilePath: ''
}

const userFaceMatche = createSlice({
    name: 'userFaceMatches',
    initialState,
    reducers: {
        setUserFaceMatches: (state, action) => {
            state.userFaceMatches = action.payload
        },
        setUserImageFilePath: (state, action) => {
            state.imageFilePath = action.payload
        }
    }
})

export const { setUserFaceMatches, setUserImageFilePath } = userFaceMatche.actions
export default userFaceMatche.reducer
