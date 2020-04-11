import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import tabs from './tabs';
import Login from '../screens/Login/Login'
import SignUp from '../screens/SignUp'
import messaging from '@react-native-firebase/messaging';
import { TouchableOpacity, Text } from 'react-native';
import { deviceWidth, deviceHeight } from '../utils/deviceDimenssions';
const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();


async function registerAppWithFCM() {
    await messaging().registerDeviceForRemoteMessages();
}


const App = props => {

    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        });

        return unsubscribe;
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

export default connect(mapStateToProps)(App);