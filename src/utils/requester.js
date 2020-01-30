import axios from 'axios';
import { REACT_APP_API_ENDPOINT } from 'react-native-dotenv'

const getUrl = route => `${REACT_APP_API_ENDPOINT}/${route}`;

const getRequestHeaders = withAuth => {
    return {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest'
    };
};

export const fetchAPI = ({ route, method = 'GET', data = {}, withAuth = true, params = null }) => {
    return new Promise((resolve, reject) => {
        axios
            .request({
                url: getUrl(route),
                method,
                headers: getRequestHeaders(withAuth),
                data,
                params
            })
            .then(result => {
                console.warn('result is==>', result)
                resolve(result.data ? result.data : result);
            })
            .catch(err => {
                console.error('error in connecting to network', err);

                if (err.response && err.response.status === 401) {
                    console.error(route, '401');
                    window.location.pathname = '/login';
                    reject(err);
                } else if (err.response && err.response.status === 400) {
                    reject(err.response.data);
                } else {
                    reject(err);
                }
            });
    });
};
