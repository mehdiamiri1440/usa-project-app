import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';


import Dashboard from '../screens/Home/Dashboard';
import ContactUs from '../screens/Home/ContactUs';
import Authentication from '../screens/Home/Authentication';
import ChangeRole from '../screens/Home/ChangeRole';
import PromoteRegistration from '../screens/Home/PromoteRegistration/PromoteRegistration';
import EditProfile from '../screens/Home/EditProfile';
// import PromotionIntro from '../screens/Home/PromotionIntro';
// import Referral from '../screens/Home/Referral';
// import UserFriends from '../screens/Home/UserFriends';
import Terms from '../screens/Home/Terms/Terms';
import Home from '../screens/Home/Home';
import MyProducts from '../screens/Home/MyProducts';
import Settings from '../screens/Settings/Settings';
import ChangePassword from '../screens/ChangePassword/ChangePassword';
import UpgradeApp from '../screens/UpgradeApp'
import ProductDetails from '../screens/ProductDetails';
import Profile from '../screens/Profile';
import SpecialProducts from '../screens/SpecialProducts';
import RegisterRequest from '../screens/RegisterRequest';
import RegisterRequestSuccessfully from '../screens/RegisterRequest/RegisterRequestSuccessfully';
import Payment from '../screens/Payment';
import RegisterProduct from '../screens/RegisterProduct';
import ExtraProductCapacity from '../screens/Home/PromoteRegistration/ExtraProductCapacity';
import ExtraBuyAdCapacity from '../screens/Home/PromoteRegistration/ExtraBuyAdCapacity';
import ProductsList from '../screens/ProductsList';
import RegisterProductSuccessfully from '../screens/RegisterProduct/RegisterProductSuccessfully';
import Messages from '../screens/Messages';
import MyRequests from '../screens/Home/MyRequests'


const Stack = createStackNavigator();

export const MyBuskoolStack = _ => {
    return (
        <Stack.Navigator
            initialRouteName={global.initialProfileRoute}
        // initialRouteName={'ChangeRole'}
        >
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
            {/* <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='Referral'
          name='Referral'
          component={Referral}
        /> */}
            {/* <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='UserFriends'
          name='UserFriends'
          component={UserFriends}
        /> */}
            {/* <Stack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
            title: null,
          })}
          key='PromotionIntro'
          name='PromotionIntro'
          component={PromotionIntro}
        /> */}
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
                key='ChangeRole'
                name='ChangeRole'
                component={ChangeRole}
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
            <Stack.Screen
                options={({ navigation, route }) => ({
                    headerShown: false,
                    title: null,
                })}
                key='ContactUs'
                name='ContactUs'
                component={ContactUs}
            />
            <Stack.Screen
                options={({ navigation, route }) => ({
                    headerShown: false,
                    title: null,
                })}
                key='Authentication'
                name='Authentication'
                component={Authentication}
            />
            <Stack.Screen
                options={({ navigation, route }) => ({
                    headerShown: false,
                    title: null,
                })}
                key='MyRequests'
                name='MyRequests'
                component={MyRequests}
            />
        </Stack.Navigator >
    )
};


export const RegisterProductStack = _ => (
    <Stack.Navigator
        initialRouteName={'RegisterProduct'}
    >

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
        <Stack.Screen
            options={({ navigation, route }) => ({
                headerShown: false,
                title: null,
            })}
            name={`UpgradeApp`}
            component={UpgradeApp}
        />

    </Stack.Navigator>
)

export const RegisterRequestStack = _ => (
    <Stack.Navigator
        initialRouteName={'RegisterRequest'}
    >

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
        <Stack.Screen
            options={({ navigation, route }) => ({
                headerShown: false,
                title: null,
            })}
            name={`UpgradeApp`}
            component={UpgradeApp}
        />

    </Stack.Navigator>
)

export const MessagesStack = _ => (
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


export const HomeStack = _ => {
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
                key='Profile'
                name='Profile'
                component={Profile}
            />

        </Stack.Navigator>
    )
};

export const SpecialProductsStack = _ => {
    return (
        <Stack.Navigator>

            <Stack.Screen
                options={({ navigation, route }) => ({
                    headerShown: false,
                    title: null,
                })}
                key='SpecialProducts'
                name='SpecialProducts'
                component={SpecialProducts}
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
                key='Profile'
                name='Profile'
                component={Profile}
            />

        </Stack.Navigator>
    )
};
