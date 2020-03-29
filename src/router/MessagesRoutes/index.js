import React from 'react';
import MessagesIndex from '../../screens/Messages';
import Entypo from 'react-native-vector-icons/dist/Entypo';


const routes = [
    {
        label: 'labels.messages',
        component: MessagesIndex,
        icon: color => <Entypo size={25} name='message' color={color} />,
        name: 'Messages'
    },
]
export default routes;