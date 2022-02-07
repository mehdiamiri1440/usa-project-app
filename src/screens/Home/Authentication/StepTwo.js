import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, BackHandler, Modal, ActivityIndicator } from 'react-native';
import { Button } from 'native-base';
import ImageZoom from 'react-native-image-pan-zoom';
import { connect } from 'react-redux';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth, deviceHeight } from '../../../utils';
import ChooseImage from '../../../components/cameraActionSheet';

const StepTwo = props => {

    const {
        setEvidencesLoading = false
    } = props;

    let [idCardWithOwner, setIdCardWithOwner] = useState({});
    let [idCardWithOwnerError, setIdCardWithOwnerError] = useState('');
    let [fullScreenModal, setFullScreenModal] = useState(false);


    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonPressed);
        if (props.idCardWithOwner)
            setIdCardWithOwner(props.idCardWithOwner);
        return _ => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPressed);
        }
    }, []);

    const handleBackButtonPressed = _ => {
        props.changeStep(1);
        return true;
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
            setIdCardWithOwnerError('');
            setIdCardWithOwner(resultObj);

        }
        catch (error) {
            if (error.error.id == 1)
                setIdCardWithOwnerError(error.error.text);
            else
                setIdCardWithOwnerError(locales('errors.fieldNeeded', { fieldName: locales('labels.idCardWithOwner') }));
        }
    };

    const onSubmit = _ => {

        if (!idCardWithOwner.uri) {
            setIdCardWithOwnerError(locales('errors.fieldNeeded', { fieldName: locales('labels.idCardWithOwner') }));
        }
        else if (idCardWithOwner.uri && (idCardWithOwner.fileSize > 5242880 || idCardWithOwner.fileSize < 20480)) {
            setIdCardWithOwnerError(locales('errors.imageTooLarge'));
        }

        else {
            setIdCardWithOwnerError('');
            props.handleIdCardWithOwnerChange(idCardWithOwner);
        }

    };

    const removeImage = (event) => {
        event.stopPropagation();
        setIdCardWithOwner({});
    };

    return (
        <View
            style={{
                flex: 1,
                padding: 20,
            }}
        >
            <Modal
                transparent={false}
                onDismiss={_ => setFullScreenModal(false)}
                onRequestClose={_ => setFullScreenModal(false)}
                animationType='fade'
                visible={fullScreenModal}
            >
                <View style={{
                    backgroundColor: 'rgba(59,59,59,0.85)',
                    height: deviceHeight,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View
                        style={{
                            alignSelf: 'flex-end',
                            justifyContent: 'center',
                            position: 'absolute',
                            right: 10,
                            top: 10,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            borderRadius: 100,
                            padding: 5
                        }}
                    >
                        <AntDesign
                            name='close'
                            size={20}
                            color='white'

                            onPress={() => setFullScreenModal(false)}
                        />
                    </View>
                    <ImageZoom
                        cropWidth={deviceWidth}
                        cropHeight={deviceHeight * 0.9}
                        imageWidth={deviceWidth}
                        imageHeight={deviceHeight * 0.6}
                    >
                        <Image
                            style={{
                                alignSelf: 'center', width: deviceWidth,
                                height: '100%',
                                resizeMode: 'contain'
                            }}
                            source={require('../../../../assets/images/22-01-30-17-50-22-815_deco-01.jpg')} />
                    </ImageZoom>
                </View>
            </Modal>
            <Text
                style={{
                    fontSize: 16,
                    color: 'black',
                    fontFamily: 'IRANSansWeb(FaNum)'
                }}
            >
                {locales('labels.authFirstHelp')}
            </Text>
            <Text
                style={{
                    fontSize: 16,
                    color: 'black',
                    fontFamily: 'IRANSansWeb(FaNum)'
                }}
            >
                {locales('labels.authSecondHelp')}
            </Text>
            <Text
                style={{
                    fontSize: 16,
                    color: '#140092',
                    textAlign: 'center',
                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                    marginTop: 10
                }}
            >
                "{locales('labels.iUploadMyIdCardForBuskool')}"
            </Text>

            <Text
                style={{
                    fontSize: 16,
                    color: 'rgba(0,0,0,0.7)',
                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                    marginTop: 10,
                    marginRight: 15,
                }}
            >
                {locales('labels.authenticaitonSample')}
            </Text>
            <Pressable
                onPress={_ => setFullScreenModal(true)}
                style={{
                    borderColor: '#00C569',
                    borderWidth: 1,
                    marginTop: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    width: deviceWidth * 0.6,
                    height: deviceHeight * 0.45,
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
                    source={require('../../../../assets/images/22-01-30-17-50-22-815_deco-01.jpg')}
                    style={{
                        width: '100%',
                        borderRadius: 6,
                        resizeMode: 'contain'
                    }}
                />
            </Pressable>


            <Text
                style={{
                    fontSize: 16,
                    color: 'rgba(0,0,0,0.7)',
                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                    marginTop: 30,
                    marginRight: 15,
                }}
            >
                {locales('labels.uploadAuthenticationEvidence')}
                <Text
                    style={{
                        color: '#E41C38',
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                    }}
                >
                    *
                </Text>
            </Text>

            {!!!idCardWithOwner.uri ?
                <>
                    <Pressable
                        android_ripple={{
                            color: '#ededed'
                        }}
                        onPress={chooseImage}
                        style={{
                            // flex: 3,
                            // marginHorizontal: 10,
                            height: deviceHeight * 0.4,
                            width: deviceWidth * 0.56,
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
                                fontSize: 16,
                                fontFamily: 'IRANSansWeb(FaNum)',
                            }}
                        >
                            {locales('labels.imageOfAuthenticationEvidence')}
                        </Text>
                    </Pressable>
                    <Text
                        style={{
                            color: '#e41c38',
                            fontSize: 15,
                            marginTop: 5,
                            marginHorizontal: 45,
                            fontFamily: 'IRANSansWeb(FaNum)_Light'
                        }}
                    >
                        {idCardWithOwnerError}
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
                        borderRadius: 12,
                        borderColor: '#BDC4CC',
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 10,
                        width: '60%',
                        overflow: 'hidden',
                        height: deviceHeight * 0.4
                    }}
                >
                    <Image
                        resizeMode='cover'
                        style={{
                            width: '100%',
                            height: '100%',
                            ...StyleSheet.absoluteFillObject
                        }}
                        source={{ uri: idCardWithOwner.uri }}
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
            <View
                style={{
                    flexDirection: 'row',
                    marginVertical: 20,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginBottom: 65
                }}>
                <Button
                    onPress={onSubmit}
                    style={(!!!idCardWithOwner.uri || idCardWithOwnerError) ? styles.disableLoginButton : styles.loginButton}
                    rounded
                >
                    {setEvidencesLoading ?
                        <ActivityIndicator
                            size={25}
                            color='white'
                            animating={!!setEvidencesLoading}
                        />
                        :
                        <AntDesign
                            name='check'
                            size={25}
                            color={(!!!idCardWithOwner.uri || idCardWithOwnerError) ? '#00000061' : 'white'}
                        />
                    }
                    <Text style={styles.buttonText(idCardWithOwner, idCardWithOwnerError)}>
                        {locales('titles.finalSubmit')}
                    </Text>
                </Button>
                <Button
                    onPress={() => props.changeStep(1)}
                    style={{
                        borderColor: '#FF9828',
                        borderWidth: 1,
                        borderRadius: 12,
                        backgroundColor: 'white',
                        elevation: 0,
                        width: deviceWidth * 0.4,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    rounded
                >
                    <Text
                        style={{
                            color: '#FF9828',
                            fontSize: 16,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold'
                        }}
                    >{locales('titles.previousStep')}
                    </Text>
                    <AntDesign
                        name='arrowright'
                        size={20}
                        color='#FF9828'
                    />
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
    buttonText: (idCardWithOwner, idCardWithOwnerError) => ({
        color: (!!!idCardWithOwner.uri || idCardWithOwnerError) ? '#00000061' : 'white',
        width: '60%',
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    }),
    backButtonText: {
        color: '#7E7E7E',
        width: '60%',
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#BDC4CC',
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5,
        justifyContent: 'center',
        width: deviceWidth * 0.4,
        elevation: 0,
    },
    disableLoginButton: {
        textAlign: 'center',
        width: deviceWidth * 0.4,
        borderRadius: 12,
        elevation: 0,
        color: 'rgba(0,0,0,0.38)',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        backgroundColor: '#FF9828',
        elevation: 0,
        borderRadius: 12,
        width: deviceWidth * 0.4,
        color: '#FF9828',
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

const mapStateToProps = (state) => {
    const {
        authReducer
    } = state;

    const {
        setEvidencesLoading,
    } = authReducer;

    return {
        setEvidencesLoading,
    }
};

export default connect(mapStateToProps)(StepTwo);