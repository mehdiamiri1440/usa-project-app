import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import RnRestart from 'react-native-restart';
import * as authActions from '../redux/auth/actions';
import configureStore from '../redux/configureStore';

export const getUrl = (route) => {
    // if (__DEV__) {
    //     if (!RNEmulatorCheck.isEmulator())
    //         return `${REACT_APP_API_ENDPOINT_REAL_DEVICE}/${route}`;
    // }
    // return `http://192.168.1.102:3030/${route}`;

    return `http://192.168.1.12:3030/${route}`

};


getTokenFromStorage = () => {
    return new Promise((resolve, reject) => {
        try {
            AsyncStorage.getItem('@Authorization').then(result => {
                if (result !== null) {
                    resolve(result);
                }
                else {
                    resolve('')
                }
            })
        }
        catch (e) {
            reject('')
        }
    })
};


const getRequestHeaders = async () => {
    let token = await getTokenFromStorage()
    return {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${token}`
    };
};



const redirectToLogin = _ => {
    const store = configureStore();
    AsyncStorage.removeItem('@Authorization').then(_ => {
        return store.dispatch(authActions.logOut()).then(_ => {
            RnRestart.Restart();
        })
    })
};



const refreshToken = (route, method, data, withAuth, headers) => {
    axios.post(`${REACT_APP_API_ENDPOINT_RELEASE}/refresh-token`,
        undefined, { headers })
        .then(result => {
            const token = result.data.token
            AsyncStorage.setItem("@Authorization", token).then(_ => {
                fetchAPI({ route, method, data, withAuth })
            })
        })
        .catch(_ => redirectToLogin())
};


export const fetchAPI = async ({ route, method = 'GET', data = {}, withAuth = true, params = null }) => {
    const headers = await getRequestHeaders();
    return new Promise((resolve, reject) => {
        axios
            .request({
                url: getUrl(route),
                method,
                headers,
                data,
                params,
                timeout: 5000,
            })
            .then(result => {
                resolve(result.data ? result.data : result);
            })
            .catch(err => {
                if (err.response && err.response.status === 401) {
                    if (err.response.data.refresh)
                        refreshToken(route, method, data, withAuth, headers)
                    else redirectToLogin()
                }


                if (err.response && err.response.status === 400) {
                    reject(err.response.data);
                }

                else {
                    reject(err);
                }
            });
    });
};
