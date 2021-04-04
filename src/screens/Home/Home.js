import React from 'react';
import { connect } from 'react-redux';
import { Radio, Button } from 'native-base';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import {
    Text, TouchableOpacity, View, ImageBackground,
    StyleSheet, Image, ActivityIndicator, ScrollView
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { useScrollToTop } from '@react-navigation/native';
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"
import BgLinearGradient from 'react-native-linear-gradient';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import Feather from 'react-native-vector-icons/dist/Feather';


import * as productListActions from '../../redux/productsList/actions';
import * as authActions from '../../redux/auth/actions';
import * as profileActions from '../../redux/profile/actions';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import { numberWithCommas } from '../../utils/formatter';
import { versionName } from '../../../version.json';


let role = false


let homeRoutes = [
    // { label: 'labels.dashboard', icon: <MaterialCommunityIcons size={25} name='desktop-mac-dashboard' color='white' />, name: 'PromotionIntro' },
    { label: 'labels.dashboard', icon: <MaterialCommunityIcons size={25} name='desktop-mac-dashboard' color='white' />, name: 'Dashboard' },
    { label: 'titles.editProfile', icon: <FontAwesome5 size={25} name='user-circle' solid color='white' />, name: 'EditProfile' },
    { label: 'labels.suggestedBuyers', icon: <FontAwesome5 size={25} name='list-ul' color='white' />, name: 'SuggestedBuyers' },
    { label: 'labels.myRequests', icon: <Fontisto size={25} name='list-1' color='white' />, name: 'MyRequests' },
    { label: 'labels.suggestedSellers', icon: <FontAwesome5 size={25} name='list-ul' color='white' />, name: 'SpecialProducts' },
    { label: 'labels.messages', icon: <Entypo size={25} name='message' color='white' />, name: 'Messages' },
    // { label: 'titles.referralListTitle', icon: <Entypo size={25} name='share' color='white' />, name: 'UserFriends' },
    // { label: 'labels.guid', icon: <Entypo size={25} name='help' color='white' />, name: 'Guid' },
    { label: 'labels.myProducts', icon: <Fontisto size={25} name='list-1' color='white' />, name: 'MyProducts' },

    { label: 'labels.myProfile', icon: <MaterialCommunityIcons size={25} name='account-arrow-left-outline' color='white' />, name: 'Profile' },
    { label: 'labels.authentication', icon: <MaterialIcons size={25} name='verified-user' color='white' />, name: 'Authentication' },
    { label: 'labels.promoteRegistration', icon: <FontAwesome size={25} name='arrow-up' color='white' />, name: 'PromoteRegistration' },
    { label: 'titles.support', icon: <FontAwesome5 size={25} name='headset' color='white' />, name: 'ContactUs' },
    { label: 'labels.settings', icon: <AntDesign size={25} name='setting' color='white' />, name: 'Settings' },
];
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showchangeRoleModal: false,
            loaded: false
        }
    }

    homeRef = React.createRef();



    handleRouteChange = (name) => {
        if (name == 'SignOut') {
            return this.props.logOut().then(() => { })
        }
        if (name == 'Profile') {
            if (!!this.props.userProfile && !!this.props.userProfile.user_info && !!this.props.userProfile.user_info.user_name)
                return this.props.navigation.navigate('MyBuskool', { screen: name, params: { user_name: this.props.userProfile.user_info.user_name } })
        }
        if (name == 'Messages') {
            return this.props.navigation.navigate("Messages", { screen: 'MessagesIndex', params: { tabIndex: 0 } })
        }
        if (name == 'SuggestedBuyers') {
            return this.props.navigation.navigate('Messages', { screen: 'MessagesIndex', params: { tabIndex: 1, fromMyBuskool: true } });
        }
        if (name == 'SpecialProducts') {
            return this.props.navigation.navigate('SpecialProducts');
        }
        else {
            return this.props.navigation.navigate('MyBuskool', { screen: name })
        }

    };
    componentDidMount() {
        Navigation.events().registerComponentDidAppearListener(({ componentName, componentType }) => {
            if (componentType === 'Component') {
                analytics().logScreenView({
                    screen_name: componentName,
                    screen_class: componentName,
                });
            }
        });
        analytics().logScreenView({
            screen_name: "my_buskool",
            screen_class: "my_buskool",
        });

    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevState.loaded == false && Object.entries(this.props.changeRoleObject.is_seller).length) {
    //         this.setState({ loaded: true, activityType: this.props.changeRoleObject.is_seller ? 'seller' : 'buyer' })
    //     }
    // }

    // componentDidUpdate(prevProps, prevState) {
    //     const { userProfile = {} } = this.props;
    //     const { user_info = {} } = userProfile;
    //     const { is_seller } = user_info;
    //     const { userProfile: PrevProfile = {} } = prevProps;
    //     const { user_info: PrevUser = {} } = PrevProfile;
    //     const { is_seller: prevSeller } = PrevUser;

    //     prevSeller = prevSeller == 0 ? false : true;
    //     is_seller = is_seller == 0 ? false : true;

    //     if (prevSeller != is_seller) {
    //         this.setState({ loaded: true, showchangeRoleModal: true })
    //     }
    // }

    changeRole = _ => {
        this.props.changeRole().then(res => {
            role = res.payload.is_seller
            this.setState({ showchangeRoleModal: true })
        })
    }


    closeModal = () => {
        this.setState({ showchangeRoleModal: false }, () => {
            this.props.fetchUserProfile().then(_ => {
                this.props.updateProductsList(true)
                return this.props.navigation.navigate(!role ? 'Home' : 'Requests')
            });
        });
    }

    render() {

        const { userProfile = {} } = this.props;
        const { user_info = {} } = userProfile;
        let { is_seller = null } = user_info;

        is_seller = is_seller == 0 ? false : true;

        const { showchangeRoleModal } = this.state;

        return (
            <View
                style={{ flex: 1 }}
            >
                {(this.props.changeRoleLoading) ?
                    <View style={{
                        backgroundColor: 'white', flex: 1, width: deviceWidth, height: deviceHeight,
                        position: 'absolute',
                        borderColor: 'black',
                        backgroundColor: 'white',
                    }}>
                        <ActivityIndicator size={70}
                            style={{
                                position: 'absolute', left: '42%', top: '40%',

                                elevation: 0,
                                borderColor: 'black',
                                backgroundColor: 'white', borderRadius: 25
                            }}
                            color="#00C569"

                        />
                    </View> : null}

                < Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={showchangeRoleModal}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={() => this.closeModal()}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('titles.changeRole')}
                            </Paragraph>
                        </Dialog.Actions>
                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center'
                            }}>

                            <Feather name="check" color="#a5dc86" size={70} style={[styles.dialogIcon, {
                                borderColor: '#edf8e6',
                            }]} />

                        </View>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={styles.mainTextDialogModal}>
                                {locales('titles.rollChangedSuccessfully', { fieldName: !role ? locales('labels.buyer') : locales('labels.seller') })}
                            </Text>

                        </Dialog.Actions>
                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <Button
                                style={[styles.modalCloseButton,]}
                                onPress={() => this.closeModal()}>

                                <Text style={styles.closeButtonText}>{locales('titles.gotIt')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal >


                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 45,
                    elevation: 5,
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        style={{ width: 40, justifyContent: 'center', position: 'absolute', right: 0 }}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <AntDesign name='arrowright' size={25} />
                    </TouchableOpacity>

                    <View style={{
                        width: '100%',
                        alignItems: 'center'
                    }}>
                        <Text
                            style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}
                        >
                            {locales('labels.myBuskool')}
                        </Text>
                    </View>
                </View>

                <ScrollView
                    ref={this.props.homeRef}
                    style={{ backgroundColor: 'white', flex: 1, paddingTop: 20 }}>

                    <WalletPreview {...this.props} />

                    {/* 
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Referral')}
                        style={{
                            alignContent: 'center',
                            backgroundColor: 'white',
                            paddingTop: 10,
                            paddingBottom: 30,
                            elevation: 2,
                            paddingHorizontal: 10,
                            marginBottom: 10,
                            marginHorizontal: 0,
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between'
                        }}
                    >
                        <View style={{
                            width: deviceWidth - 150,
                            paddingTop: 13
                        }}>
                            <Text style={{
                                color: '#556080',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 16
                            }}>
                                {locales('titles.referralMainTitle')}
                            </Text>
                            <Text
                                style={{
                                    color: '#777',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 13
                                }}>
                                {locales('titles.referralMainContents')}
                            </Text>
                            <Text
                                style={{
                                    color: '#777',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 13
                                }}>
                                {locales('titles.referralMainSecondContents')}
                            </Text>
                            <Text
                                style={{
                                    color: '#777',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 13
                                }}>
                                {locales('titles.referralMainThirdContents')}
                            </Text>
                        </View>
                        <View
                            style={{ width: 125, }}

                        >
                            <Image
                                source={require('./../../../assets/images/gift-box.gif')}
                                style={{
                                    width: 130,
                                    height: 65,
                                    marginBottom: 5
                                }}
                            />
                            <Button
                                onPress={() => this.props.navigation.navigate('Referral')}

                                style={{
                                    backgroundColor: '#e41c38',
                                    borderRadius: 3,
                                    padding: 0,
                                    margin: 0,
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    alignItems: 'center',
                                    flexDirection: 'row-reverse',
                                    height: 30
                                }}>

                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: '#fff',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                    }}
                                >
                                    {locales('titles.referralButton')}
                                </Text>
                                <Ionicons color="#fff" size={20} name='ios-arrow-back' />

                            </Button>
                        </View>
                    </TouchableOpacity>
 */}

                    {homeRoutes.map((route, index) => {

                        return (

                            (this.props.userProfile && this.props.userProfile.user_info && route.name == 'PromoteRegistration' &&
                                this.props.userProfile.user_info.active_pakage_type == 3) ? null :
                                (!is_seller && (route.name == 'PromoteRegistration' ||
                                    route.name == 'Dashboard' || route.name == 'MyProducts' ||
                                    route.name == 'SuggestedBuyers')) ? null :
                                    route.name == 'MyRequests' && is_seller || route.name == 'SpecialProducts' && is_seller ? null :
                                        route.name === 'PromoteRegistration' ?
                                            <TouchableOpacity
                                                onPress={() => this.handleRouteChange(route.name)}
                                                style={{
                                                    alignContent: 'center',
                                                    backgroundColor: 'white',
                                                    borderRadius: 5,
                                                    marginBottom: index < homeRoutes.length - 1 ? 10 : 30,
                                                    borderColor: route.name === 'PromoteRegistration' ? '#00C569' : '#ccc',
                                                    borderWidth: 1,
                                                    paddingVertical: 10,
                                                    elevation: 0,
                                                    paddingHorizontal: 20,
                                                    marginVertical: 10,
                                                    marginHorizontal: 20,
                                                    flexDirection: 'row-reverse',
                                                }}
                                                key={index}>

                                                <View style={{ width: '80%', flexDirection: 'row-reverse' }}>
                                                    <BgLinearGradient
                                                        start={{ x: 0, y: 1 }}
                                                        end={{ x: 0.8, y: 0.2 }}
                                                        colors={['#00C569', '#21AD93']}
                                                        style={{
                                                            borderRadius: 5,
                                                            padding: 5,
                                                            width: deviceWidth * 0.1,
                                                            height: deviceWidth * 0.1,
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        {route.icon}

                                                    </BgLinearGradient>
                                                    <Text style={{ paddingHorizontal: 10, fontSize: 16, textAlignVertical: 'center', fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#444' }}>
                                                        {locales(route.label)}
                                                    </Text>
                                                </View>
                                                <View style={{ width: '20%', flexDirection: 'row' }}>
                                                    <Text style={{ textAlignVertical: 'center' }}>
                                                        <FontAwesome5 color={'#21AD93'} size={25} name='angle-left' />
                                                    </Text>
                                                    <Text style={{
                                                        fontSize: 14,
                                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                        backgroundColor: '#E41C38',
                                                        color: 'white',
                                                        borderRadius: 20,
                                                        marginLeft: 10,
                                                        textAlign: 'center',
                                                        textAlignVertical: 'center',
                                                        marginTop: 4,
                                                        width: 50,
                                                        height: 30
                                                    }}>
                                                        {locales('labels.special')}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                                onPress={() => this.handleRouteChange(route.name)}
                                                style={{
                                                    alignContent: 'center',
                                                    backgroundColor: 'white',
                                                    borderRadius: 5,
                                                    marginBottom: index < homeRoutes.length - 1 ? 10 : 30,
                                                    borderColor: route.name === 'SuggestedBuyers' || route.name === 'SpecialProducts' ? '#c7a84f' : '#ccc',
                                                    borderWidth: 1,
                                                    paddingVertical: 10,
                                                    elevation: 0,
                                                    paddingHorizontal: 20,
                                                    marginVertical: 10,
                                                    marginHorizontal: 20,
                                                    flexDirection: 'row-reverse',
                                                }}
                                                key={index}>

                                                <View style={{ width: '80%', flexDirection: 'row-reverse' }}>
                                                    {route.name === 'SuggestedBuyers' || route.name === 'SpecialProducts' ?
                                                        <BgLinearGradient
                                                            start={{ x: 0, y: 1 }}
                                                            end={{ x: 2.5, y: 0.2 }}
                                                            colors={['#c7a84f', '#f4eb97', '#c7a84f']}
                                                            style={{
                                                                borderRadius: 5,
                                                                backgroundColor: route.name === 'SuggestedBuyers' || route.name === 'SpecialProducts' ? '#c7a84f' : '#777',
                                                                padding: 5,
                                                                width: deviceWidth * 0.1,
                                                                height: deviceWidth * 0.1,
                                                                alignItems: 'center'
                                                            }}
                                                        >
                                                            {route.icon}

                                                        </BgLinearGradient> :
                                                        <View style={{
                                                            borderRadius: 5,
                                                            backgroundColor: route.name === 'SuggestedBuyers' || route.name === 'SpecialProducts' ? '#c7a84f' : '#777',
                                                            padding: 5,
                                                            width: deviceWidth * 0.1,
                                                            height: deviceWidth * 0.1,
                                                            alignItems: 'center'
                                                        }}>
                                                            {route.icon}
                                                        </View>
                                                    }
                                                    <Text style={{ paddingHorizontal: 10, fontSize: 16, textAlignVertical: 'center', fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#444' }}>
                                                        {locales(route.label)}
                                                    </Text>
                                                </View>
                                                <View style={{ width: '20%', flexDirection: 'row' }}>
                                                    <Text style={{ textAlignVertical: 'center' }}>
                                                        <FontAwesome5 color={route.name === 'SuggestedBuyers' || route.name === 'SpecialProducts' ? '#c7a84f' : '#666666'} size={25} name='angle-left' />
                                                    </Text>
                                                    {route.name == 'Authentication' ?

                                                        <View
                                                            style={{ paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center' }}>
                                                            <FontAwesome5 name='certificate' color='#1DA1F2' size={25} />
                                                            <FontAwesome5 color='white' name='check' size={15} style={{ position: 'absolute' }} />

                                                        </View>
                                                        : route.name == 'SuggestedBuyers' || route.name === 'SpecialProducts' ?



                                                            <Svg
                                                                style={{
                                                                    marginTop: '12%',
                                                                    marginLeft: 15
                                                                }}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="23" height="22.014" viewBox="0 0 23 22.014"
                                                            >
                                                                <Defs>
                                                                    <LinearGradient id="grad" x2="0.864" y2="1">
                                                                        <Stop offset="0" stopColor="#c7a84f" stopOpacity="1" />
                                                                        <Stop offset="0.571" stopColor="#f4eb97" stopOpacity="1" />
                                                                        <Stop offset="1" stopColor="#c7a84f" stopOpacity="1" />

                                                                    </LinearGradient>
                                                                </Defs>
                                                                <Path d="M30.766.753,27.958,6.445l-6.281.916a1.376,1.376,0,0,0-.761,2.347l4.544,4.428-1.075,6.255a1.375,1.375,0,0,0,1.995,1.449L32,18.887l5.619,2.953a1.376,1.376,0,0,0,1.995-1.449l-1.075-6.255,4.544-4.428a1.376,1.376,0,0,0-.761-2.347l-6.281-.916L33.233.753A1.377,1.377,0,0,0,30.766.753Z" transform="translate(-20.5 0.013)" fill="url(#grad)" />
                                                            </Svg>

                                                            :
                                                            null
                                                    }
                                                </View>
                                            </TouchableOpacity>

                        )
                    })}


                    <Text style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        fontSize: 18,
                        textAlign: 'center',
                        color: '#313A43'
                    }}>
                        {/* {activityType == 'seller' ? locales('labels.switchToSeller') : locales('labels.switchToBuyer')} */}
                        {locales('labels.switchRoll', { fieldName: is_seller ? locales('labels.seller') : locales('labels.buyer') })}
                    </Text>


                    <View style={[styles.textInputPadding, {
                        flex: 1,
                        alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around'
                    }]}>
                        <TouchableOpacity
                            onPress={() => is_seller && this.changeRole()}
                            style={{
                                backgroundColor: !is_seller ? '#4DC0BB' : '#fff',
                                borderWidth: 1,
                                borderColor: !is_seller ? '#4DC0BB' : '#556080',
                                padding: 15,
                                borderRadius: 12,
                                width: 165,
                                height: 57,
                                zIndex: 1,
                                alignItems: 'center',
                                flexDirection: 'row-reverse',
                                justifyContent: 'space-around',
                            }}>
                            {!is_seller ?
                                <FontAwesome5
                                    onPress={() => is_seller && this.changeRole()}
                                    color='#fff'
                                    size={20}
                                    name='check'
                                />
                                :
                                <FontAwesome5
                                    onPress={() => is_seller && this.changeRole()}
                                    color='#556080'
                                    size={20}
                                    name='circle'
                                />}
                            <Svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25.404"
                                height="35.49"
                                viewBox="0 0 25.404 35.49"
                            >
                                <Path
                                    fill={is_seller ? "#556080" : "#fff"}
                                    d="M22.9 18.2l-5.528-1.6a1.476 1.476 0 01-.286-.118.483.483 0 00-.232-.153 1.5 1.5 0 01-.562-1.167V13.62a5.333 5.333 0 001.788-3.985v-4.19a5.345 5.345 0 10-10.69 0v4.19a5.332 5.332 0 001.734 3.936v1.587A1.5 1.5 0 018.039 16.6l-5.53 1.6A3.492 3.492 0 000 21.536v6.625a.489.489 0 10.978 0v-6.625a2.51 2.51 0 011.8-2.4l2.053-.593a.481.481 0 00.038.046L7.5 21.217a2 2 0 002.583.216l.923-.657a1.76 1.76 0 00.652 1.047l-2.065 9.966a.763.763 0 00.184.654l2.068 2.747.045.052a1.188 1.188 0 001.679 0l.024-.024 2.092-2.779a.767.767 0 00.179-.66L13.8 21.822a1.76 1.76 0 00.651-1.046l.923.657a2 2 0 002.583-.216l2.66-2.66 2 .58a2.51 2.51 0 011.8 2.4v6.625a.489.489 0 10.978 0v-6.626A3.492 3.492 0 0022.9 18.2zM14.525 1.478l-.044-.034.054.024zm-6.16 8.159V7.049q.27.025.541.025a5.711 5.711 0 004.032-1.662L14.4 3.945a2.222 2.222 0 011.153.676 3.456 3.456 0 001.541.894v4.12a4.367 4.367 0 11-8.735 0zm4.368 5.345a5.311 5.311 0 002.579-.666v.844a2.475 2.475 0 00.6 1.6l-2.762 1.964a1.7 1.7 0 00-.841 0l-2.79-1.986a2.474 2.474 0 00.577-1.58v-.88a5.31 5.31 0 002.634.7zm-3.219 5.654a1.027 1.027 0 01-1.326-.111L5.9 18.234l2.414-.7a2.444 2.444 0 00.414-.163l2.672 1.907c-.011.013-.022.023-.032.036zm5.372 11.244l-2.027 2.692a.209.209 0 01-.259 0l-2.027-2.692 2.006-9.693c.05 0 .1.008.151.008a.972.972 0 00.151-.008zm2.385-11.355a1.027 1.027 0 01-1.325.11l-1.858-1.322c-.01-.013-.022-.023-.032-.036l2.656-1.89a2.444 2.444 0 00.382.147l2.461.712z"
                                    data-name="Path 7"
                                    transform="translate(0 -.1)"
                                ></Path>
                            </Svg>

                            <Text style={{
                                fontSize: 19, color: is_seller ? '#556080' : '#fff',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}>
                                {locales('labels.buyer')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                backgroundColor: is_seller ? '#4DC0BB' : '#fff',
                                borderWidth: 1,
                                borderColor: is_seller ? '#4DC0BB' : '#556080',
                                padding: 15,
                                zIndex: 1,
                                borderRadius: 12,
                                width: 165,
                                height: 57,
                                alignItems: 'center',
                                flexDirection: 'row-reverse',
                                justifyContent: 'space-around',
                            }}
                            onPress={() => !is_seller && this.changeRole()}
                        >
                            {is_seller ?
                                <FontAwesome5
                                    onPress={() => !is_seller && this.changeRole()}
                                    color='#fff'
                                    size={20}
                                    name='check'
                                />
                                :
                                <FontAwesome5
                                    onPress={() => !is_seller && this.changeRole()}
                                    color='#556080'
                                    size={20}
                                    name='circle'
                                />}
                            <Svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24.011"
                                height="29.612"
                                viewBox="0 0 24.011 29.612"
                            >
                                <Path
                                    fill={!is_seller ? "#556080" : "#fff"}
                                    d="M21.639 19.053l-5.225-1.513a1.421 1.421 0 01-1.021-1.358V14.9a.462.462 0 00-.027-.148 5.04 5.04 0 001.716-3.789V8.7h3.737V7.409h-3.737V5.152a5.052 5.052 0 10-10.1 0v2.257H3.17V8.7h3.81v2.257a5.04 5.04 0 001.676 3.754.462.462 0 00-.038.185v1.284A1.421 1.421 0 017.6 17.542l-5.23 1.511A3.3 3.3 0 000 22.208v6.262a.462.462 0 00.924 0v-6.262a2.372 2.372 0 011.7-2.269l1.864-.539v9.615a.693.693 0 001.386 0V19.3a.689.689 0 00-.059-.277l1.774-.514v2.125a2.2 2.2 0 002.233 2.163h4.343a2.2 2.2 0 002.235-2.166V18.5l1.81.524a.692.692 0 00-.022.171v9.827a.693.693 0 001.386 0v-9.6l1.808.523a2.372 2.372 0 011.7 2.268v6.261a.462.462 0 10.924 0v-6.266a3.3 3.3 0 00-2.367-3.155zM7.9 5.152a4.128 4.128 0 118.255 0v2.257H7.9zm0 5.81V8.7h8.255v2.257a4.128 4.128 0 11-8.255 0zm6.262 10.9H9.823a1.276 1.276 0 01-1.309-1.239v-2.508a2.351 2.351 0 001.028-1.934v-.832a5.036 5.036 0 004.927.03v.8a2.351 2.351 0 001.006 1.92v2.527a1.277 1.277 0 01-1.308 1.245z"
                                    data-name="Path 11"
                                    transform="translate(0 -.1)"
                                ></Path>
                            </Svg>
                            <Text style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 19, color: !is_seller ? '#556080' : '#fff',
                            }}
                            >
                                {locales('labels.seller')}
                            </Text>
                        </TouchableOpacity>

                    </View>


                    <View
                        style={{
                            width: deviceWidth,
                            justifyContent: 'center',
                            height: 230,
                            alignItems: 'center'
                        }}
                    >
                        <Image
                            source={require('../../../assets/images/7335.png')}
                            style={{
                                width: '100%',
                                left: 10,
                                bottom: -8
                            }}
                            resizeMode='contain'
                        />
                        <Text
                            style={{
                                color: '#999999',
                                top: 50,
                                left: 50,
                                position: 'absolute',
                                textAlign: 'center',
                                fontSize: 17,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}
                        >
                            {locales('titles.versionName', { fieldName: versionName })}
                        </Text>
                    </View>
                </ScrollView>
            </View >
        )
    }
}

export const WalletPreview = props => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={_ => props.navigation.navigate('Wallet')}
        >
            <ImageBackground
                source={require('../../../assets/images/wallet-bg.jpg')}
                style={styles.image}
                imageStyle={{ borderRadius: 10 }}
            >
                <View
                    style={{
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <FontAwesome5
                        name='wallet'
                        size={15}
                        color='white'
                    />
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            color: 'white',
                            fontSize: 14,
                            marginHorizontal: 5
                        }}
                    >
                        {locales('titles.walletInventory')}
                    </Text>
                </View>
                <View
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 8,
                        padding: 5,
                        marginLeft: 5,
                        flexDirection: 'row-reverse',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 150,
                        height: 40
                    }}
                >
                    <FontAwesome5
                        size={17}
                        color='#333333'
                        name='plus'
                    />
                    <Text
                        style={{
                            color: 'black',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 15,
                            marginHorizontal: 5,
                        }}
                    >
                        {locales('titles.increaseInventory')}
                    </Text>
                </View>

                <Text
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        color: 'white',
                        fontSize: 20,
                        marginHorizontal: 5
                    }}
                >
                    {`${numberWithCommas(100000000)} ${locales('titles.toman')}`}
                </Text>
            </ImageBackground>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    image: {
        resizeMode: "cover",
        width: deviceWidth * 0.91,
        justifyContent: 'space-between',
        height: deviceHeight * 0.2,
        padding: 10,
        alignSelf: 'center',
    },
    backButtonText: {
        color: '#7E7E7E',
        width: '60%',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        borderRadius: 5,
        margin: 10,
        width: deviceWidth * 0.4,
        backgroundColor: 'white',
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },
    loginFailedContainer: {
        backgroundColor: '#D4EDDA',
        padding: 10,
        borderRadius: 5
    },
    loginFailedText: {
        textAlign: 'center',
        width: deviceWidth,
        color: '#155724'
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    scrollContentContainer: {
        paddingTop: 40,
        paddingBottom: 10,
    },
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 13,
        paddingHorizontal: 10,
        fontFamily: 'IRANSansWeb(FaNum)_Medium',
        paddingVertical: 8,
        height: 50,
        color: 'black',
        width: deviceWidth * 0.9,
    },
    iconContainer: {
        left: 10,
        top: 13,
    },
    buttonText: {
        color: 'white',
        width: '100%',
        textAlign: 'center'
    },
    labelInputPadding: {
        paddingVertical: 5,
        paddingHorizontal: 20
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 5,
        backgroundColor: '#B5B5B5',
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#00C569',
        borderRadius: 5,
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    dialogWrapper: {
        borderRadius: 12,
        padding: 0,
        margin: 0,
        overflow: "hidden"
    },
    dialogHeader: {
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        padding: 0,
        margin: 0,
        position: 'relative',
    },
    closeDialogModal: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 15,
        height: '100%',
        backgroundColor: 'transparent',
        elevation: 0
    },
    headerTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        textAlign: 'center',
        fontSize: 17,
        paddingTop: 11,
        color: '#474747'
    },
    mainWrapperTextDialogModal: {
        width: '100%',
        marginBottom: 0
    },
    mainTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#777',
        textAlign: 'center',
        fontSize: 15,
        paddingHorizontal: 15,
        width: '100%'
    },
    modalButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        maxWidth: 145,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'flex-start',
        justifyContent: 'center',
    },
    modalCloseButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        elevation: 0,
        borderRadius: 0,
        backgroundColor: '#ddd'
    },
    closeButtonText: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#555',
    },
    dialogIcon: {

        height: 80,
        width: 80,
        textAlign: 'center',
        borderWidth: 4,
        borderRadius: 80,
        paddingTop: 5,
        marginTop: 20

    },
    greenButton: {
        backgroundColor: '#00C569',
    },
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPassword: {
        marginTop: 10,
        textAlign: 'center',
        color: '#7E7E7E',
        fontSize: 16,
        padding: 10,
    },
    enterText: {
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#00C569',
        fontSize: 20,
        padding: 10,
    },
    linearGradient: {
        height: deviceHeight * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextStyle: {
        color: 'white',
        position: 'absolute',
        textAlign: 'center',
        fontSize: 26,
        bottom: 40
    },
    textInputPadding: {
        padding: 20,
    },
    userText: {
        flexWrap: 'wrap',
        paddingTop: '3%',
        fontSize: 20,
        padding: 20,
        textAlign: 'center',
        color: '#7E7E7E'
    }
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        logOut: () => dispatch(authActions.logOut()),
        changeRole: _ => dispatch(authActions.changeRole()),
        fetchUserProfile: () => dispatch(profileActions.fetchUserProfile()),
        updateProductsList: flag => dispatch(productListActions.updateProductsList(flag))
    }
}
const mapStateToProps = (state, ownProps) => {

    return {
        userProfile: state.profileReducer.userProfile,
        changeRoleLoading: state.authReducer.changeRoleLoading,
        userProfileLoading: state.profileReducer.userProfileLoading,
    }
}



const Wrapper = (props) => {
    const ref = React.useRef(null);

    useScrollToTop(ref);

    return <Home {...props} homeRef={ref} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)