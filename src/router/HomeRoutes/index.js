import React from 'react';
import HomeIndex from '../../screens/Home/Home';
import SignUpIndex from '../../screens/SignUp/index';
import LoginIndex from '../../screens/Login/Login';

const routes = [
    {
        label: 'labels.home',
        component: HomeIndex,
        icon: color => <AntDesign size={25} name='home' color={color} />,
        name: 'Home'
    },
    {
        label: 'labels.signUp',
        component: SignUpIndex,
        icon: color => <AntDesign size={25} name='home' color={color} />,
        name: 'SignUp'
    },

    {
        label: 'labels.login',
        component: LoginIndex,
        icon: color => <AntDesign size={25} name='home' color={color} />,
        name: 'Login'
    },


]
export default routes;