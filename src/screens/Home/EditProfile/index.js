import React, { Component, useState } from 'react';
import {
    Image, Text, View, Pressable, ScrollView, StyleSheet, ActivityIndicator, Linking,
    FlatList, LayoutAnimation, UIManager, Platform, Modal, Permission
} from 'react-native';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import { Dialog, Portal, Paragraph, Checkbox } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import analytics from '@react-native-firebase/analytics';
import { connect } from 'react-redux';
import { Button, Textarea, ActionSheet } from 'native-base';
import ShadowView from '@vikasrg/react-native-simple-shadow-view';

import Feather from 'react-native-vector-icons/dist/Feather';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import * as profileActions from '../../../redux/profile/actions';
import { permissions, deviceHeight, deviceWidth } from '../../../utils';
import ContactsListModal from '../../../components/contactsListModal';
import Header from '../../../components/header';

let myTimeout;

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ProfileAccomplishmentItemsArray = [
    {
        id: 1,
        parentRoute: 'MyBuskool',
        childRoute: 'Authentication',
        params: {},
        title: 'labels.authentication',
        text: 'titles.profileAccomplishmentItemsText',
        buttonText: 'labels.editProfileAuthentication',
        icon: <MaterialIcons size={25} name='verified-user' color='#556080' />
    },
    {
        id: 2,
        parentRoute: 'MyBuskool',
        childRoute: 'Authentication',
        params: {},
        title: 'titles.introduceToFirends',
        text: 'labels.shareBuskoolWithFriendsText',
        buttonText: 'titles.introduceToFirends',
        icon: <MaterialIcons size={25} name='verified-user' color='#556080' />
    },
    {
        id: 3,
        parentRoute: 'MyBuskool',
        childRoute: 'Authentication',
        params: {},
        title: 'titles.aboutYou',
        text: 'labels.writeDescriptionText',
        buttonText: 'titles.aboutYou',
        icon: <MaterialIcons size={25} name='verified-user' color='#556080' />
    },
    {
        id: 4,
        parentRoute: 'MyBuskool',
        childRoute: 'Authentication',
        params: {},
        title: 'titles.profilePicture',
        text: 'labels.selectProfilePicText',
        buttonText: 'titles.profilePicture',
        icon: <MaterialIcons size={25} name='verified-user' color='#556080' />
    },
];
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
            showContactListModal: false,
        }
    }


    componentDidMount() {
        analytics().logEvent('profile_edit');

        const {
            userProfile = {}
        } = this.props;

        const {
            profile = {},
            user_info = {}
        } = userProfile;

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
                phone_allowed
            } = user_info;

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
                shouldShowContactInfo: phone_allowed,
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

        this.props.editProfile(formData).then(result => {
            this.setState({ showSubmitEditionModal: true }, () => {
                setTimeout(() => {
                    this.props.fetchUserProfile();
                }, 1000);
            });
        }).catch(err => {
            if (err.data && err.data.errors)
                this.setState({ editErrors: Object.values(err.data.errors) });
        });
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

    openActionSheet = _ => ActionSheet.show(
        {
            options: [locales('labels.camera'), locales('labels.gallery')],
        },
        buttonIndex => this.onActionSheetClicked(buttonIndex)
    );

    handleDescriptionChange = description => this.setState({ description });

    onActionSheetClicked = async (buttonIndex) => {
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


    onRequestCloseContactListModal = _ => {
        this.setState({ showContactListModal: false });
    };

    shareProfileLink = () => {

        const {
            userProfile = {},
        } = this.props;

        const {
            user_info = {}
        } = userProfile;

        const {
            id,
            user_name
        } = user_info;

        this.setState({ showContactListModal: false });
        analytics().logEvent('profile_share', {
            contact_id: id
        });

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


    setShowContactListModal = _ => {
        this.setState({ showContactListModal: true });
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
            showContactListModal
        } = this.state;

        return (
            <>

                {showContactListModal ?
                    <ContactsListModal
                        visible={showContactListModal}
                        onRequestClose={this.onRequestCloseContactListModal}
                        onReject={this.shareProfileLink}
                        sharingUrlPostFix={`/shared-profile/${user_name}`}
                        {...this.props}
                    />
                    : null
                }

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

                        <ProfileAccomplishes
                            handleDescriptionChange={this.handleDescriptionChange}
                            openActionSheet={this.openActionSheet}
                            setShowContactListModal={this.setShowContactListModal}
                            {...this.props}
                        />

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

    const {
        handleDescriptionChange = _ => { },
    } = props;

    const [isOpen, setIsOpen] = useState(true);

    const [descriptionTextModalVisiblity, setDescriptionTextModalVisiblity] = useState(false);

    const [description, setDescription] = useState('');

    const renderProfileAccomplishmentRate = _ => {
        return {
            text: 'ضعیف',
            color: '#313A43'
        }
    };

    const onProfileAccomplishmentItemButtonPressed = ({ title }) => {
        switch (title) {
            case 'labels.authentication':
                return props.navigation.navigate('MyBuskool', { screen: 'Authentication' });

            case 'titles.introduceToFirends':
                props.setShowContactListModal();
                break;

            case 'titles.aboutYou':
                setDescriptionTextModalVisiblity(true);
                break;

            case 'titles.profilePicture':
                return props.openActionSheet();

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
                        textAlignVertical: 'center',

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
                        marginTop: 20
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

    const handleDescriptionTextChange = descriptionText => {
        setDescription(descriptionText);
    };

    const closeDescriptionTextModal = _ => {
        if (description.length < 10)
            handleDescriptionTextChange('');
        else
            handleDescriptionChange(description);
        setDescriptionTextModalVisiblity(false)
    }
    return (
        <>
            {descriptionTextModalVisiblity ?
                <Modal
                    animationType='fade'
                    transparent={false}
                    visible={descriptionTextModalVisiblity}
                    onRequestClose={_ => setDescriptionTextModalVisiblity(false)}
                >
                    <View
                        style={{
                            flex: 1
                        }}
                    >
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
                                onChangeText={handleDescriptionTextChange}
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
                                placeholder={locales('titles.headerDescription')}
                            />
                        </View>
                        <Button
                            onPress={closeDescriptionTextModal}
                            style={{
                                elevation: 0,
                                backgroundColor: '#00C569',
                                padding: 10,
                                borderRadius: 8,
                                width: deviceWidth * 0.5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                marginTop: 20
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
                                {locales('titles.close')}
                            </Text>
                        </Button>
                    </View>
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
                        {[1, 2, 3, 4].map(item => (
                            <View
                                key={item}
                                style={{
                                    borderRadius: 7,
                                    backgroundColor: '#00C569',
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

        profileStatistics,
        profileStatisticsLoading,
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

        profileStatistics,
        profileStatisticsLoading,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserProfile: () => dispatch(profileActions.fetchUserProfile()),
        editProfile: item => dispatch(profileActions.editProfile(item)),
        setPhoneNumberViewPermission: permission => dispatch(profileActions.setPhoneNumberViewPermission(permission))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)