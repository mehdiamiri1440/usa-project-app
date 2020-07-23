import React, { useEffect, forwardRef, useRef, useState } from 'react';
import { Image, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { REACT_APP_API_ENDPOINT_RELEASE } from 'react-native-dotenv';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Octicons from 'react-native-vector-icons/dist/Octicons';
import Requests from '../screens/Requests/Requests';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Feather from 'react-native-vector-icons/dist/Feather';

import Home from '../screens/Home/Home';
import Dashboard from '../screens/Home/Dashboard';
import PromoteRegistration from '../screens/Home/PromoteRegistration/PromoteRegistration';
import EditProfile from '../screens/Home/EditProfile';
import Terms from '../screens/Home/Terms/Terms';
import MyProducts from '../screens/Home/MyProducts';
import Settings from '../screens/Settings/Settings';
import ChangePassword from '../screens/ChangePassword/ChangePassword';
import ProductDetails from '../screens/ProductDetails';
import Profile from '../screens/Profile';
import SpecialProducts from '../screens/SpecialProducts';
import RegisterRequest from '../screens/RegisterRequest';
import RegisterRequestSuccessfully from '../screens/RegisterRequest/RegisterRequestSuccessfully';
import Payment from '../screens/Payment';
import RegisterProduct from '../screens/RegisterProduct';
import ExtraProductCapacity from '../screens/Home/PromoteRegistration/ExtraProductCapacity';
import ExtraBuyAdCapacity from '../screens/Home/PromoteRegistration/ExtraBuyAdCapacity';

import { deviceWidth, deviceHeight } from '../utils';
import ProductsList from '../screens/ProductsList';
import RegisterProductSuccessfully from '../screens/RegisterProduct/RegisterProductSuccessfully';
import Messages from '../screens/Messages';


import { navigationRef, isReadyRef } from './rootNavigation';
import * as RootNavigation from './rootNavigation';





const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const router = forwardRef((props, innerRef) => {

    const { changeRoleObject = {}, userProfile } = props;

    const { is_seller = null } = changeRoleObject;

    let [initialRoute, setInitialRoute] = useState();

    const MyBuskoolStack = (props) => {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='HomeIndex'
                    name='HomeIndex'
                    component={Home}
                />
                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='dashboard'
                    name='Dashboard'
                    component={Dashboard}
                />
                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='MyProducts'
                    name='MyProducts'
                    component={MyProducts}
                />
                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='PromoteRegistration'
                    name='PromoteRegistration'
                    component={PromoteRegistration}
                />
                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='EditProfile'
                    name='EditProfile'
                    component={EditProfile}
                />
                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='Settings'
                    name='Settings'
                    component={Settings}
                />
                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='ChangePassword'
                    name='ChangePassword'
                    component={ChangePassword}
                />
                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='Terms'
                    name='Terms'
                    component={Terms}
                />
                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='ProductDetails'
                    name='ProductDetails'
                    component={ProductDetails}
                />
                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='Profile'
                    name='Profile'
                    component={Profile}
                />
                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='Payment'
                    name='Payment'
                    component={Payment}
                />



                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='ExtraBuyAdCapacity'
                    name='ExtraBuyAdCapacity'
                    component={ExtraBuyAdCapacity}
                />
                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='ExtraProductCapacity'
                    name='ExtraProductCapacity'
                    component={ExtraProductCapacity}
                />
            </Stack.Navigator >
        )
    };


    const RegisterProductStack = () => (
        <Stack.Navigator>

            <Stack.Screen
                options={({ navigation, route }) => ({
                    headerShown: false,
                    title: null,
                })}
                key='RegisterProduct'
                name='RegisterProduct'
                component={RegisterProduct}
            />


            <Stack.Screen
                options={({ navigation, route }) => ({
                    headerShown: false,
                    title: null,
                })}
                name={`PromoteRegistration`}
                component={PromoteRegistration}
            />


            <Stack.Screen
                options={({ navigation, route }) => ({
                    headerShown: false,
                    title: null,
                })}
                key='RegisterProductSuccessfully'
                name='RegisterProductSuccessfully'
                component={RegisterProductSuccessfully}
            />

        </Stack.Navigator>
    )

    const RegisterRequestStack = () => (
        <Stack.Navigator>

            <Stack.Screen
                options={({ navigation, route }) => ({
                    headerShown: false,
                    title: null,
                })}
                key='RegisterRequest'
                name='RegisterRequest'
                component={RegisterRequest}
            />


            <Stack.Screen
                options={({ navigation, route }) => ({
                    headerShown: false,
                    title: null,
                })}
                name={`RegisterRequestSuccessfully`}
                component={RegisterRequestSuccessfully}
            />


        </Stack.Navigator>
    )

    const MessagesStack = () => (
        <Stack.Navigator>

            <Stack.Screen
                options={({ navigation, route }) => ({
                    headerShown: false,
                    title: null,
                })}
                key='Message'
                name='Messages'
                component={Messages}
            />


            <Stack.Screen
                options={({ navigation, route }) => ({
                    headerShown: false,
                    title: null,
                })}
                name={`Profile`}
                component={Profile}
            />
        </Stack.Navigator>
    )


    const HomeStack = (props) => {
        return (
            <Stack.Navigator>

                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='ProductsList'
                    name='ProductsList'
                    component={ProductsList}
                />


                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    name={`ProductDetails`}
                    component={ProductDetails}
                />


                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='Payment'
                    name='Payment'
                    component={Payment}
                />

                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='PromoteRegistration'
                    name='PromoteRegistration'
                    component={PromoteRegistration}
                />

                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='EditProfile'
                    name='EditProfile'
                    component={EditProfile}
                />

                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: null,
                    })}
                    key='Profile'
                    name='Profile'
                    component={Profile}
                />

            </Stack.Navigator>
        )
    }
    // const mapStateToProps = (state) => {
    //     return {
    //         productDetailsId: state.productsListReducer.productDetailsId,
    //     }
    // }
    // ProductsListStack = connect(mapStateToProps)(ProductsListStack);

    useEffect(() => {

        if (!is_seller) {
            setInitialRoute('Requests')
        }
        else {
            setInitialRoute('Home')
        }
    }, [initialRoute, is_seller])
    return (

        props.changeRoleLoading ?
            <View style={{
                backgroundColor: 'white', flex: 1, width: deviceWidth, height: deviceHeight,
                position: 'absolute',

                elevation: 5,
                borderColor: 'black',
                backgroundColor: 'white',
            }}>
                <ActivityIndicator size="large"
                    style={{
                        position: 'absolute', left: '44%', top: '40%',

                        elevation: 5,
                        borderColor: 'black',
                        backgroundColor: 'white', width: 50, height: 50, borderRadius: 25
                    }}
                    color="#00C569"

                />
            </View> :
            <Tab.Navigator
                initialRouteName={props.isFromOutSide ? 'Messages' : initialRoute
                }
                shifting={false}
                activeColor="#00C569"
                inactiveColor="#FFFFFF"
                barStyle={{ backgroundColor: '#313A43' }
                }
            >



                <Tab.Screen
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
                        component={SpecialProducts}
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
                        tabBarIcon: ({ focused, color }) => <Feather size={26} name='plus-square' color={color} />,
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
                            tabBarIcon: ({ focused, color }) => <Feather size={26} name='plus-square' color={color} />,
                        }}
                        name={'RegisterRequest'}
                        component={RegisterRequestStack}
                    />}


                <Tab.Screen
                    key='Messages'
                    options={{
                        tabBarBadge: false,
                        // tabBarBadge:  props.totalUnreadMessages > 0 ? true : false,
                        tabBarLabel: locales('labels.messages'),
                        tabBarIcon: ({ focused, color }) => <Entypo size={25} name='message' color={color} />,
                    }}
                    name='Messages'
                    component={MessagesStack}
                />

                <Tab.Screen
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
)




const mapStateToProps = (state) => {
    const {
        changeRoleObject,
        changeRoleLoading
    } = state.authReducer;

    return {
        userProfile: state.profileReducer.userProfile,
        changeRoleObject,
        changeRoleLoading,
        productDetailsId: state.productsListReducer.productDetailsId,

        // totalUnreadMessagesLoading: state.messagesReducer.totalUnreadMessagesLoading,
        // totalUnreadMessages: state.messagesReducer.totalUnreadMessages,
    }
};

export default connect(mapStateToProps)(router)