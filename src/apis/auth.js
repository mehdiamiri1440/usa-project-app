import { requester } from '../utils';

export const login = (mobileNumber, password) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `dologin`,
                method: 'POST',
                withAuth: false,
                data: {
                    phone: mobileNumber,
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
