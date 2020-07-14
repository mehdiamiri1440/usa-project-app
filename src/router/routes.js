import React from 'react';
import { Image } from 'react-native';
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
import Payment from '../screens/Payment';
import RegisterProduct from '../screens/RegisterProduct';

import { deviceWidth } from '../utils';
import ProductsList from '../screens/ProductsList';
import RegisterProductSuccessfully from '../screens/RegisterProduct/RegisterProductSuccessfully';
import Messages from '../screens/Messages';



const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const router = props => {

    const { userProfile } = props;

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


    return (
        <Tab.Navigator
            initialRouteName={props.isFromOutSide ? 'Messages' : 'Home'
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

            <Tab.Screen
                key='Requests'
                options={{
                    tabBarBadge: false,
                    tabBarLabel: locales('labels.requests'),
                    tabBarIcon: ({ focused, color }) => <Entypo size={25} name='list' color={color} />,
                }}
                name='Requests'
                component={Requests}
            />

            <Tab.Screen
                key='RegisterProduct'
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
                name='RegisterProductStack'
                component={RegisterProductStack}
            />

            <Tab.Screen
                key='Messages'
                options={{
                    tabBarBadge: false,
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



const mapStateToProps = (state) => {
    return {
        userProfile: state.profileReducer.userProfile,

        productDetailsId: state.productsListReducer.productDetailsId,
    }
};

export default connect(mapStateToProps)(router)