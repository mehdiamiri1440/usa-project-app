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
                if (err && err.response)
                    return reject(err.response);
                return reject(err);

            });
    });
};


export const fastLogin = (payload) => {
    return new Promise((resolve, reject) => {
        storeData = async () => {
            if (payload.token)
                await AsyncStorage.setItem('@Authorization', payload.token)
            else
                await AsyncStorage.removeItem('@Authorization')
            resolve(payload);
        }
        storeData()
    })
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
                resolve(result);
            })
            .catch(err => {
                if (err && err.response)
                    return reject(err.response);
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
                if (err && err.response)
                    return reject(err.response);
                return reject(err);

            });
    });
};


export const checkActivisionCode = (code, mobileNumber) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `verify_code`,
                method: 'POST',
                withAuth: false,
                data: {
                    phone: mobileNumber,
                    verification_code: code,
                }
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && err.response)
                    return reject(err.response);
                return reject(err);

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
                resolve(result);
            })
            .catch(err => {
                if (err && err.response)
                    return reject(err.response);
                return reject(err);

            });
    });
};


export const changeRoll = (rollName) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_category_list`,
                method: 'POST',
                // data:{rollName},
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && err.response)
                    return reject(err.response);
                return reject(err);

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
                if (err && err.response)
                    return reject(err.response);
                return reject(err);

            });
    });
};
