import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Linking, Text, I18nManager } from 'react-native';
import { connect } from 'react-redux';
import RNRestart from 'react-native-restart';
import * as messagesActions from '../redux/messages/actions';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import routes from './tabs';
import Login from '../screens/Login/Login'
import firebase from '@react-native-firebase/app';
import SignUp from '../screens/SignUp'
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import { deviceWidth } from '../utils/deviceDimenssions';

const navigationRef = React.createRef();
const isMountedRef = React.createRef();
const push = async (...args) => {
    const navigation = await navigationRef;
    const ready = await navigation.current;
    if (!!ready)
        ready.navigate(routes[3]);
}

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const registerAppWithFCM = async () => {
    await messaging().registerDeviceForRemoteMessages();
}

const getRoute = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('@fromMessages').then(value => {
            if (value && JSON.parse(value)) {
                resolve(JSON.parse(value));
            }
            else {
                resolve(false)
            }
        }).catch(err => reject(err))
        // if (value) {
        //     resolve(true)
        // }
        // else {
        //     resolve(false)
        // }
    })

}
const App = props => {
    // const navigation = useNavigation();
    const [initialRoute, setInitialRoute] = useState('Home');
    const [loading, setLoading] = useState(false);
    let [isRegistered, setIsRegistered] = useState(registerAppWithFCM());
    let [backgroundIncomingMessage, setBackgroundIncomingMessage] = useState(false);
    let unsubscribe;
    useEffect(() => {
        props.fetchTotalUnreadMessages();

        if (I18nManager.isRTL) {
            I18nManager.forceRTL(false);
            I18nManager.allowRTL(false);
            RNRestart.Restart();
        }

        if (isRegistered) {
            firebase.messaging().getToken()
                .then(fcmToken => {
                    if (fcmToken) {
                        firebase.messaging().hasPermission()
                            .then(enabled => {
                                if (enabled) {
                                    messaging()
                                        .subscribeToTopic(`FCM${props.loggedInUserId}`)
                                        .then(() => {
                                            messaging().onNotificationOpenedApp(async remoteMessage => {
                                            })
                                            messaging().getInitialNotification(() => {
                                                messaging().setBackgroundMessageHandler(async remoteMessage => {
                                                    try {
                                                        await setBackgroundIncomingMessage(true)
                                                    }
                                                    catch (err) {
                                                    }
                                                })
                                            });


                                            unsubscribe = messaging().onMessage(async remoteMessage => {
                                                if (remoteMessage)
                                                    console.warn('datea', remoteMessage)
                                                props.fetchTotalUnreadMessages();
                                                props.newMessageReceived(true)
                                            });
                                        })

                                }
                                else {
                                    firebase.messaging().requestPermission()
                                        .then(() => {
                                            setIsRegistered(true);
                                        })
                                }
                            });
                    }
                    else {
                        messaging()
                            .subscribeToTopic(`FCM${props.loggedInUserId}`)
                        Alert.alert('device is not registered');
                    }
                })
        }

        Linking.addEventListener(url => {
            console.log('url', url)
        })
        return unsubscribe
    }, [initialRoute]);

    // const prefix = Linking.makeUrl('https://app.buskool.com');

    const linking = {
        prefixes: ['buskool://Home'],
    };
    return (
        <NavigationContainer
            linking={linking} fallback={<Text>Loading...</Text>}
            ref={navigationRef}
        >
            {(!props.loggedInUserId) ?
                (
                    <Stack.Navigator headerMode='none'>
                        <Stack.Screen name='Login' component={Login} />
                        <Stack.Screen name='SignUp' component={SignUp} />
                    </Stack.Navigator>
                )
                : (< Tab.Navigator
                    initialRouteName={props.isFromOutSide ? 'Messages' : 'Home'
                        // getRoute().then(res => {
                        //     if (res)
                        //         setTimeout(() => {
                        //             navigationRef.current.navigate(tabs[4]);
                        //             setInitialRoute('Messages')
                        //         }, 10);
                        // })
                    }
                    shifting={false}
                    activeColor="#00C569"
                    inactiveColor="#FFFFFF"
                    barStyle={{ backgroundColor: '#313A43' }
                    }
                >
                    {
                        routes.map((route, index) => (
                            <Tab.Screen
                                key={index}
                                options={{
                                    tabBarBadge: route.name == 'Messages' && props.totalUnreadMessages > 0 ? true : false,
                                    tabBarLabel: route.label && locales(route.label),
                                    tabBarIcon: route.name != 'MyBuskool' ? ({ focused, color }) => route.icon(color, focused) : () => {
                                        return (
                                            <Image
                                                style={{
                                                    borderRadius: deviceWidth * 0.032,
                                                    width: deviceWidth * 0.064, height: deviceWidth * 0.064
                                                }}
                                                source={!!props.userProfile && !!props.userProfile.profile && props.userProfile.profile.profile_photo && props.userProfile.profile.profile_photo.length ?
                                                    { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${props.userProfile.profile.profile_photo}` }
                                                    : require('../../assets/icons/user.png')
                                                }
                                            />
                                        )
                                    },
                                }}
                                name={route.name}
                                component={route.component}
                            />
                        ))
                    }
                </Tab.Navigator>
                )
            }

        </NavigationContainer >
    )
}

const mapStateToProps = (state) => {
    return {
        loginError: state.authReducer.loginError,
        loggedInUserId: state.authReducer.loggedInUserId,
        logOutLoading: state.authReducer.logOutLoading,
        logOutFailed: state.authReducer.logOutFailed,
        logOutError: state.authReducer.logOutError,
        logOutMessage: state.authReducer.logOutMessage,

        userProfile: state.profileReducer.userProfile,

        totalUnreadMessagesLoading: state.messagesReducer.totalUnreadMessagesLoading,
        totalUnreadMessages: state.messagesReducer.totalUnreadMessages,
        isFromOutSide: state.messagesReducer.isFromOutSide,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchTotalUnreadMessages: () => dispatch(messagesActions.fetchTotalUnreadMessages()),
        newMessageReceived: message => dispatch(messagesActions.newMessageReceived(message))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);