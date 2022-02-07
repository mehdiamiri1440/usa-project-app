import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, BackHandler } from 'react-native';
import { ActionSheet, Button } from 'native-base';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth, deviceHeight } from '../../../utils';
import ChooseImage from '../../../components/cameraActionSheet';

const StepOne = props => {


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

    const chooseImage = async _ => {
        try {
            const image = await ChooseImage();
            if (!image)
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
            if (error.error.id == 1)
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

    const removeImage = (event) => {
        event.stopPropagation();
        setIdCard({})
    };

    return (
        <View
            style={{
                flex: 1,
                padding: 20,
            }}
        >
            <Text
                style={{
                    fontSize: 18,
                    color: '#313A43',
                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    textAlign: 'center'
                }}
            >
                {locales('labels.uploadIdCardLikeSample')}
            </Text>

            <Text
                style={{
                    fontSize: 15,
                    color: 'rgba(0,0,0,0.7)',
                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                    marginTop: 10,
                    marginRight: 15,
                }}
            >
                {locales('titles.idCardSample')}
            </Text>
            <View
                style={{
                    borderColor: '#00C569',
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    width: '80%',
                    height: deviceHeight * 0.27,
                    marginTop: 5,
                    padding: 15
                }}
            >
                <View
                    style={{
                        width: 4,
                        height: 100,
                        position: 'absolute',
                        backgroundColor: 'white',
                        zIndex: 100000,
                        left: -3
                    }}
                ></View>
                <View
                    style={{
                        width: 4,
                        height: 100,
                        position: 'absolute',
                        backgroundColor: 'white',
                        zIndex: 100000,
                        right: -3
                    }}
                ></View>
                <View
                    style={{
                        width: 160,
                        height: 4,
                        position: 'absolute',
                        backgroundColor: 'white',
                        zIndex: 100000,
                        top: -3
                    }}
                ></View>
                <View
                    style={{
                        width: 160,
                        height: 4,
                        position: 'absolute',
                        backgroundColor: 'white',
                        zIndex: 100000,
                        bottom: -3
                    }}
                ></View>
                <Image
                    source={require('../../../../assets/images/user-id-card.jpg')}
                    style={{
                        width: '100%',
                        borderRadius: 6,
                        resizeMode: 'contain'
                    }}
                />
            </View>

            <Text
                style={{
                    fontSize: 15,
                    color: 'rgba(0,0,0,0.7)',
                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                    marginTop: 30,
                    marginRight: 15
                }}
            >
                {locales('titles.uploadIdCardSample')}
                <Text
                    style={{
                        color: '#E41C38',
                        fontFamily: 'IRANSansWeb(FaNum)_Light'
                    }}
                >
                    *
                </Text>
            </Text>

            {!!!idCard.uri ?
                <>
                    <Pressable
                        android_ripple={{
                            color: '#ededed'
                        }}
                        onPress={chooseImage}
                        style={{
                            // flex: 3,
                            // marginHorizontal: 10,
                            height: deviceHeight * 0.3,
                            width: '75%',
                            marginTop: 10,
                            alignSelf: 'center',
                            borderWidth: 1,
                            borderRadius: 20,
                            borderStyle: 'dashed',
                            borderColor: '#699CFF',
                            backgroundColor: '#f0f3f5',
                            zIndex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <View>
                            <View
                                style={{
                                    position: 'absolute',
                                    zIndex: 1,
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 100000,
                                    width: 20,
                                    height: 20,
                                    borderColor: 'white',
                                    borderWidth: 2,
                                    backgroundColor: '#140092',
                                    bottom: -4,
                                    right: -4
                                }}
                            >
                                <FontAwesome
                                    name="plus"
                                    size={14}
                                    style={{
                                        color: 'white',
                                    }}
                                />
                            </View>
                            <FontAwesome5
                                color='#140092'
                                name='camera'
                                size={35}
                            />
                        </View>
                        <Text
                            style={{
                                marginTop: 5,
                                color: '#140092',
                                fontSize: 18,
                                fontFamily: 'IRANSansWeb(FaNum)',
                            }}
                        >
                            {locales('titles.yourNationalCardImage')}
                        </Text>
                    </Pressable>
                    <Text
                        style={{
                            color: '#e41c38',
                            fontSize: 15,
                            marginTop: 5,
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                            textAlign: 'center'
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
                    onPress={chooseImage}
                    style={{
                        borderWidth: 1,
                        borderRadius: 7,
                        overflow: 'hidden',
                        borderRadius: 20,
                        borderColor: '#BDC4CC',
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 10,
                        width: '75%',
                        height: deviceHeight * 0.3
                    }}
                >
                    <Image
                        resizeMode='cover'
                        borderRadius={5}
                        style={{
                            width: '100%',
                            height: '100%',
                            ...StyleSheet.absoluteFillObject
                        }}
                        source={{ uri: idCard.uri }}
                    />
                    <View style={styles.overlay} />
                    <Pressable
                        onPress={removeImage}
                        style={{
                            position: 'absolute',
                            top: 5,
                            left: 5,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            borderRadius: 1000,
                            width: 40,
                            height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 10
                        }}
                    >
                        <FontAwesome5
                            size={22}
                            solid
                            name='trash-alt'
                            color='white'
                        />
                    </Pressable>
                </Pressable>
            }

            <View style={{
                flexDirection: 'row', marginVertical: 20,
                width: deviceWidth, justifyContent: 'space-between', width: '100%'
            }}>
                <Button
                    onPress={onSubmit}
                    style={(!!!idCard.uri || idCardError) ? styles.disableLoginButton : styles.loginButton}
                    rounded
                >
                    <FontAwesome5
                        name='long-arrow-alt-left'
                        size={20}
                        color={(!!!idCard.uri || idCardError) ? '#00000061' : 'white'}
                    />
                    <Text style={styles.buttonText(idCard, idCardError)}>
                        {locales('titles.nextStep')}
                    </Text>
                </Button>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
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
    buttonText: (idCard, idCardError) => ({
        color: (!!!idCard.uri || idCardError) ? '#00000061' : 'white',
        width: '60%',
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    }),
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
        height: 50,
        justifyContent: 'center',
        width: '37%',
        elevation: 0,
    },
    disableLoginButton: {
        textAlign: 'center',
        marginVertical: 10,
        width: deviceWidth * 0.35,
        borderRadius: 12,
        elevation: 0,
        height: 50,
        color: 'white',
        alignItems: 'center',
        backgroundColor: '#C2C9D1',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        marginVertical: 10,
        backgroundColor: '#FF9828',
        elevation: 0,
        borderRadius: 12,
        width: deviceWidth * 0.35,
        color: 'white',
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