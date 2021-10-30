import AsyncStorage from '@react-native-async-storage/async-storage';
import { requester } from '../utils';
import RnRestart from 'react-native-restart';
import DeviceInfo from 'react-native-device-info';

const device_id = DeviceInfo.getUniqueId();

const storeData = (payload) => {
    return new Promise((resolve, _) => {
        AsyncStorage.removeItem('@productsList')
        if (payload.token)
            AsyncStorage.setItem('@Authorization', JSON.stringify(payload.token)).then(_ => {
                resolve(payload);
            })
        else
            AsyncStorage.removeItem('@Authorization').then(_ => {
                resolve(payload);
            })
    })
};

export const login = (mobileNumber, password) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `dologin`,
                method: 'POST',
                withAuth: false,
                data: {
                    device_id,
                    phone: mobileNumber,
                    password,
                    client: 'mobile'
                }
            })
            .then(result => {
                storeData(result).then(payload => resolve(payload))
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};


export const fastLogin = (result) => {
    return new Promise((resolve, reject) => {
        storeData(result).then(payload => resolve(payload))
    })
};


export const logOut = () => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `logout`,
                method: 'GET',
                withAuth: true,
            })
            .then(result => {
                AsyncStorage.multiRemove(['@Authorization', 'persist:root']).then(res => {
                    resolve(result);
                })
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
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
                    client: 'mobile',
                    device_id,
                }
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                // return reject(err.response);
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
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};


export const changeRole = () => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `switch-role`,
                method: 'POST',
                // data:{rollName},
                withAuth: true,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};



export const setEvidences = evidences => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `verify/upload-photos`,
                method: 'POST',
                data: evidences,
                withAuth: true,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
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
    category_id,
    verification_code
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
                    category_id,
                    verification_code
                }
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                // return reject(err.response);
                return reject(err);

            });
    });
};
