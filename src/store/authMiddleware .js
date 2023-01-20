import jwtDecode from 'jwt-decode';

const authMiddleware = store => next => action => {
    if (action.type === 'CHECK_AUTH') {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            try {
                const user = jwtDecode(authToken);
                if (user.exp * 1000 > Date.now()) {
                    next({
                        type: 'LOGIN_SUCCESS',
                        user,
                        authToken,
                    });
                } else {
                    next({
                        type: 'LOGOUT'
                    });
                }
            } catch (err) {
                next({
                    type: 'LOGOUT'
                });
            }
        } else {
            next({
                type: 'LOGOUT'
            });
        }
    } else {
        next(action);
    }
};

export default authMiddleware;