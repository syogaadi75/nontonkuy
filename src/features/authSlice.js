import {
    createSlice
} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    isLoading: null,
    isAuthenticated: null,
    user: null,
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        checkAuthRequest: (state) => {
            state.isLoading = true
            state.isAuthenticated = null
        },
        checkAuthSuccess: (state, {
            payload
        }) => {
            state.isLoading = null
            state.isAuthenticated = true
            state.user = payload
            state.error = null
        },
        checkAuthError: (state, {
            payload
        }) => {
            state.isLoading = null
            state.isAuthenticated = false
            state.user = null
            state.error = payload
        },
    },
})

export const {
    checkAuthRequest,
    checkAuthSuccess,
    checkAuthError
} = authSlice.actions

export const checkAuth = () => async (dispatch) => {
    try {
        dispatch(checkAuthRequest())
        const authToken = localStorage.getItem('authToken')
        const {
            data
        } = await axios.get('https://nontonkuy.fly.dev/auth/checkAuth', {
            // } = await axios.get('http://localhost:3000/auth/checkAuth', {
            headers: {
                // 'x-auth-token': authToken,
                'Authorization': `Bearer ${authToken}`
            },
        })
        dispatch(checkAuthSuccess(data))
    } catch (error) {
        dispatch(checkAuthError(error.response.data.message))
    }
}

export default authSlice.reducer