import { requester } from '../utils';

export const fetchUserProfile = provinceId => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `user/profile_info`,
                method: 'POST',
                data: {
                    province_id: provinceId
                },
                withAuth: false,
            })
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                return reject(err);
            });
    });
};