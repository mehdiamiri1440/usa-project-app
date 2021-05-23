import React, { useState, useEffect } from 'react';
import {
    Linking,
    Image,
    View,
    Text,
    TouchableOpacity,
    BackHandler,
    AppState,
    StyleSheet
} from 'react-native';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { connect } from 'react-redux';
import { Button } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import { getAppstoreAppMetadata } from "react-native-appstore-version-checker";
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
import SplashScreen from 'react-native-splash-screen'
import AsyncStorage from '@react-native-community/async-storage';

import Octicons from 'react-native-vector-icons/dist/Octicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import UpgradeApp from '../screens/UpgradeApp'
import Intro from '../screens/Intro'
import SignUp from '../screens/SignUp'
import Requests from '../screens/Requests/Requests';

import {
    HomeStack,
    MessagesStack,
    MyBuskoolStack,
    RegisterProductStack,
    RegisterRequestStack,
    SpecialProductsStack
}
    from './tabs';

import { deviceWidth, deviceHeight } from '../utils';
import * as productActions from '../redux/registerProduct/actions';
import * as messageActions from '../redux/messages/actions';
import { navigationRef, isReadyRef } from './rootNavigation';
import linking from './linking';

let currentRoute = '', promotionModalTimeout, guidModalTimeout;

