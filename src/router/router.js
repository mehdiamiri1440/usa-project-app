import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import tabs from './tabs';
import Login from '../screens/Login/Login'
import SignUp from '../screens/SignUp'
import { TouchableOpacity, Text } from 'react-native';
import { deviceWidth, deviceHeight } from '../utils/deviceDimenssions';
const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();


const App = props => {
    return (
        <NavigationContainer>
            {!props.isLogin == false ?
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
        isLogin: state.authReducer.loginError
    }
};

export default connect(mapStateToProps)(App);