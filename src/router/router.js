import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import * as messagesActions from '../redux/messages/actions';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import tabs from './tabs';
import Login from '../screens/Login/Login'
import firebase from '@react-native-firebase/app';
import SignUp from '../screens/SignUp'
import messaging from '@react-native-firebase/messaging';


const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

async function registerAppWithFCM() {
    await messaging().registerDeviceForRemoteMessages();
}

const App = props => {

    let [isRegistered, setIsRegistered] = useState(registerAppWithFCM());

    useEffect(() => {
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
                                            messaging().onMessage(async remoteMessage => {
                                                props.newMessageReceived(true)
                                            });
                                        });
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
                        Alert.alert('device is not registered');
                    }
                })
        }
    }, []);

    return (
        <NavigationContainer>
            {(!props.loggedInUserId) ?
                (
                    <Stack.Navigator headerMode='none'>
                        <Stack.Screen name='Login' component={Login} />
                        <Stack.Screen name='SignUp' component={SignUp} />
                    </Stack.Navigator>
                )
                : (< Tab.Navigator
                    initialRouteName={tabs[0].name}
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
                                    tabBarBadge: route.name == 'Messages' ? true : false,
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
        logOutMessage: state.authReducer.logOutMessage
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        newMessageReceived: message => dispatch(messagesActions.newMessageReceived(message))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);