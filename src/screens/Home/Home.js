import React from 'react';
import { connect } from 'react-redux';
import * as authReducer from '../../redux/auth/actions';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { useScrollToTop } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { deviceWidth } from '../../utils/deviceDimenssions';


let homeRoutes = [
    { label: 'labels.dashboard', icon: <MaterialCommunityIcons size={25} name='desktop-mac-dashboard' color='white' />, name: 'Dashboard' },
    // { label: 'labels.editProfile', icon: <FontAwesome5 size={25} name='user-circle' color='white' />, name: 'EditProfile' },
    { label: 'labels.myProducts', icon: <Fontisto size={25} name='list-1' color='white' />, name: 'MyProducts' },
    { label: 'labels.myProfile', icon: <MaterialCommunityIcons size={25} name='account-card-details-outline' color='white' />, name: 'Profile' },
    // { label: 'labels.guid', icon: <Entypo size={25} name='help' color='white' />, name: 'Guid' },
    { label: 'labels.messages', icon: <Entypo size={25} name='message' color='white' />, name: 'Messages' },
    { label: 'labels.promoteRegistration', icon: <FontAwesome size={25} name='arrow-up' color='white' />, name: 'PromoteRegistration' },
    { label: 'labels.settings', icon: <AntDesign size={25} name='setting' color='white' />, name: 'Settings' },
];
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    homeRef = React.createRef();

    handleRouteChange = (name) => {
        if (name == 'SignOut') {
            this.props.logOut().then(() => { })
        }
        if (name == 'Profile') {
            console.log('this', this.props)
            if (this.props.userProfile && this.props.userProfile.user_info && this.props.userProfile.user_info.user_name)
                this.props.navigation.navigate(name, { user_name: this.props.userProfile.user_info.user_name })
        }
        else {
            this.props.navigation.navigate(name)
        }

    };


    render() {
        return (
            <>
                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row-reverse',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 57,
                    shadowOffset: { width: 20, height: 20 },
                    shadowColor: 'black',
                    shadowOpacity: 1.0,
                    elevation: 5,
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        style={{ width: deviceWidth * 0.48, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 10, }}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <AntDesign name='arrowright' size={25} />
                    </TouchableOpacity>
                    <View style={{
                        width: deviceWidth * 0.5,
                        alignItems: 'flex-end'
                    }}>
                        <Text
                            style={{ fontSize: 18 }}
                        >
                            {locales('labels.home')}
                        </Text>
                    </View>
                </View>


                <ScrollView
                    ref={this.props.homeRef}
                    style={{ padding: 20, flex: 1, backgroundColor: '#F2F2F2' }}>
                    {homeRoutes.map((route, index) => {
                        return (
                            <TouchableOpacity
                                onPress={() => this.handleRouteChange(route.name)}
                                style={{
                                    alignContent: 'center',
                                    backgroundColor: 'white',
                                    borderRadius: 5,
                                    marginBottom: index < homeRoutes.length - 1 ? 10 : 30,
                                    borderColor: route.name === 'PromoteRegistration' ? '#00C569' : '',
                                    borderWidth: route.name === 'PromoteRegistration' ? 1 : 0,
                                    padding: 20,
                                    marginVertical: 10,
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
                </ScrollView>
            </>
        )
    }
}


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        logOut: () => dispatch(authReducer.logOut())
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