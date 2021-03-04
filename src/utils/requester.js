import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import RnRestart from 'react-native-restart';

import * as authActions from '../redux/auth/actions';
import configureStore from '../redux/configureStore';
import { dataGenerator } from '../utils';

export const getUrl = (route) => {
    // if (__DEV__) {
    //     if (!RNEmulatorCheck.isEmulator())
    //         return `${REACT_APP_API_ENDPOINT_REAL_DEVICE}/${route}`;
    // }
    // return `http://192.168.1.102:3030/${route}`;
    return `${REACT_APP_API_ENDPOINT_RELEASE}/${route}`;
};


export const getTokenFromStorage = () => {
    const randomToken = `${Math.random()}_${dataGenerator.generateKey('random_token')}_abcdefffmmtteoa`;
    return new Promise((resolve, reject) => {
        try {
            AsyncStorage.getItem('@Authorization').then(result => {
                if (result !== null) {
                    resolve(result);
                }
                else {
                    resolve(randomToken)
                }
            })
                .catch(error => {
                    reject(error)
                })
        }
        catch (e) {
            reject(randomToken)
        }
    })
};


const getRequestHeaders = async () => {
    let token = await getTokenFromStorage()

    if (!token || !token.length)
        token = `${Math.random()}_${dataGenerator.generateKey('random_token')}_abcdefffmmtteoa`;

    return {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${token}`
    };
};



export const redirectToLogin = _ => {
    const store = configureStore();
    store.dispatch(authActions.logOut())
};



export const refreshToken = (route, method, data, withAuth, headers, token) => {
    AsyncStorage.setItem("@Authorization", token)
        .then(_ => fetchAPI({ route, method, data, withAuth }));
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
                // withCredentials: withAuth,
                timeout: 15000,
            })
            .then(async result => {
                resolve(result.data ? result.data : result);
            })
            .catch(err => {
                if (err.response && err.response.status === 401) {

                    const {
                        status,
                        refresh,
                        token
                    } = err.response.data;

                    const conditions = status == false && refresh == true && token && token.length;

                    if (conditions) {
                        refreshToken(route, method, data, withAuth, headers, token)
                    }
                    else {
                        redirectToLogin()
                    }
                }

                if (err.response && err.response.status === 400) {
                    reject(err.response.data);
                }

                else {
                    reject(err);
                }
            });
    })
};
