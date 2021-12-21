import React, { useState, useEffect } from 'react';
import {
    Linking,
    Image,
    View,
    Text,
    Pressable,
    BackHandler,
    AppState,
    StyleSheet,
    Modal
} from 'react-native';
import { Dialog, Paragraph } from 'react-native-paper';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { REACT_APP_API_ENDPOINT_RELEASE, APP_UPDATE_TYPE } from '@env';
import DeviceInfo from 'react-native-device-info';
import Axios from 'axios';
import moment from 'moment';
import analytics from '@react-native-firebase/analytics';

import SplashScreen from 'react-native-splash-screen'
import AsyncStorage from '@react-native-async-storage/async-storage';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import {
    HomeStack,
    MessagesStack,
    MyBuskoolStack,
    RegisterProductStack,
    RegisterRequestStack,
    SpecialProductsStack,
    RequestsStack,
    unSignedInRoutes,
    StartUp
}
    from './tabs';

import { deviceWidth, deviceHeight } from '../utils';
import * as productActions from '../redux/registerProduct/actions';
import * as profileActions from '../redux/profile/actions';
import * as requestActions from '../redux/buyAdRequest/actions';
import { navigationRef, isReadyRef } from './rootNavigation';
import linking from './linking';
import Entypo from 'react-native-vector-icons/dist/Entypo';

let currentRoute = '',
    promotionModalTimeout,
    modalTimeout,
    guidModalTimeout;

