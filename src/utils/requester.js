import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { REACT_APP_API_ENDPOINT } from 'react-native-dotenv'

const getUrl = route => `http://192.168.0.104:3030/${route}`;
getData = async () => {
    try {
        const value = await AsyncStorage.getItem('@Authorization')
        if (value !== null) {
            return value
        }
    } catch (e) {
        return null
    }
}
const getRequestHeaders = withAuth => {
    let token = getData()
    return {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${token}`
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
                resolve(result.data ? result.data : result);
            })
            .catch(err => {
                console.warn('error==>', err, 'error.response==>', err.response)
                if (err.response && err.response.status === 400) {
                    reject(err.response.data);
                } else {
                    reject(err);
                }
            });
    });
};
