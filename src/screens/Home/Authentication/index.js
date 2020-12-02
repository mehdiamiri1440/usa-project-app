import React, { useState, useRef } from 'react';
import { Text, View, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';

import { ActionSheet, Button } from 'native-base';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import { Dialog, Portal, Paragraph } from 'react-native-paper';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Feather from 'react-native-vector-icons/dist/Feather';

import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import * as authActions from '../../../redux/auth/actions';




const Authentication = props => {

    const scrollViewRef = useRef('');
    const {
        navigation,

        setEvidencesLoading,

        userProfile = {},
        userProfileLoading
    } = props;

    const { user_info = {} } = userProfile;
    const { is_verified } = user_info;

    let [showAuthenticationModal, setShowAuthenticationModal] = useState(false);

    let [submitButtonClicked, setSubmitButtonClicked] = useState(false);

    let [evidence, setEvidence] = useState({});
    let [evidenceError, setEvidenceError] = useState('');

    let [idCard, setIdCard] = useState({});
    let [idCardError, setIdCardError] = useState('');

    let [idCardWithOwner, setIdCardWithOwner] = useState({});
    let [idCardWithOwnerError, setIdCardWithOwnerError] = useState('');

    let [scrollToElement, setScrollToElement] = useState(0);

    const chooseImage = (name) => ActionSheet.show(
        {
            options: [locales('labels.camera'), locales('labels.gallery')],
        },
        buttonIndex => onActionSheetClicked(buttonIndex, name)
    );


    const onActionSheetClicked = (buttonIndex, name) => {
        const options = {
            width: 300,
            height: 400,
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 1,
            title: 'عکس را انتخاب کنید',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        const prevImagePickerLibraryOptions = {
            width: 300,
            height: 400,
            cropping: true,
            mediaType: 'photo',
        };

        switch (buttonIndex) {
            case 0: {
                ImagePicker.launchCamera(options, image => {
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


                    switch (name) {
                        case 'idCard': {
                            setIdCardError('');
                            setIdCard(resultObj);
                            break;
                        }
                        case 'idCardWithOwner': {
                            setIdCardWithOwnerError('');
                            setIdCardWithOwner(resultObj);
                            break;
                        }
                        case 'evidence': {
                            setEvidenceError('');
                            setEvidence(resultObj);
                            break;
                        }
                        default:
                            break;
                    };

                });
                break;
            }

            case 1: {
                ImagePicker.launchImageLibrary(options, image => {
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

                    switch (name) {
                        case 'idCard': {
                            setIdCardError('');
                            setIdCard(resultObj);
                            break;
                        }
                        case 'idCardWithOwner': {
                            setIdCardWithOwnerError('');
                            setIdCardWithOwner(resultObj);
                            break;
                        }
                        case 'evidence': {
                            setEvidenceError('');
                            setEvidence(resultObj);
                            break;
                        }
                        default:
                            break;
                    };

                });
                break;
            }
            default:
                break;
        }

    };
    const validateForm = _ => {
        return new Promise((resolve, reject) => {
            let isIdCardValid, isIdCardWithOwnerValid, isEvidenceValid, errorElementPosition = 0;

            if (!idCard.uri) {
                isIdCardValid = false;
                errorElementPosition = 100;
                setIdCardError(locales('errors.fieldNeeded', { fieldName: locales('labels.idCard') }));
            }
            else if (idCard.uri && (idCard.fileSize > 5242880 || idCard.fileSize < 20480)) {
                isIdCardValid = false;
                errorElementPosition = 100;
                setIdCardError(locales('errors.imageTooLarge'));
            }

            else {
                isIdCardValid = true;
                errorElementPosition = 3000;
                setIdCardError('');
            }



            if (!idCardWithOwner.uri) {
                isIdCardWithOwnerValid = false;
                errorElementPosition = 1400;
                setIdCardWithOwnerError(locales('errors.fieldNeeded', { fieldName: locales('labels.idCardWithOwner') }));
            }
            else if (idCardWithOwner.uri && (idCardWithOwner.fileSize > 5242880 || idCardWithOwner.fileSize < 20480)) {
                isIdCardWithOwnerValid = false;
                errorElementPosition = 1400;
                setIdCardWithOwnerError(locales('errors.imageTooLarge'));
            }

            else {
                isIdCardWithOwnerValid = true;
                errorElementPosition = 3000;
                setIdCardWithOwnerError('');
            }


            if (!evidence.uri) {
                isEvidenceValid = false;
                errorElementPosition = 3000;
                setEvidenceError(locales('errors.fieldNeeded', { fieldName: locales('labels.evidence') }));
            }
            else if (evidence.uri && (evidence.fileSize > 5242880 || evidence.fileSize < 20480)) {
                isEvidenceValid = false;
                errorElementPosition = 3000;
                setEvidenceError(locales('errors.imageTooLarge'));
            }

            else {
                isEvidenceValid = true;
                errorElementPosition = 3000;
                setEvidenceError('');
            }

            if (isIdCardValid && isEvidenceValid && isIdCardWithOwnerValid) {
                if (scrollViewRef && scrollViewRef != undefined && scrollViewRef != null && scrollViewRef.current
                    && scrollViewRef.current != undefined && scrollViewRef.current != null) {
                    scrollViewRef.current.scrollTo({ x: 0, y: errorElementPosition, animated: true });
                }
                resolve(true);
            }
            else {
                setScrollToElement(errorElementPosition)
                if (scrollViewRef && scrollViewRef != undefined && scrollViewRef != null && scrollViewRef.current
                    && scrollViewRef.current != undefined && scrollViewRef.current != null) {
                    scrollViewRef.current.scrollTo({ x: 0, y: scrollToElement, animated: true });
                }
                resolve(false);
            }
        });
    };

    const submitForm = async (event) => {
        event.preventDefault();
        setSubmitButtonClicked(true);
        const isFormValid = await validateForm();

        if (!isFormValid)
            return;

        let data = new FormData();
        data.append("images_count", 3);
        data.append("image_" + 0, idCard);
        data.append("image_" + 1, idCardWithOwner);
        data.append("image_" + 2, evidence);
        return props.setEvidences(data).then(_ => {
            setShowAuthenticationModal(true);
            setTimeout(() => {
                navigation.navigate('MyBuskool', { screen: 'HomeIndex' });
                setShowAuthenticationModal(false);
            }, 2000);
        });
    }


    return (
        <>
            <View style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                height: 45,
                elevation: 5,
                justifyContent: 'center'
            }}>
                <TouchableOpacity
                    style={{ width: 40, justifyContent: 'center', position: 'absolute', right: 0 }}
                    onPress={() => navigation.goBack()}
                >
                    <AntDesign name='arrowright' size={25} />
                </TouchableOpacity>

                <View style={{
                    width: '100%',
                    alignItems: 'center'
                }}>
                    <Text
                        style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}
                    >
                        {locales('labels.authentication')}
                    </Text>
                </View>
            </View>

            <Portal
                style={{
                    padding: 0,
                    margin: 0

                }}>
                <Dialog
                    visible={showAuthenticationModal}
                    style={styles.dialogWrapper}
                >
                    <Dialog.Actions
                        style={styles.dialogHeader}
                    >
                        <Button
                            onPress={() => {
                                navigation.navigate('MyBuskool', { screen: 'HomeIndex' });
                                setShowAuthenticationModal(false);
                            }}
                            style={styles.closeDialogModal}>
                            <FontAwesome5 name="times" color="#777" solid size={18} />
                        </Button>
                        <Paragraph style={styles.headerTextDialogModal}>
                            {locales('labels.authentication')}
                        </Paragraph>
                    </Dialog.Actions>
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'center'
                        }}>

                        <Feather name="check" color="#a5dc86" size={70} style={[styles.dialogIcon, {
                            borderColor: '#edf8e6',
                        }]} />

                    </View>
                    <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                        <Text style={styles.mainTextDialogModal}>
                            {locales('titles.authenticationEvidencesUploadedSuccessfully')}
                        </Text>

                    </Dialog.Actions>
                    <Dialog.Actions style={{
                        justifyContent: 'center',
                        width: '100%',
                        padding: 0
                    }}>
                        <Button
                            style={[styles.modalCloseButton]}
                            onPress={() => {
                                navigation.navigate('MyBuskool', { screen: 'HomeIndex' });
                                setShowAuthenticationModal(false);
                            }}>

                            <Text style={styles.closeButtonText}>{locales('titles.gotIt')}
                            </Text>
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal >


            {(userProfileLoading) ?
                <View style={{
                    backgroundColor: 'white', flex: 1, width: deviceWidth, height: deviceHeight,
                    position: 'absolute',

                    elevation: 5,
                    borderColor: 'black',
                    backgroundColor: 'white',
                }}>
                    <ActivityIndicator size="large"
                        style={{
                            position: 'absolute', left: '44%', top: '40%',

                            elevation: 5,
                            borderColor: 'black',
                            backgroundColor: 'white', width: 50, height: 50, borderRadius: 25
                        }}
                        color="#00C569"

                    />
                </View> : null}

            {is_verified ?
                <View
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View
                        style={{ marginTop: 3, alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome5 name='certificate' color='#1DA1F2' size={95} />
                        <FontAwesome5 color='white' name='check' size={60} style={{ position: 'absolute' }} />
                    </View>
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 20,
                            color: '#777777', textAlign: 'center'
                        }}
                    >
                        {locales('titles.authenticationVerified')}
                    </Text>
                </View>
                :
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={{ alignItems: 'center', paddingBottom: 30, justifyContent: 'center' }}
                >


                    <Text
                        style={{
                            width: deviceWidth * 0.95, justifyContent: 'flex-start', padding: 15,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium', borderBottomWidth: 1, borderBottomColor: '#BEBEBE'
                        }}
                    >
                        1- {locales('titles.idCardSample')}
                        <Text style={{ color: 'red', marginBottom: 10 }}>*</Text>
                    </Text>
                    <Image
                        resizeMode='contain'
                        style={{ width: '100%', maxWidth: 320, height: deviceHeight * 0.3, marginVertical: 20, borderRadius: 3 }}
                        source={require('../../../../assets/images/user-id-card.jpg')}
                    />
                    {!idCard.uri ?
                        <TouchableOpacity
                            onPress={() => chooseImage('idCard')}
                            style={{
                                // flex: 3,
                                // marginHorizontal: 10,
                                height: deviceHeight * 0.3,
                                width: '85%',
                                maxWidth: 320,
                                borderWidth: 1,
                                borderRadius: 5,
                                borderStyle: 'dashed',
                                borderColor: '#707070',
                                backgroundColor: '#fff',
                                zIndex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Entypo name='plus' size={45} color='#00C569' />
                            <Text>{locales('labels.uploadIdCard')}</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{
                                width: deviceWidth,
                                alignItems: 'center',
                            }}
                            onPress={() => chooseImage('idCard')}
                        >
                            <Image
                                resizeMode='cover'
                                style={{
                                    width: deviceWidth - 50,
                                    maxWidth: 320,
                                    height: deviceHeight * 0.3,
                                    borderRadius: 5
                                }}
                                source={{ uri: idCard.uri }} />
                        </TouchableOpacity>
                    }
                    <Text style={{
                        color: 'red',
                        fontSize: 20,
                        marginTop: 15
                    }}>
                        {idCardError}
                    </Text>

                    <Text
                        style={{
                            width: deviceWidth * 0.95, justifyContent: 'flex-start', padding: 15,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium', borderBottomWidth: 1, borderBottomColor: '#BEBEBE'
                        }}
                    >
                        2- {locales('titles.idCardSampleWithOwner')}
                        <Text style={{ color: 'red' }}>*</Text>
                    </Text>
                    <Image
                        resizeMode='contain'
                        style={{
                            width: '85%',
                            maxWidth: 320,
                            borderRadius: 3,
                            height: deviceHeight * 1 - 255,
                            marginVertical: 20
                        }}
                        source={require('../../../../assets/images/verifi-user-image.jpg')}
                    />
                    {!idCardWithOwner.uri ?
                        <TouchableOpacity
                            onPress={() => chooseImage('idCardWithOwner')}
                            style={{

                                marginHorizontal: 10,
                                width: deviceWidth - 50,
                                maxWidth: 320,
                                height: deviceHeight * 0.3,
                                borderWidth: 1,
                                borderRadius: 5,
                                borderStyle: 'dashed',
                                borderColor: '#707070',
                                backgroundColor: '#fff',
                                zIndex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Entypo name='plus' size={45} color='#00C569' />
                            <Text style={{ paddingHorizontal: 20, textAlign: 'center' }}>{locales('labels.uploadIdCardSampleWithOwner')}</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{
                                width: deviceWidth * 0.9
                            }}
                            onPress={() => chooseImage('idCardWithOwner')}
                        >
                            <Image
                                resizeMode='cover'
                                style={{
                                    backgroundColor: 'red',
                                    width: '100%',
                                    maxWidth: 320,
                                    height: deviceHeight * 1 - 255,
                                    borderRadius: 5
                                }}
                                source={{ uri: idCardWithOwner.uri }} />
                        </TouchableOpacity>
                    }
                    <Text style={{
                        color: 'red',
                        fontSize: 18,
                        marginTop: 15
                    }}>
                        {idCardWithOwnerError}
                    </Text>

                    <Text
                        style={{
                            width: deviceWidth * 0.95, justifyContent: 'flex-start', padding: 15,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium', borderBottomWidth: 1, borderBottomColor: '#BEBEBE'
                        }}
                    >
                        3- {locales('titles.evidencePhotos')}
                        <Text style={{ color: 'red', marginBottom: 10 }}>*</Text>
                    </Text>
                    <Image
                        resizeMode='contain'
                        style={{ width: '90%', maxWidth: 400, height: deviceHeight * 0.3, borderRadius: 3 }}
                        source={require('../../../../assets/images/madarek.jpg')}
                    />
                    {!evidence.uri ?
                        <TouchableOpacity
                            onPress={() => chooseImage('evidence')}
                            style={{
                                height: deviceHeight * 0.3,
                                width: '85%',
                                maxWidth: 320,
                                borderWidth: 1,
                                borderRadius: 5,
                                borderStyle: 'dashed',
                                borderColor: '#707070',
                                backgroundColor: '#fff',
                                zIndex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Entypo name='plus' size={25} color='#00C569' />
                            <Text>{locales('labels.uploadEvidence')}</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{
                                width: deviceWidth * 0.9
                            }}
                            onPress={() => chooseImage('evidence')}
                        >
                            <Image
                                resizeMode='cover'
                                style={{
                                    width: deviceWidth,
                                    maxWidth: 320,
                                    height: deviceHeight * 0.3,
                                    backgroundColor: 'red',
                                    borderRadius: 5
                                }}
                                source={{ uri: evidence.uri }} />
                        </TouchableOpacity>
                    }
                    <Text style={{
                        color: 'red',
                        fontSize: 20,
                        marginVertical: 30
                    }}>
                        {evidenceError}
                    </Text>

                    <Button
                        onPress={(event) => submitForm(event)}
                        style={(idCardError || idCardWithOwnerError || evidenceError || !submitButtonClicked)
                            ? styles.disableLoginButton : styles.loginButton}
                        rounded
                    >
                        <Text style={styles.buttonText}>{locales('titles.submitEvidences')}</Text>
                        <ActivityIndicator size="small"
                            animating={!!setEvidencesLoading}
                            color="white"
                            style={{
                                position: 'absolute', left: '25%', top: '28%',
                                width: 25, height: 25, borderRadius: 15
                            }}
                        />
                    </Button>


                </ScrollView>
            }
        </>
    )

}




const styles = StyleSheet.create({
    textInputPadding: {
        padding: 20,
        marginTop: 20
    },
    dialogWrapper: {
        borderRadius: 12,
        padding: 0,
        margin: 0,
        overflow: "hidden"
    },
    dialogHeader: {
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        padding: 0,
        margin: 0,
        position: 'relative',
    },
    closeDialogModal: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 15,
        height: '100%',
        backgroundColor: 'transparent',
        elevation: 0
    },
    headerTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        textAlign: 'center',
        fontSize: 17,
        paddingTop: 11,
        color: '#474747'
    },
    mainWrapperTextDialogModal: {
        width: '100%',
        marginBottom: 0
    },
    mainTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#777',
        textAlign: 'center',
        fontSize: 15,
        paddingHorizontal: 15,
        width: '100%'
    },
    modalCloseButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        elevation: 0,
        borderRadius: 0,
        backgroundColor: '#ddd'
    },
    modalButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        maxWidth: 145,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'flex-start',
        justifyContent: 'center',
    },

    closeButtonText: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#555',
    },
    dialogIcon: {

        height: 80,
        width: 80,
        textAlign: 'center',
        borderWidth: 4,
        borderRadius: 80,
        paddingTop: 5,
        marginTop: 20

    },
    greenButton: {
        backgroundColor: '#00C569',
    },
    buttonText: {
        color: 'white',
        width: '100%',
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    disableLoginButton: {
        textAlign: 'center',
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: '#B5B5B5',
        width: '90%',
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        borderRadius: 5,
        marginVertical: 10,
        backgroundColor: '#00C569',
        width: '90%',
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    labelInputPadding: {
        paddingVertical: 5,
        paddingHorizontal: 20
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
        fontSize: 13,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: '#333',
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
})


const mapDispatchToProps = (dispatch) => {
    return {
        setEvidences: (evidences) => dispatch(authActions.setEvidences(evidences))
    }
};

const mapStateToProps = (state) => {

    const {
        setEvidencesLoading,
        setEvidencesObject
    } = state.authReducer;

    return {
        setEvidencesLoading,
        setEvidencesObject,

        userProfile: state.profileReducer.userProfile,
        userProfileLoading: state.profileReducer.userProfileLoading,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);