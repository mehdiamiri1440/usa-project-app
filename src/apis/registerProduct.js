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
