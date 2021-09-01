import React, {
    useState,
    useEffect
}
    from 'react';
import {
    Text,
    Pressable,
    BackHandler,
    Platform,
    Image,
    View,
    Text,
    StyleSheet,
    ImageBackground
}
    from 'react-native';
import Share from 'react-native-share';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { permissions } from '../../utils';

const ShareToSocial = props => {

    const [imageSizeError, setImageSizeError] = useState('');

    const onActionSheetClicked = async (buttonIndex, index) => {
        const options = {
            width: 300,
            height: 400,
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 1,
            title: 'تصویر را انتخاب کنید',
            base64: true,
            includeBase64: true,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        switch (buttonIndex) {
            case 0: {
                const isAllowedToOpenCamera = await permissions.requestCameraPermission();

                if (!isAllowedToOpenCamera)
                    return;

                launchCamera(options, image => {
                    if (image.didCancel)
                        return;
                    else if (image.error)
                        return;

                    if (image.fileSize > 5242880 || image.fileSize < 20480) {
                        return setImageSizeError('');
                    }
                    const source = { uri: image.uri };

                    let resultObj = {
                        uri: image.uri,
                        type: image.type,
                        size: image.fileSize,
                        name: image.fileName
                    }
                });
                break;
            }
            case 1: {
                launchImageLibrary(options, image => {
                    if (image.didCancel)
                        return;
                    else if (image.error)
                        return;

                    if (image.fileSize > 5242880 || image.fileSize < 20480) {
                        return setImageSizeError('');
                    }

                    const source = { uri: image.uri };
                    state.avatarSource = source;
                    let resultObj = {
                        uri: image.uri,
                        type: image.type,
                        size: image.fileSize,
                        name: image.fileName
                    }
                    const result = await permissions.requestWriteToExternalStoragePermission();
                    if (result) {
                        console.log(image)
                        let shareOptions = {
                            // title: 'Share via',
                            // url: `data:${image.type};base64,` + image.base64, //or you can use "data:" link
                            // social: Share.Social.WHATSAPP,
                            // message: 'bab',
                            // whatsAppNumber: "989118413054",  // country code + phone number

                            backgroundImage: `data:${image.type};base64,` + image.base64, //or you can use "data:" link
                            backgroundBottomColor: 'orange',
                            backgroundTopColor: 'blue',
                            message: 'aaa', //in beta
                            captionText: 'gello', //in beta
                            recipient: '+989217985653',
                            subject: 'nnn', //in beta
                            title: 'vvv', //in beta
                            attributionURL: 'mmm', //in beta
                            instagramCaption: "for insta",
                            social: Share.Social.INSTAGRAM_STORIES
                        };


                        Share.shareSingle(shareOptions).then(ShareResponse => { }).catch(err => { });
                    };
                });
                break;
            }
            default:
                break;
        }

    };

    return (
        <Text>
            gherg
        </Text>
    )
};

export default ShareToSocial;