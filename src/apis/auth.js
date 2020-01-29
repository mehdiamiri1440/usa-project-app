import { requester } from '../utils';

export const login = (userName, password) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `v1/auth/loginByUserNamePass`,
                method: 'POST',
                withAuth: false,
                data: {
                    userName,
                    password
                }
            })
            .then(result => {
                console.log('login successfully', result);
                // cookies.set('accessToken', result.payload.accessToken, { expires: 0.03125 });
                // cookies.set('refreshToken', result.payload.refreshToken, { expires: 60 });
                resolve(result.payload);
            })
            .catch(err => {
                console.log('login error', err);
                reject(err);
            });
    });
};
