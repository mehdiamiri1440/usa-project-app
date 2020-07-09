import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, Text, I18nManager } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { connect } from 'react-redux';
import RNRestart from 'react-native-restart';
import * as messagesActions from '../redux/messages/actions';
import { NavigationContainer } from '@react-navigation/native';
import routes from './tabs';
import Router from './routs';
import firebase from '@react-native-firebase/app';
import SignUp from '../screens/SignUp'
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';

const navigationRef = React.createRef();


const registerAppWithFCM = async () => {
    await messaging().registerDeviceForRemoteMessages();
}


const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();


const App = props => {
    const [initialRoute, setInitialRoute] = useState('Home');
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
        })
        return unsubscribe
    }, [initialRoute]);


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
                        <Stack.Screen key='SignUp' name='SignUp' component={SignUp} />
                    </Stack.Navigator>
                )
                : (
                    <Router />
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