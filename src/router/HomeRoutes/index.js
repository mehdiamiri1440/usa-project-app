import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import HomeIndex from '../../screens/Home/Home';
import DashboardIndex from '../../screens/Home/Dashboard';
import MyProducts from '../../screens/Home/MyProducts';
import EditProfileIndex from '../../screens/Home/EditProfile';
const routes = [
    {
        label: 'labels.home',
        component: HomeIndex,
        title: 'labels.home',
        titleAlign: { textAlign: 'center' },
        icon: color => <AntDesign size={25} name='home' color={color} />,
        name: 'Home'
    },
    {
        label: 'labels.dashboard',
        component: DashboardIndex,
        icon: color => <MaterialCommunityIcons size={25} name='desktop-mac-dashboard' color={color} />,
        name: 'Dashboard'
    },
    {
        label: 'labels.editProfile',
        component: EditProfileIndex,
        icon: color => <FontAwesome5 size={25} name='user-circle' color={color} />,
        name: 'EditProfile'
    },
    {
        label: 'labels.MyProducts',
        component: MyProducts,
        icon: color => <Fontisto size={25} name='list-1' color={color} />,
        name: 'MyProducts'
    },
]
export default routes;