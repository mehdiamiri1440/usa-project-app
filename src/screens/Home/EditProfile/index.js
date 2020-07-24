import React from 'react';
import { Image, Text, View, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import { Card, Button, Textarea, ActionSheet } from 'native-base';


import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import * as profileActions from '../../../redux/profile/actions';

class EditProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            profile_photo: {},
            description: '',
            is_company: false,
            public_phone: '',
            company_name: '',
            company_register_code: '',
            imageSizeError: false,
            editErrors: [],
            showSubmitEditionModal: false
        }
    }

    componentDidMount() {

        if (Object.entries(this.props.userProfile).length &&
            Object.entries(this.props.userProfile.profile).length) {
            const {
                profile_photo,
                is_company,
                company_name,
                company_register_code,
                public_phone,
                description
            } = this.props.userProfile.profile;

            let stateProfilePhoto = { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${profile_photo}` };

            this.setState({
                profile_photo: stateProfilePhoto,
                is_company,
                company_name,
                company_register_code,
                public_phone,
                description
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
                }, 2000);
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
        const { userProfile = {}, editProfileLoading, userProfileLoading } = this.props;
        const { user_info = {} } = userProfile;
        const { first_name = '', last_name = '' } = user_info;

        const {
            profile_photo,
            is_company,
            company_name,
            company_register_code,
            public_phone,
            description,
            imageSizeError,

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

                < Portal >
                    <Dialog
                        visible={showSubmitEditionModal}
                    >
                        <Dialog.Actions style={{ justifyContent: 'center', borderBottomWidth: 0.7, borderBottomColor: '#777777' }}>
                            <Paragraph style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                paddingTop: 30, textAlign: 'center', fontSize: 24,
                                color: 'red'
                            }}>
                                <MaterialCommunityIcons
                                    name='checkbox-marked-circle-outline' color='#00C569' size={40}
                                />
                            </Paragraph>
                        </Dialog.Actions>
                        <Dialog.Actions style={{
                            width: '100%',
                        }}>
                            <Text style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', width: '100%', paddingTop: 10, textAlign: 'center', fontSize: 16 }}>
                                {locales('titles.editionsDone')}
                            </Text>

                        </Dialog.Actions>
                        {/* <Dialog.Actions style={{ justifyContent: 'center', width: '100%' }}>
                            <Button
                                style={[styles.loginButton, { width: '90%' }]}
                                onPress={() => this.setState({ showSubmitEditionModal: false })}>
                                <Text style={styles.buttonText}>{locales('titles.gotIt')}
                                </Text>
                            </Button>
                        </Dialog.Actions> */}
                    </Dialog>
                </Portal >


                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 57,
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
                                        padding: 15,
                                        borderWidth: 1,
                                        borderColor: '#777'
                                    }}
                                    rowSpan={4} bordered placeholder={locales('titles.headerDescription')} />

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