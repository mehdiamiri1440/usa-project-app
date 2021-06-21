import { requester } from '../utils';


export const fetchAllProductsList = (item, special_products, isLoggedIn = true) => {
    return new Promise((resolve, reject) => {
        const route = isLoggedIn ? `app/get_product_list` : `user/get_product_list`;
        requester
            .fetchAPI({
                route,
                method: 'POST',
                data: { ...item, special_products: special_products ? true : false },
                withAuth: !!isLoggedIn,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};



export const fetchAllRelatedProducts = id => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_related_products`,
                method: 'POST',
                data: { product_id: id },
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};



export const fetchAllMyProducts = user_name => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_product_list_by_user_name`,
                method: 'POST',
                data: { user_name },
                withAuth: true,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};



export const editProduct = item => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `edit_product`,
                method: 'POST',
                data: item,
                withAuth: true,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};


export const deleteProduct = id => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `delete_product_by_id`,
                method: 'POST',
                data: { product_id: id },
                withAuth: true,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};


export const fetchProductDetails = id => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_product_by_id`,
                method: 'POST',
                data: { product_id: id },
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};



export const fetchSellerMobileNumber = contactInfoObject => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_seller_phone_number`,
                method: 'POST',
                data: contactInfoObject,
                withAuth: true,
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


export const sendReplytoProduct = replyObj => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `send_reply_to_product`,
                method: 'POST',
                data: replyObj,
                withAuth: true,
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