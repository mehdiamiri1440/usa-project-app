import React, { useState } from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
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
import * as productActions from '../redux/registerProduct/actions';
import * as messageActions from '../redux/messages/actions';
import { navigationRef, isReadyRef } from './rootNavigation';
import linking from './linking';

let currentRoute = '';

const routes = props => {

    const {
        initialRoute,
        userProfile = {},
        newMessage
    } = props;

    const { user_info = {} } = userProfile;
    let { is_seller } = user_info;
    is_seller = is_seller == 0 ? false : true;

    const [shouldShowBottomMenu, setShouldShowBottomMenu] = useState(true);

    const [souldShowSellerButton, setShouldShowSellerButton] = useState(false);

    const Stack = createStackNavigator();
    const Tab = createMaterialBottomTabNavigator();


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

        const shouldShow = props.loggedInUserId && is_seller && !props.userProfileLoading
            && routesNotToShow.indexOf(currentRouteName) == -1;

        const isBottomMenuVisible = props.loggedInUserId && ['Chat', 'Channel'].indexOf(currentRouteName) == -1;

        setShouldShowBottomMenu(isBottomMenuVisible);

        setShouldShowSellerButton(shouldShow);
    };

    const onRouteStateChanged = ({ key, index, routeNames, history, routes, type, stable }) => {
        return handleVisiblityOfSellerButtonAndBottomMenu();
    };

    return (
        <>
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
}

const mapStateToProps = (state) => {

    return {
        userProfile: state.profileReducer.userProfile,
        newMessage: state.messagesReducer.newMessage,
        userProfileLoading: state.profileReducer.userProfileLoading
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        resetRegisterProduct: resetTab => dispatch(productActions.resetRegisterProduct(resetTab)),
        doForceRefresh: forceRefresh => dispatch(messageActions.doForceRefresh(forceRefresh)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(routes)