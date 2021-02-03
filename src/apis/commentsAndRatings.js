import { requester } from '../utils';

export const fetchAllComments = userId => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `profile/get-user-comments`,
                method: 'POST',
                data: { user_id: userId },
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

export const submitRating = rateObj => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `profile/add-comment`,
                method: 'POST',
                data: rateObj,
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

export const checkUserAuthorityToPostComment = userId => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `profile/is-user-authorized-to-post-comment`,
                method: 'POST',
                data: { user_id: userId },
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
