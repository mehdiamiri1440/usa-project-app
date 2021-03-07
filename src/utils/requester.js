import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import RnRestart from 'react-native-restart';

import * as authActions from '../redux/auth/actions';
import configureStore from '../redux/configureStore';
import { dataGenerator } from '../utils';
var RNFS = require('react-native-fs');

var path = RNFS.ExternalCachesDirectoryPath + '/test.txt';
const store = configureStore();

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


export const getRequestHeaders = ({ route, method = 'GET', data = {}, withAuth = true, params = null }) => {
    return new Promise(async (resolve, reject) => {
        let token = await getTokenFromStorage()
        if (!token || !token.length)
            token = `${Math.random()}_${dataGenerator.generateKey('random_token')}_abcdefffmmtteoa`;
        RNFS.appendFile(path, `token in getequestHeaders()-->${token}`, 'utf8')
            .then((success) => {
                console.log('FILE WRITTEN!');
            })
            .catch((err) => {
                console.log(err.message);
            });
        // console.log('token in getequestHeaders()', token)
        const headers = {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': `Bearer ${token}`
        };
        return fetchAPI({ route, method, data, withAuth, params, headers })
            .then(result => {
                console.warn('res------->>', result)
                resolve(result.data ? result.data : result);
            }
            )
            .catch(error => reject(error))
    })
};



export const redirectToLogin = _ => {
    return new Promise((resolve, reject) => {
        RNFS.appendFile(path, `redirected`, 'utf8')
            .then((success) => {
                console.log('FILE WRITTEN!');
            })
            .catch((err) => {
                console.log(err.message);
            });
        // console.log('redirected');
        store.dispatch(authActions.logOut()).then(_ => {
            RNFS.appendFile(path, `logout after redirection`, 'utf8')
                .then((success) => {
                    console.log('FILE WRITTEN!');
                })
                .catch((err) => {
                    console.log(err.message);
                });
            // console.log('logout after redirection')
            resolve(true)
        })
            .catch(_ => resovle(true));
    })
}



export const refreshToken = (route, method, data, withAuth, headers, token) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem("@Authorization", JSON.stringify(token)).then(result => {
            resolve(true)
        });
    })
};


export const fetchAPI = async ({ route, method = 'GET', data = {}, withAuth = true, params = null, headers = {} }) => {
    return new Promise((resolve, reject) => {
        RNFS.appendFile(path, `route in first of fetchapi====>${route}----->>headers in first of fetchapi----->>${headers.Authorization}`, 'utf8')
            .then((success) => {
                console.log('FILE WRITTEN!');
            })
            .catch((err) => {
                console.log(err.message);
            });
        // console.log('route', route, 'headers', headers)
        axios
            .request({
                url: getUrl(route),
                method,
                headers,
                data,
                params,
                // withCredentials: withAuth,
                timeout: 20000,
            })
            .then(result => {
                RNFS.appendFile(path, `route in result---->${route}--->result happended---->${result}`, 'utf8')
                    .then((success) => {
                        console.log('FILE WRITTEN!');
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
                // console.log('route', route, 'result happened', result)
                resolve(result.data ? result.data : result);
            })
            .catch(async err => {
                if (err.response && err.response.status === 401) {

                    const {
                        status,
                        refresh,
                        token = ''
                    } = err.response.data;

                    const conditions = status == false && refresh == true && token && !!token.length;
                    // console.log('conditions', conditions, 'status', status, 'refresh', refresh, 'token', token, 'token.length', token.length)
                    RNFS.appendFile(path, `conditions--->>${conditions}---->>status---->>${status}---->>refresh---->${refresh}---->>token---->${token}----->token.length---->>${token.length}`, 'utf8')
                        .then((success) => {
                            console.log('FILE WRITTEN!');
                        })
                        .catch((err) => {
                            console.log(err.message);
                        });
                    if (conditions) {
                        const tokenSaved = await refreshToken(route, method, data, withAuth, headers, token)
                        // console.log('new token saved', tokenSaved)
                        RNFS.appendFile(path, `new token saved ---->>${tokenSaved}`, 'utf8')
                            .then((success) => {
                                console.log('FILE WRITTEN!');
                            })
                            .catch((err) => {
                                console.log(err.message);
                            });
                        if (tokenSaved === true) {
                            RNFS.appendFile(path, `going to do new api call with new token`, 'utf8')
                                .then((success) => {
                                    console.log('FILE WRITTEN!');
                                })
                                .catch((err) => {
                                    console.log(err.message);
                                });
                            // console.log('going to do new api call with new token')
                            return getRequestHeaders({ route, method, data, withAuth, params })
                                .then(result => resolve(result.data ? result.data : result))
                                .catch(err => reject(err))
                        }
                        else {
                            RNFS.appendFile(path, `new token not saved`, 'utf8')
                                .then((success) => {
                                    console.log('FILE WRITTEN!');
                                })
                                .catch((err) => {
                                    console.log(err.message);
                                });
                            // console.log('new token not saved')
                            reject(err)
                        }
                    }
                    else {
                        RNFS.appendFile(path, `conditions were fasel and redirect happened with this route------->>${route}`, 'utf8')
                            .then((success) => {
                                console.log('FILE WRITTEN!');
                            })
                            .catch((err) => {
                                console.log(err.message);
                            });
                        // console.log('conditions were false and redirect happened with this route-->>', route)
                        const tokenOmitted = await redirectToLogin();
                        if (tokenOmitted === true)
                            RnRestart.Restart();
                    }
                }

                if (err.response && err.response.status === 400) {
                    reject(err.response.data);
                }

                else {
                    RNFS.appendFile(path, `something unknown happened`, 'utf8')
                        .then((success) => {
                            console.log('FILE WRITTEN!');
                        })
                        .catch((err) => {
                            console.log(err.message);
                        });
                    // console.log('something unknowns', err)
                    reject(err);
                }
            });
    })
};
