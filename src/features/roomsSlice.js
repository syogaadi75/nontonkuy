import {
    createSlice
} from '@reduxjs/toolkit'
import axios from 'axios'
const apiUrl = 'https://nontonkuy.fly.dev';
// const apiUrl = 'http://localhost:3000';

const initialState = {
    isLoading: null,
    rooms: null,
    error: null,
    isLoadingJoin: null,
    joined: null,
    errorJoin: null,
    isLoadingExit: null,
    exited: null,
    errorExit: null,
    isLoadingCek: null,
    cekRoom: null,
    errorCek: null,
    checkedRoom: null,
}

const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        roomsRequest: (state) => {
            state.isLoading = true
            state.isAuthenticated = null
        },
        roomsSuccess: (state, {
            payload
        }) => {
            state.isLoading = null
            state.rooms = payload
            state.error = null
        },
        roomsError: (state, {
            payload
        }) => {
            state.isLoading = null
            state.rooms = null
            state.error = payload
        },
        joinRoomRequest: (state) => {
            state.isLoadingJoin = true
        },
        joinRoomSuccess: (state, {
            payload
        }) => {
            state.isLoadingJoin = false
            state.joined = payload
            state.errorJoin = null
        },
        joinRoomError: (state, {
            payload
        }) => {
            state.isLoadingJoin = null
            state.errorJoin = payload
        },
        exitRoomRequest: (state) => {
            state.isLoadingExit = true
        },
        exitRoomSuccess: (state, {
            payload
        }) => {
            state.isLoadingExit = false
            state.exited = "Berhasil keluar dari room"
            state.errorExit = null
        },
        exitRoomError: (state, {
            payload
        }) => {
            state.isLoadingExit = false
            state.errorExit = payload
        },
        cekRoomRequest: (state) => {
            state.isLoadingCek = true
            state.checkedRoom = null
        },
        cekRoomSuccess: (state, {
            payload
        }) => {
            state.cekRoom = payload
            state.isLoadingCek = false
            state.checkedRoom = true
            state.errorCek = null
        },
        cekRoomError: (state, {
            payload
        }) => {
            state.isLoadingCek = false
            state.checkedRoom = null
            state.errorCek = payload
        },
    },
})

export const {
    roomsRequest,
    roomsSuccess,
    roomsError,
    joinRoomRequest,
    joinRoomSuccess,
    joinRoomError,
    exitRoomRequest,
    exitRoomSuccess,
    exitRoomError,
    cekRoomRequest,
    cekRoomSuccess,
    cekRoomError
} = roomsSlice.actions

export const getRooms = () => async (dispatch) => {
    try {
        dispatch(roomsRequest())
        const {
            data
        } = await axios.get(apiUrl + '/rooms/public')
        dispatch(roomsSuccess(data))
    } catch (error) {
        dispatch(roomsError(error.response.data.message))
    }
}

export const userJoinRoom = ({
    roomId,
    userId
}) => async (dispatch) => {
    try {
        dispatch(joinRoomRequest())
        const {
            data
        } = await axios.patch(apiUrl + '/rooms/' + roomId + '/join', {
            userId
        })
        localStorage.setItem('joinedRoom', roomId);
        dispatch(joinRoomSuccess(data))
    } catch (error) {
        dispatch(joinRoomError(error.response.data.message))
    }
}

export const userExitRoom = ({
    roomId,
    userId
}) => async (dispatch) => {
    try {
        dispatch(exitRoomRequest())
        await axios.patch(apiUrl + '/rooms/' + roomId + '/exit', {
            userId
        })
        localStorage.removeItem('joinedRoom');
        dispatch(exitRoomSuccess())
        dispatch(cekRoomError('exited room'))
    } catch (error) {
        dispatch(exitRoomError(error.response.data.message))
    }
}

export const userCekRoom = ({
    roomId,
}) => async (dispatch) => {
    try {
        dispatch(cekRoomRequest())
        const {
            data
        } = await axios.get(apiUrl + `/rooms/${roomId}`)
        dispatch(cekRoomSuccess(data))
    } catch (error) {
        dispatch(cekRoomError(error.response.data.message))
    }
}

export default roomsSlice.reducer