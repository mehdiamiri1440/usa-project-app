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
    LinearGradient as SvgLinearGradient, G, Defs, Path, ClipPath, Stop
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
                            top: '23%',
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
                            height: responsiveHeight(49)
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#FFC985'
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
                                    height: 190
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
                                top: -80,
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
                                    width: '80%',
                                    borderRadius: 8,
                                    alignSelf: 'center',
                                    padding: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 20,
                                    top: 0,
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
                        style={{ ...styles.dialogWrapper, height: responsiveHeight(47) }}
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
                                alignSelf: 'center',
                                top: -30
                            }}
                        />
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={[styles.mainTextDialogModal, {
                                fontSize: 18,
                                color: '#15313C',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                top: -30
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
                                    top: -35,
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