import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { Toast } from 'native-base';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import RnRestart from 'react-native-restart';

import * as authActions from '../redux/auth/actions';
import configureStore from '../redux/configureStore';
import { dataGenerator } from '../utils';

const store = configureStore();

let apiCallsCount = 0;

export const getUrl = (route) => `${REACT_APP_API_ENDPOINT_RELEASE}/${route}`

export const getTokenFromStorage = () => {
    return new Promise((resolve, reject) => {
        const randomToken = `${Math.random()}_${dataGenerator.generateKey('random_token')}_abcdefffmmtteoa`;
        try {
            AsyncStorage.getItem('@Authorization')
                .then(result => {
                    result = JSON.parse(result);
                    if (!!result && result.length) {
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

const getRequestHeaders = async (withAuth) => {

    let token = await getTokenFromStorage();

    if (!token || !token.length)
        token = `${Math.random()}_${dataGenerator.generateKey('random_token')}_abcdefffmmtteoa`;
    // console.log('token in getequestHeaders()', token)

    let headerObject = {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest',
    };

    if (withAuth)
        headerObject.Authorization = `Bearer ${token}`;

    return headerObject;
};

export const redirectToLogin = msg => {
    store.dispatch(authActions.logOut()).then(_ => {
        RnRestart.Restart();
    })
        .catch(_ => {
            RnRestart.Restart();

        })
};

export const refreshToken = (route, method, data, withAuth, headers, token) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem("@Authorization", JSON.stringify(token)).then(result => {
            resolve(true)
        });
    })
};

const checkInternetConnectivity = _ => NetInfo.fetch().then(({
    isInternetReachable,
    isConnected
}) => {
    if (!isConnected || !isInternetReachable) {
        Toast.show({
            text: locales('labels.lostInternetConnection'),
            position: "bottom",
            style: {
                borderRadius: 10,
                bottom: 100, width: '90%',
                alignSelf: 'center', textAlign: 'center'
            },
            textStyle: {
                fontFamily: 'IRANSansWeb(FaNum)_Light',
                textAlign: 'center'
            },
            duration: 3000
        });
    }
}
);

export const fetchAPI = async ({ route, method = 'GET', data = {}, withAuth = true, params = null, onUploadProgress = _ => { } }) => {
    checkInternetConnectivity();
    const headers = await getRequestHeaders(withAuth);
    // console.log('route', route, 'headers', headers)
    return new Promise((resolve, reject) => {
        axios
            .request({
                url: getUrl(route),
                method,
                headers,
                data,
                params,
                // withCredentials: withAuth,
                timeout: 20000,
                onUploadProgress,
            })
            .then(result => {
                // console.log('route', route, 'result happened', result)
                resolve(result.data ? result.data : result);
            })
            .catch(async err => {
                if (err.response && err.response.status === 401) {

                    const {
                        status,
                        refresh,
                        msg = '',
                        redirect_to_login,
                        token = ''
                    } = err.response.data;

                    const conditions = status == false && refresh == true && token && !!token.length;
                    // console.log('route', route, 'conditions', conditions, 'status', status, 'refresh', refresh, 'token', token, 'token.length', token.length)
                    if (conditions) {
                        const tokenSaved = await refreshToken(route, method, data, withAuth, headers, token)
                        // console.log('new token saved', tokenSaved)
                        if (tokenSaved === true) {
                            // console.log('going to do new api call with new token')
                            resolve(fetchAPI({ route, method, data, withAuth, onUploadProgress }));
                            // .then(result => resolve(result.data ? result.data : result))
                            // .catch(err => reject(err))
                        }
                        else {
                            // console.log('111', 'route', route, err, err.response)
                            reject(err)
                        }
                    }
                    else {
                        // console.log('conditions were false and redirect happened with this route-->>', route)
                        // console.log('2222', 'route', route, err, err.response)
                        redirectToLogin(msg);
                    }
                }

                else if (err.response && err.response.status === 400) {
                    reject(err.response.data);
                }

                else if (err.response && err.response.status === 403) {
                    if (apiCallsCount >= 1)
                        return redirectToLogin();
                    apiCallsCount = apiCallsCount + 1;
                    // console.log('333', 'route', route, err, err?.status, err.response)
                    resolve(fetchAPI({ route, method, data, withAuth, onUploadProgress }));
                    reject(err);
                }

                else {
                    // console.log('4444', 'route', route, err, err?.status, err.response)
                    // console.log('something unknowns', err)
                    reject(err);
                }
            });
    })
};
