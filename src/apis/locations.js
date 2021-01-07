import { requester } from '../utils';

export const fetchAllProvinces = (provinceId, cascade_list) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `location/get_location_info`,
                method: 'POST',
                data: {
                    cascade_list
                },
                withAuth: false,
            })
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};