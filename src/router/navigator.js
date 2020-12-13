import React from 'react';
import { Image, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';


import Octicons from 'react-native-vector-icons/dist/Octicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';


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

import { navigationRef, isReadyRef } from './rootNavigation';


const routes = props => {

    const {
        initialRoute,
        userProfile = {},
        newMessage
    } = props;

    const { user_info = {} } = userProfile;
    let { is_seller } = user_info;
    is_seller = is_seller == 0 ? false : true;

    const Stack = createStackNavigator();
    const Tab = createMaterialBottomTabNavigator();

    const linking = {
        prefixes: ['buskool://Home'],
    };

    return (
        <NavigationContainer
            linking={linking}
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
            onReady={() => {
                isReadyRef.current = true;
            }}
        >


            {(!props.loggedInUserId) ?
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
                        initialRouteName={initialRoute}
                        shifting={false}
                        activeColor="#00C569"
                        inactiveColor="#FFFFFF"
                        barStyle={{ backgroundColor: '#313A43' }
                        }
                    >



                        <Tab.Screen
                            key={'Home'}
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
                        />
                            :
                            <Tab.Screen
                                key={'SpecialProducts'}
                                options={{
                                    tabBarBadge: false,
                                    tabBarLabel: <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium" }}>{locales('labels.specialProducts')}</Text>,
                                    tabBarIcon: ({ focused, color }) => <Entypo size={25} name='list' color={color} />,
                                }}
                                name={'SpecialProducts'}
                                component={SpecialProductsStack}
                            />}



                        {is_seller ? <Tab.Screen
                            key={'RegisterProduct'}
                            listeners={{
                                tabPress: e => {
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
                                    if (is_seller)
                                        return navigationRef.current.navigate('Messages', { screen: 'Messages', params: { tabIndex: 0 } });
                                    return navigationRef.current.navigate('Messages');
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

    )
}

const mapStateToProps = (state) => {

    return {
        userProfile: state.profileReducer.userProfile,
        newMessage: state.messagesReducer.newMessage,
    }
};
export default connect(mapStateToProps)(routes)