const routes = props => {

    const {
        initialRoute,
        userProfile = {},
        newMessage,
        loggedInUserId
    } = props;

    useEffect(() => {

        AppState.addEventListener('change', handleAppStateChange);

        BackHandler.addEventListener('hardwareBackPress', handleAppBackChanges);

        return _ => {

            clearTimeout(promotionModalTimeout);

            AppState.removeEventListener('change', handleAppStateChange);

            BackHandler.removeEventListener('hardwareBackPress', handleAppBackChanges);

        }
    }, [loggedInUserId])


    const {
        user_info = {}
    } = userProfile;

    let {
        is_seller,
        wallet_balance = 0,
        active_pakage_type
    } = user_info;
    is_seller = is_seller == 0 ? false : true;

    const [shouldShowBottomMenu, setShouldShowBottomMenu] = useState(true);

    const [updateModalFlag, setUpdateModalFlag] = useState(false);

    const [showPromotionModal, setShowPromotionModal] = useState(false);

    const [isForceUpdate, setIsForceUpdate] = useState(true);

    const [contactInfoGuidModal, setShowContactInfoGuidModal] = useState(false);

    const [souldShowSellerButton, setShouldShowSellerButton] = useState(false);

    const Stack = createStackNavigator();
    const Tab = createMaterialBottomTabNavigator();

    const handleAppStateChange = (nextAppState) => {
        if (
            AppState.current != nextAppState
        ) {
            // checkForShowingContactInfoGuid();
            checkForShowingPromotionModal();
        }
    };

    const checkForUpdate = _ => {
        getAppstoreAppMetadata("com.buskool") //put any apps packageId here
            .then(metadata => {
                if (
                    DeviceInfo.getVersion() != metadata.version
                ) {
                    const versionParts = metadata.version.split('.');
                    if (versionParts[versionParts.length - 1] == '1') {
                        setIsForceUpdate(true);
                    }
                    else {
                        setIsForceUpdate(false);
                    }
                    setShowContactInfoGuidModal(false);
                    setShowPromotionModal(false);
                    setUpdateModalFlag(true);
                }
                else {
                    setUpdateModalFlag(false);
                }
            })
            .catch(err => {
                console.log("error occurred", err);
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

        if (is_seller && active_pakage_type == 0) {

            AsyncStorage.getItem('@IsNewSignedUpUser').then(isNewUser => {
                isNewUser = JSON.parse(isNewUser);
                if (isNewUser == true) {
                    AsyncStorage.setItem('@IsNewSignedUpUser', JSON.stringify(false)).then(_ => {
                        promotionModalTimeout = setTimeout(() => setShowPromotionModal(true), 3600000);
                    })
                }
                else {
                    AsyncStorage.getItem('@promotionModalLastSeen').then(result => {

                        result = JSON.parse(result);

                        if (result) {
                            if (moment().diff(result, 'days') >= 1) {
                                AsyncStorage.setItem('@promotionModalLastSeen', JSON.stringify(moment()));
                                if (!updateModalFlag)
                                    setShowPromotionModal(true);
                            }
                            else {
                                setShowPromotionModal(false);
                            }

                        }
                        else {
                            if (!updateModalFlag) {
                                setShowPromotionModal(true);
                                AsyncStorage.setItem('@promotionModalLastSeen', JSON.stringify(moment()))
                            }
                        }

                    })
                }

            }
            )
        };
    };

    const closePromotionModal = _ => {
        setShowPromotionModal(false);
        AsyncStorage.setItem('@promotionModalLastSeen', JSON.stringify(moment()));
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
        ];

        const currentRouteName = navigationRef?.current?.getCurrentRoute()?.name;

        const shouldShow = loggedInUserId && is_seller && !props.userProfileLoading
            && routesNotToShow.indexOf(currentRouteName) == -1;

        const isBottomMenuVisible = loggedInUserId && ['Chat', 'Channel'].indexOf(currentRouteName) == -1;

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
        SplashScreen.hide();
        isReadyRef.current = true;
        // checkForShowingContactInfoGuid();
        checkForShowingPromotionModal();
        checkForUpdate();
    };

    return (
        <>
            {showPromotionModal ?
                <Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        onDismiss={closePromotionModal}
                        visible={showPromotionModal}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={closePromotionModal}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('labels.promoteRegistration')}
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
                                {locales('labels.promoteRegistrationModalDescription')}
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
                                    closePromotionModal();
                                    navigationRef?.current?.navigate('MyBuskool', { screen: 'PromoteRegistration' })
                                }}
                            >

                                <Text style={[styles.closeButtonText, { color: 'white' }]}>{locales('labels.promoteRegistration')}
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
                                onPress={closePromotionModal}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.close')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal >
                :
                null
            }

            {contactInfoGuidModal ?
                <Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
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
                </Portal >
                :
                null
            }
            {updateModalFlag ?
                <Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={updateModalFlag}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            {!isForceUpdate ? <Button
                                onPress={() => setUpdateModalFlag(false)}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button> : null}
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('titles.update')}
                            </Paragraph>
                        </Dialog.Actions>
                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center'
                            }}>
                            <AntDesign name="exclamation" color="#3fc3ee" size={70} style={[styles.dialogIcon, {
                                borderColor: '#9de0f6',
                            }]} />

                        </View>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={[styles.mainTextDialogModal, { fontSize: 18 }]}>
                                {locales('titles.newVersionUpdate')}
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
                                style={[styles.modalButton, styles.greenButton, { maxWidth: deviceWidth * 0.5 }]}
                                onPress={() => {
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

                                <Text style={styles.buttonText}>{locales('titles.update')}
                                </Text>
                            </Button>
                        </View>
                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            {!isForceUpdate ? <Button
                                style={[styles.modalCloseButton,]}
                                onPress={() => setUpdateModalFlag(false)}>

                                <Text style={styles.closeButtonText}>{locales('titles.cancel')}
                                </Text>
                            </Button> : null}
                        </Dialog.Actions>
                    </Dialog>
                </Portal >
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
                        <Stack.Navigator
                            headerMode='none'>
                            <Stack.Screen key='SignUp' name='SignUp' component={SignUp} />
                            <Stack.Screen key='Intro' name='Intro' component={Intro} />
                            <Stack.Screen key='UpgradeApp' name='UpgradeApp' component={UpgradeApp} />
                        </Stack.Navigator>
                    )
                    : (
                        <Tab.Navigator
                            initialRouteName={is_seller ? 'RegisterProductStack' : 'RegisterRequest'}
                            shifting={false}
                            activeColor="#00C569"
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
                                    tabBarIcon: ({ focused, color }) => <Octicons size={25} name='home' color={color} />,

                                }}
                                name='Home'
                                component={HomeStack}
                            />

                            {is_seller ? <Tab.Screen
                                key={'Requests'}
                                options={{
                                    tabBarBadge: false,
                                    tabBarLabel: <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium" }}>{locales('labels.requests')}</Text>,
                                    tabBarIcon: ({ focused, color }) => <Entypo size={25} name='list' color={color} />,
                                }}
                                name={'Requests'}
                                component={Requests}
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
                                        tabBarIcon: ({ focused, color }) => <Entypo size={25} name='list' color={color} />,
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
                                key={'RegisterProduct'}
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
                                        <FontAwesome5 size={18} name='plus' solid color={!!focused ? '#fff' : '#00C569'} />
                                    </View>,
                                }}
                                name={'RegisterProductStack'}
                                component={RegisterProductStack}
                            />
                                :
                                <Tab.Screen
                                    key={'RegisterRequest'}
                                    listeners={{
                                        tabPress: e => {
                                            if (!!global.resetRegisterRequest)
                                                global.resetRegisterRequest(true)
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
                                            <FontAwesome5 size={18} name='plus' solid color={!!focused ? '#fff' : '#00C569'} />
                                        </View>,
                                    }}
                                    name={'RegisterRequest'}
                                    component={RegisterRequestStack}
                                />}


                            <Tab.Screen
                                key='Messages'
                                listeners={{
                                    tabPress: e => {
                                        e.preventDefault();
                                        currentRoute = e.target;
                                        props.doForceRefresh(true);
                                        if (is_seller)
                                            return navigationRef.current.navigate('Messages', { screen: 'MessagesIndex', params: { tabIndex: 0 } });
                                        return navigationRef.current.navigate('Messages', { screen: 'MessagesIndex' });
                                    },
                                }}
                                options={{
                                    tabBarBadge: newMessage > 0 ? newMessage : false,
                                    tabBarLabel: <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium" }}>{locales('labels.messages')}</Text>,
                                    tabBarIcon: ({ focused, color }) => <Entypo size={25} name='message' color={color} />,
                                }}
                                name='Messages'
                                component={MessagesStack}
                            />

                            <Tab.Screen
                                listeners={{
                                    tabPress: e => {
                                        currentRoute = e.target;
                                        navigationRef.current.navigate('MyBuskool', { screen: 'HomeIndex' })
                                    },
                                }}
                                key={'MyBuskool'}
                                options={{
                                    tabBarBadge: false,
                                    tabBarLabel: <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium" }}>{locales('labels.myBuskool')}</Text>,
                                    tabBarIcon: ({ focused, color }) => (
                                        <Image
                                            style={{
                                                borderRadius: deviceWidth * 0.032,
                                                width: deviceWidth * 0.064, height: deviceWidth * 0.064
                                            }}
                                            source={!!userProfile && !!userProfile.profile && userProfile.profile.profile_photo &&
                                                userProfile.profile.profile_photo.length ?
                                                { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${userProfile.profile.profile_photo}` }
                                                : require('../../assets/icons/user.png')
                                            }
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
                <TouchableOpacity
                    activeOpacity={1}
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
                    <FontAwesome5 name='list-alt' color='white' size={22} solid />
                    <Text style={{
                        color: 'white',
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 14,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                    }}>
                        {locales('labels.buyers')}
                    </Text>
                </TouchableOpacity>
                : null}
        </>
    )
};

const styles = StyleSheet.create({
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Medium',
        width: '100%',
        textAlign: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#00C569',
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
        maxWidth: 145,
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
        backgroundColor: '#00C569',
    },
});

const mapStateToProps = ({
    profileReducer,
    messagesReducer
}) => {

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
        userProfileLoading
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        resetRegisterProduct: resetTab => dispatch(productActions.resetRegisterProduct(resetTab)),
        doForceRefresh: forceRefresh => dispatch(messageActions.doForceRefresh(forceRefresh)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(routes)