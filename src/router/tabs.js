import React, { useState, useEffect } from 'react';
import { Image, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { deviceWidth } from '../utils';
import * as authActions from '../redux/auth/actions';
import messaging from '@react-native-firebase/messaging';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';


import Octicons from 'react-native-vector-icons/dist/Octicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { navigationRef, isReadyRef } from './rootNavigation';

const Tabs = props => {

    const {
        initialRoute,
        userProfile = {},
        Tab,
        Stack,
        HomeStack,
        Requests,
        SpecialProductsStack,
        RegisterProductStack,
        RegisterRequestStack,
        MessagesStack,
        MyBuskoolStack,
    } = props;

    const [newMessage, setNewMessage] = useState(false);


    useEffect(() => {
        messaging().onMessage(async remoteMessage => {
            setNewMessage(true)
        })
    }, []);

    const { user_info = {} } = userProfile;
    let { is_seller } = user_info;
    is_seller = is_seller == 0 ? false : true;

    return (
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
                    tabBarLabel: locales('labels.home'),
                    tabBarIcon: ({ focused, color }) => <Octicons size={25} name='home' color={color} />,
                }}
                name='Home'
                component={HomeStack}
            />

            {is_seller ? <Tab.Screen
                key={'Requests'}
                options={{
                    tabBarBadge: false,
                    tabBarLabel: locales('labels.requests'),
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
                        tabBarLabel: locales('labels.specialProducts'),
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
                    tabBarLabel: locales('labels.registerProduct'),
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
                        tabBarLabel: locales('labels.registerRequest'),
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
                        setNewMessage(false)
                    },
                }}
                options={{
                    tabBarBadge: newMessage,
                    tabBarLabel: locales('labels.messages'),
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
                    tabBarLabel: locales('labels.myBuskool'),
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
const mapStateToProps = (state) => {

    return {
        userProfile: state.profileReducer.userProfile,
        newMessage: state.messagesReducer.newMessage
    }
};

export default connect(mapStateToProps)(Tabs)