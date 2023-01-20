import {
    configureStore
} from '@reduxjs/toolkit'
import rootReducer from './reducers'
// import thunk from 'redux-thunk';

const store = configureStore({
    reducer: rootReducer
    // middleware: [thunk]
})
// store.dispatch(checkAuthToken());

export default store