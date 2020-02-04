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
