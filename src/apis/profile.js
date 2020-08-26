import { requester } from '../utils';

export const fetchUserProfile = _ => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `user/profile_info`,
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

export const isUserAllowedToSendMessage = id => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_user_permission_for_buyAd_reply`,
                method: 'POST',
                data: {
                    buy_ad_id: id

                },
                withAuth: true,
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

export const fetchProfileStatistics = user_name => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_user_statistics_by_user_name`,
                method: 'POST',
                data: {
                    user_name
                },
                withAuth: true,
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

export const fetchProfileByUserName = user_name => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `load_profile_by_user_name`,
                method: 'POST',
                data: {
                    user_name
                },
                withAuth: true,
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

export const fetchProductsListByUserName = user_name => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_product_list_by_user_name`,
                method: 'POST',
                data: {
                    user_name
                },
                withAuth: true,
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

export const editProfile = item => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `user/profile_modification`,
                method: 'POST',
                data: item,
                withAuth: true,
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