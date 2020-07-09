import { requester } from '../utils';


export const fetchAllProductsList = item => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `user/get_product_list`,
                method: 'POST',
                data: item,
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                return reject(err.response);
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
                return reject(err.response);
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
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                return reject(err.response);
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
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                return reject(err.response);
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
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                return reject(err.response);
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
                return reject(err.response);
            });
    });
};



export const setProductDetailsId = id => {
    return new Promise((resolve, reject) => {
        if (id) {
            resolve(id)
        }
        else {
            reject(false)
        }
    });
};

