const initialState = {
    apiUrl: 'https://nontonkuy.fly.dev'
    // apiUrl: 'http://localhost:3000'
}

const apiUrlReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_API_URL':
            return {
                ...state,
                apiUrl: action.payload
            }
            default:
                return state
    }
}

export default apiUrlReducer