const routes = props => {

    const {
        initialRoute,
        userProfile = {},
        newMessage,
        loggedInUserId,
        goldenBuyAdsList = []
    } = props;

    const {
        user_info = {},
        profile = {},
    } = userProfile;

    let {
        profile_photo = ''
    } = profile;

    let {
        is_seller,
        wallet_balance = 0,
        active_pakage_type,
    } = user_info;

    is_seller = is_seller == 0 ? false : true;

    const [shouldShowBottomMenu, setShouldShowBottomMenu] = useState(true);

    const [updateModalFlag, setUpdateModalFlag] = useState(false);

    const [showPromotionModal, setShowPromotionModal] = useState(false);

    const [showSuggestedBuyerModal, setShowSuggestedBuyerModal] = useState(false);

    const [isForceUpdate, setIsForceUpdate] = useState(false);

    const [contactInfoGuidModal, setShowContactInfoGuidModal] = useState(false);

    const [showPromoteRegistrationModal, setShowPromoteRegistrationModal] = useState(false);

    const [souldShowSellerButton, setShouldShowSellerButton] = useState(false);

    const [showRatingModal, setShowRatingModal] = useState(false);

    const [shouldDoAsyncJobs, setShouldDoAsyncJobs] = useState(false);

    const [isUpgradeModuleRaised, setIsUpgradeModuleRaised] = useState(false);

    const [ratingModalSuccessPage, setRatingModalSuccessPage] = useState(false);

    useEffect(() => {

        handleInitialRoute();

        checkForShowingRatingModal();

        AppState.addEventListener('change', handleAppStateChange);

        BackHandler.addEventListener('hardwareBackPress', handleAppBackChanges);

        if (shouldDoAsyncJobs) {
            if (APP_UPDATE_TYPE == 'google')
                checkForUpdate();
            else {
                if (!isUpgradeModuleRaised)
                    upgradeAppFromServer();
            }
        }

        if (shouldDoAsyncJobs && userProfile && typeof userProfile === 'object' && Object.values(userProfile).length) {
            // checkForShowingContactInfoGuid();
            setTimeout(() => checkForShowingPromotionModal(), 5000);
            setShouldDoAsyncJobs(false);
        };

        return _ => {

            isReadyRef.current = true;

            AppState.removeEventListener('change', handleAppStateChange);

            BackHandler.removeEventListener('hardwareBackPress', handleAppBackChanges);

        }
    }, [loggedInUserId, shouldDoAsyncJobs, userProfile])


    const Tab = createMaterialBottomTabNavigator();

    const handleAppStateChange = (nextAppState) => {
        // checkForShowingContactInfoGuid();
        if (global.isAppStateChangedCauseOfPayment && nextAppState == 'active') {
            props.fetchUserProfile().then(res => global.isAppStateChangedCauseOfPayment = false);
        }
        checkForShowingPromotionModal();
    };

    const handleInitialRoute = _ => {
        if (!loggedInUserId) {
            AsyncStorage.getItem('@isIntroductionSeen').then(result => {
                result = JSON.parse(result);
                if (!result)
                    navigationRef?.current?.navigate('StartUp', { screen: 'Intro' })
            })
        }
    };

    const upgradeAppFromServer = _ => {
        setIsUpgradeModuleRaised(true);
        fetch('https://app-download.s3.ir-thr-at1.arvanstorage.com/buskool.json')
            .then(res => {
                res.text().then(result => {
                    const resultOfVersion = JSON.parse(result);
                    if (
                        DeviceInfo.getVersion().toString() !==
                        resultOfVersion.versionName.toString()
                    ) {
                        if (!resultOfVersion.forceUpdate) {
                            setUpdateModalFlag(true);
                        }
                        else {
                            navigationRef?.current?.navigate('UpgradeApp')
                        }
                    }
                });
            });
    };

    const checkForUpdate = _ => {
        Axios.get(`https://play.google.com/store/apps/details?id=com.buskool&en`).then(
            res => {
                const matches = res.data.match(/\b\d{1,2}\.\d{1}\.\d{1}\.\d{4}\.\d{1}\b/);
                if (matches && matches.length) {
                    const version = matches[0];
                    if (
                        DeviceInfo.getVersion() != version
                    ) {
                        const versionParts = version.split('.');
                        if (versionParts[versionParts.length - 1] == '1') {
                            setIsForceUpdate(true);

                        }
                        else {
                            setIsForceUpdate(false);
                        }
                        setShowContactInfoGuidModal(false);
                        setShowPromotionModal(false);
                        setUpdateModalFlag(true)
                    }
                    else {
                        setUpdateModalFlag(false);
                    }
                }
            }
        )
    };

    const checkForShowingRatingModal = _ => {
        if (!!loggedInUserId)
            AsyncStorage.getItem('@ratingModalSeenUsers')
                .then(result => {
                    result = JSON.parse(result);
                    if (!result || !result.length) {
                        result = [];
                        result.push({
                            userId: loggedInUserId,
                            date: moment(),
                            isShown: false
                        });
                        AsyncStorage.setItem('@ratingModalSeenUsers', JSON.stringify(result));
                    }
                    else {
                        const foundIndex = result.findIndex(item => item.userId == loggedInUserId);
                        if (foundIndex > -1) {
                            if (moment().diff(result[foundIndex].date, 'days') >= 5) {
                                if (!result[foundIndex].isShown) {
                                    result[foundIndex].isShown = true;
                                    AsyncStorage.setItem('@ratingModalSeenUsers', JSON.stringify(result));
                                    return setShowRatingModal(true);
                                }
                            }
                        }
                        else {
                            result.push({
                                userId: loggedInUserId,
                                date: moment(),
                                isShown: false
                            });
                            AsyncStorage.setItem('@ratingModalSeenUsers', JSON.stringify(result));
                        }
                    }
                });
    };

    const checkForShowingContactInfoGuid = _ => {

        if (is_seller && wallet_balance == 0) {
            AsyncStorage.getItem('@IsNewSignedUpUser').then(isNewUser => {
                isNewUser = JSON.parse(isNewUser);
                if (isNewUser == true) {
                    AsyncStorage.setItem('@IsNewSignedUpUser', JSON.stringify(false)).then(_ => {
                        guidModalTimeout = setTimeout(() => setShowContactInfoGuidModal(true), 3600000);
                    })
                }
                else {

                    AsyncStorage.getItem('@contactInfoShownTimes').then(result => {
                        result = JSON.parse(result);
                        if (result && result.length > 0) {

                            if (result.length < 5) {

                                if (moment().diff(result[result.length - 1], 'hours') >= 24) {
                                    result.push(moment());
                                    AsyncStorage.setItem('@contactInfoShownTimes', JSON.stringify(result)).then(_ => {
                                        setShowContactInfoGuidModal(true);
                                    })
                                }

                            }

                        }
                        else {
                            result = [];
                            result.push(moment());
                            AsyncStorage.setItem('@contactInfoShownTimes', JSON.stringify(result)).then(_ => {
                                setShowContactInfoGuidModal(true);
                            })
                        }
                    })
                }
            })
        }
    };

    const checkForShowingPromotionModal = _ => {

        const routeName = navigationRef?.current?.getCurrentRoute()?.name;
        const conditions = !!loggedInUserId && is_seller && active_pakage_type == 0 && routeName != 'Chat';
        if (conditions) {

            AsyncStorage.getItem('@IsNewSignedUpUser').then(isNewUser => {
                isNewUser = JSON.parse(isNewUser);
                if (isNewUser == true) {
                    AsyncStorage.setItem('@IsNewSignedUpUser', JSON.stringify(false)).then(_ => {
                        promotionModalTimeout = setTimeout(() => {
                            finalChecksToShowPromotionModal();
                        }, 3600000);
                    })
                }
                else {
                    AsyncStorage.getItem('@promotionModalLastSeen').then(result => {

                        result = JSON.parse(result);

                        if (result) {
                            if (moment().diff(result, 'days') >= 1) {
                                AsyncStorage.setItem('@promotionModalLastSeen', JSON.stringify(moment()));
                                if (!updateModalFlag) {
                                    finalChecksToShowPromotionModal();
                                }
                            }
                            else {
                                setShowPromotionModal(false);
                            }

                        }
                        else {
                            if (!updateModalFlag) {
                                finalChecksToShowPromotionModal();
                                AsyncStorage.setItem('@promotionModalLastSeen', JSON.stringify(moment()))
                            }
                        }

                    })
                }

            }
            )
        };
    };

    const finalChecksToShowPromotionModal = _ => {
        props.fetchRelatedRequests().then((res = {}) => {

            const {
                payload = {}
            } = res;

            const {
                golden_buyAds = []
            } = payload;

            if (golden_buyAds && golden_buyAds.length)
                setShowSuggestedBuyerModal(true);
            else
                setShowPromotionModal(true);
        })
    };

    const closePromotionModal = _ => {
        setShowPromotionModal(false);
        AsyncStorage.setItem('@promotionModalLastSeen', JSON.stringify(moment()));
    };

    const closeSuggestedBuyerModal = _ => {
        AsyncStorage.setItem('@promotionModalLastSeen', JSON.stringify(moment()));
        setShowSuggestedBuyerModal(false);
    };

    const closeRatingModal = _ => {
        setShowRatingModal(false);
    };

    const handleVisiblityOfSellerButtonAndBottomMenu = _ => {

        const routesNotToShow = [
            'Requests',
            'MessagesIndex',
            'Channel',
            'PromoteRegistration',
            'RegisterProduct',
            'ExtraBuyAdCapacity',
            'ExtraProductCapacity',
            'RegisterProductSuccessfully',
            'ChangeRole',
            'Chat',
            'UserFriends',
            'Referral',
            'UserContacts',
            'PaymentType'
        ];

        const currentRouteName = navigationRef?.current?.getCurrentRoute()?.name;

        const shouldShow = loggedInUserId && is_seller && !props.userProfileLoading
            && routesNotToShow.indexOf(currentRouteName) == -1;

        const isBottomMenuVisible = ['Chat', 'Channel', 'Intro'].indexOf(currentRouteName) == -1;

        setShouldShowBottomMenu(isBottomMenuVisible);

        setShouldShowSellerButton(shouldShow);
    };

    const handleAppBackChanges = _ => {

        const canGoBack = navigationRef?.current?.canGoBack();
        if (canGoBack) {
            navigationRef?.current?.goBack();
        }
        else {
            BackHandler.exitApp();
        }
        return true;
    };

    const onRouteStateChanged = ({ key, index, routeNames, history, routes, type, stable }) => {
        handleVisiblityOfSellerButtonAndBottomMenu();
    };

    const onNavigationContainerGotReady = () => {
        isReadyRef.current = true;
        SplashScreen.hide();
        setShouldDoAsyncJobs(true);
    };

    const renderIconColors = (focused, key) => {
        if (focused) {
            if (key == 'RegisterProductStack')
                return 'white';
            return '#FF9828';
        }
        else {
            if (key == 'RegisterProductStack')
                return '#264653';
            return 'white';
        }
    };

    const mapRouteNamesToComponents = item => {
        switch (item.key) {

            case 'Home':
                return HomeStack;

            case 'RequestsStack':
                return RequestsStack;

            default:
                return StartUp;
        }
    }

    const openPromoteRegistrationModal = _ => {
        analytics().logEvent('click_on_suggestion_buyad_modal');
        setShowPromoteRegistrationModal(true);
    };

    const closePromoteRegistrationModal = _ => {
        setShowPromoteRegistrationModal(false);
    };
    let randomIndex = 0;

    if (goldenBuyAdsList && goldenBuyAdsList.length && goldenBuyAdsList.length >= 2)
        randomIndex = Math.floor(Math.random() * (goldenBuyAdsList.length - 2));

    return (
        <>
            {showRatingModal ?
                <Modal
                    animationType="fade"
                    onDismiss={closeRatingModal}
                    onRequestClose={closeRatingModal}
                    visible={showRatingModal}
                    transparent={true}
                >
                    <Dialog
                        onDismiss={closeRatingModal}
                        dismissable
                        visible={showRatingModal}
                        style={styles.dialogWrapper}
                    >

                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={closeRatingModal}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('titles.postComment')}
                            </Paragraph>
                        </Dialog.Actions>
                        {ratingModalSuccessPage ?
                            <View
                                style={{
                                    minHeight: '25%',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <View
                                    style={{
                                        width: '100%',
                                        alignItems: 'center',
                                    }}>

                                    <FontAwesome5 name="check-circle" solid color="#00C569" size={70} />

                                </View>
                                <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                                    <Text style={styles.mainTextDialogModal}>
                                        {locales('labels.thanksForCommenting')}
                                    </Text>

                                </Dialog.Actions>
                            </View>
                            :
                            <>
                                <View
                                    style={{
                                        width: '100%',
                                        alignItems: 'center'
                                    }}>

                                    <FontAwesome5 name="star" solid color="#FFBB00" size={70} />

                                </View>
                                <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                                    <Text style={styles.mainTextDialogModal}>
                                        {locales('labels.satisfyWithBuskool')}
                                    </Text>

                                </Dialog.Actions>
                                <Dialog.Actions
                                    style={{
                                        justifyContent: 'center',
                                        width: '100%',
                                        alignItems: 'center',
                                        flexDirection: 'row-reverse',
                                        padding: 0
                                    }}>
                                    <Button
                                        style={[styles.loginButton, { width: '45%' }]}
                                        onPress={() => {
                                            closeRatingModal();
                                            Linking.canOpenURL('https://play.google.com/store/apps/details?id=com.buskool').then((supported) => {
                                                if (!!supported) {
                                                    Linking.openURL('https://play.google.com/store/apps/details?id=com.buskool')
                                                } else {
                                                    Linking.openURL('https://play.google.com')
                                                }
                                            })
                                                .catch(() => {
                                                    Linking.openURL('https://play.google.com')
                                                })
                                        }}
                                    >

                                        <Text style={[styles.closeButtonText, { color: 'white' }]}>
                                            {locales('labels.yes')}
                                        </Text>
                                    </Button>
                                    <Button
                                        style={[styles.loginButton, { width: '45%', backgroundColor: '#BEBEBE', elevation: 0 }]}
                                        onPress={_ => {
                                            setRatingModalSuccessPage(true);
                                            setTimeout(() => {
                                                setRatingModalSuccessPage(false);
                                                closeRatingModal();
                                            }, 3000);
                                        }}
                                    >

                                        <Text style={[styles.closeButtonText, { color: 'white', elevation: 0 }]}>
                                            {locales('labels.no')}
                                        </Text>
                                    </Button>
                                </Dialog.Actions>
                            </>
                        }
                    </Dialog>
                </Modal >
                :
                null
            }

            {showPromotionModal ?
                <Modal
                    onRequestClose={closePromotionModal}
                    visible={showPromotionModal}
                    transparent={true}
                    animationType="fade"
                    onDismiss={closePromotionModal}
                >
                    <Dialog
                        onDismiss={closePromotionModal}
                        visible={showPromotionModal}
                        style={{ ...styles.dialogWrapper }}
                    >
                        <View
                            style={{
                                backgroundColor: '#E7F9FF',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'center',
                            }}
                        >
                            <FontAwesome5
                                onPress={closePromotionModal}
                                solid
                                size={20}
                                color='#808C9B'
                                name='times'
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                    paddingVertical: 10,
                                    paddingHorizontal: 15
                                }}
                            />

                            <Image
                                style={{
                                    width: '90%',
                                    marginVertical: 20,
                                    alignSelf: 'center'
                                }}
                                resizeMode='contain'
                                source={require('../../assets/images/promotion-icon.png')}
                            />
                            <View
                                style={{
                                    width: deviceWidth * 2,
                                    height: deviceWidth * 2,
                                    borderTopLeftRadius: deviceWidth * 1.5,
                                    borderTopRightRadius: deviceWidth * 1.5,
                                    zIndex: -10,
                                    backgroundColor: 'white',
                                    top: 100,
                                    position: 'absolute'
                                }}
                            >

                            </View>
                        </View>

                        <View
                            style={{
                                paddingHorizontal: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: '#374761',
                                    textAlign: 'center',
                                    fontSize: 25,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    marginVertical: 10
                                }}
                            >
                                {locales('titles.fastAndEasySale')}
                            </Text>
                            <Text
                                style={{
                                    color: '#38485F',
                                    textAlign: 'center',
                                    width: '80%',
                                    alignSelf: 'center',
                                    fontSize: 15,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    marginVertical: 15
                                }}
                            >
                                {locales('labels.promotionModalText')}
                            </Text>
                            <LinearGradient
                                start={{ x: 0, y: 1 }}
                                end={{ x: 0.8, y: 0.2 }}
                                style={{
                                    width: '70%',
                                    borderRadius: 8,
                                    alignSelf: 'center',
                                    padding: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: 20,
                                    minHeight: 60,
                                }}
                                colors={['#FF9828', '#FF6600']}
                            >
                                <Pressable
                                    android_ripple={{
                                        color: '#ededed'
                                    }}
                                    onPress={() => {
                                        closePromotionModal();
                                        navigationRef?.current?.navigate('PromoteRegistration')
                                    }}
                                >
                                    <Text style={[styles.buttonText, {
                                        alignSelf: 'center',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 20,
                                    }]}>{locales('labels.promoteRegistration')}
                                    </Text>
                                </Pressable>
                            </LinearGradient>
                        </View>
                    </Dialog>
                </Modal>
                :
                null
            }

            {showSuggestedBuyerModal ?
                <Modal
                    onRequestClose={closeSuggestedBuyerModal}
                    visible={showSuggestedBuyerModal}
                    transparent={true}
                    animationType="fade"
                    onDismiss={closeSuggestedBuyerModal}
                >
                    <Dialog
                        onDismiss={closeSuggestedBuyerModal}
                        visible={showSuggestedBuyerModal}
                        style={{
                            ...styles.dialogWrapper,
                            width: deviceWidth * 0.95,
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#E7F9FF',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'center',
                            }}
                        >
                            <FontAwesome5
                                onPress={closeSuggestedBuyerModal}
                                solid
                                size={20}
                                color='#808C9B'
                                name='times'
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                    paddingVertical: 10,
                                    paddingHorizontal: 15
                                }}
                            />

                            <View
                                style={{
                                    width: '90%',
                                    marginVertical: 35,
                                    alignSelf: 'center'
                                }}
                            >
                            </View>
                            <Text
                                style={{
                                    width: '90%',
                                    marginVertical: 20,
                                    alignSelf: 'center',
                                    textAlign: 'center',
                                    color: '#374761',
                                    fontSize: 25,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    top: -40
                                }}
                            >
                                {locales('titles.doNotMissThisBuyer')}
                            </Text>
                            <View
                                style={{
                                    width: deviceWidth * 2,
                                    height: deviceWidth * 2,
                                    borderTopLeftRadius: deviceWidth * 1.5,
                                    borderTopRightRadius: deviceWidth * 1.5,
                                    zIndex: -10,
                                    backgroundColor: 'white',
                                    top: 100,
                                    position: 'absolute'
                                }}
                            >

                            </View>
                        </View>

                        <View
                            style={{
                                borderColor: '#c7a84f',
                                borderRadius: 12,
                                marginTop: 10,
                                borderWidth: 2,
                                borderRightWidth: 15,
                                backgroundColor: 'white',
                                width: deviceWidth * 0.9,
                                marginBottom: 20
                            }}>
                            <View style={{
                                paddingHorizontal: 15,
                                alignSelf: 'center',
                                width: '96%',
                                backgroundColor: 'white',
                                flexDirection: 'row-reverse'
                            }}
                            >
                                <View
                                    style={{
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        marginTop: 15,
                                        flexDirection: 'row-reverse'
                                    }}
                                >
                                    <FontAwesome5
                                        solid
                                        name='user-circle'
                                        color='#adadad'
                                        size={22}
                                    />
                                    <Text
                                        style={{
                                            marginHorizontal: 5,
                                            color: '#adadad',
                                            fontSize: 16,
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        }}
                                    >
                                        {`${goldenBuyAdsList[randomIndex]?.first_name} ${goldenBuyAdsList[randomIndex]?.last_name}`}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    padding: 10,
                                    overflow: 'hidden',
                                }}
                            >

                                <Image source={require('../../assets/images/blur-items.jpg')}
                                    style={{
                                        height: '100%',
                                        position: 'absolute',
                                        top: -45,
                                        right: 10,
                                        width: '100%',
                                        zIndex: -1
                                    }}
                                />
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        marginVertical: 43,
                                        top: -10,
                                        fontFamily: 'IRANSansWeb(FaNum)_Light'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#777',
                                            fontSize: 20
                                        }}
                                    >
                                        {`${locales('labels.buyer')} `}
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#556083',
                                            fontSize: 20
                                        }}
                                    >
                                        {/* {this.renderRequirementAmount(item.requirement_amount)} {`${item.subcategory_name} `} */}
                                        {`${goldenBuyAdsList[randomIndex]?.subcategory_name} `}
                                    </Text>
                                    {goldenBuyAdsList[randomIndex]?.name ? <>
                                        <Text
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#777',
                                                fontSize: 20
                                            }}
                                        >
                                            {`${locales('labels.fromType')} `}
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#556083',
                                                fontSize: 20
                                            }}
                                        >
                                            {`${goldenBuyAdsList[randomIndex]?.name} `}
                                        </Text>
                                    </>
                                        : null}
                                    <Text
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#777777',
                                            fontSize: 20
                                        }}
                                    >
                                        {locales('labels.is')}
                                    </Text>
                                </Text>

                                <View style={{
                                    marginVertical: 15,
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center',
                                    width: '100%',
                                    paddingHorizontal: 5,
                                    alignSelf: 'center',
                                    justifyContent: 'center'
                                }}
                                >

                                    <Button
                                        small
                                        onPress={openPromoteRegistrationModal}
                                        style={{
                                            borderColor: '#c7a84f',
                                            width: '54%',
                                            zIndex: 1000,
                                            position: 'relative',
                                            marginHorizontal: 5,
                                            alignSelf: 'center',

                                        }}
                                    >
                                        <LinearGradient
                                            start={{ x: 0, y: 0.51, z: 1 }}
                                            end={{ x: 0.8, y: 0.2, z: 1 }}
                                            colors={['#c7a84f', '#f9f29f', '#c7a84f']}
                                            style={{
                                                width: '100%',
                                                paddingHorizontal: 10,
                                                flexDirection: 'row-reverse',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 8,
                                                paddingLeft: 20,
                                                padding: 8,
                                                elevation: 0
                                            }}
                                        >
                                            <FontAwesome5
                                                solid
                                                name='phone-square-alt'
                                                color='#333'
                                                size={20} />
                                            <Text
                                                style={{
                                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                    marginHorizontal: 3,
                                                    fontSize: 18,
                                                    color: '#333',
                                                    paddingHorizontal: 3
                                                }}
                                            >
                                                {locales('labels.callWithBuyer')}
                                            </Text>
                                        </LinearGradient>

                                    </Button>

                                    <Button
                                        onPress={openPromoteRegistrationModal}
                                        style={[styles.loginButton,
                                        {
                                            alignSelf: 'center',
                                            backgroundColor: 'white',
                                            width: '47%',
                                            borderWidth: 1,
                                            borderColor: '#556080',
                                            paddingHorizontal: 10,
                                            flexDirection: 'row-reverse',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            justifyContent: 'center',
                                            height: 45,
                                            borderRadius: 6,
                                        }]}
                                    >
                                        <MaterialCommunityIcons
                                            name='message'
                                            color='#556080'
                                            size={20}
                                        />
                                        <Text style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            fontSize: 18,
                                            color: '#556080',
                                            paddingHorizontal: 3
                                        }}>
                                            {locales('labels.messageToBuyer')}
                                        </Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </Dialog>
                </Modal>
                :
                null
            }
            {showPromoteRegistrationModal ?
                <Modal
                    onRequestClose={closePromoteRegistrationModal}
                    visible={showPromoteRegistrationModal}
                    animationType="fade"
                    transparent={true}
                    onDismiss={closePromoteRegistrationModal}
                >
                    <Dialog
                        onDismiss={closePromoteRegistrationModal}
                        visible={showPromoteRegistrationModal}
                        style={{
                            ...styles.dialogWrapper,
                            width: deviceWidth * 0.95,
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: deviceHeight > 790 ? deviceHeight * 0.59 : deviceHeight * 0.7,
                            paddingTop: 17
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#E7F9FF',
                                width: '100%',
                                alignItems: 'center',
                                height: '10%',
                                justifyContent: 'center',
                                alignSelf: 'center',
                            }}
                        >
                            <FontAwesome5
                                onPress={closePromoteRegistrationModal}
                                solid
                                size={20}
                                color='#808C9B'
                                name='times'
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                    paddingVertical: 10,
                                    paddingHorizontal: 15
                                }}
                            />

                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('labels.goldenRequests')}
                            </Paragraph>
                        </View>
                        <View
                            style={{
                                width: '100%',
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <View
                                style={{
                                    width: '100%',
                                    height: '60%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        width: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>

                                    <AntDesign name="exclamation"
                                        color="#f8bb86"
                                        size={70}
                                        style={[styles.dialogIcon, {
                                            borderColor: '#facea8',
                                        }]} />

                                </View>
                                <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                                    <Text style={styles.mainTextDialogModal}>
                                        {locales('labels.accessToGoldensDeined')}
                                    </Text>

                                </Dialog.Actions>
                                <Paragraph
                                    style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#e41c38', paddingHorizontal: 15, textAlign: 'center' }}>
                                    {locales('labels.icreaseToSeeGoldens')}
                                </Paragraph>
                            </View>
                            <View
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    bottom: 0,
                                    justifyContent: 'flex-end',
                                }}
                            >

                                <View style={{
                                    width: '100%',
                                    textAlign: 'center',
                                    alignItems: 'center',
                                    marginBottom: 20
                                }}>
                                    <Button
                                        style={[styles.modalButton,
                                        styles.greenButton, {
                                            borderRadius: 8,
                                            elevation: 0,
                                            maxWidth: deviceWidth * 0.6
                                        }]}
                                        onPress={() => {
                                            closePromoteRegistrationModal();
                                            closeSuggestedBuyerModal();
                                            navigationRef?.current?.navigate('PromoteRegistration');
                                        }}
                                    >

                                        <Text style={styles.buttonText}>{locales('titles.promoteRegistration')}
                                        </Text>
                                    </Button>
                                </View>
                                <Dialog.Actions style={{
                                    justifyContent: 'center',
                                    width: '100%',
                                    padding: 0,
                                    marginTop: 24
                                }}>
                                    <Button
                                        style={styles.modalCloseButton}
                                        onPress={_ => {
                                            closePromoteRegistrationModal();
                                            closeSuggestedBuyerModal();
                                        }
                                        }
                                    >

                                        <Text style={styles.closeButtonText}>{locales('titles.close')}
                                        </Text>
                                    </Button>
                                </Dialog.Actions>
                            </View>
                        </View>
                    </Dialog>
                </Modal>
                : null}

            {contactInfoGuidModal ?
                <Modal
                    onRequestClose={() => setShowContactInfoGuidModal(false)}
                    visible={contactInfoGuidModal}
                    transparent={true}
                    animationType="fade"
                    onDismiss={() => setShowContactInfoGuidModal(false)}

                >
                    <Dialog
                        onDismiss={() => setShowContactInfoGuidModal(false)}
                        dismissable
                        visible={contactInfoGuidModal}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={() => setShowContactInfoGuidModal(false)}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('labels.contactInfoGuid')}
                            </Paragraph>
                        </Dialog.Actions>
                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center'
                            }}>

                            <MaterialCommunityIcons name="exclamation" color="#a5dc86" size={70} style={[styles.dialogIcon, {
                                borderColor: '#edf8e6',
                            }]} />

                        </View>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={styles.mainTextDialogModal}>
                                {locales('labels.contactInfoGuidDescription')}
                            </Text>

                        </Dialog.Actions>
                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            alignItems: 'center',
                            padding: 0
                        }}>
                            <Button
                                style={[styles.loginButton, { width: '50%' }]}
                                onPress={() => {
                                    setShowContactInfoGuidModal(false);
                                    navigationRef?.current?.navigate('MyBuskool', { screen: 'ContactInfoGuid' })
                                }}
                            >

                                <Text style={[styles.closeButtonText, { color: 'white' }]}>{locales('labels.guid')}
                                </Text>
                            </Button>
                        </Dialog.Actions>

                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <Button
                                style={styles.modalCloseButton}
                                onPress={() => setShowContactInfoGuidModal(false)}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.gotIt')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Modal >
                :
                null
            }

            {updateModalFlag ?
                <Modal
                    onRequestClose={_ => isForceUpdate ? null : setUpdateModalFlag(false)}
                    visible={updateModalFlag}
                    animationType="fade"
                    transparent={true}
                >
                    <Dialog
                        visible={updateModalFlag}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={{
                                alignSelf: 'flex-end',
                                paddingRight: 15,
                                paddingTop: 15
                            }}
                        >
                            {!isForceUpdate ?
                                <AntDesign
                                    onPress={() => setUpdateModalFlag(false)}
                                    name="close"
                                    color="#264653"
                                    solid
                                    size={22}
                                />
                                :
                                null
                            }
                        </Dialog.Actions>
                        <Image
                            source={require('../../assets/icons/Component.png')}
                            style={{
                                alignSelf: 'center'
                            }}
                        />
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={[styles.mainTextDialogModal, {
                                fontSize: 18,
                                color: '#15313C',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            }]}>
                                {locales('titles.newVersionUpdate')}
                            </Text>
                        </Dialog.Actions>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={{
                                fontFamily: 'IRANSansWeb(FaNum)',
                                textAlign: 'center',
                                fontSize: 14,
                                color: '#15313C',
                                paddingHorizontal: 15,
                                width: '100%'
                            }}>
                                {locales('titles.clickOnButtonToUpdateApp')}
                            </Text>

                        </Dialog.Actions>
                        <View style={{
                            alignSelf: 'center',
                            justifyContent: 'center',
                            paddingBottom: 30,
                            padding: 10,
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                style={[styles.modalButton, styles.greenButton, {
                                    width: '70%',
                                    flexDirection: 'row-reverse',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }]}
                                onPress={() => {
                                    if (APP_UPDATE_TYPE == 'google') {
                                        Linking.canOpenURL('https://play.google.com/store/search?q=%D8%A8%D8%A7%D8%B3%DA%A9%D9%88%D9%84&c=apps')
                                            .then((supported) => {
                                                if (!!supported) {
                                                    Linking.openURL('https://play.google.com/store/search?q=%D8%A8%D8%A7%D8%B3%DA%A9%D9%88%D9%84&c=apps')
                                                } else {
                                                    Linking.openURL('https://play.google.com')
                                                }
                                            })
                                            .catch(() => {
                                                Linking.openURL('https://play.google.com')
                                            })
                                    }
                                    else {
                                        setUpdateModalFlag(false);
                                        navigationRef?.current?.navigate('UpgradeApp');
                                    }
                                }}
                            >
                                <Entypo
                                    name='google-play'
                                    color='white'
                                    size={22}
                                    style={{
                                        marginHorizontal: 10
                                    }}
                                />
                                <Text style={styles.buttonText}>{locales('titles.updateBuskool')}
                                </Text>
                            </Button>
                        </View>

                    </Dialog>
                </Modal >
                :
                null
            }

            <NavigationContainer
                linking={linking}
                onStateChange={onRouteStateChanged}
                fallback={<View
                    style={{
                        flex: 1,
                        alignContent: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: deviceHeight,
                        width: deviceWidth
                    }}
                >
                    <Text
                        style={{
                            color: '#00C569',
                            textAlign: 'center',
                            fontSize: 20,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold'
                        }}
                    >
                        {locales('labels.pleaseWait')}
                    </Text>
                </View>}
                ref={navigationRef}
                onReady={onNavigationContainerGotReady}
            >


                {(!loggedInUserId) ?
                    (
                        <Tab.Navigator
                            shifting={false}
                            activeColor="#FF9828"
                            inactiveColor="#FFFFFF"
                            barStyle={{
                                backgroundColor: '#313A43',
                                display: shouldShowBottomMenu ? 'flex' : 'none'
                            }}
                        >
                            {unSignedInRoutes.map((item) => (
                                <Tab.Screen
                                    key={item.key}
                                    options={{
                                        tabBarBadge: false,
                                        tabBarLabel: <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium" }}>
                                            {locales(item.label)}
                                        </Text>,
                                        tabBarIcon: ({ focused }) => <View
                                            style={item.key == 'RegisterProductStack' ? {
                                                backgroundColor: !focused ? '#fff' : '#FF9828', height: 30, width: 30,
                                                top: -4, borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                                            } : {}}
                                        >
                                            <FontAwesome5 size={18} name={item.icon} solid color={renderIconColors(focused, item.key)} />
                                        </View>,
                                    }}
                                    name={item.name}
                                    component={mapRouteNamesToComponents(item)}
                                />
                            ))
                            }
                        </Tab.Navigator>
                    )
                    : (
                        <Tab.Navigator
                            initialRouteName={initialRoute}
                            shifting={false}
                            activeColor="#FF9828"
                            inactiveColor="#FFFFFF"
                            barStyle={{ backgroundColor: '#313A43', display: shouldShowBottomMenu ? 'flex' : 'none' }}
                        >
                            <Tab.Screen
                                key={'Home'}
                                listeners={{
                                    tabPress: e => {
                                        currentRoute = e.target;
                                    }
                                }}
                                options={{
                                    tabBarBadge: false,
                                    tabBarLabel: <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium" }}>{locales('labels.home')}</Text>,
                                    tabBarIcon: ({ focused, color }) => <FontAwesome5 size={20} solid name='home' color={color} />,

                                }}
                                name='Home'
                                component={HomeStack}
                            />

                            {is_seller ? <Tab.Screen
                                key={'RequestsStack'}
                                options={{
                                    tabBarBadge: false,
                                    tabBarLabel: <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium" }}>{locales('labels.buyers')}</Text>,
                                    tabBarIcon: ({ focused, color }) => <FontAwesome5 size={20} name='user-friends' solid color={color} />,
                                }}
                                name={'RequestsStack'}
                                component={RequestsStack}
                                listeners={{
                                    tabPress: e => {
                                        currentRoute = e.target;
                                    }
                                }}
                            />
                                :
                                <Tab.Screen
                                    key={'SpecialProducts'}
                                    options={{
                                        tabBarBadge: false,
                                        tabBarLabel: <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium" }}>{locales('labels.suggested')}</Text>,
                                        tabBarIcon: ({ focused, color }) => <FontAwesome5 size={20} name='list-ul' solid color={color} />,
                                    }}
                                    name={'SpecialProducts'}
                                    component={SpecialProductsStack}
                                    listeners={{
                                        tabPress: e => {
                                            currentRoute = e.target;
                                        }
                                    }}
                                />}

                            {is_seller ? <Tab.Screen
                                key={'RegisterProductStack'}
                                listeners={{
                                    tabPress: e => {
                                        if (currentRoute.includes('RegisterProductStack')) {
                                            props.resetRegisterProduct(true);
                                        }

                                        currentRoute = e.target;

                                        if (!!global.resetRegisterProduct)
                                            global.resetRegisterProduct(true)
                                    },
                                }}
                                options={{
                                    tabBarBadge: false,
                                    tabBarLabel: <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium" }}>{locales('labels.registerProduct')}</Text>,
                                    tabBarIcon: ({ focused, color }) => <View
                                        style={{
                                            backgroundColor: color, height: 30, width: 30,
                                            top: -4, borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                                        }}
                                    >
                                        <FontAwesome5 size={18} name='plus' solid color={!!focused ? 'white' : '#264653'} />
                                    </View>,
                                }}
                                name={'RegisterProductStack'}
                                component={RegisterProductStack}
                            />
                                :
                                <Tab.Screen
                                    key={'RegisterRequestStack'}
                                    listeners={{
                                        tabPress: e => {
                                            if (navigationRef?.current?.getCurrentRoute()?.name == 'RegisterRequest')
                                                props.resetRegisterRequest(true)
                                            currentRoute = e.target;
                                        },
                                    }}
                                    options={{
                                        tabBarBadge: false,
                                        tabBarLabel: <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium" }}>{locales('labels.registerRequest')}</Text>,
                                        tabBarIcon: ({ focused, color }) => <View style={{
                                            backgroundColor: color, height: 30,
                                            width: 30, top: -4, borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                                        }}
                                        >
                                            <FontAwesome5 size={18} name='plus' solid color={!!focused ? 'white' : '#264653'} />
                                        </View>,
                                    }}
                                    name={'RegisterRequestStack'}
                                    component={RegisterRequestStack}
                                />}


                            <Tab.Screen
                                key='Messages'
                                listeners={{
                                    tabPress: e => {
                                        // e.preventDefault();
                                        currentRoute = e.target;
                                        // if (is_seller)
                                        //     return navigationRef.current.navigate('Messages', { screen: 'MessagesIndex', params: { tabIndex: 0 } });
                                        // return navigationRef.current.navigate('Messages', { screen: 'MessagesIndex' });
                                    },
                                }}
                                options={{
                                    tabBarBadge: newMessage > 0 ? newMessage : false,
                                    tabBarLabel: <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium" }}>{locales('labels.messages')}</Text>,
                                    tabBarIcon: ({ focused, color }) => <FontAwesome5 size={20} name='comment-alt' solid color={color} />,
                                }}
                                name='Messages'
                                component={MessagesStack}
                            />

                            <Tab.Screen
                                listeners={{
                                    tabPress: e => {
                                        currentRoute = e.target;
                                        // navigationRef.current.navigate('MyBuskool', { screen: 'HomeIndex' })
                                    },
                                }}
                                key={'MyBuskool'}
                                options={{
                                    tabBarBadge: false,
                                    tabBarLabel: <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium" }}>{locales('labels.myBuskool')}</Text>,
                                    tabBarIcon: ({ focused, color }) => (
                                        profile_photo && profile_photo.length ?
                                            <Image
                                                style={{
                                                    borderRadius: deviceWidth * 0.032,
                                                    borderColor: focused ? '#FF9828' : 'white',
                                                    borderWidth: 1,
                                                    width: deviceWidth * 0.064, height: deviceWidth * 0.064
                                                }}
                                                source={{ uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${profile_photo}` }}
                                            />
                                            :
                                            <FontAwesome5
                                                name='user-circle'
                                                size={22}
                                                solid
                                                color={focused ? 'orange' : 'white'}
                                            />

                                    ),
                                }}
                                name='MyBuskool'
                                component={MyBuskoolStack}
                            />
                        </Tab.Navigator>

                    )
                }

            </NavigationContainer >

            {souldShowSellerButton ?
                <Pressable
                    android_ripple={{
                        color: '#ededed',
                        radius: 32.5,
                    }}
                    onPress={_ => navigationRef.current.navigate('Messages', { screen: 'MessagesIndex', params: { tabIndex: 1 } })}
                    style={{
                        width: 65,
                        height: 65,
                        borderRadius: 32.5,
                        backgroundColor: '#E51C38',
                        position: 'absolute',
                        bottom: 70,
                        right: 10,
                        elevation: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <FontAwesome5 name='user-friends' color='white' size={22} solid />
                    <Text style={{
                        color: 'white',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 14,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                    }}>
                        {locales('labels.buyers')}
                    </Text>
                </Pressable>
                : null}
        </>
    )
};

const styles = StyleSheet.create({
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Medium',
        textAlign: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#FF9828',
        borderRadius: 5,
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
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
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'center',
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
        backgroundColor: '#FF9828',
    },
});

const mapStateToProps = ({
    profileReducer,
    messagesReducer,
    buyAdRequestReducer
}) => {

    const {
        goldenBuyAdsList,
    } = buyAdRequestReducer;

    const {
        userProfile,
        userProfileLoading
    } = profileReducer;

    const {
        newMessage
    } = messagesReducer;

    return {
        newMessage,

        userProfile,
        userProfileLoading,

        goldenBuyAdsList
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        resetRegisterProduct: resetTab => dispatch(productActions.resetRegisterProduct(resetTab)),
        resetRegisterRequest: resetTab => dispatch(productActions.resetRegisterRequest(resetTab)),
        fetchRelatedRequests: _ => dispatch(requestActions.fetchRelatedRequests()),
        fetchUserProfile: _ => dispatch(profileActions.fetchUserProfile())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(routes)