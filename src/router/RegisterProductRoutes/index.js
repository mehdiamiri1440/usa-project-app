import React from 'react';
import { TouchableOpacity } from 'react-native';
import RegisterProductIndex from '../../screens/RegisterProduct';
import Feather from 'react-native-vector-icons/dist/Feather';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';


const routes = [
    {
        label: 'labels.registerProduct',
        component: RegisterProductIndex,
        icon: color => <Feather size={25} name='plus-square' color={color} />,
        name: 'RegisterProduct'
    },
]
export default routes;