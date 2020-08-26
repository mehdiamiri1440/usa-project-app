import { requester } from '../utils';

export const fetchAllBuyAdRequests = provinceId => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_related_buyAds_list_to_the_seller`,
                method: 'POST',
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