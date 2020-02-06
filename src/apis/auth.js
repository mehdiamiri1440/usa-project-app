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
                resolve(result);
            })
            .catch(err => {
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
                resolve(result);
            })
            .catch(err => {
                return reject(err.response);
            });
    });
};
