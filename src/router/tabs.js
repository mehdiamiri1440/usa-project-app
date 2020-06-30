import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RequestsIndex from '../screens/Requests/Requests';
import ProductsListRoutes from './ProductsListRoutes';
import MessagesRoutes from './MessagesRoutes';
import RegisterProductRoutes from './RegisterProductRoutes';
import HomeRoutes from './HomeRoutes'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Feather from 'react-native-vector-icons/dist/Feather';
import Octicons from 'react-native-vector-icons/dist/Octicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import { connect } from 'react-redux';
import * as productListActions from '../redux/productsList/actions';


const Stack = createStackNavigator();

function HomeStack(props) {
    return (
        <Stack.Navigator>
            {HomeRoutes.map((home, index) => (
                <Stack.Screen
                    options={({ navigation, route }) => ({
                        headerTitleAlign: { ...(home.titleAlign) },
                        headerShown: home.title ? true : false,
                        title: locales(home.title),
                        headerRight: () => home.headerRight ? home.headerRight : null,
                    })}
                    key={index}
                    name={home.name.includes('ProductDetails') ? `ProductDetails${props.productDetailsId}` : home.name}
                    component={home.component}
                />
            ))}
        </Stack.Navigator>
    )
}
const mapperForProps = (state) => {
    return {
        productDetailsId: state.productsListReducer.productDetailsId,
    }
}
HomeStack = connect(mapperForProps)(HomeStack);

function ProductsListStack(props) {
    return <Stack.Navigator>
        {ProductsListRoutes.map((product, index) => (
            <Stack.Screen
                options={({ navigation, route }) => ({
                    headerTitleAlign: { ...(product.titleAlign) },
                    headerShown: product.title ? true : false,
                    title: locales(product.title),
                    headerRight: () => product.headerRight ? product.headerRight : null,
                })}
                key={index}
                name={product.name.includes('ProductDetails') ? `ProductDetails${props.productDetailsId}` : product.name}
                component={product.component}
            />
        ))}
    </Stack.Navigator>
}
const mapStateToProps = (state) => {
    return {
        productDetailsId: state.productsListReducer.productDetailsId,
    }
}
ProductsListStack = connect(mapStateToProps)(ProductsListStack);

const RegisterProductStack = () => (
    <Stack.Navigator>
        {RegisterProductRoutes.map((registerProduct, index) => (
            <Stack.Screen
                options={{
                    headerTitleAlign: { ...(registerProduct.titleAlign) },
                    headerShown: registerProduct.title ? true : false,
                    title: locales(registerProduct.title)
                }}
                key={index}
                name={registerProduct.name}
                component={registerProduct.component}
            />
        ))}
    </Stack.Navigator>
)


const MessagesStack = () => (
    <Stack.Navigator>
        {MessagesRoutes.map((messageRoute, index) => (
            <Stack.Screen
                options={{
                    headerTitleAlign: { ...(messageRoute.titleAlign) },
                    headerShown: messageRoute.title ? true : false,
                    title: locales(messageRoute.title)
                }}
                key={index}
                name={messageRoute.name}
                component={messageRoute.component}
            />
        ))}
    </Stack.Navigator>
)

const routes = [
    {
        label: 'labels.home',
        component: ProductsListStack,
        icon: color => <Octicons size={25} name='home' color={color} />,
        name: 'Home'
    },

    {
        label: 'labels.requests',
        component: RequestsIndex,
        icon: color => <Entypo size={25} name='list' color={color} />,
        name: 'Requests'
    },

    {
        label: 'labels.registerProduct',
        component: RegisterProductStack,
        icon: (color, focused) => <Feather size={26} name='plus-square' color={color}

        />,
        name: 'RegisterProduct'
    },
    {
        label: 'labels.messages',
        header: true,
        title: 'labels.messages',
        component: MessagesStack,
        icon: color => <Entypo size={25} name='message' color={color} />,
        name: 'Messages'
    },

    {
        label: 'labels.myBuskool',
        component: HomeStack,
        icon: color => <AntDesign size={25} name='search1' color={color} />,
        name: 'MyBuskool'
    },

]
export default routes