import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ActionSheet, Button } from 'native-base';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { connect } from 'react-redux';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth, deviceHeight, permissions } from '../../../utils';

const StepThree = props => {

    const {
        setEvidencesLoading
    } = props;

    let [evidence, setEvidence] = useState({});
    let [evidenceError, setEvidenceError] = useState('');


    useEffect(() => {
        if (props.evidence)
            setEvidence(props.evidence);
    }, []);

    const chooseImage = _ => ActionSheet.show(
        {
            options: [locales('labels.camera'), locales('labels.gallery')],
        },
        buttonIndex => onActionSheetClicked(buttonIndex)
    );

    const onActionSheetClicked = async (buttonIndex) => {
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

                    let resultObj = {
                        uri: image.uri,
                        type: image.type,
                        size: image.fileSize,
                        name: image.fileName
                    }
                    setEvidenceError('');
                    setEvidence(resultObj);
                });
                break;
            }

            case 1: {
                launchImageLibrary(options, image => {
                    if (image.didCancel)
                        return;
                    else if (image.error)
                        return;

                    let resultObj = {
                        uri: image.uri,
                        type: image.type,
                        size: image.fileSize,
                        name: image.fileName
                    }
                    setEvidenceError('');
                    setEvidence(resultObj);
                });
                break;
            }
            default:
                break;
        }

    };

    const onSubmit = _ => {

        if (!evidence.uri) {
            setEvidenceError(locales('errors.fieldNeeded', { fieldName: locales('labels.evidence') }));
        }
        else if (evidence.uri && (evidence.fileSize > 5242880 || evidence.fileSize < 20480)) {
            setEvidenceError(locales('errors.imageTooLarge'));
        }

        else {
            setEvidenceError('');
            props.handleEvidenceChange(evidence);
        }

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
                    fontSize: 17,
                    color: '#313A43',
                    fontFamily: 'IRANSansWeb(FaNum)_Medium'
                }}
            >
                {
                    locales('titles.image')
                }
                <Text
                    style={{
                        fontSize: 17,
                        color: '#E41C38',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium'
                    }}
                >
                    {` ${locales('titles.oneOf')} `}
                </Text>
                <Text
                    style={{
                        fontSize: 17,
                        color: '#313A43',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium'
                    }}
                >
                    {locales('titles.evidencePhotosThirdDescription')}
                </Text>
            </Text>

            <Text
                style={{
                    fontSize: 15,
                    color: '#313A43',
                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    marginTop: 30
                }}
            >
                {locales('titles.evidenceSample')}
            </Text>

            <View
                style={{
                    borderWidth: 1,
                    borderRadius: 12,
                    borderColor: '#BDC4CC',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10,
                    width: '100%',
                    overflow: 'hidden',
                    height: deviceHeight * 0.2
                }}
            >

                <Image
                    resizeMode='contain'
                    source={require('../../../../assets/images/madarek.jpg')}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                />
            </View>

            <Text
                style={{
                    fontSize: 15,
                    color: '#313A43',
                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    marginTop: 30,
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
                {locales('labels.uploadEvidenceSample')}
            </Text>

            {!!!evidence.uri ?
                <>
                    <TouchableOpacity
                        onPress={chooseImage}
                        style={{
                            height: deviceHeight * 0.23,
                            width: '95%',
                            marginTop: 10,
                            alignSelf: 'center',
                            borderWidth: 1,
                            borderRadius: 8,
                            borderStyle: 'dashed',
                            borderColor: '#707070',
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
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Light'
                            }}
                        >
                            {locales('labels.addImage')}
                        </Text>
                    </TouchableOpacity>
                    <Text
                        style={{
                            color: '#e41c38',
                            fontSize: 15,
                            marginTop: 5,
                            marginHorizontal: 10,
                            fontFamily: 'IRANSansWeb(FaNum)_Light'
                        }}
                    >
                        {evidenceError}
                    </Text>
                </>
                :
                <TouchableOpacity
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
                        width: '95%',
                        overflow: 'hidden',
                        height: deviceHeight * 0.3
                    }}
                >
                    <Image
                        resizeMode='cover'
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        source={{ uri: evidence.uri }}
                    />
                </TouchableOpacity>
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
                    style={(!!!evidence.uri || evidenceError) ? styles.disableLoginButton : styles.loginButton}
                    rounded
                >
                    {!setEvidencesLoading ?
                        <FontAwesome5
                            name='check'
                            size={20}
                            color='white'
                        />
                        :
                        <ActivityIndicator
                            size={25}
                            color='white'
                            animating={!!setEvidencesLoading}
                        />
                    }
                    <Text style={styles.buttonText}>
                        {locales('titles.finalSubmit')}
                    </Text>
                </Button>
                <Button
                    onPress={() => props.changeStep(2)}
                    style={styles.backButtonContainer}
                    rounded
                >
                    <Text style={styles.backButtonText}>{locales('titles.previousStep')}</Text>
                    <AntDesign name='arrowright' size={25} color='#7E7E7E' />
                </Button>
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
        color: '#7E7E7E',
        width: '60%',
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Light',
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
        borderRadius: 5,
        elevation: 0,
        color: 'white',
        alignItems: 'center',
        backgroundColor: '#B5B5B5',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        backgroundColor: '#00C569',
        elevation: 0,
        borderRadius: 5,
        width: deviceWidth * 0.4,
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

export default connect(mapStateToProps)(StepThree);