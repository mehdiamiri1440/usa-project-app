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
import Svg, {
    LinearGradient as SvgLinearGradient, G, Defs, Path, ClipPath, Stop, Pattern, Image as SvgImage, Use
} from 'react-native-svg';

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
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { screenHeight } from '../utils/deviceDimenssions';

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
                    <Svg
                        style={{
                            alignSelf: 'center',
                            position: 'absolute',
                            top: '24%',
                            zIndex: 1,
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="60"
                        height="104"
                        fill="none"
                        viewBox="0 0 60 104"
                    >
                        <G clipPath="url(#clip0_3805_5144)">
                            <Path
                                fill="#FF9828"
                                d="M24.021 6.374a43.626 43.626 0 012.75-3.861A25.177 25.177 0 0129.741 0c0 2.669-.02 5.336-.059 8.001l-.796.232c-2.251.683-3.237 2.031-3.213 4.384 0 2.067 1.063 3.284 3.338 3.884 1.325 1.004.475 2.376.671 3.618-.776.023-1.55.095-2.316.214-8.204 1.782-12.237 11.767-6.041 19.008l.653.689.671.67c.428.541.749 1.314 1.307 1.581 1.889.909 3.861 1.64 5.803 2.435v4.325a15.675 15.675 0 00-3.623 10.508c.083 4.597.927 9.177 1.443 13.768l-1.532.096-5.376.95-5.049 1.431-1.782.594c-.386-1.188-.736-2.298-1.093-3.397-.41-1.616-.814-3.232-1.223-4.847L9.878 52.783c.083-2.133.16-4.26.244-6.392l.433-5.298c1.105-4.855 2.214-9.706 3.327-14.553l1.621-4.384c.396-.986.792-1.976 1.188-2.97l1.14-2.423c.971-1.774 1.943-3.556 2.917-5.346l.523-.992 2.75-4.051zM14.91 48.417V34.998l-.196-.03-1.188 14.797c-.135.413-.22.84-.255 1.271.202 4.057.297 8.132.707 12.166.309 3.077 1.021 6.106 1.592 9.343l3.1-.926c-1.08-6.148-2.138-12.035-3.136-17.94-.285-1.74-.416-3.504-.624-5.262z"
                            ></Path>
                            <Path
                                fill="#D35500"
                                d="M29.7 49.04v-4.324c4.651.101 8.405-1.68 10.799-5.69 1.9-3.178 2.489-6.617.594-10.098-1.889-5.412-5.4-8.732-11.393-8.81-.196-1.187.653-2.613-.671-3.617 1.942.131 3.7-.237 4.603-2.192.749-1.621.73-3.367-.594-4.62-.873-.815-2.197-1.141-3.326-1.688 0-2.665.02-5.332.06-8.001l1.532 1.152.279.268 7.223 9.99 5.15 10.414 3.22 9.462c.376 1.893.754 3.79 1.134 5.69l.933 5.745.314 3.611.042 5.797c-.13 2.377-.154 4.788-.416 7.164-.32 2.97-.843 5.905-1.277 8.857-.208 1.057-.422 2.12-.63 3.178-.433 1.52-.86 3.035-1.294 4.55v.041l-.155.41-4.354-1.307-4.342-1.051-4.722-.69c.279-2.714.35-5.47.885-8.137a21.223 21.223 0 00-2.133-14.725A6.468 6.468 0 0029.7 49.04zm14.85-2.304c-.35 3.564-.594 7.128-1.087 10.633-.428 3.136-1.188 6.219-1.651 9.343-.178 1.153-.695 2.786 1.615 2.53.28 0 .594.5.974.808 2.08-9.177 2.08-18.413 1.343-27.71-.232-1.556-.47-3.106-.7-4.663h-.494v9.059z"
                            ></Path>
                            <Path
                                fill="#184156"
                                d="M29.7 20.12c5.994.076 9.504 3.397 11.452 8.796v2.18c.167 4.158-1.407 7.52-4.847 9.855-2.376 1.61-4.995 2.69-7.947 1.782-1.943-.594-3.832-1.355-5.738-2.044-.226-.22-.452-.445-.672-.67l-.641-.702c-6.196-7.229-2.162-17.226 6.04-19.008.78-.112 1.566-.176 2.353-.19zm-3.059 18.65a8.002 8.002 0 009.504-2.304c2.09-2.489 2.233-6.29.356-9.213-.231-.309-.445-.641-.695-.933a7.96 7.96 0 00-8.642-2.34 7.782 7.782 0 00-5.228 7.253c-.142 3.51 1.55 6.22 4.681 7.538h.024z"
                            ></Path>
                            <Path
                                fill="#699CFF"
                                d="M29.7 49.041c.56.385 1.054.857 1.467 1.396A21.223 21.223 0 0133.3 65.162c-.535 2.667-.594 5.423-.886 8.138a534.358 534.358 0 00-.63 3.766c-.456 2.667-.902 5.346-1.39 8.007-.052.267-.409.481-.593.719a3.113 3.113 0 01-.422-.76c-.267-1.301-.493-2.608-.73-3.915l-.274-1.034-.802-6.765c-.534-4.592-1.378-9.166-1.437-13.77A15.676 15.676 0 0129.7 49.042zM9.878 52.783l1.64 15.343-.321.19-.339.101-1.693.885L1.1 73.021 0 73.508a.232.232 0 00.095-.208V60.232l2.055-1.67 7.728-5.779z"
                            ></Path>
                            <Path
                                fill="#E17C55"
                                d="M14.91 48.417c.207 1.782.338 3.523.635 5.263.998 5.904 2.055 11.791 3.136 17.939l-3.1.927c-.595-3.238-1.284-6.267-1.592-9.344-.41-4.033-.505-8.108-.707-12.165a5.48 5.48 0 01.255-1.271l.244.338c.035 0 .1-.065.107-.095l.368-6.938h.297v6.659h.297l.06-1.313z"
                            ></Path>
                            <Path
                                fill="#106D8A"
                                d="M9.878 52.783l-7.722 5.756V52.17l4.378-3.374 2.299-1.675 1.265-.73a574.03 574.03 0 01-.22 6.391z"
                            ></Path>
                            <Path
                                fill="#713E39"
                                d="M22.631 40.7c1.907.69 3.796 1.474 5.738 2.068 2.97.897 5.578-.184 7.948-1.782 3.44-2.335 5.014-5.69 4.847-9.855v-2.18c1.877 3.493 1.29 6.932-.594 10.098-2.376 4.01-6.148 5.792-10.799 5.69-1.942-.795-3.914-1.526-5.803-2.435-.588-.29-.909-1.063-1.337-1.604z"
                            ></Path>
                            <Path
                                fill="#194257"
                                d="M29.7 8.001c1.129.546 2.453.873 3.326 1.687 1.337 1.253 1.355 3 .594 4.621-.902 1.955-2.66 2.323-4.603 2.192-2.275-.594-3.314-1.818-3.338-3.885 0-2.376.962-3.7 3.213-4.383L29.7 8zm2.703 4.324A2.893 2.893 0 0029.7 9.807a2.542 2.542 0 00-2.376 2.714c.036 1.491 1.057 2.376 2.667 2.311a2.578 2.578 0 002.388-2.507h.024z"
                            ></Path>
                            <Path
                                fill="#E39F82"
                                d="M14.91 48.417l-.06 1.307h-.25V43.07h-.344l-.392 6.938s-.071.065-.107.095l-.244-.339 1.188-14.796.196.03.012 13.418z"
                            ></Path>
                            <Path fill="#713E39" d="M21.319 39.33l.659.7-.66-.7z"></Path>
                            <Path
                                fill="#699CFF"
                                d="M47.906 68.162c.434-2.97.957-5.893 1.277-8.85.262-2.377.285-4.753.416-7.164l7.425 6.302c.238-.386.398-.66.594-.933l.107.992 2.305 2.044V73.52l-3.012-1.188-.707-.315-5.019-2.346-3.386-1.51z"
                            ></Path>
                            <Path
                                fill="#A05444"
                                d="M45.786 42.34c.736 9.284.736 18.533-1.343 27.71-.362-.309-.695-.838-.974-.808-2.31.256-1.782-1.378-1.616-2.53.481-3.125 1.224-6.208 1.652-9.344.48-3.528.736-7.086 1.087-10.633.202-.279.523-.54.594-.849.243-1.17.404-2.364.6-3.546z"
                            ></Path>
                            <Path
                                fill="#106F8B"
                                d="M57.618 57.517c-.166.273-.327.546-.594.932l-7.425-6.302c0-1.93 0-3.867-.042-5.797l7.057 5.197.303.267c.322.474.56 1.001.701 1.557.06 1.378 0 2.762 0 4.146z"
                            ></Path>
                            <Path
                                fill="#C06E54"
                                d="M45.786 42.34c-.196 1.189-.357 2.377-.594 3.565-.072.309-.392.594-.594.85v-9.077h.493c.225 1.556.463 3.106.695 4.663z"
                            ></Path>
                            <Path
                                fill="#1E9FBD"
                                d="M26.617 38.77c-3.13-1.318-4.823-4.027-4.71-7.537a7.782 7.782 0 015.227-7.253 7.96 7.96 0 018.643 2.34c.25.291.463.594.695.933-2.216 2.031-4.604 3.914-6.594 6.148-1.366 1.538-2.192 3.564-3.26 5.37z"
                            ></Path>
                            <Path
                                fill="#83C8D8"
                                d="M26.617 38.77c1.07-1.782 1.89-3.831 3.261-5.346 1.99-2.233 4.378-4.116 6.594-6.148 1.877 2.923 1.734 6.725-.357 9.213a8.001 8.001 0 01-9.498 2.281z"
                            ></Path>
                            <Path
                                fill="#1E9FBD"
                                d="M32.379 12.325a2.578 2.578 0 01-2.376 2.507c-1.61.065-2.632-.82-2.667-2.31a2.543 2.543 0 012.376-2.715 2.893 2.893 0 012.667 2.518z"
                            ></Path>
                        </G>
                        <Defs>
                            <ClipPath id="clip0_3805_5144">
                                <Path fill="#fff" d="M0 0H60V103.897H0z"></Path>
                            </ClipPath>
                        </Defs>
                    </Svg>

                    <Dialog
                        onDismiss={closePromotionModal}
                        visible={showPromotionModal}
                        style={{
                            ...styles.dialogWrapper,
                            backgroundColor: '#F0F3F5',
                            height: responsiveHeight(deviceHeight < 650 ? 49 : 47)
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#FFC985',
                                height: 160
                            }}
                        >
                            <AntDesign
                                onPress={closePromotionModal}
                                name="close"
                                color="#FF6600"
                                solid
                                style={{
                                    position: 'absolute',
                                    zIndex: 1,
                                    right: 8,
                                    top: 13
                                }}
                                size={22}
                            />
                            <Svg
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                    width: '100%',
                                    height: 190,
                                }}
                                fill="none"
                                viewBox="0 0 285 113"
                            >
                                <Path
                                    fill="#FF9828"
                                    fillOpacity="0.5"
                                    d="M1.578 62.56C-6.974 59.003 21.67 41.91 29.093 46.91c9.279 6.25 9.843 29.64 29.612 20.697 19.768-8.944 22.43-14.505 30.177-12.957 7.745 1.548 17.67 12.957 28.078 12.957 10.409 0 53.819-19.894 61.484-17.544 7.665 2.35 23.56 14.85 35.098 12.499 11.539-2.351 19.849-18.347 33.001-12.499C257.065 54.74 299.232 63.707 319 67.606v38.241L1.578 109V62.56z"
                                ></Path>
                                <Path
                                    fill="url(#paint0_linear_4026_6265)"
                                    d="M0 57.384c11.063-4.567 15.859 3.978 24.756 3.978 8.896 0 11.604-3.978 18.411-3.978 3.445 0 18.11 11.325 35.819 13.996 25.761-13.996 37.602-3.415 43.167-5.01 17.483-5.008 19.031-41.619 19.031-66.37h2.63c0 26.74 6.111 69.391 32.569 66.37 17.491-1.996 13.306-5.008 23.286-5.008 9.979 0 15.936 5.009 28.082 5.009 12.145 0 19.649-8.987 34.425-8.987h.355c14.688 0 31.174-.001 36.469 8.987V113H0V57.384z"
                                ></Path>
                                <Defs>
                                    <SvgLinearGradient
                                        id="paint0_linear_4026_6265"
                                        x1="149.5"
                                        x2="149"
                                        y1="0"
                                        y2="57"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <Stop offset="0.628" stopColor="#9DE1FD" stopOpacity="0.55"></Stop>
                                        <Stop offset="1" stopColor="#F0F3F5"></Stop>
                                    </SvgLinearGradient>
                                </Defs>
                            </Svg>
                        </View>
                        <View
                            style={{
                                paddingHorizontal: 10,
                                top: -40,
                                backgroundColor: '#F0F3F5'
                            }}
                        >
                            <Text
                                style={{
                                    color: '#15313C',
                                    textAlign: 'center',
                                    fontSize: 20,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    marginVertical: 10
                                }}
                            >
                                {locales('titles.promoteYourUserAccount')}
                            </Text>
                            <Text
                                style={{
                                    color: '#15313C',
                                    textAlign: 'center',
                                    fontSize: 16,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                }}
                            >
                                {locales('titles.fastAndEasySale')}
                            </Text>
                            <Text
                                style={{
                                    color: '#15313C',
                                    textAlign: 'center',
                                    width: '100%',
                                    alignSelf: 'center',
                                    fontSize: 14,
                                    fontFamily: 'IRANSansWeb(FaNum)',
                                }}
                            >
                                {locales('titles.toAccessAllBuskoolSpecialFeaturesPromoteIt')}
                            </Text>
                            <LinearGradient
                                start={{ x: 0, y: 1 }}
                                end={{ x: 0.8, y: 0.2 }}
                                style={{
                                    width: '65%',
                                    borderRadius: 8,
                                    alignSelf: 'center',
                                    padding: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: deviceHeight < 660 ? 5 : 25,
                                    height: 50,
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
                        style={{ ...styles.dialogWrapper, height: responsiveHeight(deviceHeight < 650 ? 44 : 40) }}
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
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="94"
                            height="87"
                            style={{
                                alignSelf: 'center',
                                top: -35
                            }}
                            fill="none"
                            viewBox="0 0 77 76"
                        >
                            <Path
                                fill="#DEE9FF"
                                d="M19.087 12.246s11.485 8.715 28.946-7.581C63.54-9.81 76.2 13.027 76.29 23.962c.115 14.166-15.507 25.5-7.926 34.804 7.581 9.305-15.035 24.669-27.223 11.372-15.162-16.54-19.27-3.101-27.913-3.101-6.202 0-18.937-15.413-10.338-26.879 7.237-9.649 3.29-12.85 1.379-16.196-2.757-4.824 3.79-17.92 14.817-11.716z"
                            ></Path>
                            <G clipPath="url(#clip0_3808_5306)">
                                <Path
                                    fill="#DE4657"
                                    d="M55.202 62.986c-.148.005-.295.016-.442.016H19.384c-2.933 0-5.324-1.727-6.12-4.423a5.62 5.62 0 01-.25-1.497c-.024-1.805 0-3.611 0-5.417.074-.088.136-.186.183-.29.116-.383.208-.773.318-1.158.121-.428.244-.856.381-1.281.053-.117.12-.227.197-.33.033.187.082.372.1.56.04.57.068 1.14.098 1.708-.066.452-.182.901-.189 1.354-.023 1.56-.04 3.121 0 4.68.025.882.173 1.765.642 2.542 1.06 1.755 2.662 2.54 4.674 2.563 1.258.014 2.515.024 3.77-.007.683-.017 1.362-.122 2.043-.188.19.045.384.078.578.098 1.21.04 2.422.07 3.632.099.148 0 .296 0 .444.006 1.514.099 3.028.237 4.543.279 1.805.048 3.611.01 5.418.01.706 0 1.414.023 2.118-.007 1.959-.084 3.916-.184 5.873-.29.978-.052 1.953-.13 2.93-.197.772.066 1.544.161 2.317.19.935.033 1.873.007 2.81.007l-.322.45c-.123.177-.247.35-.37.523z"
                                ></Path>
                                <Path
                                    fill="#DE4354"
                                    d="M62.976 23.765c.006.114.016.228.016.343v28.296c0 .114-.01.228-.016.344-.347.04-.466-.112-.5-.463-.017-.184-.241-.349-.372-.523l-.197-1.085V27.903c.055-.413.121-.824.164-1.237.115-1.067.22-2.133.329-3.2l.576.299z"
                                ></Path>
                                <Path
                                    fill="#DF4354"
                                    d="M14.09 48.609a1.719 1.719 0 00-.198.329c-.137.423-.26.85-.381 1.282-.11.384-.197.775-.318 1.157a1.303 1.303 0 01-.18.29c-.005-.131-.016-.262-.016-.394V23.765c0-.13.01-.262.016-.394h.88l.196 2.17c.033.914.07 1.829.1 2.745.012.361.007.723-.017 1.084-.046.633-.168 1.264-.17 1.896-.015 4.565-.015 9.128 0 13.692-.004 1.214.054 2.432.087 3.65z"
                                ></Path>
                                <Path
                                    fill="#DD4859"
                                    d="M13.892 23.369h-.875c.027-1.754-.099-3.527.114-5.258.354-2.868 2.994-5.052 5.892-5.096.754-.015 1.51.008 2.265.013.197.099.387.24.591.274.421.069.851.076 1.282.109l-.099.493-.098.098c-.274.034-.548.08-.823.099-1.173.07-2.353.073-3.517.208-2.187.253-3.936 1.747-4.312 3.9-.295 1.692-.291 3.438-.42 5.16z"
                                ></Path>
                                <Path
                                    fill="#DD495A"
                                    d="M62.104 51.764c.131.174.355.339.373.523.033.351.152.502.5.463-.025 1.685.08 3.385-.1 5.054-.31 2.796-2.849 5.038-5.66 5.182-.67.036-1.343 0-2.015 0l.37-.521.32-.45c.566-.053 1.146-.045 1.696-.168 2.71-.605 4.11-2.578 4.307-5.15.125-1.637.143-3.287.209-4.933z"
                                ></Path>
                                <Path
                                    fill="#DC4859"
                                    d="M62.976 23.764l-.576-.296c-.033-1.094-.076-2.188-.099-3.284-.028-1.484-.308-2.883-1.266-4.081-.936-1.172-2.119-1.993-3.603-2.17-1.455-.175-2.933-.155-4.4-.222l-.198-.296c.315-.065.632-.123.944-.197.182-.044.357-.12.534-.182 1.412-.018 2.83-.129 4.217.249 2.465.672 4.348 2.97 4.436 5.521.067 1.646.013 3.303.011 4.958z"
                                ></Path>
                                <Path
                                    fill="#DC4253"
                                    d="M54.31 13.028c-.177.063-.352.138-.534.183-.312.077-.63.135-.944.197H23.156c-.427-.032-.857-.04-1.282-.11-.207-.033-.394-.178-.591-.273.13-.005.261-.016.394-.016h32.24c.136.003.266.014.393.02z"
                                ></Path>
                                <Path
                                    fill="#E64355"
                                    d="M14.09 48.609c-.034-1.219-.092-2.438-.1-3.655-.01-4.564-.01-9.128 0-13.692 0-.632.125-1.263.171-1.896.026-.36.033-.723.022-1.084-.026-.916-.063-1.831-.098-2.746l.438-.16.252.994c.185-.236.301-.342.366-.474.888-1.824 2.065-3.463 3.42-4.951 2.071-2.276 4.385-4.275 7.167-5.67.156-.078.262-.254.395-.385 1.25-.099 2.502-.275 3.754-.282 5.412-.03 10.827-.014 16.25-.013.164 0 .328 0 .493.016 1.088.091 2.175.184 3.262.28.13.13.236.295.395.385a25.768 25.768 0 0110.591 10.64c.07.129.208.221.36.377.078-.36.131-.607.186-.854.113.328.21.661.29.998.092.485.139.978.204 1.467V50.68l-.442.125c-.063-.296-.125-.591-.188-.881l-.148-.053a26.82 26.82 0 01-4.798 6.555c-1.943 1.947-4.14 3.535-6.544 4.885.258.124.487.145.69.224.115.045.197.187.288.286-.977.066-1.953.143-2.93.197-1.958.106-3.915.206-5.874.29-.704.03-1.412.008-2.117.008-1.807 0-3.613.037-5.418-.011-1.515-.041-3.029-.183-4.543-.279-.148-.009-.296 0-.444-.006-1.21-.032-2.421-.062-3.632-.099a4.483 4.483 0 01-.578-.098c.055-.564.649-.211.911-.576a3.174 3.174 0 00-.429-.311 21.563 21.563 0 01-4.938-3.441c-2.268-2.08-4.263-4.397-5.645-7.186-.066-.132-.207-.225-.365-.394-.072.288-.088.473-.167.628-.066.13-.204.224-.31.333-.033-.569-.06-1.139-.099-1.707-.017-.188-.066-.373-.099-.56zm29.38-31.55c-.165-.099-.32-.253-.493-.285-1.027-.183-2.057-.458-3.089-.474-1.813-.028-3.648-.023-5.44.211-2.38.31-4.634 1.113-6.754 2.274-2.287 1.253-4.338 2.794-6.057 4.771a22.728 22.728 0 00-3.537 5.398c-1.08 2.326-1.774 4.767-1.908 7.314-.102 1.799-.033 3.604.206 5.39.425 3.048 1.558 5.873 3.267 8.447 1.282 1.935 2.76 3.717 4.634 5.09 1.291.943 2.626 1.862 4.048 2.58a19.605 19.605 0 007.363 2.088c1.971.153 3.93.18 5.875-.141a20.97 20.97 0 006.747-2.303c2.268-1.25 4.308-2.78 6.014-4.744a22.789 22.789 0 003.54-5.395c1.079-2.326 1.775-4.766 1.909-7.312.103-1.8.035-3.604-.203-5.39-.417-3.033-1.54-5.847-3.231-8.41-1.164-1.77-2.495-3.407-4.158-4.738-.555-.444-1.017-1.112-1.872-1.035l1.501-1.356c-1.016-1.085-1.943-2.028-3.248-2.48-1.785-.616-3.482-.39-5.12.5h.006z"
                                ></Path>
                                <Path
                                    fill="#E5475A"
                                    d="M14.287 50.876c.106-.11.244-.203.31-.333.08-.155.099-.34.167-.628.158.166.296.26.366.394 1.38 2.79 3.373 5.107 5.644 7.186a21.566 21.566 0 004.938 3.44c.152.092.295.197.43.312-.263.365-.857.012-.912.576-.68.066-1.36.172-2.042.188-1.256.03-2.514.021-3.77.007-2.01-.023-3.615-.808-4.675-2.563-.47-.777-.617-1.66-.642-2.542a104.32 104.32 0 010-4.68c.004-.456.12-.905.186-1.357zM50.766 61.82c-.099-.1-.173-.241-.288-.287-.205-.078-.434-.098-.69-.223 2.403-1.351 4.6-2.938 6.544-4.886a26.817 26.817 0 004.796-6.551l.148.053c.063.296.125.592.188.882l.443-.126.197 1.085c-.066 1.646-.084 3.296-.21 4.936-.197 2.572-1.596 4.546-4.306 5.15-.55.123-1.13.115-1.696.168-.936 0-1.873.025-2.81-.008-.772-.032-1.544-.127-2.316-.194z"
                                ></Path>
                                <Path
                                    fill="#E14759"
                                    d="M61.907 27.904c-.066-.493-.113-.986-.204-1.467-.08-.337-.176-.67-.29-.998.033-.701.108-1.404.09-2.105-.035-1.39-.12-2.777-.189-4.164-.087-1.752-.82-3.086-2.421-3.924-.962-.505-2.002-.461-3.016-.534-1.437-.104-2.881-.084-4.323-.118l-.591-.69c.569-.032 1.139-.06 1.707-.098.124-.021.246-.054.363-.099 1.468.067 2.946.047 4.4.223 1.485.18 2.667 1 3.604 2.169.958 1.199 1.238 2.597 1.266 4.082.02 1.095.064 2.19.099 3.284-.109 1.067-.214 2.133-.329 3.2-.045.416-.111.828-.166 1.24z"
                                ></Path>
                                <Path
                                    fill="#E5475A"
                                    d="M26.118 14.89c-.13.131-.236.307-.395.386-2.779 1.394-5.09 3.393-7.163 5.669-1.356 1.489-2.531 3.127-3.42 4.951-.066.132-.182.239-.367.474l-.245-.992-.439.16c-.065-.723-.13-1.446-.197-2.169.129-1.721.125-3.467.42-5.16.376-2.152 2.125-3.647 4.308-3.901 1.164-.136 2.344-.138 3.517-.208.275-.017.549-.063.823-.099.04.029.076.077.117.082.519.064 1.078.005 1.432.531.04.06.18.061.275.076.442.071.89.135 1.334.2z"
                                ></Path>
                                <Path
                                    fill="#E34355"
                                    d="M26.118 14.89c-.444-.065-.888-.129-1.331-.197-.099-.015-.235-.016-.275-.076-.354-.526-.913-.467-1.432-.531-.041-.005-.078-.053-.117-.082l.098-.099 6.828.099c.18 0 .358-.028.537-.037 1.059-.052 2.119-.12 3.179-.147.503-.012 1.008.086 1.512.082 2.49-.021 4.979-.085 7.468-.082 1.19 0 2.379.166 3.568.175 1.603.012 3.207-.054 4.81-.088l.591.69a.859.859 0 01-.212.099c-.487.072-.976.135-1.464.197-1.087-.096-2.173-.19-3.258-.282a5.868 5.868 0 00-.493-.016c-5.423 0-10.835-.018-16.252.013-1.255.007-2.506.184-3.757.282z"
                                ></Path>
                                <Path
                                    fill="#DF4354"
                                    d="M50.963 13.904c-1.603.034-3.207.099-4.81.088-1.19-.006-2.378-.174-3.567-.176-2.49 0-4.98.061-7.469.083-.504 0-1.01-.098-1.512-.082-1.06.027-2.12.099-3.179.147-.18.01-.358.04-.537.037-2.276-.03-4.552-.063-6.828-.099l.099-.493h29.676l.197.296a1.956 1.956 0 01-.363.098c-.568.04-1.138.069-1.707.101z"
                                ></Path>
                                <Path
                                    fill="#E84153"
                                    d="M50.331 20.394c.855-.078 1.32.592 1.873 1.034 1.663 1.332 2.994 2.969 4.165 4.739 1.69 2.563 2.814 5.377 3.23 8.41a28.46 28.46 0 01.204 5.39c-.138 2.545-.83 4.986-1.909 7.311a22.792 22.792 0 01-3.54 5.395c-1.71 1.964-3.746 3.495-6.014 4.744a20.972 20.972 0 01-6.748 2.304c-1.944.32-3.908.295-5.875.14a19.608 19.608 0 01-7.363-2.088c-1.422-.717-2.76-1.636-4.048-2.579-1.882-1.373-3.352-3.155-4.634-5.09-1.709-2.574-2.842-5.399-3.267-8.447a28.458 28.458 0 01-.212-5.39c.134-2.545.827-4.986 1.901-7.312a22.726 22.726 0 013.537-5.398c1.721-1.98 3.77-3.52 6.06-4.773 2.118-1.16 4.374-1.964 6.753-2.273 1.793-.234 3.627-.239 5.44-.211 1.032.015 2.062.295 3.09.474.176.031.331.187.492.285l-1.725 1.494c-.767-.137-1.53-.357-2.302-.394-2.113-.098-4.215.013-6.282.543-3.825.981-7.09 2.893-9.789 5.782a20.112 20.112 0 00-3.86 5.994 19.079 19.079 0 00-1.46 6.32c-.139 2.366.084 4.704.771 6.986a20.036 20.036 0 002.652 5.565c1.05 1.537 2.25 2.925 3.71 4.08.22.174.502.268.755.399.353.275.69.567 1.061.821 1.578 1.093 3.231 2.022 5.065 2.643 1.44.488 2.91.851 4.405.945 1.391.087 2.81-.007 4.198-.18 3.84-.48 7.145-2.151 9.979-4.759a17.685 17.685 0 004.455-6.488c.587-1.45.982-2.97 1.174-4.523.025-.197.022-.475-.098-.591-1.073-1.084-2.17-2.142-3.276-3.216l-.753.667c-.005-.236.005-.474-.017-.71-.065-.708-.142-1.416-.213-2.124l1.03-1.169 3.246 3.49c.077-.191.102-.399.073-.603-.216-1.737-.584-3.44-1.35-5.017-.62-1.275-1.385-2.479-2.085-3.714-.055-.217-.067-.457-.171-.647-.887-1.593-2.17-2.844-3.522-4.024-.549-.479-1.145-.902-1.72-1.351l2.914-2.884z"
                                ></Path>
                                <Path
                                    fill="#02C469"
                                    d="M50.33 20.395l-2.913 2.883-2.9 2.868c-.214.203-.432.4-.642.609a4900.136 4900.136 0 00-5.84 5.784c-.29.289-.534.306-.816 0-.265-.29-.554-.559-.835-.835l-5.152-5.075-3.624-3.588.597-.649c.645-.629 1.288-1.26 1.935-1.885a4.436 4.436 0 013.05-1.282c1.371-.04 2.504.476 3.457 1.436.493.493.993.986 1.485 1.47l3.61-3.578 1.723-1.494c1.635-.887 3.331-1.116 5.116-.499 1.305.452 2.232 1.39 3.248 2.48l-1.498 1.355z"
                                ></Path>
                                <Path
                                    fill="#E5475A"
                                    d="M49.878 14.89c.488-.067.977-.13 1.465-.198a.86.86 0 00.211-.098c1.442.033 2.886.014 4.323.117 1.014.073 2.054.03 3.016.534 1.6.839 2.334 2.17 2.421 3.924.07 1.388.154 2.775.19 4.164.017.7-.058 1.404-.09 2.106-.055.246-.108.493-.187.854-.15-.156-.29-.249-.358-.378a25.768 25.768 0 00-10.601-10.64c-.154-.085-.26-.255-.39-.386z"
                                ></Path>
                                <Path
                                    fill="#EA394B"
                                    d="M31.232 26.628l5.152 5.074c.281.276.57.545.835.835.282.309.527.296.816 0 1.943-1.932 3.89-3.86 5.84-5.784.21-.208.428-.406.643-.608.197.153.394.32.6.459.362.24.761.439.83.936l-2.207 2.267c3.318 1.972 5.293 4.831 5.936 8.653l2.24-2.149c.071.708.148 1.416.213 2.125.022.236.012.473.017.71-.734.727-1.479 1.444-2.196 2.186-.17.17-.29.385-.344.62-1.14 6.303-6.967 10.473-13.33 9.53-8.827-1.308-12.96-11.566-7.502-18.615.85-1.099 1.88-2.004 3.185-2.822l-2.535-2.416c.163-.105.32-.223.493-.315.434-.235.876-.459 1.314-.686z"
                                ></Path>
                                <Path
                                    fill="#FEFDFD"
                                    d="M29.428 27.629c.829.789 1.657 1.577 2.535 2.415-1.305.819-2.334 1.724-3.185 2.822-5.461 7.05-1.328 17.308 7.499 18.617 6.363.944 12.19-3.227 13.33-9.53a1.28 1.28 0 01.344-.62c.72-.741 1.462-1.459 2.196-2.186l.753-.667c1.102 1.075 2.203 2.132 3.276 3.216.116.116.119.394.098.592A17.926 17.926 0 0155.1 46.81a17.684 17.684 0 01-4.453 6.488c-2.836 2.608-6.142 4.278-9.981 4.758-1.387.174-2.807.269-4.198.18-1.496-.093-2.966-.456-4.405-.944-1.834-.616-3.484-1.55-5.062-2.643-.367-.254-.708-.546-1.06-.821-.835-.91-1.708-1.789-2.495-2.738-1.099-1.326-1.91-2.847-2.52-4.443-.728-1.9-1.17-3.872-1.213-5.926.018-1.52.006-3.047.426-4.521.35-1.225.77-2.428 1.16-3.64l.6-1.197.216-.386.458-.707c.537-.677 1.03-1.395 1.62-2.022.827-.88 1.722-1.697 2.598-2.528.223-.212.443-.224.698.04.626.642 1.287 1.248 1.94 1.869z"
                                ></Path>
                                <Path
                                    fill="#FEFCFD"
                                    d="M51.916 36.313c-.73.703-1.462 1.404-2.239 2.149-.643-3.826-2.618-6.683-5.936-8.653l2.206-2.267 2.497-2.444c.485.374.957.699 1.38 1.075.71.63 1.41 1.275 2.076 1.95.35.352.622.782.928 1.183.7 1.235 1.465 2.439 2.085 3.713.766 1.578 1.134 3.28 1.35 5.014.029.204.004.411-.073.602l-3.245-3.486-1.029 1.164z"
                                ></Path>
                                <Path
                                    fill="#E84053"
                                    d="M19.712 40.72c.043 2.054.485 4.026 1.21 5.927.61 1.596 1.422 3.117 2.52 4.443.789.95 1.66 1.828 2.494 2.738-.253-.132-.535-.225-.755-.4-1.46-1.154-2.662-2.542-3.71-4.08a20.036 20.036 0 01-2.654-5.564c-.69-2.282-.91-4.622-.772-6.986a19.081 19.081 0 011.462-6.32 20.114 20.114 0 013.863-5.993c2.698-2.89 5.964-4.8 9.79-5.782 2.07-.53 4.168-.64 6.28-.543.773.036 1.536.256 2.303.394l-3.61 3.577c-.494-.486-.994-.974-1.486-1.47-.953-.96-2.086-1.479-3.457-1.435a4.437 4.437 0 00-3.05 1.281c-.648.625-1.29 1.256-1.935 1.885-.154.037-.304.09-.446.16-2.547 1.629-4.525 3.802-6.014 6.42-1.884 3.315-2.55 6.91-2.32 10.692.021.357.188.705.287 1.057z"
                                ></Path>
                                <Path
                                    fill="#E73F50"
                                    d="M52.831 29.301c-.306-.394-.578-.825-.927-1.183a43.611 43.611 0 00-2.077-1.949c-.425-.377-.897-.701-1.38-1.076l-2.5 2.45c-.067-.494-.467-.697-.83-.936-.209-.14-.4-.306-.599-.46l2.899-2.868c.575.449 1.17.873 1.72 1.351 1.355 1.183 2.637 2.431 3.522 4.024.104.19.116.43.172.647z"
                                ></Path>
                                <Path
                                    fill="#E64151"
                                    d="M19.712 40.72c-.098-.351-.266-.7-.288-1.056-.23-3.781.437-7.377 2.322-10.692 1.488-2.618 3.466-4.791 6.014-6.42a2.08 2.08 0 01.446-.16l-.596.65 3.623 3.588c-.438.228-.879.452-1.313.69-.17.093-.328.21-.493.316-.65-.621-1.314-1.227-1.94-1.873-.255-.264-.475-.252-.698-.04-.876.831-1.774 1.649-2.598 2.528-.591.627-1.084 1.345-1.62 2.022-.428.094-.58.33-.458.707l-.215.385a1.011 1.011 0 00-.601 1.198c-.395 1.212-.81 2.415-1.16 3.64-.419 1.471-.407 2.999-.425 4.518z"
                                ></Path>
                                <Path
                                    fill="#E84053"
                                    d="M21.298 32.56a1.012 1.012 0 01.601-1.198l-.601 1.198zM22.114 30.977c-.122-.378.03-.613.458-.707l-.458.707z"
                                ></Path>
                            </G>
                            <Defs>
                                <ClipPath id="clip0_3808_5306">
                                    <Path
                                        fill="#fff"
                                        d="M0 0H50V50.006H0z"
                                        transform="translate(13 13)"
                                    ></Path>
                                </ClipPath>
                            </Defs>
                        </Svg>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={[styles.mainTextDialogModal, {
                                fontSize: 18,
                                color: '#15313C',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                top: -25
                            }]}>
                                {locales('titles.newVersionUpdate')}
                            </Text>
                        </Dialog.Actions>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={{
                                fontFamily: 'IRANSansWeb(FaNum)',
                                textAlign: 'center',
                                fontSize: 15,
                                color: '#15313C',
                                paddingHorizontal: 15,
                                width: '100%',
                                top: -30
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
                                    width: '80%',
                                    top: -30,
                                    marginBottom: 30,
                                    borderRadius: 8,
                                    elevation: 0,
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
                                        left: -5,
                                        top: 1
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