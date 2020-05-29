import { requester } from '../utils';


export const fetchAllProductsList = item => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `user/get_product_list`,
                method: 'POST',
                daa:item,
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

