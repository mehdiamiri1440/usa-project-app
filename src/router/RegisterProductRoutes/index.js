import React from 'react';
import { TouchableOpacity } from 'react-native';
import RegisterProductIndex from '../../screens/RegisterProduct';
import RegisterProductSuccessfully from '../../screens/RegisterProduct/RegisterProductSuccessfully';
import PromoteRegistrationIndex from '../../screens/Home/PromoteRegistration/PromoteRegistration';
import Feather from 'react-native-vector-icons/dist/Feather';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';


const routes = [
    {
        label: 'labels.registerProduct',
        component: RegisterProductIndex,
        icon: color => <Feather size={25} name='plus-square' color={color} />,
        name: 'RegisterProduct'
    },
    {
        label: 'labels.promoteRegistration',
        component: PromoteRegistrationIndex,
        icon: color => <FontAwesome5 size={25} name='user-circle' color={color} />,
        name: 'PromoteRegistration'
    },
    {
        label: 'labels.registerProductSuccessfully',
        component: RegisterProductSuccessfully,
        icon: color => <FontAwesome5 size={25} name='user-circle' color={color} />,
        name: 'RegisterProductSuccessfully'
    },
]
export default routes;