import React from 'react';
import { connect } from 'react-redux';
import * as authActions from '../../redux/auth/actions';
import * as profileActions from '../../redux/profile/actions';
import { Radio, Button } from 'native-base';
import RnRestart from 'react-native-restart';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import { Text, TouchableOpacity, View, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { useScrollToTop } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import Feather from 'react-native-vector-icons/dist/Feather';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';

import * as RootNavigation from '../../router/rootNavigation';


let role = false


let homeRoutes = [
    { label: 'labels.dashboard', icon: <MaterialCommunityIcons size={25} name='desktop-mac-dashboard' color='white' />, name: 'Dashboard' },
    { label: 'titles.editProfile', icon: <FontAwesome5 size={25} name='user-circle' solid color='white' />, name: 'EditProfile' },
    { label: 'labels.myProducts', icon: <Fontisto size={25} name='list-1' color='white' />, name: 'MyProducts' },
    { label: 'labels.messages', icon: <Entypo size={25} name='message' color='white' />, name: 'Messages' },
    // { label: 'labels.guid', icon: <Entypo size={25} name='help' color='white' />, name: 'Guid' },
    { label: 'labels.promoteRegistration', icon: <FontAwesome size={25} name='arrow-up' color='white' />, name: 'PromoteRegistration' },
    { label: 'labels.myProfile', icon: <MaterialCommunityIcons size={25} name='account-card-details-outline' color='white' />, name: 'Profile' },
    { label: 'labels.authentication', icon: <MaterialIcons size={25} name='verified-user' color='white' />, name: 'Authentication' },
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
            this.props.logOut().then(() => { })
        }
        if (name == 'Profile') {
            if (!!this.props.userProfile && !!this.props.userProfile.user_info && !!this.props.userProfile.user_info.user_name)
                this.props.navigation.navigate(name, { user_name: this.props.userProfile.user_info.user_name })
        }
        else {
            this.props.navigation.navigate(name)
        }

    };
    componentDidMount() {
        Navigation.events().registerComponentDidAppearListener(({ componentName, componentType }) => {
            if (componentType === 'Component') {
                analytics().setCurrentScreen(componentName, componentName);
            }
        });
        analytics().setCurrentScreen("my_buskool", "my_buskool");

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
                this.props.navigation.navigate(!role ? 'Home' : 'Requests')
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
            <>
                {(this.props.changeRoleLoading) ?
                    <View style={{
                        backgroundColor: 'white', flex: 1, width: deviceWidth, height: deviceHeight,
                        position: 'absolute',

                        elevation: 5,
                        borderColor: 'black',
                        backgroundColor: 'white',
                    }}>
                        <ActivityIndicator size="large"
                            style={{
                                position: 'absolute', left: '44%', top: '40%',

                                elevation: 5,
                                borderColor: 'black',
                                backgroundColor: 'white', width: 50, height: 50, borderRadius: 25
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
                    style={{ flex: 1, backgroundColor: '#F2F2F2', paddingVertical: 20 }}>


                    {homeRoutes.map((route, index) => {

                        return (

                            (this.props.userProfile && this.props.userProfile.user_info && route.name == 'PromoteRegistration' &&
                                this.props.userProfile.user_info.active_pakage_type == 3) ? null :
                                (!is_seller && (route.name == 'PromoteRegistration' || route.name == 'Dashboard' || route.name == 'MyProducts')) ? null :
                                    <TouchableOpacity
                                        onPress={() => this.handleRouteChange(route.name)}
                                        style={{
                                            alignContent: 'center',
                                            backgroundColor: 'white',
                                            borderRadius: 5,
                                            marginBottom: index < homeRoutes.length - 1 ? 10 : 30,
                                            borderColor: route.name === 'PromoteRegistration' ? '#00C569' : '',
                                            borderWidth: route.name === 'PromoteRegistration' ? 1 : 0,
                                            paddingVertical: 10,
                                            elevation: 2,
                                            paddingHorizontal: 20,
                                            marginVertical: 10,
                                            marginHorizontal: 20,
                                            flexDirection: 'row-reverse',
                                        }}
                                        key={index}>
                                        <View style={{ width: '45%', flexDirection: 'row-reverse' }}>
                                            <View style={{
                                                borderRadius: 5,
                                                backgroundColor: route.name === 'PromoteRegistration' ? '#00C569' : '#666666',
                                                padding: 5
                                            }}>
                                                {route.icon}
                                            </View>
                                            <Text style={{ paddingHorizontal: 10, fontSize: 16, textAlignVertical: 'center' }}>
                                                {locales(route.label)}
                                            </Text>
                                        </View>
                                        <View style={{ width: '55%', flexDirection: 'row' }}>
                                            <Text style={{ textAlignVertical: 'center' }}>
                                                <Ionicons color={route.name === 'PromoteRegistration' ? '#00C569' : '#666666'} size={25} name='ios-arrow-back' />
                                            </Text>
                                            {route.name == 'PromoteRegistration' ?
                                                <Text style={{
                                                    fontSize: 18,
                                                    backgroundColor: '#E41C38', color: 'white',
                                                    borderRadius: 20, marginHorizontal: 10, textAlign: 'center',
                                                    textAlignVertical: 'center', width: 60
                                                }}>
                                                    {locales('labels.special')}
                                                </Text>
                                                : route.name == 'Authentication' ?

                                                    <View
                                                        style={{ paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center' }}>
                                                        <FontAwesome5 name='certificate' color='#1DA1F2' size={25} />
                                                        <FontAwesome5 color='white' name='check' size={15} style={{ position: 'absolute' }} />

                                                    </View>
                                                    : null
                                            }
                                        </View>
                                    </TouchableOpacity>

                        )
                    })}


                    <Text style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        textAlign: 'center',
                        color: '#00C569'
                    }}>
                        {/* {activityType == 'seller' ? locales('labels.switchToSeller') : locales('labels.switchToBuyer')} */}
                        {locales('labels.switchRoll', { fieldName: is_seller ? locales('labels.seller') : locales('labels.buyer') })}
                    </Text>


                    <View style={[styles.textInputPadding, {
                        marginBottom: 50,
                        flex: 1,
                        alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around'
                    }]}>
                        <TouchableOpacity
                            onPress={() => is_seller && this.changeRole()}
                            style={{
                                backgroundColor: '#fff',
                                elevation: 1,
                                borderWidth: 1, borderColor: !is_seller ? '#00C569' : '#BDC4CC',
                                maxHeight: 60,
                                padding: 15,
                                borderRadius: 5,
                                flexDirection: 'row-reverse',
                                justifyContent: 'space-between',
                                minWidth: 140
                            }}>
                            <Radio
                                onPress={() => is_seller && this.changeRole()}
                                color={"#BEBEBE"}
                                selected={!is_seller}
                                style={{ marginHorizontal: 5 }}
                                selectedColor={"#00C569"}
                            />
                            <View style={{ flexDirection: 'row-reverse' }}>
                                <Image
                                    source={require('../../../assets/icons/buyer.png')}
                                    style={{
                                        marginHorizontal: 5,
                                        alignSelf: "center",
                                    }}
                                />
                                <Text style={{ marginHorizontal: 5, fontSize: 14 }}>{locales('labels.buyer')}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#fff',
                                elevation: 1,
                                borderWidth: 1, borderColor: user_info.is_seller ? '#00C569' : '#BDC4CC',
                                maxHeight: 60,
                                padding: 15,
                                borderRadius: 5,
                                flexDirection: 'row-reverse',
                                justifyContent: 'space-between',
                                minWidth: 140

                            }}
                            onPress={() => !is_seller && this.changeRole()}
                        >
                            <Radio
                                onPress={() => !is_seller && this.changeRole()}
                                selected={is_seller}
                                color={"#BEBEBE"}
                                style={{ marginHorizontal: 5 }}
                                selectedColor={"#00C569"}
                            />
                            <View style={{ flexDirection: 'row-reverse' }}>
                                <Image
                                    source={require('../../../assets/icons/seller.png')}
                                    style={{
                                        marginHorizontal: 5,
                                        alignSelf: "center",
                                    }}
                                />
                                <Text style={{ marginHorizontal: 5, fontSize: 14 }}>{locales('labels.seller')}</Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                </ScrollView>
            </>
        )
    }
}


const styles = StyleSheet.create({
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