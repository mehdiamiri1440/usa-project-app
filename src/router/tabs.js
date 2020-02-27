import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RequestsIndex from '../screens/Requests/Requests';
import SearchIndex from '../screens/Search/Search';
import MessagesIndex from '../screens/Messages/Messages';
import RegisterProductIndex from '../screens/RegisterProduct/RegisterProduct';
import HomeRoutes from './HomeRoutes'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';


const Stack = createStackNavigator();

const HomeStack = () => (
    <Stack.Navigator>
        {HomeRoutes.map((home, index) => (
            <Stack.Screen
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
        icon: color => <AntDesign size={25} name='home' color={color} />,
        name: 'Home'
    },


    {
        label: 'labels.messages',
        component: MessagesIndex,
        icon: color => <AntDesign size={25} name='home' color={color} />,
        name: 'Messages'
    },

    {
        label: 'labels.search',
        component: SearchIndex,
        icon: color => <AntDesign size={25} name='home' color={color} />,
        name: 'Search'
    },

    {
        label: 'labels.registerProduct',
        component: RegisterProductIndex,
        icon: color => <AntDesign size={25} name='home' color={color} />,
        name: 'RegisterProduct'
    },

    {
        label: 'labels.requests',
        component: RequestsIndex,
        icon: color => <AntDesign size={25} name='home' color={color} />,
        name: 'Requests'
    }
]
export default routes