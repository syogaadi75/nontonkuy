import {
    createSlice
} from '@reduxjs/toolkit'

const initialState = {
    isLoading: null,
    videoPlayer: null,
    error: null,
}

const videoPlayerSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        checkPlayerRefRequest: (state) => {
            state.isLoading = true
        },
        checkPlayerRefSuccess: (state, {
            payload
        }) => {
            state.isLoading = null
            state.videoPlayer = payload
            state.error = null
        },
        checkPlayerRefError: (state, {
            payload
        }) => {
            state.isLoading = null
            state.videoPlayer = null
            state.error = payload
        },
    },
})

export const {
    checkPlayerRefRequest,
    checkPlayerRefSuccess,
    checkPlayerRefError
} = videoPlayerSlice.actions

export const savePlayerRef = ({
    ref
}) => async (dispatch) => {
    try {
        dispatch(checkPlayerRefRequest())
        dispatch(checkPlayerRefSuccess(ref))
    } catch (error) {
        dispatch(checkPlayerRefError(error.response.data.message))
    }
}

export default videoPlayerSlice.reducer