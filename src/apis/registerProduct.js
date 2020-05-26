import { requester } from '../utils';


export const fetchAllCategories = () => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_category_list`,
                method: 'POST',
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
                return reject(err.response);
            });
    });
};

export const addNewProduct = productObject => {
    console.log('product object in api',productObject)
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `user/add_product`,
                method: 'POST',
                data: productObject,
                withAuth: false,
            })
            .then(result => {
                console.warn('registeeereeedd----->', result)
                resolve(result);
            })
            .catch(err => {
                console.log('mes', err.message)
                console.log('res', err.response)
                console.log('req', err.request)
                console.log('not registereed----->', err)
                return reject(err.response);
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
                return reject(err.response);
            });
    });
};
