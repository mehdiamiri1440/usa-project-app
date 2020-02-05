import AsyncStorage from '@react-native-community/async-storage';
import { requester } from '../utils';

export const login = (mobileNumber, password) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `dologin`,
                method: 'POST',
                withAuth: false,
                data: {
                    phone: mobileNumber,
                    password
                }
            })
            .then(result => {
                console.warn('login successfully', result);
                storeData = async () => {
                    if (result.token)
                        await AsyncStorage.setItem('@Authorization', result.token)
                    else
                        await AsyncStorage.removeItem('@Authorization')
                    resolve(result);
                }
                storeData()
            })
            .catch(err => {
                console.warn('login error', err);
                return reject(err);
            });
    });
};


export const checkAlreadySingedUpMobileNumber = (mobileNumber) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `send_verification_code`,
                method: 'POST',
                withAuth: false,
                data: {
                    phone: mobileNumber,
                }
            })
            .then(result => {
                console.warn('singup successfully', result);
                resolve(result);
            })
            .catch(err => {
                console.warn('singup error', err.response);
                return reject(err.response);
            });
    });
};


export const checkActivisionCode = (code) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `verify_code`,
                method: 'POST',
                withAuth: false,
                data: {
                    verification_code: code,
                }
            })
            .then(result => {
                console.warn('verified successfully', result);
                resolve(result);
            })
            .catch(err => {
                console.warn('verify error', err.response);
                return reject(err.response);
            });
    });
};
