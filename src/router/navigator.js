import React from 'react';
import { Image, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import { navigationRef, isReadyRef } from './rootNavigation';

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

    const Stack = createStackNavigator();
    const Tab = createBottomTabNavigator();

    const linking = {
        prefixes: ['buskool://Home'],
    };


    const isTabBarVisible = route => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? "";
        return routeName != 'Channel';
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
                        // activeColor="#00C569"
                        // inactiveColor="#FFFFFF"
                        // barStyle={{ backgroundColor: '#313A43' }}
                        tabBarOptions={{
                            style: {
                                backgroundColor: '#313A43',
                            },
                            activeTintColor: "#00C569",
                            inactiveTintColor: '#FFFFFF'
                        }}
                    >



                        <Tab.Screen
                            key={'Home'}
                            listeners={{
                                tabPress: e => {
                                    currentRoute = e.target;
                                }
                            }}
                            options={{
                                tabBarLabel: ({ _, color }) => <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium", color }}>{locales('labels.home')}</Text>,

                                tabBarIcon: ({ focused, color }) => <Octicons size={25} name='home' color={color} />,

                            }}
                            name='Home'
                            component={HomeStack}
                        />

                        {is_seller ? <Tab.Screen
                            key={'Requests'}
                            options={{
                                tabBarLabel: ({ _, color }) => <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium", color }}>{locales('labels.requests')}</Text>,
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
                                    tabBarLabel: ({ _, color }) => <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium", color }}>{locales('labels.suggested')}</Text>,
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
                            options={({ route }) => ({
                                tabBarLabel: ({ _, color }) => <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium", color }}>{locales('labels.registerProduct')}</Text>,
                                tabBarIcon: ({ focused, color }) => <View
                                    style={{
                                        backgroundColor: '#00C569',
                                        borderRadius: 10,
                                        top: isTabBarVisible(route) ? -18 : 100,
                                        width: 45,
                                        height: 45,
                                        position: 'absolute',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <FontAwesome5 size={25} name='plus'
                                        solid
                                        color={'#FFF'}
                                    />
                                </View>,
                            })}
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
                                    tabBarLabel: ({ _, color }) => <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium", color }}>{locales('labels.registerRequest')}</Text>,
                                    tabBarIcon: ({ focused, color }) => <FontAwesome5 size={25} name='plus' solid color={color} />
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
                                    if (is_seller)
                                        return navigationRef.current.navigate('Messages', { screen: 'Messages', params: { tabIndex: 0 } });
                                    return navigationRef.current.navigate('Messages');
                                },
                            }}
                            options={({ route }) => ({
                                tabBarBadge: newMessage > 0 ? newMessage : undefined,
                                tabBarBadgeStyle: { maxWidth: 7, maxHeight: 7, borderRadius: 5 },
                                tabBarLabel: ({ _, color }) => <Text
                                    style={{ fontFamily: "IRANSansWeb(FaNum)_Medium", color }}>
                                    {locales('labels.messages')}
                                </Text>,
                                tabBarIcon: ({ focused, color }) => <Entypo size={25} name='message' color={color} />,
                                tabBarVisible: isTabBarVisible(route)
                            })}
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
                                tabBarLabel: ({ _, color }) => <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium", color }}>{locales('labels.myBuskool')}</Text>,
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
const mapDispatchToProps = (dispatch) => {
    return {
        resetRegisterProduct: resetTab => dispatch(productActions.resetRegisterProduct(resetTab)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(routes)