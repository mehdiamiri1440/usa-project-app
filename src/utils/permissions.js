import { PermissionsAndroid } from 'react-native';

export const requestCameraPermission = () => {
    return new Promise((resolve, reject) => {
        try {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "مجوز دسترسی به دوربین",
                    message:
                        "باسکول برای انتخاب تصویر نیاز به دسترسی دوربین دارد. اجازه می‌دهید ؟",
                    buttonNeutral: "بعدا دوباره بپرس",
                    buttonNegative: "خیر",
                    buttonPositive: "مجاز است"
                }
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
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "مجوز نوشتن در حافظه خارجی",
                    message:
                        "باسکول نیازمند دسترسی به حافظه خارجی است. اجازه می‌دهید ؟",
                    buttonNeutral: "بعدا دوباره بپرس",
                    buttonNegative: "خیر",
                    buttonPositive: "مجاز است"
                }
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
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    title: "مجوز دسترسی به مخاطبین",
                    message:
                        "باسکول نیازمند دسترسی به لیست مخاطبین شما است. اجازه می‌دهید ؟",
                    buttonNeutral: "بعدا دوباره بپرس",
                    buttonNegative: "خیر",
                    buttonPositive: "مجاز است"
                }
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
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: "مجوز ضبط صدا",
                    message:
                        "باسکول نیازمند مجوز صدا است. اجازه می‌دهید ؟",
                    buttonNeutral: "بعدا دوباره بپرس",
                    buttonNegative: "خیر",
                    buttonPositive: "مجاز است"
                }
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