import { requester } from '../utils';


export const fetchAllCategories = (cascade_list) => {
    // console.warn('casesac', cascade_list)
    if (cascade_list == undefined || typeof cascade_list == 'undefined' || cascade_list == null) {
        cascade_list = true;
    }
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_category_list`,
                method: 'POST',
                data: { cascade_list },
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && err.response)
                    return reject(err.response);
                return reject(err);

            });
    });
};

export const fetchAllSubCategories = id => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_category_list`,
                method: 'POST',
                data: {
                    parent_id: id
                },
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && err.response)
                    return reject(err.response);
                return reject(err);

            });
    });
};

export const addNewProduct = productObject => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `user/add_product`,
                method: 'POST',
                data: productObject,
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && err.response)
                    return reject(err.response);
                return reject(err);

            });
    });
};

export const checkUserPermissionToRegisterProduct = () => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `is_user_allowed_to_register_product`,
                method: 'POST',
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && err.response)
                    return reject(err.response);
                return reject(err);

            });
    });
};


export const registerBuyAdRequest = requestObj => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `user/add_buyAd`,
                method: 'POST',
                data: requestObj,
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && err.response)
                    return reject(err.response);
                return reject(err);

            });
    });
};
