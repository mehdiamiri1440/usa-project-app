import React, { Component } from 'react';
import { Image, Text, View, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import analytics from '@react-native-firebase/analytics';
import { connect } from 'react-redux';
import { Card, Button, Textarea, ActionSheet } from 'native-base';


import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Feather from 'react-native-vector-icons/dist/Feather';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import * as profileActions from '../../../redux/profile/actions';

class EditProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            showModal: false,
            profile_photo: {},
            description: '',
            is_company: false,
            public_phone: '',
            company_name: '',
            company_register_code: '',
            imageSizeError: false,
            first_name: '',
            last_name: '',
            editErrors: [],
            is_verified: false,
            showSubmitEditionModal: false
        }
    }

    componentWillUnmount() {
    }

    componentDidMount() {
        analytics().logEvent('profile_edit');
        if (Object.entries(this.props.userProfile).length) {
            const {
                profile_photo,
                is_company,
                company_name,
                company_register_code,
                public_phone,
                description } = this.props.userProfile.profile;

            const { first_name, last_name, is_verified } = this.props.userProfile.user_info;
            let stateProfilePhoto = { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${profile_photo}` };

            this.setState({
                loaded: true,
                profile_photo: stateProfilePhoto,
                is_company,
                company_name,
                company_register_code,
                public_phone,
                first_name,
                last_name,
                is_verified,
                description,
            });
        }
    }
    editProfile = _ => {

        this.setState({ editErrors: [] });

        let formData = new FormData();

        const {
            profile_photo,
            is_company,
            company_name,
            company_register_code,
            public_phone,
            description
        } = this.state;

        formData.append('description', description);
        formData.append('public_phone', public_phone);
        formData.append('is_company', is_company);
        formData.append('company_register_code', company_register_code);
        formData.append('company_name', company_name);
        if (!!profile_photo && profile_photo.type)
            formData.append('profile_photo', profile_photo);

        this.props.editProfile(formData).then(_ => {
            this.setState({ showSubmitEditionModal: true }, () => {
                setTimeout(() => {
                    this.props.fetchUserProfile();
                }, 1000);
                // global.initialProfileRoute = 'EditProfile'
            });
        }).catch(err => {
            if (err.data && err.data.errors)
                this.setState({ editErrors: Object.values(err.data.errors) });
        });
    };



    openActionSheet = _ => ActionSheet.show(
        {
            options: [locales('labels.camera'), locales('labels.gallery')],
        },
        buttonIndex => this.onActionSheetClicked(buttonIndex)
    );

    handleDescriptionChange = description => this.setState({ description });

    onActionSheetClicked = (buttonIndex) => {
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
                this.setState({ errorFlag: false });
                ImagePicker.launchCamera(options, image => {
                    if (image.didCancel)
                        return;
                    else if (image.error)
                        return;

                    if (image.fileSize > 5242880 || image.fileSize < 20480) {
                        return this.setState({ imageSizeError: true })
                    }
                    const source = { uri: image.uri };
                    this.setState(state => {
                        state.avatarSource = source;
                        let resultObj = {
                            uri: image.uri,
                            type: image.type,
                            size: image.fileSize,
                            name: image.fileName
                        }

                        state.profile_photo = resultObj;

                        return '';
                    }
                    )
                });
                break;
            }
            case 1: {
                this.setState({ errorFlag: false });
                ImagePicker.launchImageLibrary(options, image => {
                    if (image.didCancel)
                        return;
                    else if (image.error)
                        return;

                    if (image.fileSize > 5242880 || image.fileSize < 20480) {
                        return this.setState({ imageSizeError: true })
                    }
                    const source = { uri: image.uri };
                    this.setState(state => {
                        state.avatarSource = source;
                        let resultObj = {
                            uri: image.uri,
                            type: image.type,
                            size: image.fileSize,
                            name: image.fileName
                        }

                        state.profile_photo = resultObj;

                        return '';
                    }
                    )
                });
                break;
            }
            default:
                break;
        }

    };





    render() {
        const { editProfileLoading, userProfileLoading } = this.props;


        const {
            profile_photo,
            is_company,
            company_name,
            company_register_code,
            public_phone,
            description,
            imageSizeError,
            first_name,
            last_name,
            is_verified,

            editErrors,
            showSubmitEditionModal
        } = this.state;


        return (
            <>
                {userProfileLoading ?
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

                < Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={showSubmitEditionModal}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={() => this.setState({ showSubmitEditionModal: false })}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('titles.editProfile')}
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
                                {locales('titles.editionsDone')}
                            </Text>

                        </Dialog.Actions>
                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <Button
                                style={styles.modalCloseButton}
                                onPress={() => this.setState({ showSubmitEditionModal: false })}>

                                <Text style={styles.closeButtonText}>{locales('titles.gotIt')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal >


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
                        onPress={() => this.props.navigation.goBack()}
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
                            {locales('titles.editProfile')}
                        </Text>
                    </View>
                </View>


                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    style={{
                        paddingVertical: 30,
                        paddingHorizontal: 15,
                        backgroundColor: '#fff'
                    }}
                >


                    <View style={{
                        paddingBottom: 60

                    }}>

                        <View
                        >
                            <View style={{
                                width: 130,
                                height: 130,
                                borderRadius: 130,
                                alignSelf: 'center',
                                overflow: "hidden",
                                elevation: 6,

                            }}>
                                <Button
                                    onPress={this.openActionSheet}
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        zIndex: 1,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        justifyContent: 'center',

                                    }}>

                                    <FontAwesome5 name="camera" solid size={35} color="#fff"
                                    />
                                </Button>
                                <Image
                                    style={{
                                        justifyContent: 'center',
                                        height: '100%',
                                    }}
                                    source={
                                        !!profile_photo && profile_photo.uri ? {
                                            uri: profile_photo.uri
                                        } :
                                            require('../../../../assets/icons/user.png')
                                    } />

                            </View>
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 20,
                                    textAlign: 'center',
                                    marginVertical: 10,
                                    color: '#333'

                                }}>
                                {`${first_name} ${last_name}`}
                            </Text>
                        </View>
                        {!is_verified ?
                            <View style={{ width: deviceWidth, flexDirection: 'row-reverse', padding: 25, justifyContent: 'center' }}>
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 16,
                                        textAlign: 'center',
                                        width: '70%',
                                        marginVertical: 10,
                                        color: 'red',
                                    }}>
                                    {locales('labels.youAreNotAuthorized')}
                                </Text>
                                <Button
                                    style={[styles.loginButton, {
                                        width: '30%',
                                        alignSelf: 'center', alignItems: 'center', justifyContent: 'center', margin: 0,
                                    }]}

                                    onPress={() => this.props.navigation.navigate('MyBuskool', { screen: 'Authentication' })}>
                                    <Text style={{
                                        color: 'white',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        textAlign: 'center'
                                    }}>
                                        {locales('labels.authentication')}
                                    </Text>
                                </Button>
                            </View> : null}

                        <Card transparent>
                            <View style={{
                                paddingHorizontal: 10
                            }}>

                                <Text style={{
                                    marginTop: 20,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    color: '#333'
                                }}>
                                    {locales('labels.writeAboutYourActivity')}
                                </Text>

                                <Textarea
                                    onChangeText={this.handleDescriptionChange}
                                    value={description}
                                    style={{
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        backgroundColor: '#fff',
                                        paddingHorizontal: 15,
                                        paddingVertical: 2,
                                        borderWidth: 1,
                                        borderColor: '#777',
                                        color: '#333',
                                        fontSize: 13,
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        height: deviceHeight * 0.25,
                                    }}
                                    bordered
                                    placeholderTextColor="#BEBEBE"
                                    placeholder={locales('titles.headerDescription')} />

                            </View>
                            <View style={{
                                marginTop: 20
                            }}>
                                <Button
                                    style={[styles.loginButton, { alignSelf: 'center' }]}
                                    onPress={this.editProfile}>
                                    <Text style={[styles.buttonText, { margin: 0, alignSelf: 'center' }]}>
                                        {locales('titles.submitChanges')}
                                    </Text>
                                    <ActivityIndicator size="small"
                                        animating={!!editProfileLoading} color="white"
                                        style={{
                                            position: 'absolute', left: '28%', top: '28%',
                                            width: 25, height: 25, borderRadius: 15
                                        }}
                                    />
                                </Button>
                                {imageSizeError ?
                                    <Text style={{
                                        width: '100%',
                                        color: 'black',
                                        marginVertical: 10,
                                        paddingHorizontal: 15,
                                        backgroundColor: '#E41C38',
                                        paddingVertical: 5,
                                        borderRadius: 4
                                    }}
                                    >{locales('errors.imageSizeError')}</Text>
                                    : null}

                                {editErrors.length ?
                                    <Text style={{
                                        width: '100%',
                                        color: 'white',
                                        marginVertical: 10,
                                        paddingHorizontal: 15,
                                        backgroundColor: '#E41C38',
                                        paddingVertical: 5,
                                        borderRadius: 4
                                    }}
                                    >{editErrors[0][0]}</Text>
                                    : null}
                            </View>
                        </Card>


                    </View>
                </ScrollView>
            </>
        )
    }
}



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
    deletationSuccessfullContainer: {
        backgroundColor: '#00C569',
        padding: 10,
        borderRadius: 5
    },
    deletationSuccessfullText: {
        textAlign: 'center',
        width: deviceWidth,
        color: 'white'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        width: '100%',
        textAlign: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.8,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 4,
        backgroundColor: '#00C569',
        width: '92%',
        color: 'white',
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
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPassword: {
        textAlign: 'center',
        color: '#7E7E7E',
        fontSize: 16,
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
        paddingVertical: 5,
    },
    userText: {
        flexWrap: 'wrap',
        paddingTop: '3%',
        fontSize: 20,
        padding: 20,
        textAlign: 'center',
        color: '#7E7E7E'
    }
});

const mapStateToProps = (state) => {
    const {
        userProfile,
        userProfileLoading,

        editProfile,
        editProfileLoading
    } = state.profileReducer;

    return {
        userProfile,
        userProfileLoading,

        editProfile,
        editProfileLoading
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserProfile: () => dispatch(profileActions.fetchUserProfile()),
        editProfile: item => dispatch(profileActions.editProfile(item))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)