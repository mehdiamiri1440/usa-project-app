import { requester } from '../utils';

export const fetchUserProfile = _ => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `user/profile_info`,
                method: 'POST',
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

export const fetchProfileByUserName = user_name => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `load_profile_by_user_name`,
                method: 'POST',
                data: {
                    user_name
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

export const fetchProductsListByUserName = user_name => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_product_list_by_user_name`,
                method: 'POST',
                data: {
                    user_name
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
                // if (err && !err.response)
                //     return reject(err.response);
                return reject(err);


            });
    });
};

export const fetchAccountBalance = _ => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_my_account_balance`,
                method: 'POST',
                withAuth: true,
            })
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                if (err && !err.response)
                    //     return reject(err.response);
                    return reject(err);


            });
    });
};

export const setPhoneNumberViewPermission = permission => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `set_phone_number_view_permission`,
                method: 'POST',
                data: {
                    permission
                },
                withAuth: true,
            })
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                //     return reject(err.response);
                return reject(err);


            });
    });
};

export const fetchUserContactInfoViewers = _ => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_phone_number_viewers_list`,
                method: 'POST',
                withAuth: true,
            })
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                if (err && !err.response)
                    //     return reject(err.response);
                    return reject(err);


            });
    });
};

export const walletElevatorPay = id => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `wallet-expend/elevator`,
                method: 'POST',
                data: { product_id: id },
                withAuth: true,
            })
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                //     return reject(err.response);
                return reject(err);


            });
    });
};