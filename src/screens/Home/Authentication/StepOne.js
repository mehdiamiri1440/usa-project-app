import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Pressable, BackHandler } from 'react-native';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth, deviceHeight } from '../../../utils';
import ChooseImage from '../../../components/cameraActionSheet';
import { BuskoolButton } from '../../../components';

const StepOne = props => {

    const ref = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [idCard, setIdCard] = useState({});
    const [idCardError, setIdCardError] = useState('');

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonPressed);
        if (props.idCard)
            setIdCard(props.idCard);
        return _ => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPressed);
        }
    }, []);

    const handleBackButtonPressed = _ => {
        return false;
    };

    const chooseImage = image => {
        try {
            if (!image || image.error)
                return;

            let resultObj = {
                uri: image.uri,
                type: image.type,
                size: image.fileSize,
                name: image.fileName
            }
            setIdCardError('');
            setIdCard(resultObj);

        }
        catch (error) {
            if (error && error.error && error.error.id && error.error.id == 1)
                setIdCardError(error.error.text);
            else
                setIdCardError(locales('errors.fieldNeeded', { fieldName: locales('labels.idCard') }));
        };
    }

    const onSubmit = _ => {
        if (!idCard.uri) {
            setIdCardError(locales('errors.fieldNeeded', { fieldName: locales('labels.idCard') }));
        }
        else if (idCard.uri && (idCard.fileSize > 5242880 || idCard.fileSize < 20480)) {
            setIdCardError(locales('errors.imageTooLarge'));
        }

        else {
            setIdCardError('');
            props.handleIdCardChange(idCard);
        }

    };

    openSheet = _ => {
        setIsOpen(true);
        setTimeout(() => {
            ref?.current?.open();
        }, 100);
    };

    closeSheet = image => {
        setIsOpen(false);
        setTimeout(() => {
            ref?.current?.close();
            chooseImage(image);
        }, 100);
    };

    return (
        <View
            style={{
                flex: 1,
                padding: 20,
            }}
        >
            {isOpen ? <ChooseImage
                ref={ref}
                closeSheet={closeSheet}
                isOpen={isOpen}
            /> : null
            }
            <Text
                style={{
                    fontSize: 18,
                    color: '#313A43',
                    fontFamily: 'IRANSansWeb(FaNum)_Medium'
                }}
            >
                {locales('labels.uploadIdCardLikeSample')}
            </Text>

            <Text
                style={{
                    fontSize: 15,
                    color: '#313A43',
                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    marginTop: 30
                }}
            >
                {locales('titles.idCardSample')}
            </Text>
            <View
                style={{
                    borderWidth: 1,
                    borderRadius: 7,
                    overflow: 'hidden',
                    borderRadius: 12,
                    borderColor: '#BDC4CC',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10,
                    width: '100%',
                    height: deviceHeight * 0.3
                }}
            >

                <Image
                    resizeMode='cover'
                    source={require('../../../../assets/images/user-id-card.jpg')}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                />
            </View>

            <Text
                style={{
                    fontSize: 15,
                    color: '#313A43',
                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    marginTop: 30
                }}
            >
                <Text
                    style={{
                        color: '#E41C38',
                        fontFamily: 'IRANSansWeb(FaNum)_Light'
                    }}
                >
                    *
                </Text>
                {locales('titles.uploadIdCardSample')}
            </Text>

            {!!!idCard.uri ?
                <>
                    <Pressable
                        android_ripple={{
                            color: '#ededed'
                        }}
                        onPress={openSheet}
                        style={{
                            // flex: 3,
                            // marginHorizontal: 10,
                            height: deviceHeight * 0.3,
                            width: '95%',
                            marginTop: 10,
                            alignSelf: 'center',
                            borderWidth: 1,
                            borderRadius: 8,
                            borderStyle: 'dashed',
                            borderColor: '#BDC4CC',
                            backgroundColor: '#fff',
                            zIndex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <View>
                            <View style={{
                                backgroundColor: "white", width: 20, height: 20,
                                borderWidth: 1, borderColor: 'white',
                                position: 'absolute', top: -10, right: -10, borderBottomLeftRadius: 2, zIndex: 10,
                                justifyContent: 'center'
                            }}>
                                <FontAwesome color='#00C569' name="plus-square" size={18} />
                            </View>
                            <FontAwesome5
                                color='#323A42'
                                name='camera' size={35} />
                        </View>
                        <Text>
                            {locales('labels.addImage')}
                        </Text>
                    </Pressable>
                    <Text
                        style={{
                            color: '#e41c38',
                            fontSize: 15,
                            marginTop: 5,
                            marginHorizontal: 10,
                            fontFamily: 'IRANSansWeb(FaNum)_Light'
                        }}
                    >
                        {idCardError}
                    </Text>
                </>
                :

                <Pressable
                    android_ripple={{
                        color: '#ededed'
                    }}
                    activeOpacity={1}
                    onPress={openSheet}
                    style={{
                        borderWidth: 1,
                        borderRadius: 7,
                        overflow: 'hidden',
                        borderRadius: 12,
                        borderColor: '#BDC4CC',
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 10,
                        width: '100%',
                        height: deviceHeight * 0.3
                    }}
                >
                    <Image
                        resizeMode='cover'
                        borderRadius={5}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        source={{ uri: idCard.uri }}
                    />
                </Pressable>
            }

            <View style={{
                flexDirection: 'row', marginVertical: 20,
                width: deviceWidth, justifyContent: 'space-between', width: '100%'
            }}>
                <BuskoolButton
                    onPress={onSubmit}
                    style={(!!!idCard.uri || idCardError) ? styles.disableLoginButton : styles.loginButton}
                    rounded
                >
                    <Text style={styles.buttonText}>
                        {locales('titles.nextStep')}
                    </Text>
                    <AntDesign name='arrowleft' size={25} color='white' />
                </BuskoolButton>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    loginFailedContainer: {
        backgroundColor: '#F8D7DA',
        padding: 10,
        borderRadius: 5
    },
    loginFailedText: {
        textAlign: 'center',
        width: deviceWidth,
        color: '#761C24'
    },
    buttonText: {
        color: 'white',
        width: '60%',
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    backButtonText: {
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        color: '#7E7E7E',
        width: '60%',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#BDC4CC',
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5,
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        width: '37%',
        elevation: 0,
    },
    disableLoginButton: {
        textAlign: 'center',
        marginVertical: 10,
        width: deviceWidth * 0.4,
        borderRadius: 5,
        flexDirection: 'row-reverse',
        elevation: 0,
        color: 'white',
        height: 45,
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        marginVertical: 10,
        backgroundColor: '#FF9828',
        elevation: 0,
        borderRadius: 5,
        flexDirection: 'row-reverse',
        width: deviceWidth * 0.4,
        color: 'white',
        height: 45,
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPassword: {
        marginTop: 10,
        textAlign: 'center',
        color: '#7E7E7E',
        fontSize: 16,
        padding: 10,
    },
    enterText: {
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#00C569',
        fontSize: 20,
        padding: 10,
    },
    linearGradient: {
        height: deviceHeight * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextStyle: {
        color: 'white',
        position: 'absolute',
        textAlign: 'center',
        fontSize: 26,
        bottom: 40
    },
    textInputPadding: {
        padding: 20,
    },
    userText: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#555',
        fontSize: 20,
        paddingHorizontal: 20

    },
    labelInputPadding: {
        // paddingVertical: 5,
        // paddingHorizontal: 20
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    scrollContentContainer: {
        paddingTop: 40,
        paddingBottom: 10,
    },
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 13,
        paddingHorizontal: deviceWidth * 0.04,
        fontFamily: 'IRANSansWeb(FaNum)_Medium',
        paddingVertical: 8,
        height: 50,
        color: 'black',
        width: deviceWidth * 0.9,
    },
    iconContainer: {
        left: 10,
        top: 13,
    }
});

export default StepOne;