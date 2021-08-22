import React, { Component, useState, useRef, useEffect } from 'react';
import {
    Image, Text, View, Pressable, ScrollView, StyleSheet, ActivityIndicator, Linking,
    FlatList, LayoutAnimation, UIManager, Platform, Modal, Animated
} from 'react-native';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import { Dialog, Portal, Paragraph, Checkbox } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import analytics from '@react-native-firebase/analytics';
import { connect } from 'react-redux';
import { Button, Textarea, ActionSheet, InputGroup, Label } from 'native-base';
import ShadowView from '@vikasrg/react-native-simple-shadow-view';

import Feather from 'react-native-vector-icons/dist/Feather';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import * as profileActions from '../../../redux/profile/actions';
import { permissions, deviceHeight, deviceWidth, validator } from '../../../utils';
import Header from '../../../components/header';

let myTimeout;

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
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
            showSubmitEditionModal: false,
            shouldShowContactInfo: false,
            showViewPermissionModal: false,
            ProfileAccomplishmentItemsArray: [
                {
                    id: 1,
                    parentRoute: 'MyBuskool',
                    childRoute: 'Authentication',
                    params: {},
                    title: 'labels.authentication',
                    text: 'titles.profileAccomplishmentItemsText',
                    buttonText: 'labels.editProfileAuthentication',
                    icon: <MaterialIcons size={25} name='verified-user' color='#556080' />,
                    shouldShow: true
                },
                {
                    id: 2,
                    parentRoute: 'MyBuskool',
                    childRoute: 'Authentication',
                    params: {},
                    title: 'titles.aboutYou',
                    text: 'labels.writeDescriptionText',
                    buttonText: 'titles.aboutYou',
                    icon: <MaterialIcons size={25} name='article' color='#556080' />,
                    shouldShow: true
                },
                {
                    id: 3,
                    parentRoute: 'MyBuskool',
                    childRoute: 'Authentication',
                    params: {},
                    title: 'titles.profilePicture',
                    text: 'labels.selectProfilePicText',
                    buttonText: 'titles.profilePicture',
                    icon: <FontAwesome5 size={25} name='user-circle' color='#556080' solid />,
                    shouldShow: true
                },
                {
                    id: 4,
                    parentRoute: 'MyBuskool',
                    childRoute: 'Referral',
                    params: {},
                    title: 'titles.introduceToFirends',
                    text: 'labels.shareBuskoolWithFriendsText',
                    buttonText: 'titles.introduceToFirends',
                    icon: <FontAwesome5 size={20} name='share-alt' color='#556080' />,
                    shouldShow: true
                },
            ],
        }

    }

    componentDidMount() {
        analytics().logEvent('profile_edit');
        this.init();

    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.userProfile != this.props.userProfile)
            this.init();
    };


    init = async _ => {
        const {
            userProfile = {}
        } = this.props;

        const {
            profile = {},
            user_info = {}
        } = userProfile;

        const userFriendsData = await this.props.fetchUserFriendsData();

        if (userProfile && Object.entries(userProfile).length) {

            const {
                profile_photo,
                is_company,
                company_name,
                company_register_code,
                public_phone,
                description
            } = profile;

            const {
                first_name,
                last_name,
                is_verified,
                is_seller,
                phone_allowed
            } = user_info;

            let stateProfilePhoto = { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${profile_photo}` };

            let tempList = [...this.state.ProfileAccomplishmentItemsArray];

            tempList.forEach(item => {
                if (item.title == 'titles.profilePicture')
                    item.shouldShow = !profile_photo;

                if (item.title == 'titles.aboutYou')
                    item.shouldShow = !description || (description &&
                        (description == locales('labels.sellerProfileDefaultText') ||
                            description == locales('labels.buyerProfileDefaultText')));

                if (item.title == 'labels.authentication')
                    item.shouldShow = !is_verified;

                if (item.title == 'titles.introduceToFirends') {

                    const {
                        payload = {}
                    } = userFriendsData;

                    const {
                        invited_users = []
                    } = payload;

                    item.shouldShow = !invited_users.length;

                }

            });

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
                shouldShowContactInfo: phone_allowed,
                ProfileAccomplishmentItemsArray: tempList

            });
        }
    };

    editProfile = (descriptionFromChild) => {
        return new Promise((resolve, reject) => {
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

            formData.append('description', descriptionFromChild ?? description);
            formData.append('public_phone', public_phone);
            formData.append('is_company', is_company);
            formData.append('company_register_code', company_register_code);
            formData.append('company_name', company_name);
            if (!!profile_photo && profile_photo.type)
                formData.append('profile_photo', profile_photo);

            this.props.editProfile(formData).then(result => {
                resolve(true);
                this.setState({ showSubmitEditionModal: true }, () => {
                    setTimeout(() => {
                        this.props.fetchUserProfile();
                    }, 1000);
                });
            }).catch(err => {
                if (err.data && err.data.errors)
                    this.setState({ editErrors: Object.values(err.data.errors) });
            });
        })
    };


    handleContactInfoCheckBoxChange = _ => {
        this.setState({ shouldShowContactInfo: !this.state.shouldShowContactInfo }, _ => {
            this.props.setPhoneNumberViewPermission(!!this.state.shouldShowContactInfo)
                .then(result => {
                    this.setState({ showViewPermissionModal: true }, _ => {
                        myTimeout = setTimeout(() => {
                            this.setState({ showViewPermissionModal: false }, _ => clearTimeout(myTimeout));
                        }, 3000);
                    })
                });
        })
    };

    openActionSheet = fromAccomplishment => ActionSheet.show(
        {
            options: [locales('labels.camera'), locales('labels.gallery')],
        },
        buttonIndex => this.onActionSheetClicked(buttonIndex, fromAccomplishment)
    );

    handleDescriptionChange = description => this.setState({ description });

    onActionSheetClicked = async (buttonIndex, fromAccomplishment) => {
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
        const prevImagePickerLibraryOptions = {
            width: 300,
            height: 400,
            cropping: true,
            mediaType: 'photo',
        };

        switch (buttonIndex) {
            case 0: {
                this.setState({ errorFlag: false });

                const isAllowedToOpenCamera = await permissions.requestCameraPermission();

                if (!isAllowedToOpenCamera)
                    return;

                launchCamera(options, image => {
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
                    },
                        _ => {
                            if (fromAccomplishment)
                                this.editProfile();
                        }
                    )
                });
                break;
            }
            case 1: {
                this.setState({ errorFlag: false });
                launchImageLibrary(options, image => {
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
                    },
                        _ => {
                            if (fromAccomplishment)
                                this.editProfile();
                        }
                    )
                });
                break;
            }
            default:
                break;
        }

    };

    shareProfile = async _ => {

        const {
            userProfile = {}
        } = this.props;

        const {
            user_info = {}
        } = userProfile;

        const {
            user_name
        } = user_info;

        const url = `whatsapp://send?text=${REACT_APP_API_ENDPOINT_RELEASE}/shared-profile/${user_name}`;

        Linking.canOpenURL(url).then((supported) => {
            if (!!supported) {
                Linking.openURL(url)
            } else {
                Linking.openURL(url)
            }
        })
            .catch(() => {
                Linking.openURL(url)
            })
    };

    render() {
        const {
            editProfileLoading,
            userProfileLoading,
            editProfileMessage,
            editProfileError,
            userProfile = {},
            phoneNumberViewPermissionLoading,
            phoneNumberViewPermission,
        } = this.props;

        const {
            user_info = {}
        } = userProfile;
        const {
            is_seller,
            user_name
        } = user_info;

        const {
            profile_photo,

            description,
            imageSizeError,
            first_name,
            last_name,
            is_verified,

            showSubmitEditionModal,
            shouldShowContactInfo,
            showViewPermissionModal,
            ProfileAccomplishmentItemsArray = []
        } = this.state;

        return (
            <>
                {userProfileLoading ?
                    <View style={{
                        backgroundColor: 'white', flex: 1, width: deviceWidth, height: deviceHeight,
                        position: 'absolute',
                        borderColor: 'black',
                        backgroundColor: 'white',
                    }}>
                        <ActivityIndicator size={70}
                            style={{
                                position: 'absolute', left: '42%', top: '40%',
                                elevation: 0,
                                borderColor: 'black',
                                backgroundColor: 'white', borderRadius: 25
                            }}
                            color="#00C569"

                        />
                    </View> : null}

                <Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        dismissable
                        onDismiss={() => this.setState({ showViewPermissionModal: false })}
                        visible={showViewPermissionModal}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={() => this.setState({ showViewPermissionModal: false })}
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
                                onPress={() => this.setState({ showViewPermissionModal: false })}>

                                <Text style={styles.closeButtonText}>{locales('titles.gotIt')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal >


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

                <Header
                    title={locales('titles.editProfile')}
                    shouldShowAuthenticationRibbonFromProps
                    {...this.props}
                />

                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    style={{
                        paddingVertical: 30,
                        backgroundColor: '#fff'
                    }}
                >
                    <View style={{
                        paddingBottom: 60

                    }}>

                        <View>

                            <View
                                style={{
                                    width: 130,
                                    height: 130,
                                    borderRadius: 75,
                                    alignSelf: 'center',
                                    overflow: "hidden",
                                    shadowColor: 'black',
                                    shadowOpacity: 0.13,
                                    shadowRadius: 1,
                                    shadowOffset: { width: 0, height: 2 },

                                }}
                            >
                                <ShadowView>
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

                                </ShadowView>
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
                            <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', textAlign: 'center', alignItems: 'center' }}>
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 13,
                                        textAlign: 'center',
                                        color: '#e41c38',
                                    }}>
                                    {locales('labels.youAreNotAuthorized')}
                                </Text>
                                <Pressable
                                    android_ripple={{
                                        color: '#ededed'
                                    }}
                                    style={[styles.loginButton, {
                                        width: 90,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: 10,
                                        height: 25,
                                        backgroundColor: '#556080',

                                    }]}

                                    onPress={() => this.props.navigation.navigate('MyBuskool', { screen: 'Authentication' })}>
                                    <Text style={{
                                        color: 'white',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        textAlign: 'center',
                                        width: '100%',
                                        fontSize: 12
                                    }}>
                                        {locales('labels.editProfileAuthentication')}
                                    </Text>
                                </Pressable>
                            </View> : null}

                        {ProfileAccomplishmentItemsArray &&
                            ProfileAccomplishmentItemsArray.length &&
                            ProfileAccomplishmentItemsArray.filter(item => item.shouldShow).length > 0 ?
                            <ProfileAccomplishes
                                handleDescriptionChange={this.handleDescriptionChange}
                                openActionSheet={this.openActionSheet}
                                ProfileAccomplishmentItemsArrayFromProps={ProfileAccomplishmentItemsArray}
                                editProfileFromParent={this.editProfile}
                                {...this.props}
                            />
                            : null}

                        <View style={{
                            paddingHorizontal: 10
                        }}>
                            <Text style={{
                                marginTop: 10,
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
                                    borderColor: '#999999',
                                    color: '#333',
                                    fontSize: 13,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    height: deviceHeight * 0.25,
                                }}
                                bordered
                                placeholderTextColor="#BEBEBE"
                                placeholder={locales('titles.headerDescription')} />

                        </View>

                        <View
                            activeOpacity={1}
                            style={{
                                backgroundColor: '#F5FBFF',
                                borderRadius: 12,
                                alignSelf: 'center',
                                paddingVertical: 20,
                                paddingHorizontal: 10,
                                marginTop: 20,
                                width: '95%'
                            }}
                        >

                            <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center'
                                }}
                            >
                                <FontAwesome5
                                    color='#404B55'
                                    size={25}
                                    solid
                                    name='exclamation-circle'
                                />
                                <Text
                                    style={{
                                        color: '#404B55',
                                        marginHorizontal: 5,
                                        fontSize: 18,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    }}
                                >
                                    {locales('labels.contactInfo')}
                                </Text>
                            </View>
                            <Text
                                style={{
                                    marginVertical: 15,
                                    color: '#666666',
                                    fontSize: 16,
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                }}
                            >
                                {is_seller ? locales('labels.contactInfoDescription') : locales('titles.buyersPermissionForContactInfo')}
                            </Text>

                            <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    marginVertical: 10,
                                }}
                            >
                                <Checkbox
                                    disabled={!!phoneNumberViewPermissionLoading}
                                    status={shouldShowContactInfo ? 'checked' : 'unchecked'}
                                    onPress={this.handleContactInfoCheckBoxChange}
                                    color='#00C569'
                                />
                                <Text
                                    onPress={this.handleContactInfoCheckBoxChange}
                                    style={{
                                        color: '#666666',
                                        fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    }}
                                >
                                    {locales('labels.limitAccess')}
                                </Text>
                                <ActivityIndicator
                                    animating={!!phoneNumberViewPermissionLoading}
                                    color='#00C569'
                                    style={{ marginHorizontal: 5 }}
                                />
                            </View>

                        </View>

                        <View style={{
                            marginTop: 20
                        }}>
                            <Button
                                style={[styles.loginButton, { alignSelf: 'center' }]}
                                onPress={_ => this.editProfile()}>
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
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    paddingVertical: 5,
                                    borderRadius: 4
                                }}
                                >{locales('errors.imageSizeError')}</Text>
                                : null}

                            {editProfileError && editProfileMessage && editProfileMessage.length ?
                                editProfileMessage.map((error, index) => (
                                    <View
                                        style={{
                                            width: deviceWidth, justifyContent: 'center', alignItems: 'center',
                                            alignContent: 'center'
                                        }}
                                        key={index}
                                    >
                                        <Text style={{
                                            width: '100%',
                                            color: '#E41C38',
                                            textAlign: 'center',
                                            marginVertical: 10,
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            paddingHorizontal: 15,
                                            paddingVertical: 5,
                                            borderRadius: 4
                                        }}
                                        >{error}
                                        </Text>
                                    </View>
                                ))
                                : null}
                        </View>

                    </View>

                </ScrollView>

                <Pressable
                    android_ripple={{
                        color: '#ededed'
                    }}
                    activeOpacity={1}
                    onPress={this.shareProfile}
                    style={{
                        width: deviceWidth,
                        flexDirection: 'row-reverse',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#4eb9fb',
                        padding: 10
                    }}
                >
                    <FontAwesome
                        name='address-card'
                        color='white'
                        size={20}
                    />
                    <Text
                        style={{
                            color: 'white',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            marginHorizontal: 7,
                            fontSize: 16
                        }}
                    >
                        {locales('labels.sendYourProfileToYourFriends')}
                    </Text>
                </Pressable>

            </>
        )
    }
};

