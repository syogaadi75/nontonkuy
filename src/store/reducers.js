import {
    combineReducers
} from 'redux'
import apiUrlReducer from './apiUrlReducer'
import authSlice from '../features/authSlice.js';
import roomsSlice from '../features/roomsSlice.js';

const rootReducer = combineReducers({
    apiUrl: apiUrlReducer,
    auth: authSlice,
    rooms: roomsSlice,
})

export default rootReducer