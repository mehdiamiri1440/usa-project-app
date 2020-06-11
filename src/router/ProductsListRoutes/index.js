import React from 'react';
import ProductsListIndex from '../../screens/ProductsList';
import ProductDetails from '../../screens/ProductDetails';
import Payment from '../../screens/Payment';
import Profile from '../../screens/Profile';
import EditProfileIndex from '../../screens/Home/EditProfile';
import Octicons from 'react-native-vector-icons/dist/Octicons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import { domManipulator, dataGenerator } from '../../utils';


const routes = [
    {
        label: 'labels.productsList',
        component: ProductsListIndex,
        key: dataGenerator.generateKey(),
        icon: color => <Octicons size={25} name='home' color={color} />,
        name: 'ProductsList'
    },
    {
        label: 'labels.ProductDetails',
        key: dataGenerator.generateKey(),
        component: ProductDetails,
        icon: color => <Octicons size={25} name='home' color={color} />,
        name: `ProductDetails${dataGenerator.generateKey()}`
    },
    {
        label: 'labels.profile',
        component: Profile,
        key: dataGenerator.generateKey(),
        icon: color => <AntDesign size={25} name='profile' color={color} />,
        name: 'Profile'
    },
    {
        label: 'labels.payment',
        component: Payment,
        key: dataGenerator.generateKey(),
        icon: color => <MaterialIcons size={25} name='payment' color={color} />,
        name: 'Payment'
    },
    {
        label: 'labels.editProfile',
        component: EditProfileIndex,
        key: dataGenerator.generateKey(),
        icon: color => <FontAwesome5 size={25} name='user-circle' color={color} />,
        name: 'EditProfile'
    },
]
export default routes;