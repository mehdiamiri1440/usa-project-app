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
                result = JSON.parse(result);
                if (result !== null) {
                    resolve(result);
                }
                else {
                    resolve(randomToken)
                }
            })
                .catch(error => {
                    resolve(randomToken)
                })
        }
        catch (e) {
            resolve(randomToken)
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
    return store.dispatch(authActions.logOut()).then(_ => setTimeout(() => RnRestart.Restart(), 10000))
};



export const refreshToken = (route, method, data, withAuth, headers, token) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem("@Authorization", JSON.stringify(token)).then(result => {
            resolve(true)
        });
    })
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
            .then(result => {
                resolve(result.data ? result.data : result);
            })
            .catch(async err => {
                if (err.response && err.response.status === 401) {

                    const {
                        status,
                        refresh,
                        token
                    } = err.response.data;

                    const conditions = status == false && refresh == true && token && token.length;

                    if (conditions) {
                        const tokenSaved = await refreshToken(route, method, data, withAuth, headers, token)
                        if (tokenSaved) {
                            return fetchAPI({ route, method, data, withAuth })
                                .then(result => resolve(result.data ? result.data : result))
                                .catch(err => reject(err))
                        }
                        else {
                            reject(err)
                        }
                    }
                    else {
                        return redirectToLogin()
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
