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
                return reject(err);
            });
    });
};