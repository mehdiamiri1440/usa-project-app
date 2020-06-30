import React from 'react';
import MessagesIndex from '../../screens/Messages';
import Profile from '../../screens/Profile';
import Entypo from 'react-native-vector-icons/dist/Entypo';


const routes = [
    {
        label: 'labels.messages',
        component: MessagesIndex,
        icon: color => <Entypo size={25} name='message' color={color} />,
        name: 'Messages'
    },
    {
        label: 'labels.profile',
        component: Profile,
        icon: color => <Entypo size={25} name='message' color={color} />,
        name: 'Profile'
    },
]
export default routes;