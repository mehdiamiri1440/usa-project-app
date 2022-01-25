import React, { useEffect } from 'react';
import { Text } from 'react-native'
import {
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';
import RBSheet from "react-native-raw-bottom-sheet";
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import {
    permissions
} from '../../utils';

const options = {
    width: 300,
    height: 400,
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 1,
    title: 'تصویر را انتخاب کنید',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

const ChooseImage = React.forwardRef((props, ref) => {

    const {
        isOpen
    } = props;



    const selectImage = async buttonIndex => {

        const Errors = [
            {
                id: 1,
                text: locales('errors.imageSizeError')
            },
            {
                id: 2,
                text: locales('labels.somethingWentWrong')
            },
            {
                id: 3,
                text: locales('labels.hasCanceled')
            },
            {
                id: 4,
                text: locales('labels.noPermission')
            },
        ];

        const isAllowedToOpenCamera = await permissions.requestCameraPermission();

        if (!isAllowedToOpenCamera)
            return reject({
                error: Errors[3]
            });

        const resolver = image => {
            if (image.didCancel)
                return reject(
                    {
                        error: Errors[2],
                        extraData: image.didCancel
                    }
                );

            else if (image.fileSize > 5242880 || image.fileSize < 20480)
                return reject(
                    {
                        error: Errors[0],
                    }
                );

            else if (image.error)
                return reject(
                    {
                        error: Errors[1],
                        extraData: image.error
                    }
                );

            else return resolve(image);
        };

        switch (buttonIndex) {
            case 0: return launchCamera(options, result => resolver(result));
            case 1: return launchImageLibrary(options, result => resolver(result));
            default:
                break;
        };
    }

    return (
        <RBSheet
            ref={ref}
            closeOnDragDown
            closeOnPressMask
            onClose={_ => ref?.current?.close()}
            height={320}
            animationType='fade'
            customStyles={{
                draggableIcon: {
                    backgroundColor: "#000"
                },
                container: {
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    backgroundColor: '#FAFAFA'
                }
            }}
        >
            <FontAwesome5
                onPress={_ => ref?.current?.close()}
                name='times'
                color='#777'
                size={20}
                style={{
                    position: 'absolute',
                    right: 15,
                    top: 10,
                }}
            />
            <Text>sdf</Text>
        </RBSheet>
    )
})

export default ChooseImage;