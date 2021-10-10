import Share from 'react-native-share';
import RNFetchBlob from "rn-fetch-blob";
import { ToastAndroid } from 'react-native';

import { permissions } from '../../utils';


export const shareToSocial = async (type = 'whatsApp', image = '', url = '', phone = '', title = '') => {

    if (phone && phone.length && phone.startsWith('0') || phone.startsWith('+')) {
        phone = phone.substr(1).replace(/ /g, '');
    }

    if (!image)
        return;

    const result = await permissions.requestWriteToExternalStoragePermission();
    if (result) {
        let shareOptions = {};

        if (type == 'whatsApp' || type == 'telegram') {
            const res = await RNFetchBlob.fetch("GET", image);
            let base64Str = res.base64();

            if (title && title.length)
                url = `*${title}*\n\n${url}`;

            shareOptions = {
                title: url,
                url: `data:image/png;base64,` + base64Str,
                social: Share.Social[type.toUpperCase()],
                message: url,
                applicationName: type == 'telegram' ? "org.telegram.messenger" : "com.whatsapp"
            };
            if (phone && phone.length)
                shareOptions.whatsAppNumber = phone;
        }

        else if (type == 'instagramStory') {
            image = image.split(';base64,');
            shareOptions = {
                backgroundImage: `${image[0] + ';base64,'}` + image[1],
                social: Share.Social.INSTAGRAM_STORIES,
                applicationName: 'com.instagram.android'
            }
        }
        Share.isPackageInstalled(shareOptions.applicationName)
            .then((response) => {
                if (response && response.isInstalled == true)
                    return Share.shareSingle(shareOptions)
                        .then((res) => { })
                        .catch((err) => { });

                return ToastAndroid.showWithGravityAndOffset(
                    locales('titles.appNotFound'),
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
            })
            .catch((error) => {
                console.log(error);
                // { error }
            });
    };

};