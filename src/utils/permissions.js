import { PermissionsAndroid } from 'react-native';

export const requestCameraPermission = () => {
    return new Promise((resolve, reject) => {
        try {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "مجوز دسترسی به دوربین",
                    message:
                        "باسکول برای انتخاب عکس نیاز به دسترسی دوربین دارد. اجازه می‌دهید ؟",
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