import { requester } from '../utils';

export const fetchAllProvinces = provinceId => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `location/get_location_info`,
                method: 'POST',
                data: {
                    province_id: provinceId
                },
                withAuth: false,
            })
            .then(result => {
                console.warn('province success', result)
                resolve(result)
            })
            .catch(err => {
                console.warn('province err', err)
                return reject(err);
            });
    });
};