const ProfileAccomplishes = props => {

    const profileItemsRef = useRef();

    const {
        handleDescriptionChange = _ => { },
        editProfileFromParent = _ => { },
        ProfileAccomplishmentItemsArrayFromProps = []
    } = props;

    // const scale = useRef(new Animated.Value(1)).current;

    const ProfileAccomplishmentItemsArray = ProfileAccomplishmentItemsArrayFromProps.filter(item => item.shouldShow);

    const [isOpen, setIsOpen] = useState(true);

    const [descriptionTextModalVisiblity, setDescriptionTextModalVisiblity] = useState(false);

    const [description, setDescription] = useState('');

    const [descriptionClicked, setDescriptionClicked] = useState(false);

    const [descriptionError, setDescriptionError] = useState('');

    // useEffect(() => {
    //     const onScreenFocusedCallBack = props.navigation.addListener('focus', onScreenFocused);
    //     return _ => onScreenFocusedCallBack;
    // }, []);

    // const onScreenFocused = _ => {
    //     return Voice.onSpeechResults = ({ value = [] }) => {
    //         const lastIndex = value.length - 1;
    //         setDescription(description => `${description} ${value[lastIndex]}`);
    //     }
    // };

    const renderProfileAccomplishmentRate = _ => {
        switch (ProfileAccomplishmentItemsArray.length) {
            case 4:
                return {
                    text: locales('titles.superWeak'),
                    color: '#E41C38'
                };
            case 3:
                return {
                    text: locales('titles.weak'),
                    color: '#ffbb00'
                };
            case 2:
                return {
                    text: locales('titles.intermediate'),
                    color: '#1DA1F2'
                }
            case 1:
                return {
                    text: locales('titles.good'),
                    color: '#00C569'
                };
            case 1:
                return {
                    text: locales('titles.great'),
                    color: '#00C569'
                };
            default:
                break;
        };
    };

    const onProfileAccomplishmentItemButtonPressed = ({ title }) => {
        switch (title) {
            case 'labels.authentication':
                return props.navigation.navigate('MyBuskool', { screen: 'Authentication' });

            case 'titles.introduceToFirends':
                return props.navigation.navigate('MyBuskool', { screen: 'Referral' });

            case 'titles.aboutYou':
                setDescriptionTextModalVisiblity(true);
                break;

            case 'titles.profilePicture':
                return props.openActionSheet(true);

            default:
                break;
        }
    };

    const handleIsOpenArrowPressed = _ => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsOpen(!isOpen);
    };

    const renderProfileAccomplishmentItems = ({ item }) => {
        return (
            <View
                style={{
                    padding: 15,
                    borderRadius: 12,
                    borderWidth: 1,
                    margin: 10,
                    borderColor: '#999999',
                }}
            >
                <View
                    style={{
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                    }}
                >
                    {item.icon}
                    <Text
                        style={{
                            color: '#313A43',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 16,
                            marginHorizontal: 5,
                            textAlignVertical: 'center',

                        }}
                    >
                        {locales(item.title)}
                    </Text>
                </View>
                <Text
                    style={{
                        color: '#7E7E7E',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 14,
                        marginHorizontal: 5,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        width: deviceWidth * 0.6,
                        marginVertical: 10
                    }}
                >
                    {locales(item.text)}
                </Text>
                <Button
                    onPress={_ => onProfileAccomplishmentItemButtonPressed(item)}
                    style={{
                        elevation: 0,
                        backgroundColor: '#00C569',
                        padding: 10,
                        borderRadius: 8,
                        width: deviceWidth * 0.5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            color: 'white',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 16,
                        }}
                    >
                        {locales(item.buttonText)}
                    </Text>
                </Button>
            </View>
        )
    };

    const {
        text,
        color
    } = renderProfileAccomplishmentRate();

    const handleDescriptionTextChange = field => {
        setDescription(field);
        setDescriptionClicked(!!field);
        setDescriptionError((!field || validator.isValidDescription(field)) ? '' : locales('errors.invalidDescription'));
    };

    // const onStartButtonPress = async _ => {
    //     const isAllowed = await permissions.requestVoicePermission();
    //     if (isAllowed) {
    //         Voice.start('fa-IR');
    //         runAnimation();
    //     }
    // };

    // const runAnimation = _ => {
    //     Animated.timing(scale, {
    //         toValue: 2,
    //         duration: 300,
    //         useNativeDriver: true,
    //     }).start(event => {
    //         if (event.finished)
    //             Animated.timing(scale, {
    //                 toValue: 1.7,
    //                 duration: 300,
    //                 useNativeDriver: true
    //             }).start(event => {
    //                 if (event.finished)
    //                     runAnimation()
    //             });
    //     });
    // };

    // const onEndButtonPressed = _ => {
    //     scale.stopAnimation();
    //     Animated.timing(scale, {
    //         duration: 100,
    //         toValue: 1,
    //         useNativeDriver: true
    //     }).start();
    //     Voice.stop()
    // };

    const onSubmit = _ => {

        if (!description) {
            setDescriptionClicked(true);
            setDescriptionError(locales('errors.fieldNeeded', { fieldName: locales('titles.headerDescription') }));
        }

        else if (description && !validator.isValidDescription(description)) {
            setDescriptionClicked(true);
            setDescriptionError(locales('errors.invalidDescription'));
        }

        else if (description && description.length < 200) {
            setDescriptionClicked(true);
            setDescriptionError(locales('errors.canNotBeLessThanChar', { fieldName: locales('titles.headerDescription'), number: '200' }));
        }

        else {
            setDescriptionClicked(false);
            setDescriptionError('');
        }

        if (description && !descriptionError && description.length > 200) {
            setDescriptionClicked(false);
            handleDescriptionChange(description);
            editProfileFromParent(description).then(_ => {
                profileItemsRef?.current?.scrollToIndex({ index: 0 });
                setDescriptionTextModalVisiblity(false)
            });
        }
    };

    return (
        <>
            {descriptionTextModalVisiblity ?
                <Modal
                    animationType='fade'
                    transparent={false}
                    visible={descriptionTextModalVisiblity}
                    onRequestClose={_ => setDescriptionTextModalVisiblity(false)}
                >

                    <Header
                        title={locales('titles.aboutYou')}
                        onBackButtonPressed={_ => setDescriptionTextModalVisiblity(false)}
                    />
                    <ScrollView
                        keyboardDismissMode='none'
                        keyboardShouldPersistTaps='handled'
                        style={{
                            flex: 1,
                            paddingHorizontal: 10,
                        }}
                    >
                        <Text style={{
                            marginTop: 10,
                            marginBottom: 5,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 18,
                            color: '#555555'
                        }}>
                            {locales('labels.writeAboutYourSelf')}
                        </Text>

                        {/* <View
                            style={{
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 10,
                            }}
                        >
                            <Text style={{
                                marginTop: 10,
                                marginBottom: 5,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                color: '#909090'
                            }}>
                                {locales('labels.holdButtonTo')}
                            </Text>
                            <FontAwesome5
                                name='microphone'
                                color='white'
                                size={20}
                                solid
                                style={{
                                    width: 35,
                                    height: 35,
                                    borderRadius: 100,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                    marginHorizontal: 5,
                                    backgroundColor: '#1DA1F2'
                                }}
                            />
                            <Text style={{
                                marginTop: 10,
                                marginBottom: 5,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                color: '#909090'
                            }}>
                                {locales('labels.recordToChangeToText')}
                            </Text>
                        </View>
                      */}
                        <View>
                            <InputGroup
                                regular
                                style={{
                                    borderRadius: 4,
                                    borderColor: description ? descriptionError ? '#E41C38' : description.length < 200 ? '#6D7179' : '#00C569' :
                                        descriptionClicked ? '#E41C38' : '#6D7179',
                                    paddingLeft: 15,
                                    paddingHorizontal: 10,
                                    borderWidth: 3,
                                    backgroundColor: '#FBFBFB',
                                }}>
                                <FontAwesome5 name={
                                    description ? descriptionError ? 'times-circle' : description.length < 200 ? 'edit' : 'check-circle' : descriptionClicked
                                        ? 'times-circle' : 'edit'}
                                    color={description ? descriptionError ? '#E41C38' : description.length < 200 ? '#6D7179' : '#00C569'
                                        : descriptionClicked ? '#E41C38' : '#BDC4CC'}
                                    size={16}
                                    solid
                                    style={{ position: 'absolute', top: 10, left: 10 }}
                                />
                                <Textarea
                                    onChangeText={handleDescriptionTextChange}
                                    error=''
                                    value={description}
                                    autoCapitalize='none'
                                    autoCompleteType='off'
                                    autoCorrect={false}
                                    style={{
                                        paddingTop: 10,
                                        direction: 'rtl',
                                        textAlign: 'right',
                                        width: '100%',
                                        minHeight: deviceHeight * 0.4,
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        paddingHorizontal: 15,
                                        paddingVertical: 2,
                                        color: '#333',
                                        fontSize: 13,
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    }}
                                    placeholderTextColor="#BEBEBE"
                                    placeholder={`${locales('titles.writeHere')}...`}
                                />
                            </InputGroup>
                            <View
                                style={{
                                    borderTopWidth: 1,
                                    borderTopColor: '#E0E0E0',
                                    padding: 10,
                                    zIndex: 1000,
                                    flexDirection: 'row-reverse',
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '97%',
                                    bottom: 0,
                                    position: 'absolute'
                                }}
                            >
                                {/* <Animated.View
                                    style={{
                                        transform: [{ scale }],
                                        width: 38,
                                        height: 38,
                                        borderRadius: 100,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Pressable
                                        onPressIn={onStartButtonPress}
                                        onPressOut={onEndButtonPressed}
                                    >
                                        <FontAwesome5
                                            name='microphone'
                                            color='white'
                                            size={20}
                                            solid
                                            style={{
                                                width: 35,
                                                height: 35,
                                                borderRadius: 100,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                alignSelf: 'center',
                                                textAlign: 'center',
                                                textAlignVertical: 'center',
                                                marginHorizontal: 5,
                                                backgroundColor: '#1DA1F2'
                                            }}
                                        />
                                    </Pressable>
                                </Animated.View> */}
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 14,
                                        color: description.length >= 200 ? '#00C569' : '#E41C38'
                                    }}
                                >
                                    {description.length} / 200
                                </Text>
                            </View>
                        </View>

                        {descriptionError ?
                            <Label style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                height: 20, fontSize: 14, color: '#D81A1A'
                            }}>
                                {!!descriptionError && descriptionError}
                            </Label>
                            : null
                        }

                        <View
                            style={{
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 10
                            }}
                        >
                            {/* <Button
                                onPress={_ => setDescriptionTextModalVisiblity(false)}
                                style={{
                                    elevation: 0,
                                    backgroundColor: '#eee',
                                    padding: 10,
                                    borderRadius: 8,
                                    width: deviceWidth * 0.45,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    marginTop: 20
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: 'black',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 16,
                                    }}
                                >
                                    {locales('titles.close')}
                                </Text>
                            </Button> */}

                            <Button
                                onPress={onSubmit}
                                style={{
                                    elevation: 0,
                                    backgroundColor: description && !descriptionError ? '#00C569' : '#eee',
                                    padding: 10,
                                    borderRadius: 8,
                                    width: deviceWidth * 0.85,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: 'white',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 16,
                                    }}
                                >
                                    {locales('labels.save')}
                                </Text>
                                {props.editProfileLoading ?
                                    <ActivityIndicator
                                        size={20}
                                        style={{
                                            position: 'absolute',
                                            left: '20%',
                                            top: '40%',
                                            elevation: 0,
                                            borderRadius: 25
                                        }}
                                        color="white"

                                    />
                                    : null}
                            </Button>
                        </View>
                    </ScrollView>
                </Modal>
                :
                null}
            <View
                style={{
                    borderBottomColor: '#EBEBEB',
                    borderBottomWidth: 10,
                }}
            >
                <View
                    style={{
                        paddingHorizontal: 10
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    color: '#555555',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 16
                                }}
                            >
                                {locales('labels.profileAccomplishes')}
                            </Text>
                            <Text
                                style={{
                                    color,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 16
                                }}
                            >
                                {` ${text}`}
                            </Text>
                        </View>
                        <FontAwesome5
                            solid
                            onPress={handleIsOpenArrowPressed}
                            name={`angle-${isOpen ? 'up' : 'down'}`}
                            color='#666666'
                            style={{
                                padding: 10,
                                width: 40,
                                height: 40
                            }}
                            size={20}
                        />
                    </View>

                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 10,
                        }}
                    >
                        {[1, 2, 3, 4].map((item, index, self) => (
                            <View
                                key={item}
                                style={{
                                    borderRadius: 7,
                                    backgroundColor: index < self.length - (ProfileAccomplishmentItemsArray.length) ? '#00C569' : '#eee',
                                    width: '23.5%',
                                    height: 6,
                                }}
                            >
                            </View>
                        ))
                        }
                    </View>
                    <Text
                        style={{
                            color: '#999999',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 14,
                            marginTop: 10,
                            width: '100%',
                            marginBottom: isOpen ? 0 : 10
                        }}
                    >
                        {locales('labels.profileAccomplishmentText')}
                    </Text>
                </View>

                {
                    isOpen ?
                        <FlatList
                            ref={profileItemsRef}
                            renderItem={renderProfileAccomplishmentItems}
                            data={ProfileAccomplishmentItemsArray}
                            style={{ marginTop: 20 }}
                            keyExtractor={(item) => item.id.toString()}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            inverted
                        />
                        : null
                }
            </View >
        </>
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
        editProfileLoading,
        editProfileMessage,
        editProfileError,

        phoneNumberViewPermissionLoading,
        phoneNumberViewPermissionFailed,
        phoneNumberViewPermissionError,
        phoneNumberViewPermissionMessage,
        phoneNumberViewPermission,
    } = state.profileReducer;

    return {
        userProfile,
        userProfileLoading,

        editProfile,
        editProfileLoading,
        editProfileMessage,
        editProfileError,

        phoneNumberViewPermissionLoading,
        phoneNumberViewPermissionFailed,
        phoneNumberViewPermissionError,
        phoneNumberViewPermissionMessage,
        phoneNumberViewPermission,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserProfile: () => dispatch(profileActions.fetchUserProfile()),
        editProfile: item => dispatch(profileActions.editProfile(item)),
        setPhoneNumberViewPermission: permission => dispatch(profileActions.setPhoneNumberViewPermission(permission)),
        fetchUserFriendsData: _ => dispatch(profileActions.fetchUserFriendsData()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)