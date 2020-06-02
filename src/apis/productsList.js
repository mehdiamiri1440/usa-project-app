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

