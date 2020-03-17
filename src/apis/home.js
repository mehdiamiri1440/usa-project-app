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
                return reject(err.response);
            });
    });
};

