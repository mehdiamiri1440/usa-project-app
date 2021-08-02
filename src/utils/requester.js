import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { REACT_APP_API_ENDPOINT, REACT_APP_API_ENDPOINT_REAL_DEVICE, REACT_APP_API_ENDPOINT_RELEASE, REACT_APP_API_MAIN_DOMAIN } from 'react-native-dotenv';
import RNEmulatorCheck from 'react-native-emulator-check'


const getUrl = route => {
    // if (__DEV__) {
    //     if (!RNEmulatorCheck.isEmulator())
    //         return `${REACT_APP_API_ENDPOINT_REAL_DEVICE}/${route}`;
    // }
    // return `http://192.168.1.102:3030/${route}`;

    return `https://www.alidelkhosh.ir/${route}`

};
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
                params,
                timeout: 5000,
            })
            .then(result => {
                resolve(result.data ? result.data : result);
            })
            .catch(err => {
                if (err.response && err.response.status === 400) {
                    reject(err.response.data);
                } else {
                    reject(err);
                }
            });
    });
};
