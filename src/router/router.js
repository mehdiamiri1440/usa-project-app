import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { connect } from 'react-redux';
import * as messagesActions from '../redux/messages/actions';
import { NavigationContainer, StackActions, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import tabs from './tabs';
import Login from '../screens/Login/Login'
import firebase from '@react-native-firebase/app';
import SignUp from '../screens/SignUp'
import messaging from '@react-native-firebase/messaging';
import { NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

const navigationRef = React.createRef();
const isMountedRef = React.createRef();
const push = async (...args) => {
    const navigation = await navigationRef;
    const ready = await navigation.current;
    if (!!ready)
        ready.navigate(tabs[4]);
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
    const [loading, setLoading] = useState(true);
    let [isRegistered, setIsRegistered] = useState(registerAppWithFCM());
    let [backgroundIncomingMessage, setBackgroundIncomingMessage] = useState(false);
    let unsubscribe;
    useEffect(() => {
        props.fetchTotalUnreadMessages();
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
                                                        console.log('catch----->>>', err)
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

        return unsubscribe
    }, [initialRoute]);


    return (
        <NavigationContainer
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
                    initialRouteName={
                        getRoute().then(res => {
                            if (res)
                                setTimeout(() => {
                                    navigationRef.current.navigate(tabs[4]);
                                    setInitialRoute('Messages')
                                }, 10);
                        })
                    }
                    shifting={false}
                    activeColor="#00C569"
                    inactiveColor="#FFFFFF"
                    barStyle={{ backgroundColor: '#313A43' }
                    }
                >
                    {
                        tabs.map((route, index) => (
                            <Tab.Screen
                                key={index}
                                options={{
                                    tabBarBadge: route.name == 'Messages' && props.totalUnreadMessages > 0 ? true : false,
                                    tabBarLabel: route.label && locales(route.label),
                                    tabBarIcon: ({ focused, color }) => route.icon(color, focused),
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

        totalUnreadMessagesLoading: state.messagesReducer.totalUnreadMessagesLoading,
        totalUnreadMessages: state.messagesReducer.totalUnreadMessages,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchTotalUnreadMessages: () => dispatch(messagesActions.fetchTotalUnreadMessages()),
        newMessageReceived: message => dispatch(messagesActions.newMessageReceived(message))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);