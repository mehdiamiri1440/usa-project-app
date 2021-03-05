import { requester } from '../utils';


export const fetchAllDashboardData = () => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_seller_dashboard_required_data`,
                method: 'POST',
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


export const fetchPackagesPrices = () => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `/payment/get-packages-price`,
                method: 'POST',
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

