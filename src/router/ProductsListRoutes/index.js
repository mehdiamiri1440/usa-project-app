import React from 'react';
import ProductsListIndex from '../../screens/ProductsList';
import ProductDetails from '../../screens/ProductDetails';
import Octicons from 'react-native-vector-icons/dist/Octicons';


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

]
export default routes;