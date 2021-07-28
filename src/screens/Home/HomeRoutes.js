import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';


export const homeRoutes = [
    // { label: 'labels.dashboard', icon: <MaterialCommunityIcons size={25} name='desktop-mac-dashboard' color='white' />, name: 'PromotionIntro' },
    { label: 'labels.yourWallet', icon: <FontAwesome5 size={25} name='wallet' color='#556080' />, name: 'Wallet' },
    { label: 'labels.dashboard', icon: <FontAwesome5 size={25} name='chart-line' color='#556080' />, name: 'Dashboard' },
    { label: 'titles.editProfile', icon: <FontAwesome5 size={25} name='user' solid color='#556080' />, name: 'EditProfile' },
    { label: 'labels.suggestedBuyers', icon: <FontAwesome5 size={25} name='list-ul' color='#556080' />, name: 'SuggestedBuyers' },
    { label: 'labels.myRequests', icon: <Fontisto size={25} name='list-1' color='#556080' />, name: 'MyRequests' },
    { label: 'labels.suggestedSellers', icon: <FontAwesome5 size={25} name='list-ul' color='#556080' />, name: 'SpecialProducts' },
    { label: 'labels.messages', icon: <Entypo size={25} name='message' color='#556080' />, name: 'Messages' },

    // { label: 'titles.referralListTitle', icon: <Entypo size={25} name='share' color='#556080' />, name: 'UserFriends' },
    // { label: 'labels.guid', icon: <Entypo size={25} name='help' color='#556080' />, name: 'Guid' },
    { label: 'labels.myProducts', icon: <Fontisto size={25} name='list-1' color='#556080' />, name: 'MyProducts' },

    { label: 'labels.myProfile', icon: <MaterialCommunityIcons size={25} name='account-arrow-left-outline' color='#556080' />, name: 'Profile' },
    { label: 'labels.authentication', icon: <MaterialIcons size={25} name='verified-user' color='#556080' />, name: 'Authentication' },
    { label: 'labels.promoteRegistration', icon: <FontAwesome size={25} name='arrow-up' color='#fff' />, name: 'PromoteRegistration' },
    { label: 'titles.support', icon: <FontAwesome5 size={25} name='headset' color='#556080' />, name: 'ContactUs' },
    {
        label: 'labels.contactInfoShowingGuid', icon: <FontAwesome5
            size={25} name='phone-square' color='#556080' />, name: 'ContactInfoGuid'
    },
    { label: 'labels.settings', icon: <AntDesign size={25} name='setting' color='#556080' />, name: 'Settings' },
];

export const sellerSpecialRoutes = [
    'PromoteRegistration',
    'Dashboard',
    'SuggestedBuyers',
    'ContactInfoGuid',
    'MyProducts',
    'Wallet'
]

export const buyerSpecialRoutes = [
    'MyRequests',
    'SpecialProducts',
]