import React from 'react';
import {
    Text,
    View
} from 'react-native'
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
        isOpen,
        closeSheet = _ => { }
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

        if (!isAllowedToOpenCamera) {
            image = { error: Errors[3] }
            return closeSheet();
        }
        const resolver = image => {
            if (image.didCancel)

                image = {
                    error: Errors[2],
                    extraData: image.didCancel
                }

            else if (image.fileSize > 5242880 || image.fileSize < 20480)

                image = { error: Errors[0] }


            else if (image.error)
                image = {
                    error: Errors[1],
                    extraData: image.error
                }
            closeSheet(image && image.assets && image.assets.length ? image.assets[0] : undefined);
        };

        switch (buttonIndex) {
            case 0: return launchCamera(options, result => resolver(result));
            case 1: return launchImageLibrary(options, result => resolver(result));
            default:
                break;
        };
    }

    if (!isOpen)
        return null;
    return (
        <RBSheet
            ref={ref}
            closeOnDragDown
            closeOnPressMask
            onClose={_ => closeSheet()}
            height={150}
            animationType='fade'
            customStyles={{
                draggableIcon: {
                    backgroundColor: "#000"
                },
                container: {
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    backgroundColor: '#FAFAFA',
                }
            }}
        >
            <FontAwesome5
                onPress={_ => closeSheet()}
                name='times'
                color='#777'
                size={20}
                style={{
                    position: 'absolute',
                    right: 15,
                    top: 10,
                }}
            />
            <View
                style={{
                    flexDirection: 'row-reverse',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10
                }}
            >
                <FontAwesome5
                    name='camera'
                    size={20}
                    solid
                    color='#bebebe'
                />
                <Text
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)',
                        fontSize: 20,
                        marginHorizontal: 5,
                    }}

                    onPress={_ => selectImage(0)}
                >
                    {locales('labels.camera')}
                </Text>
            </View>
            <View
                style={{
                    flexDirection: 'row-reverse',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10
                }}
            >
                <FontAwesome5
                    name='images'
                    size={20}
                    solid
                    color='#bebebe'
                />
                <Text
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)',
                        fontSize: 20,
                        marginHorizontal: 5,
                    }}

                    onPress={_ => selectImage(1)}
                >
                    {locales('labels.gallery')}
                </Text>
            </View>
        </RBSheet>
    )
})

export default ChooseImage;