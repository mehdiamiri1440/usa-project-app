import { PermissionsAndroid } from 'react-native';

export const requestCameraPermission = () => {
    return new Promise((resolve, reject) => {
        try {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
            ).then(granted => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    resolve(true)
                }
                else {
                    resolve(false)
                }
            });
        }
        catch (err) {
            resolve(false)
        }
    })
};

export const requestWriteToExternalStoragePermission = () => {
    return new Promise((resolve, reject) => {
        try {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            ).then(granted => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    resolve(true)
                }
                else {
                    resolve(false)
                }
            });
        }
        catch (err) {
            resolve(false)
        }
    })
};

export const requestContactsPermission = () => {
    return new Promise((resolve, reject) => {
        try {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS
            ).then(granted => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    resolve(true)
                }
                else {
                    resolve(false)
                }
            });
        }
        catch (err) {
            resolve(false)
        }
    })
};

export const requestVoicePermission = () => {
    return new Promise((resolve, reject) => {
        try {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
            ).then(granted => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    resolve(true)
                }
                else {
                    resolve(false)
                }
            });
        }
        catch (err) {
            resolve(false)
        }
    })
};