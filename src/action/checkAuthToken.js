const checkAuthToken = () => {
    return (dispatch) => {
        // Ambil token JWT dari localstorage
        const token = localStorage.getItem('authToken');

        // Kirim request ke server untuk memvalidasi token JWT
        return fetch('/api/checkAuth', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                // Jika token valid, dispatch action untuk menandakan bahwa user telah login
                if (data.auth) {
                    dispatch(loginSuccess(data.user));
                } else {
                    // Jika token tidak valid, dispatch action untuk menandakan bahwa user harus login
                    dispatch(loginError());
                }
            })
            .catch(error => {
                // Jika terjadi error saat request, dispatch action untuk menandakan error
                dispatch(loginError(error));
            });
    };
};