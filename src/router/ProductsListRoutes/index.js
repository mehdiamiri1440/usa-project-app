import React from 'react';
import ProductsListIndex from '../../screens/ProductsList';
import ProductDetails from '../../screens/ProductDetails';
import Profile from '../../screens/Profile';
import Octicons from 'react-native-vector-icons/dist/Octicons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';


const routes = [
    {
        label: 'labels.productsList',
        component: ProductsListIndex,
        icon: color => <Octicons size={25} name='home' color={color} />,
        name: 'ProductsList'
    },
    {
        label: 'labels.ProductDetails',
        component: ProductDetails,
        icon: color => <Octicons size={25} name='home' color={color} />,
        name: 'ProductDetails'
    },
    {
        label: 'labels.profile',
        component: Profile,
        icon: color => <AntDesign size={25} name='profile' color={color} />,
        name: 'Profile'
    },

]
export default routes;