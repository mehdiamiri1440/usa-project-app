import { requester } from '../utils';

// export const fetchAllFinancialTransactions = query => {
//     return new Promise((resolve, reject) => {
//         requester
//             .fetchAPI({
//                 route: `v1/financialTransaction?${query}`,
//                 method: 'GET',
//                 withAuth: true
//             })
//             .then(result => {
//                 resolve(result.payload);
//             })
//             .catch(err => {
//                 console.log('fetch financial transactions error', err);
//                 reject(err);
//             });
//     });
// };
// export const fetchFinancialTransactionDetails = id => {
//     return new Promise((resolve, reject) => {
//         requester
//             .fetchAPI({
//                 route: `v1/financialTransaction/${id}`,
//                 method: 'GET',
//                 withAuth: true
//             })
//             .then(result => {
//                 resolve(result.payload);
//             })
//             .catch(err => {
//                 console.log('fetch financial transaction error', err);
//                 reject(err);
//             });
//     });
// };
