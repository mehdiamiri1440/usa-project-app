import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import RequestsIndex from '../screens/Requests/Requests';
import SearchIndex from '../screens/Search/Search';
import MessagesIndex from '../screens/Messages/Messages';
import RegisterProductIndex from '../screens/RegisterProduct/RegisterProduct';
import HomeRoutes from './HomeRoutes'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Feather from 'react-native-vector-icons/dist/Feather';
import Octicons from 'react-native-vector-icons/dist/Octicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';


const Stack = createStackNavigator();

const HomeStack = () => (
    <Stack.Navigator>
        {HomeRoutes.map((home, index) => (
            <Stack.Screen
                options={{
                    headerTitleAlign: { ...(home.titleAlign) },
                    headerShown: home.title ? true : false,
                    title: locales(home.title)
                }}
                key={index}
                name={home.name}
                component={home.component}
            />
        ))}
    </Stack.Navigator>
)

const routes = [
    {
        label: 'labels.home',
        component: HomeStack,
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
        component: RegisterProductIndex,
        icon: (color, focused) => <Feather size={25} name='plus-circle' color={color}

        />,
        name: 'RegisterProduct'
    },

    {
        label: 'labels.search',
        component: SearchIndex,
        icon: color => <AntDesign size={25} name='search1' color={color} />,
        name: 'Search'
    },

    {
        label: 'labels.messages',
        header: true,
        title: 'labels.messages',
        component: MessagesIndex,
        icon: color => <Entypo size={25} name='message' color={color} />,
        name: 'Messages'
    },
]
export default routes