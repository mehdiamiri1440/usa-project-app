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


export const logOut = () => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `logout`,
                method: 'GET',
                withAuth: false,
            })
            .then(async (result) => {
                result = await AsyncStorage.removeItem('@Authorization')
                console.warn('result', result)
                resolve(result);
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


export const fetchAllActivityZones = () => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_category_list`,
                method: 'POST',
                withAuth: false,
            })
            .then(result => {
                console.warn('result===>', result)
                resolve(result);
            })
            .catch(err => {
                return reject(err.response);
            });
    });
};


export const submitRegister = ({
    phone,
    first_name,
    last_name,
    password,
    user_name,
    sex,
    province,
    city,
    activity_type = '',
    // national_code,
    category_id
}) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `api/v1/users`,
                method: 'POST',
                withAuth: false,
                data: {
                    phone,
                    first_name,
                    last_name,
                    password,
                    user_name,
                    sex,
                    province,
                    city,
                    activity_type,
                    // national_code,
                    category_id
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
