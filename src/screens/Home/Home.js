import React from 'react';
import { connect } from 'react-redux';
import * as authActions from '../../redux/auth/actions';
import { Radio, Button } from 'native-base';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { useScrollToTop } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import { color } from 'react-native-reanimated';



let homeRoutes = [
    { label: 'labels.dashboard', icon: <MaterialCommunityIcons size={25} name='desktop-mac-dashboard' color='white' />, name: 'Dashboard' },
    { label: 'titles.editProfile', icon: <FontAwesome5 size={25} name='user-circle' color='white' />, name: 'EditProfile' },
    { label: 'labels.myProducts', icon: <Fontisto size={25} name='list-1' color='white' />, name: 'MyProducts' },
    { label: 'labels.myProfile', icon: <MaterialCommunityIcons size={25} name='account-card-details-outline' color='white' />, name: 'Profile' },
    // { label: 'labels.guid', icon: <Entypo size={25} name='help' color='white' />, name: 'Guid' },
    { label: 'labels.messages', icon: <Entypo size={25} name='message' color='white' />, name: 'Messages' },
    { label: 'labels.promoteRegistration', icon: <FontAwesome size={25} name='arrow-up' color='white' />, name: 'PromoteRegistration' },
    { label: 'labels.settings', icon: <AntDesign size={25} name='setting' color='white' />, name: 'Settings' },
    { label: 'labels.settings', icon: <AntDesign size={25} name='ExtraBuyAdCapacity' color='white' />, name: 'ExtraBuyAdCapacity' },
    { label: 'labels.settings', icon: <AntDesign size={25} name='ExtraProductCapacity' color='white' />, name: 'ExtraProductCapacity' },
];
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activityType: null,
            showChangeRollModal: false
        }
    }

    homeRef = React.createRef();

    componentDidMount() {
        if (this.props.userProfile && this.props.userProfile.user_info) {
            this.setState({ activityType: this.props.userProfile.user_info.is_seller != 0 ? 'seller' : 'buyer' })
        }
    }

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

    changeRoll = rollName => {
        this.setState({ activityType: rollName });
        this.props.changeRoll(rollName).then(_ => {
            this.setState({ showChangeRollModal: true });
        });
    };


    closeModal = () => {

        this.setState({ showChangeRollModal: false });
        this.props.navigation.navigate(this.state.activityType == 'buyer' ? 'Messages' : 'Requests')
    }
    render() {

        const { userProfile = {} } = this.props;
        const { user_info = {} } = userProfile;
        const { is_seller = null } = user_info;

        const { activityType, showChangeRollModal } = this.state;

        return (
            <>


                < Portal >
                    <Dialog
                        visible={showChangeRollModal}
                    >
                        <Dialog.Actions style={{ justifyContent: 'center', borderBottomWidth: 0.7, borderBottomColor: '#777777' }}>
                            <Paragraph style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                paddingTop: 30, textAlign: 'center', fontSize: 24,
                                color: '#00C569'
                            }}>
                                {locales('titles.changeRoll')}</Paragraph>
                        </Dialog.Actions>
                        <Dialog.Actions style={{
                            width: '100%',
                            paddingVertical: 10,
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold', textAlign: 'center',
                                paddingVertical: 10,
                                fontSize: 16
                            }}>
                                {locales('titles.rollChangedSuccessfully', { fieldName: activityType == 'buyer' ? locales('labels.buyer') : locales('labels.seller') })}
                            </Text>

                        </Dialog.Actions>
                        <Dialog.Actions style={{ justifyContent: 'center', width: '100%' }}>
                            <Button
                                style={[styles.loginButton, { width: '90%' }]}
                                onPress={() => this.closeModal()}>
                                <Text style={styles.buttonText}>{locales('titles.gotIt')}
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
                    height: 57,
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
                            {locales('labels.home')}
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
                                (is_seller == 0 && route.name == 'PromoteRegistration') ? null : <TouchableOpacity
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
                        {locales('labels.switchRoll', { fieldName: activityType == 'seller' ? locales('labels.seller') : locales('labels.buyer') })}
                    </Text>


                    <View style={[styles.textInputPadding, {
                        marginBottom: 50,
                        flex: 1,
                        alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'
                    }]}>
                        <TouchableOpacity
                            onPress={() => this.changeRoll('buyer')}
                            style={{
                                backgroundColor: '#fff',
                                elevation: 1,
                                borderWidth: 1, borderColor: activityType == 'buyer' ? '#00C569' : '#BDC4CC',
                                maxHeight: 60,
                                padding: 15,
                                borderRadius: 5,
                                flexDirection: 'row-reverse',
                                justifyContent: 'space-between',
                                minWidth: 140
                            }}>
                            <Radio
                                onPress={() => this.changeRoll('buyer')}
                                color={"#BEBEBE"}
                                selected={activityType == 'buyer'}
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
                                borderWidth: 1, borderColor: activityType == 'seller' ? '#00C569' : '#BDC4CC',
                                maxHeight: 60,
                                padding: 15,
                                borderRadius: 5,
                                flexDirection: 'row-reverse',
                                justifyContent: 'space-between',
                                minWidth: 140

                            }}
                            onPress={() => this.changeRoll('seller')}
                        >
                            <Radio
                                onPress={() => this.changeRoll('seller')}
                                selected={activityType == 'seller'}
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
        fontSize: 16,
        paddingHorizontal: 10,
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        paddingVertical: 8,
        height: 60,
        width: deviceWidth * 0.9,
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    iconContainer: {
        left: 30,
        top: 17,
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
        changeRoll: rollName => dispatch(authActions.changeRoll(rollName))
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        userProfile: state.profileReducer.userProfile,
    }
}



const Wrapper = (props) => {
    const ref = React.useRef(null);

    useScrollToTop(ref);

    return <Home {...props} homeRef={ref} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)