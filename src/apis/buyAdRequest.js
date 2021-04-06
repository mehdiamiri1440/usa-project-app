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

export const fetchRelatedRequests = _ => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_my_buyAd_suggestions`,
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

export const fetchMyRequests = _ => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_my_buyAds`,
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

export const deleteBuyAd = id => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `delete_buy_ad_by_id`,
                method: 'POST',
                data: { buy_ad_id: id },
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

export const fetchBuyerMobileNumber = contactInfoObject => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_buyer_phone_number`,
                method: 'POST',
                data: contactInfoObject,
                withAuth: false,
            })
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                // return reject(err.response);
                return reject(err);

            });
    });
};