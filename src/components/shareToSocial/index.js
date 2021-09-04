import Share from 'react-native-share';
import RNFetchBlob from "rn-fetch-blob";

import { permissions } from '../../utils';


export const shareToSocial = async (type = 'whatsApp', image = '', url = '', phone = '') => {

    if (phone && phone.length && phone.startsWith('0') || phone.startsWith('+')) {
        phone = phone.substr(1).replace(/ /g, '');
    }

    if (!image)
        return;

    const result = await permissions.requestWriteToExternalStoragePermission();
    if (result) {
        let shareOptions = {};

        if (type == 'whatsApp') {
            const res = await RNFetchBlob.fetch("GET", image);
            let base64Str = res.base64();
            shareOptions = {
                title: url,
                url: `data:image/png;base64,` + base64Str,
                social: Share.Social.WHATSAPP,
                message: url,
            };
            if (phone && phone.length)
                shareOptions.whatsAppNumber = phone;
        }

        else if (type == 'instagramStory') {
            image = image.split(';base64,');
            shareOptions = {
                backgroundImage: `${image[0] + ';base64,'}` + image[1],
                social: Share.Social.INSTAGRAM_STORIES,
            }
        }

        console.log('share', shareOptions)
        Share.shareSingle(shareOptions)
            .then((res) => { console.warn(res) })
            .catch((err) => { err && console.warn(err); });
    };

};