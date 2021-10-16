import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';


export const homeRoutes = [
    { id: 1, label: 'titles.revenues', icon: <FontAwesome5 size={25} name='dollar-sign' color='#556080' />, name: 'UserFriends' },
    { id: 2, label: 'labels.yourWallet', icon: <FontAwesome5 size={25} name='wallet' color='#556080' />, name: 'Wallet' },
    { id: 3, label: 'labels.dashboard', icon: <FontAwesome5 size={25} name='chart-line' color='#556080' />, name: 'Dashboard' },
    { id: 4, label: 'titles.editProfile', icon: <FontAwesome5 size={25} name='user' solid color='#556080' />, name: 'EditProfile' },
    { id: 5, label: 'labels.suggestedBuyers', icon: <FontAwesome5 size={25} name='list-ul' color='#556080' />, name: 'SuggestedBuyers' },
    { id: 6, label: 'labels.myRequests', icon: <Fontisto size={25} name='list-1' color='#556080' />, name: 'MyRequests' },
    { id: 7, label: 'labels.suggestedSellers', icon: <FontAwesome5 size={25} name='list-ul' color='#556080' />, name: 'SpecialProducts' },
    { id: 8, label: 'labels.messages', icon: <Entypo size={25} name='message' color='#556080' />, name: 'Messages' },

    // { id:16,label: 'titles.referralListTitle', icon: <Entypo size={25} name='share' color='#556080' />, name: 'UserFriends' },
    // { id:17,label: 'labels.guid', icon: <Entypo size={25} name='help' color='#556080' />, name: 'Guid' },
    { id: 9, label: 'labels.myProducts', icon: <Fontisto size={25} name='list-1' color='#556080' />, name: 'MyProducts' },

    { id: 10, label: 'labels.myProfile', icon: <MaterialCommunityIcons size={25} name='account-arrow-left-outline' color='#556080' />, name: 'Profile' },
    { id: 11, label: 'labels.authentication', icon: <MaterialIcons size={25} name='verified-user' color='#556080' />, name: 'Authentication' },
    { id: 12, label: 'labels.promoteRegistration', icon: <FontAwesome size={25} name='arrow-up' color='#fff' />, name: 'PromoteRegistration' },
    { id: 13, label: 'titles.support', icon: <FontAwesome5 size={25} name='headset' color='#556080' />, name: 'ContactUs' },
    { id: 14, label: 'labels.contactInfoShowingGuid', icon: <FontAwesome5 size={25} name='phone-square' color='#556080' />, name: 'ContactInfoGuid' },
    { id: 15, label: 'labels.settings', icon: <AntDesign size={25} name='setting' color='#556080' />, name: 'Settings' },
];

export const sellerSpecialRoutes = [
    'PromoteRegistration',
    'Dashboard',
    'SuggestedBuyers',
    'ContactInfoGuid',
    'MyProducts',
    'Wallet',
    'UserFriends'
]

export const buyerSpecialRoutes = [
    'MyRequests',
    'SpecialProducts',
]