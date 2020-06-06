import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import HomeIndex from '../../screens/Home/Home';
import DashboardIndex from '../../screens/Home/Dashboard';
import PromoteRegistrationIndex from '../../screens/Home/PromoteRegistration/PromoteRegistration';
import MyProducts from '../../screens/Home/MyProducts';
import EditProfileIndex from '../../screens/Home/EditProfile';
import ProductDetails from '../../screens/ProductDetails';
import SettingsIndex from '../../screens/Settings/Settings';
import Profile from '../../screens/Profile';
import Payment from '../../screens/Payment';
import ChangePasswordIndex from '../../screens/ChangePassword/ChangePassword';
import Octicons from 'react-native-vector-icons/dist/Octicons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import MessagesIndex from '../../screens/Messages';
import LoginIndex from '../../screens/Login/Login';
import SignUpIndex from '../../screens/SignUp';
import TermsIndex from '../../screens/Home/Terms/Terms';
import { deviceWidth } from '../../utils/deviceDimenssions';



const routes = [
    {
        label: 'labels.home',
        component: HomeIndex,
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
        label: 'labels.promoteRegistration',
        component: PromoteRegistrationIndex,
        icon: color => <FontAwesome5 size={25} name='user-circle' color={color} />,
        name: 'PromoteRegistration'
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
    {
        label: 'labels.settings',
        component: SettingsIndex,
        icon: color => <AntDesign size={25} name='setting' color={color} />,
        name: 'Settings'
    },
    {
        label: 'labels.changePassword',
        component: ChangePasswordIndex,
        icon: color => <FontAwesome size={25} name='unlock-alt' color={color} />,
        name: 'ChangePassword'
    },
    {
        label: 'labels.messages',
        component: MessagesIndex,
        icon: color => <Entypo size={25} name='message' color={color} />,
        name: 'Messages'
    },
    {
        label: 'labels.terms',
        component: TermsIndex,
        icon: color => <Octicons size={25} name='law' color={color} />,
        name: 'Terms'
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
    {
        label: 'labels.payment',
        component: Payment,
        icon: color => <MaterialIcons size={25} name='payment' color={color} />,
        name: 'Payment'
    },

]
export default routes;